// Example Footer.tsx
import Link from "next/link";
import AnimationToggle from "./AnimationToggle";

export default function Footer() {
  return (
    <footer
    style={{
      textAlign: "center",
      padding: "1rem",
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100%",
      zIndex: 100,
      boxShadow: "0 -2px 8px rgba(0,0,0,0.04)"
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