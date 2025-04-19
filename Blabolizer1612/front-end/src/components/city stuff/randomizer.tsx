"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityList, { defaultRenderItem } from "./CityList";

type Props = {
  username: string | null;
  cities: string[];
  fetchCities: () => Promise<void>;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function RandomCityPicker({ username, cities, fetchCities }: Props) {
  const [pickedCity, setPickedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [arrowIndex, setArrowIndex] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"add" | "delete" | null>(null);

  const router = useRouter();

  const handlePick = () => {
    if (cities.length === 0 || animating) return;
    const index = getRandomInt(cities.length);
    setPickedCity(null);
    setAnimating(true);

    const cycles = 2 + getRandomInt(3); // 2, 3, 4, or 5
    const totalSteps = cycles * cities.length + index;

    function animateArrow(step: number) {
      setArrowIndex(step % cities.length);
      if (step < totalSteps) {
        // Random interval between 60ms and 180ms for each step
        const randomInterval = 100 + Math.floor(Math.random() * 220);
        setTimeout(() => animateArrow(step + 1), randomInterval);
      } else {
        setAnimating(false);
        setPickedCity(cities[index]);
      }
    }

    animateArrow(0);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchCities();
    setLoading(false);
    setPickedCity(null);
    setArrowIndex(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {pickedCity && !animating && (
        <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
          Blabolizer says:
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>
            {pickedCity}
          </p>
        </p>
      )}
      <button
        onClick={handleRefresh}
        disabled={loading || animating}
        style={{
          padding: "4px 9px",
          background: "#f357a86c",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: loading || animating ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          boxShadow: "0 2px 8px #7b2ff244",
          transition: "background 0.2s",
        }}
      >
        Refresh Cities
      </button>
      <button
        onClick={handlePick}
        disabled={cities.length === 0 || loading || animating}
        style={{
          padding: "4px 9px",
          margin: "15px",
          background: "#f357a8",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: cities.length === 0 || loading || animating ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          boxShadow: "0 2px 8px #f357a844",
          transition: "background 0.2s",
        }}
      >
        {animating ? "Picking..." : "Pick a Random City"}
      </button>
      {statusMessage && (
        <p style={{ marginTop: "1rem", color: "green" }}>{statusMessage}</p>
      )}
      <h3>{username ? `${username}'s Cities` : "Cities"}</h3>
      <CityList
        cities={cities}
        showDelete={true}
        loadingAction={loadingAction} // <-- use loadingAction, not loading
        username={username}
        fetchCities={fetchCities}
        setMessage={setStatusMessage} // <-- use this for status messages
        setLoadingAction={setLoadingAction}
        renderItem={(city, idx, handleDelete) =>
          defaultRenderItem({
            city,
            idx,
            router,
            showDelete: true,
            loadingAction: loadingAction, // <-- use loadingAction here too
            handleDelete, // <-- use the handleDelete passed from CityList
            children: (
              <span style={{ width: 24, display: "inline-block", textAlign: "center" }}>
                {arrowIndex === idx && animating ? "➡️" : ""}
              </span>
            ),
          })
        }
      />

      {cities.length === 0 && !loading && <p>No cities found.</p>}
    </div>
  );
}