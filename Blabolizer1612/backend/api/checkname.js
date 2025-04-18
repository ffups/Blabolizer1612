const supabase = require('../src/config/supabaseClient');
const setCors = require('../src/utils/cors');
const sanitizeInput = require('../src/utils/sanitizeInput');
const rateLimit = require('../src/utils/rateLimit');
const hashIp = require('../src/utils/hash');

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);
  const allowed = await rateLimit(hashedKey, 5, 60); // 5 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      let { name } = JSON.parse(body);

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      name = sanitizeInput(name);

      // Check if the username already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('names')
        .select('*')
        .eq('name', name)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists, please choose another' });
      }

      // Insert the new username
      const { error: insertError } = await supabase
        .from('names')
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
};