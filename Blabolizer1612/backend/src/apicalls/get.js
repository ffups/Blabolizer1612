const supabase = require('../config/supabaseClient');
const rateLimit = require('../utils/rateLimit');
const hashIp = require('../utils/hash');

module.exports = async (req, res, username) => {
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);

  const allowed = await rateLimit(hashedKey, 10, 60); // 10 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again in 59 seconds.' });
  }

  try {
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Query only cities for the given username
    const { data, error } = await supabase
      .from('cities')
      .select('city')
      .eq('username', username);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch cities' });
    }

    // Return just the city names as an array
    const cities = data.map(row => row.city);
    res.status(200).json({ cities });
  } catch (err) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};