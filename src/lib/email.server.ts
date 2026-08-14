// Sends contact-form notifications via Gmail SMTP using an app password —
// no third-party email provider. Requires GMAIL_USER + GMAIL_APP_PASSWORD
// as Cloudflare secrets (wrangler secret put ...) / .dev.vars locally.
// `cloudflare:sockets` (which worker-mailer relies on) is only available
// inside the Workers runtime, so this is a no-op during plain `vite dev`.
import { tr, type Lang } from "@/i18n";

type MailMessage = {
  from: { name: string; email: string };
  to: { name?: string; email: string };
  reply?: { name?: string; email: string };
  subject: string;
  text: string;
};

async function sendGmail(message: MailMessage): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("GMAIL_USER/GMAIL_APP_PASSWORD not configured — skipping email.");
    return;
  }

  const { WorkerMailer } = await import("worker-mailer");
  await WorkerMailer.send(
    {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      credentials: { username: user, password: pass },
      authType: "login",
    },
    message,
  );
}

type ContactEmailInput = { name: string; email: string; message: string; subject: string };

export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  if (!user) return; // sendGmail() below logs/skips; avoid building the message for nothing
  await sendGmail({
    from: { name: "SlowBlues kontaktskjema", email: user },
    to: { email: user },
    reply: { name: input.name, email: input.email },
    subject: input.subject,
    text: `Fra: ${input.name} <${input.email}>\n\n${input.message}`,
  });
}

export type ContactFormType = "contact" | "advertise";

type AutoReplyInput = { name: string; email: string; lang: Lang; formType: ContactFormType };

const AUTO_REPLY_SUBJECT: Record<Lang, string> = {
  no: "Takk for meldingen din — Slow-Blues",
  en: "Thanks for your message — Slow-Blues",
  sv: "Tack för ditt meddelande — Slow-Blues",
  de: "Danke für Ihre Nachricht — Slow-Blues",
  pl: "Dziękujemy za wiadomość — Slow-Blues",
};

function autoReplyBody(name: string, formType: ContactFormType, lang: Lang): string {
  if (formType === "advertise") {
    return tr(lang, {
      no: `Hei ${name},\n\nTakk for henvendelsen din om annonsering/samarbeid med Slow-Blues. Vi tar kontakt med deg snarest.\n\nVennlig hilsen\nSlow-Blues`,
      en: `Hi ${name},\n\nThank you for your advertising/partnership inquiry with Slow-Blues. We'll get back to you shortly.\n\nBest regards,\nSlow-Blues`,
      sv: `Hej ${name},\n\nTack för din förfrågan om annonsering/samarbete med Slow-Blues. Vi återkommer till dig snarast.\n\nMed vänliga hälsningar,\nSlow-Blues`,
      de: `Hallo ${name},\n\nVielen Dank für Ihre Anfrage zu Werbung/Zusammenarbeit mit Slow-Blues. Wir melden uns in Kürze bei Ihnen.\n\nMit freundlichen Grüßen,\nSlow-Blues`,
      pl: `Cześć ${name},\n\nDziękujemy za zapytanie dotyczące reklamy/współpracy ze Slow-Blues. Skontaktujemy się z Tobą wkrótce.\n\nPozdrawiamy,\nSlow-Blues`,
    });
  }
  return tr(lang, {
    no: `Hei ${name},\n\nTakk for mailen du sendte oss. Vi tar kontakt med deg snarest.\n\nVennlig hilsen\nSlow-Blues`,
    en: `Hi ${name},\n\nThank you for your email. We'll get back to you shortly.\n\nBest regards,\nSlow-Blues`,
    sv: `Hej ${name},\n\nTack för mailet du skickade oss. Vi återkommer till dig snarast.\n\nMed vänliga hälsningar,\nSlow-Blues`,
    de: `Hallo ${name},\n\nVielen Dank für Ihre E-Mail. Wir melden uns in Kürze bei Ihnen.\n\nMit freundlichen Grüßen,\nSlow-Blues`,
    pl: `Cześć ${name},\n\nDziękujemy za wiadomość. Skontaktujemy się z Tobą wkrótce.\n\nPozdrawiamy,\nSlow-Blues`,
  });
}

export async function sendAutoReply(input: AutoReplyInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  if (!user) return;
  await sendGmail({
    from: { name: "Slow-Blues", email: user },
    to: { name: input.name, email: input.email },
    subject: AUTO_REPLY_SUBJECT[input.lang],
    text: autoReplyBody(input.name, input.formType, input.lang),
  });
}
