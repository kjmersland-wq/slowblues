import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { StepLessonRenderer } from "@/components/learn/StepLessonRenderer";
import { L0_EARS, G1_HOLD, H1_HOLD, type StepLesson } from "@/data/learnPlayV2";

// PHASE 1 REVIEW SLICE — not linked from the site nav, not wired into the
// live /learn/play/guitar or /learn/play/harmonica routes. Deliberately
// isolated so this can be reviewed without touching the currently-live,
// working course. Once approved, L0/G1/H1 replace their old-format
// counterparts in learnPlay.ts and this route goes away.
export const Route = createFileRoute("/learn/play/preview")({
  component: PreviewPage,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }, { title: "Learn to Play — Phase 1 preview" }] }),
});

const LESSONS: { key: string; lesson: StepLesson }[] = [
  { key: "L0", lesson: L0_EARS },
  { key: "G1", lesson: G1_HOLD },
  { key: "H1", lesson: H1_HOLD },
];

function PreviewPage() {
  const { lang } = useI18n();
  const [active, setActive] = useState(0);
  const current = LESSONS[active].lesson;

  return (
    <PageShell>
      <PageHero
        eyebrow="Phase 1 review — not live"
        title={current.title}
        lead="New lesson structure: Goal → Watch → Understand → Try → Check → Fix → Play → Record. English only this phase; noindex, not linked from the nav."
      />
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex justify-center gap-2 mb-8">
          {LESSONS.map((l, i) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setActive(i)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${active === i ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}
            >
              {l.key}
            </button>
          ))}
        </div>
        <div className="bg-card/60 border border-border rounded-xl p-5 sm:p-7">
          <StepLessonRenderer lesson={current} lang={lang} />
        </div>
      </section>
    </PageShell>
  );
}
