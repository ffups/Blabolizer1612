"use client";
import { useState, useEffect } from "react";

export default function ConsentBanner({ onConsent }: { onConsent: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("matomoConsent")) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("matomoConsent", "true");
    setVisible(false);
    onConsent();
  };

  const decline = () => {
    localStorage.setItem("matomoConsent", "false");
    setVisible(false);
    // Optionally, you can call a callback here if you want to handle declines
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #7b2ff2 0%,rgb(25, 98, 112) 100%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{
        background: "linear-gradient(135deg, rgb(25, 98, 112) 0%, #7b2ff2 100%)",
        padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center"
      }}>
        <p style={{ marginBottom: "1.5rem", fontSize: "1.2rem", }}>
          This site uses analytics to improve your experience.<br />
          Please choose an option to continue.
        </p>
        <button onClick={accept}
          style={{
            marginRight: "1rem",
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "none",
            background: "rgba(2, 168, 160, 0.51)"

          }}>Accept</button>
        <button onClick={decline}
          style={{
            marginRight: "1rem",
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "rgba(2, 168, 160, 0.51)"

          }}>Decline</button>
      </div>
    </div>
  );
}