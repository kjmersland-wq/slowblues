import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { MessageSquare } from "lucide-react";

export function LegalPage({
  eyebrow,
  title,
  lead,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} />
      <article className="max-w-3xl mx-auto px-6 py-12">
        {updated && (
          <p className="text-xs uppercase tracking-[0.25em] text-gold/80 mb-6">Sist oppdatert: {updated}</p>
        )}
        <div className="space-y-8 text-foreground/85 leading-relaxed">{children}</div>

        <aside className="mt-14 border-t border-border pt-8 text-sm">
          <p className="text-muted-foreground mb-3">
            Utgiver: <span className="text-foreground/90">KM TECH LABS — Kjell Mersland</span> · Org.nr. 934 044 029 · Ansvarlig redaktør: Kjell Mersland
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground transition text-xs font-medium tracking-wide"
          >
            <MessageSquare className="size-3.5" aria-hidden="true" />
            Spørsmål? Bruk kontaktskjemaet
          </Link>
        </aside>
      </article>
    </PageShell>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-gold mb-3">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
