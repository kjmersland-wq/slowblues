#!/usr/bin/env bun
/**
 * AI fallback: generate historical-interpretation portraits for artists
 * where no public-domain/CC photo could be found.
 *
 * Uses Lovable AI gateway (google/gemini-2.5-flash-image, "Nano banana").
 * Uploads to public Supabase storage bucket `artist-images`.
 * Sets artists.img + artists.image_credit and records a row in
 * artist_images with notes "AI-generated historical interpretation".
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY!;
if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

const { data: artists, error } = await sb
  .from("artists")
  .select("slug,name,alt_name,born,died,origin,country,short,biography_en,biography_no,instruments_simple,tag,era,styles")
  .or("img.is.null,img.eq.")
  .order("name");
if (error) throw error;

console.log(`AI portraits for ${artists!.length} artists`);

function buildPrompt(a: any): string {
  const era = a.era || a.tag || "20th century";
  const origin = a.origin || a.country || "USA";
  const instruments = (a.instruments_simple ?? []).join(", ") || "blues musician";
  const styles = (a.styles ?? []).join(", ");
  const bornYearMatch = (a.born ?? "").match(/\b(18|19|20)\d{2}\b/);
  const period = bornYearMatch ? `c. ${parseInt(bornYearMatch[0]) + 25}s` : era;
  const isContemporary = bornYearMatch ? parseInt(bornYearMatch[0]) >= 1970 : false;

  const styleHint = isContemporary
    ? "Color editorial portrait, soft studio lighting, modern blues club atmosphere."
    : "Black and white documentary-style portrait photograph, soft natural light, slight film grain, period-accurate clothing and hair, evocative of 1930s–1960s American blues photography (Lomax/Charters era).";

  return [
    `Historical-interpretation portrait of ${a.name}, ${instruments}${styles ? ", style: " + styles : ""}, from ${origin}, ${period}.`,
    styleHint,
    `Dignified pose, holding or near their instrument when relevant. Strong character in the eyes.`,
    `No text, no watermark, no logo, no signature. Portrait orientation, head-and-shoulders or three-quarter framing.`,
    `Inspired by documented historical references; this is an artistic interpretation, not a claim of likeness.`,
  ].join(" ");
}

async function generate(prompt: string): Promise<Buffer | null> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    console.error(`  gateway ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return null;
  }
  const j: any = await res.json();
  const dataUrl: string | undefined = j?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl) return null;
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}

let ok = 0, miss = 0;
for (const a of artists!) {
  console.log(`→ ${a.name}`);
  const prompt = buildPrompt(a);
  const png = await generate(prompt);
  if (!png) {
    console.log(`  ✗ generation failed`);
    miss++;
    continue;
  }
  const path = `${a.slug}.png`;
  const up = await sb.storage.from("artist-images").upload(path, png, {
    contentType: "image/png",
    upsert: true,
  });
  if (up.error) {
    console.log(`  ✗ upload: ${up.error.message}`);
    miss++;
    continue;
  }
  const { data: pub } = sb.storage.from("artist-images").getPublicUrl(path);
  const url = pub.publicUrl;
  const credit = `AI-generated historical interpretation (no historical photo available). Generated via Lovable AI for SlowBlues.`;
  await sb.from("artists").update({ img: url, image_credit: credit }).eq("slug", a.slug);
  await sb.from("artist_images").insert({
    artist_slug: a.slug,
    image_url: url,
    source: "AI (Lovable AI / google/gemini-2.5-flash-image)",
    credit: "AI-generated historical interpretation",
    credit_url: "https://lovable.dev",
    is_primary: true,
    verified: true,
    verified_at: new Date().toISOString(),
    notes: `AI-generated historical interpretation. Prompt: ${prompt}`,
  });
  ok++;
  console.log(`  ✓ uploaded`);
  await new Promise((r) => setTimeout(r, 600));
}
console.log(`\nDone. generated=${ok} failed=${miss}`);
