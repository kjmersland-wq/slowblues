// Server-only Pixabay API client. Docs: https://pixabay.com/api/docs/
// Guidelines: link back to pixabay.com (no photographer attribution required,
// but we still include it where available — good editorial practice).
const API_BASE = "https://pixabay.com/api/";

type Cached<T> = { value: T; expires: number };
const cache = new Map<string, Cached<unknown>>();
const TTL_MS = 24 * 60 * 60 * 1000; // Pixabay requires caching 24h+

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
  const k = process.env.PIXABAY_API_KEY;
  if (!k) throw new Error("PIXABAY_API_KEY is not configured");
  return k;
}

export type PixabayPhoto = {
  id: number;
  pageUrl: string;        // pixabay.com page (credit link)
  tags: string;
  user: string;
  userUrl: string;
  width: number;
  height: number;
  preview: string;        // small thumbnail
  webformat: string;      // ~640px
  large: string;          // ~1280px
};

type RawHit = {
  id: number;
  pageURL: string;
  tags: string;
  user: string;
  user_id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
};

function map(h: RawHit): PixabayPhoto {
  return {
    id: h.id,
    pageUrl: h.pageURL,
    tags: h.tags,
    user: h.user,
    userUrl: `https://pixabay.com/users/${encodeURIComponent(h.user)}-${h.user_id}/`,
    width: h.imageWidth,
    height: h.imageHeight,
    preview: h.previewURL,
    webformat: h.webformatURL,
    large: h.largeImageURL,
  };
}

async function pbGet<T>(params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams({
    key: apiKey(),
    ...Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {}),
  });
  const cacheKey = qs.toString().replace(/(^|&)key=[^&]+/, "");
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}?${qs.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pixabay ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as T;
  setCached(cacheKey, data);
  return data;
}

export async function searchPixabay(
  query: string,
  opts: { perPage?: number; orientation?: "horizontal" | "vertical" | "all"; page?: number; imageType?: "photo" | "illustration" | "all" } = {}
): Promise<PixabayPhoto[]> {
  type SR = { hits: RawHit[] };
  const data = await pbGet<SR>({
    q: query,
    per_page: Math.min(Math.max(opts.perPage ?? 15, 3), 200),
    page: opts.page ?? 1,
    orientation: opts.orientation ?? "all",
    image_type: opts.imageType ?? "photo",
    safesearch: "true",
  });
  return data.hits.map(map);
}
