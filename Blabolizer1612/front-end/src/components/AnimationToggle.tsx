"use client";
import { useEffect, useState } from "react";

export default function AnimationToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (enabled) {
      document.body.classList.remove("disable-animation");
      localStorage.setItem("bgAnimation", "enabled");
    } else {
      document.body.classList.add("disable-animation");
      localStorage.setItem("bgAnimation", "disabled");
    }
  }, [enabled]);

  useEffect(() => {
    const pref = localStorage.getItem("bgAnimation");
    if (pref === "disabled") setEnabled(false);
  }, []);

  return (
    <button
      style={{
        padding: "0.5rem 1.25rem",
        margin: "1rem",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "none",
        background: "#fff",
        color: "#7b2ff2",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        cursor: "pointer"
      }}
      onClick={() => setEnabled((v) => !v)}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable background animation" : "Enable background animation"}
    >
      {enabled ? "Disable" : "Enable"} Background Animation
    </button>
  );
}