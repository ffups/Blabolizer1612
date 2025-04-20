import { saveNameToDatabase } from '../db/saveNameToDatabase.js';
import rateLimit from '../utils/rateLimit.js';
import hashIp from '../utils/hash.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(204).end();
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);
  const allowed = await rateLimit(hashedKey, 10, 60); // 5 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again in 60 seconds.' });
  }

  if (req.method === 'POST') {
    const { name } = req.body;

    try {
      const data = await saveNameToDatabase(name);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
