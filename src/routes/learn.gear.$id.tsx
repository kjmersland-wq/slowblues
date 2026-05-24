import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { FOUNDERS } from "@/data/gearFounders";

export const Route = createFileRoute("/learn/gear/$id")({
  loader: ({ params }) => {
    const f = FOUNDERS[params.id];
    if (!f) throw notFound();
    return { founder: f };
  },
  head: ({ loaderData }) => {
    const f = loaderData?.founder;
    const title = f ? `${f.name} — ${f.title.en} | SlowBlues` : "Founder | SlowBlues";
    const desc = f ? f.lede.en : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(f?.image ? [{ property: "og:image", content: f.image }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-gold mb-4">404</h1>
        <Link to="/learn/gear" className="text-gold hover:underline">← Back to gear</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">{String(error)}</div>
    </PageShell>
  ),
  component: FounderPage,
});

function FounderPage() {
  const { founder } = Route.useLoaderData();
  const { lang } = useI18n();
  const f = founder;

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-5 py-12">
        <Link
          to="/learn/gear"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition mb-8"
        >
          <ArrowLeft className="size-4" />
          {tr(lang, { no: "Tilbake til verktøyet", en: "Back to the tools", sv: "Tillbaka till verktygen", de: "Zurück zu den Werkzeugen" })}
        </Link>

        <header className="flex flex-col sm:flex-row gap-6 items-start border-b border-border pb-8">
          {f.image ? (
            <a href={f.imageCreditUrl || "#"} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <img
                src={f.image}
                alt={f.name}
                loading="eager"
                className="size-32 sm:size-40 rounded-full object-cover border-2 border-gold/40 shadow-xl"
              />
            </a>
          ) : (
            <div className="size-32 sm:size-40 rounded-full border-2 border-gold/30 bg-gradient-to-br from-[oklch(0.32_0.08_25)] to-[oklch(0.18_0.04_25)] flex items-center justify-center text-gold font-display text-4xl shrink-0">
              {f.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
            </div>
          )}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-2">
              {tr(lang, { no: "Grunnlegger", en: "Founder", sv: "Grundare", de: "Gründer" })}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-gold leading-tight">{f.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {f.years}
              {f.birthplace ? ` · ${f.birthplace}` : ""}
            </p>
            <p className="font-display text-xl sm:text-2xl text-foreground/90 mt-4 italic">{tr(lang, f.title)}</p>
          </div>
        </header>

        <p className="mt-8 text-lg leading-relaxed text-foreground/90 italic font-serif">{tr(lang, f.lede)}</p>

        <section className="mt-8 space-y-5">
          {(f.bio[lang] ?? f.bio.en).map((p, i) => (
            <p key={i} className="text-foreground/85 leading-relaxed text-[15px] sm:text-base">{p}</p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">
            {tr(lang, { no: "Anekdoter & hendelser", en: "Anecdotes & moments", sv: "Anekdoter & händelser", de: "Anekdoten & Momente" })}
          </h2>
          <ul className="space-y-4">
            {(f.anecdotes[lang] ?? f.anecdotes.en).map((a, i) => (
              <li key={i} className="border-l-2 border-gold/50 pl-4 text-foreground/85 leading-relaxed">{a}</li>
            ))}
          </ul>
        </section>

        {f.links.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-gold mb-4">
              {tr(lang, { no: "Lenker", en: "Links", sv: "Länkar", de: "Links" })}
            </h2>
            <ul className="space-y-2">
              {f.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold hover:underline"
                  >
                    {l.label} <ExternalLink className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {f.imageCredit && (
          <p className="mt-12 text-[11px] text-muted-foreground/70">
            {tr(lang, { no: "Foto", en: "Photo", sv: "Foto", de: "Foto" })}: {f.imageCreditUrl ? (
              <a href={f.imageCreditUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">{f.imageCredit}</a>
            ) : f.imageCredit}
          </p>
        )}

        <div className="mt-16 border-t border-border pt-8 flex justify-between text-sm">
          <Link to="/learn/gear" className="text-muted-foreground hover:text-gold transition">
            ← {tr(lang, { no: "Alle verktøy", en: "All tools", sv: "Alla verktyg", de: "Alle Werkzeuge" })}
          </Link>
          <Link to="/contact" className="text-gold hover:underline">
            {tr(lang, { no: "Send oss noe vi mangler", en: "Send us something we're missing", sv: "Skicka oss något vi saknar", de: "Schick uns, was fehlt" })}
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
