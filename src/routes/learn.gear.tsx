import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/i18n";
import { ExternalLink, Share2, Music, Guitar, Mic, Speaker, Drum } from "lucide-react";

export const Route = createFileRoute("/learn/gear")({
  head: () => ({
    meta: [
      { title: "Blues Gear & Brands — Fender, Gibson, Hohner & More | SlowBlues" },
      { name: "description", content: "The instruments, amplifiers, harmonicas and microphones that built the blues sound. Fender, Gibson, Marshall, Hohner, Shure — history, key models and the blues musicians who played them." },
      { property: "og:title", content: "Blues Gear & Brands | SlowBlues" },
      { property: "og:description", content: "The tools that shaped the blues sound — guitars, amps, harmonicas, mics." },
      { property: "og:url", content: "https://www.slowblues.no/learn/gear" },
    ],
    links: [{ rel: "canonical", href: "https://www.slowblues.no/learn/gear" }],
  }),
  component: GearPage,
});

type Cat = "guitars" | "amps" | "harmonicas" | "drums" | "mics";

type Artist = { name: string; slug?: string; note?: string };
type Brand = {
  id: string;
  cat: Cat;
  name: string;
  founded: string;
  models: string[];
  editorialEN: string;
  editorialNO?: string;
  url: string;
  ytQuery: string;
  artists: Artist[];
};

