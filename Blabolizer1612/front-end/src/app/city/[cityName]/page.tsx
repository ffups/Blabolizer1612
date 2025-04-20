"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type WeatherData = {
  weather: { description: string }[];
  main: { temp: number };
};

type ForecastItem = {
  dt: number;
  main: { temp: number };
  weather: { description: string }[];
  dt_txt: string;
};
type ForecastData = {
  list: ForecastItem[];
};

export default function CityPage() {
  const params = useParams();
  const cityName = params.cityName as string;
  const wikiLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName.replace(/ /g, "_"))}`;
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/forecast?city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data: ForecastData = await res.json();
        setForecast(data.list);
      }
    }
    fetchForecast();
  }, [cityName]);

  useEffect(() => {
    async function fetchWeather() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/weather?city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data: WeatherData = await res.json();
        setWeather(data);
      }
    }
    fetchWeather();
  }, [cityName]);

  useEffect(() => {
    async function fetchWikiImage() {
      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName.replace(/ /g, "_"))}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.thumbnail && data.thumbnail.source) {
        setImageUrl(data.thumbnail.source);
      } else {
        setImageUrl(null); // fallback if no image
      }
    }
    fetchWikiImage();
  }, [cityName]);

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: "0 24px 20px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        background: "rgba(91, 0, 238, 0)", // match your homepage background
        textAlign: "center",
      }}
    >
      <div style={{ height: "32px" }} />
      {imageUrl && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            margin: "24px 0",
            flexDirection: "row", // left-to-right
          }}
        >
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              margin: 0,
              borderRadius: "16px",
              padding: "10px 24px",
              display: "inline-block",
              letterSpacing: "0.01em",
              boxShadow: "0 2px 8px 0 rgba(25,97,112,0.07)",
              whiteSpace: "nowrap",
              animation: "colorchange 2.5s linear infinite",
            }}
          >
            {cityName}
            <style>
              {`
      @keyframes colorchange {
        0%   { color:rgb(253, 164, 0); }
        25%   { color:rgb(253, 164, 0); }
        50%   { color:rgb(245, 0, 253);}
        75%   { color:rgb(245, 0, 253);}
        100%  { color:rgb(253, 164, 0); }
      }
    `}
            </style>
          </h1>
          <Image
            src={imageUrl}
            alt={cityName}
            width={280}
            height={180}
            style={{ borderRadius: 12, height: "auto", maxWidth: 280 }}
            unoptimized // (optional, if you have issues with external domains)
          />
        </div>
      )}
      <a
        href={wikiLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          margin: "8px 0 24px 0",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: " rgb(255, 255, 255)",
          borderRadius: "12px",
          padding: "8px 18px",
          textDecoration: "underline",
          transition: "background 0.2s, color 0.2s",
          boxShadow: "0 1px 4px 0 rgba(25,97,112,0.07)",
        }}
      >
        View {cityName} on Wikipedia
      </a>
      {weather && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>Weather</h2>
          <p style={{ color: "#fff", fontSize: "1.1rem" }}>
            {weather.weather?.[0]?.description}, {weather.main?.temp}°C
          </p>
        </div>
      )}
      {forecast.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>5-Day Forecast</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {forecast
              .filter((item) =>
                // Get one forecast per day (at 12:00)
                item.dt_txt.includes("12:00:00")
              )
              .map((item) => (
                <div key={item.dt} style={{ color: "#fff", fontSize: "1rem" }}>
                  {new Date(item.dt_txt).toLocaleDateString()}: {item.weather[0].description}, {item.main.temp}°C
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}