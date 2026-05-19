import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Calendar, MapPin, Ticket, Play } from "lucide-react";

const getConcert = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("concerts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    return row;
  });

export const Route = createFileRoute("/concerts/$slug")({
  loader: async ({ params }) => {
    const concert = await getConcert({ data: { slug: params.slug } });
    if (!concert) throw notFound();
    return { concert };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.concert;
    if (!c) return { meta: [{ title: "Concert — SlowBlues" }] };
    const title = c.seo_title_en ?? `${c.title} — SlowBlues`;
    const desc =
      c.seo_description_en ??
      c.description_en?.slice(0, 160) ??
      `${c.title}${c.venue ? ` at ${c.venue}` : ""}${c.city ? `, ${c.city}` : ""}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(c.cover_image ? [{ property: "og:image", content: c.cover_image }] : []),
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-foreground/70">
      Failed to load concert: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-foreground/70">
      <p>Concert not found.</p>
      <Link to="/" className="text-gold underline">Back home</Link>
    </div>
  ),
  component: ConcertPage,
});

function ConcertPage() {
  const { concert: c } = Route.useLoaderData();
  const dateStr = c.event_date
    ? new Date(c.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-3 text-xs font-mono uppercase tracking-widest text-gold">
          {c.event_type === "festival" ? "Festival" : c.event_type === "tour" ? "Tour" : "Concert"}
        </div>
        <h1 className="font-display text-4xl md:text-5xl mb-4">{c.title}</h1>
        {c.artist_name && (
          <p className="text-lg text-foreground/80 mb-6">
            {c.artist_slug ? (
              <Link to="/artists/$slug" params={{ slug: c.artist_slug }} className="hover:text-gold underline-offset-4 hover:underline">
                {c.artist_name}
              </Link>
            ) : c.artist_name}
          </p>
        )}

        {c.cover_image && (
          <img src={c.cover_image} alt={c.title} className="w-full rounded-lg border border-border mb-8" loading="eager" />
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
          {dateStr && (
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="size-4 text-gold" />
              <span>{dateStr}{c.end_date ? ` – ${new Date(c.end_date).toLocaleDateString("en-GB")}` : ""}</span>
            </div>
          )}
          {(c.venue || c.city) && (
            <div className="flex items-center gap-2 text-foreground/80">
              <MapPin className="size-4 text-gold" />
              <span>{[c.venue, c.city, c.country].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>

        {c.description_en && (
          <div className="prose prose-invert max-w-none whitespace-pre-line text-foreground/85 leading-relaxed">
            {c.description_en}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {c.ticket_url && (
            <a href={c.ticket_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-background font-medium hover:opacity-90">
              <Ticket className="size-4" /> Tickets
            </a>
          )}
          {c.youtube_video_id && (
            <a href={`https://www.youtube.com/watch?v=${c.youtube_video_id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border hover:border-gold/60">
              <Play className="size-4" /> Watch on YouTube
            </a>
          )}
        </div>

        {c.youtube_video_id && (
          <div className="mt-10 aspect-video rounded-lg overflow-hidden border border-border">
            <iframe
              src={`https://www.youtube.com/embed/${c.youtube_video_id}`}
              title={c.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </article>
      <SiteFooter />
    </div>
  );
}
