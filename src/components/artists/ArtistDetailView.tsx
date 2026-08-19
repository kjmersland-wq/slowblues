import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { useArtist, useArtists, pickLang, pickLangArray, pickLangJsonb, type ArtistRecord, type Lang, type FamilyEntry, type InstrumentEntry, type CollaboratorEntry, type DiscographyEntry, type AwardEntry, type PressQuote } from "@/lib/artists";
import { fetchConcertReviewsByArtistSlug, type ConcertReview } from "@/lib/concertReviews.functions";
import { resolveArtistImage } from "@/lib/artistImageMap";
import { computeRelated } from "@/lib/relatedArtists";
import { IMG } from "@/data/images";
import { artistDetailPath, artistsListPath, type ArtistLocale } from "@/lib/locale";
import { NameLink, useNameIndex } from "@/components/artists/NameLink";
import {
  ArrowLeft, Music, MapPin, Disc3, Calendar, Users, Star, Quote, Guitar,
  PlayCircle, Mic, Award, Sparkles, Globe, ExternalLink, Image as ImageIcon, BookOpen, Link2, Check, Phone,
} from "lucide-react";
import { ArtistYouTube, AlbumYouTubeCell, DiscographyVideos } from "@/components/artists/ArtistYouTube";
import { ArtistInitialsPlaceholder } from "@/components/artists/ArtistInitialsPlaceholder";

