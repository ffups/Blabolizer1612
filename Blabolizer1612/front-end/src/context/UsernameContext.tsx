"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UsernameContext = createContext<{
  username: string;
  setUsername: (name: string) => void;
}>({ username: "", setUsername: () => {} });

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
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