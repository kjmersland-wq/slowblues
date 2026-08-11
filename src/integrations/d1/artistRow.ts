// Shared column metadata for the `artists` table: schema.sql stores every
// text[]/jsonb Postgres column as a JSON string, so any code reading rows
// back out of D1 needs to know which columns to JSON.parse.
import { parseJsonColumn } from "./client";

const LOCALES = ["en", "no", "sv", "de", "pl"] as const;

// Fields whose 5 per-locale columns (family_en, family_no, ...) were folded
// into a single `<field>_i18n` column (D1 caps tables at 100 columns — see
// schema.sql) storing {"en": [...], "no": [...], ...}. parseArtistRow expands
// that back into the flat `<field>_<locale>` keys consumers already expect;
// serializeArtistPatch folds them back up on write.
const I18N_JSON_FIELDS = [
  "signature_songs",
  "influences",
  "family",
  "formative",
  "instruments",
  "anecdotes",
  "collaborators",
  "discography",
  "awards",
  "press_quotes",
];

const JSON_OBJECT_COLUMNS = new Set(["social_links", "link_check", ...I18N_JSON_FIELDS.map((f) => `${f}_i18n`)]);

const JSON_ARRAY_COLUMNS = new Set([
  "bio",
  ...I18N_JSON_FIELDS, // base (unsuffixed) column stays a plain JSON array
  "labels", "instruments_simple", "styles", "categories", "search_terms", "related_slugs", "gallery_images", "youtube_video_ids",
  "key_recordings", "external_links", "article_references", "videos",
]);

// Converts a raw D1 `artists` row (JSON-as-TEXT columns included) into the
// same shape the old Supabase/PostgREST client returned (real arrays/objects,
// plus flat `<field>_<locale>` keys expanded from the `_i18n` blobs).
export function parseArtistRow(row: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...row };
  for (const key of Object.keys(out)) {
    if (JSON_ARRAY_COLUMNS.has(key)) out[key] = parseJsonColumn(out[key], []);
    else if (JSON_OBJECT_COLUMNS.has(key)) out[key] = parseJsonColumn(out[key], {});
  }
  for (const field of I18N_JSON_FIELDS) {
    const i18nKey = `${field}_i18n`;
    if (!(i18nKey in out)) continue; // row was a partial SELECT that didn't include it
    const i18n = (out[i18nKey] ?? {}) as Record<string, any>;
    for (const locale of LOCALES) out[`${field}_${locale}`] = i18n[locale] ?? [];
    delete out[i18nKey];
  }
  return out;
}

// Inverse of parseArtistRow — stringifies array/object fields present in a
// partial artist payload so it can be written back with D1 prepared statements.
// NOTE: folds any `<field>_<locale>` keys in the patch into a fresh `_i18n`
// blob containing only those keys (no merge with what's already stored) —
// fine today since no admin UI writes these per-locale fields yet, but a
// patch that sets e.g. only `discography_en` will drop other locales already
// saved in `discography_i18n` unless the caller re-sends them too.
export function serializeArtistPatch(patch: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...patch };
  for (const field of I18N_JSON_FIELDS) {
    const i18n: Record<string, any> = {};
    let touched = false;
    for (const locale of LOCALES) {
      const key = `${field}_${locale}`;
      if (key in out) {
        i18n[locale] = out[key];
        delete out[key];
        touched = true;
      }
    }
    if (touched) out[`${field}_i18n`] = JSON.stringify(i18n);
  }
  for (const key of Object.keys(out)) {
    if (JSON_ARRAY_COLUMNS.has(key) || JSON_OBJECT_COLUMNS.has(key)) {
      if (out[key] !== undefined && typeof out[key] !== "string") {
        out[key] = JSON.stringify(out[key] ?? (JSON_OBJECT_COLUMNS.has(key) ? {} : []));
      }
    }
  }
  return out;
}
