import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { BookOpen, ExternalLink, Heart, Mail } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/mailerlite.functions";
import logoSB from "@/assets/logo-slowblues.png";

export function SiteFooter() {
  const { t } = useI18n();

  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [subMsg, setSubMsg] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubState("loading");
    try {
      const res = await subscribe({ data: { email } });
      if (res.ok) {
        setSubState("ok");
        setSubMsg("You're on the list. Next letter: Monday 21:00 CET.");
        setEmail("");
      } else {
        setSubState("err");
        setSubMsg(res.error);
      }
    } catch {
      setSubState("err");
      setSubMsg("Something went wrong. Please try again.");
    }
  }

    { to: "/history", label: t.nav.history },
    { to: "/artists", label: t.nav.artists },
    { to: "/styles", label: t.nav.styles },
    { to: "/instruments", label: "Instruments & Gear" },
    { to: "/listen", label: t.nav.listen },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/festivals", label: t.nav.festivals },
    { to: "/worldmap", label: t.nav.worldmap },
    { to: "/radio", label: t.nav.radio },
    { to: "/guestbook", label: t.nav.guestbook },
    { to: "/blog", label: t.nav.blog },
    { to: "/quiz", label: "Blues Quiz" },
    { to: "/about/merch", label: "Merch" },
    { to: "/compare", label: t.nav.compareStyles },
    { to: "/updates", label: t.nav.updates },
    { to: "/support", label: t.nav.support },
    { to: "/contact", label: t.nav.contact },
    { to: "/privacy", label: t.nav.privacy },
  ];

  const archives = [
    { name: "Library of Congress", url: "https://www.loc.gov/collections/?fa=subject:blues+%28music%29" },
    { name: "Alan Lomax Archive", url: "https://archive.culturalequity.org" },
    { name: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/Category:Blues" },
    { name: "Blues Foundation", url: "https://blues.org" },
  ];

  const books = [
    { name: "\"Deep Blues\" — Robert Palmer" },
    { name: "\"The History of the Blues\" — Francis Davis" },
  ];

  const related = [
    { name: "TheBluesLegacy.com", url: "https://thebluesleagacy.com" },
    { name: "Rock and Blues Muse", url: "https://rockandbluesmuse.com" },
    { name: "Paste Magazine Blues", url: "https://www.pastemagazine.com/music" },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-card/40">
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoSB} alt="SlowBlues.no" className="h-14 w-auto" />
            <div className="font-display text-xl">SLOWBLUES</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.desc}</p>
        </div>

        <div>
          <h3 className="font-display text-lg mb-4">{t.footer.explore}</h3>
          <ul className="space-y-1.5 text-sm">
            {explore.map((l) => (
              <li key={l.to}><Link to={l.to as any} className="text-muted-foreground hover:text-gold transition">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg mb-4">{t.footer.archives}</h3>
          <ul className="space-y-1.5 text-sm">
            {archives.map((a) => (
              <li key={a.name}>
                <a href={a.url} target="_blank" rel="noopener" className="text-muted-foreground hover:text-gold transition inline-flex items-center gap-1">
                  {a.name} <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg mb-4 inline-flex items-center gap-2">
            <BookOpen className="size-4 text-gold" /> {t.footer.further}
          </h3>
          <div className="text-[10px] tracking-[0.2em] text-gold mb-2">{t.footer.books}</div>
          <ul className="space-y-1 text-sm text-muted-foreground italic mb-5">
            {books.map((b) => <li key={b.name}>{b.name}</li>)}
          </ul>
          <div className="text-[10px] tracking-[0.2em] text-gold mb-2">{t.footer.related}</div>
          <ul className="space-y-1 text-sm">
            {related.map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noopener" className="text-muted-foreground hover:text-gold inline-flex items-center gap-1">
                  {r.name} <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-gold mb-2"><Mail className="size-4" /> <span className="font-display text-lg">{t.footer.newsletterTitle}</span></div>
          <p className="text-sm text-muted-foreground mb-4">{t.footer.newsletterDesc}</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
            {[t.footer.optBlog, t.footer.optReviews, t.footer.optFestivals, t.footer.optGlobal].map((o) => (
              <label key={o} className="flex items-center gap-2"><input defaultChecked type="checkbox" className="accent-[var(--color-gold)]" /> <span className="text-foreground/85">{o}</span></label>
            ))}
          </div>
          <form className="flex flex-col sm:flex-row gap-2 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <input required type="email" placeholder={t.footer.emailPlaceholder} className="flex-1 px-4 py-2.5 rounded-md bg-card border border-border focus:border-gold outline-none text-sm" />
            <button className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 text-sm">{t.footer.subscribe}</button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">{t.footer.privacyNote}</p>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        © {new Date().getFullYear()} SlowBlues. <Heart className="size-3 text-gold" /> {t.footer.rights}
        <span className="mx-2">·</span>
        <Link to="/login" className="hover:text-gold">Admin</Link>
      </div>
    </footer>
  );
}
