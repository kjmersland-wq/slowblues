import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { IMG } from "@/data/images";
import { blogArticles } from "@/data/blogArticles";
import { ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blues Blog — SlowBlues" },
      { name: "description", content: "Anmeldelser, intervjuer, dypdykk og turnérapporter fra bluesens verden." },
      { property: "og:title", content: "Blues Blog — SlowBlues" },
      { property: "og:image", content: IMG.vinyl },
    ],
  }),
});

function BlogPage() {
  const { t, lang } = useI18n();
  const no = lang === "no" || lang === "sv";
  const de = lang === "de";

  return (
    <PageShell>
      <PageHero eyebrow={t.pages.blog.eyebrow} title={t.pages.blog.title} lead={t.pages.blog.lead} img={IMG.vinyl} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogArticles.map((p) => {
            const title = de && p.titleDe ? p.titleDe : no ? p.titleNo : p.titleEn;
            const excerpt = de && p.excerptDe ? p.excerptDe : no ? p.excerptNo : p.excerptEn;
            const cat = de && p.categoryDe ? p.categoryDe : no ? p.categoryNo : p.category;
            return (
              <Link
                key={p.id}
                to="/blog/$id"
                params={{ id: p.id }}
                className="bg-card/60 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition group block"
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                    <span>{cat}</span>
                    <span className="text-muted-foreground inline-flex items-center gap-1"><Clock className="size-3" /> {p.readingTimeMin} min</span>
                  </div>
                  <h2 className="font-display text-xl mb-2 leading-tight">{title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{excerpt}</p>
                  <div className="mt-4 text-xs text-muted-foreground">{p.author} · {new Date(p.publishedDate).toLocaleDateString(lang === "no" ? "nb-NO" : lang === "sv" ? "sv-SE" : lang === "de" ? "de-DE" : "en-GB")}</div>
                  <div className="mt-3 text-sm text-gold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t.pages.blog.readMore} <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
