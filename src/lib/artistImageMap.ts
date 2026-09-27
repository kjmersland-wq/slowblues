// Resolve `/src/assets/artists/...` paths (stored in the DB `img` column) to bundled URLs.
// Only the WebP derivatives made by scripts/optimize-images.mjs are bundled
// (name.webp = up to 1000px, name-400.webp = card size); the original jpg/png
// files stay in the repo as sources but are never shipped to visitors.
const images = import.meta.glob("/src/assets/artists/**/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export type ArtistImageSize = "full" | "card";

export function resolveArtistImage(src: string | null | undefined, size: ArtistImageSize = "full"): string | null {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith("/src/assets/")) {
    const base = src.replace(/\.(jpe?g|png|webp)$/i, "");
    if (size === "card") {
      const card = images[`${base}-400.webp`];
      if (card) return card;
    }
    return images[`${base}.webp`] ?? null;
  }
  return src;
}
