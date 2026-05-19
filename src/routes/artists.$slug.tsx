import { createFileRoute, Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { PageShell } from "@/components/PageShell";
import { useArtist, useArtists, type ArtistRecord } from "@/lib/artists";
import { resolveArtistImage } from "@/lib/artistImageMap";
import { IMG } from "@/data/images";
import { ArrowLeft, Music, MapPin, Disc3, Calendar, Users, Star, Quote, Guitar, PlayCircle, Mic, Award, Sparkles } from "lucide-react";

export const Route = createFileRoute("/artists/$slug")({
  component: ArtistDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Artist — SlowBlues` },
      { name: "description", content: "Bluesartist profil." },
      { property: "og:title", content: `${params.slug} — SlowBlues` },
    ],
  }),
});

function ArtistDetail() {
  const { slug } = Route.useParams();
  const { data: a, loading, error } = useArtist(slug);
  const { data: all } = useArtists();

  if (loading) {
    return <PageShell><div className="max-w-3xl mx-auto px-6 py-32 text-center text-muted-foreground">Laster…</div></PageShell>;
  }

  if (error) {
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <p className="text-destructive mb-4">Kunne ikke laste artisten: {error}</p>
          <Link to="/artists" className="text-gold hover:underline">← Tilbake til artister</Link>
        </div>
      </PageShell>
    );
  }

  if (!a) {
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-4xl mb-4">Artist ikke funnet</h1>
          <Link to="/artists" className="text-gold hover:underline">← Tilbake til artister</Link>
        </div>
      </PageShell>
    );
  }

  const heroImg = a.img ?? IMG.muddyWaters;
  const related = (all ?? []).filter((x) => a.related_slugs.includes(x.slug));

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <SafeImage src={heroImg} alt="" className="size-full object-cover opacity-20 blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
          <Link to="/artists" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold mb-8">
            <ArrowLeft className="size-4" /> Tilbake til artister
          </Link>
          <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
            <div className="rounded-xl overflow-hidden border border-gold/30 shadow-2xl">
              <SafeImage src={heroImg} alt={a.name} className="w-full aspect-[3/4] object-cover" />
            </div>
            <div>
              <div className="inline-block text-xs tracking-[0.3em] text-gold uppercase mb-2 px-3 py-1 rounded-md bg-gold/10 border border-gold/30">
                {a.tag}{a.era && ` (${a.era})`}
              </div>
              <h1 className="font-display text-5xl md:text-6xl mb-3 leading-[1.05] gold-gradient-text">{a.name}</h1>
              {a.alt_name && <p className="text-muted-foreground mb-4">Født: {a.alt_name}</p>}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                {a.born && <span>{a.born}{a.died && ` — ${a.died}`}</span>}
                {a.origin && <span>• {a.origin}</span>}
                {a.active_years && <span>• Aktiv: {a.active_years}</span>}
              </div>
              {a.short && <p className="text-lg text-foreground/85 leading-relaxed mb-6">{a.short}</p>}
              {(a.instruments_simple.length > 0 || a.labels.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {a.instruments_simple.length > 0 && <Fact icon={Music} label="Instrumenter" value={a.instruments_simple.join(", ")} />}
                  {a.labels.length > 0 && <Fact icon={Disc3} label="Labels" value={a.labels.join(", ")} />}
                  {a.origin && <Fact icon={MapPin} label="Opprinnelse" value={a.origin} />}
                  {a.born && <Fact icon={Calendar} label="Født" value={a.born} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-16">
        {/* Bio */}
        {a.bio.length > 0 && (
          <section className="max-w-3xl mx-auto space-y-5 text-foreground/85 leading-relaxed text-lg">
            {a.bio.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {a.legacy && (
          <Card title="Musikalsk innflytelse" icon={Sparkles}>
            <p className="text-muted-foreground leading-relaxed">{a.legacy}</p>
          </Card>
        )}

        {/* Family */}
        {a.family.length > 0 && (
          <Section icon={Users} title="Familie og privatliv" tone="rose">
            <div className="grid md:grid-cols-2 gap-4">
              {a.family.map((f, i) => (
                <div key={i} className="border border-border rounded-lg p-5 bg-card/40">
                  <div className="text-[10px] tracking-[0.25em] text-rose-400/80 uppercase mb-2">{f.relation}</div>
                  <div className="font-display text-xl mb-1">{f.name}</div>
                  {f.note && <p className="text-sm text-muted-foreground">{f.note}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Formative experiences */}
        {a.formative.length > 0 && (
          <Section icon={Star} title="Formende opplevelser" tone="amber">
            <ul className="space-y-3">
              {a.formative.map((f, i) => (
                <li key={i} className="flex gap-3 text-foreground/85 leading-relaxed">
                  <span className="text-amber-400 mt-2">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Instruments */}
        {a.instruments.length > 0 && (
          <Section icon={Guitar} title="Instrumenter og utstyr" tone="gold">
            <div className="grid md:grid-cols-3 gap-5">
              {["Gitar", "Annet", "Vokal"].map((cat) => {
                const items = a.instruments.filter((i) => i.category === cat);
                if (items.length === 0) return null;
                const Ico = cat === "Gitar" ? Guitar : cat === "Vokal" ? Mic : Music;
                return (
                  <div key={cat} className="border border-border rounded-xl p-5 bg-card/40">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="size-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center"><Ico className="size-4 text-gold" /></div>
                      <h4 className="font-display text-lg">{cat}</h4>
                    </div>
                    <div className="space-y-4">
                      {items.map((it, i) => (
                        <div key={i} className="border-l-2 border-gold/40 pl-3">
                          <div className="font-medium">{it.name}</div>
                          {it.years && <div className="text-xs text-muted-foreground mb-1">{it.years}</div>}
                          {it.note && <p className="text-sm text-muted-foreground">{it.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Anecdotes */}
        {a.anecdotes.length > 0 && (
          <Section icon={Quote} title="Historier og anekdoter" tone="rose">
            <div className="grid md:grid-cols-2 gap-4">
              {a.anecdotes.map((q, i) => (
                <blockquote key={i} className="border border-border rounded-lg p-5 bg-card/40 text-foreground/80 italic leading-relaxed">
                  "{q}"
                </blockquote>
              ))}
            </div>
          </Section>
        )}

        {/* Collaborators */}
        {a.collaborators.length > 0 && (
          <Section icon={Users} title="Samarbeidspartnere" tone="rose">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {a.collaborators.map((c, i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-card/40">
                  <div className="font-display text-lg text-gold mb-1">{c.name}</div>
                  {c.years && <div className="text-xs text-muted-foreground mb-2">{c.years}</div>}
                  {c.note && <p className="text-sm text-muted-foreground leading-relaxed">{c.note}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Videos */}
        {a.videos.length > 0 && <VideoSection videos={a.videos} name={a.name} />}

        {/* Discography */}
        {a.discography.length > 0 && (
          <Section icon={Disc3} title="Diskografi" tone="gold">
            <div className="overflow-x-auto border border-border rounded-xl bg-card/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground border-b border-border">
                    <th className="p-3">År</th>
                    <th className="p-3">Tittel</th>
                    <th className="p-3">Produsent</th>
                    <th className="p-3">Plateselskap</th>
                    <th className="p-3">Liste</th>
                    <th className="p-3">Salg</th>
                    <th className="p-3">Notater</th>
                  </tr>
                </thead>
                <tbody>
                  {a.discography.map((d, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 align-top">
                      <td className="p-3 text-gold font-mono">{d.year}</td>
                      <td className="p-3 font-medium">{d.title}{d.musicians_count ? <div className="text-xs text-muted-foreground mt-0.5">{d.musicians_count} musiker(e)</div> : null}</td>
                      <td className="p-3 text-muted-foreground">{d.producer ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{d.label ?? "—"}</td>
                      <td className="p-3"><span className={d.chart ? "text-rose-400" : "text-muted-foreground"}>{d.chart ?? "—"}</span></td>
                      <td className="p-3 text-muted-foreground">{d.sales ?? "—"}</td>
                      <td className="p-3 text-muted-foreground italic max-w-xs">{d.notes ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* Awards */}
        {a.awards.length > 0 && (
          <Section icon={Award} title="Priser og anerkjennelse" tone="gold">
            <div className="grid md:grid-cols-2 gap-4">
              {a.awards.map((w, i) => (
                <div key={i} className="border border-border rounded-lg p-5 bg-card/40 flex gap-4">
                  <div className="size-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0"><Award className="size-5 text-gold" /></div>
                  <div>
                    <div className="text-sm text-gold font-mono mb-1">{w.year}</div>
                    <div className="font-display text-lg">{w.title}</div>
                    {w.category && <div className="text-sm text-muted-foreground mt-1">{w.category}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Related artists */}
        {related.length > 0 && (
          <Section icon={Music} title="Oppdag flere bluesartister" tone="gold">
            <p className="text-muted-foreground mb-5 -mt-3">Utforsk flere artister forbundet av stil, epoke eller innflytelse.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => <RelatedCard key={r.slug} a={r} />)}
            </div>
          </Section>
        )}

        <p className="text-xs text-muted-foreground text-center pt-8">
          Kilder: Library of Congress, Blues Foundation, Rock & Roll Hall of Fame, Smithsonian Institution.
        </p>
      </div>
    </PageShell>
  );
}

function Section({ icon: Icon, title, tone = "gold", children }: { icon: any; title: string; tone?: "gold" | "rose" | "amber"; children: React.ReactNode }) {
  const toneClass = tone === "rose" ? "text-rose-400" : tone === "amber" ? "text-amber-400" : "text-gold";
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`size-6 ${toneClass}`} />
        <h2 className={`font-display text-3xl ${toneClass}`}>{title}</h2>
      </div>
      {children}
    </section>
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

function Card({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="bg-card/60 border border-border rounded-xl p-6 max-w-3xl mx-auto">
      <h3 className="font-display text-xl mb-3 text-gold flex items-center gap-2">{Icon && <Icon className="size-5" />}{title}</h3>
      {children}
    </div>
  );
}

function VideoSection({ videos, name }: { videos: ArtistRecord["videos"]; name: string }) {
  const featured = videos.find((v) => v.kind === "featured");
  const more = videos.filter((v) => v.kind === "more");
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <PlayCircle className="size-6 text-gold" />
        <h2 className="font-display text-3xl text-gold">Se & Lytt</h2>
      </div>
      {featured && (
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start mb-10">
          <div className="aspect-video rounded-xl overflow-hidden border border-gold/30 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${featured.youtube_id}`}
              title={featured.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full"
            />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] text-gold uppercase mb-2">Utvalgt fremføring</div>
            <h3 className="font-display text-2xl mb-3">{featured.title}</h3>
            {featured.note && <p className="text-muted-foreground leading-relaxed mb-3">{featured.note}</p>}
            {featured.channel && <p className="text-sm text-muted-foreground">Kanal: {featured.channel}</p>}
          </div>
        </div>
      )}
      {more.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="font-display text-xl text-gold flex items-center gap-2"><PlayCircle className="size-5" />Flere fremføringer</h3>
            <p className="text-sm text-muted-foreground">Oppdag flere {name}-opptak</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {more.map((v, i) => (
              <a key={i} href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer" className="group block border border-border rounded-lg overflow-hidden bg-card/40 hover:border-gold/60 transition">
                <div className="relative aspect-video bg-black">
                  <img
                    src={v.thumbnail ?? `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
                    alt={v.title}
                    loading="lazy"
                    className="size-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                  />
                  {v.duration && <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded">{v.duration}</span>}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium line-clamp-2 mb-1">{v.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    {v.channel && <span>{v.channel}</span>}
                    {v.views && <span>{v.views}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function RelatedCard({ a }: { a: ArtistRecord }) {
  return (
    <Link to="/artists/$slug" params={{ slug: a.slug }} className="block border border-border rounded-lg p-4 bg-card/40 hover:border-gold/60 transition">
      <div className="font-display text-lg text-gold mb-1">{a.name}</div>
      <div className="text-xs text-muted-foreground mb-2">{a.tag}{a.era && ` · ${a.era}`}</div>
      {a.short && <p className="text-sm text-muted-foreground line-clamp-2">{a.short}</p>}
      <span className="inline-block text-xs text-gold mt-2">Se profil →</span>
    </Link>
  );
}
