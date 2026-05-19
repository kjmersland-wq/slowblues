import { IMG } from "./images";

export type Artist = {
  slug: string;
  name: string;
  era: string;
  tag: "Delta" | "Chicago" | "Texas" | "British" | "Modern" | "Classic" | "Nordic";
  img: string;
  short: string;
};

export const ARTISTS: Artist[] = [
  { slug: "robert-johnson", name: "Robert Johnson", era: "1911–1938", tag: "Delta", img: IMG.robertJohnson, short: "29 recordings that defined the Delta blues forever." },
  { slug: "muddy-waters", name: "Muddy Waters", era: "1913–1983", tag: "Chicago", img: IMG.muddyWaters, short: "The man who took the Delta to Chicago and plugged it in." },
  { slug: "son-house", name: "Son House", era: "1902–1988", tag: "Delta", img: IMG.sonHouse, short: "Raw, spiritual slide guitar — the preacher's blues." },
  { slug: "bb-king", name: "B.B. King", era: "1925–2015", tag: "Classic", img: IMG.bbKing, short: "Lucille, vibrato and a smile that conquered the world." },
  { slug: "howlin-wolf", name: "Howlin' Wolf", era: "1910–1976", tag: "Chicago", img: IMG.howlinWolf, short: "300-pound voice that shook the walls of Chess Records." },
  { slug: "john-lee-hooker", name: "John Lee Hooker", era: "1917–2001", tag: "Delta", img: IMG.johnLeeHooker, short: "Hypnotic boogie and a foot that never stopped tapping." },
  { slug: "bessie-smith", name: "Bessie Smith", era: "1894–1937", tag: "Classic", img: IMG.bessieSmith, short: "The Empress of the Blues — vaudeville's biggest star." },
  { slug: "ma-rainey", name: "Ma Rainey", era: "1886–1939", tag: "Classic", img: IMG.maRainey, short: "Mother of the Blues. The voice that brought it to the cities." },
  { slug: "lead-belly", name: "Lead Belly", era: "1888–1949", tag: "Delta", img: IMG.leadbelly, short: "12-string folk-blues that crossed every American border." },
  { slug: "blind-lemon-jefferson", name: "Blind Lemon Jefferson", era: "1893–1929", tag: "Delta", img: IMG.blindLemon, short: "The first male blues star to sell on record." },
  { slug: "willie-dixon", name: "Willie Dixon", era: "1915–1992", tag: "Chicago", img: IMG.willieDixon, short: "Bassist, producer, and songwriter behind half of Chess." },
  { slug: "buddy-guy", name: "Buddy Guy", era: "1936–", tag: "Chicago", img: IMG.buddyGuy, short: "The bridge from Muddy to Hendrix — and still on stage." },
  { slug: "etta-james", name: "Etta James", era: "1938–2012", tag: "Classic", img: IMG.ettaJames, short: "From doo-wop to deep blues — At Last is just the start." },
  { slug: "janis-joplin", name: "Janis Joplin", era: "1943–1970", tag: "Modern", img: IMG.janisJoplin, short: "Texas-born voice that wore Bessie Smith's pain like armour." },
  { slug: "eric-clapton", name: "Eric Clapton", era: "1945–", tag: "British", img: IMG.ericClapton, short: "Cream, Bluesbreakers, Derek — the British invasion of the blues." },
  { slug: "stevie-ray-vaughan", name: "Stevie Ray Vaughan", era: "1954–1990", tag: "Texas", img: IMG.stevieRay, short: "Texas tone, hummingbird right hand, gone far too soon." },
  { slug: "bonnie-raitt", name: "Bonnie Raitt", era: "1949–", tag: "Modern", img: IMG.bonnieRaitt, short: "Slide guitar, soul and songwriting in equal measure." },
];

export type Style = {
  slug: string;
  name: string;
  era: string;
  origin: string;
  instruments: string[];
  feel: string;
  artists: string[];
  desc: string;
};

