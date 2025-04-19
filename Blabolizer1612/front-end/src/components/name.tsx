"use client";

import { useState, useEffect, FormEvent } from 'react';

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
  const [selectedPic, setSelectedPic] = useState<string>(() => localStorage.getItem("profilePic") || profilePics[0]);

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handlePicSelect = (pic: string) => {
    setSelectedPic(pic);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
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
          type="text"
          placeholder="name or something"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
          aria-label="Username"
          disabled={loading}
        />
        <div style={{ margin: "24px 0" }}>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>Choose a profile picture:</div>
          <div>
            {profilePics.map((pic) => (
              <button
                key={pic}
                type="button"
                onClick={() => handlePicSelect(pic)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  margin: "0 8px",
                  padding: 0,
                  lineHeight: 0, // removes extra space
                  outline: selectedPic === pic ? "2px solid #7b2ff2" : "1px solid #ccc",
                  borderRadius: "50%",
                  boxShadow: selectedPic === pic ? "0 0 0 2px #7b2ff2" : undefined,
                  transition: "outline 0.2s, box-shadow 0.2s"
                }}
                aria-label="Select profile picture"
              >
                <img
                  src={pic}
                  alt="Profile option"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "block",
                    border: selectedPic === pic ? "2px solid #7b2ff2" : "1px solid #ccc",
                    boxSizing: "border-box"
                  }}
                />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <img
              src={selectedPic}
              alt="Selected profile"
              style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #7b2ff2" }}
            />
          </div>
        </div>
        <button
          type="submit"
          style={{ padding: '10px 20px', fontSize: '16px' }}
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
        <p style={{ color: 'red', marginTop: '10px' }} aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
}
