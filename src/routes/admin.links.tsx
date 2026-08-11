import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { Link2Off, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { checkArtistLinks, clearArtistLink, type ArtistLinkReport } from "@/lib/link-check.functions";

export const Route = createFileRoute("/admin/links")({
  component: LinksAdminPage,
  head: () => ({ meta: [{ title: "Lenkesjekk — Admin" }, { name: "robots", content: "noindex" }] }),
});

function LinksAdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const runCheck = useServerFn(checkArtistLinks);
  const [report, setReport] = useState<ArtistLinkReport[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  const run = async () => {
    setBusy(true); setMsg(null);
    try {
      const r = await runCheck();
      setReport(r);
    } catch (e) {
      setMsg("Kjøring feilet: " + (e instanceof Error ? e.message : String(e)));
    }
    setBusy(false);
  };

  const clearLink = async (id: string, field: "website_url" | "facebook_url") => {
    if (!confirm("Fjern denne lenken fra artisten?")) return;
    try {
      await clearArtistLink({ data: { id, field } });
      setReport((prev) => prev?.map((r) => r.id === id ? { ...r, [field === "website_url" ? "website" : "facebook"]: null } : r) ?? null);
    } catch (e) {
      setMsg("Sletting feilet: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;

  const dead = (report ?? []).filter((r) => (r.website && !r.website.ok) || (r.facebook && !r.facebook.ok));
  const ok = (report ?? []).filter((r) => (r.website?.ok || r.facebook?.ok));

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Lenkesjekk" lead="Kontrollerer website- og Facebook-lenker for alle artister. Manuell fjerning per rad." img={IMG.pianoNight} />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <button onClick={run} disabled={busy} className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground text-sm flex items-center gap-2 disabled:opacity-60">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {busy ? "Sjekker alle lenker…" : "Kjør lenkesjekk"}
          </button>
          {report && (
            <div className="text-xs text-muted-foreground">
              {report.length} artister · <span className="text-red-400">{dead.length} med døde lenker</span> · <span className="text-emerald-400">{ok.length} OK</span>
            </div>
          )}
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-gold">← Tilbake til admin</Link>
        </div>

        {msg && <p className="text-sm text-red-400 mb-4">{msg}</p>}

        {!report && !busy && (
          <p className="text-sm text-muted-foreground italic">Trykk "Kjør lenkesjekk" for å starte. Tar 1–3 minutter.</p>
        )}

        {report && (
          <>
            <h3 className="text-sm uppercase tracking-[0.2em] text-red-400 mb-3 flex items-center gap-2">
              <Link2Off className="size-4" /> Døde lenker ({dead.length})
            </h3>
            <div className="space-y-2 mb-10">
              {dead.length === 0 && <p className="text-sm text-muted-foreground italic">Ingen døde lenker funnet.</p>}
              {dead.map((r) => (
                <article key={r.id} className="border border-red-500/30 rounded-lg p-4 bg-card/40">
                  <header className="flex items-center justify-between mb-2">
                    <Link to="/artists/$slug" params={{ slug: r.slug }} className="font-display text-lg text-gold hover:underline">{r.name}</Link>
                  </header>
                  {r.website && !r.website.ok && (
                    <LinkRow label="Website" result={r.website} onRemove={() => clearLink(r.id, "website_url")} />
                  )}
                  {r.facebook && !r.facebook.ok && (
                    <LinkRow label="Facebook" result={r.facebook} onRemove={() => clearLink(r.id, "facebook_url")} />
                  )}
                </article>
              ))}
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-gold">Vis OK-lenker ({ok.length})</summary>
              <div className="mt-3 space-y-1 text-xs">
                {ok.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-1">
                    <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    <Link to="/artists/$slug" params={{ slug: r.slug }} className="text-foreground/80 hover:text-gold">{r.name}</Link>
                    {r.website?.ok && <span className="text-muted-foreground truncate">· web {r.website.status}</span>}
                    {r.facebook?.ok && <span className="text-muted-foreground truncate">· fb {r.facebook.status}</span>}
                  </div>
                ))}
              </div>
            </details>
          </>
        )}
      </section>
    </PageShell>
  );
}

function LinkRow({ label, result, onRemove }: { label: string; result: { url: string; ok: boolean; status: number | null; error?: string }; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 py-2 border-t border-border/40 first:border-t-0">
      <XCircle className="size-4 text-red-400 shrink-0" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground w-20">{label}</span>
      <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/80 hover:text-gold truncate flex-1">{result.url}</a>
      <span className="text-xs text-red-400 shrink-0">{result.status ?? "ingen svar"}{result.error ? ` · ${result.error}` : ""}</span>
      <button onClick={onRemove} className="px-3 py-1 rounded border border-red-500/40 text-xs text-red-300 hover:bg-red-500/10">Fjern</button>
    </div>
  );
}
