import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { createSupportCheckout } from "@/lib/support.functions";
import { Heart, ShoppingBag, Share2, Coffee, Music, Star, Crown, ArrowRight, Smartphone } from "lucide-react";
import { toast } from "sonner";

const VIPPS_NUMBER = "47255113"; // +47 47255113

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support SlowBlues" },
      { name: "description", content: "Keep the blues alive — support SlowBlues through merch, donations, Vipps, or by sharing with fellow blues fans." },
      { property: "og:title", content: "Support SlowBlues" },
      { property: "og:description", content: "Keep the blues alive — support SlowBlues through merch, donations, Vipps, or by sharing with fellow blues fans." },
      { property: "og:url", content: "https://www.slow-blues.com/support" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/support" }],
  }),
});

function SupportPage() {
  const { t, lang } = useI18n();

  function scrollToSupportLevels() {
    document.getElementById('support-levels')?.scrollIntoView({ behavior: 'smooth' });
  }

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

  const startCheckout = useServerFn(createSupportCheckout);

  async function handleSupport(level: 'blues-friend' | 'blues-supporter' | 'blues-patron') {
    try {
      const data = await startCheckout({ data: { level, origin: window.location.origin } });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(tr(lang, { no: "Kunne ikke starte betalingen. Prøv igjen.", en: "Could not start checkout. Please try again.", sv: "Det gick inte att starta betalningen. Försök igen.", de: "Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuchen Sie es erneut.", pl: "Nie udało się rozpocząć płatności. Spróbuj ponownie." }));
      }
    } catch (err) {
      toast.error(tr(lang, { no: "Betalingen kunne ikke startes. Prøv igjen.", en: "Payment initiation failed. Please try again.", sv: "Betalningen kunde inte startas. Försök igen.", de: "Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.", pl: "Nie udało się zainicjować płatności. Spróbuj ponownie." }));
      console.error('Support payment error:', err);
    }
  }

  function handleVipps(amount: number) {
    const url = `vipps://send?phone=${VIPPS_NUMBER}&amount=${amount}&comment=SlowBlues`;
    window.location.href = url;
    setTimeout(() => {
      toast.message('Vipps', {
        description: tr(lang, {
          no: `Åpne Vipps på mobil og send til +47 ${VIPPS_NUMBER} (kr ${amount})`,
          en: `Open Vipps on your phone and send to +47 ${VIPPS_NUMBER} (${amount} NOK)`,
          sv: `Öppna Vipps i mobilen och skicka till +47 ${VIPPS_NUMBER} (${amount} NOK)`,
          de: `Öffne Vipps auf dem Handy und sende an +47 ${VIPPS_NUMBER} (${amount} NOK)`,
          pl: `Otwórz Vipps na telefonie i wyślij na +47 ${VIPPS_NUMBER} (${amount} NOK)`,
        }),
      });
    }, 800);
  }

  const supportTiers = [
    {
      icon: Music,
      name: 'Blues Friend',
      level: 'blues-friend',
      amount: 50,
      currency: 'NOK',
      desc: tr(lang, {
        no: "Spander en kaffe på oss. Navnet ditt havner på støtteveggen.",
        en: "Buy us a coffee. Your name goes on the supporters wall.",
        sv: "Bjud oss på en kaffe. Ditt namn hamnar på stödmuren.",
        de: "Spendiere uns einen Kaffee. Dein Name landet an der Unterstützerwand.",
        pl: "Postaw nam kawę. Twoje imię trafi na ścianę wspierających.",
      }),
      highlight: false,
    },
    {
      icon: Star,
      name: 'Blues Supporter',
      level: 'blues-supporter',
      amount: 150,
      currency: 'NOK',
      desc: tr(lang, {
        no: "Hold serverne i gang. Tidlig tilgang til nye funksjoner + støttevegg.",
        en: "Keep the servers running. Early access to new features + supporters wall.",
        sv: "Håll servrarna igång. Tidig tillgång till nya funktioner + stödmur.",
        de: "Halte die Server am Laufen. Früher Zugriff auf neue Funktionen + Unterstützerwand.",
        pl: "Utrzymuj serwery w ruchu. Wczesny dostęp do nowych funkcji + ściana wspierających.",
      }),
      highlight: true,
    },
    {
      icon: Crown,
      name: 'Blues Patron',
      level: 'blues-patron',
      amount: 500,
      currency: 'NOK',
      desc: tr(lang, {
        no: "Bli patron. Alle fordeler + en personlig takk i nyhetsbrevet.",
        en: "Become a patron. All perks + a personal thank-you in the newsletter.",
        sv: "Bli patron. Alla förmåner + ett personligt tack i nyhetsbrevet.",
        de: "Werde Patron. Alle Vorteile + ein persönliches Dankeschön im Newsletter.",
        pl: "Zostań patronem. Wszystkie korzyści + osobiste podziękowanie w newsletterze.",
      }),
      highlight: false,
    },
  ];

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.support.eyebrow} title={t.pages.support.title} lead={t.pages.support.lead} img={IMG.amp} />

      {/* Be Part of the Movement */}
      <section id="support-levels" className="max-w-5xl mx-auto px-6 pt-12">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
            {tr(lang, { no: "Bli en del av bevegelsen", en: "Be Part of the Movement", sv: "Bli en del av rörelsen", de: "Werde Teil der Bewegung", pl: "Dołącz do ruchu" })}
          </div>
          <h2 className="font-display text-4xl md:text-5xl">{tr(lang, { no: "Støtt bluesen", en: "Support the blues", sv: "Stötta bluesen", de: "Unterstütze den Blues", pl: "Wesprzyj bluesa" })}</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            {tr(lang, {
              no: "SlowBlues er uavhengig — ingen annonser, ingen bedriftsstøtte. Bidraget ditt holder arkivet i live og lar det vokse.",
              en: "SlowBlues is independent — no ads, no corporate backing. Your contribution keeps the archive alive and growing.",
              sv: "SlowBlues är oberoende — inga annonser, inget företagsstöd. Ditt bidrag håller arkivet vid liv och låter det växa.",
              de: "SlowBlues ist unabhängig — keine Werbung, keine Unternehmensunterstützung. Dein Beitrag hält das Archiv am Leben und lässt es wachsen.",
              pl: "SlowBlues jest niezależny — bez reklam, bez wsparcia korporacyjnego. Twój wkład utrzymuje archiwum przy życiu i pozwala mu rosnąć.",
            })}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {supportTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-card/60 border rounded-xl p-6 text-center transition hover:border-gold/50 ${
                tier.highlight ? 'border-gold/60 ring-1 ring-gold/20' : 'border-border'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-primary-foreground text-[10px] font-semibold tracking-wide uppercase">
                  {tr(lang, { no: "Mest populær", en: "Most Popular", sv: "Mest populär", de: "Am beliebtesten", pl: "Najpopularniejsze" })}
                </div>
              )}
              <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <tier.icon className="size-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-1">{tier.name}</h3>
              <div className="text-3xl font-display text-gold mb-3">
                {tier.amount} <span className="text-lg text-muted-foreground">{tier.currency}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{tier.desc}</p>
              <button
                onClick={() => handleSupport(tier.level as 'blues-friend' | 'blues-supporter' | 'blues-patron')}
                className="w-full px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition flex items-center justify-center gap-2"
              >
                {tr(lang, { no: "Kort / Stripe", en: "Card / Stripe", sv: "Kort / Stripe", de: "Karte / Stripe", pl: "Karta / Stripe" })} <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => handleVipps(tier.amount)}
                className="mt-2 w-full px-5 py-2.5 rounded-md border border-gold/40 text-gold font-medium hover:bg-gold/10 transition flex items-center justify-center gap-2"
              >
                <Smartphone className="size-4" /> Vipps {tier.amount} kr
              </button>
              <div className="mt-2 text-[11px] text-muted-foreground">Vipps: +47 {VIPPS_NUMBER}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Action cards */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: ShoppingBag,
            title: t.pages.support.buyMerch,
            desc: tr(lang, {
              no: "T-skjorter, plakater, vinyl og handlenett.",
              en: "T-shirts, posters, vinyl and tote bags.",
              sv: "T-shirts, affischer, vinyl och tygkassar.",
              de: "T-Shirts, Poster, Vinyl und Stoffbeutel.",
              pl: "Koszulki, plakaty, winyle i torby.",
            }),
            cta: tr(lang, { no: "Åpne butikken", en: "Open shop", sv: "Öppna butiken", de: "Shop öffnen", pl: "Otwórz sklep" }),
            action: 'merch' as const,
          },
          {
            icon: Coffee,
            title: t.pages.support.donate,
            desc: tr(lang, {
              no: "Spander en kaffe på oss — holder serverne i gang.",
              en: "Buy us a coffee — keeps the servers running.",
              sv: "Bjud oss på en kaffe — håller servrarna igång.",
              de: "Spendiere uns einen Kaffee — hält die Server am Laufen.",
              pl: "Postaw nam kawę — utrzymuje serwery w ruchu.",
            }),
            cta: tr(lang, { no: "Doner", en: "Donate", sv: "Donera", de: "Spenden", pl: "Wesprzyj" }),
            action: 'donate' as const,
          },
          {
            icon: Share2,
            title: t.pages.support.shareTitle,
            desc: tr(lang, {
              no: "Fortell en venn som fortsatt tror på bluesen.",
              en: "Tell a friend who still believes in the blues.",
              sv: "Berätta för en vän som fortfarande tror på bluesen.",
              de: "Erzähl es einem Freund, der noch an den Blues glaubt.",
              pl: "Powiedz o nas znajomemu, który wciąż wierzy w bluesa.",
            }),
            cta: tr(lang, { no: "Del lenke", en: "Share link", sv: "Dela länk", de: "Link teilen", pl: "Udostępnij link" }),
            action: 'share' as const,
          },
        ].map((c) => (
          <div key={c.title} className="bg-card/60 border border-border rounded-xl p-6 text-center hover:border-gold/50 transition">
            <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4"><c.icon className="size-6 text-gold" /></div>
            <h3 className="font-display text-2xl mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">{c.desc}</p>
            {c.action === 'merch' ? (
              <Link
                to="/about/merch"
                className="inline-block px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
              >
                {c.cta}
              </Link>
            ) : c.action === 'donate' ? (
              <button
                onClick={scrollToSupportLevels}
                className="px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
              >
                {c.cta}
              </button>
            ) : (
              <button
                onClick={handleShare}
                className="px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
              >
                {c.cta}
              </button>
            )}
          </div>
        ))}
      </section>
      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <Heart className="size-6 text-gold mx-auto mb-3" />
        <p className="text-muted-foreground italic">"The blues are the roots, everything else is the fruits." — Willie Dixon</p>
      </section>
    </PageShell>
  );
}
