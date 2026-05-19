import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { fetchNewsletter } from "@/lib/mailerlite.functions";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/newsletter/$id")({
  component: NewsletterDetailPage,
  head: ({ params }) => ({
    meta: [
      { title: `SlowBlues Letter — ${params.id}` },
      { name: "description", content: "A letter from the SlowBlues archive." },
    ],
  }),
});

function fmtDate(s: string | null) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function NewsletterDetailPage() {
  const { id } = Route.useParams();
  const fetchOne = useServerFn(fetchNewsletter);
  const { data, isLoading, error } = useQuery({
    queryKey: ["newsletter", id],
    queryFn: () => fetchOne({ data: { id } }),
    staleTime: 10 * 60 * 1000,
  });

  const item = data?.item;

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 py-14">
        <Link to="/newsletter" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold mb-8">
          <ArrowLeft className="size-4" /> Back to archive
        </Link>

        {isLoading && <p className="text-sm text-muted-foreground">Loading letter…</p>}
        {error && <p className="text-sm text-muted-foreground">Couldn't load this letter.</p>}
        {!isLoading && !error && !item && (
          <p className="text-sm text-muted-foreground">This letter isn't in the archive.</p>
        )}

        {item && (
          <>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold uppercase mb-3">
              <Calendar className="size-3" /> {fmtDate(item.sentAt)} · Monday Letter
            </div>
            <h1 className="font-display text-4xl md:text-5xl gold-gradient-text leading-tight mb-3">
              {item.subject}
            </h1>
            {item.previewText && (
              <p className="text-lg text-muted-foreground mb-8">{item.previewText}</p>
            )}

            {item.html ? (
              <div
                className="newsletter-body prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            ) : item.plain ? (
              <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans leading-relaxed">
                {item.plain}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                The full text isn't available — open this edition on MailerLite.
              </p>
            )}
          </>
        )}
      </article>
    </PageShell>
  );
}
