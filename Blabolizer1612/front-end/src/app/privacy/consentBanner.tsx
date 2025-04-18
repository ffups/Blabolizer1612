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
    <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#eee", padding: "1rem", textAlign: "center", zIndex: 1000 }}>
      This site uses analytics to improve your experience.&nbsp;
      <button onClick={accept}>Accept</button>
      <button onClick={decline} style={{ marginLeft: "1rem" }}>Decline</button>
    </div>
  );
}