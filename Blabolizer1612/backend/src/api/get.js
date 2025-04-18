const supabase = require("../config/supabaseClient");

module.exports = async (req, res) => {
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

    res.status(200).json({ cities: data.map((row) => row.city) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};