const BRANDS: Brand[] = [
  {
    id: "fender", cat: "guitars", name: "Fender",
    founded: "1946 · Leo Fender · Fullerton, California",
    models: ["Telecaster (1950)", "Stratocaster (1954)", "Fender Bassman amp"],
    editorialEN: "Leo Fender couldn't play guitar. That's the great irony. He built his instruments by listening to musicians — what they needed, what hurt their hands, what got lost in the mix on a noisy stage. The Telecaster was the first mass-produced solid-body electric guitar. Blues players picked it up immediately. Albert Collins never put his down.",
    editorialNO: "Leo Fender kunne ikke spille gitar. Det er den store ironien. Han bygde instrumenter ved å lytte til musikere — hva de trengte, hva som gjorde vondt i hendene, hva som forsvant i miksen på en støyende scene. Telecasteren var den første masseproduserte elektriske solid-body-gitaren. Bluesmusikerne tok den i bruk umiddelbart. Albert Collins la den aldri fra seg.",
    url: "https://www.fender.com",
    ytQuery: "Fender Telecaster blues history",
    artists: [
      { name: "Albert Collins", slug: "albert-collins", note: "Telecaster" },
      { name: "Buddy Guy", slug: "buddy-guy", note: "Stratocaster" },
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan", note: "Stratocaster" },
      { name: "Rory Gallagher", slug: "rory-gallagher", note: "Stratocaster" },
      { name: "Robert Cray", slug: "robert-cray", note: "Stratocaster" },
      { name: "Muddy Waters", slug: "muddy-waters", note: "Telecaster" },
    ],
  },
  {
    id: "gibson", cat: "guitars", name: "Gibson",
    founded: "1902 · Orville Gibson · Kalamazoo, Michigan",
    models: ["ES-335 (1958)", "Les Paul (1952)", "ES-150 (1936)", "Flying V (1958)", "SG (1961)"],
    editorialEN: "BB King named his Gibson 'Lucille' after a woman whose name caused a bar fight and a fire. He ran back into the burning building to rescue the guitar. After that, every Gibson ES-355 he owned was called Lucille. That's the blues relationship with a Gibson — it's not just an instrument, it's a partner.",
    editorialNO: "BB King kalte sin Gibson «Lucille» etter ei dame hvis navn forårsaket et barslagsmål og en brann. Han løp tilbake inn i den brennende bygningen for å redde gitaren. Etter det het hver eneste Gibson ES-355 han eide Lucille. Det er bluesens forhold til en Gibson — det er ikke bare et instrument, det er en partner.",
    url: "https://www.gibson.com",
    ytQuery: "Gibson ES-335 blues",
    artists: [
      { name: "BB King", slug: "bb-king", note: "ES-335 'Lucille'" },
      { name: "Albert King", slug: "albert-king", note: "Flying V" },
      { name: "Gary Moore", slug: "gary-moore", note: "Les Paul" },
      { name: "Eric Clapton", slug: "eric-clapton", note: "Les Paul" },
      { name: "Duane Allman", slug: "duane-allman", note: "Les Paul" },
    ],
  },
  {
    id: "martin", cat: "guitars", name: "Martin",
    founded: "1833 · C.F. Martin Sr. · Nazareth, Pennsylvania",
    models: ["000-28", "00-17", "Dreadnought series"],
    editorialEN: "Before the amplifier, there was the Martin. Robert Johnson played a Gibson L-1, yes — but the acoustic Martin defined the Delta sound for an entire generation of blues musicians who couldn't afford electricity and didn't need it.",
    editorialNO: "Før forsterkeren fantes Martin. Robert Johnson spilte en Gibson L-1, ja — men den akustiske Martin definerte Delta-lyden for en hel generasjon bluesmusikere som ikke hadde råd til strøm og ikke trengte det.",
    url: "https://www.martinguitar.com",
    ytQuery: "Martin acoustic blues Delta",
    artists: [
      { name: "Robert Johnson", slug: "robert-johnson" },
      { name: "Eric Clapton", slug: "eric-clapton", note: "Unplugged" },
    ],
  },
  {
    id: "national", cat: "guitars", name: "National / Resonator",
    founded: "1927 · John Dopyera · Los Angeles",
    models: ["Style O (metal resonator)", "Dobro (wood resonator)"],
    editorialEN: "Before amplification, if you needed to be heard over a noisy room, you played a National. The metal resonator became the sound of the Delta — that metallic, ringing sustain you hear on Son House and Bukka White recordings. Slide guitar and a National. Nothing louder. Nothing more desperate-sounding.",
    editorialNO: "Før forsterkningen kom: trengte du å høres over en støyende sal, spilte du en National. Metallresonatoren ble lyden av Delta — den metalliske, klingende sustainen du hører på opptakene til Son House og Bukka White. Slidegitar og en National. Ingenting høyere. Ingenting mer desperat.",
    url: "https://www.nationalguitars.com",
    ytQuery: "National resonator guitar blues",
    artists: [
      { name: "Son House", slug: "son-house" },
      { name: "Bukka White", slug: "bukka-white" },
      { name: "Tampa Red", slug: "tampa-red" },
    ],
  },
  {
    id: "fender-amps", cat: "amps", name: "Fender Amplifiers",
    founded: "1946 · Fullerton, California",
    models: ["Tweed Bassman (1957)", "Blues Junior", "Super Reverb", "Vibroverb"],
    editorialEN: "The tweed Fender Bassman was originally designed for bass guitar. Nobody used it for bass. Blues and rock guitarists immediately understood what a slightly overdriven Bassman could do. It became the foundation of the Chicago sound — and the inspiration for the first Marshall amp.",
    editorialNO: "Tweed Fender Bassman ble opprinnelig designet for bassgitar. Ingen brukte den til bass. Blues- og rockegitarister forsto umiddelbart hva en lett overdrevet Bassman kunne gjøre. Den ble grunnsteinen i Chicago-lyden — og inspirasjonen til den første Marshall-forsterkeren.",
    url: "https://www.fender.com/amps",
    ytQuery: "Fender tweed Bassman blues tone",
    artists: [
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan" },
      { name: "Buddy Guy", slug: "buddy-guy" },
    ],
  },
  {
    id: "marshall", cat: "amps", name: "Marshall",
    founded: "1962 · Jim Marshall · London",
    models: ["JTM45 (1962)", "1962 Bluesbreaker combo", "Plexi Super Lead"],
    editorialEN: "Jim Marshall was a drum teacher who ran a music shop in Hanwell, London. His customers — young British guitarists who'd been listening to American blues records — kept asking for louder American amps. Marshall built them something better. The JTM45 was directly inspired by the Fender Bassman. Eric Clapton plugged a Les Paul into one in 1966 and made the Beano album. That sound changed everything.",
    editorialNO: "Jim Marshall var en trommelærer som drev en musikkbutikk i Hanwell, London. Kundene hans — unge britiske gitarister som hadde hørt på amerikanske blues-plater — ba stadig om høyere amerikanske forsterkere. Marshall bygde dem noe bedre. JTM45 var direkte inspirert av Fender Bassman. Eric Clapton koblet en Les Paul inn i en i 1966 og lagde Beano-platen. Den lyden forandret alt.",
    url: "https://www.marshallamps.com",
    ytQuery: "Marshall Bluesbreaker Eric Clapton John Mayall",
    artists: [
      { name: "Eric Clapton", slug: "eric-clapton" },
      { name: "Gary Moore", slug: "gary-moore" },
      { name: "Rory Gallagher", slug: "rory-gallagher" },
    ],
  },
  {
    id: "vox", cat: "amps", name: "Vox",
    founded: "1957 · Tom Jennings · Dartford, England",
    models: ["AC30"],
    editorialEN: "The AC30 was the British blues boom in box form — bright, chimey, and capable of a snarl when pushed. John Mayall and the first Fleetwood Mac generation leaned on it.",
    editorialNO: "AC30 var det britiske bluesboomet i en boks — lys, klingende, og i stand til å snerre når den ble presset. John Mayall og den første Fleetwood Mac-generasjonen lente seg på den.",
    url: "https://www.voxamps.com",
    ytQuery: "Vox AC30 blues British",
    artists: [{ name: "John Mayall", slug: "john-mayall" }],
  },
  {
    id: "dumble", cat: "amps", name: "Dumble",
    founded: "Hand-built · Alexander Dumble · California",
    models: ["Overdrive Special", "Steel String Singer"],
    editorialEN: "Howard Alexander Dumble builds amplifiers one at a time, by hand, in secret. He doesn't advertise. He doesn't have a website. He chooses his customers personally. Stevie Ray Vaughan had one. That should tell you everything.",
    editorialNO: "Howard Alexander Dumble bygger forsterkere én om gangen, for hånd, i hemmelighet. Han annonserer ikke. Han har ingen nettside. Han velger kundene sine selv. Stevie Ray Vaughan hadde en. Det burde fortelle deg alt.",
    url: "https://en.wikipedia.org/wiki/Dumble_Amplifiers",
    ytQuery: "Dumble amp Stevie Ray Vaughan",
    artists: [
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan" },
    ],
  },
  {
    id: "hohner", cat: "harmonicas", name: "Hohner",
    founded: "1857 · Matthias Hohner · Trossingen, Germany",
    models: ["Marine Band (1896)", "Special 20", "Chromonica", "Blues Harp"],
    editorialEN: "A Marine Band harmonica costs around 50 dollars. Little Walter put one through a PA system in the 1950s and invented amplified blues harp. He cupped a bullet microphone in his hands with the harmonica and created a sound nobody had heard before — part saxophone, part guitar, entirely blues. Fifty dollars. Changed music forever.",
    editorialNO: "Et Marine Band-munnspill koster rundt 50 dollar. Little Walter kjørte ett gjennom et PA-anlegg på 1950-tallet og oppfant forsterket bluesharp. Han kuppet en bullet-mikrofon sammen med munnspillet og skapte en lyd ingen hadde hørt før — halvt saksofon, halvt gitar, helt blues. Femti dollar. Forandret musikken for alltid.",
    url: "https://www.hohner.com",
    ytQuery: "Hohner Marine Band blues",
    artists: [
      { name: "Little Walter", slug: "little-walter" },
      { name: "Sonny Boy Williamson II", slug: "sonny-boy-williamson-ii" },
      { name: "Charlie Musselwhite", slug: "charlie-musselwhite" },
      { name: "Paul Butterfield", slug: "paul-butterfield" },
      { name: "Big Walter Horton", slug: "big-walter-horton" },
    ],
  },
  {
    id: "lee-oskar", cat: "harmonicas", name: "Lee Oskar",
    founded: "1983 · Lee Oskar · Denmark / USA",
    models: ["Major Diatonic", "Melody Maker", "Natural Minor"],
    editorialEN: "Durable, airtight construction. A favourite of professional touring blues harp players who can't afford a leaky reed plate on night three of a tour.",
    editorialNO: "Solid og lufttett konstruksjon. En favoritt blant profesjonelle turnerende bluesharpspillere som ikke har råd til en lekk reedplate på natt tre av en turné.",
    url: "https://www.leeoskar.com",
    ytQuery: "Lee Oskar harmonica blues",
    artists: [{ name: "Lee Oskar", note: "War" }],
  },
  {
    id: "ludwig", cat: "drums", name: "Ludwig",
    founded: "1909 · William & Theobald Ludwig · Chicago",
    models: ["Classic Maple", "Black Beauty snare"],
    editorialEN: "The Chicago blues rhythm section ran on Ludwig drums. Fred Below, Francis Clay, Sam Lay — the men who locked down the groove for Muddy Waters, Little Walter and Howlin' Wolf were playing Ludwig. Blues rhythm is not decoration. It is the foundation. These drums were the foundation.",
    editorialNO: "Chicago-bluesens rytmeseksjon gikk på Ludwig-trommer. Fred Below, Francis Clay, Sam Lay — mennene som låste grooven for Muddy Waters, Little Walter og Howlin' Wolf, spilte Ludwig. Bluesrytme er ikke dekorasjon. Det er fundamentet. Disse trommene var fundamentet.",
    url: "https://www.ludwig-drums.com",
    ytQuery: "Chicago blues drums Ludwig",
    artists: [
      { name: "Muddy Waters", slug: "muddy-waters", note: "band" },
      { name: "Howlin' Wolf", slug: "howlin-wolf", note: "band" },
    ],
  },
  {
    id: "gretsch", cat: "drums", name: "Gretsch Drums",
    founded: "1883 · Friedrich Gretsch · Brooklyn",
    models: ["Broadkaster", "USA Custom"],
    editorialEN: "Gretsch carried the jazz-blues crossover era. Charlie Watts famously brought their feel into the Rolling Stones — and the Stones brought the blues to the world.",
    editorialNO: "Gretsch bar jazz-blues-overgangstiden. Charlie Watts brakte berømt deres følelse inn i Rolling Stones — og Stones brakte bluesen ut i verden.",
    url: "https://www.gretschdrums.com",
    ytQuery: "Gretsch drums blues",
    artists: [],
  },
  {
    id: "shure", cat: "mics", name: "Shure",
    founded: "1925 · Sidney Shure · Chicago",
    models: ["520DX 'Green Bullet'", "SM57", "SM58", "55SH 'Unidyne'"],
    editorialEN: "The Shure Green Bullet was designed in 1949 as a dispatcher's microphone for trucking companies. Blues harmonica players stole it. Its limited frequency response — it cuts the highs and mids brutally — turned out to be exactly what amplified blues harp needed. The 'wrong' microphone for the 'wrong' purpose became one of the most iconic sounds in blues. That's very blues.",
    editorialNO: "Shure Green Bullet ble designet i 1949 som en dispatcher-mikrofon for lastebilselskaper. Bluesmunnspillerne stjal den. Den begrensede frekvensresponsen — den kutter diskanten og mellomtonen brutalt — viste seg å være akkurat det forsterket bluesharp trengte. Den «feile» mikrofonen til det «feile» formålet ble en av de mest ikoniske lydene i blues. Veldig blues, det.",
    url: "https://www.shure.com",
    ytQuery: "Shure Green Bullet blues harmonica",
    artists: [
      { name: "Little Walter", slug: "little-walter" },
      { name: "Sonny Boy Williamson II", slug: "sonny-boy-williamson-ii" },
      { name: "Charlie Musselwhite", slug: "charlie-musselwhite" },
      { name: "Kim Wilson" },
    ],
  },
  {
    id: "astatic", cat: "mics", name: "Astatic JT-30",
    founded: "1933 · Astatic Corporation · Conneaut, Ohio",
    models: ["JT-30 crystal mic"],
    editorialEN: "The original blues harp mic before the Green Bullet ever existed. A crystal element with a brittle, midrange-forward voice that early Chicago harmonica players ran straight into a small tube amp — and history happened.",
    editorialNO: "Den opprinnelige bluesharp-mikrofonen, før Green Bullet engang fantes. Et krystallelement med en sprø, mellomtone-tung stemme som tidlige Chicago-munnspillere kjørte rett inn i en liten rørforsterker — og historien skjedde.",
    url: "https://www.astatic.com",
    ytQuery: "Astatic JT-30 blues harmonica",
    artists: [],
  },
];

