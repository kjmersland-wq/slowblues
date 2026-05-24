import { useState } from "react";
import { PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { activePartners, partnerDescription } from "@/data/partners";
import { Handshake, Mail, Users, Globe, Tag, Mic, Music, ShoppingBag, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OFFER_ICONS = [Mail, Sparkles, Tag, Mic, ShoppingBag, MapPin];

export function AdvertiseView() {
  const { t, lang } = useI18n();
  const a = t.pages.advertise;
  const partners = activePartners();

  const [form, setForm] = useState({ name: "", org: "", email: "", type: "newsletter", message: "" });
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const typeLabel = (a.types as Record<string, string>)[form.type] ?? form.type;
    const composed = `Partner inquiry — ${typeLabel}\nOrganisation: ${form.org || "—"}\n\n${form.message}`;
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim().slice(0, 100),
      email: form.email.trim().slice(0, 255),
      message: composed.slice(0, 2000),
    });
    setSending(false);
    if (error) {
      toast.error("Could not send. Please try again.");
    } else {
      toast.success("Thanks! We'll get back to you soon.");
      setForm({ name: "", org: "", email: "", type: "newsletter", message: "" });
    }
  }

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} img={IMG.amp ?? IMG.vinyl} />

      {/* Audience */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <Users className="size-6 text-gold" />
          <h2 className="font-display text-3xl text-gold">{a.audienceTitle}</h2>
        </div>
        <ul className="grid md:grid-cols-3 gap-4">
          {a.audience.map((line, i) => (
            <li key={i} className="border border-gold/20 rounded-xl p-5 bg-card/40 text-foreground/85 leading-relaxed">
              <Globe className="size-5 text-gold mb-2" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* Offers */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Handshake className="size-6 text-gold" />
          <h2 className="font-display text-3xl text-gold">{a.offerTitle}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {a.offers.map((o, i) => {
            const Icon = OFFER_ICONS[i] ?? Sparkles;
            return (
              <div key={i} className="border border-border rounded-xl p-6 bg-card/40 hover:border-gold/50 transition">
                <div className="size-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-3">
                  <Icon className="size-5 text-gold" />
                </div>
                <h3 className="font-display text-xl mb-2">{o.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Partner strip */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <Music className="size-6 text-gold" />
          <h2 className="font-display text-3xl text-gold">{a.partnersTitle}</h2>
        </div>
        {partners.length === 0 ? (
          <div className="border border-dashed border-gold/30 rounded-xl p-8 text-center bg-card/30 text-muted-foreground italic">
            {a.noPartners}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-6 justify-center bg-card/40 border border-gold/20 rounded-xl p-6">
            {partners.map((p) => (
              <a key={p.id} href={p.website} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2">
                <img src={p.logoUrl} alt={p.name} className="h-12 w-auto opacity-80 group-hover:opacity-100 transition" />
                <span className="text-xs text-muted-foreground">{partnerDescription(p, lang)}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Who fits / Who doesn't */}
      <section className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-5">
        <div className="border border-emerald-500/30 rounded-xl p-6 bg-emerald-500/5">
          <h3 className="font-display text-xl mb-3 text-emerald-300">{a.fitsTitle}</h3>
          <p className="text-sm text-foreground/85 leading-relaxed">{a.fitsList}</p>
        </div>
        <div className="border border-destructive/30 rounded-xl p-6 bg-destructive/5">
          <h3 className="font-display text-xl mb-3 text-destructive">{a.notFitsTitle}</h3>
          <p className="text-sm text-foreground/85 leading-relaxed">{a.notFitsList}</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-8 text-center">
        <h2 className="font-display text-3xl text-gold mb-3">{a.pricingTitle}</h2>
        <p className="text-foreground/85 leading-relaxed">{a.pricingText}</p>
      </section>

      {/* Contact form */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="border border-gold/30 rounded-2xl p-8 bg-card/40 shadow-[0_0_40px_-20px_var(--color-gold)]">
          <div className="flex items-center gap-3 mb-5">
            <Mail className="size-5 text-gold" />
            <h2 className="font-display text-2xl">{a.contactTitle}</h2>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <input required placeholder={a.contactName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:border-gold outline-none" />
            <input placeholder={a.contactOrg} value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} maxLength={160} className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:border-gold outline-none" />
            <input required type="email" placeholder={a.contactEmail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:border-gold outline-none" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:border-gold outline-none">
              {Object.entries(a.types).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
            </select>
            <textarea required placeholder={a.contactMessage} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} rows={5} className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-sm focus:border-gold outline-none" />
            <button disabled={sending} type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition disabled:opacity-60">
              <Mail className="size-4" /> {a.contactSend}
            </button>
          </form>
        </div>
      </section>

      {/* Editorial integrity */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="border border-border rounded-xl p-6 bg-card/30 flex gap-4">
          <ShieldCheck className="size-6 text-gold shrink-0 mt-1" />
          <div>
            <h3 className="font-display text-lg mb-2 text-gold">{a.integrityTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.integrityText}</p>
          </div>
        </div>
      </section>
    </>
  );
}
