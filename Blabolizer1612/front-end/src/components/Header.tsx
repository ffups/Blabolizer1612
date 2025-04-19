import Link from "next/link";
import UsernameDisplay from "./usernameDisplay";

export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        padding: "1rem 0",
        background: "rgba(122, 47, 242, 0)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0)",
        marginBottom: "2rem",
      }}
      aria-label="Site header"
    >
      <nav
        aria-label="Main navigation"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem" // sensible gap between nav items
        }}
      >
        <Link
          href="/"
          aria-label="Go to homepage"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "6px",
            background: "rgba(25,98,112,0.7)",
          }}
        >
          Home
        </Link>
        {/* Add more buttons/links here as needed */}
        <Link
          href="/profile"
          aria-label="Go to profile page"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "0.5rem 1.5rem",
            borderRadius: "6px",
            background: "rgba(25,98,112,0.7)",
          }}>
        <UsernameDisplay />
        </Link>

      </nav>
    </header>
  );
}