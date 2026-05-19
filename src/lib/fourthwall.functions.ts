import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  listAllProducts,
  listCollections,
  listCollectionProducts,
  getProductBySlug,
  shopBaseUrl,
  type FwProduct,
  type FwCollection,
} from "./fourthwall.server";

export type MerchVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: { value: number; currency: string } | null;
  compareAt: { value: number; currency: string } | null;
  color: { name: string; swatch: string | null } | null;
  size: string | null;
  inStock: boolean;
  image: string | null;
};

export type MerchProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  descriptionHtml: string;
  image: string | null;
  images: string[];
  price: { value: number; currency: string } | null;
  priceMax: { value: number; currency: string } | null;
  variants: MerchVariant[];
  colors: { name: string; swatch: string | null }[];
  sizes: string[];
  shopUrl: string;
  inStock: boolean;
};

export type MerchCollection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function mapProduct(p: FwProduct, shop: string): MerchProduct {
  const images = (p.images ?? []).map((i) => i.url).filter(Boolean);
  const variants: MerchVariant[] = (p.variants ?? []).map((v: any) => {
    const attrs = (v.attributes ?? {}) as any;
    return {
      id: v.id,
      name: v.name ?? "",
      sku: v.sku ?? null,
      price: v.unitPrice ? { value: v.unitPrice.value, currency: v.unitPrice.currency } : null,
      compareAt: v.compareAtPrice ? { value: v.compareAtPrice.value, currency: v.compareAtPrice.currency } : null,
      color: attrs.color ? { name: attrs.color.name, swatch: attrs.color.swatch ?? null } : null,
      size: attrs.size?.name ?? null,
      inStock: v.stock?.type === "UNLIMITED" ? true : v.stock?.inStock !== false,
      image: v.images?.[0]?.url ?? null,
    };
  });
  const prices = variants.map((v) => v.price?.value).filter((n): n is number => typeof n === "number");
  const currency = variants.find((v) => v.price)?.price?.currency ?? p.unitPrice?.currency ?? "USD";
  const minP = prices.length ? Math.min(...prices) : (p.unitPrice?.value ?? null);
  const maxP = prices.length ? Math.max(...prices) : (p.unitPrice?.value ?? null);
  const colorsMap = new Map<string, { name: string; swatch: string | null }>();
  for (const v of variants) if (v.color) colorsMap.set(v.color.name, v.color);
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => !!s)));
  const inStock = variants.length ? variants.some((v) => v.inStock) : true;
  const html = p.description ?? "";
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: stripHtml(html),
    descriptionHtml: html,
    image: images[0] ?? null,
    images,
    price: minP !== null ? { value: minP, currency } : null,
    priceMax: maxP !== null && maxP !== minP ? { value: maxP, currency } : null,
    variants,
    colors: Array.from(colorsMap.values()),
    sizes,
    shopUrl: `${shop.replace(/\/$/, "")}/products/${p.slug}`,
    inStock,
  };
}

function mapCollection(c: FwCollection): MerchCollection {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    image: c.images?.[0]?.url ?? null,
  };
}

export const fetchMerchOverview = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    products: MerchProduct[];
    collections: MerchCollection[];
    featured: MerchProduct[];
    shopUrl: string;
    error: string | null;
  }> => {
    const shop = shopBaseUrl();
    try {
      const [products, collections] = await Promise.all([
        listAllProducts(),
        listCollections(),
      ]);
      const mapped = products.map((p) => mapProduct(p, shop));
      return {
        products: mapped,
        collections: collections.map(mapCollection),
        featured: mapped.slice(0, 4),
        shopUrl: shop,
        error: null,
      };
    } catch (e) {
      console.error("[fourthwall] overview failed:", e);
      return {
        products: [],
        collections: [],
        featured: [],
        shopUrl: shop,
        error: e instanceof Error ? e.message : "Failed to load merch",
      };
    }
  },
);

export const fetchMerchProduct = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(200) }))
  .handler(async ({ data }): Promise<{ product: MerchProduct | null; related: MerchProduct[]; shopUrl: string }> => {
    const shop = shopBaseUrl();
    try {
      const p = await getProductBySlug(data.slug);
      if (!p) return { product: null, related: [], shopUrl: shop };
      const all = await listAllProducts();
      const related = all
        .filter((x) => x.id !== p.id)
        .slice(0, 4)
        .map((x) => mapProduct(x, shop));
      return { product: mapProduct(p, shop), related, shopUrl: shop };
    } catch (e) {
      console.error("[fourthwall] product failed:", e);
      return { product: null, related: [], shopUrl: shop };
    }
  });

export const fetchMerchCollection = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(200) }))
  .handler(async ({ data }): Promise<{ collection: MerchCollection | null; products: MerchProduct[]; shopUrl: string }> => {
    const shop = shopBaseUrl();
    try {
      const [collections, products] = await Promise.all([
        listCollections(),
        listCollectionProducts(data.slug),
      ]);
      const c = collections.find((x) => x.slug === data.slug) ?? null;
      return {
        collection: c ? mapCollection(c) : null,
        products: products.map((p) => mapProduct(p, shop)),
        shopUrl: shop,
      };
    } catch (e) {
      console.error("[fourthwall] collection failed:", e);
      return { collection: null, products: [], shopUrl: shop };
    }
  });
