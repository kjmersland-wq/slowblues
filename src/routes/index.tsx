import { createFileRoute, Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TickerItem } from "@/lib/newsfeed.functions";
import { fetchArtistStats, fetchVoiceArtists, type ArtistStats, type VoiceRow } from "@/lib/artists";
import { hasPublishedQuizCycle } from "@/lib/quiz.server";
import { resolveArtistImage } from "@/lib/artistImageMap";

import {
  ShoppingBag, HelpCircle, BookOpen, Music, Radio, Mic,
  ChevronDown, ChevronLeft, ChevronRight, Play, ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MerchCta } from "@/components/MerchCta";
import { HomeFilmSection } from "@/components/HomeFilmSection";
import { IMG } from "@/data/images";
import { useI18n, tr, type Lang } from "@/i18n";
import { artistDetailPath, artistsListPath } from "@/lib/locale";
import heroJukeImg from "@/assets/hero-juke.webp";
import heroDeltaImg from "@/assets/hero-delta.webp";
import heroGuitarImg from "@/assets/hero-guitar.webp";
import logoSB from "@/assets/logo-slowblues-448.webp";

const heroJuke = heroJukeImg;
const heroCotton = heroDeltaImg;
const heroGuitar = heroGuitarImg;
const robertJohnson = IMG.robertJohnson;
const muddyWaters = IMG.muddyWaters;
const sonHouse = IMG.sonHouse;

const SITE = "https://www.slow-blues.com";
// English lives unprefixed at "/" (the SSR default language whenever no
// locale is signalled by the URL -- see routeLangFromPath in src/i18n).
// The other four now have real documents at /no, /sv, /de, /pl (see
// $locale.index.tsx), so hreflang can finally point at genuine per-language
// URLs instead of five identical links to the same English HTML.
const HOME_HREFLANG: { hreflang: string; href: string }[] = [
  { hreflang: "en", href: `${SITE}/` },
  { hreflang: "no", href: `${SITE}/no` },
  { hreflang: "sv", href: `${SITE}/sv` },
  { hreflang: "de", href: `${SITE}/de` },
  { hreflang: "pl", href: `${SITE}/pl` },
  { hreflang: "x-default", href: `${SITE}/` },
];

export const Route = createFileRoute("/")({
  component: () => {
    const stats = Route.useLoaderData();
    return <Home stats={stats} />;
  },
  loader: async () => ({ ...(await fetchArtistStats()), voices: await fetchVoiceArtists(), hasQuiz: await hasPublishedQuizCycle() }),
  head: ({ loaderData }) => {
    // Live count from the artists table; if the loader failed (DB unreachable)
    // the number is simply omitted -- never a hardcoded fallback.
    const n = loaderData?.artistCount ? `${loaderData.artistCount}+ ` : "";
    const title = `SlowBlues — The Blues Encyclopedia: ${n}Artists, History & Reviews`;
    const description = "From the Delta porch to Chicago electric — artist stories, reviews and the living scene. Independent archive, no display ads in the articles. Wear the blues and keep the archive alive.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://www.slow-blues.com/" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en" },
      ],
      links: [
        { rel: "canonical", href: "https://www.slow-blues.com/" },
        ...HOME_HREFLANG.map((a) => ({ rel: "alternate", hreflang: a.hreflang, href: a.href })),
        { rel: "preload", as: "image", href: heroJukeImg, fetchpriority: "high" } as any,
      ],
    };
  },
});

const FALLBACK_TICKER: TickerItem[] = [
  { id: "fb-1", kind: "house", label: "SLOWBLUES", text: "SlowBlues — a living archive of blues artists, reviews & live recordings.", href: "/artists" },
  { id: "fb-2", kind: "house", label: "EXPLORE", text: "Dive into the full artist archive — from Delta to Chicago to Scandinavia.", href: "/artists" },
];

function getHeroSlides(lang: Lang) {
  return [
    {
      img: heroJuke,
      eyebrow: tr(lang, { no: "De langsomme, sjelfulle røttene", en: "The Slow, Soulful Roots", pl: "Powolne, uduchowione korzenie", sv: "De långsamma, själfulla rötterna", de: "Die langsamen, seelenvollen Wurzeln" }),
      title: tr(lang, {
        no: "SlowBlues — Det globale blues-leksikonet",
        en: "SlowBlues — The Global Blues Encyclopedia", pl: "SlowBlues — Globalna Encyklopedia Bluesa",
        sv: "SlowBlues — Det globala blues-lexikonet",
        de: "SlowBlues — Die globale Blues-Enzyklopädie",
      }),
      titleAccent: tr(lang, { no: "Der bluesen begynte", en: "Where the blues began", pl: "Gdzie narodził się blues", sv: "Där bluesen började", de: "Wo der Blues begann" }),
      quote: tr(lang, {
        no: "«Bluesen er røttene, de andre musikkartene er fruktene.»",
        en: "«The blues are the roots and the other musics are the fruits.»", pl: "«Blues jest korzeniem, inne rodzaje muzyki to owoce.»",
        sv: "«Bluesen är rötterna, de andra musikarterna är frukterna.»",
        de: "«Der Blues ist die Wurzel, die anderen Musikarten sind die Früchte.»",
      }),
      attr: "— Willie Dixon",
      body: tr(lang, {
        no: "Tre inn i Chicago. Historien, pionerene og lyden som la grunnlaget for rock, jazz og alt som kom etter.",
        en: "Step into Chicago. The history, pioneers and sound that laid the foundation for rock, jazz and everything that came after.", pl: "Wkrocz do Chicago. Historia, pionierzy i brzmienie, które stworzyły podwaliny rocka, jazzu i wszystkiego, co nadeszło później.",
        sv: "Stig in i Chicago. Historien, pionjärerna och ljudet som lade grunden för rock, jazz och allt som kom efter.",
        de: "Tritt ein in Chicago. Die Geschichte, Pioniere und der Klang, der den Grundstein für Rock, Jazz und alles Spätere legte.",
      }),
      showButtons: true,
    },
    {
      img: heroCotton,
      eyebrow: tr(lang, { no: "Delta & Chicago", en: "Delta & Chicago", pl: "Delta i Chicago", sv: "Delta & Chicago", de: "Delta & Chicago" }),
      title: tr(lang, { no: "EN TIDLØS HYLLEST", en: "A TIMELESS TRIBUTE", pl: "PONADCZASOWY HOŁD", sv: "EN TIDLÖS HYLLNING", de: "EINE ZEITLOSE HOMMAGE" }),
      titleAccent: tr(lang, {
        no: "til den rå sjelen i Delta- og Chicago-bluesen",
        en: "to the raw soul of Delta & Chicago Blues", pl: "do surowej duszy Delta & Chicago Blues",
        sv: "till den råa själen i Delta- och Chicago-bluesen",
        de: "an die rohe Seele des Delta- und Chicago-Blues",
      }),
      quote: tr(lang, {
        no: "Fra bomullsmarkene til verdens scener — de virkelige røttene til moderne musikk.",
        en: "From the cotton fields to the global stage — the real roots of modern music.", pl: "Od pól bawełny po światowe sceny — prawdziwe korzenie współczesnej muzyki.",
        sv: "Från bomullsfälten till världens scener — de verkliga rötterna till modern musik.",
        de: "Von den Baumwollfeldern auf die Bühnen der Welt — die echten Wurzeln moderner Musik.",
      }),
      attr: "",
      body: "",
      showButtons: false,
      tribute: true,
    },
    {
      img: heroGuitar,
      eyebrow: tr(lang, { no: "Slide & resonator", en: "Slide & Resonator", pl: "Slide i Resonator", sv: "Slide & resonator", de: "Slide & Resonator" }),
      title: tr(lang, { no: "LYDEN AV SJEL", en: "THE SOUND OF SOUL", pl: "BRZMIENIE DUSZY", sv: "LJUDET AV SJÄL", de: "DER KLANG DER SEELE" }),
      titleAccent: tr(lang, {
        no: "stålstrenger, messingkoner, langsomme hjerteslag",
        en: "steel strings, brass cones, slow heartbeats", pl: "stalowe struny, mosiężne rezonatory, wolne bicia serca",
        sv: "stålsträngar, mässingkoner, långsamma hjärtslag",
        de: "Stahlsaiten, Messingkonen, langsame Herzschläge",
      }),
      quote: tr(lang, {
        no: "«Å spille gitar er som å fortelle sannheten.»",
        en: "«Playing guitar is like telling the truth.»", pl: "«Granie na gitarze jest jak mówienie prawdy.»",
        sv: "«Att spela gitarr är som att tala sanning.»",
        de: "«Gitarre spielen ist, als würde man die Wahrheit sagen.»",
      }),
      attr: "— B.B. King",
      body: "",
      showButtons: false,
    },
  ];
}

