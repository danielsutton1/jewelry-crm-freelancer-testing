-- CHALLENGE 1: Create the missing update_customer_company function
-- This file should contain your SQL function definition

-- TODO: Create the update_customer_company function here
-- The function should:
-- 1. Accept company_name (VARCHAR) and customer_id (UUID) parameters
-- 2. Validate that the customer exists
-- 3. Validate that company_name is not empty or NULL
-- 4. Update the company field in the customers table
-- 5. Create an audit log entry
-- 6. Return success/error status

-- Example structure (you need to complete this):
/*
CREATE OR REPLACE FUNCTION update_customer_company(
    company_name VARCHAR(255),
    customer_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
    -- Your implementation here
END;
$$;
*/

-- CHALLENGE 1: Create the missing update_customer_company function
-- This file should contain your SQL function definition

-- TODO: Create the update_customer_company function here
-- The function should:
-- 1. Accept company_name (VARCHAR) and customer_id (UUID) parameters
-- 2. Validate that the customer exists
-- 3. Validate that company_name is not empty or NULL
-- 4. Update the company field in the customers table
-- 5. Create an audit log entry
-- 6. Return success/error status

-- Example structure (you need to complete this):
/*
CREATE OR REPLACE FUNCTION update_customer_company(
    company_name VARCHAR(255),
    customer_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
    -- Your implementation here
END;
$$;
*/

-- Create table customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Create table audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update customer company function
CREATE OR REPLACE FUNCTION update_customer_company(
    company_name VARCHAR(255),
    customer_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    customer_record RECORD;
BEGIN
    -- Validate company name
    IF company_name IS NULL OR length(trim(company_name)) = 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Company name is required'
        );
    END IF;

    -- Check if customer exists
    SELECT * INTO customer_record FROM customers WHERE id = customer_id;
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Customer not found'
        );
    END IF;

    -- Update company
    UPDATE customers
    SET company = company_name,
        updated_at = NOW()
    WHERE id = customer_id;

    -- Insert a new entry in audit_logs)
    INSERT INTO audit_logs (action, details)
    VALUES (
        'update_customer_company',
        jsonb_build_object(
            'customer_id', customer_id,
            'old_company', customer_record.company,
            'new_company', company_name,
            'updated_at', NOW()
        )
    );

    -- Success response
    RETURN json_build_object(
        'success', true,
        'message', 'Customer company updated successfully',
        'customer_id', customer_id,
        'company', company_name
    );
END;
$$;


-- Insert customer data
INSERT INTO customers (id, name, email, company) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', 'Acme Corp'),
('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane@example.com', 'Tech Solutions'),
('550e8400-e29b-41d4-a716-446655440003', 'Bob Johnson', 'bob@example.com', 'Design Studio')
ON CONFLICT (id) DO NOTHING;