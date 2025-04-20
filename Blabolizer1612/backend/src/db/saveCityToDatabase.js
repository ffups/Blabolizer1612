const supabase = require("../config/supabaseClient");
const sanitizeInput = require('../utils/sanitizeInput');
const rateLimit = require('../utils/rateLimit');
const hashIp = require('../utils/hash');

module.exports = async (req, res) => {
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);

  const allowed = await rateLimit(hashedKey, 15, 60); // 15 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let { username, cities } = req.body;

  if (!username || !Array.isArray(cities) || cities.length === 0) {
    return res.status(400).json({ message: "Username and cities array are required." });
  }

  // Sanitize user input
  username = sanitizeInput(username);
  const sanitizedCities = cities.map(city => sanitizeInput(city));

  try {
    // Insert all cities linked to the username
    const inserts = sanitizedCities.map(city => ({ username, city }));
    const { error } = await supabase
      .from("cities")
      .insert(inserts);

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "Cities saved successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};