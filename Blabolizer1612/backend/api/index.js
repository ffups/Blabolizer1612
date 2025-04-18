const express = require('express');
const serverless = require('serverless-http'); // Add this package

const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const rateLimit = require('express-rate-limit'); // Import the rate-limiting library
const path = require('path');
const saveNameToDatabase = require('../src/db/saveNameToDatabase');
const config = require('../config');
// const checkNameRoute = require('../src/routes/checkName');
const saveCityToDatabase = require("../src/db/saveCityToDatabase");
const getCities = require("../src/apicalls/get");
const deleteCity = require("../src/apicalls/delete");

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;

const app = express();

// Enable CORS for requests from the frontend
app.use(cors({
  origin: 'https://blabolizer1612.vercel.app', // Allow requests from the frontend
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));


// Middleware to parse JSON requests
app.use(bodyParser.json());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

// Apply the rate limiter to all routes
app.use(limiter);

// API route for saving names
app.post('/post', async (req, res) => {
  console.log('POST /apicalls/post route registered');
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const { error } = await saveNameToDatabase(name);

    if (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ error: 'Failed to save name to database' });
    }

    res.status(200).json({ message: 'Name saved successfully' });
  } catch (err) {
    console.error('Unexpected Error in API Route:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


// Other routes
app.post("/db/saveCityToDatabase", saveCityToDatabase);
app.get("/get", getCities);
app.delete("/delete", deleteCity);

// Apply the checkNameRoute middleware
// app.use('/', checkNameRoute);

// Handle unhandled routes
app.use((req, res) => {
  console.log(`Unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

module.exports = serverless(app);

