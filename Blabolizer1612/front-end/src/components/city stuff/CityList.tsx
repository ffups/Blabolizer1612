import React, { useState } from "react";
import { useRouter } from "next/navigation";

type CityListProps = {
  cities: string[];
  showDelete?: boolean;
  loadingAction?: "add" | "delete" | null;
  username?: string | null;
  fetchCities?: () => void;
  setMessage?: (msg: string | null) => void; // <-- Add this line
  setLoadingAction?: (action: "add" | "delete" | null) => void;
  renderItem?: (city: string, idx: number, handleDelete: (city: string) => void) => React.ReactNode;
};

export default function CityList({
  cities,
  showDelete = false,
  loadingAction,
  username,
  fetchCities,
  setLoadingAction,
  renderItem,
}: CityListProps) {
  const router = useRouter();
  const [deletedCity, setDeletedCity] = useState<string | null>(null);
  const [fade, setFade] = useState(false);

  const handleDelete = async (cityToDelete: string) => {
    if (!username) {
      alert("No username found. Please log in first.");
      return;
    }
    try {
      if (setLoadingAction) setLoadingAction("delete");
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

      setDeletedCity(cityToDelete);
      setFade(false);
      setTimeout(() => setFade(true), 100); // Start fade after short delay
      setTimeout(() => setDeletedCity(null), 3600); // Remove message after fade
      if (fetchCities) fetchCities();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      if (setLoadingAction) setLoadingAction(null);
    }
  };

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "1rem auto", maxWidth: 320 }}>
      {cities.map((city, idx) => (
        <React.Fragment key={city}>
          {deletedCity === city ? (
            <li>
              <span
                style={{
                  display: "block",
                  fontSize: "1.2rem",
                  marginBottom: "0.25rem",
                  color: "white",
                  opacity: fade ? 0 : 1,
                  transition: "opacity 3.2s",
                }}
              >
                City &quot;{city}&quot; has been deleted.
              </span>
            </li>
          ) : (
            renderItem
              ? renderItem(city, idx, handleDelete)
              : defaultRenderItem({
                  city,
                  idx,
                  showDelete,
                  loadingAction,
                  handleDelete,
                  router,
                })
          )}
        </React.Fragment>
      ))}
    </ul>
  );
}

export function defaultRenderItem({
  city,
  idx,
  showDelete,
  loadingAction,
  handleDelete,
  router,
  children,
}: {
  city: string;
  idx: number;
  showDelete?: boolean;
  loadingAction?: "add" | "delete" | null;
  handleDelete: (city: string) => void;
  router: ReturnType<typeof useRouter>;
  children?: React.ReactNode;
}) {
  return (
    <li
      key={idx}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "1.2rem",
        borderRadius: "6px",
        margin: "0.25rem 0",
        padding: "0.5rem 0.5rem 0.5rem 0.25rem",
        transition: "background 0.2s",
      }}
    >
      {children}
      <span
        style={{
          textDecoration: "underline",
          textTransform: "capitalize",
          cursor: "pointer",
          flex: 1,
        }}
        onClick={() => {
          if (window.confirm(`Go to the page for "${city}"?`)) {
            router.push(`/city/${encodeURIComponent(city)}`);
          }
        }}
      >
        {city}
      </span>
      {showDelete && (
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
            cursor: loadingAction === "add" || loadingAction === "delete" ? "not-allowed" : "pointer",
            borderRadius: "4px",
            background: "#f357a8",
          }}
          aria-label={`Delete city ${city}`}
          disabled={loadingAction === "add" || loadingAction === "delete"}
        >
          Delete
        </button>
      )}
    </li>
  );
}