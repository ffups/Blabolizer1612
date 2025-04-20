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
      setDeletedCity(cityToDelete); // <-- Move this up
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
        throw new Error(error.message || "You have exceeded the rate limit. Please try again in a minute.");
      }
  
      setFade(false);
      setTimeout(() => setFade(true), 100);
      setTimeout(() => {
        setDeletedCity(null);
        if (fetchCities) fetchCities();
      }, 1600);
    } catch (error: unknown) {
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
      <div
            className="city-list-grid"

        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
          gridAutoRows: "minmax(48px, auto)",
          gap: "12px",
          maxHeight: "280px", // 5 rows * 56px (adjust as needed)
          minWidth: "360px",// ensures horizontal scroll if more than 5
          alignItems: "stretch",
        }}
      >
        
        {cities.map((city, idx) =>
         renderItem
            ? renderItem(city, idx, handleDelete)
            : (
              <div
                key={city + idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(4, 226, 215, 0.21)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "1.1rem",
                  minWidth: "0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minHeight: "48px",
                  maxWidth: "220px", // or adjust as needed

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
                    maxWidth: "190px", // set max width for the text only
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
                {showDelete && (
                  <span style={{ display: "inline-block", minWidth: "1.5em", textAlign: "center" }}>
                    {loadingAction === "delete" && deletedCity === city ? (
                      <span
                        style={{
                          display: "inline-block",
                          width: "1.5em",
                          height: "1.5em",
                          border: "3px solid #fff",
                          borderTop: "3px solid #f357a8",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          verticalAlign: "middle",
                        }}
                      />
                    ) : deletedCity === city && fade ? (
                      <span
                        style={{
                          color: "#f357a8",
                          fontWeight: "bold",
                          fontSize: "1.1em",
                          transition: "opacity 0.5s",
                        }}
                      >
                        Deleted!
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${city}"?`)) {
                            handleDelete(city);
                          }
                        }}
                        style={{
                          marginLeft: "10px",
                          padding: "2px 10px",
                          color: "white",
                          border: "none",
                          cursor: loadingAction === "add" || loadingAction === "delete" ? "not-allowed" : "pointer",
                          borderRadius: "4px",
                          background: "rgba(25,98,112,0.7)",
                          fontSize: "1.5rem",
                          lineHeight: 1,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label={`Delete city ${city}`}
                        disabled={loadingAction === "add" || loadingAction === "delete"}
                      >
                        <span style={{ position: "relative", top: "-3px" }}>-</span>
                      </button>
                    )}
                    <style>
                      {`
                        @keyframes spin {
                          0% { transform: rotate(0deg);}
                          100% { transform: rotate(360deg);}
                        }
                      `}
                    </style>
                  </span>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}

