import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";
import { useI18n, tr } from "@/i18n";

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
  const { lang } = useI18n();
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookie Policy"
      lead={tr(lang, {
        no: "Vi bruker informasjonskapsler kun til strengt nødvendig drift og dine egne preferanser.",
        en: "We use cookies only for strictly necessary operation and your own preferences.",
        sv: "Vi använder kakor endast för strikt nödvändig drift och dina egna preferenser.",
        de: "Wir verwenden Cookies nur für unbedingt notwendigen Betrieb und Ihre eigenen Präferenzen.",
        pl: "Używamy plików cookie wyłącznie do niezbędnego działania i zapamiętywania Twoich preferencji.",
      })}
      updated={tr(lang, { no: "Mai 2026", en: "May 2026", sv: "Maj 2026", de: "Mai 2026", pl: "Maj 2026" })}
    >
      <Section heading={tr(lang, { no: "Hva er informasjonskapsler?", en: "What are cookies?", sv: "Vad är kakor?", de: "Was sind Cookies?", pl: "Czym są pliki cookie?" })}>
        <p>
          {tr(lang, {
            no: "Informasjonskapsler («cookies») er små tekstfiler som lagres i nettleseren din. De brukes til å huske innstillinger, autentisere brukere og samle statistikk. Det samme gjelder relaterte teknologier som",
            en: "Cookies are small text files stored in your browser. They're used to remember settings, authenticate users and gather statistics. The same applies to related technologies like",
            sv: "Kakor är små textfiler som lagras i din webbläsare. De används för att komma ihåg inställningar, autentisera användare och samla statistik. Detsamma gäller relaterade tekniker som",
            de: "Cookies sind kleine Textdateien, die in Ihrem Browser gespeichert werden. Sie dienen dazu, Einstellungen zu merken, Benutzer zu authentifizieren und Statistiken zu erfassen. Dasselbe gilt für verwandte Technologien wie",
            pl: "Pliki cookie to małe pliki tekstowe zapisywane w przeglądarce. Służą do zapamiętywania ustawień, uwierzytelniania użytkowników i zbierania statystyk. To samo dotyczy powiązanych technologii, takich jak",
          })}
          {" "}<em>localStorage</em> {tr(lang, { no: "og", en: "and", sv: "och", de: "und", pl: "i" })} <em>sessionStorage</em>.
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Hva vi bruker — og ikke bruker", en: "What we use — and don't use", sv: "Vad vi använder — och inte använder", de: "Was wir verwenden — und was nicht", pl: "Czego używamy — i czego nie używamy" })}>
        <p>{tr(lang, {
          no: "SlowBlues.no bruker minst mulig:",
          en: "SlowBlues.com uses as little as possible:",
          sv: "SlowBlues.com använder så lite som möjligt:",
          de: "SlowBlues.com verwendet so wenig wie möglich:",
          pl: "SlowBlues.com używa jak najmniej:",
        })}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>slowblues-lang</strong> (localStorage) —{" "}
            {tr(lang, {
              no: "husker språkvalget ditt (no/en/sv/de/pl). Strengt nødvendig.",
              en: "remembers your language choice (no/en/sv/de/pl). Strictly necessary.",
              sv: "kommer ihåg ditt språkval (no/en/sv/de/pl). Strikt nödvändig.",
              de: "merkt sich Ihre Sprachauswahl (no/en/sv/de/pl). Unbedingt erforderlich.",
              pl: "zapamiętuje wybrany język (no/en/sv/de/pl). Niezbędny.",
            })}
          </li>
          <li>
            <strong>admin_session</strong> (HttpOnly-cookie) —{" "}
            {tr(lang, {
              no: "kun for innloggede admin-brukere, for å holde deg pålogget.",
              en: "only for logged-in admin users, to keep you signed in.",
              sv: "endast för inloggade admin-användare, för att hålla dig inloggad.",
              de: "nur für angemeldete Admin-Benutzer, um Sie eingeloggt zu halten.",
              pl: "tylko dla zalogowanych administratorów, aby utrzymać sesję zalogowania.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Anonymisert besøksstatistikk", en: "Anonymized visit statistics", sv: "Anonymiserad besöksstatistik", de: "Anonymisierte Besuchsstatistik", pl: "Zanonimizowane statystyki odwiedzin" })}</strong> —{" "}
            {tr(lang, {
              no: "uten identifiserende cookies, ingen profilering.",
              en: "no identifying cookies, no profiling.",
              sv: "inga identifierande kakor, ingen profilering.",
              de: "keine identifizierenden Cookies, kein Profiling.",
              pl: "bez identyfikujących plików cookie, bez profilowania.",
            })}
          </li>
        </ul>
        <p>
          {tr(lang, { no: "Vi bruker", en: "We use", sv: "Vi använder", de: "Wir verwenden", pl: "Nie używamy" })}{" "}
          <strong>{tr(lang, { no: "ingen", en: "no", sv: "inga", de: "keine", pl: "żadnych" })}</strong>{" "}
          {tr(lang, {
            no: "markedsføringscookies, ingen tredjeparts-sporing, ingen Facebook-pixel, og ingen Google Analytics som identifiserer enkeltpersoner.",
            en: "marketing cookies, no third-party tracking, no Facebook pixel, and no Google Analytics that identifies individuals.",
            sv: "marknadsföringskakor, ingen tredjepartsspårning, ingen Facebook-pixel och ingen Google Analytics som identifierar enskilda personer.",
            de: "Marketing-Cookies, kein Tracking durch Dritte, keinen Facebook-Pixel und kein Google Analytics, das einzelne Personen identifiziert.",
            pl: "plików cookie marketingowych, śledzenia przez firmy trzecie, piksela Facebooka ani Google Analytics identyfikującego pojedyncze osoby.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Tredjepartsinnhold", en: "Third-party content", sv: "Tredjepartsinnehåll", de: "Inhalte von Drittanbietern", pl: "Treści firm trzecich" })}>
        <p>
          {tr(lang, {
            no: "Når du spiller av YouTube-videoer eller åpner eksterne lenker, kan tredjepartene sette egne cookies. Vi har innebygd YouTube i «privacy-enhanced» modus der det er teknisk mulig.",
            en: "When you play YouTube videos or open external links, those third parties may set their own cookies. We embed YouTube in \"privacy-enhanced\" mode wherever technically possible.",
            sv: "När du spelar upp YouTube-videor eller öppnar externa länkar kan tredje part sätta egna kakor. Vi bäddar in YouTube i \"privacy-enhanced\"-läge där det är tekniskt möjligt.",
            de: "Wenn Sie YouTube-Videos abspielen oder externe Links öffnen, können diese Drittanbieter eigene Cookies setzen. Wir betten YouTube, wo technisch möglich, im \"Datenschutzmodus\" ein.",
            pl: "Odtwarzając filmy z YouTube lub otwierając linki zewnętrzne, te podmioty trzecie mogą ustawiać własne pliki cookie. Osadzamy YouTube w trybie \"zwiększonej ochrony prywatności\" tam, gdzie jest to technicznie możliwe.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Hvordan administrere cookies", en: "How to manage cookies", sv: "Så hanterar du kakor", de: "Wie Sie Cookies verwalten", pl: "Jak zarządzać plikami cookie" })}>
        <p>
          {tr(lang, {
            no: "Du kan slette eller blokkere cookies i nettleserinnstillingene dine. Å blokkere",
            en: "You can delete or block cookies in your browser settings. Blocking",
            sv: "Du kan radera eller blockera kakor i dina webbläsarinställningar. Att blockera",
            de: "Sie können Cookies in Ihren Browsereinstellungen löschen oder blockieren. Das Blockieren von",
            pl: "Możesz usunąć lub zablokować pliki cookie w ustawieniach przeglądarki. Zablokowanie",
          })}
          {" "}<em>slowblues-lang</em>{" "}
          {tr(lang, {
            no: "betyr kun at språkvalget tilbakestilles ved neste besøk.",
            en: "simply means your language choice will reset on your next visit.",
            sv: "innebär bara att ditt språkval återställs vid nästa besök.",
            de: "bedeutet lediglich, dass Ihre Sprachauswahl bei Ihrem nächsten Besuch zurückgesetzt wird.",
            pl: "oznacza jedynie, że wybór języka zostanie zresetowany podczas kolejnej wizyty.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Samtykke", en: "Consent", sv: "Samtycke", de: "Einwilligung", pl: "Zgoda" })}>
        <p>
          {tr(lang, {
            no: "Fordi vi kun bruker strengt nødvendige cookies og preferansecookies du selv setter (ved å bytte språk eller logge inn), kreves det ikke aktivt cookie-samtykke etter ePrivacy-direktivet. Vi har likevel forberedt teknisk støtte for en samtykkebanner dersom vi senere skulle introdusere valgfrie cookies.",
            en: "Because we only use strictly necessary cookies and preference cookies you set yourself (by switching language or logging in), active cookie consent is not required under the ePrivacy Directive. We've nonetheless built in technical support for a consent banner in case we introduce optional cookies later.",
            sv: "Eftersom vi endast använder strikt nödvändiga kakor och preferenskakor som du själv ställer in (genom att byta språk eller logga in) krävs inget aktivt kaksamtycke enligt ePrivacy-direktivet. Vi har ändå förberett teknisk support för en samtyckesbanner om vi senare skulle införa valfria kakor.",
            de: "Da wir ausschließlich unbedingt erforderliche Cookies und Präferenz-Cookies verwenden, die Sie selbst setzen (durch Sprachwechsel oder Anmeldung), ist gemäß der ePrivacy-Richtlinie keine aktive Cookie-Einwilligung erforderlich. Wir haben dennoch die technische Grundlage für ein Einwilligungsbanner geschaffen, falls wir später optionale Cookies einführen sollten.",
            pl: "Ponieważ używamy wyłącznie niezbędnych plików cookie oraz plików cookie preferencji ustawianych samodzielnie przez użytkownika (poprzez zmianę języka lub logowanie), zgodnie z dyrektywą ePrivacy aktywna zgoda na cookie nie jest wymagana. Mimo to przygotowaliśmy techniczne wsparcie dla banera zgody na wypadek wprowadzenia w przyszłości opcjonalnych plików cookie.",
          })}
        </p>
      </Section>
    </LegalPage>
  );
}
