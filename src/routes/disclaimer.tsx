import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({ meta: [
    { title: "Disclaimer — SlowBlues" },
    { name: "description", content: "Ansvarsfraskrivelse for innhold, eksterne lenker, bilder og kommersielle anbefalinger på slowblues.no." },
    { property: "og:title", content: "Disclaimer — SlowBlues" },
    { property: "og:description", content: "Ansvarsfraskrivelse for slowblues.no." },
  ]}),
});

function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Ansvar"
      title="Disclaimer"
      lead="Hva vi står inne for — og hva vi ikke kan garantere."
      updated="Mai 2026"
    >
      <Section heading="Generelt om innholdet">
        <p>
          Innholdet på slowblues.no er ment som redaksjonell og kulturhistorisk informasjon. Selv om vi
          tilstreber høy presisjon og faktasjekk, kan det forekomme feil eller utdaterte opplysninger.
          Oppdager du noe — bruk kontaktskjemaet, så retter vi.
        </p>
      </Section>

      <Section heading="Ingen profesjonell rådgivning">
        <p>
          Anmeldelser, intervjuer og artikler er redaksjonelle ytringer og må ikke tolkes som juridisk,
          medisinsk, økonomisk eller annen profesjonell rådgivning.
        </p>
      </Section>

      <Section heading="Eksterne lenker">
        <p>
          Vi lenker til mange eksterne kilder (Wikipedia, artisters egne sider, YouTube, festivaler m.fl.).
          Vi har ingen redaksjonell kontroll over disse, og er ikke ansvarlige for deres innhold, tilgjengelighet
          eller personvernpraksis. Døde lenker meldes inn via kontaktskjemaet.
        </p>
      </Section>

      <Section heading="Bilder og lyd">
        <p>
          Historiske bilder er hentet fra Library of Congress, Wikimedia Commons og lignende kilder under
          Public Domain eller Creative Commons. Moderne pressebilder brukes med tillatelse eller under sitatretten.
          Lydeksempler og YouTube-bygginger forblir den respektive rettighetshaverens eiendom.
        </p>
      </Section>

      <Section heading="Tilknyttede lenker / merch">
        <p>
          Enkelte lenker (merch, billetter) kan være partnerlenker som genererer en liten provisjon.
          Det påvirker aldri redaksjonelt innhold eller anmeldelser, og det er ingen ekstra kostnad for deg.
        </p>
      </Section>

      <Section heading="AI-assistert redaksjon">
        <p>
          Deler av research, oversettelser og biografisammendrag kan være utarbeidet med hjelp av kunstig intelligens,
          alltid kontrollert og redigert av ansvarlig redaktør.
        </p>
      </Section>
    </LegalPage>
  );
}
