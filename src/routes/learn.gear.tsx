import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n, tr } from "@/i18n";
import { ExternalLink, Share2, Music, Guitar, Mic, Speaker, Drum } from "lucide-react";
import { PageShell } from "@/components/PageShell";

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": "https://www.slowblues.no/learn/gear#brands",
          name: "Blues Gear Brands",
          url: "https://www.slowblues.no/learn/gear",
          itemListElement: BRANDS.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Brand",
              "@id": `https://www.slowblues.no/learn/gear#${b.id}`,
              name: b.name,
              url: b.url,
              description: b.editorial.en.slice(0, 240),
              ...(b.founder ? { founder: { "@type": "Person", name: b.founder.name } } : {}),
            },
          })),
        }),
      },
    ],
  }),
  component: GearPage,
});

type Cat = "guitars" | "amps" | "harmonicas" | "drums" | "mics";

type Artist = { name: string; slug?: string; note?: string };
type Founder = {
  name: string;
  years?: string;
  image?: string; // Wikimedia Commons Special:FilePath URL
  credit?: string; // e.g. "Wikimedia Commons"
  creditUrl?: string;
};
type L10n = { no: string; en: string; sv: string; de: string };
type Brand = {
  id: string;
  cat: Cat;
  name: string;
  founded: L10n;
  founder?: Founder;
  models: string[];
  editorial: L10n;
  url: string;
  ytQuery: string;
  artists: Artist[];
};

