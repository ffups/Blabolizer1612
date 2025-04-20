"use client";

import { useRef, useEffect, useState } from "react";
import ProfilePicSelector from "@/components/onboarding&utils/ProfilePicSelector";
import { useUsername } from "@/context/UsernameContext";
import { usePathname } from "next/navigation";
import Image from "next/image";

const profilePics = [
  "/profile1.png",
  "/profile2.png",
  "/profile3.png"
];

export default function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedPic, setSelectedPic] = useState(profilePics[0]);
  const ignoreBlurRef = useRef(false);
  const { username, setUsername } = useUsername();
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // On first mount, prefer localStorage if available
    const stored = localStorage.getItem("username");
    if (stored) {
      setNewName(stored);
    } else {
      setNewName(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only runs on client
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) setSelectedPic(storedPic);
  }, []);

  useEffect(() => {
    setSelectedPic(localStorage.getItem("profilePic") || profilePics[0]);
  }, [username]);

  useEffect(() => {
    const handleUsernameUpdate = () => {
      const stored = localStorage.getItem("username") || "";
      if (!editing) setNewName(stored);
    };
    window.addEventListener("usernameUpdate", handleUsernameUpdate);
    return () => window.removeEventListener("usernameUpdate", handleUsernameUpdate);
  }, [editing]);

  useEffect(() => {
    // Whenever the route changes to this page, update newName
    if (pathname === "/profile") {
      const stored = localStorage.getItem("username");
      setNewName(stored ?? username);
    }
  }, [pathname, username]);

  useEffect(() => {
    const syncUsername = () => {
      const stored = localStorage.getItem("username") || "";
      if (!editing) setNewName(stored);
    };

    // Listen for changes from other tabs/windows
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "username") {
        syncUsername();
      }
    };

    // Listen for changes in this tab
    window.addEventListener("storage", handleStorage);
    window.addEventListener("usernameUpdate", syncUsername);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("usernameUpdate", syncUsername);
    };
  }, [editing]);

  // Adjust input width to fit content
  useEffect(() => {
    if (editing && spanRef.current && inputRef.current) {
      // Add some extra space (e.g., 16px)
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 16}px`;
    }
  }, [newName, editing]);

  const handlePicSelect = (pic: string) => {
    setSelectedPic(pic);
  };

  const handleEdit = () => {
    // Always get the latest username from localStorage or context
    const stored = localStorage.getItem("username");
    setNewName(stored ?? username);
    setEditing(true);
  };
  // Save to context and localStorage only when confirmed
  const handleNameSave = () => {
    if (newName.trim().length === 0) {
      // Always revert to the latest value in localStorage
      const stored = localStorage.getItem("username") || "";
      setNewName(stored);
      setUsername(stored);
      setEditing(false);
      return;
    }
    setEditing(false);
    setUsername(newName);
    localStorage.setItem("username", newName);
  };

  const handleBlur = () => {
    if (ignoreBlurRef.current) {
      ignoreBlurRef.current = false;
      return;
    }
    handleNameSave();
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, alignItems: "center", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ minWidth: 0, flex: 1, maxWidth: 300, display: "flex", alignItems: "center" }}>
          {editing ? (
            <>
              <input
                ref={inputRef}
                value={newName}
                onChange={e => {
                  // Only allow non-empty usernames to update everywhere
                  const value = e.target.value;
                  setNewName(value);
                  if (value.trim().length > 0) {
                    setUsername(value);
                    localStorage.setItem("username", value);
                    window.dispatchEvent(new Event("usernameUpdate"));
                  }
                }}
                onBlur={handleBlur}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    e.preventDefault();
                    if (newName.trim().length > 0) {
                      handleNameSave();
                    } else {
                      // Revert to previous username if empty
                      setNewName(username);
                      setEditing(false);
                    }
                  }
                }}
                autoFocus
                aria-label="Edit username"
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  background: "rgba(122, 47, 242, 0)",
                  borderRadius: "16px",
                  color: "#fff",
                  padding: "0 12px",
                  height: "48px",
                  boxSizing: "border-box",
                  outline: "none",
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  border: "none"
                }}
              />
              {/* Hidden span to measure text width */}
              <span
                ref={spanRef}
                style={{
                  position: "absolute",
                  visibility: "hidden",
                  height: 0,
                  overflow: "hidden",
                  whiteSpace: "pre",
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  padding: "0 12px",
                }}
              >
                {newName || ""}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                fontFamily: "inherit",
                background: "rgba(122, 47, 242, 0)",
                borderRadius: "16px",
                color: "#fff",
                padding: "0 12px",
                height: "48px",
                boxSizing: "border-box",
                outline: "none",
                minWidth: 0,
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                border: "none",
                position: "relative",
                top: "5px"
              }}
            >
              {username || "Not set"}
            </span>
          )}
        </div>
        <button
          onMouseDown={() => { ignoreBlurRef.current = true; }}
          onClick={editing ? handleNameSave : handleEdit}
          style={{
            fontSize: "1rem",
            padding: "0 16px",
            background: "rgba(25, 97, 112, 0.33)",
            border: "0px solid rgba(0, 0, 0, 0.6)",
            borderRadius: "24px",
            color: "#fff",
            cursor: "pointer",
            marginLeft: 8,
            transition: "background 0.2s, border 0.2s",
            lineHeight: "48px",
            fontWeight: "bold",
          }}
        >
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      <div style={{ margin: "24px 0"}}>
          <ProfilePicSelector selectedPic={selectedPic} onSelect={handlePicSelect} />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center"  }}>
            <Image
              src={selectedPic}
              width={48}      // <-- required
              height={48}
              alt="Selected profile"
              style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #7b2ff2" }}
            />
          </div>
        </div>
    </div>
  );
}