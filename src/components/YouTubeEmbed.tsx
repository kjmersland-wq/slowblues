import { useMemo, useState } from "react";
import { Play, Repeat } from "lucide-react";
import type { YTVideo } from "@/lib/youtube.functions";

type Props = {
  videoId: string;
  title?: string;
  thumbnail?: string;
  className?: string;
  /** Optional start/end in seconds — trims playback. Neither claims a
   * by-ear-verified "highlight" clip beyond what YouTube's own start=/end=
   * genuinely support; see docs/media-candidates.md for which are guesses. */
  start?: number;
  end?: number;
  /** Interface language passed to YouTube (hl=) so its own UI and, where
   * available, auto captions default to the viewer's locale. Captions are
   * not guaranteed to exist in every language -- written steps stay the
   * primary teaching content, video is support. */
  locale?: "en" | "no" | "sv" | "de" | "pl";
  /** Shows a "loop this section" toggle under the player (only meaningful
   * alongside start/end -- loops the whole video otherwise). */
  loopable?: boolean;
};

const LOCALE_TO_YT: Record<string, string> = { en: "en", no: "no", sv: "sv", de: "de", pl: "pl" };

/**
 * Lite-style YouTube embed: shows thumbnail until clicked, then loads the
 * privacy-enhanced iframe. Saves bandwidth and avoids YouTube cookies on load.
 */
export function YouTubeEmbed({ videoId, title, thumbnail, className, start, end, locale, loopable }: Props) {
  const [active, setActive] = useState(false);
  const [loop, setLoop] = useState(false);
  const thumb = thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const src = useMemo(() => {
    const params = new URLSearchParams({ autoplay: "1", rel: "0", cc_load_policy: "1" });
    if (start) params.set("start", String(start));
    if (end) params.set("end", String(end));
    if (locale) {
      params.set("hl", LOCALE_TO_YT[locale] ?? "en");
      params.set("cc_lang_pref", LOCALE_TO_YT[locale] ?? "en");
    }
    if (loop) {
      params.set("loop", "1");
      params.set("playlist", videoId); // YouTube requires playlist= to loop a single video
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, start, end, locale, loop]);

  if (active) {
    return (
      <div className={className}>
        <div className="relative aspect-video overflow-hidden rounded-lg border border-gold/20 bg-black">
          <iframe
            key={src}
            src={src}
            title={title || "YouTube video"}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {loopable && (start !== undefined || end !== undefined) && (
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="accent-gold" />
            <Repeat className="size-3.5" /> Loop this section
          </label>
        )}
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
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
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
