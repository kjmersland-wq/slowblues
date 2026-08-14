import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { buildArtistUpdates, type UpdateItem, type UpdateType, type ArtistUpdates } from "./updates.server";

export type { UpdateItem, UpdateType, ArtistUpdates };

export const getArtistUpdates = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDB();
  const { active, archive } = await buildArtistUpdates(db);
  return { active, archive, generatedAt: new Date().toISOString() };
});
