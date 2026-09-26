import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { ArtistListView } from "@/components/artists/ArtistListView";
import { SUPPORTED_LOCALES, artistsListPath, artistDetailPath, DEFAULT_LOCALE } from "@/lib/locale";
import { fetchArtistsForList, fetchArtistStats, type ArtistRecord } from "@/lib/artists";
import { artistListCopy, buildArtistItemList } from "@/lib/artistCopy";

const SITE = "https://www.slow-blues.com";

export const Route = createFileRoute("/artists/")({
  component: ArtistsPage,
  // Full list + live counts are fetched server-side so crawlers get real
  // artist cards in the first HTML (no "…" placeholder).
  loader: async () => {
    const [artists, stats] = await Promise.all([fetchArtistsForList(), fetchArtistStats()]);
    return { artists: artists as unknown as ArtistRecord[], count: stats.artistCount || artists.length };
  },
  head: ({ loaderData }) => {
    const count = loaderData?.count ?? 0;
    const copy = artistListCopy(DEFAULT_LOCALE, count);
    return {
    meta: [
      { title: "Artister — SlowBlues" },
      { name: "description", content: copy.lead },
      { property: "og:title", content: "Artister — SlowBlues" },
      { property: "og:description", content: `${copy.lead} Biografier, diskografi, video og mer.` },
      { property: "og:url", content: `${SITE}${artistsListPath(DEFAULT_LOCALE)}` },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${SITE}${artistsListPath(DEFAULT_LOCALE)}` },
      ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: `${SITE}${artistsListPath(l)}` })),
      { rel: "alternate", hreflang: "x-default", href: `${SITE}${artistsListPath(DEFAULT_LOCALE)}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Artists", item: `${SITE}${artistsListPath(DEFAULT_LOCALE)}` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildArtistItemList(SITE, loaderData?.artists ?? [], (slug) => artistDetailPath(DEFAULT_LOCALE, slug), "Artister — SlowBlues"),
        ),
      },
    ],
    };
  },
});

function ArtistsPage() {
  const { artists, count } = Route.useLoaderData();
  const copy = artistListCopy(DEFAULT_LOCALE, count);
  return (
    <PageShell>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} img={IMG.bbKing} />
      <ArtistListView locale={DEFAULT_LOCALE} initial={artists} />
    </PageShell>
  );
}
