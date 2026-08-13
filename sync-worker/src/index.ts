import { runDiscogsSync } from "./discogs";
import { runMusicBrainzSync } from "./musicbrainz";
import { runWikidataSync } from "./wikidataSync";
import { runTourSync } from "./tours";
import { runHealthCheck, checkUrl } from "./healthcheck";
import type { Env, RunSummary } from "./types";

// Cloudflare Workers cap subrequests (fetch() + D1 queries combined) at 50
// per invocation. Running all 5 modules in one invocation blew straight
// through that (confirmed via wrangler tail: "Too many subrequests by
// single Worker invocation" on nearly every link check). Each module is
// individually batch-capped to stay under that ceiling on its own AND runs
// as its own separate Worker invocation, dispatched via the SELF service
// binding (see wrangler.jsonc) — so each one gets a completely fresh
// 50-subrequest budget. A plain fetch() to our own workers.dev URL is
// rejected outright by Cloudflare (error 1042).
const MODULES: Record<string, (env: Env) => Promise<RunSummary>> = {
  discogs: runDiscogsSync,
  musicbrainz: runMusicBrainzSync,
  wikidata: runWikidataSync,
  tours: runTourSync,
  healthcheck: runHealthCheck,
};

function formatReport(summaries: RunSummary[]): string {
  const lines: string[] = [`SlowBlues sync-engine run — ${new Date().toISOString()}`, ""];
  for (const s of summaries) {
    lines.push(`## ${s.module}`);
    lines.push(`  seen: ${s.artistsSeen}, changed: ${s.artistsChanged}, errors: ${s.errors.length}`);
    for (const n of s.notes) lines.push(`  - ${n}`);
    for (const e of s.errors) lines.push(`  ! ${e}`);
    lines.push("");
  }
  return lines.join("\n");
}

/**
 * SlowBlues sync-engine — a deterministic, non-AI Cloudflare Worker.
 * Every module here is plain HTTP + JSON parsing against public APIs
 * (Discogs, MusicBrainz, Wikidata SPARQL, Bandsintown/Songkick) — there is
 * no LLM call anywhere in this codebase. Runs Monday 03:00 UTC via the
 * `triggers.crons` entry in wrangler.jsonc.
 *
 * Safety contract (see each module for specifics):
 *   - Discography sync only ever APPENDS new (year,title) entries; existing
 *     rows are never edited, reordered or removed.
 *   - Wikidata sync only ever FILLS currently-empty fields.
 *   - Tour-date sync overwrites tour_dates_url only — an inherently dynamic
 *     field, safe to refresh every run.
 *   - Health-check only writes to the link_check column; it never deletes
 *     or edits a URL/video itself.
 *   - Every write is mirrored into artist_edit_log with edited_by
 *     'sync-engine: ...' for full auditability — biography_*, anecdotes_i18n,
 *     collaborators_i18n, press_quotes_i18n, formative_i18n and every other
 *     editorial field is never referenced by any module in this worker.
 *   - Every module processes a small, staleness-ordered batch per run (see
 *     db.ts) rather than the whole catalog at once, so the full artist
 *     roster rotates through over several weekly runs without ever
 *     exceeding Cloudflare's per-invocation subrequest limit.
 */
async function runAllChained(env: Env): Promise<RunSummary[]> {
  const summaries: RunSummary[] = [];
  for (const name of Object.keys(MODULES)) {
    try {
      const res = await env.SELF.fetch(`https://internal/module/${name}`, { method: "POST" });
      const summary = (await res.json()) as RunSummary;
      summaries.push(summary);
    } catch (e) {
      summaries.push({
        module: name,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        artistsSeen: 0,
        artistsChanged: 0,
        errors: [`chained call failed: ${e instanceof Error ? e.message : String(e)}`],
        notes: [],
      });
    }
  }
  return summaries;
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        const summaries = await runAllChained(env);
        console.log(formatReport(summaries));
      })()
    );
  },

  // This worker has no production routes on slow-blues.com — only the
  // default *.workers.dev URL, used for the cron's internal self-fetch
  // chaining and for manual testing below.
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const moduleMatch = url.pathname.match(/^\/module\/([a-z]+)$/);
    if (moduleMatch && request.method === "POST") {
      const fn = MODULES[moduleMatch[1]];
      if (!fn) return new Response("unknown module", { status: 404 });
      const summary = await fn(env);
      return new Response(JSON.stringify(summary), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/debug-checkurl") {
      const target = url.searchParams.get("url") ?? "https://en.wikipedia.org/wiki/Eric_Bibb";
      const r = await checkUrl(target);
      return new Response(JSON.stringify(r, null, 2), { headers: { "Content-Type": "application/json" } });
    }

    // Full manual run, chained exactly like the real Monday cron.
    if (url.pathname === "/run" && request.method === "POST") {
      const summaries = await runAllChained(env);
      return new Response(formatReport(summaries), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    return new Response(
      "slowblues-sync-engine: POST /run for a full chained test run, POST /module/<name> for one module, or wait for the Monday 03:00 UTC cron.",
      { status: 200 }
    );
  },
};
