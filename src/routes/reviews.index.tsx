import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

type Review = {
  id: string;
  slug: string;
  artist_slug: string | null;
  artist_name: string;
  album_title: string;
  release_year: number | null;
  blues_style: string | null;
  cover_image: string | null;
  title_en: string | null;
  title_no: string | null;
  title_de: string | null;
  verdict_en: string | null;
  verdict_no: string | null;
  verdict_de: string | null;
  total_score: number | null;
  published_at: string | null;
};

export const Route = createFileRoute("/reviews/")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Album Reviews — SlowBlues" },
      { name: "description", content: "In-depth blues album reviews and ratings from the SlowBlues editors." },
      { property: "og:title", content: "Album Reviews — SlowBlues" },
      { property: "og:image", content: IMG.vinyl },
    ],
  }),
});

function ReviewsPage() {
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blues_reviews")
        .select("id,slug,artist_slug,artist_name,album_title,release_year,blues_style,cover_image,title_en,title_no,title_de,verdict_en,verdict_no,verdict_de,total_score,published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(100);
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
        lead="Album reviews from the SlowBlues editors — scored out of 10."
        img={IMG.vinyl}
      />
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-4">
        {loading && <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>}
        {!loading && reviews?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-2">No reviews published yet.</p>
            <p className="text-xs">Reviews will appear here as soon as the editorial team publishes them.</p>
          </div>
        )}
        {!loading &&
          reviews?.map((r) => {
            const title = pickTitle(r);
            const verdict = pickVerdict(r);
            return (
              <Link
                key={r.id}
                to="/reviews/$slug"
                params={{ slug: r.slug }}
                className="grid sm:grid-cols-[auto_1fr_auto] gap-4 items-center bg-card/60 border border-border rounded-lg p-5 hover:border-gold/40 transition"
              >
                {r.cover_image ? (
                  <img
                    src={r.cover_image}
                    alt={`${r.artist_name} — ${r.album_title}`}
                    className="size-20 rounded-md object-cover border border-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="size-20 rounded-md bg-muted/30 border border-border" />
                )}
                <div className="min-w-0">
                  <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1">
                    {r.release_year ?? ""} {r.release_year && r.artist_name && "· "}
                    {r.artist_name}
                    {r.blues_style && ` · ${r.blues_style}`}
                  </div>
                  <h2 className="font-display text-2xl mb-2 truncate">{title}</h2>
                  {verdict && <p className="text-sm text-muted-foreground line-clamp-2">{verdict}</p>}
                </div>
                {typeof r.total_score === "number" && (
                  <div className="flex flex-col items-center bg-background/60 border border-gold/40 rounded-lg px-5 py-3">
                    <div className="font-display text-3xl gold-gradient-text">{r.total_score.toFixed(1)}</div>
                    <div className="text-[10px] tracking-[0.2em] text-muted-foreground mt-0.5">/ 10</div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < Math.round(r.total_score! / 2) ? "fill-gold text-gold" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
      </section>
    </PageShell>
  );
}
