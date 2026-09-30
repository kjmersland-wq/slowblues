import type { Env, RunSummary } from "./types";
import { ON_THIS_DAY } from "./onThisDayCalendar";

type Lang = "en" | "no" | "sv" | "de" | "pl";
const LANGS: Lang[] = ["en", "no", "sv", "de", "pl"];
type LangText = Record<Lang, string>;

type Kind = "birthday" | "onthisday" | "memoriam" | "release" | "concert" | "external" | "house" | "youtube";

type Item = {
  id: string;
  kind: Kind;
  flag?: string;
  href: string;
  external?: boolean;
  sourceName?: string;
  label: LangText;
  text: LangText;
};

// ===== Batch rhythm: twice a week, Europe/Oslo wall-clock time =====
// Batch A = Mon-Wed, Batch B = Thu-Sun. Computed from the ISO week number
// of the Oslo-local date, not from a fixed UTC cron time -- Cloudflare
// Workers cron triggers have no timezone support and can't track DST, so
// instead this runs inside the EXISTING daily 05:00 UTC job (idempotent: it
// checks whether the current batch already exists and no-ops if so) and
// works out "which batch should be live right now" from actual Oslo
// wall-clock weekday every time. That's correct across the DST transition
// for free, with no separate cron entries to maintain.
function getOsloParts(date: Date): { year: number; month: number; day: number; weekday: number } {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { year: Number(get("year")), month: Number(get("month")), day: Number(get("day")), weekday: weekdayMap[get("weekday")] ?? 0 };
}

