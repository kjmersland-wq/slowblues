import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const slugs = ['alec-seward','bessie-tucker','big-joe-duskin','blind-john-davis','bob-gaddy','bumble-bee-slim','cripple-clarence-lofton','dan-patlansky','james-crutchfield','jazz-gillum','johnny-augland','jolly-jumper-big-moe','kevin-borich','kurt-slevigen','lightnin-slim','little-buddy-doyle','pinetop-sparks','tor-einar-daumann-jacobsen'];
const { error } = await sb.from("artists").update({ img: null, image_credit: null }).in("slug", slugs);
console.log(error ?? "reverted " + slugs.length);
