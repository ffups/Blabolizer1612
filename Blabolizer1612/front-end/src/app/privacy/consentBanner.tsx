"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConsentBanner({
  visible,
  onConsent,
  onDecline,
}: {
  visible: boolean;
  onConsent: () => void;
  onDecline: () => void;
}) {
  const [fading, setFading] = useState(false);
  const pathname = usePathname();

  // Hide banner on privacy policy page
  if (pathname === "/privacy") return null;
  if (!visible) return null;

  const handleClose = (callback?: () => void) => {
    setFading(true);
    setTimeout(() => {
      setFading(false);
      if (callback) callback();
    }, 700);
  };

  const accept = () => handleClose(onConsent);
  const decline = () => handleClose(onDecline);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #7b2ff2 0%,rgb(25, 98, 112) 100%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s ease"
      }}
    >
      <div style={{
        background: "linear-gradient(135deg, rgb(25, 98, 112) 0%, #7b2ff2 100%)",
        padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center"
      }}>
        <p style={{ marginBottom: "1.5rem", fontSize: "1.2rem", }}>
          This site uses analytics to improve your experience.<br />
          Please choose an option to continue.
        </p>
        <button onClick={accept}
          aria-label="Accept analytics tracking"
          style={{
            marginRight: "1rem",
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "none",
            background: "rgba(2, 168, 160, 0.51)"
          }}>Accept</button>
        <button onClick={decline}
          aria-label="Decline analytics tracking"
          style={{
            marginRight: "1rem",
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "rgba(2, 168, 160, 0.51)"
          }}>Decline</button>
      </div>
      <Footer />
    </div>
  );
}