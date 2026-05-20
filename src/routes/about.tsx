import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Building2, Mail, Globe, Headphones } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "Om SlowBlues — Norges blues-arkiv" },
    { name: "description", content: "SlowBlues.no er et redaksjonelt arkiv for blues — 330+ artistprofiler, anmeldelser og historikk. Utgitt av KM TECH LABS, redigert av Kjell Mersland." },
    { property: "og:title", content: "Om SlowBlues" },
    { property: "og:description", content: "Redaksjonelt blues-arkiv utgitt av KM TECH LABS." },
    { property: "og:type", content: "website" },
  ]}),
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Om oss"
        title="About SlowBlues"
        lead="Et redaksjonelt arkiv som feirer bluesens langsomme, sjelfulle røtter — fra Mississippi-deltaet til dagens nordiske scene."
      />
      <section className="max-w-3xl mx-auto px-6 py-12 space-y-10 text-foreground/85 leading-relaxed">
        <div>
          <h2 className="font-display text-2xl text-gold mb-3">Hva vi gjør</h2>
          <p>
            SlowBlues.no dokumenterer blues som musikalsk og kulturell tradisjon. Vi har over 330 artistprofiler,
            ukentlig blogg, festivaloversikt, verdenskart, radio, og en stadig voksende samling med anmeldelser og
            historiske artikler. Innholdet er kuratert, kildebelagt og ikke-kommersielt i utgangspunktet —
            merch og donasjoner finansierer drift og hosting.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-3">Redaksjon og utgiver</h2>
          <div className="grid sm:grid-cols-2 gap-4 not-italic">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="flex items-center gap-2 text-gold mb-1.5"><Building2 className="size-4" aria-hidden="true" /><span className="text-[10px] tracking-[0.25em] uppercase">Utgiver</span></div>
              <p className="font-medium">KM TECH LABS — Kjell Mersland</p>
              <p className="text-sm text-muted-foreground">Org.nr. 934 044 029</p>
              <p className="text-sm text-muted-foreground">Norge</p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="flex items-center gap-2 text-gold mb-1.5"><Headphones className="size-4" aria-hidden="true" /><span className="text-[10px] tracking-[0.25em] uppercase">Ansvarlig redaktør</span></div>
              <p className="font-medium">Kjell Mersland</p>
              <p className="text-sm text-muted-foreground">Redaksjonelt ansvar for alt publisert innhold på slowblues.no.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-3">Redaksjonelle prinsipper</h2>
          <ul className="list-disc pl-5 space-y-2 text-foreground/85">
            <li>Faktasjekk og kildehenvisning på biografisk og historisk innhold.</li>
            <li>Tydelig skille mellom redaksjonelt innhold, anmeldelser og annonser/merch.</li>
            <li>Rett til tilsvar: oppdager du feil — bruk kontaktskjemaet, så retter vi.</li>
            <li>Bilder brukes under Public Domain, Creative Commons eller med eksplisitt tillatelse, med attribusjon der det kreves.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-3">Kontakt</h2>
          <p className="mb-4">All henvendelse går via vårt sikre kontaktskjema — vi publiserer ikke e-postadresser av personvernhensyn.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gold text-primary-foreground font-medium hover:bg-gold/90">
            <Mail className="size-4" aria-hidden="true" /> Gå til kontaktskjema
          </Link>
        </div>

        <div className="text-sm text-muted-foreground border-t border-border pt-6 flex items-center gap-2">
          <Globe className="size-4" aria-hidden="true" /> slowblues.no — utgitt fra Norge, lest verden over.
        </div>
      </section>
    </PageShell>
  );
}
