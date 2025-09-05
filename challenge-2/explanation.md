# Challenge 2 Solution Explanation

## Your Solution
*Please explain your approach to solving this challenge*
1. SQL: fix-relationships.sql

- Created Tables users and communications
- Added Foreign keys with ON DELETE SET NULL
- Created Indexes on sender_id, recipient_id, created_at
- This fixes the relationship issue.

2. API Route: api-route.ts

- Fetches communications with related sender and recipient
- Maps arrays from Supabase to single objects
- Handles optional query params (like limit) with validation
- Proper error handling: 200, 400, 500 status code
- TypeScript types applied correctly

3. Types: types.ts

- UserSummary and Communication interfaces defined
- CommunicationResponse type exported for API response
- sender and recipient can be null to match DB SET NULL behavior

4. Test Cases: test-cases.ts

- Jest tests cover:
    - Valid request
    - Database error (500)
    - Empty result (200 with empty array)
    - Invalid query parameter (400)
    - Unexpected data format (empty array fallback)
- Supabase client is fully mocked → no real DB needed

## Database Relationship Fix
*How did you fix the foreign key relationships?*

1. Created the `users` and `communications` tables with proper primary keys (`id` as UUID).
2. Added foreign keys in `communications` for `sender_id` and `recipient_id`, referencing `users(id)`:
    - This ensures that each communication has a valid sender and recipient.
    - The `ON DELETE SET NULL` rule ensures that if a user is deleted, related communications will remain, but the deleted user will show as `null`.
3. Created indexes on `sender_id`, `recipient_id`, and `created_at` to improve query performance:

This fix allows the API to correctly fetch related user data for each communication while maintaining data integrity and query efficiency.

## API Query Fix
*How did you update the API query to work with the new relationships?*

1. Selected specific fields instead of `*`, including related user data using Supabase’s foreign key syntax:

        sender:sender_id (name),
        recipient:recipient_id (name)

    - This fetches the `name` of the sender and recipient for each communication.
    - Supabase returns these related records as arrays, even for one-to-one relationships.

2. Mapped arrays to single objects in the API response to match the `Communication` TypeScript type:

    sender: item.sender?.[0] || { name: 'Unknown' },
    recipient: item.recipient?.[0] || { name: 'Unknown' },

    - Ensures that every communication has a `sender` and `recipient` object, even if the DB returns an empty array.

3. Applied ordering and optional query parameters:

    .order('created_at', { ascending: false })
    .limit(limit) // if a valid limit is provided

    - Orders communications by creation date (latest first).
    - Supports optional query parameters, e.g., limiting results.

This approach ensures the API correctly returns communications with related user names while maintaining proper TypeScript types and handling edge cases like missing users.


## Error Handling Strategy
*How did you handle different error scenarios?*

1. I implemented robust error handling in the API route using try/catch:

2. Database errors – Any errors returned by Supabase are caught and logged, and the API responds with 500 Internal Server Error and a descriptive message.

3. Invalid query parameters – If a query parameter (like limit) is invalid, the API responds with 400 Bad Request and a validation error message.

4. Empty results or unexpected data – If no communications exist or the database returns unexpected data, the API returns 200 OK with an empty array, preventing runtime crashes.

5. Default values – For missing sender or recipient, the API uses { name: 'Unknown' } to ensure the response always matches the expected shape.

## TypeScript Implementation
*How did you implement proper TypeScript types?*

1. I defined clear TypeScript types to enforce type safety and avoid runtime errors.
        export interface UserSummary {
        id: string
        name: string
        email: string
        }

        export interface Communication {
        id: string
        message: string
        created_at: string
        sender: UserSummary | null
        recipient: UserSummary | null
        }

        export type CommunicationResponse = Communication[]

2. Types ensure that the API response is consistent.
3. The sender and recipient can be null to match the database behavior (ON DELETE SET NULL).
4. Mapping the Supabase array responses to a single object ensures compatibility with these types.

## Testing Approach
*How did you test your solution?*

I used Jest to create a comprehensive test suite with a mocked Supabase client:
    1. Valid request – Test that the API returns communications with sender and recipient names.
    2. Database error – Simulate a DB error and ensure the API returns 500.
    3. Empty result – Test the API returns 200 with an empty array when no communications exist.
    4. Invalid query parameters – Test that invalid limit values return 400 with a validation error.
    5. Edge cases / unexpected data – Test the API correctly maps missing sender or recipient arrays to default values.

All tests are isolated and mocked, so no real database connection is required.
This ensures fast and reliable testing while covering all major scenarios.

## Time Taken
*How long did this challenge take you to complete?*

The challenge took me about 2–3 hours to complete.

## Questions or Clarifications
*Any questions about the requirements or suggestions for improvement?*
