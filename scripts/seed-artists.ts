/**
 * Seeds the `artists` table from the static ARTISTS/PROFILES constants
 * and adds a fully populated Lonnie Johnson profile as the showcase example
 * of all nine sections.
 *
 * Run once with: bunx tsx scripts/seed-artists.ts
 */
import { createClient } from "@supabase/supabase-js";
import { ARTISTS, PROFILES } from "../src/data/blues";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key, { auth: { persistSession: false } });

type Row = Record<string, unknown>;

const rows: Row[] = ARTISTS.map((a, i) => {
  const p = PROFILES[a.slug];
  return {
    slug: a.slug,
    name: a.name,
    tag: a.tag,
    era: a.era,
    img: a.img,
    short: a.short,
    born: p?.born ?? null,
    origin: p?.origin ?? null,
    bio: p?.bio ?? [],
    signature_songs: p?.signatureSongs ?? [],
    influences: p?.influences ?? [],
    labels: p?.labels ?? [],
    instruments_simple: p?.instruments ?? [],
    legacy: p?.legacy ?? null,
    sort_order: i,
  };
});

// Add Lonnie Johnson as the showcase fully-populated profile
const lonnie = {
  slug: "lonnie-johnson",
  name: "Lonnie Johnson",
  alt_name: "Alonzo Johnson",
  tag: "Classic",
  era: "1899–1970",
  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lonnie_Johnson_%28musician%29.jpg/480px-Lonnie_Johnson_%28musician%29.jpg",
  short: "Jazz-blues-pioner som oppfant gitarsoloen og påvirket alle som fulgte.",
  born: "8. februar 1899",
  died: "16. juni 1970",
  origin: "New Orleans, Louisiana (bodde i Toronto fra 1960-tallet)",
  active_years: "1920s–1970",
  bio: [
    "Lonnie Johnson var en av de mest innflytelsesrike og nyskapende gitaristene i amerikansk musikkhistorie, en sann pioner som bygde bro mellom blues, jazz og tidlig rhythm & blues. Født i New Orleans i 1899 vokste han opp i en stor musikalsk familie og lærte seg flere instrumenter.",
    "Etter å ha vunnet en talentkonkurranse på Booker T. Washington Theatre i 1925, signerte han med OKeh Records og begynte en produktiv innspillingskarriere som strakte seg over fire tiår. Johnsons revolusjonerende enkeltstreng-gitarsoloer kom før den elektriske gitarens tidsalder og påvirket direkte B.B. King, T-Bone Walker, Robert Johnson og Django Reinhardt.",
    "Han spilte inn duetter med Louis Armstrong, Duke Ellington og Eddie Lang – banebrytende tverr-rasielle samarbeid på 1920-tallet. Hiten 'Tomorrow Night' fra 1948 nådde førsteplass på R&B-listene og solgte over tre millioner eksemplarer. Etter år i mørke der han jobbet som hotelljobber i Philadelphia, ble han gjenoppdaget i 1960 og flyttet til Toronto, Canada, hvor han tilbrakte sitt siste tiår med å opptre på folkfestivaler og klubber, og ble et adoptert ikon for den kanadiske bluesscenen.",
  ],
  legacy:
    "Lonnie Johnson regnes allment som faren til gitarsoloen i populærmusikk. Hans enkeltstreng-teknikk påvirket direkte B.B. King, T-Bone Walker, Robert Johnson, Django Reinhardt og praktisk talt alle blues- og jazzgitarister som fulgte. B.B. King kalte ham 'den mest innflytelsesrike gitaristen i blueshistorien.'",
  signature_songs: ["Tomorrow Night", "Mr. Johnson's Blues", "Playing with the Strings", "Got the Blues for Murder Only"],
  influences: ["New Orleans-tradisjon", "Eddie Lang", "Louis Armstrong"],
  labels: ["OKeh", "King", "Prestige/Bluesville", "Columbia"],
  instruments_simple: ["Akustisk gitar", "Elektrisk gitar", "Fiolin", "Vokal"],
  family: [
    { relation: "Far", name: "James Johnson", note: "Musiker; familien var stor og musikalsk" },
    { relation: "Bror", name: "James 'Steady Roll' Johnson", note: "Også bluesmusiker; mange søsken spilte musikk" },
    { relation: "Kone", name: "Mary Williams Johnson", note: "Gift på 1920-tallet" },
  ],
  formative: [
    "Vokste opp i en stor musikalsk familie i New Orleans der praktisk talt alle spilte instrumenter; lærte fiolin, gitar, piano og mandolin som barn.",
    "Mistet det meste av familien i influensapandemien i 1918, et ødeleggende slag som formet hans emosjonelle dybde som artist.",
    "Vant et to-ukers engasjement på Booker T. Washington Theatre i en bluestalentkonkurranse i 1925, som lanserte innspillingskarrieren hans hos OKeh Records.",
    "Hans banebrytende duetter med hvite gitaristen Eddie Lang (1928–1929) var noen av de første tverr-rasielle innspillingssamarbeidene i amerikansk musikkhistorie.",
    "Etter år i mørke der han jobbet som hotelljobber i Philadelphia, ble han gjenoppdaget av platesamleren Chris Albertson i 1960 og lanserte et comeback.",
  ],
  instruments: [
    { category: "Gitar", name: "Various acoustic guitars", years: "1920s–1970", note: "Pioner innen enkeltstreng-gitarsoloer; hans rene, presise plukketeknikk var revolusjonerende for tiden." },
    { category: "Gitar", name: "Various hollow-body electrics", years: "1940s–1970", note: "Gikk smidig over til elektrisk gitar, og beholdt sin signatur rene tone." },
    { category: "Annet", name: "Violin", years: "1910s–1920s", note: "Opprinnelig trent på fiolin; opptrådte av og til med det gjennom karrieren." },
    { category: "Vokal", name: "Vocals", years: "1920s–1970", note: "Glatt, urban vokalstil som påvirket generasjoner av blues- og R&B-sangere." },
  ],
  anecdotes: [
    "Johnsons gitarduetter med Eddie Lang i 1928–1929 (kreditert som 'Blind Willie Dunn' for å skjule hans italienske opphav) var blant de første tverr-rasielle innspillingssesjonene i amerikansk musikk – en dristig handling under Jim Crow-æraen.",
    "B.B. King sa en gang: 'Lonnie Johnson var den første gitaristen jeg hørte som spilte soloer med enkelttoner. Han viste meg at en gitar kunne synge som en menneskestemme. Uten ham ville det ikke vært noen B.B. King.'",
    "Da Johnson ble gjenoppdaget i 1960, jobbet han som vaktmester på Benjamin Franklin Hotel i Philadelphia. Han hadde ikke opptrådt offentlig på nesten et tiår.",
    "Etter å ha flyttet til Toronto tidlig på 1960-tallet, ble Johnson en elsket skikkelse i den kanadiske folk- og bluesscenen, og opptrådte på klubber som Penny Farthing og inspirerte en generasjon kanadiske bluesmusikere.",
    "Robert Johnson (ingen slektning) studerte visstnok Lonnie Johnsons plater besatt. De to Johnson'ene, ubeslektede men forbundet gjennom bluesen, representerer tvillingpilarene i akustisk og elektrisk blues-gitarinnovasjon.",
  ],
  collaborators: [
    { name: "Louis Armstrong", years: "1927–1929", note: "Spilte inn banebrytende duetter inkludert 'Hotter Than That'" },
    { name: "Duke Ellington", years: "1927–1928", note: "Sesjonsgitarist på flere Ellington-innspillinger" },
    { name: "Eddie Lang", years: "1928–1929", note: "Gitarduetter; banebrytende tverr-rasielt samarbeid" },
    { name: "Victoria Spivey", years: "1960s", note: "Gjenforeningsinnspillinger på Spivey Records under comebacket" },
    { name: "Elmer Snowden", years: "1960s", note: "Opptrådte sammen på folkemusikkfestivaler i Toronto" },
  ],
  videos: [
    {
      kind: "featured",
      title: "Lonnie Johnson – Blues By Lonnie Johnson (Full Album)",
      youtube_id: "MhqYz0DXG-Y",
      channel: "All That Jazz Don Kaart",
      note: "Guitar, Vocals – Lonnie Johnson · Piano – Claude Hopkins · Tenor Saxophone – Hal Singer · Bass – Wendell Marshall.",
    },
    { kind: "more", title: "Lonnie Johnson - Swingin' The Blues - 1966", youtube_id: "8DCdN0xPnLg", channel: "lupine22", duration: "3:15", views: "213.8K views" },
    { kind: "more", title: "Lonnie Johnson Too Late To Cry", youtube_id: "uVjGE-r7lDk", channel: "pitotas30", duration: "5:08", views: "482.8K views" },
    { kind: "more", title: "Blues Chronicles #15: Lonnie Johnson – Guitar History Lesson – Reverend Robert Jones", youtube_id: "j2eN_pXgU3w", channel: "TrueFire", duration: "4:01", views: "6.4K views" },
    { kind: "more", title: "Blues for Lonnie Johnson – Robben Ford, Guildford 29/05/24", youtube_id: "pXYg2j_F0CY", channel: "Paddy Blight", duration: "4:36", views: "29.1K views" },
  ],
  discography: [
    { year: 1925, title: "Mr. Johnson's Blues", producer: "Ralph Peer", label: "OKeh Records", musicians_count: 1, notes: "En av hans tidligste innspillinger etter å ha vunnet talentkonkurransen; Ralph Peer ledet OKeh race records-sesjonene" },
    { year: 1927, title: "Hotter Than That (with Louis Armstrong)", producer: "Tommy Rockwell", label: "OKeh Records", musicians_count: 3, notes: "Historisk samarbeid med Louis Armstrong and His Hot Five; Tommy Rockwell ledet" },
    { year: 1928, title: "Guitar Blues / Blue Guitars (with Eddie Lang)", producer: "Tommy Rockwell", label: "OKeh Records", musicians_count: 1, notes: "Banebrytende tverr-rasiell gitarduett; Lang kreditert som 'Blind Willie Dunn' for å skjule hans italienske opphav" },
    { year: 1928, title: "Playing with the Strings", producer: "Tommy Rockwell", label: "OKeh Records", musicians_count: 1, notes: "Viser hans revolusjonerende enkeltstreng-soloteknikk; regnes som fødselen av gitarsoloen i populærmusikk" },
    { year: 1948, title: "Tomorrow Night", producer: "Henry Glover", label: "King Records", musicians_count: 1, chart: "#1 R&B", sales: "3,000,000+", notes: "#1 R&B-hit; solgte over 3 millioner eksemplarer; Henry Glover produserte ved Kings Cincinnati-studio" },
    { year: 1960, title: "Blues by Lonnie Johnson", producer: "Chris Albertson", label: "Prestige/Bluesville", musicians_count: 2, notes: "Comebackalbum etter gjenoppdagelsen av Chris Albertson; innspilt ved Rudy Van Gelders legendariske studio" },
    { year: 1963, title: "Lonnie Johnson with Elmer Snowden", producer: "Kenneth S. Goldstein", label: "Prestige/Bluesville", musicians_count: 1, notes: "Duetter med banjolegenden Elmer Snowden; Kenneth S. Goldstein produserte for Prestige" },
    { year: 1967, title: "Stompin' at the Penny", producer: "John Hammond", label: "Columbia (Canada)", musicians_count: 1, notes: "Liveinnspilling på Torontos Penny Farthing-kaffebar; produsert av den legendariske John Hammond for Columbia" },
  ],
  awards: [
    { year: 1970, title: "Blues Hall of Fame (innlemmet posthumt 1990)", category: "Pioner / Utøver" },
    { year: 2007, title: "Grammy Hall of Fame", category: "'Playing with the Strings' innlemmet" },
  ],
  related_slugs: ["bb-king", "t-bone-walker", "robert-johnson", "blind-lemon-jefferson"],
  sort_order: 999,
};

rows.push(lonnie as Row);

const { error } = await supabase.from("artists").upsert(rows, { onConflict: "slug" });

if (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}
console.log(`Seeded ${rows.length} artists.`);
