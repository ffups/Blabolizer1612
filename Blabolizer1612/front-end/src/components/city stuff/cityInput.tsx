"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  username: string | null;
  cities: string[];
  error: string | null;
  fetchCities: () => void;
};

export default function CityInput({ username, cities, error, fetchCities }: Props) {
  const [city, setCity] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"add" | "delete" | null>(null);

  const router = useRouter();

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (cityToDelete: string) => {
    if (!username) {
      alert("No username found. Please log in first.");
      return;
    }
    try {
      setLoadingAction("delete");
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
        alert(error.message);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    if (!username) {
      alert("No username found. Please log in first.");
      return;
    }
    try {
      setLoadingAction("add");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/saveCityToDatabase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: city.trim(), username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add city.");
      }

      setCity("");
      fetchCities();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
   
      {/* Add city input form */}
      <form onSubmit={handleAddCity} style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter a city"
          disabled={loadingAction === "add" || loadingAction === "delete"}
          style={{ padding: "6px", marginRight: "8px" }}
        />
        <button type="submit" disabled={loadingAction === "add" || loadingAction === "delete" || !city.trim()}>
          Add City
        </button>
      </form>

      {loadingAction === "add" && (
        <div style={{ marginTop: "10px" }}>
          {/* spinner */}
          <span style={{ marginLeft: "10px" }}>Saving city...</span>
        </div>
      )}
      {loadingAction === "delete" && (
        <div style={{ marginTop: "10px" }}>
          {/* spinner */}
          <span style={{ marginLeft: "10px" }}>Deleting city...</span>
        </div>
      )}
      {error && (
        <p style={{ marginTop: "10px" }} aria-live="polite">
          {error}
        </p>
      )}
      {message && (
        <p style={{ marginTop: "10px", color: "green" }} aria-live="polite">
          {message}
        </p>
      )}

      <h3 style={{ marginTop: "20px" }}>Cities Added:</h3>
      <ul aria-label="List of added cities">
        {cities.map((city, index) => (
          <li key={index}
          style={{
            marginBottom: "1rem", // Add more space below each city
            marginTop: "1rem",    // Add more space above each city (optional)
            display: "flex",
            alignItems: "center"
          }}>
            <span
              style={{  textDecoration: "underline",textTransform: "capitalize", cursor: "pointer" }}
              onClick={() => {
                if (window.confirm(`Go to the page for "${city}"?`)) {
                  router.push(`/city/${encodeURIComponent(city)}`);
                }
              }}
            >
              {city}
            </span>{" "}
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${city}"?`)) {
                  handleDelete(city);
                }
              }}
              style={{
                marginLeft: "10px",
                padding: "2px 5px",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`Delete city ${city}`}
              disabled={loadingAction === "add" || loadingAction === "delete"}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}