function isoWeekInfo(plainUtcDate: Date): { isoYear: number; isoWeek: number } {
  const d = new Date(Date.UTC(plainUtcDate.getUTCFullYear(), plainUtcDate.getUTCMonth(), plainUtcDate.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // Thursday of this ISO week
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
  return { isoYear: d.getUTCFullYear(), isoWeek: week };
}

function mondayOfIsoWeek(isoYear: number, isoWeek: number): Date {
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const jan4DayNum = (jan4.getUTCDay() + 6) % 7;
  const monday = new Date(jan4.getTime() - jan4DayNum * 86_400_000);
  monday.setUTCDate(monday.getUTCDate() + (isoWeek - 1) * 7);
  return monday;
}

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

type BatchWindow = { batchKey: string; periodStart: string; periodEnd: string; days: { month: number; day: number }[]; osloYear: number };

function getCurrentBatchWindow(now: Date = new Date()): BatchWindow {
  const oslo = getOsloParts(now);
  const localNoon = new Date(Date.UTC(oslo.year, oslo.month - 1, oslo.day, 12));
  const { isoYear, isoWeek } = isoWeekInfo(localNoon);
  const monday = mondayOfIsoWeek(isoYear, isoWeek);
  const half: "A" | "B" = oslo.weekday >= 1 && oslo.weekday <= 3 ? "A" : "B";
  const start = half === "A" ? monday : addDays(monday, 3);
  const end = half === "A" ? addDays(monday, 2) : addDays(monday, 6);
  const days: { month: number; day: number }[] = [];
  for (let d = start; d.getTime() <= end.getTime(); d = addDays(d, 1)) {
    days.push({ month: d.getUTCMonth() + 1, day: d.getUTCDate() });
  }
  return { batchKey: `T-${isoYear}-W${String(isoWeek).padStart(2, "0")}-${half}`, periodStart: fmtDate(start), periodEnd: fmtDate(end), days, osloYear: oslo.year };
}

// ===== Free-text born/died parsing =====
// Most legacy artist bios store born/died as prose ("April 26, 1886,
// Columbus, Georgia"), not ISO dates -- only the newest profiles use
// YYYY-MM-DD. Both are parsed here; anything that doesn't contain a
// recognizable day+month is skipped rather than guessed at.
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function parseHistoricalDate(raw: string | null): { year: number; month: number; day: number } | null {
  if (!raw) return null;
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return { year: Number(isoMatch[1]), month: Number(isoMatch[2]), day: Number(isoMatch[3]) };
  const cleaned = raw.replace(/^\s*c\.?a?\.?\s+/i, "").trim(); // strip leading "c." / "ca."
  const monthMatch = cleaned.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i);
  if (monthMatch) {
    const month = MONTHS.indexOf(monthMatch[1].toLowerCase()) + 1;
    return { year: Number(monthMatch[3]), month, day: Number(monthMatch[2]) };
  }
  return null;
}

function dayInWindow(d: { month: number; day: number }, days: { month: number; day: number }[]): boolean {
  return days.some((w) => w.month === d.month && w.day === d.day);
}

// ===== i18n scaffolding =====
const LABELS: Record<Kind, LangText> = {
  birthday: { en: "BORN THIS WEEK", no: "FØDT DENNE UKA", sv: "FÖDD DENNA VECKA", de: "GEBOREN DIESE WOCHE", pl: "URODZONY/A W TYM TYGODNIU" },
  onthisday: { en: "ON THIS DAY", no: "PÅ EN SLIK DAG", sv: "PÅ EN SÅDAN DAG", de: "AN EINEM TAG WIE HEUTE", pl: "TEGO DNIA" },
  memoriam: { en: "IN MEMORIAM", no: "I MINNET", sv: "TILL MINNE", de: "IN MEMORIAM", pl: "KU PAMIĘCI" },
  release: { en: "REVIEW", no: "ANMELDELSE", sv: "RECENSION", de: "REZENSION", pl: "RECENZJA" },
  concert: { en: "LIVE", no: "LIVE", sv: "LIVE", de: "LIVE", pl: "NA ŻYWO" },
  external: { en: "NEWS", no: "NYTT", sv: "NYTT", de: "NEWS", pl: "WIADOMOŚCI" }, // overwritten per-source below
  house: { en: "SLOWBLUES", no: "SLOWBLUES", sv: "SLOWBLUES", de: "SLOWBLUES", pl: "SLOWBLUES" },
  youtube: { en: "WATCH", no: "SE", sv: "SE", de: "ANSEHEN", pl: "OBEJRZYJ" },
};

const FLAG_BY_COUNTRY: Record<string, string> = {
  Norway: "🇳🇴", Sweden: "🇸🇪", Denmark: "🇩🇰", Finland: "🇫🇮",
  "United Kingdom": "🇬🇧", UK: "🇬🇧", England: "🇬🇧",
  Germany: "🇩🇪", France: "🇫🇷", Italy: "🇮🇹", Spain: "🇪🇸",
  Netherlands: "🇳🇱", Belgium: "🇧🇪", Ireland: "🇮🇪",
  USA: "🇺🇸", "United States": "🇺🇸", Canada: "🇨🇦",
  Australia: "🇦🇺", Japan: "🇯🇵", Poland: "🇵🇱",
};

function birthdayText(name: string, age: number, alive: boolean): LangText {
  return alive
    ? {
        en: `${name} turns ${age} this week.`,
        no: `${name} fyller ${age} år denne uka.`,
        sv: `${name} fyller ${age} år den här veckan.`,
        de: `${name} wird diese Woche ${age}.`,
        pl: `W tym tygodniu ${age}. urodziny obchodzi ${name}.`,
      }
    : {
        en: `${name} would have turned ${age} this week.`,
        no: `${name} ville fylt ${age} år denne uka.`,
        sv: `${name} skulle ha fyllt ${age} år den här veckan.`,
        de: `${name} wäre diese Woche ${age} geworden.`,
        pl: `W tym tygodniu przypadałyby ${age}. urodziny — ${name}.`,
      };
}

function memoriamText(name: string, year: number, age: number | null, short: LangText): LangText {
  const ageBit = { en: age ? `, aged ${age}` : "", no: age ? `, ${age} år gammel` : "", sv: age ? `, ${age} år gammal` : "", de: age ? `, im Alter von ${age}` : "", pl: age ? `, w wieku ${age} lat` : "" };
  const tail = (s: string) => (s.trim() ? ` ${s.trim()}` : "");
  return {
    en: `${name} — passed away ${year}${ageBit.en}.${tail(short.en)}`,
    no: `${name} — gikk bort ${year}${ageBit.no}.${tail(short.no)}`,
    sv: `${name} — gick bort ${year}${ageBit.sv}.${tail(short.sv)}`,
    de: `${name} — verstarb ${year}${ageBit.de}.${tail(short.de)}`,
    pl: `${name} — zmarł/a w ${year}${ageBit.pl}.${tail(short.pl)}`,
  };
}

async function log(env: Env, batchKey: string, checkType: string, result: "pass" | "warn", detail: string) {
  try {
    await env.DB.prepare(`INSERT INTO quiz_generation_log (id, cycle_number, check_type, result, detail) VALUES (?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), 0, `ticker_${checkType}`, result, `[${batchKey}] ${detail}`)
      .run();
  } catch {
    // best-effort logging only -- never block the batch over a log-table miss
  }
}

/**
 * Builds and locks ONE ticker batch (Mon-Wed or Thu-Sun, Europe/Oslo) if it
 * doesn't already exist. Idempotent: safe to call every day via the
 * existing daily cron -- only does real work on the first run after a new
 * half-week starts. Once written, a batch's content never changes even if
 * RSS/reviews/concerts change underneath it; the next batch picks those up.
 */
export async function runTickerBatch(env: Env): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  const notes: string[] = [];

  const window = getCurrentBatchWindow();
  const existing = await env.DB.prepare(`SELECT 1 FROM ticker_batches WHERE batch_key = ?`).bind(window.batchKey).first();
  if (existing) {
    notes.push(`${window.batchKey} already built — nothing to do.`);
    return { module: "ticker-batch", startedAt, finishedAt: new Date().toISOString(), artistsSeen: 0, artistsChanged: 0, errors, notes };
  }

  const items: Item[] = [];
  const usedArtistKind = new Set<string>(); // `${slug}:${kind}` -- no duplicate artist+kind in one batch

  // ---- 1) Birthdays + 2) Memoriam, both derived from the same artists scan ----
  const { results: artistRows } = await env.DB.prepare(
    `SELECT slug, name, born, died, country, short_en, short_no, short_sv, short_de, short_pl FROM artists`
  ).all<{ slug: string; name: string; born: string | null; died: string | null; country: string | null; short_en: string | null; short_no: string | null; short_sv: string | null; short_de: string | null; short_pl: string | null }>();

  const birthdayCandidates: Item[] = [];
  const memoriamAnniversary: Item[] = [];
  const memoriamRecent: Item[] = [];
  const RECENT_DAYS = 30;
  const nowMs = Date.now();

  for (const a of artistRows ?? []) {
    const born = parseHistoricalDate(a.born);
    const died = parseHistoricalDate(a.died);
    const alive = !a.died || a.died.trim() === "";
    const flag = a.country ? FLAG_BY_COUNTRY[a.country] : undefined;

    if (born && dayInWindow(born, window.days)) {
      const age = window.osloYear - born.year;
      if (age > 0 && age < 130) {
        birthdayCandidates.push({
          id: `birthday-${a.slug}`, kind: "birthday", flag, href: `/artists/${a.slug}`,
          label: LABELS.birthday, text: birthdayText(a.name, age, alive),
        });
      }
    }

    if (died) {
      const short: LangText = { en: a.short_en ?? "", no: a.short_no ?? a.short_en ?? "", sv: a.short_sv ?? a.short_en ?? "", de: a.short_de ?? a.short_en ?? "", pl: a.short_pl ?? a.short_en ?? "" };
      const age = born ? died.year - born.year : null;
      // Recency uses the real calendar date (only possible when died is a
      // full ISO date, since prose dates before 2000-ish are never "recent"
      // anyway) -- separate from the day-of-year anniversary check below.
      const diedIso = a.died && /^\d{4}-\d{2}-\d{2}/.test(a.died) ? new Date(a.died.slice(0, 10)) : null;
      if (diedIso && !Number.isNaN(diedIso.getTime())) {
        const ageDays = (nowMs - diedIso.getTime()) / 86_400_000;
        if (ageDays >= 0 && ageDays <= RECENT_DAYS) {
          memoriamRecent.push({
            id: `memoriam-recent-${a.slug}`, kind: "memoriam", flag, href: `/artists/${a.slug}`,
            label: LABELS.memoriam, text: memoriamText(a.name, died.year, age, short),
          });
          continue; // don't also evaluate as an anniversary below
        }
      }
      if (died.year < window.osloYear && dayInWindow(died, window.days)) {
        memoriamAnniversary.push({
          id: `memoriam-anniv-${a.slug}`, kind: "memoriam", flag, href: `/artists/${a.slug}`,
          label: LABELS.memoriam, text: memoriamText(a.name, died.year, age, short),
        });
      }
    }
  }

  const MAX_MEMORIAM = 4;
  const memoriamPicked = [...memoriamRecent, ...memoriamAnniversary].slice(0, MAX_MEMORIAM);
  for (const it of memoriamPicked) {
    const slug = it.href.split("/").pop()!;
    usedArtistKind.add(`${slug}:memoriam`);
    items.push(it);
  }

  const MAX_BIRTHDAYS = 8;
  for (const it of birthdayCandidates.slice(0, MAX_BIRTHDAYS)) {
    const slug = it.href.split("/").pop()!;
    if (usedArtistKind.has(`${slug}:memoriam`)) continue; // don't wish a happy birthday next to their own obituary
    items.push(it);
  }
  if ((artistRows?.length ?? 0) > 0 && birthdayCandidates.length === 0 && memoriamPicked.length === 0) {
    notes.push("No birthdays or memorial anniversaries fall in this batch's date window.");
  }

  // ---- 3) On this day (curated calendar) ----
  for (const entry of ON_THIS_DAY) {
    if (dayInWindow({ month: entry.month, day: entry.day }, window.days)) {
      items.push({ id: `onthisday-${entry.id}`, kind: "onthisday", href: entry.href, label: LABELS.onthisday, text: entry.text });
    }
  }

  // ---- 4) Reviews (35-day freshness window -- looser than RSS/new-profile) ----
  const REVIEW_WINDOW_DAYS = 35;
  try {
    const { results } = await env.DB.prepare(
      `SELECT slug, artist_name, album_title, total_score, verdict_en, verdict_no, verdict_sv, verdict_de, published_at
       FROM blues_reviews WHERE status = 'published' AND published_at >= datetime('now', ?)
       ORDER BY published_at DESC LIMIT 6`
    ).bind(`-${REVIEW_WINDOW_DAYS} days`).all<{ slug: string; artist_name: string; album_title: string; total_score: number | null; verdict_en: string | null; verdict_no: string | null; verdict_sv: string | null; verdict_de: string | null; published_at: string }>();
    for (const r of results ?? []) {
      const score = r.total_score ? ` — ${Number(r.total_score).toFixed(1)}/10` : "";
      const mk = (v: string | null) => `${r.artist_name} — ${r.album_title}${score}${v ? `. ${v}` : ""}`;
      items.push({
        id: `release-${r.slug}`, kind: "release", href: `/reviews/${r.slug}`, label: LABELS.release,
        text: { en: mk(r.verdict_en), no: mk(r.verdict_no ?? r.verdict_en), sv: mk(r.verdict_sv ?? r.verdict_en), de: mk(r.verdict_de ?? r.verdict_en), pl: mk(r.verdict_en) },
      });
    }
  } catch (e) {
    notes.push(`reviews query failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ---- 5) Concerts (upcoming, nearest first, must have a real date) ----
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { results } = await env.DB.prepare(
      `SELECT slug, title, artist_name, venue, city, country, event_date FROM concerts
       WHERE status = 'published' AND event_date >= ? ORDER BY event_date ASC LIMIT 6`
    ).bind(today).all<{ slug: string; title: string; artist_name: string | null; venue: string | null; city: string | null; country: string | null; event_date: string }>();
    for (const c of results ?? []) {
      const flag = c.country ? FLAG_BY_COUNTRY[c.country] : undefined;
      const where = [c.venue, c.city].filter(Boolean).join(", ");
      const when = new Date(c.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      const line = [c.title, c.artist_name, where, when].filter(Boolean).join(" — ");
      items.push({ id: `concert-${c.slug}`, kind: "concert", flag, href: `/concerts/${c.slug}`, label: LABELS.concert, text: { en: line, no: line, sv: line, de: line, pl: line } });
    }
  } catch (e) {
    notes.push(`concerts query failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ---- 6) External RSS (capped at 4, English-source-only) ----
  // Living Blues publishes in English; Jefferson Blues Magazine in Swedish.
  // This is a deterministic, non-AI engine with no translation step, so a
  // guessed machine translation of a Swedish headline would be worse than
  // just not showing it in other locales -- only genuinely English-language
  // sources are pulled in here, same rule as before, regardless of which
  // site locale is requesting the batch (lifting the old "ticker text is
  // English-only on every locale" rule applies to the HOUSE/generated
  // items below, which are now hand-translated into all 5 languages, not
  // to syndicated foreign-language RSS content).
  const ENGLISH_SOURCES = new Set(["Living Blues"]);
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, text, href, source FROM ticker_items WHERE (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP) ORDER BY pinned DESC, COALESCE(published_at, created_at) DESC LIMIT 12`
    ).all<{ id: string; text: string; href: string | null; source: string }>();
    let count = 0;
    for (const t of results ?? []) {
      if (count >= 4) break;
      if (!t.href || !ENGLISH_SOURCES.has(t.source)) continue;
      const href = t.href.replace(/^https?:\/\/(www\.)?slowblues\.no(?=[/?#]|$)/i, "https://www.slow-blues.com");
      items.push({
        id: t.id, kind: "external", href, external: true, sourceName: t.source,
        label: { en: `[${t.source.toUpperCase()}]`, no: `[${t.source.toUpperCase()}]`, sv: `[${t.source.toUpperCase()}]`, de: `[${t.source.toUpperCase()}]`, pl: `[${t.source.toUpperCase()}]` },
        text: { en: t.text, no: t.text, sv: t.text, de: t.text, pl: t.text },
      });
      count++;
    }
  } catch (e) {
    notes.push(`external RSS query failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ---- 7) House (2-3 of these, rotated by batch so it isn't the same set
  // every time -- deterministic seed from the batch key so it doesn't
  // reshuffle on every read, just each new batch) ----
  let quizPublished = false;
  try {
    const row = await env.DB.prepare(`SELECT 1 FROM quiz_cycles WHERE status = 'published' AND period_start <= date('now') AND period_end >= date('now')`).first();
    quizPublished = !!row;
  } catch {
    // leave false
  }
  const housePool: Item[] = [
    { id: "house-guestbook", kind: "house", href: "/guestbook", label: { ...LABELS.house, en: "GUESTBOOK", no: "GJESTEBOK", sv: "GÄSTBOK", de: "GÄSTEBUCH", pl: "KSIĘGA GOŚCI" }, text: { en: "Leave us a note — we'd love to hear your blues story.", no: "Skriv en hilsen — vi vil høre din blueshistorie.", sv: "Skriv en hälsning — vi vill höra din bluesberättelse.", de: "Hinterlasse einen Gruß — wir hören gern deine Blues-Geschichte.", pl: "Zostaw wpis — chętnie poznamy Twoją historię z bluesem." } },
    { id: "house-archive", kind: "house", href: "/artists", label: { ...LABELS.house, en: "ARCHIVE", no: "ARKIVET", sv: "ARKIVET", de: "ARCHIV", pl: "ARCHIWUM" }, text: { en: "Browse the whole artist archive — pioneers, masters and today's voices.", no: "Bla i hele artistarkivet — pionerene, mestrene og dagens stemmer.", sv: "Bläddra i hela artistarkivet — pionjärerna, mästarna och dagens röster.", de: "Durchstöbere das ganze Künstlerarchiv — Pioniere, Meister und die Stimmen von heute.", pl: "Przeglądaj całe archiwum artystów — pionierów, mistrzów i dzisiejsze głosy." } },
    { id: "house-learn-styles", kind: "house", href: "/learn/styles", label: { ...LABELS.house, en: "LEARN", no: "LÆR", sv: "LÄR", de: "LERNEN", pl: "NAUKA" }, text: { en: "Delta, Chicago, Texas — what actually sets the blues styles apart?", no: "Delta, Chicago, Texas — hva skiller egentlig blues-stilene?", sv: "Delta, Chicago, Texas — vad skiljer egentligen bluesstilarna åt?", de: "Delta, Chicago, Texas — was unterscheidet die Blues-Stile eigentlich?", pl: "Delta, Chicago, Teksas — co właściwie różni style bluesa?" } },
  ];
  if (quizPublished) {
    housePool.push({ id: "house-quiz", kind: "house", href: "/quiz", label: { ...LABELS.house, en: "QUIZ", no: "QUIZ", sv: "QUIZ", de: "QUIZ", pl: "QUIZ" }, text: { en: "Think you know your blues? Prove it.", no: "Tror du at du kan bluesen din? Bevis det.", sv: "Tror du att du kan din blues? Bevisa det.", de: "Glaubst du, du kennst deinen Blues? Beweise es.", pl: "Myślisz, że znasz się na bluesie? Udowodnij." } });
  }
  // Deterministic rotation seeded by batch key, so the pick changes each
  // batch but is stable for everyone reading the same batch.
  let seed = 0;
  for (const c of window.batchKey) seed = (seed * 31 + c.charCodeAt(0)) & 0x7fffffff;
  const houseCount = Math.min(3, housePool.length);
  const houseStart = housePool.length ? seed % housePool.length : 0;
  for (let i = 0; i < houseCount; i++) items.push(housePool[(houseStart + i) % housePool.length]);

  // ---- Round-robin merge so it never reads as "12 obits in a row" ----
  const KIND_ORDER: Kind[] = ["birthday", "onthisday", "memoriam", "release", "concert", "external", "house", "youtube"];
  const byKind = new Map<Kind, Item[]>(KIND_ORDER.map((k) => [k, items.filter((i) => i.kind === k)]));
  const merged: Item[] = [];
  let round = 0;
  const MAX_ITEMS = 28;
  while (merged.length < MAX_ITEMS && KIND_ORDER.some((k) => (byKind.get(k)?.length ?? 0) > round)) {
    for (const k of KIND_ORDER) {
      if (merged.length >= MAX_ITEMS) break;
      const it = byKind.get(k)?.[round];
      if (it) merged.push(it);
    }
    round++;
  }

  const MIN_ITEMS = 16;
  if (merged.length < MIN_ITEMS) {
    notes.push(`Only ${merged.length}/${MIN_ITEMS} items available for ${window.batchKey} — publishing anyway (never padded with duplicates or invented content).`);
  }
  await log(env, window.batchKey, "count", merged.length >= MIN_ITEMS ? "pass" : "warn", `${merged.length} items (${memoriamPicked.length} memoriam, ${birthdayCandidates.length} birthdays available)`);

  // ---- Write the batch (locked from here on) ----
  await env.DB.prepare(`INSERT INTO ticker_batches (batch_key, period_start, period_end, item_count) VALUES (?, ?, ?, ?)`)
    .bind(window.batchKey, window.periodStart, window.periodEnd, merged.length)
    .run();

  let position = 0;
  for (const it of merged) {
    await env.DB.prepare(
      `INSERT INTO ticker_batch_items (id, batch_key, position, kind, flag, href, external, source_name, label_json, text_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(crypto.randomUUID(), window.batchKey, position++, it.kind, it.flag ?? null, it.href, it.external ? 1 : 0, it.sourceName ?? null, JSON.stringify(it.label), JSON.stringify(it.text))
      .run();
  }

  notes.push(`${window.batchKey} built: ${merged.length} items (${window.periodStart} to ${window.periodEnd}).`);
  return { module: "ticker-batch", startedAt, finishedAt: new Date().toISOString(), artistsSeen: artistRows?.length ?? 0, artistsChanged: merged.length, errors, notes };
}
