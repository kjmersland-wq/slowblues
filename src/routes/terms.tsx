import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [
    { title: "Terms of Service — SlowBlues" },
    { name: "description", content: "Brukervilkår for slow-blues.com — bruk av innhold, ansvar, immaterielle rettigheter og lovvalg." },
    { property: "og:title", content: "Terms of Service — SlowBlues" },
    { property: "og:description", content: "Brukervilkår for Slow-Blues.com." },
  ]}),
});

function TermsPage() {
  const { lang } = useI18n();
  return (
    <LegalPage
      eyebrow={tr(lang, { no: "Brukervilkår", en: "Terms of Service", sv: "Användarvillkor", de: "Nutzungsbedingungen", pl: "Warunki korzystania" })}
      title="Terms of Service"
      lead={tr(lang, {
        no: "Vilkår som regulerer din bruk av slow-blues.com, levert av KM TECH LABS.",
        en: "Terms governing your use of slow-blues.com, provided by KM TECH LABS.",
        sv: "Villkor som reglerar din användning av slow-blues.com, tillhandahållet av KM TECH LABS.",
        de: "Bedingungen für Ihre Nutzung von slow-blues.com, bereitgestellt von KM TECH LABS.",
        pl: "Warunki regulujące korzystanie z slow-blues.com, dostarczane przez KM TECH LABS.",
      })}
      updated={tr(lang, { no: "Mai 2026", en: "May 2026", sv: "Maj 2026", de: "Mai 2026", pl: "Maj 2026" })}
    >
      <Section heading={tr(lang, { no: "1. Aksept av vilkår", en: "1. Acceptance of terms", sv: "1. Godkännande av villkor", de: "1. Annahme der Bedingungen", pl: "1. Akceptacja warunków" })}>
        <p>
          {tr(lang, {
            no: "Ved å bruke slow-blues.com aksepterer du disse vilkårene. Hvis du ikke aksepterer dem, ber vi deg om å avstå fra bruk av tjenesten.",
            en: "By using slow-blues.com you accept these terms. If you don't accept them, we ask that you refrain from using the service.",
            sv: "Genom att använda slow-blues.com godkänner du dessa villkor. Om du inte godkänner dem ber vi dig avstå från att använda tjänsten.",
            de: "Durch die Nutzung von slow-blues.com akzeptieren Sie diese Bedingungen. Wenn Sie diese nicht akzeptieren, bitten wir Sie, den Dienst nicht zu nutzen.",
            pl: "Korzystając z slow-blues.com, akceptujesz niniejsze warunki. Jeśli ich nie akceptujesz, prosimy o powstrzymanie się od korzystania z serwisu.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "2. Tjenesten", en: "2. The service", sv: "2. Tjänsten", de: "2. Der Dienst", pl: "2. Serwis" })}>
        <p>
          {tr(lang, {
            no: "Slow-Blues.com er et redaksjonelt nettarkiv om blues-musikk, drevet av KM TECH LABS — Kjell Mersland, org.nr. 934 044 029. Tjenesten leveres «som den er», uten garanti for kontinuerlig tilgjengelighet.",
            en: "SlowBlues.com is an editorial web archive about blues music, run by KM TECH LABS — Kjell Mersland, reg. no. 934 044 029. The service is provided \"as is,\" with no guarantee of continuous availability.",
            sv: "SlowBlues.com är ett redaktionellt webbarkiv om bluesmusik, drivet av KM TECH LABS — Kjell Mersland, org.nr. 934 044 029. Tjänsten tillhandahålls \"i befintligt skick\", utan garanti för kontinuerlig tillgänglighet.",
            de: "SlowBlues.com ist ein redaktionelles Webarchiv über Bluesmusik, betrieben von KM TECH LABS — Kjell Mersland, Handelsreg.-Nr. 934 044 029. Der Dienst wird \"wie besehen\" bereitgestellt, ohne Garantie für durchgehende Verfügbarkeit.",
            pl: "SlowBlues.com to redakcyjne archiwum internetowe poświęcone muzyce bluesowej, prowadzone przez KM TECH LABS — Kjell Mersland, nr rej. 934 044 029. Usługa jest świadczona \"tak jak jest\", bez gwarancji ciągłej dostępności.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "3. Brukers ansvar", en: "3. User responsibility", sv: "3. Användarens ansvar", de: "3. Verantwortung des Nutzers", pl: "3. Odpowiedzialność użytkownika" })}>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{tr(lang, {
            no: "Du forplikter deg til å ikke poste ulovlig, ærekrenkende eller hatefullt innhold i gjestebok eller kontaktskjema.",
            en: "You agree not to post illegal, defamatory or hateful content in the guestbook or contact form.",
            sv: "Du förbinder dig att inte publicera olagligt, ärekränkande eller hatiskt innehåll i gästboken eller kontaktformuläret.",
            de: "Sie verpflichten sich, keine rechtswidrigen, verleumderischen oder hasserfüllten Inhalte im Gästebuch oder Kontaktformular zu veröffentlichen.",
            pl: "Zobowiązujesz się nie publikować nielegalnych, zniesławiających ani nienawistnych treści w księdze gości ani formularzu kontaktowym.",
          })}</li>
          <li>{tr(lang, {
            no: "Du skal ikke forsøke å omgå sikkerhetsmekanismer, scrape store mengder innhold eller belaste tjenesten unødig.",
            en: "You must not attempt to circumvent security mechanisms, scrape large amounts of content or place undue load on the service.",
            sv: "Du får inte försöka kringgå säkerhetsmekanismer, skrapa stora mängder innehåll eller belasta tjänsten i onödan.",
            de: "Sie dürfen nicht versuchen, Sicherheitsmechanismen zu umgehen, große Mengen an Inhalten zu scrapen oder den Dienst unnötig zu belasten.",
            pl: "Nie wolno Ci obchodzić mechanizmów bezpieczeństwa, pobierać dużych ilości treści (scraping) ani niepotrzebnie obciążać serwisu.",
          })}</li>
          <li>{tr(lang, {
            no: "Du står selv ansvarlig for innholdet i meldinger og innlegg du sender inn.",
            en: "You are solely responsible for the content of messages and posts you submit.",
            sv: "Du ansvarar själv för innehållet i meddelanden och inlägg du skickar in.",
            de: "Sie sind allein verantwortlich für den Inhalt der von Ihnen eingereichten Nachrichten und Beiträge.",
            pl: "Ponosisz wyłączną odpowiedzialność za treść przesyłanych przez siebie wiadomości i wpisów.",
          })}</li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "4. Immaterielle rettigheter", en: "4. Intellectual property", sv: "4. Immateriella rättigheter", de: "4. Geistiges Eigentum", pl: "4. Własność intelektualna" })}>
        <p>
          {tr(lang, {
            no: "Redaksjonelt innhold (tekst, layout, kode, valgte bilder) på slow-blues.com tilhører KM TECH LABS eller bidragsytere, og er beskyttet av åndsverkloven. Sitater er tillatt i tråd med god skikk og med tydelig kildehenvisning. Se også",
            en: "Editorial content (text, layout, code, selected images) on slow-blues.com belongs to KM TECH LABS or contributors, and is protected by copyright law. Quotations are permitted in line with fair practice and with a clear source reference. See also",
            sv: "Redaktionellt innehåll (text, layout, kod, utvalda bilder) på slow-blues.com tillhör KM TECH LABS eller medverkande, och skyddas av upphovsrättslagen. Citat är tillåtna i enlighet med god sed och med tydlig källhänvisning. Se även",
            de: "Redaktionelle Inhalte (Text, Layout, Code, ausgewählte Bilder) auf slow-blues.com gehören KM TECH LABS oder Mitwirkenden und sind urheberrechtlich geschützt. Zitate sind im Rahmen guter Praxis und mit klarer Quellenangabe zulässig. Siehe auch",
            pl: "Treści redakcyjne (tekst, układ, kod, wybrane obrazy) na slow-blues.com należą do KM TECH LABS lub współtwórców i są chronione prawem autorskim. Cytaty są dozwolone zgodnie z dobrą praktyką i przy wyraźnym podaniu źródła. Zobacz także",
          })}{" "}
          <a href="/copyright" className="text-gold hover:underline">Copyright Notice</a>.
        </p>
      </Section>

      <Section heading={tr(lang, { no: "5. Brukergenerert innhold", en: "5. User-generated content", sv: "5. Användargenererat innehåll", de: "5. Nutzergenerierte Inhalte", pl: "5. Treści generowane przez użytkowników" })}>
        <p>
          {tr(lang, {
            no: "Når du publiserer i gjesteboken eller sender inn tips, gir du oss en ikke-eksklusiv, vederlagsfri rett til å vise innholdet på tjenesten. Du beholder selv opphavsretten. Vi forbeholder oss retten til å fjerne innhold som bryter vilkårene.",
            en: "When you post in the guestbook or submit a tip, you grant us a non-exclusive, royalty-free right to display the content on the service. You retain your own copyright. We reserve the right to remove content that violates these terms.",
            sv: "När du publicerar i gästboken eller skickar in ett tips ger du oss en icke-exklusiv, royaltyfri rätt att visa innehållet på tjänsten. Du behåller din egen upphovsrätt. Vi förbehåller oss rätten att ta bort innehåll som bryter mot villkoren.",
            de: "Wenn Sie im Gästebuch posten oder einen Hinweis einreichen, räumen Sie uns ein nicht-exklusives, unentgeltliches Recht ein, den Inhalt auf dem Dienst anzuzeigen. Sie behalten Ihr eigenes Urheberrecht. Wir behalten uns das Recht vor, Inhalte zu entfernen, die gegen diese Bedingungen verstoßen.",
            pl: "Publikując wpis w księdze gości lub przesyłając wskazówkę, udzielasz nam niewyłącznego, nieodpłatnego prawa do wyświetlania tej treści w serwisie. Zachowujesz własne prawa autorskie. Zastrzegamy sobie prawo do usunięcia treści naruszających niniejsze warunki.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "6. Ansvarsbegrensning", en: "6. Limitation of liability", sv: "6. Ansvarsbegränsning", de: "6. Haftungsbeschränkung", pl: "6. Ograniczenie odpowiedzialności" })}>
        <p>
          {tr(lang, {
            no: "KM TECH LABS er ikke ansvarlig for indirekte tap eller følgeskader som måtte oppstå ved bruk av slow-blues.com. Se også",
            en: "KM TECH LABS is not liable for indirect losses or consequential damages that may arise from using slow-blues.com. See also",
            sv: "KM TECH LABS ansvarar inte för indirekta förluster eller följdskador som kan uppstå vid användning av slow-blues.com. Se även",
            de: "KM TECH LABS haftet nicht für indirekte Verluste oder Folgeschäden, die durch die Nutzung von slow-blues.com entstehen können. Siehe auch",
            pl: "KM TECH LABS nie ponosi odpowiedzialności za straty pośrednie ani szkody następcze wynikające z korzystania z slow-blues.com. Zobacz także",
          })}{" "}
          <a href="/disclaimer" className="text-gold hover:underline">Disclaimer</a>.
        </p>
      </Section>

      <Section heading={tr(lang, { no: "7. Endringer", en: "7. Changes", sv: "7. Ändringar", de: "7. Änderungen", pl: "7. Zmiany" })}>
        <p>
          {tr(lang, {
            no: "Vi kan endre vilkårene. Vesentlige endringer varsles på forsiden eller i nyhetsbrevet senest 14 dager før de trer i kraft.",
            en: "We may change these terms. Material changes will be announced on the homepage or in the newsletter no later than 14 days before they take effect.",
            sv: "Vi kan ändra villkoren. Väsentliga ändringar meddelas på startsidan eller i nyhetsbrevet senast 14 dagar innan de träder i kraft.",
            de: "Wir können diese Bedingungen ändern. Wesentliche Änderungen werden spätestens 14 Tage vor Inkrafttreten auf der Startseite oder im Newsletter angekündigt.",
            pl: "Możemy zmieniać niniejsze warunki. Istotne zmiany zostaną ogłoszone na stronie głównej lub w newsletterze najpóźniej 14 dni przed ich wejściem w życie.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "8. Lovvalg og verneting", en: "8. Governing law and venue", sv: "8. Tillämplig lag och forum", de: "8. Anwendbares Recht und Gerichtsstand", pl: "8. Prawo właściwe i jurysdykcja" })}>
        <p>
          {tr(lang, {
            no: "Disse vilkårene er underlagt norsk rett. Tvister søkes løst i minnelighet via vårt kontaktskjema. Kommer partene ikke til enighet, er Kristiansand tingrett verneting.",
            en: "These terms are governed by Norwegian law. Disputes will first be sought resolved amicably via our contact form. If the parties cannot agree, Kristiansand District Court has jurisdiction.",
            sv: "Dessa villkor regleras av norsk rätt. Tvister ska i första hand lösas i godo via vårt kontaktformulär. Om parterna inte kan enas är Kristiansand tingrätt forum.",
            de: "Diese Bedingungen unterliegen norwegischem Recht. Streitigkeiten sollen zunächst gütlich über unser Kontaktformular beigelegt werden. Können sich die Parteien nicht einigen, ist das Amtsgericht Kristiansand zuständig.",
            pl: "Niniejsze warunki podlegają prawu norweskiemu. Spory będą w pierwszej kolejności rozstrzygane polubownie za pośrednictwem naszego formularza kontaktowego. Jeśli strony nie dojdą do porozumienia, właściwy jest sąd rejonowy w Kristiansand.",
          })}
        </p>
      </Section>
    </LegalPage>
  );
}
