"use client";

import { useState, useEffect, useCallback } from "react";

export default function CityInput() {
  const [city, setCity] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const fetchCities = useCallback(async () => {
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
  }, [username]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent form reload

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
  
    setLoading(true);
  
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
    } finally {
      setLoading(false);
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

  useEffect(() => {
    const updateUsername = () => {
      const savedName = localStorage.getItem("username");
      setUsername(savedName);
    };
    updateUsername();
    window.addEventListener("usernameUpdate", updateUsername);
    return () => window.removeEventListener("usernameUpdate", updateUsername);
  }, []);

  useEffect(() => {
    if (username) {
      fetchCities();
    }
  }, [username, fetchCities]);

  return (
    <div style={{ margin: "20px" }}>
      <form onSubmit={handleSave}>
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
          aria-label="City name input"
          disabled={loading}
        />
        <button
          type="submit"
          style={{ padding: "5px 10px" }}
          aria-label="Save city"
          disabled={loading}
        >
          {loading ? "Booping..." : "Boop"}
        </button>
      </form>
      {loading && (
        <div style={{ marginTop: "10px" }}>
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '3px solid #7b2ff2',
              borderTop: '3px solid #eee',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}</style>
          <span style={{ marginLeft: "10px" }}>Saving city...</span>
        </div>
      )}
      {message && (
        <p style={{ marginTop: "10px" }} aria-live="polite">
          {message}
        </p>
      )}

      <h3 style={{ marginTop: "20px" }}>Cities Added:</h3>
      <ul aria-label="List of added cities">
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
              aria-label={`Delete city ${city}`}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}