import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { siteSearch, type SearchResult } from "@/lib/search.functions";

type SearchParams = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search — Slow-Blues" },
      { name: "description", content: "Search Slow-Blues for artists, albums, reviews, styles, instruments and festivals." },
      // Dynamic query-string results — not meant to be indexed individually;
      // the content pages it links to remain fully indexable on their own.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function SearchPage() {
  const { t, lang } = useI18n();
  const { q: urlQ } = Route.useSearch();
  const navigate = useNavigate();
  const s = t.pages.search;

  const [value, setValue] = useState(urlQ ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function runSearch(query: string) {
    setLoading(true);
    try {
      const res = await siteSearch({ data: { q: query, lang } });
      setResults(res.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = value.trim();
    navigate({ to: "/search", search: query ? { q: query } : {}, replace: true });
    if (!query) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, lang]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = value.trim();
    if (query) runSearch(query);
  }

  function clear() {
    setValue("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") clear();
  }

  return (
    <PageShell>
      <PageHero eyebrow="Slow-Blues" title={s.title} lead={s.placeholder} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} role="search" aria-label={s.ariaInput}>
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={s.placeholder}
              aria-label={s.ariaInput}
              autoComplete="off"
              className="w-full bg-card border border-border rounded-lg pl-4 pr-24 py-3 text-base focus:border-gold outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {value && (
                <button
                  type="button"
                  aria-label={s.ariaClear}
                  onClick={clear}
                  className="p-2 text-muted-foreground hover:text-gold"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
              <button type="submit" aria-label={s.ariaSubmit} className="p-2 text-muted-foreground hover:text-gold">
                <Search className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8" role="status" aria-live="polite">
          {loading && <p className="text-sm text-muted-foreground">{s.loading}</p>}
          {!loading && hasSearched && results.length === 0 && (
            <p className="text-sm text-muted-foreground">{s.noResults}</p>
          )}
          {!loading && results.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                {s.resultsCount.replace("{n}", String(results.length))}
              </p>
              <ul className="space-y-2">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={r.href as any}
                      className="flex items-center justify-between gap-3 bg-card/60 border border-border rounded-lg px-4 py-3 hover:border-gold/40 transition"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-foreground/90">{r.title}</span>
                        {r.subtitle && <span className="block truncate text-xs text-muted-foreground">{r.subtitle}</span>}
                      </span>
                      <span className="shrink-0 text-[10px] tracking-[0.2em] uppercase text-gold border border-gold/30 rounded-full px-2 py-0.5">
                        {s.categories[r.type as keyof typeof s.categories]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
