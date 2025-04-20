"use client";

import Link from "next/link";
import Image from "next/image";
import { useUsername } from "@/context/UsernameContext"; // Import the context

export default function Header() {
  const { username } = useUsername(); // Use the context for username
  const profilePic = typeof window !== "undefined" ? localStorage.getItem("profilePic") : null;

  return (
    <header
      style={{
        top: 0,
        width: "100%",
        padding: "1rem 0",
        background: "rgba(122, 47, 242, 0)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0)",
      }}
      aria-label="Site header"
    >
      <nav
        aria-label="Main navigation"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
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
            gap: "0.75rem",
          }}
        >
          {profilePic && (
            <Image
              src={profilePic}
              alt="Profile"
              width={24}
              height={24}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fff",
                background: "#eee",
              }}
            />
          )}
          {username || "Not set"}
        </Link>
      </nav>
    </header>
  );
}