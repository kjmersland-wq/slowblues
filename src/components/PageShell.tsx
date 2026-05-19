import { ReactNode } from "react";
import { SafeImage } from "@/components/SafeImage";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children, hideHeader }: { children: ReactNode; hideHeader?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!hideHeader && <SiteHeader />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, lead, img }: { eyebrow: string; title: string; lead: string; img?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {img && (
        <>
          <SafeImage src={img} alt="" className="absolute inset-0 size-full object-cover opacity-30" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </>
      )}
      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="h-px w-10 bg-gold/60" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold">{eyebrow}</span>
          <span className="h-px w-10 bg-gold/60" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl gold-gradient-text leading-tight">{title}</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{lead}</p>
      </div>
    </section>
  );
}
