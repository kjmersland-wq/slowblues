import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { Mail, MapPin } from "lucide-react";

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
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.contact.eyebrow} title={t.pages.contact.title} lead={t.pages.contact.lead} img={IMG.harmonica} />
      <section className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr] gap-10">
        <form className="space-y-4 bg-card/60 border border-border rounded-xl p-6" onSubmit={(e) => { e.preventDefault(); alert("Thank you — message sent."); }}>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.name}</label>
            <input required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.email}</label>
            <input type="email" required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] text-gold uppercase block mb-1.5">{t.pages.contact.message}</label>
            <textarea required rows={6} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:border-gold outline-none" />
          </div>
          <button className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">{t.pages.contact.send}</button>
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
