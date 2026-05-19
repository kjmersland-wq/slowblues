import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchPhotos, getPhoto, trackDownload, type UnsplashPhoto } from "./unsplash.server";

export type { UnsplashPhoto };

export const searchUnsplash = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        query: z.string().min(1).max(120),
        perPage: z.number().int().min(1).max(30).optional(),
        orientation: z.enum(["landscape", "portrait", "squarish"]).optional(),
        page: z.number().int().min(1).max(50).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    try {
      const photos = await searchPhotos(data.query, {
        perPage: data.perPage,
        orientation: data.orientation,
        page: data.page,
      });
      return { photos, error: null as string | null };
    } catch (e) {
      console.error("searchUnsplash failed:", e);
      return { photos: [] as UnsplashPhoto[], error: e instanceof Error ? e.message : "Unsplash search failed" };
    }
  });

export const getUnsplashPhoto = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().min(3).max(32) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const photo = await getPhoto(data.id);
      return { photo, error: null as string | null };
    } catch (e) {
      console.error("getUnsplashPhoto failed:", e);
      return { photo: null as UnsplashPhoto | null, error: e instanceof Error ? e.message : "Unsplash photo failed" };
    }
  });

/**
 * Call when a photo is actually used (e.g. article published, hero confirmed).
 * Required by Unsplash API guidelines.
 */
export const trackUnsplashDownload = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ downloadLocation: z.string().url() }).parse(d))
  .handler(async ({ data }) => {
    await trackDownload(data.downloadLocation);
    return { ok: true };
  });
