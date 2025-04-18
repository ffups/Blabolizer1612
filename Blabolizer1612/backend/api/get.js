const getCities = require("../src/apicalls/get");

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://blabolizer1612.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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