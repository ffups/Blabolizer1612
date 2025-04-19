"use client";

import { useEffect, useState } from "react";
import NamePage from "../pages/name";
import CityInput from "@/components/cityInput";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    const updateUsername = () => setUsername(localStorage.getItem("username"));
    window.addEventListener("usernameUpdate", updateUsername);
    return () => {
      window.removeEventListener("usernameUpdate", updateUsername);
    };
  }, []);

  return (
    <div>
        <Header />
      {!username ? (
        <NamePage onComplete={() => setUsername(localStorage.getItem("username"))} />
      ) : (
        <>
          <CityInput />
        </>
      )}
      <Footer/>
    </div>
  );
}
