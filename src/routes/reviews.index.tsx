import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { fetchPublishedReviews } from "@/lib/reviews.functions";
import { CoverFallback } from "@/components/reviews/CoverFallback";
import { Star } from "lucide-react";

type Review = {
  id: string;
  slug: string;
  artist_slug: string | null;
  artist_name: string;
  album_title: string;
  release_year: number | null;
  label: string | null;
  blues_style: string | null;
  cover_image: string | null;
  title_en: string | null;
  title_no: string | null;
  title_de: string | null;
  verdict_en: string | null;
  verdict_no: string | null;
  verdict_de: string | null;
  score_songwriting: number | null;
  score_instrumentation: number | null;
  score_production: number | null;
  total_score: number | null;
  published_at: string | null;
};

export const Route = createFileRoute("/reviews/")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Album Reviews — SlowBlues" },
      { name: "description", content: "In-depth blues album reviews, written and rated by editor Kjell Mersland." },
      { property: "og:title", content: "Album Reviews — SlowBlues" },
      { property: "og:description", content: "Browse SlowBlues' in-depth blues album reviews — Delta, Chicago, Texas and modern blues records, reviewed personally by editor Kjell Mersland." },
      { property: "og:image", content: IMG.vinyl },
      { property: "og:url", content: "https://www.slow-blues.com/reviews" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/reviews" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.slow-blues.com/" },
            { "@type": "ListItem", position: 2, name: "Reviews", item: "https://www.slow-blues.com/reviews" },
          ],
        }),
      },
    ],
  }),
});

function ReviewsPage() {
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchPublishedReviews();
      setReviews((data ?? []) as Review[]);
      setLoading(false);
    })();
  }, []);

  const pickTitle = (r: Review) =>
    (lang === "de" && r.title_de) || (lang === "no" && r.title_no) || r.title_en || r.album_title;
  const pickVerdict = (r: Review) =>
    (lang === "de" && r.verdict_de) || (lang === "no" && r.verdict_no) || r.verdict_en || "";

  return (
    <PageShell>
      <PageHero
        eyebrow="Reviews"
        title={t.nav.reviews}
        lead="Album reviews written and scored by editor Kjell Mersland — out of 10."
        img={IMG.vinyl}
      />
      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}
        {!loading && reviews?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No reviews published yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            reviews?.map((r) => {
              const title = pickTitle(r);
              const verdict = pickVerdict(r);
              return (
                <Link
                  key={r.id}
                  to="/reviews/$slug"
                  params={{ slug: r.slug }}
                  className="group flex flex-col bg-card/60 border border-border rounded-lg overflow-hidden hover:border-gold/50 transition"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {r.cover_image ? (
                      <img
                        src={r.cover_image}
                        alt={`${r.artist_name} — ${r.album_title}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <CoverFallback artist={r.artist_name} title={r.album_title} className="absolute inset-0 h-full w-full" />
                    )}
                    {typeof r.total_score === "number" && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 border border-gold/50 rounded-md px-2 py-1 backdrop-blur">
                        <Star className="size-3.5 fill-gold text-gold" />
                        <span className="font-display text-sm gold-gradient-text">{r.total_score.toFixed(1)}</span>
                      </div>
                    )}
                    {r.blues_style && (
                      <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-black/70 border border-border rounded px-2 py-1 text-muted-foreground">
                        {r.blues_style}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-5 flex flex-col gap-2">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-gold truncate">
                      {r.artist_name}
                    </div>
                    <h2 className="font-display text-xl text-foreground line-clamp-2">{title}</h2>
                    <div className="text-xs text-muted-foreground">
                      {r.release_year ?? ""}{r.release_year && r.label ? " · " : ""}{r.label ?? ""}
                    </div>
                    {verdict && <p className="text-sm text-foreground/80 line-clamp-2 mt-1">{verdict}</p>}

                    <div className="mt-auto pt-3 space-y-1.5">
                      <ScoreBar label="Songwriting" v={r.score_songwriting} />
                      <ScoreBar label="Performance" v={r.score_instrumentation} />
                      <ScoreBar label="Production" v={r.score_production} />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </PageShell>
  );
}

function ScoreBar({ label, v }: { label: string; v: number | null }) {
  if (typeof v !== "number") return null;
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
      <span className="w-20 text-muted-foreground">{label}</span>
      <div className="flex-1 h-1 bg-muted/40 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold/60 to-gold" style={{ width: `${(v / 10) * 100}%` }} />
      </div>
      <span className="w-8 text-right text-foreground/80">{v.toFixed(1)}</span>
    </div>
  );
}
