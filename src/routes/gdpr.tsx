import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/gdpr")({
  component: GdprPage,
  head: () => ({
    meta: [
      { title: "GDPR & Data Protection — SlowBlues" },
      { name: "description", content: "Hvordan SlowBlues.no og KM TECH LABS oppfyller GDPR: behandlingsgrunnlag, lagring, dine rettigheter og databehandlere." },
      { property: "og:title", content: "GDPR & Data Protection — SlowBlues" },
      { property: "og:description", content: "GDPR-erklæring fra KM TECH LABS." },
      { property: "og:url", content: "https://www.slow-blues.com/gdpr" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/gdpr" }],
  }),
});

function GdprPage() {
  return (
    <LegalPage
      eyebrow="GDPR"
      title="GDPR & Data Protection"
      lead="Hvordan vi behandler personopplysninger i tråd med EU-forordning 2016/679 (GDPR) og norsk personopplysningslov."
      updated="Mai 2026"
    >
      <Section heading="Behandlingsansvarlig">
        <p>
          Behandlingsansvarlig for opplysninger samlet inn på slow-blues.com er
          <strong> KM TECH LABS — Kjell Mersland</strong>, org.nr. 934 044 029, Norge.
          Ansvarlig redaktør og kontaktperson for personvernspørsmål er Kjell Mersland.
        </p>
      </Section>

      <Section heading="Hvilke opplysninger vi samler inn">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Kontaktskjema:</strong> navn, e-postadresse og meldingsinnhold du sender oss.</li>
          <li><strong>Nyhetsbrev:</strong> e-postadressen din, og hvilke kategorier du har valgt.</li>
          <li><strong>Gjestebok:</strong> navn og melding du selv velger å publisere.</li>
          <li><strong>Tekniske data:</strong> IP-adresse og anonymisert besøksstatistikk for sikkerhet og drift.</li>
        </ul>
      </Section>

      <Section heading="Behandlingsgrunnlag og formål">
        <p>Vi behandler personopplysninger på følgende grunnlag (jf. GDPR art. 6):</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Samtykke</strong> (art. 6(1)(a)) — for nyhetsbrev og gjestebok.</li>
          <li><strong>Berettiget interesse</strong> (art. 6(1)(f)) — for å besvare henvendelser via kontaktskjema og opprettholde sikker drift.</li>
          <li><strong>Rettslig forpliktelse</strong> (art. 6(1)(c)) — for bokførings- og loggkrav.</li>
        </ul>
      </Section>

      <Section heading="Lagringstid">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Kontaktmeldinger: slettes senest 12 måneder etter siste korrespondanse.</li>
          <li>Nyhetsbrev: lagres til du melder deg av.</li>
          <li>Gjestebok: lagres så lenge innlegget er publisert (du kan be om sletting).</li>
          <li>Sikkerhetslogger: maks 90 dager.</li>
        </ul>
      </Section>

      <Section heading="Dine rettigheter">
        <p>Du har til enhver tid rett til:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Innsyn i hvilke opplysninger vi har om deg.</li>
          <li>Retting av feilaktige opplysninger.</li>
          <li>Sletting («retten til å bli glemt»).</li>
          <li>Dataportabilitet — utlevering i maskinlesbart format.</li>
          <li>Å trekke samtykke tilbake.</li>
          <li>Å klage til Datatilsynet (<a href="https://www.datatilsynet.no" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">datatilsynet.no</a>).</li>
        </ul>
        <p>Henvendelser om dine rettigheter sendes via vårt kontaktskjema. Vi besvarer innen 30 dager.</p>
      </Section>

      <Section heading="Databehandlere">
        <p>Vi benytter følgende databehandlere, alle med databehandleravtale (DPA) og GDPR-egnet behandling:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Cloudflare</strong> — hosting, database (D1) og sikkerhet.</li>
          <li><strong>MailerLite</strong> — utsendelse av nyhetsbrev.</li>
        </ul>
        <p>Vi overfører ikke personopplysninger til tredjeland uten gyldig overføringsgrunnlag (SCC eller adekvansbeslutning).</p>
      </Section>

      <Section heading="Sikkerhet">
        <p>
          Alle data overføres kryptert via HTTPS/TLS. Tilgang til databasen er rollebasert og logges.
          Ved et eventuelt sikkerhetsbrudd som påvirker dine rettigheter, varsler vi Datatilsynet og berørte
          brukere uten ugrunnet opphold (innen 72 timer).
        </p>
      </Section>
    </LegalPage>
  );
}