const T = {
  no: { back: "Tilbake til artister", notFound: "Artist ikke funnet", loading: "Laster…", error: "Kunne ikke laste artisten", born: "Født", aka: "Også kjent som", died: "Død", active: "Aktiv", styles: "Stiler og sjangre", discography: "Diskografi", songs: "Kjente sanger", related: "Relaterte artister", videos: "Se & Lytt", gallery: "Galleri", links: "Eksterne lenker", articles: "Kilder", influences: "Innflytelser", legacy: "Musikalsk innflytelse", family: "Familie og privatliv", formative: "Formende opplevelser", instruments: "Instrumenter og utstyr", instrumentsShort: "Instrumenter", labelsShort: "Plateselskaper", anecdotes: "Historier og anekdoter", collaborators: "Samarbeidspartnere", awards: "Priser og anerkjennelse", from: "fra", musicians: "Musikere", watch: "Se", press: "Pressomtaler og sitater", source: "Kilde", year: "År", title: "Tittel", producer: "Produsent", label: "Label", chart: "Liste", sales: "Salg", notes: "Notater", featured: "Utvalgt", deceasedBanner: "Denne artisten er ikke lenger blant oss.", share: "Del profil", copied: "Lenke kopiert!", aiImageNote: "KI-generert historisk tolkning — ingen original fotografi tilgjengelig", catGuitar: "Gitar", catOther: "Annet", catVocals: "Vokal", watchOnYoutubePrefix: "Se på YouTube:", watchVideoGeneric: "Se video på YouTube", officialWebsite: "Offisiell hjemmeside", concertReviews: "Konsert- og festivalanmeldelser", booking: "Booking / kontakt", bookingAgency: "Bookingbyrå", bookingAgent: "Agent/management", bookingEmail: "Booking-e-post", bookingPhone: "Bookingtelefon", bookingUrl: "Booking-URL", notPubliclyAvailable: "Ikke offentlig tilgjengelig", bookingUpdateNote: "Er du artisten selv, eller representerer du bandet eller bookingbyrået? Vi ønsker at bookinginformasjonen her alltid skal være riktig og oppdatert. Send oss gjerne korrekte opplysninger via kontaktskjemaet vårt, så oppdaterer vi profilen så snart som mulig.", contactLink: "Gå til kontaktskjemaet" },
  en: { back: "Back to artists", notFound: "Artist not found", loading: "Loading…", error: "Could not load the artist", born: "Born", aka: "Also known as", died: "Died", active: "Active", styles: "Styles and genres", discography: "Discography", songs: "Famous songs", related: "Related artists", videos: "Watch & Listen", gallery: "Gallery", links: "External links", articles: "Sources", influences: "Influences", legacy: "Musical Influence", family: "Family and personal life", formative: "Formative experiences", instruments: "Instruments & Equipment", instrumentsShort: "Instruments", labelsShort: "Labels", anecdotes: "Stories & Anecdotes", collaborators: "Collaborators", awards: "Awards & Recognition", from: "from", musicians: "Musicians", watch: "Watch", press: "Press & quotes", source: "Source", year: "Year", title: "Title", producer: "Producer", label: "Label", chart: "Chart", sales: "Sales", notes: "Notes", featured: "Featured", deceasedBanner: "This artist is no longer with us.", share: "Share profile", copied: "Link copied!", aiImageNote: "AI-generated historical interpretation — no original photograph available", catGuitar: "Guitar", catOther: "Other", catVocals: "Vocals", watchOnYoutubePrefix: "Watch on YouTube:", watchVideoGeneric: "Watch video on YouTube", officialWebsite: "Official website", concertReviews: "Concert & festival reviews", booking: "Booking / Contact", bookingAgency: "Booking agency", bookingAgent: "Agent/management", bookingEmail: "Booking email", bookingPhone: "Booking phone", bookingUrl: "Booking URL", notPubliclyAvailable: "Not publicly available", bookingUpdateNote: "Are you the artist, or do you represent the band or booking agency? We want the booking information here to always be accurate and current. Please send us the correct details via our contact form, and we'll update the profile as soon as possible.", contactLink: "Go to the contact form" },
  sv: { back: "Tillbaka till artister", notFound: "Artist hittades inte", loading: "Laddar…", error: "Kunde inte ladda artisten", born: "Född", aka: "Även känd som", died: "Död", active: "Aktiv", styles: "Stilar och genrer", discography: "Diskografi", songs: "Kända låtar", related: "Relaterade artister", videos: "Se & Lyssna", gallery: "Galleri", links: "Externa länkar", articles: "Källor", influences: "Influenser", legacy: "Musikaliskt inflytande", family: "Familj och privatliv", formative: "Formativa upplevelser", instruments: "Instrument och utrustning", instrumentsShort: "Instrument", labelsShort: "Skivbolag", anecdotes: "Historier & anekdoter", collaborators: "Samarbetspartners", awards: "Utmärkelser", from: "från", musicians: "Musiker", watch: "Se", press: "Press & citat", source: "Källa", year: "År", title: "Titel", producer: "Producent", label: "Label", chart: "Lista", sales: "Försäljning", notes: "Noteringar", featured: "Utvald", deceasedBanner: "Denna artist är inte längre bland oss.", share: "Dela profil", copied: "Länk kopierad!", aiImageNote: "AI-genererad historisk tolkning — inget originalfotografi tillgängligt", catGuitar: "Gitarr", catOther: "Annat", catVocals: "Sång", watchOnYoutubePrefix: "Se på YouTube:", watchVideoGeneric: "Se video på YouTube", officialWebsite: "Officiell webbplats", concertReviews: "Konsert- och festivalrecensioner", booking: "Booking / Kontakt", bookingAgency: "Bookingbyrå", bookingAgent: "Agent/management", bookingEmail: "Booking-e-post", bookingPhone: "Bookingtelefon", bookingUrl: "Booking-URL", notPubliclyAvailable: "Inte offentligt tillgängligt", bookingUpdateNote: "Är du artisten själv, eller representerar du bandet eller bookingbyrån? Vi vill att bokningsinformationen här alltid ska vara korrekt och uppdaterad. Skicka gärna rätt uppgifter via vårt kontaktformulär, så uppdaterar vi profilen så snart som möjligt.", contactLink: "Gå till kontaktformuläret" },
  de: { back: "Zurück zu den Künstlern", notFound: "Künstler nicht gefunden", loading: "Lädt…", error: "Künstler konnte nicht geladen werden", born: "Geboren", aka: "Auch bekannt als", died: "Gestorben", active: "Aktiv", styles: "Stile und Genres", discography: "Diskografie", songs: "Bekannte Lieder", related: "Verwandte Künstler", videos: "Sehen & Hören", gallery: "Galerie", links: "Externe Links", articles: "Quellen", influences: "Einflüsse", legacy: "Musikalischer Einfluss", family: "Familie und Privatleben", formative: "Prägende Erlebnisse", instruments: "Instrumente & Ausrüstung", instrumentsShort: "Instrumente", labelsShort: "Labels", anecdotes: "Geschichten & Anekdoten", collaborators: "Kollaborationen", awards: "Auszeichnungen", from: "aus", musicians: "Musiker", watch: "Ansehen", press: "Presse & Zitate", source: "Quelle", year: "Jahr", title: "Titel", producer: "Produzent", label: "Label", chart: "Charts", sales: "Verkauf", notes: "Anmerkungen", featured: "Empfohlen", deceasedBanner: "Dieser Künstler ist verstorben.", share: "Profil teilen", copied: "Link kopiert!", aiImageNote: "KI-generierte historische Interpretation — kein Originalfoto verfügbar", catGuitar: "Gitarre", catOther: "Sonstiges", catVocals: "Gesang", watchOnYoutubePrefix: "Auf YouTube ansehen:", watchVideoGeneric: "Video auf YouTube ansehen", officialWebsite: "Offizielle Website", concertReviews: "Konzert- und Festivalkritiken", booking: "Booking / Kontakt", bookingAgency: "Booking-Agentur", bookingAgent: "Agent/Management", bookingEmail: "Booking-E-Mail", bookingPhone: "Booking-Telefon", bookingUrl: "Booking-URL", notPubliclyAvailable: "Nicht öffentlich verfügbar", bookingUpdateNote: "Sind Sie der Künstler selbst oder vertreten Sie die Band oder die Booking-Agentur? Wir möchten, dass die Booking-Informationen hier stets korrekt und aktuell sind. Senden Sie uns gerne die richtigen Angaben über unser Kontaktformular, dann aktualisieren wir das Profil so schnell wie möglich.", contactLink: "Zum Kontaktformular" },
  pl: { back: "Wróć do artystów", notFound: "Nie znaleziono artysty", loading: "Wczytywanie…", error: "Nie udało się wczytać artysty", born: "Urodzony/a", aka: "Znany również jako", died: "Zmarł/a", active: "Aktywny/a", styles: "Style i gatunki", discography: "Dyskografia", songs: "Znane utwory", related: "Powiązani artyści", videos: "Oglądaj i słuchaj", gallery: "Galeria", links: "Linki zewnętrzne", articles: "Źródła", influences: "Inspiracje", legacy: "Wpływ muzyczny", family: "Rodzina i życie prywatne", formative: "Formacyjne doświadczenia", instruments: "Instrumenty i sprzęt", instrumentsShort: "Instrumenty", labelsShort: "Wytwórnie", anecdotes: "Historie i anegdoty", collaborators: "Współpracownicy", awards: "Nagrody i wyróżnienia", from: "z", musicians: "Muzycy", watch: "Oglądaj", press: "Prasa i cytaty", source: "Źródło", year: "Rok", title: "Tytuł", producer: "Producent", label: "Wytwórnia", chart: "Lista przebojów", sales: "Sprzedaż", notes: "Uwagi", featured: "Wyróżnione", deceasedBanner: "Tego artysty nie ma już wśród nas.", share: "Udostępnij profil", copied: "Link skopiowany!", aiImageNote: "Wygenerowana przez AI interpretacja historyczna — brak oryginalnej fotografii", catGuitar: "Gitara", catOther: "Inne", catVocals: "Wokal", watchOnYoutubePrefix: "Obejrzyj na YouTube:", watchVideoGeneric: "Obejrzyj wideo na YouTube", officialWebsite: "Oficjalna strona", concertReviews: "Recenzje koncertów i festiwali", booking: "Booking / Kontakt", bookingAgency: "Agencja bookingowa", bookingAgent: "Agent/management", bookingEmail: "E-mail bookingowy", bookingPhone: "Telefon bookingowy", bookingUrl: "URL bookingowy", notPubliclyAvailable: "Niedostępne publicznie", bookingUpdateNote: "Czy jesteś artystą, czy reprezentujesz zespół lub agencję bookingową? Chcemy, aby informacje o bookingu były zawsze poprawne i aktualne. Prześlij nam właściwe dane za pomocą naszego formularza kontaktowego, a zaktualizujemy profil najszybciej jak to możliwe.", contactLink: "Przejdź do formularza kontaktowego" },
} as const;



