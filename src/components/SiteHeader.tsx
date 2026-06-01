import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/i18n";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoSB from "@/assets/logo-slowblues.png";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "no", label: "NO", flag: "🇳🇴" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "sv", label: "SV", flag: "🇸🇪" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "pl", label: "PL", flag: "🇵🇱" },
];

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();
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
      { to: "/instruments", label: "Instruments & Gear" },
      { to: "/learn/gear", label: t.nav.gear },
    ]},
    { key: "experience", label: t.nav.experience, items: [
      { to: "/listen", label: t.nav.listen },
      { to: "/watch", label: "Watch (YouTube)" },
      { to: "/radio", label: t.nav.radio },
      { to: "/gallery", label: t.nav.gallery },
      { to: "/festivals", label: t.nav.festivals },
      { to: "/worldmap", label: t.nav.worldmap },
      { to: "/quiz", label: "Blues Quiz" },
    ]},
    { key: "about", label: t.nav.about, items: [
      { to: "/blog", label: t.nav.blog },
      { to: "/newsletter", label: "Newsletter" },
      { to: "/guestbook", label: t.nav.guestbook },
      { to: "/about/merch", label: "Merch" },
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
          <img src={logoSB} alt="SlowBlues.no — Global Blues Encyclopedia" className="h-9 sm:h-11 w-auto shrink-0" />
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
          <div className="flex items-center gap-0.5 text-[11px] sm:text-xs">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                aria-label={`Språk: ${l.label}`}
                className={`px-1.5 sm:px-2 py-1 rounded transition ${lang === l.code ? "bg-gold text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold">
            <Search className="size-4" /> {t.nav.search}
          </button>
          <button className="lg:hidden p-1 -mr-1" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
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
