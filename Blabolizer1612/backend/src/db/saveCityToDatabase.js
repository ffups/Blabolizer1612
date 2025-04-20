const supabase = require("../config/supabaseClient");
const sanitizeInput = require('../utils/sanitizeInput');
const rateLimit = require('../utils/rateLimit');
const hashIp = require('../utils/hash');

module.exports = async (req, res) => {
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);

  const allowed = await rateLimit(hashedKey, 15, 60); // 5 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let { username, city } = req.body;

  if (!username || !city) {
    return res.status(400).json({ message: "Username and city are required." });
  }

  // Sanitize user input
  username = sanitizeInput(username);
  city = sanitizeInput(city);

  try {
    // Insert the city linked to the username
    const { error } = await supabase
      .from("cities")
      .insert([{ username, city }]);

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "city saved successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};