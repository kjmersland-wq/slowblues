import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { ArtistDetailView } from "@/components/artists/ArtistDetailView";
import { isLocale, type ArtistLocale } from "@/lib/locale";
import { buildHead } from "./artists.$slug";
import type { ArtistRecord } from "@/lib/artists";

export const Route = createFileRoute("/$locale/artists/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale) || params.locale === "no") throw notFound();
  },
  loader: async ({ params }) => {
    const { data } = await supabase.from("artists").select("*").eq("slug", params.slug).maybeSingle();
    return { artist: (data ?? null) as ArtistRecord | null };
  },
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
