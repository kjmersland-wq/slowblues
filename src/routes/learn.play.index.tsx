import { createFileRoute, Link } from "@tanstack/react-router";
import { Guitar, Wind } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr, type Lang } from "@/i18n";
import { artistDetailPath } from "@/lib/locale";
import { CourseFeedbackWidget } from "@/components/learn/CourseFeedbackWidget";

// Two real, sourced quotes — a third (harmonica-as-voice, from Little
// Walter or Big Walter Horton) was researched and dropped: no verified
// first-person quote on that theme turned up for either, and Charlie
// Musselwhite's well-documented one ("The harmonica is the most
// voice-like instrument... it's like singing the blues without words")
// has no SlowBlues profile to link to. Better two real ones than three
// with a guess in the mix.
const IGNITION_QUOTES: { quote: string; artistSlug: string; attribution: string; gloss: Record<Lang, string> }[] = [
  {
    quote: "Playing guitar is like telling the truth.",
    artistSlug: "bb-king",
    attribution: "B.B. King",
    gloss: {
      en: "Play what you feel, not what you think you're supposed to.",
      no: "Spill det du føler, ikke det du tror du skal.",
      sv: "Spela det du känner, inte det du tror att du ska.",
      de: "Spiel, was du fühlst, nicht das, was du meinst spielen zu müssen.",
      pl: "Graj to, co czujesz, nie to, co myślisz, że powinieneś.",
    },
  },
  {
    quote: "My blues look so simple, so easy to do, but it's not.",
    artistSlug: "muddy-waters",
    attribution: "Muddy Waters",
    gloss: {
      en: "Simple isn't the same as easy. Start there anyway.",
      no: "Enkelt er ikke det samme som lett. Start der likevel.",
      sv: "Enkelt är inte samma sak som lätt. Börja där ändå.",
      de: "Einfach ist nicht dasselbe wie leicht. Fang trotzdem dort an.",
      pl: "Proste to nie to samo co łatwe. Zacznij mimo to właśnie tam.",
    },
  },
];

const HOUSE_TIPS: Record<Lang, string>[] = [
  {
    en: "Count 12 bars before you chase chord shapes.",
    no: "Tell 12 takter før du jager grep.",
    sv: "Räkna 12 takter innan du jagar ackordgrepp.",
    de: "Zähl 12 Takte, bevor du Akkordgriffen hinterherjagst.",
    pl: "Policz 12 taktów, zanim zaczniesz gonić za chwytami.",
  },
  {
    en: "You don't need to wait for \"the right mood.\" Just sit down.",
    no: "Du trenger ikke vente på «riktig stemning». Sett deg ned.",
    sv: "Du behöver inte vänta på \"rätt stämning\". Sätt dig ner.",
    de: "Du musst nicht auf die „richtige Stimmung“ warten. Setz dich einfach hin.",
    pl: "Nie musisz czekać na „odpowiedni nastrój”. Po prostu usiądź.",
  },
  {
    en: "Let the last note ring. That's where the blues lives.",
    no: "La siste tonen stå. Det er der bluesen sitter.",
    sv: "Låt sista tonen klinga. Det är där bluesen bor.",
    de: "Lass den letzten Ton stehen. Da wohnt der Blues.",
    pl: "Pozwól ostatniej nucie wybrzmieć. Tam właśnie mieszka blues.",
  },
];

