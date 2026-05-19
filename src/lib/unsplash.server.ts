// Server-only Unsplash API client.
// Docs: https://unsplash.com/documentation
// IMPORTANT: Unsplash API Guidelines require:
//  1. Photographer attribution with link to their profile (?utm_source=SlowBlues&utm_medium=referral)
//  2. Triggering a download event when a photo is actually used
//  3. "Photo on Unsplash" link back to unsplash.com
const API_BASE = "https://api.unsplash.com";
const UTM = "?utm_source=SlowBlues&utm_medium=referral";

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

function accessKey() {
  const k = process.env.UNSPLASH_ACCESS_KEY;
  if (!k) throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  return k;
}

async function uxGet<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const qs = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {})
  );
  const url = `${API_BASE}${path}${qs.toString() ? `?${qs.toString()}` : ""}`;
  const cacheKey = `${path}?${qs.toString()}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey()}`,
      "Accept-Version": "v1",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Unsplash ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as T;
  setCached(cacheKey, data);
  return data;
}

export type UnsplashPhoto = {
  id: string;
  description: string | null;
  altDescription: string | null;
  width: number;
  height: number;
  color: string;
  blurHash: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    html: string;          // link to photo page on Unsplash (with UTM)
    downloadLocation: string; // server-only: call to trigger download event
  };
  user: {
    name: string;
    username: string;
    profileUrl: string;    // link to photographer profile (with UTM)
  };
};

type RawPhoto = {
  id: string;
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string | null;
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  links: { html: string; download_location: string };
  user: { name: string; username: string; links: { html: string } };
};

function map(p: RawPhoto): UnsplashPhoto {
  return {
    id: p.id,
    description: p.description,
    altDescription: p.alt_description,
    width: p.width,
    height: p.height,
    color: p.color,
    blurHash: p.blur_hash,
    urls: p.urls,
    links: {
      html: `${p.links.html}${UTM}`,
      downloadLocation: p.links.download_location,
    },
    user: {
      name: p.user.name,
      username: p.user.username,
      profileUrl: `${p.user.links.html}${UTM}`,
    },
  };
}

export async function searchPhotos(
  query: string,
  opts: { perPage?: number; orientation?: "landscape" | "portrait" | "squarish"; page?: number } = {}
): Promise<UnsplashPhoto[]> {
  type SR = { results: RawPhoto[] };
  const data = await uxGet<SR>("/search/photos", {
    query,
    per_page: Math.min(Math.max(opts.perPage ?? 12, 1), 30),
    page: opts.page ?? 1,
    ...(opts.orientation ? { orientation: opts.orientation } : {}),
    content_filter: "high",
  });
  return data.results.map(map);
}

export async function getPhoto(id: string): Promise<UnsplashPhoto> {
  const data = await uxGet<RawPhoto>(`/photos/${encodeURIComponent(id)}`);
  return map(data);
}

/**
 * REQUIRED by Unsplash API Guidelines: call this when a photo is actually
 * displayed/used in the app (article published, hero rendered server-side, etc.).
 * Fire-and-forget: failures must not break the page.
 */
export async function trackDownload(downloadLocation: string): Promise<void> {
  try {
    if (!downloadLocation) return;
    const url = downloadLocation.includes("client_id=")
      ? downloadLocation
      : `${downloadLocation}${downloadLocation.includes("?") ? "&" : "?"}client_id=${accessKey()}`;
    await fetch(url, { method: "GET" });
  } catch (e) {
    console.error("Unsplash trackDownload failed:", e);
  }
}
