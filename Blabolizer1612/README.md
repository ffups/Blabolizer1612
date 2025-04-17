# Random Country Generator

This application allows users to generate a random country from a user-generated list. The list of countries is stored in a database, ensuring persistence across application restarts.

## Features

- **Add Country**: Users can add countries to the list.
- **Get Random Country**: Users can request a random country from the list.
- **Get All Countries**: Users can retrieve the complete list of countries stored in the database.

## Technologies Used

- **Node.js**: The runtime environment for executing JavaScript on the server.
- **Express**: A web framework for building the API.
- **TypeScript**: A superset of JavaScript that adds static types.
- **MongoDB**: The database used to store the list of countries.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd random-country-generator
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Set up the database connection in `src/database/index.ts` with your MongoDB URI.
5. Start the application:
   ```
   npm start
   ```

## Usage

- To add a country, send a POST request to `/countries` with the country name in the request body.
- To get a random country, send a GET request to `/countries/random`.
- To retrieve all countries, send a GET request to `/countries`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.