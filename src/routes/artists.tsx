import { createFileRoute, Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { useArtists } from "@/lib/artists";
import { IMG } from "@/data/images";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/artists")({
  component: ArtistsPage,
  head: () => ({ meta: [
    { title: "Artists — SlowBlues" },
    { name: "description", content: "330+ artist profiles. The pioneers, masters and today's voices of the blues." },
    { property: "og:title", content: "Artists — SlowBlues" },
    { property: "og:image", content: IMG.muddyWaters },
  ]}),
});

const TAGS = ["All", "Delta", "Chicago", "Texas", "British", "Classic", "Modern", "Nordic"] as const;

function ArtistsPage() {
  const { t } = useI18n();
  const { data, loading, error } = useArtists();
  const [tag, setTag] = useState<string>("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => (data ?? []).filter((a) => (tag === "All" || a.tag === tag) && a.name.toLowerCase().includes(q.toLowerCase())),
    [tag, q, data],
  );

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.artists.eyebrow} title={t.pages.artists.title} lead={t.pages.artists.lead} img={IMG.bbKing} />
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center gap-3 justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {TAGS.map((x) => (
              <button key={x} onClick={() => setTag(x)} className={`px-3 py-1.5 rounded-full text-sm border transition ${tag === x ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:text-gold hover:border-gold/50"}`}>
                {x === "All" ? t.pages.artists.filterAll : x}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 w-full sm:w-auto">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.pages.artists.search} className="bg-transparent outline-none text-sm w-full sm:w-48" />
          </label>
        </div>

        {error && <p className="text-center text-destructive py-8">Kunne ikke laste artister: {error}</p>}
        {loading && !data && <p className="text-center text-muted-foreground py-16">Laster artister…</p>}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((a) => (
            <Link key={a.slug} to="/artists/$slug" params={{ slug: a.slug }} className="group bg-card/50 border border-border rounded-lg overflow-hidden hover:border-gold/60 transition">
              <div className="aspect-[3/4] overflow-hidden">
                {a.img && <SafeImage src={a.img} alt={a.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />}
              </div>
              <div className="p-4">
                <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1">{a.tag}{a.era && ` · ${a.era}`}</div>
                <h3 className="font-display text-xl mb-1">{a.name}</h3>
                {a.short && <p className="text-xs text-muted-foreground leading-relaxed">{a.short}</p>}
              </div>
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-16">No artists match your filter.</p>}
        <p className="text-xs text-muted-foreground text-center mt-10">Portraits: Wikimedia Commons / Library of Congress — {t.common.publicDomain} & CC.</p>
      </section>
    </PageShell>
  );
}
