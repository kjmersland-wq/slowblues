import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { YouTubeGrid } from "@/components/YouTubeEmbed";
import { searchYouTube } from "@/lib/youtube.functions";
import { IMG } from "@/data/images";
import { Search, Loader2 } from "lucide-react";

export const Route = createFileRoute("/watch")({
  component: WatchPage,
  head: () => ({
    meta: [
      { title: "Watch — Blues on YouTube — SlowBlues" },
      { name: "description", content: "Live performances, interviews, sessions and rare blues footage — curated from YouTube." },
      { property: "og:title", content: "Watch — Blues on YouTube" },
      { property: "og:image", content: IMG.microphone },
    ],
  }),
});

const PRESETS = [
  "Buddy Guy live",
  "Susan Tedeschi Derek Trucks",
  "Slow blues jam",
  "Tedeschi Trucks Band",
  "John Lee Hooker interview",
  "Joe Bonamassa acoustic",
  "Gary Clark Jr",
  "Christone Kingfish Ingram",
] as const;

function WatchPage() {
  const search = useServerFn(searchYouTube);
  const [query, setQuery] = useState<string>("Slow blues live performance");

  const { data, isFetching, error } = useQuery({
    queryKey: ["yt-search", query],
    queryFn: () => search({ data: { query, max: 12 } }),
    enabled: query.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Watch"
        title="Blues on YouTube"
        lead="Every video on SlowBlues is sourced from YouTube — the only place we trust for full performances, interviews and the deep cuts that keep the music alive."
        img={IMG.microphone}
      />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("q") || "").trim();
            if (q) setQuery(q);
          }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search artists, songs, festivals…"
              className="w-full pl-11 pr-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
          >
            Search YouTube
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-10">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setQuery(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                query === p
                  ? "bg-gold text-black border-gold"
                  : "bg-card border-gold/20 text-muted-foreground hover:border-gold/60 hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {isFetching && (
          <div className="flex items-center gap-2 text-muted-foreground py-12">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading from YouTube…
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400 py-6">Unable to reach YouTube right now. Try again shortly.</p>
        )}

        {data?.error && (
          <p className="text-sm text-amber-400 py-6">{data.error}</p>
        )}

        {data?.videos && data.videos.length > 0 && <YouTubeGrid videos={data.videos} />}

        {data && !isFetching && data.videos.length === 0 && !data.error && (
          <p className="text-muted-foreground py-12">No results for "{query}".</p>
        )}
      </section>
    </PageShell>
  );
}
