import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { Heart, ShoppingBag, Share2, Coffee } from "lucide-react";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({ meta: [
    { title: "Support SlowBlues" },
    { name: "description", content: "Keep the blues alive — merch, donations and sharing." },
    { property: "og:title", content: "Support SlowBlues" },
  ]}),
});

function SupportPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.support.eyebrow} title={t.pages.support.title} lead={t.pages.support.lead} img={IMG.amp} />
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          { icon: ShoppingBag, title: t.pages.support.buyMerch, desc: "T-shirts, posters, vinyl and tote bags.", cta: "Open shop" },
          { icon: Coffee, title: t.pages.support.donate, desc: "Buy us a coffee — keeps the servers running.", cta: "Donate" },
          { icon: Share2, title: t.pages.support.shareTitle, desc: "Tell a friend who still believes in the blues.", cta: "Share link" },
        ].map((c) => (
          <div key={c.title} className="bg-card/60 border border-border rounded-xl p-6 text-center hover:border-gold/50 transition">
            <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4"><c.icon className="size-6 text-gold" /></div>
            <h3 className="font-display text-2xl mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">{c.desc}</p>
            <button className="px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">{c.cta}</button>
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
