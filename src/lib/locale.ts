export const SUPPORTED_LOCALES = ["no", "en", "sv", "de", "pl"] as const;
export type ArtistLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: ArtistLocale = "no";

export function isLocale(v: string | undefined | null): v is ArtistLocale {
  return !!v && (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

export function localePrefix(locale: ArtistLocale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function artistsListPath(locale: ArtistLocale): string {
  return `${localePrefix(locale)}/artists`;
}

export function artistDetailPath(locale: ArtistLocale, slug: string): string {
  return `${localePrefix(locale)}/artists/${slug}`;
}

const LOCALE_LABELS: Record<ArtistLocale, string> = {
  no: "Norsk",
  en: "English",
  sv: "Svenska",
  de: "Deutsch",
  pl: "Polski",
};

export function localeLabel(l: ArtistLocale): string {
  return LOCALE_LABELS[l];
}
