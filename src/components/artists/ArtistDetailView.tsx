import { Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { useArtist, useArtists, pickLang, type ArtistRecord, type Lang } from "@/lib/artists";
import { resolveArtistImage } from "@/lib/artistImageMap";
import { computeRelated } from "@/lib/relatedArtists";
import { IMG } from "@/data/images";
import { artistDetailPath, artistsListPath, type ArtistLocale } from "@/lib/locale";
import { NameLink, useNameIndex } from "@/components/artists/NameLink";
import {
  ArrowLeft, Music, MapPin, Disc3, Calendar, Users, Star, Quote, Guitar,
  PlayCircle, Mic, Award, Sparkles, Globe, ExternalLink, Image as ImageIcon, BookOpen,
} from "lucide-react";
import { ArtistYouTube, AlbumYouTubeCell, DiscographyVideos } from "@/components/artists/ArtistYouTube";
import { ArtistInitialsPlaceholder } from "@/components/artists/ArtistInitialsPlaceholder";

const T = {
  no: { back: "Tilbake til artister", notFound: "Artist ikke funnet", loading: "Laster…", error: "Kunne ikke laste artisten", born: "Født", died: "Død", active: "Aktiv", styles: "Stiler og sjangre", discography: "Diskografi", songs: "Kjente sanger", related: "Relaterte artister", videos: "Se & Lytt", gallery: "Galleri", links: "Eksterne lenker", articles: "Relaterte artikler", influences: "Innflytelser", legacy: "Musikalsk innflytelse", family: "Familie og privatliv", formative: "Formende opplevelser", instruments: "Instrumenter og utstyr", instrumentsShort: "Instrumenter", labelsShort: "Plateselskaper", anecdotes: "Historier og anekdoter", collaborators: "Samarbeidspartnere", awards: "Priser og anerkjennelse", from: "fra", musicians: "Musikere", watch: "Se", press: "Pressomtaler og sitater", source: "Kilde", year: "År", title: "Tittel", producer: "Produsent", label: "Label", chart: "Liste", sales: "Salg", notes: "Notater", featured: "Utvalgt", deceasedBanner: "Denne artisten er ikke lenger blant oss." },
  en: { back: "Back to artists", notFound: "Artist not found", loading: "Loading…", error: "Could not load the artist", born: "Born", died: "Died", active: "Active", styles: "Styles and genres", discography: "Discography", songs: "Famous songs", related: "Related artists", videos: "Watch & Listen", gallery: "Gallery", links: "External links", articles: "Related articles", influences: "Influences", legacy: "Musical Influence", family: "Family and personal life", formative: "Formative experiences", instruments: "Instruments & Equipment", instrumentsShort: "Instruments", labelsShort: "Labels", anecdotes: "Stories & Anecdotes", collaborators: "Collaborators", awards: "Awards & Recognition", from: "from", musicians: "Musicians", watch: "Watch", press: "Press & quotes", source: "Source", year: "Year", title: "Title", producer: "Producer", label: "Label", chart: "Chart", sales: "Sales", notes: "Notes", featured: "Featured", deceasedBanner: "This artist is no longer with us." },
  sv: { back: "Tillbaka till artister", notFound: "Artist hittades inte", loading: "Laddar…", error: "Kunde inte ladda artisten", born: "Född", died: "Död", active: "Aktiv", styles: "Stilar och genrer", discography: "Diskografi", songs: "Kända låtar", related: "Relaterade artister", videos: "Se & Lyssna", gallery: "Galleri", links: "Externa länkar", articles: "Relaterade artiklar", influences: "Influenser", legacy: "Musikaliskt inflytande", family: "Familj och privatliv", formative: "Formativa upplevelser", instruments: "Instrument och utrustning", instrumentsShort: "Instrument", labelsShort: "Skivbolag", anecdotes: "Historier & anekdoter", collaborators: "Samarbetspartners", awards: "Utmärkelser", from: "från", musicians: "Musiker", watch: "Se", press: "Press & citat", source: "Källa", year: "År", title: "Titel", producer: "Producent", label: "Label", chart: "Lista", sales: "Försäljning", notes: "Noteringar", featured: "Utvald", deceasedBanner: "Denna artist är inte längre bland oss." },
  de: { back: "Zurück zu den Künstlern", notFound: "Künstler nicht gefunden", loading: "Lädt…", error: "Künstler konnte nicht geladen werden", born: "Geboren", died: "Gestorben", active: "Aktiv", styles: "Stile und Genres", discography: "Diskografie", songs: "Bekannte Lieder", related: "Verwandte Künstler", videos: "Sehen & Hören", gallery: "Galerie", links: "Externe Links", articles: "Verwandte Artikel", influences: "Einflüsse", legacy: "Musikalischer Einfluss", family: "Familie und Privatleben", formative: "Prägende Erlebnisse", instruments: "Instrumente & Ausrüstung", instrumentsShort: "Instrumente", labelsShort: "Labels", anecdotes: "Geschichten & Anekdoten", collaborators: "Kollaborationen", awards: "Auszeichnungen", from: "aus", musicians: "Musiker", watch: "Ansehen", press: "Presse & Zitate", source: "Quelle", year: "Jahr", title: "Titel", producer: "Produzent", label: "Label", chart: "Charts", sales: "Verkauf", notes: "Anmerkungen", featured: "Empfohlen", deceasedBanner: "Dieser Künstler ist verstorben." },
} as const;



export function ArtistDetailView({ slug, locale }: { slug: string; locale: ArtistLocale }) {
  const lang = locale as Lang;
  const t = T[locale];
  const { data: a, loading, error } = useArtist(slug);
  const { data: all } = useArtists();
  const nameIndex = useNameIndex(all);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-32 text-center text-muted-foreground">{t.loading}</div>;
  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-destructive mb-4">{t.error}: {error}</p>
      <Link to={artistsListPath(locale)} className="text-gold hover:underline">← {t.back}</Link>
    </div>
  );
  if (!a) return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <h1 className="font-display text-4xl mb-4">{t.notFound}</h1>
      <Link to={artistsListPath(locale)} className="text-gold hover:underline">← {t.back}</Link>
    </div>
  );

  const ownImg = resolveArtistImage(a.img);
  const heroImg = ownImg ?? IMG.muddyWaters;
  const related = computeRelated(a, all ?? [], 8);
  const bio = pickLang(a, lang, "biography");
  const short = pickLang(a, lang, "short") ?? a.short;
  const influence = pickLang(a, lang, "influence");
  const eraLabel = pickLang(a, lang, "era_label") ?? a.era;
  const allStyles = Array.from(new Set([...(a.styles ?? []), ...(a.categories ?? [])]));
  const gallery = (a.gallery_images ?? []).map((p) => resolveArtistImage(p)).filter(Boolean) as string[];
  const youtubeIds = Array.from(new Set([...(a.youtube_video_ids ?? []), ...(a.videos ?? []).map((v) => v.youtube_id)])).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <SafeImage src={heroImg} alt="" className="size-full object-cover opacity-20 blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
          <Link to={artistsListPath(locale)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold mb-8">
            <ArrowLeft className="size-4" /> {t.back}
          </Link>
          <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
            <div className="rounded-xl overflow-hidden border border-gold/30 shadow-2xl bg-card/60">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {ownImg ? (
                  <>
                    <SafeImage src={ownImg} alt="" className="absolute inset-0 size-full object-cover blur-2xl scale-110 opacity-40" loading="eager" />
                    <SafeImage src={ownImg} alt={a.name} className="relative size-full object-contain" loading="eager" />
                  </>
                ) : (
                  <ArtistInitialsPlaceholder name={a.name} className="absolute inset-0" />
                )}
              </div>
              {ownImg && a.image_credit && <div className="text-[10px] text-muted-foreground px-2 py-1 bg-card/60">{a.image_credit}</div>}
            </div>
            <div>
              <div className="inline-block text-xs tracking-[0.3em] text-gold uppercase mb-2 px-3 py-1 rounded-md bg-gold/10 border border-gold/30">
                {a.tag}{eraLabel && ` (${eraLabel})`}
              </div>
              <h1 className="font-display text-5xl md:text-6xl mb-3 leading-[1.05] gold-gradient-text">{a.name}</h1>
              {a.alt_name && <p className="text-muted-foreground mb-4">{t.born}: {a.alt_name}</p>}
              {a.died && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-md bg-gold/10 border border-gold/30 text-gold text-xs tracking-wide">
                  <span aria-hidden>✦</span>
                  <span>{t.deceasedBanner}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                {a.born && <span>{t.born}: {a.born}{a.died && ` · ${t.died}: ${a.died}`}</span>}
                {(a.country || a.origin) && <span>• <MapPin className="inline size-3.5" /> {a.country ?? a.origin}</span>}
                {a.active_years && <span>• {t.active}: {a.active_years}</span>}
              </div>
              {allStyles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {allStyles.slice(0, 12).map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold">{s}</span>
                  ))}
                </div>
              )}
              {short && <p className="text-lg text-foreground/85 leading-relaxed mb-6">{short}</p>}
              {(a.instruments_simple.length > 0 || a.labels.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {a.instruments_simple.length > 0 && <Fact icon={Music} label={t.instrumentsShort} value={a.instruments_simple.join(", ")} />}
                  {a.labels.length > 0 && <Fact icon={Disc3} label={t.labelsShort} value={a.labels.join(", ")} />}
                  {a.origin && <Fact icon={MapPin} label={t.from} value={a.origin} />}
                  {a.born && <Fact icon={Calendar} label={t.born} value={a.born} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-16">
        {/* Long-form biography (multilingual) */}
        {bio && (
          <section className="max-w-3xl mx-auto">
            <article className="prose prose-invert max-w-none text-foreground/85 leading-relaxed text-lg whitespace-pre-line">
              {bio}
            </article>
          </section>
        )}

        {/* Fallback to legacy bio paragraphs if no multilingual bio */}
        {!bio && a.bio.length > 0 && (
          <section className="max-w-3xl mx-auto space-y-5 text-foreground/85 leading-relaxed text-lg">
            {a.bio.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {influence && (
          <Card title={t.legacy} icon={Sparkles}>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{influence}</p>
          </Card>
        )}
        {!influence && a.legacy && (
          <Card title={t.legacy} icon={Sparkles}>
            <p className="text-muted-foreground leading-relaxed">{a.legacy}</p>
          </Card>
        )}

        {/* Influences */}
        {a.influences.length > 0 && (
          <Section icon={Star} title={t.influences} tone="amber">
            <div className="flex flex-wrap gap-2">
              {a.influences.map((inf, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 text-sm">{inf}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Family */}
        {a.family.length > 0 && (
          <Section icon={Users} title={t.family} tone="rose">
            <div className="grid md:grid-cols-2 gap-4">
              {a.family.map((f, i) => (
                <div key={i} className="border border-border rounded-lg p-5 bg-card/40">
                  <div className="text-[10px] tracking-[0.25em] text-rose-400/80 uppercase mb-2">{f.relation}</div>
                  <div className="font-display text-xl mb-1">
                    <NameLink name={f.name} index={nameIndex} locale={locale} />
                  </div>
                  {f.note && <p className="text-sm text-muted-foreground">{f.note}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {a.formative.length > 0 && (
          <Section icon={Star} title={t.formative} tone="amber">
            <ul className="space-y-3">
              {a.formative.map((f, i) => (
                <li key={i} className="flex gap-3 text-foreground/85 leading-relaxed">
                  <span className="text-amber-400 mt-2">•</span><span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {a.instruments.length > 0 && (
          <Section icon={Guitar} title={t.instruments} tone="gold">
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

        {a.anecdotes.length > 0 && (
          <Section icon={Quote} title={t.anecdotes} tone="rose">
            <div className="grid md:grid-cols-2 gap-4">
              {a.anecdotes.map((q, i) => (
                <blockquote key={i} className="border border-border rounded-lg p-5 bg-card/40 text-foreground/80 italic leading-relaxed">"{q}"</blockquote>
              ))}
            </div>
          </Section>
        )}

        {a.collaborators.length > 0 && (
          <Section icon={Users} title={t.collaborators} tone="rose">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {a.collaborators.map((c, i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-card/40">
                  <div className="font-display text-lg text-gold mb-1">
                    <NameLink name={c.name} index={nameIndex} locale={locale} />
                  </div>
                  {c.years && <div className="text-xs text-muted-foreground mb-2">{c.years}</div>}
                  {c.note && <p className="text-sm text-muted-foreground leading-relaxed">{c.note}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Curated videos (editor-picked featured/more) */}
        {(a.videos.length > 0 || youtubeIds.length > 0) && (
          <Section icon={PlayCircle} title={t.videos} tone="gold">
            <VideoGrid videos={a.videos} fallbackIds={youtubeIds} featuredLabel={t.featured} />
          </Section>
        )}

        {/* Auto-fetched YouTube videos for this artist */}
        <ArtistYouTube artistName={a.name} title={t.videos} />

        {/* Press quotes & critic statements */}
        {a.press_quotes.length > 0 && (
          <Section icon={Quote} title={t.press} tone="amber">
            <div className="grid md:grid-cols-2 gap-5">
              {a.press_quotes.map((q, i) => (
                <figure key={i} className="border border-amber-400/20 rounded-lg p-5 bg-amber-400/5">
                  <blockquote className="text-foreground/90 italic leading-relaxed mb-3">"{q.quote}"</blockquote>
                  <figcaption className="text-sm text-muted-foreground">
                    <span className="text-amber-200 font-medium">{q.author}</span>
                    {q.role && <span> · {q.role}</span>}
                    {q.year && <span> · {q.year}</span>}
                    {q.source_url && (
                      <>
                        {" — "}
                        <a href={q.source_url} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-100 underline underline-offset-4">
                          {q.source_title ?? t.source}
                        </a>
                      </>
                    )}
                    {!q.source_url && q.source_title && <span> — {q.source_title}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>
        )}

        {/* Discography */}
        {a.discography.length > 0 && (
          <Section icon={Disc3} title={t.discography} tone="gold">
            <DiscographyVideos>
              <div className="overflow-x-auto border border-border rounded-xl bg-card/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground border-b border-border">
                      <th className="p-3">{t.year}</th><th className="p-3">{t.title}</th><th className="p-3">{t.producer}</th><th className="p-3">{t.label}</th><th className="p-3">{t.chart}</th><th className="p-3">{t.sales}</th><th className="p-3">{t.musicians}</th><th className="p-3">YouTube</th><th className="p-3">{t.notes}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.discography.map((d, i) => {
                      const chart = d.chart_position ?? d.chart;
                      const sales = d.sales_estimate ?? d.sales;
                      return (
                        <tr key={i} className="border-b border-border/50 last:border-0 align-top">
                          <td className="p-3 text-gold font-mono">{d.year}</td>
                          <td className="p-3 font-medium">{d.title}</td>
                          <td className="p-3 text-muted-foreground">{d.producer ?? "—"}</td>
                          <td className="p-3 text-muted-foreground">{d.label ?? "—"}</td>
                          <td className="p-3">{chart ?? "—"}</td>
                          <td className="p-3 text-muted-foreground">{sales ?? "—"}</td>
                          <td className="p-3 text-muted-foreground max-w-[18rem]">
                            {d.musicians && d.musicians.length > 0 ? (
                              <span>
                                {d.musicians.map((m, mi) => (
                                  <span key={mi}>
                                    <NameLink name={m.name} index={nameIndex} locale={locale} />
                                    {m.instrument ? ` (${m.instrument})` : ""}
                                    {mi < d.musicians!.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="p-3">
                            <AlbumYouTubeCell
                              artistName={a.name}
                              albumTitle={d.title}
                              watchLabel={t.watch}
                              initialVideoId={d.youtube_id ?? null}
                            />
                          </td>
                          <td className="p-3 text-muted-foreground italic max-w-xs">{d.notes ?? ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DiscographyVideos>
          </Section>
        )}

        {/* Famous songs */}
        {a.signature_songs.length > 0 && (
          <Section icon={Music} title={t.songs} tone="gold">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {a.signature_songs.map((s, i) => (
                <div key={i} className="border border-border rounded-lg px-4 py-3 bg-card/40 flex items-center gap-3">
                  <span className="text-gold font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/90">{s}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <Section icon={ImageIcon} title={t.gallery} tone="gold">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-card/60">
                  <SafeImage src={src} alt="" className="absolute inset-0 size-full object-cover blur-xl scale-110 opacity-40" loading="lazy" />
                  <SafeImage src={src} alt={`${a.name} ${i + 1}`} loading="lazy" className="relative size-full object-contain transition duration-500" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {a.awards.length > 0 && (
          <Section icon={Award} title={t.awards} tone="gold">
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

        {/* External links + social */}
        {(Object.keys(a.social_links ?? {}).length > 0 || a.external_links.length > 0) && (
          <Section icon={Globe} title={t.links} tone="gold">
            <div className="flex flex-wrap gap-3">
              {Object.entries(a.social_links ?? {})
                .filter(([k, v]) => k.toLowerCase() !== "spotify" && typeof v === "string" && v.length > 0)
                .map(([k, v]) => (
                  <a key={k} href={v as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 bg-gold/5 text-gold hover:bg-gold/15 transition text-sm">
                    <ExternalLink className="size-3.5" /> {k}
                  </a>
                ))}
              {a.external_links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card/40 hover:border-gold/50 hover:text-gold transition text-sm">
                  <ExternalLink className="size-3.5" /> {l.label ?? new URL(l.url).hostname.replace(/^www\./, "")}
                </a>
              ))}
            </div>
          </Section>
        )}

        {a.article_references.length > 0 && (
          <Section icon={BookOpen} title={t.articles} tone="amber">
            <ul className="space-y-2">
              {a.article_references.map((r, i) => (
                <li key={i}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-amber-200 hover:text-amber-100 underline underline-offset-4">
                    {r.title ?? r.url}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Related artists */}
        {related.length > 0 && (
          <Section icon={Music} title={t.related} tone="gold">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => <RelatedCard key={r.slug} a={r} locale={locale} />)}
            </div>
          </Section>
        )}
      </div>
    </>
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

function VideoGrid({ videos, fallbackIds, featuredLabel }: { videos: ArtistRecord["videos"]; fallbackIds: string[]; featuredLabel: string }) {
  const featured = videos.find((v) => v.kind === "featured");
  const more = videos.filter((v) => v !== featured);
  const extra = fallbackIds.filter((id) => !videos.some((v) => v.youtube_id === id)).map((id) => ({ kind: "more" as const, title: "", youtube_id: id }));
  const list = [...more, ...extra];

  return (
    <>
      {featured && (
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start mb-10">
          <div className="aspect-video rounded-xl overflow-hidden border border-gold/30 bg-black">
            <iframe src={`https://www.youtube-nocookie.com/embed/${featured.youtube_id}?rel=0`} title={featured.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="size-full" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] text-gold uppercase mb-2">{featuredLabel}</div>
            <h3 className="font-display text-2xl mb-3">{featured.title}</h3>
            {featured.note && <p className="text-muted-foreground leading-relaxed mb-3">{featured.note}</p>}
            {featured.channel && <p className="text-sm text-muted-foreground">{featured.channel}</p>}
          </div>
        </div>
      )}
      {list.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((v, i) => (
            <a key={`${v.youtube_id}-${i}`} href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer" className="group block border border-border rounded-lg overflow-hidden bg-card/40 hover:border-gold/60 transition">
              <div className="relative aspect-video bg-black">
                <img src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`} alt={v.title || "Video"} loading="lazy" className="size-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
              </div>
              {v.title && (
                <div className="p-3">
                  <h4 className="text-sm font-medium line-clamp-2">{v.title}</h4>
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function RelatedCard({ a, locale }: { a: ArtistRecord; locale: ArtistLocale }) {
  const img = resolveArtistImage(a.img);
  return (
    <Link to={artistDetailPath(locale, a.slug)} className="block border border-border rounded-lg overflow-hidden bg-card/40 hover:border-gold/60 transition">
      {img ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-card/60">
          <SafeImage src={img} alt="" className="absolute inset-0 size-full object-cover blur-xl scale-110 opacity-40" loading="lazy" />
          <SafeImage src={img} alt={a.name} loading="lazy" className="relative size-full object-contain" />
        </div>
      ) : (
        <ArtistInitialsPlaceholder name={a.name} className="aspect-[4/3]" />
      )}
      <div className="p-4">
        <div className="font-display text-lg text-gold mb-1">{a.name}</div>
        <div className="text-xs text-muted-foreground mb-2">{a.country ?? a.tag}{a.era && ` · ${a.era}`}</div>
        {a.short && <p className="text-sm text-muted-foreground line-clamp-2">{a.short}</p>}
      </div>
    </Link>
  );
}
