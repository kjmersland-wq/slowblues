// Sends contact-form notifications via Gmail SMTP using an app password —
// no third-party email provider. Requires GMAIL_USER + GMAIL_APP_PASSWORD
// as Cloudflare secrets (wrangler secret put ...) / .dev.vars locally.
// `cloudflare:sockets` (which worker-mailer relies on) is only available
// inside the Workers runtime, so this is a no-op during plain `vite dev`.
type ContactEmailInput = { name: string; email: string; message: string; subject: string };

export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("GMAIL_USER/GMAIL_APP_PASSWORD not configured — skipping email notification.");
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
    {
      from: { name: "SlowBlues kontaktskjema", email: user },
      to: { email: user },
      reply: { name: input.name, email: input.email },
      subject: input.subject,
      text: `Fra: ${input.name} <${input.email}>\n\n${input.message}`,
    },
  );
}
