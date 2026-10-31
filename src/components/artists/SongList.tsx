import { useState } from "react";
import { Play, Pause } from "lucide-react";
import type { TrackEntry } from "@/lib/artists";

/**
 * Playable song list for an artist profile (artists.key_recordings, filled by scripts/video_sync.py).
 * Songs are single tracks, mostly from the artist's "- Topic" channel. Nothing is requested from YouTube
 * until a song is clicked; then a privacy-enhanced embed starts playing inside that row. The data is stored
 * and verified in advance, so this section never needs the YouTube Data API.
 */
export function SongList({ songs, watchLabel }: { songs: TrackEntry[]; watchLabel: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <ul className="divide-y divide-border/60 rounded-xl border border-border bg-card/40 overflow-hidden">
      {songs.map((s) => {
        const open = openId === s.youtube_id;
        const channel = (s.channel ?? "").replace(/\s*-\s*Topic$/i, "");
        return (
          <li key={s.youtube_id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : s.youtube_id)}
              aria-expanded={open}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gold/5 transition"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                {open ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-foreground">{s.title}</span>
                {channel && <span className="block truncate text-xs text-muted-foreground">{channel}</span>}
              </span>
            </button>
            {open && (
              <div className="px-4 pb-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-gold/20 bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${s.youtube_id}?autoplay=1&rel=0&playsinline=1`}
                    title={s.title}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${s.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-gold hover:underline"
                >
                  {watchLabel}
                </a>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
