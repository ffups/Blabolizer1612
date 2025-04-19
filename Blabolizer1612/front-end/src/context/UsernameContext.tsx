"use client";

import { createContext, useContext, useState } from "react";

const UsernameContext = createContext<{
  username: string;
  setUsername: (name: string) => void;
}>({ username: "", setUsername: () => {} });

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState(
    () => (typeof window !== "undefined" ? localStorage.getItem("username") || "" : "")
  );

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  return useContext(UsernameContext);
}