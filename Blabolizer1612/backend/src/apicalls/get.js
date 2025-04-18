const supabase = require('../config/supabaseClient');

module.exports = async (req, res, username) => {
  try {
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Query only cities for the given username
    const { data, error } = await supabase
      .from('cities') // replace with your actual table name
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