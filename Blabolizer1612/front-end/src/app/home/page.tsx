"use client";

import { useEffect, useState } from "react";
import NamePage from "../../components/onboarding&utils/name";
import CityManager from "@/components/city stuff/CityManager";

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
         <p>Ever wanted to travel but unsure where to go next?</p>
      <p>This tool aims to help this pressing problem by generating a random city from a list curated by you!</p>
      <p>All you need to do to get started is create a list of cities you would like to visit! Or choose from a preset :)</p>
      <p>hint: you can press on the city to get more information on it!</p>

      {!username ? (
        <NamePage onComplete={() => setUsername(localStorage.getItem("username"))} />
      ) : (
        <>
          <CityManager />
        </>
      )}
    </div>
  );
}
