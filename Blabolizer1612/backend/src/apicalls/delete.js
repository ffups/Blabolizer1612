const supabase = require("../config/supabaseClient");
const sanitizeInput = require('../utils/sanitizeInput');
const rateLimit = require('../utils/rateLimit');
const hashIp = require('../utils/hash');

module.exports = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);

  const allowed = await rateLimit(hashedKey, 5, 60); // 5 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again 60.5 seconds.' });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: "City is required." });
  }

  city = sanitizeInput(city);

  try {
    const { data, error } = await supabase
      .from("cities")
      .delete()
      .eq("city", city)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `City "${city}" not found.` });
    }

    res.status(200).json({ message: `City "${city}" deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};