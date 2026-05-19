import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchPexels, type PexelsPhoto } from "./pexels.server";
import { searchPixabay, type PixabayPhoto } from "./pixabay.server";

export type { PexelsPhoto, PixabayPhoto };

export const searchPexelsPhotos = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        query: z.string().min(1).max(120),
        perPage: z.number().int().min(1).max(80).optional(),
        orientation: z.enum(["landscape", "portrait", "square"]).optional(),
        page: z.number().int().min(1).max(50).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    try {
      const photos = await searchPexels(data.query, {
        perPage: data.perPage,
        orientation: data.orientation,
        page: data.page,
      });
      return { photos, error: null as string | null };
    } catch (e) {
      console.error("searchPexelsPhotos failed:", e);
      return { photos: [] as PexelsPhoto[], error: e instanceof Error ? e.message : "Pexels search failed" };
    }
  });

export const searchPixabayPhotos = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        query: z.string().min(1).max(120),
        perPage: z.number().int().min(3).max(200).optional(),
        orientation: z.enum(["horizontal", "vertical", "all"]).optional(),
        imageType: z.enum(["photo", "illustration", "all"]).optional(),
        page: z.number().int().min(1).max(50).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    try {
      const photos = await searchPixabay(data.query, {
        perPage: data.perPage,
        orientation: data.orientation,
        imageType: data.imageType,
        page: data.page,
      });
      return { photos, error: null as string | null };
    } catch (e) {
      console.error("searchPixabayPhotos failed:", e);
      return { photos: [] as PixabayPhoto[], error: e instanceof Error ? e.message : "Pixabay search failed" };
    }
  });
