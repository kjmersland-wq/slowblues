import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { useEffect, useMemo, useState } from "react";
import { Check, X, RotateCcw, Trophy, ExternalLink, Calendar, Star, Archive, Volume2, Music } from "lucide-react";
import {
  getPublishedCycle,
  getCycleNumber,
  formatCycleRange,
  displayNameFromSlug,
  type QuizQuestionSnapshot,
} from "@/lib/quiz.server";
import { getAllTimeLeaderboard, addToLeaderboard, type LeaderboardEntry } from "@/data/quizQuestions";
import { useI18n, tr, type Lang } from "@/i18n";
import { artistDetailPath } from "@/lib/locale";

export const Route = createFileRoute("/quiz/")({
  component: QuizPage,
  loader: async () => getPublishedCycle({ data: {} }),
  head: ({ loaderData }) => {
    const cycle = loaderData?.meta?.cycleNumber ?? getCycleNumber();
    const key = loaderData?.meta?.cycleKey ?? `C-${String(cycle).padStart(3, "0")}`;
    const published = !!loaderData?.meta;
    const base = [
      { title: published ? `Blues Quiz · ${key} — SlowBlues` : "Blues Quiz — SlowBlues" },
      {
        name: "description",
        content: published
          ? `A new blues quiz every 10 days. Cycle ${key} (${formatCycleRange(cycle)}) — multiple-choice and audio rounds, straight from the SlowBlues archive.`
          : "A new blues quiz every 10 days, built from the SlowBlues archive. The next round is being lined up.",
      },
      { property: "og:title", content: published ? `Blues Quiz · ${key} — SlowBlues` : "Blues Quiz — SlowBlues" },
      { property: "og:image", content: IMG.vinyl },
    ];
    // Nothing published yet -- don't send crawlers to an empty page.
    return { meta: published ? base : [...base, { name: "robots", content: "noindex" }] };
  },
});

type FlatQuestion = QuizQuestionSnapshot;

function flattenQuestions(data: { easy: FlatQuestion[]; medium: FlatQuestion[]; hard: FlatQuestion[] } | null): FlatQuestion[] {
  if (!data) return [];
  return [...data.easy, ...data.medium, ...data.hard];
}

const COMING_SOON: Record<Lang, string> = {
  no: "Neste runde er på vei. Kom innom igjen om noen dager.",
  en: "Next round is being lined up. Check back in a few days.",
  sv: "Nästa omgång är på gång. Titta förbi igen om några dagar.",
  de: "Die nächste Runde ist schon in Vorbereitung. Schau in ein paar Tagen wieder vorbei.",
  pl: "Kolejna runda już się szykuje. Zajrzyj ponownie za kilka dni.",
};