function getPioneers(lang: Lang) {
  return [
    {
      img: robertJohnson, icon: Music,
      tag: tr(lang, { no: "Korsveis-legenden", en: "The Crossroads Legend", pl: "Legenda rozstajów", sv: "Korsvägslegenden", de: "Die Crossroads-Legende" }),
      name: "Robert Johnson",
      slug: "robert-johnson",
      desc: tr(lang, {
        no: "Kun 29 innspillinger, men han definerte Delta-blueslyden og inspirerte generasjoner av rockemusikere.",
        en: "Only 29 recordings, but he defined the Delta blues sound and inspired generations of rock musicians.", pl: "Tylko 29 nagrań, ale to on zdefiniował brzmienie bluesa Delty i zainspirował pokolenia muzyków rockowych.",
        sv: "Bara 29 inspelningar, men han definierade Delta-bluesens ljud och inspirerade generationer av rockmusiker.",
        de: "Nur 29 Aufnahmen, doch er definierte den Delta-Blues-Sound und inspirierte Generationen von Rockmusikern.",
      }),
    },
    {
      img: muddyWaters, icon: Radio,
      tag: tr(lang, { no: "Chicago-bluesens far", en: "Father of Chicago Blues", pl: "Ojciec Chicago Blues", sv: "Chicago-bluesens fader", de: "Vater des Chicago-Blues" }),
      name: "Muddy Waters",
      slug: "muddy-waters",
      desc: tr(lang, {
        no: "Elektrifiserte Delta-lyden og ble broen mellom akustiske røtter og moderne bluesrock.",
        en: "Electrified the Delta sound and became the bridge between acoustic roots and modern blues-rock.", pl: "Zelektryzował brzmienie Delta i stał się pomostem między akustycznymi korzeniami a nowoczesnym blues-rockiem.",
        sv: "Elektrifierade Delta-ljudet och blev bron mellan akustiska rötter och modern bluesrock.",
        de: "Elektrifizierte den Delta-Sound und wurde zur Brücke zwischen akustischen Wurzeln und modernem Blues-Rock.",
      }),
    },
    {
      img: sonHouse, icon: Mic,
      tag: tr(lang, { no: "Predikantens blues", en: "The Preacher's Blues", pl: "The Preacher's Blues", sv: "Predikantens blues", de: "Der Blues des Predigers" }),
      name: "Son House",
      slug: "son-house",
      desc: tr(lang, {
        no: "Rå, emosjonell slidegitar og åndelig intensitet som direkte påvirket Robert Johnson.",
        en: "Raw, emotional slide guitar and spiritual intensity that directly influenced Robert Johnson.", pl: "Surowa, emocjonalna gra na slide guitar i duchowa intensywność, która bezpośrednio wpłynęła na Roberta Johnsona.",
        sv: "Rå, känslomässig slidegitarr och andlig intensitet som direkt påverkade Robert Johnson.",
        de: "Rohe, emotionale Slide-Gitarre und spirituelle Intensität, die Robert Johnson direkt beeinflussten.",
      }),
    },
  ];
}

