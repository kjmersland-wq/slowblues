import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageShell";
import { SafeImage } from "@/components/SafeImage";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { bluesOrganisations } from "@/data/bluesOrganisations";
import { ExternalLink, Landmark } from "lucide-react";

// Paragraphs use lightweight markdown-style links — [label](url) — so every
// mentioned organisation/publication with a verified URL is actually
// clickable. Internal targets start with "/" and use the router Link;
// everything else opens in a new tab.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderWithLinks(text: string) {
  const parts: (string | { label: string; url: string })[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    if (m.index! > last) parts.push(text.slice(last, m.index));
    parts.push({ label: m[1], url: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((part, i) => {
    if (typeof part === "string") return <Fragment key={i}>{part}</Fragment>;
    if (part.url.startsWith("/")) {
      return (
        <Link key={i} to={part.url} className="text-gold hover:underline">
          {part.label}
        </Link>
      );
    }
    return (
      <a key={i} href={part.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
        {part.label}
      </a>
    );
  });
}

const PARAGRAPHS_BY_LANG: Record<string, "paragraphs" | "paragraphsNo" | "paragraphsSv" | "paragraphsDe" | "paragraphsPl"> = {
  en: "paragraphs",
  no: "paragraphsNo",
  sv: "paragraphsSv",
  de: "paragraphsDe",
  pl: "paragraphsPl",
};

export function BluesOrganisationsView() {
  const { t, lang } = useI18n();
  const p = t.pages.bluesOrganisations;
  const key = PARAGRAPHS_BY_LANG[lang] ?? "paragraphs";

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} img={IMG.crowd} />

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-20">
          {bluesOrganisations.map((org) => (
            <article key={org.id} id={org.id} className="scroll-mt-24">
              <header className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-gold mb-1">{org.country}</div>
                  <h2 className="font-display text-3xl">{org.name}</h2>
                </div>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline shrink-0"
                >
                  {p.visitSite}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </header>

              {org.img ? (
                <div className="aspect-[16/9] rounded-lg overflow-hidden border border-border mb-6">
                  <SafeImage src={org.img} alt={org.name} loading="lazy" className="size-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[16/5] rounded-lg border border-border mb-6 flex items-center justify-center bg-card/40">
                  <div className="flex items-center gap-2 text-muted-foreground/70">
                    <Landmark className="size-5" aria-hidden="true" />
                    <span className="font-display text-lg">{org.name}</span>
                  </div>
                </div>
              )}
              {org.imgCredit && <p className="text-[11px] text-muted-foreground -mt-4 mb-6">{org.imgCredit}</p>}

              <div className="space-y-4 text-foreground/85 leading-relaxed">
                {org[key].map((para, i) => (
                  <p key={i}>{renderWithLinks(para)}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-border">
          <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">{p.sourcesHeading}</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {bluesOrganisations.flatMap((org) => org.sourceLinks).map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold hover:underline">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
