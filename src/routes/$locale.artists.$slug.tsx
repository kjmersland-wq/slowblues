import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArtistDetailView } from "@/components/artists/ArtistDetailView";
import { isLocale, type ArtistLocale } from "@/lib/locale";
import { buildHead } from "./artists.$slug";
import { loadArtistForHead } from "@/lib/artistHead.functions";

export const Route = createFileRoute("/$locale/artists/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "no") throw notFound();
  },
  loader: ({ params }) => loadArtistForHead({ data: { slug: params.slug } }),
  component: Page,
  head: ({ params, loaderData }) => {
    const locale = (isLocale(params.locale) ? params.locale : "en") as ArtistLocale;
    return buildHead(params.slug, loaderData?.artist ?? null, locale);
  },
});

function Page() {
  const { slug, locale } = Route.useParams();
  const loc = (isLocale(locale) ? locale : "en") as ArtistLocale;
  return <PageShell><ArtistDetailView slug={slug} locale={loc} /></PageShell>;
}
