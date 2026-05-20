/* Enrich Supabase artists from zip data. Run with bun. */
import { createClient } from "@supabase/supabase-js";

const ZIP = "/tmp/audit/slow-blues-copilot-full-project-audit/src/data";

const files = [
  "scandinavianArtists",
  "britishArtists",
  "europeanArtists",
  "europeanArtistsExpanded",
  "europeanArtistsWave2",
  "europeanArtistsWave3",
  "africanArtists",
  "australianArtists",
  "canadianArtists",
  "modernAmericanArtists",
  "artists",
];

const exportNames: Record<string, string> = {
  scandinavianArtists: "scandinavianArtists",
  britishArtists: "britishArtists",
  europeanArtists: "europeanArtists",
  europeanArtistsExpanded: "europeanArtistsExpanded",
  europeanArtistsWave2: "europeanArtistsWave2",
  europeanArtistsWave3: "europeanArtistsWave3",
  africanArtists: "africanArtists",
  australianArtists: "australianArtists",
  canadianArtists: "canadianArtists",
  modernAmericanArtists: "modernAmericanArtists",
  artists: "artists",
};

type AnyArtist = Record<string, any>;

async function loadAll(): Promise<AnyArtist[]> {
  const all: AnyArtist[] = [];
  for (const f of files) {
    try {
      const mod = await import(`${ZIP}/${f}.ts`);
      const arr = mod[exportNames[f]];
      if (Array.isArray(arr)) {
        console.log(`  ${f}: ${arr.length}`);
        all.push(...arr);
      } else {
        console.warn(`  ${f}: export "${exportNames[f]}" not an array`);
      }
    } catch (e) {
      console.warn(`  ${f}: failed to import:`, (e as Error).message);
    }
  }
  return all;
}

function pickDiscography(zipArtist: AnyArtist) {
  const rec = zipArtist.keyRecordings ?? zipArtist.recordings ?? zipArtist.discography ?? [];
  if (!Array.isArray(rec)) return [];
  return rec.map((r: any) => ({
    year: r.year,
    title: r.title,
    label: r.label,
    producer: r.producer,
    composers: Array.isArray(r.composers) ? r.composers.map((c: any) => c.name).join(", ") : r.composers,
    chart_position: r.chartPosition ?? r.chart_position ?? r.chart,
    sales_estimate: r.sales ?? r.sales_estimate,
    notes: r.notesNo ?? r.notes,
    musicians: Array.isArray(r.musicians)
      ? r.musicians.map((m: any) => ({ name: m.name, instrument: m.instrument }))
      : undefined,
    youtube_id: r.youtubeVideoId ?? r.youtube_id,
  })).filter((r: any) => r.title);
}

function pickFamily(zipArtist: AnyArtist) {
  const fam = zipArtist.family ?? [];
  if (!Array.isArray(fam)) return [];
  return fam.map((f: any) => ({
    relation: f.relationship ?? f.relation,
    name: f.name,
    note: f.notes ?? f.note,
  })).filter((f: any) => f.name && f.relation);
}

function pickCollaborators(zipArtist: AnyArtist) {
  const c = zipArtist.collaborators ?? [];
  if (!Array.isArray(c)) return [];
  return c.map((x: any) => ({
    name: x.name,
    years: x.period ?? x.years,
    note: x.context ?? x.note,
  })).filter((x: any) => x.name);
}

function pickSocialLinks(zipArtist: AnyArtist) {
  const s = zipArtist.socialLinks ?? {};
  // Strip spotify entirely
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(s)) {
    if (k.toLowerCase() === "spotify") continue;
    if (typeof v === "string" && v.length > 0) out[k] = v;
  }
  return out;
}

