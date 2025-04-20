"use client";

import { useState, useEffect, useCallback } from "react";
import CityInput from "./cityInput";
import RandomCityPicker from "./randomizer";

export default function CityManager() {
  const [showRandomizer, setShowRandomizer] = useState<null | boolean>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get username from localStorage and update on event
  useEffect(() => {
    if (typeof window === "undefined") return;
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
          onClick={() => setShowRandomizer(showRandomizer === false ? null : false)}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            background: showRandomizer === false ? "#762297" : "#14505c",
            color: showRandomizer === false ? "#fff" : "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          City Input
        </button>
        <button
          onClick={() => setShowRandomizer(showRandomizer === true ? null : true)}
          style={{
            padding: "8px 16px",
            background: showRandomizer === true ? "#762297" : "#14505c",
            color: showRandomizer === true ? "#fff" : "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Randomizer
        </button>
      </div>
      {/* Only show content when a button is selected */}
      {showRandomizer === false && (
        <div>
          <CityInput
            username={username}
            cities={cities}
            error={error}
            fetchCities={fetchCities}
          />
        </div>
      )}
      {showRandomizer === true && (
        <div>
          <RandomCityPicker
            username={username}
            cities={cities}
            fetchCities={fetchCities}
          />
        </div>
      )}
    </div>
  );
}