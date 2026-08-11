import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/adminAuth.server";
import { getDB } from "@/integrations/d1/client";

type Guest = { id: string; name: string; location: string | null; message: string; created_at: string };
type Contact = { id: string; name: string; email: string; message: string; created_at: string };

export const listInbox = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = getDB();
    const [guests, contacts] = await Promise.all([
      db.prepare("SELECT * FROM guestbook_entries ORDER BY created_at DESC LIMIT 500").all<Guest>(),
      db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 500").all<Contact>(),
    ]);
    return { guests: guests.results ?? [], contacts: contacts.results ?? [] };
  });

export const deleteGuestbookEntry = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await getDB().prepare("DELETE FROM guestbook_entries WHERE id = ?").bind(data.id).run();
    return { ok: true as const };
  });

export const deleteContactMessage = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await getDB().prepare("DELETE FROM contact_messages WHERE id = ?").bind(data.id).run();
    return { ok: true as const };
  });
