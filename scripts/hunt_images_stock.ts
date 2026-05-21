#!/usr/bin/env bun
/**
 * Backfill img for artists where Wikipedia/Commons came up empty.
 * Tries Unsplash → Pexels → Pixabay, but ONLY accepts a photo whose
 * description/alt/tags contain the artist's first or last name.
 * Wrong-person photos are worse than a placeholder, so we skip ambiguous hits.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY!;
const PEXELS = process.env.PEXELS_API_KEY!;
const PIXABAY = process.env.PIXABAY_API_KEY!;

const { data: artists, error } = await sb
  .from("artists")
  .select("slug,name,alt_name,instruments_simple")
  .or("img.is.null,img.eq.")
  .order("slug");
if (error) throw error;
console.log(`Stock hunt for ${artists!.length} artists...`);

function nameTokens(name: string): string[] {
  return name
    .replace(/["'’`]/g, "")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !/^(the|and|band|trio|big|jr|sr)$/i.test(t))
    .map((t) => t.toLowerCase());
}
function matchesArtist(text: string, tokens: string[]): boolean {
  const t = text.toLowerCase();
  return tokens.some((tok) => t.includes(tok));
}

async function tryUnsplash(query: string, tokens: string[]) {
  const r = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH}` } },
  );
  if (!r.ok) return null;
  const j: any = await r.json();
  for (const p of j.results ?? []) {
    const text = `${p.description ?? ""} ${p.alt_description ?? ""} ${(p.tags ?? []).map((t: any) => t.title).join(" ")}`;
    if (matchesArtist(text, tokens)) {
      return {
        img: p.urls.regular as string,
        credit: `Foto: ${p.user.name} on Unsplash`,
      };
    }
  }
  return null;
}

async function tryPexels(query: string, tokens: string[]) {
  const r = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`,
    { headers: { Authorization: PEXELS } },
  );
  if (!r.ok) return null;
  const j: any = await r.json();
  for (const p of j.photos ?? []) {
    const text = `${p.alt ?? ""} ${p.photographer ?? ""}`;
    if (matchesArtist(text, tokens)) {
      return {
        img: p.src.large as string,
        credit: `Foto: ${p.photographer} on Pexels`,
      };
    }
  }
  return null;
}

async function tryPixabay(query: string, tokens: string[]) {
  const r = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY}&q=${encodeURIComponent(query)}&per_page=20&image_type=photo&safesearch=true`,
  );
  if (!r.ok) return null;
  const j: any = await r.json();
  for (const p of j.hits ?? []) {
    if (matchesArtist(`${p.tags ?? ""} ${p.user ?? ""}`, tokens)) {
      return {
        img: p.largeImageURL as string,
        credit: `Foto: ${p.user} on Pixabay`,
      };
    }
  }
  return null;
}

let updated = 0, skipped = 0;
const failed: string[] = [];

for (const a of artists!) {
  const tokens = nameTokens(a.name);
  const instr = (a.instruments_simple ?? [])[0] ?? "blues";
  const queries = [
    `${a.name} blues musician`,
    `${a.name} ${instr}`,
    a.name,
  ];

  let hit: { img: string; credit: string } | null = null;
  for (const q of queries) {
    hit = (await tryUnsplash(q, tokens)) ||
          (await tryPexels(q, tokens)) ||
          (await tryPixabay(q, tokens));
    if (hit) break;
  }

  if (hit) {
    await sb.from("artists").update({ img: hit.img, image_credit: hit.credit }).eq("slug", a.slug);
    console.log(`  ✓ ${a.slug} → ${hit.credit}`);
    updated++;
  } else {
    failed.push(a.slug);
    skipped++;
  }
  await new Promise((r) => setTimeout(r, 250));
}

console.log(`\nDone. updated=${updated} skipped=${skipped}`);
if (failed.length) console.log(`No verified image found for:\n  ${failed.join("\n  ")}`);
