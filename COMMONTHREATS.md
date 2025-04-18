SQL injection is blocked by using Supabase’s parameterized queries and input validation. I am blocking SQL injection by using Supabase’s client libraries, which use parameterized queries by default. This prevents direct injection of user input into SQL statements.

XSS is reduced by escaping user content and never rendering raw HTML. In React (and Next.js), any user input is displayed as plain text and not executed as code. I avoid using dangerouslySetInnerHTML or setting innerHTML directly, which are the main ways XSS can occur in React apps. 

I am validating and sanitizing all user input.

I am enabling rate limiting and throttling to prevent brute-force and denial-of-service attacks.
