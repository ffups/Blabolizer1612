"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import ConsentBanner from "./privacy/consentBanner";
import ScrollToTop from "@/components/onboarding&utils/ScrollToTop";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<null | boolean>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("matomoConsent");
      if (stored === "true") setConsent(true);
      else if (stored === "false") setConsent(false);
      else setConsent(null);
    }
  }, []);

  return (
    <>
          <ScrollToTop />

      {consent === null && (
        <ConsentBanner
          onConsent={() => {
            localStorage.setItem("matomoConsent", "true");
            setConsent(true);
          }}
          onDecline={() => {
            localStorage.setItem("matomoConsent", "false");
            setConsent(false);
          }}
        />
      )}
      {consent === true && (
        <Script id="matomo" strategy="afterInteractive">
          {`
            var _paq = window._paq = window._paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://matomo.matomotes.me/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '1']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
        </Script>
      )}
      {children}
    </>
  );
}