// Extract press quotes from biographyEn text using common patterns
function extractPressQuotes(zipArtist: AnyArtist) {
  const text = zipArtist.biographyEn ?? "";
  if (typeof text !== "string" || text.length < 50) return [];
  const quotes: any[] = [];
  // Pattern 1: "X magazine called him/her/them 'Y'"
  const re1 = /([A-Z][A-Za-z &]+(?:magazine|Magazine|Times|Post|News|Tribune|Guardian|Journal|Review))\s+(?:called|described|named|hailed|praised)[^"'`]{0,40}["'`]([^"'`]{15,300})["'`]/g;
  let m: RegExpExecArray | null;
  while ((m = re1.exec(text)) !== null) {
    quotes.push({ quote: m[2].trim(), author: m[1].trim(), role: "Music press" });
  }
  // Pattern 2: According to X, "Y"
  const re2 = /(?:According to|As\s+)([A-Z][A-Za-z &]+),?\s+["'`]([^"'`]{15,300})["'`]/g;
  while ((m = re2.exec(text)) !== null) {
    quotes.push({ quote: m[2].trim(), author: m[1].trim() });
  }
  // Dedup
  const seen = new Set<string>();
  return quotes.filter((q) => {
    const k = q.quote.slice(0, 50);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 6);
}

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(SUPABASE_URL, SERVICE, { auth: { persistSession: false } });

async function main() {
  console.log("Loading zip data:");
  const zipArtists = await loadAll();
  console.log(`Total zip artists: ${zipArtists.length}`);

  console.log("Loading existing DB rows…");
  const { data: dbRows, error } = await sb
    .from("artists")
    .select("id, slug, discography, family, collaborators, social_links, youtube_video_ids, website_url, facebook_url, press_quotes");
  if (error) throw error;
  const bySlug = new Map((dbRows ?? []).map((r) => [r.slug, r]));
  console.log(`DB artists: ${dbRows?.length ?? 0}`);

  let matched = 0;
  let updated = 0;
  let skipped = 0;
  const unmatched: string[] = [];

  for (const z of zipArtists) {
    const slug = z.id;
    if (!slug) { skipped++; continue; }
    const dbRow = bySlug.get(slug);
    if (!dbRow) { unmatched.push(slug); continue; }
    matched++;

    const zipDisco = pickDiscography(z);
    const zipFamily = pickFamily(z);
    const zipCollab = pickCollaborators(z);
    const zipSocial = pickSocialLinks(z);
    const zipYoutube: string[] = Array.isArray(z.youtubeVideoIds) ? z.youtubeVideoIds : [];
    const zipQuotes = extractPressQuotes(z);

    const update: any = {};

    // Discography: prefer zip if it has more entries OR if zip entries carry musicians/chart/sales that DB lacks
    const currentDisco = Array.isArray(dbRow.discography) ? dbRow.discography : [];
    const zipHasRicher = zipDisco.some((d: any) => d.musicians || d.chart_position || d.sales_estimate);
    if (zipDisco.length > 0 && (zipDisco.length > currentDisco.length || zipHasRicher)) {
      update.discography = zipDisco;
    }

    // Family: replace if zip has more
    const currentFamily = Array.isArray(dbRow.family) ? dbRow.family : [];
    if (zipFamily.length > currentFamily.length) update.family = zipFamily;

    // Collaborators: merge by name
    const currentCollab = Array.isArray(dbRow.collaborators) ? dbRow.collaborators : [];
    const namesC = new Set(currentCollab.map((c: any) => c.name));
    const mergedCollab = [...currentCollab, ...zipCollab.filter((c: any) => !namesC.has(c.name))];
    if (mergedCollab.length > currentCollab.length) update.collaborators = mergedCollab;

    // social_links: strip spotify, fill missing
    const currentSocial = (dbRow.social_links ?? {}) as Record<string, string>;
    const cleanedSocial: Record<string, string> = {};
    for (const [k, v] of Object.entries(currentSocial)) {
      if (k.toLowerCase() === "spotify") continue;
      if (typeof v === "string" && v) cleanedSocial[k] = v;
    }
    for (const [k, v] of Object.entries(zipSocial)) {
      if (!cleanedSocial[k]) cleanedSocial[k] = v;
    }
    const socialChanged = JSON.stringify(cleanedSocial) !== JSON.stringify(currentSocial);
    if (socialChanged) update.social_links = cleanedSocial;

    // website_url / facebook_url backfill
    if (!dbRow.website_url && cleanedSocial.website) update.website_url = cleanedSocial.website;
    if (!dbRow.facebook_url && cleanedSocial.facebook) update.facebook_url = cleanedSocial.facebook;

    // youtube_video_ids: merge unique
    const currentYT: string[] = Array.isArray(dbRow.youtube_video_ids) ? dbRow.youtube_video_ids : [];
    const ytMerged = Array.from(new Set([...currentYT, ...zipYoutube]));
    if (ytMerged.length > currentYT.length) update.youtube_video_ids = ytMerged;

    // press_quotes: only add if DB has none
    const currentQuotes = Array.isArray(dbRow.press_quotes) ? dbRow.press_quotes : [];
    if (currentQuotes.length === 0 && zipQuotes.length > 0) update.press_quotes = zipQuotes;

    if (Object.keys(update).length === 0) continue;

    const { error: upErr } = await sb.from("artists").update(update).eq("id", dbRow.id);
    if (upErr) {
      console.error(`Failed update ${slug}:`, upErr.message);
    } else {
      updated++;
      console.log(`✓ ${slug} — ${Object.keys(update).join(", ")}`);
    }
  }

  console.log(`\n— Done —`);
  console.log(`Matched:    ${matched}`);
  console.log(`Updated:    ${updated}`);
  console.log(`Unmatched:  ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log(`Unmatched slugs: ${unmatched.slice(0, 30).join(", ")}${unmatched.length > 30 ? " …" : ""}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
