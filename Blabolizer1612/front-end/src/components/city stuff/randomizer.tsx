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

  const handlePick = () => {
    if (cities.length === 0 || animating) return;
    setPickedCity(null);
    setAnimating(true);
  
    // Simulate animation, then pick a random city
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * cities.length);
      setPickedCity(cities[randomIndex]);
      setAnimating(false);
    }, 1000); // 1 second animation
  };

  return (
    <div style={{ textAlign: "center",  margin: "20px" }}>
        <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
          Blabolizer says:
          <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>
            {pickedCity}
          </span>
        </div>

      <button
        onClick={handlePick}
        disabled={cities.length === 0 || loading || animating}
        
      >
        {animating ? "Picking..." : "Pick a Random City"}
      </button>
      {message && (
        <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>
      )}
      <h3>{username ? `${username}'s Cities` : "Cities"}</h3>
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