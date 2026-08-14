import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { Building2, MessageSquare, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { submitContactMessage } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Kontakt — SlowBlues" },
      { name: "description", content: "Send melding via vårt sikre, GDPR-kompatible kontaktskjema. Tips, korrigeringer, samarbeid — alt går via skjemaet." },
      { property: "og:title", content: "Kontakt — SlowBlues" },
      { property: "og:description", content: "Send melding via vårt sikre kontaktskjema." },
      { property: "og:url", content: "https://www.slow-blues.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/contact" }],
  }),
});

function ContactPage() {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!consent) {
      setError(
        tr(lang, {
          no: "Du må samtykke til behandling av meldingen før den kan sendes.",
          en: "You must consent to the processing of your message before it can be sent.",
          sv: "Du måste samtycka till behandlingen av meddelandet innan det kan skickas.",
          de: "Sie müssen der Verarbeitung Ihrer Nachricht zustimmen, bevor sie gesendet werden kann.",
          pl: "Musisz wyrazić zgodę na przetwarzanie wiadomości, zanim zostanie wysłana.",
        }),
      );
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      await submitContactMessage({ data: { name, email, message, lang, formType: "contact" } });
      setStatus("sent");
      setName(""); setEmail(""); setMessage(""); setConsent(false);
    } catch {
      setError(
        tr(lang, {
          no: "Kunne ikke sende meldingen. Sjekk feltene og prøv igjen.",
          en: "Couldn't send the message. Check the fields and try again.",
          sv: "Det gick inte att skicka meddelandet. Kontrollera fälten och försök igen.",
          de: "Die Nachricht konnte nicht gesendet werden. Überprüfen Sie die Felder und versuchen Sie es erneut.",
          pl: "Nie udało się wysłać wiadomości. Sprawdź pola i spróbuj ponownie.",
        }),
      );
      setStatus("error");
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow={t.pages.contact.eyebrow}
        title={t.pages.contact.title}
        lead={tr(lang, {
          no: "All kontakt går via skjemaet under. Vi svarer normalt innen 5 virkedager.",
          en: "All contact goes through the form below. We usually reply within 5 business days.",
          sv: "All kontakt sker via formuläret nedan. Vi svarar normalt inom 5 arbetsdagar.",
          de: "Jede Kontaktaufnahme läuft über das Formular unten. Wir antworten normalerweise innerhalb von 5 Werktagen.",
          pl: "Cały kontakt odbywa się przez poniższy formularz. Zwykle odpowiadamy w ciągu 5 dni roboczych.",
        })}
        img={IMG.harmonica}
      />
      <section className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr] gap-10">
        <form
          className="space-y-4 bg-card/60 border border-border rounded-xl p-6"
          onSubmit={submit}
          aria-label={tr(lang, { no: "Kontaktskjema", en: "Contact form", sv: "Kontaktformulär", de: "Kontaktformular", pl: "Formularz kontaktowy" })}
        >
          <div>
            <label htmlFor="contact-name" className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.name}</label>
            <input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.email}</label>
            <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email" className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
            <p className="text-[11px] text-muted-foreground mt-1">
              {tr(lang, {
                no: <>Brukes kun for å besvare henvendelsen. Slettes etter behandling — se <a href="/privacy" className="text-gold hover:underline">personvernerklæringen</a>.</>,
                en: <>Used only to reply to your message. Deleted after processing — see the <a href="/privacy" className="text-gold hover:underline">privacy policy</a>.</>,
                sv: <>Används endast för att besvara din förfrågan. Raderas efter behandling — se <a href="/privacy" className="text-gold hover:underline">integritetspolicyn</a>.</>,
                de: <>Wird nur zur Beantwortung Ihrer Anfrage verwendet. Nach der Bearbeitung gelöscht — siehe <a href="/privacy" className="text-gold hover:underline">Datenschutzerklärung</a>.</>,
                pl: <>Wykorzystywany wyłącznie do odpowiedzi na zapytanie. Usuwany po rozpatrzeniu — zobacz <a href="/privacy" className="text-gold hover:underline">politykę prywatności</a>.</>,
              } as any)}
            </p>
          </div>
          <div>
            <label htmlFor="contact-message" className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.message}</label>
            <textarea id="contact-message" required value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={2000} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--color-gold)]" />
            <span>
              {tr(lang, {
                no: <>Jeg samtykker til at KM TECH LABS lagrer og behandler opplysningene i denne meldingen for å besvare henvendelsen, i tråd med <a href="/gdpr" className="text-gold hover:underline">GDPR-erklæringen</a>.</>,
                en: <>I consent to KM TECH LABS storing and processing the information in this message to answer my inquiry, in line with the <a href="/gdpr" className="text-gold hover:underline">GDPR statement</a>.</>,
                sv: <>Jag samtycker till att KM TECH LABS lagrar och behandlar uppgifterna i detta meddelande för att besvara min förfrågan, i enlighet med <a href="/gdpr" className="text-gold hover:underline">GDPR-förklaringen</a>.</>,
                de: <>Ich stimme zu, dass KM TECH LABS die Angaben in dieser Nachricht speichert und verarbeitet, um meine Anfrage zu beantworten, gemäß der <a href="/gdpr" className="text-gold hover:underline">DSGVO-Erklärung</a>.</>,
                pl: <>Wyrażam zgodę na przechowywanie i przetwarzanie przez KM TECH LABS danych z tej wiadomości w celu udzielenia odpowiedzi, zgodnie z <a href="/gdpr" className="text-gold hover:underline">oświadczeniem RODO</a>.</>,
              } as any)}
            </span>
          </label>
          {status === "sent" && (
            <p className="text-sm text-gold" role="status">
              {tr(lang, {
                no: "Takk! Meldingen er mottatt — vi svarer så snart vi kan.",
                en: "Thanks! Your message has been received — we'll reply as soon as we can.",
                sv: "Tack! Meddelandet har tagits emot — vi svarar så snart vi kan.",
                de: "Danke! Ihre Nachricht wurde empfangen — wir antworten so schnell wie möglich.",
                pl: "Dziękujemy! Wiadomość została odebrana — odpowiemy najszybciej jak to możliwe.",
              })}
            </p>
          )}
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <button disabled={status === "sending"} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-60">
            <MessageSquare className="size-4" aria-hidden="true" />
            {status === "sending" ? tr(lang, { no: "Sender …", en: "Sending…", sv: "Skickar …", de: "Wird gesendet …", pl: "Wysyłanie…" }) : t.pages.contact.send}
          </button>
        </form>
        <aside
          className="space-y-5 text-sm"
          aria-label={tr(lang, { no: "Utgiverinformasjon", en: "Publisher information", sv: "Utgivarinformation", de: "Herausgeberinformationen", pl: "Informacje o wydawcy" })}
        >
          <div>
            <div className="flex items-center gap-2 text-gold mb-1"><Building2 className="size-4" aria-hidden="true" /> <span className="font-display text-base">{t.footer.publisher}</span></div>
            <p className="text-foreground/85">KM TECH LABS — Kjell Mersland</p>
            <p className="text-muted-foreground">{t.footer.orgNr} 934 044 029</p>
            <p className="text-muted-foreground">{t.footer.editorInCharge} Kjell Mersland</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gold mb-1"><ShieldCheck className="size-4" aria-hidden="true" /> <span className="font-display text-base">GDPR</span></div>
            <p className="text-muted-foreground">
              {tr(lang, {
                no: "All kontakt skjer via dette skjemaet. Vi publiserer ikke e-postadresser, og deler aldri dine data med tredjeparter.",
                en: "All contact happens via this form. We don't publish email addresses, and never share your data with third parties.",
                sv: "All kontakt sker via detta formulär. Vi publicerar inte e-postadresser och delar aldrig dina uppgifter med tredje part.",
                de: "Jeder Kontakt erfolgt über dieses Formular. Wir veröffentlichen keine E-Mail-Adressen und geben Ihre Daten niemals an Dritte weiter.",
                pl: "Cały kontakt odbywa się przez ten formularz. Nie publikujemy adresów e-mail i nigdy nie udostępniamy Twoich danych stronom trzecim.",
              })}
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
