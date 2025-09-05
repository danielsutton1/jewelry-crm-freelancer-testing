-- CHALLENGE 1: Test cases for the update_customer_company function
-- This file contains comprehensive test cases for all scenarios

-- Setup: Insert sample data from sample-data.sql
INSERT INTO customers (id, name, email, company) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', 'Acme Corp'),
('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane@example.com', 'Tech Solutions'),
('550e8400-e29b-41d4-a716-446655440003', 'Bob Johnson', 'bob@example.com', 'Design Studio')
ON CONFLICT (id) DO NOTHING;

-- Test 1: Valid update scenario (using example from sample-data.sql)
-- Expected: Success response with updated company
SELECT 'Test 1: Valid update' as test_name;
SELECT update_customer_company('New Company Name', '550e8400-e29b-41d4-a716-446655440001');

-- Verify the update was successful
SELECT 'Verification: Check updated company' as verification;
SELECT id, name, company, updated_at FROM customers WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Check audit log was created
SELECT 'Verification: Check audit log' as verification;
SELECT * FROM audit_logs WHERE record_id = '550e8400-e29b-41d4-a716-446655440001' ORDER BY created_at DESC LIMIT 1;

-- Test 2: Invalid customer ID
-- Expected: Error response "Customer not found"
SELECT 'Test 2: Invalid customer ID' as test_name;
SELECT update_customer_company('Company Name', '00000000-0000-0000-0000-000000000000');

-- Test 3: Empty company name
-- Expected: Error response "Company name is required"
SELECT 'Test 3: Empty company name' as test_name;
SELECT update_customer_company('', '550e8400-e29b-41d4-a716-446655440002');

-- Test 4: NULL company name
-- Expected: Error response "Company name is required"
SELECT 'Test 4: NULL company name' as test_name;
SELECT update_customer_company(NULL, '550e8400-e29b-41d4-a716-446655440002');

-- Test 5: NULL customer ID
-- Expected: Error response "Customer ID is required"
SELECT 'Test 5: NULL customer ID' as test_name;
SELECT update_customer_company('Company Name', NULL);

-- Test 6: Company name with only spaces
-- Expected: Error response "Company name is required"
SELECT 'Test 6: Company name with only spaces' as test_name;
SELECT update_customer_company('   ', '550e8400-e29b-41d4-a716-446655440002');

-- Test 7: Company name with leading/trailing spaces (should be trimmed)
-- Expected: Success response with trimmed company name
SELECT 'Test 7: Company name with spaces (should be trimmed)' as test_name;
SELECT update_customer_company('  Trimmed Company  ', '550e8400-e29b-41d4-a716-446655440003');

-- Verify trimming worked
SELECT 'Verification: Check trimmed company' as verification;
SELECT id, name, company FROM customers WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Test 8: Update to same company name
-- Expected: Success response (should still update updated_at timestamp)
SELECT 'Test 8: Update to same company name' as test_name;
SELECT update_customer_company('Trimmed Company', '550e8400-e29b-41d4-a716-446655440003');

-- Test 9: Very long company name
-- Expected: Success response (should handle long names)
SELECT 'Test 9: Very long company name' as test_name;
SELECT update_customer_company('This is a very long company name that might test the limits of our VARCHAR field and see how it handles long strings', '550e8400-e29b-41d4-a716-446655440001');

-- Test 10: Special characters in company name
-- Expected: Success response (should handle special characters)
SELECT 'Test 10: Special characters in company name' as test_name;
SELECT update_customer_company('Company & Associates (Ltd.) - "Excellence"', '550e8400-e29b-41d4-a716-446655440002');

-- Final verification: Check all customers
SELECT 'Final verification: All customers' as verification;
SELECT id, name, company, updated_at FROM customers ORDER BY updated_at DESC;
