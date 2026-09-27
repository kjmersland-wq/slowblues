import { useState, type ImgHTMLAttributes } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  /** Wikimedia originals are re-requested as a right-sized thumbnail (500px, 960px for 2x screens). */
  thumb?: boolean;
}

// https://upload.wikimedia.org/wikipedia/commons/c/ce/File.jpg
//   -> https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/File.jpg/500px-File.jpg
// Only widths on Wikimedia's standard steps (500, 960) are used. SVG/TIFF and URLs that are
// already thumbnails are left alone.
function wikimediaThumb(url: string, width: number): string | null {
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/(?:commons|en))\/([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)$/i);
  if (!m) return null;
  const [, host, a, ab, file] = m;
  if (/\.(svg|tiff?)$/i.test(file)) return null;
  return `${host}/thumb/${a}/${ab}/${file}/${width}px-${file}`;
}

/**
 * <img> with graceful fallback when the upstream CDN (Wikimedia/Unsplash/Pexels)
 * is unreachable, blocks hotlinking, or returns 404.
 */
export function SafeImage({ src, alt, fallbackLabel, className, thumb, ...rest }: Props) {
  const [errored, setErrored] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  if (errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-muted to-muted/40 text-muted-foreground text-xs text-center p-3 ${className ?? ""}`}
      >
        <span className="opacity-70">
          {fallbackLabel ?? alt ?? "Image unavailable"}
        </span>
      </div>
    );
  }

  const small = thumb && !useOriginal ? wikimediaThumb(src, 500) : null;
  const large = thumb && !useOriginal ? wikimediaThumb(src, 960) : null;

  return (
    <img
      src={small ?? src}
      srcSet={small && large ? `${small} 1x, ${large} 2x` : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => (small ? setUseOriginal(true) : setErrored(true))}
      className={className}
      {...rest}
    />
  );
}
