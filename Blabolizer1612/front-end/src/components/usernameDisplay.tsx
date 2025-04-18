"use client";

import { useEffect, useState } from "react";

export default function UsernameDisplay() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Load the initial username from localStorage
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername);

    // Listen for changes to localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "username") {
        setUsername(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add a custom event listener for same-tab updates
  useEffect(() => {
    const handleSameTabUpdate = () => {
      const updatedUsername = localStorage.getItem("username");
      setUsername(updatedUsername);
    };

    window.addEventListener("usernameUpdate", handleSameTabUpdate);

    return () => {
      window.removeEventListener("usernameUpdate", handleSameTabUpdate);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      {username ? ` ${username}` : "No user logged in"}
    </div>
  );
}