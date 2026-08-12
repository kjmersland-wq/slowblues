import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
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
          url: 'https://www.slow-blues.com',
        });
      } catch {
        // User cancelled share — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText('https://www.slow-blues.com');
        toast.success('Link copied!');
      } catch {
        toast.error('Could not copy link');
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
        toast.error('Could not start checkout. Please try again.');
      }
    } catch (err) {
      toast.error('Payment initiation failed. Please try again.');
      console.error('Support payment error:', err);
    }
  }

  function handleVipps(amount: number) {
    const url = `vipps://send?phone=${VIPPS_NUMBER}&amount=${amount}&comment=SlowBlues`;
    window.location.href = url;
    setTimeout(() => {
      toast.message('Vipps', {
        description: `Åpne Vipps på mobil og send til +47 ${VIPPS_NUMBER} (kr ${amount})`,
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
      desc: 'Buy us a coffee. Your name goes on the supporters wall.',
      highlight: false,
    },
    {
      icon: Star,
      name: 'Blues Supporter',
      level: 'blues-supporter',
      amount: 150,
      currency: 'NOK',
      desc: 'Keep the servers running. Early access to new features + supporters wall.',
      highlight: true,
    },
    {
      icon: Crown,
      name: 'Blues Patron',
      level: 'blues-patron',
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
                onClick={() => handleSupport(tier.level as 'blues-friend' | 'blues-supporter' | 'blues-patron')}
                className="w-full px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition flex items-center justify-center gap-2"
              >
                Kort / Stripe <ArrowRight className="size-4" />
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
