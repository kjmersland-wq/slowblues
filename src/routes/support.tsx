import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { Heart, ShoppingBag, Share2, Coffee, Music, Star, Crown, ArrowRight } from "lucide-react";
import { toast } from "sonner";

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

  function scrollToSupportLevels() {
    document.getElementById('support-levels')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SlowBlues — The Slow, Soulful Roots',
          text: 'Independent blues culture — 360+ artist profiles, reviews and more.',
          url: 'https://slowblues.no',
        });
      } catch {
        // User cancelled share — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText('https://slowblues.no');
        toast.success('Link copied!');
      } catch {
        toast.error('Could not copy link');
      }
    }
  }

  function handleSupport(level: string, amount: number) {
    // Stripe checkout integration placeholder — wire up when backend is ready
    toast.info(`Opening checkout for ${level} (${amount} NOK)…`);
    console.log('Support level:', level, 'Amount:', amount);
  }

  const supportTiers = [
    {
      icon: Music,
      name: 'Blues Friend',
      amount: 50,
      currency: 'NOK',
      desc: 'Buy us a coffee. Your name goes on the supporters wall.',
      highlight: false,
    },
    {
      icon: Star,
      name: 'Blues Supporter',
      amount: 150,
      currency: 'NOK',
      desc: 'Keep the servers running. Early access to new features + supporters wall.',
      highlight: true,
    },
    {
      icon: Crown,
      name: 'Blues Patron',
      amount: 500,
      currency: 'NOK',
      desc: 'Become a patron. All perks + a personal thank-you in the newsletter.',
      highlight: false,
    },
  ];

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.support.eyebrow} title={t.pages.support.title} lead={t.pages.support.lead} img={IMG.amp} />

      {/* Be Part of the Movement */}
      <section id="support-levels" className="max-w-5xl mx-auto px-6 pt-12">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">Be Part of the Movement</div>
          <h2 className="font-display text-4xl md:text-5xl">Support the blues</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            SlowBlues is independent — no ads, no corporate backing. Your contribution keeps the archive alive and growing.
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
                  Most Popular
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
                onClick={() => handleSupport(tier.name, tier.amount)}
                className="w-full px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition flex items-center justify-center gap-2"
              >
                Support <ArrowRight className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Action cards */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          { icon: ShoppingBag, title: t.pages.support.buyMerch, desc: "T-shirts, posters, vinyl and tote bags.", cta: "Open shop", action: 'merch' as const },
          { icon: Coffee, title: t.pages.support.donate, desc: "Buy us a coffee — keeps the servers running.", cta: "Donate", action: 'donate' as const },
          { icon: Share2, title: t.pages.support.shareTitle, desc: "Tell a friend who still believes in the blues.", cta: "Share link", action: 'share' as const },
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
