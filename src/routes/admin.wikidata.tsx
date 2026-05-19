import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { searchWikidata, getWikidataArtist, type ArtistFacts } from "@/lib/wikidata.functions";
import { buildArtistSchema, mergeFactsToSchema } from "@/lib/artistSchema";
import { IMG } from "@/data/images";
import { Search, Loader2, Copy, Check, ExternalLink, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/wikidata")({
  component: WikidataAdminPage,
  head: () => ({
    meta: [
      { title: "Wikidata Enrichment — SlowBlues Admin" },
      { name: "description", content: "Enrich artist records with structured Wikidata facts (dates, genres, instruments, identifiers, SEO schema) without touching editorial text." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function WikidataAdminPage() {
  const search = useServerFn(searchWikidata);
  const getArtist = useServerFn(getWikidataArtist);

  const [query, setQuery] = useState("Buddy Guy");
  const [qid, setQid] = useState<string | null>(null);

  const { data: searchData, isFetching: searching } = useQuery({
    queryKey: ["wd-search", query],
    queryFn: () => search({ data: { query, lang: "en" } }),
    enabled: query.length > 1,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: factsData, isFetching: loadingFacts } = useQuery({
    queryKey: ["wd-artist", qid],
    queryFn: () => getArtist({ data: { qid: qid!, lang: "en" } }),
    enabled: !!qid,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="Admin · Editorial"
        title="Wikidata Enrichment"
        lead="Search Wikidata for an artist, pull structured facts (dates, genres, instruments, identifiers) and copy SEO schema. Wikidata is metadata only — the SlowBlues biography stays human-written."
        img={IMG.microphone}
      />

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3 text-sm text-amber-200/90">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Editorial rule:</strong> Use Wikidata for facts and SEO links only.
            Never paste Wikipedia text into SlowBlues. Biographies must be written by hand —
            personal, blues-cultural, in our own voice.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("q") || "").trim();
            if (q) {
              setQuery(q);
              setQid(null);
            }
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Artist name (e.g. John Lee Hooker)"
              className="w-full pl-11 pr-4 py-3 bg-card border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
            Search Wikidata
          </button>
        </form>

        {searching && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching…
          </div>
        )}

        {searchData?.hits && searchData.hits.length > 0 && !qid && (
          <ul className="divide-y divide-border border border-gold/20 rounded-lg overflow-hidden">
            {searchData.hits.map((h) => (
              <li key={h.qid}>
                <button
                  onClick={() => setQid(h.qid)}
                  className="w-full text-left px-4 py-3 hover:bg-card/50 transition flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {h.label}
                      <span className="text-xs font-mono text-muted-foreground">{h.qid}</span>
                    </div>
                    {h.description && <p className="text-sm text-muted-foreground truncate">{h.description}</p>}
                  </div>
                  <span className="text-xs text-gold flex-shrink-0">Select →</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {qid && loadingFacts && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching facts for {qid}…
          </div>
        )}

        {qid && factsData?.facts && <FactsPanel facts={factsData.facts} onBack={() => setQid(null)} />}
      </section>
    </PageShell>
  );
}

function FactsPanel({ facts, onBack }: { facts: ArtistFacts; onBack: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const schema = buildArtistSchema(
    mergeFactsToSchema(
      {
        name: facts.label,
        url: `https://sslow-blues.lovable.app/artists/${facts.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        description: "[Write a 1–2 sentence SlowBlues editorial description here]",
      },
      facts
    )
  );
  const schemaJson = JSON.stringify(schema, null, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to search
        </button>
        <a
          href={facts.wikidataUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-gold hover:underline"
        >
          {facts.qid} <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-3xl text-gold">{facts.label}</h2>
            {facts.description && (
              <p className="text-sm text-muted-foreground italic mt-1">{facts.description} <span className="text-xs not-italic text-amber-300">— Wikidata one-liner. Do not use as bio.</span></p>
            )}
          </div>

          <FactGrid>
            <Fact label="Born" value={facts.dateOfBirth} onCopy={facts.dateOfBirth ? () => copy("born", facts.dateOfBirth!) : undefined} copied={copied === "born"} />
            <Fact label="Died" value={facts.dateOfDeath} onCopy={facts.dateOfDeath ? () => copy("died", facts.dateOfDeath!) : undefined} copied={copied === "died"} />
            <Fact label="Birthplace" value={facts.placeOfBirth?.label} onCopy={facts.placeOfBirth ? () => copy("birthplace", facts.placeOfBirth!.label) : undefined} copied={copied === "birthplace"} />
            <Fact label="Country" value={facts.countryOfCitizenship.map((c) => c.label).join(", ")} onCopy={() => copy("country", facts.countryOfCitizenship.map((c) => c.label).join(", "))} copied={copied === "country"} />
          </FactGrid>

          <Chips title="Genres" items={facts.genres.map((g) => g.label)} onCopy={() => copy("genres", facts.genres.map((g) => g.label).join(", "))} copied={copied === "genres"} />
          <Chips title="Instruments" items={facts.instruments.map((i) => i.label)} onCopy={() => copy("instruments", facts.instruments.map((i) => i.label).join(", "))} copied={copied === "instruments"} />
          <Chips title="Influenced by" items={facts.influencedBy.map((i) => i.label)} onCopy={() => copy("infBy", facts.influencedBy.map((i) => i.label).join(", "))} copied={copied === "infBy"} />
          <Chips title="Influenced" items={facts.influenced.map((i) => i.label)} onCopy={() => copy("infd", facts.influenced.map((i) => i.label).join(", "))} copied={copied === "infd"} />
          <Chips title="Record labels" items={facts.recordLabels.map((l) => l.label)} onCopy={() => copy("labels", facts.recordLabels.map((l) => l.label).join(", "))} copied={copied === "labels"} />

          <div className="rounded-lg border border-gold/20 bg-card/50 p-4">
            <p className="text-xs uppercase tracking-wider text-gold mb-3">External identifiers</p>
            <ul className="space-y-1.5 text-sm">
              <IdRow label="MusicBrainz" id={facts.externalIds.musicBrainz} href={facts.externalIds.musicBrainz && `https://musicbrainz.org/artist/${facts.externalIds.musicBrainz}`} />
              <IdRow label="Discogs" id={facts.externalIds.discogs} href={facts.externalIds.discogs && `https://www.discogs.com/artist/${facts.externalIds.discogs}`} />
              <IdRow label="AllMusic" id={facts.externalIds.allMusic} href={facts.externalIds.allMusic && `https://www.allmusic.com/artist/${facts.externalIds.allMusic}`} />
              <IdRow label="Spotify" id={facts.externalIds.spotify} href={facts.externalIds.spotify && `https://open.spotify.com/artist/${facts.externalIds.spotify}`} />
              <IdRow label="YouTube channel" id={facts.externalIds.youtubeChannel} href={facts.externalIds.youtubeChannel && `https://www.youtube.com/channel/${facts.externalIds.youtubeChannel}`} />
              <IdRow label="Official website" id={facts.officialWebsite} href={facts.officialWebsite} />
              <IdRow label="Wikipedia (reference only)" id={facts.wikipediaUrl} href={facts.wikipediaUrl} />
            </ul>
          </div>
        </div>

        <aside className="space-y-3">
          {facts.imageUrl && (
            <figure className="rounded-lg overflow-hidden border border-gold/20">
              <img src={facts.imageUrl} alt={facts.label} className="w-full h-auto" />
              <figcaption className="px-3 py-2 text-[10px] text-muted-foreground bg-card">
                Image via Wikimedia Commons. Verify licence before using.
              </figcaption>
            </figure>
          )}
          <button
            onClick={() => copy("qid", facts.qid)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gold/30 text-sm text-foreground hover:border-gold transition"
          >
            {copied === "qid" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy Q-ID ({facts.qid})
          </button>
        </aside>
      </div>

      <div className="rounded-lg border border-gold/20 bg-card/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wider text-gold">Schema.org JSON-LD (paste in artist page &lt;head&gt;)</p>
          <button
            onClick={() => copy("schema", `<script type="application/ld+json">\n${schemaJson}\n</script>`)}
            className="flex items-center gap-1 text-sm text-gold hover:text-gold/80"
          >
            {copied === "schema" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy &lt;script&gt;
          </button>
        </div>
        <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap overflow-auto max-h-96">{schemaJson}</pre>
        <p className="text-xs text-muted-foreground mt-2">
          The <code className="text-gold">description</code> placeholder is intentionally blank — fill it with editorial copy before publishing.
        </p>
      </div>
    </div>
  );
}

function FactGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>;
}

function Fact({ label, value, onCopy, copied }: { label: string; value?: string; onCopy?: () => void; copied: boolean }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between gap-2 mt-1">
        <p className="text-sm font-semibold text-foreground truncate">{value || <span className="text-muted-foreground italic font-normal">—</span>}</p>
        {onCopy && (
          <button onClick={onCopy} className="text-muted-foreground hover:text-gold">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

function Chips({ title, items, onCopy, copied }: { title: string; items: string[]; onCopy: () => void; copied: boolean }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-wider text-gold">{title}</p>
        <button onClick={onCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy all
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} className="text-xs px-2.5 py-1 rounded-full bg-card border border-gold/20 text-foreground">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function IdRow({ label, id, href }: { label: string; id?: string; href?: string | false | null }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
      {id && href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline flex items-center gap-1 truncate">
          {id} <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      ) : id ? (
        <span className="text-sm text-foreground font-mono truncate">{id}</span>
      ) : (
        <span className="text-sm text-muted-foreground italic">—</span>
      )}
    </li>
  );
}
