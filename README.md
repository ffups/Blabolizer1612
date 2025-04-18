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


