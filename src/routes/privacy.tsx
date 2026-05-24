import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [
    { title: "Privacy — SlowBlues" },
    { name: "description", content: "How we handle your data on slowblues.no." },
    { property: "og:title", content: "Privacy — SlowBlues" },
  ]}),
});

function PrivacyPage() {
  const { t, lang } = useI18n();
  const content = lang === "no" ? NO : lang === "de" ? DE : EN;
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.privacy.eyebrow} title={t.pages.privacy.title} lead={t.pages.privacy.lead} />
      <section className="max-w-3xl mx-auto px-6 py-12 prose prose-invert">
        <div className="mb-8 rounded-lg border border-border bg-card/50 p-5 text-sm not-italic">
          <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">Behandlingsansvarlig</div>
          <p className="text-foreground/90 m-0">KM TECH LABS — Kjell Mersland · Org.nr. 934 044 029 · Ansvarlig redaktør: Kjell Mersland</p>
          <p className="text-muted-foreground m-0 mt-1">All kontakt skjer via <a href="/contact" className="text-gold hover:underline">kontaktskjemaet</a>. Se også <a href="/gdpr" className="text-gold hover:underline">GDPR-erklæringen</a>.</p>
        </div>
        <div className="space-y-6 text-foreground/85 leading-relaxed">
          {content.map((b, i) => (
            <div key={i}>
              <h2 className="font-display text-2xl text-gold mb-2">{b.h}</h2>
              <p>{b.p}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

const NO = [
  { h: "Hvilke data lagrer vi?", p: "Vi lagrer kun e-postadressen din hvis du melder deg på nyhetsbrevet, og navn + melding hvis du skriver i gjesteboken eller kontaktskjemaet. Vi bruker en cookie for å huske språkvalget ditt." },
  { h: "Hva bruker vi dataene til?", p: "E-postadressen brukes utelukkende til å sende deg nyhetsbrevet du har bedt om. Gjestebok-innlegg publiseres synlig på siden. Vi selger ikke data til tredjeparter, noensinne." },
  { h: "Analyse", p: "Vi bruker anonymisert besøksstatistikk (uten cookies som identifiserer deg) for å forstå hvilke artikler folk leser. Ingen personlig profil bygges." },
  { h: "Bilder og opphavsrett", p: "Alle historiske bilder er hentet fra Library of Congress, Wikimedia Commons og andre offentlige arkiver under Public Domain eller Creative Commons. Atmosfærebilder er fra Unsplash under deres frie lisens. Attribusjon vises der hvor det kreves." },
  { h: "Rettighetene dine", p: "Du kan når som helst be om innsyn i, korreksjon av eller sletting av data vi har om deg. Send oss en henvendelse via kontaktskjemaet, så svarer vi innen 14 dager." },
  { h: "Cookies", p: "Kun én lokal lagring brukes: språkvalget ditt (\"slowblues-lang\"). Ingen sporings-cookies." },
];

const EN: typeof NO = [
  { h: "What data do we store?", p: "We only store your email address if you subscribe to the newsletter, and name + message if you sign the guestbook or use the contact form. We use a single local-storage value to remember your language choice." },
  { h: "What do we use it for?", p: "Email is used exclusively for the newsletter you signed up for. Guestbook entries are visibly published on the site. We never sell data to third parties." },
  { h: "Analytics", p: "We use anonymised page-view statistics (no identifying cookies) to understand which articles people read. No personal profile is built." },
  { h: "Images and copyright", p: "All historical images are sourced from the Library of Congress, Wikimedia Commons and other public archives under Public Domain or Creative Commons. Atmospheric images come from Unsplash under their free licence. Attribution is shown where required." },
  { h: "Your rights", p: "You can request access to, correction of, or deletion of any data we hold about you at any time. Reach out via the contact form and we will respond within 14 days." },
  { h: "Cookies", p: "Only one local-storage value is used: your language choice (\"slowblues-lang\"). No tracking cookies." },
];

const DE: typeof NO = [
  { h: "Welche Daten speichern wir?", p: "Wir speichern nur deine E-Mail-Adresse, wenn du den Newsletter abonnierst, und Name + Nachricht, wenn du das Gästebuch oder Kontaktformular nutzt. Eine lokale Speicherung merkt sich deine Sprachwahl." },
  { h: "Wofür verwenden wir die Daten?", p: "Die E-Mail-Adresse wird ausschließlich für den abonnierten Newsletter verwendet. Gästebuch-Einträge werden sichtbar veröffentlicht. Wir verkaufen niemals Daten an Dritte." },
  { h: "Analyse", p: "Wir nutzen anonymisierte Besucherstatistiken (keine identifizierenden Cookies). Es wird kein persönliches Profil erstellt." },
  { h: "Bilder und Urheberrecht", p: "Alle historischen Bilder stammen aus der Library of Congress, Wikimedia Commons und anderen öffentlichen Archiven unter Public Domain oder Creative Commons. Atmosphärische Bilder von Unsplash unter deren freier Lizenz. Attribution wird wo nötig angezeigt." },
  { h: "Deine Rechte", p: "Du kannst jederzeit Auskunft, Korrektur oder Löschung der über dich gespeicherten Daten verlangen. Sende uns deine Anfrage über das Kontaktformular — Antwort innerhalb von 14 Tagen." },
  { h: "Cookies", p: "Nur ein lokaler Speicherwert wird verwendet: deine Sprachwahl (\"slowblues-lang\"). Keine Tracking-Cookies." },
];