function getTimeline(lang: Lang) {
  return [
    { year: "1890",
      title: tr(lang, { no: "Bluesen tar form", en: "The Blues Takes Shape", pl: "Blues nabiera kształtu", sv: "Bluesen tar form", de: "Der Blues nimmt Gestalt an" }),
      body: tr(lang, {
        no: "Bluesformen begynner å krystallisere seg i Mississippi-deltaet. Arbeidssanger, field hollers, spirituals og afrikanske musikktradisjoner smelter sammen.",
        en: "The blues form begins to crystallize in the Mississippi Delta region. Work songs, field hollers, spirituals and African musical traditions blend into one.", pl: "Forma bluesowa zaczyna krystalizować się w regionie Delty Missisipi. Pieśni pracy, zawołania z pól, spirituals i afrykańskie tradycje muzyczne łączą się w jedno.",
        sv: "Bluesformen börjar kristalliseras i Mississippi-deltat. Arbetssånger, field hollers, spirituals och afrikanska musiktraditioner smälter samman.",
        de: "Die Blues-Form beginnt sich im Mississippi-Delta zu formen. Arbeitslieder, Field Hollers, Spirituals und afrikanische Musiktraditionen verschmelzen.",
      })},
    { year: "1920",
      title: tr(lang, { no: "Første blues-innspilling", en: "First Blues Recording", pl: "Pierwsze nagranie bluesowe", sv: "Första blues-inspelningen", de: "Erste Blues-Aufnahme" }),
      body: tr(lang, {
        no: "Mamie Smith spiller inn 'Crazy Blues' for Okeh Records — den første blues-innspillingen av en afroamerikansk artist. Den skal visstnok ha solgt rundt 75 000 eksemplarer den første måneden.",
        en: "Mamie Smith records 'Crazy Blues' for Okeh Records — the first blues recording by an African American artist. It reportedly sells around 75,000 copies in the first month.", pl: "Mamie Smith nagrywa „Crazy Blues” dla Okeh Records — to pierwsze nagranie bluesowe afroamerykańskiej artystki. W pierwszym miesiącu sprzedaje się podobno około 75 000 kopii.",
        sv: "Mamie Smith spelar in 'Crazy Blues' för Okeh Records — den första blues-inspelningen av en afroamerikansk artist. Den ska ha sålt runt 75 000 exemplar den första månaden.",
        de: "Mamie Smith nimmt 'Crazy Blues' für Okeh Records auf — die erste Blues-Aufnahme einer afroamerikanischen Künstlerin. Berichten zufolge etwa 75.000 Exemplare im ersten Monat.",
      })},
    { year: "1936",
      title: tr(lang, { no: "Robert Johnsons innspillinger", en: "Robert Johnson Sessions", pl: "Sesje Roberta Johnsona", sv: "Robert Johnson-sessionerna", de: "Robert-Johnson-Sessions" }),
      body: tr(lang, {
        no: "Robert Johnson spiller inn sine legendariske sesjoner i San Antonio, Texas på Gunter Hotel. Disse 29 sangene skulle bli de mest innflytelsesrike blues-innspillingene noensinne.",
        en: "Robert Johnson records his legendary sessions in San Antonio, Texas at the Gunter Hotel. These 29 songs would become the most influential blues recordings of all time.", pl: "Robert Johnson nagrywa swoje legendarne sesje w San Antonio w Teksasie, w hotelu Gunter. Tych 29 piosenek stanie się najbardziej wpływowymi nagraniami bluesowymi wszech czasów.",
        sv: "Robert Johnson spelar in sina legendariska sessioner i San Antonio, Texas på Gunter Hotel. Dessa 29 låtar skulle bli tidernas mest inflytelserika blues-inspelningar.",
        de: "Robert Johnson nimmt seine legendären Sessions im Gunter Hotel in San Antonio, Texas auf. Diese 29 Songs werden zu den einflussreichsten Blues-Aufnahmen aller Zeiten.",
      })},
    { year: "1947",
      title: tr(lang, { no: "Aristocrat blir Chess Records", en: "Aristocrat Becomes Chess Records", pl: "Aristocrat staje się Chess Records", sv: "Aristocrat blir Chess Records", de: "Aristocrat wird zu Chess Records" }),
      body: tr(lang, {
        no: "Leonard og Phil Chess starter et lite plateselskap i Chicago — Aristocrat. Noen år senere døper de det om til Chess, og det skulle bli det viktigste blues-plateselskapet i historien.",
        en: "Leonard and Phil Chess start a small Chicago label called Aristocrat. A few years later they rename it Chess, and it goes on to become the most important blues record company in history.", pl: "Leonard i Phil Chess zakładają w Chicago małą wytwórnię Aristocrat. Kilka lat później zmieniają jej nazwę na Chess — i staje się ona najważniejszą firmą płytową w historii bluesa.",
        sv: "Leonard och Phil Chess startar ett litet skivbolag i Chicago — Aristocrat. Några år senare döper de om det till Chess, och det blir historiens viktigaste blues-skivbolag.",
        de: "Leonard und Phil Chess gründen ein kleines Label in Chicago — Aristocrat. Ein paar Jahre später nennen sie es Chess, und es wird zum wichtigsten Blues-Label der Geschichte.",
      })},
    { year: "1958",
      title: tr(lang, { no: "Muddy Waters turnerer Storbritannia", en: "Muddy Waters Tours Britain", pl: "Muddy Waters koncertuje w Wielkiej Brytanii", sv: "Muddy Waters turnerar i Storbritannien", de: "Muddy Waters tourt durch Großbritannien" }),
      body: tr(lang, {
        no: "Muddy Waters' elektriske opptredener sjokkerer britisk publikum som ventet akustisk folk-blues. Turen tenner den britiske blues-bølgen.",
        en: "Muddy Waters' electric performances shock British audiences expecting acoustic folk-blues. This tour ignites the British blues boom and inspires a generation.", pl: "Elektryzujące występy Muddy'ego Watersa szokują brytyjską publiczność oczekującą akustycznego folk-blues. Ta trasa rozpala brytyjski boom bluesowy i inspiruje pokolenie.",
        sv: "Muddy Waters elektriska framträdanden chockar brittisk publik som väntat sig akustisk folk-blues. Turnén tänder den brittiska blues-boomen.",
        de: "Muddy Waters' elektrische Auftritte schockieren das britische Publikum, das akustischen Folk-Blues erwartete. Die Tour entfacht den britischen Blues-Boom.",
      })},
    { year: "1962",
      title: tr(lang, { no: "Rolling Stones dannes", en: "Rolling Stones Formed", pl: "Powstają Rolling Stones", sv: "Rolling Stones bildas", de: "Rolling Stones gegründet" }),
      body: tr(lang, {
        no: "The Rolling Stones dannes i London, oppkalt etter Muddy Waters-sangen. De og andre britiske band ville snart bringe bluesen ut til et globalt rockepublikum.",
        en: "The Rolling Stones form in London, named after Muddy Waters' song. They and other British bands would soon bring the blues to a worldwide rock audience.", pl: "The Rolling Stones powstają w Londynie, nazwani na cześć piosenki Muddy'ego Watersa. Oni i inne brytyjskie zespoły wkrótce wprowadziły bluesa do światowej publiczności rockowej.",
        sv: "The Rolling Stones bildas i London, uppkallat efter Muddy Waters låt. De och andra brittiska band skulle snart föra ut bluesen till en global rockpublik.",
        de: "Die Rolling Stones formieren sich in London, benannt nach Muddy Waters' Song. Sie und andere britische Bands bringen den Blues bald zum weltweiten Rockpublikum.",
      })},
  ];
}

// "1891–1934"; prefixed "c. " when the stored birth text says the date is disputed.
function lifespan(born: string | null, died: string | null) {
  const y = (t: string | null) => t?.match(/\b(1[89]\d\d|20\d\d)\b/)?.[1];
  const b = y(born), d = y(died);
  if (!b) return "";
  const approx = /disputed|variously|reported as|^c\./i.test(born ?? "") ? "c. " : "";
  return `${approx}${b}–${d ?? ""}`;
}

