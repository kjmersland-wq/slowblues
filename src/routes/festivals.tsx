import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { FESTIVALS } from "@/data/blues";
import { IMG } from "@/data/images";
import { ExternalLink, MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/festivals")({
  component: FestivalsPage,
  head: () => ({
    meta: [
      { title: "Blues Festivals 2026 — SlowBlues" },
      { name: "description", content: "The blues festivals that matter in 2026 — from Notodden, Mandal and Skånevik to Chicago, Memphis and Helena, Arkansas." },
      { property: "og:title", content: "Blues Festivals 2026 — SlowBlues" },
      { property: "og:description", content: "The blues festivals that matter in 2026 — Notodden, Memphis, Chicago, Cognac and more." },
      { property: "og:url", content: "https://www.slow-blues.com/festivals" },
      { property: "og:image", content: IMG.crowd },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/festivals" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": "https://www.slow-blues.com/festivals#list",
          name: "Blues Festivals 2026",
          url: "https://www.slow-blues.com/festivals",
          numberOfItems: FESTIVALS.length,
          itemListElement: FESTIVALS.map((f, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "MusicFestival",
              name: f.name,
              url: f.url,
              location: { "@type": "Place", name: `${f.city}, ${f.country.replace(/^\S+\s/, "")}` },
            },
          })),
        }),
      },
    ],
  }),
});

function FestivalsPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.festivals.eyebrow} title={t.pages.festivals.title} lead={t.pages.festivals.lead} img={IMG.crowd} />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-3">
          {FESTIVALS.map((f) => (
            <a key={f.name} href={f.url} target="_blank" rel="noopener" className="block group bg-card/60 border border-border rounded-lg p-5 hover:border-gold/60 transition">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-display text-xl">{f.name}</div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4 flex-wrap">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3.5 text-gold" /> {f.city}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3.5 text-gold" /> {f.month}</span>
                    <span>{f.country}</span>
                  </div>
                </div>
                <span className="text-gold text-sm inline-flex items-center gap-1">Website <ExternalLink className="size-3.5" /></span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
