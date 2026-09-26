import { ExternalLink, Globe2 } from "lucide-react";
import { useI18n, type Lang } from "@/i18n";

const NEW_URL = "https://www.slow-blues.com";

// Inline version of the former full-screen "A New Chapter" modal. Rendered
// only on /about -- never as an overlay, never on artist/history/review pages.
type Copy = {
  title: string;
  greeting: string;
  intro: string;
  reason: string;
  newChapter: string;
  bookmarkAsk: string;
  shareAsk: string;
  thanks: string;
  signature: string;
  polishBadge: string;
  polishNote: string;
  visit: string;
  personalNote: string;
};

const COPY: Record<Lang, Copy> = {
  en: {
    title: "A New Chapter for Slow-Blues",
    greeting: "Hello friends,",
    intro: "I want to personally let you know that SlowBlues.no has now officially moved to our new international home: Slow-Blues.com.",
    reason: "The reason is simple: I am moving from Norway to Warsaw, Poland, and because of this I can no longer continue using the Norwegian .no domain.",
    newChapter: "At the same time, this opens a new and exciting chapter for Slow-Blues as a more international blues platform.",
    bookmarkAsk: "If you have bookmarked the old website on your phone, tablet or computer, I kindly ask you to update your bookmark to the new address.",
    shareAsk: "And if you know other blues lovers who still use the old domain, I would truly appreciate if you shared the news with them as well.",
    thanks: "Thank you so much for being part of this journey.",
    signature: "— Kjell Mersland",
    polishBadge: "Now available in Polish",
    polishNote: "I have now also added Polish language support to the website as part of the move to Warsaw, Poland.",
    visit: "Visit Slow-Blues.com",
    personalNote: "A personal note",
  },
  no: {
    title: "Et nytt kapittel for Slow-Blues",
    greeting: "Hei venner,",
    intro: "Jeg vil personlig fortelle dere at SlowBlues.no nå offisielt har flyttet til vårt nye internasjonale hjem: Slow-Blues.com.",
    reason: "Grunnen er enkel: Jeg flytter fra Norge til Warszawa i Polen, og kan derfor ikke lenger bruke det norske .no-domenet.",
    newChapter: "Samtidig åpner dette et nytt og spennende kapittel for Slow-Blues som en mer internasjonal blues-plattform.",
    bookmarkAsk: "Hvis du har bokmerket den gamle nettsiden på telefon, nettbrett eller PC, ber jeg deg vennligst oppdatere bokmerket til den nye adressen.",
    shareAsk: "Og hvis du kjenner andre blueselskere som fortsatt bruker det gamle domenet, hadde jeg satt enormt pris på om du delte nyheten med dem også.",
    thanks: "Tusen takk for at du er en del av denne reisen.",
    signature: "— Kjell Mersland",
    polishBadge: "Nå tilgjengelig på polsk",
    polishNote: "Jeg har nå også lagt til polsk språkstøtte på nettsiden, som en del av flyttingen til Warszawa i Polen.",
    visit: "Besøk Slow-Blues.com",
    personalNote: "En personlig hilsen",
  },
  sv: {
    title: "Ett nytt kapitel för Slow-Blues",
    greeting: "Hej vänner,",
    intro: "Jag vill personligen berätta att SlowBlues.no nu officiellt har flyttat till vårt nya internationella hem: Slow-Blues.com.",
    reason: "Anledningen är enkel: Jag flyttar från Norge till Warszawa i Polen, och kan därför inte längre använda det norska .no-domänet.",
    newChapter: "Samtidigt öppnar detta ett nytt och spännande kapitel för Slow-Blues som en mer internationell bluesplattform.",
    bookmarkAsk: "Om du har bokmärkt den gamla webbplatsen på telefon, surfplatta eller dator ber jag dig vänligen uppdatera ditt bokmärke till den nya adressen.",
    shareAsk: "Och om du känner andra blueselskare som fortfarande använder den gamla domänen skulle jag verkligen uppskatta om du delade nyheten med dem också.",
    thanks: "Tack så mycket för att du är en del av denna resa.",
    signature: "— Kjell Mersland",
    polishBadge: "Nu tillgängligt på polska",
    polishNote: "Jag har nu också lagt till polskt språkstöd på webbplatsen, som en del av flytten till Warszawa i Polen.",
    visit: "Besök Slow-Blues.com",
    personalNote: "En personlig hälsning",
  },
  de: {
    title: "Ein neues Kapitel für Slow-Blues",
    greeting: "Hallo Freunde,",
    intro: "Ich möchte euch persönlich mitteilen, dass SlowBlues.no nun offiziell in unser neues internationales Zuhause umgezogen ist: Slow-Blues.com.",
    reason: "Der Grund ist einfach: Ich ziehe von Norwegen nach Warschau in Polen und kann daher die norwegische .no-Domain nicht länger nutzen.",
    newChapter: "Gleichzeitig eröffnet dies ein neues und spannendes Kapitel für Slow-Blues als internationalere Blues-Plattform.",
    bookmarkAsk: "Wenn ihr die alte Website auf eurem Telefon, Tablet oder Computer als Lesezeichen gespeichert habt, bitte ich euch, das Lesezeichen auf die neue Adresse zu aktualisieren.",
    shareAsk: "Und wenn ihr andere Blues-Liebhaber kennt, die noch die alte Domain nutzen, würde ich es wirklich schätzen, wenn ihr die Nachricht auch mit ihnen teilen würdet.",
    thanks: "Vielen Dank, dass ihr Teil dieser Reise seid.",
    signature: "— Kjell Mersland",
    polishBadge: "Jetzt auf Polnisch verfügbar",
    polishNote: "Ich habe nun als Teil des Umzugs nach Warschau auch polnische Sprachunterstützung hinzugefügt.",
    visit: "Slow-Blues.com besuchen",
    personalNote: "Eine persönliche Nachricht",
  },
  pl: {
    title: "Nowy rozdział Slow-Blues",
    greeting: "Witajcie przyjaciele,",
    intro: "Chcę osobiście poinformować, że SlowBlues.no oficjalnie przeniosło się do swojego nowego, międzynarodowego domu: Slow-Blues.com.",
    reason: "Powód jest prosty: przeprowadzam się z Norwegii do Warszawy w Polsce i z tego powodu nie mogę dłużej korzystać z norweskiej domeny .no.",
    newChapter: "Jednocześnie otwiera to nowy i ekscytujący rozdział dla Slow-Blues jako bardziej międzynarodowej platformy bluesowej.",
    bookmarkAsk: "Jeśli masz starą stronę w zakładkach na telefonie, tablecie lub komputerze, proszę o zaktualizowanie zakładki na nowy adres.",
    shareAsk: "A jeśli znasz innych miłośników bluesa, którzy nadal używają starej domeny, byłbym bardzo wdzięczny, gdybyś podzielił się z nimi tą wiadomością.",
    thanks: "Bardzo dziękuję, że jesteście częścią tej podróży.",
    signature: "— Kjell Mersland",
    polishBadge: "Teraz dostępne po polsku",
    polishNote: "W ramach przeprowadzki do Warszawy dodałem teraz również wsparcie języka polskiego na stronie.",
    visit: "Odwiedź Slow-Blues.com",
    personalNote: "Osobista wiadomość",
  },
};


