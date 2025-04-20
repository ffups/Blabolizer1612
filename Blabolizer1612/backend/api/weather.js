import setCors from '../src/utils/cors.js'; // or require if using CommonJS
import rateLimit from '../src/utils/rateLimit.js';
import hashIp from '../src/utils/hash.js';


export default async function handler(req, res) {
  setCors(res);

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const hashedKey = hashIp(ip);
  const allowed = await rateLimit(hashedKey, 15, 60); // 15 requests per 60 seconds
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests, please try again in a minute.' });
  }
  
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY; // Store your key in .env.local

  if (!city || typeof city !== "string") {
    return res.status(400).json({ error: "City is required" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(response.status).json(data);
}