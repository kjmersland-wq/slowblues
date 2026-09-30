import { createFileRoute, Link } from "@tanstack/react-router";
import { Guitar, Wind } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useI18n, tr } from "@/i18n";

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
      </section>
    </PageShell>
  );
}
