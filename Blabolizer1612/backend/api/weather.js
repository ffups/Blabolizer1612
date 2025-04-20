import setCors from '../src/utils/cors.js'; // or require if using CommonJS


export default async function handler(req, res) {
  setCors(res);

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