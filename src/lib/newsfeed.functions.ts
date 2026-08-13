import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { buildNewsTicker, type TickerItem } from "./newsfeed.server";

export type { TickerItem };

export const getNewsTicker = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDB();
  return buildNewsTicker(db);
});
