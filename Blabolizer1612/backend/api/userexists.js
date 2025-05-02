const supabase = require("../config/supabaseClient");
const setCors = require("../src/utils/cors");

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ exists: false });
  }
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .single();
  if (error || !data) {
    return res.status(200).json({ exists: false });
  }
  res.status(200).json({ exists: true });
};