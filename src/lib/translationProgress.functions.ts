import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB } from "@/integrations/d1/client";

const LANGS = ["no", "en", "sv", "de", "pl"] as const;
const KEY_FIELDS = ["biography", "short", "influence"] as const;

export const getTranslationProgress = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const cols = ["slug", ...LANGS.flatMap((l) => KEY_FIELDS.map((f) => `${f}_${l}`))].join(",");
    const { results } = await db.prepare(`SELECT ${cols} FROM artists`).all();

    const rows = (results ?? []) as any[];
    const total = rows.length;

    const perLang: Record<string, { complete: number; partial: number; missing: number }> = {};
    for (const lang of LANGS) {
      let complete = 0, partial = 0, missing = 0;
      for (const r of rows) {
        const filled = KEY_FIELDS.filter((f) => {
          const v = r[`${f}_${lang}`];
          return typeof v === "string" && v.trim().length > 0;
        }).length;
        if (filled === KEY_FIELDS.length) complete++;
        else if (filled > 0) partial++;
        else missing++;
      }
      perLang[lang] = { complete, partial, missing };
    }

    const fullyDone = rows.filter((r) =>
      LANGS.every((l) => KEY_FIELDS.every((f) => typeof r[`${f}_${l}`] === "string" && r[`${f}_${l}`].trim().length > 0)),
    ).length;

    return {
      total,
      fullyDone,
      perLang,
      timestamp: Date.now(),
    };
  });
