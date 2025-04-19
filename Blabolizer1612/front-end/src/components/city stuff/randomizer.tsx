"use client";

import { useState } from "react";

type Props = {
  username: string | null;
  cities: string[];
  error: string | null;
  fetchCities: () => Promise<void>;
};

export default function RandomCityPicker({ username, cities, error, fetchCities }: Props) {
  const [pickedCity, setPickedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePick = () => {
    if (cities.length === 0) {
      setPickedCity(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * cities.length);
    setPickedCity(cities[randomIndex]);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchCities();
    setLoading(false);
  };

  return (
    <div>
      <h3>{username ? `${username}'s Cities` : "Cities"}</h3>
      {loading && <p>Loading cities...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {cities.map((city, idx) => (
          <li key={idx}>{city}</li>
        ))}
      </ul>
      <button onClick={handleRefresh} disabled={loading} style={{ marginRight: "10px" }}>
        Refresh Cities
      </button>
      <button onClick={handlePick} disabled={cities.length === 0 || loading}>
        Pick a Random City
      </button>
      {pickedCity && (
        <p>
          Random city: <strong>{pickedCity}</strong>
        </p>
      )}
      {cities.length === 0 && !loading && <p>No cities found.</p>}
    </div>
  );
}