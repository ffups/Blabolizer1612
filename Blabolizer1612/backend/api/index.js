const saveNameToDatabase = require('../src/db/saveNameToDatabase');
const saveCityToDatabase = require("../src/db/saveCityToDatabase");
const getCities = require("../src/apicalls/get");
const deleteCity = require("../src/apicalls/delete");
const weatherHandler = require("./weather");
const forecastHandler = require("./forecast");

const setCors = require('../src/utils/cors'); // adjust path as needed

module.exports = (req, res) => {
  setCors(res);
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // /post
  if (req.method === 'POST' && req.url === '/post') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { name } = JSON.parse(body);
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }
        const { error } = await saveNameToDatabase(name);
        if (error) {
          return res.status(500).json({ error: 'Failed to save name to database' });
        }
        res.status(200).json({ message: 'Name saved successfully' });
      } catch (err) {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    });
    return;
  }

  // /db/saveCityToDatabase
  if (req.method === 'POST' && req.url === '/db/saveCityToDatabase') {
    return saveCityToDatabase(req, res);
  }

  // /get
  if (req.method === 'GET' && req.url === '/get') {
    return getCities(req, res);
  }

  // /delete
  if (req.method === 'DELETE' && req.url === '/delete') {
    return deleteCity(req, res);
  }
// /weather
if (req.method === 'GET' && req.url.startsWith('/weather')) {
  return weatherHandler(req, res);
}

// /forecast
if (req.method === 'GET' && req.url.startsWith('/forecast')) {
  return forecastHandler(req, res);
}
  // 404 fallback
  res.setHeader('Access-Control-Allow-Origin', 'https://blabolizer1612.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(404).json({ error: 'Route not found' });
};