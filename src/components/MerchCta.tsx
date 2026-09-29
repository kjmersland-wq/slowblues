import { Link } from "@tanstack/react-router";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useI18n, tr } from "@/i18n";

/**
 * Shared "buy merch, keep the archive alive" banner shown near the bottom
 * of every content page (before the footer) — everywhere except legal
 * pages, login and admin. Rendered by default inside PageShell; opt out
 * with <PageShell hideMerchCta>.
 */
export function MerchCta() {
  const { lang } = useI18n();
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-card/50 border border-gold/25 rounded-xl px-6 py-6 sm:py-5 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="shrink-0 size-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <ShoppingBag className="size-5 text-gold" />
          </div>
          <p className="font-display text-lg sm:text-xl leading-snug">
            {tr(lang, {
              no: "Hold SlowBlues uavhengig. Offisiell merch — bær bluesen.",
              en: "Keep SlowBlues independent. Official merch — wear the blues.",
              sv: "Håll SlowBlues oberoende. Officiell merch — bär bluesen.",
              de: "Halt SlowBlues unabhängig. Offizieller Merch — trag den Blues.",
              pl: "Wspieraj niezależność SlowBlues. Oficjalny merch — noś bluesa.",
            })}
          </p>
        </div>
        <Link
          to="/about/merch"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
        >
          {tr(lang, { no: "Se butikken", en: "Shop merch", sv: "Se butiken", de: "Zum Shop", pl: "Zobacz sklep" })}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
