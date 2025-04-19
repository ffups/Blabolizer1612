"use client";

import { useState, useCallback } from "react";

type Props = {
  username: string | null;
  cities: string[];
  error: string | null;
  fetchCities: () => Promise<void>;
};
export default function RandomCityPicker({ username }: Props) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    if (!username) {
      setError("No username found. Please log in first.");
      setCities([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/get?username=${encodeURIComponent(username)}`,
        { method: "GET" }
      );
      if (!response.ok) throw new Error("Failed to fetch cities.");
      const data = await response.json();
      setCities(data.cities);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handlePick = () => {
    if (cities.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
  };

  const pickedCity = handlePick();

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
      <button onClick={fetchCities} disabled={loading} style={{ marginRight: "10px" }}>
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