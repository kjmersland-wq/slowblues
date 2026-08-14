import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/accessibility")({
  component: AccessibilityPage,
  head: () => ({ meta: [
    { title: "Accessibility Statement — SlowBlues" },
    { name: "description", content: "Tilgjengelighetserklæring for slow-blues.com — WCAG 2.1 AA, kjente begrensninger og hvordan du melder fra om problemer." },
    { property: "og:title", content: "Accessibility Statement — SlowBlues" },
    { property: "og:description", content: "WCAG-tilgjengelighet på SlowBlues.no." },
  ]}),
});

function AccessibilityPage() {
  const { lang } = useI18n();
  return (
    <LegalPage
      eyebrow={tr(lang, { no: "Tilgjengelighet", en: "Accessibility", sv: "Tillgänglighet", de: "Barrierefreiheit", pl: "Dostępność" })}
      title="Accessibility Statement"
      lead={tr(lang, {
        no: "SlowBlues.no skal være lett å bruke for alle — uansett hjelpemidler eller funksjonsevne.",
        en: "SlowBlues.com should be easy to use for everyone — regardless of assistive technology or ability.",
        sv: "SlowBlues.com ska vara lätt att använda för alla — oavsett hjälpmedel eller funktionsförmåga.",
        de: "SlowBlues.com soll für alle leicht nutzbar sein — unabhängig von Hilfsmitteln oder Fähigkeiten.",
        pl: "SlowBlues.com powinien być łatwy w obsłudze dla wszystkich — niezależnie od technologii wspomagających czy sprawności.",
      })}
      updated={tr(lang, { no: "Mai 2026", en: "May 2026", sv: "Maj 2026", de: "Mai 2026", pl: "Maj 2026" })}
    >
      <Section heading={tr(lang, { no: "Vår forpliktelse", en: "Our commitment", sv: "Vårt åtagande", de: "Unsere Verpflichtung", pl: "Nasze zobowiązanie" })}>
        <p>
          {tr(lang, {
            no: "Vi jobber for at slow-blues.com skal være i samsvar med",
            en: "We work to ensure slow-blues.com complies with",
            sv: "Vi arbetar för att slow-blues.com ska uppfylla",
            de: "Wir arbeiten daran, dass slow-blues.com den Anforderungen von",
            pl: "Pracujemy nad tym, by slow-blues.com spełniał wymogi",
          })}{" "}
          <strong>WCAG 2.1 {tr(lang, { no: "nivå AA", en: "Level AA", sv: "nivå AA", de: "Stufe AA", pl: "poziomu AA" })}</strong>{" "}
          {tr(lang, {
            no: "og kravene i forskrift om universell utforming av IKT-løsninger (UU-forskriften).",
            en: "and the requirements of Norway's regulation on universal design of ICT solutions (the UU regulation).",
            sv: "och kraven i den norska förordningen om universell utformning av IKT-lösningar (UU-forskriften).",
            de: "und den Anforderungen der norwegischen Verordnung zur universellen Gestaltung von IKT-Lösungen (UU-forskriften) entspricht.",
            pl: "oraz wymogów norweskiego rozporządzenia o uniwersalnym projektowaniu rozwiązań ICT (UU-forskriften).",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Hva vi har gjort", en: "What we've done", sv: "Vad vi har gjort", de: "Was wir getan haben", pl: "Co zrobiliśmy" })}>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{tr(lang, {
            no: <>Semantisk HTML, korrekt overskriftsstruktur og landemerker (<code>main</code>, <code>nav</code>, <code>footer</code>).</>,
            en: <>Semantic HTML, correct heading structure and landmarks (<code>main</code>, <code>nav</code>, <code>footer</code>).</>,
            sv: <>Semantisk HTML, korrekt rubrikstruktur och landmärken (<code>main</code>, <code>nav</code>, <code>footer</code>).</>,
            de: <>Semantisches HTML, korrekte Überschriftenstruktur und Landmarken (<code>main</code>, <code>nav</code>, <code>footer</code>).</>,
            pl: <>Semantyczny HTML, prawidłowa struktura nagłówków i punkty orientacyjne (<code>main</code>, <code>nav</code>, <code>footer</code>).</>,
          } as any)}</li>
          <li>{tr(lang, {
            no: "Tilstrekkelig fargekontrast i mørkt premium-tema.",
            en: "Sufficient color contrast in the dark premium theme.",
            sv: "Tillräcklig färgkontrast i det mörka premiumtemat.",
            de: "Ausreichender Farbkontrast im dunklen Premium-Theme.",
            pl: "Wystarczający kontrast kolorów w ciemnym motywie premium.",
          })}</li>
          <li>{tr(lang, {
            no: "Tastaturnavigasjon med synlig fokusring på alle interaktive elementer.",
            en: "Keyboard navigation with a visible focus ring on all interactive elements.",
            sv: "Tangentbordsnavigering med synlig fokusring på alla interaktiva element.",
            de: "Tastaturnavigation mit sichtbarem Fokusring auf allen interaktiven Elementen.",
            pl: "Nawigacja klawiaturą z widocznym pierścieniem fokusu na wszystkich elementach interaktywnych.",
          })}</li>
          <li>{tr(lang, {
            no: "Alt-tekst på meningsbærende bilder; dekorative bilder er merket som sådan.",
            en: "Alt text on meaningful images; decorative images are marked as such.",
            sv: "Alt-text på meningsbärande bilder; dekorativa bilder är märkta som sådana.",
            de: "Alt-Text bei bedeutungstragenden Bildern; dekorative Bilder sind entsprechend gekennzeichnet.",
            pl: "Tekst alternatywny przy istotnych obrazach; obrazy dekoracyjne są odpowiednio oznaczone.",
          })}</li>
          <li>{tr(lang, {
            no: <>Skjemaer med tydelige etiketter og feilmeldinger med <code>role="alert"</code>.</>,
            en: <>Forms with clear labels and error messages using <code>role="alert"</code>.</>,
            sv: <>Formulär med tydliga etiketter och felmeddelanden med <code>role="alert"</code>.</>,
            de: <>Formulare mit klaren Beschriftungen und Fehlermeldungen mit <code>role="alert"</code>.</>,
            pl: <>Formularze z czytelnymi etykietami i komunikatami błędów z <code>role="alert"</code>.</>,
          } as any)}</li>
          <li>{tr(lang, {
            no: "Responsivt design fra 320 px og oppover, med fleksibel typografi.",
            en: "Responsive design from 320px upward, with flexible typography.",
            sv: "Responsiv design från 320 px och uppåt, med flexibel typografi.",
            de: "Responsives Design ab 320 px aufwärts, mit flexibler Typografie.",
            pl: "Responsywny design od 320 px wzwyż, z elastyczną typografią.",
          })}</li>
          <li>{tr(lang, {
            no: "Språkattributt settes dynamisk når du bytter mellom norsk, engelsk, svensk, tysk og polsk.",
            en: "The language attribute is set dynamically when you switch between Norwegian, English, Swedish, German and Polish.",
            sv: "Språkattributet ställs in dynamiskt när du byter mellan norska, engelska, svenska, tyska och polska.",
            de: "Das Sprachattribut wird dynamisch gesetzt, wenn Sie zwischen Norwegisch, Englisch, Schwedisch, Deutsch und Polnisch wechseln.",
            pl: "Atrybut języka jest ustawiany dynamicznie przy przełączaniu między norweskim, angielskim, szwedzkim, niemieckim i polskim.",
          })}</li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "Kjente begrensninger", en: "Known limitations", sv: "Kända begränsningar", de: "Bekannte Einschränkungen", pl: "Znane ograniczenia" })}>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>{tr(lang, {
            no: "Enkelte historiske bilder mangler detaljert alt-tekst — vi forbedrer dette løpende.",
            en: "Some historical images lack detailed alt text — we're improving this on an ongoing basis.",
            sv: "Vissa historiska bilder saknar detaljerad alt-text — vi förbättrar detta löpande.",
            de: "Einigen historischen Bildern fehlt ausführlicher Alt-Text — wir verbessern dies fortlaufend.",
            pl: "Niektórym historycznym obrazom brakuje szczegółowego tekstu alternatywnego — stale to poprawiamy.",
          })}</li>
          <li>{tr(lang, {
            no: "Innebygde YouTube-spillere arver tilgjengelighet fra YouTube selv.",
            en: "Embedded YouTube players inherit accessibility from YouTube itself.",
            sv: "Inbäddade YouTube-spelare ärver tillgänglighet från YouTube själv.",
            de: "Eingebettete YouTube-Player übernehmen die Barrierefreiheit von YouTube selbst.",
            pl: "Osadzone odtwarzacze YouTube dziedziczą dostępność bezpośrednio z YouTube.",
          })}</li>
          <li>{tr(lang, {
            no: "Tredjepartsbiblioteker (kart, embeds) kan i sjeldne tilfeller ha mindre avvik.",
            en: "Third-party libraries (maps, embeds) may occasionally have minor deviations.",
            sv: "Tredjepartsbibliotek (kartor, embeds) kan i sällsynta fall ha mindre avvikelser.",
            de: "Bibliotheken von Drittanbietern (Karten, Einbettungen) können in seltenen Fällen geringfügige Abweichungen aufweisen.",
            pl: "Biblioteki firm trzecich (mapy, osadzenia) mogą w rzadkich przypadkach mieć drobne odstępstwa.",
          })}</li>
        </ul>
      </Section>

      <Section heading={tr(lang, { no: "Meld fra om problemer", en: "Report a problem", sv: "Rapportera ett problem", de: "Problem melden", pl: "Zgłoś problem" })}>
        <p>
          {tr(lang, {
            no: "Opplever du barrierer? Vi vil gjerne høre fra deg. Bruk kontaktskjemaet og beskriv problemet, gjerne med URL og hvilket hjelpemiddel du bruker. Vi besvarer henvendelser innen 14 dager.",
            en: "Running into barriers? We'd love to hear from you. Use the contact form and describe the problem, ideally with the URL and which assistive technology you're using. We respond within 14 days.",
            sv: "Stöter du på hinder? Vi hör gärna från dig. Använd kontaktformuläret och beskriv problemet, gärna med URL och vilket hjälpmedel du använder. Vi svarar inom 14 dagar.",
            de: "Stoßen Sie auf Barrieren? Wir hören gerne von Ihnen. Nutzen Sie das Kontaktformular und beschreiben Sie das Problem, idealerweise mit URL und verwendetem Hilfsmittel. Wir antworten innerhalb von 14 Tagen.",
            pl: "Napotykasz na bariery? Chętnie się dowiemy. Skorzystaj z formularza kontaktowego i opisz problem, najlepiej podając adres URL i używaną technologię wspomagającą. Odpowiadamy w ciągu 14 dni.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Tilsynsmyndighet", en: "Supervisory authority", sv: "Tillsynsmyndighet", de: "Aufsichtsbehörde", pl: "Organ nadzorczy" })}>
        <p>
          {tr(lang, {
            no: "I Norge fører",
            en: "In Norway,",
            sv: "I Norge utövar",
            de: "In Norwegen führt",
            pl: "W Norwegii",
          })}{" "}
          <a href="https://www.uutilsynet.no" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            {tr(lang, {
              no: "Tilsynet for universell utforming av IKT",
              en: "the Norwegian Supervisory Authority for Universal Design of ICT",
              sv: "den norska tillsynsmyndigheten för universell utformning av IKT",
              de: "die norwegische Aufsichtsbehörde für universelle Gestaltung von IKT",
              pl: "norweski organ nadzoru nad uniwersalnym projektowaniem ICT",
            })}
          </a>{" "}
          {tr(lang, {
            no: "tilsyn med regelverket. Du kan klage dit hvis du ikke er fornøyd med vår oppfølging.",
            en: "supervises this regulation. You can file a complaint there if you're not satisfied with our follow-up.",
            sv: "utövar tillsyn över regelverket. Du kan klaga dit om du inte är nöjd med vår uppföljning.",
            de: "die Aufsicht über diese Vorschrift. Sie können sich dort beschweren, wenn Sie mit unserer Reaktion nicht zufrieden sind.",
            pl: "nadzoruje przestrzeganie tych przepisów. Możesz tam złożyć skargę, jeśli nie jesteś zadowolony z naszej reakcji.",
          })}
        </p>
      </Section>
    </LegalPage>
  );
}
