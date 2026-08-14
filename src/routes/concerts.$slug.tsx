import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDB } from "@/integrations/d1/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Calendar, MapPin, Ticket, Play } from "lucide-react";
import { useI18n, tr } from "@/i18n";
import { artistDetailPath } from "@/lib/locale";

type Concert = {
  slug: string;
  title: string;
  artist_name: string | null;
  artist_slug: string | null;
  event_type: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  event_date: string | null;
  end_date: string | null;
  ticket_url: string | null;
  youtube_video_id: string | null;
  cover_image: string | null;
  description_en: string | null;
  seo_title_en: string | null;
  seo_description_en: string | null;
};

const getConcert = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const db = getDB();
    const row = await db
      .prepare("SELECT * FROM concerts WHERE slug = ? AND status = 'published'")
      .bind(data.slug)
      .first<Concert>();
    return row ?? null;
  });

export const Route = createFileRoute("/concerts/$slug")({
  loader: async ({ params }) => {
    const concert = await getConcert({ data: { slug: params.slug } });
    if (!concert) throw notFound();
    return { concert };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.concert;
    const canonical = `https://www.slow-blues.com/concerts/${params.slug}`;
    if (!c) return { meta: [{ title: "Concert — SlowBlues" }], links: [{ rel: "canonical", href: canonical }] };
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
        { property: "og:url", content: canonical },
        ...(c.cover_image ? [{ property: "og:image", content: c.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  errorComponent: ({ error }) => {
    if (typeof console !== "undefined") console.error("concert detail load failed", error);
    const { lang } = useI18n();
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground/70">
        {tr(lang, {
          no: "Denne konserten er midlertidig utilgjengelig — prøv igjen senere.",
          en: "This concert is temporarily unavailable — please try again later.",
          sv: "Den här konserten är tillfälligt otillgänglig — försök igen senare.",
          de: "Dieses Konzert ist vorübergehend nicht verfügbar — bitte versuchen Sie es später erneut.",
          pl: "Ten koncert jest tymczasowo niedostępny — spróbuj ponownie później.",
        })}
      </div>
    );
  },
  notFoundComponent: () => {
    const { lang } = useI18n();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-foreground/70">
        <p>{tr(lang, { no: "Fant ikke konserten.", en: "Concert not found.", sv: "Konserten hittades inte.", de: "Konzert nicht gefunden.", pl: "Nie znaleziono koncertu." })}</p>
        <Link to="/" className="text-gold underline">{tr(lang, { no: "Tilbake til forsiden", en: "Back home", sv: "Tillbaka till startsidan", de: "Zurück zur Startseite", pl: "Powrót do strony głównej" })}</Link>
      </div>
    );
  },
  component: ConcertPage,
});

const CONCERT_LOCALE_MAP: Record<string, string> = { no: "nb-NO", en: "en-GB", sv: "sv-SE", de: "de-DE", pl: "pl-PL" };

function ConcertPage() {
  const { concert: c } = Route.useLoaderData();
  const { lang } = useI18n();
  const locale = CONCERT_LOCALE_MAP[lang] ?? "en-GB";
  const dateStr = c.event_date
    ? new Date(c.event_date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-3 text-xs font-mono uppercase tracking-widest text-gold">
          {c.event_type === "festival"
            ? tr(lang, { no: "Festival", en: "Festival", sv: "Festival", de: "Festival", pl: "Festiwal" })
            : c.event_type === "tour"
              ? tr(lang, { no: "Turné", en: "Tour", sv: "Turné", de: "Tournee", pl: "Trasa koncertowa" })
              : tr(lang, { no: "Konsert", en: "Concert", sv: "Konsert", de: "Konzert", pl: "Koncert" })}
        </div>
        <h1 className="font-display text-4xl md:text-5xl mb-4">{c.title}</h1>
        {c.artist_name && (
          <p className="text-lg text-foreground/80 mb-6">
            {c.artist_slug ? (
              <Link to={artistDetailPath(lang, c.artist_slug) as any} className="hover:text-gold underline-offset-4 hover:underline">
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
              <span>{dateStr}{c.end_date ? ` – ${new Date(c.end_date).toLocaleDateString(locale)}` : ""}</span>
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
              <Ticket className="size-4" /> {tr(lang, { no: "Billetter", en: "Tickets", sv: "Biljetter", de: "Tickets", pl: "Bilety" })}
            </a>
          )}
          {c.youtube_video_id && (
            <a href={`https://www.youtube.com/watch?v=${c.youtube_video_id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border hover:border-gold/60">
              <Play className="size-4" /> {tr(lang, { no: "Se på YouTube", en: "Watch on YouTube", sv: "Se på YouTube", de: "Auf YouTube ansehen", pl: "Obejrzyj na YouTube" })}
            </a>
          )}
        </div>

        {c.youtube_video_id && (
          <div className="mt-10 aspect-video rounded-lg overflow-hidden border border-border">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${c.youtube_video_id}?rel=0`}
              title={c.title}
              className="w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
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
