// Resolve `/src/assets/artists/...` paths (stored in DB `img` column) to bundled URLs.
const images = import.meta.glob("/src/assets/artists/**/*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function resolveArtistImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith("/src/assets/")) return images[src] ?? null;
  return src;
}
