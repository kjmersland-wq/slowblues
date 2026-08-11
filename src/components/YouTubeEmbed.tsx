import { useState } from "react";
import { Play } from "lucide-react";
import type { YTVideo } from "@/lib/youtube.functions";

type Props = {
  videoId: string;
  title?: string;
  thumbnail?: string;
  className?: string;
};

/**
 * Lite-style YouTube embed: shows thumbnail until clicked, then loads the
 * privacy-enhanced iframe. Saves bandwidth and avoids YouTube cookies on load.
 */
export function YouTubeEmbed({ videoId, title, thumbnail, className }: Props) {
  const [active, setActive] = useState(false);
  const thumb = thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (active) {
    return (
      <div className={`relative aspect-video overflow-hidden rounded-lg border border-gold/20 bg-black ${className ?? ""}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || "YouTube video"}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={title ? `Play: ${title}` : "Play video"}
      className={`group relative aspect-video w-full overflow-hidden rounded-lg border border-gold/20 bg-black ${className ?? ""}`}
    >
      <img
        src={thumb}
        alt={title || ""}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/20">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/95 text-black shadow-[0_8px_28px_rgba(0,0,0,0.55)] transition group-hover:scale-105">
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </span>
      {title && (
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-4 py-3 text-left text-sm font-medium text-white">
          {title}
        </span>
      )}
    </button>
  );
}

export function YouTubeGrid({ videos }: { videos: YTVideo[] }) {
  if (!videos.length) return null;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <article key={v.id} className="flex flex-col gap-3">
          <YouTubeEmbed videoId={v.id} title={v.title} thumbnail={v.thumbnail} />
          <div>
            <h3 className="line-clamp-2 text-base font-semibold text-foreground">{v.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{v.channelTitle}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
