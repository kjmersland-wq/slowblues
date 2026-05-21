import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArtistDetailView } from "@/components/artists/ArtistDetailView";
import { isLocale, type ArtistLocale } from "@/lib/locale";
import { buildHead } from "./artists.$slug";

export const Route = createFileRoute("/$locale/artists/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "no") throw notFound();
  },
  component: Page,
  head: ({ params }) => {
    const locale = (isLocale(params.locale) ? params.locale : "en") as ArtistLocale;
    return buildHead(params.slug, null, locale);
  },
});

function Page() {
  const { slug, locale } = Route.useParams();
  const loc = (isLocale(locale) ? locale : "en") as ArtistLocale;
  return <PageShell><ArtistDetailView slug={slug} locale={loc} /></PageShell>;
}
