import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";

export type GuestbookEntry = { id: string; name: string; location: string | null; message: string; created_at: string };

export const fetchGuestbookEntries = createServerFn({ method: "GET" }).handler(async () => {
  const db = getDB();
  const { results } = await db
    .prepare("SELECT id, name, location, message, created_at FROM guestbook_entries ORDER BY created_at DESC LIMIT 100")
    .all<GuestbookEntry>();
  return results ?? [];
});

export const submitGuestbookEntry = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; location: string | null; message: string }) => d)
  .handler(async ({ data }) => {
    const name = data.name.trim().slice(0, 60);
    const location = data.location?.trim() ? data.location.trim().slice(0, 80) : null;
    const message = data.message.trim().slice(0, 800);
    if (!name || !message) throw new Error("Navn og melding er påkrevd");

    const db = getDB();
    await db
      .prepare("INSERT INTO guestbook_entries (id, name, location, message) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), name, location, message)
      .run();
    return { ok: true as const };
  });
