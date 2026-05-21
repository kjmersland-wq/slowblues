import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { ArtistListView } from "@/components/artists/ArtistListView";
import { SUPPORTED_LOCALES, artistsListPath, isLocale, type ArtistLocale } from "@/lib/locale";

export const HERO = {
  en: { eyebrow: "Hall of Fame", title: "Artists", lead: "330+ blues artist profiles — pioneers, masters and today's voices." },
  sv: { eyebrow: "Hall of Fame", title: "Artister", lead: "330+ artistprofiler — pionjärerna, mästarna och dagens röster." },
  de: { eyebrow: "Hall of Fame", title: "Künstler", lead: "330+ Blues-Künstlerprofile — Pioniere, Meister und heutige Stimmen." },
  no: { eyebrow: "Hall of Fame", title: "Artister", lead: "330+ bluesartist-profiler — pionerene, mestrene og dagens stemmer." },
} as const;

export const Route = createFileRoute("/$locale/artists/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "no") throw notFound();
  },
  component: Page,
  head: ({ params }) => {
    const locale = (isLocale(params.locale) ? params.locale : "en") as ArtistLocale;
    const path = artistsListPath(locale);
    const h = HERO[locale];
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
        ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: artistsListPath(l) })),
        { rel: "alternate", hreflang: "x-default", href: artistsListPath("no") },
      ],
    };
  },
});

function Page() {
  const { locale } = Route.useParams();
  const loc = (isLocale(locale) ? locale : "en") as ArtistLocale;
  const h = HERO[loc];
  return (
    <PageShell>
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} img={IMG.bbKing} />
      <ArtistListView locale={loc} />
    </PageShell>
  );
}
