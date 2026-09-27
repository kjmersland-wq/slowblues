# SlowBlues — stående regler

Disse reglene leses ved starten av hver økt i dette repoet og overstyrer default-oppførsel. Redaktør: Kjell Mersland.

## Hosting & design
- Hosting: Cloudflare / Wrangler. **Ikke Vercel.**
  - Deploy: `npm run build` → `npx nitro deploy --prebuilt`.
- Design: Lovable-uttrykket røres ikke. Ingen redesign, ingen layout-endringer.
- Ticker beholdes (look, tempo, gjestebok-lenke).
- Eksisterende bilder røres ikke — aldri kjør bilde-pipeline på noe som allerede ligger på siden.

## Tone & språk
- Tone: personlig, varm, bluesy — Kjells stemme, ikke encyklopedi-robot.
- Fem språk (NO/EN/SV/DE/PL) skal være ferdig skrevet — i samme dybde, ikke ord-for-ord-oversettelse, tekniske termer (12-bar, slide, Delta, bent notes) uoversatt — **før** noe skrives til D1.
- Ticker-tekst: **KUN engelsk**, på alle locales, uansett hvilket språk resten av siden viser. Interne lenker/hrefs følger likevel besøkerens faktiske locale.

## Mal for ny/oppdatert artist
- Mal: `/en/artists/joe-bonamassa` — samme felter og samme dybde for enhver ny artist.
- Diskografi-tabell: Produsent | Studio | Label | Liste | Salg | Musikere | YouTube | Notater. Ingen tom «—» der Discogs/AllMusic faktisk har tall — hent det ekte tallet.
- YouTube: kun via ekte Data API (nøkkel i `.dev.vars`), play-on-click, må være offentlig + embeddable, riktig artist, ikke fan-reupload som eneste kilde, aldri gjett en video-ID.
- Død artist / nedlagt band: ingen Booking-boks på profilen.
- Ingen duplikater: sjekk slug, visningsnavn, alias og fødenavn (og vanlige feilstavinger) mot eksisterende D1-rader før noe nytt navn foreslås — også sjekk om navnet allerede er nevnt som medlem på en annen profil.
- Nye bilder: kun Wikimedia Commons (PD/CC0/CC BY/CC BY-SA, verifisert på filens egen beskrivelsesside) eller offisiell pressekit med eksplisitt tillatelse — med fotograf-credit. Aldri rør et bilde som allerede ligger på siden.
- Kilder skal være synlige i leveransen. Wikipedia er en gyldig startkilde, aldri eneste kilde. Dødsfall eller «ny plate»-påstander krever 2 uavhengige kilder.

## Arbeidsflyt
- Dry-run (tabell/tekst på alle 5 språk + kildeliste) skal vises **før** hver D1-skriving. Kjell sier ja først.
- D1-skriving på eksisterende rader: bruk vakta UPDATE (`WHERE ... AND <kolonne> = <gammel verdi>`) for å unngå å overskrive samtidige endringer.

## Hemmeligheter
- `YOUTUBE_API_KEY` finnes kun i `.dev.vars` (gitignored). Aldri print, logg eller commit den — heller ikke i scratchpad-filer som havner i git.
