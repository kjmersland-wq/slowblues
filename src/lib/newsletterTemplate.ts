// Generates a reusable HTML newsletter template for MailerLite.
// Editor fills in fields → copies HTML → pastes into MailerLite's HTML block.

export type NewsletterLink = { label: string; url: string; note?: string };
export type NewsletterVideo = { videoId: string; title: string; channel?: string };

export type NewsletterTemplateInput = {
  edition: string;            // e.g. "Monday Letter · No. 47"
  date: string;               // e.g. "18 May 2026"
  headline: string;           // main headline
  intro: string;              // 1–2 paragraphs
  featuredVideo?: NewsletterVideo;
  storyTitle?: string;
  storyBody?: string;         // can include simple HTML <p>, <em>, <strong>
  internalLinks: NewsletterLink[];   // links to slowblues.no
  externalLinks: NewsletterLink[];   // links to YouTube, artist pages, festivals
  closing?: string;
  archiveUrl?: string;
};

const SITE = "https://sslow-blues.lovable.app";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkList(title: string, links: NewsletterLink[], accent: string): string {
  if (!links.length) return "";
  const items = links
    .map(
      (l) => `
      <tr><td style="padding:8px 0;border-bottom:1px solid #2a2418;">
        <a href="${esc(l.url)}" style="color:${accent};text-decoration:none;font-weight:600;font-size:15px;">${esc(l.label)}</a>
        ${l.note ? `<div style="color:#a39b8a;font-size:13px;margin-top:3px;">${esc(l.note)}</div>` : ""}
      </td></tr>`
    )
    .join("");
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0;">
    <tr><td style="padding:0 0 12px 0;">
      <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${accent};">${esc(title)}</div>
    </td></tr>
    ${items}
  </table>`;
}

export function renderNewsletterHTML(input: NewsletterTemplateInput): string {
  const gold = "#c9a14a";
  const cream = "#f4ecd8";
  const ink = "#1a1410";
  const muted = "#a39b8a";
  const archive = input.archiveUrl || `${SITE}/newsletter`;

  const videoBlock = input.featuredVideo
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0;">
      <tr><td>
        <a href="https://www.youtube.com/watch?v=${esc(input.featuredVideo.videoId)}" style="display:block;text-decoration:none;">
          <img src="https://i.ytimg.com/vi/${esc(input.featuredVideo.videoId)}/hqdefault.jpg"
               alt="${esc(input.featuredVideo.title)}"
               width="600" style="display:block;width:100%;max-width:600px;height:auto;border-radius:8px;border:1px solid #2a2418;" />
        </a>
        <div style="margin-top:10px;font-family:Georgia,serif;font-style:italic;color:${muted};font-size:13px;">
          ▶ Watch on YouTube${input.featuredVideo.channel ? ` — ${esc(input.featuredVideo.channel)}` : ""}
        </div>
      </td></tr>
    </table>`
    : "";

  const storyBlock =
    input.storyTitle || input.storyBody
      ? `
    <div style="margin:28px 0;">
      ${input.storyTitle ? `<h2 style="font-family:Georgia,serif;font-size:24px;color:${cream};margin:0 0 12px 0;">${esc(input.storyTitle)}</h2>` : ""}
      ${input.storyBody ? `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:${cream};">${input.storyBody}</div>` : ""}
    </div>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(input.headline)}</title>
