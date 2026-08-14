import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { buildArtistUpdates, type UpdateItem, type UpdateType } from "./updates.server";

export type { UpdateItem, UpdateType };

export const getArtistUpdates = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDB();
  const items = await buildArtistUpdates(db);
  return { items, generatedAt: new Date().toISOString() };
});
