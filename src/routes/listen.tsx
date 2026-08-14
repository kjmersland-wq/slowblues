import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";
import { IMG } from "@/data/images";
import { ExternalLink, Play } from "lucide-react";

export const Route = createFileRoute("/listen")({
  component: ListenPage,
  head: () => ({ meta: [
    { title: "Listen — Essential Blues Recordings" },
    { name: "description", content: "Spotify playlists, classic cuts and new favourites curated by SlowBlues." },
    { property: "og:title", content: "Listen — Essential Blues Recordings" },
    { property: "og:image", content: IMG.vinyl },
  ]}),
});

const PLAYLISTS = [
  { title: "Delta Essentials", desc: "30 acoustic cuts from Patton to Johnson.", spotify: "https://open.spotify.com/genre/delta-blues" },
  { title: "Chess Records: The Golden Years", desc: "Muddy, Wolf, Walter, Sonny Boy, Etta.", spotify: "https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk" },
  { title: "British Blues Boom", desc: "Mayall, Cream, Stones, Zeppelin — the response from across the Atlantic.", spotify: "https://open.spotify.com/genre/british-blues" },
  { title: "Modern Voices", desc: "Gary Clark Jr., Larkin Poe, Kingfish, Joanne Shaw Taylor.", spotify: "https://open.spotify.com/genre/modern-blues" },
  { title: "Slow Blues After Midnight", desc: "Late-night, low-volume, deep mood.", spotify: "https://open.spotify.com/genre/blues" },
  { title: "Norwegian Blues", desc: "Notodden, Mandal og alt det norske blueslandskapet.", spotify: "https://open.spotify.com/search/norwegian%20blues" },
];

const ESSENTIAL_ALBUMS = [
  { artist: "Robert Johnson", album: "King of the Delta Blues Singers (1961)", note: "The compilation that started it all over again." },
  { artist: "Muddy Waters", album: "Hard Again (1977)", note: "Late-career masterpiece produced by Johnny Winter." },
  { artist: "B.B. King", album: "Live at the Regal (1965)", note: "Often called the greatest live blues album ever recorded." },
  { artist: "Howlin' Wolf", album: "Moanin' in the Moonlight (1959)", note: "Smokestack Lightnin' and Evil — two definitive Chess sides." },
  { artist: "John Lee Hooker", album: "The Healer (1989)", note: "Comeback that brought Hooker to a new generation." },
  { artist: "Stevie Ray Vaughan", album: "Texas Flood (1983)", note: "The album that single-handedly restarted the blues-rock revival." },
];

function ListenPage() {
  const { t, lang } = useI18n();
  return (
    <PageShell>
      <PageHero eyebrow={t.pages.listen.eyebrow} title={t.pages.listen.title} lead={t.pages.listen.lead} img={IMG.vinyl} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-display text-3xl mb-6">{tr(lang, { no: "Kuraterte spillelister", en: "Curated playlists", sv: "Utvalda spellistor", de: "Kuratierte Playlists", pl: "Wyselekcjonowane playlisty" })}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {PLAYLISTS.map((p) => (
            <a key={p.title} href={p.spotify} target="_blank" rel="noopener" className="group bg-card/60 border border-border rounded-lg p-6 hover:border-gold/60 transition">
              <div className="size-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:bg-gold/20"><Play className="size-5 text-gold" /></div>
              <h3 className="font-display text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
              <div className="text-xs text-gold inline-flex items-center gap-1">{t.common.listenNow} <ExternalLink className="size-3" /></div>
            </a>
          ))}
        </div>

        <h2 className="font-display text-3xl mb-6">{tr(lang, { no: "Uunnværlige album", en: "Essential albums", sv: "Oumbärliga album", de: "Unverzichtbare Alben", pl: "Niezbędne albumy" })}</h2>
        <div className="space-y-2">
          {ESSENTIAL_ALBUMS.map((a) => (
            <div key={a.album} className="grid md:grid-cols-3 gap-2 p-4 border-b border-border">
              <div className="font-display text-lg text-gold">{a.artist}</div>
              <div className="text-foreground">{a.album}</div>
              <div className="text-sm text-muted-foreground italic">{a.note}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
