"use client";

import { useState, FormEvent } from 'react';

export default function NamePage() {
  const [name, setName] = useState<string>(''); // Explicitly type the state as a string
  const [greeting, setGreeting] = useState<string>(''); // Explicitly type the state as a string

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setGreeting(`Hello, ${name}!`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>What's your name?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
          Submit
        </button>
      </form>
      {greeting && <p style={{ marginTop: '20px', fontSize: '20px' }}>{greeting}</p>}
    </div>
  );
}