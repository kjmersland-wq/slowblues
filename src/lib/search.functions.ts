import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { runSiteSearch, type SearchResult } from "./search.server";
import { isLocale, DEFAULT_LOCALE, type ArtistLocale } from "@/lib/locale";

export type { SearchResult };

export const siteSearch = createServerFn({ method: "GET" })
  .inputValidator((d: { q: string; lang?: string }) => d)
  .handler(async ({ data }) => {
    const q = data.q.trim().slice(0, 100);
    const lang: ArtistLocale = isLocale(data.lang) ? data.lang : DEFAULT_LOCALE;
    if (!q) return { query: q, results: [] as SearchResult[] };
    const db = getDB();
    const results = await runSiteSearch(db, q, lang);
    return { query: q, results };
  });
