import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Circle, CheckCircle2, ExternalLink } from "lucide-react";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { IllustrationBlockV2 } from "@/components/learn/IllustrationV2";
import { TwelveBarCounter, buildChart } from "@/components/learn/TwelveBarCounter";
import type { StepLesson, WatchMedia } from "@/data/learnPlayV2";
import { artistDetailPath } from "@/lib/locale";
import type { Lang } from "@/i18n";

function MediaBlock({ media, caption, locale }: { media: WatchMedia; caption?: string; locale: Lang }) {
  if (media.kind === "illustration") {
    return (
      <div className="flex flex-col items-center gap-2">
        <IllustrationBlockV2 illustration={media.illustration} />
        {caption && <p className="text-sm text-muted-foreground text-center max-w-md">{caption}</p>}
      </div>
    );
  }
  return (
    <div>
      <YouTubeEmbed videoId={media.videoId} title={caption ?? "Lesson video"} start={media.start} end={media.end} locale={locale} loopable={media.loopable} />
      {caption && <p className="mt-2 text-sm text-muted-foreground">{caption}</p>}
      <p className="text-xs text-muted-foreground/70">{media.credit}</p>
    </div>
  );
}

function useChecklist(storageKey: string, count: number) {
  const [checked, setChecked] = useState<boolean[]>(() => Array(count).fill(false));
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === count) setChecked(parsed);
      }
    } catch {
      // start unchecked
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  const toggle = (i: number) => {
    setChecked((c) => {
      const next = [...c];
      next[i] = !next[i];
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* best-effort */ }
      return next;
    });
  };
  return { checked, toggle };
}

export function StepLessonRenderer({ lesson, lang }: { lesson: StepLesson; lang: Lang }) {
  const checkStep = lesson.steps.find((s) => s.kind === "check") as Extract<StepLesson["steps"][number], { kind: "check" }> | undefined;
  const { checked, toggle } = useChecklist(`slowblues-learn-play-check-${lesson.id}`, checkStep?.criteria.length ?? 0);
  const [fixOpen, setFixOpen] = useState(false);

  return (
    <div className="space-y-6">
      {lesson.steps.map((step, i) => {
        switch (step.kind) {
          case "goal":
            return (
              <div key={i}>
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">You'll be able to</div>
                <p className="text-lg text-foreground/90">{step.text}</p>
              </div>
            );
          case "watch":
            return (
              <div key={i}>
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">Watch</div>
                <MediaBlock media={step.media} caption={step.caption} locale={lang} />
              </div>
            );
          case "understand":
            return (
              <div key={i}>
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">Understand</div>
                <p className="text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            );
          case "try":
            return (
              <div key={i}>
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">Try it (no track yet)</div>
                <ol className="space-y-3">
                  {step.items.map((it, j) => (
                    <li key={j} className="bg-card/40 border border-border rounded-lg p-3">
                      <div className="font-medium text-foreground/90">{j + 1}. {it.goal}</div>
                      <div className="text-sm text-muted-foreground mt-1">{it.technique}</div>
                      <div className="text-xs text-gold mt-1.5">You'll know it works when: {it.workingSign}</div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          case "check":
            return (
              <div key={i}>
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">Check — ready when you can</div>
                <ul className="space-y-2">
                  {step.criteria.map((c, j) => (
                    <li key={j}>
                      <button type="button" onClick={() => toggle(j)} className="flex items-start gap-2 text-left w-full group">
                        {checked[j] ? <CheckCircle2 className="size-4 text-gold mt-0.5 shrink-0" /> : <Circle className="size-4 text-muted-foreground mt-0.5 shrink-0" />}
                        <span className={checked[j] ? "text-foreground/70 line-through decoration-gold/50" : "text-foreground/90"}>{c}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "fix":
            return (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button type="button" onClick={() => setFixOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground/90 hover:bg-card/40 transition">
                  If it sounds wrong
                  <ChevronDown className={`size-4 transition-transform ${fixOpen ? "rotate-180" : ""}`} />
                </button>
                {fixOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {step.problems.map((p, j) => (
                      <div key={j} className="text-sm">
                        <div className="text-foreground/90 font-medium">{p.problem}</div>
                        <div className="text-muted-foreground mt-0.5">{p.fix}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          case "play":
            return (
              <div key={i}>
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">Play with the track</div>
                <p className="text-foreground/90 mb-3">{step.task}</p>
                {step.media && <MediaBlock media={step.media} caption={step.caption} locale={lang} />}
                {step.chart && (
                  <div className="mt-3">
                    <TwelveBarCounter
                      chart={step.chart}
                      labels={{ bar: "Bar", beat: "Beat", standalone: "This counter runs on its own — it doesn't sync with the video above.", start: "Start", stop: "Stop", mute: "Mute click", bpm: "BPM" }}
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground italic">This click track runs independently — it does not sync with the video above.</p>
                  </div>
                )}
              </div>
            );
          case "record":
            return (
              <div key={i} className="bg-card/30 border border-dashed border-border rounded-lg p-4">
                <div className="text-xs uppercase tracking-widest text-gold mb-1.5">Record yourself (optional)</div>
                <p className="text-sm text-muted-foreground">{step.prompt}</p>
              </div>
            );
          default:
            return null;
        }
      })}

      {lesson.reward && lesson.reward.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Later / where this leads</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {lesson.reward.map((r, i) => (
              <div key={i}>
                <YouTubeEmbed videoId={r.videoId} title={r.caption} locale={lang} />
                <p className="mt-2 text-sm text-muted-foreground">{r.caption}</p>
                <Link to={artistDetailPath(lang, r.artistSlug) as any} className="mt-1 inline-flex items-center gap-1 text-xs text-gold hover:underline">
                  {r.credit}'s profile <ExternalLink className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { buildChart };
