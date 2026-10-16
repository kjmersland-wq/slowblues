import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { Coffee, Heart, ShoppingBag, Share2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const WEAR_THE_BLUES_PRODUCT_URL = "https://merch.slow-blues.com/products/wear-the-blues-tee";

// Creem checkout links for the support buttons. PLACEHOLDERS: replace each with the real
// Creem payment link. One-time: one product per amount plus one pay-what-you-want product.
// Monthly: one subscription product per amount.
const SUPPORT_ONCE = [
  { eur: 3, href: "https://www.creem.io/payment/REPLACE_WITH_3_EUR_LINK" },
  { eur: 5, href: "https://www.creem.io/payment/REPLACE_WITH_5_EUR_LINK" },
  { eur: 10, href: "https://www.creem.io/payment/REPLACE_WITH_10_EUR_LINK" },
] as const;
const SUPPORT_ONCE_CUSTOM_HREF = "https://www.creem.io/payment/REPLACE_WITH_CUSTOM_AMOUNT_LINK";
const SUPPORT_MONTHLY = [
  { eur: 3, href: "https://www.creem.io/payment/REPLACE_WITH_3_EUR_MONTHLY_LINK" },
  { eur: 5, href: "https://www.creem.io/payment/REPLACE_WITH_5_EUR_MONTHLY_LINK" },
  { eur: 10, href: "https://www.creem.io/payment/REPLACE_WITH_10_EUR_MONTHLY_LINK" },
] as const;

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support SlowBlues — official merch" },
      { name: "description", content: "Independent archive, no owners. No display ads in artist articles. Merch funds hosting and research — wear the blues and support the archive." },
      { property: "og:title", content: "Support SlowBlues — official merch" },
      { property: "og:description", content: "Independent archive, no owners. No display ads in artist articles. Merch funds hosting and research — wear the blues and support the archive." },
      { property: "og:url", content: "https://www.slow-blues.com/support" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/support" }],
  }),
});

