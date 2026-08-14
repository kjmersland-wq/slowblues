import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { CoverFallback } from "@/components/reviews/CoverFallback";
import { fetchPublishedReviewBySlug } from "@/lib/reviews.functions";
import { useI18n, tr } from "@/i18n";
import { artistDetailPath } from "@/lib/locale";
import { Star, ArrowLeft, Calendar, Music } from "lucide-react";


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
  cover_credit: string | null;
  title_en: string | null;
  title_no: string | null;
  title_sv: string | null;
  title_de: string | null;
  verdict_en: string | null;
  verdict_no: string | null;
  verdict_sv: string | null;
  verdict_de: string | null;
  body_en: string | null;
  body_no: string | null;
  body_sv: string | null;
  body_de: string | null;
  score_vocals: number | null;
  score_instrumentation: number | null;
  score_production: number | null;
  score_songwriting: number | null;
  score_atmosphere: number | null;
  total_score: number | null;
  spotify_album_id: string | null;
  bandcamp_url: string | null;
  apple_music_url: string | null;
  youtube_playlist_id: string | null;
  reviewer: string | null;
  tracks: Array<{ title: string; duration?: string }>;
  published_at: string | null;
  seo_title_en: string | null;
  seo_title_no: string | null;
  seo_title_de: string | null;
  seo_description_en: string | null;
  seo_description_no: string | null;
  seo_description_de: string | null;
};

const SITE = "https://www.slow-blues.com";
const REVIEW_LOCALE_MAP: Record<string, string> = { no: "nb-NO", en: "en-GB", sv: "sv-SE", de: "de-DE", pl: "pl-PL" };

async function fetchReview(slug: string): Promise<Review | null> {
  const row = await fetchPublishedReviewBySlug({ data: { slug } });
  return (row as Review | null) ?? null;
}

