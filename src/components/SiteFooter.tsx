import { Link } from "@tanstack/react-router";
import { useI18n, tr } from "@/i18n";
import { BookOpen, ExternalLink, Heart, Building2, MessageSquare, Mail } from "lucide-react";
import logoSB from "@/assets/logo-slowblues-448.webp";

export function SiteFooter() {
  const { t, lang } = useI18n();
  const supportLabel = tr(lang, { no: "Support", en: "Support", sv: "Support", de: "Support", pl: "Wsparcie" });
  const privacyLabel = tr(lang, { no: "Personvernerklæring", en: "Privacy Policy", sv: "Integritetspolicy", de: "Datenschutzerklärung", pl: "Polityka prywatności" });
  const termsLabel = tr(lang, { no: "Vilkår for bruk", en: "Terms of Service", sv: "Användarvillkor", de: "Nutzungsbedingungen", pl: "Regulamin serwisu" });

  const explore: { to: any; label: string }[] = [
    { to: "/history", label: t.nav.history },
    { to: "/artists", label: t.nav.artists },
    { to: "/styles", label: t.nav.styles },
    { to: "/instruments", label: t.nav.instruments },
    { to: "/listen", label: t.nav.listen },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/festivals", label: t.nav.festivals },
    { to: "/worldmap", label: t.nav.worldmap },
    { to: "/radio", label: t.nav.radio },
    { to: "/guestbook", label: t.nav.guestbook },
    { to: "/quiz", label: t.nav.quiz },
    { to: "/about/merch", label: t.nav.merch },
    { to: "/support", label: t.nav.support },
  ];

  const legal: { to: any; label: string }[] = [
    { to: "/about", label: t.footer.aboutLink },
    { to: "/contact", label: t.nav.contact },
    { to: "/privacy", label: privacyLabel },
    { to: "/terms", label: termsLabel },
    { to: "/gdpr", label: "GDPR & Data Protection" },
    { to: "/cookies", label: "Cookie Policy" },
    { to: "/disclaimer", label: "Disclaimer" },
    { to: "/accessibility", label: "Accessibility Statement" },
    { to: "/copyright", label: "Copyright Notice" },
  ];

  const archives = [
    { name: "Library of Congress", url: "https://www.loc.gov/collections/?fa=subject:blues+%28music%29" },
    { name: "Alan Lomax Archive", url: "https://archive.culturalequity.org" },
    { name: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/Category:Blues" },
    { name: "Blues Foundation", url: "https://blues.org" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-card/40" aria-labelledby="site-footer-heading">
      <h2 id="site-footer-heading" className="sr-only">Footer</h2>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img src={logoSB} alt="SlowBlues logo" className="h-14 w-auto" />
            <span className="font-display text-xl">SLOWBLUES</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t.footer.desc}</p>
          <div className="text-xs text-muted-foreground/90 space-y-1 not-italic" itemScope itemType="https://schema.org/Organization">
            <div className="flex items-center gap-1.5 text-gold mb-1.5">
              <Building2 className="size-3.5" aria-hidden="true" />
              <span className="tracking-[0.2em] text-[10px] uppercase">{t.footer.publisher}</span>
            </div>
            <div itemProp="parentOrganization" className="font-medium text-foreground/90">KM TECH LABS — Kjell Mersland</div>
            <div>{t.footer.orgNr} <span itemProp="taxID">934 044 029</span></div>
            <div>{t.footer.editorInCharge} <span itemProp="publisher">Kjell Mersland</span></div>
            <div className="flex items-center gap-1.5 pt-1">
              <Mail className="size-3.5 text-gold" aria-hidden="true" />
              <span>{supportLabel}:</span>
              <a href="mailto:support@slow-blues.com" itemProp="email" className="text-foreground/90 hover:text-gold underline-offset-4 hover:underline">support@slow-blues.com</a>
            </div>
          </div>
        </div>

        <nav aria-label={t.footer.explore}>
          <h3 className="font-display text-lg mb-4">{t.footer.explore}</h3>
          <ul className="space-y-1.5 text-sm">
            {explore.map((l) => (
              <li key={l.to}><Link to={l.to as any} className="text-muted-foreground hover:text-gold transition focus:outline-none focus-visible:text-gold focus-visible:underline">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.legalAriaLabel}>
          <h3 className="font-display text-lg mb-4">{t.footer.legalHeading}</h3>
          <ul className="space-y-1.5 text-sm">
            {legal.map((l) => (
              <li key={l.to}><Link to={l.to as any} className="text-muted-foreground hover:text-gold transition focus:outline-none focus-visible:text-gold focus-visible:underline">{l.label}</Link></li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground transition text-xs font-medium tracking-wide"
          >
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {t.footer.contactCta}
          </Link>
        </nav>

        <div>
          <h3 className="font-display text-lg mb-4 inline-flex items-center gap-2">
            <BookOpen className="size-4 text-gold" aria-hidden="true" /> {t.footer.archives}
          </h3>
          <ul className="space-y-1.5 text-sm mb-6">
            {archives.map((a) => (
              <li key={a.name}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition inline-flex items-center gap-1">
                  {a.name} <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 px-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-center">
          © {year} <span className="text-foreground/80">KM TECH LABS</span> · Slow-Blues.com <Heart className="size-3 text-gold" aria-hidden="true" /> {t.footer.rights}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link to="/copyright" className="hover:text-gold">© Copyright</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="hover:text-gold">{privacyLabel}</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms" className="hover:text-gold">{termsLabel}</Link>
          <span aria-hidden="true">·</span>
          <a href="mailto:support@slow-blues.com" className="hover:text-gold">support@slow-blues.com</a>
          <span aria-hidden="true">·</span>
          <Link to="/login" className="hover:text-gold">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
