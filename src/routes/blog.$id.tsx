import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import type { BlogArticle } from "@/data/blogArticles";
import { blogArticles, getBlogArticleById } from "@/data/blogArticles";
import { ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/$id")({
  loader: ({ params }) => {
    const article = getBlogArticleById(params.id);
    if (!article) throw notFound();
    return { article };
  },
  component: BlogArticlePage,
  head: ({ params, loaderData }) => {
    const a = loaderData?.article;
    const url = `https://www.slowblues.no/blog/${params.id}`;
    if (!a) return { meta: [{ title: "Article — SlowBlues" }] };
    // Norwegian as primary (site domain is .no); fall back to English.
    const primaryTitle = (a.titleNo ?? a.titleEn).slice(0, 48);
    const primaryExcerpt = (a.excerptNo ?? a.excerptEn).slice(0, 158);
    return {
      meta: [
        { title: `${primaryTitle} — SlowBlues` },
        { name: "description", content: primaryExcerpt },
        { name: "keywords", content: a.keywordsEn.join(", ") },
        { property: "og:title", content: primaryTitle },
        { property: "og:description", content: primaryExcerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "nb_NO" },
        { property: "og:locale:alternate", content: "en_US" },
        ...(a.titleDe ? [{ property: "og:locale:alternate", content: "de_DE" }] : []),
        { property: "article:published_time", content: a.publishedDate },
        { property: "article:modified_time", content: a.modifiedDate },
        { property: "article:author", content: a.author },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: primaryTitle,
            description: primaryExcerpt,
            inLanguage: "nb-NO",
            author: { "@type": "Person", name: a.author },
            datePublished: a.publishedDate,
            dateModified: a.modifiedDate,
            keywords: a.keywordsEn.join(", "),
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
});

function BlogArticlePage() {
  const { article } = Route.useLoaderData() as { article: BlogArticle };
  const { lang } = useI18n();
  const no = lang === "no" || lang === "sv";
  const de = lang === "de";

  const title = de && article.titleDe ? article.titleDe : no ? article.titleNo : article.titleEn;
  const excerpt = de && article.excerptDe ? article.excerptDe : no ? article.excerptNo : article.excerptEn;
  const cat = de && article.categoryDe ? article.categoryDe : no ? article.categoryNo : article.category;

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gold hover:underline mb-6"><ArrowLeft className="size-4" /> {tr(lang, { no: "Alle artikler", en: "All articles", sv: "Alla artiklar", de: "Alle Artikel" })}</Link>

        <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] text-gold uppercase mb-3">
          <span>{cat}</span>
          <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="size-3" /> {article.readingTimeMin} min</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl mb-4 leading-tight">{title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{excerpt}</p>
        <div className="text-xs text-muted-foreground border-b border-border pb-6 mb-8">
          {article.author} · {new Date(article.publishedDate).toLocaleDateString(lang === "no" ? "nb-NO" : lang === "sv" ? "sv-SE" : lang === "de" ? "de-DE" : "en-GB")}
        </div>

        <div className="prose prose-invert max-w-none">
          {article.sections.map((s, idx) => {
            const heading = de && s.headingDe ? s.headingDe : no ? s.headingNo : s.headingEn;
            const paragraphs = de && s.paragraphsDe ? s.paragraphsDe : no ? s.paragraphsNo : s.paragraphsEn;
            return (
              <section key={idx} className="mb-8">
                <h2 className="font-display text-2xl mb-4 mt-10 text-gold">{heading}</h2>
                {paragraphs.map((p, pi) => (
                  <p key={pi} className="text-base leading-relaxed mb-4 text-foreground/90">{p}</p>
                ))}
                {s.artistMentions && s.artistMentions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.artistMentions.map((slug) => (
                      <Link key={slug} to="/artists/$slug" params={{ slug }} className="text-xs px-3 py-1 rounded-full bg-card border border-border hover:border-gold/50 hover:text-gold transition">
                        {slug.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {article.relatedArtistIds && article.relatedArtistIds.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-3">{tr(lang, { no: "Relaterte artister", en: "Related artists", sv: "Relaterade artister", de: "Verwandte Künstler" })}</div>
            <div className="flex flex-wrap gap-2">
              {article.relatedArtistIds.map((slug) => (
                <Link key={slug} to="/artists/$slug" params={{ slug }} className="text-sm px-3 py-1.5 rounded-full bg-card border border-border hover:border-gold/50 hover:text-gold transition capitalize">
                  {slug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-3">{tr(lang, { no: "Flere artikler", en: "More articles", sv: "Fler artiklar", de: "Weitere Artikel" })}</div>
          <ul className="space-y-2">
            {blogArticles.filter((a) => a.id !== article.id).slice(0, 5).map((a) => (
              <li key={a.id}>
                <Link to="/blog/$id" params={{ id: a.id }} className="text-sm hover:text-gold transition">
                  → {no ? a.titleNo : a.titleEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
