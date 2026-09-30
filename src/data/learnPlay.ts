// Content for /learn/play — a small, hand-written beginner course (guitar +
// harmonica), not a database-driven feature. Voice: bluesy, warm, positive,
// plain — someone sitting next to you showing the grip, not a textbook.
//
// Video honesty rule (same as the quiz audio-guess fixes): every videoId
// here is a REAL video, verified via YouTube oEmbed before use. `listen`
// videos are further confirmed as already linked on that artist's own
// SlowBlues profile (artists.youtube_video_ids). `backing` videos are
// generic instrumental tracks the site owner picked or approved — verified
// via oEmbed too, just not tied to an artist profile, since a backing
// track isn't a performance by anyone in the archive.
//
// Locked course keys (2026-10): guitar = E (Cliff Smith Backing Tracks).
// Harmonica = concert key E / A harmonica in 2nd position, Chicago
// shuffle feel, matching the "Juke" listen clips used throughout that
// track — the backing must always match the listen example's key and
// style, never a different key/tempo pairing.
//
// No placeholder/"coming soon" state exists in this data on purpose: both
// `listen` and `backing` are OPTIONAL. A lesson that has no real video for
// a slot simply omits that field, and the page renders no section for it
// at all — never an empty box.

export type LearnLang = "en" | "no" | "sv" | "de" | "pl";
export type LangText = Record<LearnLang, string>;

export type Media = { videoId: string; start?: number; credit: string; caption: LangText };

// A chord diagram now always carries its own translated label (was a bare
// hardcoded "E shape" before) and a lesson can show more than one at once
// -- needed for guitar-2, which teaches switching between E AND A but used
// to only ever diagram E, leaving A undemonstrated anywhere in the course.
export type Illustration =
  | { kind: "chord"; chords: { chord: "E" | "A" | "B7" | "A7" | "D7" | "E7"; label: LangText }[] }
  | { kind: "harp"; highlight: number[]; direction?: "blow" | "draw"; label: LangText }
  | { kind: "none" };

export type Lesson = {
  id: string;
  /** Which stage of the journey this lesson belongs to -- shown as a small
   * eyebrow label so a student can feel "I'm past Foundations, into
   * Technique now" rather than just seeing a flat list of 12 lessons. */
  phase: LangText;
  title: LangText;
  badge: LangText; // small per-lesson tag: "Slow 60", "Shuffle", "Cross harp"...
  goal: LangText;
  steps: LangText;
  /** A short, honest, self-checkable line -- "can you do X yet?" -- not a
   * score or pass/fail gate. Purely informational, no state is stored. */
  successTest?: LangText;
  listen?: Media;
  backing?: Media;
  /** Set only when `backing` is a same-tempo stand-in for a faster/different
   * feel the lesson is actually named after (currently: the two "Shuffle"/
   * "Riff" lessons, which have no verified faster E backing track yet —
   * see docs/media-candidates.md). Rendered as a small visible flag next to
   * the backing player, never silently implied by the caption alone. */
  temporaryNote?: LangText;
  nextTip: LangText;
  artistSlug: string;
  illustration: Illustration;
};

const GUITAR_BACKING = (): Media => ({
  videoId: "JBFMvizGDiI",
  start: 0,
  credit: "Cliff Smith Backing Tracks",
  caption: {
    en: "Backing in E — guitar: E–A–B7. About 60 BPM.",
    no: "Backing i E — gitar: E–A–B7. Ca. 60 BPM.",
    sv: "Backing i E — gitarr: E–A–B7. Cirka 60 BPM.",
    de: "Backing in E — Gitarre: E–A–B7. Etwa 60 BPM.",
    pl: "Podkład w E — gitara: E–A–B7. Około 60 BPM.",
  },
});

// Locked course standard, 2026-10: concert key E, A harmonica in 2nd
// position, Chicago shuffle feel -- matching the "Juke" LISTEN clips used
// throughout this track (was G/C harp against an E-shuffle listen example,
// a real key/style mismatch the owner caught and asked to fix).
// HKfEtmi2qBw is a temporary stand-in: verified real (YouTube oEmbed:
// "Slow Blues Backing Track In E" / Bluesnoodle) and correctly in E, but
// it's a slow backing, not an up-tempo shuffle like Juke -- no dedicated
// E-shuffle ID existed anywhere in the repo to search for first. Per the
// owner's own call: key matters more than tempo here. Swap for a livelier
// E-shuffle track later if one turns up.
// Plain, slow default caption — the shuffle-like-Juke framing only belongs
// on the lesson where that's actually the point (lesson 4); every earlier
// lesson gets this same track played straight, no shuffle claim attached.
const HARMONICA_BACKING = (): Media => ({
  videoId: "HKfEtmi2qBw",
  start: 0,
  credit: "Bluesnoodle",
  caption: {
    en: "Backing in E — A harmonica, 2nd position.",
    no: "Backing i E — A-harp, andre posisjon.",
    sv: "Backing i E — A-munspel, andra positionen.",
    de: "Backing in E — A-Harp, 2. Position.",
    pl: "Podkład w E — harmonijka A, druga pozycja.",
  },
});

// Five stage labels shared by both tracks -- a student moves through the
// same five stages on guitar or harmonica, even though the actual
// techniques taught inside each stage are instrument-specific.
const PHASE_FOUNDATIONS: LangText = { en: "Foundations", no: "Grunnlag", sv: "Grunder", de: "Grundlagen", pl: "Podstawy" };
const PHASE_RHYTHM: LangText = { en: "Blues Rhythm", no: "Bluesrytme", sv: "Bluesrytm", de: "Blues-Rhythmus", pl: "Rytm bluesa" };
const PHASE_TECHNIQUE: LangText = { en: "Blues Technique", no: "Bluesteknikk", sv: "Bluesteknik", de: "Blues-Technik", pl: "Technika bluesa" };
const PHASE_LANGUAGE: LangText = { en: "Blues Language", no: "Bluesspråket", sv: "Bluesspråket", de: "Blues-Sprache", pl: "Język bluesa" };
const PHASE_PLAYING: LangText = { en: "Playing Blues", no: "Å spille blues", sv: "Att spela blues", de: "Blues spielen", pl: "Granie bluesa" };

export type Track = {
  id: "guitar" | "harmonica";
  title: LangText;
  intro: LangText;
  lessons: Lesson[]; // [0] is always the shared "ears first" lesson
};

// Shared across both tracks except `listen`/`backing`, which need a
// track-appropriate video (a guitarist for the guitar track, a harp player
// for the harmonica track) rather than one generic pick — see
// makeEarsLesson() below.
const EARS_SHARED = {
  id: "ears",
  phase: PHASE_FOUNDATIONS,
  title: { en: "Ears First", no: "Ørene først", sv: "Öronen först", de: "Erst die Ohren", pl: "Najpierw uszy" } satisfies LangText,
  badge: { en: "Intro", no: "Intro", sv: "Intro", de: "Intro", pl: "Wstęp" } satisfies LangText,
  goal: {
    en: "Know what a 12-bar blues actually is — in your body, not on paper — before you touch an instrument.",
    no: "Kjenne hva en 12-takters blues faktisk er — i kroppen, ikke på papiret — før du rører et instrument.",
    sv: "Känna vad en 12-takters blues faktiskt är — i kroppen, inte på papper — innan du rör ett instrument.",
    de: "Spüren, was ein 12-Takt-Blues wirklich ist — im Körper, nicht auf dem Papier — bevor du ein Instrument anfasst.",
    pl: "Poczuć, czym naprawdę jest 12-taktowy blues — w ciele, nie na papierze — zanim dotkniesz instrumentu.",
  } satisfies LangText,
  successTest: {
    en: "Can you count all 12 bars out loud, in time, without losing your place?",
    no: "Klarer du å telle alle 12 taktene høyt, i takt, uten å miste tellingen?",
    sv: "Klarar du att räkna alla 12 takterna högt, i takt, utan att tappa räkningen?",
    de: "Schaffst du es, alle 12 Takte laut und im Takt zu zählen, ohne den Überblick zu verlieren?",
    pl: "Czy potrafisz policzyć głośno wszystkie 12 taktów, w rytmie, nie gubiąc się?",
  } satisfies LangText,
  steps: {
    en: "12 bars, four beats in each. Count the bars out loud, 1 to 12, clapping or tapping your foot along — that's the whole form, and most blues songs ever written live inside it. Three chords do the work: the home chord, the one that lifts you up, and the one that wants to come back home. That's it — that's I, IV and V, and you never need the Roman numerals again. One more thing before you play a single note: let the last note of a line ring out. Don't rush into the next one. The silence is part of the music.",
    no: "12 takter, fire slag i hver. Tell taktene høyt, 1 til 12, mens du klapper eller tramper takten — det er hele formen, og de fleste blueslåter som noen gang er skrevet bor inni den. Tre akkorder gjør jobben: hjemmeakkorden, den som løfter deg opp, og den som vil hjem igjen. Det er alt — det er I, IV og V, og du trenger aldri romertallene igjen. Én ting til før du spiller en eneste tone: la siste tonen i en linje få stå. Ikke rush inn i den neste. Stillheten er en del av musikken.",
    sv: "12 takter, fyra slag i varje. Räkna takterna högt, 1 till 12, medan du klappar eller stampar takten — det är hela formen, och de flesta blueslåtar som någonsin skrivits bor inuti den. Tre ackord gör jobbet: hemackordet, det som lyfter dig upp, och det som vill hem igen. Det är allt — det är I, IV och V, och du behöver aldrig romerska siffror igen. En sak till innan du spelar en enda ton: låt sista tonen i en rad klinga ut. Skynda inte in i nästa. Tystnaden är en del av musiken.",
    de: "12 Takte, vier Schläge in jedem. Zähl die Takte laut, 1 bis 12, während du klatschst oder den Takt stampfst — das ist die ganze Form, und die meisten je geschriebenen Bluessongs leben in ihr. Drei Akkorde erledigen die Arbeit: der Heimatakkord, der, der dich hochhebt, und der, der wieder nach Hause will. Das ist alles — das sind I, IV und V, und du brauchst die römischen Zahlen nie wieder. Noch etwas, bevor du auch nur einen Ton spielst: Lass den letzten Ton einer Zeile ausklingen. Hetz nicht in die nächste. Die Stille gehört zur Musik.",
    pl: "12 taktów, cztery uderzenia w każdym. Licz takty głośno, od 1 do 12, klaszcząc albo stukając stopą w rytm — to cała forma, i większość bluesowych utworów mieści się w niej. Trzy akordy robią całą robotę: akord domowy, ten, który cię unosi, i ten, który chce wrócić do domu. To wszystko — to I, IV i V, i rzymskich cyfr nigdy więcej nie potrzebujesz. Jeszcze jedno, zanim zagrasz choć jedną nutę: pozwól ostatniej nucie frazy wybrzmieć. Nie wpadaj od razu w kolejną. Cisza też jest częścią muzyki.",
  } satisfies LangText,
  illustration: { kind: "none" } satisfies Illustration,
};

// No LISTEN video on either Ears lesson, on purpose: the only video we'd
// have shown was the track's virtuoso end-point (SRV / Juke), and the
// owner's whole point this round is "never show the finished product as
// the first thing a beginner hears." The backing track alone (count-along,
// don't play yet) is the single embed for this lesson — see
// LearnPlayTrackPage.tsx, which simply doesn't render a LISTEN section
// when `listen` is omitted.
function makeEarsLesson(artistSlug: string, backing: Media, nextTip: LangText): Lesson {
  return {
    ...EARS_SHARED,
    backing,
    nextTip,
    artistSlug,
  };
}

const EARS_GUITAR = makeEarsLesson(
  "stevie-ray-vaughan",
  {
    videoId: "JBFMvizGDiI",
    start: 0,
    credit: "Cliff Smith Backing Tracks",
    caption: {
      en: "Backing in E. Count 1–12 out loud. Don't play yet.",
      no: "Backing i E. Tell 1–12 høyt. Ikke spill ennå.",
      sv: "Backing i E. Räkna 1–12 högt. Spela inte än.",
      de: "Backing in E. Zähl 1–12 laut. Spiel noch nicht.",
      pl: "Podkład w E. Licz głośno 1–12. Jeszcze nie graj.",
    },
  },
  {
    en: "That's the shape you'll build on — Stevie Ray Vaughan's profile is where this course eventually points.",
    no: "Det er formen du skal bygge på — profilen til Stevie Ray Vaughan er der dette kurset til slutt peker.",
    sv: "Det är formen du ska bygga på — Stevie Ray Vaughans profil är dit den här kursen till slut pekar.",
    de: "Das ist die Form, auf der du aufbaust — Stevie Ray Vaughans Profil ist, worauf dieser Kurs letztlich hinausläuft.",
    pl: "To kształt, na którym będziesz budować — profil Stevie'ego Raya Vaughana to miejsce, do którego ostatecznie zmierza ten kurs.",
  }
);

const EARS_HARMONICA = makeEarsLesson(
  "little-walter",
  {
    videoId: "HKfEtmi2qBw",
    start: 0,
    credit: "Bluesnoodle",
    caption: {
      en: "Backing in E. Count 1–12 out loud. Don't play yet.",
      no: "Backing i E. Tell 1–12 høyt. Ikke spill ennå.",
      sv: "Backing i E. Räkna 1–12 högt. Spela inte än.",
      de: "Backing in E. Zähl 1–12 laut. Spiel noch nicht.",
      pl: "Podkład w E. Licz głośno 1–12. Jeszcze nie graj.",
    },
  },
  {
    en: "That's the shape you'll build on — Little Walter's profile is where this course eventually points.",
    no: "Det er formen du skal bygge på — profilen til Little Walter er der dette kurset til slutt peker.",
    sv: "Det är formen du ska bygga på — Little Walters profil är dit den här kursen till slut pekar.",
    de: "Das ist die Form, auf der du aufbaust — Little Walters Profil ist, worauf dieser Kurs letztlich hinausläuft.",
    pl: "To kształt, na którym będziesz budować — profil Little Waltera to miejsce, do którego ostatecznie zmierza ten kurs.",
  }
);

