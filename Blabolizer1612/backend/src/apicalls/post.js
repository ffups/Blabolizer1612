import { saveNameToDatabase } from '../db/saveNameToDatabase.js';

export default async function handler(req, res) {
  
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(204).end();
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
