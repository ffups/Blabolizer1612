# Blabolizer1612
start server first

For pass:

1. The API provides endpoints with at least 3 different HTTP verbs. Those HTTP verbs are used correctly

POST: Used for creating resources, e.g., /api/post to add a name and /db/saveCityToDatabase to add a city.
GET: Used for retrieving resources, e.g., /api/get to fetch cities for a username.
DELETE: Used for deleting resources, e.g., /api/delete to remove a city.
Each verb is mapped to its appropriate action (create, read, delete), fulfilling the requirement.
You can see these in your API handler files:

backend/api/post.js
backend/api/get.js
backend/api/delete.js


2. The API responds with at least 4 different HTTP status codes depending on the endpoint, input and response. The status codes are appropriate for the data being returned

200 OK: For successful operations (e.g., successful GET or DELETE).
201 Created: When a new resource is created (e.g., after a successful POST to create a user or city).
400 Bad Request: For invalid input (e.g., missing required fields like name or city).
404 Not Found: When a resource does not exist (e.g., trying to delete a city that isn't found).
405 Method Not Allowed: When an unsupported HTTP method is used.
500 Internal Server Error: For unexpected server/database errors.
You can see these status codes used in files like:

backend/api/post.js
backend/api/get.js
backend/api/delete.js
backend/src/apicalls/delete.js


3. The API stores it's data in a database. Restarting the API has no effect on the API itself, making it stateless.

The API uses Supabase as its database backend (see backend/src/config/supabaseClient.js), which ensures that all data is stored persistently outside of your server process. Restarting the API server does not affect the stored data, and the API does not maintain any in-memory or session state, making it stateless.


4. A file in the repository explains with at least 4 sentences, maximum 50, how you ensured the application was accessible and SEO-friendly (with a focus on accessibility)

5. A file in the repository explains with at least 2 sentences, maximum 50, what type of tracking you have implemented, why, and how it takes into consideration your users privacy.

6. A file in the repository explains with at least 5 sentences, maximum 50, at least 2 common threats and vulnerabilities that your project might be vulnerable too. Going into detail over one of them, explaining how you have mitigated yourself against it.


1. API with at least 3 HTTP Verbs
Current Status:
Your project has a POST endpoint (/api/post) in server.js and checkName.js.
There is no evidence of other HTTP verbs (GET, PUT, DELETE, etc.) being implemented.
What's Left:
Add at least two more endpoints using different HTTP verbs. For example:
A GET endpoint to fetch all names.
A DELETE endpoint to remove a name.

2. API Responds with at least 4 HTTP Status Codes
Current Status:
Your project uses the following status codes:
200 for successful operations.
400 for bad requests (e.g., missing name).
500 for internal server errors.
What's Left:
Add at least one more status code. For example:
404 for not found (e.g., when trying to fetch a name that doesn't exist).
201 for successful resource creation (already partially implemented in checkName.js).

3. Stateless API with Database
Current Status:
Your project uses Supabase for database operations, which ensures data persistence across server restarts.
The API appears to be stateless (no session or in-memory state).
What's Left:
Nothing. This requirement seems to be fulfilled.

4. Accessibility and SEO Explanation
Current Status:
There is no file or explanation in the repository about how accessibility and SEO were ensured.
What's Left:
Create a file (e.g., ACCESSIBILITY.md) and explain:
How the frontend ensures accessibility (e.g., semantic HTML, ARIA roles, keyboard navigation).
How SEO is considered (e.g., meta tags, descriptive titles, alt attributes for images).

5. Tracking and Privacy Explanation
Current Status:
There is no file or explanation in the repository about tracking and privacy.
What's Left:
Create a file (e.g., TRACKING.md) and explain:
What type of tracking is implemented (e.g., analytics, error logging).
How user privacy is respected (e.g., anonymized data, opt-out options).

6. Threats and Vulnerabilities Explanation
Current Status:
There is no file or explanation in the repository about threats and vulnerabilities.
What's Left:
Create a file (e.g., SECURITY.md) and explain:
At least two common threats (e.g., SQL injection, XSS).
Detail one threat and explain how you mitigated it (e.g., parameterized queries to prevent SQL injection).
