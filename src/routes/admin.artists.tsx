import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchArtistsAudit } from "@/lib/adminArtists.functions";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { Search, Check, AlertTriangle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/artists")({
  component: AdminArtistsList,
  head: () => ({ meta: [{ title: "Admin · Artister — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

type Row = {
  slug: string;
  name: string;
  origin: string | null;
  died: string | null;
  biography_en: string | null;
  biography_no: string | null;
  instruments: any;
  instruments_simple: string[] | null;
  discography: any;
  family: any;
};

type FilterKey = "all" | "no-bio" | "no-instruments" | "no-producers" | "deceased";

function paraCount(s: string | null) {
  if (!s) return 0;
  return s.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).length;
}

function hasBio(r: Row) {
  return paraCount(r.biography_no) >= 3 || paraCount(r.biography_en) >= 3;
}
function hasInstruments(r: Row) {
  const json = Array.isArray(r.instruments) ? r.instruments.length : 0;
  const simple = Array.isArray(r.instruments_simple) ? r.instruments_simple.length : 0;
  return json + simple > 0;
}
function hasProducer(r: Row) {
  if (!Array.isArray(r.discography)) return false;
  return r.discography.some((d: any) => d && typeof d.producer === "string" && d.producer.trim().length > 0);
}
function deceasedNoDate(r: Row) {
  // Heuristic: explicitly flagged dead in bio but no died string
  if (r.died && r.died.trim()) return false;
  const hay = `${r.biography_no ?? ""} ${r.biography_en ?? ""}`.toLowerCase();
  return /\bdied\b|\bd\.\s?\d{4}|\bdøde\b|\bgestorben\b|\bavled\b/.test(hay);
}
function unverifiedFamily(r: Row) {
  if (!Array.isArray(r.family)) return false;
  return r.family.some((f: any) => f && f.verified === false);
}

function AdminArtistsList() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setBusy(true);
    fetchArtistsAudit().then((data) => {
      setRows(data as unknown as Row[]);
      setBusy(false);
    });
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (ql && !r.name.toLowerCase().includes(ql) && !r.slug.includes(ql)) return false;
      switch (filter) {
        case "no-bio": return !hasBio(r);
        case "no-instruments": return !hasInstruments(r);
        case "no-producers": return !hasProducer(r);
        case "deceased": return !!r.died;
        default: return true;
      }
    });
  }, [rows, q, filter]);

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;

  const counts = {
    all: rows.length,
    "no-bio": rows.filter((r) => !hasBio(r)).length,
    "no-instruments": rows.filter((r) => !hasInstruments(r)).length,
    "no-producers": rows.filter((r) => !hasProducer(r)).length,
    deceased: rows.filter((r) => !!r.died).length,
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "Alle" },
    { key: "no-bio", label: "Mangler bio" },
    { key: "no-instruments", label: "Mangler instrumenter" },
    { key: "no-producers", label: "Mangler produsenter" },
    { key: "deceased", label: "Avdøde" },
  ];

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Artister" lead={`${rows.length} artister`} img={IMG.pianoNight} />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Søk etter navn eller slug…"
              className="w-full pl-10 pr-3 py-3 bg-card border border-border rounded-md text-base"
            />
          </div>
          <Link to="/admin" className="px-4 py-3 rounded-md border border-border text-sm text-center hover:border-gold">← Admin</Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-md text-sm border transition ${filter === f.key ? "bg-gold text-primary-foreground border-gold" : "border-border hover:border-gold"}`}
            >
              {f.label} <span className="opacity-60">({counts[f.key]})</span>
            </button>
          ))}
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card/40">
          {busy && <p className="p-6 text-center text-sm text-muted-foreground">Laster…</p>}
          {!busy && filtered.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Ingen treff.</p>}
          <ul className="divide-y divide-border">
            {filtered.map((r) => {
              const bio = hasBio(r);
              const ins = hasInstruments(r);
              const prod = hasProducer(r);
              const warnDate = deceasedNoDate(r);
              const warnFam = unverifiedFamily(r);
              return (
                <li key={r.slug}>
                  <Link
                    to="/admin/artists/$slug"
                    params={{ slug: r.slug }}
                    className="flex items-center gap-3 p-3 sm:p-4 hover:bg-gold/5 active:bg-gold/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.origin || "—"} · {r.slug}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                      <Indicator ok={bio} label="bio" />
                      <Indicator ok={ins} label="instr" />
                      <Indicator ok={prod} label="prod" />
                      {warnDate && <Warn label="dødsdato" />}
                      {warnFam && <Warn label="familie" />}
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

function Indicator({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${ok ? "text-emerald-400 bg-emerald-500/10" : "text-muted-foreground bg-background/40"}`}>
      <Check className={`size-3 ${ok ? "" : "opacity-30"}`} /> {label}
    </span>
  );
}
function Warn({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-amber-400 bg-amber-500/10">
      <AlertTriangle className="size-3" /> {label}
    </span>
  );
}