export const TRACKS: Track[] = [
  {
    id: "guitar",
    title: { en: "Guitar", no: "Gitar", sv: "Gitarr", de: "Gitarre", pl: "Gitara" },
    intro: {
      en: "Five short lessons from first hold to your first shuffle and your first taste of slide.",
      no: "Fem korte leksjoner fra første grep til din første shuffle og din første smak av slide.",
      sv: "Fem korta lektioner från första greppet till din första shuffle och din första smak av slide.",
      de: "Fünf kurze Lektionen vom ersten Griff bis zu deinem ersten Shuffle und deinem ersten Slide-Geschmack.",
      pl: "Pięć krótkich lekcji od pierwszego chwytu po twój pierwszy shuffle i pierwszy smak slide'a.",
    },
    lessons: [
      EARS_GUITAR,
      {
        id: "guitar-1",
        phase: PHASE_FOUNDATIONS,
        title: { en: "Tuning & Hold", no: "Stemming og hold", sv: "Stämning och hållning", de: "Stimmen & Haltung", pl: "Strojenie i trzymanie" },
        badge: { en: "Slow 60", no: "Sakte 60", sv: "Långsamt 60", de: "Langsam 60", pl: "Wolno 60" },
        goal: {
          en: "Hold the guitar so it feels like part of you, and get it roughly in tune.",
          no: "Holde gitaren slik at den føles som en del av deg, og få den noenlunde stemt.",
          sv: "Hålla gitarren så den känns som en del av dig, och få den ungefär stämd.",
          de: "Die Gitarre so halten, dass sie sich wie ein Teil von dir anfühlt, und sie grob stimmen.",
          pl: "Trzymać gitarę tak, by czuła się jak część ciebie, i nastroić ją w miarę dokładnie.",
        },
        successTest: {
          en: "Can you strum all six strings cleanly, with no buzzing or muted strings?",
          no: "Klarer du å strumme alle seks strengene rent, uten durring eller dempede strenger?",
          sv: "Klarar du att strumma alla sex strängarna rent, utan surr eller dämpade strängar?",
          de: "Schaffst du es, alle sechs Saiten sauber anzuschlagen, ohne Schnarren oder gedämpfte Saiten?",
          pl: "Czy potrafisz czysto uderzyć we wszystkie sześć strun, bez brzęczenia i stłumionych dźwięków?",
        },
        steps: {
          en: "Sit down, guitar body resting against your stomach, neck angled up a little — not flat, not pointing at the ceiling. Use a tuner app for now; your ear will catch up later. Rest your picking hand loosely near the sound hole or bridge, shoulders down, no death grip on the neck. If your hand hurts, you're squeezing too hard.",
          no: "Sitt ned, gitarkroppen mot magen, halsen litt vinklet opp — verken flat eller pekende mot taket. Bruk en stemme-app foreløpig, øret ditt tar igjen senere. La plekterhånden hvile løst nær lydhullet eller stolen, skuldrene ned, ikke dødsgrep på halsen. Gjør hånden vondt, klemmer du for hardt.",
          sv: "Sitt ner, gitarrkroppen mot magen, halsen lite vinklad uppåt — varken platt eller pekande i taket. Använd en stämapp än så länge, örat hinner ikapp senare. Låt plekterhanden vila löst nära ljudhålet eller stallet, axlarna ner, inget dödsgrepp på halsen. Gör handen ont klämmer du för hårt.",
          de: "Setz dich hin, der Gitarrenkorpus liegt am Bauch, der Hals zeigt leicht nach oben — nicht flach, nicht zur Decke. Nutze vorerst eine Stimm-App, dein Ohr holt später auf. Die Anschlaghand ruht locker nahe dem Schalloch oder Steg, Schultern entspannt, kein Todesgriff am Hals. Tut die Hand weh, drückst du zu fest.",
          pl: "Usiądź, korpus gitary opiera się o brzuch, gryf lekko uniesiony — nie płasko, nie w sufit. Na razie używaj tunera w telefonie, ucho dogoni później. Ręka od uderzania spoczywa luźno blisko otworu rezonansowego albo mostka, ramiona opuszczone, żadnego zaciskania na gryfie. Jeśli boli cię ręka, ściskasz za mocno.",
        },
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Backing in E. Just sit in the tempo — no chord changes yet.",
            no: "Backing i E. Bare sitt i tempoet — ingen akkordbytter ennå.",
            sv: "Backing i E. Sitt bara i tempot — inga ackordbyten än.",
            de: "Backing in E. Bleib einfach im Tempo — noch keine Akkordwechsel.",
            pl: "Podkład w E. Po prostu usiądź w tempie — żadnych zmian akordów jeszcze.",
          },
        },
        nextTip: {
          en: "One man, one guitar, 29 recordings — the whole genre owes him something.",
          no: "Én mann, én gitar, 29 innspillinger — hele sjangeren skylder ham noe.",
          sv: "En man, en gitarr, 29 inspelningar — hela genren är skyldig honom något.",
          de: "Ein Mann, eine Gitarre, 29 Aufnahmen — das ganze Genre schuldet ihm etwas.",
          pl: "Jeden człowiek, jedna gitara, 29 nagrań — cały gatunek jest mu coś winien.",
        },
        artistSlug: "robert-johnson",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-2",
        phase: PHASE_FOUNDATIONS,
        title: { en: "E and A", no: "E og A", sv: "E och A", de: "E und A", pl: "E i A" },
        badge: { en: "Two chords", no: "To akkorder", sv: "Två ackord", de: "Zwei Akkorde", pl: "Dwa akordy" },
        goal: {
          en: "Switch cleanly between open E and open A without looking down.",
          no: "Bytte rent mellom åpen E og åpen A uten å se ned.",
          sv: "Byta rent mellan öppen E och öppen A utan att titta ner.",
          de: "Sauber zwischen offenem E und offenem A wechseln, ohne runterzuschauen.",
          pl: "Czysto przełączać się między otwartym E i otwartym A, nie patrząc w dół.",
        },
        successTest: {
          en: "Can you switch E → A → E four times in a row without stopping?",
          no: "Klarer du å bytte E → A → E fire ganger på rad uten å stoppe?",
          sv: "Klarar du att byta E → A → E fyra gånger i rad utan att stanna?",
          de: "Schaffst du den Wechsel E → A → E viermal hintereinander, ohne anzuhalten?",
          pl: "Czy potrafisz zmienić E → A → E cztery razy z rzędu, nie zatrzymując się?",
        },
        steps: {
          en: "Set your fingers for E, strum four slow downstrokes. Move to A, same four strokes. Back to E. The goal isn't speed — it's landing every finger in the same spot every time. If a string buzzes, that finger needs to press closer to the fret wire, not harder.",
          no: "Sett fingrene til E, strum fire sakte nedslag. Flytt til A, samme fire slag. Tilbake til E. Målet er ikke fart — det er at hver finger lander på samme sted hver gang. Durrer en streng, må fingeren nærmere båndet, ikke hardere ned.",
          sv: "Sätt fingrarna till E, strumma fyra långsamma nedslag. Flytta till A, samma fyra slag. Tillbaka till E. Målet är inte fart — det är att varje finger landar på samma ställe varje gång. Surrar en sträng, behöver fingret närmare bandet, inte hårdare ner.",
          de: "Finger für E setzen, vier langsame Abschläge. Wechsel zu A, gleiche vier Schläge. Zurück zu E. Ziel ist nicht Tempo — jeder Finger soll jedes Mal an derselben Stelle landen. Schnarrt eine Saite, muss der Finger näher an den Bund, nicht fester drücken.",
          pl: "Ustaw palce na E, cztery powolne uderzenia w dół. Przejdź do A, te same cztery uderzenia. Wróć do E. Celem nie jest szybkość — chodzi o to, by każdy palec za każdym razem trafiał w to samo miejsce. Jeśli struna brzęczy, palec musi być bliżej progu, nie mocniej dociśnięty.",
        },
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Backing in E. Just E and A for now — B7 comes next lesson.",
            no: "Backing i E. Bare E og A foreløpig — B7 kommer neste leksjon.",
            sv: "Backing i E. Bara E och A än så länge — B7 kommer nästa lektion.",
            de: "Backing in E. Vorerst nur E und A — B7 kommt in der nächsten Lektion.",
            pl: "Podkład w E. Na razie tylko E i A — B7 przyjdzie w następnej lekcji.",
          },
        },
        nextTip: {
          en: "Muddy Waters plugged this exact vocabulary into an amplifier and changed everything.",
          no: "Muddy Waters plugget akkurat dette vokabularet inn i en forsterker og endret alt.",
          sv: "Muddy Waters kopplade exakt det här vokabuläret till en förstärkare och förändrade allt.",
          de: "Muddy Waters steckte genau dieses Vokabular in einen Verstärker und veränderte alles.",
          pl: "Muddy Waters podłączył dokładnie to samo słownictwo do wzmacniacza i zmienił wszystko.",
        },
        artistSlug: "muddy-waters",
        illustration: {
          kind: "chord",
          chords: [
            { chord: "E", label: { en: "E chord", no: "E-akkord", sv: "E-ackord", de: "E-Akkord", pl: "Akord E" } },
            { chord: "A", label: { en: "A chord", no: "A-akkord", sv: "A-ackord", de: "A-Akkord", pl: "Akord A" } },
          ],
        },
      },
      {
        id: "guitar-3",
        phase: PHASE_FOUNDATIONS,
        title: { en: "12-Bar, Slow", no: "12-takter, sakte", sv: "12-takter, långsamt", de: "12 Takte, langsam", pl: "12 taktów, powoli" },
        badge: { en: "Full form", no: "Hele formen", sv: "Hela formen", de: "Ganze Form", pl: "Cała forma" },
        goal: {
          en: "Play a full slow 12-bar in E-A-B7 without losing the count.",
          no: "Spille en hel sakte 12-takter i E-A-B7 uten å miste tellingen.",
          sv: "Spela en hel långsam 12-takter i E-A-B7 utan att tappa räkningen.",
          de: "Einen ganzen langsamen 12-Takter in E-A-B7 spielen, ohne den Überblick zu verlieren.",
          pl: "Zagrać cały powolny 12-taktowy schemat E-A-B7, nie gubiąc liczenia.",
        },
        successTest: {
          en: "Can you play the full 12 bars — chords and counting together — without losing your place?",
          no: "Klarer du å spille hele 12-takteren — akkorder og telling sammen — uten å miste tellingen?",
          sv: "Klarar du att spela hela 12-takten — ackord och räkning tillsammans — utan att tappa räkningen?",
          de: "Schaffst du den ganzen 12-Takter — Akkorde und Zählen zusammen — ohne den Überblick zu verlieren?",
          pl: "Czy potrafisz zagrać cały 12-takt — akordy i liczenie razem — nie gubiąc się?",
        },
        steps: {
          en: "Remember I-IV-V from the ears lesson? Here it is with names: E (4 bars), A (2 bars), E (2 bars), B7 (1 bar), A (1 bar), E (2 bars). Count out loud while you change chords — the counting matters more than the chords right now. Slow enough that you never panic is the correct speed.",
          no: "Husker du I-IV-V fra ørelæksjonen? Her er den med navn: E (4 takter), A (2 takter), E (2 takter), B7 (1 takt), A (1 takt), E (2 takter). Tell høyt mens du bytter akkorder — tellingen betyr mer enn akkordene akkurat nå. Sakte nok til at du aldri panikker er riktig fart.",
          sv: "Minns du I-IV-V från örlektionen? Här är den med namn: E (4 takter), A (2 takter), E (2 takter), B7 (1 takt), A (1 takt), E (2 takter). Räkna högt medan du byter ackord — räknandet betyder mer än ackorden just nu. Långsamt nog att du aldrig panikar är rätt tempo.",
          de: "Erinnerst du dich an I-IV-V aus der Ohren-Lektion? Hier mit Namen: E (4 Takte), A (2 Takte), E (2 Takte), B7 (1 Takt), A (1 Takt), E (2 Takte). Zähl laut mit, während du wechselst — das Zählen zählt gerade mehr als die Akkorde. Langsam genug, dass du nie in Panik gerätst, ist das richtige Tempo.",
          pl: "Pamiętasz I-IV-V z lekcji o uszach? Oto ono z nazwami: E (4 takty), A (2 takty), E (2 takty), B7 (1 takt), A (1 takt), E (2 takty). Licz głośno, zmieniając akordy — teraz liczenie liczy się bardziej niż akordy. Właściwe tempo to takie, przy którym nigdy nie wpadasz w panikę.",
        },
        listen: { videoId: "ClpR3fOKPRA", credit: "Buddy Guy", caption: {
          en: "Buddy Guy — \"Feels Like Rain\". Notice how unhurried it is.",
          no: "Buddy Guy — «Feels Like Rain». Legg merke til hvor uhastig den er.",
          sv: "Buddy Guy — \"Feels Like Rain\". Lägg märke till hur ohastig den är.",
          de: "Buddy Guy — „Feels Like Rain“. Achte darauf, wie unaufgeregt das ist.",
          pl: "Buddy Guy — „Feels Like Rain”. Zwróć uwagę, jak bardzo bez pośpiechu to brzmi.",
        }},
        backing: GUITAR_BACKING(),
        nextTip: {
          en: "Buddy Guy is still playing this feeling live today — his profile has more.",
          no: "Buddy Guy spiller fortsatt denne følelsen live i dag — profilen har mer.",
          sv: "Buddy Guy spelar fortfarande den här känslan live idag — profilen har mer.",
          de: "Buddy Guy spielt dieses Gefühl bis heute live — sein Profil hat mehr.",
          pl: "Buddy Guy wciąż gra to uczucie na żywo — na jego profilu znajdziesz więcej.",
        },
        artistSlug: "buddy-guy",
        illustration: {
          kind: "chord",
          chords: [{ chord: "B7", label: { en: "B7 chord", no: "B7-akkord", sv: "B7-ackord", de: "B7-Akkord", pl: "Akord B7" } }],
        },
      },
      {
        id: "guitar-4",
        phase: PHASE_RHYTHM,
        title: { en: "Shuffle", no: "Shuffle", sv: "Shuffle", de: "Shuffle", pl: "Shuffle" },
        badge: { en: "Shuffle", no: "Shuffle", sv: "Shuffle", de: "Shuffle", pl: "Shuffle" },
        goal: {
          en: "Feel the shuffle bounce instead of playing straight, even eighth notes.",
          no: "Kjenne shuffle-gyngen i stedet for å spille rette, jevne åttendedeler.",
          sv: "Känna shuffle-gungan i stället för att spela raka, jämna åttondelar.",
          de: "Den Shuffle-Groove spüren statt gerader, gleichmäßiger Achtel.",
          pl: "Poczuć kołyszący rytm shuffle zamiast prostych, równych ósemek.",
        },
        successTest: {
          en: "Can you hold the long-short shuffle feel for a full minute on one chord?",
          no: "Klarer du å holde den lang-kort-følelsen i shufflen i ett helt minutt på én akkord?",
          sv: "Klarar du att hålla den lång-kort-känslan i shufflen i en hel minut på ett ackord?",
          de: "Schaffst du es, das Lang-kurz-Gefühl des Shuffles eine ganze Minute lang auf einem Akkord zu halten?",
          pl: "Czy potrafisz utrzymać wyczucie długo-krótko w shufflu przez całą minutę na jednym akordzie?",
        },
        steps: {
          en: "Long-short, long-short — that's a shuffle, not long-long-long-long. Play it on a single E chord first: two notes per beat, but the first one gets more time than the second, like a limping walk. Once that bounce feels natural on one chord, carry it into the full 12-bar from lesson 3.",
          no: "Lang-kort, lang-kort — det er en shuffle, ikke lang-lang-lang-lang. Spill den på en enkelt E-akkord først: to toner per slag, men den første får mer tid enn den andre, som en haltende gange. Når gyngen føles naturlig på én akkord, ta den med inn i hele 12-takteren fra leksjon 3.",
          sv: "Lång-kort, lång-kort — det är en shuffle, inte lång-lång-lång-lång. Spela den på ett enda E-ackord först: två toner per slag, men den första får mer tid än den andra, som en haltande gång. När gungan känns naturlig på ett ackord, ta med den in i hela 12-takten från lektion 3.",
          de: "Lang-kurz, lang-kurz — das ist ein Shuffle, nicht lang-lang-lang-lang. Spiel ihn zuerst auf einem einzigen E-Akkord: zwei Töne pro Schlag, aber der erste bekommt mehr Zeit als der zweite, wie ein hinkender Gang. Fühlt sich der Groove auf einem Akkord natürlich an, nimm ihn mit in den vollen 12-Takter aus Lektion 3.",
          pl: "Długo-krótko, długo-krótko — to jest shuffle, nie długo-długo-długo-długo. Zagraj to najpierw na samym akordzie E: dwie nuty na uderzenie, ale pierwsza trwa dłużej niż druga, jak kulawy chód. Gdy to kołysanie stanie się naturalne na jednym akordzie, przenieś je do całego 12-taktu z lekcji 3.",
        },
        listen: { videoId: "i0hVIrQm0KM", credit: "Stevie Ray Vaughan", caption: {
          en: "Stevie Ray Vaughan — \"Pride and Joy\". This is where this bounce can go, eventually — not what to copy today.",
          no: "Stevie Ray Vaughan — «Pride and Joy». Dit kan denne gyngen komme, etter hvert — ikke noe å kopiere i dag.",
          sv: "Stevie Ray Vaughan — \"Pride and Joy\". Dit kan den här gungan komma, så småningom — inget att kopiera idag.",
          de: "Stevie Ray Vaughan — „Pride and Joy“. Dahin kann dieser Groove irgendwann führen — nicht das, was du heute kopieren sollst.",
          pl: "Stevie Ray Vaughan — „Pride and Joy”. Tam to kołysanie może kiedyś zaprowadzić — nie po to, żeby to kopiować dzisiaj.",
        }},
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Same slow track — add the limp in your right hand.",
            no: "Samme sakte spor — legg til haltingen med høyrehånden selv.",
            sv: "Samma långsamma spår — lägg till haltandet med högerhanden själv.",
            de: "Derselbe langsame Track — den hinkenden Groove fügst du selbst mit der rechten Hand hinzu.",
            pl: "Ten sam wolny podkład — kulawy rytm dodajesz sam prawą ręką.",
          },
        },
        temporaryNote: {
          en: "Temporary: no verified up-tempo E-shuffle backing track exists yet — this lesson reuses the slow track until one is found.",
          no: "Midlertidig: det finnes ennå ingen verifisert rask E-shuffle-backing — denne leksjonen gjenbruker det sakte sporet inntil videre.",
          sv: "Tillfälligt: det finns ännu ingen verifierad snabb E-shuffle-backing — den här lektionen återanvänder det långsamma spåret tills vidare.",
          de: "Vorübergehend: Es gibt noch kein verifiziertes schnelleres E-Shuffle-Backing — diese Lektion nutzt vorerst weiter den langsamen Track.",
          pl: "Tymczasowo: nie ma jeszcze zweryfikowanego szybszego podkładu E-shuffle — ta lekcja na razie korzysta z wolnego podkładu.",
        },
        nextTip: {
          en: "Stevie Ray Vaughan's whole catalogue lives on this same bounce — his profile is next.",
          no: "Hele katalogen til Stevie Ray Vaughan lever på denne samme gyngen — profilen er neste steg.",
          sv: "Hela Stevie Ray Vaughans katalog lever på den här gungan — profilen är nästa steg.",
          de: "Stevie Ray Vaughans gesamter Katalog lebt von diesem Groove — sein Profil ist der nächste Schritt.",
          pl: "Cały katalog Stevie'ego Raya Vaughana żyje tym samym kołysaniem — jego profil to następny krok.",
        },
        artistSlug: "stevie-ray-vaughan",
        illustration: {
          kind: "chord",
          chords: [{ chord: "E", label: { en: "E chord", no: "E-akkord", sv: "E-ackord", de: "E-Akkord", pl: "Akord E" } }],
        },
      },
      {
        id: "guitar-muting",
        phase: PHASE_RHYTHM,
        title: { en: "Muting & Accents", no: "Demping og aksenter", sv: "Dämpning och accenter", de: "Dämpfen & Akzente", pl: "Tłumienie i akcenty" },
        badge: { en: "Muting", no: "Demping", sv: "Dämpning", de: "Dämpfen", pl: "Tłumienie" },
        goal: {
          en: "Stop a chord dead the instant you want silence, and make one beat jump out louder than the rest.",
          no: "Stoppe en akkord momentant når du vil ha stillhet, og få ett slag til å hoppe tydeligere ut enn de andre.",
          sv: "Stoppa ett ackord direkt när du vill ha tystnad, och få ett slag att hoppa ut tydligare än de andra.",
          de: "Einen Akkord sofort stoppen, wenn du Stille willst, und einen Schlag lauter hervortreten lassen als die anderen.",
          pl: "Natychmiast wyciszyć akord, gdy chcesz ciszy, i sprawić, by jedno uderzenie wybiło się głośniej od reszty.",
        },
        successTest: {
          en: "Can you strum a chord and stop the ring dead within half a second, without lifting your fingers off the strings?",
          no: "Klarer du å strumme en akkord og stoppe klangen momentant, uten å løfte fingrene av strengene?",
          sv: "Klarar du att strumma ett ackord och stoppa klangen direkt, utan att lyfta fingrarna från strängarna?",
          de: "Schaffst du es, einen Akkord anzuschlagen und den Klang sofort zu stoppen, ohne die Finger von den Saiten zu heben?",
          pl: "Czy potrafisz uderzyć akord i natychmiast wyciszyć dźwięk, nie odrywając palców od strun?",
        },
        steps: {
          en: "Strum an E chord, let it ring, then relax your fretting fingers just enough to kill the sound without lifting them off the strings — that's muting. Try it on every second strum: ring, mute, ring, mute. Once that feels natural, add an accent: strum the first beat of each bar a little harder than the other three. That contrast — some notes loud and alive, some notes choked dead — is most of what makes blues rhythm feel human instead of like a metronome.",
          no: "Strum en E-akkord, la den ringe, slapp så av grepfingrene akkurat nok til å kvele lyden uten å løfte dem av strengene — det er demping. Prøv det på annenhver strum: ring, demp, ring, demp. Når det føles naturlig, legg til en aksent: strum første slag i hver takt litt hardere enn de tre andre. Den kontrasten — noen toner høye og levende, andre kvalt — er mesteparten av det som gjør bluesrytme menneskelig i stedet for en metronom.",
          sv: "Strumma ett E-ackord, låt det klinga, slappna sedan av greppfingrarna precis nog för att döda ljudet utan att lyfta dem från strängarna — det är dämpning. Testa det varannan strumma: klinga, dämpa, klinga, dämpa. När det känns naturligt, lägg till en accent: strumma första slaget i varje takt lite hårdare än de andra tre. Den kontrasten — vissa toner höga och levande, andra kvävda — är det mesta av vad som gör bluesrytm mänsklig istället för en metronom.",
          de: "Schlag einen E-Akkord an, lass ihn klingen, entspann dann die Grifffinger gerade so viel, dass der Klang stirbt, ohne die Finger von den Saiten zu heben — das ist Dämpfen. Probier es bei jedem zweiten Anschlag: klingen, dämpfen, klingen, dämpfen. Fühlt sich das natürlich an, füge einen Akzent hinzu: schlag den ersten Schlag jedes Takts etwas fester an als die anderen drei. Dieser Kontrast — manche Töne laut und lebendig, andere abgewürgt — macht Blues-Rhythmus menschlich statt metronomisch.",
          pl: "Uderz akord E, pozwól mu wybrzmieć, potem rozluźnij palce chwytające dokładnie na tyle, by zabić dźwięk, nie odrywając ich od strun — to jest tłumienie. Spróbuj co drugie uderzenie: dźwięk, tłumienie, dźwięk, tłumienie. Gdy poczujesz się z tym naturalnie, dodaj akcent: uderzaj pierwsze uderzenie w każdym takcie odrobinę mocniej niż pozostałe trzy. Ten kontrast — niektóre dźwięki głośne i żywe, inne uduszone — to większość tego, co sprawia, że rytm bluesowy brzmi ludzko, a nie jak metronom.",
        },
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Backing in E. Try muting on the off-beats, then accent beat one of every bar.",
            no: "Backing i E. Prøv demping på mellomslagene, aksentuer så første slag i hver takt.",
            sv: "Backing i E. Testa dämpning på mellanslagen, accentuera sedan första slaget i varje takt.",
            de: "Backing in E. Probier Dämpfen auf den Zwischenschlägen, dann akzentuiere den ersten Schlag jedes Takts.",
            pl: "Podkład w E. Spróbuj tłumienia na słabych uderzeniach, potem akcentuj pierwsze uderzenie w każdym takcie.",
          },
        },
        nextTip: {
          en: "This push-and-pull is all over Muddy Waters' Chicago sound — his profile is worth another look.",
          no: "Denne dra-og-slipp-følelsen er overalt i Muddy Waters' Chicago-lyd — profilen hans er verdt et nytt blikk.",
          sv: "Den här dra-och-släpp-känslan finns överallt i Muddy Waters Chicago-ljud — hans profil är värd en till titt.",
          de: "Dieses Ziehen-und-Loslassen steckt überall im Chicago-Sound von Muddy Waters — sein Profil ist einen weiteren Blick wert.",
          pl: "To przeciąganie i puszczanie jest obecne wszędzie w chicagowskim brzmieniu Muddy'ego Watersa — warto ponownie zajrzeć na jego profil.",
        },
        artistSlug: "muddy-waters",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-5",
        phase: PHASE_TECHNIQUE,
        title: { en: "One Taste of Slide", no: "Én smak av slide", sv: "En smak av slide", de: "Ein Geschmack Slide", pl: "Jeden smak slide'a" },
        badge: { en: "Slide", no: "Slide", sv: "Slide", de: "Slide", pl: "Slide" },
        goal: {
          en: "Get one clean, singing slide note on one string.",
          no: "Få én ren, syngende slide-tone på én streng.",
          sv: "Få en ren, sjungande slide-ton på en sträng.",
          de: "Einen klaren, singenden Slide-Ton auf einer Saite hinbekommen.",
          pl: "Uzyskać jedną czystą, śpiewną nutę slide na jednej strunie.",
        },
        successTest: {
          en: "Can you get one slide note to ring out clean, with no fret buzz or rattle?",
          no: "Klarer du å få én slide-tone til å ringe rent, uten båndsurr eller klapring?",
          sv: "Klarar du att få en slide-ton att klinga rent, utan bandsurr eller skrammel?",
          de: "Schaffst du es, einen Slide-Ton klar ausklingen zu lassen, ohne Bundschnarren oder Klappern?",
          pl: "Czy potrafisz uzyskać jedną czystą, dźwięczną nutę slide, bez brzęczenia progów czy grzechotania?",
        },
        steps: {
          en: "Put a slide on your ring or pinky finger — keep your other fingers free. Rest it lightly right over the fret wire, not behind it like normal fretting, and barely touching the string. Pick one string, slide slowly up two frets and back, and let each end ring before you move. Too much pressure kills the singing tone — this is the one lesson where less is more.",
          no: "Sett en slide på ringfingeren eller lillefingeren — hold de andre fingrene fri. La den hvile lett rett over båndstaget, ikke bak det som ved vanlig grep, og så vidt berøre strengen. Plukk én streng, gli sakte opp to bånd og tilbake, og la hver ende ringe før du beveger deg. For mye trykk dreper den syngende tonen — dette er leksjonen der mindre er mer.",
          sv: "Sätt en slide på ringfingret eller lillfingret — håll de andra fingrarna fria. Låt den vila lätt precis över bandstaget, inte bakom det som vid vanligt grepp, och nätt och jämnt röra strängen. Plocka en sträng, glid långsamt upp två band och tillbaka, och låt varje ände klinga innan du rör dig. För mycket tryck dödar den sjungande tonen — det här är lektionen där mindre är mer.",
          de: "Setz einen Slide auf Ring- oder kleinen Finger — die anderen Finger bleiben frei. Lass ihn locker direkt über dem Bundstäbchen liegen, nicht dahinter wie beim normalen Greifen, und berühre die Saite nur leicht. Zupf eine Saite, gleite langsam zwei Bünde hoch und zurück, und lass jedes Ende ausklingen, bevor du weitermachst. Zu viel Druck tötet den singenden Ton — hier gilt: weniger ist mehr.",
          pl: "Załóż slide na palec serdeczny lub mały — pozostałe palce zostają wolne. Oprzyj go lekko dokładnie nad progiem, nie za nim jak przy zwykłym chwycie, i ledwo dotykaj struny. Uderz jedną strunę, przesuń powoli o dwa progi w górę i z powrotem, pozwalając każdemu końcowi wybrzmieć zanim ruszysz dalej. Zbyt duży nacisk zabija śpiewny ton — to jedna lekcja, w której mniej znaczy więcej.",
        },
        // TODO(owner): no genuine slide-guitar demonstration video is linked
        // anywhere in the course. Elmore James's "Dust My Broom" (already
        // verified and linked on his own artist profile, SOhQP5wHNHQ) was
        // considered as a replacement here, but sources disagree on whether
        // he played it in open E or open D -- since this course locks
        // LISTEN/BACKING to a verified, matching key, an unresolved key
        // claim isn't safe to ship. Keeping Buddy Guy's clip with an honest
        // "not a slide demo" caption until a real, key-confirmed slide clip
        // turns up.
        listen: { videoId: "ClpR3fOKPRA", credit: "Buddy Guy", caption: {
          en: "Buddy Guy again — \"Feels Like Rain\". Not a slide demo, just the same unhurried feel you want here.",
          no: "Buddy Guy igjen — «Feels Like Rain». Ikke en slide-demo, bare den samme uhastige følelsen du vil ha her.",
          sv: "Buddy Guy igen — \"Feels Like Rain\". Ingen slide-demo, bara samma ohastiga känsla du vill ha här.",
          de: "Buddy Guy noch einmal — „Feels Like Rain“. Keine Slide-Demo, nur dasselbe unaufgeregte Gefühl, das du hier willst.",
          pl: "Buddy Guy znowu — „Feels Like Rain”. To nie demo slide'a, po prostu ten sam spokojny nastrój, którego tu szukasz.",
        }},
        backing: GUITAR_BACKING(),
        nextTip: {
          en: "Elmore James built his whole career on this sound — his profile has the story.",
          no: "Elmore James bygde hele karrieren sin på denne lyden — profilen hans har historien.",
          sv: "Elmore James byggde hela sin karriär på det här ljudet — hans profil har historien.",
          de: "Elmore James baute seine gesamte Karriere auf diesem Sound auf — sein Profil erzählt die Geschichte.",
          pl: "Elmore James zbudował na tym brzmieniu całą swoją karierę — jego profil zawiera tę historię.",
        },
        artistSlug: "elmore-james",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-hammerpull",
        phase: PHASE_TECHNIQUE,
        title: { en: "Hammer-ons & Pull-offs", no: "Hammer-on og pull-off", sv: "Hammer-on och pull-off", de: "Hammer-on & Pull-off", pl: "Hammer-on i pull-off" },
        badge: { en: "Hammer/pull", no: "Hammer/pull", sv: "Hammer/pull", de: "Hammer/Pull", pl: "Hammer/pull" },
        goal: {
          en: "Sound two notes from a single pick stroke — one hand movement doing the work of two.",
          no: "Få to toner ut av ett enkelt plekterslag — én håndbevegelse som gjør jobben til to.",
          sv: "Få ut två toner från ett enda plektrumslag — en handrörelse som gör jobbet av två.",
          de: "Zwei Töne aus einem einzigen Anschlag holen — eine Handbewegung erledigt die Arbeit von zweien.",
          pl: "Uzyskać dwa dźwięki z jednego uderzenia kostką — jeden ruch ręki wykonujący pracę dwóch.",
        },
        successTest: {
          en: "Can you hammer-on and pull-off five times in a row without picking every single note?",
          no: "Klarer du å hamre på og dra av fem ganger på rad uten å plukke hver eneste tone?",
          sv: "Klarar du att hamra på och dra av fem gånger i rad utan att plocka varenda ton?",
          de: "Schaffst du fünf Hammer-ons und Pull-offs hintereinander, ohne jeden einzelnen Ton anzuschlagen?",
          pl: "Czy potrafisz wykonać hammer-on i pull-off pięć razy z rzędu, nie uderzając w każdy pojedynczy dźwięk?",
        },
        steps: {
          en: "Pick the open low E string, then, while it's still ringing, snap a finger down onto the 2nd fret hard and fast — that second note should sound on its own, no second pick stroke. That's a hammer-on. Now the reverse: fret that same 2nd fret, pick it, then pull your finger sideways off the string as you lift it, plucking it slightly on the way — that's a pull-off, and it drops you back to the open string. Go back and forth: hammer-on, pull-off, hammer-on, pull-off. Both should sound smooth and connected, not like two separate stabs.",
          no: "Plukk den åpne lave E-strengen, mens den fremdeles ringer, knips en finger raskt og hardt ned på 2. bånd — den andre tonen skal lyde av seg selv, uten et nytt plekterslag. Det er en hammer-on. Nå omvendt: grip det samme 2. båndet, plukk det, dra så fingeren sidelengs av strengen mens du løfter den, og nap den litt på veien — det er en pull-off, og den bringer deg tilbake til den åpne strengen. Gå frem og tilbake: hammer-on, pull-off, hammer-on, pull-off. Begge skal lyde jevne og sammenhengende, ikke som to separate støt.",
          sv: "Plocka den öppna låga E-strängen, medan den fortfarande klingar, knäpp ett finger snabbt och hårt ner på det andra bandet — den andra tonen ska låta av sig själv, utan ett nytt plektrumslag. Det är en hammer-on. Nu tvärtom: greppa samma andra band, plocka den, dra sedan fingret i sidled av strängen medan du lyfter det, och nyp den lite på vägen — det är en pull-off, och den för dig tillbaka till den öppna strängen. Gå fram och tillbaka: hammer-on, pull-off, hammer-on, pull-off. Båda ska låta jämna och sammanhängande, inte som två separata stötar.",
          de: "Zupf die offene tiefe E-Saite, und während sie noch klingt, schlag schnell und fest einen Finger auf den 2. Bund — der zweite Ton soll von selbst erklingen, ohne erneuten Anschlag. Das ist ein Hammer-on. Jetzt umgekehrt: greif denselben 2. Bund, zupf ihn, zieh dann den Finger seitlich von der Saite, während du ihn abhebst, und zupfe dabei leicht — das ist ein Pull-off, er bringt dich zurück zur offenen Saite. Wechsle hin und her: Hammer-on, Pull-off, Hammer-on, Pull-off. Beide sollen glatt und verbunden klingen, nicht wie zwei getrennte Stöße.",
          pl: "Uderz otwartą, niską strunę E, a gdy wciąż dźwięczy, szybko i mocno uderz palcem w drugi próg — ten drugi dźwięk powinien zabrzmieć sam, bez ponownego uderzenia kostką. To jest hammer-on. Teraz odwrotnie: przyciśnij ten sam drugi próg, uderz w strunę, a następnie zsuń palec w bok ze struny, unosząc go, lekko ją przy tym szarpiąc — to jest pull-off, który sprowadza cię z powrotem do otwartej struny. Przełączaj się: hammer-on, pull-off, hammer-on, pull-off. Oba powinny brzmieć gładko i spójnie, nie jak dwa osobne szarpnięcia.",
        },
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Backing in E. Try the hammer-on/pull-off on the low E string while this plays underneath.",
            no: "Backing i E. Prøv hammer-on/pull-off på lave E-strengen mens dette spiller under.",
            sv: "Backing i E. Testa hammer-on/pull-off på låga E-strängen medan det här spelar under.",
            de: "Backing in E. Probier Hammer-on/Pull-off auf der tiefen E-Saite, während das darunter spielt.",
            pl: "Podkład w E. Spróbuj hammer-on/pull-off na niskiej strunie E, gdy to gra w tle.",
          },
        },
        nextTip: {
          en: "This little hammer-and-pull trick is Delta blues 101 — Robert Johnson's profile is where that story starts.",
          no: "Dette lille hammer-og-pull-trikset er Delta-blues 101 — profilen til Robert Johnson er der den historien starter.",
          sv: "Det här lilla hammer-och-pull-tricket är Delta-blues 101 — Robert Johnsons profil är där den historien börjar.",
          de: "Dieser kleine Hammer-und-Pull-Trick ist Delta-Blues-Grundkurs — Robert Johnsons Profil ist, wo diese Geschichte beginnt.",
          pl: "Ta mała sztuczka hammer-and-pull to podstawy Delta blues — profil Roberta Johnsona to miejsce, gdzie ta historia się zaczyna.",
        },
        artistSlug: "robert-johnson",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-bendvibrato",
        phase: PHASE_TECHNIQUE,
        title: { en: "Bending & Vibrato", no: "Bending og vibrato", sv: "Bending och vibrato", de: "Bending & Vibrato", pl: "Bending i vibrato" },
        badge: { en: "Bend & vibrato", no: "Bend og vibrato", sv: "Bend och vibrato", de: "Bend & Vibrato", pl: "Bend i vibrato" },
        goal: {
          en: "Push a string until the pitch rises into the note you want, then make a held note shimmer instead of sitting flat.",
          no: "Skyve en streng til tonen stiger opp til den du vil ha, og få en holdt tone til å skjelve i stedet for å ligge flatt.",
          sv: "Skjuta en sträng tills tonen stiger till den du vill ha, och få en hållen ton att skimra istället för att ligga platt.",
          de: "Eine Saite so weit drücken, dass die Tonhöhe zum gewünschten Ton ansteigt, und einen gehaltenen Ton schimmern statt flach klingen lassen.",
          pl: "Przesuwać strunę, aż wysokość dźwięku wzrośnie do pożądanej nuty, i sprawić, by trzymany dźwięk migotał zamiast brzmieć płasko.",
        },
        successTest: {
          en: "Can you bend a note up to a clearly different pitch, and hear the difference with your eyes closed?",
          no: "Klarer du å bende en tone opp til en tydelig annen tonehøyde, og høre forskjellen med lukkede øyne?",
          sv: "Klarar du att benda en ton upp till en tydligt annan tonhöjd, och höra skillnaden med slutna ögon?",
          de: "Schaffst du es, einen Ton per Bend zu einer deutlich anderen Tonhöhe zu ziehen und den Unterschied mit geschlossenen Augen zu hören?",
          pl: "Czy potrafisz wygiąć dźwięk (bend) do wyraźnie innej wysokości i usłyszeć różnicę z zamkniętymi oczami?",
        },
        steps: {
          en: "Fret the 3rd string, 4th fret, with your ring finger, backed up by your middle and index fingers behind it for strength. Pick the note, then push the string up toward the ceiling (toward the low strings) using your whole hand, not just the finger. Listen — don't stop pushing until the pitch actually reaches the next note up, not just \"sounds a bit higher.\" That's a half-step bend. Once that's reliable, try pushing twice as far for a whole-step bend. For vibrato: bend very slightly and release, over and over, fast and small, on a held note — like a shiver, not a big wobble. Bending is a listening skill before it's a finger skill: your ear decides when the pitch has arrived, not your hand.",
          no: "Grip 3. streng, 4. bånd, med ringfingeren, støttet av langfinger og pekefinger bak for styrke. Plukk tonen, skyv så strengen opp mot taket (mot de lave strengene) med hele hånden, ikke bare fingeren. Lytt — ikke slutt å skyve før tonen faktisk når den neste tonen over, ikke bare «høres litt høyere ut». Det er en halvtone-bend. Når det sitter, prøv å skyve dobbelt så langt for en heltone-bend. For vibrato: bend veldig lett og slipp, om og om igjen, raskt og lite, på en holdt tone — som en skjelving, ikke en stor vingling. Bending er en lytteferdighet før den er en fingerferdighet: øret ditt avgjør når tonen har kommet frem, ikke hånden.",
          sv: "Greppa 3:e strängen, 4:e bandet, med ringfingret, backat av lång- och pekfinger bakom för styrka. Plocka tonen, skjut sedan strängen upp mot taket (mot de låga strängarna) med hela handen, inte bara fingret. Lyssna — sluta inte skjuta förrän tonen faktiskt når nästa ton uppåt, inte bara \"låter lite högre\". Det är en halvtonsbend. När det sitter, testa att skjuta dubbelt så långt för en heltonsbend. För vibrato: benda mycket lätt och släpp, om och om igen, snabbt och litet, på en hållen ton — som en skiftning, inte en stor vingling. Bending är en lyssningsfärdighet innan den är en fingerfärdighet: ditt öra avgör när tonen har anlänt, inte handen.",
          de: "Greif die 3. Saite, 4. Bund, mit dem Ringfinger, gestützt von Mittel- und Zeigefinger dahinter für Kraft. Zupf den Ton, drück dann die Saite mit der ganzen Hand nach oben (Richtung tiefe Saiten), nicht nur mit dem Finger. Hör hin — hör nicht auf zu drücken, bis die Tonhöhe wirklich den nächsten Ton erreicht, nicht nur \"klingt etwas höher\". Das ist ein Halbton-Bend. Klappt das zuverlässig, probier doppelt so weit zu drücken für einen Ganzton-Bend. Für Vibrato: beug ganz leicht und lass los, wieder und wieder, schnell und klein, auf einem gehaltenen Ton — wie ein Zittern, kein großes Wackeln. Bending ist zuerst eine Hörfähigkeit, dann erst eine Fingerfähigkeit: dein Ohr entscheidet, wann der Ton angekommen ist, nicht die Hand.",
          pl: "Przyciśnij trzecią strunę na 4. progu palcem serdecznym, wspierając go od tyłu środkowym i wskazującym dla siły. Uderz w strunę, a potem popchnij ją w górę (w stronę niskich strun) całą dłonią, nie tylko palcem. Słuchaj — nie przestawaj pchać, aż wysokość dźwięku faktycznie osiągnie kolejną nutę, a nie tylko „brzmi trochę wyżej”. To jest bend o pół tonu. Gdy to już pewnie wychodzi, spróbuj pchnąć dwa razy dalej dla bendu o cały ton. Dla vibrato: wykonuj bardzo lekki bend i puszczaj, w kółko, szybko i subtelnie, na trzymanym dźwięku — jak drżenie, nie duże kołysanie. Bending to najpierw umiejętność słuchania, a dopiero potem umiejętność palców: to ucho decyduje, kiedy dźwięk dotarł na miejsce, nie ręka.",
        },
        listen: { videoId: "SgXSomPE_FY", credit: "B.B. King", caption: {
          en: "B.B. King — \"The Thrill Is Gone\", live at Crossroads. Listen for how his vibrato and bends do the singing — a note never just sits still.",
          no: "B.B. King — «The Thrill Is Gone», live på Crossroads. Legg merke til hvordan vibratoen og bendene synger for ham — en tone ligger aldri helt stille.",
          sv: "B.B. King — \"The Thrill Is Gone\", live på Crossroads. Lägg märke till hur vibratot och bendarna sjunger åt honom — en ton ligger aldrig helt still.",
          de: "B.B. King — „The Thrill Is Gone“, live bei Crossroads. Achte darauf, wie sein Vibrato und seine Bends für ihn singen — ein Ton liegt nie einfach still.",
          pl: "B.B. King — „The Thrill Is Gone”, live na Crossroads. Zwróć uwagę, jak jego vibrato i bendy śpiewają za niego — dźwięk nigdy po prostu nie stoi w miejscu.",
        }},
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Backing in E. Bend into a note on the 3rd string, then add vibrato while it rings.",
            no: "Backing i E. Bend inn i en tone på 3. streng, legg så til vibrato mens den ringer.",
            sv: "Backing i E. Benda in i en ton på 3:e strängen, lägg sedan till vibrato medan den klingar.",
            de: "Backing in E. Bend in einen Ton auf der 3. Saite, füge dann Vibrato hinzu, während er klingt.",
            pl: "Podkład w E. Wygnij dźwięk na 3. strunie, a potem dodaj vibrato, gdy dźwięczy.",
          },
        },
        nextTip: {
          en: "B.B. King is one way into this sound. Albert King is another — his whole style leans hard on this same move.",
          no: "B.B. King er én vei inn i denne lyden. Albert King er en annen — hele stilen hans lener seg tungt på akkurat denne bevegelsen.",
          sv: "B.B. King är en väg in i det här ljudet. Albert King är en annan — hela hans stil lutar sig tungt mot just den här rörelsen.",
          de: "B.B. King ist ein Weg zu diesem Sound. Albert King ist ein anderer — sein ganzer Stil stützt sich stark auf genau diese Bewegung.",
          pl: "B.B. King to jedna droga do tego brzmienia. Albert King to inna — cały jego styl mocno opiera się właśnie na tym ruchu.",
        },
        artistSlug: "bb-king",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-pentatonic",
        phase: PHASE_LANGUAGE,
        title: { en: "Your First Blues Notes", no: "Dine første bluestoner", sv: "Dina första bluestoner", de: "Deine ersten Blues-Töne", pl: "Twoje pierwsze bluesowe dźwięki" },
        badge: { en: "5 notes", no: "5 toner", sv: "5 toner", de: "5 Töne", pl: "5 dźwięków" },
        goal: {
          en: "Learn the small handful of notes almost every blues lick is built from, without reading a scale diagram like homework.",
          no: "Lære den lille håndfullen toner nesten hver eneste blueslick er bygget av, uten å lese et skaladiagram som lekser.",
          sv: "Lära dig den lilla handfull toner nästan varje blueslick är byggd av, utan att läsa ett skaldiagram som läxa.",
          de: "Die kleine Handvoll Töne lernen, aus denen fast jedes Blues-Lick besteht — ohne ein Tonleiterdiagramm wie Hausaufgaben zu lesen.",
          pl: "Poznać garstkę dźwięków, z których zbudowany jest niemal każdy bluesowy lick, bez czytania diagramu skali jak zadania domowego.",
        },
        successTest: {
          en: "Can you play all five notes up and back down without stopping to look at your fingers?",
          no: "Klarer du å spille alle fem tonene opp og ned uten å stoppe for å se på fingrene?",
          sv: "Klarar du att spela alla fem tonerna upp och ner utan att stanna för att titta på fingrarna?",
          de: "Schaffst du alle fünf Töne rauf und runter, ohne anzuhalten, um auf deine Finger zu schauen?",
          pl: "Czy potrafisz zagrać wszystkie pięć dźwięków w górę i w dół, nie zatrzymując się, by spojrzeć na palce?",
        },
        steps: {
          en: "On the low E string, play frets 0, 3, 5, 7 and 8, then come back down the same way. That's it — that's the minor pentatonic \"blues box\" in E, the five-note set that almost every blues solo you've ever heard draws from. Don't worry about names or numbers yet. Just play those five frets up and down, slowly, until your fingers know where they live without you looking. Once that's comfortable, try landing on fret 3 and just staying there a moment before moving on — that's already a phrase, not just a scale.",
          no: "På lave E-streng, spill bånd 0, 3, 5, 7 og 8, kom så tilbake samme vei. Det er alt — det er den mollpentatone «blues-boksen» i E, de fem tonene nesten hvert eneste bluessolo du har hørt henter fra. Ikke bry deg om navn eller tall ennå. Bare spill de fem båndene opp og ned, sakte, til fingrene kjenner dem uten at du ser. Når det sitter, prøv å lande på bånd 3 og bare bli der et øyeblikk før du går videre — det er allerede en frase, ikke bare en skala.",
          sv: "På låga E-strängen, spela band 0, 3, 5, 7 och 8, kom sedan tillbaka samma väg. Det är allt — det är den mollpentatona \"blues-lådan\" i E, de fem tonerna nästan varje bluessolo du hört hämtar från. Bry dig inte om namn eller nummer än. Spela bara de fem banden upp och ner, långsamt, tills fingrarna känner dem utan att du tittar. När det känns bekvämt, testa att landa på band 3 och bara stanna där ett ögonblick innan du går vidare — det är redan en fras, inte bara en skala.",
          de: "Auf der tiefen E-Saite spiel Bund 0, 3, 5, 7 und 8, dann geh denselben Weg zurück. Das ist alles — das ist die Moll-Pentatonik-„Blues-Box“ in E, die fünf Töne, aus denen fast jedes Blues-Solo schöpft, das du je gehört hast. Kümmere dich noch nicht um Namen oder Zahlen. Spiel einfach diese fünf Bünde rauf und runter, langsam, bis deine Finger wissen, wo sie liegen, ohne hinzusehen. Fühlt sich das bequem an, probier auf Bund 3 zu landen und dort kurz zu bleiben, bevor du weitermachst — das ist bereits eine Phrase, keine bloße Tonleiter.",
          pl: "Na niskiej strunie E zagraj progi 0, 3, 5, 7 i 8, a potem wróć tą samą drogą. To wszystko — to jest molowa pentatonika, „bluesowe pudełko” w E, pięć dźwięków, z których czerpie niemal każde bluesowe solo, jakie kiedykolwiek słyszałeś. Nie przejmuj się jeszcze nazwami ani numerami. Po prostu graj te pięć progów w górę i w dół, powoli, aż palce będą je znać bez patrzenia. Gdy poczujesz się swobodnie, spróbuj wylądować na progu 3 i zostać tam chwilę, zanim pójdziesz dalej — to już fraza, nie tylko skala.",
        },
        listen: { videoId: "i0hVIrQm0KM", credit: "Stevie Ray Vaughan", caption: {
          en: "Stevie Ray Vaughan again — \"Pride and Joy\". Almost everything he plays here comes from this same small handful of notes.",
          no: "Stevie Ray Vaughan igjen — «Pride and Joy». Nesten alt han spiller her kommer fra akkurat denne lille håndfullen toner.",
          sv: "Stevie Ray Vaughan igen — \"Pride and Joy\". Nästan allt han spelar här kommer från just den här lilla handfull toner.",
          de: "Stevie Ray Vaughan noch einmal — „Pride and Joy“. Fast alles, was er hier spielt, kommt aus genau dieser kleinen Handvoll Töne.",
          pl: "Stevie Ray Vaughan znowu — „Pride and Joy”. Niemal wszystko, co tu gra, pochodzi właśnie z tej garstki dźwięków.",
        }},
        backing: GUITAR_BACKING(),
        nextTip: {
          en: "Robert Johnson was already leaning on this same five-note shape decades before it had a name — his profile is the root of all this.",
          no: "Robert Johnson lente seg allerede på akkurat denne femtone-formen tiår før den hadde et navn — profilen hans er roten til alt dette.",
          sv: "Robert Johnson lutade sig redan mot just den här femtonsformen decennier innan den hade ett namn — hans profil är roten till allt det här.",
          de: "Robert Johnson stützte sich schon Jahrzehnte, bevor sie einen Namen hatte, auf genau diese Fünf-Ton-Form — sein Profil ist die Wurzel von all dem.",
          pl: "Robert Johnson opierał się na dokładnie tym samym pięciodźwiękowym kształcie dziesiątki lat, zanim ten w ogóle miał nazwę — jego profil to korzeń tego wszystkiego.",
        },
        artistSlug: "robert-johnson",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-space",
        phase: PHASE_LANGUAGE,
        title: { en: "Call, Response & Space", no: "Kall, svar og rom", sv: "Kall, svar och rum", de: "Ruf, Antwort & Raum", pl: "Wołanie, odpowiedź i przestrzeń" },
        badge: { en: "Space", no: "Rom", sv: "Rum", de: "Raum", pl: "Przestrzeń" },
        goal: {
          en: "Play a short phrase, then deliberately do nothing — and hear why that silence is doing real musical work.",
          no: "Spille en kort frase, og så bevisst ikke gjøre noe — og høre hvorfor den stillheten gjør et ekte musikalsk arbeid.",
          sv: "Spela en kort fras, och sedan medvetet göra ingenting — och höra varför den tystnaden gör ett riktigt musikaliskt jobb.",
          de: "Eine kurze Phrase spielen und dann bewusst nichts tun — und hören, warum diese Stille echte musikalische Arbeit leistet.",
          pl: "Zagrać krótką frazę, a potem świadomie nic nie robić — i usłyszeć, dlaczego ta cisza wykonuje prawdziwą muzyczną pracę.",
        },
        successTest: {
          en: "Can you play a short phrase, then hold silence for two full beats before answering it?",
          no: "Klarer du å spille en kort frase, og så holde stillhet i to hele slag før du svarer på den?",
          sv: "Klarar du att spela en kort fras, och sedan hålla tystnad i två hela slag innan du svarar på den?",
          de: "Schaffst du eine kurze Phrase zu spielen und dann zwei volle Schläge zu schweigen, bevor du antwortest?",
          pl: "Czy potrafisz zagrać krótką frazę, a potem zachować ciszę przez dwa pełne uderzenia, zanim na nią odpowiesz?",
        },
        steps: {
          en: "Play any four notes from your pentatonic box, then stop completely for two full beats before you play again. That gap is called space, and it's not empty — it's where the listener's ear catches up with what you just played. Now try a call and response: play a short phrase, silence, then play a slightly different phrase that answers the first one, like it's finishing a sentence. You're not filling every second with notes anymore. You're having a conversation with yourself.",
          no: "Spill fire hvilke som helst toner fra pentatonboksen din, stopp så helt i to hele slag før du spiller igjen. Det gapet kalles rom, og det er ikke tomt — det er der lytterens øre tar igjen det du nettopp spilte. Prøv nå kall og svar: spill en kort frase, stillhet, spill så en litt annen frase som svarer på den første, som om den fullfører en setning. Du fyller ikke lenger hvert sekund med toner. Du fører en samtale med deg selv.",
          sv: "Spela fyra valfria toner från din pentatonlåda, stanna sedan helt i två hela slag innan du spelar igen. Det gapet kallas rum, och det är inte tomt — det är där lyssnarens öra hinner ikapp det du just spelade. Testa nu kall och svar: spela en kort fras, tystnad, spela sedan en lite annan fras som svarar på den första, som om den avslutar en mening. Du fyller inte längre varje sekund med toner. Du för ett samtal med dig själv.",
          de: "Spiel vier beliebige Töne aus deiner Pentatonik-Box, halt dann für zwei volle Schläge komplett an, bevor du weiterspielst. Diese Lücke nennt man Raum, und sie ist nicht leer — dort holt das Ohr des Zuhörers auf, was du gerade gespielt hast. Probier jetzt Ruf und Antwort: spiel eine kurze Phrase, Stille, dann spiel eine leicht andere Phrase, die auf die erste antwortet, als würde sie einen Satz beenden. Du füllst nicht mehr jede Sekunde mit Tönen. Du führst ein Gespräch mit dir selbst.",
          pl: "Zagraj dowolne cztery dźwięki ze swojego pudełka pentatoniki, potem zatrzymaj się całkowicie na dwa pełne uderzenia, zanim zagrasz ponownie. Ta przerwa nazywa się przestrzenią i nie jest pusta — to w niej ucho słuchacza nadrabia to, co właśnie zagrałeś. Spróbuj teraz wołania i odpowiedzi: zagraj krótką frazę, cisza, potem zagraj lekko inną frazę, która odpowiada na pierwszą, jakby kończyła zdanie. Nie wypełniasz już każdej sekundy dźwiękami. Prowadzisz rozmowę sam ze sobą.",
        },
        listen: { videoId: "ClpR3fOKPRA", credit: "Buddy Guy", caption: {
          en: "Buddy Guy — \"Feels Like Rain\", once more. Listen for the pause after each line — the gap is doing as much work as the notes.",
          no: "Buddy Guy — «Feels Like Rain», en gang til. Legg merke til pausen etter hver linje — gapet gjør like mye jobb som tonene.",
          sv: "Buddy Guy — \"Feels Like Rain\", en gång till. Lägg märke till pausen efter varje rad — gapet gör lika mycket jobb som tonerna.",
          de: "Buddy Guy — „Feels Like Rain“, noch einmal. Achte auf die Pause nach jeder Zeile — die Lücke leistet genauso viel Arbeit wie die Töne.",
          pl: "Buddy Guy — „Feels Like Rain”, jeszcze raz. Zwróć uwagę na pauzę po każdej linii — przerwa wykonuje tyle samo pracy co dźwięki.",
        }},
        backing: GUITAR_BACKING(),
        nextTip: {
          en: "Buddy Guy has built a whole career on knowing exactly when not to play — his profile is worth a longer look.",
          no: "Buddy Guy har bygget hele karrieren på å vite akkurat når han ikke skal spille — profilen hans er verdt et lengre blikk.",
          sv: "Buddy Guy har byggt hela sin karriär på att veta exakt när han inte ska spela — hans profil är värd en längre titt.",
          de: "Buddy Guy hat seine ganze Karriere darauf aufgebaut, genau zu wissen, wann er nicht spielen sollte — sein Profil ist einen längeren Blick wert.",
          pl: "Buddy Guy zbudował całą karierę na dokładnym wiedzeniu, kiedy NIE grać — jego profil jest wart dłuższego spojrzenia.",
        },
        artistSlug: "buddy-guy",
        illustration: { kind: "none" },
      },
      {
        id: "guitar-firstphrase",
        phase: PHASE_PLAYING,
        title: { en: "Your First Blues Phrase", no: "Din første bluesfrase", sv: "Din första bluesfras", de: "Deine erste Blues-Phrase", pl: "Twoja pierwsza bluesowa fraza" },
        badge: { en: "Your phrase", no: "Din frase", sv: "Din fras", de: "Deine Phrase", pl: "Twoja fraza" },
        goal: {
          en: "Put everything so far — a few notes, a bend, some space — into one small phrase that's actually yours.",
          no: "Sette alt så langt — noen toner, en bend, litt rom — inn i én liten frase som faktisk er din.",
          sv: "Sätta allt hittills — några toner, en bend, lite rum — i en liten fras som faktiskt är din.",
          de: "Alles bisher Gelernte — ein paar Töne, ein Bend, etwas Raum — in eine kleine Phrase packen, die wirklich dir gehört.",
          pl: "Połączyć wszystko dotychczasowe — kilka dźwięków, bend, trochę przestrzeni — w jedną małą frazę, która naprawdę jest twoja.",
        },
        successTest: {
          en: "Can you play your own four-note phrase, add one bend, and leave a real silence before playing it again?",
          no: "Klarer du å spille din egen firetonersfrase, legge til én bend, og la det være ekte stillhet før du spiller den igjen?",
          sv: "Klarar du att spela din egen fyrtonersfras, lägga till en bend, och lämna ett riktigt tyst avbrott innan du spelar den igen?",
          de: "Schaffst du es, deine eigene Vier-Ton-Phrase zu spielen, einen Bend hinzuzufügen und eine echte Stille zu lassen, bevor du sie erneut spielst?",
          pl: "Czy potrafisz zagrać własną czterodźwiękową frazę, dodać jeden bend i zostawić prawdziwą ciszę, zanim zagrasz ją ponownie?",
        },
        steps: {
          en: "Pick three or four notes from your pentatonic box, in whatever order sounds good to you. Bend one of them, even slightly. Then stop, and let two full beats of silence go by before you play it again. That's a complete blues phrase — not borrowed from anyone, built entirely from what you've learned in this course. Play it over the full 12-bar backing from the Ears lesson. It won't sound like Stevie Ray Vaughan or Buddy Guy, and it isn't supposed to. It's supposed to sound like you.",
          no: "Plukk tre eller fire toner fra pentatonboksen din, i hvilken som helst rekkefølge som høres bra ut for deg. Bend én av dem, selv om det bare er litt. Stopp så, og la to hele slag med stillhet gå før du spiller den igjen. Det er en komplett bluesfrase — ikke lånt fra noen, bygget helt av det du har lært i dette kurset. Spill den over hele 12-takteren fra ørelæksjonen. Den vil ikke høres ut som Stevie Ray Vaughan eller Buddy Guy, og det er ikke meningen heller. Den skal høres ut som deg.",
          sv: "Plocka tre eller fyra toner från din pentatonlåda, i vilken ordning som helst som låter bra för dig. Benda en av dem, även om det bara är lite. Stanna sedan, och låt två hela slag av tystnad passera innan du spelar den igen. Det är en komplett bluesfras — inte lånad från någon, byggd helt av det du lärt dig i den här kursen. Spela den över hela 12-takten från örlektionen. Den kommer inte att låta som Stevie Ray Vaughan eller Buddy Guy, och det är inte heller meningen. Den ska låta som dig.",
          de: "Wähl drei oder vier Töne aus deiner Pentatonik-Box, in welcher Reihenfolge auch immer sie dir gut gefällt. Bend einen davon, und sei es nur leicht. Halt dann an und lass zwei volle Schläge Stille verstreichen, bevor du sie erneut spielst. Das ist eine vollständige Blues-Phrase — von niemandem geliehen, komplett aus dem gebaut, was du in diesem Kurs gelernt hast. Spiel sie über den ganzen 12-Takter aus der Ohren-Lektion. Sie wird nicht wie Stevie Ray Vaughan oder Buddy Guy klingen, und das soll sie auch nicht. Sie soll wie du klingen.",
          pl: "Wybierz trzy lub cztery dźwięki ze swojego pudełka pentatoniki, w dowolnej kolejności, która dobrze dla ciebie brzmi. Wygnij jeden z nich, choćby lekko. Potem zatrzymaj się i pozwól, by minęły dwa pełne uderzenia ciszy, zanim zagrasz ją ponownie. To kompletna bluesowa fraza — niepożyczona od nikogo, zbudowana wyłącznie z tego, czego nauczyłeś się w tym kursie. Zagraj ją nad całym 12-taktem z lekcji o uszach. Nie będzie brzmiała jak Stevie Ray Vaughan czy Buddy Guy, i nie taki jest cel. Ma brzmieć jak ty.",
        },
        backing: {
          ...GUITAR_BACKING(),
          caption: {
            en: "Backing in E, the full 12-bar. Play your phrase, rest, then bring it back.",
            no: "Backing i E, hele 12-takteren. Spill frasen din, hvil, ta den så tilbake.",
            sv: "Backing i E, hela 12-takten. Spela din fras, vila, ta sedan tillbaka den.",
            de: "Backing in E, der ganze 12-Takter. Spiel deine Phrase, ruh dich aus, hol sie dann zurück.",
            pl: "Podkład w E, cały 12-takt. Zagraj swoją frazę, odpocznij, potem wróć do niej.",
          },
        },
        nextTip: {
          en: "That's genuinely how blues phrasing works — from Robert Johnson to Stevie Ray Vaughan, it's small ideas, repeated and varied. His profile is next, if you want to hear where this path goes.",
          no: "Sånn fungerer bluesfrasering faktisk — fra Robert Johnson til Stevie Ray Vaughan er det små ideer, gjentatt og variert. Profilen hans er neste steg, hvis du vil høre hvor denne veien fører.",
          sv: "Så fungerar bluesfrasering faktiskt — från Robert Johnson till Stevie Ray Vaughan är det små idéer, upprepade och varierade. Hans profil är nästa steg, om du vill höra vart den här vägen leder.",
          de: "So funktioniert Blues-Phrasierung tatsächlich — von Robert Johnson bis Stevie Ray Vaughan sind es kleine Ideen, wiederholt und variiert. Sein Profil ist der nächste Schritt, wenn du hören willst, wohin dieser Weg führt.",
          pl: "Tak właśnie działa bluesowe frazowanie — od Roberta Johnsona po Stevie'ego Raya Vaughana to małe pomysły, powtarzane i wariowane. Jego profil to następny krok, jeśli chcesz usłyszeć, dokąd prowadzi ta droga.",
        },
        artistSlug: "stevie-ray-vaughan",
        illustration: { kind: "none" },
      },
    ],
  },
  {
    id: "harmonica",
    title: { en: "Harmonica", no: "Munnspill", sv: "Munspel", de: "Mundharmonika", pl: "Harmonijka" },
    intro: {
      en: "Five short lessons from first seal to your first bend, all on one A harp.",
      no: "Fem korte leksjoner fra første forsegling til din første bend, alt på ett A-munnspill.",
      sv: "Fem korta lektioner från första försegling till din första bend, allt på ett A-munspel.",
      de: "Fünf kurze Lektionen vom ersten Dichtsitz bis zu deinem ersten Bend, alles auf einer A-Harp.",
      pl: "Pięć krótkich lekcji od pierwszej szczelności ust po pierwszy bend, wszystko na harmonijce A.",
    },
    lessons: [
      EARS_HARMONICA,
      {
        id: "harmonica-1",
        phase: PHASE_FOUNDATIONS,
        title: { en: "Hold & Seal", no: "Hold og forsegling", sv: "Hållning och försegling", de: "Halten & Dichtsitz", pl: "Trzymanie i szczelność" },
        badge: { en: "Slow 60", no: "Sakte 60", sv: "Långsamt 60", de: "Langsam 60", pl: "Wolno 60" },
        goal: {
          en: "Hold an A harmonica correctly and get a clean seal with your lips.",
          no: "Holde et A-munnspill riktig og få en ren forsegling med leppene.",
          sv: "Hålla ett A-munspel rätt och få en ren försegling med läpparna.",
          de: "Eine A-Mundharmonika richtig halten und mit den Lippen einen sauberen Dichtsitz bekommen.",
          pl: "Poprawnie trzymać harmonijkę A i uzyskać szczelne przyleganie ust.",
        },
        successTest: {
          en: "Can you hold one steady note on hole 4 for a full breath, in and out, without it squeaking?",
          no: "Klarer du å holde én stødig tone på hull 4 gjennom et helt pust, inn og ut, uten at den knirker?",
          sv: "Klarar du att hålla en stadig ton på hål 4 genom ett helt andetag, in och ut, utan att den gnisslar?",
          de: "Schaffst du es, einen ruhigen Ton auf Loch 4 über einen ganzen Atemzug, ein und aus, ohne Quietschen zu halten?",
          pl: "Czy potrafisz utrzymać jeden stabilny dźwięk na otworze 4 przez cały oddech, wdech i wydech, bez piszczenia?",
        },
        steps: {
          en: "Cup the harp in one hand, numbers facing up, low notes to your left. Bring the harmonica to your mouth — not your head down to the harp. Rest your lips around it like you're about to say \"ooh\", not a tight pucker. Breathe gently in and out through hole 4; don't blow hard, this isn't a party favor.",
          no: "Legg munnspillet i den ene hånden, tallene opp, lave toner til venstre. Før munnspillet til munnen — ikke hodet ned til spillet. Hvil leppene rundt det som om du skal si «oj», ikke en stram knip. Pust rolig inn og ut gjennom hull 4; ikke blås hardt, dette er ikke en festfløyte.",
          sv: "Lägg munspelet i ena handen, siffrorna uppåt, låga toner till vänster. För munspelet till munnen — inte huvudet ner till spelet. Vila läpparna runt det som om du ska säga \"åh\", inte en spänd puckring. Andas lugnt in och ut genom hål 4; blås inte hårt, det här är ingen festvissla.",
          de: "Nimm die Harp in eine Hand, Zahlen nach oben, tiefe Töne links. Führe die Harmonika zum Mund — nicht den Kopf zur Harp. Leg die Lippen locker darum, als wolltest du „oh“ sagen, kein enger Kussmund. Atme sanft durch Loch 4 ein und aus; nicht fest blasen, das ist kein Partyknaller.",
          pl: "Trzymaj harmonijkę w jednej ręce, cyfry do góry, niskie dźwięki po lewej. Przybliż harmonijkę do ust — nie głowę do harmonijki. Oprzyj usta wokół niej tak, jakbyś miał powiedzieć „oo”, nie ściśnięte dzióbkiem. Oddychaj spokojnie przez otwór 4; nie dmuchaj mocno, to nie dmuchawka na przyjęciu.",
        },
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "Little Walter turned this small instrument into a lead voice — his profile is ahead.",
          no: "Little Walter gjorde dette lille instrumentet til en ledestemme — profilen hans venter.",
          sv: "Little Walter gjorde det här lilla instrumentet till en ledröst — hans profil väntar.",
          de: "Little Walter machte aus diesem kleinen Instrument eine Leadstimme — sein Profil wartet.",
          pl: "Little Walter zrobił z tego małego instrumentu głos prowadzący — jego profil czeka.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "harp", highlight: [4], label: { en: "Hole 4", no: "Hull 4", sv: "Hål 4", de: "Loch 4", pl: "Otwór 4" } },
      },
      {
        id: "harmonica-2",
        phase: PHASE_FOUNDATIONS,
        title: { en: "Single Note vs. Chord", no: "Enkelttone vs. akkord", sv: "Entoner vs. ackord", de: "Einzelton vs. Akkord", pl: "Pojedynczy dźwięk vs. akord" },
        badge: { en: "Single note", no: "Enkelttone", sv: "Enton", de: "Einzelton", pl: "Pojedynczy dźwięk" },
        goal: {
          en: "Tell a single clean note apart from a full chord, and choose which one you're playing.",
          no: "Kjenne forskjell på én ren tone og en full akkord, og velge hvilken du spiller.",
          sv: "Känna skillnad på en ren ton och ett fullt ackord, och välja vilken du spelar.",
          de: "Einen einzelnen klaren Ton von einem vollen Akkord unterscheiden — und wählen, was du spielst.",
          pl: "Odróżnić pojedynczy czysty dźwięk od pełnego akordu i wybierać, co grasz.",
        },
        successTest: {
          en: "Can you play one clean single note on hole 4, three times in a row?",
          no: "Klarer du å spille én ren enkelttone på hull 4, tre ganger på rad?",
          sv: "Klarar du att spela en ren enton på hål 4, tre gånger i rad?",
          de: "Schaffst du einen klaren Einzelton auf Loch 4, dreimal hintereinander?",
          pl: "Czy potrafisz zagrać jeden czysty pojedynczy dźwięk na otworze 4, trzy razy z rzędu?",
        },
        steps: {
          en: "Play hole 4 as a wide chord first — breathe normally, you'll hear 3-4 notes at once. Now narrow your lips and aim the air right at hole 4 alone, like whistling through a straw. Go back and forth: chord, single note, chord, single note. That control is most of what separates blues harp from just breathing on the thing.",
          no: "Spill hull 4 som en bred akkord først — pust normalt, du hører 3-4 toner samtidig. Snevre nå leppene og sikt luften rett mot hull 4 alene, som å plystre gjennom et sugerør. Gå frem og tilbake: akkord, enkelttone, akkord, enkelttone. Den kontrollen er det meste av det som skiller blueshemunnspill fra bare å puste på greia.",
          sv: "Spela hål 4 som ett brett ackord först — andas normalt, du hör 3-4 toner samtidigt. Smalna nu läpparna och sikta luften rakt mot hål 4 ensamt, som att vissla genom ett sugrör. Gå fram och tillbaka: ackord, enton, ackord, enton. Den kontrollen är det mesta av vad som skiljer bluesmunspel från att bara andas på grejen.",
          de: "Spiel Loch 4 zuerst als breiten Akkord — atme normal, du hörst 3-4 Töne gleichzeitig. Verenge nun die Lippen und ziel die Luft genau auf Loch 4 allein, wie durch einen Strohhalm pfeifen. Wechsle hin und her: Akkord, Einzelton, Akkord, Einzelton. Diese Kontrolle macht das meiste dessen aus, was Blues-Harp von bloßem Reinatmen unterscheidet.",
          pl: "Zagraj otwór 4 najpierw jako szeroki akord — oddychaj normalnie, usłyszysz 3-4 dźwięki naraz. Teraz zwęź usta i skieruj powietrze dokładnie na sam otwór 4, jakbyś gwizdał przez słomkę. Przełączaj się: akord, pojedynczy dźwięk, akord, pojedynczy dźwięk. Ta kontrola to większość tego, co odróżnia bluesową harmonijkę od zwykłego oddychania w nią.",
        },
        listen: { videoId: "a2vlNCK18L8", credit: "Big Walter Horton", caption: {
          en: "Big Walter Horton — \"Walking By Myself\". Listen to the tone, not the tempo — that's a later lesson.",
          no: "Big Walter Horton — «Walking By Myself». Lytt til klangen, ikke tempoet — det kommer i en senere leksjon.",
          sv: "Big Walter Horton — \"Walking By Myself\". Lyssna på klangen, inte tempot — det kommer i en senare lektion.",
          de: "Big Walter Horton — „Walking By Myself“. Hör auf den Klang, nicht das Tempo — das kommt in einer späteren Lektion.",
          pl: "Big Walter Horton — „Walking By Myself”. Posłuchaj barwy dźwięku, nie tempa — to temat na później.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "This is the control every Big Walter Horton solo is built on.",
          no: "Dette er kontrollen enhver Big Walter Horton-solo er bygget på.",
          sv: "Det här är kontrollen som varje Big Walter Horton-solo är byggd på.",
          de: "Das ist die Kontrolle, auf der jedes Big-Walter-Horton-Solo aufbaut.",
          pl: "To ta kontrola, na której zbudowana jest każda solówka Big Waltera Hortona.",
        },
        artistSlug: "big-walter-horton",
        illustration: { kind: "harp", highlight: [4], label: { en: "Hole 4", no: "Hull 4", sv: "Hål 4", de: "Loch 4", pl: "Otwór 4" } },
      },
      {
        id: "harmonica-3",
        phase: PHASE_FOUNDATIONS,
        title: { en: "Second Position", no: "Andre posisjon", sv: "Andra positionen", de: "Zweite Position", pl: "Druga pozycja" },
        badge: { en: "Cross harp", no: "Cross harp", sv: "Cross harp", de: "Cross Harp", pl: "Cross harp" },
        goal: {
          en: "Understand why blues harp players play an A harp in the \"wrong\" key on purpose.",
          no: "Forstå hvorfor bluesmunnspillere spiller et A-munnspill i «feil» toneart med vilje.",
          sv: "Förstå varför bluesmunspelare medvetet spelar ett A-munspel i \"fel\" tonart.",
          de: "Verstehen, warum Blues-Harp-Spieler eine A-Harp absichtlich in der „falschen“ Tonart spielen.",
          pl: "Zrozumieć, dlaczego bluesowi harmonijkarze celowo grają na harmonijce A w „złej” tonacji.",
        },
        successTest: {
          en: "Can you hold the draw chord on holes 1–4 for four full breaths without it sounding thin or splitting?",
          no: "Klarer du å holde drag-akkorden på hull 1–4 gjennom fire fulle pust uten at den høres tynn ut eller splitter seg?",
          sv: "Klarar du att hålla drag-ackordet på hål 1–4 genom fyra hela andetag utan att det låter tunt eller splittras?",
          de: "Schaffst du es, den Zieh-Akkord auf Loch 1–4 über vier volle Atemzüge zu halten, ohne dass er dünn klingt oder auseinanderfällt?",
          pl: "Czy potrafisz utrzymać akord na wdechu na otworach 1–4 przez cztery pełne oddechy, tak by nie brzmiał cienko i się nie rozpadał?",
        },
        steps: {
          en: "This is called cross harp, or 2nd position: an A harmonica actually gives you the blues in E, not A — the same E this whole track is built around. Home base is holes 1 through 4 on the draw (breathe in), not the blow. Sit there and just breathe in on holes 1-2-3-4 together, slowly, and let that sound sink in — that's the sound you already know from every blues record.",
          no: "Dette kalles cross harp, eller 2. posisjon: et A-munnspill gir deg faktisk bluesen i E, ikke A — den samme E-en som resten av dette sporet er bygget rundt. Hjemmebasen er hull 1 til 4 på draget (pust inn), ikke blåset. Sitt der og bare pust inn på hull 1-2-3-4 sammen, sakte, og la den lyden synke inn — det er lyden du allerede kjenner fra hver eneste bluesplate.",
          sv: "Det här kallas cross harp, eller 2:a positionen: ett A-munspel ger dig faktiskt bluesen i E, inte A — samma E som resten av det här spåret är byggt kring. Hembasen är hål 1 till 4 på draget (andas in), inte blåset. Sitt still och andas bara in på hål 1-2-3-4 tillsammans, långsamt, och låt det ljudet sjunka in — det är ljudet du redan känner från varenda bluesskiva.",
          de: "Das nennt man Cross Harp oder 2. Position: Eine A-Mundharmonika liefert dir eigentlich den Blues in E, nicht in A — dasselbe E, um das diese ganze Spur herum aufgebaut ist. Heimatbasis sind die Löcher 1 bis 4 beim Ziehen (Einatmen), nicht beim Blasen. Setz dich hin und atme einfach langsam auf den Löchern 1-2-3-4 zusammen ein — lass diesen Klang wirken, das ist der Sound, den du schon von jeder Bluesplatte kennst.",
          pl: "Nazywa się to cross harp, czyli druga pozycja: harmonijka A daje ci właściwie bluesa w tonacji E, nie A — tej samej E, wokół której zbudowana jest cała ta ścieżka. Bazą domową są otwory od 1 do 4 na wdechu (draw), nie na wydechu. Usiądź i po prostu wdychaj powietrze przez otwory 1-2-3-4 razem, powoli, i pozwól temu brzmieniu wsiąknąć — to dźwięk, który już znasz z każdej płyty bluesowej.",
        },
        listen: { videoId: "HxkqDe7DN8g", credit: "Little Walter", caption: {
          en: "Little Walter — \"Juke\". This is the sound this position makes — your own riff comes next lesson.",
          no: "Little Walter — «Juke». Dette er lyden denne posisjonen gir — din egen riff kommer i neste leksjon.",
          sv: "Little Walter — \"Juke\". Det här är ljudet den här positionen ger — din egen riff kommer nästa lektion.",
          de: "Little Walter — „Juke“. Das ist der Klang, den diese Position ergibt — dein eigenes Riff kommt in der nächsten Lektion.",
          pl: "Little Walter — „Juke”. Tak brzmi ta pozycja — twój własny riff pojawi się w następnej lekcji.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "\"Juke\" is the harmonica instrumental — Little Walter's profile has the story.",
          no: "«Juke» er munnspill-instrumentalen — profilen til Little Walter har historien.",
          sv: "\"Juke\" är munspelsinstrumentalen — Little Walters profil har historien.",
          de: "„Juke“ ist das Mundharmonika-Instrumental — Little Walters Profil erzählt die Geschichte.",
          pl: "„Juke” to instrumentalny hit harmonijkowy — profil Little Waltera zawiera tę historię.",
        },
        artistSlug: "little-walter",
        illustration: {
          kind: "harp",
          highlight: [1, 2, 3, 4],
          direction: "draw",
          label: { en: "Holes 1–4, draw", no: "Hull 1–4, drag", sv: "Hål 1–4, drag", de: "Löcher 1–4, ziehen", pl: "Otwory 1–4, wdech" },
        },
      },
      {
        id: "harmonica-4",
        phase: PHASE_RHYTHM,
        title: { en: "One 12-Bar Riff", no: "Én 12-takters riff", sv: "En 12-takters riff", de: "Ein 12-Takt-Riff", pl: "Jeden riff na 12 taktów" },
        badge: { en: "Riff", no: "Riff", sv: "Riff", de: "Riff", pl: "Riff" },
        goal: {
          en: "Play one small, repeatable riff you can carry across a full 12-bar.",
          no: "Spille én liten, repeterbar riff du kan ta med gjennom en hel 12-takter.",
          sv: "Spela en liten, repeterbar riff du kan ta med genom en hel 12-takt.",
          de: "Ein kleines, wiederholbares Riff spielen, das du durch einen ganzen 12-Takter trägst.",
          pl: "Zagrać jeden mały, powtarzalny riff, który przeniesiesz przez cały 12-takt.",
        },
        successTest: {
          en: "Can you loop the riff five times in a row without missing a note?",
          no: "Klarer du å løkke riffen fem ganger på rad uten å bomme på en tone?",
          sv: "Klarar du att loopa riffet fem gånger i rad utan att missa en ton?",
          de: "Schaffst du es, das Riff fünfmal hintereinander zu loopen, ohne einen Ton zu verpassen?",
          pl: "Czy potrafisz powtórzyć riff pięć razy z rzędu, nie gubiąc żadnej nuty?",
        },
        steps: {
          en: "Here's a tiny original riff, in draw (in) and blow (out): draw 4, draw 3, blow 2, draw 2. Four notes, about two seconds. Loop it slowly, evenly, until it's boring — boring means it's ready. Once it sits, you already have something to play over the whole 12-bar from the ears lesson.",
          no: "Her er en liten original riff, i drag (inn) og blås (ut): drag 4, drag 3, blås 2, drag 2. Fire toner, rundt to sekunder. Løkk den sakte, jevnt, til den er kjedelig — kjedelig betyr at den er klar. Når den sitter, har du allerede noe å spille over hele 12-takteren fra ørelæksjonen.",
          sv: "Här är en liten originalriff, i drag (in) och blås (ut): drag 4, drag 3, blås 2, drag 2. Fyra toner, ungefär två sekunder. Loopa den långsamt, jämnt, tills den är tråkig — tråkig betyder att den är klar. När den sitter har du redan något att spela över hela 12-takten från örlektionen.",
          de: "Hier ein kleines Original-Riff, in Zieh- (ein) und Blastönen (aus): ziehen 4, ziehen 3, blasen 2, ziehen 2. Vier Töne, etwa zwei Sekunden. Loop es langsam, gleichmäßig, bis es langweilig wird — langweilig heißt bereit. Sitzt es, hast du schon etwas, das du über den ganzen 12-Takter aus der Ohren-Lektion spielen kannst.",
          pl: "Oto mały autorski riff, na wdechu (draw) i wydechu (blow): draw 4, draw 3, blow 2, draw 2. Cztery dźwięki, około dwóch sekund. Powtarzaj go powoli, równo, aż stanie się nudny — nudny znaczy gotowy. Gdy już siądzie, masz już coś do zagrania przez cały 12-takt z lekcji o uszach.",
        },
        listen: { videoId: "HxkqDe7DN8g", credit: "Little Walter", caption: {
          en: "Little Walter — \"Juke\" again. Listen for how a riff can carry a whole song.",
          no: "Little Walter — «Juke» igjen. Legg merke til hvordan en riff kan bære en hel sang.",
          sv: "Little Walter — \"Juke\" igen. Lyssna på hur en riff kan bära en hel låt.",
          de: "Little Walter — noch einmal „Juke“. Hör, wie ein Riff einen ganzen Song tragen kann.",
          pl: "Little Walter — ponownie „Juke”. Posłuchaj, jak riff może udźwignąć cały utwór.",
        }},
        backing: {
          ...HARMONICA_BACKING(),
          caption: {
            en: "Same slow track — add the limp in your right hand.",
            no: "Samme sakte spor — legg til haltingen med høyrehånden selv.",
            sv: "Samma långsamma spår — lägg till haltandet med högerhanden själv.",
            de: "Derselbe langsame Track — den hinkenden Groove fügst du selbst mit der rechten Hand hinzu.",
            pl: "Ten sam wolny podkład — kulawy rytm dodajesz sam prawą ręką.",
          },
        },
        temporaryNote: {
          en: "Temporary: no verified up-tempo E-shuffle backing track exists yet — this lesson reuses the slow track until one is found.",
          no: "Midlertidig: det finnes ennå ingen verifisert rask E-shuffle-backing — denne leksjonen gjenbruker det sakte sporet inntil videre.",
          sv: "Tillfälligt: det finns ännu ingen verifierad snabb E-shuffle-backing — den här lektionen återanvänder det långsamma spåret tills vidare.",
          de: "Vorübergehend: Es gibt noch kein verifiziertes schnelleres E-Shuffle-Backing — diese Lektion nutzt vorerst weiter den langsamen Track.",
          pl: "Tymczasowo: nie ma jeszcze zweryfikowanego szybszego podkładu E-shuffle — ta lekcja na razie korzysta z wolnego podkładu.",
        },
        nextTip: {
          en: "Ready to try your first bend? It's next — no rush if not.",
          no: "Klar for din første bend? Den er neste — ingen hast om ikke.",
          sv: "Redo att prova din första bend? Den är nästa — ingen brådska om inte.",
          de: "Bereit für deinen ersten Bend? Kommt als Nächstes — kein Stress, wenn nicht.",
          pl: "Gotów spróbować pierwszego bendu? To już następny krok — bez pośpiechu, jeśli nie.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "harp", highlight: [2, 3, 4], label: { en: "Holes 2–4", no: "Hull 2–4", sv: "Hål 2–4", de: "Löcher 2–4", pl: "Otwory 2–4" } },
      },
      {
        id: "harmonica-groove",
        phase: PHASE_RHYTHM,
        title: { en: "Rhythmic Repetition", no: "Rytmisk repetisjon", sv: "Rytmisk repetition", de: "Rhythmische Wiederholung", pl: "Rytmiczne powtarzanie" },
        badge: { en: "Groove", no: "Groove", sv: "Groove", de: "Groove", pl: "Groove" },
        goal: {
          en: "Play the same small riff exactly the same way, again and again, until it locks into a groove.",
          no: "Spille den samme lille riffen på akkurat samme måte, om og om igjen, til den låser seg inn i en groove.",
          sv: "Spela samma lilla riff exakt likadant, om och om igen, tills det låser sig i en groove.",
          de: "Dasselbe kleine Riff immer wieder exakt gleich spielen, bis es sich zu einem Groove einrastet.",
          pl: "Grać ten sam mały riff dokładnie tak samo, w kółko, aż złapie stały groove.",
        },
        successTest: {
          en: "Can you repeat your riff exactly the same way ten times in a row, like a train rhythm?",
          no: "Klarer du å gjenta riffen din på akkurat samme måte ti ganger på rad, som en togrytme?",
          sv: "Klarar du att upprepa ditt riff exakt likadant tio gånger i rad, som en tågrytm?",
          de: "Schaffst du es, dein Riff zehnmal hintereinander exakt gleich zu wiederholen, wie einen Zugrhythmus?",
          pl: "Czy potrafisz powtórzyć swój riff dokładnie tak samo dziesięć razy z rzędu, jak rytm pociągu?",
        },
        steps: {
          en: "Take the riff from the last lesson — draw 4, draw 3, blow 2, draw 2 — and repeat it exactly, like a train rolling down the track: same spacing, same volume, same feel, every single time. Don't vary it yet. Most blues harmonica power doesn't come from playing more notes — it comes from committing to a simple pattern and locking it into the rhythm so hard that it starts to feel hypnotic. Loop it for a full minute without changing a thing.",
          no: "Ta riffen fra forrige leksjon — drag 4, drag 3, blås 2, drag 2 — og gjenta den akkurat likt, som et tog som ruller nedover skinnegangen: samme avstand, samme volum, samme følelse, hver eneste gang. Ikke varier den ennå. Mesteparten av kraften i bluesmunnspill kommer ikke fra å spille flere toner — den kommer fra å forplikte seg til et enkelt mønster og låse det så hardt inn i rytmen at det begynner å føles hypnotisk. Løkk den i ett helt minutt uten å endre noe.",
          sv: "Ta riffet från förra lektionen — drag 4, drag 3, blås 2, drag 2 — och upprepa det exakt likadant, som ett tåg som rullar nedför spåret: samma avstånd, samma volym, samma känsla, varenda gång. Variera det inte än. Det mesta av kraften i bluesmunspel kommer inte från att spela fler toner — den kommer från att förbinda sig till ett enkelt mönster och låsa in det så hårt i rytmen att det börjar kännas hypnotiskt. Loopa det i en hel minut utan att ändra något.",
          de: "Nimm das Riff aus der letzten Lektion — ziehen 4, ziehen 3, blasen 2, ziehen 2 — und wiederhole es exakt gleich, wie ein Zug, der die Gleise entlangrollt: gleicher Abstand, gleiche Lautstärke, gleiches Gefühl, jedes Mal. Variiere es noch nicht. Das meiste an Kraft in Blues-Harp kommt nicht davon, mehr Töne zu spielen — sie kommt davon, sich auf ein einfaches Muster festzulegen und es so fest in den Rhythmus einzurasten, dass es hypnotisch wirkt. Loop es eine volle Minute, ohne etwas zu ändern.",
          pl: "Weź riff z poprzedniej lekcji — draw 4, draw 3, blow 2, draw 2 — i powtarzaj go dokładnie tak samo, jak pociąg jadący po torach: ten sam odstęp, ta sama głośność, to samo wyczucie, za każdym razem. Nie zmieniaj go jeszcze. Większość mocy bluesowej harmonijki nie bierze się z grania większej liczby dźwięków — bierze się z trzymania się prostego wzoru i wciśnięcia go w rytm tak mocno, że zaczyna hipnotyzować. Powtarzaj go przez całą minutę, nic nie zmieniając.",
        },
        listen: { videoId: "HxkqDe7DN8g", credit: "Little Walter", caption: {
          en: "Little Walter — \"Juke\", once more. Listen for how much of this is the same small idea, repeated until it grooves.",
          no: "Little Walter — «Juke», en gang til. Legg merke til hvor mye av dette som er den samme lille ideen, gjentatt til den groover.",
          sv: "Little Walter — \"Juke\", en gång till. Lägg märke till hur mycket av det här som är samma lilla idé, upprepad tills den groovar.",
          de: "Little Walter — „Juke“, noch einmal. Achte darauf, wie viel davon dieselbe kleine Idee ist, wiederholt, bis sie groovt.",
          pl: "Little Walter — „Juke”, jeszcze raz. Zwróć uwagę, ile z tego to ten sam mały pomysł, powtarzany, aż zaczyna groove'ować.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "Little Walter built entire records on exactly this kind of repetition — his profile has more.",
          no: "Little Walter bygde hele plater på akkurat denne typen repetisjon — profilen hans har mer.",
          sv: "Little Walter byggde hela skivor på precis den här typen av repetition — hans profil har mer.",
          de: "Little Walter baute ganze Platten auf genau dieser Art von Wiederholung auf — sein Profil hat mehr.",
          pl: "Little Walter budował całe płyty na dokładnie tego rodzaju powtórzeniach — jego profil zawiera więcej.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "harp", highlight: [2, 3, 4], label: { en: "Holes 2–4", no: "Hull 2–4", sv: "Hål 2–4", de: "Löcher 2–4", pl: "Otwory 2–4" } },
      },
      {
        id: "harmonica-5",
        phase: PHASE_TECHNIQUE,
        title: { en: "First Bend", no: "Første bend", sv: "Första bend", de: "Erster Bend", pl: "Pierwszy bend" },
        badge: { en: "Bend", no: "Bend", sv: "Bend", de: "Bend", pl: "Bend" },
        goal: {
          en: "Get your first draw bend on hole 2 — only once lesson 4 feels solid.",
          no: "Få din første drag-bend på hull 2 — først når leksjon 4 føles solid.",
          sv: "Få din första drag-bend på hål 2 — bara när lektion 4 känns stabil.",
          de: "Deinen ersten Zieh-Bend auf Loch 2 hinbekommen — erst wenn Lektion 4 sich sicher anfühlt.",
          pl: "Zagrać pierwszy bend na wdechu na otworze 2 — dopiero gdy lekcja 4 czuje się pewnie.",
        },
        successTest: {
          en: "Can you hear the pitch move downward on hole 2, even slightly?",
          no: "Klarer du å høre tonen bøye seg nedover på hull 2, selv om det bare er litt?",
          sv: "Klarar du att höra tonen böja nedåt på hål 2, även om det bara är lite?",
          de: "Kannst du hören, wie sich die Tonhöhe auf Loch 2 nach unten bewegt, und sei es nur leicht?",
          pl: "Czy słyszysz, jak dźwięk na otworze 2 obniża się, choćby nieznacznie?",
        },
        steps: {
          en: "Bending is shaping the inside of your mouth to bend the pitch down while you draw. Say \"eee\" out loud, then slide toward \"aww\" while drawing on hole 2 — you're aiming your tongue and jaw down and back, not blowing harder. It won't happen on attempt one. If nothing changes after a few honest tries, come back to this after a week of lesson 4 — that's completely normal, not a failure.",
          no: "Bending handler om å forme innsiden av munnen for å bøye tonen ned mens du drar. Si «iii» høyt, gli så mot «åh» mens du drar på hull 2 — du sikter tunge og kjeve nedover og bakover, ikke blåser hardere. Det skjer ikke på første forsøk. Skjer ingenting etter noen ærlige forsøk, kom tilbake hit etter en ukes øving på leksjon 4 — det er helt normalt, ikke en fiasko.",
          sv: "Bending handlar om att forma insidan av munnen för att böja tonen nedåt medan du drar. Säg \"iii\" högt, glid sedan mot \"åh\" medan du drar på hål 2 — du siktar tunga och käke nedåt och bakåt, inte blåser hårdare. Det händer inte på första försöket. Händer inget efter några ärliga försök, kom tillbaka hit efter en veckas övning på lektion 4 — det är helt normalt, inget misslyckande.",
          de: "Beim Bend formst du das Innere deines Mundes, um die Tonhöhe beim Ziehen abzusenken. Sag laut „iii“, gleite dann zu „aah“, während du Loch 2 ziehst — du zielst Zunge und Kiefer nach unten und hinten, nicht fester blasen. Beim ersten Versuch klappt es nicht. Ändert sich nach ein paar ehrlichen Versuchen nichts, komm nach einer Woche Übung mit Lektion 4 hierher zurück — völlig normal, kein Scheitern.",
          pl: "Bend polega na kształtowaniu wnętrza ust, by obniżyć wysokość dźwięku podczas wdechu. Powiedz głośno „iii”, a potem przejdź w stronę „aaa”, wciągając powietrze przez otwór 2 — kierujesz język i żuchwę w dół i do tyłu, nie dmuchasz mocniej. Za pierwszym razem się nie uda. Jeśli po kilku szczerych próbach nic się nie zmienia, wróć tu po tygodniu ćwiczenia lekcji 4 — to zupełnie normalne, nie porażka.",
        },
        listen: { videoId: "a2vlNCK18L8", credit: "Big Walter Horton", caption: {
          en: "Big Walter Horton — \"Walking By Myself\" again. Listen for the feel of the bend, not a tempo to match.",
          no: "Big Walter Horton — «Walking By Myself» igjen. Lytt etter følelsen i bendet, ikke et tempo å matche.",
          sv: "Big Walter Horton — \"Walking By Myself\" igen. Lyssna efter känslan i bendet, inte ett tempo att matcha.",
          de: "Big Walter Horton — noch einmal „Walking By Myself“. Hör auf das Gefühl des Bends, nicht auf ein Tempo zum Nachspielen.",
          pl: "Big Walter Horton — jeszcze raz „Walking By Myself”. Posłuchaj uczucia w bendzie, nie tempa do naśladowania.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "Big Walter Horton bent notes like nobody else — his profile has the story.",
          no: "Big Walter Horton bendet toner som ingen andre — profilen har historien.",
          sv: "Big Walter Horton böjde toner som ingen annan — profilen har historien.",
          de: "Big Walter Horton bendete Töne wie kein anderer — sein Profil erzählt die Geschichte.",
          pl: "Big Walter Horton bendował dźwięki jak nikt inny — jego profil zawiera tę historię.",
        },
        artistSlug: "big-walter-horton",
        illustration: {
          kind: "harp",
          highlight: [2],
          direction: "draw",
          label: { en: "Hole 2, draw", no: "Hull 2, drag", sv: "Hål 2, drag", de: "Loch 2, ziehen", pl: "Otwór 2, wdech" },
        },
      },
      {
        id: "harmonica-bendcontrol",
        phase: PHASE_TECHNIQUE,
        title: { en: "Bend Control & Vibrato", no: "Bend-kontroll og vibrato", sv: "Bend-kontroll och vibrato", de: "Bend-Kontrolle & Vibrato", pl: "Kontrola bendu i vibrato" },
        badge: { en: "Control", no: "Kontroll", sv: "Kontroll", de: "Kontrolle", pl: "Kontrola" },
        goal: {
          en: "Hold a bent note steady instead of it wobbling around, then add a gentle shimmer on top.",
          no: "Holde en bendet tone stødig i stedet for at den vingler rundt, og legge til en mild skjelving på toppen.",
          sv: "Hålla en bendad ton stadig istället för att den vinglar runt, och lägga till ett milt skimmer ovanpå.",
          de: "Einen gebendeten Ton stabil halten, statt dass er herumwackelt, und darüber ein sanftes Schimmern hinzufügen.",
          pl: "Utrzymać wygięty dźwięk stabilnie, zamiast pozwolić mu się chwiać, i dodać na wierzchu delikatne migotanie.",
        },
        successTest: {
          en: "Can you bend hole 2 down and hold it steady for two full seconds without it sliding back up?",
          no: "Klarer du å bende hull 2 ned og holde den stødig i to hele sekunder uten at den glir tilbake opp?",
          sv: "Klarar du att benda hål 2 ner och hålla den stadig i två hela sekunder utan att den glider tillbaka upp?",
          de: "Schaffst du es, Loch 2 herunterzubenden und ihn zwei volle Sekunden stabil zu halten, ohne dass er zurückgleitet?",
          pl: "Czy potrafisz wygiąć otwór 2 w dół i utrzymać go stabilnie przez dwie pełne sekundy, bez ślizgania się z powrotem w górę?",
        },
        steps: {
          en: "Bend hole 2 down like you learned in the last lesson, but this time hold it — don't let the pitch slide back up, and don't let it sink further down either. Park it right where it lands and let it sit there for a full two seconds. Once you can hold a bend steady, add vibrato: gently pulse the bend up and down a tiny amount, fast, like a light shiver rather than a slow wobble. That pulse is what turns a held note from flat into alive.",
          no: "Bend hull 2 ned slik du lærte i forrige leksjon, men denne gangen hold den — ikke la tonen gli tilbake opp, og ikke la den synke lenger ned heller. Parker den rett der den lander og la den stå i to hele sekunder. Når du klarer å holde en bend stødig, legg til vibrato: puls bendet forsiktig opp og ned et lite hakk, raskt, som en lett skjelving heller enn en sakte vingling. Den pulsen er det som gjør en holdt tone levende i stedet for flat.",
          sv: "Benda hål 2 ner som du lärde dig i förra lektionen, men den här gången håll den — låt inte tonen glida tillbaka upp, och låt den inte sjunka längre ner heller. Parkera den precis där den landar och låt den stå i två hela sekunder. När du kan hålla en bend stadig, lägg till vibrato: pulsera bendet försiktigt upp och ner lite, snabbt, som ett lätt skimmer snarare än en långsam vingling. Den pulsen är det som gör en hållen ton levande istället för platt.",
          de: "Beug Loch 2 nach unten wie in der letzten Lektion, aber halt ihn diesmal — lass die Tonhöhe nicht zurückgleiten, und lass sie auch nicht weiter sinken. Parke ihn genau dort, wo er landet, und lass ihn zwei volle Sekunden stehen. Kannst du einen Bend stabil halten, füge Vibrato hinzu: puls den Bend sanft ein kleines Stück auf und ab, schnell, wie ein leichtes Zittern statt eines langsamen Wackelns. Dieser Puls macht aus einem gehaltenen Ton etwas Lebendiges statt etwas Flaches.",
          pl: "Wygnij otwór 2 w dół, tak jak nauczyłeś się w poprzedniej lekcji, ale tym razem przytrzymaj go — nie pozwól, by dźwięk wrócił w górę, ani nie pozwól mu opaść jeszcze niżej. Zatrzymaj go dokładnie tam, gdzie wyląduje, i pozwól mu trwać przez pełne dwie sekundy. Gdy potrafisz utrzymać bend stabilnie, dodaj vibrato: delikatnie pulsuj bend odrobinę w górę i w dół, szybko, jak lekkie drżenie, a nie powolne kołysanie. Ten puls sprawia, że trzymany dźwięk staje się żywy zamiast płaski.",
        },
        listen: { videoId: "KX0Eu5Lqexc", credit: "Big Walter Horton", caption: {
          en: "Big Walter Horton explaining his own technique. A rare chance to hear a master describe what he's doing, not just play it.",
          no: "Big Walter Horton forklarer sin egen teknikk. En sjelden sjanse til å høre en mester beskrive hva han gjør, ikke bare spille det.",
          sv: "Big Walter Horton förklarar sin egen teknik. En sällsynt chans att höra en mästare beskriva vad han gör, inte bara spela det.",
          de: "Big Walter Horton erklärt seine eigene Technik. Eine seltene Gelegenheit, einen Meister beschreiben zu hören, was er tut, statt es nur zu spielen.",
          pl: "Big Walter Horton wyjaśnia własną technikę. Rzadka okazja, by usłyszeć mistrza opisującego to, co robi, a nie tylko grającego.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "Big Walter Horton's control over a single bent note is legendary among harmonica players — his profile has more to hear.",
          no: "Big Walter Hortons kontroll over en enkelt bendet tone er legendarisk blant munnspillere — profilen hans har mer å høre.",
          sv: "Big Walter Hortons kontroll över en enda bendad ton är legendarisk bland munspelare — hans profil har mer att lyssna på.",
          de: "Big Walter Hortons Kontrolle über einen einzelnen gebendeten Ton ist unter Mundharmonikaspielern legendär — sein Profil hat mehr zu hören.",
          pl: "Kontrola Big Waltera Hortona nad jednym wygiętym dźwiękiem jest legendarna wśród harmonijkarzy — jego profil zawiera więcej do posłuchania.",
        },
        artistSlug: "big-walter-horton",
        illustration: {
          kind: "harp",
          highlight: [2],
          direction: "draw",
          label: { en: "Hole 2, draw", no: "Hull 2, drag", sv: "Hål 2, drag", de: "Loch 2, ziehen", pl: "Otwór 2, wdech" },
        },
      },
      {
        id: "harmonica-tone",
        phase: PHASE_TECHNIQUE,
        title: { en: "Tone, Attack & Hand Effects", no: "Klang, angrep og håndeffekter", sv: "Klang, anslag och handeffekter", de: "Klang, Attack & Handeffekte", pl: "Barwa, atak i efekty ręką" },
        badge: { en: "Tone", no: "Klang", sv: "Klang", de: "Klang", pl: "Barwa" },
        goal: {
          en: "Shape the sound after you've already played the note — with your hands and how hard you start each note.",
          no: "Forme lyden etter at du allerede har spilt tonen — med hendene og hvor hardt du starter hver tone.",
          sv: "Forma ljudet efter att du redan spelat tonen — med händerna och hur hårt du startar varje ton.",
          de: "Den Klang formen, nachdem du den Ton schon gespielt hast — mit den Händen und wie hart du jeden Ton startest.",
          pl: "Kształtować dźwięk już po zagraniu nuty — dłońmi i tym, jak mocno zaczynasz każdy dźwięk.",
        },
        successTest: {
          en: "Can you hear your own wah-wah opening and closing while you hold one note?",
          no: "Klarer du å høre din egen wah-wah åpne og lukke seg mens du holder én tone?",
          sv: "Klarar du att höra ditt eget wah-wah öppna och stänga medan du håller en ton?",
          de: "Kannst du dein eigenes Wah-wah öffnen und schließen hören, während du einen Ton hältst?",
          pl: "Czy słyszysz, jak twoje własne wah-wah otwiera się i zamyka, gdy trzymasz jeden dźwięk?",
        },
        steps: {
          en: "Cup both hands loosely around the back of the harmonica, leaving a small gap, then open and close that gap while you play a held note on hole 4 draw — that opening and closing is the classic harmonica \"wah-wah,\" entirely in your hands, no pedal involved. Separately, try starting a note two ways: soft and gradual, then short and percussive, almost like a cough into the harp. That second attack is how blues harp punches through a band without ever getting louder in volume — it's sharper, not louder.",
          no: "Kupp begge hendene løst rundt baksiden av munnspillet, la det være et lite gap, åpne og lukk så det gapet mens du spiller en holdt tone på drag hull 4 — den åpningen og lukkingen er den klassiske munnspill-«wah-wah»-en, helt i hendene dine, ingen pedal involvert. Prøv separat å starte en tone på to måter: mykt og gradvis, så kort og perkussivt, nesten som en hoste inn i spillet. Det andre angrepet er hvordan bluesmunnspill punkterer gjennom et band uten noen gang å bli høyere i volum — det er skarpere, ikke høyere.",
          sv: "Kupa båda händerna löst runt baksidan av munspelet, lämna ett litet gap, öppna och stäng sedan det gapet medan du spelar en hållen ton på drag hål 4 — den öppningen och stängningen är den klassiska munspels-\"wah-wah\":n, helt i dina händer, ingen pedal inblandad. Testa separat att starta en ton på två sätt: mjukt och gradvis, sedan kort och perkussivt, nästan som en hosta in i spelet. Det andra anslaget är hur bluesmunspel punkterar genom ett band utan att någonsin bli högre i volym — det är skarpare, inte högre.",
          de: "Wölbe beide Hände locker um die Rückseite der Mundharmonika, lass eine kleine Lücke, öffne und schließe diese Lücke, während du einen gehaltenen Ton auf Loch 4 ziehen spielst — dieses Öffnen und Schließen ist das klassische Mundharmonika-„Wah-wah“, komplett in deinen Händen, kein Pedal nötig. Probier separat, einen Ton auf zwei Arten zu starten: sanft und allmählich, dann kurz und perkussiv, fast wie ein Husten in die Harp. Dieser zweite Angriff ist, wie Blues-Harp sich durch eine Band durchsetzt, ohne je lauter zu werden — schärfer, nicht lauter.",
          pl: "Ułóż obie dłonie luźno wokół tyłu harmonijki, zostawiając mały prześwit, a potem otwieraj i zamykaj ten prześwit, grając trzymany dźwięk na otworze 4 (wdech) — to otwieranie i zamykanie to klasyczne harmonijkowe „wah-wah”, całe w twoich dłoniach, bez żadnego efektu. Osobno spróbuj zaczynać dźwięk na dwa sposoby: miękko i stopniowo, a potem krótko i perkusyjnie, niemal jak kaszlnięcie w harmonijkę. Ten drugi atak to sposób, w jaki bluesowa harmonijka przebija się przez zespół, wcale nie grając głośniej — jest ostrzejsza, nie głośniejsza.",
        },
        listen: { videoId: "sFLmCgYOd38", credit: "Big Walter Horton", caption: {
          en: "Big Walter Horton, live — \"It's Not Easy\". Listen for the hand movement shaping the tone throughout — that wah-wah isn't an effects pedal, it's his hands.",
          no: "Big Walter Horton, live — «It's Not Easy». Legg merke til håndbevegelsen som former klangen gjennom hele — den wah-wah-en er ingen effektpedal, det er hendene hans.",
          sv: "Big Walter Horton, live — \"It's Not Easy\". Lägg märke till handrörelsen som formar klangen genomgående — den där wah-wah:n är ingen effektpedal, det är hans händer.",
          de: "Big Walter Horton, live — „It's Not Easy“. Achte durchgehend auf die Handbewegung, die den Klang formt — dieses Wah-wah ist kein Effektpedal, das sind seine Hände.",
          pl: "Big Walter Horton, na żywo — „It's Not Easy”. Zwróć uwagę na ruch dłoni kształtujący barwę przez cały czas — to wah-wah to nie efekt z pedału, to jego dłonie.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "Big Walter Horton's hand and tongue control is why so many harp players study him closely — his profile has more.",
          no: "Big Walter Hortons hånd- og tungekontroll er grunnen til at så mange munnspillere studerer ham nøye — profilen hans har mer.",
          sv: "Big Walter Hortons hand- och tungkontroll är anledningen till att så många munspelare studerar honom noga — hans profil har mer.",
          de: "Big Walter Hortons Hand- und Zungenkontrolle ist der Grund, warum so viele Harp-Spieler ihn genau studieren — sein Profil hat mehr.",
          pl: "Kontrola dłoni i języka Big Waltera Hortona to powód, dla którego tak wielu harmonijkarzy uważnie go studiuje — jego profil zawiera więcej.",
        },
        artistSlug: "big-walter-horton",
        illustration: { kind: "harp", highlight: [4], direction: "draw", label: { en: "Hole 4, draw", no: "Hull 4, drag", sv: "Hål 4, drag", de: "Loch 4, ziehen", pl: "Otwór 4, wdech" } },
      },
      {
        id: "harmonica-callresponse",
        phase: PHASE_LANGUAGE,
        title: { en: "Call & Response", no: "Kall og svar", sv: "Kall och svar", de: "Ruf & Antwort", pl: "Wołanie i odpowiedź" },
        badge: { en: "Call & response", no: "Kall og svar", sv: "Kall och svar", de: "Ruf & Antwort", pl: "Wołanie i odpowiedź" },
        goal: {
          en: "Play a short phrase, leave space, then answer it with a slightly different one — a musical conversation with yourself.",
          no: "Spille en kort frase, la det være rom, og svar den så med en litt annen — en musikalsk samtale med deg selv.",
          sv: "Spela en kort fras, lämna rum, och svara den sedan med en lite annan — ett musikaliskt samtal med dig själv.",
          de: "Eine kurze Phrase spielen, Raum lassen, dann mit einer leicht anderen antworten — ein musikalisches Gespräch mit dir selbst.",
          pl: "Zagrać krótką frazę, zostawić przestrzeń, a potem odpowiedzieć na nią lekko inną — muzyczną rozmowę z samym sobą.",
        },
        successTest: {
          en: "Can you play your riff, pause, then play a version that ends differently — a real answer, not a copy?",
          no: "Klarer du å spille riffen din, pause, og så spille en versjon som slutter annerledes — et ekte svar, ikke en kopi?",
          sv: "Klarar du att spela ditt riff, pausa, och sedan spela en version som slutar annorlunda — ett riktigt svar, inte en kopia?",
          de: "Schaffst du es, dein Riff zu spielen, zu pausieren und dann eine Version zu spielen, die anders endet — eine echte Antwort, keine Kopie?",
          pl: "Czy potrafisz zagrać swój riff, zrobić pauzę, a potem zagrać wersję, która kończy się inaczej — prawdziwą odpowiedź, nie kopię?",
        },
        steps: {
          en: "Play your riff from a few lessons back — draw 4, draw 3, blow 2, draw 2 — then stop completely for a full two beats. Now play it again, but change the very last note, ending on draw 3 instead of draw 2. That small change turns a repeated riff into a conversation: a call, a pause, and a response that isn't identical to the call. This is one of the oldest ideas in blues — the harmonica answering a singer, or answering itself.",
          no: "Spill riffen din fra noen leksjoner tilbake — drag 4, drag 3, blås 2, drag 2 — stopp så helt i to hele slag. Spill den nå igjen, men endre den aller siste tonen, avslutt på drag 3 i stedet for drag 2. Den lille endringen gjør en gjentatt riff om til en samtale: et kall, en pause, og et svar som ikke er identisk med kallet. Dette er en av de eldste ideene i blues — munnspillet som svarer en vokalist, eller svarer seg selv.",
          sv: "Spela ditt riff från några lektioner tillbaka — drag 4, drag 3, blås 2, drag 2 — stanna sedan helt i två hela slag. Spela det nu igen, men ändra den allra sista tonen, avsluta på drag 3 istället för drag 2. Den lilla ändringen gör ett upprepat riff till ett samtal: ett kall, en paus, och ett svar som inte är identiskt med kallet. Det här är en av de äldsta idéerna i blues — munspelet som svarar en sångare, eller svarar sig själv.",
          de: "Spiel dein Riff von vor ein paar Lektionen — ziehen 4, ziehen 3, blasen 2, ziehen 2 — halt dann für zwei volle Schläge komplett an. Spiel es jetzt noch einmal, aber ändere den allerletzten Ton, ende auf ziehen 3 statt ziehen 2. Diese kleine Änderung macht aus einem wiederholten Riff ein Gespräch: einen Ruf, eine Pause und eine Antwort, die nicht identisch mit dem Ruf ist. Das ist eine der ältesten Ideen im Blues — die Mundharmonika antwortet einem Sänger oder sich selbst.",
          pl: "Zagraj swój riff sprzed kilku lekcji — draw 4, draw 3, blow 2, draw 2 — potem zatrzymaj się całkowicie na dwa pełne uderzenia. Teraz zagraj go ponownie, ale zmień ostatnią nutę, kończąc na draw 3 zamiast draw 2. Ta mała zmiana zamienia powtarzany riff w rozmowę: wołanie, pauzę i odpowiedź, która nie jest identyczna z wołaniem. To jedna z najstarszych idei w bluesie — harmonijka odpowiadająca wokaliście albo odpowiadająca samej sobie.",
        },
        listen: { videoId: "FNmjX4gnmgk", credit: "Big Walter Horton", caption: {
          en: "Big Walter Horton, live — \"I Cry for You\". Listen for how each phrase answers the one before it, like a conversation rather than a solo running straight through.",
          no: "Big Walter Horton, live — «I Cry for You». Legg merke til hvordan hver frase svarer den forrige, som en samtale heller enn et solo som bare kjører rett gjennom.",
          sv: "Big Walter Horton, live — \"I Cry for You\". Lägg märke till hur varje fras svarar den föregående, som ett samtal snarare än ett solo som bara kör rakt igenom.",
          de: "Big Walter Horton, live — „I Cry for You“. Achte darauf, wie jede Phrase auf die vorherige antwortet, eher wie ein Gespräch als ein Solo, das einfach durchläuft.",
          pl: "Big Walter Horton, na żywo — „I Cry for You”. Zwróć uwagę, jak każda fraza odpowiada na poprzednią, bardziej jak rozmowa niż solówka lecąca prosto przed siebie.",
        }},
        backing: HARMONICA_BACKING(),
        nextTip: {
          en: "Big Walter Horton spent his career having exactly this kind of conversation with a room — his profile has more to hear.",
          no: "Big Walter Horton tilbrakte karrieren med akkurat denne typen samtale med et rom — profilen hans har mer å høre.",
          sv: "Big Walter Horton tillbringade sin karriär med precis den här typen av samtal med ett rum — hans profil har mer att lyssna på.",
          de: "Big Walter Horton führte seine ganze Karriere lang genau diese Art von Gespräch mit einem Raum — sein Profil hat mehr zu hören.",
          pl: "Big Walter Horton spędził karierę na prowadzeniu dokładnie tego rodzaju rozmowy z salą — jego profil zawiera więcej do posłuchania.",
        },
        artistSlug: "big-walter-horton",
        illustration: { kind: "harp", highlight: [2, 3, 4], label: { en: "Holes 2–4", no: "Hull 2–4", sv: "Hål 2–4", de: "Löcher 2–4", pl: "Otwory 2–4" } },
      },
      {
        id: "harmonica-buildphrase",
        phase: PHASE_PLAYING,
        title: { en: "Building a Blues Phrase", no: "Bygge en bluesfrase", sv: "Bygga en bluesfras", de: "Eine Blues-Phrase bauen", pl: "Budowanie bluesowej frazy" },
        badge: { en: "Your phrase", no: "Din frase", sv: "Din fras", de: "Deine Phrase", pl: "Twoja fraza" },
        goal: {
          en: "Put your riff, a bend and real space together into one phrase that's genuinely yours, played over the full 12-bar.",
          no: "Sette riffen din, en bend og ekte rom sammen til én frase som er genuint din, spilt over hele 12-takteren.",
          sv: "Sätta ihop ditt riff, en bend och riktigt rum till en fras som är genuint din, spelad över hela 12-takten.",
          de: "Dein Riff, einen Bend und echten Raum zu einer Phrase zusammenfügen, die wirklich dir gehört, gespielt über den ganzen 12-Takter.",
          pl: "Połączyć swój riff, bend i prawdziwą przestrzeń w jedną frazę, która naprawdę jest twoja, zagraną nad całym 12-taktem.",
        },
        successTest: {
          en: "Can you play your riff with one bend in it, then rest a full bar before repeating it?",
          no: "Klarer du å spille riffen din med én bend i seg, og så hvile en hel takt før du gjentar den?",
          sv: "Klarar du att spela ditt riff med en bend i sig, och sedan vila en hel takt innan du upprepar det?",
          de: "Schaffst du es, dein Riff mit einem Bend darin zu spielen und dann einen vollen Takt zu pausieren, bevor du es wiederholst?",
          pl: "Czy potrafisz zagrać swój riff z jednym bendem, a potem odpocząć przez cały takt, zanim go powtórzysz?",
        },
        steps: {
          en: "Play your riff, bend hole 2 on the way through it somewhere, then stop for a full bar before you repeat it. That's a complete phrase: a musical idea, a moment of tension, and a rest. Play it over the full 12-bar backing from the Ears lesson, entering wherever feels natural. It doesn't need to be clever or fast. A single well-placed riff, played with confidence and space around it, is real blues harmonica — not a warm-up for something bigger.",
          no: "Spill riffen din, bend hull 2 et sted underveis, stopp så i en hel takt før du gjentar den. Det er en komplett frase: en musikalsk idé, et øyeblikk med spenning, og en hvile. Spill den over hele 12-takteren fra ørelæksjonen, kom inn der det føles naturlig. Den trenger ikke være smart eller rask. Én velplassert riff, spilt med selvtillit og rom rundt seg, er ekte bluesmunnspill — ikke en oppvarming til noe større.",
          sv: "Spela ditt riff, benda hål 2 någonstans på vägen, stanna sedan i en hel takt innan du upprepar det. Det är en komplett fras: en musikalisk idé, ett ögonblick av spänning, och en vila. Spela den över hela 12-takten från örlektionen, kom in där det känns naturligt. Den behöver inte vara smart eller snabb. Ett enda välplacerat riff, spelat med självförtroende och rum runt sig, är riktigt bluesmunspel — inte en uppvärmning till något större.",
          de: "Spiel dein Riff, bend Loch 2 irgendwo unterwegs, halt dann einen vollen Takt an, bevor du es wiederholst. Das ist eine vollständige Phrase: eine musikalische Idee, ein Moment der Spannung und eine Pause. Spiel sie über den ganzen 12-Takter aus der Ohren-Lektion, steig ein, wo es sich natürlich anfühlt. Sie muss nicht clever oder schnell sein. Ein einziges gut platziertes Riff, selbstbewusst gespielt mit Raum drumherum, ist echte Blues-Harp — kein Aufwärmen für etwas Größeres.",
          pl: "Zagraj swój riff, wygnij otwór 2 gdzieś po drodze, potem zatrzymaj się na cały takt, zanim go powtórzysz. To kompletna fraza: pomysł muzyczny, moment napięcia i odpoczynek. Zagraj ją nad całym 12-taktem z lekcji o uszach, wchodząc tam, gdzie czujesz się naturalnie. Nie musi być sprytna ani szybka. Jeden dobrze umieszczony riff, zagrany pewnie i z przestrzenią wokół, to prawdziwa bluesowa harmonijka — nie rozgrzewka przed czymś większym.",
        },
        backing: {
          ...HARMONICA_BACKING(),
          caption: {
            en: "Backing in E, the full 12-bar. Play your phrase, rest, then bring it back.",
            no: "Backing i E, hele 12-takteren. Spill frasen din, hvil, ta den så tilbake.",
            sv: "Backing i E, hela 12-takten. Spela din fras, vila, ta sedan tillbaka den.",
            de: "Backing in E, der ganze 12-Takter. Spiel deine Phrase, ruh dich aus, hol sie dann zurück.",
            pl: "Podkład w E, cały 12-takt. Zagraj swoją frazę, odpocznij, potem wróć do niej.",
          },
        },
        nextTip: {
          en: "That's genuinely how blues harmonica works — small ideas, repeated and varied. Little Walter's profile is where this course has been pointing all along.",
          no: "Sånn fungerer bluesmunnspill faktisk — små ideer, gjentatt og variert. Profilen til Little Walter er der dette kurset har pekt hele veien.",
          sv: "Så fungerar bluesmunspel faktiskt — små idéer, upprepade och varierade. Little Walters profil är dit den här kursen har pekat hela tiden.",
          de: "So funktioniert Blues-Harp tatsächlich — kleine Ideen, wiederholt und variiert. Little Walters Profil ist, worauf dieser Kurs die ganze Zeit hinweist.",
          pl: "Tak właśnie działa bluesowa harmonijka — małe pomysły, powtarzane i wariowane. Profil Little Waltera to miejsce, do którego ten kurs prowadził od samego początku.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "none" },
      },
    ],
  },
];

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}
