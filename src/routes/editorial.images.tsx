import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { UnsplashImage } from "@/components/UnsplashImage";
import { searchUnsplash, trackUnsplashDownload, type UnsplashPhoto } from "@/lib/unsplash.functions";
import { IMG } from "@/data/images";
import { Search, Loader2, Copy, Check, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/editorial/images")({
  component: ImagesPage,
  head: () => ({
    meta: [
      { title: "Editorial Images — SlowBlues" },
      { name: "description", content: "Search Unsplash for editorial photography — hero images, atmospherics, portraits — with one-click attribution-ready markup." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const PRESETS = ["blues guitar", "smoky bar stage", "harmonica close up", "vinyl record", "jazz club new orleans", "delta mississippi", "concert crowd silhouette", "vintage microphone"] as const;

type Orientation = "landscape" | "portrait" | "squarish";

function ImagesPage() {
  const search = useServerFn(searchUnsplash);
  const track = useServerFn(trackUnsplashDownload);

  const [query, setQuery] = useState("blues guitar stage");
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: ["unsplash", query, orientation],
    queryFn: () => search({ data: { query, orientation, perPage: 18 } }),
    enabled: query.length > 0,
    staleTime: 30 * 60 * 1000,
  });

  const useImage = async (p: UnsplashPhoto) => {
    // Required by Unsplash guidelines: track download when actually using the photo.
    await track({ data: { downloadLocation: p.links.downloadLocation } });
    const snippet =
      `<img src="${p.urls.regular}" alt="${(p.altDescription ?? p.description ?? "").replace(/"/g, "&quot;")}" width="${p.width}" height="${p.height}" />\n` +
      `<p>Photo by <a href="${p.user.profileUrl}" target="_blank" rel="noopener">${p.user.name}</a> on <a href="${p.links.html}" target="_blank" rel="noopener">Unsplash</a></p>`;
    await navigator.clipboard.writeText(snippet);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Editorial"
        title="Image Library — Unsplash"
        lead="Search for hero shots and article images. Click Use to copy attribution-ready HTML — and to register the download with Unsplash as required by their API guidelines."
        img={IMG.microphone}
      />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("q") || "").trim();
            if (q) setQuery(q);
          }}
          className="flex flex-col md:flex-row gap-3 mb-5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search Unsplash…"
              className="w-full pl-11 pr-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
          </div>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="px-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground focus:outline-none focus:border-gold"
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="squarish">Square</option>
          </select>
          <button type="submit" className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-10">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setQuery(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                query === p ? "bg-gold text-black border-gold" : "bg-card border-gold/20 text-muted-foreground hover:border-gold/60 hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {isFetching && (
          <div className="flex items-center gap-2 text-muted-foreground py-12">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading photos…
          </div>
        )}
        {error && <p className="text-sm text-red-400 py-6">Unable to reach Unsplash right now.</p>}
        {data?.error && <p className="text-sm text-amber-400 py-6">{data.error}</p>}

        {data?.photos && data.photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.photos.map((p) => (
              <div key={p.id} className="group flex flex-col gap-3">
                <UnsplashImage photo={p} size="small" className="aspect-[4/3]" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => useImage(p)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-gold text-black text-sm font-semibold hover:bg-gold/90 transition"
                  >
                    {copied === p.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === p.id ? "Copied + tracked" : "Use (copy HTML)"}
                  </button>
                  <a
                    href={p.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md border border-gold/30 text-muted-foreground hover:text-gold hover:border-gold transition"
                    aria-label="View on Unsplash"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
