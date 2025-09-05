-- CHALLENGE 1: Create the missing update_customer_company function
-- This function updates a customer's company name with proper validation and audit logging

-- First, create the audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the update_customer_company function
CREATE OR REPLACE FUNCTION update_customer_company(
    company_name VARCHAR(255),
    customer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    customer_exists BOOLEAN;
    old_company VARCHAR(255);
    result JSONB;
BEGIN
    -- Validate input parameters
    IF company_name IS NULL OR TRIM(company_name) = '' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Company name is required',
            'error_code', 'INVALID_COMPANY_NAME'
        );
    END IF;
    
    IF customer_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Customer ID is required',
            'error_code', 'INVALID_CUSTOMER_ID'
        );
    END IF;
    
    -- Check if customer exists and get current company
    SELECT EXISTS(SELECT 1 FROM customers WHERE id = customer_id), 
           (SELECT company FROM customers WHERE id = customer_id)
    INTO customer_exists, old_company;
    
    IF NOT customer_exists THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Customer not found',
            'error_code', 'CUSTOMER_NOT_FOUND'
        );
    END IF;
    
    -- Update the customer's company
    UPDATE customers 
    SET company = TRIM(company_name),
        updated_at = NOW()
    WHERE id = customer_id;
    
    -- Create audit log entry
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        created_at
    ) VALUES (
        'customers',
        customer_id,
        'UPDATE_COMPANY',
        jsonb_build_object('company', old_company),
        jsonb_build_object('company', TRIM(company_name)),
        NOW()
    );
    
    -- Return success response
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Company updated successfully',
        'data', jsonb_build_object(
            'customer_id', customer_id,
            'old_company', old_company,
            'new_company', TRIM(company_name),
            'updated_at', NOW()
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Return error response
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Database error: ' || SQLERRM,
            'error_code', 'DATABASE_ERROR'
        );
END;
$$;
