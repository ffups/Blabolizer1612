// Example Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "1rem" }}>
      <Link href="/privacy">Privacy Policy & Opt-Out</Link>
    </footer>
  );
}