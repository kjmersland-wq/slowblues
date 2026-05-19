import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n } from "@/i18n";
import { BLOG_POSTS } from "@/data/blues";
import { IMG } from "@/data/images";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({ meta: [
    { title: "Blues Blog — SlowBlues" },
    { name: "description", content: "Reviews, interviews, deep dives and tour reports." },
    { property: "og:title", content: "Blues Blog — SlowBlues" },
    { property: "og:image", content: IMG.vinyl },
  ]}),
});

function BlogPage() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.blog.eyebrow} title={t.pages.blog.title} lead={t.pages.blog.lead} img={IMG.vinyl} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((p) => (
            <article key={p.slug} className="bg-card/60 border border-border rounded-xl overflow-hidden hover:border-gold/50 transition group">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-5">
                <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{p.date}</div>
                <h2 className="font-display text-xl mb-2 leading-tight">{p.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                <div className="mt-4 text-sm text-gold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t.pages.blog.readMore} <ArrowRight className="size-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
