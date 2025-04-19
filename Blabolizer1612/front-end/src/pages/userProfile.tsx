"use client";

import { useEffect, useState } from "react";

export default function UserProfile() {
  const [username, setUsername] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setCity(localStorage.getItem("city"));
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", background: "#fff" }}>
      <h1 style={{ marginBottom: 24 }}>User Profile</h1>
      <div style={{ marginBottom: 16 }}>
        <strong>Username:</strong> {username || "Not set"}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>City:</strong> {city || "Not set"}
      </div>
      {/* Add more profile info or actions here */}
    </div>
  );
}