function getVoices(lang: Lang, rows: VoiceRow[]) {
  const tag = tr(lang, { no: "Delta", en: "Delta", pl: "Delta", sv: "Delta", de: "Delta" });
  const base = (slug: string) => {
    const r = rows.find((x) => x.slug === slug);
    if (!r) return null;
    return { tag, name: r.name, slug, img: resolveArtistImage(r.img) ?? "", credit: r.image_credit, years: lifespan(r.born, r.died) };
  };
  return [
    { ...base("charley-patton")!,
      desc: tr(lang, {
        no: "Deltabluesens første store stjerne, fra Dockery-plantasjen. Sett på «Pony Blues», så hører du hvorfor alle fulgte etter.",
        en: "The first big star of the Delta, out of Dockery Plantation. Put on “Pony Blues” and you’ll hear why everyone followed him.", pl: "Pierwsza wielka gwiazda bluesa z Delty, z plantacji Dockery. Włącz „Pony Blues” i posłuchaj, dlaczego wszyscy szli jego śladem.",
        sv: "Deltabluesens första stora stjärna, från Dockery-plantagen. Sätt på «Pony Blues», så hör du varför alla följde efter.",
        de: "Der erste große Star des Delta-Blues, von der Dockery-Plantage. Leg „Pony Blues“ auf, dann hörst du, warum ihm alle folgten.",
      }), color: "from-amber-900/60 to-stone-900" },
    { ...base("skip-james")!,
      desc: tr(lang, {
        no: "Falsetten hans går rett gjennom marg og bein. Hør «Hard Time Killing Floor Blues» en sen kveld — du glemmer den ikke.",
        en: "That falsetto goes straight through you. Play “Hard Time Killing Floor Blues” late at night and you won’t forget it.", pl: "Ten falset przenika na wskroś. Włącz „Hard Time Killing Floor Blues” późnym wieczorem — nie zapomnisz go.",
        sv: "Den där falsetten går rakt igenom en. Sätt på «Hard Time Killing Floor Blues» en sen kväll — du glömmer den inte.",
        de: "Dieser Falsett geht durch und durch. Hör „Hard Time Killing Floor Blues“ spät abends — du vergisst ihn nicht.",
      }), color: "from-stone-800 to-stone-900" },
    { ...base("memphis-minnie")!,
      desc: tr(lang, {
        no: "Hun spilte høyt og hardt, og skrev sangene selv. «Bumble Bee» er et fint sted å begynne.",
        en: "She played loud, played hard and wrote her own songs. “Bumble Bee” is a good place to start.", pl: "Grała głośno i mocno, a piosenki pisała sama. „Bumble Bee” to dobry początek.",
        sv: "Hon spelade högt och hårt och skrev sina egna låtar. «Bumble Bee» är ett bra ställe att börja.",
        de: "Sie spielte laut und hart und schrieb ihre Songs selbst. „Bumble Bee“ ist ein guter Einstieg.",
      }), color: "from-rose-900/60 to-stone-900" },
    { ...base("john-lee-hooker")!,
      desc: tr(lang, {
        no: "Født i Mississippi-deltaet, men lyden hans hører hjemme i Detroit-boogien — ett groove og en fot som aldri sto stille. Start med «Boogie Chillen».",
        en: "Born in the Mississippi Delta, but his sound belongs to Detroit boogie — one groove and a foot that never sat still. Start with “Boogie Chillen.”", pl: "Urodzony w Delcie Missisipi, ale jego brzmienie należy do detroit boogie — jeden groove i stopa, która nigdy nie stała w miejscu. Zacznij od „Boogie Chillen”.",
        sv: "Född i Mississippideltat, men hans sound hör hemma i Detroit-boogien — ett enda groove och en fot som aldrig stod stilla. Börja med «Boogie Chillen».",
        de: "Geboren im Mississippi-Delta, aber sein Sound gehört zum Detroit-Boogie — ein Groove und ein Fuß, der nie stillstand. Fang mit „Boogie Chillen“ an.",
      }), color: "from-stone-800 to-stone-900" },
  ].filter((v) => v.name);
}

type HomeStats = ArtistStats & { voices: VoiceRow[]; hasQuiz: boolean };

// Exported so $locale.index.tsx (the real /no, /sv, /de, /pl homepage
// documents) can render the exact same page -- only the loader call site
// and the URL differ; the language itself already comes from routing
// (routeLangFromPath resolves /no, /sv, /de, /pl before I18nProvider ever
// renders a child), not from a prop, so there's no forceLang to thread.
export function Home({ stats }: { stats: HomeStats }) {
  const { lang } = useI18n();
  const heroSlides = useMemo(() => getHeroSlides(lang), [lang]);
  const [slide, setSlide] = useState(0);
  // Slides 2-3 sit stacked at opacity-0 inside the viewport, so their <img> would download
  // immediately even with loading="lazy". Arm them only after the first paint has settled.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 4000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 8000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO carousel */}
      <section className="relative">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            // Duration was 1000ms: during that whole window BOTH the outgoing and
            // incoming slide render at partial opacity simultaneously (only opacity
            // animates here, not visibility), so their full text stacks -- title,
            // quote, CTA buttons, everything -- visibly overlap and interleave into
            // an illegible jumble for most of a full second on every rotation. A much
            // shorter crossfade keeps the same fade aesthetic but shrinks that overlap
            // window enough that it's no longer perceptible as broken/unreadable.
            className={`${i === slide ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"} transition-opacity duration-200`}
          >
            <HeroSlide {...s} active={i === slide} load={i === 0 || armed || i === slide} isPrimary={i === 0} lang={lang} stats={stats} />
          </div>
        ))}
        <button
          onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-background/40 backdrop-blur border border-border hover:border-gold transition flex items-center justify-center"
          aria-label="Previous slide"
        ><ChevronLeft className="size-5" /></button>
        <button
          onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-background/40 backdrop-blur border border-border hover:border-gold transition flex items-center justify-center"
          aria-label="Next slide"
        ><ChevronRight className="size-5" /></button>
        <div className="absolute bottom-6 right-8 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-gold" : "w-4 bg-foreground/30"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <Ticker />
      <HomeFilmSection />
      <Join hasQuiz={stats.hasQuiz} />
      <ThreeNames />
      <MerchDrop />
      <Timeline />
      <Voices voices={stats.voices} />
      <DeltaVsChicago />
      <MerchCta />
      <SiteFooter />
    </div>
  );
}

/* ───────── components ───────── */

