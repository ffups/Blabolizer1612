const getCities = require("../src/apicalls/get");
const setCors = require('../src/utils/cors'); // adjust path as needed
const sanitizeInput = require('../src/utils/sanitizeInput'); // Import sanitizer

module.exports = (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  let username = url.searchParams.get('username');
  username = sanitizeInput(username); // Sanitize input

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Pass sanitized username to your getCities logic
  return getCities(req, res, username);
};