export const STYLES: Style[] = [
  {
    slug: "delta",
    name: "Delta Blues",
    era: "1890s–1940s",
    origin: "Mississippi Delta, USA",
    instruments: ["Acoustic guitar", "Slide / bottleneck", "Voice", "Harmonica"],
    feel: "Raw, intimate, mournful, percussive",
    artists: ["Robert Johnson", "Son House", "Charley Patton", "Skip James"],
    desc: "The oldest recorded blues style — one voice, one guitar, often a bottleneck on the strings. Born on the porches and in the juke joints of the Mississippi Delta.",
  },
  {
    slug: "chicago",
    name: "Chicago Blues",
    era: "1940s–today",
    origin: "Chicago, Illinois",
    instruments: ["Electric guitar", "Harmonica", "Bass", "Drums", "Piano"],
    feel: "Loud, urban, swinging, electric",
    artists: ["Muddy Waters", "Howlin' Wolf", "Little Walter", "Buddy Guy"],
    desc: "What happened when the Great Migration carried the Delta north — and the guitar got plugged into an amplifier. The DNA of every rock band since.",
  },
  {
    slug: "texas",
    name: "Texas Blues",
    era: "1920s–today",
    origin: "Texas, USA",
    instruments: ["Electric guitar (long solos)", "Horn section", "Drums"],
    feel: "Smooth, jazzy, swinging, single-note solos",
    artists: ["T-Bone Walker", "Freddie King", "Stevie Ray Vaughan", "ZZ Top"],
    desc: "Where blues meets jazz and swing. Long, fluid single-note guitar lines and a tighter, hornier rhythm section.",
  },
  {
    slug: "british",
    name: "British Blues",
    era: "1960s",
    origin: "London / Manchester, UK",
    instruments: ["Electric guitar (loud)", "Bass", "Drums"],
    feel: "Reverent, loud, virtuosic, white-knuckled",
    artists: ["John Mayall", "Eric Clapton", "Peter Green", "Rolling Stones"],
    desc: "British teenagers heard Muddy's Chess records and tried to play them louder. Out came the entire 60s rock revolution.",
  },
  {
    slug: "piedmont",
    name: "Piedmont Blues",
    era: "1920s–1940s",
    origin: "US East Coast",
    instruments: ["Acoustic guitar (finger-style)", "Voice"],
    feel: "Bouncy, ragtime-influenced, melodic",
    artists: ["Blind Blake", "Reverend Gary Davis", "Mississippi John Hurt"],
    desc: "An East-coast cousin of the Delta — finger-picked, ragtime-tinged, often happier in feel.",
  },
  {
    slug: "jump",
    name: "Jump Blues",
    era: "1940s–1950s",
    origin: "West Coast / Kansas City",
    instruments: ["Horns", "Boogie piano", "Upright bass", "Shouter voice"],
    feel: "Up-tempo, danceable, jazz-flavoured",
    artists: ["Louis Jordan", "Big Joe Turner", "Wynonie Harris"],
    desc: "The bridge from swing to rock and roll. Big-band energy, blues changes, and a horn section that never stops.",
  },
  {
    slug: "soul-blues",
    name: "Soul Blues",
    era: "1960s–today",
    origin: "Memphis / Muscle Shoals",
    instruments: ["Electric guitar", "Horn section", "Hammond organ", "Strings"],
    feel: "Smooth, gospel-rooted, romantic",
    artists: ["Bobby Bland", "B.B. King", "Z.Z. Hill", "Etta James"],
    desc: "Where the church meets the juke joint — gospel vocals over a blues 12-bar with horns and Hammond.",
  },
  {
    slug: "modern-electric",
    name: "Modern Electric",
    era: "1990s–today",
    origin: "Worldwide",
    instruments: ["Electric guitar", "Bass", "Drums", "Vocals"],
    feel: "High-fidelity, eclectic, rock-influenced",
    artists: ["Joe Bonamassa", "Gary Clark Jr.", "Larkin Poe", "Walter Trout"],
    desc: "Today's torchbearers — drawing on every era, plugged into modern amps and modern audiences.",
  },
];

