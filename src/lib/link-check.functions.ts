import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB } from "@/integrations/d1/client";

type Row = {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  facebook_url: string | null;
};

type LinkResult = {
  url: string;
  ok: boolean;
  status: number | null;
  error?: string;
};

export type ArtistLinkReport = {
  id: string;
  slug: string;
  name: string;
  website: LinkResult | null;
  facebook: LinkResult | null;
};

async function checkUrl(url: string): Promise<LinkResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 7000);
  try {
    // Try HEAD first; many sites disallow it, then fall back to GET.
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (res.status === 405 || res.status === 403 || res.status === 404) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    clearTimeout(timer);
    return { url, ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (e) {
    clearTimeout(timer);
    return { url, ok: false, status: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export const checkArtistLinks = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async (): Promise<ArtistLinkReport[]> => {
    const db = getDB();
    const { results } = await db
      .prepare("SELECT id, slug, name, website_url, facebook_url FROM artists ORDER BY name ASC")
      .all();

    const rows = (results ?? []) as unknown as Row[];

    // Batch in groups of 12 to avoid overwhelming the runtime
    const out: ArtistLinkReport[] = [];
    const batchSize = 12;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (r) => {
          const [website, facebook] = await Promise.all([
            r.website_url ? checkUrl(r.website_url) : Promise.resolve(null),
            r.facebook_url ? checkUrl(r.facebook_url) : Promise.resolve(null),
          ]);
          return { id: r.id, slug: r.slug, name: r.name, website, facebook };
        })
      );
      out.push(...results);
    }
    return out;
  });

export const clearArtistLink = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string; field: "website_url" | "facebook_url" }) => d)
  .handler(async ({ data }) => {
    const db = getDB();
    const column = data.field === "website_url" ? "website_url" : "facebook_url";
    await db.prepare(`UPDATE artists SET ${column} = NULL WHERE id = ?`).bind(data.id).run();
    return { ok: true as const };
  });
