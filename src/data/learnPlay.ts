// Content for /learn/play — a small, hand-written beginner course (guitar +
// harmonica), not a database-driven feature. Voice: bluesy, warm, positive,
// plain — someone sitting next to you showing the grip, not a textbook.
//
// Video honesty rule (same as the quiz audio-guess fixes): every videoId
// here is a REAL video, already verified via YouTube oEmbed AND already
// linked on that artist's own SlowBlues profile (artists.youtube_video_ids)
// — never a guessed ID. Where no verified, technique-appropriate video
// exists yet, the slot is `{ type: "comingSoon" }` and rendered as warm
// "coming soon" copy, never a dead iframe. See the delivery notes for the
// exact TODO list of what's still needed (mainly: generic instrumental
// backing tracks, which by nature aren't tied to any artist profile and
// need a human pick, not a guessed search result).

export type LearnLang = "en" | "no" | "sv" | "de" | "pl";
export type LangText = Record<LearnLang, string>;

export type Media =
  | { type: "video"; videoId: string; caption: LangText }
  | { type: "comingSoon"; caption: LangText };

export type Illustration =
  | { kind: "chord"; chord: "E" | "A" | "B7" }
  | { kind: "harp"; highlight: number[]; direction?: "blow" | "draw" }
  | { kind: "none" };

export type Lesson = {
  id: string;
  title: LangText;
  goal: LangText;
  steps: LangText;
  listen: Media;
  backing: Media;
  nextTip: LangText;
  artistSlug: string;
  illustration: Illustration;
};

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
  title: { en: "Ears First", no: "Ørene først", sv: "Öronen först", de: "Erst die Ohren", pl: "Najpierw uszy" } satisfies LangText,
  goal: {
    en: "Know what a 12-bar blues actually is — in your body, not on paper — before you touch an instrument.",
    no: "Kjenne hva en 12-takters blues faktisk er — i kroppen, ikke på papiret — før du rører et instrument.",
    sv: "Känna vad en 12-takters blues faktiskt är — i kroppen, inte på papper — innan du rör ett instrument.",
    de: "Spüren, was ein 12-Takt-Blues wirklich ist — im Körper, nicht auf dem Papier — bevor du ein Instrument anfasst.",
    pl: "Poczuć, czym naprawdę jest 12-taktowy blues — w ciele, nie na papierze — zanim dotkniesz instrumentu.",
  } satisfies LangText,
  steps: {
    en: "12 bars, four beats in each. Count the bars out loud, 1 to 12, clapping or tapping your foot along — that's the whole form, and most blues songs ever written live inside it. Three chords do the work: the home chord, the one that lifts you up, and the one that wants to come back home. That's it — that's I, IV and V, and you never need the Roman numerals again. One more thing before you play a single note: let the last note of a line ring out. Don't rush into the next one. The silence is part of the music.",
    no: "12 takter, fire slag i hver. Tell taktene høyt, 1 til 12, mens du klapper eller tramper takten — det er hele formen, og de fleste blueslåter som noen gang er skrevet bor inni den. Tre akkorder gjør jobben: hjemmeakkorden, den som løfter deg opp, og den som vil hjem igjen. Det er alt — det er I, IV og V, og du trenger aldri romertallene igjen. Én ting til før du spiller en eneste tone: la siste tonen i en linje få stå. Ikke rush inn i den neste. Stillheten er en del av musikken.",
    sv: "12 takter, fyra slag i varje. Räkna takterna högt, 1 till 12, medan du klappar eller stampar takten — det är hela formen, och de flesta blueslåtar som någonsin skrivits bor inuti den. Tre ackord gör jobbet: hemackordet, det som lyfter dig upp, och det som vill hem igen. Det är allt — det är I, IV och V, och du behöver aldrig romerska siffror igen. En sak till innan du spelar en enda ton: låt sista tonen i en rad klinga ut. Skynda inte in i nästa. Tystnaden är en del av musiken.",
    de: "12 Takte, vier Schläge in jedem. Zähl die Takte laut, 1 bis 12, während du klatschst oder den Takt stampfst — das ist die ganze Form, und die meisten je geschriebenen Bluessongs leben in ihr. Drei Akkorde erledigen die Arbeit: der Heimatakkord, der, der dich hochhebt, und der, der wieder nach Hause will. Das ist alles — das sind I, IV und V, und du brauchst die römischen Zahlen nie wieder. Noch etwas, bevor du auch nur einen Ton spielst: Lass den letzten Ton einer Zeile ausklingen. Hetz nicht in die nächste. Die Stille gehört zur Musik.",
    pl: "12 taktów, cztery uderzenia w każdym. Licz takty głośno, od 1 do 12, klaszcząc albo stukając stopą w rytm — to cała forma, i większość bluesowych utworów mieści się w niej. Trzy akordy robią całą robotę: akord domowy, ten, który cię unosi, i ten, który chce wrócić do domu. To wszystko — to I, IV i V, i rzymskich cyfr nigdy więcej nie potrzebujesz. Jeszcze jedno, zanim zagrasz choć jedną nutę: pozwól ostatniej nucie frazy wybrzmieć. Nie wpadaj od razu w kolejną. Cisza też jest częścią muzyki.",
  } satisfies LangText,
  backing: { type: "comingSoon", caption: {
    en: "Nothing to play yet. Just listen and count.",
    no: "Ingenting å spille ennå. Bare lytt og tell.",
    sv: "Inget att spela än. Bara lyssna och räkna.",
    de: "Noch nichts zum Spielen. Nur zuhören und zählen.",
    pl: "Jeszcze nic do grania. Po prostu słuchaj i licz.",
  }} satisfies Media,
  illustration: { kind: "none" } satisfies Illustration,
};

const EARS_LISTEN_CAPTION: LangText = {
  en: "Count along to 12 bars and hear how the line answers itself.",
  no: "Tell med til 12 takter og hør hvordan linjen svarer seg selv.",
  sv: "Räkna med till 12 takter och hör hur linjen svarar sig själv.",
  de: "Zähl die 12 Takte mit und hör, wie die Zeile sich selbst antwortet.",
  pl: "Licz razem do 12 taktów i posłuchaj, jak fraza sama sobie odpowiada.",
};