function HeroSlide({ img, eyebrow, title, titleAccent, quote, attr, body, showButtons, tribute, credit, active, load, isPrimary, lang, stats }: any) {
  const HeadingTag: any = isPrimary ? "h1" : "h2";
  const tributeJsx = (
    <>
      {tr(lang, {
        no: "En tidløs hyllest til den rå sjelen i ",
        en: "A timeless tribute to the raw soul of ", pl: "Ponadczasowy hołd dla surowej duszy ",
        sv: "En tidlös hyllning till den råa själen i ",
        de: "Eine zeitlose Hommage an die rohe Seele des ",
      })}
      <span className="text-gold">{tr(lang, { no: "Delta- og Chicago-bluesen", en: "Delta & Chicago Blues", pl: "Delta & Chicago Blues", sv: "Delta- och Chicago-bluesen", de: "Delta- und Chicago-Blues" })}</span>
    </>
  );
  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {load && (
        <img
          src={img}
          alt=""
          loading={isPrimary ? "eager" : "lazy"}
          decoding={isPrimary ? "sync" : "async"}
          {...(isPrimary ? { fetchPriority: "high" as const } : {})}
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background" />
      <div className="relative z-10 text-center max-w-4xl px-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-12 bg-gold/60" />
          <span className="text-[11px] tracking-[0.3em] text-gold uppercase">{eyebrow}</span>
          <span className="h-px w-12 bg-gold/60" />
        </div>
        {showButtons && (
          <div className="mx-auto mb-6 flex items-center justify-center">
            <img
              src={logoSB}
              width={256}
              height={256}
              alt="SlowBlues — Global Blues Encyclopedia"
              className="size-56 md:size-64 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]"
            />
          </div>
        )}
        <HeadingTag className="font-display font-black tracking-tight text-6xl md:text-8xl gold-gradient-text leading-none">
          {tribute ? tributeJsx : title}
        </HeadingTag>
        {!tribute && (
          <div className="mt-4 font-display text-2xl md:text-3xl text-foreground/90">{titleAccent}</div>
        )}
        {quote && (
          <p className="mt-8 italic text-lg md:text-xl text-foreground/85 font-display">{quote}</p>
        )}
        {attr && <p className="mt-2 text-sm text-muted-foreground">{attr}</p>}
        {body && <p className="mt-6 max-w-2xl mx-auto text-foreground/75 leading-relaxed">{body}</p>}
        {showButtons && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#voices" className="px-7 py-3.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition">
              {tr(lang, { no: "Utforsk artister", en: "Explore artists", pl: "Odkryj artystów", sv: "Utforska artister", de: "Künstler entdecken" })}
            </a>
            <a href="#support" className="px-7 py-3.5 rounded-md border border-gold/60 text-foreground hover:bg-gold/10 transition flex items-center gap-2">
              <ShoppingBag className="size-4" /> {tr(lang, { no: "Kjøp blues-merch", en: "Shop Blues Merch", pl: "Kup Blues Merch", sv: "Köp blues-merch", de: "Blues-Merch kaufen" })}
            </a>
            <Link to="/listen" className="px-7 py-3.5 rounded-md border border-gold/40 text-foreground hover:bg-gold/10 transition flex items-center gap-2">
              <Play className="size-4" /> {tr(lang, { no: "Lytt", en: "Listen", pl: "Słuchaj", sv: "Lyssna", de: "Hören" })}
            </Link>
          </div>
        )}
        {showButtons && stats && (stats.artistCount > 0 || stats.countryCount > 0) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm tracking-wide text-muted-foreground">
            <span className="whitespace-nowrap"><span className="text-gold font-semibold">{stats.artistCount}+</span> {tr(lang, { no: "artister", en: "artists", pl: "artystów", sv: "artister", de: "Künstler" })}</span>
            <span className="h-3 w-px bg-gold/30 hidden sm:inline-block" aria-hidden="true" />
            <span className="whitespace-nowrap"><span className="text-gold font-semibold">{stats.countryCount}+</span> {tr(lang, { no: "land", en: "countries", pl: "krajów", sv: "länder", de: "Länder" })}</span>
          </div>
        )}
        {credit && (
          <div className="absolute bottom-10 left-8 text-xs text-muted-foreground/70 bg-background/40 backdrop-blur px-3 py-2 rounded">
            {credit}
          </div>
        )}
        <div className="mt-16 flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-muted-foreground">
          {tr(lang, { no: "RULL", en: "SCROLL", pl: "PRZEWIŃ", sv: "RULLA", de: "SCROLLEN" })}
          <ChevronDown className="size-4 animate-bounce-slow text-gold" />
        </div>
      </div>
    </div>
  );
}