export const Route = createFileRoute("/learn/play/")({
  component: LearnPlayIndex,
  head: () => ({
    meta: [
      { title: "Learn to Play Blues Guitar & Harmonica — Beginner Lessons | SlowBlues" },
      { name: "description", content: "An honest beginner-to-blues-player course: short, practical lessons on guitar and harmonica, from your first sound to bends, shuffle feel and your own blues phrase. No theory overload." },
      { property: "og:title", content: "Learn to Play Blues | SlowBlues" },
      { property: "og:description", content: "Guitar or harmonica — from zero to your first real blues phrase, one short lesson at a time." },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/learn/play" }],
  }),
});

function LearnPlayIndex() {
  const { lang } = useI18n();
  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { en: "Play Blues", no: "Spill blues", sv: "Spela blues", de: "Blues spielen", pl: "Graj bluesa" })}
        title={tr(lang, {
          en: "Pick up an instrument",
          no: "Ta opp et instrument",
          sv: "Ta upp ett instrument",
          de: "Nimm ein Instrument in die Hand",
          pl: "Weź do ręki instrument",
        })}
        lead={tr(lang, {
          en: "Two courses, guitar and harmonica, built the same way: short lessons that take you from holding the instrument for the first time to bending a note, finding the shuffle, and playing a small blues phrase that's genuinely yours. No music-school jargon, no promise you'll master anything by tonight.",
          no: "To kurs, gitar og munnspill, bygget på samme måte: korte leksjoner som tar deg fra å holde instrumentet for første gang til å bende en tone, finne shufflen, og spille en liten bluesfrase som virkelig er din. Ingen musikkskole-sjargong, ingen løfte om at du mestrer noe i kveld.",
          sv: "Två kurser, gitarr och munspel, byggda på samma sätt: korta lektioner som tar dig från att hålla instrumentet för första gången till att benda en ton, hitta shufflen, och spela en liten bluesfras som verkligen är din. Ingen musikskolejargong, inget löfte om att du bemästrar något i kväll.",
          de: "Zwei Kurse, Gitarre und Mundharmonika, auf dieselbe Art aufgebaut: kurze Lektionen, die dich vom ersten Halten des Instruments bis zum Bend einer Note, dem Shuffle-Gefühl und einer kleinen, wirklich eigenen Blues-Phrase führen. Kein Musikschul-Fachjargon, kein Versprechen, dass du heute Abend etwas meisterst.",
          pl: "Dwa kursy, gitara i harmonijka, zbudowane w ten sam sposób: krótkie lekcje, które prowadzą cię od pierwszego trzymania instrumentu, przez wygięcie dźwięku i odnalezienie shuffle'a, aż po zagranie małej bluesowej frazy, która naprawdę jest twoja. Bez szkolnego żargonu, bez obietnicy, że dziś wieczorem cokolwiek opanujesz.",
        })}
      />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          {tr(lang, {
            en: "Not sure which one? Guitar if you want chords and a shuffle under your hands. Harmonica if you'd rather carry your whole instrument in a pocket. Either way, we start with one shared lesson on what actually makes a blues a blues.",
            no: "Usikker på hvilken? Gitar hvis du vil ha akkorder og en shuffle under hendene. Munnspill hvis du heller vil ha hele instrumentet i en lomme. Uansett starter vi med én felles leksjon om hva som faktisk gjør en blues til en blues.",
            sv: "Osäker på vilken? Gitarr om du vill ha ackord och en shuffle under händerna. Munspel om du hellre bär hela instrumentet i en ficka. Oavsett börjar vi med en gemensam lektion om vad som faktiskt gör en blues till en blues.",
            de: "Unsicher, welches? Gitarre, wenn du Akkorde und einen Shuffle unter den Händen willst. Mundharmonika, wenn du dein ganzes Instrument lieber in der Tasche trägst. So oder so starten wir mit einer gemeinsamen Lektion darüber, was einen Blues eigentlich zum Blues macht.",
            pl: "Nie wiesz, którą wybrać? Gitara, jeśli chcesz akordów i shuffle'a pod palcami. Harmonijka, jeśli wolisz nosić cały instrument w kieszeni. Tak czy inaczej, zaczynamy od jednej wspólnej lekcji o tym, co naprawdę czyni bluesa bluesem.",
          })}
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Link to="/learn/play/guitar" className="group bg-card/60 border border-border rounded-xl p-8 text-center hover:border-gold/60 transition">
            <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition">
              <Guitar className="size-6 text-gold" />
            </div>
            <h2 className="font-display text-2xl mb-2">{tr(lang, { en: "Guitar", no: "Gitar", sv: "Gitarr", de: "Gitarre", pl: "Gitara" })}</h2>
            <p className="text-sm text-muted-foreground">
              {tr(lang, {
                en: "Chords, the 12-bar, shuffle, slide, bending — up to your first blues phrase.",
                no: "Akkorder, 12-takteren, shuffle, slide, bending — helt frem til din første bluesfrase.",
                sv: "Ackord, 12-takten, shuffle, slide, bending — hela vägen till din första bluesfras.",
                de: "Akkorde, der 12-Takter, Shuffle, Slide, Bending — bis hin zu deiner ersten Blues-Phrase.",
                pl: "Akordy, 12-takt, shuffle, slide, bending — aż do twojej pierwszej bluesowej frazy.",
              })}
            </p>
          </Link>
          <Link to="/learn/play/harmonica" className="group bg-card/60 border border-border rounded-xl p-8 text-center hover:border-gold/60 transition">
            <div className="mx-auto size-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition">
              <Wind className="size-6 text-gold" />
            </div>
            <h2 className="font-display text-2xl mb-2">{tr(lang, { en: "Harmonica", no: "Munnspill", sv: "Munspel", de: "Mundharmonika", pl: "Harmonijka" })}</h2>
            <p className="text-sm text-muted-foreground">
              {tr(lang, {
                en: "Hold, single notes, cross harp, bending, tone — up to your first blues phrase.",
                no: "Hold, enkelttoner, cross harp, bending, klang — helt frem til din første bluesfrase.",
                sv: "Hållning, entoner, cross harp, bending, klang — hela vägen till din första bluesfras.",
                de: "Halten, Einzeltöne, Cross Harp, Bending, Klang — bis hin zu deiner ersten Blues-Phrase.",
                pl: "Trzymanie, pojedyncze dźwięki, cross harp, bending, barwa — aż do twojej pierwszej bluesowej frazy.",
              })}
            </p>
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {IGNITION_QUOTES.map((q) => (
              <Link
                key={q.artistSlug}
                to={artistDetailPath(lang, q.artistSlug) as any}
                className="block bg-card/40 border border-border rounded-lg p-5 hover:border-gold/50 transition"
              >
                <p className="text-foreground/90 leading-relaxed">{q.quote}</p>
                <p className="mt-2 text-[11px] uppercase tracking-widest text-gold">{q.attribution}</p>
                <p className="mt-2 text-sm text-muted-foreground">{q.gloss[lang] ?? q.gloss.en}</p>
              </Link>
            ))}
          </div>

          <ul className="space-y-2.5 max-w-xl mx-auto text-center">
            {HOUSE_TIPS.map((tip, i) => (
              <li key={i} className="text-muted-foreground">
                {tip[lang] ?? tip.en}
              </li>
            ))}
          </ul>
        </div>

        <CourseFeedbackWidget instrument="shared" lessonId={null} />
      </section>
    </PageShell>
  );
}