const CATS: { id: Cat | "all"; labelEN: string; labelNO: string; icon: typeof Guitar }[] = [
  { id: "all", labelEN: "All", labelNO: "Alle", icon: Music },
  { id: "guitars", labelEN: "Guitars", labelNO: "Gitarer", icon: Guitar },
  { id: "amps", labelEN: "Amplifiers", labelNO: "Forsterkere", icon: Speaker },
  { id: "harmonicas", labelEN: "Harmonicas", labelNO: "Munnspill", icon: Music },
  { id: "drums", labelEN: "Drums & Rhythm", labelNO: "Trommer & rytme", icon: Drum },
  { id: "mics", labelEN: "Microphones", labelNO: "Mikrofoner", icon: Mic },
];

function GearPage() {
  const { lang } = useI18n();
  const isNO = lang === "no";
  const [cat, setCat] = useState<Cat | "all">("all");

  const visible = useMemo(() => (cat === "all" ? BRANDS : BRANDS.filter((b) => b.cat === cat)), [cat]);

  const hero = {
    title: isNO ? "Verktøyet som bygget bluesen" : "The Tools That Built the Blues",
    subEN: "Blues isn't just about feeling — it's about the right instrument in the right hands at the right moment. A Telecaster through a tweed Fender amp. A Marine Band in the key of A. A Shure 520DX held just right. These are the tools that made the music.",
    subNO: "Blues handler ikke bare om følelser — det handler om riktig instrument i riktige hender i rett øyeblikk. En Telecaster gjennom en tweed Fender-forsterker. Et Marine Band i A-dur. En Shure 520DX holdt akkurat riktig. Dette er verktøyet som skapte musikken.",
  };

  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.42_0.12_55/0.35),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,oklch(0.35_0.10_25/0.35),transparent_60%)]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 py-20 sm:py-28 text-center">
          <HeroIllustration />
          <h1 className="font-display text-4xl sm:text-6xl text-gold leading-tight mt-6">{hero.title}</h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isNO ? hero.subNO : hero.subEN}
          </p>
        </div>
      </section>

      {/* STICKY FILTER */}
      <div className="sticky top-[64px] z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto">
          {CATS.map((c) => {
            const Icon = c.icon;
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
                  active
                    ? "bg-gold text-primary-foreground border-gold font-semibold"
                    : "bg-card border-border text-muted-foreground hover:text-gold hover:border-gold/50"
                }`}
              >
                <Icon className="size-4" />
                {isNO ? c.labelNO : c.labelEN}
              </button>
            );
          })}
        </div>
      </div>

      {/* BRANDS */}
      <main className="max-w-5xl mx-auto px-5 py-12 space-y-10">
        {visible.map((b) => (
          <BrandCard key={b.id} brand={b} isNO={isNO} />
        ))}
      </main>

      {/* FOOTER CTA */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <p className="text-muted-foreground">
            {isNO ? "Mangler vi et merke? Si fra." : "Missing a brand? Let us know."}
          </p>
          <a
            href="mailto:kjell@slowblues.no"
            className="inline-block mt-4 px-6 py-3 rounded-full bg-gold text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            kjell@slowblues.no
          </a>
        </div>
      </section>
    </div>
  );
}

function BrandCard({ brand, isNO }: { brand: Brand; isNO: boolean }) {
  const editorial = isNO && brand.editorialNO ? brand.editorialNO : brand.editorialEN;
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(brand.ytQuery)}`;

  const share = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""}#${brand.id}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: brand.name, url }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <article
      id={brand.id}
      className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-10 shadow-xl scroll-mt-32"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-gold">{brand.name}</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">{brand.founded}</p>
        </div>
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition px-3 py-1.5 rounded-full border border-border"
          aria-label="Share"
        >
          <Share2 className="size-3.5" /> {isNO ? "Del" : "Share"}
        </button>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-2 space-y-5">
          <p className="text-foreground/90 leading-relaxed text-[15px] sm:text-base italic font-serif">
            {editorial}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25 transition text-sm"
            >
              {isNO ? `Besøk ${brand.name}` : `Visit ${brand.name}`} <ExternalLink className="size-3.5" />
            </a>
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-gold hover:border-gold/40 transition text-sm"
            >
              {isNO ? "YouTube-søk" : "YouTube search"} <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        <aside className="space-y-5">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              {isNO ? "Nøkkelmodeller" : "Key models"}
            </h3>
            <ul className="space-y-1 text-sm">
              {brand.models.map((m) => (
                <li key={m} className="text-foreground/85">{m}</li>
              ))}
            </ul>
          </div>
          {brand.artists.length > 0 && (
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                {isNO ? "Brukt av" : "Used by"}
              </h3>
              <ul className="space-y-1 text-sm">
                {brand.artists.map((a) => (
                  <li key={a.name}>
                    {a.slug ? (
                      <Link
                        to="/artists/$slug"
                        params={{ slug: a.slug }}
                        className="text-gold hover:underline"
                      >
                        {a.name}
                      </Link>
                    ) : (
                      <span className="text-foreground/85">{a.name}</span>
                    )}
                    {a.note && <span className="text-muted-foreground"> · {a.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 600 180" className="mx-auto w-full max-w-md text-gold/80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      {/* guitar silhouette */}
      <path d="M40 90 q20 -45 70 -45 q40 0 50 30 l180 -55 q15 -5 15 10 l0 20 q0 8 -10 12 l-175 55 q-5 25 -35 35 q-50 15 -75 -15 q-25 -30 -20 -47 z" />
      <circle cx="95" cy="95" r="10" />
      {/* harmonica */}
      <rect x="380" y="70" width="120" height="22" rx="3" />
      {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={i} x1={385 + i*12} y1="76" x2={385 + i*12} y2="86" />)}
      {/* microphone */}
      <circle cx="540" cy="60" r="18" />
      <line x1="540" y1="78" x2="540" y2="120" />
      <line x1="525" y1="120" x2="555" y2="120" />
    </svg>
  );
}
