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
    if (consent) {
      if (typeof window !== "undefined" && window._paq) {
        window._paq.push([
          function (this: MatomoTrackerThis) {
            const id = this.getVisitorId?.();
            if (id) setVisitorId(id);
          },
        ]);
      }
    }
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
    <main>
      <h1>Privacy Policy</h1>
      <p>We track anonymized page views and usage data to improve the app. No personal data is stored. You can opt out at any time.</p>
      <p>You can opt out of analytics tracking below:</p>
      <iframe
        style={{ border: 0, height: 200, width: "100%" }}
        src="https://matomo.matomotes.me/index.php?module=CoreAdminHome&action=optOut&language=en"
        title="Matomo Opt-Out"
      ></iframe>

      <h2>Your Visitor Profile ID</h2>
      {consent === false ? (
        <p>You have declined analytics tracking, so no visitor ID is available.</p>
      ) : visitorId ? (
        <p>
          Your Matomo Visitor ID: <code>{visitorId}</code>
          <br />
          You can use this ID to request access to or erasure of your analytics data.
        </p>
      ) : (
        <p>Loading your visitor ID...</p>
      )}

      <h2>Request Your Data or Erasure</h2>
      {submitted ? (
        <p>Thank you! Your request has been received. We will process it as soon as possible.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <label>
            Your email or user ID:
            <input type="text" name="identifier" required style={{ marginLeft: "0.5rem" }} />
          </label>
          <br />
          <label>
            Request type:
            <select name="requestType" required style={{ marginLeft: "0.5rem" }}>
              <option value="access">Access/Export my data</option>
              <option value="erasure">Erase my data</option>
            </select>
          </label>
          <br />
          <button type="submit" style={{ marginTop: "0.5rem" }} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </main>
  );
}