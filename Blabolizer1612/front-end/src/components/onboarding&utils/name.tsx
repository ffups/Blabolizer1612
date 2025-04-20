"use client";

import { useRef, useState, useEffect, FormEvent } from 'react';
import ProfilePicSelector from "@/components/onboarding&utils/ProfilePicSelector";
import Image from "next/image";

const profilePics = [
  "/profile1.png",
  "/profile2.png",
  "/profile3.png"
];

export default function NamePage({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fading, setFading] = useState(false);
  const [selectedPic, setSelectedPic] = useState<string>(profilePics[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem('username');
      if (savedName) {
        setName(savedName);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPic = localStorage.getItem("profilePic");
      if (storedPic) setSelectedPic(storedPic);
    }
  }, []);

  const handlePicSelect = (pic: string) => {
    setSelectedPic(pic);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (name.trim().length <= 0) {
      setError("Username must be at least 1 character.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setGreeting(`Hello, ${name}!`);
      setError(null);
      setLoading(false);

      // After greeting is shown, start fade-out, then save username and profilePic and notify parent
      setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          localStorage.setItem('username', name);
          localStorage.setItem('profilePic', selectedPic);
          window.dispatchEvent(new Event("usernameUpdate"));
          onComplete();
        }, 1000); // Match the transition duration
      }, 1000); // Show greeting for 1 second before fading out
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        opacity: fading ? 0 : 1,
        transition: 'opacity 1s ease'
      }}
    >
      <h1>Username</h1>
      <form onSubmit={handleSubmit} aria-label="Username form">
        <label htmlFor="username-input" style={{ display: "none" }}>
          Enter your username
        </label>
        <input
          id="username-input"
          ref={inputRef}
          type="text"
          placeholder="name or something"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "14px 18px",
            fontSize: "1.15rem",
            borderRadius: "12px",
            border: "0px solid #7b2ff2",
            outline: "none",
            background: "rgba(122, 47, 242, 0.14)",
            color: "#fff",
            marginRight: "10px",
            marginBottom: "8px",
            boxSizing: "border-box",
            fontWeight: 500,
            transition: "border 0.2s, background 0.2s",
          }}
          aria-label="Username"
          disabled={loading}
        />
        <style>
          {`
            input::placeholder {
              color: #fff;
              opacity: 1;
              font-weight: 500;
            }
          `}
        </style>
        <div style={{ margin: "24px 0" }}>
          <ProfilePicSelector selectedPic={selectedPic} onSelect={handlePicSelect} />
          <div style={{ marginTop: 16 }}>
            <Image
              src={selectedPic}
              width={48}      // <-- required
              height={48}
              alt="Selected profile"
              style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #7b2ff2" }}
            />
          </div>
        </div>
        <button
          type="submit"
          style={{
            padding: "1rem 2.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #7b2ff2 0%, rgb(25, 98, 112) 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            transition: "background 0.2s, box-shadow 0.2s",
            marginTop: "12px",
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
          aria-label="Submit username"
          disabled={loading}
        >
          boop
        </button>
      </form>
      {loading && (
        <div style={{ marginTop: '20px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '3px solid #7b2ff2',
              borderTop: '3px solid #eee',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}</style>
          <p>Checking username...</p>
        </div>
      )}
      {greeting && (
        <p style={{ marginTop: '20px', fontSize: '20px' }} aria-live="polite">
          {greeting}
        </p>
      )}
      {error && (
        <p style={{ color: '#fff', marginTop: '10px', padding: '8px 16px', borderRadius: '4px' }} aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
}
