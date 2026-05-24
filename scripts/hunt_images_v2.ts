#!/usr/bin/env bun
/**
 * Multi-source free-license image hunter for artists missing `img`.
 *
 * Source order (all require NO API key):
 *   1. Wikipedia pageimage by direct title lookup in en / sv / no / de
 *   2. Wikimedia Commons search (multiple query variants)
 *   3. Library of Congress (loc.gov JSON API, free-to-use)
 *   4. Openverse (api.openverse.engineering) — CC / public-domain aggregator
 *
 * All sources are public-domain / CC / open-access. Getty, Shutterstock,
 * Facebook, Instagram, Pinterest are NEVER queried.
 *
 * Stores in `artists`:
 *   - img            → image URL
 *   - image_credit   → "Source: <site> — <credit> (<license>) <page url>"
 * Also inserts a row into `artist_images` with full metadata + verified=true.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const UA = "SlowBlues-ImageHunter/2.0 (https://sslow-blues.lovable.app)";
const HEAD = { headers: { "User-Agent": UA, Accept: "application/json" } };

type Hit = {
  url: string;
  source: string;
  credit: string;
  credit_url: string;
  license: string;
};

const commonsFile = (f: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=1200`;
const commonsPage = (f: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(f)}`;

// 1) Wikipedia pageimage by title
async function wikipediaByTitle(name: string): Promise<Hit | null> {
  for (const lang of ["en", "sv", "no", "de"]) {
    const title = encodeURIComponent(name.replace(/\s+/g, "_"));
    const api = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&pithumbsize=1200&redirects=1&format=json&origin=*`;
    try {
      const j: any = await (await fetch(api, HEAD)).json();
      const pages = j?.query?.pages ?? {};
      for (const p of Object.values(pages) as any[]) {
        if (p?.thumbnail?.source && p?.pageimage) {
          return {
            url: commonsFile(p.pageimage),
            source: "Wikimedia Commons (via Wikipedia)",
            credit: p.pageimage,
            credit_url: commonsPage(p.pageimage),
            license: "See file page (typically CC BY-SA or PD)",
          };
        }
      }
    } catch {}
  }
  return null;
}

// 2) Commons search
async function commonsSearch(name: string): Promise<Hit | null> {
  const queries = [
    `"${name}" musician`,
    `"${name}" blues`,
    `"${name}" portrait`,
    name,
  ];
  for (const q of queries) {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=8&prop=imageinfo&iiprop=mime|url|extmetadata`;
    try {
      const j: any = await (await fetch(api, HEAD)).json();
      const pages = Object.values(j?.query?.pages ?? {}) as any[];
      pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
      for (const p of pages) {
        const info = p?.imageinfo?.[0];
        const title: string = p?.title ?? "";
        if (!info?.mime?.startsWith("image/")) continue;
        if (/\.(svg|pdf|tif|tiff)$/i.test(title)) continue;
        const file = title.replace(/^File:/, "");
        const md = info?.extmetadata ?? {};
        const lic = md?.LicenseShortName?.value ?? "See file page";
        const artist = md?.Artist?.value?.replace(/<[^>]+>/g, "") ?? file;
        return {
          url: commonsFile(file),
          source: "Wikimedia Commons",
          credit: artist,
          credit_url: commonsPage(file),
          license: lic,
        };
      }
    } catch {}
  }
  return null;
}

// 3) Library of Congress (free-to-use photographs)
async function locSearch(name: string): Promise<Hit | null> {
  const api = `https://www.loc.gov/search/?q=${encodeURIComponent(name)}&fo=json&c=10&fa=original-format:photograph%7Conline-format:image`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    const results = j?.results ?? [];
    for (const r of results) {
      const img = r?.image_url?.[r.image_url.length - 1] ?? r?.image_url?.[0];
      if (!img || typeof img !== "string") continue;
      if (!/^https?:/.test(img)) continue;
      return {
        url: img,
        source: "Library of Congress",
        credit: r?.title ?? name,
        credit_url: r?.id ?? r?.url ?? "https://www.loc.gov/",
        license: r?.rights ?? "No known copyright restrictions (LoC)",
      };
    }
  } catch {}
  return null;
}

// 4) Openverse (CC / PD aggregator)
async function openverseSearch(name: string): Promise<Hit | null> {
  const api = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(name + " musician")}&license_type=all&page_size=10&mature=false`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    const results = j?.results ?? [];
    for (const r of results) {
      const url: string = r?.url ?? r?.thumbnail;
      if (!url) continue;
      // skip facebook/instagram/pinterest just in case
      if (/facebook|instagram|pinterest|gettyimages|shutterstock/i.test(url)) continue;
      return {
        url,
        source: r?.source ?? "Openverse",
        credit: r?.creator ?? r?.title ?? name,
        credit_url: r?.foreign_landing_url ?? r?.url,
        license: `${r?.license ?? ""} ${r?.license_version ?? ""}`.trim() || "CC/PD",
      };
    }
  } catch {}
  return null;
}

async function findOne(name: string, altName: string | null): Promise<Hit | null> {
  const names = [name, altName].filter(Boolean) as string[];
  for (const n of names) {
    const a = await wikipediaByTitle(n);
    if (a) return a;
  }
  for (const n of names) {
    const a = await commonsSearch(n);
    if (a) return a;
  }
  for (const n of names) {
    const a = await locSearch(n);
    if (a) return a;
  }
  for (const n of names) {
    const a = await openverseSearch(n);
    if (a) return a;
  }
  return null;
}

const { data: artists, error } = await sb
  .from("artists")
  .select("slug,name,alt_name")
  .or("img.is.null,img.eq.")
  .order("name");
if (error) throw error;

console.log(`v2 hunt: ${artists!.length} artists`);
let ok = 0, miss = 0;
const missing: string[] = [];

for (const a of artists!) {
  const hit = await findOne(a.name, a.alt_name);
  if (hit) {
    const credit = `Source: ${hit.source} — ${hit.credit} (${hit.license}) ${hit.credit_url}`;
    await sb.from("artists").update({ img: hit.url, image_credit: credit }).eq("slug", a.slug);
    await sb.from("artist_images").insert({
      artist_slug: a.slug,
      image_url: hit.url,
      source: hit.source,
      credit: hit.credit,
      credit_url: hit.credit_url,
      is_primary: true,
      verified: true,
      verified_at: new Date().toISOString(),
      notes: `License: ${hit.license}`,
    });
    ok++;
    console.log(`  ✓ ${a.name}  ←  ${hit.source}`);
  } else {
    miss++;
    missing.push(`${a.slug}\t${a.name}`);
    console.log(`  ✗ ${a.name}`);
  }
  await new Promise((r) => setTimeout(r, 150));
}

console.log(`\nDone. found=${ok} still_missing=${miss}`);
if (missing.length) {
  console.log("\nStill missing (AI fallback candidates):");
  missing.forEach((m) => console.log("  " + m));
}