// The ticker API is a shared, cross-locale-cached JSON endpoint (see
// api.ticker.ts's Cache-Control) so it deliberately returns locale-neutral
// hrefs (default-locale artist paths). Rewrite the /artists/{slug} ones to
// the viewer's current language client-side rather than baking a locale
// into a cached response that every visitor shares.
function localizeHref(href: string, lang: Lang): string {
  const m = href.match(/^\/artists\/([^/#?]+)/);
  if (!m) return href;
  const rest = href.slice(m[0].length);
  return `${artistDetailPath(lang, m[1])}${rest}`;
}

const TICKER_ITEM_SECONDS = 8;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Ticker() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["news-ticker", lang],
    queryFn: async () => {
      const res = await fetch(`/api/ticker?lang=${lang}`);
      if (!res.ok) throw new Error(`ticker fetch failed: ${res.status}`);
      return (await res.json()) as { items: TickerItem[]; generatedAt: string };
    },
    staleTime: 30 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const items: TickerItem[] = useMemo(() => {
    const base = data?.items?.length ? data.items : FALLBACK_TICKER;
    const seen = new Set<string>();
    return base.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
  }, [data]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Reset to the first item whenever the underlying batch changes (new
  // language, or a fresh batch came back from the server) so we never point
  // past the end of a shorter list.
  useEffect(() => setIndex(0), [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % items.length), TICKER_ITEM_SECONDS * 1000);
    return () => clearTimeout(id);
  }, [index, paused, items.length]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const accent = (k: TickerItem["kind"]) => {
    switch (k) {
      case "release": return "text-gold";
      case "youtube": return "text-red-400";
      case "concert": return "text-amber-300";
      case "birthday": return "text-blue-300";
      case "onthisday": return "text-cyan-300";
      case "memoriam": return "text-rose-300";
      case "house": return "text-emerald-300";
      case "external": return "text-purple-300";
      default: return "text-gold";
    }
  };

  if (items.length === 0) return null;
  const t = items[Math.min(index, items.length - 1)];

  return (
    <div
      className="relative border-y border-border bg-card/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={tr(lang, {
        no: "Direkte bluesnyheter",
        en: "Live blues news ticker",
        sv: "Direkta bluesnyheter",
        de: "Blues-Nachrichtenticker live",
        pl: "Wiadomości bluesowe na żywo",
      })}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <a
          key={t.id}
          href={t.external ? t.href : localizeHref(t.href, lang)}
          {...(t.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`min-w-0 flex-1 text-sm text-foreground/85 hover:text-foreground inline-flex items-center gap-2 group ${reducedMotion ? "" : "transition-opacity duration-300"}`}
        >
          <span className={`${accent(t.kind)} font-mono text-[10px] tracking-widest uppercase shrink-0`}>
            {t.flag ? `${t.flag} ` : ""}{t.label}
          </span>
          <span className="opacity-40 shrink-0">›</span>
          <span className="truncate group-hover:underline underline-offset-4 decoration-gold/60">
            {t.text}
          </span>
        </a>
        {items.length > 1 && (
          <div className="shrink-0 flex items-center gap-2">
            {items.length <= 12 ? (
              <div className="flex items-center gap-1" role="tablist" aria-label={tr(lang, { no: "Saker i stripen", en: "Ticker items", sv: "Poster i listan", de: "Ticker-Einträge", pl: "Pozycje na pasku" })}>
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`${i + 1} / ${items.length}`}
                    onClick={() => setIndex(i)}
                    className={`size-1.5 rounded-full transition-colors ${i === index ? "bg-gold" : "bg-border hover:bg-gold/50"}`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{index + 1} / {items.length}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Join({ hasQuiz }: { hasQuiz: boolean }) {
  const { lang } = useI18n();
  const items = [
    { icon: ShoppingBag,
      title: tr(lang, { no: "Blues-merch", en: "Blues Merch", pl: "Blues Merch", sv: "Blues-merch", de: "Blues-Merch" }),
      desc: tr(lang, { no: "T-skjorter, plakater og vinyl for den ekte bluesfanen.", en: "T-shirts, posters and vinyl for the true blues fan.", pl: "Koszulki, plakaty i winyle dla prawdziwego fana bluesa.", sv: "T-shirts, posters och vinyl för den äkta bluesfantasten.", de: "T-Shirts, Poster und Vinyl für den echten Blues-Fan." }),
      href: "https://merch.slow-blues.com/products/wear-the-blues-tee", isNew: true },
    { icon: HelpCircle,
      title: tr(lang, { no: "Blues-quiz", en: "Blues Quiz", pl: "Bluesowy quiz", sv: "Blues-quiz", de: "Blues-Quiz" }),
      desc: hasQuiz
        ? tr(lang, { no: "Tror du at du kan bluesen din? Bevis det.", en: "Think you know your blues? Prove it.", pl: "Myślisz, że znasz się na bluesie? Udowodnij.", sv: "Tror du att du kan din blues? Bevisa det.", de: "Glaubst du, du kennst deinen Blues? Beweise es." })
        : tr(lang, { no: "Neste runde er på vei — kom innom igjen snart.", en: "Next round is on its way — check back soon.", pl: "Kolejna runda już w drodze — zajrzyj wkrótce.", sv: "Nästa omgång är på väg — titta förbi snart.", de: "Die nächste Runde ist unterwegs — schau bald wieder vorbei." }),
      to: "/quiz", muted: !hasQuiz,
      cta: hasQuiz
        ? tr(lang, { no: "Ta quizen", en: "Take the quiz", pl: "Rozwiąż quiz", sv: "Ta quizet", de: "Quiz starten" })
        : tr(lang, { no: "Kommer snart", en: "Coming soon", pl: "Już wkrótce", sv: "Kommer snart", de: "Demnächst" }) },
    { icon: BookOpen,
      title: tr(lang, { no: "Gjestebok", en: "Guestbook", pl: "Księga gości", sv: "Gästbok", de: "Gästebuch" }),
      desc: tr(lang, { no: "Sett ditt avtrykk. Fortell oss din blues-historie.", en: "Leave your mark. Tell us your blues story.", pl: "Zostaw swój ślad. Opowiedz nam swoją bluesową historię.", sv: "Sätt ditt avtryck. Berätta din blues-historia.", de: "Hinterlasse deine Spur. Erzähl uns deine Blues-Geschichte." }),
      to: "/guestbook" },
  ] as const;
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="font-display text-5xl gold-gradient-text">
          {tr(lang, { no: "Bli med", en: "Join In", pl: "Dołącz", sv: "Var med", de: "Mach mit" })}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {tr(lang, { no: "Mer enn en nettside — et fellesskap for bluesen.", en: "More than a website — a community for the blues.", pl: "Więcej niż strona internetowa — społeczność bluesa.", sv: "Mer än en webbplats — en gemenskap för bluesen.", de: "Mehr als eine Website — eine Gemeinschaft für den Blues." })}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => {
          const badge = "isNew" in it && it.isNew && (
            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-gold text-primary-foreground text-[10px] font-semibold tracking-wide uppercase">
              {tr(lang, { no: "Nyhet", en: "New", pl: "Nowość", sv: "Nytt", de: "Neu" })}
            </span>
          );
          const isMuted = "muted" in it && it.muted;
          const cardClass = `group relative bg-card/60 border border-border rounded-lg p-8 text-center transition block ${isMuted ? "opacity-60" : "hover:border-gold/60"}`;
          const ctaLabel = "cta" in it && it.cta ? it.cta : tr(lang, { no: "Gå", en: "Go", pl: "Dalej", sv: "Gå", de: "Los" });
          const inner = (
            <>
              {badge}
              <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition">
                <it.icon className="size-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
              <div className="mt-5 text-sm text-gold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                {ctaLabel} <ArrowRight className="size-4" />
              </div>
            </>
          );
          return "href" in it && it.href ? (
            <a key={it.title} href={it.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
              {inner}
            </a>
          ) : (
            <Link key={it.title} to={(it as { to: string }).to} className={cardClass}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}


function ThreeNames() {
  const { lang } = useI18n();
  const pioneers = useMemo(() => getPioneers(lang), [lang]);
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-xs tracking-[0.3em] text-destructive uppercase mb-3">
          {tr(lang, { no: "Start her", en: "Start Here", pl: "Zacznij tutaj", sv: "Börja här", de: "Hier anfangen" })}
        </div>
        <h2 className="font-display text-5xl">
          {tr(lang, { no: "Tre navn du må kjenne", en: "Three names you must know", pl: "Trzy nazwiska, które musisz znać", sv: "Tre namn du måste känna till", de: "Drei Namen, die du kennen musst" })}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {tr(lang, {
            no: "Uten dem — ingen Rolling Stones. Ingen Led Zeppelin. Ingen rockegitar slik vi kjenner den.",
            en: "Without them — no Rolling Stones. No Led Zeppelin. No rock guitar as we know it.", pl: "Bez nich — nie byłoby Rolling Stones. Nie byłoby Led Zeppelin. Nie byłoby gitary rockowej, jaką znamy.",
            sv: "Utan dem — inga Rolling Stones. Inget Led Zeppelin. Ingen rockgitarr som vi känner den.",
            de: "Ohne sie — keine Rolling Stones. Kein Led Zeppelin. Keine Rockgitarre, wie wir sie kennen.",
          })}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {pioneers.map((p) => (
          <article key={p.name} className="group bg-card/50 border border-border rounded-lg overflow-hidden hover:border-gold/50 transition">
            <div className="relative aspect-[4/5] overflow-hidden">
              <SafeImage src={p.img} alt={p.name} thumb loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-3 right-3 size-10 rounded-full bg-gold flex items-center justify-center">
                <p.icon className="size-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="p-6">
              <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{p.tag}</div>
              <h3 className="font-display text-2xl mb-3">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <Link to={artistDetailPath(lang, p.slug) as any} className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all">
                {tr(lang, { no: "Utforsk profil", en: "Explore profile", pl: "Przeglądaj profil", sv: "Utforska profil", de: "Profil entdecken" })} <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link to={artistsListPath(lang) as any} className="inline-flex items-center gap-2 px-7 py-3 rounded-md border border-gold/60 text-gold hover:bg-gold/10 transition">
          {tr(lang, { no: "Se alle artister", en: "See all artists", pl: "Zobacz wszystkich artystów", sv: "Se alla artister", de: "Alle Künstler sehen" })} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

const MERCH_SHOP_URL = "https://merch.slow-blues.com/en-nok";
const WEAR_THE_BLUES_PRODUCT_URL = "https://merch.slow-blues.com/products/wear-the-blues-tee";

function MerchDrop() {
  const { lang } = useI18n();
  return (
    <section id="support" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 items-stretch gap-0 rounded-2xl overflow-hidden border border-gold/25 bg-neutral-950 shadow-[0_0_80px_-40px_var(--color-gold)]">
        <a
          href={WEAR_THE_BLUES_PRODUCT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-neutral-900 block"
        >
          <img
            src="/images/merch/wear-the-blues-mockup.jpg"
            alt="Wear the Blues Tee — SlowBlues merch, front and back"
            loading="lazy"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </a>

        <div className="flex flex-col justify-center p-8 md:p-12 text-center md:text-left">
          <span className="inline-flex items-center gap-2 mb-4 mx-auto md:mx-0">
            <span className="text-[11px] tracking-[0.3em] uppercase text-gold">
              {tr(lang, {
                no: "Nyhet i butikken",
                en: "New in the shop",
                sv: "Nytt i butiken",
                de: "Neu im Shop",
                pl: "Nowość w sklepie",
              })}
            </span>
          </span>

          <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
            Support the blues. Wear the blues.
          </h2>
          <div className="mt-2 text-sm tracking-[0.2em] uppercase text-gold/90">
            Wear the Blues
          </div>

          <p className="mt-5 text-neutral-300 leading-relaxed max-w-md mx-auto md:mx-0">
            {tr(lang, {
              no: "Ikke logo-merch. Et plagg for folk som faktisk hører på røttene. Front: The slow, soulful roots. Bak: Slow-Blues.com — Global Blues Encyclopedia. Hvert kjøp holder leksikonet i live.",
              en: "Not logo merch. A shirt for people who actually listen to the roots. Front: The slow, soulful roots. Back: Slow-Blues.com — Global Blues Encyclopedia. Every purchase keeps this archive alive.",
              sv: "Inte logomerch. En tröja för dem som faktiskt lyssnar på rötterna. Fram: The slow, soulful roots. Bak: Slow-Blues.com — Global Blues Encyclopedia. Varje köp håller arkivet vid liv.",
              de: "Kein Logo-Merch. Ein Shirt für Leute, die den Wurzeln wirklich zuhören. Vorne: The slow, soulful roots. Hinten: Slow-Blues.com — Global Blues Encyclopedia. Jeder Kauf hält dieses Archiv am Leben.",
              pl: "To nie merch z logo. Koszulka dla tych, którzy naprawdę słuchają korzeni. Przód: The slow, soulful roots. Tył: Slow-Blues.com — Global Blues Encyclopedia. Każdy zakup utrzymuje to archiwum przy życiu.",
            })}
          </p>

          <div className="mt-8 flex flex-col items-center md:items-start gap-3">
            <a
              href={WEAR_THE_BLUES_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 transition"
            >
              <ShoppingBag className="size-4" />
              {tr(lang, { no: "Kjøp t-skjorten", en: "Buy the shirt", sv: "Köp t-shirten", de: "Shirt kaufen", pl: "Kup koszulkę" })}
            </a>
            <a
              href={MERCH_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 underline underline-offset-4 decoration-neutral-600 hover:text-gold hover:decoration-gold/50 transition"
            >
              {tr(lang, { no: "Se hele butikken", en: "See the full shop", sv: "Se hela butiken", de: "Zum ganzen Shop", pl: "Zobacz cały sklep" })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const { lang } = useI18n();
  const timeline = useMemo(() => getTimeline(lang), [lang]);
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
          {tr(lang, { no: "Tidslinjen", en: "The Timeline", pl: "Oś czasu", sv: "Tidslinjen", de: "Die Zeitlinie" })}
        </div>
        <h2 className="font-display text-5xl md:text-6xl">
          {tr(lang, {
            no: "Fra bomullsmarker til elektriske klubber",
            en: "From cotton fields to electric clubs", pl: "Od pól bawełny po elektryczne kluby",
            sv: "Från bomullsfält till elektriska klubbar",
            de: "Von Baumwollfeldern zu elektrischen Clubs",
          })}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {tr(lang, {
            no: "Hundre år med slit, migrasjon og forsterkning. Seks øyeblikk som forandret alt.",
            en: "A hundred years of toil, migration and amplification. Six moments that changed everything.", pl: "Sto lat trudu, migracji i nagłośnienia. Sześć momentów, które zmieniły wszystko.",
            sv: "Hundra år av slit, migration och förstärkning. Sex ögonblick som förändrade allt.",
            de: "Hundert Jahre Mühsal, Migration und Verstärkung. Sechs Momente, die alles veränderten.",
          })}
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent -translate-x-1/2" />
        <div className="space-y-12">
          {timeline.map((t, i) => (
            <div key={t.year} className={`relative grid md:grid-cols-2 gap-8 ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`}>
              <div className={`bg-card/60 border border-border rounded-lg p-6 md:[direction:ltr] ${i % 2 === 0 ? "md:text-right" : ""}`}>
                <div className="font-display text-3xl text-gold mb-2">{t.year}</div>
                <h3 className="font-display text-xl mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              </div>
              <div />
              <div className="absolute left-1/2 top-8 size-3 rounded-full bg-gold ring-4 ring-background -translate-x-1/2" />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-16">
        <Link to="/history" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">
          {tr(lang, { no: "Utforsk hele tidslinjen", en: "Explore the complete timeline", pl: "Zobacz pełną oś czasu", sv: "Utforska hela tidslinjen", de: "Die ganze Zeitlinie entdecken" })} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Voices({ voices: voiceRows }: { voices: VoiceRow[] }) {
  const { lang } = useI18n();
  const voices = useMemo(() => getVoices(lang, voiceRows), [lang, voiceRows]);
  return (
    <section id="voices" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
          {tr(lang, { no: "Originalene", en: "The Originals", pl: "Oryginały", sv: "Originalen", de: "Die Originale" })}
        </div>
        <h2 className="font-display text-5xl">
          {tr(lang, { no: "Stemmer fra deltaet", en: "Voices from the Delta", pl: "Głosy z Delty", sv: "Röster från deltat", de: "Stimmen aus dem Delta" })}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          {tr(lang, {
            no: "De sang om det de visste — hardt arbeid, tapt kjærlighet, veien videre. Innspillingene treffer deg fortsatt rett i brystet.",
            en: "They sang about what they knew — hard work, lost love, the road forward. The recordings still hit you right in the chest.", pl: "Śpiewali o tym, co znali — ciężka praca, utracona miłość, droga naprzód. Nagrania wciąż trafiają prosto w serce.",
            sv: "De sjöng om det de kände — hårt arbete, förlorad kärlek, vägen framåt. Inspelningarna träffar dig fortfarande rakt i bröstet.",
            de: "Sie sangen über das, was sie kannten — harte Arbeit, verlorene Liebe, den Weg nach vorn. Die Aufnahmen treffen dich noch immer mitten ins Herz.",
          })}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {voices.map((v) => (
          <Link
            key={v.name}
            to={artistDetailPath(lang, v.slug) as any}
            className="group bg-card/40 border border-border rounded-lg overflow-hidden hover:border-gold/50 transition block"
          >
            <div className={`relative aspect-[3/4] bg-gradient-to-br ${v.color}`}>
              <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-background/70 backdrop-blur text-gold">{v.tag}</span>
              <SafeImage src={v.img} alt={v.name} thumb loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
              {v.credit && (
                <span
                  title={`Photo: ${v.credit}`}
                  aria-label={`Photo: ${v.credit}`}
                  className="absolute bottom-1.5 right-1.5 size-5 rounded-full bg-black/60 text-gold text-[11px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  i
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl">{v.name}</h3>
              <div className="text-sm text-muted-foreground mb-2">{v.years}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-gold group-hover:gap-2 transition-all">
                {tr(lang, { no: "Utforsk profil", en: "Explore profile", pl: "Przeglądaj profil", sv: "Utforska profil", de: "Profil entdecken" })} <ArrowRight className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DeltaVsChicago() {
  const { lang } = useI18n();
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
          {tr(lang, {
            no: "To lydlandskap, én sjel",
            en: "Two Soundscapes, One Soul", pl: "Dwa pejzaże dźwiękowe, jedna dusza",
            sv: "Två ljudlandskap, en själ",
            de: "Zwei Klangwelten, eine Seele",
          })}
        </div>
        <h2 className="font-display text-5xl md:text-6xl">
          {tr(lang, { no: "Delta vs Chicago", en: "Delta vs Chicago", pl: "Delta vs Chicago", sv: "Delta vs Chicago", de: "Delta vs Chicago" })}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          {tr(lang, {
            no: "Én mann med en gitar på en veranda i Clarksdale. Et fullt band som rister veggene hos Chess Records. Samme smerte, ulik spenning.",
            en: "One man and a guitar on a porch in Clarksdale. A full band shaking the walls at Chess Records. Same pain, different voltage.", pl: "Jeden człowiek i gitara na werandzie w Clarksdale. Cały zespół trzęsący murami w Chess Records. Ten sam ból, inne napięcie.",
            sv: "En man med en gitarr på en veranda i Clarksdale. Ett helt band som skakar väggarna hos Chess Records. Samma smärta, olika spänning.",
            de: "Ein Mann mit einer Gitarre auf einer Veranda in Clarksdale. Eine ganze Band, die die Wände bei Chess Records erschüttert. Gleicher Schmerz, andere Spannung.",
          })}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Column
          tone="from-amber-900/30 to-stone-900/40"
          icon={Music}
          title={tr(lang, { no: "Delta-blues", en: "Delta Blues", pl: "Delta Blues", sv: "Delta-blues", de: "Delta-Blues" })}
          sub={tr(lang, { no: "1890-tallet — 1940-tallet", en: "1890s — 1940s", pl: "Lata 90. XIX w. – lata 40. XX w.", sv: "1890-talet — 1940-talet", de: "1890er — 1940er" })}
          points={[
            tr(lang, { no: "Akustisk gitar med slide / bottleneck", en: "Acoustic guitar with slide / bottleneck", pl: "Gitara akustyczna ze slide'em / bottleneckiem", sv: "Akustisk gitarr med slide / bottleneck", de: "Akustische Gitarre mit Slide / Bottleneck" }),
            tr(lang, { no: "Soloartister eller små grupper", en: "Solo artists or small groups", pl: "Artyści solowi lub małe grupy", sv: "Soloartister eller små grupper", de: "Soloartisten oder kleine Gruppen" }),
            tr(lang, { no: "Rå, emosjonell vokal", en: "Raw, emotional vocals", pl: "Surowy, emocjonalny wokal", sv: "Rå, känslomässig sång", de: "Rohe, emotionale Vocals" }),
            tr(lang, { no: "Opphav i rurale Mississippi", en: "Rural Mississippi origin", pl: "Pochodzenie z wiejskiego Mississippi", sv: "Ursprung på Mississippis landsbygd", de: "Ursprung im ländlichen Mississippi" }),
            tr(lang, { no: "Påvirket av arbeidssanger og field hollers", en: "Influenced by work songs and field hollers", pl: "Pod wpływem pieśni pracy i okrzyków polowych", sv: "Påverkad av arbetssånger och field hollers", de: "Beeinflusst von Arbeitsliedern und Field Hollers" }),
          ]}
          quote={tr(lang, {
            no: "«Delta-blues handlet om stemmen og gitaren — ingenting mellom deg og smerten.»",
            en: "«Delta blues was about the voice and the guitar — nothing between you and the pain.»", pl: "«Delta blues opierało się na głosie i gitarze — nic nie oddzielało cię od cierpienia.»",
            sv: "«Delta-blues handlade om rösten och gitarren — ingenting mellan dig och smärtan.»",
            de: "«Delta-Blues war Stimme und Gitarre — nichts zwischen dir und dem Schmerz.»",
          })}
        />
        <Column
          tone="from-red-900/30 to-stone-900/40"
          icon={Radio}
          title={tr(lang, { no: "Chicago-blues", en: "Chicago Blues", pl: "Chicago Blues", sv: "Chicago-blues", de: "Chicago-Blues" })}
          sub={tr(lang, { no: "1940-tallet — i dag", en: "1940s — today", pl: "Lata 40. – dziś", sv: "1940-talet — idag", de: "1940er — heute" })}
          points={[
            tr(lang, { no: "Elektrisk gitar med forsterkning", en: "Electric guitar with amplification", pl: "Gitara elektryczna ze wzmocnieniem", sv: "Elgitarr med förstärkning", de: "E-Gitarre mit Verstärkung" }),
            tr(lang, { no: "Fullt band: bass, trommer, piano, munnspill", en: "Full band: bass, drums, piano, harmonica", pl: "Pełny zespół: bas, perkusja, fortepian, harmonijka ustna", sv: "Helt band: bas, trummor, piano, munspel", de: "Komplette Band: Bass, Schlagzeug, Klavier, Mundharmonika" }),
            tr(lang, { no: "Urban nattklubblyd", en: "Urban nightclub sound", pl: "Brzmienie miejskiego nocnego klubu", sv: "Urbant nattklubbsljud", de: "Urbaner Nachtklub-Sound" }),
            tr(lang, { no: "Chess Records og Maxwell Street", en: "Chess Records and Maxwell Street", pl: "Chess Records i Maxwell Street", sv: "Chess Records och Maxwell Street", de: "Chess Records und Maxwell Street" }),
            tr(lang, { no: "Grunnlaget for rock and roll", en: "The foundation of rock and roll", pl: "Fundament rock and rolla", sv: "Grunden för rock and roll", de: "Das Fundament des Rock 'n' Roll" }),
          ]}
          quote={tr(lang, {
            no: "«Da vi kom til Chicago og koblet til strøm, ble bluesen høyere — og verden begynte å lytte.»",
            en: "«When we got to Chicago and plugged in, the blues got louder — and the world started listening.»", pl: "«Kiedy dotarliśmy do Chicago i podłączyliśmy sprzęt, blues stał się głośniejszy — i świat zaczął słuchać.»",
            sv: "«När vi kom till Chicago och kopplade in, blev bluesen högre — och världen började lyssna.»",
            de: "«Als wir in Chicago ankamen und einsteckten, wurde der Blues lauter — und die Welt begann zuzuhören.»",
          })}
        />
      </div>
    </section>
  );
}

function Column({ tone, icon: Icon, title, sub, points, quote }: any) {
  return (
    <div className={`relative bg-gradient-to-br ${tone} border border-border rounded-xl p-8`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="size-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
          <Icon className="size-6 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-3xl text-gold">{title}</h3>
          <div className="text-sm text-muted-foreground">{sub}</div>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {points.map((p: string) => (
          <li key={p} className="flex items-start gap-3 text-sm">
            <span className="mt-1.5 size-1.5 rounded-full bg-gold shrink-0" />
            <span className="text-foreground/85">{p}</span>
          </li>
        ))}
      </ul>
      <blockquote className="border-l-2 border-gold/60 pl-4 italic text-sm text-foreground/75 font-display">
        {quote}
      </blockquote>
    </div>
  );
}
