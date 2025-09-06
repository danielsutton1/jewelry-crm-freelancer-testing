-- CHALLENGE 1: Create the missing update_customer_company function
-- This file should contain your SQL function definition

-- First, create audit logs table if it doesn't exist
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
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    customer_exists BOOLEAN;
    old_company VARCHAR(255);
    result JSON;
BEGIN
    -- Validate that company_name is not empty or NULL
    IF company_name IS NULL OR TRIM(company_name) = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Company name is required',
            'error_code', 'INVALID_COMPANY_NAME'
        );
    END IF;

    -- Check if customer exists and get current company
    SELECT EXISTS(SELECT 1 FROM customers WHERE id = customer_id), company
    INTO customer_exists, old_company
    FROM customers 
    WHERE id = customer_id;

    -- Validate that the customer exists
    IF NOT customer_exists THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Customer not found',
            'error_code', 'CUSTOMER_NOT_FOUND'
        );
    END IF;

    -- Update the company field in the customers table
    UPDATE customers 
    SET 
        company = company_name,
        updated_at = NOW()
    WHERE id = customer_id;

    -- Create audit log entry
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values)
    VALUES (
        'customers',
        customer_id,
        'UPDATE_COMPANY',
        json_build_object('company', old_company),
        json_build_object('company', company_name)
    );

    -- Return success response
    RETURN json_build_object(
        'success', true,
        'message', 'Customer company updated successfully',
        'data', json_build_object(
            'customer_id', customer_id,
            'old_company', old_company,
            'new_company', company_name,
            'updated_at', NOW()
        )
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Handle any unexpected database errors
        RETURN json_build_object(
            'success', false,
            'error', 'Database error occurred: ' || SQLERRM,
            'error_code', 'DATABASE_ERROR'
        );
END;
$$;
