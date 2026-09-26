import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { ArtistListView } from "@/components/artists/ArtistListView";
import { SUPPORTED_LOCALES, artistsListPath, artistDetailPath, isLocale, type ArtistLocale } from "@/lib/locale";
import { fetchArtistsForList, fetchArtistStats, type ArtistRecord } from "@/lib/artists";
import { artistListCopy, buildArtistItemList } from "@/lib/artistCopy";

const SITE = "https://www.slow-blues.com";

export const Route = createFileRoute("/$locale/artists/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "no") throw notFound();
  },
  component: Page,
  loader: async () => {
    const [artists, stats] = await Promise.all([fetchArtistsForList(), fetchArtistStats()]);
    return { artists: artists as unknown as ArtistRecord[], count: stats.artistCount || artists.length };
  },
  head: ({ params, loaderData }) => {
    const locale = (isLocale(params.locale) ? params.locale : "en") as ArtistLocale;
    const path = `${SITE}${artistsListPath(locale)}`;
    const h = artistListCopy(locale, loaderData?.count ?? 0);
    return {
      meta: [
        { title: `${h.title} — SlowBlues` },
        { name: "description", content: h.lead },
        { property: "og:title", content: `${h.title} — SlowBlues` },
        { property: "og:description", content: h.lead },
        { property: "og:url", content: path },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: locale },
      ],
      links: [
        { rel: "canonical", href: path },
        ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: `${SITE}${artistsListPath(l)}` })),
        { rel: "alternate", hreflang: "x-default", href: `${SITE}${artistsListPath("no")}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: h.title, item: path },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildArtistItemList(SITE, loaderData?.artists ?? [], (slug) => artistDetailPath(locale, slug), `${h.title} — SlowBlues`),
          ),
        },
      ],
    };
  },
});

function Page() {
  const { locale } = Route.useParams();
  const { artists, count } = Route.useLoaderData();
  const loc = (isLocale(locale) ? locale : "en") as ArtistLocale;
  const h = artistListCopy(loc, count);
  return (
    <PageShell>
      <PageHero eyebrow="Hall of Fame" title={h.title} lead={h.lead} img={IMG.bbKing} />
      <ArtistListView locale={loc} initial={artists} />
    </PageShell>
  );
}
