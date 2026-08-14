import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/i18n";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoSB from "@/assets/logo-slowblues.png";
import { artistDetailPath, artistsListPath } from "@/lib/locale";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "no", label: "NO", flag: "🇳🇴" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "sv", label: "SV", flag: "🇸🇪" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "pl", label: "PL", flag: "🇵🇱" },
];

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [langOpen]);

  const activeLang = LANGS.find((l) => l.code === lang) ?? LANGS[1];

  const switchLanguage = (nextLang: Lang) => {
    setLang(nextLang);
    setLangOpen(false);

    const detailMatch = location.pathname.match(/^\/(?:([a-z]{2})\/)?artists\/([^/]+)$/i);
    if (detailMatch) {
      void navigate({ to: artistDetailPath(nextLang, detailMatch[2]) as any });
      return;
    }

    const listMatch = location.pathname.match(/^\/(?:([a-z]{2})\/)?artists\/?$/i);
    if (listMatch) {
      void navigate({ to: artistsListPath(nextLang) as any });
    }
  };

  type Item = { to: string; label: string };
  const groups: { key: string; label: string; items: Item[] }[] = [
    { key: "artists", label: t.nav.artists, items: [
      { to: "/artists", label: t.nav.artists },
      { to: "/updates", label: t.nav.updates },
    ]},
    { key: "learn", label: t.nav.learn, items: [
      { to: "/history", label: t.nav.history },
      { to: "/styles", label: t.nav.styles },
      { to: "/compare", label: t.nav.compareStyles },
      { to: "/instruments", label: t.nav.instruments },
      { to: "/learn/gear", label: t.nav.gear },
    ]},
    { key: "experience", label: t.nav.experience, items: [
      { to: "/listen", label: t.nav.listen },
      { to: "/watch", label: t.nav.watch },
      { to: "/radio", label: t.nav.radio },
      { to: "/gallery", label: t.nav.gallery },
      { to: "/festivals", label: t.nav.festivals },
      { to: "/worldmap", label: t.nav.worldmap },
      { to: "/quiz", label: t.nav.quiz },
    ]},
    { key: "about", label: t.nav.about, items: [
      { to: "/guestbook", label: t.nav.guestbook },
      { to: "/about/merch", label: t.nav.merch },
      { to: "/about/advertise", label: t.nav.advertise },
      { to: "/support", label: t.nav.support },
      { to: "/contact", label: t.nav.contact },
      { to: "/privacy", label: t.nav.privacy },
    ]},
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/85 border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <img src={logoSB} alt="Slow-Blues.com — Global Blues Encyclopedia" className="h-9 sm:h-11 w-auto shrink-0" />
          <div className="hidden sm:block min-w-0">
            <div className="font-display text-lg tracking-wide leading-none truncate">SLOWBLUES</div>
            <div className="text-[9px] tracking-[0.22em] text-muted-foreground uppercase mt-1 truncate">{t.header.tagline}</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <Link to="/" className="px-3 py-1.5 rounded-md hover:text-gold transition" activeOptions={{ exact: true }} activeProps={{ className: "px-3 py-1.5 rounded-md bg-gold/10 text-gold" }}>
            {t.nav.home}
          </Link>
          {groups.map((g) => (
            <div key={g.key} className="relative" onMouseEnter={() => setMenu(g.key)} onMouseLeave={() => setMenu(null)}>
              <button className="px-3 py-1.5 rounded-md hover:text-gold transition inline-flex items-center gap-1">
                {g.label} <ChevronDown className="size-3" />
              </button>
              {menu === g.key && (
                <div className="absolute left-0 top-full pt-2 min-w-[200px]">
                  <div className="bg-card border border-border rounded-md py-2 shadow-xl">
                    {g.items.map((it) => (
                      <Link key={it.to} to={it.to as any} className="block px-4 py-2 text-sm hover:bg-gold/10 hover:text-gold transition">
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link to={"/reviews" as any} className="px-3 py-1.5 rounded-md hover:text-gold transition" activeProps={{ className: "px-3 py-1.5 rounded-md bg-gold/10 text-gold" }}>
            {t.nav.reviews}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={langRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t.nav.language}
              onClick={() => setLangOpen((o) => !o)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border/60 hover:border-gold/60 text-xs sm:text-sm transition"
            >
              <span className="text-base leading-none">{activeLang.flag}</span>
              <span className="font-semibold">{activeLang.label}</span>
              <ChevronDown className="size-3" />
            </button>
            {langOpen && (
              <ul role="listbox" className="absolute right-0 top-full mt-1 min-w-[120px] bg-card border border-border rounded-md py-1 shadow-xl z-50">
                {LANGS.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === l.code}
                       onClick={() => switchLanguage(l.code)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gold/10 hover:text-gold transition ${lang === l.code ? "text-gold font-semibold" : ""}`}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link to="/search" aria-label={t.nav.search} className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold">
            <Search className="size-4" aria-hidden="true" /> {t.nav.search}
          </Link>
          <button className="lg:hidden p-1 -mr-1" aria-label={t.nav.menu} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-4 text-sm">
            <div className="flex flex-wrap gap-2 pb-3 mb-3 border-b border-border">
              <Link to="/" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-full bg-card border border-gold/20 hover:border-gold hover:text-gold">
                {t.nav.home}
              </Link>
              <Link to={"/reviews" as any} onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-full bg-gold/15 border border-gold text-gold font-semibold">
                {t.nav.reviews}
              </Link>
              <Link to="/search" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-full bg-card border border-gold/20 hover:border-gold hover:text-gold flex items-center gap-1.5">
                <Search className="size-3.5" aria-hidden="true" /> {t.nav.search}
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {groups.map((g) => (
                <div key={g.key}>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gold/70 mb-1.5">{g.label}</div>
                  <div className="flex flex-col">
                    {g.items.map((it) => (
                      <Link key={it.to} to={it.to as any} onClick={() => setOpen(false)} className="py-1.5 hover:text-gold">
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
