import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchArtistsWithQuotes, saveArtistQuotes } from "@/lib/quotes.functions";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { Quote, Trash2, Plus, Save, Search } from "lucide-react";

export const Route = createFileRoute("/admin/quotes")({
  component: QuotesAdminPage,
  head: () => ({ meta: [{ title: "Pressomtaler — Admin" }, { name: "robots", content: "noindex" }] }),
});

type ArtistRow = { id: string; slug: string; name: string; press_quotes: PressQuote[] };
type PressQuote = {
  quote: string;
  author: string;
  role?: string;
  year?: number;
  source_url?: string;
  source_title?: string;
  verified?: boolean;
};

const empty: PressQuote = { quote: "", author: "", role: "", year: undefined, source_url: "", source_title: "", verified: true };

function QuotesAdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<PressQuote>(empty);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  const load = async () => {
    setBusy(true);
    try {
      const rows = await fetchArtistsWithQuotes();
      setArtists(rows as ArtistRow[]);
    } catch {
      setMsg("Klarte ikke laste artister.");
    }
    setBusy(false);
  };

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin]);

  const filtered = useMemo(
    () => artists.filter((a) => a.name.toLowerCase().includes(filter.toLowerCase())),
    [artists, filter]
  );
  const current = artists.find((a) => a.slug === selectedSlug) ?? null;

  const saveQuotes = async (next: PressQuote[]) => {
    if (!current) return;
    setBusy(true);
    try {
      await saveArtistQuotes({ data: { id: current.id, press_quotes: next } });
      setArtists((prev) => prev.map((a) => (a.id === current.id ? { ...a, press_quotes: next } : a)));
      setMsg("Lagret.");
    } catch (e) {
      setMsg("Lagring feilet: " + (e instanceof Error ? e.message : String(e)));
    }
    setBusy(false);
  };

  const addQuote = async () => {
    if (!current || !draft.quote.trim() || !draft.author.trim()) {
      setMsg("Sitat og forfatter er påkrevd.");
      return;
    }
    const cleaned: PressQuote = {
      quote: draft.quote.trim(),
      author: draft.author.trim(),
      ...(draft.role?.trim() ? { role: draft.role.trim() } : {}),
      ...(draft.year ? { year: Number(draft.year) } : {}),
      ...(draft.source_url?.trim() ? { source_url: draft.source_url.trim() } : {}),
      ...(draft.source_title?.trim() ? { source_title: draft.source_title.trim() } : {}),
      verified: true,
    };
    await saveQuotes([...(current.press_quotes ?? []), cleaned]);
    setDraft(empty);
  };

  const removeQuote = async (idx: number) => {
    if (!current) return;
    if (!confirm("Slette dette sitatet?")) return;
    const next = [...current.press_quotes];
    next.splice(idx, 1);
    await saveQuotes(next);
  };

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Pressomtaler & sitater" lead="Legg til kritikersitater og uttalelser med kilde for hver artist." img={IMG.pianoNight} />
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-gold">← Tilbake til admin</Link>
      </div>
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[280px_1fr] gap-6">

        <aside className="border border-border rounded-lg bg-card/40 p-3 h-fit">
          <div className="relative mb-3">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Søk artist…"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto space-y-1">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => { setSelectedSlug(a.slug); setMsg(null); }}
                className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between gap-2 ${a.slug === selectedSlug ? "bg-gold/15 text-gold" : "hover:bg-card"}`}
              >
                <span className="truncate">{a.name}</span>
                <span className="text-[10px] text-muted-foreground">{a.press_quotes?.length ?? 0}</span>
              </button>
            ))}
          </div>
        </aside>

        <div>
          {msg && <p className="text-sm text-gold mb-4">{msg}</p>}
          {!current ? (
            <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-10 text-center">
              Velg en artist fra listen for å redigere pressomtaler.
            </div>
          ) : (
            <div className="space-y-6">
              <header className="flex items-center justify-between">
                <h2 className="font-display text-2xl">{current.name}</h2>
                <Link to="/artists/$slug" params={{ slug: current.slug }} className="text-xs text-gold hover:underline">Se artistsiden →</Link>
              </header>

              <div className="border border-border rounded-lg bg-card/40 p-5">
                <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2"><Plus className="size-4" /> Nytt sitat</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} placeholder="Sitatet (uten anførselstegn)" className="sm:col-span-2 px-3 py-2 rounded bg-background border border-border text-sm min-h-[90px] focus:outline-none focus:border-gold" />
                  <input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} placeholder="Forfatter / kritiker *" className="px-3 py-2 rounded bg-background border border-border text-sm focus:outline-none focus:border-gold" />
                  <input value={draft.role ?? ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="Rolle / publikasjon" className="px-3 py-2 rounded bg-background border border-border text-sm focus:outline-none focus:border-gold" />
                  <input value={draft.year ?? ""} onChange={(e) => setDraft({ ...draft, year: e.target.value ? Number(e.target.value) : undefined })} placeholder="År" type="number" className="px-3 py-2 rounded bg-background border border-border text-sm focus:outline-none focus:border-gold" />
                  <input value={draft.source_title ?? ""} onChange={(e) => setDraft({ ...draft, source_title: e.target.value })} placeholder="Kilde-tittel" className="px-3 py-2 rounded bg-background border border-border text-sm focus:outline-none focus:border-gold" />
                  <input value={draft.source_url ?? ""} onChange={(e) => setDraft({ ...draft, source_url: e.target.value })} placeholder="Kilde-URL (https://…)" className="sm:col-span-2 px-3 py-2 rounded bg-background border border-border text-sm focus:outline-none focus:border-gold" />
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={addQuote} disabled={busy} className="px-4 py-2 rounded-md bg-gold text-primary-foreground text-sm flex items-center gap-2 disabled:opacity-60">
                    <Save className="size-4" /> Lagre sitat
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Eksisterende sitater ({current.press_quotes?.length ?? 0})</h3>
                {(current.press_quotes ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">Ingen sitater lagt inn ennå.</p>
                )}
                <div className="space-y-3">
                  {(current.press_quotes ?? []).map((q, i) => (
                    <article key={i} className="border border-border rounded-lg p-5 bg-card/40 flex gap-4">
                      <Quote className="size-5 text-amber-400 shrink-0 mt-1" />
                      <div className="flex-1">
                        <blockquote className="text-foreground/90 italic mb-2">"{q.quote}"</blockquote>
                        <div className="text-xs text-muted-foreground">
                          <span className="text-amber-200">{q.author}</span>
                          {q.role && <> · {q.role}</>}
                          {q.year && <> · {q.year}</>}
                          {q.source_url && (
                            <> — <a href={q.source_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{q.source_title ?? "kilde"}</a></>
                          )}
                          {!q.source_url && q.source_title && <> — {q.source_title}</>}
                        </div>
                      </div>
                      <button onClick={() => removeQuote(i)} className="self-start p-2 rounded-md border border-border hover:border-red-500 hover:text-red-400">
                        <Trash2 className="size-4" />
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
