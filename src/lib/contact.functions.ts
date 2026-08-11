import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; email: string; message: string }) => d)
  .handler(async ({ data }) => {
    const name = data.name.trim().slice(0, 100);
    const email = data.email.trim().slice(0, 255);
    const message = data.message.trim().slice(0, 2000);
    if (!name || !email || !message) throw new Error("Alle felt er påkrevd");

    const db = getDB();
    await db
      .prepare("INSERT INTO contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), name, email, message)
      .run();
    return { ok: true as const };
  });
