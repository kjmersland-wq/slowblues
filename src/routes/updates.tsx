import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";

export const Route = createFileRoute("/updates")({
  component: UpdatesPage,
  head: () => ({ meta: [
    { title: "Artist Updates — SlowBlues" },
    { name: "description", content: "New releases, tour dates and news from blues artists worldwide." },
    { property: "og:title", content: "Artist Updates — SlowBlues" },
  ]}),
});

const UPDATES = [
  { date: "2026-05-12", artist: "Buddy Guy", type: "Tour", text: "Farewell tour final European dates announced — Oslo Spektrum 18 September." },
  { date: "2026-05-08", artist: "Joanne Shaw Taylor", type: "Release", text: "New album «Heavy Soul» out 30 May on KTBA Records." },
  { date: "2026-05-02", artist: "Larkin Poe", type: "Tour", text: "Scandinavia tour confirmed June 2026 — dates in Oslo, Stockholm, Copenhagen." },
  { date: "2026-04-28", artist: "Samantha Fish & Jesse Dayton", type: "Release", text: "Joint album confirmed for autumn 2026." },
  { date: "2026-04-21", artist: "Walter Trout", type: "Tour", text: "European tour April–May 2026 — Bergen, Trondheim and Oslo on the list." },
  { date: "2026-04-15", artist: "Christone «Kingfish» Ingram", type: "News", text: "Awarded Best Contemporary Blues Album at the Blues Music Awards." },
  { date: "2026-04-04", artist: "Gary Clark Jr.", type: "Release", text: "Surprise EP «Texas Rain» released digitally." },
  { date: "2026-03-27", artist: "Louise Hoffsten", type: "Tour", text: "40-year jubilee tour through Scandinavia — adds extra Oslo night." },
];

const TYPE_COLOR: Record<string, string> = {
  Tour: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Release: "bg-gold/20 text-gold border-gold/40",
  News: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

function UpdatesPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.updates.eyebrow} title={t.pages.updates.title} lead={t.pages.updates.lead} img={IMG.neon} />
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-3">
          {UPDATES.map((u, i) => (
            <article key={i} className="bg-card/60 border border-border rounded-lg p-5 hover:border-gold/40 transition">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`text-[10px] tracking-[0.2em] uppercase border rounded-full px-2 py-0.5 ${TYPE_COLOR[u.type]}`}>{u.type}</span>
                <span className="text-xs text-muted-foreground">{u.date}</span>
                <span className="font-display text-lg text-gold ml-auto">{u.artist}</span>
              </div>
              <p className="text-foreground/85">{u.text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
