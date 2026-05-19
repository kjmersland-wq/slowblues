import { useState, type ImgHTMLAttributes } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

/**
 * <img> with graceful fallback when the upstream CDN (Wikimedia/Unsplash/Pexels)
 * is unreachable, blocks hotlinking, or returns 404.
 */
export function SafeImage({ src, alt, fallbackLabel, className, ...rest }: Props) {
  const [errored, setErrored] = useState(false);

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

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
      {...rest}
    />
  );
}
