// Shared freshness rules for the news ticker and /updates — deterministic,
// no AI. A single source of truth for "is this fresh enough to be an active
// update" so the ticker and /updates never disagree on the cutoff.
export type FreshnessTier = "hot" | "fresh" | "recent" | "stale";

const HOUR_MS = 3_600_000;

export function freshnessTier(iso: string | null | undefined, now: number = Date.now()): FreshnessTier {
  if (!iso) return "stale";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "stale";
  const ageHours = (now - t) / HOUR_MS;
  if (ageHours <= 24) return "hot"; // 0-24h, also covers future/clock-skew timestamps
  if (ageHours <= 24 * 3) return "fresh"; // 1-3 days
  if (ageHours <= 24 * 7) return "recent"; // 4-7 days
  return "stale"; // >7 days — excluded from the active ticker/feed
}

const TIER_WEIGHT: Record<FreshnessTier, number> = { hot: 300, fresh: 200, recent: 100, stale: 0 };

export function freshnessWeight(tier: FreshnessTier): number {
  return TIER_WEIGHT[tier];
}

export function isActive(iso: string | null | undefined, now: number = Date.now()): boolean {
  return freshnessTier(iso, now) !== "stale";
}
