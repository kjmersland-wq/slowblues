import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({ meta: [
    { title: "Disclaimer — SlowBlues" },
    { name: "description", content: "Ansvarsfraskrivelse for innhold, eksterne lenker, bilder og kommersielle anbefalinger på slow-blues.com." },
    { property: "og:title", content: "Disclaimer — SlowBlues" },
    { property: "og:description", content: "Ansvarsfraskrivelse for slow-blues.com." },
  ]}),
});

function DisclaimerPage() {
  const { lang } = useI18n();
  return (
    <LegalPage
      eyebrow={tr(lang, { no: "Ansvar", en: "Liability", sv: "Ansvar", de: "Haftung", pl: "Odpowiedzialność" })}
      title="Disclaimer"
      lead={tr(lang, {
        no: "Hva vi står inne for — og hva vi ikke kan garantere.",
        en: "What we stand behind — and what we can't guarantee.",
        sv: "Vad vi står bakom — och vad vi inte kan garantera.",
        de: "Wofür wir einstehen — und was wir nicht garantieren können.",
        pl: "Za czym stoimy — i czego nie możemy zagwarantować.",
      })}
      updated={tr(lang, { no: "Mai 2026", en: "May 2026", sv: "Maj 2026", de: "Mai 2026", pl: "Maj 2026" })}
    >
      <Section heading={tr(lang, { no: "Generelt om innholdet", en: "About the content", sv: "Allmänt om innehållet", de: "Allgemeines zum Inhalt", pl: "Ogólnie o treści" })}>
        <p>
          {tr(lang, {
            no: "Innholdet på slow-blues.com er ment som redaksjonell og kulturhistorisk informasjon. Selv om vi tilstreber høy presisjon og faktasjekk, kan det forekomme feil eller utdaterte opplysninger. Oppdager du noe — bruk kontaktskjemaet, så retter vi.",
            en: "The content on slow-blues.com is intended as editorial and cultural-historical information. While we strive for high accuracy and fact-checking, errors or outdated information may occur. If you spot something, use the contact form and we'll correct it.",
            sv: "Innehållet på slow-blues.com är avsett som redaktionell och kulturhistorisk information. Även om vi strävar efter hög precision och faktakontroll kan fel eller föråldrad information förekomma. Upptäcker du något — använd kontaktformuläret, så rättar vi det.",
            de: "Die Inhalte auf slow-blues.com sind als redaktionelle und kulturhistorische Informationen gedacht. Obwohl wir uns um hohe Genauigkeit und Faktenprüfung bemühen, können Fehler oder veraltete Angaben vorkommen. Entdecken Sie etwas — nutzen Sie das Kontaktformular, dann korrigieren wir es.",
            pl: "Treści na slow-blues.com mają charakter redakcyjny i kulturowo-historyczny. Choć dążymy do wysokiej precyzji i weryfikacji faktów, mogą wystąpić błędy lub nieaktualne informacje. Jeśli coś zauważysz — skorzystaj z formularza kontaktowego, a poprawimy to.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Ingen profesjonell rådgivning", en: "No professional advice", sv: "Ingen professionell rådgivning", de: "Keine professionelle Beratung", pl: "Brak profesjonalnego doradztwa" })}>
        <p>
          {tr(lang, {
            no: "Anmeldelser, intervjuer og artikler er redaksjonelle ytringer og må ikke tolkes som juridisk, medisinsk, økonomisk eller annen profesjonell rådgivning.",
            en: "Reviews, interviews and articles are editorial expressions and must not be interpreted as legal, medical, financial or other professional advice.",
            sv: "Recensioner, intervjuer och artiklar är redaktionella yttranden och ska inte tolkas som juridisk, medicinsk, ekonomisk eller annan professionell rådgivning.",
            de: "Rezensionen, Interviews und Artikel sind redaktionelle Meinungsäußerungen und dürfen nicht als rechtliche, medizinische, finanzielle oder sonstige professionelle Beratung ausgelegt werden.",
            pl: "Recenzje, wywiady i artykuły są wypowiedziami redakcyjnymi i nie należy ich interpretować jako porady prawnej, medycznej, finansowej ani innej porady profesjonalnej.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Eksterne lenker", en: "External links", sv: "Externa länkar", de: "Externe Links", pl: "Linki zewnętrzne" })}>
        <p>
          {tr(lang, {
            no: "Vi lenker til mange eksterne kilder (Wikipedia, artisters egne sider, YouTube, festivaler m.fl.). Vi har ingen redaksjonell kontroll over disse, og er ikke ansvarlige for deres innhold, tilgjengelighet eller personvernpraksis. Døde lenker meldes inn via kontaktskjemaet.",
            en: "We link to many external sources (Wikipedia, artists' own sites, YouTube, festivals and more). We have no editorial control over these, and are not responsible for their content, availability or privacy practices. Dead links can be reported via the contact form.",
            sv: "Vi länkar till många externa källor (Wikipedia, artisters egna webbplatser, YouTube, festivaler med flera). Vi har ingen redaktionell kontroll över dessa och ansvarar inte för deras innehåll, tillgänglighet eller integritetspraxis. Döda länkar anmäls via kontaktformuläret.",
            de: "Wir verlinken auf viele externe Quellen (Wikipedia, eigene Websites von Künstlern, YouTube, Festivals und mehr). Wir haben keine redaktionelle Kontrolle über diese und sind nicht verantwortlich für deren Inhalte, Verfügbarkeit oder Datenschutzpraktiken. Defekte Links können über das Kontaktformular gemeldet werden.",
            pl: "Zamieszczamy linki do wielu zewnętrznych źródeł (Wikipedia, oficjalne strony artystów, YouTube, festiwale i inne). Nie mamy nad nimi kontroli redakcyjnej i nie odpowiadamy za ich treść, dostępność ani praktyki dotyczące prywatności. Nieaktywne linki można zgłaszać przez formularz kontaktowy.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Bilder og lyd", en: "Images and audio", sv: "Bilder och ljud", de: "Bilder und Audio", pl: "Obrazy i dźwięk" })}>
        <p>
          {tr(lang, {
            no: "Historiske bilder er hentet fra Library of Congress, Wikimedia Commons og lignende kilder under Public Domain eller Creative Commons. Moderne pressebilder brukes med tillatelse eller under sitatretten. Lydeksempler og YouTube-bygginger forblir den respektive rettighetshaverens eiendom.",
            en: "Historical images are sourced from the Library of Congress, Wikimedia Commons and similar sources under Public Domain or Creative Commons. Modern press photos are used with permission or under quotation rights. Audio samples and YouTube embeds remain the property of the respective rights holders.",
            sv: "Historiska bilder hämtas från Library of Congress, Wikimedia Commons och liknande källor under Public Domain eller Creative Commons. Moderna pressbilder används med tillstånd eller under citaträtten. Ljudexempel och YouTube-inbäddningar förblir respektive rättighetsinnehavares egendom.",
            de: "Historische Bilder stammen von der Library of Congress, Wikimedia Commons und ähnlichen Quellen im Rahmen von Public Domain oder Creative Commons. Moderne Pressefotos werden mit Genehmigung oder im Rahmen des Zitatrechts verwendet. Audiobeispiele und YouTube-Einbettungen bleiben Eigentum der jeweiligen Rechteinhaber.",
            pl: "Zdjęcia historyczne pochodzą z Library of Congress, Wikimedia Commons i podobnych źródeł w ramach domeny publicznej lub Creative Commons. Współczesne zdjęcia prasowe wykorzystywane są za zgodą lub w ramach prawa cytatu. Próbki dźwiękowe i osadzenia YouTube pozostają własnością odpowiednich posiadaczy praw.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "Tilknyttede lenker / merch", en: "Affiliate links / merch", sv: "Anknutna länkar / merch", de: "Partnerlinks / Merchandise", pl: "Linki partnerskie / gadżety" })}>
        <p>
          {tr(lang, {
            no: "Enkelte lenker (merch, billetter) kan være partnerlenker som genererer en liten provisjon. Det påvirker aldri redaksjonelt innhold eller anmeldelser, og det er ingen ekstra kostnad for deg.",
            en: "Some links (merch, tickets) may be affiliate links that generate a small commission. This never affects editorial content or reviews, and there's no extra cost to you.",
            sv: "Vissa länkar (merch, biljetter) kan vara partnerlänkar som genererar en liten provision. Det påverkar aldrig redaktionellt innehåll eller recensioner, och det innebär ingen extra kostnad för dig.",
            de: "Einige Links (Merchandise, Tickets) können Partnerlinks sein, die eine kleine Provision generieren. Dies beeinflusst niemals redaktionelle Inhalte oder Rezensionen, und es entstehen Ihnen keine zusätzlichen Kosten.",
            pl: "Niektóre linki (gadżety, bilety) mogą być linkami partnerskimi generującymi niewielką prowizję. Nigdy nie wpływa to na treści redakcyjne ani recenzje i nie wiąże się dla Ciebie z żadnymi dodatkowymi kosztami.",
          })}
        </p>
      </Section>

      <Section heading={tr(lang, { no: "AI-assistert redaksjon", en: "AI-assisted editing", sv: "AI-assisterad redaktion", de: "KI-unterstützte Redaktion", pl: "Redakcja wspomagana przez AI" })}>
        <p>
          {tr(lang, {
            no: "Deler av research, oversettelser og biografisammendrag kan være utarbeidet med hjelp av kunstig intelligens, alltid kontrollert og redigert av ansvarlig redaktør.",
            en: "Parts of research, translations and biography summaries may be prepared with the help of artificial intelligence, always checked and edited by the editor in charge.",
            sv: "Delar av research, översättningar och biografisammanfattningar kan vara framtagna med hjälp av artificiell intelligens, alltid kontrollerade och redigerade av ansvarig utgivare.",
            de: "Teile der Recherche, Übersetzungen und Biografiezusammenfassungen können mit Hilfe künstlicher Intelligenz erstellt werden, stets geprüft und redigiert vom verantwortlichen Redakteur.",
            pl: "Część badań, tłumaczeń i podsumowań biograficznych może zostać przygotowana z pomocą sztucznej inteligencji, zawsze sprawdzana i redagowana przez redaktora odpowiedzialnego.",
          })}
        </p>
      </Section>
    </LegalPage>
  );
}
