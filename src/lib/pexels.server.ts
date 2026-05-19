// Server-only Pexels API client. Docs: https://www.pexels.com/api/documentation/
// Guidelines: show photographer credit + link back to pexels.com.
const API_BASE = "https://api.pexels.com/v1";

type Cached<T> = { value: T; expires: number };
const cache = new Map<string, Cached<unknown>>();
const TTL_MS = 30 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  cache.delete(key);
  return null;
}
function setCached<T>(key: string, value: T) {
  cache.set(key, { value, expires: Date.now() + TTL_MS });
}

function apiKey() {
  const k = process.env.PEXELS_API_KEY;
  if (!k) throw new Error("PEXELS_API_KEY is not configured");
  return k;
}

export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;             // pexels.com page (credit link)
  photographer: string;
  photographerUrl: string;
  avgColor: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
};

type RawPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  avg_color: string;
  alt: string;
  src: PexelsPhoto["src"];
};

function map(p: RawPhoto): PexelsPhoto {
  return {
    id: p.id,
    width: p.width,
    height: p.height,
    url: p.url,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
    avgColor: p.avg_color,
    alt: p.alt || "",
    src: p.src,
  };
}

async function pxGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {})
  );
  const cacheKey = `${path}?${qs.toString()}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}${path}?${qs.toString()}`, {
    headers: { Authorization: apiKey() },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pexels ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as T;
  setCached(cacheKey, data);
  return data;
}

export async function searchPexels(
  query: string,
  opts: { perPage?: number; orientation?: "landscape" | "portrait" | "square"; page?: number } = {}
): Promise<PexelsPhoto[]> {
  type SR = { photos: RawPhoto[] };
  const data = await pxGet<SR>("/search", {
    query,
    per_page: Math.min(Math.max(opts.perPage ?? 15, 1), 80),
    page: opts.page ?? 1,
    ...(opts.orientation ? { orientation: opts.orientation } : {}),
  });
  return data.photos.map(map);
}
