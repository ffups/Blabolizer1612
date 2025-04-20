"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/header&footer/Footer";

export default function ConsentBanner({
  onConsent,
  onDecline,
}: {
  onConsent: () => void;
  onDecline: () => void;
}) {
  const [fading, setFading] = useState(false);
  const pathname = usePathname();

  // Hide banner on privacy policy page
  if (pathname === "/privacy") return null;

  const handleClose = (callback?: () => void) => {
    setFading(true);
    setTimeout(() => {
      setFading(false);
      if (callback) callback();
    }, 700);
  };
  const accept = () => {
    window.dispatchEvent(new Event("consentGiven"));
    handleClose(onConsent);
  };
  const decline = () => {
    window.dispatchEvent(new Event("consentGiven"));
    handleClose(onDecline);
  };
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
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s ease"
      }}
    > 
    <style>
    {`
      @media (max-width: 600px) {
        .consent-center-box {
          padding: 1rem !important;
          width: 90vw !important;
          min-width: 0 !important;
          font-size: 1rem !important;
        }
        .consent-btn {
          width: 50% !important;
      margin: 0 auto 0.5rem auto !important; /* Center horizontally */
          font-size: 1.1rem !important;
          padding: 0.8rem 0 !important;
          display: block !important;
        }
        .consent-btn:last-child {
          margin-bottom: 0 !important;
        }
      }
    `}
  </style>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div 
                className="consent-center-box"
        style={{
          background: "linear-gradient(135deg, rgb(25, 98, 112) 0%, #7b2ff2 100%)",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <p style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            This site uses analytics to improve your experience.<br />
            Please choose an option to continue.
          </p>
          <button onClick={accept}
            aria-label="Accept analytics tracking"
            className="consent-btn"
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
            className="consent-btn"
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
      </div>
      <Footer />
    </div>
  );
}