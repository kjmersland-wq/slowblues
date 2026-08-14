import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { IMG } from "@/data/images";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Archive, Calendar, Star } from "lucide-react";
import { listPublishedCycles, getCycleNumber, formatCycleRange, displayNameFromSlug } from "@/lib/quiz.server";
import { useI18n, tr } from "@/i18n";

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
  const { lang } = useI18n();
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
        eyebrow={tr(lang, { no: "Quiz-arkiv", en: "Quiz Archive", sv: "Quizarkiv", de: "Quiz-Archiv", pl: "Archiwum quizów" })}
        title={tr(lang, { no: "Hver 10-dagers runde", en: "Every 10-day cycle", sv: "Varje 10-dagarsomgång", de: "Jeder 10-Tage-Zyklus", pl: "Każdy 10-dniowy cykl" })}
        lead={tr(lang, {
          no: "Hver runde bevares med sine originale spørsmål, utvalgt artist og forklaringer — fullt spillbar på nytt.",
          en: "Each rotation is preserved with its original questions, featured artist and explanations — fully replayable.",
          sv: "Varje omgång bevaras med sina ursprungliga frågor, utvald artist och förklaringar — helt spelbar igen.",
          de: "Jede Runde bleibt mit ihren ursprünglichen Fragen, dem vorgestellten Künstler und den Erklärungen erhalten — vollständig wiederspielbar.",
          pl: "Każda runda jest zachowana wraz z oryginalnymi pytaniami, wyróżnionym artystą i wyjaśnieniami — w pełni dostępna do powtórki.",
        })}
        img={IMG.vinyl}
      />
      <section className="max-w-4xl mx-auto px-6 py-12">
        {isLoading && <div className="text-center text-muted-foreground py-12">{tr(lang, { no: "Laster …", en: "Loading…", sv: "Läser in …", de: "Wird geladen …", pl: "Wczytywanie…" })}</div>}
        {!isLoading && cycles.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            {tr(lang, { no: "Ingen publiserte runder ennå.", en: "No published cycles yet.", sv: "Inga publicerade omgångar än.", de: "Noch keine veröffentlichten Zyklen.", pl: "Brak jeszcze opublikowanych cykli." })}
          </div>
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
                  {isCurrent && (
                    <span className="text-[10px] tracking-widest text-gold/90 bg-gold/10 px-2 py-0.5 rounded">
                      {tr(lang, { no: "AKTUELL", en: "LIVE", sv: "AKTUELL", de: "AKTUELL", pl: "AKTUALNY" })}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-3">{formatCycleRange(c.cycleNumber)}</div>
                {c.featuredArtistSlug && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                    <Star className="size-3.5 text-gold" /> {tr(lang, { no: "Utvalgt", en: "Featured", sv: "Utvald", de: "Vorgestellt", pl: "Wyróżniony" })}: <span className="text-gold">{displayNameFromSlug(c.featuredArtistSlug)}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground inline-flex items-center justify-center gap-2 w-full">
          <Archive className="size-4 text-gold" /> {tr(lang, {
            no: "Eldre runder er fortsatt tilgjengelige via permalenke.",
            en: "Older cycles remain accessible via permalink.",
            sv: "Äldre omgångar är fortfarande tillgängliga via permalänk.",
            de: "Ältere Zyklen bleiben über einen Permalink zugänglich.",
            pl: "Starsze cykle pozostają dostępne poprzez link stały.",
          })}
        </div>
      </section>
    </PageShell>
  );
}
