import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ExternalLink, CircleCheck } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { artistDetailPath } from "@/lib/locale";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { ChordDiagram } from "@/components/learn/ChordDiagram";
import { HarpMap } from "@/components/learn/HarpMap";
import { getTrack, type Media, type Illustration, type LearnLang } from "@/data/learnPlay";
import { CourseFeedbackWidget } from "@/components/learn/CourseFeedbackWidget";

// No "coming soon" state: a lesson either has a real Media object for a
// slot, or the field is omitted and LearnPlayTrackPage never renders that
// section's header at all — never an empty framed box.
function MediaBlock({ media, lang }: { media: Media; lang: "en" | "no" | "sv" | "de" | "pl" }) {
  return (
    <div>
      <YouTubeEmbed videoId={media.videoId} title={media.caption[lang] ?? media.caption.en} start={media.start} />
      <p className="mt-2 text-sm text-muted-foreground">{media.caption[lang] ?? media.caption.en}</p>
      <p className="text-xs text-muted-foreground/70">{media.credit}</p>
    </div>
  );
}

function IllustrationBlock({ illustration, lang }: { illustration: Illustration; lang: LearnLang }) {
  if (illustration.kind === "chord") {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {illustration.chords.map((c) => (
          <ChordDiagram key={c.chord} chord={c.chord} label={c.label[lang] ?? c.label.en} />
        ))}
      </div>
    );
  }
  if (illustration.kind === "harp") {
    return <HarpMap highlight={illustration.highlight} direction={illustration.direction} label={illustration.label[lang] ?? illustration.label.en} />;
  }
  return null;
}

type StoredProgress = { lessonIndex: number; done: string[] };

