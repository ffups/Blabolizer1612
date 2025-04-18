const deleteCity = require("../src/apicalls/delete");

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://blabolizer1612.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return deleteCity(req, res);
};