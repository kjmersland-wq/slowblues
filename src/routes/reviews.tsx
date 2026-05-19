import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({ meta: [
    { title: "Reviews — SlowBlues" },
    { name: "description", content: "Album reviews and ratings from the SlowBlues editors." },
    { property: "og:title", content: "Reviews — SlowBlues" },
    { property: "og:image", content: IMG.vinyl },
  ]}),
});

const REVIEWS = [
  { artist: "Ariel Posen", album: "Reasons for Leaving", score: 9.6, year: 2026, text: "An atmospheric masterpiece — Posen's slide playing has never sounded more intentional." },
  { artist: "Buddy Guy", album: "The Final Goodbye", score: 9.2, year: 2026, text: "The king bows out in style. A career-spanning farewell with friends and fire." },
  { artist: "Gary Clark Jr.", album: "Texas Rain", score: 9.4, year: 2026, text: "Analog warmth and soul. Clark's most cohesive statement to date." },
  { artist: "Henrik Freischlader", album: "Keep Going", score: 8.8, year: 2026, text: "A blue flame from Germany — tasteful, melodic, deeply felt." },
  { artist: "Joanne Shaw Taylor", album: "Heavy Soul", score: 9.0, year: 2026, text: "Taylor leans into the Stax tradition and comes back stronger than ever." },
  { artist: "Christone «Kingfish» Ingram", album: "Live in London", score: 9.3, year: 2026, text: "21 years old, sounds 50. The future of the blues is in safe hands." },
];

function ReviewsPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow="Reviews" title={t.nav.reviews} lead="Album reviews from the SlowBlues editors — scored out of 10." img={IMG.vinyl} />
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-4">
        {REVIEWS.map((r) => (
          <article key={r.album} className="grid sm:grid-cols-[1fr_auto] gap-4 items-center bg-card/60 border border-border rounded-lg p-5 hover:border-gold/40 transition">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1">{r.year} · {r.artist}</div>
              <h2 className="font-display text-2xl mb-2">{r.album}</h2>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
            <div className="flex flex-col items-center bg-background/60 border border-gold/40 rounded-lg px-5 py-3">
              <div className="font-display text-3xl gold-gradient-text">{r.score.toFixed(1)}</div>
              <div className="text-[10px] tracking-[0.2em] text-muted-foreground mt-0.5">/ 10</div>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3 ${i < Math.round(r.score / 2) ? "fill-gold text-gold" : "text-muted"}`} />
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
