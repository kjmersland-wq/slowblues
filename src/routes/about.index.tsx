import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Building2, Mail, Globe, Headphones } from "lucide-react";
import { useI18n, tr } from "@/i18n";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Om SlowBlues — Norges blues-arkiv" },
      { name: "description", content: "SlowBlues.no er et redaksjonelt arkiv for blues — 330+ artistprofiler, anmeldelser og historikk. Utgitt av KM TECH LABS, redigert av Kjell Mersland." },
      { property: "og:title", content: "Om SlowBlues" },
      { property: "og:description", content: "Redaksjonelt blues-arkiv utgitt av KM TECH LABS — 330+ artistprofiler, anmeldelser og historikk." },
      { property: "og:url", content: "https://www.slow-blues.com/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.slow-blues.com/about" }],
  }),
});

function AboutPage() {
  const { lang } = useI18n();
  return (
    <PageShell>
      <PageHero
        eyebrow={tr(lang, { no: "Om oss", en: "About us", sv: "Om oss", de: "Über uns", pl: "O nas" })}
        title="About SlowBlues"
        lead={tr(lang, {
          no: "Et redaksjonelt arkiv som feirer bluesens langsomme, sjelfulle røtter — fra Mississippi-deltaet til dagens nordiske scene.",
          en: "An editorial archive celebrating the slow, soulful roots of the blues — from the Mississippi Delta to today's Nordic scene.",
          sv: "Ett redaktionellt arkiv som firar bluesens långsamma, själfulla rötter — från Mississippideltat till dagens nordiska scen.",
          de: "Ein redaktionelles Archiv, das die langsamen, seelenvollen Wurzeln des Blues feiert — vom Mississippi-Delta bis zur heutigen nordischen Szene.",
          pl: "Redakcyjne archiwum celebrujące powolne, pełne duszy korzenie bluesa — od delty Missisipi po dzisiejszą scenę nordycką.",
        })}
      />
      <section className="max-w-3xl mx-auto px-6 py-12 space-y-10 text-foreground/85 leading-relaxed">
        <div>
          <h2 className="font-display text-2xl text-gold mb-3">{tr(lang, { no: "Hva vi gjør", en: "What we do", sv: "Vad vi gör", de: "Was wir tun", pl: "Co robimy" })}</h2>
          <p>
            {tr(lang, {
              no: "SlowBlues.no dokumenterer blues som musikalsk og kulturell tradisjon. Vi har over 330 artistprofiler, ukentlig blogg, festivaloversikt, verdenskart, radio, og en stadig voksende samling med anmeldelser og historiske artikler. Innholdet er kuratert, kildebelagt og ikke-kommersielt i utgangspunktet — merch og donasjoner finansierer drift og hosting.",
              en: "SlowBlues.no documents the blues as a musical and cultural tradition. We have over 330 artist profiles, a weekly blog, a festival overview, a world map, radio, and a steadily growing collection of reviews and historical articles. The content is curated, sourced and non-commercial at its core — merch and donations fund operations and hosting.",
              sv: "SlowBlues.no dokumenterar blues som musikalisk och kulturell tradition. Vi har över 330 artistprofiler, veckovis blogg, festivalöversikt, världskarta, radio och en stadigt växande samling recensioner och historiska artiklar. Innehållet är kurerat, källbelagt och i grunden icke-kommersiellt — merch och donationer finansierar drift och hosting.",
              de: "SlowBlues.no dokumentiert den Blues als musikalische und kulturelle Tradition. Wir haben über 330 Künstlerprofile, einen wöchentlichen Blog, eine Festivalübersicht, eine Weltkarte, Radio und eine stetig wachsende Sammlung von Rezensionen und historischen Artikeln. Der Inhalt ist kuratiert, quellenbelegt und im Kern nicht kommerziell — Merch und Spenden finanzieren Betrieb und Hosting.",
              pl: "SlowBlues.no dokumentuje blues jako tradycję muzyczną i kulturową. Mamy ponad 330 profili artystów, cotygodniowego bloga, przegląd festiwali, mapę świata, radio oraz stale rosnącą kolekcję recenzji i artykułów historycznych. Treści są kuratorowane, oparte na źródłach i z założenia niekomercyjne — gadżety i darowizny finansują działanie i hosting.",
            })}
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-3">{tr(lang, { no: "Redaksjon og utgiver", en: "Editorial staff and publisher", sv: "Redaktion och utgivare", de: "Redaktion und Herausgeber", pl: "Redakcja i wydawca" })}</h2>
          <div className="grid sm:grid-cols-2 gap-4 not-italic">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="flex items-center gap-2 text-gold mb-1.5"><Building2 className="size-4" aria-hidden="true" /><span className="text-[10px] tracking-[0.25em] uppercase">{tr(lang, { no: "Utgiver", en: "Publisher", sv: "Utgivare", de: "Herausgeber", pl: "Wydawca" })}</span></div>
              <p className="font-medium">KM TECH LABS — Kjell Mersland</p>
              <p className="text-sm text-muted-foreground">{tr(lang, { no: "Org.nr. 934 044 029", en: "Reg. no. 934 044 029", sv: "Org.nr 934 044 029", de: "Handelsreg.-Nr. 934 044 029", pl: "Nr rej. 934 044 029" })}</p>
              <p className="text-sm text-muted-foreground">{tr(lang, { no: "Norge", en: "Norway", sv: "Norge", de: "Norwegen", pl: "Norwegia" })}</p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="flex items-center gap-2 text-gold mb-1.5"><Headphones className="size-4" aria-hidden="true" /><span className="text-[10px] tracking-[0.25em] uppercase">{tr(lang, { no: "Ansvarlig redaktør", en: "Editor in charge", sv: "Ansvarig utgivare", de: "Verantwortlicher Redakteur", pl: "Redaktor odpowiedzialny" })}</span></div>
              <p className="font-medium">Kjell Mersland</p>
              <p className="text-sm text-muted-foreground">
                {tr(lang, {
                  no: "Redaksjonelt ansvar for alt publisert innhold på slow-blues.com.",
                  en: "Editorial responsibility for all published content on slow-blues.com.",
                  sv: "Redaktionellt ansvar för allt publicerat innehåll på slow-blues.com.",
                  de: "Redaktionelle Verantwortung für alle veröffentlichten Inhalte auf slow-blues.com.",
                  pl: "Odpowiedzialność redakcyjna za wszystkie treści publikowane na slow-blues.com.",
                })}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-3">{tr(lang, { no: "Redaksjonelle prinsipper", en: "Editorial principles", sv: "Redaktionella principer", de: "Redaktionelle Grundsätze", pl: "Zasady redakcyjne" })}</h2>
          <ul className="list-disc pl-5 space-y-2 text-foreground/85">
            <li>{tr(lang, { no: "Faktasjekk og kildehenvisning på biografisk og historisk innhold.", en: "Fact-checking and source references on biographical and historical content.", sv: "Faktakontroll och källhänvisning på biografiskt och historiskt innehåll.", de: "Faktenprüfung und Quellenangaben bei biografischen und historischen Inhalten.", pl: "Weryfikacja faktów i podawanie źródeł przy treściach biograficznych i historycznych." })}</li>
            <li>{tr(lang, { no: "Tydelig skille mellom redaksjonelt innhold, anmeldelser og annonser/merch.", en: "Clear distinction between editorial content, reviews and ads/merch.", sv: "Tydlig åtskillnad mellan redaktionellt innehåll, recensioner och annonser/merch.", de: "Klare Trennung zwischen redaktionellen Inhalten, Rezensionen und Anzeigen/Merchandise.", pl: "Wyraźne rozgraniczenie między treściami redakcyjnymi, recenzjami a reklamami/gadżetami." })}</li>
            <li>{tr(lang, { no: "Rett til tilsvar: oppdager du feil — bruk kontaktskjemaet, så retter vi.", en: "Right of reply: if you spot an error, use the contact form and we'll correct it.", sv: "Rätt till genmäle: upptäcker du ett fel — använd kontaktformuläret, så rättar vi det.", de: "Recht auf Gegendarstellung: Entdecken Sie einen Fehler — nutzen Sie das Kontaktformular, dann korrigieren wir ihn.", pl: "Prawo do sprostowania: jeśli zauważysz błąd — skorzystaj z formularza kontaktowego, a poprawimy go." })}</li>
            <li>{tr(lang, { no: "Bilder brukes under Public Domain, Creative Commons eller med eksplisitt tillatelse, med attribusjon der det kreves.", en: "Images are used under Public Domain, Creative Commons or with explicit permission, with attribution where required.", sv: "Bilder används under Public Domain, Creative Commons eller med uttryckligt tillstånd, med attribution där det krävs.", de: "Bilder werden im Rahmen von Public Domain, Creative Commons oder mit ausdrücklicher Genehmigung verwendet, mit Namensnennung, wo erforderlich.", pl: "Zdjęcia wykorzystywane są w ramach domeny publicznej, Creative Commons lub za wyraźną zgodą, z podaniem autora tam, gdzie jest to wymagane." })}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-3">{tr(lang, { no: "Kontakt", en: "Contact", sv: "Kontakt", de: "Kontakt", pl: "Kontakt" })}</h2>
          <p className="mb-4">
            {tr(lang, {
              no: "All henvendelse går via vårt sikre kontaktskjema — vi publiserer ikke e-postadresser av personvernhensyn.",
              en: "All inquiries go through our secure contact form — we don't publish email addresses for privacy reasons.",
              sv: "All kontakt sker via vårt säkra kontaktformulär — vi publicerar inte e-postadresser av integritetsskäl.",
              de: "Jede Anfrage läuft über unser sicheres Kontaktformular — aus Datenschutzgründen veröffentlichen wir keine E-Mail-Adressen.",
              pl: "Wszelkie zapytania przechodzą przez nasz bezpieczny formularz kontaktowy — nie publikujemy adresów e-mail ze względów prywatności.",
            })}
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            <Mail className="size-4" aria-hidden="true" /> {tr(lang, { no: "Gå til kontaktskjema", en: "Go to contact form", sv: "Gå till kontaktformuläret", de: "Zum Kontaktformular", pl: "Przejdź do formularza kontaktowego" })}
          </Link>
        </div>

        <div className="text-sm text-muted-foreground border-t border-border pt-6 flex items-center gap-2">
          <Globe className="size-4" aria-hidden="true" /> {tr(lang, {
            no: "slow-blues.com — utgitt fra Norge, lest verden over.",
            en: "slow-blues.com — published from Norway, read around the world.",
            sv: "slow-blues.com — utgivet från Norge, läst över hela världen.",
            de: "slow-blues.com — herausgegeben aus Norwegen, gelesen auf der ganzen Welt.",
            pl: "slow-blues.com — wydawane w Norwegii, czytane na całym świecie.",
          })}
        </div>
      </section>
    </PageShell>
  );
}