const wm = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=480`;
const wmPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;


const sameFounded = (s: string): L10n => ({ no: s, en: s, sv: s, de: s });

const BRANDS: Brand[] = [
  {
    id: "fender", cat: "guitars", name: "Fender",
    founded: sameFounded("1946 · Leo Fender · Fullerton, California"),
    founder: { name: "Leo Fender", years: "1909–1991", image: wm("Clarence Leo Fender, Guitar Design File (49532200938).jpg"), credit: "Wikimedia Commons", creditUrl: wmPage("Clarence Leo Fender, Guitar Design File (49532200938).jpg") },
    models: ["Telecaster (1950)", "Stratocaster (1954)", "Fender Bassman amp"],
    editorial: {
      en: "Leo Fender couldn't play guitar. That's the great irony. He built his instruments by listening to musicians — what they needed, what hurt their hands, what got lost in the mix on a noisy stage. The Telecaster was the first mass-produced solid-body electric guitar. Blues players picked it up immediately. Albert Collins never put his down.",
      no: "Leo Fender kunne ikke spille gitar. Det er den store ironien. Han bygde instrumenter ved å lytte til musikere — hva de trengte, hva som gjorde vondt i hendene, hva som forsvant i miksen på en støyende scene. Telecasteren var den første masseproduserte elektriske solid-body-gitaren. Bluesmusikerne tok den i bruk umiddelbart. Albert Collins la den aldri fra seg.",
      sv: "Leo Fender kunde inte spela gitarr. Det är den stora ironin. Han byggde sina instrument genom att lyssna på musiker — vad de behövde, vad som gjorde ont i händerna, vad som försvann i mixen på en stökig scen. Telecastern var den första massproducerade solid-body-elgitarren. Bluesmusikerna tog upp den omedelbart. Albert Collins lade aldrig ifrån sig sin.",
      de: "Leo Fender konnte nicht Gitarre spielen. Das ist die große Ironie. Er baute seine Instrumente, indem er den Musikern zuhörte — was sie brauchten, was ihren Händen wehtat, was auf einer lauten Bühne im Mix unterging. Die Telecaster war die erste in Serie gefertigte E-Gitarre mit Solidbody. Bluesmusiker griffen sofort zu. Albert Collins legte seine nie wieder aus der Hand.",
    },
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
    founded: sameFounded("1902 · Orville Gibson · Kalamazoo, Michigan"),
    founder: { name: "Orville Gibson", years: "1856–1918", image: wm("Orville Gibson pre-1910.jpg"), credit: "Wikimedia Commons", creditUrl: wmPage("Orville Gibson pre-1910.jpg") },
    models: ["ES-335 (1958)", "Les Paul (1952)", "ES-150 (1936)", "Flying V (1958)", "SG (1961)"],
    editorial: {
      en: "BB King named his Gibson 'Lucille' after a woman whose name caused a bar fight and a fire. He ran back into the burning building to rescue the guitar. After that, every Gibson ES-355 he owned was called Lucille. That's the blues relationship with a Gibson — it's not just an instrument, it's a partner.",
      no: "BB King kalte sin Gibson «Lucille» etter ei dame hvis navn forårsaket et barslagsmål og en brann. Han løp tilbake inn i den brennende bygningen for å redde gitaren. Etter det het hver eneste Gibson ES-355 han eide Lucille. Det er bluesens forhold til en Gibson — det er ikke bare et instrument, det er en partner.",
      sv: "BB King kallade sin Gibson «Lucille» efter en kvinna vars namn orsakade ett barslagsmål och en brand. Han sprang tillbaka in i den brinnande byggnaden för att rädda gitarren. Efter det hette varje Gibson ES-355 han ägde Lucille. Det är bluesens förhållande till en Gibson — det är inte bara ett instrument, det är en partner.",
      de: "B.B. King nannte seine Gibson \u201ELucille\u201C \u2014 nach einer Frau, deren Name eine Kneipenschl\u00E4gerei und einen Brand ausl\u00F6ste. Er rannte zur\u00FCck ins brennende Geb\u00E4ude, um die Gitarre zu retten. Danach hie\u00DF jede Gibson ES-355, die er besa\u00DF, Lucille. So ist die Beziehung des Blues zu einer Gibson \u2014 sie ist kein Instrument, sondern ein Partner.",
    },
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
    founded: sameFounded("1833 · C.F. Martin Sr. · Nazareth, Pennsylvania"),
    founder: { name: "C. F. Martin Sr.", years: "1796–1873", image: wm("Christian Frederick Martin.jpg"), credit: "Wikimedia Commons", creditUrl: wmPage("Christian Frederick Martin.jpg") },
    models: ["000-28", "00-17", "Dreadnought series"],
    editorial: {
      en: "Before the amplifier, there was the Martin. Robert Johnson played a Gibson L-1, yes — but the acoustic Martin defined the Delta sound for an entire generation of blues musicians who couldn't afford electricity and didn't need it.",
      no: "Før forsterkeren fantes Martin. Robert Johnson spilte en Gibson L-1, ja — men den akustiske Martin definerte Delta-lyden for en hel generasjon bluesmusikere som ikke hadde råd til strøm og ikke trengte det.",
      sv: "Före förstärkaren fanns Martin. Robert Johnson spelade en Gibson L-1, ja — men den akustiska Martin definierade Delta-ljudet för en hel generation bluesmusiker som inte hade råd med el och inte behövde det.",
      de: "Vor dem Verstärker gab es die Martin. Robert Johnson spielte zwar eine Gibson L-1 — aber die akustische Martin prägte den Delta-Sound für eine ganze Generation von Bluesmusikern, die sich Strom nicht leisten konnten und ihn auch nicht brauchten.",
    },
    url: "https://www.martinguitar.com",
    ytQuery: "Martin acoustic blues Delta",
    artists: [
      { name: "Robert Johnson", slug: "robert-johnson" },
      { name: "Eric Clapton", slug: "eric-clapton", note: "Unplugged" },
    ],
  },
  {
    id: "national", cat: "guitars", name: "National / Resonator",
    founded: sameFounded("1927 · John Dopyera · Los Angeles"),
    founder: { name: "John Dopyera", years: "1893–1988" },
    models: ["Style O (metal resonator)", "Dobro (wood resonator)"],
    editorial: {
      en: "Before amplification, if you needed to be heard over a noisy room, you played a National. The metal resonator became the sound of the Delta — that metallic, ringing sustain you hear on Son House and Bukka White recordings. Slide guitar and a National. Nothing louder. Nothing more desperate-sounding.",
      no: "Før forsterkningen kom: trengte du å høres over en støyende sal, spilte du en National. Metallresonatoren ble lyden av Delta — den metalliske, klingende sustainen du hører på opptakene til Son House og Bukka White. Slidegitar og en National. Ingenting høyere. Ingenting mer desperat.",
      sv: "Före förstärkningen: behövde du höras över en stökig sal spelade du en National. Metallresonatorn blev ljudet av Delta — den metalliska, klingande sustainen du hör på Son Houses och Bukka Whites inspelningar. Slidegitarr och en National. Ingenting starkare. Ingenting mer desperat.",
      de: "Vor der Verstärkung galt: Wer in einem lauten Raum gehört werden wollte, spielte eine National. Der Metallresonator wurde zum Klang des Delta — dieses metallische, klingende Sustain, das man auf den Aufnahmen von Son House und Bukka White hört. Slide-Gitarre und eine National. Nichts war lauter. Nichts klang verzweifelter.",
    },
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
    founded: sameFounded("1946 · Fullerton, California"),
    founder: { name: "Leo Fender", years: "1909–1991", image: wm("Clarence Leo Fender, Guitar Design File (49532200938).jpg"), credit: "Wikimedia Commons", creditUrl: wmPage("Clarence Leo Fender, Guitar Design File (49532200938).jpg") },
    models: ["Tweed Bassman (1957)", "Blues Junior", "Super Reverb", "Vibroverb"],
    editorial: {
      en: "The tweed Fender Bassman was originally designed for bass guitar. Nobody used it for bass. Blues and rock guitarists immediately understood what a slightly overdriven Bassman could do. It became the foundation of the Chicago sound — and the inspiration for the first Marshall amp.",
      no: "Tweed Fender Bassman ble opprinnelig designet for bassgitar. Ingen brukte den til bass. Blues- og rockegitarister forsto umiddelbart hva en lett overdrevet Bassman kunne gjøre. Den ble grunnsteinen i Chicago-lyden — og inspirasjonen til den første Marshall-forsterkeren.",
      sv: "Tweed Fender Bassman designades ursprungligen för basgitarr. Ingen använde den till bas. Blues- och rockgitarrister förstod genast vad en lätt överstyrd Bassman kunde göra. Den blev grunden i Chicago-ljudet — och inspirationen till den första Marshall-förstärkaren.",
      de: "Der Tweed Fender Bassman war ursprünglich für den E-Bass gedacht. Niemand benutzte ihn dafür. Blues- und Rockgitarristen verstanden sofort, was ein leicht angezerrter Bassman leisten konnte. Er wurde zum Fundament des Chicago-Sounds — und zur Vorlage für den ersten Marshall-Verstärker.",
    },
    url: "https://www.fender.com/amps",
    ytQuery: "Fender tweed Bassman blues tone",
    artists: [
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan" },
      { name: "Buddy Guy", slug: "buddy-guy" },
    ],
  },
  {
    id: "marshall", cat: "amps", name: "Marshall",
    founded: sameFounded("1962 · Jim Marshall · London"),
    founder: { name: "Jim Marshall", years: "1923–2012", image: wm("Jim Marshall at Summer NAMM 2007.jpg"), credit: "Wikimedia Commons", creditUrl: wmPage("Jim Marshall at Summer NAMM 2007.jpg") },
    models: ["JTM45 (1962)", "1962 Bluesbreaker combo", "Plexi Super Lead"],
    editorial: {
      en: "Jim Marshall was a drum teacher who ran a music shop in Hanwell, London. His customers — young British guitarists who'd been listening to American blues records — kept asking for louder American amps. Marshall built them something better. The JTM45 was directly inspired by the Fender Bassman. Eric Clapton plugged a Les Paul into one in 1966 and made the Beano album. That sound changed everything.",
      no: "Jim Marshall var en trommelærer som drev en musikkbutikk i Hanwell, London. Kundene hans — unge britiske gitarister som hadde hørt på amerikanske blues-plater — ba stadig om høyere amerikanske forsterkere. Marshall bygde dem noe bedre. JTM45 var direkte inspirert av Fender Bassman. Eric Clapton koblet en Les Paul inn i en i 1966 og lagde Beano-platen. Den lyden forandret alt.",
      sv: "Jim Marshall var en trumlärare som drev en musikaffär i Hanwell, London. Hans kunder — unga brittiska gitarrister som hade lyssnat på amerikanska bluesskivor — frågade ständigt efter starkare amerikanska förstärkare. Marshall byggde något bättre åt dem. JTM45 var direkt inspirerad av Fender Bassman. Eric Clapton kopplade in en Les Paul i en 1966 och spelade in Beano-plattan. Det ljudet förändrade allt.",
      de: "Jim Marshall war Schlagzeuglehrer und führte einen Musikladen in Hanwell, London. Seine Kunden — junge britische Gitarristen, die amerikanische Blues-Platten gehört hatten — fragten ständig nach lauteren amerikanischen Verstärkern. Marshall baute ihnen etwas Besseres. Der JTM45 war direkt vom Fender Bassman inspiriert. Eric Clapton schloss 1966 eine Les Paul daran an und nahm das Beano-Album auf. Dieser Klang veränderte alles.",
    },
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
    founded: sameFounded("1957 · Tom Jennings · Dartford, England"),
    founder: { name: "Tom Jennings", years: "1917–1978" },
    models: ["AC30"],
    editorial: {
      en: "The AC30 was the British blues boom in box form — bright, chimey, and capable of a snarl when pushed. John Mayall and the first Fleetwood Mac generation leaned on it.",
      no: "AC30 var det britiske bluesboomet i en boks — lys, klingende, og i stand til å snerre når den ble presset. John Mayall og den første Fleetwood Mac-generasjonen lente seg på den.",
      sv: "AC30 var den brittiska bluesboomen i lådform — ljus, klingande, och kapabel till ett morrande när den pressades. John Mayall och den första Fleetwood Mac-generationen litade på den.",
      de: "Der AC30 war der britische Blues-Boom in Box-Form — hell, glockenklar und in der Lage zu knurren, wenn man ihn aufdrehte. John Mayall und die erste Fleetwood-Mac-Generation verließen sich auf ihn.",
    },
    url: "https://www.voxamps.com",
    ytQuery: "Vox AC30 blues British",
    artists: [{ name: "John Mayall", slug: "john-mayall" }],
  },
  {
    id: "dumble", cat: "amps", name: "Dumble",
    founded: { no: "Håndbygd · Alexander Dumble · California", en: "Hand-built · Alexander Dumble · California", sv: "Handbyggd · Alexander Dumble · California", de: "Handgebaut · Alexander Dumble · Kalifornien" },
    founder: { name: "Howard Alexander Dumble", years: "1944–2022" },
    models: ["Overdrive Special", "Steel String Singer"],
    editorial: {
      en: "Howard Alexander Dumble builds amplifiers one at a time, by hand, in secret. He doesn't advertise. He doesn't have a website. He chooses his customers personally. Stevie Ray Vaughan had one. That should tell you everything.",
      no: "Howard Alexander Dumble bygger forsterkere én om gangen, for hånd, i hemmelighet. Han annonserer ikke. Han har ingen nettside. Han velger kundene sine selv. Stevie Ray Vaughan hadde en. Det burde fortelle deg alt.",
      sv: "Howard Alexander Dumble bygger förstärkare en i taget, för hand, i hemlighet. Han annonserar inte. Han har ingen webbplats. Han väljer sina kunder personligen. Stevie Ray Vaughan hade en. Det borde säga dig allt.",
      de: "Howard Alexander Dumble baut Verstärker einzeln, von Hand, im Verborgenen. Er wirbt nicht. Er hat keine Website. Er wählt seine Kunden persönlich aus. Stevie Ray Vaughan hatte einen. Das sollte alles sagen.",
    },
    url: "https://en.wikipedia.org/wiki/Dumble_Amplifiers",
    ytQuery: "Dumble amp Stevie Ray Vaughan",
    artists: [
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan" },
    ],
  },
  {
    id: "hohner", cat: "harmonicas", name: "Hohner",
    founded: { no: "1857 · Matthias Hohner · Trossingen, Tyskland", en: "1857 · Matthias Hohner · Trossingen, Germany", sv: "1857 · Matthias Hohner · Trossingen, Tyskland", de: "1857 · Matthias Hohner · Trossingen, Deutschland" },
    founder: { name: "Matthias Hohner", years: "1833–1902" },
    models: ["Marine Band (1896)", "Special 20", "Chromonica", "Blues Harp"],
    editorial: {
      en: "A Marine Band harmonica costs around 50 dollars. Little Walter put one through a PA system in the 1950s and invented amplified blues harp. He cupped a bullet microphone in his hands with the harmonica and created a sound nobody had heard before — part saxophone, part guitar, entirely blues. Fifty dollars. Changed music forever.",
      no: "Et Marine Band-munnspill koster rundt 50 dollar. Little Walter kjørte ett gjennom et PA-anlegg på 1950-tallet og oppfant forsterket bluesharp. Han kuppet en bullet-mikrofon sammen med munnspillet og skapte en lyd ingen hadde hørt før — halvt saksofon, halvt gitar, helt blues. Femti dollar. Forandret musikken for alltid.",
      sv: "Ett Marine Band-munspel kostar runt 50 dollar. Little Walter körde ett genom en PA-anläggning på 1950-talet och uppfann förstärkt bluesharpa. Han kupade en bullet-mikrofon tillsammans med munspelet och skapade ett ljud ingen hade hört tidigare — halvt saxofon, halvt gitarr, helt blues. Femtio dollar. Förändrade musiken för alltid.",
      de: "Eine Marine-Band-Mundharmonika kostet rund 50 Dollar. Little Walter jagte sie in den 1950ern durch eine PA-Anlage und erfand damit die verstärkte Blues-Harp. Er hielt ein Bullet-Mikrofon zusammen mit der Mundharmonika in den Händen und schuf einen Klang, den niemand zuvor gehört hatte — halb Saxofon, halb Gitarre, ganz Blues. Fünfzig Dollar. Veränderten die Musik für immer.",
    },
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
    founded: { no: "1983 · Lee Oskar · Danmark / USA", en: "1983 · Lee Oskar · Denmark / USA", sv: "1983 · Lee Oskar · Danmark / USA", de: "1983 · Lee Oskar · Dänemark / USA" },
    founder: { name: "Lee Oskar", years: "b. 1948", image: wm("Lee Oskar 1976 press photo.png"), credit: "Wikimedia Commons", creditUrl: wmPage("Lee Oskar 1976 press photo.png") },
    models: ["Major Diatonic", "Melody Maker", "Natural Minor"],
    editorial: {
      en: "Durable, airtight construction. A favourite of professional touring blues harp players who can't afford a leaky reed plate on night three of a tour.",
      no: "Solid og lufttett konstruksjon. En favoritt blant profesjonelle turnerende bluesharpspillere som ikke har råd til en lekk reedplate på natt tre av en turné.",
      sv: "Robust och lufttät konstruktion. En favorit bland professionella turnerande bluesharpaspelare som inte har råd med en läckande tonplatta på natt tre av en turné.",
      de: "Robust und luftdicht gebaut. Ein Favorit professioneller Touring-Harp-Spieler, die sich am dritten Tourabend keine undichte Stimmplatte leisten können.",
    },
    url: "https://www.leeoskar.com",
    ytQuery: "Lee Oskar harmonica blues",
    artists: [{ name: "Lee Oskar", note: "War" }],
  },
  {
    id: "ludwig", cat: "drums", name: "Ludwig",
    founded: sameFounded("1909 · William & Theobald Ludwig · Chicago"),
    founder: { name: "William F. Ludwig Sr.", years: "1879–1973" },
    models: ["Classic Maple", "Black Beauty snare"],
    editorial: {
      en: "The Chicago blues rhythm section ran on Ludwig drums. Fred Below, Francis Clay, Sam Lay — the men who locked down the groove for Muddy Waters, Little Walter and Howlin' Wolf were playing Ludwig. Blues rhythm is not decoration. It is the foundation. These drums were the foundation.",
      no: "Chicago-bluesens rytmeseksjon gikk på Ludwig-trommer. Fred Below, Francis Clay, Sam Lay — mennene som låste grooven for Muddy Waters, Little Walter og Howlin' Wolf, spilte Ludwig. Bluesrytme er ikke dekorasjon. Det er fundamentet. Disse trommene var fundamentet.",
      sv: "Chicago-bluesens rytmsektion gick på Ludwig-trummor. Fred Below, Francis Clay, Sam Lay — männen som låste grooven för Muddy Waters, Little Walter och Howlin' Wolf spelade Ludwig. Bluesrytm är inte dekoration. Den är fundamentet. Dessa trummor var fundamentet.",
      de: "Die Rhythmusgruppe des Chicago-Blues lief auf Ludwig-Drums. Fred Below, Francis Clay, Sam Lay — die Männer, die den Groove für Muddy Waters, Little Walter und Howlin' Wolf festnagelten, spielten Ludwig. Blues-Rhythmus ist keine Dekoration. Er ist das Fundament. Diese Drums waren das Fundament.",
    },
    url: "https://www.ludwig-drums.com",
    ytQuery: "Chicago blues drums Ludwig",
    artists: [
      { name: "Muddy Waters", slug: "muddy-waters", note: "band" },
      { name: "Howlin' Wolf", slug: "howlin-wolf", note: "band" },
    ],
  },
  {
    id: "gretsch", cat: "drums", name: "Gretsch Drums",
    founded: sameFounded("1883 · Friedrich Gretsch · Brooklyn"),
    founder: { name: "Friedrich Gretsch", years: "1856–1895", image: wm("Friedrich W. Gretsch.jpg"), credit: "Wikimedia Commons", creditUrl: wmPage("Friedrich W. Gretsch.jpg") },
    models: ["Broadkaster", "USA Custom"],
    editorial: {
      en: "Gretsch carried the jazz-blues crossover era. Charlie Watts famously brought their feel into the Rolling Stones — and the Stones brought the blues to the world.",
      no: "Gretsch bar jazz-blues-overgangstiden. Charlie Watts brakte berømt deres følelse inn i Rolling Stones — og Stones brakte bluesen ut i verden.",
      sv: "Gretsch bar jazz-blues-övergångstiden. Charlie Watts förde berömt in deras känsla i Rolling Stones — och Stones förde bluesen ut i världen.",
      de: "Gretsch prägte die Jazz-Blues-Übergangszeit. Charlie Watts trug ihr Feeling bekanntlich in die Rolling Stones — und die Stones brachten den Blues in die Welt.",
    },
    url: "https://www.gretschdrums.com",
    ytQuery: "Gretsch drums blues",
    artists: [],
  },
  {
    id: "shure", cat: "mics", name: "Shure",
    founded: sameFounded("1925 · Sidney Shure · Chicago"),
    founder: { name: "Sidney N. Shure", years: "1902–1995" },
    models: ["520DX 'Green Bullet'", "SM57", "SM58", "55SH 'Unidyne'"],
    editorial: {
      en: "The Shure Green Bullet was designed in 1949 as a dispatcher's microphone for trucking companies. Blues harmonica players stole it. Its limited frequency response — it cuts the highs and mids brutally — turned out to be exactly what amplified blues harp needed. The 'wrong' microphone for the 'wrong' purpose became one of the most iconic sounds in blues. That's very blues.",
      no: "Shure Green Bullet ble designet i 1949 som en dispatcher-mikrofon for lastebilselskaper. Bluesmunnspillerne stjal den. Den begrensede frekvensresponsen — den kutter diskanten og mellomtonen brutalt — viste seg å være akkurat det forsterket bluesharp trengte. Den «feile» mikrofonen til det «feile» formålet ble en av de mest ikoniske lydene i blues. Veldig blues, det.",
      sv: "Shure Green Bullet designades 1949 som en dispatcher-mikrofon för åkerier. Bluesmunspelarna snodde den. Dess begränsade frekvensgång — den skär brutalt i diskant och mellanregister — visade sig vara precis vad förstärkt bluesharpa behövde. Den «fel» mikrofonen för det «fel» ändamålet blev ett av bluesens mest ikoniska ljud. Mycket blues, det.",
      de: "Das Shure Green Bullet wurde 1949 als Dispatcher-Mikrofon f\u00FCr Speditionen entworfen. Blues-Mundharmonikaspieler klauten es. Sein begrenzter Frequenzgang \u2014 er beschneidet H\u00F6hen und Mitten brutal \u2014 erwies sich als genau das, was die verst\u00E4rkte Blues-Harp brauchte. Das \u201Efalsche\u201C Mikrofon f\u00FCr den \u201Efalschen\u201C Zweck wurde zu einem der ikonischsten Sounds des Blues. Sehr Blues.",
    },
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
    founded: sameFounded("1933 · Astatic Corporation · Conneaut, Ohio"),
    models: ["JT-30 crystal mic"],
    editorial: {
      en: "The original blues harp mic before the Green Bullet ever existed. A crystal element with a brittle, midrange-forward voice that early Chicago harmonica players ran straight into a small tube amp — and history happened.",
      no: "Den opprinnelige bluesharp-mikrofonen, før Green Bullet engang fantes. Et krystallelement med en sprø, mellomtone-tung stemme som tidlige Chicago-munnspillere kjørte rett inn i en liten rørforsterker — og historien skjedde.",
      sv: "Den ursprungliga bluesharpa-mikrofonen, innan Green Bullet ens fanns. Ett kristallelement med en spröd, mellanregister-tung röst som tidiga Chicago-munspelare körde rakt in i en liten rörförstärkare — och historien hände.",
      de: "Das ursprüngliche Blues-Harp-Mikrofon, lange bevor es das Green Bullet gab. Ein Kristallelement mit einer spröden, mittenbetonten Stimme, das frühe Chicagoer Harp-Spieler direkt in einen kleinen Röhrenamp jagten — und so schrieb sich Geschichte.",
    },
    url: "https://www.astatic.com",
    ytQuery: "Astatic JT-30 blues harmonica",
    artists: [],
  },
];

const CATS: { id: Cat | "all"; labels: { no: string; en: string; sv: string; de: string }; icon: typeof Guitar }[] = [
  { id: "all", labels: { no: "Alle", en: "All", sv: "Alla", de: "Alle" }, icon: Music },
  { id: "guitars", labels: { no: "Gitarer", en: "Guitars", sv: "Gitarrer", de: "Gitarren" }, icon: Guitar },
  { id: "amps", labels: { no: "Forsterkere", en: "Amplifiers", sv: "Förstärkare", de: "Verstärker" }, icon: Speaker },
  { id: "harmonicas", labels: { no: "Munnspill", en: "Harmonicas", sv: "Munspel", de: "Mundharmonikas" }, icon: Music },
  { id: "drums", labels: { no: "Trommer & rytme", en: "Drums & Rhythm", sv: "Trummor & rytm", de: "Schlagzeug & Rhythmus" }, icon: Drum },
  { id: "mics", labels: { no: "Mikrofoner", en: "Microphones", sv: "Mikrofoner", de: "Mikrofone" }, icon: Mic },
];

function GearPage() {
  const { lang } = useI18n();
  const [cat, setCat] = useState<Cat | "all">("all");

  const visible = useMemo(() => (cat === "all" ? BRANDS : BRANDS.filter((b) => b.cat === cat)), [cat]);

  const hero = {
    title: tr(lang, {
      no: "Verktøyet som bygget bluesen",
      en: "The Tools That Built the Blues",
      sv: "Verktygen som byggde bluesen",
      de: "Die Werkzeuge, die den Blues schufen",
    }),
    sub: tr(lang, {
      en: "Blues isn't just about feeling — it's about the right instrument in the right hands at the right moment. A Telecaster through a tweed Fender amp. A Marine Band in the key of A. A Shure 520DX held just right. These are the tools that made the music.",
      no: "Blues handler ikke bare om følelser — det handler om riktig instrument i riktige hender i rett øyeblikk. En Telecaster gjennom en tweed Fender-forsterker. Et Marine Band i A-dur. En Shure 520DX holdt akkurat riktig. Dette er verktøyet som skapte musikken.",
      sv: "Blues handlar inte bara om känsla — det handlar om rätt instrument i rätt händer i rätt ögonblick. En Telecaster genom en tweed Fender-förstärkare. Ett Marine Band i A-dur. En Shure 520DX som hålls rätt. Det är verktygen som skapade musiken.",
      de: "Blues ist nicht nur Gefühl — es geht um das richtige Instrument in den richtigen Händen im richtigen Moment. Eine Telecaster durch einen Tweed-Fender-Amp. Eine Marine Band in A. Ein richtig gehaltenes Shure 520DX. Das sind die Werkzeuge, die die Musik schufen.",
    }),
  };

  return (
    <PageShell>
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
            {hero.sub}
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
                {tr(lang, c.labels)}
              </button>
            );
          })}
        </div>
      </div>

      {/* BRANDS */}
      <main className="max-w-5xl mx-auto px-5 py-12 space-y-10">
        {visible.map((b) => (
          <BrandCard key={b.id} brand={b} lang={lang} />
        ))}
      </main>

      {/* FOOTER CTA */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <p className="text-muted-foreground">
            {tr(lang, { no: "Mangler vi et merke? Si fra.", en: "Missing a brand? Let us know.", sv: "Saknar vi ett märke? Säg till.", de: "Fehlt eine Marke? Sag uns Bescheid." })}
          </p>
          <Link
            to="/contact"
            className="inline-block mt-4 px-6 py-3 rounded-full bg-gold text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            {tr(lang, { no: "Kontakt oss", en: "Contact us", sv: "Kontakta oss", de: "Kontakt aufnehmen" })}
          </Link>
        </div>
      </section>
    </div>
    </PageShell>
  );
}

function BrandCard({ brand, lang }: { brand: Brand; lang: ReturnType<typeof useI18n>["lang"] }) {
  const editorial = tr(lang, brand.editorial);
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
        <div className="flex items-center gap-4">
          {brand.founder && (
            <Link to="/learn/gear/$id" params={{ id: brand.id }} className="block shrink-0">
              <FounderAvatar founder={brand.founder} />
            </Link>
          )}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-gold">{brand.name}</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">{tr(lang, brand.founded)}</p>
            {brand.founder && (
              <p className="text-[11px] text-muted-foreground/80 mt-1">
                {tr(lang, { no: "Grunnlegger", en: "Founder", sv: "Grundare", de: "Gründer" })}:{" "}
                <Link to="/learn/gear/$id" params={{ id: brand.id }} className="text-gold hover:underline">
                  {brand.founder.name}
                </Link>
                {brand.founder.years ? ` (${brand.founder.years})` : ""}
              </p>
            )}
            <Link
              to="/learn/gear/$id"
              params={{ id: brand.id }}
              className="inline-block mt-2 text-[11px] uppercase tracking-[0.18em] text-gold hover:underline"
            >
              {tr(lang, { no: "Les hele historien →", en: "Read the full story →", sv: "Läs hela historien →", de: "Die ganze Geschichte →" })}
            </Link>
          </div>
        </div>
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition px-3 py-1.5 rounded-full border border-border"
          aria-label="Share"
        >
          <Share2 className="size-3.5" /> {tr(lang, { no: "Del", en: "Share", sv: "Dela", de: "Teilen" })}
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
              {tr(lang, { no: `Besøk ${brand.name}`, en: `Visit ${brand.name}`, sv: `Besök ${brand.name}`, de: `${brand.name} besuchen` })} <ExternalLink className="size-3.5" />
            </a>
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-gold hover:border-gold/40 transition text-sm"
            >
              {tr(lang, { no: "YouTube-søk", en: "YouTube search", sv: "YouTube-sökning", de: "YouTube-Suche" })} <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        <aside className="space-y-5">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              {tr(lang, { no: "Nøkkelmodeller", en: "Key models", sv: "Nyckelmodeller", de: "Schlüsselmodelle" })}
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
                {tr(lang, { no: "Brukt av", en: "Used by", sv: "Används av", de: "Verwendet von" })}
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

function FounderAvatar({ founder }: { founder: Founder }) {
  const initials = founder.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  if (founder.image) {
    return (
      <a
        href={founder.creditUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title={`${founder.name}${founder.credit ? ` — Photo: ${founder.credit}` : ""}`}
        className="block shrink-0"
      >
        <img
          src={founder.image}
          alt={founder.name}
          loading="lazy"
          className="size-16 sm:size-20 rounded-full object-cover border-2 border-gold/40 shadow-md"
        />
      </a>
    );
  }
  return (
    <div
      aria-label={founder.name}
      className="size-16 sm:size-20 rounded-full border-2 border-gold/30 bg-gradient-to-br from-[oklch(0.32_0.08_25)] to-[oklch(0.18_0.04_25)] flex items-center justify-center text-gold font-display text-xl shrink-0"
    >
      {initials}
    </div>
  );
}
