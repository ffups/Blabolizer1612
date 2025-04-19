import React from "react";
import Image from "next/image";

const profilePics = [
  "/profile1.png",
  "/profile2.png",
  "/profile3.png"
];

export default function ProfilePicSelector({
  selectedPic,
  onSelect
}: {
  selectedPic: string;
  onSelect: (pic: string) => void;
}) {
  const handleSelect = (pic: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profilePic", pic);
      window.dispatchEvent(new Event("usernameUpdate"));
    }
    if (onSelect) onSelect(pic);
  };

  return (
    <div>
      <div style={{ marginBottom: 8, fontWeight: "bold" }}>Change your profile picture:</div>
      {profilePics.map((pic) => (
        <button
          key={pic}
          type="button"
          onClick={() => handleSelect(pic)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            margin: "0 8px",
            padding: 0,
            lineHeight: 0, // removes extra space
            outline: selectedPic === pic ? "2px solid #7b2ff2" : "1px solid #ccc",
            borderRadius: "50%",
            boxShadow: selectedPic === pic ? "0 0 0 2px #7b2ff2" : undefined,
            transition: "outline 0.2s, box-shadow 0.2s"
          }}
          aria-label="Select profile picture"
        >
           <Image
                  src={pic}
                  alt="Profile option"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "block",
                    border: selectedPic === pic ? "2px solid #7b2ff2" : "1px solid #ccc",
                    boxSizing: "border-box"
                  }}
                />
        </button>
      ))}
    </div>
  );
}