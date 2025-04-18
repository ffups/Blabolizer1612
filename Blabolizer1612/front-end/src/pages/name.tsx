"use client";

import { useState, useEffect, FormEvent } from 'react';

export default function NamePage() {
  const [name, setName] = useState<string>(''); // State for the name input
  const [greeting, setGreeting] = useState<string>(''); // State for the greeting message
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Load the username from local storage when the component mounts
  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      // Log the raw response for debugging
      const text = await response.text();
      console.log('Raw response:', text);

      // Parse the response as JSON
      const result = JSON.parse(text);

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setGreeting(`Hello, ${name}!`);
      localStorage.setItem('username', name); // Save the username to local storage
      window.dispatchEvent(new Event("usernameUpdate")); // Dispatch username update event
      setName(''); // Clear the input field
      setError(null); // Clear any previous errors
    } catch (error: unknown) { // Use `unknown` instead of `any`
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  function setErrorMessage(message: string) {
    setError(message); // Update the error state
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name or something"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
          boop
        </button>
      </form>
      {greeting && <p style={{ marginTop: '20px', fontSize: '20px' }}>{greeting}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}
