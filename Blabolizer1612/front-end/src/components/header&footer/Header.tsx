"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUsername } from "@/context/UsernameContext"; // Import the context
import NavigationButtons from "@/components/onboarding&utils/navigation";

export default function Header() {
  const { username } = useUsername(); // Use the context for username
  const [profilePic, setProfilePic] = React.useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("profilePic") : null
  );

  React.useEffect(() => {
    const handleProfilePicUpdate = () => {
      setProfilePic(localStorage.getItem("profilePic"));
    };
    window.addEventListener("profilePicUpdate", handleProfilePicUpdate);
    return () => {
      window.removeEventListener("profilePicUpdate", handleProfilePicUpdate);
    };
  }, []);

  return (
    <header
      style={{
        top: 0,
        maxWidth: "100%",
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
        <style>
          {`
            @media (max-width: 600px) {
              .header-nav {
                flex-direction: column !important;
                gap: 0.75rem !important;
                align-items: stretch !important;
              }
              .header-link {
                width: 100%;
                justify-content: center;
                text-align: center;
              }
              .nav-buttons-mobile {
                order: 2;
                justify-content: center;
                display: flex;
                    margin: 0 !important;   
                               padding: 0 !important; /* Reduce padding on mobile */


              }
                          .nav-buttons-mobile button {
        font-size: 2.1rem !important; 
           padding: 4px 8px !important; /* Reduce padding on mobile */
    margin: 0 !important;   
    
      }
              .home-link-mobile {
                order: 0;
              }
            }
          `}
        </style>
        <div className="header-nav" style={{ display: "flex", alignItems: "center", gap: "1.5rem", width: "100%" }}>

          <div className="nav-buttons-mobile">
            <NavigationButtons />
          </div>
          <Link
            href="/home"
            aria-label="Go to homepage"
            className="header-link home-link-mobile"

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
            className="header-link"

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
        </div>

      </nav>
    </header>
  );
}