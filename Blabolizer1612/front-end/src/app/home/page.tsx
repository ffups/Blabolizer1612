"use client";

import { useEffect, useState } from "react";
import NamePage from "../../components/onboarding&utils/name";
import CityManager from "@/components/city stuff/CityManager";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // safe to use localStorage
      setUsername(localStorage.getItem("username"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateUsername = () => setUsername(localStorage.getItem("username"));
    window.addEventListener("usernameUpdate", updateUsername);
    return () => {
      window.removeEventListener("usernameUpdate", updateUsername);
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        background: "rgba(122, 47, 242, 0)", // match your profile box background
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
        All you need to do to get started is create a list of cities you would like to visit! Or choose from a preset :)
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
      {!username ? (
        <NamePage onComplete={() => setUsername(localStorage.getItem("username"))} />
      ) : (
        <CityManager />
      )}
    </div>
  );
}
