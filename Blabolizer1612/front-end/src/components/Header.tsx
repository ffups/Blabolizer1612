import Link from "next/link";

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
      <nav aria-label="Main navigation">
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
            marginRight: "1rem"
          }}
        >
          Home
        </Link>
        {/* Add more buttons/links here as needed */}
      </nav>
    </header>
  );
}