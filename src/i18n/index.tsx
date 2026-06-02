import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { dict, type Lang, type Dict } from "./dict";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const I18nContext = createContext<Ctx | null>(null);

const VALID: Lang[] = ["no", "en", "sv", "de", "pl"];

function readStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem("slowblues-lang") as Lang | null;
    return stored && VALID.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

function routeLangFromPath(pathname: string): Lang | null {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0] as Lang | undefined;
  if (first && VALID.includes(first)) return first;

  const isDefaultArtistRoute = parts[0] === "artists";
  if (isDefaultArtistRoute) return "no";

  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return routeLangFromPath(window.location.pathname) ?? readStoredLang() ?? "en";
  });

  useEffect(() => {
    const routeLang = routeLangFromPath(location.pathname);
    const nextLang = routeLang ?? readStoredLang() ?? lang;
    if (nextLang !== lang) {
      setLangState(nextLang);
    }
    try { document.documentElement.lang = nextLang; } catch {}
  }, [location.pathname, lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("slowblues-lang", l); } catch {}
    try { document.documentElement.lang = l; } catch {}
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export type { Lang };

/**
 * Tiny inline translator for strings that don't live in dict.ts.
 * Provides graceful fallbacks: pl → en, sv → no, de → en, missing → en → no.
 */
export function tr(
  lang: Lang,
  variants: { no: string; en: string; sv?: string; de?: string; pl?: string }
): string {
  if (lang === "no") return variants.no;
  if (lang === "sv") return variants.sv ?? variants.no;
  if (lang === "de") return variants.de ?? variants.en;
  if (lang === "pl") return variants.pl ?? variants.en;
  return variants.en;
}
