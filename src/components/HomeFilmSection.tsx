import { useState } from "react";
import { Play, ExternalLink, ArrowRight } from "lucide-react";
import { useI18n, tr } from "@/i18n";
import heroJukeImg from "@/assets/hero-juke.webp";

const YOUTUBE_ID = "8Tmqffibtxo";
const YOUTUBE_WATCH_URL = `https://youtu.be/${YOUTUBE_ID}`;
// rel=0 keeps end-screen suggestions to this channel, modestbranding trims the
// YouTube logo treatment, playsinline stops iOS from forcing native fullscreen,
// autoplay=1 fires only once this iframe is created (i.e. after the viewer's own
// click), so it counts as a user gesture and browsers allow sound on it.
const EMBED_SRC = `https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;

/**
 * Click-to-play YouTube facade: a static poster + gold play button until the
 * viewer clicks. Nothing from YouTube (script, iframe, thumbnail request)
 * loads before that click, and nothing plays or makes sound until it.
 * Shared between the homepage (full) and /about (compact) treatments.
 */
export function HomeFilmSection({ compact = false }: { compact?: boolean }) {
  const { lang } = useI18n();
  const [playing, setPlaying] = useState(false);

  return (
    <section className={`${compact ? "py-16" : "py-24"} px-6 border-y border-border bg-gradient-to-b from-card/30 via-background to-background`}>
      <div className={`mx-auto text-center ${compact ? "max-w-2xl" : "max-w-3xl"}`}>
        {!compact && (
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-4">
            {tr(lang, { no: "FILMEN", en: "THE FILM", sv: "FILMEN", de: "DER FILM", pl: "FILM" })}
          </div>
        )}
        <h2 className={`font-display ${compact ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"} gold-gradient-text leading-tight`}>
          {tr(lang, {
            no: "Røttene. Alt annet er fruktene.",
            en: "The roots. Everything else is the fruits.",
            sv: "Rötterna. Allt annat är frukterna.",
            de: "Die Wurzeln. Alles andere sind die Früchte.",
            pl: "Korzenie. Wszystko inne to owoce.",
          })}
        </h2>
        {!compact && (
          <p className="mt-4 text-muted-foreground">
            {tr(lang, {
              no: "Sent på natten. Dempet lys. Én gitar som forteller sannheten.",
              en: "Late night. Low light. One guitar telling the truth.",
              sv: "Sent på natten. Dämpat ljus. En gitarr som talar sanning.",
              de: "Spät in der Nacht. Gedämpftes Licht. Eine Gitarre, die die Wahrheit erzählt.",
              pl: "Późna noc. Przyćmione światło. Jedna gitara mówiąca prawdę.",
            })}
          </p>
        )}
      </div>

      <div className={`mx-auto mt-10 ${compact ? "max-w-xl" : "max-w-[1150px]"}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gold/25 bg-black shadow-[0_0_80px_-30px_var(--color-gold)]">
          {playing ? (
            <iframe
              src={EMBED_SRC}
              title="SlowBlues — The Global Blues Encyclopedia (official film)"
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play SlowBlues film"
              className="group absolute inset-0 size-full"
            >
              <img
                src={heroJukeImg}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-70 group-hover:opacity-80 transition"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="size-20 rounded-full bg-gold text-primary-foreground flex items-center justify-center shadow-lg shadow-gold/30 group-hover:bg-gold/90 group-hover:scale-105 transition">
                  <Play className="size-8 ml-1" fill="currentColor" />
                </span>
              </span>
              <span className="absolute bottom-4 left-4 text-[11px] tracking-[0.2em] uppercase text-gold-soft bg-black/50 backdrop-blur px-3 py-1.5 rounded-full border border-gold/20">
                0:45
              </span>
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <a
            href={YOUTUBE_WATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold hover:text-gold-soft transition"
          >
            {tr(lang, { no: "Se på YouTube", en: "Watch on YouTube", sv: "Se på YouTube", de: "Auf YouTube ansehen", pl: "Obejrzyj na YouTube" })}
            <ExternalLink className="size-3.5" />
          </a>
          {!compact && (
            <a href="#voices" className="inline-flex items-center gap-1.5 text-gold hover:text-gold-soft transition">
              {tr(lang, { no: "Gå inn i leksikonet", en: "Enter the encyclopedia", sv: "Gå in i uppslagsverket", de: "Zum Lexikon", pl: "Wejdź do encyklopedii" })}
              <ArrowRight className="size-3.5" />
            </a>
          )}
        </div>
        {!compact && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {tr(lang, {
              no: "45 sekunder. SlowBlues — Det globale blues-leksikonet.",
              en: "45 seconds. SlowBlues — The Global Blues Encyclopedia.",
              sv: "45 sekunder. SlowBlues — Det globala blues-lexikonet.",
              de: "45 Sekunden. SlowBlues — Die globale Blues-Enzyklopädie.",
              pl: "45 sekund. SlowBlues — Globalna Encyklopedia Bluesa.",
            })}
          </p>
        )}
      </div>
    </section>
  );
}
