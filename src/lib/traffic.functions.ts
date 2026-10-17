import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB } from "@/integrations/d1/client";

export type TrafficPeriod = 7 | 28 | 90;
export type TrafficRow = { label: string | null; views: number };
export type TrafficData = {
  days: TrafficPeriod;
  site: string | null;
  sites: { site: string; views: number }[];
  totals: { views: number; visitors: number };
  pages: TrafficRow[];
  sources: TrafficRow[];
  countries: TrafficRow[];
  devices: TrafficRow[];
};

const PERIODS = new Set<number>([7, 28, 90]);
const TOP_N = 10;

// Reads only from `pageviews` (written by POST /api/collect). Admin-only.
// "visitors" = unique anonymous visitors per day, summed over the period: the
// visitor hash rotates every day, so someone returning on two days counts twice.
export const getTraffic = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((d: { site?: string; days?: number }) => d)
  .handler(async ({ data }): Promise<TrafficData> => {
    const db = getDB();
    const days = (PERIODS.has(Number(data.days)) ? Number(data.days) : 28) as TrafficPeriod;
    const since = `-${days} days`;

    const { results: siteRows } = await db
      .prepare(
        `SELECT site, COUNT(*) AS views FROM pageviews
         WHERE created_at >= datetime('now', ?)
         GROUP BY site ORDER BY views DESC`,
      )
      .bind(since)
      .all<{ site: string; views: number }>();
    const sites = siteRows ?? [];

    // Chosen site if it has data in the period, otherwise the busiest one.
    const site = sites.find((s) => s.site === data.site)?.site ?? sites[0]?.site ?? null;
    const empty: TrafficData = {
      days,
      site,
      sites,
      totals: { views: 0, visitors: 0 },
      pages: [],
      sources: [],
      countries: [],
      devices: [],
    };
    if (!site) return empty;

    const where = `WHERE site = ? AND created_at >= datetime('now', ?)`;
    const top = (column: string) =>
      db
        .prepare(
          `SELECT ${column} AS label, COUNT(*) AS views FROM pageviews ${where}
           GROUP BY ${column} ORDER BY views DESC LIMIT ${TOP_N}`,
        )
        .bind(site, since);

    const [totals, pages, sources, countries, devices] = await db.batch([
      db
        .prepare(
          `SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors FROM pageviews ${where}`,
        )
        .bind(site, since),
      top("path"),
      top("referrer"),
      top("country"),
      top("device"),
    ]);

    const rows = (r: D1Result) => (r.results ?? []) as TrafficRow[];
    const t = (totals.results?.[0] ?? {}) as { views?: number; visitors?: number };
    return {
      ...empty,
      totals: { views: t.views ?? 0, visitors: t.visitors ?? 0 },
      pages: rows(pages),
      sources: rows(sources),
      countries: rows(countries),
      devices: rows(devices),
    };
  });
