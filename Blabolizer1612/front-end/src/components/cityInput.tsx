"use client";

import { useState, useEffect } from "react";

export default function CityInput() {
  const [city, setCity] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const fetchCities = async () => {
    if (!username) {
      setMessage("No username found. Please log in first.");
      setCities([]);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/get?username=${encodeURIComponent(username)}`,
        { method: 'GET' }
      );

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
    // Always get the latest username from localStorage
    const savedName = localStorage.getItem("username");
    setUsername(savedName);
  
    if (!savedName) {
      setMessage("No username found. Please log in first.");
      return;
    }
  
    if (!city.trim()) {
      setMessage("Please enter a valid city name.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/saveCityToDatabase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: savedName, city }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to save city.");
      }
  
      setMessage(`City "${city}" has been saved for user "${savedName}".`);
      setCity("");
      fetchCities();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };


  const handleDelete = async (cityToDelete: string) => {
    if (!username) {
      setMessage("No username found. Please log in first.");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityToDelete, username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete city.");
      }

      setMessage(`City "${cityToDelete}" has been deleted.`);
      fetchCities();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  // Listen for username changes (e.g., after login or switching users)
  useEffect(() => {
    const updateUsername = () => {
      const savedName = localStorage.getItem("username");
      setUsername(savedName);
    };
    updateUsername();
    window.addEventListener("usernameUpdate", updateUsername);
    return () => window.removeEventListener("usernameUpdate", updateUsername);
  }, []);

  // Fetch cities whenever username changes
  useEffect(() => {
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

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