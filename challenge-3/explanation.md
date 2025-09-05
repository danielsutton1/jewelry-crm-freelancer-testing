# Challenge 3 Solution Explanation

## Your Solution
*Please explain your approach to solving this challenge*

Refactored the `OrdersService` to make sure it never returns `undefined`.  
The service now explicitly handles three outcomes:
1. Valid data → return array of orders or a single order
2. Empty result → return `[]` for lists, `null` for single item queries
3. Error → throw a meaningful error with a clear message

This ensures the frontend can safely consume data without crashing.

## Data Handling Strategy
*How did you handle undefined data scenarios?*

1. For `getOrders`, if Supabase returns `undefined`, I replace it with `[]`.  
2. For `getOrderById`, if no row is found, I return `null` instead of `undefined`.  
3. This guarantees that the service response type is always predictable.

## Error Handling Implementation
*How did you implement proper error handling?*

1. Checked the `error` object returned by Supabase.  
2. If `error` exists, I throw a new `Error("Failed to fetch orders")` (or similar).  
3. This prevents the frontend from silently receiving `undefined` and crashing.  
4. Added `console.error` logging for debugging in development.

## TypeScript Implementation
*How did you implement proper TypeScript types?*

1. Defined an `Order` type in `types.ts` based on the database schema.  
2. Used generics for Supabase query results where possible.  
3. Service methods return strongly typed values

## Data Validation Approach
*How did you add data validation?*

1. Even if Supabase returns unexpected data, I normalize it:
  - If `data` is falsy → return `[]` or `null` (never `undefined`).  
2. In tests, I validated that all cases (`success`, `empty`, `error`) behave as expected.  
3. This ensures data integrity for consumers of the service.


## Testing Strategy
*How did you test your solution?*

1. **Jest Unit Tests** (`orders-service.test.ts`)  
   - Mocked Supabase client inline with `jest.mock`.  
   - Covered all cases:
     - Valid data  
     - Empty result  
     - Database error  
     - Invalid ID  

2. **Demo Usage File** (`test-cases.ts`)  
   - Simulated real usage with `console.log` outputs.  
   - Verified that frontend consumers won’t crash.

## Time Taken
*How long did this challenge take you to complete?*

The challenge took me about 2–3 hours to complete, including writing the mock service, tests, and explanation.

## Questions or Clarifications
*Any questions about the requirements or suggestions for improvement?*

