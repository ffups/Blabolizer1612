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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/apicalls/get`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cities.');
      }

      const data = await response.json();
      setCities(data.cities);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}db/saveCityToDatabase`, {
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
    } catch (error: unknown) { // Use `unknown` instead of `any`
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  const handleDelete = async (cityToDelete: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/apicalls/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityToDelete }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete city.");
      }

      setMessage(`City "${cityToDelete}" has been deleted.`);
      fetchCities(); // Refresh the list of cities
    } catch (error: unknown) { // Use `unknown` instead of `any`
      if (error instanceof Error) {
        setMessage(error.message);
      }
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
          <li key={index}>
            {city}{" "}
            <button
              onClick={() => handleDelete(city)}
              style={{
                marginLeft: "10px",
                padding: "2px 5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}