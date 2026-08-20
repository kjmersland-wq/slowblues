import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ArtistDetailView } from "@/components/artists/ArtistDetailView";
import { resolveArtistImage } from "@/lib/artistImageMap";
import { buildArtistJsonLd, buildBreadcrumb } from "@/lib/artistJsonLd";
import { pickLang, type Lang, type ArtistRecord } from "@/lib/artists";
import { SUPPORTED_LOCALES, artistDetailPath, DEFAULT_LOCALE } from "@/lib/locale";
import { loadArtistForHead } from "@/lib/artistHead.functions";

export const LOCALE: Lang = DEFAULT_LOCALE;
const SITE = "https://www.slow-blues.com";

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
  const canonical = `${SITE}${artistDetailPath(locale, slug)}`;
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
        ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: `${SITE}${artistDetailPath(l, slug)}` })),
        { rel: "alternate", hreflang: "x-default", href: `${SITE}${artistDetailPath(DEFAULT_LOCALE, slug)}` },
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
  // resolveArtistImage() returns a root-relative path for bundled assets
  // (e.g. "/assets/xxx.jpg") -- og:image and JSON-LD `image` must be a fully
  // qualified URL for Meta/Facebook's scraper to actually fetch it, so
  // absolutize anything that isn't already http(s).
  const rawHeroImg = a.og_image ?? resolveArtistImage(a.img) ?? null;
  const heroImg = rawHeroImg && !/^https?:\/\//.test(rawHeroImg) ? `${SITE}${rawHeroImg}` : rawHeroImg;
  const jsonLd = buildArtistJsonLd(a as any, canonical, heroImg, locale);
  const breadcrumb = buildBreadcrumb(a as any, locale);

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
      ...SUPPORTED_LOCALES.map((l) => ({ rel: "alternate", hreflang: l, href: `${SITE}${artistDetailPath(l, slug)}` })),
      { rel: "alternate", hreflang: "x-default", href: `${SITE}${artistDetailPath(DEFAULT_LOCALE, slug)}` },
    ],
    scripts: [
      ...jsonLd.map((node) => ({ type: "application/ld+json", children: JSON.stringify(node) })),
      { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
    ],
  };
}

function clampDescription(text: string, name: string): string {
  let s = (text ?? "").replace(/\s+/g, " ").trim();
  if (s.length < 50) {
    s = `${s} — Read more about ${name} on SlowBlues, the curated blues archive.`.trim();
  }
  if (s.length > 160) {
    s = s.slice(0, 157).replace(/\s+\S*$/, "") + "…";
  }
  return s;
}
