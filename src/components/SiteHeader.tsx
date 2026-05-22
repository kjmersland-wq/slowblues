import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/i18n";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logoSB from "@/assets/logo-slowblues.png";

const LANGS: { code: Lang; label: string }[] = [
  { code: "no", label: "NO" },
  { code: "en", label: "EN" },
  { code: "sv", label: "SV" },
  { code: "de", label: "DE" },
];

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

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
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logoSB} alt="SlowBlues.no — Global Blues Encyclopedia" className="h-11 w-auto" />
          <div className="hidden sm:block">
            <div className="font-display text-lg tracking-wide leading-none">SLOWBLUES</div>
            <div className="text-[9px] tracking-[0.22em] text-muted-foreground uppercase mt-1">{t.header.tagline}</div>
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
        <div className="lg:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-5 py-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Link to="/" onClick={() => setOpen(false)} className="py-2 hover:text-gold">{t.nav.home}</Link>
            {groups.flatMap((g) => g.items).map((it) => (
              <Link key={it.to} to={it.to as any} onClick={() => setOpen(false)} className="py-2 hover:text-gold">{it.label}</Link>
            ))}
            <Link to={"/reviews" as any} onClick={() => setOpen(false)} className="py-2 hover:text-gold">{t.nav.reviews}</Link>
            <div className="col-span-full flex gap-1 pt-3 border-t border-border mt-2">
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} className={`px-3 py-1.5 rounded ${lang === l.code ? "bg-gold text-primary-foreground" : "bg-card"}`}>{l.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