export const Route = createFileRoute("/reviews/$slug")({
  component: ReviewDetailPage,
  loader: async ({ params }) => {
    const review = await fetchReview(params.slug);
    if (!review) throw notFound();
    return { review };
  },
  head: ({ params, loaderData }) => {
    const r = loaderData?.review;
    const canonical = `${SITE}/reviews/${params.slug}`;
    if (!r) {
      return { meta: [{ title: "Review — SlowBlues" }], links: [{ rel: "canonical", href: canonical }] };
    }
    const title = r.seo_title_en || `${r.album_title} — ${r.artist_name} | SlowBlues Review`;
    const description =
      r.seo_description_en || r.verdict_en || `${r.album_title} by ${r.artist_name} — reviewed by SlowBlues.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        ...(r.cover_image
          ? [
              { property: "og:image", content: r.cover_image },
              { name: "twitter:image", content: r.cover_image },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "MusicAlbum",
              name: r.album_title,
              byArtist: { "@type": "MusicGroup", name: r.artist_name },
              datePublished: r.release_year?.toString(),
              ...(r.blues_style ? { genre: r.blues_style } : {}),
              ...(r.label ? { recordLabel: r.label } : {}),
              ...(r.cover_image ? { image: r.cover_image } : {}),
            },
            reviewRating: r.total_score
              ? { "@type": "Rating", ratingValue: r.total_score, bestRating: 10, worstRating: 0 }
              : undefined,
            author: { "@type": "Person", name: r.reviewer || "Kjell Mersland" },
            datePublished: r.published_at,
            reviewBody: r.verdict_en ?? r.body_en?.slice(0, 280),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Reviews", item: `${SITE}/reviews` },
              { "@type": "ListItem", position: 3, name: r.album_title, item: canonical },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => {
    const { lang } = useI18n();
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl mb-3">
            {tr(lang, { no: "Fant ikke anmeldelsen", en: "Review not found", sv: "Recensionen hittades inte", de: "Rezension nicht gefunden", pl: "Nie znaleziono recenzji" })}
          </h1>
          <p className="text-muted-foreground mb-6">
            {tr(lang, {
              no: "Denne anmeldelsen kan ha blitt flyttet, eller er ikke publisert ennå.",
              en: "This review may have been moved or is not yet published.",
              sv: "Den här recensionen kan ha flyttats eller är inte publicerad än.",
              de: "Diese Rezension wurde möglicherweise verschoben oder ist noch nicht veröffentlicht.",
              pl: "Ta recenzja mogła zostać przeniesiona lub nie została jeszcze opublikowana.",
            })}
          </p>
          <Link to="/reviews" className="text-gold hover:underline">← {tr(lang, { no: "Alle anmeldelser", en: "All reviews", sv: "Alla recensioner", de: "Alle Rezensionen", pl: "Wszystkie recenzje" })}</Link>
        </div>
      </PageShell>
    );
  },
});

function ReviewDetailPage() {
  const { review } = Route.useLoaderData();
  const { lang } = useI18n();

  const pick = (en: string | null, no: string | null, sv: string | null, de: string | null) => {
    if (lang === "de" && de) return de;
    if (lang === "no" && no) return no;
    if ((lang as string) === "sv" && sv) return sv;
    return en;
  };

  const title = pick(review.title_en, review.title_no, review.title_sv, review.title_de) || review.album_title;
  const verdict = pick(review.verdict_en, review.verdict_no, review.verdict_sv, review.verdict_de);
  const body = pick(review.body_en, review.body_no, review.body_sv, review.body_de);
  const usingFallback = lang !== "en" && !pick(null, review.body_no, review.body_sv, review.body_de) && !!body;

  const scores: Array<[string, number | null]> = [
    [tr(lang, { no: "Vokal", en: "Vocals", sv: "Sång", de: "Gesang", pl: "Wokal" }), review.score_vocals],
    [tr(lang, { no: "Instrumentering", en: "Instrumentation", sv: "Instrumentering", de: "Instrumentierung", pl: "Instrumentacja" }), review.score_instrumentation],
    [tr(lang, { no: "Produksjon", en: "Production", sv: "Produktion", de: "Produktion", pl: "Produkcja" }), review.score_production],
    [tr(lang, { no: "Låtskriving", en: "Songwriting", sv: "Låtskrivande", de: "Songwriting", pl: "Kompozycja" }), review.score_songwriting],
    [tr(lang, { no: "Atmosfære", en: "Atmosphere", sv: "Atmosfär", de: "Atmosphäre", pl: "Atmosfera" }), review.score_atmosphere],
  ];

  return (
    <PageShell>
      <article className="max-w-4xl mx-auto px-6 pt-10 pb-20">
        <Link to="/reviews" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-8">
          <ArrowLeft className="size-4" /> {tr(lang, { no: "Alle anmeldelser", en: "All reviews", sv: "Alla recensioner", de: "Alle Rezensionen", pl: "Wszystkie recenzje" })}
        </Link>

        <div className="grid md:grid-cols-[280px_1fr] gap-8 mb-10">
          {review.cover_image ? (
            <div className="space-y-2">
              <img
                src={review.cover_image}
                alt={`${review.artist_name} — ${review.album_title}`}
                className="w-full rounded-lg border border-border shadow-2xl"
              />
              {review.cover_credit && (
                <p className="text-[10px] text-muted-foreground italic">{review.cover_credit}</p>
              )}
            </div>
          ) : (
            <CoverFallback
              artist={review.artist_name}
              title={review.album_title}
              className="aspect-square rounded-lg border border-border"
            />
          )}




          <div>
            <div className="text-[10px] tracking-[0.3em] text-gold uppercase mb-2">
              {review.release_year} {review.label && `· ${review.label}`}
            </div>
            <h1 className="font-display text-4xl md:text-5xl mb-3">{title}</h1>
            <div className="text-lg text-muted-foreground mb-1">
              {review.artist_slug ? (
                <Link to={artistDetailPath(lang, review.artist_slug) as any} className="hover:text-gold">
                  {review.artist_name}
                </Link>
              ) : (
                review.artist_name
              )}
              {review.album_title && title !== review.album_title && (
                <span className="opacity-60"> — {review.album_title}</span>
              )}
            </div>
            {review.blues_style && (
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <Music className="size-3" /> {review.blues_style}
              </div>
            )}

            {typeof review.total_score === "number" && (
              <div className="mt-6 flex items-center gap-4 p-4 rounded-lg bg-card/60 border border-gold/30">
                <div className="text-center">
                  <div className="font-display text-5xl gold-gradient-text">{review.total_score.toFixed(1)}</div>
                  <div className="text-[10px] tracking-[0.2em] text-muted-foreground">/ 10</div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-5 ${
                        i < Math.round(review.total_score! / 2) ? "fill-gold text-gold" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {verdict && (
              <p className="mt-6 text-lg italic text-foreground/85 border-l-2 border-gold/50 pl-4">{verdict}</p>
            )}
            {review.reviewer && (
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
                {tr(lang, { no: "Av", en: "By", sv: "Av", de: "Von", pl: "Autor" })} {review.reviewer}
              </p>
            )}
          </div>
        </div>

        {usingFallback && (
          <div className="mb-6 inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase bg-card/60 border border-border text-muted-foreground">
            {tr(lang, {
              no: "Oversettelse på vei — viser engelsk",
              en: "Translation pending — showing English",
              sv: "Översättning på gång — visar engelska",
              de: "Übersetzung folgt — zeigt Englisch",
              pl: "Tłumaczenie w przygotowaniu — wyświetlono angielski",
            })}
          </div>
        )}

        {body && (
          <div className="prose prose-invert max-w-none">
            {body.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="text-foreground/85 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        )}

        {review.youtube_playlist_id && (
          <section className="mt-10">
            <h2 className="font-display text-xl mb-3 text-gold">{tr(lang, { no: "Lytt", en: "Listen", sv: "Lyssna", de: "Anhören", pl: "Posłuchaj" })}</h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gold/20 bg-black">
              <iframe
                src={
                  review.youtube_playlist_id.length === 11
                    ? `https://www.youtube-nocookie.com/embed/${review.youtube_playlist_id}?rel=0`
                    : `https://www.youtube-nocookie.com/embed/videoseries?list=${review.youtube_playlist_id}&rel=0`
                }
                title={`${review.artist_name} — ${review.album_title}`}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </section>
        )}


        {Array.isArray(review.tracks) && review.tracks.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl mb-3 text-gold">{tr(lang, { no: "Sporliste", en: "Tracklist", sv: "Spårlista", de: "Titelliste", pl: "Lista utworów" })}</h2>
            <ol className="rounded-lg border border-border divide-y divide-border overflow-hidden">
              {review.tracks.map((t, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2.5 text-sm bg-card/30">
                  <span className="text-foreground/85">
                    <span className="text-muted-foreground mr-3 tabular-nums">{i + 1}.</span>
                    {t.title}
                  </span>
                  {t.duration && (
                    <span className="text-muted-foreground text-xs tabular-nums">{t.duration}</span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {scores.some(([, v]) => typeof v === "number") && (
          <section className="mt-12 p-6 rounded-lg bg-card/40 border border-border">
            <h2 className="font-display text-xl mb-4 text-gold">{tr(lang, { no: "Poengkort", en: "Scorecard", sv: "Poängkort", de: "Bewertungsübersicht", pl: "Karta ocen" })}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {scores.map(([label, v]) =>
                typeof v === "number" ? (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-display text-lg">{v.toFixed(1)}</span>
                  </div>
                ) : null,
              )}
            </div>
          </section>
        )}

        {(review.spotify_album_id || review.bandcamp_url || review.apple_music_url || review.youtube_playlist_id) && (
          <section className="mt-10 flex flex-wrap gap-3">
            {review.spotify_album_id && (
              <a
                href={`https://open.spotify.com/album/${review.spotify_album_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1.5 rounded border border-border hover:border-gold"
              >
                Spotify ↗
              </a>
            )}
            {review.bandcamp_url && (
              <a href={review.bandcamp_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded border border-border hover:border-gold">
                Bandcamp ↗
              </a>
            )}
            {review.apple_music_url && (
              <a href={review.apple_music_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded border border-border hover:border-gold">
                Apple Music ↗
              </a>
            )}
            {review.youtube_playlist_id && (
              <a
                href={
                  review.youtube_playlist_id.length === 11
                    ? `https://www.youtube.com/watch?v=${review.youtube_playlist_id}`
                    : `https://www.youtube.com/playlist?list=${review.youtube_playlist_id}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1.5 rounded border border-border hover:border-gold"
              >
                {review.youtube_playlist_id.length === 11
              ? tr(lang, { no: "Se på YouTube ↗", en: "Watch on YouTube ↗", sv: "Se på YouTube ↗", de: "Auf YouTube ansehen ↗", pl: "Obejrzyj na YouTube ↗" })
              : tr(lang, { no: "YouTube-spilleliste ↗", en: "YouTube playlist ↗", sv: "YouTube-spellista ↗", de: "YouTube-Wiedergabeliste ↗", pl: "Playlista YouTube ↗" })}
              </a>
            )}
          </section>
        )}

        {review.published_at && (
          <p className="mt-12 text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="size-3" />
            {tr(lang, { no: "Publisert", en: "Published", sv: "Publicerad", de: "Veröffentlicht", pl: "Opublikowano" })}{" "}
            {new Date(review.published_at).toLocaleDateString(REVIEW_LOCALE_MAP[lang] ?? "en-GB", { year: "numeric", month: "long", day: "numeric" })}
            {review.reviewer && <span>· {review.reviewer}</span>}
          </p>
        )}
      </article>
    </PageShell>
  );
}
