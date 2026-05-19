import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { useState } from "react";
import { Calendar, Star, ExternalLink, ArrowLeft } from "lucide-react";
import {
  getCycleNumber,
  getCycleKey,
  formatCycleRange,
  getFeaturedArtist,
  getCycleQuestions,
  type QuizDifficulty,
} from "@/data/quizQuestions";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/quiz/cycle/$cycle")({
  component: CyclePage,
  loader: ({ params }) => {
    const match = /^C-(\d{1,4})$/.exec(params.cycle);
    if (!match) throw notFound();
    const num = parseInt(match[1], 10);
    if (!num || num < 1 || num > getCycleNumber()) throw notFound();
    return { cycleNumber: num };
  },
  head: ({ loaderData }) => {
    const n = loaderData?.cycleNumber ?? 1;
    const key = getCycleKey(n);
    const range = formatCycleRange(n);
    const featured = getFeaturedArtist(n);
    return {
      meta: [
        { title: `Blues Quiz ${key} (${range})${featured ? ` · ${featured.name}` : ""} — SlowBlues` },
        { name: "description", content: `Blues quiz cycle ${key} (${range}). 30 curated questions across easy, medium and hard${featured ? `, featuring ${featured.name}` : ""}.` },
        { property: "og:title", content: `Blues Quiz ${key} — SlowBlues` },
        { property: "og:image", content: IMG.vinyl },
        { name: "robots", content: "index,follow" },
      ],
    };
  },
});

const DIFFICULTIES: { id: QuizDifficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

function CyclePage() {
  const { cycleNumber } = Route.useLoaderData();
  const { lang } = useI18n();
  const no = lang === "no" || lang === "sv";
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const key = getCycleKey(cycleNumber);
  const range = formatCycleRange(cycleNumber, no ? "nb-NO" : "en");
  const featured = getFeaturedArtist(cycleNumber);
  const questions = getCycleQuestions(difficulty, cycleNumber);
  const isCurrent = cycleNumber === getCycleNumber();

  return (
    <PageShell>
      <PageHero
        eyebrow={`Cycle ${key}`}
        title={`Blues Quiz ${key}`}
        lead={`${range} · ${no ? "Bla gjennom syklusens kuraterte spørsmål." : "Browse this cycle's curated questions."}`}
        img={IMG.vinyl}
      />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link to={"/quiz/archive" as any} className="inline-flex items-center gap-1 text-muted-foreground hover:text-gold">
            <ArrowLeft className="size-3.5" /> {no ? "Tilbake til arkivet" : "Back to archive"}
          </Link>
          <span className="inline-flex items-center gap-1.5 text-gold"><Calendar className="size-4" /> {range}</span>
          {isCurrent && <span className="text-[10px] tracking-widest text-gold/90 bg-gold/10 px-2 py-0.5 rounded">LIVE</span>}
          {!isCurrent && (
            <Link to="/quiz" className="ml-auto text-xs text-muted-foreground hover:text-gold">{no ? "Spill aktuell syklus →" : "Play current cycle →"}</Link>
          )}
        </div>

        {featured && (
          <div className="mb-6 rounded-xl border border-gold/30 bg-gradient-to-br from-card/70 to-card/30 p-5">
            <div className="text-xs tracking-[0.2em] text-gold mb-1 inline-flex items-center gap-1.5"><Star className="size-3.5" /> {no ? "SYKLUSENS ARTIST" : "FEATURED ARTIST"}</div>
            <Link to="/artists/$slug" params={{ slug: featured.slug }} className="font-display text-2xl gold-gradient-text hover:underline">{featured.name}</Link>
          </div>
        )}

        <div className="flex justify-center gap-2 mb-8">
          {DIFFICULTIES.map((d) => (
            <button key={d.id} onClick={() => setDifficulty(d.id)} className={`px-4 py-1.5 rounded-full text-sm transition ${difficulty === d.id ? "bg-gold text-primary-foreground" : "bg-card border border-border hover:border-gold/50"}`}>{d.label}</button>
          ))}
        </div>

        <ol className="space-y-4">
          {questions.map((q, i) => {
            const opts = no ? q.optionsNo : q.options;
            return (
              <li key={q.id} className="bg-card/60 border border-border rounded-xl p-5">
                <div className="font-display text-lg mb-2"><span className="text-gold mr-2">{i + 1}.</span>{no ? q.questionNo : q.question}</div>
                <div className="text-sm text-muted-foreground mb-2">{no ? "Svar" : "Answer"}: <span className="text-gold">{opts[q.correctIndex]}</span></div>
                <p className="text-sm text-muted-foreground/90 leading-relaxed">{no ? q.explanationNo : q.explanation}</p>
                {q.artistLink && (
                  <a href={q.artistLink} className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">{no ? "Les mer" : "Read more"} <ExternalLink className="size-3" /></a>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </PageShell>
  );
}
