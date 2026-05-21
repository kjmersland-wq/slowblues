import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { CoverFallback } from "@/components/reviews/CoverFallback";
import { Trash2, Upload, Save, Plus } from "lucide-react";

type Review = {
  id: string;
  slug: string;
  artist_slug: string | null;
  artist_name: string;
  album_title: string;
  release_year: number | null;
  label: string | null;
  blues_style: string | null;
  cover_image: string | null;
  verdict_en: string | null;
  body_en: string | null;
  total_score: number | null;
  youtube_playlist_id: string | null;
  status: string;
  published_at: string | null;
};

const empty: Partial<Review> = {
  slug: "",
  artist_name: "",
  album_title: "",
  status: "draft",
};

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviewsPage,
  head: () => ({ meta: [{ title: "Reviews Admin — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

function AdminReviewsPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("blues_reviews")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) setErr(error.message);
    setItems((data ?? []) as Review[]);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const save = async () => {
    if (!editing?.slug || !editing.artist_name || !editing.album_title) {
      setErr("Slug, artist and album are required.");
      return;
    }
    setBusy(true);
    setErr(null);
    const payload = {
      ...editing,
      published_at:
        editing.status === "published" && !editing.published_at
          ? new Date().toISOString()
          : editing.published_at,
    };
    const { error } = editing.id
      ? await supabase.from("blues_reviews").update(payload).eq("id", editing.id)
      : await supabase.from("blues_reviews").insert(payload);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("blues_reviews").delete().eq("id", id);
    if (error) setErr(error.message);
    refresh();
  };

  const uploadCover = async (file: File) => {
    if (!editing?.slug) {
      setErr("Set a slug before uploading a cover.");
      return;
    }
    setBusy(true);
    setErr(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${editing.slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("review-covers").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("review-covers").getPublicUrl(path);
    setEditing({ ...editing, cover_image: data.publicUrl });
    setBusy(false);
  };

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Loading…</div></PageShell>;
  if (user && !isAdmin) {
    return (
      <PageShell>
        <PageHero eyebrow="Admin" title="No access" lead="Your account is not an admin." img={IMG.pianoNight} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero eyebrow="Admin" title="Reviews" lead="Create, edit, and publish album reviews." img={IMG.pianoNight} />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-gold">← Admin home</Link>
          <button
            onClick={() => setEditing({ ...empty })}
            className="px-4 py-2 rounded-md bg-gold text-primary-foreground text-sm flex items-center gap-2"
          >
            <Plus className="size-4" /> New review
          </button>
        </div>

        {err && <p className="text-sm text-red-400 mb-4">{err}</p>}

        <div className="grid gap-3">
          {items.map((r) => (
            <article key={r.id} className="grid grid-cols-[64px_1fr_auto] gap-4 items-center bg-card/60 border border-border rounded-lg p-4">
              {r.cover_image ? (
                <img src={r.cover_image} alt="" className="size-16 rounded object-cover border border-border" />
              ) : (
                <CoverFallback artist={r.artist_name} title={r.album_title} className="size-16 rounded" />
              )}
              <div className="min-w-0">
                <div className="text-xs text-gold uppercase tracking-wider">{r.status} {r.total_score ? `· ${r.total_score}/10` : ""}</div>
                <div className="font-display text-lg truncate">{r.album_title}</div>
                <div className="text-xs text-muted-foreground truncate">{r.artist_name} · {r.slug}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(r)} className="text-xs px-3 py-1.5 rounded border border-border hover:border-gold">Edit</button>
                <button onClick={() => remove(r.id)} className="p-2 rounded border border-border hover:border-red-500 hover:text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </article>
          ))}
          {!items.length && <p className="text-sm text-muted-foreground text-center py-8">No reviews yet.</p>}
        </div>

        {editing && (
          <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4 md:p-10" onClick={() => setEditing(null)}>
            <div onClick={(e) => e.stopPropagation()} className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-display text-2xl">{editing.id ? "Edit review" : "New review"}</h2>

              <div className="grid md:grid-cols-[180px_1fr] gap-4">
                <div className="space-y-2">
                  {editing.cover_image ? (
                    <img src={editing.cover_image} alt="" className="w-full aspect-square rounded object-cover border border-border" />
                  ) : (
                    <CoverFallback artist={editing.artist_name || "Artist"} title={editing.album_title || "Album"} className="w-full aspect-square rounded" />
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={busy}
                    className="w-full px-3 py-2 rounded border border-border hover:border-gold text-xs flex items-center justify-center gap-2"
                  >
                    <Upload className="size-3" /> Upload cover
                  </button>
                  <input
                    value={editing.cover_image ?? ""}
                    onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                    placeholder="…or paste image URL"
                    className="w-full px-2 py-1.5 rounded bg-background border border-border text-xs"
                  />
                </div>

                <div className="space-y-3">
                  <Field label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
                  <Field label="Artist name" value={editing.artist_name} onChange={(v) => setEditing({ ...editing, artist_name: v })} />
                  <Field label="Artist slug" value={editing.artist_slug ?? ""} onChange={(v) => setEditing({ ...editing, artist_slug: v || null })} />
                  <Field label="Album title" value={editing.album_title} onChange={(v) => setEditing({ ...editing, album_title: v })} />
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Year" value={String(editing.release_year ?? "")} onChange={(v) => setEditing({ ...editing, release_year: v ? Number(v) : null })} />
                    <Field label="Label" value={editing.label ?? ""} onChange={(v) => setEditing({ ...editing, label: v || null })} />
                    <Field label="Style" value={editing.blues_style ?? ""} onChange={(v) => setEditing({ ...editing, blues_style: v || null })} />
                  </div>
                  <Field label="Total score (0-10)" value={String(editing.total_score ?? "")} onChange={(v) => setEditing({ ...editing, total_score: v ? Number(v) : null })} />
                  <Field label="YouTube playlist or video ID" value={editing.youtube_playlist_id ?? ""} onChange={(v) => setEditing({ ...editing, youtube_playlist_id: v || null })} />
                  <Textarea label="Verdict (1 line)" value={editing.verdict_en ?? ""} onChange={(v) => setEditing({ ...editing, verdict_en: v })} rows={2} />
                  <Textarea label="Body" value={editing.body_en ?? ""} onChange={(v) => setEditing({ ...editing, body_en: v })} rows={8} />
                  <label className="block text-xs">
                    <span className="block mb-1 text-muted-foreground uppercase tracking-wider">Status</span>
                    <select
                      value={editing.status ?? "draft"}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                      className="w-full px-2 py-1.5 rounded bg-background border border-border text-sm"
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded border border-border text-sm">Cancel</button>
                <button onClick={save} disabled={busy} className="px-4 py-2 rounded bg-gold text-primary-foreground text-sm flex items-center gap-2">
                  <Save className="size-4" /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs">
      <span className="block mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-2 py-1.5 rounded bg-background border border-border text-sm" />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block text-xs">
      <span className="block mb-1 text-muted-foreground uppercase tracking-wider">{label}</span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-2 py-1.5 rounded bg-background border border-border text-sm" />
    </label>
  );
}
