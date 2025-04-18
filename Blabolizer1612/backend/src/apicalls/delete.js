const supabase = require("../config/supabaseClient");

module.exports = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: "City is required." });
  }

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