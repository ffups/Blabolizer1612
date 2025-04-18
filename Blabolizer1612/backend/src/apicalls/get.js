const supabase = require("../config/supabaseClient");

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://blabolizer1612.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("cities")
      .select("city");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No cities found." });
    }

    res.status(200).json({ cities: data.map((row) => row.city) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};