export function MigrationNotice() {
  const { lang } = useI18n();
  const t = COPY[lang] ?? COPY.en;
  return (
    <section
      id="moved"
      className="rounded-2xl border border-gold/30 p-6 sm:p-8"
      style={{ background: "radial-gradient(120% 80% at 50% 0%, rgba(60,30,30,0.35) 0%, rgba(12,16,32,0.9) 60%)" }}
      aria-labelledby="moved-title"
    >
      <div className="text-[10px] tracking-[0.32em] uppercase text-gold/90 mb-2">{t.personalNote}</div>
      <h2 id="moved-title" className="font-display text-2xl text-gold mb-4">{t.title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90">
        <p className="text-gold/90 font-medium">{t.greeting}</p>
        <p>{t.intro}</p>
        <p>{t.reason}</p>
        <p>{t.newChapter}</p>
        <p>{t.bookmarkAsk}</p>
        <p>{t.shareAsk}</p>
        <p>{t.thanks}</p>
        <p className="font-display text-lg text-gold">{t.signature}</p>
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/25 p-4 bg-gold/5">
        <Globe2 className="size-4 text-gold mt-1 shrink-0" aria-hidden="true" />
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-gold mb-1">{t.polishBadge}</div>
          <p className="text-sm text-foreground/85 italic">"{t.polishNote}"</p>
        </div>
      </div>
      <a
        href={NEW_URL}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90"
      >
        <ExternalLink className="size-4" aria-hidden="true" /> {t.visit}
      </a>
    </section>
  );
}
