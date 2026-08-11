import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { useAuth } from "@/lib/useAuth";
import { getTranslationProgress } from "@/lib/translationProgress.functions";
import { ArrowLeft, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/translations")({
  component: TranslationsAdmin,
  head: () => ({ meta: [{ title: "Oversettelser — Admin | SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

const LANG_LABEL: Record<string, string> = { no: "Norsk", en: "English", sv: "Svenska", de: "Deutsch", pl: "Polski" };
const FIELDS_PER_LANG = 3; // biography, short, influence

type Progress = Awaited<ReturnType<typeof getTranslationProgress>>;
type Snap = { t: number; done: number };

function TranslationsAdmin() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const fetchProgress = useServerFn(getTranslationProgress);
  const [data, setData] = useState<Progress | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const history = useRef<Snap[]>([]);
  const [rate, setRate] = useState<number | null>(null); // fields/min

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  const load = async () => {
    setRefreshing(true);
    try {
      const d = await fetchProgress();
      setData(d);
      setErr(null);
      // Track total filled key-fields across all langs as the progress metric
      const done = Object.values(d.perLang).reduce(
        (acc, l) => acc + l.complete * FIELDS_PER_LANG + l.partial, // partial ~ at least one; underapprox
        0,
      );
      const snap = { t: d.timestamp, done };
      history.current = [...history.current, snap].slice(-30);
      if (history.current.length >= 2) {
        const first = history.current[0];
        const last = history.current[history.current.length - 1];
        const dtMin = (last.t - first.t) / 60000;
        if (dtMin > 0.1) setRate((last.done - first.done) / dtMin);
      }
    } catch (e: any) {
      setErr(e?.message ?? "Kunne ikke laste fremdrift.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || !autoRefresh) return;
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [isAdmin, autoRefresh]);

  if (loading) return <PageShell><div className="p-8 text-muted-foreground">Laster…</div></PageShell>;
  if (!isAdmin) return <PageShell><div className="p-8 text-muted-foreground">Krever admin-tilgang.</div></PageShell>;

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Oversettelser" lead="Bulk AI-oversettelse — fremdrift" />
      <div className="container max-w-5xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-gold inline-flex items-center gap-1">
            <ArrowLeft className="size-4" /> Tilbake til admin
          </Link>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground flex items-center gap-2">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              Auto-oppdater (15 s)
            </label>
            <button
              onClick={() => void load()}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-md bg-gold text-primary-foreground text-sm inline-flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} /> Oppdater
            </button>
          </div>
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}

        {data && (
          <>
            <section className="grid sm:grid-cols-3 gap-3">
              <Stat label="Totalt artister" value={data.total.toString()} />
              <Stat label="Helt ferdig (alle 5 språk)" value={`${data.fullyDone} / ${data.total}`} sub={`${pct(data.fullyDone, data.total)}%`} />
              <Stat
                label="Hastighet"
                value={rate != null ? `${Math.round(rate)} felt/min` : "—"}
                sub={rate != null && rate > 0 ? `ETA: ${etaText(remainingFields(data), rate)}` : "samler målinger…"}
              />
            </section>

            <section className="bg-card/40 border border-border rounded-xl p-5">
              <h2 className="font-display text-xl text-gold mb-4">Dekning per språk</h2>
              <div className="space-y-3">
                {Object.entries(data.perLang).map(([lang, s]) => {
                  const completePct = (s.complete / data.total) * 100;
                  const partialPct = (s.partial / data.total) * 100;
                  return (
                    <div key={lang}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{LANG_LABEL[lang] ?? lang}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {s.complete} ferdig · {s.partial} delvis · {s.missing} mangler
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-background overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${completePct}%` }} title={`${s.complete} ferdig`} />
                        <div className="bg-amber-500 h-full" style={{ width: `${partialPct}%` }} title={`${s.partial} delvis`} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Måler de tre kjernefeltene (biography, short, influence) per språk. «Ferdig» = alle tre er fylt.
              </p>
            </section>

            <p className="text-[11px] text-muted-foreground text-right">
              Sist oppdatert: {new Date(data.timestamp).toLocaleTimeString("no-NO")}
            </p>
          </>
        )}
      </div>
    </PageShell>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card/40 border border-border rounded-xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl text-gold mt-1 tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function pct(a: number, b: number) {
  if (!b) return 0;
  return Math.round((a / b) * 100);
}
function remainingFields(d: Progress) {
  return Object.values(d.perLang).reduce(
    (acc, l) => acc + l.missing * FIELDS_PER_LANG + (FIELDS_PER_LANG - 1) * l.partial,
    0,
  );
}
function etaText(remaining: number, ratePerMin: number) {
  const mins = remaining / ratePerMin;
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `~${Math.round(mins)} min`;
  return `~${(mins / 60).toFixed(1)} t`;
}