function QuizPage() {
  const { lang } = useI18n();
  const localeStr = lang === "no" ? "nb-NO" : lang === "sv" ? "sv-SE" : lang === "de" ? "de-DE" : lang === "pl" ? "pl-PL" : "en";
  const data = Route.useLoaderData();

  const cycle = data?.meta?.cycleNumber ?? getCycleNumber();
  const cycleKey = data?.meta?.cycleKey ?? `C-${String(cycle).padStart(3, "0")}`;
  const cycleRange = useMemo(() => formatCycleRange(cycle, localeStr), [cycle, localeStr]);
  const featuredSlug = data?.meta?.featuredArtistSlug ?? null;

  const questions = useMemo(() => flattenQuestions(data?.questions ?? null), [data]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset the run only when the cycle itself changes -- never on a language
  // switch, so swapping the locale-switcher mid-round keeps progress/answers
  // and just changes the displayed text.
  useEffect(() => {
    setIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setRevealed(false);
    setFinished(false);
    setSubmitted(false);
  }, [cycleKey, questions.length]);

  const score = answers.reduce<number>((sum, a, i) => sum + (a === questions[i]?.correctIndex ? 1 : 0), 0);

  useEffect(() => {
    if (!finished || questions.length === 0) return;
    try {
      localStorage.setItem(
        `slowblues-quiz-last-${cycleKey}`,
        JSON.stringify({ score, total: questions.length, date: new Date().toISOString() }),
      );
    } catch {
      // best-effort only
    }
  }, [finished, cycleKey, score, questions.length]);

  const submitScore = () => {
    if (!nickname.trim()) return;
    addToLeaderboard({ nickname: nickname.trim().slice(0, 24), score, total: questions.length, date: new Date().toISOString(), monthKey: cycleKey });
    setSubmitted(true);
  };

  const pickAnswer = (ci: number) => {
    if (revealed) return;
    setAnswers((a) => a.map((v, i) => (i === index ? ci : v)));
    setRevealed(true);
  };

  const goNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setRevealed(false);
    setFinished(false);
    setSubmitted(false);
  };

  // ----- Empty state: no published cycle yet -----
  if (!data?.meta || questions.length === 0) {
    return (
      <PageShell>
        <PageHero
          eyebrow={tr(lang, { no: "Blues-quiz", en: "Blues Quiz", sv: "Bluesquiz", de: "Blues-Quiz", pl: "Quiz bluesowy" })}
          title={tr(lang, { no: "Hvor godt kan du bluesen?", en: "Think you know the blues?", pl: "Myślisz, że znasz bluesa?", sv: "Hur bra kan du bluesen?", de: "Wie gut kennst du den Blues?" })}
          lead=""
          img={IMG.vinyl}
        />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center text-muted-foreground">
          {tr(lang, COMING_SOON)}
        </div>
      </PageShell>
    );
  }

  // ----- Results -----
  if (finished) {
    const total = questions.length;
    const board = getAllTimeLeaderboard();
    const wrong = questions
      .map((q, i) => ({ q, i, yourIndex: answers[i] }))
      .filter(({ q, yourIndex }) => yourIndex !== q.correctIndex);

    const verdict =
      score / total >= 0.8
        ? tr(lang, { no: "Du kom inn og kjente platene.", en: "You came in knowing the records.", pl: "Wszedłeś/aś, znając te płyty.", sv: "Du klev in och kunde skivorna.", de: "Du kanntest die Platten schon." })
        : score / total >= 0.5
        ? tr(lang, { no: "Godt øre. Du kan katalogen.", en: "Solid ear. You know this catalogue.", pl: "Dobre ucho. Znasz ten katalog.", sv: "Bra öra. Du kan katalogen.", de: "Gutes Ohr. Du kennst den Katalog." })
        : tr(lang, { no: "God start. Neste runde sitter bedre.", en: "Good start. The next round will sit better.", pl: "Dobry start. Kolejna runda pójdzie lepiej.", sv: "Bra start. Nästa omgång sitter bättre.", de: "Guter Start. Die nächste Runde sitzt besser." });

    return (
      <PageShell>
        <PageHero
          eyebrow={tr(lang, { no: "Resultat", en: "Result", pl: "Wynik", sv: "Resultat", de: "Ergebnis" })}
          title={tr(lang, { no: "Hvor godt gikk det?", en: "How did you do?", pl: "Jak Ci poszło?", sv: "Hur gick det?", de: "Wie ist es gelaufen?" })}
          lead=""
          img={IMG.vinyl}
        />
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-8 bg-gradient-to-br from-card to-card/30 border border-gold/40 rounded-xl p-8">
            <Trophy className="size-12 text-gold mx-auto mb-3" />
            <div className="font-display text-5xl gold-gradient-text mb-1">{score} / {total}</div>
            <div className="text-muted-foreground mb-5">{verdict}</div>

            {!submitted ? (
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={tr(lang, { no: "Kallenavn for leaderboard", en: "Nickname for leaderboard", pl: "Pseudonim do rankingu", sv: "Smeknamn för topplistan", de: "Spitzname für Bestenliste" })}
                  aria-label={tr(lang, { no: "Kallenavn for leaderboard", en: "Nickname for leaderboard", pl: "Pseudonim do rankingu", sv: "Smeknamn för topplistan", de: "Spitzname für Bestenliste" })}
                  className="flex-1 px-3 py-2 rounded-md bg-background border border-border text-sm"
                  maxLength={24}
                />
                <button onClick={submitScore} disabled={!nickname.trim()} className="px-4 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-40">
                  {tr(lang, { no: "Send inn", en: "Submit", pl: "Prześlij", sv: "Skicka in", de: "Absenden" })}
                </button>
              </div>
            ) : (
              <div className="text-sm text-gold">{tr(lang, { no: "Score lagret!", en: "Score saved!", pl: "Wynik zapisany!", sv: "Poäng sparad!", de: "Punktzahl gespeichert!" })}</div>
            )}
          </div>

          {board.length > 0 && (
            <div className="bg-card/40 border border-border rounded-lg p-5 mb-8">
              <div className="font-display text-lg mb-3 inline-flex items-center gap-2">
                <Trophy className="size-4 text-gold" />
                {tr(lang, { no: "Leaderboard (topp 10)", en: "Leaderboard (top 10)", pl: "Ranking (top 10)", sv: "Topplista (topp 10)", de: "Bestenliste (Top 10)" })}
              </div>
              <ol className="text-sm space-y-1.5">
                {board.map((e: LeaderboardEntry, i: number) => (
                  <li key={i} className="flex justify-between border-b border-border/40 pb-1">
                    <span><span className="text-gold mr-2">{i + 1}.</span>{e.nickname}</span>
                    <span className="text-muted-foreground">{e.score}/{e.total}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {wrong.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground mb-1">
                {tr(lang, { no: "Disse kan være verdt et nytt blikk:", en: "These are worth a second look:", pl: "Warto na nie ponownie zerknąć:", sv: "De här kan vara värda en ny titt:", de: "Diese lohnen einen zweiten Blick:" })}
              </div>
              {wrong.map(({ q, i, yourIndex }) => {
                const opts = q.options[lang] ?? q.options.en;
                return (
                  <div key={q.id} className="bg-card/60 border border-border rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <X className="size-5 text-destructive mt-0.5 shrink-0" />
                      <div className="font-medium">{i + 1}. {q.question[lang] ?? q.question.en}</div>
                    </div>
                    {q.type === "audio-guess" && q.youtubeVideoId && (
                      <div className="ml-7 mb-2 max-w-xs">
                        <BlindAudioClip
                          videoId={q.youtubeVideoId}
                          start={q.audioStart ?? 0}
                          end={q.audioEnd ?? 20}
                          label={tr(lang, { no: "Hør igjen", en: "Listen again", pl: "Posłuchaj ponownie", sv: "Lyssna igen", de: "Nochmal hören" })}
                          playingLabel={tr(lang, { no: "Spiller …", en: "Playing …", pl: "Odtwarzanie…", sv: "Spelar …", de: "Wird abgespielt …" })}
                        />
                      </div>
                    )}
                    <div className="text-sm ml-7 mb-1">
                      <span className="text-muted-foreground">{tr(lang, { no: "Ditt svar", en: "Your answer", pl: "Twoja odpowiedź", sv: "Ditt svar", de: "Deine Antwort" })}: </span>
                      <span>{yourIndex !== null ? opts[yourIndex] : "—"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-7 mb-2">
                      {tr(lang, { no: "Riktig svar", en: "Correct answer", pl: "Poprawna odpowiedź", sv: "Rätt svar", de: "Richtige Antwort" })}: <span className="text-gold">{opts[q.correctIndex]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground/90 ml-7 leading-relaxed">{q.explanation[lang] ?? q.explanation.en}</p>
                    {q.artistSlug && (
                      <Link to={artistDetailPath(lang, q.artistSlug) as any} className="ml-7 mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">
                        {tr(lang, { no: "Les mer om artisten", en: "Read more about the artist", pl: "Przeczytaj więcej o artyście", sv: "Läs mer om artisten", de: "Mehr über den Künstler" })} <ExternalLink className="size-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gold font-medium mb-4">
              {tr(lang, { no: "Full pott. Ingen å rette opp i.", en: "Clean sweep — nothing to correct.", pl: "Komplet punktów — nic do poprawy.", sv: "Full pott. Inget att rätta till.", de: "Alles richtig — nichts zu korrigieren." })}
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
              <RotateCcw className="size-4" /> {tr(lang, { no: "Spill igjen", en: "Play again", pl: "Zagraj ponownie", sv: "Spela igen", de: "Nochmal spielen" })}
            </button>
            <Link to="/artists" className="px-5 py-2.5 rounded-md border border-border hover:border-gold/50 transition">
              {tr(lang, { no: "Til artistene", en: "To the artists", pl: "Do artystów", sv: "Till artisterna", de: "Zu den Künstlern" })}
            </Link>
            <Link to="/" className="px-5 py-2.5 rounded-md border border-border hover:border-gold/50 transition">
              {tr(lang, { no: "Forsiden", en: "Homepage", pl: "Strona główna", sv: "Startsidan", de: "Startseite" })}
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  // ----- One question at a time -----
  const q = questions[index];
  const opts = q.options[lang] ?? q.options.en;
  const picked = answers[index];

  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { no: "Blues-quiz", en: "Blues Quiz", sv: "Bluesquiz", de: "Blues-Quiz", pl: "Quiz bluesowy" })}
        title={tr(lang, { no: "Hvor godt kan du bluesen?", en: "Think you know the blues?", pl: "Myślisz, że znasz bluesa?", sv: "Hur bra kan du bluesen?", de: "Wie gut kennst du den Blues?" })}
        lead=""
        img={IMG.vinyl}
      />
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-6 rounded-xl border border-gold/30 bg-gradient-to-br from-card/70 to-card/30 p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-gold font-medium"><Calendar className="size-4" /> {cycleKey}</span>
            <span className="text-muted-foreground">{tr(lang, { no: "Denne runden:", en: "This round:", pl: "Ta runda:", sv: "Denna runda:", de: "Diese Runde:" })} {cycleRange}</span>
            <Link to={"/quiz/archive" as any} className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
              <Archive className="size-3.5" /> {tr(lang, { no: "Arkiv", en: "Archive", pl: "Archiwum", sv: "Arkiv", de: "Archiv" })}
            </Link>
          </div>
          {featuredSlug && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Star className="size-4 text-gold" />
              <span className="text-muted-foreground">{tr(lang, { no: "Syklusens artist:", en: "Featured artist:", pl: "Polecany artysta:", sv: "Periodens artist:", de: "Künstler des Zyklus:" })}</span>
              <Link to={artistDetailPath(lang, featuredSlug) as any} className="text-gold hover:underline font-medium">{displayNameFromSlug(featuredSlug)}</Link>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{tr(lang, { no: `Spørsmål ${index + 1} av ${questions.length}`, en: `Question ${index + 1} of ${questions.length}`, pl: `Pytanie ${index + 1} z ${questions.length}`, sv: `Fråga ${index + 1} av ${questions.length}`, de: `Frage ${index + 1} von ${questions.length}` })}</span>
            <span className="uppercase tracking-wide">{q.difficulty}</span>
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-gold transition-all" style={{ width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-card/60 border border-border rounded-xl p-5">
          <div className="font-display text-lg mb-3">{q.question[lang] ?? q.question.en}</div>

          {q.type === "audio-guess" && q.youtubeVideoId && (
            <BlindAudioClip
              videoId={q.youtubeVideoId}
              start={q.audioStart ?? 0}
              end={q.audioEnd ?? 30}
              hint={q.audioHint ? (q.audioHint[lang] ?? q.audioHint.en) : undefined}
              label={tr(lang, { no: "Spill av lydklipp", en: "Play audio clip", pl: "Odtwórz klip audio", sv: "Spela ljudklipp", de: "Audioclip abspielen" })}
              playingLabel={tr(lang, { no: "Spiller … lytt nøye", en: "Playing … listen carefully", pl: "Odtwarzanie... słuchaj uważnie", sv: "Spelar … lyssna noga", de: "Wird abgespielt … gut zuhören" })}
            />
          )}

          <div className="grid sm:grid-cols-2 gap-2" role="group" aria-label={q.question[lang] ?? q.question.en}>
            {opts.map((c, ci) => {
              const isCorrect = ci === q.correctIndex;
              const isPicked = ci === picked;
              let cls = "bg-background/40 border-border hover:border-gold/50";
              if (revealed) {
                if (isCorrect) cls = "bg-gold/15 border-gold text-foreground";
                else if (isPicked) cls = "bg-destructive/10 border-destructive/60 text-foreground";
                else cls = "bg-background/20 border-border/60 opacity-70";
              } else if (isPicked) {
                cls = "bg-gold/15 border-gold text-foreground";
              }
              return (
                <button
                  key={ci}
                  onClick={() => pickAnswer(ci)}
                  disabled={revealed}
                  className={`text-left text-sm px-3 py-2.5 rounded-md border transition flex items-center justify-between gap-2 ${cls}`}
                >
                  <span>{c}</span>
                  {revealed && isCorrect && <Check className="size-4 text-gold shrink-0" />}
                  {revealed && isPicked && !isCorrect && <X className="size-4 text-destructive shrink-0" />}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation[lang] ?? q.explanation.en}</p>
              {q.artistSlug && (
                <Link to={artistDetailPath(lang, q.artistSlug) as any} className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">
                  {tr(lang, { no: "Les mer om artisten", en: "Read more about the artist", pl: "Przeczytaj więcej o artyście", sv: "Läs mer om artisten", de: "Mehr über den Künstler" })} <ExternalLink className="size-3" />
                </Link>
              )}
              <button
                onClick={goNext}
                className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90"
              >
                {index + 1 >= questions.length
                  ? tr(lang, { no: "Se resultatet", en: "See my result", pl: "Pokaż mój wynik", sv: "Visa resultatet", de: "Ergebnis anzeigen" })
                  : tr(lang, { no: "Neste spørsmål", en: "Next question", pl: "Następne pytanie", sv: "Nästa fråga", de: "Nächste Frage" })}
              </button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function BlindAudioClip({
  videoId,
  start,
  end,
  hint,
  label,
  playingLabel,
}: {
  videoId: string;
  start: number;
  end: number;
  hint?: string;
  label: string;
  playingLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  const duration = Math.max(1, end - start);

  return (
    <div className="mb-3 rounded-md overflow-hidden border border-border bg-black/60">
      <div className="relative aspect-video">
        {playing ? (
          <>
            {/* Iframe loads audio; fully covered so the album art / title can't be seen */}
            <iframe
              title="audio-clip"
              className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&start=${start}&end=${end}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
              allow="encrypted-media; autoplay"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-card to-background text-center px-4">
              <div className="flex items-center gap-2 text-gold">
                <Volume2 className="size-6 animate-pulse" />
                <Music className="size-5 animate-pulse" />
                <Volume2 className="size-6 animate-pulse" />
              </div>
              <div className="text-sm text-foreground/90 font-medium">{playingLabel}</div>
              <div className="text-xs text-muted-foreground">~{duration}s</div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-card to-background hover:from-card/80 transition group"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-lg group-hover:scale-105 transition">
              <Volume2 className="size-7" />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">~{duration}s</span>
          </button>
        )}
      </div>
      {hint && (
        <div className="text-xs text-muted-foreground px-3 py-2 italic bg-background/40 border-t border-border">{hint}</div>
      )}
    </div>
  );
}
