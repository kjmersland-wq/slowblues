import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/copyright")({
  component: CopyrightPage,
  head: () => ({ meta: [
    { title: "Copyright Notice — SlowBlues" },
    { name: "description", content: "Opphavsrettsinformasjon for slow-blues.com — redaksjonelt innhold, bilder, sitatrett og rapportering av brudd." },
    { property: "og:title", content: "Copyright Notice — SlowBlues" },
    { property: "og:description", content: "Opphavsrett og bruksvilkår for slow-blues.com." },
  ]}),
});

function CopyrightPage() {
  const year = new Date().getFullYear();
  const { lang } = useI18n();
  return (
    <LegalPage
      eyebrow={tr(lang, { no: "Opphavsrett", en: "Copyright", sv: "Upphovsrätt", de: "Urheberrecht", pl: "Prawa autorskie" })}
      title="Copyright Notice"
      lead={tr(lang, {
        no: "Hva som er beskyttet, hva som kan gjenbrukes — og hvordan rapportere brudd.",
        en: "What's protected, what can be reused — and how to report infringement.",
        sv: "Vad som är skyddat, vad som kan återanvändas — och hur man rapporterar intrång.",
        de: "Was geschützt ist, was wiederverwendet werden darf — und wie Sie Verstöße melden.",
        pl: "Co jest chronione, co można ponownie wykorzystać — i jak zgłosić naruszenie.",
      })}
      updated={tr(lang, { no: "Mai 2026", en: "May 2026", sv: "Maj 2026", de: "Mai 2026", pl: "Maj 2026" })}
    >
      <Section heading={`© ${year} KM TECH LABS`}>
        <p>
          {tr(lang, {
            no: "Alt redaksjonelt innhold på slow-blues.com — tekster, layout, kildekode, originale illustrasjoner og struktur — er opphavsrettslig beskyttet",
            en: "All editorial content on slow-blues.com — text, layout, source code, original illustrations and structure — is protected by copyright",
            sv: "Allt redaktionellt innehåll på slow-blues.com — texter, layout, källkod, originalillustrationer och struktur — är upphovsrättsligt skyddat",
            de: "Alle redaktionellen Inhalte auf slow-blues.com — Texte, Layout, Quellcode, Originalillustrationen und Struktur — sind urheberrechtlich geschützt",
            pl: "Wszystkie treści redakcyjne na slow-blues.com — teksty, układ, kod źródłowy, oryginalne ilustracje i struktura — są chronione prawem autorskim",
          })}{" "}© {year} KM TECH LABS — Kjell Mersland, {tr(lang, { no: "org.nr.", en: "reg. no.", sv: "org.nr.", de: "Handelsreg.-Nr.", pl: "nr rej." })} 934 044 029.{" "}
          {tr(lang, {
            no: "Alle rettigheter forbeholdt.",
            en: "All rights reserved.",
            sv: "Alla rättigheter förbehållna.",
            de: "Alle Rechte vorbehalten.",
            pl: "Wszelkie prawa zastrzeżone.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Sitatrett", en: "Right to quote", sv: "Citaträtt", de: "Zitatrecht", pl: "Prawo cytatu" })}>
        <p>
          {tr(lang, {
            no: "Korte sitater er tillatt i tråd med åndsverklovens sitatregel (§ 29), forutsatt at det er tydelig kildehenvisning og lenke tilbake til den relevante siden på slow-blues.com.",
            en: "Short quotations are permitted under the Norwegian Copyright Act's quotation rule (§ 29), provided there is a clear source reference and a link back to the relevant page on slow-blues.com.",
            sv: "Korta citat är tillåtna enligt den norska upphovsrättslagens citaträtt (§ 29), förutsatt att det finns tydlig källhänvisning och en länk tillbaka till den relevanta sidan på slow-blues.com.",
            de: "Kurze Zitate sind gemäß der norwegischen Zitatregel im Urheberrechtsgesetz (§ 29) zulässig, sofern eine klare Quellenangabe und ein Link zur entsprechenden Seite auf slow-blues.com erfolgen.",
            pl: "Krótkie cytaty są dozwolone zgodnie z zasadą cytatu norweskiej ustawy o prawie autorskim (§ 29), pod warunkiem podania wyraźnego źródła i linku zwrotnego do odpowiedniej strony na slow-blues.com.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Bilder og medier", en: "Images and media", sv: "Bilder och media", de: "Bilder und Medien", pl: "Obrazy i media" })}>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>{tr(lang, { no: "Historiske bilder", en: "Historical images", sv: "Historiska bilder", de: "Historische Bilder", pl: "Zdjęcia historyczne" })}:</strong>{" "}
            {tr(lang, {
              no: "Public Domain eller Creative Commons (kilde oppgis ved bildet).",
              en: "Public Domain or Creative Commons (source noted by the image).",
              sv: "Public Domain eller Creative Commons (källa anges vid bilden).",
              de: "gemeinfrei oder Creative Commons (Quelle beim Bild angegeben).",
              pl: "domena publiczna lub Creative Commons (źródło podane przy zdjęciu).",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Pressebilder av artister", en: "Press photos of artists", sv: "Pressbilder på artister", de: "Pressefotos von Künstlern", pl: "Zdjęcia prasowe artystów" })}:</strong>{" "}
            {tr(lang, {
              no: "brukt under sitatrett eller med tillatelse fra rettighetshaver.",
              en: "used under quotation rights or with permission from the rights holder.",
              sv: "används med citaträtt eller med tillstånd från rättighetsinnehavaren.",
              de: "genutzt im Rahmen des Zitatrechts oder mit Genehmigung des Rechteinhabers.",
              pl: "wykorzystane w ramach prawa cytatu lub za zgodą posiadacza praw.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "YouTube-innbygginger", en: "YouTube embeds", sv: "YouTube-inbäddningar", de: "YouTube-Einbettungen", pl: "Osadzenia YouTube" })}:</strong>{" "}
            {tr(lang, {
              no: "forblir rettighetshaverens eiendom; lisensiering håndteres av YouTube.",
              en: "remain the property of the rights holder; licensing is handled by YouTube.",
              sv: "förblir rättighetsinnehavarens egendom; licensiering hanteras av YouTube.",
              de: "bleiben Eigentum des Rechteinhabers; die Lizenzierung erfolgt über YouTube.",
              pl: "pozostają własnością posiadacza praw; kwestie licencyjne obsługuje YouTube.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Egne fotografier og illustrasjoner", en: "Original photographs and illustrations", sv: "Egna fotografier och illustrationer", de: "Eigene Fotografien und Illustrationen", pl: "Własne fotografie i ilustracje" })}:</strong>{" "}
            © KM TECH LABS,{" "}
            {tr(lang, {
              no: "ikke til gjenbruk uten skriftlig tillatelse.",
              en: "not for reuse without written permission.",
              sv: "ej för återanvändning utan skriftligt tillstånd.",
              de: "keine Wiederverwendung ohne schriftliche Genehmigung.",
              pl: "nie do wykorzystania bez pisemnej zgody.",
            })}
          </li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "Lisens for gjenbruk", en: "License for reuse", sv: "Licens för återanvändning", de: "Lizenz für Wiederverwendung", pl: "Licencja na ponowne wykorzystanie" })}>
        <p>
          {tr(lang, {
            no: "Ønsker du å bruke større deler av tekstmaterialet — for eksempel i bok, presse eller undervisning — ta kontakt via skjemaet. Vi gir som regel tillatelse til ikke-kommersiell, kreditert bruk.",
            en: "Want to use larger parts of the text material — for example in a book, press coverage or teaching? Get in touch via the form. We generally grant permission for non-commercial, credited use.",
            sv: "Vill du använda större delar av textmaterialet — till exempel i bok, press eller undervisning — kontakta oss via formuläret. Vi ger som regel tillstånd för icke-kommersiellt bruk med kreditering.",
            de: "Möchten Sie größere Teile des Textmaterials nutzen — etwa in einem Buch, in der Presse oder für Lehrzwecke? Kontaktieren Sie uns über das Formular. Wir erteilen in der Regel eine Genehmigung für nicht-kommerzielle Nutzung mit Quellenangabe.",
            pl: "Chcesz wykorzystać większe fragmenty materiału tekstowego — na przykład w książce, prasie czy do celów edukacyjnych? Skontaktuj się z nami przez formularz. Zazwyczaj udzielamy zgody na niekomercyjne wykorzystanie z podaniem źródła.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Varsel om opphavsrettsbrudd", en: "Copyright infringement notice", sv: "Anmälan om upphovsrättsintrång", de: "Hinweis auf Urheberrechtsverletzung", pl: "Zgłoszenie naruszenia praw autorskich" })}>
        <p>
          {tr(lang, {
            no: "Mener du at innhold på slow-blues.com krenker dine rettigheter? Send oss en melding via kontaktskjemaet med følgende informasjon:",
            en: "Believe content on slow-blues.com infringes your rights? Send us a message via the contact form with the following information:",
            sv: "Anser du att innehåll på slow-blues.com kränker dina rättigheter? Skicka ett meddelande via kontaktformuläret med följande information:",
            de: "Glauben Sie, dass Inhalte auf slow-blues.com Ihre Rechte verletzen? Senden Sie uns eine Nachricht über das Kontaktformular mit folgenden Informationen:",
            pl: "Uważasz, że treści na slow-blues.com naruszają Twoje prawa? Wyślij nam wiadomość przez formularz kontaktowy, podając następujące informacje:",
          })}
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{tr(lang, {
            no: "Identifikasjon av det opphavsrettsbeskyttede verket.",
            en: "Identification of the copyrighted work.",
            sv: "Identifiering av det upphovsrättsskyddade verket.",
            de: "Identifikation des urheberrechtlich geschützten Werks.",
            pl: "Identyfikacja dzieła chronionego prawem autorskim.",
          })}</li>
          <li>{tr(lang, {
            no: "URL til det påståtte krenkende innholdet på slow-blues.com.",
            en: "The URL of the allegedly infringing content on slow-blues.com.",
            sv: "URL till det påstått kränkande innehållet på slow-blues.com.",
            de: "Die URL des mutmaßlich rechtsverletzenden Inhalts auf slow-blues.com.",
            pl: "Adres URL rzekomo naruszającej treści na slow-blues.com.",
          })}</li>
          <li>{tr(lang, {
            no: "Din kontaktinformasjon og dokumentasjon på at du er rettighetshaver.",
            en: "Your contact information and documentation showing you're the rights holder.",
            sv: "Din kontaktinformation och dokumentation som visar att du är rättighetsinnehavare.",
            de: "Ihre Kontaktinformationen und einen Nachweis, dass Sie der Rechteinhaber sind.",
            pl: "Twoje dane kontaktowe i dokumentację potwierdzającą, że jesteś posiadaczem praw.",
          })}</li>
        </ul>
        <p>
          {tr(lang, {
            no: "Vi behandler slike henvendelser uten ugrunnet opphold, og fjerner krenkende innhold midlertidig mens saken vurderes.",
            en: "We process such reports without undue delay, and temporarily remove infringing content while the matter is being assessed.",
            sv: "Vi behandlar sådana anmälningar utan onödigt dröjsmål och tar tillfälligt bort kränkande innehåll medan ärendet utreds.",
            de: "Wir bearbeiten solche Meldungen unverzüglich und entfernen rechtsverletzende Inhalte vorübergehend, während der Fall geprüft wird.",
            pl: "Rozpatrujemy takie zgłoszenia bez zbędnej zwłoki i tymczasowo usuwamy naruszające treści na czas rozpatrywania sprawy.",
          })}
        </p>
      </Section>
    </LegalPage>
  );
}
