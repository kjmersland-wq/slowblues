import { useEffect, useState } from "react";

// Google Analytics (GA4) only loads after the visitor accepts. The choice is remembered in
// localStorage so the banner is shown once. The KM TECH LABS counter is cookieless and not covered here.
export const CONSENT_KEY = "slowblues-analytics-consent-v1";
const GA_ID = "G-3PN8SCCST1";

type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function loadGa() {
  if (document.getElementById("ga4-script")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.id = "ga4-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "granted") loadGa();
    else if (choice === null) setOpen(true);
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // storage unavailable: choice only lasts for this page view
    }
    if (choice === "granted") loadGa();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Informasjonskapsler"
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center px-3 pb-3 sm:px-6 sm:pb-5 pointer-events-none"
    >
      <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-snug text-foreground/90">
          Vi bruker informasjonskapsler for å måle trafikk (Google Analytics).
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="h-10 flex-1 rounded-lg border border-border px-4 text-sm text-foreground/80 hover:bg-muted sm:flex-none"
          >
            Avslå
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="h-10 flex-1 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 sm:flex-none"
          >
            Godta
          </button>
        </div>
      </div>
    </div>
  );
}
