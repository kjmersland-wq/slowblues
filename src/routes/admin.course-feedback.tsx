import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { EyeOff, Eye, Trash2, Download, Flag } from "lucide-react";
import {
  listCourseFeedbackAdmin,
  setCourseFeedbackStatus,
  summarizeCourseFeedback,
  exportCourseFeedbackCsv,
  type CourseFeedbackAdminRow,
  type LessonSummary,
} from "@/lib/courseFeedbackAdmin.functions";
import type { CourseFeedbackInstrument, CourseFeedbackStatus } from "@/lib/courseFeedback.functions";

export const Route = createFileRoute("/admin/course-feedback")({
  component: AdminCourseFeedbackPage,
  head: () => ({ meta: [{ title: "Course Feedback Admin — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

function AdminCourseFeedbackPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<CourseFeedbackAdminRow[]>([]);
  const [summary, setSummary] = useState<LessonSummary[]>([]);
  const [filterInstrument, setFilterInstrument] = useState<CourseFeedbackInstrument | "">("");
  const [filterLesson, setFilterLesson] = useState("");
  const [filterRating, setFilterRating] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<CourseFeedbackStatus | "">("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  const refresh = async () => {
    setBusy(true);
    try {
      const [list, sum] = await Promise.all([
        listCourseFeedbackAdmin({
          data: {
            instrument: filterInstrument || undefined,
            lessonId: filterLesson || undefined,
            rating: filterRating ? Number(filterRating) : undefined,
            status: filterStatus || undefined,
          },
        }),
        summarizeCourseFeedback(),
      ]);
      setRows(list as CourseFeedbackAdminRow[]);
      setSummary(sum);
    } catch {
      // non-fatal — leave previous data visible
    }
    setBusy(false);
  };

  useEffect(() => {
    if (isAdmin) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, filterInstrument, filterLesson, filterRating, filterStatus]);

  const setStatus = async (id: string, status: CourseFeedbackStatus) => {
    await setCourseFeedbackStatus({ data: { id, status } });
    refresh();
  };

  const download = async () => {
    const { csv } = await exportCourseFeedbackCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `course-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <PageShell hideMerchCta><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Loading…</div></PageShell>;

  return (
    <PageShell hideMerchCta>
      <PageHero eyebrow="Admin" title="Course Feedback" lead="Ratings and comments on Learn to Play — separate from the Guestbook." img={IMG.pianoNight} />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-gold">← Admin home</Link>
          <button onClick={download} className="px-4 py-2 rounded-md border border-border hover:border-gold/50 text-sm flex items-center gap-2">
            <Download className="size-4" /> Export CSV
          </button>
        </div>

        {summary.length > 0 && (
          <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.map((s) => (
              <div key={`${s.instrument}-${s.lesson_id}`} className="bg-card/40 border border-border rounded-lg p-3 text-sm">
                <div className="font-medium">{s.instrument} · {s.lesson_id ?? "course-wide"}</div>
                <div className="text-gold">{s.average.toFixed(1)} / 5 ({s.count})</div>
                {s.topChips.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                    {s.topChips.map((c, i) => <span key={i}>{c.chip} ({c.count})</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <select value={filterInstrument} onChange={(e) => setFilterInstrument(e.target.value as any)} className="px-2 py-1.5 rounded bg-background border border-border text-sm">
            <option value="">All instruments</option>
            <option value="shared">shared</option>
            <option value="guitar">guitar</option>
            <option value="harmonica">harmonica</option>
          </select>
          <input value={filterLesson} onChange={(e) => setFilterLesson(e.target.value)} placeholder="lesson id" className="px-2 py-1.5 rounded bg-background border border-border text-sm" />
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="px-2 py-1.5 rounded bg-background border border-border text-sm">
            <option value="">All ratings</option>
            {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} star</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-2 py-1.5 rounded bg-background border border-border text-sm">
            <option value="">All statuses</option>
            <option value="visible">visible</option>
            <option value="hidden">hidden</option>
            <option value="deleted">deleted</option>
          </select>
          {busy && <span className="text-xs text-muted-foreground self-center">Loading…</span>}
        </div>

        <div className="grid gap-2">
          {rows.map((r) => (
            <article key={r.id} className="bg-card/60 border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-gold uppercase tracking-wider flex items-center gap-2">
                    {r.instrument} · {r.lesson_id ?? "course-wide"} · {r.rating}★ · {r.status}
                    {r.report_count > 0 && <span className="inline-flex items-center gap-0.5 text-destructive"><Flag className="size-3" /> {r.report_count}</span>}
                    {r.private_to_editor === 1 && <span className="text-muted-foreground">(editor-only)</span>}
                    {r.consent_public === 1 && <span className="text-muted-foreground">(consented public)</span>}
                  </div>
                  {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.display_name || "—"} {r.country ? `· ${r.country}` : ""} {r.email ? `· ${r.email}` : ""} · {r.created_at}
                  </div>
                  {r.adjust_chips.length > 0 && <div className="text-xs text-muted-foreground mt-1">{r.adjust_chips.join(", ")}</div>}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {r.status !== "hidden" ? (
                    <button onClick={() => setStatus(r.id, "hidden")} className="p-2 rounded border border-border hover:border-gold" title="Hide"><EyeOff className="size-4" /></button>
                  ) : (
                    <button onClick={() => setStatus(r.id, "visible")} className="p-2 rounded border border-border hover:border-gold" title="Unhide"><Eye className="size-4" /></button>
                  )}
                  {r.status !== "deleted" && (
                    <button onClick={() => setStatus(r.id, "deleted")} className="p-2 rounded border border-border hover:border-red-500 hover:text-red-400" title="Delete"><Trash2 className="size-4" /></button>
                  )}
                </div>
              </div>
            </article>
          ))}
          {!rows.length && !busy && <p className="text-sm text-muted-foreground text-center py-8">No feedback matches these filters.</p>}
        </div>
      </section>
    </PageShell>
  );
}