export function LearnPlayTrackPage({ trackId }: { trackId: "guitar" | "harmonica" }) {
  const { lang } = useI18n();
  const track = getTrack(trackId)!;
  const storageKey = `slowblues-learn-play-${trackId}`;

  const [lessonIndex, setLessonIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress;
        if (typeof parsed.lessonIndex === "number" && parsed.lessonIndex < track.lessons.length) setLessonIndex(parsed.lessonIndex);
        if (Array.isArray(parsed.done)) setDone(new Set(parsed.done));
      }
    } catch {
      // ignore -- start fresh
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ lessonIndex, done: [...done] } satisfies StoredProgress));
    } catch {
      // best-effort only
    }
  }, [lessonIndex, done, hydrated, storageKey]);

  const lesson = track.lessons[lessonIndex];
  const total = track.lessons.length;

  const goNext = () => {
    setDone((d) => new Set(d).add(lesson.id));
    if (lessonIndex + 1 < total) setLessonIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (lessonIndex > 0) setLessonIndex((i) => i - 1);
  };

  // "Guitar 1 of 6" read as if there were 6 guitar lessons -- there are 5
  // plus one shared intro. The intro gets its own label; every other
  // lesson counts against the 5, not the raw array length.
  const progressLabel = useMemo(() => {
    if (lessonIndex === 0) {
      return tr(lang, { en: "Intro", no: "Intro", sv: "Intro", de: "Intro", pl: "Wstęp" });
    }
    return tr(lang, {
      en: `Lesson ${lessonIndex} of ${total - 1}`,
      no: `Leksjon ${lessonIndex} av ${total - 1}`,
      sv: `Lektion ${lessonIndex} av ${total - 1}`,
      de: `Lektion ${lessonIndex} von ${total - 1}`,
      pl: `Lekcja ${lessonIndex} z ${total - 1}`,
    });
  }, [lang, lessonIndex, total]);

  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { en: "Play Blues", no: "Spill blues", sv: "Spela blues", de: "Blues spielen", pl: "Graj bluesa" })}
        title={track.title[lang] ?? track.title.en}
        lead={track.intro[lang] ?? track.intro.en}
        img={undefined}
      />
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{progressLabel}</span>
            <Link to="/learn/play" className="hover:text-gold">
              {tr(lang, { en: "Switch track", no: "Bytt spor", sv: "Byt spår", de: "Spur wechseln", pl: "Zmień ścieżkę" })}
            </Link>
          </div>
          <div
            className="h-1.5 rounded-full bg-border overflow-hidden"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={lessonIndex + 1}
            aria-valuetext={progressLabel}
          >
            <div className="h-full bg-gold transition-all" style={{ width: `${((lessonIndex + 1) / total) * 100}%` }} />
          </div>
        </div>

        <div className="bg-card/60 border border-border rounded-xl p-5 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-2xl gold-gradient-text">{lesson.title[lang] ?? lesson.title.en}</h2>
            <span className="text-[10px] uppercase tracking-widest text-gold/80 border border-gold/30 rounded-full px-2 py-0.5">
              {lesson.badge[lang] ?? lesson.badge.en}
            </span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-gold mb-1.5">
              {tr(lang, { en: "You'll be able to", no: "Du skal kunne", sv: "Du ska kunna", de: "Du wirst können", pl: "Będziesz umiał/a" })}
            </div>
            <p className="text-foreground/90">{lesson.goal[lang] ?? lesson.goal.en}</p>
          </div>

          {lesson.illustration.kind !== "none" && (
            <div className="flex justify-center py-2">
              <IllustrationBlock illustration={lesson.illustration} lang={lang} />
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-widest text-gold mb-1.5">
              {tr(lang, { en: "Do this", no: "Gjør dette", sv: "Gör detta", de: "Mach das", pl: "Zrób to" })}
            </div>
            <p className="text-muted-foreground leading-relaxed">{lesson.steps[lang] ?? lesson.steps.en}</p>
            {lesson.successTest && (
              <p className="mt-2.5 flex items-start gap-1.5 text-sm text-gold/90">
                <CircleCheck className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{lesson.successTest[lang] ?? lesson.successTest.en}</span>
              </p>
            )}
          </div>

          {lesson.listen && (
            <div>
              <div className="text-xs uppercase tracking-widest text-gold mb-1.5">
                {tr(lang, { en: "Listen", no: "Lytt", sv: "Lyssna", de: "Hör zu", pl: "Posłuchaj" })}
              </div>
              <MediaBlock media={lesson.listen} lang={lang} />
            </div>
          )}

          {lesson.backing && (
            <div>
              <div className="text-xs uppercase tracking-widest text-gold mb-1.5 flex items-center gap-2">
                {tr(lang, { en: "Play to backing", no: "Spill til backing", sv: "Spela till backing", de: "Zum Backing spielen", pl: "Graj do podkładu" })}
                {lesson.temporaryNote && (
                  <span className="normal-case tracking-normal text-[10px] text-amber-400/90 border border-amber-400/30 rounded-full px-2 py-0.5">
                    {tr(lang, { en: "Temporary", no: "Midlertidig", sv: "Tillfälligt", de: "Vorübergehend", pl: "Tymczasowe" })}
                  </span>
                )}
              </div>
              <MediaBlock media={lesson.backing} lang={lang} />
              {lesson.temporaryNote && (
                <p className="mt-1.5 text-xs text-amber-400/80 italic">{lesson.temporaryNote[lang] ?? lesson.temporaryNote.en}</p>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">{lesson.nextTip[lang] ?? lesson.nextTip.en}</p>
            <Link to={artistDetailPath(lang, lesson.artistSlug) as any} className="inline-flex items-center gap-1 text-sm text-gold hover:underline">
              {tr(lang, { en: "Open the artist profile", no: "Åpne artistprofilen", sv: "Öppna artistprofilen", de: "Künstlerprofil öffnen", pl: "Otwórz profil artysty" })}
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={lessonIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border hover:border-gold/50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="size-4" /> {tr(lang, { en: "Previous", no: "Forrige", sv: "Föregående", de: "Zurück", pl: "Poprzednia" })}
          </button>
          {lessonIndex + 1 < total ? (
            <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition">
              {tr(lang, { en: "Next", no: "Neste", sv: "Nästa", de: "Weiter", pl: "Następna" })} <ChevronRight className="size-4" />
            </button>
          ) : (
            <button type="button" onClick={goNext} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition">
              {tr(lang, { en: "Done — that went!", no: "Ferdig — det gikk an!", sv: "Klart — det gick!", de: "Fertig — das ging!", pl: "Gotowe — udało się!" })}
            </button>
          )}
        </div>

        <CourseFeedbackWidget instrument={trackId} lessonId={lesson.id} />
      </section>
    </PageShell>
  );
}
