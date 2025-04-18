const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const path = require('path');
const saveNameToDatabase = require('./src/db/saveNameToDatabase');
const config = require('./config');
const checkNameRoute = require('./src/routes/checkName');
const saveCityToDatabase = require("./src/db/saveCityToDatabase");
const getCities = require("./src/api/get");

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;

const app = express();
const PORT = 4000;

// Enable CORS for requests from the frontend
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from the frontend
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.use('/', checkNameRoute);

// API route for saving names
app.post('/api/post', async (req, res) => {
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

app.post("/db/saveCityToDatabase", saveCityToDatabase);
app.get("/api/get", getCities);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
