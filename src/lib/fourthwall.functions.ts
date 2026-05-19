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

export type MerchProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  images: string[];
  price: { value: number; currency: string } | null;
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

function mapProduct(p: FwProduct, shop: string): MerchProduct {
  const images = (p.images ?? []).map((i) => i.url).filter(Boolean);
  const price = p.unitPrice ?? p.variants?.find((v) => v.unitPrice)?.unitPrice ?? null;
  const inStock =
    p.variants?.some((v) => v.stock?.inStock !== false) ?? true;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    image: images[0] ?? null,
    images,
    price: price ? { value: price.value, currency: price.currency } : null,
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
