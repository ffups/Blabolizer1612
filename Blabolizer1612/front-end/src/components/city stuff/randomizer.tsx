"use client";

import { useState } from "react";
import CityList from "./CityList";

type Props = {
  username: string | null;
  cities: string[];
  fetchCities: () => Promise<void>;
};

export default function RandomCityPicker({ username, cities, fetchCities }: Props) {
  const [pickedCity, setPickedCity] = useState<string | null>(null);
  const [loading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"add" | "delete" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [displayedCity, setDisplayedCity] = useState<string | null>(null);

  const handlePick = () => {
    if (cities.length === 0 || animating) return;
    setPickedCity(null);
    setAnimating(true);
  
    let i = 0;
    const totalCycles = Math.max(15, cities.length * 3); // how many cities to show in animation
    const interval = setInterval(() => {
      setDisplayedCity(cities[i % cities.length]);
      i++;
      if (i >= totalCycles) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * cities.length);
        setPickedCity(cities[randomIndex]);
        setDisplayedCity(cities[randomIndex]);
        setAnimating(false);
      }
    }, 100); // speed of cycling (ms)
  };

  return (
    <div style={{ textAlign: "center",  margin: "20px" }}>
        <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
          Blabolizer says:
          <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>
          {animating ? displayedCity : pickedCity}
          </span>
        </div>

        <button
  onClick={handlePick}
  disabled={cities.length === 0 || loading || animating}
  style={{
    marginTop: "18px",
    fontSize: "1.2rem",
    fontWeight: 700,
    height: "48px",
    minWidth: "160px",
    borderRadius: "16px",
    border: "0px solid rgba(255,255,255,0.25)",
    background: "rgba(25, 97, 112, 0.33)",
    color: "#fff",
    cursor: cities.length === 0 || loading || animating ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    boxShadow: "0 2px 8px 0 rgba(25,97,112,0.07)",
    transition: "background 0.2s, border 0.2s, color 0.2s",
    letterSpacing: "0.01em",
    outline: "none",
    gap: "0.5em",
  }}
>
  {animating ? (
    <span
      style={{
        display: "inline-block",
        width: "1.5em",
        height: "1.5em",
        border: "3px solid #fff",
        borderTop: "3px solid #f357a8",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        verticalAlign: "middle",
        marginRight: "0.5em",
      }}
    />
  ) : null}
  {animating ? "Picking..." : "Pick a Random City"}
  <style>
    {`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}
  </style>
</button>
      {message && (
        <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>
      )}
      <h3 style={{ marginTop: "20px", textAlign: "left" }}>Cities Added:</h3>

       <CityList
              cities={cities}
              showDelete={true}
              loadingAction={loadingAction}
              username={username}
              fetchCities={fetchCities}
              setMessage={setMessage}
              setLoadingAction={setLoadingAction}
            />
      {cities.length === 0 && !loading && <p>No cities found.</p>}
    </div>
  );
}