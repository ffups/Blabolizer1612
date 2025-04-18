const supabase = require("../config/supabaseClient");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, city } = req.body;

  if (!username || !city) {
    return res.status(400).json({ message: "Username and city are required." });
  }

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