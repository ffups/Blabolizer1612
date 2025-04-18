const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // Import Supabase client

router.post('/api/post', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Check if the username already exists in the Supabase database
    const { data: existingUser, error: fetchError } = await supabase
      .from('names') // Replace 'names' with your actual table name
      .select('*')
      .eq('name', name)
      .maybeSingle(); // Use maybeSingle to handle no rows gracefully

    if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists, please choose another' });
    }

    // Insert the new username into the database
    const { error: insertError } = await supabase
      .from('names') // Replace 'names' with your actual table name
      .insert([{ name }]);

    if (insertError) {
      console.error('Error inserting user:', insertError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;