export function ArtistDetailView({ slug, locale }: { slug: string; locale: ArtistLocale }) {
  const lang = locale as Lang;
  const t = T[locale];
  const { data: a, loading, error } = useArtist(slug);
  const { data: all } = useArtists();
  const nameIndex = useNameIndex(all);
  const [concertReviews, setConcertReviews] = useState<ConcertReview[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchConcertReviewsByArtistSlug({ data: { slug } })
      .then((rows) => { if (!cancelled) setConcertReviews(rows); })
      .catch(() => { if (!cancelled) setConcertReviews([]); });
    return () => { cancelled = true; };
  }, [slug]);

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
  const short = pickLang(a, lang, "short");
  const influence = pickLang(a, lang, "influence");
  const eraLabel = pickLang(a, lang, "era_label");
  const signatureSongs = pickLangArray(a, lang, "signature_songs");
  const influences = pickLangArray(a, lang, "influences");
  const family = pickLangJsonb<FamilyEntry>(a, lang, "family");
  const formative = pickLangJsonb<string>(a, lang, "formative");
  const anecdotes = pickLangJsonb<string>(a, lang, "anecdotes");
  const instruments = pickLangJsonb<InstrumentEntry>(a, lang, "instruments");
  const collaborators = pickLangJsonb<CollaboratorEntry>(a, lang, "collaborators");
  const discography = pickLangJsonb<DiscographyEntry>(a, lang, "discography");
  const awards = pickLangJsonb<AwardEntry>(a, lang, "awards");
  const pressQuotes = pickLangJsonb<PressQuote>(a, lang, "press_quotes");
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
              {ownImg && a.image_credit && (
                <div className={`text-[10px] px-2 py-1.5 ${a.image_credit.toLowerCase().includes('ai-generated') ? 'bg-amber-500/10 border-t border-amber-500/30 text-amber-300' : 'bg-card/60 text-muted-foreground'}`}>
                  {a.image_credit.toLowerCase().includes('ai-generated') ? (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3" />
                      {t.aiImageNote}
                    </span>
                  ) : (
                    a.image_credit
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="inline-block text-xs tracking-[0.3em] text-gold uppercase px-3 py-1 rounded-md bg-gold/10 border border-gold/30">
                  {a.tag}{eraLabel && ` (${eraLabel})`}
                </div>
                <ShareButton locale={locale} slug={slug} label={t.share} copiedLabel={t.copied} />
              </div>
              <h1 id="top" className="font-display text-5xl md:text-6xl mb-3 leading-[1.05] gold-gradient-text">{a.name}</h1>
              {a.alt_name && <p className="text-muted-foreground mb-4">{t.aka}: {a.alt_name}</p>}
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
          <section id="biografi" className="max-w-3xl mx-auto scroll-mt-24">
            <article className="prose prose-invert max-w-none text-foreground/85 leading-relaxed text-lg whitespace-pre-line">
              {bio}
            </article>
          </section>
        )}

        {influence && (
          <Card title={t.legacy} icon={Sparkles}>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{influence}</p>
          </Card>
        )}

        {/* Influences */}
        {influences.length > 0 && (
          <Section icon={Star} title={t.influences} tone="amber">
            <div className="flex flex-wrap gap-2">
              {influences.map((inf, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 text-sm">{inf}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Family */}
        {family.length > 0 && (
          <Section icon={Users} title={t.family} tone="rose">
            <div className="grid md:grid-cols-2 gap-4">
              {family.map((f, i) => (
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

        {formative.length > 0 && (
          <Section icon={Star} title={t.formative} tone="amber">
            <ul className="space-y-3">
              {formative.map((f, i) => (
                <li key={i} className="flex gap-3 text-foreground/85 leading-relaxed">
                  <span className="text-amber-400 mt-2">•</span><span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {instruments.length > 0 && (
          <Section id="instrumenter" icon={Guitar} title={t.instruments} tone="gold">
            <div className="grid md:grid-cols-3 gap-5">
              {(["Gitar", "Annet", "Vokal"] as const).map((cat) => {
                const items = instruments.filter((i) => i.category === cat);
                if (items.length === 0) return null;
                const Ico = cat === "Gitar" ? Guitar : cat === "Vokal" ? Mic : Music;
                const catLabel = cat === "Gitar" ? t.catGuitar : cat === "Vokal" ? t.catVocals : t.catOther;
                return (
                  <div key={cat} className="border border-border rounded-xl p-5 bg-card/40">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="size-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center"><Ico className="size-4 text-gold" /></div>
                      <h3 className="font-display text-lg">{catLabel}</h3>
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

        {anecdotes.length > 0 && (
          <Section icon={Quote} title={t.anecdotes} tone="rose">
            <div className="grid md:grid-cols-2 gap-4">
              {anecdotes.map((q, i) => (
                <blockquote key={i} className="border border-border rounded-lg p-5 bg-card/40 text-foreground/80 italic leading-relaxed">"{q}"</blockquote>
              ))}
            </div>
          </Section>
        )}

        {collaborators.length > 0 && (
          <Section icon={Users} title={t.collaborators} tone="rose">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {collaborators.map((c, i) => (
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
          <Section id="videoer" icon={PlayCircle} title={t.videos} tone="gold">
            <VideoGrid videos={a.videos} fallbackIds={youtubeIds} featuredLabel={t.featured} watchOnYoutubePrefix={t.watchOnYoutubePrefix} watchVideoGeneric={t.watchVideoGeneric} />
          </Section>
        )}

        {/* Auto-fetched YouTube videos for this artist */}
        <ArtistYouTube artistName={a.name} title={t.videos} />

        {/* Press quotes & critic statements */}
        {pressQuotes.length > 0 && (
          <Section icon={Quote} title={t.press} tone="amber">
            <div className="grid md:grid-cols-2 gap-5">
              {pressQuotes.map((q, i) => (
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

        {/* Concert & festival reviews */}
        {concertReviews.length > 0 && (
          <Section icon={Calendar} title={t.concertReviews} tone="amber">
            <div className="grid md:grid-cols-2 gap-5">
              {concertReviews.map((r) => (
                <figure key={r.id} className="border border-amber-400/20 rounded-lg p-5 bg-amber-400/5">
                  <blockquote className="text-foreground/90 italic leading-relaxed mb-3">
                    "{r.quote_text}"
                    {r.quote_language && r.quote_language !== lang && (
                      <span className="ml-2 text-[10px] uppercase text-amber-300/70 not-italic">({r.quote_language})</span>
                    )}
                  </blockquote>
                  <figcaption className="text-sm text-muted-foreground">
                    <span className="text-amber-200 font-medium">{r.event_name}</span>
                    {(r.venue || r.city) && <span> · {[r.venue, r.city].filter(Boolean).join(", ")}</span>}
                    {(r.event_date || r.event_year) && <span> · {r.event_date ?? r.event_year}</span>}
                    <br />
                    {r.review_author && <span>{r.review_author}</span>}
                    {r.source_url ? (
                      <>
                        {" — "}
                        <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-100 underline underline-offset-4">
                          {r.publication_name ?? t.source}
                        </a>
                      </>
                    ) : (
                      r.publication_name && <span> — {r.publication_name}</span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>
        )}

        {/* Discography */}
        {discography.length > 0 && (
          <Section id="diskografi" icon={Disc3} title={t.discography} tone="gold">
            <DiscographyVideos>
              <div className="overflow-x-auto border border-border rounded-xl bg-card/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground border-b border-border">
                      <th className="p-3">{t.year}</th><th className="p-3">{t.title}</th><th className="p-3">{t.producer}</th><th className="p-3">{t.label}</th><th className="p-3">{t.chart}</th><th className="p-3">{t.sales}</th><th className="p-3">{t.musicians}</th><th className="p-3">YouTube</th><th className="p-3">{t.notes}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discography.map((d, i) => {
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
        {signatureSongs.length > 0 && (
          <Section icon={Music} title={t.songs} tone="gold">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {signatureSongs.map((s, i) => (
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

        {awards.length > 0 && (
          <Section icon={Award} title={t.awards} tone="gold">
            <div className="grid md:grid-cols-2 gap-4">
              {awards.map((w, i) => (
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
        {(a.website_url || Object.keys(a.social_links ?? {}).length > 0 || a.external_links.length > 0) && (
          <Section icon={Globe} title={t.links} tone="gold">
            <div className="flex flex-wrap gap-3">
              {a.website_url && (
                <a href={a.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-primary-foreground font-medium hover:brightness-110 transition text-sm">
                  <Globe className="size-3.5" /> {t.officialWebsite}
                </a>
              )}
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

        {/* Booking / contact — shown on every artist profile page, with an
            invitation to submit or correct booking details via the contact
            form, even before any booking_info has been researched. */}
        <Card title={t.booking} icon={Phone}>
          {a.booking_info && Object.keys(a.booking_info).length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
              <BookingField label={t.bookingAgency} value={a.booking_info.booking_agency} notAvailableLabel={t.notPubliclyAvailable} />
              <BookingField label={t.bookingAgent} value={a.booking_info.agent_name} notAvailableLabel={t.notPubliclyAvailable} />
              <BookingField label={t.bookingEmail} value={a.booking_info.booking_email} href={a.booking_info.booking_email ? `mailto:${a.booking_info.booking_email}` : undefined} notAvailableLabel={t.notPubliclyAvailable} />
              <BookingField label={t.bookingPhone} value={a.booking_info.booking_phone} href={a.booking_info.booking_phone ? `tel:${a.booking_info.booking_phone}` : undefined} notAvailableLabel={t.notPubliclyAvailable} />
              <BookingField label={t.bookingUrl} value={a.booking_info.booking_url} href={a.booking_info.booking_url ?? undefined} notAvailableLabel={t.notPubliclyAvailable} />
            </div>
          )}
          {a.booking_info?.note && <p className="text-xs text-muted-foreground mb-3 italic">{a.booking_info.note}</p>}
          {a.booking_info?.source_url && (
            <a href={a.booking_info.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline mb-3 inline-block">{t.source}</a>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 mt-1">
            {t.bookingUpdateNote}{" "}
            <Link to="/contact" className="text-gold hover:underline">{t.contactLink}</Link>
          </p>
        </Card>

        {a.article_references.length > 0 && (
          <Section id="kilder" icon={BookOpen} title={t.articles} tone="amber">
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

function ShareButton({ locale, slug, label, copiedLabel }: { locale: ArtistLocale; slug: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const path = artistDetailPath(locale, slug);
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={label}
      className="inline-flex items-center gap-1.5 text-xs tracking-wide px-3 py-1.5 rounded-md border border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 transition shrink-0"
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {copied ? copiedLabel : label}
    </button>
  );
}

function Section({ icon: Icon, title, tone = "gold", id, children }: { icon: any; title: string; tone?: "gold" | "rose" | "amber"; id?: string; children: React.ReactNode }) {
  const toneClass = tone === "rose" ? "text-rose-400" : tone === "amber" ? "text-amber-400" : "text-gold";
  return (
    <section id={id} className={id ? "scroll-mt-24" : undefined}>
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

function BookingField({ label, value, href, notAvailableLabel }: { label: string; value: string | null | undefined; href?: string; notAvailableLabel: string }) {
  if (value === undefined) return null; // not yet researched — show nothing
  return (
    <div>
      <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-1">{label}</div>
      {value === null ? (
        <div className="text-muted-foreground italic">{notAvailableLabel}</div>
      ) : href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-foreground/90 hover:text-gold underline underline-offset-4">{value}</a>
      ) : (
        <div className="text-foreground/90">{value}</div>
      )}
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="bg-card/60 border border-border rounded-xl p-6 max-w-3xl mx-auto">
      <h2 className="font-display text-xl mb-3 text-gold flex items-center gap-2">{Icon && <Icon className="size-5" />}{title}</h2>
      {children}
    </div>
  );
}



function VideoGrid({ videos, fallbackIds, featuredLabel, watchOnYoutubePrefix, watchVideoGeneric }: { videos: ArtistRecord["videos"]; fallbackIds: string[]; featuredLabel: string; watchOnYoutubePrefix: string; watchVideoGeneric: string }) {
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
            <a key={`${v.youtube_id}-${i}`} href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer" aria-label={v.title ? `${watchOnYoutubePrefix} ${v.title}` : watchVideoGeneric} className="group block border border-border rounded-lg overflow-hidden bg-card/40 hover:border-gold/60 transition">
              <div className="relative aspect-video bg-black">
                <img src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`} alt={v.title || ""} loading="lazy" className="size-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
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
