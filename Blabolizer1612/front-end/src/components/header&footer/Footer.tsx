// Example Footer.tsx
import Link from "next/link";
import AnimationToggle from "../onboarding&utils/AnimationToggle";

export default function Footer() {
  return (
    <footer
    style={{
      textAlign: "center",
      padding: "1rem",
      width: "100%",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
      left: undefined,
      position: "fixed", // Add this line
        bottom: 0,         // Stick to the bottom
      zIndex: 100,
    }}
      aria-label="Site footer"
    >
      <Link href="/privacy" aria-label="Privacy Policy and Analytics Opt-Out">
        Privacy Policy & Opt-Out
      </Link>
      <AnimationToggle />
    </footer>
  );
}