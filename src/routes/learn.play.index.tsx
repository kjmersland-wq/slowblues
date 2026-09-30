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
      { title: "Learn to Play Blues — Guitar & Harmonica for Beginners | SlowBlues" },
      { name: "description", content: "A small, honest beginner course: five short lessons on guitar, five on harmonica. No theory overload — just enough to say \"that went\"." },
      { property: "og:title", content: "Learn to Play Blues | SlowBlues" },
      { property: "og:description", content: "Guitar or harmonica — five short lessons each, from zero." },
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
          en: "Two small courses, five short lessons each. No music-school jargon, no promise you'll master anything by tonight — just enough real technique that you can sit down and say \"that went.\"",
          no: "To små kurs, fem korte leksjoner hver. Ingen musikkskole-sjargong, ingen løfte om at du mestrer noe i kveld — bare nok ekte teknikk til at du kan sette deg ned og si «det gikk an».",
          sv: "Två små kurser, fem korta lektioner var. Ingen musikskolejargong, inget löfte om att du bemästrar något i kväll — bara tillräckligt med äkta teknik för att du ska kunna sätta dig ner och säga \"det gick\".",
          de: "Zwei kleine Kurse, je fünf kurze Lektionen. Kein Musikschul-Fachjargon, kein Versprechen, dass du heute Abend etwas meisterst — nur genug echte Technik, damit du dich hinsetzen und sagen kannst: „das ging.“",
          pl: "Dwa małe kursy, po pięć krótkich lekcji każdy. Bez szkolnego żargonu, bez obietnicy, że dziś wieczorem opanujesz cokolwiek — po prostu tyle prawdziwej techniki, żebyś mógł usiąść i powiedzieć: „udało się”.",
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
                en: "Two chords, a slow 12-bar, a shuffle, one taste of slide.",
                no: "To akkorder, en sakte 12-takter, en shuffle, én smak av slide.",
                sv: "Två ackord, en långsam 12-takt, en shuffle, en smak av slide.",
                de: "Zwei Akkorde, ein langsamer 12-Takter, ein Shuffle, ein Geschmack Slide.",
                pl: "Dwa akordy, wolny 12-takt, shuffle, jeden smak slide'a.",
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
                en: "Hold, seal, cross harp, one riff, one first bend.",
                no: "Hold, forsegling, cross harp, én riff, én første bend.",
                sv: "Hållning, försegling, cross harp, en riff, en första bend.",
                de: "Halten, Dichtsitz, Cross Harp, ein Riff, ein erster Bend.",
                pl: "Trzymanie, szczelność, cross harp, jeden riff, pierwszy bend.",
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
