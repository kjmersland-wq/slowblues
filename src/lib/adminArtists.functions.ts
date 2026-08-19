import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB, parseJsonColumn } from "@/integrations/d1/client";
import { parseArtistRow, serializeArtistPatch } from "@/integrations/d1/artistRow";

const AUDIT_COLUMNS =
  "slug,name,origin,died,biography_en,biography_no,instruments,instruments_simple,discography,family";

export const fetchArtistsAudit = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const { results } = await db.prepare(`SELECT ${AUDIT_COLUMNS} FROM artists ORDER BY name ASC`).all();
    return (results ?? []).map((r) => parseArtistRow(r as Record<string, any>));
  });

const EDIT_COLUMNS =
  "slug,name,origin,born,died,biography_en,biography_no,biography_sv,biography_de,biography_pl,instruments,discography,family,youtube_video_ids,website_url,sync_data,booking_info,updated_at";

export const fetchArtistEditData = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const [artistRow, allSlugsRes, lastEditRow] = await Promise.all([
      db.prepare(`SELECT ${EDIT_COLUMNS} FROM artists WHERE slug = ?`).bind(data.slug).first(),
      db.prepare("SELECT slug, name FROM artists ORDER BY name ASC").all(),
      db
        .prepare("SELECT edited_at, fields_changed FROM artist_edit_log WHERE artist_slug = ? ORDER BY edited_at DESC LIMIT 1")
        .bind(data.slug)
        .first(),
    ]);
    const editLog = lastEditRow as { edited_at: string; fields_changed: unknown } | null;
    return {
      artist: artistRow ? parseArtistRow(artistRow as Record<string, any>) : null,
      allSlugs: (allSlugsRes.results ?? []) as Array<{ slug: string; name: string }>,
      lastEdit: editLog
        ? { edited_at: editLog.edited_at, fields_changed: parseJsonColumn<string[]>(editLog.fields_changed, []) }
        : null,
    };
  });

export const updateArtistBySlug = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { slug: string; patch: Record<string, any>; fieldsChanged?: string[] }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const patch = serializeArtistPatch(data.patch);
    const keys = Object.keys(patch);
    if (keys.length > 0) {
      const setClause = keys.map((k) => `${k} = ?`).join(", ");
      await db
        .prepare(`UPDATE artists SET ${setClause} WHERE slug = ?`)
        .bind(...keys.map((k) => patch[k]), data.slug)
        .run();
    }
    if (data.fieldsChanged && data.fieldsChanged.length > 0) {
      await db
        .prepare("INSERT INTO artist_edit_log (id, artist_slug, fields_changed, edited_by) VALUES (?, ?, ?, ?)")
        .bind(crypto.randomUUID(), data.slug, JSON.stringify(data.fieldsChanged), "admin")
        .run();
    }
    return { ok: true as const };
  });

export const createArtist = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: Record<string, any>) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = serializeArtistPatch(data);
    const id = crypto.randomUUID();
    const keys = Object.keys(row);
    const cols = ["id", ...keys].join(", ");
    const placeholders = ["?", ...keys.map(() => "?")].join(", ");
    await db
      .prepare(`INSERT INTO artists (${cols}) VALUES (${placeholders})`)
      .bind(id, ...keys.map((k) => row[k]))
      .run();
    return { ok: true as const, id };
  });

export const upsertArtistBySlug = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: Record<string, any> & { slug: string }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const row = serializeArtistPatch(data);
    delete row.id;
    delete row.created_at;
    delete row.updated_at;
    const keys = Object.keys(row);
    const id = crypto.randomUUID();
    const cols = ["id", ...keys].join(", ");
    const placeholders = ["?", ...keys.map(() => "?")].join(", ");
    const updateClause = keys.map((k) => `${k} = excluded.${k}`).join(", ");
    await db
      .prepare(
        `INSERT INTO artists (${cols}) VALUES (${placeholders})
         ON CONFLICT(slug) DO UPDATE SET ${updateClause}`,
      )
      .bind(id, ...keys.map((k) => row[k]))
      .run();
    return { ok: true as const };
  });

export const deleteArtistBySlug = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    await getDB().prepare("DELETE FROM artists WHERE slug = ?").bind(data.slug).run();
    return { ok: true as const };
  });
