import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/copyright")({
  component: CopyrightPage,
  head: () => ({ meta: [
    { title: "Copyright Notice — SlowBlues" },
    { name: "description", content: "Opphavsrettsinformasjon for slowblues.no — redaksjonelt innhold, bilder, sitatrett og rapportering av brudd." },
    { property: "og:title", content: "Copyright Notice — SlowBlues" },
    { property: "og:description", content: "Opphavsrett og bruksvilkår for slowblues.no." },
  ]}),
});

function CopyrightPage() {
  const year = new Date().getFullYear();
  return (
    <LegalPage
      eyebrow="Opphavsrett"
      title="Copyright Notice"
      lead="Hva som er beskyttet, hva som kan gjenbrukes — og hvordan rapportere brudd."
      updated="Mai 2026"
    >
      <Section heading={`© ${year} KM TECH LABS`}>
        <p>
          Alt redaksjonelt innhold på slowblues.no — tekster, layout, kildekode, originale illustrasjoner og
          struktur — er opphavsrettslig beskyttet © {year} KM TECH LABS — Kjell Mersland, org.nr. 934 044 029.
          Alle rettigheter forbeholdt.
        </p>
      </Section>

      <Section heading="Sitatrett">
        <p>
          Korte sitater er tillatt i tråd med åndsverklovens sitatregel (§ 29), forutsatt at det er
          tydelig kildehenvisning og lenke tilbake til den relevante siden på slowblues.no.
        </p>
      </Section>

      <Section heading="Bilder og medier">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Historiske bilder: Public Domain eller Creative Commons (kilde oppgis ved bildet).</li>
          <li>Pressebilder av artister: brukt under sitatrett eller med tillatelse fra rettighetshaver.</li>
          <li>YouTube-innbygginger: forblir rettighetshaverens eiendom; lisensiering håndteres av YouTube.</li>
          <li>Egne fotografier og illustrasjoner: © KM TECH LABS, ikke til gjenbruk uten skriftlig tillatelse.</li>
        </ul>
      </Section>

      <Section heading="Lisens for gjenbruk">
        <p>
          Ønsker du å bruke større deler av tekstmaterialet — for eksempel i bok, presse eller undervisning —
          ta kontakt via skjemaet. Vi gir som regel tillatelse til ikke-kommersiell, kreditert bruk.
        </p>
      </Section>

      <Section heading="Varsel om opphavsrettsbrudd">
        <p>
          Mener du at innhold på slowblues.no krenker dine rettigheter? Send oss en melding via
          kontaktskjemaet med følgende informasjon:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Identifikasjon av det opphavsrettsbeskyttede verket.</li>
          <li>URL til det påståtte krenkende innholdet på slowblues.no.</li>
          <li>Din kontaktinformasjon og dokumentasjon på at du er rettighetshaver.</li>
        </ul>
        <p>Vi behandler slike henvendelser uten ugrunnet opphold, og fjerner krenkende innhold midlertidig mens saken vurderes.</p>
      </Section>
    </LegalPage>
  );
}
