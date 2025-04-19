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
      marginTop: "auto", // key for sticky-to-bottom in flex layouts
      position: "static", // not fixed!
      left: undefined,
      bottom: 0,
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