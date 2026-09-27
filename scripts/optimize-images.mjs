// One-off + repeatable image optimiser. Originals (jpg/png) stay in the repo as
// source/fallback; the app bundles only the .webp derivatives.
//   node scripts/optimize-images.mjs
// For each src/assets/artists/**/name.{jpg,png,webp}:
//   name.webp      max 1000px wide (profile / hero use)   -- only written if missing or >250 KB
//   name-400.webp  max 400px wide  (cards, related, list) -- always (re)generated
// Also the homepage heroes and logo.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("src/assets");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

let before = 0, after = 0, n = 0;
const sources = new Map(); // base path without extension -> best source file
for (const f of walk(path.join(root, "artists"))) {
  if (/-400\.webp$/.test(f)) continue;
  const ext = path.extname(f).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
  const base = f.slice(0, -ext.length);
  // prefer the original jpg/png as the source; fall back to an existing webp
  if (!sources.has(base) || ext !== ".webp") sources.set(base, f);
}

for (const [base, src] of sources) {
  const full = `${base}.webp`;
  const card = `${base}-400.webp`;
  const srcSize = fs.statSync(src).size;
  before += srcSize;
  const needFull = !fs.existsSync(full) || fs.statSync(full).size > 250 * 1024;
  if (needFull) {
    await sharp(src).rotate().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 76 }).toFile(full + ".tmp");
    fs.renameSync(full + ".tmp", full);
  }
  await sharp(src).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 74 }).toFile(card);
  after += fs.statSync(full).size + fs.statSync(card).size;
  n++;
}
console.log(`artists: ${n} images, source ${(before / 1048576).toFixed(1)} MB -> webp (full+card) ${(after / 1048576).toFixed(1)} MB`);

// homepage heroes (full-bleed, shown up to ~1920px) and logo (displayed at 224px -> 2x = 448px)
for (const name of ["hero-juke", "hero-delta", "hero-guitar", "hero-cotton"]) {
  const src = path.join(root, `${name}.jpg`);
  if (!fs.existsSync(src)) continue;
  await sharp(src).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(root, `${name}.webp`));
  console.log(name, Math.round(fs.statSync(src).size / 1024), "KB ->", Math.round(fs.statSync(path.join(root, `${name}.webp`)).size / 1024), "KB");
}
await sharp(path.join(root, "logo-slowblues.png")).resize({ width: 448 }).webp({ quality: 88, alphaQuality: 95 }).toFile(path.join(root, "logo-slowblues-448.webp"));
console.log("logo", Math.round(fs.statSync(path.join(root, "logo-slowblues.png")).size / 1024), "KB ->", Math.round(fs.statSync(path.join(root, "logo-slowblues-448.webp")).size / 1024), "KB");
