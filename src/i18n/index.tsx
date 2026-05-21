import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { dict, type Lang, type Dict } from "./dict";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("slowblues-lang") as Lang | null;
      if (stored && (stored === "no" || stored === "en" || stored === "de")) {
        setLangState(stored);
      }
    } catch {}
  }, []);

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
