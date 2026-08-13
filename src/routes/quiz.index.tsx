import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, RotateCcw, Trophy, ExternalLink, Calendar, Star, Archive, Volume2, Music } from "lucide-react";
import {
  getPublishedCycle,
  getCycleNumber,
  formatCycleRange,
  displayNameFromSlug,
  type QuizDifficulty,
  type QuizQuestionSnapshot,
} from "@/lib/quiz.server";
import { getLeaderboard, addToLeaderboard, getAllTimeLeaderboard, type LeaderboardEntry } from "@/data/quizQuestions";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/quiz/")({
  component: QuizPage,
  head: () => {
    const cycle = getCycleNumber();
    const key = `C-${String(cycle).padStart(3, "0")}`;
    return {
      meta: [
        { title: `Blues Quiz · ${key} — SlowBlues` },
        { name: "description", content: `New blues quiz every 10 days. Cycle ${key} (${formatCycleRange(cycle)}) — 10 curated questions, audio rounds and leaderboard.` },
        { property: "og:title", content: `Blues Quiz · ${key} — SlowBlues` },
        { property: "og:description", content: `Cycle ${key} — ${formatCycleRange(cycle)}. Test your blues knowledge with curated questions and audio rounds.` },
        { property: "og:image", content: IMG.vinyl },
      ],
    };
  },
});

