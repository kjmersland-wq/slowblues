import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({ meta: [
    { title: "Cookie Policy — SlowBlues" },
    { name: "description", content: "Slik bruker SlowBlues.no informasjonskapsler og lokal lagring. Vi bruker ingen markedsførings- eller sporingscookies." },
    { property: "og:title", content: "Cookie Policy — SlowBlues" },
    { property: "og:description", content: "Cookie-policy for SlowBlues.no." },
  ]}),
});

function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookie Policy"
      lead="Vi bruker informasjonskapsler kun til strengt nødvendig drift og dine egne preferanser."
      updated="Mai 2026"
    >
      <Section heading="Hva er informasjonskapsler?">
        <p>
          Informasjonskapsler («cookies») er små tekstfiler som lagres i nettleseren din. De brukes til å huske
          innstillinger, autentisere brukere og samle statistikk. Det samme gjelder relaterte teknologier som
          <em> localStorage </em> og <em>sessionStorage</em>.
        </p>
      </Section>

      <Section heading="Hva vi bruker — og ikke bruker">
        <p>SlowBlues.no bruker minst mulig:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>slowblues-lang</strong> (localStorage) — husker språkvalget ditt (no/en/de). Strengt nødvendig.</li>
          <li><strong>Supabase auth-token</strong> (localStorage) — kun for innloggede admin-brukere, for å holde deg pålogget.</li>
          <li><strong>Anonymisert besøksstatistikk</strong> — uten identifiserende cookies, ingen profilering.</li>
        </ul>
        <p>Vi bruker <strong>ingen</strong> markedsføringscookies, ingen tredjeparts-sporing, ingen Facebook-pixel, og ingen Google Analytics som identifiserer enkeltpersoner.</p>
      </Section>

      <Section heading="Tredjepartsinnhold">
        <p>
          Når du spiller av YouTube-videoer eller åpner eksterne lenker, kan tredjepartene sette egne cookies.
          Vi har innebygd YouTube i «privacy-enhanced» modus der det er teknisk mulig.
        </p>
      </Section>

      <Section heading="Hvordan administrere cookies">
        <p>
          Du kan slette eller blokkere cookies i nettleserinnstillingene dine. Å blokkere
          <em> slowblues-lang </em> betyr kun at språkvalget tilbakestilles ved neste besøk.
        </p>
      </Section>

      <Section heading="Samtykke">
        <p>
          Fordi vi kun bruker strengt nødvendige cookies og preferansecookies du selv setter
          (ved å bytte språk eller logge inn), kreves det ikke aktivt cookie-samtykke etter
          ePrivacy-direktivet. Vi har likevel forberedt teknisk støtte for en samtykkebanner dersom vi
          senere skulle introdusere valgfrie cookies.
        </p>
      </Section>
    </LegalPage>
  );
}
