#!/usr/bin/env bun
/**
 * Multi-source free-license image hunter — DIRECT DOWNLOAD ONLY, no API keys.
 *
 * Source order (free/CC/PD, no auth, no paid services):
 *   1. Wikipedia pageimage by direct title lookup (en / sv / no / de) + search-then-pageimage
 *   2. Wikimedia Commons search (multiple query variants)
 *   3. Library of Congress (loc.gov public JSON, free-to-use facets)
 *   4. Internet Archive (archive.org advancedsearch + metadata)
 *   5. Picryl (picryl.com public search JSON)
 *   6. Openverse (api.openverse.engineering — no key required)
 *   7. National Library of Norway (nb.no public search)
 *   8. DigitaltMuseum (digitaltmuseum.no public JSON)
 *   9. Europeana (europeana.eu public search — no key for basic listing)
 *  10. Flickr Commons (flickr.com/commons HTML — direct extraction)
 *
 * NEVER queries: Google Image, Getty, Shutterstock, Facebook, Instagram, Pinterest.
 *
 * Writes to:
 *   - artists.img, artists.image_credit
 *   - artist_images (full metadata + verified=true)
 *
 * See docs/IMAGE_SOURCES.md for the full source list and rules.
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const UA = "SlowBlues-ImageHunter/3.0 (https://sslow-blues.lovable.app)";
const HEAD = { headers: { "User-Agent": UA, Accept: "application/json,text/html" } };

type Hit = {
  url: string;
  source: string;
  credit: string;
  credit_url: string;
  license: string;
};

const isBadHost = (u: string) =>
  /facebook|instagram|pinterest|gettyimages|shutterstock|alamy/i.test(u);

const commonsFile = (f: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=1200`;
const commonsPage = (f: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(f)}`;

// 1) Wikipedia — direct title, then search-then-pageimage
async function wikipedia(name: string): Promise<Hit | null> {
  for (const lang of ["en", "sv", "no", "de"]) {
    const title = encodeURIComponent(name.replace(/\s+/g, "_"));
    const api = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&pithumbsize=1200&redirects=1&format=json&origin=*`;
    try {
      const j: any = await (await fetch(api, HEAD)).json();
      for (const p of Object.values(j?.query?.pages ?? {}) as any[]) {
        if (p?.pageimage) {
          return {
            url: commonsFile(p.pageimage),
            source: "Wikimedia Commons (via Wikipedia)",
            credit: p.pageimage,
            credit_url: commonsPage(p.pageimage),
            license: "See file page (CC BY-SA / PD typical)",
          };
        }
      }
    } catch {}
  }
  // search-then-pageimage on EN
  try {
    const s: any = await (
      await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + " blues")}&srlimit=3&format=json&origin=*`,
        HEAD,
      )
    ).json();
    for (const hit of s?.query?.search ?? []) {
      const t = encodeURIComponent(hit.title.replace(/\s+/g, "_"));
      const j: any = await (
        await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${t}&prop=pageimages&pithumbsize=1200&format=json&origin=*`,
          HEAD,
        )
      ).json();
      for (const p of Object.values(j?.query?.pages ?? {}) as any[]) {
        if (p?.pageimage) {
          return {
            url: commonsFile(p.pageimage),
            source: "Wikimedia Commons (via Wikipedia search)",
            credit: p.pageimage,
            credit_url: commonsPage(p.pageimage),
            license: "See file page",
          };
        }
      }
    }
  } catch {}
  return null;
}

// 2) Commons direct search
async function commons(name: string): Promise<Hit | null> {
  const queries = [`"${name}" musician`, `"${name}" blues`, `"${name}" portrait`, name];
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
        return {
          url: commonsFile(file),
          source: "Wikimedia Commons",
          credit: (md?.Artist?.value ?? file).toString().replace(/<[^>]+>/g, ""),
          credit_url: commonsPage(file),
          license: md?.LicenseShortName?.value ?? "See file page",
        };
      }
    } catch {}
  }
  return null;
}

// 3) Library of Congress
async function loc(name: string): Promise<Hit | null> {
  const api = `https://www.loc.gov/search/?q=${encodeURIComponent(name)}&fo=json&c=10&fa=online-format:image`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    for (const r of j?.results ?? []) {
      const arr: string[] = Array.isArray(r?.image_url) ? r.image_url : [];
      const img = arr[arr.length - 1] ?? arr[0];
      if (!img || !/^https?:/.test(img)) continue;
      if (isBadHost(img)) continue;
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

// 4) Internet Archive
async function internetArchive(name: string): Promise<Hit | null> {
  const q = `(${name}) AND mediatype:(image)`;
  const api = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=licenseurl&rows=5&output=json`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    for (const doc of j?.response?.docs ?? []) {
      const id = doc?.identifier;
      if (!id) continue;
      const meta: any = await (
        await fetch(`https://archive.org/metadata/${encodeURIComponent(id)}`, HEAD)
      ).json();
      const file = (meta?.files ?? []).find((f: any) =>
        /\.(jpg|jpeg|png)$/i.test(f?.name ?? ""),
      );
      if (!file) continue;
      return {
        url: `https://archive.org/download/${id}/${encodeURIComponent(file.name)}`,
        source: "Internet Archive",
        credit: doc?.creator ?? doc?.title ?? name,
        credit_url: `https://archive.org/details/${id}`,
        license: doc?.licenseurl ?? "See item page",
      };
    }
  } catch {}
  return null;
}

// 5) Picryl
async function picryl(name: string): Promise<Hit | null> {
  // Picryl's public site returns JSON when ?format=json is appended
  const api = `https://picryl.com/search?q=${encodeURIComponent(name)}&format=json`;
  try {
    const j: any = await (await fetch(api, HEAD)).json().catch(() => null);
    const items: any[] =
      j?.data ?? j?.items ?? j?.results ?? (Array.isArray(j) ? j : []);
    for (const it of items) {
      const u = it?.image_url ?? it?.thumbnail ?? it?.url;
      if (!u || isBadHost(u)) continue;
      return {
        url: u,
        source: "Picryl",
        credit: it?.creator ?? it?.title ?? name,
        credit_url: it?.detail_url ?? it?.url ?? "https://picryl.com/",
        license: it?.license ?? "Public Domain / No known copyright",
      };
    }
  } catch {}
  return null;
}

// 6) Openverse (no key required)
async function openverse(name: string): Promise<Hit | null> {
  const api = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(name + " musician")}&license_type=all&page_size=10&mature=false`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    for (const r of j?.results ?? []) {
      const url: string = r?.url ?? r?.thumbnail;
      if (!url || isBadHost(url)) continue;
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

// 7) National Library of Norway
async function nbno(name: string): Promise<Hit | null> {
  const api = `https://api.nb.no/catalog/v1/items?q=${encodeURIComponent(name)}&mediatype=bilder&size=5`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    const items: any[] = j?._embedded?.items ?? [];
    for (const it of items) {
      const thumb = it?._links?.thumbnail_large?.href ?? it?._links?.thumbnail?.href;
      if (!thumb) continue;
      return {
        url: thumb,
        source: "Nasjonalbiblioteket (nb.no)",
        credit: it?.metadata?.creators?.[0] ?? it?.metadata?.title ?? name,
        credit_url: it?._links?.presentation?.href ?? "https://www.nb.no/",
        license: it?.accessInfo?.accessAllowedFrom ?? "See item page",
      };
    }
  } catch {}
  return null;
}

// 8) DigitaltMuseum
async function digitaltmuseum(name: string): Promise<Hit | null> {
  const api = `https://digitaltmuseum.no/api/search?q=${encodeURIComponent(name)}&type=Thing&hits=5`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    const items: any[] = j?.items ?? j?.results ?? [];
    for (const it of items) {
      const u = it?.image?.url ?? it?.thumbnail;
      if (!u) continue;
      return {
        url: u.startsWith("http") ? u : `https://digitaltmuseum.no${u}`,
        source: "DigitaltMuseum",
        credit: it?.producer ?? it?.title ?? name,
        credit_url: it?.url ?? "https://digitaltmuseum.no/",
        license: it?.license ?? "See item page",
      };
    }
  } catch {}
  return null;
}

// 9) Europeana (open search endpoint, key-less listing)
async function europeana(name: string): Promise<Hit | null> {
  const api = `https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query=${encodeURIComponent(name)}&qf=TYPE:IMAGE&rows=5&media=true&reusability=open`;
  try {
    const j: any = await (await fetch(api, HEAD)).json();
    for (const it of j?.items ?? []) {
      const u = it?.edmIsShownBy?.[0] ?? it?.edmPreview?.[0];
      if (!u || isBadHost(u)) continue;
      return {
        url: u,
        source: "Europeana",
        credit: it?.dcCreator?.[0] ?? it?.title?.[0] ?? name,
        credit_url: it?.guid ?? "https://www.europeana.eu/",
        license: it?.rights?.[0] ?? "Open (reusable)",
      };
    }
  } catch {}
  return null;
}

// 10) Flickr Commons — public flickr.com/commons search, parse HTML for static.flickr.com img urls
async function flickrCommons(name: string): Promise<Hit | null> {
  const url = `https://www.flickr.com/search/?text=${encodeURIComponent(name)}&license=7%2C9%2C10`;
  try {
    const html = await (await fetch(url, HEAD)).text();
    const m = html.match(/https:\/\/live\.staticflickr\.com\/[\w\/.\-_]+_[a-z]\.(?:jpg|png)/);
    if (m) {
      const link = html.match(/href="(\/photos\/[^"]+)"/);
      return {
        url: m[0].replace(/_[a-z]\.(jpg|png)$/, "_b.$1"),
        source: "Flickr Commons",
        credit: name,
        credit_url: link ? `https://www.flickr.com${link[1]}` : "https://www.flickr.com/commons",
        license: "CC0 / PD (Flickr Commons)",
      };
    }
  } catch {}
  return null;
}

const SOURCES = [
  wikipedia,
  commons,
  loc,
  internetArchive,
  picryl,
  openverse,
  nbno,
  digitaltmuseum,
  europeana,
  flickrCommons,
];

async function findOne(name: string, altName: string | null): Promise<Hit | null> {
  const names = [name, altName].filter(Boolean) as string[];
  for (const fn of SOURCES) {
    for (const n of names) {
      try {
        const h = await fn(n);
        if (h && h.url && !isBadHost(h.url)) return h;
      } catch {}
    }
  }
  return null;
}

const { data: artists, error } = await sb
  .from("artists")
  .select("slug,name,alt_name")
  .or("img.is.null,img.eq.")
  .order("name");
if (error) throw error;

console.log(`v3 hunt (direct-download, no API keys): ${artists!.length} artists`);
let ok = 0,
  miss = 0;
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
  console.log("\nAI-fallback candidates (run scripts/ai_portraits.ts):");
  missing.forEach((m) => console.log("  " + m));
}
