"use client";

import { useEffect, useState } from "react";
import NamePage from "../../components/name";
import CityInput from "@/components/cityInput";

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
      {!username ? (
        <NamePage onComplete={() => setUsername(localStorage.getItem("username"))} />
      ) : (
        <>
          <CityInput />
        </>
      )}
    </div>
  );
}
