import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CityListProps = {
  cities: string[];
  showDelete?: boolean;
  loadingAction?: "add" | "delete" | null;
  username?: string | null;
  fetchCities?: () => void;
  setMessage?: (msg: string | null) => void;
  setLoadingAction?: (action: "add" | "delete" | null) => void;
  renderItem?: (city: string, idx: number, handleDelete: (city: string) => void) => React.ReactNode;
};

export default function CityList({
  cities,
  loadingAction,
  username,
  fetchCities,
  setLoadingAction,
  renderItem,
}: CityListProps) {
  const router = useRouter();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [fade, setFade] = useState(false);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [fadingCities, setFadingCities] = useState<string[]>([]);
  const [localCities, setLocalCities] = useState<string[]>(cities);

  useEffect(() => {
    // Only update localCities from props if not fading out
    if (fadingCities.length === 0) {
      setLocalCities(cities);
    }
  }, [cities, fadingCities.length]);

  const handleSelectCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  const handleBulkDelete = async () => {
    if (!username) {
      alert("No username found. Please log in first.");
      return;
    }
    if (selectedCities.length === 0) {
      alert("Please select at least one city to delete.");
      return;
    }
    try {
      if (setLoadingAction) setLoadingAction("delete");
      setFadingCities(selectedCities); // Start fading selected cities
      setFade(false);
      setTimeout(() => setFade(true), 100);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cities: selectedCities, username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "You have exceeded the rate limit. Please try again in a minute.");
      }
      setTimeout(() => {
        setSelectedCities([]);
        setFadingCities([]);
      }, 1800); // Match fade duration
      setTimeout(() => {
        if (fetchCities) fetchCities();
      },); // 5 seconds after fade, or on next user action

    } catch (error: unknown) {
      setFadingCities([]);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      if (setLoadingAction) setLoadingAction(null);
    }
  };

  return (
    <div
      style={{
        overflowX: "auto",
        maxWidth: "100%",
        paddingBottom: "8px",
      }}
    >
      <style>
        {`
        @media (max-width: 600px) {
          .city-list-grid {
            min-width: 0 !important;
            max-width: 100vw !important;
            gap: 8px !important;
          }
        }
      `}
      </style>
      {/* Toggle Delete Buttons Button */}
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8, gap: 8 }}>
        <button
          onClick={() => setShowDeleteButtons((v) => !v)}
          style={{
            background: showDeleteButtons ? "#762297" : "#14505c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {showDeleteButtons ? "Delete" : "Delete"}
        </button>
        {showDeleteButtons && (
  <button
    onClick={handleBulkDelete}
    disabled={loadingAction === "delete" || selectedCities.length === 0}
    style={{
      background: selectedCities.length === 0 ? "#14505c" : "#762297",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "0",
      fontWeight: 600,  
      fontSize: "1.3rem",
      cursor: loadingAction === "delete" || selectedCities.length === 0 ? "not-allowed" : "pointer",
      opacity: selectedCities.length === 0 ? 0.6 : 1,
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 40,
    }}
    aria-label="Delete selected cities"
    title="Delete selected cities"
  >
    {loadingAction === "delete" ? (
      <span
        style={{
          display: "inline-block",
          width: "1.5em",
          height: "1.5em",
          border: "3px solid #fff",
          borderTop: "0px solid rgb(87, 220, 243)",
          borderRadius: "50%",
          animation: "spin 1.5s linear infinite",
          verticalAlign: "middle",
        }}
      />
    ) : (
      "✓"
    )}
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
  </button>
)}
      </div>
      <div
        className="city-list-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
          gridAutoRows: "minmax(48px, auto)",
          gap: "12px",
          maxHeight: "280px",
          minWidth: "360px",
          alignItems: "stretch",
        }}
      >
        {localCities.map((city, idx) =>
          renderItem
            ? renderItem(city, idx, () => { }) // disables individual delete
            : (
              <div
                key={city + idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(4, 226, 215, 0.21)",
                  color: "rgb(255, 255, 255)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  minWidth: "0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minHeight: "48px",
                  maxWidth: "220px",
                  opacity: fadingCities.includes(city) && fade ? 0 : 1,
                  transition: fadingCities.includes(city) ? "opacity 1.8s" : undefined,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    textAlign: "left",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    textDecoration: "underline",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "190px",
                    display: "inline-block",
                  }}
                  title={city}
                  onClick={() => {
                    if (window.confirm(`Go to the page for "${city}"?`)) {
                      router.push(`/city/${encodeURIComponent(city)}`);
                    }
                  }}
                >
                  {city}
                </span>
                {showDeleteButtons && (
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city)}
                    onChange={() => handleSelectCity(city)}
                    disabled={loadingAction === "delete"}
                    style={{
                      marginLeft: "10px",
                      width: "20px",
                      height: "20px",
                      accentColor: "#762297",
                      cursor: loadingAction === "delete" ? "not-allowed" : "pointer",
                    }}
                    aria-label={`Select city ${city} for deletion`}
                  />
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}

