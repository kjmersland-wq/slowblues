import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";
import { useI18n, tr } from "@/i18n";

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
  const { lang } = useI18n();
  return (
    <LegalPage
      eyebrow="GDPR"
      title="GDPR & Data Protection"
      lead={tr(lang, {
        no: "Hvordan vi behandler personopplysninger i tråd med EU-forordning 2016/679 (GDPR) og norsk personopplysningslov.",
        en: "How we process personal data in accordance with EU Regulation 2016/679 (GDPR) and Norwegian data protection law.",
        sv: "Hur vi behandlar personuppgifter i enlighet med EU-förordning 2016/679 (GDPR) och norsk personuppgiftslag.",
        de: "Wie wir personenbezogene Daten gemäß der EU-Verordnung 2016/679 (DSGVO) und dem norwegischen Datenschutzgesetz verarbeiten.",
        pl: "Jak przetwarzamy dane osobowe zgodnie z rozporządzeniem UE 2016/679 (RODO) i norweską ustawą o ochronie danych osobowych.",
      })}
      updated={tr(lang, { no: "Mai 2026", en: "May 2026", sv: "Maj 2026", de: "Mai 2026", pl: "Maj 2026" })}
    >
      <Section heading={tr(lang, { no: "Behandlingsansvarlig", en: "Data controller", sv: "Personuppgiftsansvarig", de: "Verantwortlicher", pl: "Administrator danych" })}>
        <p>
          {tr(lang, {
            no: "Behandlingsansvarlig for opplysninger samlet inn på slow-blues.com er",
            en: "The data controller for information collected on slow-blues.com is",
            sv: "Personuppgiftsansvarig för information som samlas in på slow-blues.com är",
            de: "Verantwortlicher für die auf slow-blues.com gesammelten Daten ist",
            pl: "Administratorem danych zbieranych na slow-blues.com jest",
          })}
          <strong> KM TECH LABS — Kjell Mersland</strong>, {tr(lang, { no: "org.nr.", en: "reg. no.", sv: "org.nr.", de: "Handelsreg.-Nr.", pl: "nr rej." })} 934 044 029, {tr(lang, { no: "Norge", en: "Norway", sv: "Norge", de: "Norwegen", pl: "Norwegia" })}.{" "}
          {tr(lang, {
            no: "Ansvarlig redaktør og kontaktperson for personvernspørsmål er Kjell Mersland.",
            en: "The editor in charge and contact person for privacy matters is Kjell Mersland.",
            sv: "Ansvarig utgivare och kontaktperson för integritetsfrågor är Kjell Mersland.",
            de: "Verantwortlicher Redakteur und Ansprechpartner für Datenschutzfragen ist Kjell Mersland.",
            pl: "Redaktorem odpowiedzialnym i osobą kontaktową w kwestiach ochrony danych jest Kjell Mersland.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Hvilke opplysninger vi samler inn", en: "What information we collect", sv: "Vilken information vi samlar in", de: "Welche Daten wir sammeln", pl: "Jakie dane zbieramy" })}>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>{tr(lang, { no: "Kontaktskjema", en: "Contact form", sv: "Kontaktformulär", de: "Kontaktformular", pl: "Formularz kontaktowy" })}:</strong>{" "}
            {tr(lang, {
              no: "navn, e-postadresse og meldingsinnhold du sender oss.",
              en: "name, email address and the message content you send us.",
              sv: "namn, e-postadress och meddelandeinnehåll du skickar till oss.",
              de: "Name, E-Mail-Adresse und Inhalt der Nachricht, die Sie uns senden.",
              pl: "imię, adres e-mail i treść wiadomości, którą do nas wysyłasz.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Nyhetsbrev", en: "Newsletter", sv: "Nyhetsbrev", de: "Newsletter", pl: "Newsletter" })}:</strong>{" "}
            {tr(lang, {
              no: "e-postadressen din, og hvilke kategorier du har valgt.",
              en: "your email address, and which categories you've selected.",
              sv: "din e-postadress och vilka kategorier du har valt.",
              de: "Ihre E-Mail-Adresse und die von Ihnen gewählten Kategorien.",
              pl: "Twój adres e-mail oraz wybrane przez Ciebie kategorie.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Gjestebok", en: "Guestbook", sv: "Gästbok", de: "Gästebuch", pl: "Księga gości" })}:</strong>{" "}
            {tr(lang, {
              no: "navn og melding du selv velger å publisere.",
              en: "name and message you choose to publish.",
              sv: "namn och meddelande du själv väljer att publicera.",
              de: "Name und Nachricht, die Sie selbst veröffentlichen möchten.",
              pl: "imię i wiadomość, którą samodzielnie zdecydujesz się opublikować.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Tekniske data", en: "Technical data", sv: "Teknisk data", de: "Technische Daten", pl: "Dane techniczne" })}:</strong>{" "}
            {tr(lang, {
              no: "IP-adresse og anonymisert besøksstatistikk for sikkerhet og drift.",
              en: "IP address and anonymized visit statistics for security and operations.",
              sv: "IP-adress och anonymiserad besöksstatistik för säkerhet och drift.",
              de: "IP-Adresse und anonymisierte Besuchsstatistiken für Sicherheit und Betrieb.",
              pl: "Adres IP i zanonimizowane statystyki odwiedzin na potrzeby bezpieczeństwa i działania serwisu.",
            })}
          </li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "Behandlingsgrunnlag og formål", en: "Legal basis and purpose", sv: "Rättslig grund och syfte", de: "Rechtsgrundlage und Zweck", pl: "Podstawa prawna i cel" })}>
        <p>
          {tr(lang, {
            no: "Vi behandler personopplysninger på følgende grunnlag (jf. GDPR art. 6):",
            en: "We process personal data on the following legal bases (cf. GDPR Art. 6):",
            sv: "Vi behandlar personuppgifter på följande rättsliga grunder (jfr GDPR artikel 6):",
            de: "Wir verarbeiten personenbezogene Daten auf folgenden Rechtsgrundlagen (vgl. DSGVO Art. 6):",
            pl: "Przetwarzamy dane osobowe na następujących podstawach prawnych (por. art. 6 RODO):",
          })}
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>{tr(lang, { no: "Samtykke", en: "Consent", sv: "Samtycke", de: "Einwilligung", pl: "Zgoda" })}</strong> (art. 6(1)(a)) —{" "}
            {tr(lang, {
              no: "for nyhetsbrev og gjestebok.",
              en: "for newsletter and guestbook.",
              sv: "för nyhetsbrev och gästbok.",
              de: "für Newsletter und Gästebuch.",
              pl: "dla newslettera i księgi gości.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Berettiget interesse", en: "Legitimate interest", sv: "Berättigat intresse", de: "Berechtigtes Interesse", pl: "Uzasadniony interes" })}</strong> (art. 6(1)(f)) —{" "}
            {tr(lang, {
              no: "for å besvare henvendelser via kontaktskjema og opprettholde sikker drift.",
              en: "to respond to inquiries via the contact form and maintain secure operations.",
              sv: "för att besvara förfrågningar via kontaktformuläret och upprätthålla säker drift.",
              de: "um Anfragen über das Kontaktformular zu beantworten und einen sicheren Betrieb zu gewährleisten.",
              pl: "by odpowiadać na zapytania przesłane przez formularz kontaktowy i zapewniać bezpieczne działanie serwisu.",
            })}
          </li>
          <li>
            <strong>{tr(lang, { no: "Rettslig forpliktelse", en: "Legal obligation", sv: "Rättslig förpliktelse", de: "Rechtliche Verpflichtung", pl: "Obowiązek prawny" })}</strong> (art. 6(1)(c)) —{" "}
            {tr(lang, {
              no: "for bokførings- og loggkrav.",
              en: "for bookkeeping and logging requirements.",
              sv: "för bokförings- och loggkrav.",
              de: "für Buchführungs- und Protokollierungspflichten.",
              pl: "na potrzeby wymogów księgowych i rejestrowania.",
            })}
          </li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "Lagringstid", en: "Retention period", sv: "Lagringstid", de: "Speicherdauer", pl: "Okres przechowywania" })}>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{tr(lang, {
            no: "Kontaktmeldinger: slettes senest 12 måneder etter siste korrespondanse.",
            en: "Contact messages: deleted no later than 12 months after the last correspondence.",
            sv: "Kontaktmeddelanden: raderas senast 12 månader efter senaste korrespondensen.",
            de: "Kontaktnachrichten: werden spätestens 12 Monate nach der letzten Korrespondenz gelöscht.",
            pl: "Wiadomości kontaktowe: usuwane najpóźniej 12 miesięcy po ostatniej korespondencji.",
          })}</li>
          <li>{tr(lang, {
            no: "Nyhetsbrev: lagres til du melder deg av.",
            en: "Newsletter: stored until you unsubscribe.",
            sv: "Nyhetsbrev: lagras tills du avregistrerar dig.",
            de: "Newsletter: wird gespeichert, bis Sie sich abmelden.",
            pl: "Newsletter: przechowywany do momentu rezygnacji z subskrypcji.",
          })}</li>
          <li>{tr(lang, {
            no: "Gjestebok: lagres så lenge innlegget er publisert (du kan be om sletting).",
            en: "Guestbook: stored as long as the post is published (you can request deletion).",
            sv: "Gästbok: lagras så länge inlägget är publicerat (du kan begära radering).",
            de: "Gästebuch: wird gespeichert, solange der Beitrag veröffentlicht ist (Sie können die Löschung beantragen).",
            pl: "Księga gości: przechowywana tak długo, jak wpis jest opublikowany (możesz poprosić o usunięcie).",
          })}</li>
          <li>{tr(lang, {
            no: "Sikkerhetslogger: maks 90 dager.",
            en: "Security logs: max 90 days.",
            sv: "Säkerhetsloggar: max 90 dagar.",
            de: "Sicherheitsprotokolle: max. 90 Tage.",
            pl: "Dzienniki bezpieczeństwa: maksymalnie 90 dni.",
          })}</li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "Dine rettigheter", en: "Your rights", sv: "Dina rättigheter", de: "Ihre Rechte", pl: "Twoje prawa" })}>
        <p>{tr(lang, {
          no: "Du har til enhver tid rett til:",
          en: "You have the right, at any time, to:",
          sv: "Du har alltid rätt att:",
          de: "Sie haben jederzeit das Recht auf:",
          pl: "Zawsze przysługuje Ci prawo do:",
        })}</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{tr(lang, {
            no: "Innsyn i hvilke opplysninger vi har om deg.",
            en: "Access to what information we hold about you.",
            sv: "Insyn i vilken information vi har om dig.",
            de: "Auskunft darüber, welche Daten wir über Sie gespeichert haben.",
            pl: "Wglądu w informacje, które o Tobie przechowujemy.",
          })}</li>
          <li>{tr(lang, {
            no: "Retting av feilaktige opplysninger.",
            en: "Correction of inaccurate information.",
            sv: "Rättelse av felaktig information.",
            de: "Berichtigung fehlerhafter Daten.",
            pl: "Sprostowania nieprawidłowych danych.",
          })}</li>
          <li>{tr(lang, {
            no: "Sletting («retten til å bli glemt»).",
            en: "Erasure (\"the right to be forgotten\").",
            sv: "Radering (\"rätten att bli glömd\").",
            de: "Löschung (\"Recht auf Vergessenwerden\").",
            pl: "Usunięcia (\"prawo do bycia zapomnianym\").",
          })}</li>
          <li>{tr(lang, {
            no: "Dataportabilitet — utlevering i maskinlesbart format.",
            en: "Data portability — provision in machine-readable format.",
            sv: "Dataportabilitet — utlämnande i maskinläsbart format.",
            de: "Datenübertragbarkeit — Bereitstellung in maschinenlesbarem Format.",
            pl: "Przenoszenia danych — wydania w formacie nadającym się do odczytu maszynowego.",
          })}</li>
          <li>{tr(lang, {
            no: "Å trekke samtykke tilbake.",
            en: "Withdraw consent.",
            sv: "Att återkalla samtycke.",
            de: "Widerruf der Einwilligung.",
            pl: "Wycofania zgody.",
          })}</li>
          <li>
            {tr(lang, {
              no: "Å klage til Datatilsynet",
              en: "File a complaint with the Norwegian Data Protection Authority (Datatilsynet)",
              sv: "Att klaga till Datatilsynet (den norska tillsynsmyndigheten)",
              de: "Beschwerde bei der norwegischen Datenschutzbehörde (Datatilsynet)",
              pl: "Złożenia skargi do norweskiego organu ochrony danych (Datatilsynet)",
            })} (<a href="https://www.datatilsynet.no" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">datatilsynet.no</a>).
          </li>
        </ul>
        <p>
          {tr(lang, {
            no: "Henvendelser om dine rettigheter sendes via vårt kontaktskjema. Vi besvarer innen 30 dager.",
            en: "Requests regarding your rights are sent via our contact form. We respond within 30 days.",
            sv: "Förfrågningar om dina rättigheter skickas via vårt kontaktformulär. Vi svarar inom 30 dagar.",
            de: "Anfragen zu Ihren Rechten senden Sie bitte über unser Kontaktformular. Wir antworten innerhalb von 30 Tagen.",
            pl: "Zapytania dotyczące Twoich praw prosimy przesyłać przez nasz formularz kontaktowy. Odpowiadamy w ciągu 30 dni.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Databehandlere", en: "Data processors", sv: "Personuppgiftsbiträden", de: "Auftragsverarbeiter", pl: "Podmioty przetwarzające dane" })}>
        <p>
          {tr(lang, {
            no: "Vi benytter følgende databehandlere, alle med databehandleravtale (DPA) og GDPR-egnet behandling:",
            en: "We use the following data processors, all with a data processing agreement (DPA) and GDPR-compliant processing:",
            sv: "Vi använder följande personuppgiftsbiträden, alla med personuppgiftsbiträdesavtal (DPA) och GDPR-anpassad behandling:",
            de: "Wir nutzen folgende Auftragsverarbeiter, alle mit Auftragsverarbeitungsvertrag (AVV) und DSGVO-konformer Verarbeitung:",
            pl: "Korzystamy z następujących podmiotów przetwarzających dane, wszystkie na podstawie umowy powierzenia przetwarzania danych (DPA) i zgodnie z RODO:",
          })}
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Cloudflare</strong> — {tr(lang, { no: "hosting, database (D1) og sikkerhet.", en: "hosting, database (D1) and security.", sv: "hosting, databas (D1) och säkerhet.", de: "Hosting, Datenbank (D1) und Sicherheit.", pl: "hosting, baza danych (D1) i bezpieczeństwo." })}</li>
          <li><strong>MailerLite</strong> — {tr(lang, { no: "utsendelse av nyhetsbrev.", en: "newsletter delivery.", sv: "utskick av nyhetsbrev.", de: "Newsletter-Versand.", pl: "wysyłka newslettera." })}</li>
        </ul>
        <p>
          {tr(lang, {
            no: "Vi overfører ikke personopplysninger til tredjeland uten gyldig overføringsgrunnlag (SCC eller adekvansbeslutning).",
            en: "We do not transfer personal data to third countries without a valid transfer basis (SCCs or an adequacy decision).",
            sv: "Vi överför inte personuppgifter till tredje land utan giltig överföringsgrund (SCC eller adekvansbeslut).",
            de: "Wir übermitteln personenbezogene Daten nicht an Drittländer ohne gültige Übermittlungsgrundlage (Standardvertragsklauseln oder Angemessenheitsbeschluss).",
            pl: "Nie przekazujemy danych osobowych do krajów trzecich bez ważnej podstawy przekazania (SCC lub decyzji o odpowiednim poziomie ochrony).",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Sikkerhet", en: "Security", sv: "Säkerhet", de: "Sicherheit", pl: "Bezpieczeństwo" })}>
        <p>
          {tr(lang, {
            no: "Alle data overføres kryptert via HTTPS/TLS. Tilgang til databasen er rollebasert og logges. Ved et eventuelt sikkerhetsbrudd som påvirker dine rettigheter, varsler vi Datatilsynet og berørte brukere uten ugrunnet opphold (innen 72 timer).",
            en: "All data is transmitted encrypted via HTTPS/TLS. Access to the database is role-based and logged. In the event of a security breach affecting your rights, we notify the Data Protection Authority and affected users without undue delay (within 72 hours).",
            sv: "All data överförs krypterad via HTTPS/TLS. Åtkomst till databasen är rollbaserad och loggas. Vid ett eventuellt säkerhetsbrott som påverkar dina rättigheter meddelar vi Datatilsynet och berörda användare utan onödigt dröjsmål (inom 72 timmar).",
            de: "Alle Daten werden verschlüsselt über HTTPS/TLS übertragen. Der Zugriff auf die Datenbank ist rollenbasiert und wird protokolliert. Im Falle einer Sicherheitsverletzung, die Ihre Rechte beeinträchtigt, informieren wir die Datenschutzbehörde und betroffene Nutzer unverzüglich (innerhalb von 72 Stunden).",
            pl: "Wszystkie dane są przesyłane w formie zaszyfrowanej przez HTTPS/TLS. Dostęp do bazy danych jest oparty na rolach i rejestrowany. W przypadku naruszenia bezpieczeństwa wpływającego na Twoje prawa powiadomimy Datatilsynet oraz dotkniętych użytkowników bez zbędnej zwłoki (w ciągu 72 godzin).",
          })}
        </p>
      </Section>
    </LegalPage>
  );
}
