import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { getArtistUpdates, type UpdateItem, type UpdateType } from "@/lib/updates.functions";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/updates")({
  component: UpdatesPage,
  loader: () => getArtistUpdates(),
  head: ({ loaderData }) => {
    const items = loaderData?.items ?? [];
    return {
      meta: [
        { title: "Artist Updates — Slow-Blues" },
        { name: "description", content: "New releases, tour dates, reviews and news from blues artists worldwide — updated automatically from our own data and trusted sources." },
        { property: "og:title", content: "Artist Updates — Slow-Blues" },
        { property: "og:description", content: "New releases, tour dates and news from blues artists worldwide." },
        { property: "og:url", content: "https://www.slow-blues.com/updates" },
      ],
      links: [{ rel: "canonical", href: "https://www.slow-blues.com/updates" }],
      scripts: items.length === 0 ? [] : [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Slow-Blues artist updates",
          url: "https://www.slow-blues.com/updates",
          numberOfItems: items.length,
          itemListElement: items.map((u: UpdateItem, i: number) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "CreativeWork",
              name: u.title,
              url: `https://www.slow-blues.com${u.href.startsWith("/") ? u.href : `/${u.href}`}`,
              datePublished: u.date,
            },
          })),
        }),
      }],
    };
  },
});

const TYPE_COLOR: Record<UpdateType, string> = {
  tour: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  release: "bg-gold/20 text-gold border-gold/40",
  news: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  review: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  video: "bg-red-500/20 text-red-300 border-red-500/30",
};

const DATE_LOCALE: Record<string, string> = { no: "nb-NO", en: "en-GB", sv: "sv-SE", de: "de-DE", pl: "pl-PL" };

function UpdatesPage() {
  const { t, lang } = useI18n();
  const { items } = Route.useLoaderData();
  const u = t.pages.updates;

  return (
    <PageShell>
      <PageHero eyebrow={u.eyebrow} title={u.title} lead={u.lead} img={IMG.neon} />
      <section className="max-w-4xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{u.empty}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item: UpdateItem) => (
              <article key={item.id} className="bg-card/60 border border-border rounded-lg p-5 hover:border-gold/40 transition">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-[10px] tracking-[0.2em] uppercase border rounded-full px-2 py-0.5 ${TYPE_COLOR[item.type]}`}>
                    {u.types[item.type]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString(DATE_LOCALE[lang] ?? "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {item.artistHref && (
                    <Link to={item.artistHref} className="font-display text-lg text-gold ml-auto hover:underline">
                      {item.artistName}
                    </Link>
                  )}
                </div>
                <p className="text-foreground/85">
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.title}
                    </a>
                  ) : (
                    <Link to={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  )}
                </p>
                {item.autoDetected && (
                  <p className="text-[11px] text-muted-foreground italic mt-2">{u.autoDetected}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {!item.external && item.artistHref && item.href !== item.artistHref && (
                    <Link to={item.artistHref} className="text-xs text-gold hover:underline">
                      {u.viewArtist}
                    </Link>
                  )}
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"
                    >
                      <ExternalLink className="size-3" aria-hidden="true" />
                      {item.type === "video" ? u.watchOnYoutube : item.sourceName === "Tickets" ? u.tickets : `${u.source}: ${item.sourceName ?? ""}`}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
