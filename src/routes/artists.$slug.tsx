import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArtistDetailView } from "@/components/artists/ArtistDetailView";
import { resolveArtistImage } from "@/lib/artistImageMap";
import { buildArtistJsonLd, buildBreadcrumb } from "@/lib/artistJsonLd";
import { pickLang, type Lang, type ArtistRecord } from "@/lib/artists";
import { SUPPORTED_LOCALES, artistDetailPath, DEFAULT_LOCALE } from "@/lib/locale";
import { loadArtistForHead } from "@/lib/artistHead.functions";

export const LOCALE: Lang = DEFAULT_LOCALE;

export const Route = createFileRoute("/artists/$slug")({
  component: Page,
  loader: ({ params }) => loadArtistForHead({ data: { slug: params.slug } }),
  head: ({ params, loaderData }) => buildHead(params.slug, loaderData?.artist ?? null, LOCALE),
});

function Page() {
  const { slug } = Route.useParams();
  return <PageShell><ArtistDetailView slug={slug} locale={LOCALE} /></PageShell>;
}

export function buildHead(slug: string, a: ArtistRecord | null, locale: Lang) {
  const canonical = artistDetailPath(locale, slug);
  if (!a) {
    const fallbackTitle = `${slug} — Blues artist profile | SlowBlues`;
    const fallbackDesc = `Discover the blues artist ${slug} on SlowBlues — biography, discography, signature songs, videos and historical context from our curated blues archive.`;
    return {
      meta: [
        { title: fallbackTitle },
        { name: "description", content: fallbackDesc },
        { property: "og:title", content: fallbackTitle },
        { property: "og:description", content: fallbackDesc },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "profile" },
      ],
      links: [
        { rel: "canonical", href: canonical },
        ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: artistDetailPath(l, slug) })),
        { rel: "alternate", hreflang: "x-default", href: artistDetailPath(DEFAULT_LOCALE, slug) },
      ],
    };
  }

  const title = pickLang(a as any, locale, "seo_title") ?? `${a.name} — Blues artist | SlowBlues`;
  const rawDesc =
    pickLang(a as any, locale, "seo_description") ??
    pickLang(a as any, locale, "short") ??
    a.short ??
    `${a.name} — blues artist profile, biography, discography and videos on SlowBlues, the curated archive of blues history and culture.`;
  const description = clampDescription(rawDesc, a.name);
  const heroImg = a.og_image ?? resolveArtistImage(a.img) ?? null;
  const jsonLd = buildArtistJsonLd(a as any, canonical, heroImg);
  const breadcrumb = buildBreadcrumb(a as any, "");

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "profile" },
      ...(heroImg ? [{ property: "og:image", content: heroImg }, { name: "twitter:image", content: heroImg }] : []),
      { name: "twitter:card", content: heroImg ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: canonical },
      ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: artistDetailPath(l, slug) })),
      { rel: "alternate", hreflang: "x-default", href: artistDetailPath(DEFAULT_LOCALE, slug) },
    ],
    scripts: [
      ...jsonLd.map((node) => ({ type: "application/ld+json", children: JSON.stringify(node) })),
      { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
    ],
  };
}
