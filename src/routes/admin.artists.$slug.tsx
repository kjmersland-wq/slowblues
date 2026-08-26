import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchArtistEditData, updateArtistBySlug } from "@/lib/adminArtists.functions";
import { fetchConcertReviewsByArtistSlug, type ConcertReview } from "@/lib/concertReviews.functions";
import { useAuth } from "@/lib/useAuth";
import { PageShell } from "@/components/PageShell";
import { useServerFn } from "@tanstack/react-start";
import { getYouTubeVideos } from "@/lib/youtube.functions";
import {
  ArrowLeft, ArrowRight, ExternalLink, Save, Plus, Trash2, Eye,
  AlertTriangle, GripVertical, Loader2, Youtube, Globe, Phone,
} from "lucide-react";

export const Route = createFileRoute("/admin/artists/$slug")({
  component: AdminArtistEdit,
  head: () => ({ meta: [{ title: "Admin · Rediger artist — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

type Tab = "bio" | "instruments" | "discography" | "family" | "youtube" | "links";

type BookingInfo = {
  booking_agency?: string | null;
  agent_name?: string | null;
  booking_email?: string | null;
  booking_phone?: string | null;
  booking_url?: string | null;
  source_url?: string;
  note?: string;
};

type Artist = {
  slug: string;
  name: string;
  origin: string | null;
  born: string | null;
  died: string | null;
  death_cause?: string | null;
  biography_en: string | null;
  biography_no: string | null;
  biography_sv: string | null;
  biography_de: string | null;
  biography_pl: string | null;
  biography_source?: string | null;
  instruments: any[];
  discography: any[];
  family: any[];
  youtube_video_ids: string[];
  website_url: string | null;
  sync_data?: { official_website?: string } | null;
  booking_info: BookingInfo;
  updated_at: string;
};

const inputCls = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";
const labelCls = "block text-xs uppercase tracking-wide text-muted-foreground mb-1";

function wordCount(s: string | null | undefined) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

const INSTRUMENT_TYPES = ["Guitar", "Harmonica", "Piano", "Bass", "Drums", "Amplifier", "Other"];
const RELATIONS = ["wife", "husband", "partner", "mother", "father", "son", "daughter", "brother", "sister", "cousin", "uncle", "aunt", "other"];

function extractYouTubeId(input: string): string | null {
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function AdminArtistEdit() {
  const { slug } = Route.useParams();
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [a, setA] = useState<Artist | null>(null);
  const [allSlugs, setAllSlugs] = useState<{ slug: string; name: string }[]>([]);
  const [tab, setTab] = useState<Tab>("bio");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [lastEdit, setLastEdit] = useState<{ at: string; fields: string[] } | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const { artist, allSlugs: list, lastEdit: log } = await fetchArtistEditData({ data: { slug } });
        if (!artist) {
          setMsg({ kind: "err", text: "Artist ikke funnet" });
          return;
        }
        setA({
          ...(artist as any),
          instruments: Array.isArray((artist as any).instruments) ? (artist as any).instruments : [],
          discography: Array.isArray((artist as any).discography) ? (artist as any).discography : [],
          family: Array.isArray((artist as any).family) ? (artist as any).family : [],
          youtube_video_ids: Array.isArray((artist as any).youtube_video_ids) ? (artist as any).youtube_video_ids : [],
          booking_info: (artist as any).booking_info ?? {},
        });
        setAllSlugs((list ?? []) as any);
        if (log) setLastEdit({ at: (log as any).edited_at, fields: (log as any).fields_changed || [] });
      } catch (e) {
        setMsg({ kind: "err", text: e instanceof Error ? e.message : "Kunne ikke laste artist" });
      }
    })();
  }, [slug, isAdmin]);

  const navIdx = useMemo(() => allSlugs.findIndex((s) => s.slug === slug), [allSlugs, slug]);
  const prev = navIdx > 0 ? allSlugs[navIdx - 1] : null;
  const next = navIdx >= 0 && navIdx < allSlugs.length - 1 ? allSlugs[navIdx + 1] : null;

  const saveFields = async (patch: Partial<Artist>, fieldNames: string[]) => {
    if (!a) return;
    setBusy(true);
    setMsg(null);
    try {
      await updateArtistBySlug({ data: { slug: a.slug, patch: patch as Record<string, unknown>, fieldsChanged: fieldNames } });
      setA({ ...a, ...patch });
      setMsg({ kind: "ok", text: "Lagret." });
      setLastEdit({ at: new Date().toISOString(), fields: fieldNames });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Lagring feilet" });
    }
    setBusy(false);
  };

  if (loading || !a) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;

  const tabs: { key: Tab; label: string }[] = [
    { key: "bio", label: "Biografi" },
    { key: "instruments", label: "Instrumenter" },
    { key: "discography", label: "Diskografi" },
    { key: "family", label: "Familie" },
    { key: "youtube", label: "YouTube" },
    { key: "links", label: "Lenker & booking" },
  ];

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
        {/* Top nav */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Link to="/admin" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
              <ArrowLeft className="size-4" /> Admin
            </Link>
            <Link to="/admin/artists" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
              <ArrowLeft className="size-4" /> Liste
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={`/artists/${a.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
              <Eye className="size-4" /> Vis live <ExternalLink className="size-3" />
            </a>
            {prev && (
              <Link to="/admin/artists/$slug" params={{ slug: prev.slug }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
                <ArrowLeft className="size-4" /> <span className="hidden sm:inline">{prev.name}</span>
              </Link>
            )}
            {next && (
              <Link to="/admin/artists/$slug" params={{ slug: next.slug }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
                <span className="hidden sm:inline">{next.name}</span> <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-gold mb-1">{a.name}</h1>
        <p className="text-sm text-muted-foreground mb-5">{a.origin || "—"} · {a.born || "?"}{a.died ? ` – ${a.died}` : ""}</p>

        {msg && (
          <div className={`mb-4 px-3 py-2 rounded-md text-sm ${msg.kind === "ok" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-border mb-5 -mx-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${tab === t.key ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "bio" && <BiographyTab a={a} busy={busy} onSave={saveFields} />}
        {tab === "instruments" && <InstrumentsTab a={a} busy={busy} onSave={saveFields} />}
        {tab === "discography" && <DiscographyTab a={a} busy={busy} onSave={saveFields} />}
        {tab === "family" && <FamilyTab a={a} allSlugs={allSlugs} busy={busy} onSave={saveFields} />}
        {tab === "youtube" && <YouTubeTab a={a} busy={busy} onSave={saveFields} />}
        {tab === "links" && <LinksBookingTab a={a} busy={busy} onSave={saveFields} />}

        {/* Audit log footer */}
        <div className="mt-10 pt-5 border-t border-border text-xs text-muted-foreground">
          {lastEdit ? (
            <>
              Sist endret: {new Date(lastEdit.at).toLocaleString("no-NO")}
              {lastEdit.fields.length > 0 && <> · Felt: {lastEdit.fields.join(", ")}</>}
            </>
          ) : (
            <>Oppdatert: {new Date(a.updated_at).toLocaleString("no-NO")}</>
          )}
        </div>
      </section>
    </PageShell>
  );
}

/* ----------------- Biography ----------------- */
function BiographyTab({ a, busy, onSave }: { a: Artist; busy: boolean; onSave: (p: Partial<Artist>, fields: string[]) => void }) {
  const [en, setEn] = useState(a.biography_en ?? "");
  const [no, setNo] = useState(a.biography_no ?? "");
  const [sv, setSv] = useState(a.biography_sv ?? "");
  const [de, setDe] = useState(a.biography_de ?? "");
  const [pl, setPl] = useState(a.biography_pl ?? "");
  const [source, setSource] = useState((a as any).biography_source ?? "");
  const [died, setDied] = useState(a.died ?? "");
  const [cause, setCause] = useState((a as any).death_cause ?? "");
  const [deceased, setDeceased] = useState(!!a.died);

  const save = () => {
    const patch: any = {
      biography_en: en || null,
      biography_no: no || null,
      biography_sv: sv || null,
      biography_de: de || null,
      biography_pl: pl || null,
      died: deceased ? (died || null) : null,
    };
    const fields = ["biography_en", "biography_no", "biography_sv", "biography_de", "biography_pl", "died"];
    if (!source.trim()) {
      // Warn but still save
    }
    onSave(patch, fields);
  };

  const bios = [
    { label: "EN", val: en, set: setEn },
    { label: "NO", val: no, set: setNo },
    { label: "DE", val: de, set: setDe },
    { label: "SV", val: sv, set: setSv },
    { label: "PL", val: pl, set: setPl },
  ];

  return (
    <div className="space-y-5">
      {bios.map((b) => {
        const w = wordCount(b.val);
        return (
          <div key={b.label}>
            <div className="flex items-baseline justify-between mb-1">
              <label className={labelCls}>Biografi ({b.label})</label>
              <span className={`text-xs ${w >= 150 ? "text-emerald-400" : w >= 80 ? "text-amber-400" : "text-red-400"}`}>
                {w} ord {w < 80 && "· for kort"} {w >= 80 && w < 150 && "· kan utvides"} {w >= 150 && "✓"}
              </span>
            </div>
            <textarea value={b.val} onChange={(e) => b.set(e.target.value)} className={`${inputCls} min-h-[180px] font-serif`} />
          </div>
        );
      })}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Kilde (URL eller bok)</label>
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="https:// … eller 'Palmer, R. — Deep Blues, s. 84'" className={inputCls} />
          {!source.trim() && <p className="text-xs text-amber-400 mt-1">⚠ Lagring uten kilde — legg gjerne til en referanse</p>}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={deceased} onChange={(e) => setDeceased(e.target.checked)} />
            Avdød
          </label>
          {deceased && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input type="text" value={died} onChange={(e) => setDied(e.target.value)} placeholder="Dødsdato (f.eks. 1969-09-18)" className={inputCls} />
              <input type="text" value={cause} onChange={(e) => setCause(e.target.value)} placeholder="Dødsårsak (valgfritt)" className={inputCls} />
            </div>
          )}
        </div>
      </div>

      <SaveBar busy={busy} onClick={save} />
    </div>
  );
}

/* ----------------- Instruments ----------------- */
function InstrumentsTab({ a, busy, onSave }: { a: Artist; busy: boolean; onSave: (p: Partial<Artist>, fields: string[]) => void }) {
  const [items, setItems] = useState<any[]>(a.instruments.map((i) => ({ name: "", type: "Other", note: "", source: "", ...i })));

  const update = (i: number, patch: any) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const add = () => setItems([...items, { name: "", type: "Guitar", note: "", source: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setItems(copy);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Ingen instrumenter ennå.</p>}
      {items.map((it, i) => (
        <div key={i} className="border border-border rounded-lg p-3 bg-card/40 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => move(i, -1)} className="p-1.5 rounded hover:bg-background touch-manipulation" aria-label="opp"><GripVertical className="size-4" /></button>
            <input value={it.name ?? ""} onChange={(e) => update(i, { name: e.target.value })} placeholder="Instrument" className={`${inputCls} flex-1`} />
            <select value={it.type ?? "Other"} onChange={(e) => update(i, { type: e.target.value })} className={`${inputCls} w-36`}>
              {INSTRUMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button onClick={() => remove(i)} className="p-2 rounded-md border border-border hover:border-red-500 hover:text-red-400"><Trash2 className="size-4" /></button>
          </div>
          <input value={it.note ?? ""} onChange={(e) => update(i, { note: e.target.value })} placeholder="Notat (f.eks. 'Open FM tuning', 'Capo 7th fret')" className={inputCls} />
          <input value={it.source ?? ""} onChange={(e) => update(i, { source: e.target.value })} placeholder="Kilde URL" className={inputCls} />
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
        <Plus className="size-4" /> Legg til instrument
      </button>
      <SaveBar busy={busy} onClick={() => onSave({ instruments: items }, ["instruments"])} />
    </div>
  );
}

/* ----------------- Discography ----------------- */
function DiscographyTab({ a, busy, onSave }: { a: Artist; busy: boolean; onSave: (p: Partial<Artist>, fields: string[]) => void }) {
  const [items, setItems] = useState<any[]>(a.discography);

  const update = (i: number, patch: any) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const saveOne = (i: number) => onSave({ discography: items }, [`discography[${i}]`]);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Ingen innspillinger i diskografien. Legg til via JSON-editoren under Admin → Artister (gammel).</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((d, i) => {
        const vid = d.youtube_id || "";
        const validVid = /^[a-zA-Z0-9_-]{11}$/.test(vid);
        return (
          <div key={i} className="border border-border rounded-lg p-3 bg-card/40">
            <div className="flex items-baseline justify-between mb-2">
              <h4 className="font-medium">{d.year || "?"} — {d.title || "(uten tittel)"}</h4>
              <button onClick={() => saveOne(i)} disabled={busy} className="text-xs px-2 py-1 rounded border border-border hover:border-gold disabled:opacity-50">Lagre rad</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <label className="block">
                <span className={labelCls}>Produsent</span>
                <input value={d.producer ?? ""} onChange={(e) => update(i, { producer: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>Kilde URL</span>
                <input value={d.source ?? ""} onChange={(e) => update(i, { source: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>YouTube video-ID (11 tegn)</span>
                <input value={vid} onChange={(e) => update(i, { youtube_id: e.target.value })} className={inputCls} placeholder="dQw4w9WgXcQ" />
                {vid && !validVid && <p className="text-xs text-red-400 mt-1">⚠ Ugyldig ID-format</p>}
              </label>
              {validVid && (
                <img src={`https://i.ytimg.com/vi/${vid}/mqdefault.jpg`} alt="" className="w-32 h-20 object-cover rounded" />
              )}
            </div>
            <details className="mt-3">
              <summary className="text-xs text-muted-foreground cursor-pointer">Musikere ({d.musicians?.length ?? 0})</summary>
              <MusiciansEditor value={d.musicians ?? []} onChange={(m) => update(i, { musicians: m })} />
            </details>
          </div>
        );
      })}
    </div>
  );
}

function MusiciansEditor({ value, onChange }: { value: any[]; onChange: (m: any[]) => void }) {
  return (
    <div className="space-y-2 mt-2">
      {value.map((m, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input value={m.name ?? ""} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Navn" className={`${inputCls} flex-1`} />
          <input value={m.instrument ?? ""} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, instrument: e.target.value } : x))} placeholder="Instrument" className={`${inputCls} flex-1`} />
          <input value={m.slug ?? ""} onChange={(e) => onChange(value.map((x, idx) => idx === i ? { ...x, slug: e.target.value } : x))} placeholder="Slug" className={`${inputCls} w-32`} />
          <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="p-2 rounded border border-border hover:text-red-400"><Trash2 className="size-3.5" /></button>
        </div>
      ))}
      <button onClick={() => onChange([...value, { name: "", instrument: "" }])} className="text-xs px-2 py-1 rounded border border-border hover:border-gold inline-flex items-center gap-1"><Plus className="size-3" />Musiker</button>
    </div>
  );
}

/* ----------------- Family ----------------- */
function FamilyTab({ a, allSlugs, busy, onSave }: { a: Artist; allSlugs: { slug: string; name: string }[]; busy: boolean; onSave: (p: Partial<Artist>, fields: string[]) => void }) {
  const [items, setItems] = useState<any[]>(a.family.map((f) => {
    const merged = { name: "", relation: "other", note: "", slug: "", source: "", verified: false, ...f };
    merged.relation = normalizeRelation(merged.relation);
    return merged;
  }));


  function normalizeRelation(r: string | undefined) {
    if (!r) return "other";
    const low = r.toLowerCase();
    const map: Record<string, string> = {
      kone: "wife", fru: "wife", ehefrau: "wife",
      ektemann: "husband", make: "husband", ehemann: "husband",
      mor: "mother", mutter: "mother", mamma: "mother",
      far: "father", vater: "father", pappa: "father",
      sønn: "son", sohn: "son", søn: "son",
      datter: "daughter", tochter: "daughter",
      bror: "brother", bruder: "brother",
      søster: "sister", schwester: "sister",
      fetter: "cousin", kusine: "cousin", cousine: "cousin",
      onkel: "uncle", tante: "aunt",
      partner: "partner",
    };
    return map[low] ?? (RELATIONS.includes(low) ? low : "other");
  }

  const update = (i: number, patch: any) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Ingen familieoppføringer.</p>}
      {items.map((f, i) => (
        <div key={i} className={`border rounded-lg p-3 bg-card/40 space-y-2 ${f.verified ? "border-border" : "border-amber-500/40"}`}>
          {!f.verified && (
            <div className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="size-3" /> Ikke verifisert — legg til kilde før publisering
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-2">
            <input value={f.name ?? ""} onChange={(e) => update(i, { name: e.target.value })} placeholder="Navn" className={inputCls} />
            <select value={f.relation} onChange={(e) => update(i, { relation: e.target.value })} className={inputCls}>
              {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input list={`slugs-${i}`} value={f.slug ?? ""} onChange={(e) => update(i, { slug: e.target.value })} placeholder="Artist-slug på siden (valgfritt)" className={inputCls} />
            <datalist id={`slugs-${i}`}>
              {allSlugs.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </datalist>
            <input value={f.source ?? ""} onChange={(e) => update(i, { source: e.target.value })} placeholder="Kilde URL" className={inputCls} />
          </div>
          <input value={f.note ?? ""} onChange={(e) => update(i, { note: e.target.value })} placeholder="Notater" className={inputCls} />
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!f.verified} onChange={(e) => update(i, { verified: e.target.checked })} />
              Verifisert
            </label>
            <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="p-2 rounded border border-border hover:text-red-400"><Trash2 className="size-4" /></button>
          </div>
        </div>
      ))}
      <button onClick={() => setItems([...items, { name: "", relation: "other", verified: false }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
        <Plus className="size-4" /> Ny familieoppføring
      </button>
      <SaveBar busy={busy} onClick={() => onSave({ family: items }, ["family"])} />
    </div>
  );
}

/* ----------------- YouTube ----------------- */
function YouTubeTab({ a, busy, onSave }: { a: Artist; busy: boolean; onSave: (p: Partial<Artist>, fields: string[]) => void }) {
  const [ids, setIds] = useState<string[]>(a.youtube_video_ids);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const fetchVideos = useServerFn(getYouTubeVideos);
  const fetched = useRef<Set<string>>(new Set());

  useEffect(() => {
    const need = ids.filter((id) => !fetched.current.has(id));
    if (need.length === 0) return;
    setFetching(true);
    need.forEach((id) => fetched.current.add(id));
    fetchVideos({ data: { ids: need } })
      .then((r) => {
        const map: Record<string, string> = {};
        for (const v of r.videos as any[]) map[v.id ?? v.videoId] = v.title ?? "";
        setTitles((t) => ({ ...t, ...map }));
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [ids, fetchVideos]);

  const add = () => {
    const id = extractYouTubeId(input);
    if (!id) return;
    if (ids.includes(id)) return;
    setIds([...ids, id]);
    setInput("");
  };
  const remove = (id: string) => setIds(ids.filter((x) => x !== id));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const copy = [...ids];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setIds(copy);
  };

  const preview = extractYouTubeId(input);

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg p-3 bg-card/40">
        <label className={labelCls}>Legg til video (URL eller 11-tegns ID)</label>
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://youtube.com/watch?v=… eller dQw4w9WgXcQ" className={`${inputCls} flex-1`} />
          <button onClick={add} disabled={!preview} className="px-4 py-2 rounded-md bg-gold text-primary-foreground text-sm disabled:opacity-40 inline-flex items-center gap-1">
            <Plus className="size-4" /> Legg til
          </button>
        </div>
        {preview && (
          <div className="mt-2 flex items-center gap-3">
            <img src={`https://i.ytimg.com/vi/${preview}/mqdefault.jpg`} alt="" className="w-32 h-20 object-cover rounded" />
            <span className="text-xs text-muted-foreground">ID: {preview}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {ids.length === 0 && <p className="text-sm text-muted-foreground">Ingen videoer.</p>}
        {ids.map((id, i) => (
          <div key={id} className="flex items-center gap-3 border border-border rounded-lg p-2 bg-card/40">
            <button onClick={() => move(i, -1)} className="p-1.5 rounded hover:bg-background"><GripVertical className="size-4" /></button>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="w-28 h-16 object-cover rounded shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate inline-flex items-center gap-1">
                <Youtube className="size-3.5 text-red-500 shrink-0" />
                {titles[id] || (fetching ? <Loader2 className="size-3 animate-spin" /> : id)}
              </div>
              <div className="text-xs text-muted-foreground">{id}</div>
            </div>
            <button onClick={() => remove(id)} className="p-2 rounded border border-border hover:text-red-400"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>

      <SaveBar busy={busy} onClick={() => onSave({ youtube_video_ids: ids }, ["youtube_video_ids"])} />
    </div>
  );
}

/* ----------------- Links & Booking ----------------- */
const BOOKING_FIELDS: { key: keyof BookingInfo; label: string; placeholder: string }[] = [
  { key: "booking_agency", label: "Bookingbyrå", placeholder: "Navn på bookingbyrå" },
  { key: "agent_name", label: "Agent/management", placeholder: "Navn på agent/management" },
  { key: "booking_email", label: "Booking-e-post", placeholder: "booking@..." },
  { key: "booking_phone", label: "Bookingtelefon", placeholder: "+49 ..." },
  { key: "booking_url", label: "Booking-URL", placeholder: "https://..." },
];

function LinksBookingTab({ a, busy, onSave }: { a: Artist; busy: boolean; onSave: (p: Partial<Artist>, fields: string[]) => void }) {
  const [website, setWebsite] = useState(a.website_url ?? "");
  const [booking, setBooking] = useState<BookingInfo>(a.booking_info ?? {});
  const [notAvailable, setNotAvailable] = useState<Record<string, boolean>>(
    Object.fromEntries(BOOKING_FIELDS.map((f) => [f.key, a.booking_info?.[f.key] === null]))
  );
  const [reviews, setReviews] = useState<ConcertReview[] | null>(null);

  useEffect(() => {
    fetchConcertReviewsByArtistSlug({ data: { slug: a.slug } }).then(setReviews).catch(() => setReviews([]));
  }, [a.slug]);

  const wikidataSuggestion = a.website_url ? null : (a.sync_data?.official_website ?? null);

  const updateBookingField = (key: keyof BookingInfo, value: string) => setBooking((b) => ({ ...b, [key]: value }));
  const toggleNotAvailable = (key: keyof BookingInfo, checked: boolean) => {
    setNotAvailable((n) => ({ ...n, [key]: checked }));
    setBooking((b) => ({ ...b, [key]: checked ? null : "" }));
  };

  const save = () => {
    onSave(
      { website_url: website || null, booking_info: booking },
      ["website_url", "booking_info"]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={labelCls}>Offisiell hjemmeside</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className={inputCls} />
        {wikidataSuggestion && (
          <button
            type="button"
            onClick={() => setWebsite(wikidataSuggestion)}
            className="mt-1 text-xs text-gold hover:underline inline-flex items-center gap-1"
          >
            <Globe className="size-3" /> Wikidata foreslår: {wikidataSuggestion} — bruk denne
          </button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2"><Phone className="size-4" /> Booking / kontakt</h3>
        <p className="text-xs text-muted-foreground mb-3">Bruk kun offentlig publisert informasjon. Kryss av "ikke offentlig tilgjengelig" fremfor å la feltet stå tomt uten sjekk — det markerer eksplisitt at det er undersøkt.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {BOOKING_FIELDS.map((f) => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input
                value={booking[f.key] ?? ""}
                onChange={(e) => updateBookingField(f.key, e.target.value)}
                placeholder={f.placeholder}
                disabled={!!notAvailable[f.key]}
                className={`${inputCls} disabled:opacity-40`}
              />
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <input type="checkbox" checked={!!notAvailable[f.key]} onChange={(e) => toggleNotAvailable(f.key, e.target.checked)} />
                Bekreftet ikke offentlig tilgjengelig
              </label>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelCls}>Kilde-URL (for booking-info)</label>
            <input value={booking.source_url ?? ""} onChange={(e) => setBooking((b) => ({ ...b, source_url: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Notat</label>
            <input value={booking.note ?? ""} onChange={(e) => setBooking((b) => ({ ...b, note: e.target.value }))} className={inputCls} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Konsert-/festivalanmeldelser</h3>
        <p className="text-xs text-muted-foreground mb-2">Redigeres via SQL (samme som diskografi/familie). Viser hva som er publisert.</p>
        {reviews === null && <p className="text-sm text-muted-foreground">Laster…</p>}
        {reviews?.length === 0 && <p className="text-sm text-muted-foreground">Ingen anmeldelser registrert.</p>}
        {reviews && reviews.length > 0 && (
          <div className="space-y-2">
            {reviews.map((r) => (
              <div key={r.id} className="border border-border rounded-lg p-3 bg-card/40 text-sm">
                <div className="font-medium">{r.event_name} {(r.venue || r.city) && `— ${[r.venue, r.city].filter(Boolean).join(", ")}`}</div>
                <div className="text-muted-foreground italic">"{r.quote_text}"</div>
                <div className="text-xs text-muted-foreground mt-1">{r.review_author} · {r.publication_name} · {r.event_date ?? r.event_year}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SaveBar busy={busy} onClick={save} />
    </div>
  );
}

/* ----------------- Shared ----------------- */
function SaveBar({ busy, onClick }: { busy: boolean; onClick: () => void }) {
  return (
    <div className="sticky bottom-0 -mx-3 sm:-mx-6 px-3 sm:px-6 py-3 bg-background/95 backdrop-blur border-t border-border">
      <button onClick={onClick} disabled={busy} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-gold text-primary-foreground font-medium disabled:opacity-50">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Lagre
      </button>
    </div>
  );
}
