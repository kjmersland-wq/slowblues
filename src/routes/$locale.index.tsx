import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale } from "@/lib/locale";
import { fetchArtistStats, fetchVoiceArtists } from "@/lib/artists";
import { hasPublishedQuizCycle } from "@/lib/quiz.server";
import { Home } from "./index";

const SITE = "https://www.slow-blues.com";

// English already lives unprefixed at "/" (see routes/index.tsx), so this
// route only ever serves the other four -- visiting /en/ falls through to
// notFound() rather than creating a second, duplicate English document.
export const Route = createFileRoute("/$locale/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "en") throw notFound();
  },
  component: () => {
    const stats = Route.useLoaderData();
    return <Home stats={stats} />;
  },
  loader: async () => ({ ...(await fetchArtistStats()), voices: await fetchVoiceArtists(), hasQuiz: await hasPublishedQuizCycle() }),
  head: ({ params, loaderData }) => {
    const locale = params.locale;
    const n = loaderData?.artistCount ? `${loaderData.artistCount}+ ` : "";
    const title = `SlowBlues — The Blues Encyclopedia: ${n}Artists, History & Reviews`;
    const description = "From the Delta porch to Chicago electric — artist stories, reviews and the living scene. Independent archive, no display ads in the articles. Wear the blues and keep the archive alive.";
    const path = `${SITE}/${locale}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: path },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: locale },
      ],
      links: [
        { rel: "canonical", href: path },
        { rel: "alternate", hreflang: "en", href: `${SITE}/` },
        { rel: "alternate", hreflang: "no", href: `${SITE}/no` },
        { rel: "alternate", hreflang: "sv", href: `${SITE}/sv` },
        { rel: "alternate", hreflang: "de", href: `${SITE}/de` },
        { rel: "alternate", hreflang: "pl", href: `${SITE}/pl` },
        { rel: "alternate", hreflang: "x-default", href: `${SITE}/` },
      ],
    };
  },
});
