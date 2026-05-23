import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { PageShell } from "@/components/PageShell";
import { useServerFn } from "@tanstack/react-start";
import { searchWikidata, getWikidataArtist } from "@/lib/wikidata.functions";
import { searchYouTube } from "@/lib/youtube.functions";
import { ArrowLeft, Loader2, Sparkles, Check, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/artists/new")({
  component: NewArtistPage,
  head: () => ({ meta: [{ title: "Admin · Ny artist — SlowBlues" }, { name: "robots", content: "noindex" }] }),
});

const ERAS = ["Pre-War", "Post-War", "Electric", "Modern", "Contemporary"];
const TAGS = ["Modern", "Classic", "Legend", "Rising"];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const inputCls = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";
const labelCls = "block text-xs uppercase tracking-wide text-muted-foreground mb-1";

type EnrichLog = { step: string; ok: boolean; note?: string };

function NewArtistPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const wdSearch = useServerFn(searchWikidata);
  const wdGet = useServerFn(getWikidataArtist);
  const ytSearch = useServerFn(searchYouTube);

  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [slug, setSlug] = useState("");
  const [country, setCountry] = useState("USA");
  const [origin, setOrigin] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [born, setBorn] = useState("");
  const [died, setDied] = useState("");
  const [era, setEra] = useState("Modern");
  const [tag, setTag] = useState("Modern");
  const [shortBio, setShortBio] = useState("");

  const [busy, setBusy] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [log, setLog] = useState<EnrichLog[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const finalSlug = (slug || slugify(name)).trim();

  if (loading) return <PageShell><div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted-foreground">Laster…</div></PageShell>;
  if (user && !isAdmin) return <PageShell><div className="max-w-md mx-auto px-6 py-24 text-center text-muted-foreground">Ingen admin-tilgang.</div></PageShell>;

  const create = async () => {
    if (!name.trim() || !finalSlug) { setErr("Navn og slug er påkrevd."); return; }
    if (!country.trim() || !origin.trim()) { setErr("Land og opprinnelse (by/region) er påkrevd."); return; }
    setBusy(true); setErr(null);

    const row = {
      slug: finalSlug,
      name: name.trim(),
      alt_name: altName.trim() || null,
      country: country.trim(),
      origin: origin.trim(),
      birth_place: birthPlace.trim() || origin.trim(),
      born: born.trim() || null,
      died: died.trim() || null,
      era,
      tag,
      short_no: shortBio.trim() || null,
      region: country.trim() === "USA" ? "Americas" : "Europe",
      base_path: "/artists",
      sort_order: 0,
    };

    const { error } = await supabase.from("artists").insert(row as any);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setCreatedSlug(finalSlug);
  };

  const enrich = async () => {
    if (!createdSlug) return;
    setEnriching(true); setLog([]);
    const add = (e: EnrichLog) => setLog((l) => [...l, e]);
    const patch: Record<string, any> = {};

    // 1. Wikidata
    try {
      const res = await wdSearch({ data: { query: name, lang: "en", limit: 3 } });
      const hit = res.hits?.[0];
      if (!hit) { add({ step: "Wikidata-søk", ok: false, note: "Ingen treff" }); }
      else {
        add({ step: "Wikidata-søk", ok: true, note: `${hit.label} (${hit.qid})` });
        const f = await wdGet({ data: { qid: hit.qid, lang: "en" } });
        const facts = f.facts;
        if (!facts) { add({ step: "Wikidata-fakta", ok: false, note: f.error || "Tom" }); }
        else {
          if (facts.dateOfBirth && !born) patch.born = facts.dateOfBirth;
          if (facts.dateOfDeath && !died) patch.died = facts.dateOfDeath;
          if (facts.placeOfBirth?.label && !birthPlace) patch.birth_place = facts.placeOfBirth.label;
          if (facts.genres.length) patch.styles = facts.genres.map((g) => g.label).slice(0, 8);
          if (facts.instruments.length) patch.instruments_simple = facts.instruments.map((i) => i.label).slice(0, 6);
          if (facts.recordLabels.length) patch.labels = facts.recordLabels.map((l) => l.label).slice(0, 8);
          if (facts.imageUrl) { patch.img = facts.imageUrl; patch.og_image = facts.imageUrl; patch.image_credit = "Wikimedia Commons"; }
          const social: Record<string, string> = {};
          if (facts.officialWebsite) social.website = facts.officialWebsite;
          if (facts.externalIds.spotify) social.spotify = `https://open.spotify.com/artist/${facts.externalIds.spotify}`;
          if (facts.externalIds.youtubeChannel) social.youtube = `https://www.youtube.com/channel/${facts.externalIds.youtubeChannel}`;
          if (facts.externalIds.musicBrainz) social.musicbrainz = `https://musicbrainz.org/artist/${facts.externalIds.musicBrainz}`;
          if (facts.externalIds.discogs) social.discogs = `https://www.discogs.com/artist/${facts.externalIds.discogs}`;
          if (Object.keys(social).length) patch.social_links = social;
          const refs: Array<{ title?: string; url: string }> = [{ title: `Wikidata · ${facts.qid}`, url: facts.wikidataUrl }];
          if (facts.wikipediaUrl) refs.push({ title: "Wikipedia", url: facts.wikipediaUrl });
          patch.article_references = refs;
          add({ step: "Wikidata-fakta", ok: true, note: `${facts.genres.length} sjangre, ${facts.instruments.length} instrumenter, bilde: ${facts.imageUrl ? "ja" : "nei"}` });
        }
      }
    } catch (e) {
      add({ step: "Wikidata", ok: false, note: e instanceof Error ? e.message : "Feil" });
    }

    // 2. YouTube
    try {
      const yt = await ytSearch({ data: { query: `${name} live blues`, max: 6 } });
      if (yt.videos?.length) {
        patch.youtube_video_ids = yt.videos.map((v) => v.id).slice(0, 6);
        patch.video_search_query = `${name} live blues`;
        add({ step: "YouTube-søk", ok: true, note: `${yt.videos.length} videoer` });
      } else {
        add({ step: "YouTube-søk", ok: false, note: yt.error || "Ingen treff" });
      }
    } catch (e) {
      add({ step: "YouTube", ok: false, note: e instanceof Error ? e.message : "Feil" });
    }

    // 3. SEO defaults per språk
    const titleBase = `${name} — Blues-artist`;
    const descBase = shortBio.trim() || `${name} fra ${origin}, ${country}. Biografi, diskografi, videoer og innflytelse.`;
    if (!createdSlug) return;
    patch.seo_title_no = `${name} — Blues-portrett | SlowBlues`;
    patch.seo_title_sv = `${name} — Bluesporträtt | SlowBlues`;
    patch.seo_title_en = `${name} — Blues Portrait | SlowBlues`;
    patch.seo_title_de = `${name} — Blues-Porträt | SlowBlues`;
    patch.seo_description_no = descBase.slice(0, 158);
    patch.seo_description_sv = descBase.slice(0, 158);
    patch.seo_description_en = `${name} from ${origin}, ${country}. Biography, discography, videos and influence on blues.`.slice(0, 158);
    patch.seo_description_de = `${name} aus ${origin}, ${country}. Biografie, Diskografie, Videos und Einfluss auf den Blues.`.slice(0, 158);
    add({ step: "SEO-felt (no/sv/en/de)", ok: true, note: "Maler satt — finpuss i admin" });

    // Save patch
    const { error } = await supabase.from("artists").update(patch).eq("slug", createdSlug);
    if (error) add({ step: "Lagring", ok: false, note: error.message });
    else add({ step: "Lagring", ok: true, note: "Berikelse fullført" });

    setEnriching(false);
  };

  return (
    <PageShell>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-5">
          <Link to="/admin" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
            <ArrowLeft className="size-4" /> Admin
          </Link>
          <Link to="/admin/artists" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:border-gold">
            <ArrowLeft className="size-4" /> Liste
          </Link>
        </div>

        <h1 className="font-display text-3xl text-gold mb-2">Ny artist</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Fyll inn dine kjernedata. Etter lagring kan du trykke <strong>Fullfør fra kilder</strong> — da hentes
          fakta, bilde, sjangere, instrumenter, plateselskap, sosiale lenker og YouTube-videoer automatisk fra
          Wikidata og YouTube, og SEO-felt fylles inn for alle fire språk.
        </p>

        {err && <div className="mb-4 px-3 py-2 rounded-md bg-red-500/10 text-red-300 text-sm">{err}</div>}

        {!createdSlug && (
          <div className="space-y-4 bg-card/40 border border-border rounded-lg p-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Navn *</label>
                <input value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} className={inputCls} placeholder="John Lee Hooker" />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className={inputCls} placeholder="john-lee-hooker" />
                <p className="text-[10px] text-muted-foreground mt-1">URL: /artists/{finalSlug || "…"}</p>
              </div>
              <div>
                <label className={labelCls}>Alternativt navn</label>
                <input value={altName} onChange={(e) => setAltName(e.target.value)} className={inputCls} placeholder="Boom Boom" />
              </div>
              <div>
                <label className={labelCls}>Land *</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} placeholder="USA" />
              </div>
              <div>
                <label className={labelCls}>Opprinnelse (by/stat) *</label>
                <input value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputCls} placeholder="Clarksdale, Mississippi" />
              </div>
              <div>
                <label className={labelCls}>Fødested</label>
                <input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} className={inputCls} placeholder="(samme som opprinnelse hvis tom)" />
              </div>
              <div>
                <label className={labelCls}>Født (YYYY eller YYYY-MM-DD)</label>
                <input value={born} onChange={(e) => setBorn(e.target.value)} className={inputCls} placeholder="1917-08-22" />
              </div>
              <div>
                <label className={labelCls}>Død (valgfri)</label>
                <input value={died} onChange={(e) => setDied(e.target.value)} className={inputCls} placeholder="2001-06-21" />
              </div>
              <div>
                <label className={labelCls}>Æra</label>
                <select value={era} onChange={(e) => setEra(e.target.value)} className={inputCls}>
                  {ERAS.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tag</label>
                <select value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls}>
                  {TAGS.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Kort beskrivelse (norsk, brukes som SEO-fallback)</label>
              <textarea value={shortBio} onChange={(e) => setShortBio(e.target.value)} rows={3} className={inputCls} placeholder="En kort setning på norsk om artistens betydning." />
            </div>
            <div className="flex justify-end">
              <button onClick={create} disabled={busy} className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-semibold disabled:opacity-60 inline-flex items-center gap-2">
                {busy && <Loader2 className="size-4 animate-spin" />} Opprett artist
              </button>
            </div>
          </div>
        )}

        {createdSlug && (
          <div className="space-y-5">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-sm text-emerald-200">
              ✓ Artist opprettet med slug <code className="font-mono">{createdSlug}</code>.
            </div>

            <div className="bg-card/40 border border-gold/30 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="size-5 text-gold mt-0.5" />
                <div>
                  <h2 className="font-display text-xl text-gold">Fullfør fra kilder</h2>
                  <p className="text-sm text-muted-foreground">
                    Henter: Wikidata-fakta (datoer, sted, sjangere, instrumenter, plateselskap, ID-er) + Wikimedia-bilde +
                    YouTube-videoer + setter SEO-maler på no/sv/en/de. Eksisterende manuelt utfylte felt overskrives ikke.
                  </p>
                </div>
              </div>
              <button onClick={enrich} disabled={enriching} className="px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-semibold disabled:opacity-60 inline-flex items-center gap-2">
                {enriching ? <><Loader2 className="size-4 animate-spin" /> Henter…</> : <><Sparkles className="size-4" /> Fullfør fra kilder</>}
              </button>

              {log.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {log.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {e.ok ? <Check className="size-4 text-emerald-400 mt-0.5" /> : <AlertTriangle className="size-4 text-amber-400 mt-0.5" />}
                      <span className="font-medium">{e.step}:</span>
                      <span className="text-muted-foreground">{e.note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/admin/artists/$slug" params={{ slug: createdSlug }} className="px-4 py-2 rounded-md border border-gold/40 text-sm text-gold hover:border-gold">
                Åpne redigering →
              </Link>
              <Link to="/admin/seo" className="px-4 py-2 rounded-md border border-border text-sm hover:border-gold">
                Sjekk SEO →
              </Link>
              <button
                onClick={() => { setCreatedSlug(null); setName(""); setSlug(""); setAltName(""); setOrigin(""); setBirthPlace(""); setBorn(""); setDied(""); setShortBio(""); setLog([]); navigate({ to: "/admin/artists/new" }); }}
                className="px-4 py-2 rounded-md border border-border text-sm hover:border-gold"
              >
                + Ny til
              </button>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
