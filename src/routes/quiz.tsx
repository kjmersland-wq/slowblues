import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { QUIZ } from "@/data/blues";
import { IMG } from "@/data/images";
import { useState } from "react";
import { Check, X, RotateCcw, Trophy } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({ meta: [
    { title: "Blues Quiz — SlowBlues" },
    { name: "description", content: "Test your blues knowledge — 10 questions, no cheating." },
    { property: "og:title", content: "Blues Quiz — SlowBlues" },
    { property: "og:image", content: IMG.vinyl },
  ]}),
});

function QuizPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null));
  const [done, setDone] = useState(false);

  const score = answers.reduce((s: number, a, i) => s + (a === QUIZ[i].answer ? 1 : 0), 0);

  if (done) {
    return (
      <PageShell>
        <PageHero eyebrow="Result" title="How did you do?" lead="Every answer below shows the correct choice." img={IMG.vinyl} />
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-10 bg-gradient-to-br from-card to-card/30 border border-gold/40 rounded-xl p-8">
            <Trophy className="size-12 text-gold mx-auto mb-3" />
            <div className="font-display text-5xl gold-gradient-text mb-1">{score} / {QUIZ.length}</div>
            <div className="text-muted-foreground">{score >= 8 ? "Blues scholar." : score >= 5 ? "Solid blues fan." : "Time to dig deeper."}</div>
          </div>
          <div className="space-y-3">
            {QUIZ.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div key={i} className="bg-card/60 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <Check className="size-5 text-gold mt-0.5" /> : <X className="size-5 text-destructive mt-0.5" />}
                    <div className="font-medium">{i + 1}. {q.q}</div>
                  </div>
                  <div className="text-sm text-muted-foreground ml-7">Answer: <span className="text-gold">{q.choices[q.answer]}</span></div>
                </div>
              );
            })}
          </div>
          <button onClick={() => { setAnswers(Array(QUIZ.length).fill(null)); setDone(false); }} className="mt-8 mx-auto flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            <RotateCcw className="size-4" /> Try again
          </button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero eyebrow="Blues Quiz" title="Think you know the blues?" lead="Ten questions. From the Delta to today. No skipping." img={IMG.vinyl} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {QUIZ.map((q, i) => (
            <div key={i} className="bg-card/60 border border-border rounded-xl p-5">
              <div className="font-display text-lg mb-3"><span className="text-gold mr-2">{i + 1}.</span>{q.q}</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.choices.map((c, ci) => (
                  <button
                    key={ci}
                    onClick={() => setAnswers((a) => a.map((v, j) => j === i ? ci : v))}
                    className={`text-left text-sm px-3 py-2 rounded-md border transition ${answers[i] === ci ? "bg-gold/15 border-gold text-foreground" : "bg-background/40 border-border hover:border-gold/50"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          disabled={answers.some((a) => a === null)}
          onClick={() => setDone(true)}
          className="mt-8 w-full sm:w-auto mx-auto block px-7 py-3 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Show my result
        </button>
      </section>
    </PageShell>
  );
}