</head>
<body style="margin:0;padding:0;background:${ink};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${ink};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#15110c;border:1px solid #2a2418;border-radius:12px;">
    <tr><td style="padding:36px 36px 8px 36px;text-align:center;">
      <a href="${SITE}" style="text-decoration:none;">
        <img src="${SITE}/assets/logo-slowblues.png" alt="SlowBlues" width="160" style="display:inline-block;width:160px;height:auto;" />
      </a>
      <div style="margin-top:14px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${gold};">
        ${esc(input.edition)} · ${esc(input.date)}
      </div>
    </td></tr>

    <tr><td style="padding:24px 36px 0 36px;">
      <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.25;color:${cream};margin:0 0 18px 0;">
        ${esc(input.headline)}
      </h1>
      <div style="font-family:Georgia,serif;font-size:17px;line-height:1.75;color:${cream};">
        ${input.intro
          .split(/\n\n+/)
          .map((p) => `<p style="margin:0 0 14px 0;">${esc(p)}</p>`)
          .join("")}
      </div>
    </td></tr>

    <tr><td style="padding:0 36px;">${videoBlock}</td></tr>
    <tr><td style="padding:0 36px;">${storyBlock}</td></tr>

    <tr><td style="padding:0 36px;">
      ${linkList("Read on SlowBlues.no", input.internalLinks, gold)}
    </td></tr>

    <tr><td style="padding:0 36px;">
      ${linkList("Out in the world", input.externalLinks, gold)}
    </td></tr>

    ${input.closing ? `
    <tr><td style="padding:8px 36px 28px 36px;">
      <div style="font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.7;color:${cream};">
        ${esc(input.closing)}
      </div>
    </td></tr>` : ""}

    <tr><td style="padding:24px 36px 36px 36px;border-top:1px solid #2a2418;">
      <div style="font-family:Georgia,serif;font-size:12px;line-height:1.7;color:${muted};text-align:center;">
        <a href="${SITE}" style="color:${gold};text-decoration:none;">SlowBlues.no</a> ·
        <a href="${archive}" style="color:${gold};text-decoration:none;">Newsletter archive</a> ·
        <a href="${SITE}/watch" style="color:${gold};text-decoration:none;">Watch on YouTube</a>
        <br/><br/>
        Every Monday, 21:00 CET. Written by hand from Norway.<br/>
        You're receiving this because you signed up at SlowBlues.no.<br/>
        <a href="{$unsubscribe}" style="color:${muted};text-decoration:underline;">Unsubscribe</a> ·
        <a href="{$forward}" style="color:${muted};text-decoration:underline;">Forward to a friend</a>
      </div>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

export const DEMO_INPUT: NewsletterTemplateInput = {
  edition: "Monday Letter · No. 47",
  date: "18 May 2026",
  headline: "The slow burn of Buddy Guy at 89",
  intro:
    "Some nights the blues feels like a long-distance phone call from someone who's seen it all. This week, that voice belongs to Buddy Guy.\n\nWe spent the weekend digging through his Chicago years for a new piece on SlowBlues — and found a thread that runs from Muddy Waters to a 22-year-old guitarist playing a club in Oslo last Friday.",
  featuredVideo: {
    videoId: "dQw4w9WgXcQ",
    title: "Buddy Guy — Damn Right I've Got the Blues (Live)",
    channel: "Buddy Guy Official",
  },
  storyTitle: "Why this matters now",
  storyBody:
    "<p>The blues isn't nostalgia. It's a working language — and the artists keeping it alive deserve more than a streaming algorithm's polite indifference.</p><p>Every link below is hand-picked. Every video is on YouTube — the only place the full performance lives without compromise.</p>",
  internalLinks: [
    { label: "Read: Buddy Guy at 89 — the Chicago thread", url: `${SITE}/blog/buddy-guy-89`, note: "Long-read, 12 min" },
    { label: "Review: Christone Kingfish Ingram — Cementville Live", url: `${SITE}/reviews`, note: "★★★★½" },
    { label: "Artist profile: Susan Tedeschi", url: `${SITE}/artists/susan-tedeschi` },
  ],
  externalLinks: [
    { label: "Watch: Buddy Guy & Eric Clapton — Crossroads 2010", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", note: "YouTube — full set" },
    { label: "Notodden Blues Festival 2026 lineup", url: "https://bluesfest.no" },
    { label: "Tedeschi Trucks — official tour dates", url: "https://www.tedeschitrucksband.com/tour" },
  ],
  closing: "Until next Monday — keep the volume up, and the talking down.\n— Per Christian, SlowBlues",
};
