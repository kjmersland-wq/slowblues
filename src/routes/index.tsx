import { createFileRoute, Link } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getNewsTicker, type TickerItem } from "@/lib/newsfeed.functions";
import { blogArticles } from "@/data/blogArticles";
import {
  ShoppingBag, HelpCircle, BookOpen, Music, Radio, Mic,
  ChevronDown, ChevronLeft, ChevronRight, Play, ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IMG } from "@/data/images";
import { useI18n, tr, type Lang } from "@/i18n";
import heroJukeImg from "@/assets/hero-juke.jpg";
import heroDeltaImg from "@/assets/hero-delta.jpg";
import heroGuitarImg from "@/assets/hero-guitar.jpg";
import logoSB from "@/assets/logo-slowblues.png";

const heroJuke = heroJukeImg;
const heroCotton = heroDeltaImg;
const heroGuitar = heroGuitarImg;
const robertJohnson = IMG.robertJohnson;
const muddyWaters = IMG.muddyWaters;
const sonHouse = IMG.sonHouse;

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SlowBlues — 330+ Blues Artists, History & Reviews" },
      { name: "description", content: "A timeless tribute to the raw soul of Delta & Chicago Blues. 330+ artist profiles, reviews, festivals and live news — the real roots of modern music." },
      { property: "og:title", content: "SlowBlues — 330+ Blues Artists, History & Reviews" },
      { property: "og:description", content: "A timeless tribute to the raw soul of Delta & Chicago Blues — 330+ artist profiles, reviews, festivals and live news." },
      { property: "og:url", content: "https://www.slowblues.no/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://www.slowblues.no/" },
      { rel: "preload", as: "image", href: heroJukeImg, fetchpriority: "high" } as any,
    ],
  }),
});

const FALLBACK_TICKER: TickerItem[] = [
  { id: "fb-1", kind: "editorial", label: "EDITORIAL", text: "SlowBlues — a living archive of 330+ blues artists, reviews & live recordings.", href: "/artists", timestamp: "2026-01-01T00:00:02.000Z", priority: 1 },
  { id: "fb-2", kind: "editorial", label: "EXPLORE", text: "Dive into the full artist archive — from Delta to Chicago to Scandinavia.", href: "/artists", timestamp: "2026-01-01T00:00:01.000Z", priority: 1 },
];

