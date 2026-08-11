import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB, parseJsonColumn } from "@/integrations/d1/client";

export const fetchAllReviews = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const { results } = await db
      .prepare("SELECT * FROM blues_reviews ORDER BY published_at IS NULL, published_at DESC")
      .all();
    return (results ?? []).map((r: any) => ({ ...r, tracks: parseJsonColumn(r.tracks, []) }));
  });

export const saveReview = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: Record<string, unknown> & { id?: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const status = (data.status as string) ?? "draft";
    const published_at =
      status === "published" && !data.published_at ? new Date().toISOString() : (data.published_at as string | null) ?? null;

    const row: Record<string, unknown> = { ...data, status, published_at };
    if (row.tracks !== undefined) row.tracks = JSON.stringify(row.tracks ?? []);
    delete row.created_at;
    delete row.updated_at;

    if (data.id) {
      const id = row.id as string;
      delete row.id;
      const keys = Object.keys(row);
      const setClause = keys.map((k) => `${k} = ?`).join(", ");
      await db
        .prepare(`UPDATE blues_reviews SET ${setClause} WHERE id = ?`)
        .bind(...keys.map((k) => row[k]), id)
        .run();
      return { ok: true as const, id };
    } else {
      const id = crypto.randomUUID();
      const keys = Object.keys(row);
      const cols = ["id", ...keys].join(", ");
      const placeholders = ["?", ...keys.map(() => "?")].join(", ");
      await db
        .prepare(`INSERT INTO blues_reviews (${cols}) VALUES (${placeholders})`)
        .bind(id, ...keys.map((k) => row[k]))
        .run();
      return { ok: true as const, id };
    }
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await getDB().prepare("DELETE FROM blues_reviews WHERE id = ?").bind(data.id).run();
    return { ok: true as const };
  });