function SupportPage() {
  const { t, lang } = useI18n();

  async function handleShare() {
    const shareText = tr(lang, {
      no: "Uavhengig blueskultur — 360+ artistprofiler, anmeldelser og mer.",
      en: "Independent blues culture — 360+ artist profiles, reviews and more.",
      sv: "Oberoende blueskultur — 360+ artistprofiler, recensioner och mer.",
      de: "Unabhängige Blues-Kultur — 360+ Künstlerprofile, Rezensionen und mehr.",
      pl: "Niezależna kultura bluesowa — ponad 360 profili artystów, recenzje i więcej.",
    });
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SlowBlues — The Slow, Soulful Roots',
          text: shareText,
          url: 'https://www.slow-blues.com',
        });
      } catch {
        // User cancelled share — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText('https://www.slow-blues.com');
        toast.success(tr(lang, { no: "Lenke kopiert!", en: "Link copied!", sv: "Länk kopierad!", de: "Link kopiert!", pl: "Link skopiowany!" }));
      } catch {
        toast.error(tr(lang, { no: "Kunne ikke kopiere lenken", en: "Could not copy link", sv: "Kunde inte kopiera länken", de: "Link konnte nicht kopiert werden", pl: "Nie udało się skopiować linku" }));
      }
    }
  }

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.support.eyebrow} title={t.pages.support.title} lead={t.pages.support.lead} img={IMG.amp} />

      {/* Honest, short explainer */}
      <section className="max-w-3xl mx-auto px-6 pt-10 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-3">
          <ShieldCheck className="size-4" />
          {tr(lang, { no: "Uavhengig, uten baktanker", en: "Independent, no strings attached", sv: "Oberoende, utan baktankar", de: "Unabhängig, ohne Hintergedanken", pl: "Niezależni, bez ukrytych intencji" })}
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {tr(lang, {
            no: "SlowBlues er et uavhengig arkiv — ingen eiere bak seg, og ingen displayannonser i artistartiklene. Vi driver dette fordi vi elsker bluesen. Merch er det som faktisk holder arkivet i gang — hvert kjøp går rett til drift, research og nye artistprofiler.",
            en: "SlowBlues is an independent archive — no owners behind it, and no display ads in the artist articles. We run this because we love the blues. Merch is what actually keeps the archive going — every purchase goes straight to hosting, research and new artist profiles.",
            sv: "SlowBlues är ett oberoende arkiv — inga ägare bakom sig, och inga displayannonser i artistartiklarna. Vi driver det här för att vi älskar bluesen. Merch är det som faktiskt håller arkivet igång — varje köp går direkt till drift, research och nya artistprofiler.",
            de: "SlowBlues ist ein unabhängiges Archiv — keine Eigentümer dahinter und keine Display-Werbung in den Künstlerartikeln. Wir betreiben das, weil wir den Blues lieben. Merch ist es, was das Archiv tatsächlich am Laufen hält — jeder Kauf fließt direkt in Hosting, Recherche und neue Künstlerprofile.",
            pl: "SlowBlues to niezależne archiwum — bez właścicieli i bez reklam displayowych w artykułach o artystach. Prowadzimy to, bo kochamy bluesa. To merch faktycznie utrzymuje archiwum przy życiu — każdy zakup trafia bezpośrednio na hosting, research i nowe profile artystów.",
          })}
        </p>
      </section>

      {/* Merch — main CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="relative bg-card/60 border border-gold/40 rounded-2xl p-8 sm:p-10 text-center shadow-[0_0_60px_-30px_var(--color-gold)]">
          <div className="mx-auto size-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5">
            <ShoppingBag className="size-7 text-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            {tr(lang, { no: "Støtt oss ved å kjøpe merch", en: "Support us by buying merch", sv: "Stötta oss genom att köpa merch", de: "Unterstütze uns durch den Kauf von Merch", pl: "Wesprzyj nas, kupując gadżety" })}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-7">
            {tr(lang, {
              no: "T-skjorter, plakater, vinyl og handlenett — premium print-on-demand, sendt over hele verden.",
              en: "T-shirts, posters, vinyl and tote bags — premium print-on-demand, shipped worldwide.",
              sv: "T-shirts, affischer, vinyl och tygkassar — premium print-on-demand, skickas över hela världen.",
              de: "T-Shirts, Poster, Vinyl und Stoffbeutel — Premium-Print-on-Demand, weltweiter Versand.",
              pl: "Koszulki, plakaty, winyle i torby — druk na żądanie premium, wysyłka na cały świat.",
            })}
          </p>
          <a
            href={WEAR_THE_BLUES_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition shadow-lg shadow-gold/20"
          >
            {t.pages.support.buyMerch} <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Support — quiet one-time and monthly options under the merch block */}
      <section className="max-w-xl mx-auto px-6 pb-12">
        <div className="bg-card/40 border border-border rounded-2xl p-6 sm:p-8 text-center">
          <Coffee className="size-6 text-gold mx-auto mb-3" />
          <h3 className="font-display text-2xl mb-1">
            {tr(lang, { no: "Støtt SlowBlues", en: "Support SlowBlues", sv: "Stöd SlowBlues", de: "Unterstütze SlowBlues", pl: "Wesprzyj SlowBlues" })}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {tr(lang, {
              no: "En kaffe holder bluesen i live.",
              en: "A coffee keeps the blues alive.",
              sv: "En kaffe håller bluesen vid liv.",
              de: "Ein Kaffee hält den Blues am Leben.",
              pl: "Kawa utrzymuje bluesa przy życiu.",
            })}
          </p>

          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
            {tr(lang, { no: "Støtt én gang", en: "Support once", sv: "Stöd en gång", de: "Einmalig unterstützen", pl: "Wesprzyj jednorazowo" })}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SUPPORT_ONCE.map(({ eur, href }) => (
              <a
                key={eur}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-12 rounded-full border border-gold/40 bg-card/60 text-lg font-medium hover:bg-gold/10 hover:border-gold/70 transition"
              >
                €{eur}
              </a>
            ))}
            <a
              href={SUPPORT_ONCE_CUSTOM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-12 px-3 rounded-full border border-border bg-transparent text-sm text-muted-foreground hover:text-gold hover:border-gold/50 transition"
            >
              {tr(lang, { no: "Velg selv", en: "Choose your own", sv: "Välj själv", de: "Betrag selbst wählen", pl: "Wybierz kwotę" })}
            </a>
          </div>

          <div className="my-6 border-t border-border" />

          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
            {tr(lang, { no: "Støtt månedlig", en: "Support monthly", sv: "Stöd varje månad", de: "Monatlich unterstützen", pl: "Wspieraj miesięcznie" })}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {SUPPORT_MONTHLY.map(({ eur, href }) => (
              <a
                key={eur}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-12 rounded-full border border-gold/40 bg-card/60 font-medium hover:bg-gold/10 hover:border-gold/70 transition"
              >
                <span className="text-lg">€{eur}</span>
                <span className="ml-0.5 text-xs text-muted-foreground">
                  {tr(lang, { no: "/mnd", en: "/mo", sv: "/mån", de: "/Monat", pl: "/mies." })}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Share the site */}
      <section className="max-w-md mx-auto px-6 pb-12">
        <div className="bg-card/60 border border-border rounded-xl p-6 text-center hover:border-gold/50 transition">
          <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
            <Share2 className="size-6 text-gold" />
          </div>
          <h3 className="font-display text-2xl mb-2">{t.pages.support.shareTitle}</h3>
          <p className="text-sm text-muted-foreground mb-5">
            {tr(lang, {
              no: "Fortell en venn som fortsatt tror på bluesen.",
              en: "Tell a friend who still believes in the blues.",
              sv: "Berätta för en vän som fortfarande tror på bluesen.",
              de: "Erzähl es einem Freund, der noch an den Blues glaubt.",
              pl: "Powiedz o nas znajomemu, który wciąż wierzy w bluesa.",
            })}
          </p>
          <button
            onClick={handleShare}
            className="px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
          >
            {tr(lang, { no: "Del lenke", en: "Share link", sv: "Dela länk", de: "Link teilen", pl: "Udostępnij link" })}
          </button>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <Heart className="size-6 text-gold mx-auto mb-3" />
        <p className="text-muted-foreground italic">"The blues are the roots and the other musics are the fruits." — Willie Dixon</p>
      </section>
    </PageShell>
  );
}
