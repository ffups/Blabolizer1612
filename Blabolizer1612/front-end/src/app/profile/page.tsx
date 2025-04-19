"use client";

import { useRef, useEffect, useState } from "react";
import ProfilePicSelector from "@/components/onboarding&utils/ProfilePicSelector";
import { useUsername } from "@/context/UsernameContext";

const profilePics = [
  "/profile1.png",
  "/profile2.png",
  "/profile3.png"
];

export default function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedPic, setSelectedPic] = useState<string>(() => localStorage.getItem("profilePic") || profilePics[0]);
  const ignoreBlurRef = useRef(false);
  const { username, setUsername } = useUsername();

  useEffect(() => {
    // Initialize with context username or localStorage
    setNewName(username || localStorage.getItem("username") || "");
    setSelectedPic(localStorage.getItem("profilePic") || profilePics[0]);
  }, [username]);

  const handlePicSelect = (pic: string) => {
    setSelectedPic(pic);
  };

  const handleEdit = () => setEditing(true);

  // Save to context and localStorage only when confirmed
  const handleNameSave = () => {
    setEditing(false);
    setUsername(newName); // live update everywhere
    localStorage.setItem("username", newName); // persist to storage
  };

  const handleBlur = () => {
    if (ignoreBlurRef.current) {
      ignoreBlurRef.current = false;
      return;
    }
    handleNameSave();
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ minWidth: 0, flex: 1, maxWidth: 300, display: "flex", alignItems: "center" }}>
          {editing ? (
            <input
              value={newName}
              onChange={e => {
                setNewName(e.target.value);
                setUsername(e.target.value); // live update context as you type
              }}
              onBlur={handleBlur}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === "Escape") {
                  e.preventDefault();
                  handleNameSave();
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
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                border: "none"
              }}
            />
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
            background: "rgba(0, 0, 0, 0.27)",
            border: "2px solid rgba(0, 0, 0, 0.6)",
            borderRadius: "24px",
            color: "#fff",
            cursor: "pointer",
            marginLeft: 8,
            transition: "background 0.2s, border 0.2s",
            lineHeight: "48px"
          }}
        >
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      <div style={{ margin: "32px 0 16px 0" }}>
        <ProfilePicSelector selectedPic={selectedPic} onSelect={handlePicSelect} />
      </div>
    </div>
  );
}