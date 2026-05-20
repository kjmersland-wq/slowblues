import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { Building2, MessageSquare, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [
    { title: "Kontakt — SlowBlues" },
    { name: "description", content: "Send melding via vårt sikre, GDPR-kompatible kontaktskjema. Tips, korrigeringer, samarbeid — alt går via skjemaet." },
    { property: "og:title", content: "Kontakt — SlowBlues" },
    { property: "og:description", content: "Send melding via vårt sikre kontaktskjema." },
  ]}),
});

function ContactPage() {
  const { t } = useI18n();
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
      setError("Du må samtykke til behandling av meldingen før den kan sendes.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError(null);
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 255),
      message: message.trim().slice(0, 2000),
    });
    if (error) {
      setError("Kunne ikke sende meldingen. Sjekk feltene og prøv igjen.");
      setStatus("error");
    } else {
      setStatus("sent");
      setName(""); setEmail(""); setMessage(""); setConsent(false);
    }
  };

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.contact.eyebrow} title={t.pages.contact.title} lead="All kontakt går via skjemaet under. Vi svarer normalt innen 5 virkedager." img={IMG.harmonica} />
      <section className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr] gap-10">
        <form className="space-y-4 bg-card/60 border border-border rounded-xl p-6" onSubmit={submit} aria-label="Kontaktskjema">
          <div>
            <label htmlFor="contact-name" className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.name}</label>
            <input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.email}</label>
            <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email" className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
            <p className="text-[11px] text-muted-foreground mt-1">Brukes kun for å besvare henvendelsen. Slettes etter behandling — se <a href="/privacy" className="text-gold hover:underline">personvernerklæringen</a>.</p>
          </div>
          <div>
            <label htmlFor="contact-message" className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.message}</label>
            <textarea id="contact-message" required value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={2000} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--color-gold)]" />
            <span>Jeg samtykker til at KM TECH LABS lagrer og behandler opplysningene i denne meldingen for å besvare henvendelsen, i tråd med <a href="/gdpr" className="text-gold hover:underline">GDPR-erklæringen</a>.</span>
          </label>
          {status === "sent" && <p className="text-sm text-gold" role="status">Takk! Meldingen er mottatt — vi svarer så snart vi kan.</p>}
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <button disabled={status === "sending"} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-60">
            <MessageSquare className="size-4" aria-hidden="true" />
            {status === "sending" ? "Sender…" : t.pages.contact.send}
          </button>
        </form>
        <aside className="space-y-5 text-sm" aria-label="Utgiverinformasjon">
          <div>
            <div className="flex items-center gap-2 text-gold mb-1"><Building2 className="size-4" aria-hidden="true" /> <span className="font-display text-base">Utgiver</span></div>
            <p className="text-foreground/85">KM TECH LABS — Kjell Mersland</p>
            <p className="text-muted-foreground">Org.nr. 934 044 029</p>
            <p className="text-muted-foreground">Ansvarlig redaktør: Kjell Mersland</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gold mb-1"><ShieldCheck className="size-4" aria-hidden="true" /> <span className="font-display text-base">GDPR</span></div>
            <p className="text-muted-foreground">All kontakt skjer via dette skjemaet. Vi publiserer ikke e-postadresser, og deler aldri dine data med tredjeparter.</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
