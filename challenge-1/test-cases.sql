-- CHALLENGE 1: Test cases for the update_customer_company function
-- This file should contain your test cases

-- Setup: Ensure we have sample data for testing
-- (This assumes the sample-data.sql has been run)

-- Test 1: Valid update scenario - should succeed
-- Expected: success = true, company updated
SELECT 'Test 1: Valid update' as test_name, 
       update_customer_company('Updated Tech Corp', '550e8400-e29b-41d4-a716-446655440001') as result;

-- Test 2: Invalid customer ID - should fail with customer not found
-- Expected: success = false, error = "Customer not found"
SELECT 'Test 2: Invalid customer ID' as test_name,
       update_customer_company('Some Company', '00000000-0000-0000-0000-000000000000') as result;

-- Test 3: Empty company name - should fail with company name required
-- Expected: success = false, error = "Company name is required"
SELECT 'Test 3: Empty company name' as test_name,
       update_customer_company('', '550e8400-e29b-41d4-a716-446655440002') as result;

-- Test 4: NULL company name - should fail with company name required
-- Expected: success = false, error = "Company name is required"
SELECT 'Test 4: NULL company name' as test_name,
       update_customer_company(NULL, '550e8400-e29b-41d4-a716-446655440002') as result;

-- Test 5: Company name with only spaces - should fail
-- Expected: success = false, error = "Company name is required"
SELECT 'Test 5: Whitespace only company name' as test_name,
       update_customer_company('   ', '550e8400-e29b-41d4-a716-446655440002') as result;

-- Test 6: Another valid update to test multiple updates
-- Expected: success = true, company updated
SELECT 'Test 6: Second valid update' as test_name,
       update_customer_company('Creative Agency LLC', '550e8400-e29b-41d4-a716-446655440003') as result;

-- Test 7: Update with a very long company name (edge case)
-- Expected: success = true (assuming it fits in VARCHAR(255))
SELECT 'Test 7: Long company name' as test_name,
       update_customer_company('This is a very long company name that tests the VARCHAR limit to ensure our function handles longer strings appropriately and does not cause any database errors when processing', '550e8400-e29b-41d4-a716-446655440001') as result;

-- Test 8: Malformed UUID - should fail with customer not found
-- Expected: success = false, error = "Customer not found" or database error
SELECT 'Test 8: Malformed UUID' as test_name,
       update_customer_company('Test Company', 'not-a-valid-uuid') as result;

-- Verification queries to check the actual database state after updates
SELECT 'Final verification - Customer data:' as info;
SELECT id, name, email, company, updated_at 
FROM customers 
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440003'
);

-- Check audit logs were created
SELECT 'Audit logs created:' as info;
SELECT table_name, record_id, action, old_values, new_values, created_at
FROM audit_logs 
WHERE table_name = 'customers' 
ORDER BY created_at DESC;
