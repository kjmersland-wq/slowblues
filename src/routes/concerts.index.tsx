import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Calendar, MapPin } from "lucide-react";

const listConcerts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("concerts")
    .select("slug, title, artist_name, event_type, venue, city, country, event_date, cover_image")
    .eq("status", "published")
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(60);
  if (error) throw error;
  return { concerts: data ?? [] };
});

export const Route = createFileRoute("/concerts/")({
  loader: () => listConcerts(),
  head: ({ loaderData }) => {
    const concerts = (loaderData?.concerts ?? []) as Array<{
      slug: string; title: string; artist_name?: string | null; venue?: string | null;
      city?: string | null; country?: string | null; event_date?: string | null;
    }>;
    return {
      meta: [
        { title: "Concerts & Festivals — Live Blues | SlowBlues" },
        { name: "description", content: "Upcoming blues concerts, tours and festivals from clubs, theatres and festival fields around the world — curated by SlowBlues." },
        { property: "og:title", content: "Concerts & Festivals — Live Blues | SlowBlues" },
        { property: "og:description", content: "Upcoming blues concerts, tours and festivals — curated by SlowBlues." },
        { property: "og:url", content: "https://www.slowblues.no/concerts" },
      ],
      links: [{ rel: "canonical", href: "https://www.slowblues.no/concerts" }],
      scripts: concerts.length === 0 ? [] : [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Upcoming blues concerts and festivals",
          url: "https://www.slowblues.no/concerts",
          numberOfItems: concerts.length,
          itemListElement: concerts.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: c.title,
              url: `https://www.slowblues.no/concerts/${c.slug}`,
              ...(c.event_date ? { startDate: c.event_date } : {}),
              ...(c.venue || c.city
                ? {
                    location: {
                      "@type": "Place",
                      name: c.venue ?? c.city ?? "",
                      ...(c.city || c.country
                        ? { address: [c.city, c.country].filter(Boolean).join(", ") }
                        : {}),
                    },
                  }
                : {}),
              ...(c.artist_name
                ? { performer: { "@type": "MusicGroup", name: c.artist_name } }
                : {}),
            },
          })),
        }),
      }],
    };
  },
  errorComponent: ({ error }) => <div className="p-10 text-foreground/70">Failed to load concerts: {error.message}</div>,
  notFoundComponent: () => <div className="p-10">No concerts yet.</div>,
  component: ConcertsList,
});

function ConcertsList() {
  const { concerts } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl md:text-5xl mb-3 gold-gradient-text">Concerts & Festivals</h1>
        <p className="text-foreground/70 mb-10">Live blues from clubs, theatres and festival fields around the world.</p>

        {concerts.length === 0 ? (
          <p className="text-foreground/60">No concerts published yet. Check back soon.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-5">
            {concerts.map((c: any) => (
              <li key={c.slug}>
                <Link
                  to="/concerts/$slug"
                  params={{ slug: c.slug }}
                  className="block bg-card/60 border border-border rounded-lg p-5 hover:border-gold/60 transition"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-gold mb-2">
                    {c.event_type === "festival" ? "Festival" : c.event_type === "tour" ? "Tour" : "Concert"}
                  </div>
                  <h2 className="font-display text-xl mb-1">{c.title}</h2>
                  {c.artist_name && <p className="text-sm text-foreground/70 mb-3">{c.artist_name}</p>}
                  <div className="flex flex-wrap gap-4 text-xs text-foreground/60">
                    {c.event_date && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5 text-gold" />
                        {new Date(c.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                    {(c.venue || c.city) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-gold" />
                        {[c.venue, c.city, c.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
