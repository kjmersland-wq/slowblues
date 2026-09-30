// Shared ticker-reading logic — used by both the getNewsTicker TanStack
// server function (src/lib/newsfeed.functions.ts) and the public
// /api/ticker route (src/routes/api.ticker.ts).
//
// The ticker's CONTENT is no longer computed here on every request. It's
// built twice a week (Mon/Thu, Europe/Oslo) by sync-worker/src/tickerBatch.ts
// into ticker_batches/ticker_batch_items (see migrations/0010) — same
// "cron builds an immutable snapshot, site just reads it" shape as the
// quiz cycle system. This file's only job is: find the latest batch, pull
// its items, and pick out the requested language. Each item already carries
// all 5 languages (label_json/text_json), hand-written at batch-build time
// — there's no live translation step, so the old "ticker text is
// English-only on every locale" rule is gone for these. External RSS items
// are the one exception: they're only included when the source itself
// publishes in English (see tickerBatch.ts), regardless of requested
// locale, because there's no reliable automated translation and a guessed
// translation of a foreign-language headline would be worse than not
// showing it.
export type TickerItem = {
  id: string;
  kind: "birthday" | "onthisday" | "memoriam" | "release" | "concert" | "external" | "house" | "youtube";
  flag?: string;
  label: string;
  text: string;
  href: string;
  external?: boolean; // true => open in a new tab, not internal SPA nav
  sourceName?: string; // e.g. "Living Blues" — external items only
};

type TickerLang = "no" | "en" | "sv" | "de" | "pl";

type BatchItemRow = {
  id: string;
  kind: TickerItem["kind"];
  flag: string | null;
  href: string;
  external: number;
  source_name: string | null;
  label_json: string;
  text_json: string;
};

export async function buildNewsTicker(db: D1Database, lang: TickerLang = "en"): Promise<{ items: TickerItem[]; generatedAt: string; batchKey: string | null }> {
  const batch = await db
    .prepare(`SELECT batch_key FROM ticker_batches ORDER BY period_start DESC LIMIT 1`)
    .first<{ batch_key: string }>();

  if (!batch) {
    // No batch has ever been built (e.g. brand-new deploy before the first
    // cron run) — an empty ticker is honest here, never a fabricated one.
    return { items: [], generatedAt: new Date().toISOString(), batchKey: null };
  }

  const { results } = await db
    .prepare(`SELECT id, kind, flag, href, external, source_name, label_json, text_json FROM ticker_batch_items WHERE batch_key = ? ORDER BY position ASC`)
    .bind(batch.batch_key)
    .all<BatchItemRow>();

  const pick = (json: string): string => {
    try {
      const obj = JSON.parse(json) as Record<string, string>;
      return obj[lang] ?? obj.en ?? "";
    } catch {
      return "";
    }
  };

  const items: TickerItem[] = (results ?? []).map((r) => ({
    id: r.id,
    kind: r.kind,
    flag: r.flag ?? undefined,
    href: r.href,
    external: !!r.external,
    sourceName: r.source_name ?? undefined,
    label: pick(r.label_json),
    text: pick(r.text_json),
  }));

  return { items, generatedAt: new Date().toISOString(), batchKey: batch.batch_key };
}
