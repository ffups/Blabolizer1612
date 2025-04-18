const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const sanitizeInput = require('../utils/sanitizeInput'); // Add this line

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function saveNameToDatabase(name) {
  name = sanitizeInput(name); // Sanitize input here
  try {
    const { data, error } = await supabase
      .from('names')
      .insert([{ name }]);

    if (error) {
      console.error('Supabase Insert Error:', error);
    }

    return { data, error };
  } catch (err) {
    console.error('Unexpected Error in saveNameToDatabase:', err);
    throw err;
  }
}

module.exports = saveNameToDatabase;