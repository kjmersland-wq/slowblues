import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { useMemo, useState } from "react";
import { Check, X, RotateCcw, Trophy, ExternalLink, Calendar, Star, Archive, Volume2, Music } from "lucide-react";
import {
  getWeeklyQuestions,
  getCurrentWeekKey,
  addToLeaderboard,
  getAllTimeLeaderboard,
  getCycleNumber,
  formatCycleRange,
  getFeaturedArtist,
  type QuizDifficulty,
  type QuizQuestion,
} from "@/data/quizQuestions";
import { useI18n } from "@/i18n";

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
  const no = lang === "no" || lang === "sv";
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const cycle = useMemo(() => getCycleNumber(), []);
  const cycleKey = useMemo(() => getCurrentWeekKey(), []);
  const cycleRange = useMemo(() => formatCycleRange(cycle, no ? "nb-NO" : "en"), [cycle, no]);
  const featured = useMemo(() => getFeaturedArtist(cycle), [cycle]);

  const questions = useMemo<QuizQuestion[]>(() => getWeeklyQuestions(difficulty), [difficulty]);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [done, setDone] = useState(false);

  // Reset when difficulty changes
  useMemo(() => {
    setAnswers(Array(questions.length).fill(null));
    setDone(false);
    setSubmitted(false);
  }, [questions.length, difficulty]);

  const score = answers.reduce<number>((s, a, i) => s + (a === questions[i]?.correctIndex ? 1 : 0), 0);

  const submitScore = () => {
    if (!nickname.trim()) return;
    addToLeaderboard({
      nickname: nickname.trim().slice(0, 24),
      score,
      total: questions.length,
      date: new Date().toISOString(),
      monthKey: getCurrentWeekKey(),
    });
    setSubmitted(true);
  };

  if (done) {
    const board = getAllTimeLeaderboard();
    return (
      <PageShell>
        <PageHero eyebrow={no ? "Resultat" : "Result"} title={no ? "Hvor godt gikk det?" : "How did you do?"} lead={no ? "Hvert svar viser riktig valg og forklaring." : "Every answer below shows the correct choice and explanation."} img={IMG.vinyl} />
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-8 bg-gradient-to-br from-card to-card/30 border border-gold/40 rounded-xl p-8">
            <Trophy className="size-12 text-gold mx-auto mb-3" />
            <div className="font-display text-5xl gold-gradient-text mb-1">{score} / {questions.length}</div>
            <div className="text-muted-foreground mb-5">
              {score >= 8 ? (no ? "Bluesforsker." : "Blues scholar.") : score >= 5 ? (no ? "Solid bluesfan." : "Solid blues fan.") : (no ? "På tide å grave dypere." : "Time to dig deeper.")}
            </div>
            {!submitted ? (
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={no ? "Kallenavn for leaderboard" : "Nickname for leaderboard"} aria-label={no ? "Kallenavn for leaderboard" : "Nickname for leaderboard"} className="flex-1 px-3 py-2 rounded-md bg-background border border-border text-sm" maxLength={24} />
                <button onClick={submitScore} disabled={!nickname.trim()} className="px-4 py-2 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-40">{no ? "Send inn" : "Submit"}</button>
              </div>
            ) : (
              <div className="text-sm text-gold">{no ? "Score lagret!" : "Score saved!"}</div>
            )}
          </div>

          {board.length > 0 && (
            <div className="bg-card/40 border border-border rounded-lg p-5 mb-8">
              <div className="font-display text-lg mb-3 inline-flex items-center gap-2"><Trophy className="size-4 text-gold" /> {no ? "Leaderboard (topp 10)" : "Leaderboard (top 10)"}</div>
              <ol className="text-sm space-y-1.5">
                {board.map((e, i) => (
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
              const opts = no ? q.optionsNo : q.options;
              return (
                <div key={q.id} className="bg-card/60 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <Check className="size-5 text-gold mt-0.5" /> : <X className="size-5 text-destructive mt-0.5" />}
                    <div className="font-medium">{i + 1}. {no ? q.questionNo : q.question}</div>
                  </div>
                  <div className="text-sm text-muted-foreground ml-7 mb-2">{no ? "Riktig svar" : "Answer"}: <span className="text-gold">{opts[q.correctIndex]}</span></div>
                  <p className="text-sm text-muted-foreground/90 ml-7 leading-relaxed">{no ? q.explanationNo : q.explanation}</p>
                  {q.artistLink && (
                    <a href={q.artistLink} className="ml-7 mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">{no ? "Les mer om artisten" : "Read more about the artist"} <ExternalLink className="size-3" /></a>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => { setAnswers(Array(questions.length).fill(null)); setDone(false); setSubmitted(false); }} className="mt-8 mx-auto flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            <RotateCcw className="size-4" /> {no ? "Prøv igjen" : "Try again"}
          </button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero eyebrow="Blues Quiz" title={no ? "Hvor godt kan du bluesen?" : "Think you know the blues?"} lead={no ? "Ti spørsmål fra Deltaen til i dag. Velg vanskelighetsgrad." : "Ten questions from the Delta to today. Pick your difficulty."} img={IMG.vinyl} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 rounded-xl border border-gold/30 bg-gradient-to-br from-card/70 to-card/30 p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-gold font-medium"><Calendar className="size-4" /> {cycleKey}</span>
            <span className="text-muted-foreground">{cycleRange}</span>
            <span className="text-xs text-muted-foreground/80">· {no ? "Nytt sett hver 10. dag" : "New set every 10 days"}</span>
            <Link to={"/quiz/archive" as any} className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"><Archive className="size-3.5" /> {no ? "Arkiv" : "Archive"}</Link>
          </div>
          {featured && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Star className="size-4 text-gold" />
              <span className="text-muted-foreground">{no ? "Syklusens artist:" : "Featured artist:"}</span>
              <Link to="/artists/$slug" params={{ slug: featured.slug }} className="text-gold hover:underline font-medium">{featured.name}</Link>
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
            const opts = no ? q.optionsNo : q.options;
            return (
              <div key={q.id} className="bg-card/60 border border-border rounded-xl p-5">
                <div className="font-display text-lg mb-3"><span className="text-gold mr-2">{i + 1}.</span>{no ? q.questionNo : q.question}</div>
                {q.type === "audio-guess" && q.youtubeVideoId && (
                  <BlindAudioClip
                    videoId={q.youtubeVideoId}
                    start={q.audioStart ?? 0}
                    end={q.audioEnd ?? 30}
                    hint={no ? q.audioHintNo : q.audioHint}
                    label={no ? "Spill av lydklipp" : "Play audio clip"}
                    playingLabel={no ? "Spiller … lytt nøye" : "Playing … listen carefully"}
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
          {no ? "Vis resultatet" : "Show my result"}
        </button>
      </section>
    </PageShell>
  );
}
