"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUsername } from "@/context/UsernameContext";

export default function Header() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { username } = useUsername();

  useEffect(() => {
    setProfilePic(localStorage.getItem("profilePic"));
    const handleUpdate = () => setProfilePic(localStorage.getItem("profilePic"));
    window.addEventListener("usernameUpdate", handleUpdate);
    return () => window.removeEventListener("usernameUpdate", handleUpdate);
  }, []);

  return (
    <header
      style={{
        width: "100%",
        padding: "1rem 0",
        background: "rgba(122, 47, 242, 0)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0)",
        marginBottom: "2rem",
      }}
      aria-label="Site header"
    >
      <nav
        aria-label="Main navigation"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem" // sensible gap between nav items
        }}
      >
        <Link
          href="/home"
          aria-label="Go to homepage"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "6px",
            background: "rgba(25,98,112,0.7)",
          }}
        >
          Home
        </Link>
        {/* Add more buttons/links here as needed */}
        <Link
  href="/profile"
  aria-label="Go to profile page"
  style={{
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.2rem",
    padding: "0.5rem 1.5rem",
    borderRadius: "6px",
    background: "rgba(25,98,112,0.7)",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  }}
>
  {profilePic && (
    <img
      src={profilePic}
      alt="Profile"
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #fff",
        background: "#eee"
      }}
    />
  )}
 {username || "Not set"}
</Link>

      </nav>
    </header>
  );
}