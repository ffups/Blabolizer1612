"use client";

import { createContext, useContext, useState, useEffect } from "react";

type UsernameContextType = {
  username: string;
  setUsername: (name: string) => void;
};

const UsernameContext = createContext<UsernameContextType>({
  username: "",
  setUsername: () => {},
});

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const syncUsername = () => {
      const stored = localStorage.getItem("username") || "";
      setUsername(stored);
    };

    // Initial load
    syncUsername();

    // Listen for custom event and storage changes
    window.addEventListener("usernameUpdate", syncUsername);
    window.addEventListener("storage", (e) => {
      if (e.key === "username") syncUsername();
    });

    return () => {
      window.removeEventListener("usernameUpdate", syncUsername);
      window.removeEventListener("storage", syncUsername);
    };
  }, []);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  return useContext(UsernameContext);
}