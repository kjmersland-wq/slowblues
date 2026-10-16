import type { ArtistLocale } from "@/lib/locale";

const SITE = "https://www.slow-blues.com";

// English lives at /support; the other four languages at /no/support, /sv/support, /de/support, /pl/support.
export const SUPPORT_SEO: Record<ArtistLocale, { title: string; description: string }> = {
  en: {
    title: "Support SlowBlues — keep the blues archive alive",
    description:
      "Support SlowBlues with a one-time or monthly contribution, or buy official merch. An independent blues archive with no display ads in the artist articles.",
  },
  no: {
    title: "Støtt SlowBlues — hold blues-arkivet i live",
    description:
      "Støtt SlowBlues med et engangsbeløp eller månedlig støtte, eller kjøp offisiell merch. Et uavhengig bluesarkiv uten displayannonser i artistartiklene.",
  },
  sv: {
    title: "Stöd SlowBlues — håll bluesarkivet vid liv",
    description:
      "Stöd SlowBlues med ett engångsbelopp eller månatligt stöd, eller köp officiell merch. Ett oberoende bluesarkiv utan displayannonser i artistartiklarna.",
  },
  de: {
    title: "SlowBlues unterstützen — das Blues-Archiv am Leben halten",
    description:
      "Unterstütze SlowBlues mit einer einmaligen oder monatlichen Spende oder kaufe offiziellen Merch. Ein unabhängiges Blues-Archiv ohne Display-Werbung in den Künstlerartikeln.",
  },
  pl: {
    title: "Wesprzyj SlowBlues — utrzymaj archiwum bluesa przy życiu",
    description:
      "Wesprzyj SlowBlues jednorazowo lub miesięczną wpłatą albo kup oficjalny merch. Niezależne archiwum bluesa bez reklam displayowych w artykułach o artystach.",
  },
};

export function supportPath(locale: ArtistLocale): string {
  return locale === "en" ? "/support" : `/${locale}/support`;
}

export function supportHead(locale: ArtistLocale) {
  const { title, description } = SUPPORT_SEO[locale];
  const url = `${SITE}${supportPath(locale)}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: locale },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hreflang: "en", href: `${SITE}/support` },
      { rel: "alternate", hreflang: "no", href: `${SITE}/no/support` },
      { rel: "alternate", hreflang: "sv", href: `${SITE}/sv/support` },
      { rel: "alternate", hreflang: "de", href: `${SITE}/de/support` },
      { rel: "alternate", hreflang: "pl", href: `${SITE}/pl/support` },
      { rel: "alternate", hreflang: "x-default", href: `${SITE}/support` },
    ],
  };
}
