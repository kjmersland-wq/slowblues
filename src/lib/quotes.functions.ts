import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB, parseJsonColumn } from "@/integrations/d1/client";

export const fetchArtistsWithQuotes = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const { results } = await db.prepare("SELECT id, slug, name, press_quotes FROM artists ORDER BY name ASC").all();
    return (results ?? []).map((r: any) => ({ ...r, press_quotes: parseJsonColumn(r.press_quotes, []) }));
  });

export const saveArtistQuotes = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string; press_quotes: unknown[] }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    await db
      .prepare("UPDATE artists SET press_quotes = ? WHERE id = ?")
      .bind(JSON.stringify(data.press_quotes), data.id)
      .run();
    return { ok: true as const };
  });