const DIFFICULTIES: { id: QuizDifficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

function QuizPage() {
  const { lang } = useI18n();
  const localeStr = lang === "no" ? "nb-NO" : lang === "sv" ? "sv-SE" : lang === "de" ? "de-DE" : lang === "pl" ? "pl-PL" : "en";
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const fetchCycle = useServerFn(getPublishedCycle);
  const { data, isLoading } = useQuery({
    queryKey: ["quiz-cycle", "current"],
    queryFn: () => fetchCycle({ data: {} }),
    staleTime: 60 * 60 * 1000,
  });

  const cycle = data?.meta?.cycleNumber ?? getCycleNumber();
  const cycleKey = data?.meta?.cycleKey ?? `C-${String(cycle).padStart(3, "0")}`;
  const cycleRange = useMemo(() => formatCycleRange(cycle, localeStr), [cycle, localeStr]);
  const featuredSlug = data?.meta?.featuredArtistSlug ?? null;

  const questions: QuizQuestionSnapshot[] = data?.questions?.[difficulty] ?? [];
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [done, setDone] = useState(false);

  // Reset when difficulty or data changes
  useMemo(() => {
    setAnswers(Array(questions.length).fill(null));
    setDone(false);
    setSubmitted(false);
  }, [questions.length, difficulty]);

  const score = answers.reduce<number>((sum, a, i) => sum + (a === questions[i]?.correctIndex ? 1 : 0), 0);

  const submitScore = () => {
    if (!nickname.trim()) return;
    addToLeaderboard({
      nickname: nickname.trim().slice(0, 24),
      score,
      total: questions.length,
      date: new Date().toISOString(),
      monthKey: cycleKey,
    });
    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <PageShell>
        <PageHero eyebrow="Blues Quiz" title="…" lead="" img={IMG.vinyl} />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Loading…</div>
      </PageShell>
    );
  }

  if (!data?.meta || questions.length === 0) {
    return (
      <PageShell>
        <PageHero eyebrow="Blues Quiz" title="No quiz published yet" lead="" img={IMG.vinyl} />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">
          This cycle hasn't been published yet — check back soon.
        </div>
      </PageShell>
    );
  }

  if (done) {
    const board = getAllTimeLeaderboard();
    return (
      <PageShell>
        <PageHero
          eyebrow={tr(lang, { no: "Resultat", en: "Result", pl: "Wynik", sv: "Resultat", de: "Ergebnis" })}
          title={tr(lang, { no: "Hvor godt gikk det?", en: "How did you do?", pl: "Jak Ci poszło?", sv: "Hur gick det?", de: "Wie ist es gelaufen?" })}
          lead={tr(lang, { no: "Hvert svar viser riktig valg og forklaring.", en: "Every answer below shows the correct choice and explanation.", pl: "Każda odpowiedź poniżej przedstawia poprawny wybór i wyjaśnienie.", sv: "Varje svar visar rätt val och förklaring.", de: "Jede Antwort zeigt die richtige Wahl und Erklärung." })}
          img={IMG.vinyl}
        />
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-8 bg-gradient-to-br from-card to-card/30 border border-gold/40 rounded-xl p-8">
            <Trophy className="size-12 text-gold mx-auto mb-3" />
            <div className="font-display text-5xl gold-gradient-text mb-1">{score} / {questions.length}</div>
            <div className="text-muted-foreground mb-5">
              {score >= 8
                ? tr(lang, { no: "Bluesforsker.", en: "Blues scholar.", pl: "Znawca bluesa.", sv: "Bluesforskare.", de: "Blues-Kenner." })
                : score >= 5
                ? tr(lang, { no: "Solid bluesfan.", en: "Solid blues fan.", pl: "Prawdziwy fan bluesa.", sv: "Stadig bluesfan.", de: "Solider Blues-Fan." })
                : tr(lang, { no: "På tide å grave dypere.", en: "Time to dig deeper.", pl: "Czas zagłębić się w temat.", sv: "Dags att gräva djupare.", de: "Zeit, tiefer zu graben." })}
            </div>
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

          <div className="space-y-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.correctIndex;
              const opts = q.options[lang] ?? q.options.en;
              return (
                <div key={q.id} className="bg-card/60 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <Check className="size-5 text-gold mt-0.5" /> : <X className="size-5 text-destructive mt-0.5" />}
                    <div className="font-medium">{i + 1}. {q.question[lang] ?? q.question.en}</div>
                  </div>
                  <div className="text-sm text-muted-foreground ml-7 mb-2">
                    {tr(lang, { no: "Riktig svar", en: "Answer", pl: "Odpowiedź", sv: "Rätt svar", de: "Antwort" })}: <span className="text-gold">{opts[q.correctIndex]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground/90 ml-7 leading-relaxed">{q.explanation[lang] ?? q.explanation.en}</p>
                  {q.artistSlug && (
                    <Link to="/artists/$slug" params={{ slug: q.artistSlug }} className="ml-7 mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">
                      {tr(lang, { no: "Les mer om artisten", en: "Read more about the artist", pl: "Przeczytaj więcej o artyście", sv: "Läs mer om artisten", de: "Mehr über den Künstler" })} <ExternalLink className="size-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => { setAnswers(Array(questions.length).fill(null)); setDone(false); setSubmitted(false); }} className="mt-8 mx-auto flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            <RotateCcw className="size-4" /> {tr(lang, { no: "Prøv igjen", en: "Try again", pl: "Spróbuj ponownie", sv: "Försök igen", de: "Nochmal versuchen" })}
          </button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Blues Quiz"
        title={tr(lang, { no: "Hvor godt kan du bluesen?", en: "Think you know the blues?", pl: "Myślisz, że znasz bluesa?", sv: "Hur bra kan du bluesen?", de: "Wie gut kennst du den Blues?" })}
        lead={tr(lang, { no: "Ti spørsmål fra Deltaen til i dag. Velg vanskelighetsgrad.", en: "Ten questions from the Delta to today. Pick your difficulty.", pl: "Dziesięć pytań od Delty do dziś. Wybierz swój poziom trudności.", sv: "Tio frågor från Deltat till idag. Välj svårighetsgrad.", de: "Zehn Fragen vom Delta bis heute. Wähle den Schwierigkeitsgrad." })}
        img={IMG.vinyl}
      />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 rounded-xl border border-gold/30 bg-gradient-to-br from-card/70 to-card/30 p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-gold font-medium"><Calendar className="size-4" /> {cycleKey}</span>
            <span className="text-muted-foreground">{cycleRange}</span>
            <span className="text-xs text-muted-foreground/80">· {tr(lang, { no: "Nytt sett hver 10. dag", en: "New set every 10 days", pl: "Nowy zestaw co 10 dni", sv: "Nya frågor var 10:e dag", de: "Neue Fragen alle 10 Tage" })}</span>
            <Link to={"/quiz/archive" as any} className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
              <Archive className="size-3.5" /> {tr(lang, { no: "Arkiv", en: "Archive", pl: "Archiwum", sv: "Arkiv", de: "Archiv" })}
            </Link>
          </div>
          {featuredSlug && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Star className="size-4 text-gold" />
              <span className="text-muted-foreground">{tr(lang, { no: "Syklusens artist:", en: "Featured artist:", pl: "Polecany artysta:", sv: "Periodens artist:", de: "Künstler des Zyklus:" })}</span>
              <Link to="/artists/$slug" params={{ slug: featuredSlug }} className="text-gold hover:underline font-medium">{displayNameFromSlug(featuredSlug)}</Link>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {DIFFICULTIES.map((d) => (
            <button key={d.id} onClick={() => setDifficulty(d.id)} className={`px-4 py-1.5 rounded-full text-sm transition ${difficulty === d.id ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>{d.label}</button>
          ))}
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const opts = q.options[lang] ?? q.options.en;
            return (
              <div key={q.id} className="bg-card/60 border border-border rounded-xl p-5">
                <div className="font-display text-lg mb-3"><span className="text-gold mr-2">{i + 1}.</span>{q.question[lang] ?? q.question.en}</div>
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
                <div className="grid sm:grid-cols-2 gap-2">
                  {opts.map((c, ci) => (
                    <button
                      key={ci}
                      onClick={() => setAnswers((a) => a.map((v, j) => (j === i ? ci : v)))}
                      className={`text-left text-sm px-3 py-2 rounded-md border transition ${answers[i] === ci ? "bg-gold/15 border-gold text-foreground" : "bg-background/40 border-border hover:border-gold/50"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button
          disabled={answers.some((a) => a === null)}
          onClick={() => setDone(true)}
          className="mt-8 w-full sm:w-auto mx-auto block px-7 py-3 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {tr(lang, { no: "Vis resultatet", en: "Show my result", pl: "Pokaż mój wynik", sv: "Visa resultatet", de: "Ergebnis anzeigen" })}
        </button>
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
