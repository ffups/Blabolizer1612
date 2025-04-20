const supabase = require("../config/supabaseClient");
const sanitizeInput = require('../utils/sanitizeInput');
const rateLimit = require('../utils/rateLimit');
const hashIp = require('../utils/hash');

module.exports = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);

  const allowed = await rateLimit(hashedKey, 15, 60);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again 60.5 seconds.' });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let { username, cities } = req.body;

  if (!username || !Array.isArray(cities) || cities.length === 0) {
    return res.status(400).json({ message: "Username and cities array are required." });
  }

  username = sanitizeInput(username);
  const sanitizedCities = cities.map(city => sanitizeInput(city));

  try {
    const { data, error } = await supabase
      .from("cities")
      .delete()
      .eq("username", username)
      .in("city", sanitizedCities)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No matching cities found.` });
    }

    res.status(200).json({ message: `Cities deleted successfully.`, deleted: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};