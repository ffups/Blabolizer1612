// Example Footer.tsx
import Link from "next/link";
import AnimationToggle from "./AnimationToggle";

export default function Footer() {
  return (
    <footer
      style={{ textAlign: "center", padding: "1rem" }}
      aria-label="Site footer"
    >
      <Link href="/privacy" aria-label="Privacy Policy and Analytics Opt-Out">
        Privacy Policy & Opt-Out
      </Link>
      <AnimationToggle />
    </footer>
  );
}