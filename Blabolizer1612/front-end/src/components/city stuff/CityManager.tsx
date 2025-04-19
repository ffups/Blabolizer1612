"use client";

import { useState, useEffect, useCallback } from "react";
import CityInput from "./cityInput";
import RandomCityPicker from "./randomizer";

export default function CityManager() {
  const [showRandomizer, setShowRandomizer] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Get username from localStorage and update on event
  useEffect(() => {
    const updateUsername = () => setUsername(localStorage.getItem("username"));
    updateUsername();
    window.addEventListener("usernameUpdate", updateUsername);
    return () => window.removeEventListener("usernameUpdate", updateUsername);
  }, []);

  // Fetch cities for the current username
  const fetchCities = useCallback(async () => {
    if (!username) {
      setError("No username found. Please log in first.");
      setCities([]);
      return;
    }
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/get?username=${encodeURIComponent(username)}`,
        { method: 'GET' }
      );
      if (!response.ok) throw new Error('Failed to fetch cities.');
      const data = await response.json();
      setCities(data.cities);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  }, [username]);

  // Refetch cities when username changes
  useEffect(() => {
    if (username) fetchCities();
  }, [username, fetchCities]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowRandomizer(false)}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            background: showRandomizer ? "#eee" : "#7b2ff2",
            color: showRandomizer ? "#333" : "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          City Input
        </button>
        <button
          onClick={() => setShowRandomizer(true)}
          style={{
            padding: "8px 16px",
            background: showRandomizer ? "#7b2ff2" : "#eee",
            color: showRandomizer ? "#fff" : "#333",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Randomizer
        </button>
      </div>
      {showRandomizer ? (
        <RandomCityPicker
          username={username}
          cities={cities}
          error={error}
          fetchCities={fetchCities}
        />
      ) : (
        <CityInput
          username={username}
          cities={cities}
          error={error}
          fetchCities={fetchCities}
        />
      )}
    </div>
  );
}