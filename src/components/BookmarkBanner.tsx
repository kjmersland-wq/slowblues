import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, X } from "lucide-react";
import { useI18n, type Lang } from "@/i18n";

// Modern browsers removed the old window.external.AddFavorite / window.sidebar
// APIs that used to let a page add itself to bookmarks -- there is no
// programmatic bookmark API left in any current browser. The only honest UI
// here is a hint for the manual shortcut, shown once per visitor (remembered
// via localStorage, functioning the same way a preference cookie would) and
// dismissible any time.
const STORAGE_KEY = "slowblues-bookmark-banner-dismissed-v1";
const SHOW_DELAY_MS = 4000;

type Copy = { message: string; shortcut: string; dismiss: string };

const COPY: Record<Lang, Copy> = {
  no: { message: "Bokmerk Slow-Blues for å finne tilbake senere", shortcut: "Trykk Ctrl+D (⌘+D på Mac)", dismiss: "Lukk" },
  en: { message: "Bookmark Slow-Blues to find your way back", shortcut: "Press Ctrl+D (⌘+D on Mac)", dismiss: "Dismiss" },
  sv: { message: "Bokmärk Slow-Blues för att hitta tillbaka senare", shortcut: "Tryck Ctrl+D (⌘+D på Mac)", dismiss: "Stäng" },
  de: { message: "Setze ein Lesezeichen für Slow-Blues", shortcut: "Drücke Strg+D (⌘+D auf dem Mac)", dismiss: "Schließen" },
  pl: { message: "Dodaj Slow-Blues do zakładek, by łatwo wrócić", shortcut: "Naciśnij Ctrl+D (⌘+D na Macu)", dismiss: "Zamknij" },
};

export function BookmarkBanner() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const t = COPY[lang] ?? COPY.en;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // if storage is unavailable, still show it once per page load
    }
    const id = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore -- worst case it shows again next visit
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-0 z-[90] flex justify-center px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none"
        >
          <div
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gold/30 bg-card/95 backdrop-blur-md px-4 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] max-w-md w-full sm:w-auto"
          >
            <div className="shrink-0 size-9 rounded-full grid place-items-center bg-gold/15 border border-gold/30 text-gold">
              <Bookmark className="size-4" />
            </div>
            <div className="flex-1 min-w-0 text-sm">
              <div className="text-foreground/90 font-medium leading-snug">{t.message}</div>
              <div className="text-xs text-gold/80 mt-0.5">{t.shortcut}</div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.dismiss}
              className="shrink-0 p-1.5 rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10 transition"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
