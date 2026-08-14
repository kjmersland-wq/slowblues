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
  html?: string;
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
  no: "Takk for at du tok kontakt — Slow-Blues",
  en: "Thank you for contacting us — Slow-Blues",
  sv: "Tack för att du hörde av dig — Slow-Blues",
  de: "Danke für Ihre Kontaktaufnahme — Slow-Blues",
  pl: "Dziękujemy za kontakt — Slow-Blues",
};

const SIGN_OFF: Record<Lang, string> = {
  no: "Med vennlig hilsen,",
  en: "Warm regards,",
  sv: "Varma hälsningar,",
  de: "Herzliche Grüße,",
  pl: "Serdecznie pozdrawiamy,",
};

function autoReplyIntro(name: string, formType: ContactFormType, lang: Lang): string {
  if (formType === "advertise") {
    return tr(lang, {
      no: `Tusen takk for at du tok kontakt med oss på Slow-Blues.com angående samarbeid og annonsering. Vi setter stor pris på interessen, og en fra teamet vårt tar kontakt med deg så snart som mulig.`,
      en: `Thank you so much for reaching out to us at Slow-Blues.com about a partnership or advertising. We really appreciate your interest, and someone from our team will get in touch with you as soon as possible.`,
      sv: `Stort tack för att du kontaktade oss på Slow-Blues.com angående samarbete och annonsering. Vi uppskattar verkligen ditt intresse, och någon i vårt team hör av sig till dig så snart som möjligt.`,
      de: `Vielen herzlichen Dank, dass Sie sich bei Slow-Blues.com bezüglich einer Partnerschaft oder Werbung gemeldet haben. Wir freuen uns sehr über Ihr Interesse, und jemand aus unserem Team wird sich so schnell wie möglich bei Ihnen melden.`,
      pl: `Serdecznie dziękujemy za kontakt z Slow-Blues.com w sprawie współpracy lub reklamy. Bardzo doceniamy Twoje zainteresowanie — ktoś z naszego zespołu skontaktuje się z Tobą najszybciej, jak to możliwe.`,
    });
  }
  return tr(lang, {
    no: `Tusen takk for at du tok kontakt med oss på Slow-Blues.com. Vi setter stor pris på at du skrev til oss, og en fra teamet vårt tar kontakt med deg så snart som mulig.`,
    en: `Thank you so much for taking the time to contact us at Slow-Blues.com. We truly appreciate hearing from you, and someone from our team will get in touch with you as soon as possible.`,
    sv: `Stort tack för att du tog dig tid att kontakta oss på Slow-Blues.com. Vi uppskattar verkligen att höra från dig, och någon i vårt team hör av sig till dig så snart som möjligt.`,
    de: `Vielen herzlichen Dank, dass Sie sich die Zeit genommen haben, uns bei Slow-Blues.com zu kontaktieren. Wir freuen uns sehr, von Ihnen zu hören, und jemand aus unserem Team wird sich so schnell wie möglich bei Ihnen melden.`,
    pl: `Serdecznie dziękujemy, że poświęciłeś/aś czas i skontaktowałeś/aś się z nami na Slow-Blues.com. Bardzo cieszymy się z Twojej wiadomości — ktoś z naszego zespołu skontaktuje się z Tobą najszybciej, jak to możliwe.`,
  });
}

function greeting(name: string, lang: Lang): string {
  return tr(lang, {
    no: `Hei ${name},`,
    en: `Hi ${name},`,
    sv: `Hej ${name},`,
    de: `Hallo ${name},`,
    pl: `Cześć ${name},`,
  });
}

const LOGO_URL = "https://www.slow-blues.com/email-logo.png";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function autoReplyHtml(name: string, formType: ContactFormType, lang: Lang): string {
  const hello = greeting(escapeHtml(name), lang);
  const intro = autoReplyIntro(name, formType, lang);
  const signOff = SIGN_OFF[lang];
  return `<!doctype html>
<html lang="${lang}">
  <body style="margin:0;padding:32px 16px;background:#0d0b09;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#16130f;border:1px solid #3a2f1f;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:28px 32px 12px;text-align:center;">
          <img src="${LOGO_URL}" width="72" height="72" alt="Slow-Blues" style="display:inline-block;border-radius:8px;" />
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 32px;color:#e8ddc8;font-size:15px;line-height:1.7;">
          <p style="margin:0 0 16px;">${hello}</p>
          <p style="margin:0 0 20px;">${intro}</p>
          <p style="margin:0;color:#c9b98a;">${signOff}<br/>Slow-Blues</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function autoReplyText(name: string, formType: ContactFormType, lang: Lang): string {
  return `${greeting(name, lang)}\n\n${autoReplyIntro(name, formType, lang)}\n\n${SIGN_OFF[lang]}\nSlow-Blues`;
}

export async function sendAutoReply(input: AutoReplyInput): Promise<void> {
  const user = process.env.GMAIL_USER;
  if (!user) return;
  await sendGmail({
    from: { name: "Slow-Blues", email: user },
    to: { name: input.name, email: input.email },
    subject: AUTO_REPLY_SUBJECT[input.lang],
    text: autoReplyText(input.name, input.formType, input.lang),
    html: autoReplyHtml(input.name, input.formType, input.lang),
  });
}
