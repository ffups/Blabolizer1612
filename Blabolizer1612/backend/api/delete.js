const deleteCity = require("../src/apicalls/delete");

const setCors = require('../src/utils/cors'); // adjust path as needed

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return deleteCity(req, res);
};