function makeEarsLesson(videoId: string, artistSlug: string, nextTip: LangText): Lesson {
  return {
    ...EARS_SHARED,
    listen: { type: "video", videoId, caption: EARS_LISTEN_CAPTION },
    nextTip,
    artistSlug,
  };
}

const EARS_GUITAR = makeEarsLesson("i0hVIrQm0KM", "stevie-ray-vaughan", {
  en: "That's a full 12-bar right there — Stevie Ray Vaughan's profile is where this course ends up.",
  no: "Det er en hel 12-takter rett der — profilen til Stevie Ray Vaughan er der dette kurset ender opp.",
  sv: "Det är en hel 12-takt rakt där — Stevie Ray Vaughans profil är dit den här kursen leder.",
  de: "Das ist genau dort ein voller 12-Takter — Stevie Ray Vaughans Profil ist, wo dieser Kurs hinführt.",
  pl: "To właśnie tam masz cały 12-takt — profil Stevie'ego Raya Vaughana to miejsce, do którego zmierza ten kurs.",
});

const EARS_HARMONICA = makeEarsLesson("HxkqDe7DN8g", "little-walter", {
  en: "That's a full 12-bar right there — Little Walter's profile is where this course ends up.",
  no: "Det er en hel 12-takter rett der — profilen til Little Walter er der dette kurset ender opp.",
  sv: "Det är en hel 12-takt rakt där — Little Walters profil är dit den här kursen leder.",
  de: "Das ist genau dort ein voller 12-Takter — Little Walters Profil ist, wo dieser Kurs hinführt.",
  pl: "To właśnie tam masz cały 12-takt — profil Little Waltera to miejsce, do którego zmierza ten kurs.",
});

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
        title: { en: "Tuning & Hold", no: "Stemming og hold", sv: "Stämning och hållning", de: "Stimmen & Haltung", pl: "Strojenie i trzymanie" },
        goal: {
          en: "Hold the guitar so it feels like part of you, and get it roughly in tune.",
          no: "Holde gitaren slik at den føles som en del av deg, og få den noenlunde stemt.",
          sv: "Hålla gitarren så den känns som en del av dig, och få den ungefär stämd.",
          de: "Die Gitarre so halten, dass sie sich wie ein Teil von dir anfühlt, und sie grob stimmen.",
          pl: "Trzymać gitarę tak, by czuła się jak część ciebie, i nastroić ją w miarę dokładnie.",
        },
        steps: {
          en: "Sit down, guitar body resting against your stomach, neck angled up a little — not flat, not pointing at the ceiling. Use a tuner app for now; your ear will catch up later. Rest your picking hand loosely near the sound hole or bridge, shoulders down, no death grip on the neck. If your hand hurts, you're squeezing too hard.",
          no: "Sitt ned, gitarkroppen mot magen, halsen litt vinklet opp — verken flat eller pekende mot taket. Bruk en stemme-app foreløpig, øret ditt tar igjen senere. La plekterhånden hvile løst nær lydhullet eller stolen, skuldrene ned, ikke dødsgrep på halsen. Gjør hånden vondt, klemmer du for hardt.",
          sv: "Sitt ner, gitarrkroppen mot magen, halsen lite vinklad uppåt — varken platt eller pekande i taket. Använd en stämapp än så länge, örat hinner ikapp senare. Låt plekterhanden vila löst nära ljudhålet eller stallet, axlarna ner, inget dödsgrepp på halsen. Gör handen ont klämmer du för hårt.",
          de: "Setz dich hin, der Gitarrenkorpus liegt am Bauch, der Hals zeigt leicht nach oben — nicht flach, nicht zur Decke. Nutze vorerst eine Stimm-App, dein Ohr holt später auf. Die Anschlaghand ruht locker nahe dem Schalloch oder Steg, Schultern entspannt, kein Todesgriff am Hals. Tut die Hand weh, drückst du zu fest.",
          pl: "Usiądź, korpus gitary opiera się o brzuch, gryf lekko uniesiony — nie płasko, nie w sufit. Na razie używaj tunera w telefonie, ucho dogoni później. Ręka od uderzania spoczywa luźno blisko otworu rezonansowego albo mostka, ramiona opuszczone, żadnego zaciskania na gryfie. Jeśli boli cię ręka, ściskasz za mocno.",
        },
        listen: { type: "comingSoon", caption: {
          en: "A hold/posture demo clip is coming here.",
          no: "Et demoklipp om hold/sittestilling kommer her.",
          sv: "Ett demoklipp om hållning kommer hit.",
          de: "Ein Demo-Clip zur Haltung folgt hier.",
          pl: "Klip demonstracyjny o postawie pojawi się tutaj.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "Nothing to play yet — get comfortable first.",
          no: "Ingenting å spille ennå — bli komfortabel først.",
          sv: "Inget att spela än — bli bekväm först.",
          de: "Noch nichts zum Spielen — erst mal wohlfühlen.",
          pl: "Jeszcze nic do grania — najpierw poczuj się swobodnie.",
        }},
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
        title: { en: "E and A", no: "E og A", sv: "E och A", de: "E und A", pl: "E i A" },
        goal: {
          en: "Switch cleanly between open E and open A without looking down.",
          no: "Bytte rent mellom åpen E og åpen A uten å se ned.",
          sv: "Byta rent mellan öppen E och öppen A utan att titta ner.",
          de: "Sauber zwischen offenem E und offenem A wechseln, ohne runterzuschauen.",
          pl: "Czysto przełączać się między otwartym E i otwartym A, nie patrząc w dół.",
        },
        steps: {
          en: "Set your fingers for E, strum four slow downstrokes. Move to A, same four strokes. Back to E. The goal isn't speed — it's landing every finger in the same spot every time. If a string buzzes, that finger needs to press closer to the fret wire, not harder.",
          no: "Sett fingrene til E, strum fire sakte nedslag. Flytt til A, samme fire slag. Tilbake til E. Målet er ikke fart — det er at hver finger lander på samme sted hver gang. Durrer en streng, må fingeren nærmere båndet, ikke hardere ned.",
          sv: "Sätt fingrarna till E, strumma fyra långsamma nedslag. Flytta till A, samma fyra slag. Tillbaka till E. Målet är inte fart — det är att varje finger landar på samma ställe varje gång. Surrar en sträng, behöver fingret närmare bandet, inte hårdare ner.",
          de: "Finger für E setzen, vier langsame Abschläge. Wechsel zu A, gleiche vier Schläge. Zurück zu E. Ziel ist nicht Tempo — jeder Finger soll jedes Mal an derselben Stelle landen. Schnarrt eine Saite, muss der Finger näher an den Bund, nicht fester drücken.",
          pl: "Ustaw palce na E, cztery powolne uderzenia w dół. Przejdź do A, te same cztery uderzenia. Wróć do E. Celem nie jest szybkość — chodzi o to, by każdy palec za każdym razem trafiał w to samo miejsce. Jeśli struna brzęczy, palec musi być bliżej progu, nie mocniej dociśnięty.",
        },
        listen: { type: "comingSoon", caption: {
          en: "A clean E/A switch demo is coming here.",
          no: "En demo av rent bytte mellom E/A kommer her.",
          sv: "En demo av rent byte mellan E/A kommer hit.",
          de: "Eine Demo des sauberen E/A-Wechsels folgt hier.",
          pl: "Demo czystego przełączania E/A pojawi się tutaj.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A simple two-chord loop to play along to is coming here.",
          no: "En enkel to-akkords-løkke å spille til kommer her.",
          sv: "En enkel tvåackordsloop att spela till kommer hit.",
          de: "Eine einfache Zwei-Akkord-Schleife zum Mitspielen folgt hier.",
          pl: "Prosta pętla dwóch akordów do grania razem pojawi się tutaj.",
        }},
        nextTip: {
          en: "Muddy Waters plugged this exact vocabulary into an amplifier and changed everything.",
          no: "Muddy Waters plugget akkurat dette vokabularet inn i en forsterker og endret alt.",
          sv: "Muddy Waters kopplade exakt det här vokabuläret till en förstärkare och förändrade allt.",
          de: "Muddy Waters steckte genau dieses Vokabular in einen Verstärker und veränderte alles.",
          pl: "Muddy Waters podłączył dokładnie to samo słownictwo do wzmacniacza i zmienił wszystko.",
        },
        artistSlug: "muddy-waters",
        illustration: { kind: "chord", chord: "E" },
      },
      {
        id: "guitar-3",
        title: { en: "12-Bar, Slow", no: "12-takter, sakte", sv: "12-takter, långsamt", de: "12 Takte, langsam", pl: "12 taktów, powoli" },
        goal: {
          en: "Play a full slow 12-bar in E-A-B7 without losing the count.",
          no: "Spille en hel sakte 12-takter i E-A-B7 uten å miste tellingen.",
          sv: "Spela en hel långsam 12-takter i E-A-B7 utan att tappa räkningen.",
          de: "Einen ganzen langsamen 12-Takter in E-A-B7 spielen, ohne den Überblick zu verlieren.",
          pl: "Zagrać cały powolny 12-taktowy schemat E-A-B7, nie gubiąc liczenia.",
        },
        steps: {
          en: "Remember I-IV-V from the ears lesson? Here it is with names: E (4 bars), A (2 bars), E (2 bars), B7 (1 bar), A (1 bar), E (2 bars). Count out loud while you change chords — the counting matters more than the chords right now. Slow enough that you never panic is the correct speed.",
          no: "Husker du I-IV-V fra ørelæksjonen? Her er den med navn: E (4 takter), A (2 takter), E (2 takter), B7 (1 takt), A (1 takt), E (2 takter). Tell høyt mens du bytter akkorder — tellingen betyr mer enn akkordene akkurat nå. Sakte nok til at du aldri panikker er riktig fart.",
          sv: "Minns du I-IV-V från örlektionen? Här är den med namn: E (4 takter), A (2 takter), E (2 takter), B7 (1 takt), A (1 takt), E (2 takter). Räkna högt medan du byter ackord — räknandet betyder mer än ackorden just nu. Långsamt nog att du aldrig panikar är rätt tempo.",
          de: "Erinnerst du dich an I-IV-V aus der Ohren-Lektion? Hier mit Namen: E (4 Takte), A (2 Takte), E (2 Takte), B7 (1 Takt), A (1 Takt), E (2 Takte). Zähl laut mit, während du wechselst — das Zählen zählt gerade mehr als die Akkorde. Langsam genug, dass du nie in Panik gerätst, ist das richtige Tempo.",
          pl: "Pamiętasz I-IV-V z lekcji o uszach? Oto ono z nazwami: E (4 takty), A (2 takty), E (2 takty), B7 (1 takt), A (1 takt), E (2 takty). Licz głośno, zmieniając akordy — teraz liczenie liczy się bardziej niż akordy. Właściwe tempo to takie, przy którym nigdy nie wpadasz w panikę.",
        },
        listen: { type: "video", videoId: "ClpR3fOKPRA", caption: {
          en: "Buddy Guy — \"Feels Like Rain\". Notice how unhurried it is.",
          no: "Buddy Guy — «Feels Like Rain». Legg merke til hvor uhastig den er.",
          sv: "Buddy Guy — \"Feels Like Rain\". Lägg märke till hur ohastig den är.",
          de: "Buddy Guy — „Feels Like Rain“. Achte darauf, wie unaufgeregt das ist.",
          pl: "Buddy Guy — „Feels Like Rain”. Zwróć uwagę, jak bardzo bez pośpiechu to brzmi.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A slow backing track in E is coming here.",
          no: "Et sakte backing-spor i E kommer her.",
          sv: "Ett långsamt backingspår i E kommer hit.",
          de: "Ein langsames Backing-Track in E folgt hier.",
          pl: "Wolny podkład w E pojawi się tutaj.",
        }},
        nextTip: {
          en: "Buddy Guy is still playing this feeling live today — his profile has more.",
          no: "Buddy Guy spiller fortsatt denne følelsen live i dag — profilen har mer.",
          sv: "Buddy Guy spelar fortfarande den här känslan live idag — profilen har mer.",
          de: "Buddy Guy spielt dieses Gefühl bis heute live — sein Profil hat mehr.",
          pl: "Buddy Guy wciąż gra to uczucie na żywo — na jego profilu znajdziesz więcej.",
        },
        artistSlug: "buddy-guy",
        illustration: { kind: "chord", chord: "B7" },
      },
      {
        id: "guitar-4",
        title: { en: "Shuffle", no: "Shuffle", sv: "Shuffle", de: "Shuffle", pl: "Shuffle" },
        goal: {
          en: "Feel the shuffle bounce instead of playing straight, even eighth notes.",
          no: "Kjenne shuffle-gyngen i stedet for å spille rette, jevne åttendedeler.",
          sv: "Känna shuffle-gungan i stället för att spela raka, jämna åttondelar.",
          de: "Den Shuffle-Groove spüren statt gerader, gleichmäßiger Achtel.",
          pl: "Poczuć kołyszący rytm shuffle zamiast prostych, równych ósemek.",
        },
        steps: {
          en: "Long-short, long-short — that's a shuffle, not long-long-long-long. Play it on a single E chord first: two notes per beat, but the first one gets more time than the second, like a limping walk. Once that bounce feels natural on one chord, carry it into the full 12-bar from lesson 3.",
          no: "Lang-kort, lang-kort — det er en shuffle, ikke lang-lang-lang-lang. Spill den på en enkelt E-akkord først: to toner per slag, men den første får mer tid enn den andre, som en haltende gange. Når gyngen føles naturlig på én akkord, ta den med inn i hele 12-takteren fra leksjon 3.",
          sv: "Lång-kort, lång-kort — det är en shuffle, inte lång-lång-lång-lång. Spela den på ett enda E-ackord först: två toner per slag, men den första får mer tid än den andra, som en haltande gång. När gungan känns naturlig på ett ackord, ta med den in i hela 12-takten från lektion 3.",
          de: "Lang-kurz, lang-kurz — das ist ein Shuffle, nicht lang-lang-lang-lang. Spiel ihn zuerst auf einem einzigen E-Akkord: zwei Töne pro Schlag, aber der erste bekommt mehr Zeit als der zweite, wie ein hinkender Gang. Fühlt sich der Groove auf einem Akkord natürlich an, nimm ihn mit in den vollen 12-Takter aus Lektion 3.",
          pl: "Długo-krótko, długo-krótko — to jest shuffle, nie długo-długo-długo-długo. Zagraj to najpierw na samym akordzie E: dwie nuty na uderzenie, ale pierwsza trwa dłużej niż druga, jak kulawy chód. Gdy to kołysanie stanie się naturalne na jednym akordzie, przenieś je do całego 12-taktu z lekcji 3.",
        },
        listen: { type: "video", videoId: "i0hVIrQm0KM", caption: {
          en: "Stevie Ray Vaughan — \"Pride and Joy\". The shuffle that taught a generation.",
          no: "Stevie Ray Vaughan — «Pride and Joy». Shufflen som lærte opp en generasjon.",
          sv: "Stevie Ray Vaughan — \"Pride and Joy\". Shuffeln som lärde upp en generation.",
          de: "Stevie Ray Vaughan — „Pride and Joy“. Der Shuffle, der eine Generation lehrte.",
          pl: "Stevie Ray Vaughan — „Pride and Joy”. Shuffle, który uczył całe pokolenie.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A shuffle backing track in E is coming here.",
          no: "Et shuffle-backingspor i E kommer her.",
          sv: "Ett shuffle-backingspår i E kommer hit.",
          de: "Ein Shuffle-Backing-Track in E folgt hier.",
          pl: "Podkład shuffle w E pojawi się tutaj.",
        }},
        nextTip: {
          en: "Stevie Ray Vaughan's whole catalogue lives on this same bounce — his profile is next.",
          no: "Hele katalogen til Stevie Ray Vaughan lever på denne samme gyngen — profilen er neste steg.",
          sv: "Hela Stevie Ray Vaughans katalog lever på den här gungan — profilen är nästa steg.",
          de: "Stevie Ray Vaughans gesamter Katalog lebt von diesem Groove — sein Profil ist der nächste Schritt.",
          pl: "Cały katalog Stevie'ego Raya Vaughana żyje tym samym kołysaniem — jego profil to następny krok.",
        },
        artistSlug: "stevie-ray-vaughan",
        illustration: { kind: "chord", chord: "E" },
      },
      {
        id: "guitar-5",
        title: { en: "One Taste of Slide", no: "Én smak av slide", sv: "En smak av slide", de: "Ein Geschmack Slide", pl: "Jeden smak slide'a" },
        goal: {
          en: "Get one clean, singing slide note on one string.",
          no: "Få én ren, syngende slide-tone på én streng.",
          sv: "Få en ren, sjungande slide-ton på en sträng.",
          de: "Einen klaren, singenden Slide-Ton auf einer Saite hinbekommen.",
          pl: "Uzyskać jedną czystą, śpiewną nutę slide na jednej strunie.",
        },
        steps: {
          en: "Put a slide on your ring or pinky finger — keep your other fingers free. Rest it lightly right over the fret wire, not behind it like normal fretting, and barely touching the string. Pick one string, slide slowly up two frets and back, and let each end ring before you move. Too much pressure kills the singing tone — this is the one lesson where less is more.",
          no: "Sett en slide på ringfingeren eller lillefingeren — hold de andre fingrene fri. La den hvile lett rett over båndstaget, ikke bak det som ved vanlig grep, og så vidt berøre strengen. Plukk én streng, gli sakte opp to bånd og tilbake, og la hver ende ringe før du beveger deg. For mye trykk dreper den syngende tonen — dette er leksjonen der mindre er mer.",
          sv: "Sätt en slide på ringfingret eller lillfingret — håll de andra fingrarna fria. Låt den vila lätt precis över bandstaget, inte bakom det som vid vanligt grepp, och nätt och jämnt röra strängen. Plocka en sträng, glid långsamt upp två band och tillbaka, och låt varje ände klinga innan du rör dig. För mycket tryck dödar den sjungande tonen — det här är lektionen där mindre är mer.",
          de: "Setz einen Slide auf Ring- oder kleinen Finger — die anderen Finger bleiben frei. Lass ihn locker direkt über dem Bundstäbchen liegen, nicht dahinter wie beim normalen Greifen, und berühre die Saite nur leicht. Zupf eine Saite, gleite langsam zwei Bünde hoch und zurück, und lass jedes Ende ausklingen, bevor du weitermachst. Zu viel Druck tötet den singenden Ton — hier gilt: weniger ist mehr.",
          pl: "Załóż slide na palec serdeczny lub mały — pozostałe palce zostają wolne. Oprzyj go lekko dokładnie nad progiem, nie za nim jak przy zwykłym chwycie, i ledwo dotykaj struny. Uderz jedną strunę, przesuń powoli o dwa progi w górę i z powrotem, pozwalając każdemu końcowi wybrzmieć zanim ruszysz dalej. Zbyt duży nacisk zabija śpiewny ton — to jedna lekcja, w której mniej znaczy więcej.",
        },
        listen: { type: "comingSoon", caption: {
          en: "A slide demo clip is coming here.",
          no: "Et slide-demoklipp kommer her.",
          sv: "Ett slide-demoklipp kommer hit.",
          de: "Ein Slide-Demo-Clip folgt hier.",
          pl: "Klip demonstracyjny slide'a pojawi się tutaj.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A slow one-chord drone to slide over is coming here.",
          no: "En sakte enkeltakkord-dronelyd å slide over kommer her.",
          sv: "En långsam enackordsdrone att slida över kommer hit.",
          de: "Ein langsamer Ein-Akkord-Drone zum Slide-Üben folgt hier.",
          pl: "Wolny jednoakordowy dron do ślizgania się po nim pojawi się tutaj.",
        }},
        nextTip: {
          en: "Nobody owns this sound more than Elmore James — his profile is where it lives.",
          no: "Ingen eier denne lyden mer enn Elmore James — profilen hans er der den bor.",
          sv: "Ingen äger det här ljudet mer än Elmore James — hans profil är där det bor.",
          de: "Niemand besitzt diesen Sound mehr als Elmore James — sein Profil ist sein Zuhause.",
          pl: "Nikt nie jest bardziej właścicielem tego brzmienia niż Elmore James — jego profil to jego dom.",
        },
        artistSlug: "elmore-james",
        illustration: { kind: "none" },
      },
    ],
  },
  {
    id: "harmonica",
    title: { en: "Harmonica", no: "Munnspill", sv: "Munspel", de: "Mundharmonika", pl: "Harmonijka" },
    intro: {
      en: "Five short lessons from first seal to your first bend, all on one C harp.",
      no: "Fem korte leksjoner fra første forsegling til din første bend, alt på ett C-munnspill.",
      sv: "Fem korta lektioner från första försegling till din första bend, allt på ett C-munspel.",
      de: "Fünf kurze Lektionen vom ersten Dichtsitz bis zu deinem ersten Bend, alles auf einer C-Harp.",
      pl: "Pięć krótkich lekcji od pierwszej szczelności ust po pierwszy bend, wszystko na harmonijce C.",
    },
    lessons: [
      EARS_HARMONICA,
      {
        id: "harmonica-1",
        title: { en: "Hold & Seal", no: "Hold og forsegling", sv: "Hållning och försegling", de: "Halten & Dichtsitz", pl: "Trzymanie i szczelność" },
        goal: {
          en: "Hold a C harmonica correctly and get a clean seal with your lips.",
          no: "Holde et C-munnspill riktig og få en ren forsegling med leppene.",
          sv: "Hålla ett C-munspel rätt och få en ren försegling med läpparna.",
          de: "Eine C-Mundharmonika richtig halten und mit den Lippen einen sauberen Dichtsitz bekommen.",
          pl: "Poprawnie trzymać harmonijkę C i uzyskać szczelne przyleganie ust.",
        },
        steps: {
          en: "Cup the harp in one hand, numbers facing up, low notes to your left. Bring the harmonica to your mouth — not your head down to the harp. Rest your lips around it like you're about to say \"ooh\", not a tight pucker. Breathe gently in and out through hole 4; don't blow hard, this isn't a party favor.",
          no: "Legg munnspillet i den ene hånden, tallene opp, lave toner til venstre. Før munnspillet til munnen — ikke hodet ned til spillet. Hvil leppene rundt det som om du skal si «oj», ikke en stram knip. Pust rolig inn og ut gjennom hull 4; ikke blås hardt, dette er ikke en festfløyte.",
          sv: "Lägg munspelet i ena handen, siffrorna uppåt, låga toner till vänster. För munspelet till munnen — inte huvudet ner till spelet. Vila läpparna runt det som om du ska säga \"åh\", inte en spänd puckring. Andas lugnt in och ut genom hål 4; blås inte hårt, det här är ingen festvissla.",
          de: "Nimm die Harp in eine Hand, Zahlen nach oben, tiefe Töne links. Führe die Harmonika zum Mund — nicht den Kopf zur Harp. Leg die Lippen locker darum, als wolltest du „oh“ sagen, kein enger Kussmund. Atme sanft durch Loch 4 ein und aus; nicht fest blasen, das ist kein Partyknaller.",
          pl: "Trzymaj harmonijkę w jednej ręce, cyfry do góry, niskie dźwięki po lewej. Przybliż harmonijkę do ust — nie głowę do harmonijki. Oprzyj usta wokół niej tak, jakbyś miał powiedzieć „oo”, nie ściśnięte dzióbkiem. Oddychaj spokojnie przez otwór 4; nie dmuchaj mocno, to nie dmuchawka na przyjęciu.",
        },
        listen: { type: "comingSoon", caption: {
          en: "A hold/seal demo clip is coming here.",
          no: "Et demoklipp om hold og forsegling kommer her.",
          sv: "Ett demoklipp om hållning och försegling kommer hit.",
          de: "Ein Demo-Clip zu Haltung und Dichtsitz folgt hier.",
          pl: "Klip demonstracyjny o trzymaniu i szczelności pojawi się tutaj.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "Nothing to play yet — get the seal comfortable first.",
          no: "Ingenting å spille ennå — bli komfortabel med forseglingen først.",
          sv: "Inget att spela än — bli bekväm med förseglingen först.",
          de: "Noch nichts zum Spielen — erst den Dichtsitz gewöhnen.",
          pl: "Jeszcze nic do grania — najpierw przyzwyczaj się do szczelności.",
        }},
        nextTip: {
          en: "Little Walter turned this small instrument into a lead voice — his profile is ahead.",
          no: "Little Walter gjorde dette lille instrumentet til en ledestemme — profilen hans venter.",
          sv: "Little Walter gjorde det här lilla instrumentet till en ledröst — hans profil väntar.",
          de: "Little Walter machte aus diesem kleinen Instrument eine Leadstimme — sein Profil wartet.",
          pl: "Little Walter zrobił z tego małego instrumentu głos prowadzący — jego profil czeka.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "harp", highlight: [4] },
      },
      {
        id: "harmonica-2",
        title: { en: "Single Note vs. Chord", no: "Enkelttone vs. akkord", sv: "Entoner vs. ackord", de: "Einzelton vs. Akkord", pl: "Pojedynczy dźwięk vs. akord" },
        goal: {
          en: "Tell a single clean note apart from a full chord, and choose which one you're playing.",
          no: "Kjenne forskjell på én ren tone og en full akkord, og velge hvilken du spiller.",
          sv: "Känna skillnad på en ren ton och ett fullt ackord, och välja vilken du spelar.",
          de: "Einen einzelnen klaren Ton von einem vollen Akkord unterscheiden — und wählen, was du spielst.",
          pl: "Odróżnić pojedynczy czysty dźwięk od pełnego akordu i wybierać, co grasz.",
        },
        steps: {
          en: "Play hole 4 as a wide chord first — breathe normally, you'll hear 3-4 notes at once. Now narrow your lips and aim the air right at hole 4 alone, like whistling through a straw. Go back and forth: chord, single note, chord, single note. That control is most of what separates blues harp from just breathing on the thing.",
          no: "Spill hull 4 som en bred akkord først — pust normalt, du hører 3-4 toner samtidig. Snevre nå leppene og sikt luften rett mot hull 4 alene, som å plystre gjennom et sugerør. Gå frem og tilbake: akkord, enkelttone, akkord, enkelttone. Den kontrollen er det meste av det som skiller blueshemunnspill fra bare å puste på greia.",
          sv: "Spela hål 4 som ett brett ackord först — andas normalt, du hör 3-4 toner samtidigt. Smalna nu läpparna och sikta luften rakt mot hål 4 ensamt, som att vissla genom ett sugrör. Gå fram och tillbaka: ackord, enton, ackord, enton. Den kontrollen är det mesta av vad som skiljer bluesmunspel från att bara andas på grejen.",
          de: "Spiel Loch 4 zuerst als breiten Akkord — atme normal, du hörst 3-4 Töne gleichzeitig. Verenge nun die Lippen und ziel die Luft genau auf Loch 4 allein, wie durch einen Strohhalm pfeifen. Wechsle hin und her: Akkord, Einzelton, Akkord, Einzelton. Diese Kontrolle macht das meiste dessen aus, was Blues-Harp von bloßem Reinatmen unterscheidet.",
          pl: "Zagraj otwór 4 najpierw jako szeroki akord — oddychaj normalnie, usłyszysz 3-4 dźwięki naraz. Teraz zwęź usta i skieruj powietrze dokładnie na sam otwór 4, jakbyś gwizdał przez słomkę. Przełączaj się: akord, pojedynczy dźwięk, akord, pojedynczy dźwięk. Ta kontrola to większość tego, co odróżnia bluesową harmonijkę od zwykłego oddychania w nią.",
        },
        listen: { type: "comingSoon", caption: {
          en: "A single-note-vs-chord demo clip is coming here.",
          no: "Et demoklipp om enkelttone vs. akkord kommer her.",
          sv: "Ett demoklipp om enton vs. ackord kommer hit.",
          de: "Ein Demo-Clip zu Einzelton vs. Akkord folgt hier.",
          pl: "Klip demonstracyjny pojedynczy dźwięk vs. akord pojawi się tutaj.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A slow drone on hole 4 to practice against is coming here.",
          no: "En sakte drone på hull 4 å øve mot kommer her.",
          sv: "En långsam drone på hål 4 att öva mot kommer hit.",
          de: "Ein langsamer Drone auf Loch 4 zum Üben folgt hier.",
          pl: "Wolny dron na otworze 4 do ćwiczeń pojawi się tutaj.",
        }},
        nextTip: {
          en: "This is the control every Big Walter Horton solo is built on.",
          no: "Dette er kontrollen enhver Big Walter Horton-solo er bygget på.",
          sv: "Det här är kontrollen som varje Big Walter Horton-solo är byggd på.",
          de: "Das ist die Kontrolle, auf der jedes Big-Walter-Horton-Solo aufbaut.",
          pl: "To ta kontrola, na której zbudowana jest każda solówka Big Waltera Hortona.",
        },
        artistSlug: "big-walter-horton",
        illustration: { kind: "harp", highlight: [4] },
      },
      {
        id: "harmonica-3",
        title: { en: "Second Position", no: "Andre posisjon", sv: "Andra positionen", de: "Zweite Position", pl: "Druga pozycja" },
        goal: {
          en: "Understand why blues harp players play a C harp in the \"wrong\" key on purpose.",
          no: "Forstå hvorfor bluesmunnspillere spiller et C-munnspill i «feil» toneart med vilje.",
          sv: "Förstå varför bluesmunspelare medvetet spelar ett C-munspel i \"fel\" tonart.",
          de: "Verstehen, warum Blues-Harp-Spieler eine C-Harp absichtlich in der „falschen“ Tonart spielen.",
          pl: "Zrozumieć, dlaczego bluesowi harmonijkarze celowo grają na harmonijce C w „złej” tonacji.",
        },
        steps: {
          en: "This is called cross harp, or 2nd position: a C harmonica actually gives you the blues in G, not C. Home base is holes 1 through 4 on the draw (breathe in), not the blow. Sit there and just breathe in on holes 1-2-3-4 together, slowly, and let that sound sink in — that's the sound you already know from every blues record.",
          no: "Dette kalles cross harp, eller 2. posisjon: et C-munnspill gir deg faktisk bluesen i G, ikke C. Hjemmebasen er hull 1 til 4 på draget (pust inn), ikke blåset. Sitt der og bare pust inn på hull 1-2-3-4 sammen, sakte, og la den lyden synke inn — det er lyden du allerede kjenner fra hver eneste bluesplate.",
          sv: "Det här kallas cross harp, eller 2:a positionen: ett C-munspel ger dig faktiskt bluesen i G, inte C. Hembasen är hål 1 till 4 på draget (andas in), inte blåset. Sitt still och andas bara in på hål 1-2-3-4 tillsammans, långsamt, och låt det ljudet sjunka in — det är ljudet du redan känner från varenda bluesskiva.",
          de: "Das nennt man Cross Harp oder 2. Position: Eine C-Mundharmonika liefert dir eigentlich den Blues in G, nicht in C. Heimatbasis sind die Löcher 1 bis 4 beim Ziehen (Einatmen), nicht beim Blasen. Setz dich hin und atme einfach langsam auf den Löchern 1-2-3-4 zusammen ein — lass diesen Klang wirken, das ist der Sound, den du schon von jeder Bluesplatte kennst.",
          pl: "Nazywa się to cross harp, czyli druga pozycja: harmonijka C daje ci właściwie bluesa w tonacji G, nie C. Bazą domową są otwory od 1 do 4 na wdechu (draw), nie na wydechu. Usiądź i po prostu wdychaj powietrze przez otwory 1-2-3-4 razem, powoli, i pozwól temu brzmieniu wsiąknąć — to dźwięk, który już znasz z każdej płyty bluesowej.",
        },
        listen: { type: "video", videoId: "HxkqDe7DN8g", caption: {
          en: "Little Walter — \"Juke\". Built entirely on this position.",
          no: "Little Walter — «Juke». Bygget helt og holdent på denne posisjonen.",
          sv: "Little Walter — \"Juke\". Byggd helt och hållet på den här positionen.",
          de: "Little Walter — „Juke“. Vollständig auf dieser Position aufgebaut.",
          pl: "Little Walter — „Juke”. Zbudowane w całości na tej pozycji.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A slow 12-bar backing track in G (for your C harp) is coming here.",
          no: "Et sakte 12-takters backing-spor i G (for ditt C-munnspill) kommer her.",
          sv: "Ett långsamt 12-takters backingspår i G (för ditt C-munspel) kommer hit.",
          de: "Ein langsames 12-Takt-Backing-Track in G (für deine C-Harp) folgt hier.",
          pl: "Wolny 12-taktowy podkład w G (dla twojej harmonijki C) pojawi się tutaj.",
        }},
        nextTip: {
          en: "\"Juke\" is the harmonica instrumental — Little Walter's profile has the story.",
          no: "«Juke» er munnspill-instrumentalen — profilen til Little Walter har historien.",
          sv: "\"Juke\" är munspelsinstrumentalen — Little Walters profil har historien.",
          de: "„Juke“ ist das Mundharmonika-Instrumental — Little Walters Profil erzählt die Geschichte.",
          pl: "„Juke” to instrumentalny hit harmonijkowy — profil Little Waltera zawiera tę historię.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "harp", highlight: [1, 2, 3, 4], direction: "draw" },
      },
      {
        id: "harmonica-4",
        title: { en: "One 12-Bar Riff", no: "Én 12-takters riff", sv: "En 12-takters riff", de: "Ein 12-Takt-Riff", pl: "Jeden riff na 12 taktów" },
        goal: {
          en: "Play one small, repeatable riff you can carry across a full 12-bar.",
          no: "Spille én liten, repeterbar riff du kan ta med gjennom en hel 12-takter.",
          sv: "Spela en liten, repeterbar riff du kan ta med genom en hel 12-takt.",
          de: "Ein kleines, wiederholbares Riff spielen, das du durch einen ganzen 12-Takter trägst.",
          pl: "Zagrać jeden mały, powtarzalny riff, który przeniesiesz przez cały 12-takt.",
        },
        steps: {
          en: "Here's a tiny original riff, in draw (in) and blow (out): draw 4, draw 3, blow 2, draw 2. Four notes, about two seconds. Loop it slowly, evenly, until it's boring — boring means it's ready. Once it sits, you already have something to play over the whole 12-bar from the ears lesson.",
          no: "Her er en liten original riff, i drag (inn) og blås (ut): drag 4, drag 3, blås 2, drag 2. Fire toner, rundt to sekunder. Løkk den sakte, jevnt, til den er kjedelig — kjedelig betyr at den er klar. Når den sitter, har du allerede noe å spille over hele 12-takteren fra ørelæksjonen.",
          sv: "Här är en liten originalriff, i drag (in) och blås (ut): drag 4, drag 3, blås 2, drag 2. Fyra toner, ungefär två sekunder. Loopa den långsamt, jämnt, tills den är tråkig — tråkig betyder att den är klar. När den sitter har du redan något att spela över hela 12-takten från örlektionen.",
          de: "Hier ein kleines Original-Riff, in Zieh- (ein) und Blastönen (aus): ziehen 4, ziehen 3, blasen 2, ziehen 2. Vier Töne, etwa zwei Sekunden. Loop es langsam, gleichmäßig, bis es langweilig wird — langweilig heißt bereit. Sitzt es, hast du schon etwas, das du über den ganzen 12-Takter aus der Ohren-Lektion spielen kannst.",
          pl: "Oto mały autorski riff, na wdechu (draw) i wydechu (blow): draw 4, draw 3, blow 2, draw 2. Cztery dźwięki, około dwóch sekund. Powtarzaj go powoli, równo, aż stanie się nudny — nudny znaczy gotowy. Gdy już siądzie, masz już coś do zagrania przez cały 12-takt z lekcji o uszach.",
        },
        listen: { type: "video", videoId: "HxkqDe7DN8g", caption: {
          en: "Little Walter — \"Juke\" again. Listen for how a riff can carry a whole song.",
          no: "Little Walter — «Juke» igjen. Legg merke til hvordan en riff kan bære en hel sang.",
          sv: "Little Walter — \"Juke\" igen. Lyssna på hur en riff kan bära en hel låt.",
          de: "Little Walter — noch einmal „Juke“. Hör, wie ein Riff einen ganzen Song tragen kann.",
          pl: "Little Walter — ponownie „Juke”. Posłuchaj, jak riff może udźwignąć cały utwór.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A slow 12-bar backing track in G is coming here.",
          no: "Et sakte 12-takters backing-spor i G kommer her.",
          sv: "Ett långsamt 12-takters backingspår i G kommer hit.",
          de: "Ein langsames 12-Takt-Backing-Track in G folgt hier.",
          pl: "Wolny 12-taktowy podkład w G pojawi się tutaj.",
        }},
        nextTip: {
          en: "Ready to try your first bend? It's next — no rush if not.",
          no: "Klar for din første bend? Den er neste — ingen hast om ikke.",
          sv: "Redo att prova din första bend? Den är nästa — ingen brådska om inte.",
          de: "Bereit für deinen ersten Bend? Kommt als Nächstes — kein Stress, wenn nicht.",
          pl: "Gotów spróbować pierwszego bendu? To już następny krok — bez pośpiechu, jeśli nie.",
        },
        artistSlug: "little-walter",
        illustration: { kind: "harp", highlight: [2, 3, 4] },
      },
      {
        id: "harmonica-5",
        title: { en: "First Bend", no: "Første bend", sv: "Första bend", de: "Erster Bend", pl: "Pierwszy bend" },
        goal: {
          en: "Get your first draw bend on hole 2 — only once lesson 4 feels solid.",
          no: "Få din første drag-bend på hull 2 — først når leksjon 4 føles solid.",
          sv: "Få din första drag-bend på hål 2 — bara när lektion 4 känns stabil.",
          de: "Deinen ersten Zieh-Bend auf Loch 2 hinbekommen — erst wenn Lektion 4 sich sicher anfühlt.",
          pl: "Zagrać pierwszy bend na wdechu na otworze 2 — dopiero gdy lekcja 4 czuje się pewnie.",
        },
        steps: {
          en: "Bending is shaping the inside of your mouth to bend the pitch down while you draw. Say \"eee\" out loud, then slide toward \"aww\" while drawing on hole 2 — you're aiming your tongue and jaw down and back, not blowing harder. It won't happen on attempt one. If nothing changes after a few honest tries, come back to this after a week of lesson 4 — that's completely normal, not a failure.",
          no: "Bending handler om å forme innsiden av munnen for å bøye tonen ned mens du drar. Si «iii» høyt, gli så mot «åh» mens du drar på hull 2 — du sikter tunge og kjeve nedover og bakover, ikke blåser hardere. Det skjer ikke på første forsøk. Skjer ingenting etter noen ærlige forsøk, kom tilbake hit etter en ukes øving på leksjon 4 — det er helt normalt, ikke en fiasko.",
          sv: "Bending handlar om att forma insidan av munnen för att böja tonen nedåt medan du drar. Säg \"iii\" högt, glid sedan mot \"åh\" medan du drar på hål 2 — du siktar tunga och käke nedåt och bakåt, inte blåser hårdare. Det händer inte på första försöket. Händer inget efter några ärliga försök, kom tillbaka hit efter en veckas övning på lektion 4 — det är helt normalt, inget misslyckande.",
          de: "Beim Bend formst du das Innere deines Mundes, um die Tonhöhe beim Ziehen abzusenken. Sag laut „iii“, gleite dann zu „aah“, während du Loch 2 ziehst — du zielst Zunge und Kiefer nach unten und hinten, nicht fester blasen. Beim ersten Versuch klappt es nicht. Ändert sich nach ein paar ehrlichen Versuchen nichts, komm nach einer Woche Übung mit Lektion 4 hierher zurück — völlig normal, kein Scheitern.",
          pl: "Bend polega na kształtowaniu wnętrza ust, by obniżyć wysokość dźwięku podczas wdechu. Powiedz głośno „iii”, a potem przejdź w stronę „aaa”, wciągając powietrze przez otwór 2 — kierujesz język i żuchwę w dół i do tyłu, nie dmuchasz mocniej. Za pierwszym razem się nie uda. Jeśli po kilku szczerych próbach nic się nie zmienia, wróć tu po tygodniu ćwiczenia lekcji 4 — to zupełnie normalne, nie porażka.",
        },
        listen: { type: "video", videoId: "a2vlNCK18L8", caption: {
          en: "Big Walter Horton — \"Walking By Myself\". One of the greatest bent solos ever recorded.",
          no: "Big Walter Horton — «Walking By Myself». Én av de beste bend-soloene som er spilt inn.",
          sv: "Big Walter Horton — \"Walking By Myself\". Ett av de bästa bend-solon som spelats in.",
          de: "Big Walter Horton — „Walking By Myself“. Eines der besten je aufgenommenen Bend-Solos.",
          pl: "Big Walter Horton — „Walking By Myself”. Jedna z najlepszych solówek z bendami, jakie nagrano.",
        }},
        backing: { type: "comingSoon", caption: {
          en: "A slow drone on hole 2 to bend against is coming here.",
          no: "En sakte drone på hull 2 å bende mot kommer her.",
          sv: "En långsam drone på hål 2 att böja mot kommer hit.",
          de: "Ein langsamer Drone auf Loch 2 zum Bend-Üben folgt hier.",
          pl: "Wolny dron na otworze 2 do ćwiczenia bendu pojawi się tutaj.",
        }},
        nextTip: {
          en: "Big Walter Horton's own profile has the full story behind that solo.",
          no: "Profilen til Big Walter Horton har hele historien bak den soloen.",
          sv: "Big Walter Hortons egen profil har hela historien bakom det solot.",
          de: "Big Walter Hortons Profil erzählt die ganze Geschichte hinter diesem Solo.",
          pl: "Profil Big Waltera Hortona zawiera całą historię tej solówki.",
        },
        artistSlug: "big-walter-horton",
        illustration: { kind: "harp", highlight: [2], direction: "draw" },
      },
    ],
  },
];

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}
