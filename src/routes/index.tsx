import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, ShoppingBag, HelpCircle, BookOpen, Music, Radio, Mic,
  ChevronDown, ChevronLeft, ChevronRight, Play, ArrowRight, Star,
} from "lucide-react";
import heroJuke from "@/assets/hero-juke.jpg";
import heroCotton from "@/assets/hero-cotton.jpg";
import robertJohnson from "@/assets/robert-johnson.jpg";
import muddyWaters from "@/assets/muddy-waters.jpg";
import sonHouse from "@/assets/son-house.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SlowBlues — 330+ Blues Artists, Live News" },
      { name: "description", content: "A timeless tribute to the raw soul of Delta & Chicago Blues. From the cotton fields to the global stage — the real roots of modern music." },
    ],
  }),
});

const tickerItems = [
  "🇳🇴 Ariel Posen — Reasons for Leaving: 9.6/10. An atmospheric masterpiece!",
  "🇳🇴 Buddy Guy — The Final Goodbye: 9.2/10. The king bows out in style!",
  "🇳🇴 Gary Clark Jr. — Texas Rain: 9.4/10. Analog warmth and soul!",
  "🇳🇴 Henrik Freischlader — Keep Going: 8.8/10. A blue flame from Germany!",
  "🇸🇪 Louise Hoffsten celebrates 40 years with blues — jubilee tour in Scandinavia!",
  "🇪🇺 European Blues Challenge Katowice April 16–18, 2026!",
  "🇬🇧 Joanne Shaw Taylor announces new album «Heavy Soul» out May!",
  "🎵 Buddy Guy farewell tour 2026 — final European dates announced!",
  "🎵 Walter Trout European tour April–May 2026 — don't miss it!",
  "🎵 Larkin Poe Scandinavia tour confirmed June 2026!",
  "🎵 Joe Bonamassa acoustic Europe tour — autumn 2026!",
  "📻 Weekly broadcast live now — Oz & The Wizards, Buddy Guy and more!",
];

const heroSlides = [
  {
    img: heroJuke,
    eyebrow: "The Slow, Soulful Roots",
    title: "SLOWBLUES",
    titleAccent: "Where the blues began",
    quote: "«The blues are the roots, everything else is the fruits.»",
    attr: "— Willie Dixon",
    body: "330+ artist profiles. Step into Chicago. The history, pioneers and sound that laid the foundation for rock, jazz and everything that came after.",
    showButtons: true,
  },
  {
    img: heroCotton,
    eyebrow: "Delta & Chicago",
    title: "A TIMELESS TRIBUTE",
    titleAccent: "to the raw soul of Delta & Chicago Blues",
    quote: "From the cotton fields to the global stage — the real roots of modern music.",
    attr: "",
    body: "",
    showButtons: false,
    credit: "Photo: Unknown · Library of Congress",
  },
];

const pioneers = [
  {
    img: robertJohnson, icon: Music, tag: "The Crossroads Legend",
    name: "Robert Johnson",
    desc: "Only 29 recordings, but he defined the Delta blues sound and inspired generations of rock musicians.",
  },
  {
    img: muddyWaters, icon: Radio, tag: "Father of Chicago Blues",
    name: "Muddy Waters",
    desc: "Electrified the Delta sound and became the bridge between acoustic roots and modern blues-rock.",
  },
  {
    img: sonHouse, icon: Mic, tag: "The Preacher's Blues",
    name: "Son House",
    desc: "Raw, emotional slide guitar and spiritual intensity that directly influenced Robert Johnson.",
  },
];

const timeline = [
  { year: "1890", title: "The Blues Takes Shape", body: "The blues form begins to crystallize in the Mississippi Delta region. Work songs, field hollers, spirituals and African musical traditions blend into one." },
  { year: "1920", title: "First Blues Recording", body: "Mamie Smith records 'Crazy Blues' for Okeh Records — the first blues recording by an African American artist. It sells over 75,000 copies in the first month." },
  { year: "1936", title: "Robert Johnson Sessions", body: "Robert Johnson records his legendary sessions in San Antonio, Texas at the Gunter Hotel. These 29 songs would become the most influential blues recordings of all time." },
  { year: "1947", title: "Chess Records Founded", body: "Leonard and Phil Chess establish Chess Records in Chicago (originally Aristocrat). The label would become the most important blues record company in history." },
  { year: "1958", title: "Muddy Waters Tours Britain", body: "Muddy Waters' electric performances shock British audiences expecting acoustic folk-blues. This tour ignites the British blues boom and inspires a generation." },
  { year: "1962", title: "Rolling Stones Formed", body: "The Rolling Stones form in London, named after Muddy Waters' song. They and other British bands would soon bring the blues to a worldwide rock audience." },
];

