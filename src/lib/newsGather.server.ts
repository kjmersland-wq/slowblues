// Server-only: Firecrawl-based news gathering for SlowBlues.
// Used by the ticker auto-refresh and weekly newsletter pipelines.

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";

export type GatheredNews = {
  title: string;
  url: string;
  description: string;
  source: string; // domain
  publishedAt?: string;
};

function requireKey(): string {
  const k = process.env.FIRECRAWL_API_KEY;
  if (!k) throw new Error("FIRECRAWL_API_KEY missing");
  return k;
}

function domainOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

/**
 * Search blues news from the last `days` days via Firecrawl.
 * Returns deduped headlines/summaries — no scraping by default (cheap).
 */
export async function searchBluesNews(opts?: {
  query?: string;
  limit?: number;
  days?: 1 | 7 | 30;
}): Promise<GatheredNews[]> {
  const apiKey = requireKey();
  const limit = opts?.limit ?? 12;
  const days = opts?.days ?? 7;
  const tbs = days === 1 ? "qdr:d" : days === 30 ? "qdr:m" : "qdr:w";
  const query = opts?.query ?? "blues music news OR festival OR obituary";

  const res = await fetch(`${FIRECRAWL_BASE}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit,
      lang: "en",
      tbs,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Firecrawl search ${res.status}: ${text.slice(0, 200)}`);
  }

  const json: any = await res.json();
  // v2 wraps results in data.web
  const rawList: any[] =
    json?.data?.web ?? json?.data ?? json?.web ?? [];

  const seen = new Set<string>();
  const out: GatheredNews[] = [];
  for (const r of rawList) {
    const url: string | undefined = r?.url ?? r?.link;
    const title: string | undefined = r?.title ?? r?.metadata?.title;
    if (!url || !title) continue;
    const key = url.replace(/[#?].*$/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      title: String(title).trim(),
      url,
      description: String(r?.description ?? r?.snippet ?? "").trim(),
      source: domainOf(url),
      publishedAt: r?.publishedDate ?? r?.published_date ?? undefined,
    });
  }
  return out;
}
