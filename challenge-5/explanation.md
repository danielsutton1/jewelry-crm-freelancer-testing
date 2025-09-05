# Challenge 5 Solution Explanation

## Your Solution
*Please explain your approach to solving this challenge*

- Refactored the OrderAnalyticsService to make it safe against undefined and incomplete data.
- The main changes include:
    1. Defensive checks for orders and order.items before processing.
    2. Returning default values instead of crashing when data is missing.
    3. Centralized error handling with try/catch.
    4. Added strong TypeScript types for orders, items, totals, and statistics.

## Data Transformation Strategy
*How did you handle undefined data scenarios?*

1. If orders is undefined or null, the service returns default totals/statistics instead of crashing.
2. If order.items is missing, it’s treated as an empty array ([]).
3. Calculations are always based on validated safe values.

## Error Handling Implementation
*How did you implement proper error handling?*

1. Wrapped transformation logic inside try/catch.
2. When an unexpected error occurs, the service returns zero values and logs the error.
3. For statistics, an empty object ({}) is returned for statusCounts in case of errors.

## Data Validation Approach
*How did you add data validation?*

1. Validated that orders is an array before processing.
2. Validated that each order has an items array; otherwise, it defaults to an empty array.
3. Added guards against division by zero when calculating averages.

## TypeScript Implementation
*How did you implement proper TypeScript types?*

1. Created reusable types in types.ts:
        Order, OrderItem
        OrderTotals
        OrderStatistics
2. Used explicit return types for all service methods (Promise<OrderTotals>, Promise<OrderStatistics>).
3. Applied type narrowing when handling possibly undefined orders and items.

## Testing Strategy
*How did you test your solution?*

1. Wrote manual demo test runner (test-cases.test.ts) with console logs.
2. Added Jest test file (test-cases.test.ts) with proper test() blocks and assertions.
3. Covered scenarios:
        Valid data → correct calculations
        Empty array → zero values
        Undefined data → safe fallback
        Missing items → safe fallback

## Time Taken
*How long did this challenge take you to complete?*
It took me around 2.5 hours:
    1 hour to fix and refactor the service
    1 hour to define TypeScript types and validations
    30 minutes to write demo + Jest test cases

## Questions or Clarifications
*Any questions about the requirements or suggestions for improvement?*
