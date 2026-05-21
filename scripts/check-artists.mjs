#!/usr/bin/env node
// Batch-sjekk: verifiserer at alle artistprofiler svarer og at slug-en finnes i DB.
// Bruk:  node scripts/check-artists.mjs [--base=https://slowblues.no] [--timeout=15000] [--concurrency=6]
//
// Rapport: OK / NOT_FOUND_IN_DB / HTTP_<code> / TIMEOUT / NETWORK_ERROR
// Skriver også /mnt/documents/artist-check-report.{json,csv}

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const BASE = args.base ?? "https://slowblues.no";
const TIMEOUT = Number(args.timeout ?? 15000);
const CONCURRENCY = Number(args.concurrency ?? 6);

console.log(`▶ Artist batch-check`);
console.log(`  base=${BASE}  timeout=${TIMEOUT}ms  concurrency=${CONCURRENCY}\n`);

// 1) Hent slugs fra DB
let dbSlugs = new Set();
try {
  const out = execSync(`psql -At -c "select slug from artists order by slug;"`, {
    encoding: "utf8",
  });
  dbSlugs = new Set(out.split("\n").map((s) => s.trim()).filter(Boolean));
  console.log(`  ${dbSlugs.size} slugs i artists-tabellen`);
} catch (e) {
  console.error("⚠️  Kunne ikke lese fra DB via psql:", e.message);
}

// 2) Hent slugs fra ARTISTS-arrayet i src/data/blues.ts (kun den eksporten —
//    STYLES og BLOG_POSTS har egne slug-felt og hører ikke til /artists/).
let staticSlugs = new Set();
try {
  const file = execSync("cat src/data/blues.ts", { encoding: "utf8" });
  const start = file.indexOf("export const ARTISTS");
  const end = start >= 0 ? file.indexOf("export const ", start + 20) : -1;
  const block = start >= 0 ? file.slice(start, end > 0 ? end : undefined) : "";
  for (const m of block.matchAll(/slug:\s*"([a-z0-9-]+)"/g)) staticSlugs.add(m[1]);
  console.log(`  ${staticSlugs.size} slugs i ARTISTS-arrayet (src/data/blues.ts)\n`);
} catch {}

const allSlugs = [...new Set([...dbSlugs, ...staticSlugs])].sort();
console.log(`▶ Sjekker ${allSlugs.length} unike artistprofiler …\n`);

// 3) HTTP-sjekk hver profil
async function checkOne(slug) {
  const url = `${BASE}/artists/${slug}`;
  const inDb = dbSlugs.has(slug);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "user-agent": "slowblues-artist-check/1.0" },
      redirect: "follow",
    });
    const ms = Date.now() - t0;
    if (!res.ok) {
      return { slug, url, inDb, status: `HTTP_${res.status}`, ms, ok: false };
    }
    return {
      slug,
      url,
      inDb,
      status: inDb ? "OK" : "NOT_FOUND_IN_DB",
      ms,
      ok: inDb,
    };
  } catch (e) {
    const ms = Date.now() - t0;
    const status = e.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR";
    return { slug, url, inDb, status, ms, ok: false, err: e.message };
  } finally {
    clearTimeout(timer);
  }
}

// Enkel concurrency-pool
async function run() {
  const results = [];
  let i = 0;
  let done = 0;
  async function worker() {
    while (i < allSlugs.length) {
      const slug = allSlugs[i++];
      const r = await checkOne(slug);
      results.push(r);
      done++;
      const tag = r.ok ? "✓" : "✗";
      process.stdout.write(
        `  ${tag} [${String(done).padStart(3)}/${allSlugs.length}] ${r.status.padEnd(15)} ${r.ms}ms  ${slug}\n`,
      );
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

const results = await run();

// 4) Rapport
const buckets = results.reduce((m, r) => {
  m[r.status] = (m[r.status] ?? 0) + 1;
  return m;
}, {});
const failures = results.filter((r) => !r.ok).sort((a, b) => a.slug.localeCompare(b.slug));

console.log(`\n▶ Oppsummering`);
for (const [k, v] of Object.entries(buckets).sort()) {
  console.log(`  ${k.padEnd(16)} ${v}`);
}
console.log(`  TOTAL            ${results.length}`);
console.log(`  FAILURES         ${failures.length}\n`);

if (failures.length) {
  console.log(`▶ Profiler som feilet:`);
  for (const f of failures) {
    console.log(`  - ${f.slug}  [${f.status}]  ${f.url}${f.err ? `  (${f.err})` : ""}`);
  }
}

mkdirSync("/mnt/documents", { recursive: true });
writeFileSync(
  "/mnt/documents/artist-check-report.json",
  JSON.stringify({ base: BASE, when: new Date().toISOString(), buckets, results }, null, 2),
);
const csv = [
  "slug,status,ok,in_db,http_url,ms,error",
  ...results.map((r) =>
    [r.slug, r.status, r.ok, r.inDb, r.url, r.ms, (r.err ?? "").replace(/,/g, ";")].join(","),
  ),
].join("\n");
writeFileSync("/mnt/documents/artist-check-report.csv", csv);
console.log(`\n📝 Rapport skrevet til /mnt/documents/artist-check-report.{json,csv}`);

process.exit(failures.length ? 1 : 0);
