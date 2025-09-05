# Challenge 1 Solution Explanation

## Your Solution
*Please explain your approach to solving this challenge*

## Key Decisions
*What were the key decisions you made and why?*

## Error Handling Strategy
*How did you handle different error scenarios?*

## Testing Approach
*How did you test your solution?*

## Time Taken
*How long did this challenge take you to complete?*

## Questions or Clarifications
*Any questions about the requirements or suggestions for improvement?*
# Challenge 1 Solution Explanation

## Your Solution
*Please explain your approach to solving this challenge*

## Approach to Solving Challenge 1

1. **Understand the Problem**

   * The API was calling a missing function `update_customer_company()`.
   * The requirement was to update the `company` field of a customer safely and keep a record of the change audit log.

2. **Plan the Solution**

   * Create a PostgreSQL function to implement the missing logic.
   * Ensure it accepts two parameters: `company_name` (VARCHAR) and `customer_id` (UUID).
   * Validate both parameters:

     * Check if company name is not empty or null.
     * Check if customer exists in the `customers` table.

3. **Update and Logging**

   * If valid, update the `company` field and set `updated_at = NOW()`.
   * Insert a record into an `audit_logs` table with details of the change (`old_company`, `new_company`, `customer_id`, and `timestamp`).

4. **Return JSON Response**

   * Return structured JSON like:

     ```json
     {
       "success": true,
       "message": "Customer company updated successfully",
       "customer_id": "UUID",
       "company": "New Company Name"
     }
     ```

5. **Testing**

   * Inserted sample data into `customers`.
   * Ran all the test cases that you provided.
   * Verified both `customers` and `audit_logs` tables for expected results.

## Key Decisions
*What were the key decisions you made and why?*

Here’s how I’d explain the **key decisions** and the reasoning 👇

---

## 🔑 Key Decisions & Why I Made Them

1. **Use JSON as Return Type**

   * Instead of returning just `VOID` or a single value or `Boolean`, I chose return `JSON`.
   * Reason: The API layer can directly consume structured responses with `success`, `error`, and `message` keys without extra parsing.

2. **Allow Multiple Updates for the Same Customer**

   * Reason: In real systems, company names can change multiple times, and every change should be recorded in the audit log for traceability.

3. **Centralized audit_logs Table**

   * Instead of creating multiple fields, I used a single `JSONB` column for store detail.
   * Reason: Easier to maintain, extend, and query across different actions while keeping logs consistent.

4. **Validate Early, Fail Fast**

   * Checked for invalid `company_name` and missing customer `before` attempting any update.
   * Reason: Prevents unnecessary database writes and ensures clear, user-friendly error messages.


## Error Handling Strategy
*How did you handle different error scenarios?*

##  Error Handling Strategy

1. **Invalid or Empty Company Name**

   * Checked if `company_name` is `NULL` or only whitespace using `length(trim(company_name))`.
   * If invalid → return JSON:

    ```json
     { "success": false, "error": "Company name is required" }
    ```

2. **Customer Not Found**

   * Queried the `customers` table with the given `customer_id`.
   * If no record found → return JSON:

    ```json
     { "success": false, "error": "Customer not found" }
    ```

3. **Successful Update**

   * If validations passed, updated the `company` field and inserted an audit log.
   * Returned a success JSON with updated values.

4. **Database or Internal Errors**

   * Relied on PostgreSQL’s error handling for unexpected issues (e.g., constraint violations, connectivity).
   * Since the function always returns JSON, failures are caught in the API layer and shown to the client.


## Testing Approach
*How did you test your solution?*


## 🧪 Testing Approach  

1. **Setup Test Data**  
   - Inserted sample customer records into the `customers` table.  

2. **Positive Test Case – Valid Update**  
   - Ran:  
    ```sql
     SELECT update_customer_company('New Company', 'valid-customer-id');
    ```  
   - Verified:  
     - `customers.company` updated to `New Company`.  
     - `audit_logs` inserted with `old_company`, `new_company`, and timestamp.  

3. **Negative Test Case – Invalid Customer ID**  
   - Used a random UUID not present in `customers`.  
   - Expected JSON: `{ "success": false, "error": "Customer not found" }`.  
   - Verified no changes were made to the table and no audit log created.  

4. **Negative Test Case – Empty Company Name**  
   - Ran with empty string `''` or `NULL`.  
   - Expected JSON: `{ "success": false, "error": "Company name is required" }`.  
   - Verified no changes and no audit log.  

5. **Repeated Updates**  
   - Updated the same customer multiple times with different names.  
   - Verified all updates applied and multiple log entries created, each with correct `old_company` and `new_company`.  

6. **Edge Case – Whitespace Only Company Name**  
   - Tested with `'   '` (spaces).  
   - Treated same as empty → returned error.  

## Time Taken
*How long did this challenge take you to complete?*

The challenge took me about 2–3 hours to complete.

## Questions or Clarifications
*Any questions about the requirements or suggestions for improvement?*
