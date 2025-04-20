"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    _paq?: Array<unknown>;
  }
}

interface MatomoTrackerThis {
  getVisitorId?: () => string;
}

export default function PrivacyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("matomoConsent");
      if (stored === "true") setConsent(true);
      else if (stored === "false") setConsent(false);
      else setConsent(null);
    }
  }, []);

  useEffect(() => {
    if (!consent) return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window._paq) {
        window._paq.push([
          function (this: MatomoTrackerThis) {
            const id = this.getVisitorId?.();
            if (id) {
              setVisitorId(id);
              clearInterval(interval);
            }
          },
        ]);
      }
      attempts++;
      if (attempts >= maxAttempts) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [consent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const identifier = (form.identifier as HTMLInputElement).value.trim();
    // const requestType = (form.requestType as HTMLSelectElement).value;

    if (!/^[\w@.\-]{4,}$/.test(identifier)) {
      setError("Please enter a valid email or user ID.");
      return;
    }

    const lastRequest = localStorage.getItem("gdprRequestTime");
    if (lastRequest && Date.now() - Number(lastRequest) < 24 * 60 * 60 * 1000) {
      setError("You can only submit one request per day.");
      return;
    }

    setLoading(true);

    // Example: send to backend (uncomment and adjust URL as needed)
    // const res = await fetch("/api/gdpr", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ identifier, requestType }),
    // });
    // if (!res.ok) {
    //   setError("There was a problem processing your request.");
    //   setLoading(false);
    //   return;
    // }

    localStorage.setItem("gdprRequestTime", Date.now().toString());
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main   style={{
      maxWidth: 500,
      margin: "0 auto",
      padding: "0 24px",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      background: "rgba(122, 47, 242, 0)",
    }}>
      <h1>Privacy Policy</h1>
      <p>I track anonymized page views and usage data to improve the app. <br />
      (and because I was required for this project :bunnysweat:)
         <br /> No personal data is stored. <br />
         You can opt out at any time.</p>
      <iframe
        style={{
          border: "2px solid #ccc",
          borderRadius: "8px",
          height: 150,
          width: "80%",
          margin: "1rem 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
        src="https://matomo.matomotes.me/index.php?module=CoreAdminHome&action=optOut&language=en"
        title="Matomo Opt-Out"
        aria-label="Matomo analytics opt-out form"
      ></iframe>

      <h2>Your Visitor Profile ID</h2>
      {consent === false ? (
        <p aria-live="polite">You have declined analytics tracking, so no visitor ID is available.</p>
      ) : visitorId ? (
        <p aria-live="polite">
          Your Matomo Visitor ID: <code>{visitorId}</code>
          <br />
          You can use this ID to request access to or erasure of your analytics data.
        </p>
      ) : (
        <p aria-live="polite">Loading your visitor ID...</p>
      )}

      <h2>Request Your Data or Erasure</h2>
      {submitted ? (
        <p aria-live="polite"> I will process it as soon as possible(maybe tomorrow, maybe not).</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <label>
            Your Visitor ID:
            <input
              aria-label="Your Matomo Visitor ID"
              type="text"
              name="identifier"
              required style={{ marginLeft: "0.5rem" }} />
          </label>
          <br />
          <label>
            Request type:
            <select
              aria-label="Type of GDPR request"
              name="requestType"
              required
              style={{ marginLeft: "0.5rem" }}>
              <option value="access">Access/Export my data</option>
              <option value="erasure">Erase my data</option>
              <option value="erasure">Change my data</option>
            </select>
          </label>
          <br />
          <button type="submit"
            aria-label="Submit GDPR request"
            style={{ marginTop: "0.5rem" }}
            disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {error && <p style={{ color: "red" }} aria-live="polite">{error}</p>}
        </form>
      )}
      </main>
  );
}