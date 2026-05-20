#!/usr/bin/env bun
/**
 * Find images for artists missing img.
 * Strategy:
 *   1. If artist has Wikipedia ref in article_references → query Wikipedia REST `pageimages` (license: usually CC/PD when sourced from Commons)
 *   2. Otherwise → search Wikimedia Commons directly by name and pick top file result (only image MIME)
 * Always credits Wikimedia Commons.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const UA = "SlowBlues-ImageHunter/1.0 (https://sslow-blues.lovable.app)";

const { data: artists, error } = await sb
  .from("artists")
  .select("slug,name,alt_name,country,article_references,external_links")
  .or("img.is.null,img.eq.")
  .order("slug");
if (error) throw error;
console.log(`Hunting images for ${artists!.length} artists...`);

function commonsUrl(filename: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`;
}
function commonsPage(filename: string) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`;
}

async function wikipediaThumb(wikiUrl: string): Promise<{ file: string; thumb: string } | null> {
  // wikiUrl like https://en.wikipedia.org/wiki/Albert_King
  const m = wikiUrl.match(/^https:\/\/([a-z]+)\.wikipedia\.org\/wiki\/(.+)$/);
  if (!m) return null;
  const [, lang, title] = m;
  const api = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&pithumbsize=1200&format=json&origin=*`;
  try {
    const r = await fetch(api, { headers: { "User-Agent": UA } });
    const j: any = await r.json();
    const pages = j?.query?.pages ?? {};
    for (const p of Object.values(pages) as any[]) {
      if (p?.thumbnail?.source && p?.pageimage) {
        return { file: p.pageimage, thumb: p.thumbnail.source };
      }
    }
  } catch {}
  return null;
}

async function commonsSearch(query: string): Promise<string | null> {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=mime|url`;
  try {
    const r = await fetch(api, { headers: { "User-Agent": UA } });
    const j: any = await r.json();
    const pages = j?.query?.pages ?? {};
    const candidates = Object.values(pages) as any[];
    candidates.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
    for (const p of candidates) {
      const info = p?.imageinfo?.[0];
      const title: string = p?.title ?? "";
      if (!info?.mime?.startsWith("image/")) continue;
      if (/\.(svg|pdf|tif|tiff)$/i.test(title)) continue;
      // strip "File:" prefix
      return title.replace(/^File:/, "");
    }
  } catch {}
  return null;
}

let updated = 0, skipped = 0;
const CONC = 4;
async function processOne(a: any) {
  // 1. Try Wikipedia pageimage
  const refs = (a.article_references ?? []) as any[];
  const wikiRef = refs.find((r) => typeof r?.url === "string" && r.url.includes("wikipedia.org/wiki/"));
  if (wikiRef) {
    const got = await wikipediaThumb(wikiRef.url);
    if (got) {
      await sb.from("artists").update({
        img: commonsUrl(got.file),
        image_credit: `Foto: Wikimedia Commons — ${got.file} (lisens via ${commonsPage(got.file)})`,
      }).eq("slug", a.slug);
      updated++;
      return;
    }
  }
  // 2. Commons search by name(s) — try a couple of focused queries
  const queries = [
    `${a.name} musician`,
    `${a.name} blues`,
    a.name,
    a.alt_name ? `${a.alt_name} musician` : null,
  ].filter(Boolean) as string[];
  for (const q of queries) {
    const file = await commonsSearch(q);
    if (file) {
      await sb.from("artists").update({
        img: commonsUrl(file),
        image_credit: `Foto: Wikimedia Commons — ${file} (lisens via ${commonsPage(file)})`,
      }).eq("slug", a.slug);
      updated++;
      return;
    }
  }
  skipped++;
}

for (let i = 0; i < artists!.length; i += CONC) {
  await Promise.all(artists!.slice(i, i + CONC).map(processOne));
  if (i % 40 === 0) console.log(`  ${i}/${artists!.length} (ok=${updated} skip=${skipped})`);
  await new Promise((r) => setTimeout(r, 100));
}
console.log(`Done. updated=${updated} skipped=${skipped}`);
