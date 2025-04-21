"use client";

import { useEffect, useState } from "react";
import NamePage from "../../components/onboarding&utils/name";
import CityManager from "@/components/city stuff/CityManager";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [showNamePage, setShowNamePage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (!storedUsername) {
        setUsername(null);
        setShowNamePage(true);
        setLoading(false);
        return;
      }
      // Show loading while checking backend
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}api/userexists?name=${encodeURIComponent(storedUsername)}`)
        .then(res => res.json())
        .then(data => {
          if (data.exists) {
            setUsername(storedUsername);
            setShowNamePage(false);
          } else {
            setUsername(null);
            setShowNamePage(true);
            // Optionally clear invalid username from localStorage:
            localStorage.removeItem("username");
          }
        })
        .catch(() => {
          // On error, keep the previous state or show an error message
          setUsername(storedUsername);
          setShowNamePage(false);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateUsername = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
      setShowNamePage(!storedUsername);
    };
    window.addEventListener("usernameUpdate", updateUsername);
    return () => {
      window.removeEventListener("usernameUpdate", updateUsername);
    };
  }, []);

  if (loading) return null; // or a loading spinner

  return (
    <>
      {showNamePage ? (
        <NamePage
          onComplete={() => {
            const storedUsername = localStorage.getItem("username");
            setUsername(storedUsername);
            setShowNamePage(false);
          }}
        />
      ) : (
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
            padding: "0 24px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            background: "rgba(122, 47, 242, 0)",
          }}
        >
          <p
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              margin: "0.5rem 0",
              color: "#ffffff",
            }}
          >
            Ever wanted to travel but unsure where to go next?
          </p>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#ffffff" }}>
            This tool aims to help this pressing problem by generating a random city from a list curated by you!
          </p>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#ffffff" }}>
            All you need to do to get started is create a list of cities you would like to visit!
          </p>
          <p
            style={{
              fontSize: "1rem",
              fontStyle: "italic",
              color: "#ffffff",
              marginBottom: "1.5rem",
            }}
          >
            hint: you can press on the city to get more information on it!
          </p>
          {username && <CityManager />}
        </div>
      )}
    </>
  );
}
