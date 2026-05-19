import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchEntities, getArtistFacts, type WDSearchHit, type ArtistFacts } from "./wikidata.server";

export type { WDSearchHit, ArtistFacts };

export const searchWikidata = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        query: z.string().min(1).max(120),
        lang: z.enum(["en", "no", "sv", "de"]).optional(),
        limit: z.number().int().min(1).max(20).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    try {
      const hits = await searchEntities(data.query, data.lang ?? "en", data.limit ?? 8);
      return { hits, error: null as string | null };
    } catch (e) {
      console.error("searchWikidata failed:", e);
      return { hits: [] as WDSearchHit[], error: e instanceof Error ? e.message : "Wikidata search failed" };
    }
  });

export const getWikidataArtist = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        qid: z.string().regex(/^Q\d+$/, "Expected a Wikidata Q-ID, e.g. Q3325511"),
        lang: z.enum(["en", "no", "sv", "de"]).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    try {
      const facts = await getArtistFacts(data.qid, data.lang ?? "en");
      return { facts, error: null as string | null };
    } catch (e) {
      console.error("getWikidataArtist failed:", e);
      return { facts: null as ArtistFacts | null, error: e instanceof Error ? e.message : "Wikidata fetch failed" };
    }
  });
