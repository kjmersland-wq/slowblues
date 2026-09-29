import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { Heart, ShoppingBag, Share2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const WEAR_THE_BLUES_PRODUCT_URL = "https://merch.slow-blues.com/products/wear-the-blues-tee";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support SlowBlues — official merch" },
      { name: "description", content: "No ads, no owners. Official merch is what keeps this archive alive — wear the blues and support the archive with official merch." },
      { property: "og:title", content: "Support SlowBlues — official merch" },
      { property: "og:description", content: "No ads, no owners. Official merch is what keeps this archive alive — wear the blues and support the archive with official merch." },
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
            no: "SlowBlues har ingen annonser og ingen eiere bak seg. Vi driver dette fordi vi elsker bluesen. Merch er det som faktisk holder arkivet i gang — hvert kjøp går rett til server, research og nye artistprofiler.",
            en: "SlowBlues has no ads and no owners behind it. We run this because we love the blues. Merch is what actually keeps the archive going — every purchase goes straight to hosting, research and new artist profiles.",
            sv: "SlowBlues har inga annonser och inga ägare bakom sig. Vi driver det här för att vi älskar bluesen. Merch är det som faktiskt håller arkivet igång — varje köp går direkt till hosting, research och nya artistprofiler.",
            de: "Hinter SlowBlues stehen keine Werbung und keine Eigentümer. Wir betreiben das, weil wir den Blues lieben. Merch ist es, was das Archiv tatsächlich am Laufen hält — jeder Kauf fließt direkt in Hosting, Recherche und neue Künstlerprofile.",
            pl: "Za SlowBlues nie stoją żadne reklamy ani właściciele. Prowadzimy to, bo kochamy bluesa. To merch faktycznie utrzymuje archiwum przy życiu — każdy zakup trafia bezpośrednio na hosting, research i nowe profile artystów.",
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
        <p className="text-muted-foreground italic">"The blues are the roots, everything else is the fruits." — Willie Dixon</p>
      </section>
    </PageShell>
  );
}
