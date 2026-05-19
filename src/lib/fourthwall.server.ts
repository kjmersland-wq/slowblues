// Server-only Fourthwall Storefront API client.
// Docs: https://storefront.fourthwall.com/v1
// All requests authenticated via storefront_token query param.

const API_BASE = "https://storefront-api.fourthwall.com/v1";

export interface FwImage {
  id?: string;
  url: string;
  width?: number;
  height?: number;
}
export interface FwPrice {
  value: number;
  currency: string;
}
export interface FwVariant {
  id: string;
  name?: string;
  unitPrice?: FwPrice;
  stock?: { type: string; inStock?: boolean };
  attributes?: Record<string, unknown>;
}
export interface FwProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  state?: { type: string };
  access?: { type: string };
  images?: FwImage[];
  variants?: FwVariant[];
  unitPrice?: FwPrice;
  createdAt?: string;
  updatedAt?: string;
}
export interface FwCollection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  images?: FwImage[];
}

function token(): string {
  const t = process.env.FOURTHWALL_STOREFRONT_TOKEN;
  if (!t) throw new Error("FOURTHWALL_STOREFRONT_TOKEN is not configured");
  return t;
}

async function fwFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("storefront_token", token());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { headers: { accept: "application/json" } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Fourthwall API ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// Simple in-memory cache to avoid hammering the API during SSR/HMR
type CacheEntry<T> = { at: number; data: T };
const cache = new Map<string, CacheEntry<unknown>>();
const TTL_MS = 5 * 60 * 1000;
async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;
  const data = await fn();
  cache.set(key, { at: Date.now(), data });
  return data;
}

export async function listCollections(): Promise<FwCollection[]> {
  return cached("collections", async () => {
    const json = await fwFetch<{ results?: FwCollection[] }>("/collections");
    return json.results ?? [];
  });
}

export async function listCollectionProducts(slug: string): Promise<FwProduct[]> {
  return cached(`collection:${slug}`, async () => {
    const json = await fwFetch<{ results?: FwProduct[] }>(`/collections/${encodeURIComponent(slug)}/products`);
    return json.results ?? [];
  });
}

export async function listAllProducts(): Promise<FwProduct[]> {
  return cached("all-products", async () => {
    const collections = await listCollections();
    const seen = new Map<string, FwProduct>();
    for (const c of collections) {
      try {
        const ps = await listCollectionProducts(c.slug);
        for (const p of ps) if (!seen.has(p.id)) seen.set(p.id, p);
      } catch {
        // ignore individual collection failures
      }
    }
    return Array.from(seen.values());
  });
}

export async function getProductBySlug(slug: string): Promise<FwProduct | null> {
  const all = await listAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

// Public Fourthwall storefront base used for redirect-checkout links.
// Override via env if your store URL differs.
export function shopBaseUrl(): string {
  return process.env.FOURTHWALL_SHOP_URL ?? "https://slowblues-shop.fourthwall.com";
}
