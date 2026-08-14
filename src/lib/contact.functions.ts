import { createServerFn } from "@tanstack/react-start";
import { getDB } from "@/integrations/d1/client";
import { sendContactEmail, sendAutoReply, type ContactFormType } from "@/lib/email.server";
import type { Lang } from "@/i18n";

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; email: string; message: string; lang: Lang; formType?: ContactFormType }) => d)
  .handler(async ({ data }) => {
    const name = data.name.trim().slice(0, 100);
    const email = data.email.trim().slice(0, 255);
    const message = data.message.trim().slice(0, 2000);
    if (!name || !email || !message) throw new Error("Alle felt er påkrevd");
    const formType: ContactFormType = data.formType ?? "contact";

    const db = getDB();
    await db
      .prepare("INSERT INTO contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), name, email, message)
      .run();

    // Best-effort: the message is already safely stored above, so an email
    // hiccup (e.g. SMTP not configured, transient failure) must not fail
    // the user-facing submission.
    try {
      await sendContactEmail({ name, email, message, subject: `Ny melding fra ${name} — Slow-Blues kontaktskjema` });
    } catch (err) {
      console.error("Failed to send contact notification email:", err);
    }

    try {
      await sendAutoReply({ name, email, lang: data.lang, formType });
    } catch (err) {
      console.error("Failed to send auto-reply email:", err);
    }

    return { ok: true as const };
  });
