// Server-only YouTube Data API v3 client.
// Never import this from client code.
const API_BASE = "https://www.googleapis.com/youtube/v3";

type Cached<T> = { value: T; expires: number };
const cache = new Map<string, Cached<unknown>>();
const TTL_MS = 10 * 60 * 1000;

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
  const k = process.env.YOUTUBE_API_KEY;
  if (!k) throw new Error("YOUTUBE_API_KEY is not configured");
  return k;
}

async function ytGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), key: apiKey() });
  const url = `${API_BASE}${path}?${qs.toString()}`;
  const cacheKey = `${path}?${qs.toString().replace(/&?key=[^&]+/, "")}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`YouTube ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as T;
  setCached(cacheKey, data);
  return data;
}

export type YTVideo = {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
};

type SearchItem = {
  id: { kind: string; videoId?: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
  };
};
type SearchResponse = { items: SearchItem[]; nextPageToken?: string };

function mapSearchItem(it: SearchItem): YTVideo | null {
  const vid = it.id.videoId;
  if (!vid) return null;
  const thumb = it.snippet.thumbnails.high?.url || it.snippet.thumbnails.medium?.url || it.snippet.thumbnails.default?.url || "";
  return {
    id: vid,
    title: it.snippet.title,
    description: it.snippet.description,
    channelTitle: it.snippet.channelTitle,
    channelId: it.snippet.channelId,
    publishedAt: it.snippet.publishedAt,
    thumbnail: thumb,
    url: `https://www.youtube.com/watch?v=${vid}`,
  };
}

export async function searchVideos(query: string, max = 12): Promise<YTVideo[]> {
  const data = await ytGet<SearchResponse>("/search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: Math.min(Math.max(max, 1), 50),
    videoEmbeddable: "true",
    safeSearch: "moderate",
  });
  return data.items.map(mapSearchItem).filter((v): v is YTVideo => v !== null);
}

export async function fetchVideoDetails(ids: string[]): Promise<YTVideo[]> {
  if (ids.length === 0) return [];
  type VR = {
    items: Array<{
      id: string;
      snippet: SearchItem["snippet"];
    }>;
  };
  const data = await ytGet<VR>("/videos", { part: "snippet", id: ids.slice(0, 50).join(",") });
  return data.items.map((it) => {
    const thumb = it.snippet.thumbnails.high?.url || it.snippet.thumbnails.medium?.url || it.snippet.thumbnails.default?.url || "";
    return {
      id: it.id,
      title: it.snippet.title,
      description: it.snippet.description,
      channelTitle: it.snippet.channelTitle,
      channelId: it.snippet.channelId,
      publishedAt: it.snippet.publishedAt,
      thumbnail: thumb,
      url: `https://www.youtube.com/watch?v=${it.id}`,
    };
  });
}

export async function fetchPlaylistVideos(playlistId: string, max = 20): Promise<YTVideo[]> {
  type PR = {
    items: Array<{
      snippet: {
        title: string;
        description: string;
        channelTitle: string;
        publishedAt: string;
        videoOwnerChannelId?: string;
        thumbnails: SearchItem["snippet"]["thumbnails"];
        resourceId: { kind: string; videoId: string };
      };
    }>;
  };
  const data = await ytGet<PR>("/playlistItems", {
    part: "snippet",
    playlistId,
    maxResults: Math.min(Math.max(max, 1), 50),
  });
  return data.items.map((it) => {
    const vid = it.snippet.resourceId.videoId;
    const thumb = it.snippet.thumbnails.high?.url || it.snippet.thumbnails.medium?.url || it.snippet.thumbnails.default?.url || "";
    return {
      id: vid,
      title: it.snippet.title,
      description: it.snippet.description,
      channelTitle: it.snippet.channelTitle,
      channelId: it.snippet.videoOwnerChannelId || "",
      publishedAt: it.snippet.publishedAt,
      thumbnail: thumb,
      url: `https://www.youtube.com/watch?v=${vid}`,
    };
  });
}

export async function fetchChannelUploads(channelId: string, max = 12): Promise<YTVideo[]> {
  type CR = { items: Array<{ contentDetails: { relatedPlaylists: { uploads: string } } }> };
  const ch = await ytGet<CR>("/channels", { part: "contentDetails", id: channelId });
  const uploads = ch.items[0]?.contentDetails.relatedPlaylists.uploads;
  if (!uploads) return [];
  return fetchPlaylistVideos(uploads, max);
}
