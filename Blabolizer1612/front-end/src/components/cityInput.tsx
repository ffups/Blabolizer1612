"use client";

import { useState, useEffect } from "react";

export default function CityInput() {
  const [city, setCity] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]); // State to store the list of cities

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const fetchCities = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/get", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cities.");
      }

      const data = await response.json();
      setCities(data.cities); // Assuming the API returns an array of cities
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleSave = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMessage("No username found. Please log in first.");
      return;
    }

    if (!city.trim()) {
      setMessage("Please enter a valid city name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/db/saveCityToDatabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, city }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save city.");
      }

      setMessage(`City "${city}" has been saved for user "${username}".`);
      setCity(""); // Clear the input field
      fetchCities(); // Refresh the list of cities
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchCities(); // Fetch the list of cities when the component mounts
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <label htmlFor="cityInput" style={{ marginRight: "10px" }}>
        Enter a city name:
      </label>
      <input
        id="cityInput"
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder="e.g. Berlin"
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleSave} style={{ padding: "5px 10px" }}>
        Save
      </button>
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}

      <h3 style={{ marginTop: "20px" }}>Cities Added:</h3>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>{city}</li>
        ))}
      </ul>
    </div>
  );
}