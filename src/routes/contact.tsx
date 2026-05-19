import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [
    { title: "Contact — SlowBlues" },
    { name: "description", content: "Tips, partnerships, corrections — get in touch." },
    { property: "og:title", content: "Contact — SlowBlues" },
  ]}),
});

function ContactPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
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
      setName(""); setEmail(""); setMessage("");
    }
  };

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.contact.eyebrow} title={t.pages.contact.title} lead={t.pages.contact.lead} img={IMG.harmonica} />
      <section className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr] gap-10">
        <form className="space-y-4 bg-card/60 border border-border rounded-xl p-6" onSubmit={submit}>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.name}</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.message}</label>
            <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={2000} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          {status === "sent" && <p className="text-sm text-gold">Takk! Meldingen er sendt.</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={status === "sending"} className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-60">
            {status === "sending" ? "Sender…" : t.pages.contact.send}
          </button>
        </form>
        <div className="space-y-5 text-sm">
          <div>
            <div className="flex items-center gap-2 text-gold mb-1"><Mail className="size-4" /> <span className="font-display text-base">Email</span></div>
            <a href="mailto:hei@slowblues.no" className="text-muted-foreground hover:text-gold">hei@slowblues.no</a>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gold mb-1"><MapPin className="size-4" /> <span className="font-display text-base">Basert i</span></div>
            <p className="text-muted-foreground">Kristiansand, Norge</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