export const FESTIVALS = [
  { name: "Notodden Blues Festival", country: "🇳🇴 Norway", month: "August", city: "Notodden", url: "https://bluesfest.no" },
  { name: "Mandal Blues Festival", country: "🇳🇴 Norway", month: "August", city: "Mandal", url: "https://mandalbluesfestival.no" },
  { name: "Skånevik Bluesfestival", country: "🇳🇴 Norway", month: "July", city: "Skånevik", url: "https://skanevikbluesfestival.no" },
  { name: "Memphis in May / Beale Street Music Festival", country: "🇺🇸 USA", month: "May", city: "Memphis, TN", url: "https://memphisinmay.org" },
  { name: "Chicago Blues Festival", country: "🇺🇸 USA", month: "June", city: "Chicago, IL", url: "https://www.choosechicago.com/chicago-blues-festival/" },
  { name: "King Biscuit Blues Festival", country: "🇺🇸 USA", month: "October", city: "Helena, AR", url: "https://kingbiscuitfestival.com" },
  { name: "Cognac Blues Passions", country: "🇫🇷 France", month: "July", city: "Cognac", url: "https://www.bluespassions.com" },
  { name: "Mississippi Valley Blues Festival", country: "🇺🇸 USA", month: "July", city: "Davenport, IA", url: "https://mvbs.org" },
  { name: "Moulin Blues Ospel", country: "🇳🇱 Netherlands", month: "May", city: "Ospel", url: "https://moulinblues.nl" },
  { name: "European Blues Challenge", country: "🇪🇺 Europe", month: "April", city: "Katowice 2026", url: "https://www.europeanbluesunion.com" },
];

export const RADIO_SHOWS = [
  { time: "00–06", show: "Slow Night Blues", host: "Deep cuts from the Delta" },
  { time: "06–10", show: "Morning Boogie", host: "Wake-up shuffle and harmonica" },
  { time: "10–14", show: "Chess Records Hour", host: "Muddy, Wolf, Sonny Boy, Walter" },
  { time: "14–18", show: "Modern Voices", host: "New releases and live sessions" },
  { time: "18–22", show: "Juke Joint Friday", host: "Saturday-night sized energy" },
  { time: "22–00", show: "Late Mood", host: "Slow blues, soul-blues, gospel" },
];

export const BLOG_POSTS = [
  { slug: "buddy-guy-farewell", date: "2026-04-12", title: "Buddy Guy — The Final Goodbye", excerpt: "At 89, the last giant of Chicago blues bows out with a tour that feels less like a farewell than a benediction.", img: IMG.buddyGuy },
  { slug: "delta-pilgrimage", date: "2026-03-28", title: "A Pilgrimage to Clarksdale", excerpt: "Stovall Plantation, the Crossroads sign, Red's Lounge — walking the ground that gave us the blues.", img: IMG.clarksdale },
  { slug: "norwegian-blues-2026", date: "2026-03-10", title: "The Norwegian Blues Year 2026", excerpt: "Notodden, Mandal, Skånevik — and the new generation of Nordic blues artists worth your attention.", img: IMG.stage },
  { slug: "muddy-mojo-50", date: "2026-02-22", title: "50 Years of «Got My Mojo Working»", excerpt: "How a Preston Foster song became Muddy Waters' most-played number and a global blues standard.", img: IMG.muddyWaters },
  { slug: "harmonica-essentials", date: "2026-02-04", title: "Harmonica Essentials — 10 Players to Know", excerpt: "From Little Walter to Charlie Musselwhite — a primer on the small instrument that shaped the big sound.", img: IMG.harmonica },
  { slug: "robert-johnson-truth", date: "2026-01-18", title: "Robert Johnson — Myth vs Truth", excerpt: "What we actually know about the man behind the crossroads legend, separated from a hundred years of romance.", img: IMG.robertJohnson },
];

export const WORLD_PINS = [
  { name: "Clarksdale, MS", lat: 34.20, lng: -90.57, type: "Cradle of the Delta blues" },
  { name: "Memphis, TN", lat: 35.15, lng: -90.05, type: "Beale Street, Stax, Sun" },
  { name: "Chicago, IL", lat: 41.85, lng: -87.65, type: "Chess Records, Maxwell Street" },
  { name: "Helena, AR", lat: 34.53, lng: -90.59, type: "King Biscuit Time" },
  { name: "New Orleans, LA", lat: 29.95, lng: -90.07, type: "Jazz/blues meeting point" },
  { name: "London, UK", lat: 51.51, lng: -0.13, type: "British blues boom" },
  { name: "Notodden, NO", lat: 59.56, lng: 9.26, type: "European Blues Hall of Fame" },
  { name: "Tokyo, JP", lat: 35.68, lng: 139.69, type: "Japanese blues scene" },
  { name: "Katowice, PL", lat: 50.26, lng: 19.02, type: "European Blues Challenge 2026" },
];
