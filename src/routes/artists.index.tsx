import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { ArtistListView } from "@/components/artists/ArtistListView";
import { SUPPORTED_LOCALES, artistsListPath, DEFAULT_LOCALE } from "@/lib/locale";

const SITE = "https://www.slow-blues.com";

export const Route = createFileRoute("/artists/")({
  component: ArtistsPage,
  head: () => ({
    meta: [
      { title: "Artister — SlowBlues" },
      { name: "description", content: "330+ bluesartist-profiler. Pionerene, mestrene og dagens stemmer i bluesen." },
      { property: "og:title", content: "Artister — SlowBlues" },
      { property: "og:description", content: "330+ bluesartist-profiler — biografier, diskografi, video og mer." },
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
    ],
  }),
});

function ArtistsPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.artists.eyebrow} title={t.pages.artists.title} lead={t.pages.artists.lead} img={IMG.bbKing} />
      <ArtistListView locale={DEFAULT_LOCALE} />
    </PageShell>
  );
}
