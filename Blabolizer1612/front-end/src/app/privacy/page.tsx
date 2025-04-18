export default function PrivacyPage() {
    return (
      <main>
        <h1>Privacy Policy</h1>
        <p>You can opt out of analytics tracking below:</p>
        <iframe
          style={{ border: 0, height: 200, width: "100%" }}
          src="https://matomo.matomotes.me/index.php?module=CoreAdminHome&action=optOut&language=en"
          title="Matomo Opt-Out"
        ></iframe>
      </main>
    );
  }