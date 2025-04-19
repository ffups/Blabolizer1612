import { useState, useEffect, useCallback } from "react";

export default function RandomCityPicker() {
  const [username, setUsername] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [pickedCity, setPickedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update username from localStorage on mount and when "usernameUpdate" event fires
  useEffect(() => {
    const updateUsername = () => setUsername(localStorage.getItem("username"));
    updateUsername();
    window.addEventListener("usernameUpdate", updateUsername);
    return () => window.removeEventListener("usernameUpdate", updateUsername);
  }, []);

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
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cities.');
      }

      const data = await response.json();
      setCities(data.cities);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchCities();
    }
  }, [username, fetchCities]);

  const handlePick = () => {
    if (cities.length === 0) {
      setPickedCity(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * cities.length);
    setPickedCity(cities[randomIndex]);
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