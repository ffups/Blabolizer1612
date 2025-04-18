const getCities = require("../src/apicalls/get");
const setCors = require('../src/utils/cors'); // adjust path as needed

module.exports = (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const username = url.searchParams.get('username');

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Pass username to your getCities logic
  return getCities(req, res, username);
};