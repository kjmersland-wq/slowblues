import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { createSupportCheckout } from "@/lib/support.functions";
import { Coffee, Heart, ShoppingBag, Share2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const WEAR_THE_BLUES_PRODUCT_URL = "https://merch.slow-blues.com/products/wear-the-blues-tee";

const QUICK_ADD = [5, 10, 20] as const;

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

      {/* Support box — amount, quick picks, monthly toggle, one button */}
      <section className="max-w-xl mx-auto px-6 pb-12">
        <SupportBox />
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

function SupportBox() {
  const { lang } = useI18n();
  const [amount, setAmount] = useState("5");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    setThanks(new URLSearchParams(window.location.search).get("success") === "true");
  }, []);

  const value = Number(amount.replace(",", "."));
  const valid = Number.isFinite(value) && value >= 1 && value <= 1000;

  async function startCheckout() {
    if (!valid || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const { url } = await createSupportCheckout({
        data: { amount: value, monthly, name: name.trim(), message: message.trim(), lang },
      });
      window.location.assign(url);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  const field = "w-full rounded-2xl border border-transparent bg-muted/50 px-4 text-base outline-none placeholder:text-muted-foreground focus:border-gold/60";

  return (
    <div className="bg-card/40 border border-border rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-2">
        <Coffee className="size-5 text-gold shrink-0" />
        <h3 className="font-display text-2xl">
          {tr(lang, { no: "Støtt SlowBlues", en: "Support SlowBlues", sv: "Stöd SlowBlues", de: "Unterstütze SlowBlues", pl: "Wesprzyj SlowBlues" })}
        </h3>
      </div>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">
        {tr(lang, {
          no: "En kaffe holder bluesen i live.",
          en: "A coffee keeps the blues alive.",
          sv: "En kaffe håller bluesen vid liv.",
          de: "Ein Kaffee hält den Blues am Leben.",
          pl: "Kawa utrzymuje bluesa przy życiu.",
        })}
      </p>

      {thanks && (
        <p role="status" className="mb-4 rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">
          {tr(lang, { no: "Takk for støtten!", en: "Thank you for your support!", sv: "Tack för ditt stöd!", de: "Danke für deine Unterstützung!", pl: "Dziękujemy za wsparcie!" })}
        </p>
      )}

      {/* Amount with quick picks on the same row */}
      <div
        className={
          "flex items-center gap-2 rounded-2xl bg-muted/50 pl-4 pr-2 min-h-14 border " +
          (valid ? "border-transparent focus-within:border-gold/60" : "border-destructive/60")
        }
      >
        <span aria-hidden="true" className="text-lg font-semibold">€</span>
        <label htmlFor="support-amount" className="sr-only">
          {tr(lang, { no: "Beløp i euro", en: "Amount in euro", sv: "Belopp i euro", de: "Betrag in Euro", pl: "Kwota w euro" })}
        </label>
        <input
          id="support-amount"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={amount}
          placeholder={tr(lang, { no: "Skriv inn beløp", en: "Enter amount", sv: "Ange belopp", de: "Betrag eingeben", pl: "Wpisz kwotę" })}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, "").slice(0, 6))}
          aria-invalid={!valid}
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <div className="flex shrink-0 gap-1.5">
          {QUICK_ADD.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setAmount(String(Math.min(1000, Math.round(((Number.isFinite(value) ? value : 0) + n) * 100) / 100)))}
              className="min-h-10 min-w-11 px-2.5 rounded-xl border border-border bg-card/70 text-sm font-medium transition hover:border-gold/60 hover:bg-gold/10"
            >
              +{n}
            </button>
          ))}
        </div>
      </div>

      <label htmlFor="support-name" className="sr-only">
        {tr(lang, { no: "Navn eller sosial konto", en: "Name or social handle", sv: "Namn eller socialt konto", de: "Name oder Social-Handle", pl: "Imię lub profil" })}
      </label>
      <input
        id="support-name"
        type="text"
        maxLength={60}
        autoComplete="off"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={tr(lang, { no: "Navn eller @sosialt", en: "Name or @yoursocial", sv: "Namn eller @socialt", de: "Name oder @deinprofil", pl: "Imię lub @profil" })}
        className={field + " mt-3 min-h-14"}
      />

      <label htmlFor="support-message" className="sr-only">
        {tr(lang, { no: "Melding", en: "Message", sv: "Meddelande", de: "Nachricht", pl: "Wiadomość" })}
      </label>
      <textarea
        id="support-message"
        rows={4}
        maxLength={300}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={tr(lang, { no: "Skriv noe fint …", en: "Say something nice…", sv: "Skriv något fint …", de: "Sag etwas Nettes …", pl: "Napisz coś miłego…" })}
        className={field + " mt-3 py-3.5 resize-none"}
      />

      <label className="mt-4 flex items-center gap-3 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={monthly}
          onChange={(e) => setMonthly(e.target.checked)}
          className="size-5 rounded border-border accent-[var(--color-gold)]"
        />
        {tr(lang, { no: "Gjør dette månedlig", en: "Make this monthly", sv: "Gör detta månatligt", de: "Monatlich wiederholen", pl: "Wspieraj co miesiąc" })}
      </label>

      <button
        type="button"
        onClick={startCheckout}
        disabled={!valid || busy}
        className="mt-5 flex w-full items-center justify-center min-h-12 rounded-full bg-gold text-primary-foreground font-medium transition hover:bg-gold/90 disabled:opacity-50 disabled:pointer-events-none"
      >
        {busy
          ? tr(lang, { no: "Åpner betaling …", en: "Opening checkout…", sv: "Öppnar betalning …", de: "Zahlung wird geöffnet …", pl: "Otwieranie płatności…" })
          : tr(lang, { no: "Støtt", en: "Support", sv: "Stöd", de: "Unterstützen", pl: "Wesprzyj" })}
      </button>
      {failed && (
        <p role="alert" className="mt-3 text-center text-sm text-destructive">
          {tr(lang, {
            no: "Kunne ikke åpne betalingen. Prøv igjen om litt.",
            en: "Couldn't open checkout. Please try again shortly.",
            sv: "Det gick inte att öppna betalningen. Försök igen om en stund.",
            de: "Die Zahlung konnte nicht geöffnet werden. Bitte versuche es gleich noch einmal.",
            pl: "Nie udało się otworzyć płatności. Spróbuj ponownie za chwilę.",
          })}
        </p>
      )}
    </div>
  );
}
