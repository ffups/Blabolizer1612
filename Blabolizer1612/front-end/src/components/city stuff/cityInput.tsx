"use client";

import { useRef, useEffect, useState } from "react";
import CityList from "./CityList";

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
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fade, setFade] = useState(false);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);
  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      setFade(false);
      const fadeTimer = setTimeout(() => setFade(true), 1200);
      const clearTimer = setTimeout(() => setMessage(null), 1500);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const minWidth = 260;
      const maxWidth = 400;
      // Use the longer of city or placeholder
      const measureText = city.length > 0 ? city : "Enter a city";
      spanRef.current.textContent = measureText;

      // Ensure font styles match input!
      const inputStyles = window.getComputedStyle(inputRef.current);
      spanRef.current.style.fontSize = inputStyles.fontSize;
      spanRef.current.style.fontWeight = inputStyles.fontWeight;
      spanRef.current.style.fontFamily = inputStyles.fontFamily;
      spanRef.current.style.padding = inputStyles.padding;

      const spanWidth = spanRef.current.offsetWidth + 16;
      const clampedWidth = Math.max(minWidth, Math.min(spanWidth, maxWidth));
      inputRef.current.style.width = `${clampedWidth}px`;
    }
  }, [city]);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    if (!username) {
      alert("No username found. Please log in first.");
      return;
    }
    // Prevent duplicate (case-insensitive)
    if (cities.some(c => c.trim().toLowerCase() === city.trim().toLowerCase())) {
      setMessage("City already added.");
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
        throw new Error(error.message || "You have exceeded the rate limit. Please try again in a minute.");
      }

      setCity("");
      fetchCities();
      setShouldFocusInput(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
      <form
        onSubmit={handleAddCity}
        style={{
          marginBottom: "16px",
          display: "flex",           // <-- Add this
          alignItems: "center",      // <-- And this for vertical alignment
          gap: "0",                  // <-- Optional: remove gap if you want them flush
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter a city"
          disabled={loadingAction === "add" || loadingAction === "delete"}
          autoFocus // ensure autofocus on remount
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            fontFamily: "inherit",
            background: "rgba(122, 47, 242, 0)",
            borderRadius: "16px",
            color: "#fff",
            padding: "0 12px",
            height: "48px",
            boxSizing: "border-box",
            outline: "none",
            minWidth: 260,
            maxWidth: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "1px solid rgba(255,255,255,0.15)",
            marginRight: 8,
            transition: "width 0.2s",
          }}
        />
        {/* Hidden span to measure width */}
        <span ref={spanRef} style={{
          position: "absolute",
          visibility: "hidden",
          height: 0,
          overflow: "hidden",
          whiteSpace: "pre",
          // Don't hardcode font styles here, let JS set them!
        }} />
        <style>
          {`
            input::placeholder {
              color: #fff;
              opacity: 1;
              font-weight: 500;
            }
          `}
        </style>
        <button
          type="submit"
          disabled={loadingAction === "add" || loadingAction === "delete" || !city.trim()}
          aria-label="Add City"
          style={{
            fontSize: "2rem",
            height: "48px",
            width: "48px",
            borderRadius: "16px",
            border: "0px solid rgba(255,255,255,0.25)",
            background: "rgba(25, 97, 112, 0.33)",
            color: "#fff",
            cursor: loadingAction === "add" || loadingAction === "delete" || !city.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: 0,
            transition: "background 0.2s, border 0.2s",
            lineHeight: "48px",
            verticalAlign: "middle",
            position: "relative",
          }}
        >
          {loadingAction === "add" ? (
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
          ) : (
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              lineHeight: 1,
              fontSize: "2rem",
              marginBottom: "7px",
            }}>
              →
            </span>
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
      </form>

      {loadingAction === "add" && (
        <div style={{ marginTop: "10px" }}>
          {/* spinner */}
          <span style={{ marginLeft: "10px" }}>Saving city...</span>
        </div>
      )}

      {error && (
        <p style={{ marginTop: "10px" }} aria-live="polite">
          {error}
        </p>
      )}
      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message === "City already added." ? "#ff4d6d" : "green",
            background: message === "City already added." ? "rgba(255,77,109,0.08)" : "rgba(0,255,0,0.08)",
            border: message === "City already added." ? "1px solid #ff4d6d" : "1px solid #b2f2bb",
            borderRadius: "8px",
            padding: "8px 14px",
            fontWeight: 500,
            fontSize: "1.1rem",
            display: "inline-block",
            transition: "background 0.2s, border 0.2s, color 0.2s",
            opacity: fade ? 0 : 1,

          }}
          aria-live="polite"
        >
          {message}
        </p>
      )}

      <h3 style={{ marginTop: "20px" }}>Cities Added:</h3>
      <CityList
        cities={cities}
        showDelete={true}
        loadingAction={loadingAction}
        username={username}
        fetchCities={fetchCities}
        setMessage={setMessage}
        setLoadingAction={setLoadingAction}
      />
    </div>
  );
}