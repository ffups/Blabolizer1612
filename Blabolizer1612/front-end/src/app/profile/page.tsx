"use client";

import { useEffect, useState } from "react";

export default function UserProfile() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)",  }}>
      <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
      {username || "Not set"}
    </span>
      </div>
  );
}