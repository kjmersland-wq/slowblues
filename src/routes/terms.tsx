import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [
    { title: "Terms of Service — SlowBlues" },
    { name: "description", content: "Brukervilkår for slow-blues.com — bruk av innhold, ansvar, immaterielle rettigheter og lovvalg." },
    { property: "og:title", content: "Terms of Service — SlowBlues" },
    { property: "og:description", content: "Brukervilkår for SlowBlues.no." },
  ]}),
});

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Brukervilkår"
      title="Terms of Service"
      lead="Vilkår som regulerer din bruk av slow-blues.com, levert av KM TECH LABS."
      updated="Mai 2026"
    >
      <Section heading="1. Aksept av vilkår">
        <p>
          Ved å bruke slow-blues.com aksepterer du disse vilkårene. Hvis du ikke aksepterer dem,
          ber vi deg om å avstå fra bruk av tjenesten.
        </p>
      </Section>

      <Section heading="2. Tjenesten">
        <p>
          SlowBlues.no er et redaksjonelt nettarkiv om blues-musikk, drevet av KM TECH LABS — Kjell Mersland,
          org.nr. 934 044 029. Tjenesten leveres «som den er», uten garanti for kontinuerlig tilgjengelighet.
        </p>
      </Section>

      <Section heading="3. Brukers ansvar">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Du forplikter deg til å ikke poste ulovlig, ærekrenkende eller hatefullt innhold i gjestebok eller kontaktskjema.</li>
          <li>Du skal ikke forsøke å omgå sikkerhetsmekanismer, scrape store mengder innhold eller belaste tjenesten unødig.</li>
          <li>Du står selv ansvarlig for innholdet i meldinger og innlegg du sender inn.</li>
        </ul>
      </Section>

      <Section heading="4. Immaterielle rettigheter">
        <p>
          Redaksjonelt innhold (tekst, layout, kode, valgte bilder) på slow-blues.com tilhører KM TECH LABS eller
          bidragsytere, og er beskyttet av åndsverkloven. Sitater er tillatt i tråd med god skikk og med
          tydelig kildehenvisning. Se også <a href="/copyright" className="text-gold hover:underline">Copyright Notice</a>.
        </p>
      </Section>

      <Section heading="5. Brukergenerert innhold">
        <p>
          Når du publiserer i gjesteboken eller sender inn tips, gir du oss en ikke-eksklusiv, vederlagsfri rett
          til å vise innholdet på tjenesten. Du beholder selv opphavsretten. Vi forbeholder oss retten til å
          fjerne innhold som bryter vilkårene.
        </p>
      </Section>

      <Section heading="6. Ansvarsbegrensning">
        <p>
          KM TECH LABS er ikke ansvarlig for indirekte tap eller følgeskader som måtte oppstå ved bruk av
          slow-blues.com. Se også <a href="/disclaimer" className="text-gold hover:underline">Disclaimer</a>.
        </p>
      </Section>

      <Section heading="7. Endringer">
        <p>
          Vi kan endre vilkårene. Vesentlige endringer varsles på forsiden eller i nyhetsbrevet senest 14 dager
          før de trer i kraft.
        </p>
      </Section>

      <Section heading="8. Lovvalg og verneting">
        <p>
          Disse vilkårene er underlagt norsk rett. Tvister søkes løst i minnelighet via vårt kontaktskjema.
          Kommer partene ikke til enighet, er Kristiansand tingrett verneting.
        </p>
      </Section>
    </LegalPage>
  );
}
