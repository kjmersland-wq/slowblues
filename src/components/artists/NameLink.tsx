import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import type { ArtistRecord } from "@/lib/artists";
import { artistDetailPath, type ArtistLocale } from "@/lib/locale";

export type NameIndex = Map<string, string>; // normalised name -> slug

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export function buildNameIndex(all: ArtistRecord[] | null | undefined): NameIndex {
  const m = new Map<string, string>();
  for (const a of all ?? []) {
    if (a.name) m.set(norm(a.name), a.slug);
    if (a.alt_name) m.set(norm(a.alt_name), a.slug);
    if (a.birth_name) m.set(norm(a.birth_name), a.slug);
  }
  return m;
}

export function useNameIndex(all: ArtistRecord[] | null | undefined): NameIndex {
  return useMemo(() => buildNameIndex(all), [all]);
}

/**
 * Render a person's name as:
 *  - internal Link to /artists/<slug> when the name matches an artist in the system
 *  - external Wikipedia search link otherwise
 */
export function NameLink({
  name,
  index,
  locale,
  className = "text-gold hover:text-amber-200 underline-offset-4 hover:underline",
}: {
  name: string;
  index: NameIndex;
  locale: ArtistLocale;
  className?: string;
}) {
  if (!name) return null;
  const slug = index.get(norm(name));
  if (slug) {
    return (
      <Link to={artistDetailPath(locale, slug)} className={className}>
        {name}
      </Link>
    );
  }
  const wikiLang = locale === "en" ? "en" : locale === "de" ? "de" : locale === "sv" ? "sv" : locale === "pl" ? "pl" : "no";
  const href = `https://${wikiLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} inline-flex items-center gap-0.5`}
      title={`Søk Wikipedia: ${name}`}
    >
      {name}
      <ExternalLink className="size-3 opacity-60" />
    </a>
  );
}

/** Render a comma-separated list of names, each individually linked. */
export function NameList({
  names,
  index,
  locale,
  separator = ", ",
}: {
  names: string[];
  index: NameIndex;
  locale: ArtistLocale;
  separator?: string;
}) {
  return (
    <>
      {names.map((n, i) => (
        <span key={`${n}-${i}`}>
          <NameLink name={n} index={index} locale={locale} />
          {i < names.length - 1 ? separator : ""}
        </span>
      ))}
    </>
  );
}