function getHeroSlides(lang: Lang) {
  return [
    {
      img: heroJuke,
      eyebrow: tr(lang, { no: "De langsomme, sjelfulle røttene", en: "The Slow, Soulful Roots", sv: "De långsamma, själfulla rötterna", de: "Die langsamen, seelenvollen Wurzeln" }),
      title: "SLOWBLUES",
      titleAccent: tr(lang, { no: "Der bluesen begynte", en: "Where the blues began", sv: "Där bluesen började", de: "Wo der Blues begann" }),
      quote: tr(lang, {
        no: "«Bluesen er røttene, alt annet er fruktene.»",
        en: "«The blues are the roots, everything else is the fruits.»",
        sv: "«Bluesen är rötterna, allt annat är frukterna.»",
        de: "«Der Blues ist die Wurzel, alles andere sind die Früchte.»",
      }),
      attr: "— Willie Dixon",
      body: tr(lang, {
        no: "330+ artistprofiler. Tre inn i Chicago. Historien, pionerene og lyden som la grunnlaget for rock, jazz og alt som kom etter.",
        en: "330+ artist profiles. Step into Chicago. The history, pioneers and sound that laid the foundation for rock, jazz and everything that came after.",
        sv: "330+ artistprofiler. Stig in i Chicago. Historien, pionjärerna och ljudet som lade grunden för rock, jazz och allt som kom efter.",
        de: "330+ Künstlerprofile. Tritt ein in Chicago. Die Geschichte, Pioniere und der Klang, der den Grundstein für Rock, Jazz und alles Spätere legte.",
      }),
      showButtons: true,
    },
    {
      img: heroCotton,
      eyebrow: tr(lang, { no: "Delta & Chicago", en: "Delta & Chicago", sv: "Delta & Chicago", de: "Delta & Chicago" }),
      title: tr(lang, { no: "EN TIDLØS HYLLEST", en: "A TIMELESS TRIBUTE", sv: "EN TIDLÖS HYLLNING", de: "EINE ZEITLOSE HOMMAGE" }),
      titleAccent: tr(lang, {
        no: "til den rå sjelen i Delta- og Chicago-bluesen",
        en: "to the raw soul of Delta & Chicago Blues",
        sv: "till den råa själen i Delta- och Chicago-bluesen",
        de: "an die rohe Seele des Delta- und Chicago-Blues",
      }),
      quote: tr(lang, {
        no: "Fra bomullsmarkene til verdens scener — de virkelige røttene til moderne musikk.",
        en: "From the cotton fields to the global stage — the real roots of modern music.",
        sv: "Från bomullsfälten till världens scener — de verkliga rötterna till modern musik.",
        de: "Von den Baumwollfeldern auf die Bühnen der Welt — die echten Wurzeln moderner Musik.",
      }),
      attr: "",
      body: "",
      showButtons: false,
    },
    {
      img: heroGuitar,
      eyebrow: tr(lang, { no: "Slide & resonator", en: "Slide & Resonator", sv: "Slide & resonator", de: "Slide & Resonator" }),
      title: tr(lang, { no: "LYDEN AV SJEL", en: "THE SOUND OF SOUL", sv: "LJUDET AV SJÄL", de: "DER KLANG DER SEELE" }),
      titleAccent: tr(lang, {
        no: "stålstrenger, messingkoner, langsomme hjerteslag",
        en: "steel strings, brass cones, slow heartbeats",
        sv: "stålsträngar, mässingkoner, långsamma hjärtslag",
        de: "Stahlsaiten, Messingkonen, langsame Herzschläge",
      }),
      quote: tr(lang, {
        no: "«Når du spiller blues, forteller du sannheten om livet.»",
        en: "«When you play the blues, you tell the truth about life.»",
        sv: "«När du spelar blues berättar du sanningen om livet.»",
        de: "«Wenn du Blues spielst, erzählst du die Wahrheit über das Leben.»",
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
      tag: tr(lang, { no: "Korsveis-legenden", en: "The Crossroads Legend", sv: "Korsvägslegenden", de: "Die Crossroads-Legende" }),
      name: "Robert Johnson",
      desc: tr(lang, {
        no: "Kun 29 innspillinger, men han definerte Delta-blueslyden og inspirerte generasjoner av rockemusikere.",
        en: "Only 29 recordings, but he defined the Delta blues sound and inspired generations of rock musicians.",
        sv: "Bara 29 inspelningar, men han definierade Delta-bluesens ljud och inspirerade generationer av rockmusiker.",
        de: "Nur 29 Aufnahmen, doch er definierte den Delta-Blues-Sound und inspirierte Generationen von Rockmusikern.",
      }),
    },
    {
      img: muddyWaters, icon: Radio,
      tag: tr(lang, { no: "Chicago-bluesens far", en: "Father of Chicago Blues", sv: "Chicago-bluesens fader", de: "Vater des Chicago-Blues" }),
      name: "Muddy Waters",
      desc: tr(lang, {
        no: "Elektrifiserte Delta-lyden og ble broen mellom akustiske røtter og moderne bluesrock.",
        en: "Electrified the Delta sound and became the bridge between acoustic roots and modern blues-rock.",
        sv: "Elektrifierade Delta-ljudet och blev bron mellan akustiska rötter och modern bluesrock.",
        de: "Elektrifizierte den Delta-Sound und wurde zur Brücke zwischen akustischen Wurzeln und modernem Blues-Rock.",
      }),
    },
    {
      img: sonHouse, icon: Mic,
      tag: tr(lang, { no: "Predikantens blues", en: "The Preacher's Blues", sv: "Predikantens blues", de: "Der Blues des Predigers" }),
      name: "Son House",
      desc: tr(lang, {
        no: "Rå, emosjonell slidegitar og åndelig intensitet som direkte påvirket Robert Johnson.",
        en: "Raw, emotional slide guitar and spiritual intensity that directly influenced Robert Johnson.",
        sv: "Rå, känslomässig slidegitarr och andlig intensitet som direkt påverkade Robert Johnson.",
        de: "Rohe, emotionale Slide-Gitarre und spirituelle Intensität, die Robert Johnson direkt beeinflussten.",
      }),
    },
  ];
}

function getTimeline(lang: Lang) {
  return [
    { year: "1890",
      title: tr(lang, { no: "Bluesen tar form", en: "The Blues Takes Shape", sv: "Bluesen tar form", de: "Der Blues nimmt Gestalt an" }),
      body: tr(lang, {
        no: "Bluesformen begynner å krystallisere seg i Mississippi-deltaet. Arbeidssanger, field hollers, spirituals og afrikanske musikktradisjoner smelter sammen.",
        en: "The blues form begins to crystallize in the Mississippi Delta region. Work songs, field hollers, spirituals and African musical traditions blend into one.",
        sv: "Bluesformen börjar kristalliseras i Mississippi-deltat. Arbetssånger, field hollers, spirituals och afrikanska musiktraditioner smälter samman.",
        de: "Die Blues-Form beginnt sich im Mississippi-Delta zu formen. Arbeitslieder, Field Hollers, Spirituals und afrikanische Musiktraditionen verschmelzen.",
      })},
    { year: "1920",
      title: tr(lang, { no: "Første blues-innspilling", en: "First Blues Recording", sv: "Första blues-inspelningen", de: "Erste Blues-Aufnahme" }),
      body: tr(lang, {
        no: "Mamie Smith spiller inn 'Crazy Blues' for Okeh Records — den første blues-innspillingen av en afroamerikansk artist. Den selger over 75 000 eksemplarer på en måned.",
        en: "Mamie Smith records 'Crazy Blues' for Okeh Records — the first blues recording by an African American artist. It sells over 75,000 copies in the first month.",
        sv: "Mamie Smith spelar in 'Crazy Blues' för Okeh Records — den första blues-inspelningen av en afroamerikansk artist. Den säljer över 75 000 exemplar på en månad.",
        de: "Mamie Smith nimmt 'Crazy Blues' für Okeh Records auf — die erste Blues-Aufnahme einer afroamerikanischen Künstlerin. Über 75.000 Exemplare im ersten Monat.",
      })},
    { year: "1936",
      title: tr(lang, { no: "Robert Johnsons innspillinger", en: "Robert Johnson Sessions", sv: "Robert Johnson-sessionerna", de: "Robert-Johnson-Sessions" }),
      body: tr(lang, {
        no: "Robert Johnson spiller inn sine legendariske sesjoner i San Antonio, Texas på Gunter Hotel. Disse 29 sangene skulle bli de mest innflytelsesrike blues-innspillingene noensinne.",
        en: "Robert Johnson records his legendary sessions in San Antonio, Texas at the Gunter Hotel. These 29 songs would become the most influential blues recordings of all time.",
        sv: "Robert Johnson spelar in sina legendariska sessioner i San Antonio, Texas på Gunter Hotel. Dessa 29 låtar skulle bli tidernas mest inflytelserika blues-inspelningar.",
        de: "Robert Johnson nimmt seine legendären Sessions im Gunter Hotel in San Antonio, Texas auf. Diese 29 Songs werden zu den einflussreichsten Blues-Aufnahmen aller Zeiten.",
      })},
    { year: "1947",
      title: tr(lang, { no: "Chess Records grunnlegges", en: "Chess Records Founded", sv: "Chess Records grundas", de: "Chess Records gegründet" }),
      body: tr(lang, {
        no: "Leonard og Phil Chess etablerer Chess Records i Chicago (opprinnelig Aristocrat). Selskapet skulle bli det viktigste blues-plateselskapet i historien.",
        en: "Leonard and Phil Chess establish Chess Records in Chicago (originally Aristocrat). The label would become the most important blues record company in history.",
        sv: "Leonard och Phil Chess etablerar Chess Records i Chicago (ursprungligen Aristocrat). Bolaget skulle bli historiens viktigaste blues-skivbolag.",
        de: "Leonard und Phil Chess gründen Chess Records in Chicago (ursprünglich Aristocrat). Das Label wird zum wichtigsten Blues-Label der Geschichte.",
      })},
    { year: "1958",
      title: tr(lang, { no: "Muddy Waters turnerer Storbritannia", en: "Muddy Waters Tours Britain", sv: "Muddy Waters turnerar i Storbritannien", de: "Muddy Waters tourt durch Großbritannien" }),
      body: tr(lang, {
        no: "Muddy Waters' elektriske opptredener sjokkerer britisk publikum som ventet akustisk folk-blues. Turen tenner den britiske blues-bølgen.",
        en: "Muddy Waters' electric performances shock British audiences expecting acoustic folk-blues. This tour ignites the British blues boom and inspires a generation.",
        sv: "Muddy Waters elektriska framträdanden chockar brittisk publik som väntat sig akustisk folk-blues. Turnén tänder den brittiska blues-boomen.",
        de: "Muddy Waters' elektrische Auftritte schockieren das britische Publikum, das akustischen Folk-Blues erwartete. Die Tour entfacht den britischen Blues-Boom.",
      })},
    { year: "1962",
      title: tr(lang, { no: "Rolling Stones dannes", en: "Rolling Stones Formed", sv: "Rolling Stones bildas", de: "Rolling Stones gegründet" }),
      body: tr(lang, {
        no: "The Rolling Stones dannes i London, oppkalt etter Muddy Waters-sangen. De og andre britiske band ville snart bringe bluesen ut til et globalt rockepublikum.",
        en: "The Rolling Stones form in London, named after Muddy Waters' song. They and other British bands would soon bring the blues to a worldwide rock audience.",
        sv: "The Rolling Stones bildas i London, uppkallat efter Muddy Waters låt. De och andra brittiska band skulle snart föra ut bluesen till en global rockpublik.",
        de: "Die Rolling Stones formieren sich in London, benannt nach Muddy Waters' Song. Sie und andere britische Bands bringen den Blues bald zum weltweiten Rockpublikum.",
      })},
  ];
}

function getVoices(lang: Lang) {
  const tag = tr(lang, { no: "Chicago", en: "Chicago", sv: "Chicago", de: "Chicago" });
  return [
    { tag, name: "Lonnie Johnson", years: tr(lang, { no: "1920-tallet–1970", en: "1920s–1970", sv: "1920-talet–1970", de: "1920er–1970" }),
      desc: tr(lang, {
        no: "Lonnie Johnson var en av de mest innflytelsesrike og nyskapende gitaristene i …",
        en: "Lonnie Johnson was one of the most influential and innovative guitarists in...",
        sv: "Lonnie Johnson var en av de mest inflytelserika och nyskapande gitarristerna i …",
        de: "Lonnie Johnson war einer der einflussreichsten und innovativsten Gitarristen …",
      }), color: "from-amber-900/60 to-stone-900" },
    { tag, name: "King Biscuit Boy", years: "1961–2003",
      desc: tr(lang, {
        no: "King Biscuit Boy, født Richard Alfred Newell i Hamilton, Ontario, var en av Canadas mest …",
        en: "King Biscuit Boy, born Richard Alfred Newell in Hamilton, Ontario, was one of Canada's most...",
        sv: "King Biscuit Boy, född Richard Alfred Newell i Hamilton, Ontario, var en av Kanadas mest …",
        de: "King Biscuit Boy, geboren als Richard Alfred Newell in Hamilton, Ontario, war einer der bekanntesten kanadischen …",
      }), color: "from-stone-800 to-stone-900" },
    { tag, name: "Sue Foley", years: tr(lang, { no: "1988–i dag", en: "1988–present", sv: "1988–idag", de: "1988–heute" }),
      desc: tr(lang, {
        no: "Sue Foley er en kanadiskfødt bluesgitarist, vokalist og låtskriver som har vært en …",
        en: "Sue Foley is a Canadian-born blues guitarist, vocalist and songwriter who has been a...",
        sv: "Sue Foley är en kanadensiskfödd bluesgitarrist, vokalist och låtskrivare som varit en …",
        de: "Sue Foley ist eine in Kanada geborene Blues-Gitarristin, Sängerin und Songwriterin, die seit …",
      }), color: "from-rose-900/60 to-stone-900" },
    { tag, name: "Colin James", years: tr(lang, { no: "1985–i dag", en: "1985–present", sv: "1985–idag", de: "1985–heute" }),
      desc: tr(lang, {
        no: "Colin James er en av Canadas mest suksessrike og allsidige blues-rock-artister, med en karriere …",
        en: "Colin James is one of Canada's most successful and versatile blues-rock artists, with a career...",
        sv: "Colin James är en av Kanadas mest framgångsrika och mångsidiga blues-rock-artister, med en karriär …",
        de: "Colin James ist einer der erfolgreichsten und vielseitigsten Blues-Rock-Künstler Kanadas, mit einer Karriere …",
      }), color: "from-stone-800 to-stone-900" },
  ];
}

function Home() {
  const { lang } = useI18n();
  const heroSlides = useMemo(() => getHeroSlides(lang), [lang]);
  const [slide, setSlide] = useState(0);
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
            className={`${i === slide ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"} transition-opacity duration-1000`}
          >
            <HeroSlide {...s} active={i === slide} isPrimary={i === 0} lang={lang} />
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
      <Join />
      <ThreeNames />
      <SupportBanner />
      <Timeline />
      <Voices />
      <DeltaVsChicago />
      <SiteFooter />
    </div>
  );
}

/* ───────── components ───────── */

function HeroSlide({ img, eyebrow, title, titleAccent, quote, attr, body, showButtons, credit, active, isPrimary, lang }: any) {
  const HeadingTag: any = isPrimary ? "h1" : "h2";
  const tributeJsx = (
    <>
      {tr(lang, {
        no: "En tidløs hyllest til den rå sjelen i ",
        en: "A timeless tribute to the raw soul of ",
        sv: "En tidlös hyllning till den råa själen i ",
        de: "Eine zeitlose Hommage an die rohe Seele des ",
      })}
      <span className="text-gold">{tr(lang, { no: "Delta- og Chicago-bluesen", en: "Delta & Chicago Blues", sv: "Delta- och Chicago-bluesen", de: "Delta- und Chicago-Blues" })}</span>
    </>
  );
  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <img
        src={img}
        alt=""
        loading={active ? "eager" : "lazy"}
        {...(isPrimary ? { fetchPriority: "high" as const } : {})}
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover"
      />
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
              alt="SlowBlues — Global Blues Encyclopedia"
              className="size-56 md:size-64 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]"
            />
          </div>
        )}
        <HeadingTag className="font-display font-black tracking-tight text-6xl md:text-8xl gold-gradient-text leading-none">
          {showButtons ? title : tributeJsx}
        </HeadingTag>
        {showButtons && (
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
              {tr(lang, { no: "Utforsk 330+ artister", en: "Explore 330+ artists", sv: "Utforska 330+ artister", de: "330+ Künstler entdecken" })}
            </a>
            <a href="#support" className="px-7 py-3.5 rounded-md border border-gold/60 text-foreground hover:bg-gold/10 transition flex items-center gap-2">
              <ShoppingBag className="size-4" /> {tr(lang, { no: "Kjøp blues-merch", en: "Shop Blues Merch", sv: "Köp blues-merch", de: "Blues-Merch kaufen" })}
            </a>
            <a href="#" className="px-7 py-3.5 rounded-md border border-gold/40 text-foreground hover:bg-gold/10 transition flex items-center gap-2">
              <Play className="size-4" /> {tr(lang, { no: "Lytt", en: "Listen", sv: "Lyssna", de: "Hören" })}
            </a>
          </div>
        )}
        {credit && (
          <div className="absolute bottom-10 left-8 text-xs text-muted-foreground/70 bg-background/40 backdrop-blur px-3 py-2 rounded">
            {credit}
          </div>
        )}
        <div className="mt-16 flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-muted-foreground">
          {tr(lang, { no: "RULL", en: "SCROLL", sv: "RULLA", de: "SCROLLEN" })}
          <ChevronDown className="size-4 animate-bounce-slow text-gold" />
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  const fetchTicker = useServerFn(getNewsTicker);
  const { data } = useQuery({
    queryKey: ["news-ticker"],
    queryFn: () => fetchTicker(),
    staleTime: 30 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const blogItems: TickerItem[] = useMemo(() => {
    return [...blogArticles]
      .sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""))
      .slice(0, 6)
      .map((b) => ({
        id: `blog-${b.id}`,
        kind: "blog" as const,
        label: "BLOG",
        text: b.titleEn,
        href: `/blog/${b.id}`,
        timestamp: b.publishedDate ?? new Date().toISOString(),
        priority: 50,
      }));
  }, []);

  const merged: TickerItem[] = useMemo(() => {
    const base = data?.items?.length ? data.items : FALLBACK_TICKER;
    const all = [...base, ...blogItems];
    const seen = new Set<string>();
    const unique = all.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
    unique.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (b.timestamp ?? "").localeCompare(a.timestamp ?? "");
    });
    return unique.slice(0, 36);
  }, [data, blogItems]);

  const loop = [...merged, ...merged];

  const accent = (k: TickerItem["kind"]) => {
    switch (k) {
      case "review": return "text-gold";
      case "youtube": return "text-red-400";
      case "concert": return "text-amber-300";
      case "artist": return "text-blue-300";
      case "blog": return "text-emerald-300";
      default: return "text-gold";
    }
  };

  return (
    <div
      className="relative border-y border-border bg-card/40 overflow-hidden ticker-mask"
      aria-label="Live blues news ticker"
    >
      <div className="flex gap-10 py-3 animate-ticker whitespace-nowrap will-change-transform">
        {loop.map((t, i) => (
          <a
            key={`${t.id}-${i}`}
            href={t.href}
            className="text-sm text-foreground/85 hover:text-foreground inline-flex items-center gap-2 group"
          >
            <span className={`${accent(t.kind)} font-mono text-[10px] tracking-widest uppercase`}>
              {t.flag ? `${t.flag} ` : ""}{t.label}
            </span>
            <span className="opacity-40">›</span>
            <span className="group-hover:underline underline-offset-4 decoration-gold/60">
              {t.text}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Join() {
  const { lang } = useI18n();
  const items = [
    { icon: ShoppingBag,
      title: tr(lang, { no: "Blues-merch", en: "Blues Merch", sv: "Blues-merch", de: "Blues-Merch" }),
      desc: tr(lang, { no: "T-skjorter, plakater og vinyl for den ekte bluesfanen.", en: "T-shirts, posters and vinyl for the true blues fan.", sv: "T-shirts, posters och vinyl för den äkta bluesfantasten.", de: "T-Shirts, Poster und Vinyl für den echten Blues-Fan." }),
      to: "/about/merch" },
    { icon: HelpCircle,
      title: tr(lang, { no: "Blues-quiz", en: "Blues Quiz", sv: "Blues-quiz", de: "Blues-Quiz" }),
      desc: tr(lang, { no: "Tror du at du kan bluesen din? Bevis det.", en: "Think you know your blues? Prove it.", sv: "Tror du att du kan din blues? Bevisa det.", de: "Glaubst du, du kennst deinen Blues? Beweise es." }),
      to: "/quiz" },
    { icon: BookOpen,
      title: tr(lang, { no: "Gjestebok", en: "Guestbook", sv: "Gästbok", de: "Gästebuch" }),
      desc: tr(lang, { no: "Sett ditt avtrykk. Fortell oss din blues-historie.", en: "Leave your mark. Tell us your blues story.", sv: "Sätt ditt avtryck. Berätta din blues-historia.", de: "Hinterlasse deine Spur. Erzähl uns deine Blues-Geschichte." }),
      to: "/guestbook" },
  ] as const;
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="font-display text-5xl gold-gradient-text">
          {tr(lang, { no: "Bli med", en: "Join In", sv: "Var med", de: "Mach mit" })}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {tr(lang, { no: "Mer enn en nettside — et fellesskap for bluesen.", en: "More than a website — a community for the blues.", sv: "Mer än en webbplats — en gemenskap för bluesen.", de: "Mehr als eine Website — eine Gemeinschaft für den Blues." })}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <Link
            key={it.title}
            to={it.to}
            className="group bg-card/60 border border-border rounded-lg p-8 text-center hover:border-gold/60 transition block"
          >
            <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition">
              <it.icon className="size-6 text-gold" />
            </div>
            <h3 className="font-display text-2xl mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.desc}</p>
            <div className="mt-5 text-sm text-gold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
              {tr(lang, { no: "Gå", en: "Go", sv: "Gå", de: "Los" })} <ArrowRight className="size-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


function ThreeNames() {
  const { lang } = useI18n();
  const aiNote = tr(lang, {
    no: "AI-generert historisk tolkning",
    en: "AI-generated historical interpretation",
    sv: "AI-genererad historisk tolkning",
    de: "KI-generierte historische Interpretation",
  });
  const pioneers = useMemo(() => getPioneers(lang), [lang]);
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-xs tracking-[0.3em] text-destructive uppercase mb-3">
          {tr(lang, { no: "Start her", en: "Start Here", sv: "Börja här", de: "Hier anfangen" })}
        </div>
        <h2 className="font-display text-5xl">
          {tr(lang, { no: "Tre navn du må kjenne", en: "Three names you must know", sv: "Tre namn du måste känna till", de: "Drei Namen, die du kennen musst" })}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {tr(lang, {
            no: "Uten dem — ingen Rolling Stones. Ingen Led Zeppelin. Ingen rockegitar slik vi kjenner den.",
            en: "Without them — no Rolling Stones. No Led Zeppelin. No rock guitar as we know it.",
            sv: "Utan dem — inga Rolling Stones. Inget Led Zeppelin. Ingen rockgitarr som vi känner den.",
            de: "Ohne sie — keine Rolling Stones. Kein Led Zeppelin. Keine Rockgitarre, wie wir sie kennen.",
          })}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {pioneers.map((p) => (
          <article key={p.name} className="group bg-card/50 border border-border rounded-lg overflow-hidden hover:border-gold/50 transition">
            <div className="relative aspect-[4/5] overflow-hidden">
              <SafeImage src={p.img} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-3 right-3 size-10 rounded-full bg-gold flex items-center justify-center">
                <p.icon className="size-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-amber-300 px-2 py-1 text-center backdrop-blur-sm">
                {aiNote}
              </div>
            </div>
            <div className="p-6">
              <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{p.tag}</div>
              <h3 className="font-display text-2xl mb-3">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all">
                {tr(lang, { no: "Utforsk profil", en: "Explore profile", sv: "Utforska profil", de: "Profil entdecken" })} <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="text-center mt-12">
        <a href="#" className="inline-flex items-center gap-2 px-7 py-3 rounded-md border border-gold/60 text-gold hover:bg-gold/10 transition">
          {tr(lang, { no: "Se alle artister", en: "See all artists", sv: "Se alla artister", de: "Alle Künstler sehen" })} <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function SupportBanner() {
  const { lang } = useI18n();
  return (
    <section id="support" className="relative py-24 px-6 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          {tr(lang, {
            no: "Støtt bluesen. Bær bluesen.",
            en: "Support the blues. Wear the blues.",
            sv: "Stötta bluesen. Bär bluesen.",
            de: "Unterstütze den Blues. Trag den Blues.",
          })}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {tr(lang, {
            no: "Hver t-skjorte, plakat og vinyl som selges, holder denne siden i live — og bluesen i live.",
            en: "Every t-shirt, poster and vinyl sold keeps this site running and the blues alive.",
            sv: "Varje t-shirt, poster och vinyl som säljs håller den här sidan vid liv — och bluesen vid liv.",
            de: "Jedes verkaufte T-Shirt, Poster und Vinyl hält diese Seite am Laufen und den Blues lebendig.",
          })}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#" className="px-7 py-3 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 flex items-center gap-2">
            <ShoppingBag className="size-4" /> {tr(lang, { no: "Kjøp merch", en: "Shop merch", sv: "Köp merch", de: "Merch kaufen" })}
          </a>
          <a href="#" className="px-7 py-3 rounded-md border border-border text-foreground hover:border-gold/60 flex items-center gap-2">
            <BookOpen className="size-4" /> {tr(lang, { no: "Les bloggen", en: "Read the blog", sv: "Läs bloggen", de: "Blog lesen" })}
          </a>
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
          {tr(lang, { no: "Tidslinjen", en: "The Timeline", sv: "Tidslinjen", de: "Die Zeitlinie" })}
        </div>
        <h2 className="font-display text-5xl md:text-6xl">
          {tr(lang, {
            no: "Fra bomullsmarker til elektriske klubber",
            en: "From cotton fields to electric clubs",
            sv: "Från bomullsfält till elektriska klubbar",
            de: "Von Baumwollfeldern zu elektrischen Clubs",
          })}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {tr(lang, {
            no: "Hundre år med slit, migrasjon og forsterkning. Seks øyeblikk som forandret alt.",
            en: "A hundred years of toil, migration and amplification. Six moments that changed everything.",
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
        <a href="#" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">
          {tr(lang, { no: "Utforsk hele tidslinjen", en: "Explore the complete timeline", sv: "Utforska hela tidslinjen", de: "Die ganze Zeitlinie entdecken" })} <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function Voices() {
  const { lang } = useI18n();
  const voices = useMemo(() => getVoices(lang), [lang]);
  return (
    <section id="voices" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
          {tr(lang, { no: "Originalene", en: "The Originals", sv: "Originalen", de: "Die Originale" })}
        </div>
        <h2 className="font-display text-5xl">
          {tr(lang, { no: "Stemmer fra deltaet", en: "Voices from the Delta", sv: "Röster från deltat", de: "Stimmen aus dem Delta" })}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          {tr(lang, {
            no: "De sang om det de visste — hardt arbeid, tapt kjærlighet, veien videre. Innspillingene treffer deg fortsatt rett i brystet.",
            en: "They sang about what they knew — hard work, lost love, the road forward. The recordings still hit you right in the chest.",
            sv: "De sjöng om det de kände — hårt arbete, förlorad kärlek, vägen framåt. Inspelningarna träffar dig fortfarande rakt i bröstet.",
            de: "Sie sangen über das, was sie kannten — harte Arbeit, verlorene Liebe, den Weg nach vorn. Die Aufnahmen treffen dich noch immer mitten ins Herz.",
          })}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {voices.map((v) => (
          <article key={v.name} className="group bg-card/40 border border-border rounded-lg overflow-hidden hover:border-gold/50 transition">
            <div className={`relative aspect-[3/4] bg-gradient-to-br ${v.color}`}>
              <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-background/70 backdrop-blur text-gold">{v.tag}</span>
              <div className="absolute inset-0 flex items-center justify-center text-foreground/20 font-display text-7xl">
                {v.name.charAt(0)}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl">{v.name}</h3>
              <div className="text-sm text-muted-foreground mb-2">{v.years}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          </article>
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
            en: "Two Soundscapes, One Soul",
            sv: "Två ljudlandskap, en själ",
            de: "Zwei Klangwelten, eine Seele",
          })}
        </div>
        <h2 className="font-display text-5xl md:text-6xl">
          {tr(lang, { no: "Delta vs Chicago", en: "Delta vs Chicago", sv: "Delta vs Chicago", de: "Delta vs Chicago" })}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          {tr(lang, {
            no: "Én mann med en gitar på en veranda i Clarksdale. Et fullt band som rister veggene hos Chess Records. Samme smerte, ulik spenning.",
            en: "One man and a guitar on a porch in Clarksdale. A full band shaking the walls at Chess Records. Same pain, different voltage.",
            sv: "En man med en gitarr på en veranda i Clarksdale. Ett helt band som skakar väggarna hos Chess Records. Samma smärta, olika spänning.",
            de: "Ein Mann mit einer Gitarre auf einer Veranda in Clarksdale. Eine ganze Band, die die Wände bei Chess Records erschüttert. Gleicher Schmerz, andere Spannung.",
          })}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Column
          tone="from-amber-900/30 to-stone-900/40"
          icon={Music}
          title={tr(lang, { no: "Delta-blues", en: "Delta Blues", sv: "Delta-blues", de: "Delta-Blues" })}
          sub={tr(lang, { no: "1890-tallet — 1940-tallet", en: "1890s — 1940s", sv: "1890-talet — 1940-talet", de: "1890er — 1940er" })}
          points={[
            tr(lang, { no: "Akustisk gitar med slide / bottleneck", en: "Acoustic guitar with slide / bottleneck", sv: "Akustisk gitarr med slide / bottleneck", de: "Akustische Gitarre mit Slide / Bottleneck" }),
            tr(lang, { no: "Soloartister eller små grupper", en: "Solo artists or small groups", sv: "Soloartister eller små grupper", de: "Soloartisten oder kleine Gruppen" }),
            tr(lang, { no: "Rå, emosjonell vokal", en: "Raw, emotional vocals", sv: "Rå, känslomässig sång", de: "Rohe, emotionale Vocals" }),
            tr(lang, { no: "Opphav i rurale Mississippi", en: "Rural Mississippi origin", sv: "Ursprung på Mississippis landsbygd", de: "Ursprung im ländlichen Mississippi" }),
            tr(lang, { no: "Påvirket av arbeidssanger og field hollers", en: "Influenced by work songs and field hollers", sv: "Påverkad av arbetssånger och field hollers", de: "Beeinflusst von Arbeitsliedern und Field Hollers" }),
          ]}
          quote={tr(lang, {
            no: "«Delta-blues handlet om stemmen og gitaren — ingenting mellom deg og smerten.»",
            en: "«Delta blues was about the voice and the guitar — nothing between you and the pain.»",
            sv: "«Delta-blues handlade om rösten och gitarren — ingenting mellan dig och smärtan.»",
            de: "«Delta-Blues war Stimme und Gitarre — nichts zwischen dir und dem Schmerz.»",
          })}
        />
        <Column
          tone="from-red-900/30 to-stone-900/40"
          icon={Radio}
          title={tr(lang, { no: "Chicago-blues", en: "Chicago Blues", sv: "Chicago-blues", de: "Chicago-Blues" })}
          sub={tr(lang, { no: "1940-tallet — i dag", en: "1940s — today", sv: "1940-talet — idag", de: "1940er — heute" })}
          points={[
            tr(lang, { no: "Elektrisk gitar med forsterkning", en: "Electric guitar with amplification", sv: "Elgitarr med förstärkning", de: "E-Gitarre mit Verstärkung" }),
            tr(lang, { no: "Fullt band: bass, trommer, piano, munnspill", en: "Full band: bass, drums, piano, harmonica", sv: "Helt band: bas, trummor, piano, munspel", de: "Komplette Band: Bass, Schlagzeug, Klavier, Mundharmonika" }),
            tr(lang, { no: "Urban nattklubblyd", en: "Urban nightclub sound", sv: "Urbant nattklubbsljud", de: "Urbaner Nachtklub-Sound" }),
            tr(lang, { no: "Chess Records og Maxwell Street", en: "Chess Records and Maxwell Street", sv: "Chess Records och Maxwell Street", de: "Chess Records und Maxwell Street" }),
            tr(lang, { no: "Grunnlaget for rock and roll", en: "The foundation of rock and roll", sv: "Grunden för rock and roll", de: "Das Fundament des Rock 'n' Roll" }),
          ]}
          quote={tr(lang, {
            no: "«Da vi kom til Chicago og koblet til strøm, ble bluesen høyere — og verden begynte å lytte.»",
            en: "«When we got to Chicago and plugged in, the blues got louder — and the world started listening.»",
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
