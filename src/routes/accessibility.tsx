import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/accessibility")({
  component: AccessibilityPage,
  head: () => ({ meta: [
    { title: "Accessibility Statement — SlowBlues" },
    { name: "description", content: "Tilgjengelighetserklæring for slowblues.no — WCAG 2.1 AA, kjente begrensninger og hvordan du melder fra om problemer." },
    { property: "og:title", content: "Accessibility Statement — SlowBlues" },
    { property: "og:description", content: "WCAG-tilgjengelighet på SlowBlues.no." },
  ]}),
});

function AccessibilityPage() {
  return (
    <LegalPage
      eyebrow="Tilgjengelighet"
      title="Accessibility Statement"
      lead="SlowBlues.no skal være lett å bruke for alle — uansett hjelpemidler eller funksjonsevne."
      updated="Mai 2026"
    >
      <Section heading="Vår forpliktelse">
        <p>
          Vi jobber for at slowblues.no skal være i samsvar med <strong>WCAG 2.1 nivå AA</strong> og kravene
          i forskrift om universell utforming av IKT-løsninger (UU-forskriften).
        </p>
      </Section>

      <Section heading="Hva vi har gjort">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Semantisk HTML, korrekt overskriftsstruktur og landemerker (<code>main</code>, <code>nav</code>, <code>footer</code>).</li>
          <li>Tilstrekkelig fargekontrast i mørkt premium-tema.</li>
          <li>Tastaturnavigasjon med synlig fokusring på alle interaktive elementer.</li>
          <li>Alt-tekst på meningsbærende bilder; dekorative bilder er merket som sådan.</li>
          <li>Skjemaer med tydelige etiketter og feilmeldinger med <code>role="alert"</code>.</li>
          <li>Responsivt design fra 320 px og oppover, med fleksibel typografi.</li>
          <li>Språkattributt settes dynamisk når du bytter mellom norsk, engelsk og tysk.</li>
        </ul>
      </Section>

      <Section heading="Kjente begrensninger">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Enkelte historiske bilder mangler detaljert alt-tekst — vi forbedrer dette løpende.</li>
          <li>Innebygde YouTube-spillere arver tilgjengelighet fra YouTube selv.</li>
          <li>Tredjepartsbiblioteker (kart, embeds) kan i sjeldne tilfeller ha mindre avvik.</li>
        </ul>
      </Section>

      <Section heading="Meld fra om problemer">
        <p>
          Opplever du barrierer? Vi vil gjerne høre fra deg. Bruk kontaktskjemaet og beskriv problemet,
          gjerne med URL og hvilket hjelpemiddel du bruker. Vi besvarer henvendelser innen 14 dager.
        </p>
      </Section>

      <Section heading="Tilsynsmyndighet">
        <p>
          I Norge fører <a href="https://www.uutilsynet.no" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Tilsynet for universell utforming av IKT</a>
          {" "}tilsyn med regelverket. Du kan klage dit hvis du ikke er fornøyd med vår oppfølging.
        </p>
      </Section>
    </LegalPage>
  );
}
