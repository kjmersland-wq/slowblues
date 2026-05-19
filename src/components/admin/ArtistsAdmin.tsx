import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ArtistRecord } from "@/lib/artists";
import { Trash2, Plus, Save, X, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

const EMPTY: Partial<ArtistRecord> = {
  slug: "",
  name: "",
  tag: "Modern",
  era: "",
  img: "",
  short: "",
  born: "",
  died: "",
  origin: "",
  active_years: "",
  alt_name: "",
  legacy: "",
  bio: [],
  signature_songs: [],
  influences: [],
  labels: [],
  instruments_simple: [],
  family: [],
  formative: [],
  instruments: [],
  anecdotes: [],
  collaborators: [],
  videos: [],
  discography: [],
  awards: [],
  related_slugs: [],
  sort_order: 100,
};

export function ArtistsAdmin() {
  const [list, setList] = useState<ArtistRecord[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<ArtistRecord> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const refresh = async () => {
    setBusy(true);
    const { data, error } = await supabase.from("artists").select("*").order("name");
    if (error) setErr(error.message);
    else setList((data ?? []) as unknown as ArtistRecord[]);
    setBusy(false);
  };
  useEffect(() => { void refresh(); }, []);

  const filtered = list.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()) || a.slug.includes(q.toLowerCase()));

  const save = async () => {
    if (!editing?.slug || !editing.name) { setErr("Slug og navn er påkrevd."); return; }
    setBusy(true); setErr(null); setOk(null);
    const payload = { ...editing };
    delete (payload as any).id;
    delete (payload as any).created_at;
    delete (payload as any).updated_at;
    const { error } = await supabase.from("artists").upsert(payload as any, { onConflict: "slug" });
    if (error) setErr(error.message);
    else { setOk("Lagret."); await refresh(); }
    setBusy(false);
  };

  const del = async (slug: string) => {
    if (!confirm(`Slette artisten "${slug}"?`)) return;
    const { error } = await supabase.from("artists").delete().eq("slug", slug);
    if (error) setErr(error.message);
    else { setList((l) => l.filter((x) => x.slug !== slug)); if (editing?.slug === slug) setEditing(null); }
  };

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
      {/* List */}
      <aside className="space-y-3">
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Søk artist…" className="flex-1 bg-card border border-border rounded-md px-3 py-2 text-sm" />
          <button onClick={() => setEditing({ ...EMPTY })} className="px-3 py-2 rounded-md bg-gold text-primary-foreground text-sm flex items-center gap-1"><Plus className="size-4" />Ny</button>
        </div>
        <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
          {filtered.map((a) => (
            <div key={a.slug} className={`flex items-center gap-2 p-2 rounded-md border ${editing?.slug === a.slug ? "border-gold bg-gold/5" : "border-border bg-card/40"}`}>
              <button onClick={() => setEditing(a)} className="flex-1 text-left text-sm">
                <div className="font-medium">{a.name}</div>
                <div className="text-[11px] text-muted-foreground">{a.tag} · {a.slug}</div>
              </button>
              <Link to="/artists/$slug" params={{ slug: a.slug }} className="p-1.5 rounded hover:bg-background"><ExternalLink className="size-3.5 text-muted-foreground" /></Link>
              <button onClick={() => del(a.slug)} className="p-1.5 rounded hover:bg-background hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          ))}
          {!busy && filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Ingen treff.</p>}
        </div>
      </aside>

      {/* Editor */}
      <div className="bg-card/40 border border-border rounded-xl p-5">
        {!editing ? (
          <p className="text-muted-foreground text-center py-16">Velg en artist å redigere, eller opprett en ny.</p>
        ) : (
          <ArtistForm value={editing} onChange={setEditing} onSave={save} onCancel={() => setEditing(null)} busy={busy} err={err} ok={ok} />
        )}
      </div>
    </div>
  );
}

function ArtistForm({ value: v, onChange, onSave, onCancel, busy, err, ok }: {
  value: Partial<ArtistRecord>;
  onChange: (v: Partial<ArtistRecord>) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
  err: string | null;
  ok: string | null;
}) {
  const set = (k: keyof ArtistRecord, val: any) => onChange({ ...v, [k]: val });
  const setJson = (k: keyof ArtistRecord, raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      onChange({ ...v, [k]: parsed });
    } catch {
      // ignore — let user finish typing
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-gold">{v.slug ? `Rediger: ${v.name || v.slug}` : "Ny artist"}</h3>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded-md border border-border text-sm flex items-center gap-1"><X className="size-4" />Avbryt</button>
          <button onClick={onSave} disabled={busy} className="px-4 py-2 rounded-md bg-gold text-primary-foreground text-sm flex items-center gap-1 disabled:opacity-50"><Save className="size-4" />Lagre</button>
        </div>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}
      {ok && <p className="text-sm text-emerald-400">{ok}</p>}

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Slug *"><input value={v.slug ?? ""} onChange={(e) => set("slug", e.target.value)} className={inputCls} /></Field>
        <Field label="Navn *"><input value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
        <Field label="Tag"><input value={v.tag ?? ""} onChange={(e) => set("tag", e.target.value)} className={inputCls} placeholder="Delta / Chicago / Texas / British / Classic / Modern / Nordic" /></Field>
        <Field label="Epoke"><input value={v.era ?? ""} onChange={(e) => set("era", e.target.value)} className={inputCls} /></Field>
        <Field label="Bilde-URL"><input value={v.img ?? ""} onChange={(e) => set("img", e.target.value)} className={inputCls} /></Field>
        <Field label="Født"><input value={v.born ?? ""} onChange={(e) => set("born", e.target.value)} className={inputCls} /></Field>
        <Field label="Død"><input value={v.died ?? ""} onChange={(e) => set("died", e.target.value)} className={inputCls} /></Field>
        <Field label="Opprinnelse"><input value={v.origin ?? ""} onChange={(e) => set("origin", e.target.value)} className={inputCls} /></Field>
        <Field label="Aktive år"><input value={v.active_years ?? ""} onChange={(e) => set("active_years", e.target.value)} className={inputCls} /></Field>
        <Field label="Sorteringsrekkefølge"><input type="number" value={v.sort_order ?? 100} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} /></Field>
      </div>

      <Field label="Kort beskrivelse">
        <textarea value={v.short ?? ""} onChange={(e) => set("short", e.target.value)} className={`${inputCls} min-h-[60px]`} />
      </Field>

      <Field label="Biografi (ett avsnitt per linje, separer med tom linje)">
        <textarea
          value={(v.bio ?? []).join("\n\n")}
          onChange={(e) => set("bio", e.target.value.split(/\n\n+/).map((s) => s.trim()).filter(Boolean))}
          className={`${inputCls} min-h-[160px]`}
        />
      </Field>

      <Field label="Musikalsk innflytelse / Legacy">
        <textarea value={v.legacy ?? ""} onChange={(e) => set("legacy", e.target.value)} className={`${inputCls} min-h-[80px]`} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <CsvField label="Signaturlåter (komma-separert)" value={v.signature_songs ?? []} onChange={(arr) => set("signature_songs", arr)} />
        <CsvField label="Påvirkninger" value={v.influences ?? []} onChange={(arr) => set("influences", arr)} />
        <CsvField label="Plateselskap" value={v.labels ?? []} onChange={(arr) => set("labels", arr)} />
        <CsvField label="Instrumenter (kort)" value={v.instruments_simple ?? []} onChange={(arr) => set("instruments_simple", arr)} />
        <CsvField label="Relaterte artister (slugs)" value={v.related_slugs ?? []} onChange={(arr) => set("related_slugs", arr)} />
      </div>

      <details className="border border-border rounded-lg p-4 bg-background/40" open>
        <summary className="cursor-pointer font-display text-lg text-gold mb-2">Rike seksjoner (JSON)</summary>
        <p className="text-xs text-muted-foreground mb-3">
          Hver seksjon er en JSON-liste. Se Lonnie Johnson som mal. Endringer lagres når JSON er gyldig.
        </p>
        <div className="space-y-3">
          <JsonField label="Familie" hint='[{"relation":"Far","name":"James","note":"..."}]' value={v.family ?? []} onChange={(s) => setJson("family", s)} />
          <JsonField label="Formende opplevelser" hint='["Tekst 1","Tekst 2"]' value={v.formative ?? []} onChange={(s) => setJson("formative", s)} />
          <JsonField label="Instrumenter og utstyr" hint='[{"category":"Gitar","name":"...","years":"...","note":"..."}]' value={v.instruments ?? []} onChange={(s) => setJson("instruments", s)} />
          <JsonField label="Anekdoter" hint='["Sitat 1","Sitat 2"]' value={v.anecdotes ?? []} onChange={(s) => setJson("anecdotes", s)} />
          <JsonField label="Samarbeidspartnere" hint='[{"name":"...","years":"...","note":"..."}]' value={v.collaborators ?? []} onChange={(s) => setJson("collaborators", s)} />
          <JsonField label="Videoer" hint='[{"kind":"featured","title":"...","youtube_id":"...","channel":"..."}]' value={v.videos ?? []} onChange={(s) => setJson("videos", s)} />
          <JsonField label="Diskografi" hint='[{"year":1925,"title":"...","label":"...","producer":"...","chart":"#1 R&B","sales":"3M+","notes":"..."}]' value={v.discography ?? []} onChange={(s) => setJson("discography", s)} />
          <JsonField label="Priser" hint='[{"year":1970,"title":"Blues Hall of Fame","category":"..."}]' value={v.awards ?? []} onChange={(s) => setJson("awards", s)} />
        </div>
      </details>
    </div>
  );
}

const inputCls = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

function CsvField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field label={label}>
      <input
        value={value.join(", ")}
        onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        className={inputCls}
      />
    </Field>
  );
}

function JsonField({ label, hint, value, onChange }: { label: string; hint: string; value: any; onChange: (raw: string) => void }) {
  const [raw, setRaw] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [valid, setValid] = useState(true);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-[10px] ${valid ? "text-emerald-500" : "text-red-400"}`}>{valid ? "OK" : "ugyldig JSON"}</span>
      </div>
      <textarea
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          try { JSON.parse(e.target.value); setValid(true); onChange(e.target.value); }
          catch { setValid(false); }
        }}
        className={`${inputCls} font-mono text-xs min-h-[110px]`}
        placeholder={hint}
      />
      <p className="text-[10px] text-muted-foreground mt-1 font-mono">Format: {hint}</p>
    </div>
  );
}
