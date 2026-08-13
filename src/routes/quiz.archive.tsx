import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Archive, Calendar, Star } from "lucide-react";
import { listPublishedCycles, getCycleNumber, formatCycleRange, displayNameFromSlug } from "@/lib/quiz.server";

export const Route = createFileRoute("/quiz/archive")({
  component: QuizArchivePage,
  head: () => ({
    meta: [
      { title: "Blues Quiz Archive — SlowBlues" },
      { name: "description", content: "Browse every 10-day blues quiz cycle. Each cycle preserves its featured artist, questions and leaderboard for replay." },
      { property: "og:title", content: "Blues Quiz Archive — SlowBlues" },
      { property: "og:description", content: "Every quiz cycle archived. Replay previous rotations with original questions and explanations." },
      { property: "og:image", content: IMG.vinyl },
    ],
  }),
});

function QuizArchivePage() {
  const current = getCycleNumber();
  const fetchCycles = useServerFn(listPublishedCycles);
  const { data, isLoading } = useQuery({
    queryKey: ["quiz-cycles", "archive"],
    queryFn: () => fetchCycles({ data: { limit: 24 } }),
    staleTime: 10 * 60 * 1000,
  });

  const cycles = data ?? [];

  return (
    <PageShell>
      <PageHero
        eyebrow="Quiz Archive"
        title="Every 10-day cycle"
        lead="Each rotation is preserved with its original questions, featured artist and explanations — fully replayable."
        img={IMG.vinyl}
      />
      <section className="max-w-4xl mx-auto px-6 py-12">
        {isLoading && <div className="text-center text-muted-foreground py-12">Loading…</div>}
        {!isLoading && cycles.length === 0 && (
          <div className="text-center text-muted-foreground py-12">No published cycles yet.</div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {cycles.map((c) => {
            const isCurrent = c.cycleNumber === current;
            return (
              <Link
                key={c.cycleNumber}
                to="/quiz/cycle/$cycle"
                params={{ cycle: c.cycleKey }}
                className="block rounded-xl border border-border bg-card/50 p-5 hover:border-gold/60 hover:bg-card/80 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 font-display text-lg text-gold">
                    <Calendar className="size-4" /> {c.cycleKey}
                  </span>
                  {isCurrent && <span className="text-[10px] tracking-widest text-gold/90 bg-gold/10 px-2 py-0.5 rounded">LIVE</span>}
                </div>
                <div className="text-sm text-muted-foreground mb-3">{formatCycleRange(c.cycleNumber)}</div>
                {c.featuredArtistSlug && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                    <Star className="size-3.5 text-gold" /> Featured: <span className="text-gold">{displayNameFromSlug(c.featuredArtistSlug)}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground inline-flex items-center justify-center gap-2 w-full">
          <Archive className="size-4 text-gold" /> Older cycles remain accessible via permalink.
        </div>
      </section>
    </PageShell>
  );
}
