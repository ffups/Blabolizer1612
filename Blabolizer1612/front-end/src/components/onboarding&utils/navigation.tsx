
import { useRouter } from "next/navigation";

export default function NavigationButtons() {
    const router = useRouter();

    return (
        <div             className="nav-buttons-mobile"
        style={{ display: "flex", gap: 12, margin: "16px 0" }}>
            <button
                onClick={() => router.back()}
                style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    position: "relative",
                    border: "none",
                    background: "rgba(25,98,112,0.7)",
                    color: "#fff",
                    cursor: "pointer",
                }}
            >
            <span
                    style={{
                        position: "relative",
                        bottom: "3px",}}
                >
                    ←
                </span>
            </button>
            <button
                onClick={() => window.history.forward()}
                style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    border: "none",
                    background: "rgba(25,98,112,0.7)",
                    color: "#fff",
                    cursor: "pointer",
                }}
            >
                 <span
                    style={{
                        position: "relative",
                        bottom: "3px",}}
                >
                     →
                </span>
            </button>
            <style>
                {`
                @media (max-width: 600px) {
                    .nav-buttons-mobile {
                        margin: 0 !important;
                    }
                }
                `}
            </style>
        </div>
    );
}