"use client";

import { useEffect, useState } from "react";
import NamePage from "../pages/name";
import UsernameDisplay from "../components/usernameDisplay";
import CityInput from "@/components/cityInput";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setCity(localStorage.getItem("city"));
  }, []);

  useEffect(() => {
    const updateUsername = () => setUsername(localStorage.getItem("username"));
    const updateCity = () => setCity(localStorage.getItem("city"));
    window.addEventListener("usernameUpdate", updateUsername);
    window.addEventListener("cityUpdate", updateCity);
    return () => {
      window.removeEventListener("usernameUpdate", updateUsername);
      window.removeEventListener("cityUpdate", updateCity);
    };
  }, []);

  if (!username) {
    return <NamePage />;
  }
  if (!city) {
    return (
      <>
        <UsernameDisplay />
        <CityInput />
      </>
    );
  }
  return (
    <div>
      <UsernameDisplay />
      <p>Welcome, {username} from {city}!</p>
      {/* Render the rest of your app here */}
    </div>
  );
}