const voices = [
  { tag: "Chicago", name: "Lonnie Johnson", years: "1920s–1970", desc: "Lonnie Johnson was one of the most influential and innovative guitarists in...", color: "from-amber-900/60 to-stone-900" },
  { tag: "Chicago", name: "King Biscuit Boy", years: "1961–2003", desc: "King Biscuit Boy, born Richard Alfred Newell in Hamilton, Ontario, was one of Canada's most...", color: "from-stone-800 to-stone-900" },
  { tag: "Chicago", name: "Sue Foley", years: "1988–present", desc: "Sue Foley is a Canadian-born blues guitarist, vocalist and songwriter who has been a...", color: "from-rose-900/60 to-stone-900" },
  { tag: "Chicago", name: "Colin James", years: "1985–present", desc: "Colin James is one of Canada's most successful and versatile blues-rock artists, with a career...", color: "from-stone-800 to-stone-900" },
];

function Home() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO carousel */}
      <section className="relative">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`${i === slide ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"} transition-opacity duration-1000`}
          >
            <HeroSlide {...s} active={i === slide} />
          </div>
        ))}
        {/* Nav arrows */}
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
        {/* Dots */}
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
      <Footer />
    </div>
  );
}

/* ───────── components ───────── */

function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full border-2 border-gold/60 bg-card flex items-center justify-center font-display text-gold text-xs leading-tight text-center">
            SB
          </div>
          <div>
            <div className="font-display text-xl tracking-wide">SLOWBLUES</div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">The Slow, Soulful Roots</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {["Home", "Artists", "Learn Blues", "Experience", "About", "Reviews"].map((n, i) => (
            <a
              key={n}
              href="#"
              className={`px-3 py-1.5 rounded-md transition ${i === 0 ? "bg-gold/10 text-gold" : "text-foreground/80 hover:text-gold"}`}
            >
              {n}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <button className="px-2 py-1 rounded bg-gold text-primary-foreground font-semibold">EN</button>
            <button className="px-2 py-1 rounded text-muted-foreground hover:text-foreground">NO</button>
            <button className="px-2 py-1 rounded text-muted-foreground hover:text-foreground">DE</button>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold">
            <Search className="size-4" /> Search
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSlide({ img, eyebrow, title, titleAccent, quote, attr, body, showButtons, credit, active }: any) {
  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <img
        src={img}
        alt=""
        loading={active ? "eager" : "lazy"}
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
          <div className="mx-auto mb-6 size-32 rounded-full border-2 border-gold/60 bg-card/80 backdrop-blur flex items-center justify-center">
            <div className="text-center">
              <div className="font-display text-gold text-lg leading-none">SlowBlues</div>
              <div className="text-[8px] tracking-widest text-muted-foreground mt-1">GLOBAL BLUES ENCYCLOPEDIA</div>
            </div>
          </div>
        )}
        <h1 className="font-display font-black tracking-tight text-6xl md:text-8xl gold-gradient-text leading-none">
          {showButtons ? title : (
            <>A timeless tribute to the raw soul of <span className="text-gold">Delta & Chicago Blues</span></>
          )}
        </h1>
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
              Explore 330+ artists
            </a>
            <a href="#support" className="px-7 py-3.5 rounded-md border border-gold/60 text-foreground hover:bg-gold/10 transition flex items-center gap-2">
              <ShoppingBag className="size-4" /> Shop Blues Merch
            </a>
            <a href="#" className="px-7 py-3.5 rounded-md border border-gold/40 text-foreground hover:bg-gold/10 transition flex items-center gap-2">
              <Play className="size-4" /> Listen
            </a>
          </div>
        )}
        {credit && (
          <div className="absolute bottom-10 left-8 text-xs text-muted-foreground/70 bg-background/40 backdrop-blur px-3 py-2 rounded">
            {credit}
          </div>
        )}
        <div className="mt-16 flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-muted-foreground">
          SCROLL
          <ChevronDown className="size-4 animate-bounce-slow text-gold" />
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="relative border-y border-border bg-card/40 overflow-hidden ticker-mask">
      <div className="flex gap-12 py-3 animate-ticker whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="text-sm text-foreground/80">
            <span className="text-gold mr-2">•</span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Join() {
  const items = [
    { icon: ShoppingBag, title: "Blues Merch", desc: "T-shirts, posters and vinyl for the true blues fan." },
    { icon: HelpCircle, title: "Blues Quiz", desc: "Think you know your blues? Prove it." },
    { icon: BookOpen, title: "Guestbook", desc: "Leave your mark. Tell us your blues story." },
  ];
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="font-display text-5xl gold-gradient-text">Join In</h2>
        <p className="mt-3 text-muted-foreground">More than a website — a community for the blues.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} className="group bg-card/60 border border-border rounded-lg p-8 text-center hover:border-gold/60 transition">
            <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition">
              <it.icon className="size-6 text-gold" />
            </div>
            <h3 className="font-display text-2xl mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.desc}</p>
            <div className="mt-5 text-sm text-gold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
              Go <ArrowRight className="size-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThreeNames() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-xs tracking-[0.3em] text-destructive uppercase mb-3">Start Here</div>
        <h2 className="font-display text-5xl">Three names you must know</h2>
        <p className="mt-3 text-muted-foreground">Without them — no Rolling Stones. No Led Zeppelin. No rock guitar as we know it.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {pioneers.map((p) => (
          <article key={p.name} className="group bg-card/50 border border-border rounded-lg overflow-hidden hover:border-gold/50 transition">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={p.img} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-3 right-3 size-10 rounded-full bg-gold flex items-center justify-center">
                <p.icon className="size-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="p-6">
              <div className="text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{p.tag}</div>
              <h3 className="font-display text-2xl mb-3">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all">
                Explore profile <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="text-center mt-12">
        <a href="#" className="inline-flex items-center gap-2 px-7 py-3 rounded-md border border-gold/60 text-gold hover:bg-gold/10 transition">
          See all artists <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function SupportBanner() {
  return (
    <section id="support" className="relative py-24 px-6 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl">Support the blues. Wear the blues.</h2>
        <p className="mt-4 text-muted-foreground">Every t-shirt, poster and vinyl sold keeps this site running and the blues alive.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#" className="px-7 py-3 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90 flex items-center gap-2">
            <ShoppingBag className="size-4" /> Shop merch
          </a>
          <a href="#" className="px-7 py-3 rounded-md border border-border text-foreground hover:border-gold/60 flex items-center gap-2">
            <BookOpen className="size-4" /> Read the blog
          </a>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">The Timeline</div>
        <h2 className="font-display text-5xl md:text-6xl">From cotton fields to electric clubs</h2>
        <p className="mt-4 text-muted-foreground">A hundred years of toil, migration and amplification. Six moments that changed everything.</p>
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
          Explore the complete timeline <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section id="voices" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">The Originals</div>
        <h2 className="font-display text-5xl">Voices from the Delta</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          They sang about what they knew — hard work, lost love, the road forward. The recordings still hit you right in the chest.
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
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="text-xs tracking-[0.3em] text-gold uppercase mb-3">Two Soundscapes, One Soul</div>
        <h2 className="font-display text-5xl md:text-6xl">Delta vs Chicago</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          One man and a guitar on a porch in Clarksdale. A full band shaking the walls at Chess Records. Same pain, different voltage.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Column
          tone="from-amber-900/30 to-stone-900/40"
          icon={Music}
          title="Delta Blues"
          sub="1890s — 1940s"
          points={[
            "Acoustic guitar with slide / bottleneck",
            "Solo artists or small groups",
            "Raw, emotional vocals",
            "Rural Mississippi origin",
            "Influenced by work songs and field hollers",
          ]}
          quote="«Delta blues was about the voice and the guitar — nothing between you and the pain.»"
        />
        <Column
          tone="from-red-900/30 to-stone-900/40"
          icon={Radio}
          title="Chicago Blues"
          sub="1940s — today"
          points={[
            "Electric guitar with amplification",
            "Full band: bass, drums, piano, harmonica",
            "Urban nightclub sound",
            "Chess Records and Maxwell Street",
            "The foundation of rock and roll",
          ]}
          quote="«When we got to Chicago and plugged in, the blues got louder — and the world started listening.»"
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

function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display text-xl text-gold mb-2">SLOWBLUES</div>
          <p className="text-muted-foreground text-xs leading-relaxed">A timeless tribute to the raw soul of Delta & Chicago Blues — and the artists keeping it alive today.</p>
        </div>
        {[
          { h: "Explore", l: ["Artists", "Timeline", "Reviews", "Map"] },
          { h: "Learn", l: ["Delta Blues", "Chicago Blues", "Blues Quiz", "Glossary"] },
          { h: "Community", l: ["Shop", "Guestbook", "Blog", "Newsletter"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="font-display text-foreground mb-3">{c.h}</div>
            <ul className="space-y-2">
              {c.l.map((i) => <li key={i}><a href="#" className="text-muted-foreground hover:text-gold transition">{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SlowBlues. The blues are the roots, everything else is the fruits.
      </div>
    </footer>
  );
}
