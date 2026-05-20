#!/usr/bin/env bun
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(url, key, { auth: { persistSession: false } });

const sql = readFileSync("/tmp/enrich.sql", "utf8");
const lines = sql.split("\n").filter((l) => l.trim().startsWith("UPDATE"));
console.log(`Applying ${lines.length} updates...`);

// Parse: UPDATE artists SET col = 'val', col2 = '...'::jsonb, ... WHERE slug = 'xxx';
function parseUpdate(line: string): { slug: string; data: Record<string, any> } | null {
  const m = line.match(/^UPDATE artists SET (.+?) WHERE slug = '([^']+)';?\s*$/);
  if (!m) return null;
  const setClause = m[1];
  const slug = m[2];
  // Split by ", colname = " — tricky because values contain commas. Use regex to find " <ident> = "
  // Strategy: find all "col = " positions.
  const data: Record<string, any> = {};
  const re = /(\w+)\s*=\s*('(?:[^'\\]|''|\\.)*')(?:::jsonb)?/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(setClause)) !== null) {
    const col = mm[1];
    let val: any = mm[2].slice(1, -1).replace(/''/g, "'");
    if (setClause.substring(mm.index, mm.index + mm[0].length).endsWith("::jsonb")) {
      val = JSON.parse(val);
    }
    data[col] = val;
  }
  return { slug, data };
}

let ok = 0, fail = 0;
const batch = 8;
for (let i = 0; i < lines.length; i += batch) {
  const chunk = lines.slice(i, i + batch);
  await Promise.all(chunk.map(async (line) => {
    const p = parseUpdate(line);
    if (!p) { fail++; console.warn("parse-fail:", line.slice(0, 100)); return; }
    const { error } = await sb.from("artists").update(p.data).eq("slug", p.slug);
    if (error) { fail++; console.warn("err", p.slug, error.message); }
    else ok++;
  }));
  if ((i / batch) % 10 === 0) console.log(`  ${i}/${lines.length}`);
}
console.log(`Done. ok=${ok} fail=${fail}`);
