import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ARTISTS, PROFILES } from "@/data/blues";
import { IMG } from "@/data/images";
import { ArrowLeft, Music, MapPin, Disc3, Calendar } from "lucide-react";

export const Route = createFileRoute("/artists/$slug")({
  component: ArtistDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl mb-4">Artist not found</h1>
        <Link to="/artists" className="text-gold hover:underline">← Back to artists</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-destructive">{error.message}</p>
        <Link to="/artists" className="text-gold hover:underline">← Back to artists</Link>
      </div>
    </PageShell>
  ),
  head: ({ params }) => {
    const a = ARTISTS.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: a ? `${a.name} — SlowBlues` : "Artist — SlowBlues" },
        { name: "description", content: a?.short ?? "Blues artist profile." },
        { property: "og:title", content: a ? `${a.name} — SlowBlues` : "Artist" },
        { property: "og:image", content: a?.img ?? IMG.muddyWaters },
      ],
    };
  },
});

function ArtistDetail() {
  const { slug } = Route.useParams();
  const a = ARTISTS.find((x) => x.slug === slug);
  if (!a) throw notFound();
  const p = PROFILES[slug];

  return (
    <PageShell>
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src={a.img} alt="" className="size-full object-cover opacity-20 blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
          <Link to="/artists" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold mb-8">
            <ArrowLeft className="size-4" /> All artists
          </Link>
          <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
            <div className="rounded-xl overflow-hidden border border-gold/30 shadow-2xl">
              <img src={a.img} alt={a.name} className="w-full aspect-[3/4] object-cover" />
            </div>
            <div>
              <div className="text-xs tracking-[0.3em] text-gold uppercase mb-2">{a.tag} · {a.era}</div>
              <h1 className="font-display text-5xl md:text-6xl mb-4 leading-[1.05] gold-gradient-text">{a.name}</h1>
              <p className="text-lg text-foreground/85 leading-relaxed mb-6">{a.short}</p>
              {p && (
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <Fact icon={Calendar} label="Born" value={p.born} />
                  <Fact icon={MapPin} label="Origin" value={p.origin} />
                  <Fact icon={Music} label="Instruments" value={p.instruments.join(", ")} />
                  <Fact icon={Disc3} label="Labels" value={p.labels.join(", ")} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {p ? (
        <section className="max-w-4xl mx-auto px-6 pb-20 space-y-10">
          <div className="space-y-5 text-foreground/85 leading-relaxed text-lg">
            {p.bio.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Signature songs">
              <ul className="space-y-1.5 text-sm">
                {p.signatureSongs.map((s) => <li key={s} className="text-muted-foreground">♪ {s}</li>)}
              </ul>
            </Card>
            <Card title="Influences">
              <ul className="space-y-1.5 text-sm">
                {p.influences.map((s) => <li key={s} className="text-muted-foreground">→ {s}</li>)}
              </ul>
            </Card>
          </div>
          <Card title="Legacy">
            <p className="text-muted-foreground leading-relaxed">{p.legacy}</p>
          </Card>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <p className="text-muted-foreground italic text-center py-12">
            Detailed profile coming soon. In the meantime, explore the catalogue and the era this artist belongs to.
          </p>
        </section>
      )}
    </PageShell>
  );
}

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card/40 border border-border rounded-md px-4 py-3">
      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-gold uppercase mb-1"><Icon className="size-3" /> {label}</div>
      <div className="text-foreground/90">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card/60 border border-border rounded-xl p-6">
      <h3 className="font-display text-xl mb-3 text-gold">{title}</h3>
      {children}
    </div>
  );
}
