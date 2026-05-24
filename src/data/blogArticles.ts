export interface BlogArticle {
  id: string;
  titleEn: string;
  titleNo: string;
  titleDe?: string;
  excerptEn: string;
  excerptNo: string;
  excerptDe?: string;
  contentEn: string[];
  contentNo: string[];
  contentDe?: string[];
  author: string;
  publishedDate: string;
  modifiedDate: string;
  category: string;
  categoryNo: string;
  categoryDe?: string;
  readingTimeMin: number;
  keywordsEn: string[];
  keywordsNo: string[];
  keywordsDe?: string[];
  relatedArtistIds?: string[];
  sections: {
    headingEn: string;
    headingNo: string;
    headingDe?: string;
    paragraphsEn: string[];
    paragraphsNo: string[];
    paragraphsDe?: string[];
    artistMentions?: string[];
  }[];
}

export const blogArticles: BlogArticle[] = [
  {
    id: "10-blues-albums-you-must-hear",
    titleEn: "10 Blues Albums You Must Hear Before You Die",
    titleNo: "10 bluesalbum du må høre før du dør",
    excerptEn: "From Robert Johnson's haunting recordings to modern masterpieces – these are the essential blues albums that every music lover needs in their collection.",
    excerptNo: "Fra Robert Johnsons hjemsøkende innspillinger til moderne mesterverk – dette er de essensielle bluesalbumene som enhver musikkelsker trenger i samlingen sin.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2025-01-15",
    modifiedDate: "2026-02-01",
    category: "Essential Listening",
    categoryNo: "Essensiell lytting",
    readingTimeMin: 12,
    keywordsEn: ["blues albums", "best blues records", "essential blues", "blues music collection", "classic blues albums"],
    keywordsNo: ["bluesalbum", "beste bluesplater", "essensiell blues", "bluesmusikk samling", "klassiske bluesalbum"],
    relatedArtistIds: ["robert-johnson", "muddy-waters", "bb-king", "howlin-wolf", "buddy-guy"],
    sections: [
      {
        headingEn: "Why These 10 Albums?",
        headingNo: "Hvorfor akkurat disse 10 albumene?",
        paragraphsEn: [
          "Choosing only ten blues albums from over a century of recorded music is almost impossible. But some records are so monumental, so foundational, that they simply cannot be left out. These are the albums that defined eras, launched careers, and changed the course of popular music forever.",
          "This list spans from the earliest recordings of the 1930s to modern blues masterpieces, covering Delta, Chicago, Texas, and electric blues. Each album tells a story not just about one artist, but about the African American experience and the universal human condition."
        ],
        paragraphsNo: [
          "Å velge bare ti bluesalbum fra over hundre år med innspilt musikk er nesten umulig. Men noen plater er så monumentale, så grunnleggende, at de rett og slett ikke kan utelates. Dette er albumene som definerte epoker, lanserte karrierer og endret populærmusikkens retning for alltid.",
          "Denne listen spenner fra de tidligste innspillingene på 1930-tallet til moderne bluesmesterverk, og dekker Delta-, Chicago-, Texas- og elektrisk blues. Hvert album forteller en historie ikke bare om én artist, men om den afrikansk-amerikanske erfaringen og den universelle menneskelige tilstanden."
        ],
      },
      {
        headingEn: "1. Robert Johnson – King of the Delta Blues Singers (1961)",
        headingNo: "1. Robert Johnson – King of the Delta Blues Singers (1961)",
        paragraphsEn: [
          "Originally recorded in 1936–1937 in hotel rooms in San Antonio and Dallas, Robert Johnson's 29 songs were compiled into this landmark album in 1961. The album arrived like a thunderbolt, influencing everyone from Eric Clapton to Keith Richards.",
          "Songs like 'Cross Road Blues,' 'Love in Vain,' and 'Hellhound on My Trail' defined the vocabulary of blues guitar. Johnson's technique – playing bass lines, chords, and melodies simultaneously – was so advanced that some listeners believed he had sold his soul to the devil at the crossroads. The reality was simply extraordinary talent honed through obsessive practice.",
          "This is where it all starts. Without Robert Johnson, the entire trajectory of popular music would be different."
        ],
        paragraphsNo: [
          "Opprinnelig innspilt i 1936–1937 i hotellrom i San Antonio og Dallas, ble Robert Johnsons 29 sanger samlet i dette banebrytende albumet i 1961. Albumet kom som et lynnedslag og påvirket alle fra Eric Clapton til Keith Richards.",
          "Sanger som 'Cross Road Blues,' 'Love in Vain' og 'Hellhound on My Trail' definerte vokabularet for bluesgitar. Johnsons teknikk – å spille basslinjer, akkorder og melodier samtidig – var så avansert at noen lyttere trodde han hadde solgt sjelen sin til djevelen ved krysset. Virkeligheten var rett og slett ekstraordinært talent finpusset gjennom besettende øving.",
          "Det er her alt starter. Uten Robert Johnson ville hele populærmusikkens bane vært annerledes."
        ],
        artistMentions: ["robert-johnson"],
      },
      {
        headingEn: "2. Muddy Waters – The Best of Muddy Waters (1958)",
        headingNo: "2. Muddy Waters – The Best of Muddy Waters (1958)",
        paragraphsEn: [
          "This compilation of Muddy Waters' Chess Records singles from 1948–1954 is essentially the birth certificate of Chicago blues. When Muddy brought his Delta acoustic style to Chicago and plugged in an electric guitar, he created a new genre.",
          "'Rollin' Stone,' 'Hoochie Coochie Man,' 'I Just Want to Make Love to You' – these songs became the blueprint for rock and roll. The Rolling Stones took their name from his song. Without this music, there would be no British Invasion, no rock as we know it.",
          "The raw power of Muddy's slide guitar, combined with Little Walter's harmonica and Willie Dixon's songwriting, created something the world had never heard before."
        ],
        paragraphsNo: [
          "Denne samlingen av Muddy Waters' Chess Records-singler fra 1948–1954 er i praksis fødselsattesten til Chicago-bluesen. Da Muddy brakte sin akustiske Delta-stil til Chicago og plugget inn en elektrisk gitar, skapte han en ny sjanger.",
          "'Rollin' Stone,' 'Hoochie Coochie Man,' 'I Just Want to Make Love to You' – disse sangene ble blåkopien for rock and roll. The Rolling Stones tok navnet sitt fra sangen hans. Uten denne musikken ville det ikke vært noen British Invasion, ingen rock slik vi kjenner den.",
          "Den rå kraften i Muddys slidegitar, kombinert med Little Walters munnspill og Willie Dixons låtskriving, skapte noe verden aldri hadde hørt før."
        ],
        artistMentions: ["muddy-waters", "little-walter", "willie-dixon"],
      },
      {
        headingEn: "3. B.B. King – Live at the Regal (1965)",
        headingNo: "3. B.B. King – Live at the Regal (1965)",
        paragraphsEn: [
          "Recorded on November 21, 1964 at the Regal Theater in Chicago, this is widely considered the greatest live blues album ever made. B.B. King was at the absolute peak of his powers, and the audience's energy is electrifying.",
          "From the opening notes of 'Every Day I Have the Blues' to the climactic 'How Blue Can You Get,' B.B. and his beloved guitar Lucille deliver a masterclass in blues performance. His tone is crystalline, his vibrato heart-wrenching, and his connection with the audience is magical.",
          "This album taught generations of guitarists that blues is about feeling, not speed. Every note B.B. plays has purpose and emotion."
        ],
        paragraphsNo: [
          "Innspilt 21. november 1964 på Regal Theater i Chicago, anses dette som det beste live-bluesalbumet noensinne. B.B. King var på det absolutte høydepunktet av sin karriere, og publikums energi er elektrifiserende.",
          "Fra de første tonene av 'Every Day I Have the Blues' til klimaktiske 'How Blue Can You Get' leverer B.B. og hans elskede gitar Lucille en mesterklasse i bluesframføring. Tonen hans er krystallklar, vibratoet hjerteskjærende og kontakten med publikum er magisk.",
          "Dette albumet lærte generasjoner av gitarister at blues handler om følelser, ikke hastighet. Hver tone B.B. spiller har mening og emosjon."
        ],
        artistMentions: ["bb-king"],
      },
      {
        headingEn: "4. Howlin' Wolf – Moanin' in the Moonlight (1959)",
        headingNo: "4. Howlin' Wolf – Moanin' in the Moonlight (1959)",
        paragraphsEn: [
          "Chester Burnett, better known as Howlin' Wolf, possessed one of the most powerful and distinctive voices in all of music. This debut album collects his revolutionary Chess Records singles, including 'Smokestack Lightnin',' 'Moanin' at Midnight,' and 'Evil.'",
          "Where Muddy Waters was slick and sophisticated, Howlin' Wolf was raw and primal. His huge, growling voice and menacing stage presence created a sound so intense that it terrified and thrilled audiences in equal measure. Sam Phillips at Sun Records called his voice 'where the soul of man never dies.'",
          "Guitarist Hubert Sumlin's jagged, angular riffs on this album directly inspired Jimi Hendrix, Jeff Beck, and countless others."
        ],
        paragraphsNo: [
          "Chester Burnett, bedre kjent som Howlin' Wolf, hadde en av de kraftigste og mest distinkte stemmene i all musikk. Dette debutalbumet samler hans revolusjonerende Chess Records-singler, inkludert 'Smokestack Lightnin',' 'Moanin' at Midnight' og 'Evil.'",
          "Der Muddy Waters var glatt og sofistikert, var Howlin' Wolf rå og primitiv. Hans enorme, brølende stemme og truende scenetilstedeværelse skapte en lyd så intens at den skremte og begeistret publikum i like stor grad. Sam Phillips ved Sun Records kalte stemmen hans 'der hvor menneskets sjel aldri dør.'",
          "Gitarist Hubert Sumlins hakkete, kantete riff på dette albumet inspirerte direkte Jimi Hendrix, Jeff Beck og utallige andre."
        ],
        artistMentions: ["howlin-wolf"],
      },
      {
        headingEn: "5. Albert King – Born Under a Bad Sign (1967)",
        headingNo: "5. Albert King – Born Under a Bad Sign (1967)",
        paragraphsEn: [
          "Albert King's Stax Records masterpiece bridged the gap between blues and soul in a way that had never been done before. Backed by Booker T. & the M.G.'s and the Memphis Horns, Albert's flying V guitar cuts through with stinging intensity.",
          "The title track became one of the most covered blues songs ever, recorded by everyone from Cream to Jimi Hendrix. Albert's left-handed, upside-down playing style created a unique string-bending technique that influenced Stevie Ray Vaughan perhaps more than any other single guitarist.",
          "This album proves that the blues can be funky, soulful, and hard-hitting all at once."
        ],
        paragraphsNo: [
          "Albert Kings Stax Records-mesterverk bygde bro mellom blues og soul på en måte som aldri hadde blitt gjort før. Med Booker T. & the M.G.'s og Memphis Horns i ryggen, skjærer Alberts Flying V-gitar gjennom med stikkende intensitet.",
          "Tittelsporet ble en av de mest covrede bluessangene noensinne, innspilt av alle fra Cream til Jimi Hendrix. Alberts venstrehendte, opp-ned spillestil skapte en unik strengebøyningsteknikk som påvirket Stevie Ray Vaughan kanskje mer enn noen annen enkeltgitarist.",
          "Dette albumet beviser at blues kan være funky, sjelfullt og hardt på én gang."
        ],
        artistMentions: ["albert-king", "stevie-ray-vaughan"],
      },
      {
        headingEn: "6. Freddie King – Getting Ready... (1971)",
        headingNo: "6. Freddie King – Getting Ready... (1971)",
        paragraphsEn: [
          "The third of the 'Three Kings' of blues guitar, Freddie King recorded this gem for Leon Russell's Shelter Records. Produced by Russell with a rock-influenced sound, it showcased Freddie's explosive picking and warm Texas tone.",
          "'Going Down' became a blues-rock anthem, covered by everyone from Jeff Beck to Stevie Ray Vaughan. Freddie's aggressive attack and fluid phrasing made him a guitarist's guitarist – the one the other pros watched in awe.",
          "Tragically, Freddie died in 1976 at just 42, but this album captures him at his creative peak."
        ],
        paragraphsNo: [
          "Den tredje av de 'Tre kongene' innen bluesgitar, Freddie King, spilte inn denne perlen for Leon Russells Shelter Records. Produsert av Russell med en rock-påvirket lyd, viste den frem Freddies eksplosive plukking og varme Texas-tone.",
          "'Going Down' ble en blues-rock-hymne, covert av alle fra Jeff Beck til Stevie Ray Vaughan. Freddies aggressive angrep og flytende frasering gjorde ham til en gitaristenes gitarist – den de andre proffene så på med ærefrykt.",
          "Tragisk nok døde Freddie i 1976, bare 42 år gammel, men dette albumet fanger ham på hans kreative høydepunkt."
        ],
        artistMentions: ["freddie-king"],
      },
      {
        headingEn: "7. Stevie Ray Vaughan – Texas Flood (1983)",
        headingNo: "7. Stevie Ray Vaughan – Texas Flood (1983)",
        paragraphsEn: [
          "When this album dropped in 1983, it single-handedly reignited mainstream interest in blues guitar. Stevie Ray Vaughan played with a ferocity and passion that hadn't been heard since Hendrix, combined with a deep reverence for Albert King, Buddy Guy, and the Texas blues tradition.",
          "The title track, a slow blues, is a clinic in dynamics, tone, and emotional expression. 'Pride and Joy' became a radio hit, and 'Love Struck Baby' showed his rockabilly side. SRV's tone – achieved through heavy strings, cranked Fender amps, and sheer physical strength – remains the gold standard for blues-rock guitar.",
          "This album saved the blues for a new generation."
        ],
        paragraphsNo: [
          "Da dette albumet kom i 1983, gjenopplivet det alene interessen for bluesgitar i mainstream. Stevie Ray Vaughan spilte med en voldsom kraft og lidenskap som ikke hadde blitt hørt siden Hendrix, kombinert med en dyp ærbødighet for Albert King, Buddy Guy og Texas-bluestradisjonen.",
          "Tittelsporet, en slow blues, er en klinikk i dynamikk, tone og emosjonelt uttrykk. 'Pride and Joy' ble en radiohit, og 'Love Struck Baby' viste hans rockabilly-side. SRVs tone – oppnådd gjennom tykke strenger, fullstendig åpne Fender-forsterkere og ren fysisk styrke – er fortsatt gullstandarden for blues-rock-gitar.",
          "Dette albumet reddet bluesen for en ny generasjon."
        ],
        artistMentions: ["stevie-ray-vaughan", "buddy-guy", "albert-king"],
      },
      {
        headingEn: "8. Buddy Guy – Damn Right, I've Got the Blues (1991)",
        headingNo: "8. Buddy Guy – Damn Right, I've Got the Blues (1991)",
        paragraphsEn: [
          "After years of being underrated and underrecorded, Buddy Guy finally got the album he deserved. With guest appearances from Eric Clapton, Jeff Beck, and Mark Knopfler, this album brought Buddy the recognition that Hendrix and Clapton had always insisted he deserved.",
          "Buddy's playing here is raw, unpredictable, and electrifying – shifting from whisper-quiet to ear-splitting volume in a heartbeat. The title track is a statement of purpose: after decades of being called 'the best kept secret in blues,' Buddy was done being a secret.",
          "This album won the Grammy for Best Contemporary Blues Album and launched Buddy's late-career renaissance."
        ],
        paragraphsNo: [
          "Etter år med å være undervurdert og underinnspilt, fikk Buddy Guy endelig albumet han fortjente. Med gjesteopptreden fra Eric Clapton, Jeff Beck og Mark Knopfler, brakte dette albumet Buddy den anerkjennelsen som Hendrix og Clapton alltid hadde insistert på at han fortjente.",
          "Buddys spilling her er rå, uforutsigbar og elektrifiserende – fra hvisker-stille til øredøvende volum på et øyeblikk. Tittelsporet er en formålserklæring: etter tiår med å bli kalt 'bluesens best bevarte hemmelighet,' var Buddy ferdig med å være en hemmelighet.",
          "Albumet vant Grammy for beste samtidsbluesalbum og lanserte Buddys renessanse sent i karrieren."
        ],
        artistMentions: ["buddy-guy", "eric-clapton", "jeff-beck"],
      },
      {
        headingEn: "9. Etta James – At Last! (1960)",
        headingNo: "9. Etta James – At Last! (1960)",
        paragraphsEn: [
          "While often classified as R&B or jazz, Etta James was a blues singer at her core, and this debut album for Chess Records/Argo is a masterpiece of vocal blues. The title track 'At Last' has become one of the most beloved songs in American music.",
          "Etta's voice could convey tenderness and fury, vulnerability and power, sometimes within a single phrase. 'I Just Want to Make Love to You' and 'A Sunday Kind of Love' showcase her incredible range and emotional depth.",
          "This album is a reminder that the blues isn't just about guitars – it's about the human voice expressing the deepest emotions."
        ],
        paragraphsNo: [
          "Selv om hun ofte klassifiseres som R&B eller jazz, var Etta James en bluessangerinne i sitt hjerte, og dette debutalbumet for Chess Records/Argo er et mesterverk innen vokal blues. Tittelsporet 'At Last' har blitt en av de mest elskede sangene i amerikansk musikk.",
          "Ettas stemme kunne formidle ømhet og raseri, sårbarhet og kraft, noen ganger i en enkelt frase. 'I Just Want to Make Love to You' og 'A Sunday Kind of Love' viser hennes utrolige register og emosjonelle dybde.",
          "Dette albumet er en påminnelse om at blues ikke bare handler om gitarer – det handler om den menneskelige stemmen som uttrykker de dypeste følelsene."
        ],
        artistMentions: ["etta-james"],
      },
      {
        headingEn: "10. Joe Bonamassa – Blues of Desperation (2016)",
        headingNo: "10. Joe Bonamassa – Blues of Desperation (2016)",
        paragraphsEn: [
          "Proving that the blues is alive and thriving in the 21st century, Joe Bonamassa's 'Blues of Desperation' is a modern masterpiece. Produced by Kevin Shirley and recorded at a studio outside Nashville, the album blends traditional blues with progressive rock influences and modern production.",
          "'Mountain Climbing' opens with a devastating slow blues, while 'Drive' and 'No Good Place for the Lonely' show Bonamassa's incredible versatility. His guitar work throughout is stunningly accomplished – fluid, fierce, and deeply rooted in the tradition of the Three Kings while pushing into new territory.",
          "This album proves that blues can evolve without losing its soul. The genre's future is in good hands."
        ],
        paragraphsNo: [
          "Som bevis på at bluesen lever og trives i det 21. århundre, er Joe Bonamassas 'Blues of Desperation' et moderne mesterverk. Produsert av Kevin Shirley og innspilt i et studio utenfor Nashville, blander albumet tradisjonell blues med progressive rock-innflytelser og moderne produksjon.",
          "'Mountain Climbing' åpner med en ødeleggende slow blues, mens 'Drive' og 'No Good Place for the Lonely' viser Bonamassas utrolige allsidighet. Gitararbeidet gjennom hele albumet er imponerende – flytende, intenst og dypt forankret i tradisjonen til de tre kongene, samtidig som det beveger seg inn på nytt territorium.",
          "Dette albumet beviser at blues kan utvikle seg uten å miste sjelen sin. Sjangerens fremtid er i gode hender."
        ],
        artistMentions: ["joe-bonamassa"],
      },
      {
        headingEn: "Honorable Mentions",
        headingNo: "Hederlig omtale",
        paragraphsEn: [
          "No list of essential blues albums is complete without mentioning: Son House – 'Father of Folk Blues' (1965), John Lee Hooker – 'The Healer' (1989), Koko Taylor – 'What It Takes' (1975), Otis Rush – 'Right Place, Wrong Time' (1976), and Charley Patton's collected recordings.",
          "Blues is a living, breathing art form. Start with these ten albums, then follow the threads – the collaborators, the influences, the side projects. The more you listen, the deeper you'll go. And the deeper you go, the more you'll understand why the blues truly is the root of all modern popular music."
        ],
        paragraphsNo: [
          "Ingen liste over essensielle bluesalbum er komplett uten å nevne: Son House – 'Father of Folk Blues' (1965), John Lee Hooker – 'The Healer' (1989), Koko Taylor – 'What It Takes' (1975), Otis Rush – 'Right Place, Wrong Time' (1976), og Charley Pattons samlede innspillinger.",
          "Blues er en levende, pustende kunstform. Start med disse ti albumene, og følg så trådene – samarbeidspartnerne, påvirkningene, sideprosjektene. Jo mer du lytter, desto dypere kommer du. Og jo dypere du kommer, desto mer forstår du hvorfor bluesen virkelig er roten til all moderne populærmusikk."
        ],
        artistMentions: ["son-house", "john-lee-hooker", "koko-taylor", "otis-rush", "charley-patton"],
      },
    ],
  },
  {
    id: "blues-in-scandinavia",
    titleEn: "Blues in Scandinavia – How the Delta Sound Traveled North",
    titleNo: "Blues i Skandinavia – Hvordan Delta-lyden reiste nordover",
    excerptEn: "The unlikely but passionate story of how Mississippi Delta blues took root in the cold Nordic countries and produced a vibrant blues scene.",
    excerptNo: "Den usannsynlige, men lidenskapelige historien om hvordan Mississippi Delta-blues slo rot i de kalde nordiske landene og skapte en livlig bluesscene.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2025-03-10",
    modifiedDate: "2026-01-20",
    category: "Blues Culture",
    categoryNo: "Blueskultur",
    readingTimeMin: 10,
    keywordsEn: ["scandinavian blues", "nordic blues", "blues in norway", "blues in sweden", "blues in finland", "european blues scene"],
    keywordsNo: ["skandinavisk blues", "nordisk blues", "blues i norge", "blues i sverige", "blues i finland", "europeisk bluesscene"],
    relatedArtistIds: ["knut-reiersrud", "vidar-busk", "erja-lyytinen", "amund-maarud"],
    sections: [
      {
        headingEn: "An Unlikely Love Affair",
        headingNo: "Et usannsynlig kjærlighetsforhold",
        paragraphsEn: [
          "How did music born from the suffering of enslaved African Americans in the Mississippi Delta find its way to the frozen fjords of Norway, the forests of Finland, and the shores of Sweden? The answer lies in the universal power of emotional honesty in music – and in a few key cultural moments that connected these distant worlds.",
          "The Scandinavian blues story begins in the late 1960s and early 1970s, when American blues records started appearing in Nordic record shops, often through British intermediaries. Young Norwegians, Swedes, Finns, and Danes heard Muddy Waters, Howlin' Wolf, and Robert Johnson for the first time – and were forever changed."
        ],
        paragraphsNo: [
          "Hvordan fant musikk født fra lidelsen til slaver og afroamerikanere i Mississippi-deltaet veien til Norges frosne fjorder, Finlands skoger og Sveriges kyster? Svaret ligger i den universelle kraften til emosjonell ærlighet i musikk – og i noen få kulturelle øyeblikk som koblet disse fjerne verdener sammen.",
          "Den skandinaviske blueshistorien begynner på slutten av 1960-tallet og begynnelsen av 1970-tallet, da amerikanske bluesplater begynte å dukke opp i nordiske platebutikker, ofte gjennom britiske mellommenn. Unge nordmenn, svensker, finner og dansker hørte Muddy Waters, Howlin' Wolf og Robert Johnson for første gang – og ble forandret for alltid."
        ],
      },
      {
        headingEn: "Norway: From Blues Clubs to World Stages",
        headingNo: "Norge: Fra bluesklubber til verdensscener",
        paragraphsEn: [
          "Norway's blues scene is remarkably rich for a country of just 5 million people. The foundation was laid in the 1970s and 1980s by pioneers who traveled to the American South to learn from the source. Blues clubs sprouted across the country – from Oslo to Kristiansand, Bergen to Tromsø.",
          "Knut Reiersrud emerged as Norway's premier blues guitarist, blending traditional Delta and Chicago influences with Norwegian folk music in a way that was entirely unique. His collaborations with American blues legends cemented Norway's place on the international blues map.",
          "Vidar Busk brought a rockabilly-tinged energy to Norwegian blues, while Amund Maarud represented a new generation combining raw blues power with modern sensibilities. The annual Notodden Blues Festival, founded in 1988, became one of Europe's most important blues events."
        ],
        paragraphsNo: [
          "Norges bluesscene er bemerkelsesverdig rik for et land med bare 5 millioner mennesker. Grunnlaget ble lagt på 1970- og 1980-tallet av pionerer som reiste til amerikas sørstater for å lære fra kilden. Bluesklubber dukket opp over hele landet – fra Oslo til Kristiansand, Bergen til Tromsø.",
          "Knut Reiersrud fremsto som Norges fremste bluesgitarist, og blandet tradisjonelle Delta- og Chicago-innflytelser med norsk folkemusikk på en helt unik måte. Hans samarbeid med amerikanske blueslegender befestet Norges plass på det internasjonale blueskartet.",
          "Vidar Busk brakte en rockabilly-preget energi til norsk blues, mens Amund Maarud representerte en ny generasjon som kombinerte rå blueskraft med moderne følsomhet. Den årlige Notodden Blues Festival, grunnlagt i 1988, ble en av Europas viktigste bluesarrangementer."
        ],
        artistMentions: ["knut-reiersrud", "vidar-busk", "amund-maarud"],
      },
      {
        headingEn: "Finland: The Surprising Blues Powerhouse",
        headingNo: "Finland: Det overraskende blues-kraftsenteret",
        paragraphsEn: [
          "Finland has perhaps the most passionate blues scene in all of Scandinavia. Some attribute this to the Finnish concept of 'sisu' – a stoic resilience in the face of hardship – which resonates deeply with the emotional core of the blues.",
          "Erja Lyytinen has become Finland's most internationally recognized blues artist, earning comparisons to Bonnie Raitt and Susan Tedeschi. Her slide guitar work is masterful, and she's performed at major blues festivals worldwide.",
          "Finland hosts multiple blues festivals, and Helsinki's blues clubs regularly draw international acts. The Finnish Blues Society is one of the most active in Europe, organizing events, workshops, and educational programs."
        ],
        paragraphsNo: [
          "Finland har kanskje den mest lidenskapelige bluesscenen i hele Skandinavia. Noen tilskriver dette det finske konseptet 'sisu' – en stoisk motstandskraft i møte med motgang – som resonerer dypt med bluesens emosjonelle kjerne.",
          "Erja Lyytinen har blitt Finlands mest internasjonalt anerkjente bluesartist, og har blitt sammenlignet med Bonnie Raitt og Susan Tedeschi. Hennes slidegitarspill er mesterlig, og hun har opptrådt på store bluesfestivaler verden over.",
          "Finland arrangerer flere bluesfestivaler, og Helsinkis bluesklubber tiltrekker jevnlig internasjonale artister. The Finnish Blues Society er en av de mest aktive i Europa, og organiserer arrangementer, workshops og utdanningsprogrammer."
        ],
        artistMentions: ["erja-lyytinen"],
      },
      {
        headingEn: "Sweden & Denmark: Quiet Intensity",
        headingNo: "Sverige og Danmark: Stille intensitet",
        paragraphsEn: [
          "Sweden's blues tradition runs deep, with artists like Louise Hoffsten blending blues with Swedish pop sensibilities to create something uniquely Scandinavian. The Stockholm blues scene has been thriving since the 1970s, and Swedish blues festivals draw enthusiastic crowds.",
          "Denmark, though smaller in its blues output, has produced dedicated artists and a loyal fan base. Copenhagen's clubs have long been stopping points for touring American blues musicians, creating a direct cultural exchange that has enriched the Danish scene.",
          "Across all the Nordic countries, what's remarkable is the reverence these musicians show for the American originators. Scandinavian blues artists don't try to be African American – they honor the tradition while bringing their own cultural perspective, creating something authentic and deeply felt."
        ],
        paragraphsNo: [
          "Sveriges bluestradisjon er dyp, med artister som Louise Hoffsten som blander blues med svenske pop-følsomheter for å skape noe unikt skandinavisk. Stockholms bluesscene har blomstret siden 1970-tallet, og svenske bluesfestivaler tiltrekker entusiastiske folkemengder.",
          "Danmark, selv om det er mindre i bluesproduktjon, har produsert dedikerte artister og en lojal fanbase. Københavns klubber har lenge vært stoppesteder for turnerende amerikanske bluesmusikere, noe som har skapt en direkte kulturutveksling som har beriket den danske scenen.",
          "Det som er bemerkelsesverdig på tvers av alle de nordiske landene er ærbødigheten disse musikerne viser for de amerikanske opphavsmennene. Skandinaviske bluesartister prøver ikke å være afrikansk-amerikanske – de ærer tradisjonen samtidig som de bringer sitt eget kulturelle perspektiv, og skaper noe autentisk og dyptfølt."
        ],
        artistMentions: ["louise-hoffsten"],
      },
      {
        headingEn: "The Future of Nordic Blues",
        headingNo: "Fremtiden for nordisk blues",
        paragraphsEn: [
          "Today, the Scandinavian blues scene is healthier than ever. A new generation of musicians is emerging, equipped with world-class musical education and access to the entire history of blues through digital platforms. They're creating music that honors the tradition while pushing into new sonic territory.",
          "Festivals like Notodden (Norway), Peer Gynt Festival blues stages, Helsinki Blues Festival (Finland), and Stockholm Blues Fest (Sweden) continue to grow, bringing together Nordic and international artists in celebrations of this enduring art form.",
          "The delta's music found unlikely but loving homes in the North. And in doing so, it proved once again that the blues truly is universal."
        ],
        paragraphsNo: [
          "I dag er den skandinaviske bluesscenen sunnere enn noensinne. En ny generasjon musikere vokser frem, utstyrt med musikkutdanning i verdensklasse og tilgang til hele blueshistorien gjennom digitale plattformer. De skaper musikk som ærer tradisjonen samtidig som de utforsker nytt sonisk territorium.",
          "Festivaler som Notodden (Norge), Peer Gynt-festivalens bluesscener, Helsinki Blues Festival (Finland) og Stockholm Blues Fest (Sverige) fortsetter å vokse, og bringer sammen nordiske og internasjonale artister i feiringer av denne varige kunstformen.",
          "Deltaets musikk fant usannsynlige, men kjærlige hjem i nord. Og i å gjøre det beviste den nok en gang at bluesen virkelig er universell."
        ],
      },
    ],
  },
  {
    id: "women-who-shaped-the-blues",
    titleEn: "The Women Who Shaped the Blues",
    titleNo: "Kvinnene som formet bluesen",
    excerptEn: "From Ma Rainey and Bessie Smith to Koko Taylor and modern trailblazers – the often-overlooked story of women who were foundational to the blues.",
    excerptNo: "Fra Ma Rainey og Bessie Smith til Koko Taylor og moderne foregangsfigurer – den ofte oversette historien om kvinnene som var grunnleggende for bluesen.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2025-06-01",
    modifiedDate: "2026-02-05",
    category: "Blues History",
    categoryNo: "Blueshistorie",
    readingTimeMin: 11,
    keywordsEn: ["women in blues", "female blues artists", "Ma Rainey", "Bessie Smith", "Koko Taylor", "blues queens", "women blues singers"],
    keywordsNo: ["kvinner i blues", "kvinnelige bluesartister", "Ma Rainey", "Bessie Smith", "Koko Taylor", "bluesdronninger"],
    relatedArtistIds: ["ma-rainey", "bessie-smith", "koko-taylor", "etta-james", "shemekia-copeland"],
    sections: [
      {
        headingEn: "The Forgotten Pioneers",
        headingNo: "De glemte pionerene",
        paragraphsEn: [
          "When people think of blues history, they often picture men: Robert Johnson at the crossroads, Muddy Waters on stage in Chicago, B.B. King cradling Lucille. But the truth is that women were not just participants in blues history – they were its first commercial stars and shaped the genre in ways that are still felt today.",
          "The first commercially recorded blues song was performed by a woman: Mamie Smith's 'Crazy Blues' in 1920. This single sold 75,000 copies in its first month, proving there was a massive market for blues music and launching the entire 'race records' industry. Without this moment, the recording history of blues might have unfolded very differently."
        ],
        paragraphsNo: [
          "Når folk tenker på blueshistorie, ser de ofte for seg menn: Robert Johnson ved veikrysset, Muddy Waters på scenen i Chicago, B.B. King med Lucille i armene. Men sannheten er at kvinner ikke bare var deltakere i blueshistorien – de var dens første kommersielle stjerner og formet sjangeren på måter som fortsatt merkes i dag.",
          "Den første kommersielt innspilte bluessangen ble fremført av en kvinne: Mamie Smiths 'Crazy Blues' i 1920. Denne singelen solgte 75 000 eksemplarer i sin første måned, noe som beviste at det var et enormt marked for bluesmusikk og startet hele 'race records'-industrien. Uten dette øyeblikket kunne innspillingshistorien til blues ha utviklet seg helt annerledes."
        ],
      },
      {
        headingEn: "Ma Rainey – The Mother of the Blues",
        headingNo: "Ma Rainey – Bluesens mor",
        paragraphsEn: [
          "Gertrude 'Ma' Rainey (1886–1939) is widely considered the 'Mother of the Blues.' Born in Columbus, Georgia, she began performing as a teenager and was among the first generation of professional blues performers, touring with minstrel shows across the American South.",
          "Ma Rainey's powerful contralto voice and commanding stage presence made her a superstar in the 1920s. She recorded over 100 songs for Paramount Records between 1923 and 1928, including classics like 'See See Rider Blues' and 'Ma Rainey's Black Bottom.'",
          "Perhaps her greatest legacy was mentoring a young Bessie Smith, who would become the biggest star in blues history. Ma Rainey taught Bessie not just how to sing the blues, but how to own a stage – a lesson that resonated through every performance Bessie ever gave."
        ],
        paragraphsNo: [
          "Gertrude 'Ma' Rainey (1886–1939) anses som 'bluesens mor.' Født i Columbus, Georgia, begynte hun å opptre som tenåring og var blant den første generasjonen profesjonelle bluesartister, som turnerte med minstrel-show over hele det amerikanske Sørstatene.",
          "Ma Raineys kraftfulle kontraltstemme og kommanderende sceneoppsyn gjorde henne til en superstjerne på 1920-tallet. Hun spilte inn over 100 sanger for Paramount Records mellom 1923 og 1928, inkludert klassikere som 'See See Rider Blues' og 'Ma Rainey's Black Bottom.'",
          "Kanskje hennes største arv var veiledningen av en ung Bessie Smith, som skulle bli den største stjernen i blueshistorien. Ma Rainey lærte Bessie ikke bare hvordan man synger blues, men hvordan man eier en scene – en leksjon som gjenklang gjennom hver eneste fremføring Bessie noensinne ga."
        ],
        artistMentions: ["ma-rainey", "bessie-smith"],
      },
      {
        headingEn: "Bessie Smith – The Empress of the Blues",
        headingNo: "Bessie Smith – Bluesens keiserinne",
        paragraphsEn: [
          "Bessie Smith (1894–1937) was the highest-paid Black entertainer of the 1920s, earning up to $2,000 per week at her peak – an extraordinary sum for the era. Her voice was so powerful that she often performed without a microphone, filling theaters with her raw emotion and impeccable phrasing.",
          "Songs like 'Downhearted Blues' (which sold 780,000 copies in six months), 'St. Louis Blues,' and 'Nobody Knows You When You're Down and Out' became standards that are still performed today. She recorded with Louis Armstrong, creating some of the most important recordings in American music history.",
          "Bessie's tragic death in a car accident in 1937 at age 43 cut short a career that had already changed music forever. Janis Joplin, who cited Bessie as her primary influence, paid for a headstone for her previously unmarked grave in 1970."
        ],
        paragraphsNo: [
          "Bessie Smith (1894–1937) var den best betalte svarte underholdningsartisten på 1920-tallet, og tjente opptil 2000 dollar per uke på sitt høydepunkt – en ekstraordinær sum for tiden. Stemmen hennes var så kraftig at hun ofte opptrådte uten mikrofon, og fylte teatre med sine rå følelser og upåklagelige frasering.",
          "Sanger som 'Downhearted Blues' (som solgte 780 000 eksemplarer på seks måneder), 'St. Louis Blues' og 'Nobody Knows You When You're Down and Out' ble standarder som fortsatt fremføres i dag. Hun spilte inn med Louis Armstrong, og skapte noen av de viktigste innspillingene i amerikansk musikkhistorie.",
          "Bessies tragiske død i en bilulykke i 1937, bare 43 år gammel, avbrøt en karriere som allerede hadde forandret musikken for alltid. Janis Joplin, som nevnte Bessie som sin primære innflytelse, betalte for en gravstein for hennes tidligere umerkede grav i 1970."
        ],
        artistMentions: ["bessie-smith"],
      },
      {
        headingEn: "Koko Taylor – Queen of the Blues",
        headingNo: "Koko Taylor – Bluesens dronning",
        paragraphsEn: [
          "Koko Taylor (1928–2009) earned the title 'Queen of the Blues' through decades of electrifying performances and her unmistakable, powerful voice. Discovered by Willie Dixon at a Chicago club in the early 1960s, she went on to become the most prominent female blues artist of her generation.",
          "Her 1965 recording of Dixon's 'Wang Dang Doodle' became a blues classic, reaching #4 on the R&B charts. She won 25 W.C. Handy Awards (now Blues Music Awards) – more than any other artist, male or female.",
          "Koko proved that women could hold their own in the rough-and-tumble world of Chicago blues clubs. Her voice could shake the walls, and her personality filled every room she entered."
        ],
        paragraphsNo: [
          "Koko Taylor (1928–2009) fikk tittelen 'bluesens dronning' gjennom tiår med elektrifiserende fremføringer og sin umiskjennelige, kraftfulle stemme. Oppdaget av Willie Dixon på en Chicago-klubb tidlig på 1960-tallet, ble hun den mest fremtredende kvinnelige bluesartisten i sin generasjon.",
          "Hennes 1965-innspilling av Dixons 'Wang Dang Doodle' ble en bluesklassiker som nådde #4 på R&B-listene. Hun vant 25 W.C. Handy Awards (nå Blues Music Awards) – mer enn noen annen artist, mann eller kvinne.",
          "Koko beviste at kvinner kunne hevde seg i den tøffe verdenen av Chicago-bluesklubber. Stemmen hennes kunne ryste veggene, og personligheten hennes fylte ethvert rom hun gikk inn i."
        ],
        artistMentions: ["koko-taylor", "willie-dixon"],
      },
      {
        headingEn: "Modern Torchbearers",
        headingNo: "Moderne fakkelbærere",
        paragraphsEn: [
          "Today, women continue to shape the blues in exciting new directions. Shemekia Copeland carries the torch with a voice that channels Koko Taylor's power and Etta James' soul. Sue Foley's guitar work has earned her international acclaim, and Mavis Staples – at over 80 – remains one of the most powerful voices in American music.",
          "In Scandinavia, Erja Lyytinen from Finland has become one of the most exciting slide guitarists in the world, male or female. Rita Engedalen from Norway and Louise Hoffsten from Sweden continue to build the Nordic blues tradition with their distinctive voices.",
          "The women of the blues were never secondary – they were foundational. And their legacy continues to inspire new generations of musicians who refuse to let the blues be defined by gender."
        ],
        paragraphsNo: [
          "I dag fortsetter kvinner å forme bluesen i spennende nye retninger. Shemekia Copeland bærer fakkelen videre med en stemme som kanaliserer Koko Taylors kraft og Etta James' sjel. Sue Foleys gitarspill har gitt henne internasjonal anerkjennelse, og Mavis Staples – over 80 år – er fortsatt en av de kraftigste stemmene i amerikansk musikk.",
          "I Skandinavia har Erja Lyytinen fra Finland blitt en av verdens mest spennende slidegitarister, uansett kjønn. Rita Engedalen fra Norge og Louise Hoffsten fra Sverige fortsetter å bygge den nordiske bluestradisjonen med sine særegne stemmer.",
          "Bluesens kvinner var aldri sekundære – de var grunnleggende. Og arven deres fortsetter å inspirere nye generasjoner av musikere som nekter å la bluesen defineres av kjønn."
        ],
        artistMentions: ["shemekia-copeland", "sue-foley", "mavis-staples", "erja-lyytinen", "rita-engedalen", "louise-hoffsten"],
      },
    ],
  },
  {
    id: "blues-news-february-2026",
    titleEn: "February Blues Dispatch: B.B. King's 100th Birthday Tribute, Lil' Ed's Chicago Fire & Kingfish on the Road",
    titleNo: "Blues-nytt i februar: B.B. Kings 100-årshyllest, Lil' Eds Chicago-ild og Kingfish på veien",
    excerptEn: "Joe Bonamassa gathers an all-star cast for a landmark B.B. King centennial album, Lil' Ed & The Blues Imperials drop their hottest slide record yet, Tinsley Ellis goes acoustic, Kingfish launches a massive tour – and Notodden Blues Festival 2026 dates are confirmed. Here's everything shaking the blues world this February.",
    excerptNo: "Joe Bonamassa samler et stjernelag for et historisk B.B. King-album til 100-årsjubileet, Lil' Ed & The Blues Imperials slipper sin råeste slideplate noensinne, Tinsley Ellis går akustisk, Kingfish legger ut på en massiv turné – og Notodden Blues Festival 2026-datoene er bekreftet. Her er alt som rister bluesverdenen i februar.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2026-02-07",
    modifiedDate: "2026-02-07",
    category: "News",
    categoryNo: "Nyheter",
    readingTimeMin: 9,
    keywordsEn: ["blues news february 2026", "BB King Blues Summit 100", "Joe Bonamassa tribute album", "Lil Ed Slideways", "Tinsley Ellis Labor of Love", "Kingfish Hard Road Tour", "Notodden Blues Festival 2026", "new blues albums 2026", "blues festival lineup"],
    keywordsNo: ["blues-nyheter februar 2026", "BB King Blues Summit 100", "Joe Bonamassa hyllestalbum", "Lil Ed Slideways", "Tinsley Ellis Labor of Love", "Kingfish Hard Road Tour", "Notodden Blues Festival 2026", "nye bluesalbum 2026", "bluesfestival lineup"],
    relatedArtistIds: ["joe-bonamassa", "bb-king", "buddy-guy", "bobby-rush", "kenny-wayne-shepherd", "christone-kingfish-ingram", "shemekia-copeland"],
    sections: [
      {
        headingEn: "B.B. King's Blues Summit 100 – A Once-in-a-Lifetime Tribute",
        headingNo: "B.B. King's Blues Summit 100 – En hyllest som bare skjer én gang",
        paragraphsEn: [
          "I don't say this lightly: B.B. King's Blues Summit 100 might be the most important blues album released in years. Assembled by Joe Bonamassa and released on February 6 through his KTBA Records label, this double-disc collection celebrates what would have been the King of the Blues' 100th birthday – and it's a masterclass in reverence, taste, and sheer musical firepower.",
          "The guest roster alone is staggering. Susan Tedeschi and Derek Trucks bring scorching slide guitar and Tedeschi's magnificent voice to their contributions. Bobby Rush – still unstoppable well into his 90s – delivers a track dripping with juke-joint swagger. George Benson lends his jazz-blues elegance, while Kenny Wayne Shepherd tears into his performance with the same raw intensity that's defined his career. Michael McDonald's soulful tenor adds an unexpected but perfect dimension, and rising star D.K. Harrell channels B.B.'s vocal phrasing with breathtaking authenticity.",
          "What makes this album truly special is how Bonamassa steps back as a bandleader rather than stealing the spotlight. His guitar work is tasteful and supportive throughout, letting each guest artist shine while maintaining a cohesive sound that honors B.B.'s legacy. The production is warm, analog-sounding, and dynamic – everything modern blues production should be. If you buy one blues album this year, make it this one.",
          "Check out our profile of Joe Bonamassa for more on his extraordinary career, and our tribute to B.B. King – the man who taught the world that one note, played with feeling, is worth more than a thousand played without it."
        ],
        paragraphsNo: [
          "Jeg sier ikke dette lettvint: B.B. King's Blues Summit 100 er kanskje det viktigste bluesalbumet på flere år. Satt sammen av Joe Bonamassa og utgitt 6. februar på hans KTBA Records, feirer denne doble skiven det som ville vært King of the Blues' 100-årsdag – og det er en mesterklasse i ærbødighet, smak og ren musikalsk ildkraft.",
          "Gjestelisten alene er overveldende. Susan Tedeschi og Derek Trucks bringer brennende slidegitar og Tedeschis storslåtte stemme. Bobby Rush – fortsatt ustoppelig langt inn i 90-årene – leverer et spor som drypper av juke joint-swagger. George Benson låner sin jazz-blues-eleganse, mens Kenny Wayne Shepherd river seg gjennom sin prestasjon med den samme rå intensiteten som har definert karrieren hans. Michael McDonalds sjelfulle tenor legger til en uventet, men perfekt dimensjon, og den stigende stjernen D.K. Harrell kanaliserer B.B.s vokalfrasering med hårreisende autentisitet.",
          "Det som gjør dette albumet virkelig spesielt er hvordan Bonamassa trer tilbake som bandleder i stedet for å stjele rampelyset. Gitararbeidet hans er smakfullt og støttende gjennom hele albumet, og lar hver gjesteartist skinne samtidig som han opprettholder en sammenhengende lyd som hedrer B.B.s arv. Produksjonen er varm, analog-klingende og dynamisk – alt moderne bluesproduksjon bør være. Hvis du kjøper bare ett bluesalbum i år, la det bli dette.",
          "Sjekk vår profil av Joe Bonamassa for mer om hans ekstraordinære karriere, og vår hyllest til B.B. King – mannen som lærte verden at én tone, spilt med følelse, er verdt mer enn tusen spilt uten."
        ],
        artistMentions: ["joe-bonamassa", "bb-king", "bobby-rush", "kenny-wayne-shepherd"],
      },
      {
        headingEn: "Lil' Ed & The Blues Imperials – Slideways: Chicago Fire at Its Finest",
        headingNo: "Lil' Ed & The Blues Imperials – Slideways: Chicago-ild på sitt beste",
        paragraphsEn: [
          "Mark your calendars: February 27 brings Slideways, the 10th Alligator Records release from Blues Hall of Famers Lil' Ed & The Blues Imperials. And from what I've heard of the advance tracks, this might be the crowning achievement of their nearly 40-year career together.",
          "Led by Chicago slide guitar icon Lil' Ed Williams – nephew of the legendary J.B. Hutto – this band has been keeping the raw, unvarnished Chicago blues tradition alive since the mid-1980s. Where so much modern blues can feel polished to a fault, Lil' Ed and his crew play with the kind of sweaty, reckless joy that recalls the golden era of Kingston Mines and Theresa's Lounge.",
          "The advance single 'Bad All By Myself' is exactly what you want from Lil' Ed: a heavy slide riff, a relentless shuffle groove, and Ed's raspy, shouting vocals cutting through the mix like a hot knife. DownBeat called his playing 'outrageous, forceful Chicago blues slide-guitar… piping hot energy,' and that's exactly right. This band doesn't play the blues – they attack it, with love.",
          "A 2026 Slideways Tour has also been announced, so if they're coming anywhere near you, do not miss them. There's nothing quite like Lil' Ed live."
        ],
        paragraphsNo: [
          "Merk dere datoen: 27. februar kommer Slideways, den 10. Alligator Records-utgivelsen fra Blues Hall of Famers Lil' Ed & The Blues Imperials. Og fra det jeg har hørt av forhåndssporene, kan dette være kroningen av deres nesten 40 år lange karriere sammen.",
          "Ledet av Chicago-slidegitarikon Lil' Ed Williams – nevø av den legendariske J.B. Hutto – har dette bandet holdt den rå, upolerte Chicago-bluestradisjonen i live siden midten av 1980-tallet. Der så mye moderne blues kan føles polert til det kjedelige, spiller Lil' Ed og gjengen med den typen svett, hensynsløs glede som minner om gullalderen til Kingston Mines og Theresa's Lounge.",
          "Forhåndssingelen 'Bad All By Myself' er nøyaktig det du vil ha fra Lil' Ed: et tungt slide-riff, en nådeløs shuffle-groove og Eds raspete, ropende vokal som skjærer gjennom miksen som en varm kniv. DownBeat kalte spillet hans 'opprørsk, kraftfull Chicago blues slidegitar… rykende varm energi,' og det er helt riktig. Dette bandet spiller ikke blues – de angriper den, med kjærlighet.",
          "En 2026 Slideways Tour er også annonsert, så hvis de kommer i nærheten av deg, ikke gå glipp av dem. Det finnes ingenting som Lil' Ed live."
        ],
      },
      {
        headingEn: "Tinsley Ellis Goes Acoustic: Labor Of Love",
        headingNo: "Tinsley Ellis går akustisk: Labor Of Love",
        paragraphsEn: [
          "Here's something I didn't see coming: Tinsley Ellis, Atlanta's electric blues firebrand, has released an all-acoustic album. Labor Of Love dropped on January 30 through Alligator Records, and it's a revelation. All original material, stripped down to just voice, acoustic guitar, and raw emotion.",
          "For over 40 years, Tinsley has been one of the most reliable electric blues guitarists on the circuit – a man whose Stratocaster tone could peel paint off walls. So hearing him trade that arsenal for an acoustic instrument is genuinely surprising, and the results are stunning. Tracks like 'Hoodoo Woman' show that his songwriting doesn't need electricity to hit you in the chest.",
          "The album has been getting glowing reviews, and Tinsley even landed the cover of Vintage Guitar Magazine's February issue. When an artist who's been plugged in for four decades sits down with a wooden box and a set of strings and makes you feel something this deep – that's the blues working exactly as it should. Labor Of Love is a quiet triumph."
        ],
        paragraphsNo: [
          "Her er noe jeg ikke så komme: Tinsley Ellis, Atlantas elektriske bluesfyrverkeri, har gitt ut et helakustisk album. Labor Of Love kom 30. januar gjennom Alligator Records, og det er en åpenbaring. Kun originalt materiale, strippet ned til bare stemme, akustisk gitar og rå følelse.",
          "I over 40 år har Tinsley vært en av de mest pålitelige elektriske bluesgitaristene på kretsen – en mann hvis Stratocaster-tone kunne skrape malingen av vegger. Så å høre ham bytte det arsenalet mot et akustisk instrument er genuint overraskende, og resultatene er slående. Spor som 'Hoodoo Woman' viser at låtskrivingen hans ikke trenger elektrisitet for å treffe deg i brystet.",
          "Albumet har fått strålende anmeldelser, og Tinsley landet til og med forsiden av Vintage Guitar Magazines februarutgave. Når en artist som har vært plugget inn i fire tiår setter seg ned med en treboks og et sett strenger og får deg til å føle noe så dypt – da fungerer bluesen akkurat som den skal. Labor Of Love er en stille triumf."
        ],
      },
      {
        headingEn: "Kingfish Hits the Road: Hard Road Tour 2026",
        headingNo: "Kingfish på veien: Hard Road Tour 2026",
        paragraphsEn: [
          "If you haven't seen Christone 'Kingfish' Ingram live yet, 2026 is your year. The Grammy-winning guitarist from Clarksdale, Mississippi – the actual birthplace of Delta blues – launches his Hard Road Tour on February 25, running through April 23 with dates across the United States and Europe.",
          "At just 25, Kingfish has already achieved what many blues musicians chase for a lifetime: Grammy recognition, a signature sound, and the endorsement of legends. Buddy Guy has called him the future of the blues, and every live performance proves why. His setlists pull from his acclaimed albums 662 and The Hard Road, mixing searing originals like 'Midnight Heat' and 'Fresh Out' with deep blues covers that show his Mississippi roots.",
          "For our Scandinavian readers: keep a close eye on his European dates. If Kingfish makes it to Norway or anywhere in the Nordics this cycle, clear your schedule. This is a once-in-a-generation talent. Check out our full profile of Christone 'Kingfish' Ingram to understand why this young man from Clarksdale is the real deal."
        ],
        paragraphsNo: [
          "Hvis du ikke har sett Christone 'Kingfish' Ingram live ennå, er 2026 ditt år. Den Grammy-vinnende gitaristen fra Clarksdale, Mississippi – det faktiske fødestedet for Delta-blues – setter i gang sin Hard Road Tour 25. februar, med datoer frem til 23. april over hele USA og Europa.",
          "Med sine bare 25 år har Kingfish allerede oppnådd det mange bluesmusikere jakter et helt liv: Grammy-anerkjennelse, en signaturlyd og godkjentstempelet fra legendene. Buddy Guy har kalt ham bluesens fremtid, og hver liveopptreden viser hvorfor. Setlistene hans henter fra de kritikerroste albumene 662 og The Hard Road, og mikser brennende originaler som 'Midnight Heat' og 'Fresh Out' med dype blues-covere som viser hans Mississippi-røtter.",
          "For våre skandinaviske lesere: følg nøye med på de europeiske datoene. Hvis Kingfish kommer til Norge eller Norden i denne runden, rydd kalenderen. Dette er et en-gang-per-generasjon-talent. Sjekk vår fullstendige profil av Christone 'Kingfish' Ingram for å forstå hvorfor denne unge mannen fra Clarksdale er den ekte varen."
        ],
        artistMentions: ["christone-kingfish-ingram", "buddy-guy"],
      },
      {
        headingEn: "Notodden Blues Festival 2026: Save the Dates",
        headingNo: "Notodden Blues Festival 2026: Sett av datoene",
        paragraphsEn: [
          "Closer to home, the dates for Notodden Blues Festival 2026 have been confirmed: July 30 to August 2. The lineup hasn't been announced yet, but given last year's incredible edition – which featured Kenny Wayne Shepherd Band, Vanessa Collier, and Kid Andersen among many others – expectations are sky-high.",
          "Notodden remains Europe's premier blues destination and Scandinavia's largest blues festival. The UNESCO World Heritage town transforms into a blues capital for four days every summer, with stages scattered across venues from the massive Hovigs Hangar to intimate book stores and even a stave church. It's the festival that proves blues isn't just an American art form – it's a global one.",
          "I'll be covering lineup announcements as they drop. If you've never been to Notodden, 2026 might be your year. Trust me – there's nothing quite like hearing deep Delta blues echo off Norwegian mountains at midnight in August. Pure magic."
        ],
        paragraphsNo: [
          "Nærmere hjemme er datoene for Notodden Blues Festival 2026 bekreftet: 30. juli til 2. august. Lineupen er ikke annonsert ennå, men gitt fjorårets utrolige utgave – med Kenny Wayne Shepherd Band, Vanessa Collier og Kid Andersen blant mange andre – er forventningene skyhøye.",
          "Notodden forblir Europas fremste bluesdestinasjon og Skandinavias største bluesfestival. UNESCO-verdensarvbyen forvandles til en blueshovedstad i fire dager hver sommer, med scener spredt over arenaer fra den enorme Hovigs Hangar til intime bokhandlere og til og med en stavkirke. Det er festivalen som beviser at blues ikke bare er en amerikansk kunstform – den er global.",
          "Jeg kommer til å dekke lineup-kunngjøringer etter hvert som de kommer. Hvis du aldri har vært på Notodden, kan 2026 være ditt år. Stol på meg – det er ingenting som å høre dyp Delta-blues gi gjenlyd mot norske fjell ved midnatt i august. Ren magi."
        ],
      },
      {
        headingEn: "What's Next? Your Turn to Weigh In",
        headingNo: "Hva nå? Din tur til å si din mening",
        paragraphsEn: [
          "What a start to the blues year. Between Bonamassa's B.B. King tribute, Lil' Ed's Chicago slide assault, Tinsley's acoustic revelation, and Kingfish tearing up stages worldwide, the blues is firing on all cylinders in 2026.",
          "I'd love to hear from you: Have you listened to Blues Summit 100 yet? Are you planning to catch Kingfish on his Hard Road Tour? And are any of you making the pilgrimage to Notodden this summer? Drop me a line via the contact form – your voices make this community what it is.",
          "While you're here, why not test your blues knowledge with our Blues Quiz, or dive deeper into the artists mentioned in this article by exploring our artist profiles? And if this article moved you, share it with a fellow blues fan. The blues is a conversation, and the more voices we have, the richer it gets. Keep listening, keep feeling, keep the blues alive."
        ],
        paragraphsNo: [
          "For en start på bluesåret. Mellom Bonamassas B.B. King-hyllest, Lil' Eds Chicago-slide-angrep, Tinsleys akustiske åpenbaring og Kingfish som herjer scener verden over, går bluesen for fullt i 2026.",
          "Jeg vil gjerne høre fra dere: Har dere lyttet til Blues Summit 100 ennå? Planlegger dere å se Kingfish på Hard Road Tour? Og kommer noen av dere til Notodden i sommer? Send oss en melding via kontaktskjemaet – stemmene deres gjør dette fellesskapet til det det er.",
          "Mens du er her, hvorfor ikke teste blueskunnskapen din med vår Blues Quiz, eller dykke dypere inn i artistene som er nevnt i denne artikkelen ved å utforske artistprofilene våre? Og hvis denne artikkelen berørte deg, del den med en bluesfan. Bluesen er en samtale, og jo flere stemmer vi har, desto rikere blir den. Fortsett å lytte, fortsett å føle, hold bluesen i live."
        ],
      },
    ],
  },
  {
    id: "buddy-guys-last-grammy-february-2026",
    titleEn: "Buddy Guy Just Won What Might Be His Last Grammy – And I Need a Minute",
    titleNo: "Buddy Guy vant kanskje sin siste Grammy – og jeg trenger et øyeblikk",
    excerptEn: "The 2026 Grammys gave Buddy Guy Best Traditional Blues Album for 'Ain't Done With The Blues.' At 89, this might be the final chapter – and it hit me harder than I expected. Plus: Big Blues Bender drops a monster lineup, Billy Branch proves Chicago harp is still king, and a Florida festival just booked the perfect blues weekend.",
    excerptNo: "2026-Grammyen ga Buddy Guy Best Traditional Blues Album for 'Ain't Done With The Blues.' Han er 89. Dette kan være siste kapittel – og det traff meg hardere enn jeg forventet. I tillegg: Big Blues Bender slipper en monsterlineup, Billy Branch beviser at Chicago-munnspill fortsatt er konge, og en festival i Florida har booket den perfekte blues-helgen.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2026-02-07",
    modifiedDate: "2026-02-07",
    category: "News",
    categoryNo: "Nyheter",
    readingTimeMin: 8,
    keywordsEn: ["buddy guy grammy 2026", "best traditional blues album grammy", "big blues bender 2026", "billy branch blues is my biography", "vero beach blues festival 2026", "robert randolph grammy", "blues news february 2026", "bobby rush", "sue foley", "kenny wayne shepherd"],
    keywordsNo: ["buddy guy grammy 2026", "beste tradisjonell bluesalbum grammy", "big blues bender 2026", "billy branch blues is my biography", "vero beach bluesfestival 2026", "robert randolph grammy", "blues-nyheter februar 2026"],
    relatedArtistIds: ["buddy-guy", "bobby-rush", "kenny-wayne-shepherd", "sue-foley", "little-walter"],
    sections: [
      {
        headingEn: "Buddy Guy Wins Best Traditional Blues Album – And It Feels Like a Goodbye",
        headingNo: "Buddy Guy vinner Best Traditional Blues Album – og det føles som et farvel",
        paragraphsEn: [
          "I'll be honest. When they announced Buddy Guy's name at the 68th Grammy Awards on February 2nd, I didn't jump out of my chair. I sat there for a second, staring at the screen, feeling something heavy settle in my chest. Because 'Ain't Done With The Blues' isn't just another album. At 89 years old, Buddy has been telling us for a while now that he's winding down. And this record – raw, personal, uncompromising – sounds like a man saying what he needs to say before the lights go out.",
          "The competition was stiff. Taj Mahal & Keb' Mo's 'Room On The Porch' is gorgeous. Maria Muldaur's Victoria Spivey tribute is a labour of love. Charlie Musselwhite's 'Look Out Highway' is classic Musselwhite. And Kenny Wayne Shepherd & Bobby Rush teaming up on 'Young Fashioned Ways'? Come on. That alone deserves a whole blog post. But Buddy Guy winning this one felt right. It felt necessary.",
          "If you've seen Buddy live – and I've been lucky enough to catch him three times – you know there's nobody quite like him. That polka-dot Stratocaster, the way he walks into the crowd, the way he can go from a whisper to a scream in half a beat. He learned from Muddy Waters. He taught Hendrix tricks. He is the living, breathing chain that connects Delta acoustic blues to modern electric. And if this Grammy is the last one, it's one hell of a full stop."
        ],
        paragraphsNo: [
          "Jeg skal være ærlig. Da de annonserte Buddy Guys navn på den 68. Grammy-utdelingen 2. februar, hoppet jeg ikke opp av stolen. Jeg satt der et øyeblikk, stirret på skjermen, og kjente noe tungt legge seg i brystet. For 'Ain't Done With The Blues' er ikke bare enda et album. Buddy er 89. Han har fortalt oss en stund nå at han trapper ned. Og denne plata – rå, personlig, kompromissløs – høres ut som en mann som sier det han må si før lysene slukkes.",
          "Konkurransen var hard. Taj Mahal & Keb' Mo's 'Room On The Porch' er nydelig. Maria Muldaurs Victoria Spivey-hyllest er et kjærlighetsarbeid. Charlie Musselwhites 'Look Out Highway' er klassisk Musselwhite. Og Kenny Wayne Shepherd & Bobby Rush sammen på 'Young Fashioned Ways'? Herregud. Det alene fortjener et helt blogginnlegg. Men at Buddy Guy vant denne føltes riktig. Det føltes nødvendig.",
          "Har du sett Buddy live – og jeg har vært heldig nok til å se ham tre ganger – så vet du at det ikke finnes noen som ham. Den prikkete Stratocaster'en, måten han går ut i publikum på, måten han kan gå fra hvisken til skrik på et halvt taktslag. Han lærte av Muddy Waters. Han lærte Hendrix triks. Han er den levende, pustende kjeden som kobler Delta-akustisk blues til moderne elektrisk. Og hvis denne Grammy'en er den siste, er det et helvetes punktum."
        ],
        artistMentions: ["buddy-guy", "kenny-wayne-shepherd", "bobby-rush"],
      },
      {
        headingEn: "Robert Randolph Takes Contemporary Blues – And Honestly, Good for Him",
        headingNo: "Robert Randolph tar Contemporary Blues – og ærlig talt, godt for ham",
        paragraphsEn: [
          "On the contemporary side, Robert Randolph's 'Preacher Kids' beat out some heavy hitters: Joe Bonamassa's 'Breakthrough,' Samantha Fish's 'Paper Doll,' Eric Gales' 'A Tribute To LJK,' and Southern Avenue's 'Family.' I know some people will argue about this one. Bonamassa fans are vocal, and Samantha Fish has been on a tear lately.",
          "But Randolph's pedal steel guitar playing is something else entirely. The man comes from the Sacred Steel tradition – church music, gospel, deep spiritual stuff – and when he bends those notes, you feel it somewhere words can't reach. 'Preacher Kids' is loose, funky, spiritual, and a little bit wild. It's not smooth. It's not polished. It's real. And sometimes that's exactly what the blues needs.",
          "I have to admit, I was pulling for Joe Bonamassa on this one. The guy deserves a Contemporary Blues Grammy at some point – he's done more for the genre's commercial visibility than almost anyone alive. But Randolph's record is genuinely special. No hard feelings, Joe. Check out our profile of Joe Bonamassa if you want the full story on his incredible output."
        ],
        paragraphsNo: [
          "På den samtidige siden slo Robert Randolphs 'Preacher Kids' ut noen tunge slagere: Joe Bonamassas 'Breakthrough,' Samantha Fishs 'Paper Doll,' Eric Gales' 'A Tribute To LJK,' og Southern Avenues 'Family.' Jeg vet at noen vil krangle om denne. Bonamassa-fans er høylytte, og Samantha Fish har vært i storform i det siste.",
          "Men Randolphs pedal steel-gitarspill er noe helt annet. Mannen kommer fra Sacred Steel-tradisjonen – kirkemusikk, gospel, dype åndelige greier – og når han bøyer de tonene, kjenner du det et sted ord ikke når. 'Preacher Kids' er løs, funky, åndelig og litt vill. Den er ikke glatt. Den er ikke polert. Den er ekte. Og noen ganger er det akkurat det bluesen trenger.",
          "Jeg må innrømme at jeg heiet på Joe Bonamassa her. Fyren fortjener en Contemporary Blues Grammy på et tidspunkt – han har gjort mer for sjangerens kommersielle synlighet enn nesten noen andre i live. Men Randolphs plate er genuint spesiell. Ingen hard feelings, Joe. Sjekk vår profil av Joe Bonamassa hvis du vil ha hele historien om hans utrolige produksjon."
        ],
        artistMentions: ["joe-bonamassa"],
      },
      {
        headingEn: "Big Blues Bender 2026: Bonnie Raitt, Bobby Rush and a Lineup That Hurts My Wallet",
        headingNo: "Big Blues Bender 2026: Bonnie Raitt, Bobby Rush og en lineup som gjør vondt i lommeboka",
        paragraphsEn: [
          "Speaking of lineups that make you reconsider your savings account: Big Blues Bender just announced their 2026 roster, and I need to sit down. September 10–13, Westgate Las Vegas Resort & Casino. Headlined by Bonnie Raitt. Let that sink in.",
          "The rest of the bill reads like a blues fan's fantasy draft: TajMo (that's Taj Mahal and Keb' Mo' together, and yes, it's as good as it sounds), Kenny Wayne Shepherd, Tab Benoit, Booker T. Jones, Ruthie Foster, The Fabulous Thunderbirds, Bobby Rush, Mike Zito, Danielle Nicole Band, Victor Wainwright… I'm getting tired just listing names. And they've got a special 'One for the King' tribute to B.B. King in the Bender One Series.",
          "The Bender has quietly become one of the best blues festivals in America. It's not a field festival – it's a hotel takeover. Every ballroom, every lounge, every corner becomes a stage. You stumble from Bobby Rush doing his thing in one room to Tab Benoit tearing it up in another, and there's no mud, no parking lot, no sunburn. Just four days of concentrated blues madness in air conditioning. If I could swing a trip to Vegas in September, I'd be there in a heartbeat.",
          "For those keeping track: Bobby Rush is 93 and still touring. Ninety-three. The man is indestructible. Read more about him in our Bobby Rush profile – his story is one of the most remarkable in all of music."
        ],
        paragraphsNo: [
          "Apropos lineups som får deg til å revurdere sparekontoen: Big Blues Bender har nettopp kunngjort sitt 2026-lag, og jeg må sette meg ned. 10.–13. september, Westgate Las Vegas Resort & Casino. Med Bonnie Raitt som headliner. La det synke inn.",
          "Resten av programmet leser som en bluesfans drømmeutkast: TajMo (det er Taj Mahal og Keb' Mo' sammen, og ja, det er så bra som det høres ut), Kenny Wayne Shepherd, Tab Benoit, Booker T. Jones, Ruthie Foster, The Fabulous Thunderbirds, Bobby Rush, Mike Zito, Danielle Nicole Band, Victor Wainwright… Jeg blir sliten bare av å liste opp navn. Og de har en spesiell 'One for the King'-hyllest til B.B. King i Bender One Series.",
          "Bender'en har stille og rolig blitt en av de beste bluesfestivalene i Amerika. Det er ikke en feltfestival – det er en hotellovertakelse. Hver ballsal, hver lounge, hvert hjørne blir en scene. Du snubler fra Bobby Rush som gjør sitt i ett rom til Tab Benoit som river det opp i et annet, og det er ingen gjørme, ingen parkeringsplass, ingen solbrenthet. Bare fire dager med konsentrert blues-galskap i aircondition. Hvis jeg kunne svinge en tur til Vegas i september, hadde jeg vært der på et øyeblikk.",
          "For de som følger med: Bobby Rush er 93 og fortsatt på turné. Nittire. Mannen er uforgjengelig. Les mer om ham i vår Bobby Rush-profil – historien hans er en av de mest bemerkelsesverdige i all musikk."
        ],
        artistMentions: ["bobby-rush", "kenny-wayne-shepherd", "bb-king"],
      },
      {
        headingEn: "Billy Branch Reminds Us That Chicago Harp Is Alive and Dangerous",
        headingNo: "Billy Branch minner oss om at Chicago-munnspill er levende og farlig",
        paragraphsEn: [
          "One record that came out late last year but deserves way more attention: Billy Branch & The Sons of the Blues – 'The Blues Is My Biography.' Released on Rosa's Lounge Records – a Chicago label, because of course it is – this album is the real deal. Billy Branch is 73, he's been called the successor to Little Walter as the King of Chicago Blues Harmonica, and on this record he plays like he has something to prove.",
          "The album is part autobiography, part love letter to the Chicago blues tradition. It features Bobby Rush on the opening single 'Hole in Your Soul,' and the combination of Branch's razor-sharp harp and Rush's timeless swagger is perfect. But it's the deeper cuts that got me. There are moments where Branch strips it down and just plays, and you can hear fifty years of smoke-filled clubs and late-night jam sessions in every breath.",
          "Branch has three Grammy nominations. He should have a win by now. Whether the Academy catches up or not, 'The Blues Is My Biography' is the kind of album that matters – not because it reinvents anything, but because it does what the blues has always done: tells the truth, with feel, no apologies. If you love harmonica blues, you need this record. Period."
        ],
        paragraphsNo: [
          "En plate som kom ut sent i fjor men som fortjener mye mer oppmerksomhet: Billy Branch & The Sons of the Blues – 'The Blues Is My Biography.' Utgitt på Rosa's Lounge Records – et Chicago-selskap, naturligvis – denne plata er the real deal. Billy Branch er 73, han har blitt kalt etterfølgeren til Little Walter som kongen av Chicago blues-munnspill, og på denne plata spiller han som om han har noe å bevise.",
          "Albumet er dels selvbiografi, dels kjærlighetsbrev til Chicago-bluestradisjonen. Det har Bobby Rush med på åpningssingelen 'Hole in Your Soul,' og kombinasjonen av Branchs barberbladskarpe munnspill og Rushs tidløse swagger er perfekt. Men det er de dypere kuttene som tok meg. Det er øyeblikk der Branch stripper det ned og bare spiller, og du kan høre femti år med røykfylte klubber og seinkveldsjam i hvert eneste pust.",
          "Branch har tre Grammy-nominasjoner. Han burde hatt en seier nå. Uansett om Academy tar igjen eller ikke, er 'The Blues Is My Biography' den typen album som betyr noe – ikke fordi det finner opp noe på nytt, men fordi det gjør det bluesen alltid har gjort: forteller sannheten, med følelse, uten unnskyldninger. Hvis du elsker harmonikablues, trenger du denne plata. Punktum."
        ],
        artistMentions: ["little-walter", "bobby-rush"],
      },
      {
        headingEn: "Vero Beach Blues Festival: The Lineup That Made Me Double-Take",
        headingNo: "Vero Beach Blues Festival: Lineupen som fikk meg til å se to ganger",
        paragraphsEn: [
          "One more thing before I let you go. Down in Florida, the Vero Beach Blues Festival has quietly put together a lineup that stopped me mid-scroll: Eric Gales, Bobby Rush (yes, again – the man is everywhere), Sue Foley, and Mud Morganfield (Muddy Waters' son, carrying the family name with class). That's a seriously good weekend of blues, and in February in Florida, which beats February in Norway by approximately one million degrees.",
          "Sue Foley is someone I wish more people knew about. Canadian, based in Austin, plays a pink Telecaster with more authority than most guys manage with their entire pedalboard. Her tone is clean, her phrasing is sharp, and she writes songs that stick with you for days. We've got a full profile of Sue Foley on the site – do yourself a favour and check it out if you haven't already.",
          "These smaller regional festivals are often where you get the best blues experiences. No corporate sponsors on every surface, no VIP tiers that cost more than a used car. Just blues fans in lawn chairs, cold beer, and musicians who play like their lives depend on it. That's what it's all about."
        ],
        paragraphsNo: [
          "En ting til før jeg slipper dere. Nede i Florida har Vero Beach Blues Festival stille og rolig satt sammen en lineup som stoppet meg midt i scrollingen: Eric Gales, Bobby Rush (ja, igjen – mannen er overalt), Sue Foley, og Mud Morganfield (Muddy Waters' sønn, som bærer familienavnet med klasse). Det er en skikkelig bra blues-helg, og det i Florida i februar, noe som slår februar i Norge med omtrent en million grader.",
          "Sue Foley er en jeg ønsker flere kjente til. Kanadisk, basert i Austin, spiller en rosa Telecaster med mer autoritet enn de fleste gutter klarer med hele pedalboardet sitt. Tonen hennes er ren, fraseringen er skarp, og hun skriver sanger som setter seg fast i dagevis. Vi har en full profil av Sue Foley på siden – gjør deg selv en tjeneste og sjekk den ut om du ikke har gjort det allerede.",
          "Disse mindre regionale festivalene er ofte der du får de beste blues-opplevelsene. Ingen bedriftssponsorer på hver overflate, ingen VIP-nivåer som koster mer enn en bruktbil. Bare bluesfans i campingstoler, kald øl og musikere som spiller som om livet avhenger av det. Det er det dette handler om."
        ],
        artistMentions: ["sue-foley"],
      },
      {
        headingEn: "Your Turn – What Did You Think of Grammy Night?",
        headingNo: "Din tur – hva synes du om Grammy-kvelden?",
        paragraphsEn: [
          "That's my week in blues. Buddy Guy getting what might be his final Grammy. Robert Randolph surprising a few people. Big Blues Bender announcing a lineup that could bankrupt me. Billy Branch proving the harp is still the most soulful instrument in blues. And festivals from Vegas to Vero Beach keeping the whole thing alive.",
          "I want to hear from you. Was Buddy the right pick? Should Bonamassa have taken the contemporary category? Are you planning any blues festival trips this year? Drop me a line via the contact form or share this with someone who needs more blues in their life.",
          "And while you're here – why not explore some of the artists we talked about today? Dive into our profiles, take our Blues Quiz, or just put on 'Ain't Done With The Blues' and turn up the volume. The neighbours will understand. Probably."
        ],
        paragraphsNo: [
          "Det er min uke i blues. Buddy Guy som får det som kanskje er hans siste Grammy. Robert Randolph som overrasker noen. Big Blues Bender som kunngjør en lineup som kan ruinere meg. Billy Branch som beviser at munnspillet fortsatt er det mest sjelfulle instrumentet i blues. Og festivaler fra Vegas til Vero Beach som holder hele greia i live.",
          "Jeg vil høre fra dere. Var Buddy riktig valg? Burde Bonamassa tatt den samtidige kategorien? Planlegger dere noen bluesfestival-turer i år? Send oss en melding via kontaktskjemaet eller del dette med noen som trenger mer blues i livet sitt.",
          "Og mens du er her – hvorfor ikke utforske noen av artistene vi snakket om i dag? Dykk inn i profilene våre, ta vår Blues Quiz, eller bare sett på 'Ain't Done With The Blues' og skru opp volumet. Naboene vil forstå. Sannsynligvis."
        ],
      },
    ],
  },
  {
    id: "weekly-blues-dispatch-february-16-2026",
    titleEn: "Weekly Blues Dispatch: February Birthdays, Oz & The Wizards Release Concert & Your Help Wanted!",
    titleNo: "Ukentlig blues-oppdatering: Februar-bursdager, Oz & The Wizards releasekonsert og vi trenger din hjelp!",
    excerptEn: "This week we celebrate the blues legends born in February – from Lonnie Johnson to Knut Reiersrud – hype the upcoming Oz & The Wizards release concert in Kristiansand, spotlight Duke Robillard's brand-new album, and make a heartfelt plea for your help with artist photos and information. Plus: have you tried our Blues Quiz yet?",
    excerptNo: "Denne uka feirer vi blueslegendene født i februar – fra Lonnie Johnson til Knut Reiersrud – hyper den kommende releasekonserten til Oz & The Wizards i Kristiansand, setter søkelys på Duke Robillards splitter nye album, og ber dere inderlig om hjelp med artistbilder og informasjon. Pluss: har du prøvd vår Blues Quiz ennå?",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2026-02-16",
    modifiedDate: "2026-02-16",
    category: "Weekly Dispatch",
    categoryNo: "Ukentlig oppdatering",
    readingTimeMin: 10,
    keywordsEn: ["blues weekly newsletter", "blues birthdays february", "Oz and The Wizards concert", "Knut Reiersrud birthday", "Lonnie Johnson birthday", "Duke Robillard Blast Off", "blues artist photos wanted", "SlowBlues blues quiz", "Kristiansand blues", "blues community"],
    keywordsNo: ["blues ukentlig nyhetsbrev", "blues bursdager februar", "Oz and The Wizards konsert", "Knut Reiersrud bursdag", "Lonnie Johnson bursdag", "Duke Robillard Blast Off", "blues artistbilder søkes", "SlowBlues blues quiz", "Kristiansand blues", "blues-fellesskap"],
    relatedArtistIds: ["lonnie-johnson", "knut-reiersrud", "oz-and-the-wizards", "joanne-shaw-taylor", "louise-hoffsten", "joe-bonamassa"],
    sections: [
      {
        headingEn: "Welcome to This Week's Blues Dispatch",
        headingNo: "Velkommen til ukens blues-oppdatering",
        paragraphsEn: [
          "Hey blues family. Kjell here, writing to you on a Sunday evening from my home office with a cup of something warm and Knut Reiersrud's 'Voodoo Without Killing' spinning on the turntable. There's nothing quite like that record on a cold February night – it's the kind of blues that wraps around you like a blanket.",
          "This week's dispatch is packed. We've got birthday tributes to some of the greatest names in blues history, a very exciting release concert announcement from our friends in Kristiansand, fresh new album news, and something I've been wanting to talk about for a while: how YOU can help make SlowBlues.no even better. Let's dive in."
        ],
        paragraphsNo: [
          "Hei blues-familie. Kjell her, skriver til dere en søndagskveld fra hjemmekontoret med en kopp noe varmt og Knut Reiersruds 'Voodoo Without Killing' på platespilleren. Det finnes ikke noe bedre enn den plata en kald februarkveld – det er den typen blues som pakker seg rundt deg som et teppe.",
          "Ukens oppdatering er fullpakket. Vi har bursdagshyllester til noen av de største navnene i blueshistorien, en veldig spennende releasekonsert-kunngjøring fra våre venner i Kristiansand, ferske albumheter, og noe jeg har ønsket å snakke om en stund: hvordan DU kan hjelpe med å gjøre SlowBlues.no enda bedre. La oss dykke inn."
        ],
      },
      {
        headingEn: "🎂 February Birthdays: Legends Born This Month",
        headingNo: "🎂 Februar-bursdager: Legender født denne måneden",
        paragraphsEn: [
          "February is stacked with blues royalty. Let me walk you through the birthday roll call – and believe me, some of these names shaped everything we love about this music.",
          "Knut Reiersrud turned 65 on February 12. Norway's greatest blues export, the man who brought Saharan desert blues and Norwegian folk music together in ways nobody thought possible. If you haven't explored his profile on SlowBlues.no yet, do it now – the discography alone will keep you busy for an evening. He's proof that blues doesn't respect borders.",
          "Louise Hoffsten celebrated her 61st birthday on February 7. Sweden's blues queen has been a force since the late '80s, blending blues, rock, and Swedish folk with a voice that can go from a whisper to a storm in a heartbeat. Joanne Shaw Taylor, the British blues-rock powerhouse from the West Midlands, also has a February birthday – she turned 40 this month and shows no signs of slowing down. Meanwhile, Finnish sensation Ina Forsman turned 34 on February 10, continuing to prove that Scandinavian blues has a very bright future.",
          "But the historical birthday list is where it gets really heavy. Lonnie Johnson (February 8, 1899) – the man who essentially invented the guitar solo as we know it. Pink Anderson (February 12, 1900) – the Piedmont bluesman from Laurens, South Carolina, whose name Syd Barrett combined with that of another bluesman, Floyd Council, to create the band name 'Pink Floyd.' Kokomo Arnold (February 15, 1901) – whose 'Milk Cow Blues' has been covered by everyone from Elvis to The Kinks, and whose slide guitar work directly inspired Robert Johnson's 'Dust My Broom.' Josh White (February 11, 1914) – activist, folk-blues pioneer, the first Black musician to perform at the White House.",
          "And we remember Gary Moore, the Belfast-born blues-rock titan, who left us on February 6, 2011. Fifteen years gone, and his version of 'Still Got the Blues' still gives me chills every single time. What a tone. What a soul."
        ],
        paragraphsNo: [
          "Februar er stappfull av blues-royalty. La meg ta dere gjennom bursdagslisten – og tro meg, noen av disse navnene formet alt vi elsker med denne musikken.",
          "Knut Reiersrud fylte 65 den 12. februar. Norges største blueseksport, mannen som brakte saharisk ørkenblues og norsk folkemusikk sammen på måter ingen trodde var mulig. Har du ikke utforsket profilen hans på SlowBlues.no ennå, gjør det nå – diskografien alene holder deg opptatt en hel kveld. Han er beviset på at blues ikke respekterer grenser.",
          "Louise Hoffsten feiret sin 61. bursdag den 7. februar. Sveriges bluesdronning har vært en kraft siden slutten av 80-tallet, og blander blues, rock og svensk folkemusikk med en stemme som kan gå fra en hvisking til en storm i løpet av et hjerteslag. Joanne Shaw Taylor, den britiske bluesrock-kraftpakken fra West Midlands, har også bursdag i februar – hun fylte 40 denne måneden og viser ingen tegn til å bremse ned. Finske Ina Forsman fylte 34 den 10. februar og fortsetter å bevise at skandinavisk blues har en svært lys fremtid.",
          "Men den historiske bursdagslisten er der det virkelig blir tungt. Lonnie Johnson (8. februar 1899) – mannen som i praksis oppfant gitarsoloen slik vi kjenner den. Pink Anderson (12. februar 1900) – Piedmont-bluesmannen fra Laurens, South Carolina, hvis navn Syd Barrett kombinerte med en annen bluesmann, Floyd Council, for å skape bandnavnet 'Pink Floyd.' Kokomo Arnold (15. februar 1901) – som 'Milk Cow Blues' har blitt covret av alle fra Elvis til The Kinks, og hvis slidegitarspill direkte inspirerte Robert Johnsons 'Dust My Broom.' Josh White (11. februar 1914) – aktivist, folk-blues-pioner, den første svarte musikeren som opptrådte i Det hvite hus.",
          "Og vi minnes Gary Moore, den Belfast-fødte bluesrock-titanen, som forlot oss den 6. februar 2011. Femten år siden, og hans versjon av 'Still Got the Blues' gir meg fortsatt frysninger hver eneste gang. For en tone. For en sjel."
        ],
        artistMentions: ["knut-reiersrud", "louise-hoffsten", "joanne-shaw-taylor", "ina-forsman", "lonnie-johnson", "josh-white"],
      },
      {
        headingEn: "🔥 Oz & The Wizards Release Concert – March 7, Kristiansand",
        headingNo: "🔥 Oz & The Wizards releasekonsert – 7. mars, Kristiansand",
        paragraphsEn: [
          "Mark your calendars, people. Saturday, March 7, at Teateret in Kristiansand – Oz & The Wizards are playing a release concert, and if you're anywhere near Sørlandet, you need to be there.",
          "I've said it before and I'll keep saying it: Oz & The Wizards are doing something rare in the Norwegian blues scene. In a world full of cover bands doing their best Muddy Waters impression (and believe me, I love a good Muddy cover), this Kristiansand trio writes their own material. Original blues. Chicago and Delta-rooted, but with Oz's own unmistakable guitar signature all over it. Osmund 'Oz' Grytdahl, Oddvar Micaelsen, and Ole Louis Lilløy – these guys play with heart, grit, and a feel for the groove that you can't fake.",
          "The concert starts at 20:00, and tickets are available now through Teateret's website. Seriously, if you've been telling yourself you need to get out and hear some live blues – this is the one. Don't sleep on it. Check out their full profile right here on SlowBlues.no and grab those tickets before they're gone.",
          "👉 Tickets: https://teateret.no/event/oz-the-wizards | 👉 Full artist profile: https://slowblues.no/scandinavian-blues/oz-and-the-wizards"
        ],
        paragraphsNo: [
          "Sett kryss i kalenderen, folkens. Lørdag 7. mars på Teateret i Kristiansand – Oz & The Wizards holder releasekonsert, og er du i nærheten av Sørlandet, MÅ du være der.",
          "Jeg har sagt det før og jeg kommer til å fortsette å si det: Oz & The Wizards gjør noe sjeldent på den norske bluesscenen. I en verden full av coverband som gjør sitt beste Muddy Waters-imitasjon (og tro meg, jeg elsker en god Muddy-cover), skriver denne Kristiansand-trioen sitt eget materiale. Original blues. Forankret i Chicago og Delta, men med Oz sin umiskjennelige gitarsignatur over alt. Osmund 'Oz' Grytdahl, Oddvar Micaelsen og Ole Louis Lilløy – disse gutta spiller med hjerte, guts og en groove-følelse du ikke kan fake.",
          "Konserten starter kl. 20:00, og billetter er tilgjengelig nå via Teaterets nettside. Seriøst, har du fortalt deg selv at du trenger å komme ut og høre litt live blues – dette er den rette anledningen. Ikke sov på denne. Sjekk ut den fulle profilen deres her på SlowBlues.no og sikre deg billettene før de er borte.",
          "👉 Billetter: https://teateret.no/event/oz-the-wizards | 👉 Full artistprofil: https://slowblues.no/scandinavian-blues/oz-and-the-wizards"
        ],
        artistMentions: ["oz-and-the-wizards"],
      },
      {
        headingEn: "🎵 New Releases: Duke Robillard's 'Blast Off!' & More",
        headingNo: "🎵 Nye utgivelser: Duke Robillards 'Blast Off!' og mer",
        paragraphsEn: [
          "The new album pipeline keeps delivering. Duke Robillard – one of the true guitar masters of American roots music, co-founder of Roomful of Blues and a Fabulous Thunderbirds alumnus – drops 'Blast Off!' on February 20 via Nola Blue Records. If you know Duke's work, you know what to expect: impeccable tone, effortless swing, and the kind of musical sophistication that makes other guitarists quietly put their instruments back in the case.",
          "If you missed our coverage earlier this month, check out our February Blues Dispatch for the full story on Joe Bonamassa's landmark B.B. King centennial tribute album – one of the most important blues releases this year.",
          "Keep your ears open and your playlist fresh. That's what we're here for."
        ],
        paragraphsNo: [
          "Strømmen av nye album fortsetter. Duke Robillard – en av de sanne gitarmesterne i amerikansk rootsmusikk, medgrunnlegger av Roomful of Blues og Fabulous Thunderbirds-veteran – slipper 'Blast Off!' den 20. februar via Nola Blue Records. Kjenner du Dukes arbeid, vet du hva du kan forvente: upåklagelig tone, uanstrengt swing og en musikalsk sofistikering som får andre gitarister til å stille legge instrumentene tilbake i kassen.",
          "Gikk du glipp av dekningen vår tidligere denne måneden? Sjekk ut vår Februar Blues Dispatch for hele historien om Joe Bonamassas historiske B.B. King-hyllestalbum til 100-årsjubileet – en av årets viktigste bluesutgivelser.",
          "Hold ørene åpne og spillelisten fersk. Det er det vi er her for."
        ],
        artistMentions: ["joe-bonamassa", "bb-king", "kenny-wayne-shepherd", "bobby-rush"],
      },
      {
        headingEn: "📸 We Need YOUR Help: Artist Photos & Information Wanted!",
        headingNo: "📸 Vi trenger DIN hjelp: Artistbilder og informasjon søkes!",
        paragraphsEn: [
          "Okay, here's the honest truth. SlowBlues.no has grown to over 330 artist profiles across six regions, and I'm incredibly proud of what we've built. But some of our profiles – especially for Scandinavian and European artists – are still missing proper photos. And that's where you come in.",
          "We have a strict policy about images on this site: we only use photos that are openly available under Creative Commons licenses, verified public domain, or official press photos where the photographer has given explicit permission. We do NOT grab images from Google, social media, or anywhere else without proper licensing. This is non-negotiable. We respect the work of photographers just as much as we respect the work of the musicians we write about.",
          "So here's my plea: if you're a photographer who has shot blues artists live, or if you're an artist or manager with press photos you'd like to share, please reach out through our dedicated media contribution form. You can find it at https://slowblues.no/contribute – it's quick, and we'll make sure every photo is properly credited with the photographer's full name displayed directly beneath the image on the artist's profile page.",
          "The same goes for artist information. If you know details about an artist's history, discography, or collaborations that we're missing – especially for the Nordic scene – we'd love to hear from you. Every piece of verified information makes these profiles richer and more complete. Head to https://slowblues.no/contribute and help us build the most comprehensive blues resource on the web.",
          "And one more important note: we also have a special page for artists who want to register themselves or be suggested by fans for inclusion on the site. Visit https://slowblues.no/registrer-ny-artist to submit a new artist. Every submission is reviewed carefully."
        ],
        paragraphsNo: [
          "Okay, her er den ærlige sannheten. SlowBlues.no har vokst til over 330 artistprofiler fordelt på seks regioner, og jeg er utrolig stolt av det vi har bygget. Men noen av profilene våre – spesielt for skandinaviske og europeiske artister – mangler fortsatt ordentlige bilder. Og det er der du kommer inn i bildet.",
          "Vi har en streng policy om bilder på denne siden: vi bruker KUN bilder som er åpent tilgjengelig under Creative Commons-lisenser, verifisert i det offentlige domene, eller offisielle pressebilder der fotografen har gitt eksplisitt tillatelse. Vi henter IKKE inn bilder fra Google, sosiale medier eller andre steder uten riktig lisensiering. Dette er ikke til forhandling. Vi respekterer arbeidet til fotografer like mye som vi respekterer arbeidet til musikerne vi skriver om.",
          "Så her er min bønn: Er du fotograf som har fotografert bluesartister live, eller er du en artist eller manager med pressebilder du gjerne vil dele, ta kontakt via vårt dedikerte medieinnsendelsesskjema. Du finner det på https://slowblues.no/contribute – det er enkelt, og vi sørger for at hvert bilde blir behørig kreditert med fotografens fulle navn direkte under bildet på artistens profilside.",
          "Det samme gjelder for artistinformasjon. Vet du detaljer om en artists historie, diskografi eller samarbeid som vi mangler – spesielt for den nordiske scenen – vil vi gjerne høre fra deg. Hver bit av verifisert informasjon gjør disse profilene rikere og mer komplette. Gå til https://slowblues.no/contribute og hjelp oss med å bygge den mest omfattende bluesressursen på nettet.",
          "Og en viktig ting til: vi har også en egen side for artister som ønsker å registrere seg selv eller bli foreslått av fans for inkludering på siden. Besøk https://slowblues.no/registrer-ny-artist for å sende inn en ny artist. Hvert forslag gjennomgås grundig."
        ],
      },
      {
        headingEn: "🧠 Have You Taken the SlowBlues Blues Quiz Yet?",
        headingNo: "🧠 Har du tatt SlowBlues Blues Quiz ennå?",
        paragraphsEn: [
          "If you haven't tried our weekly Blues Quiz, you're missing out on one of the most fun features on the site. Every Monday we rotate a fresh set of 10 questions – 8 standard knowledge questions plus 2 audio challenges where you have to identify songs or artists by ear. Three difficulty levels: Easy, Medium, and Hard. There's a public leaderboard where you can see how you stack up against blues fans from around the world.",
          "And here's a bonus: when you register for the quiz, you also get signed up for our weekly SlowBlues.no newsletter, so you'll never miss a dispatch like this one. Head to slowblues.no/blues-quiz and show us what you know. Fair warning: the Hard level has humbled more than a few self-proclaimed blues experts."
        ],
        paragraphsNo: [
          "Har du ikke prøvd den ukentlige Blues Quizen vår ennå, går du glipp av en av de morsomste funksjonene på siden. Hver mandag roterer vi et ferskt sett med 10 spørsmål – 8 standard kunnskapsspørsmål pluss 2 lydutfordringer der du må identifisere sanger eller artister etter gehør. Tre vanskelighetsgrader: Lett, Middels og Vanskelig. Det er en offentlig poengtavle der du kan se hvordan du måler deg mot bluesfans fra hele verden.",
          "Og her er en bonus: når du registrerer deg for quizen, blir du også meldt på vårt ukentlige SlowBlues.no-nyhetsbrev, så du går aldri glipp av en oppdatering som denne. Gå til slowblues.no/blues-quiz og vis oss hva du kan. Rettferdig advarsel: Vanskelig-nivået har ydmyket mer enn noen få selvutnevnte blueseksperter."
        ],
      },
      {
        headingEn: "🌍 Spread the Word – Share SlowBlues.no!",
        headingNo: "🌍 Spre ordet – del SlowBlues.no!",
        paragraphsEn: [
          "One last thing before I go. SlowBlues.no is a labour of love – one person's obsession with keeping the blues alive and documented, growing one profile at a time. We don't have a marketing department or a big advertising budget. What we have is you – our readers, our community, our blues family.",
          "If you enjoy what we're building here, please share it. Send this newsletter to a friend. Post a link on your social media. Mention us in your blues group. Tell that guitarist in your band about the 330+ profiles we have. Every share helps us reach someone new who might fall in love with the blues the same way we did.",
          "Thank you for being part of this. The blues is alive, and together we're keeping the story going. See you next week – and hopefully at Teateret in Kristiansand on March 7! 🎸",
          "#SlowBlues #BluesMusic #BluesArtists #BluesGuitar #BluesHistory #OzAndTheWizards #KristiansandBlues"
        ],
        paragraphsNo: [
          "Én siste ting før jeg går. SlowBlues.no er et hjertebarn – én persons besettelse med å holde bluesen levende og dokumentert, som vokser én profil av gangen. Vi har ingen markedsavdeling eller stort reklamebudsjett. Det vi har er dere – leserne våre, fellesskapet vårt, blues-familien vår.",
          "Hvis du setter pris på det vi bygger her, vennligst del det. Send dette nyhetsbrevet til en venn. Legg ut en lenke på sosiale medier. Nevn oss i bluesgruppen din. Fortell gitaristen i bandet ditt om de 330+ profilene vi har. Hver deling hjelper oss å nå noen nye som kanskje forelsker seg i bluesen på samme måte som vi gjorde.",
          "Takk for at du er med på dette. Bluesen lever, og sammen holder vi historien gående. Vi sees neste uke – og forhåpentligvis på Teateret i Kristiansand den 7. mars! 🎸",
          "#SlowBlues #BluesMusikk #BluesArtister #BluesGitar #BluesHistorie #OzAndTheWizards #KristiansandBlues"
        ],
        artistMentions: ["oz-and-the-wizards"],
      },
    ],
  },
  {
    id: "european-blues-roundup-february-2026",
    titleEn: "European Blues Roundup: Walter Trout's BMA Nomination, Black Crowes European Tour, Ana Popovic on Fire & a Rare Freddie King Vinyl",
    titleNo: "Europeisk blues-oppsummering: Walter Trouts BMA-nominasjon, Black Crowes på Europa-turné, Ana Popovic i storform og sjelden Freddie King-vinyl",
    excerptEn: "Europe is buzzing with blues energy right now. Walter Trout earns a well-deserved BMA nomination, The Black Crowes announce a summer European tour, Ana Popovic's 'Dance To The Rhythm' tour tears through the continent, a never-before-heard Freddie King live recording surfaces from a 1975 French jazz festival, and we remember the musicians we've lost. Plus: Joanne Shaw Taylor hits the road again.",
    excerptNo: "Europa bruser av bluesenergi akkurat nå. Walter Trout får en velfortjent BMA-nominasjon, The Black Crowes annonserer europeisk sommerturné, Ana Popovics 'Dance To The Rhythm'-turné river gjennom kontinentet, en aldri-før-hørt Freddie King-liveinnspilling dukker opp fra en fransk jazzfestival i 1975, og vi minnes musikerne vi har mistet. I tillegg: Joanne Shaw Taylor er på veien igjen.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2026-02-19",
    modifiedDate: "2026-02-19",
    category: "European Blues",
    categoryNo: "Europeisk blues",
    readingTimeMin: 11,
    keywordsEn: ["european blues 2026", "Walter Trout Sign Of The Times", "Black Crowes European tour 2026", "Ana Popovic Dance To The Rhythm", "Freddie King Nancy Jazz Pulsation vinyl", "Joanne Shaw Taylor 2026 tour", "blues deaths 2026", "blues music awards nominees europe"],
    keywordsNo: ["europeisk blues 2026", "Walter Trout Sign Of The Times", "Black Crowes Europa-turné 2026", "Ana Popovic Dance To The Rhythm", "Freddie King Nancy Jazz Pulsation vinyl", "Joanne Shaw Taylor 2026 turné", "blues dødsfall 2026", "blues music awards nominasjoner europa"],
    relatedArtistIds: ["walter-trout", "joanne-shaw-taylor", "freddie-king", "eric-clapton"],
    sections: [
      {
        headingEn: "Europe Keeps the Blues Burning",
        headingNo: "Europa holder bluesflammen brennende",
        paragraphsEn: [
          "Hey blues family. Kjell here with something a bit different this week – a deep dive into what's happening in the European blues world right now. And I'll tell you: it's a lot. The Blues Music Awards nominees dropped this week, and European-connected artists are well represented. Tours are being announced. Rare recordings are surfacing. And the blues community has also lost some voices we need to honour.",
          "Grab a coffee (or something stronger), and let's talk about what's happening on this side of the Atlantic."
        ],
        paragraphsNo: [
          "Hei blues-familie. Kjell her med noe litt annerledes denne uka – et dypdykk i hva som skjer i den europeiske bluesverdenen akkurat nå. Og jeg skal si dere: det er mye. Blues Music Awards-nominasjonene ble sluppet denne uka, og europeisk-tilknyttede artister er godt representert. Turnéer annonseres. Sjeldne innspillinger dukker opp. Og blues-fellesskapet har også mistet noen stemmer vi må hedre.",
          "Ta en kaffe (eller noe sterkere), og la oss snakke om hva som skjer på denne siden av Atlanteren."
        ],
      },
      {
        headingEn: "🎸 Walter Trout – 'Sign Of The Times' and a BMA Nomination He Deserves",
        headingNo: "🎸 Walter Trout – 'Sign Of The Times' og en BMA-nominasjon han fortjener",
        paragraphsEn: [
          "Let's start with the big one. Walter Trout – born in New Jersey, but a man who built his legend in Europe. For those who don't know the story: Trout spent years as a sideman for John Lee Hooker and Canned Heat before moving to Europe in the late '80s, where he became one of the continent's most beloved blues-rock guitarists. He's been based between the US and Europe ever since, and European fans have always claimed him as one of their own.",
          "His album 'Sign Of The Times,' released in September 2025 on Provogue Records, is now nominated for Blues Rock Album at the 2026 Blues Music Awards. And honestly? It's about time. This is a hard-rocking, uncompromising record – part social commentary, part personal reckoning, all Walter. The man survived a liver transplant in 2014, powered through by the financial goodwill of his fans, and came out the other side playing harder than ever.",
          "Blues Matters Magazine called it 'raw truth with searing guitar work.' I'd add: it's the sound of a man who knows exactly how precious time is. Every riff on this album feels earned. Walter Trout is 73 and plays like a man possessed. He's also nominated for Blues Rock Artist alongside Kenny Wayne Shepherd, Ana Popovic, Kirk Fletcher, and Tommy Castro. If he wins, nobody will argue. If he doesn't, this album still stands as one of his best.",
          "European tour dates are expected to be announced soon – keep your eyes on his website. When Walter plays the European festival circuit, he owns it."
        ],
        paragraphsNo: [
          "La oss starte med den store. Walter Trout – født i New Jersey, men en mann som bygget sin legende i Europa. For de som ikke kjenner historien: Trout tilbrakte år som sidemann for John Lee Hooker og Canned Heat før han flyttet til Europa på slutten av 80-tallet, der han ble en av kontinentets mest elskede blues-rock-gitarister. Han har vært basert mellom USA og Europa siden, og europeiske fans har alltid sett på ham som en av sine egne.",
          "Albumet hans 'Sign Of The Times,' utgitt i september 2025 på Provogue Records, er nå nominert for Blues Rock Album ved 2026 Blues Music Awards. Og ærlig talt? Det er på tide. Dette er en hardtrockende, kompromissløs plate – dels sosial kommentar, dels personlig oppgjør, 100% Walter. Mannen overlevde en levertransplantasjon i 2014, drevet frem av den økonomiske velviljen til fansen, og kom ut på den andre siden og spilte hardere enn noensinne.",
          "Blues Matters Magazine kalte det 'rå sannhet med svidende gitararbeid.' Jeg vil legge til: det er lyden av en mann som vet nøyaktig hvor dyrebart tid er. Hvert riff på dette albumet føles fortjent. Walter Trout er 73 og spiller som en besatt mann. Han er også nominert for Blues Rock Artist sammen med Kenny Wayne Shepherd, Ana Popovic, Kirk Fletcher og Tommy Castro. Hvis han vinner, vil ingen argumentere. Hvis han ikke gjør det, står dette albumet fortsatt som et av hans beste.",
          "Europeiske turnédatoer forventes annonsert snart – hold øynene på nettsiden hans. Når Walter spiller den europeiske festivalrunden, eier han den."
        ],
        artistMentions: ["walter-trout", "kenny-wayne-shepherd"],
      },
      {
        headingEn: "🇬🇧 Joanne Shaw Taylor – US Spring Tour & Still on the Rise",
        headingNo: "🇬🇧 Joanne Shaw Taylor – USA-vårturné og fortsatt på vei opp",
        paragraphsEn: [
          "Britain's Joanne Shaw Taylor keeps building momentum. After a successful run of UK dates in January 2026, she's now announced a US Spring Tour kicking off March 18 in Skokie, Illinois, running through April across the East Coast and Southeast. She turned 40 in February and shows absolutely no signs of slowing down.",
          "Discovered by Dave Stewart of Eurythmics at age 16, JST has evolved from a teenage prodigy into one of the most respected blues-rock guitarists on the planet. Her partnership with Joe Bonamassa's KTBA Records has given her the platform her talent always deserved, and she's making the most of it. Her latest album features some of her strongest songwriting yet – emotional, raw, and unmistakably British in its sensibility.",
          "If you're in the US this spring, catch her live. If you're in Europe, expect festival appearances this summer. And if you haven't checked out her full profile on SlowBlues.no, now's the time – she's one of the most important voices in modern blues."
        ],
        paragraphsNo: [
          "Britiske Joanne Shaw Taylor fortsetter å bygge momentum. Etter en vellykket runde med britiske datoer i januar 2026 har hun nå annonsert en USA-vårturné som starter 18. mars i Skokie, Illinois, og går gjennom april langs østkysten og sørøst. Hun fylte 40 i februar og viser absolutt ingen tegn til å bremse ned.",
          "Oppdaget av Dave Stewart fra Eurythmics som 16-åring, har JST utviklet seg fra et tenåringsvidunderbarn til en av de mest respekterte blues-rock-gitaristene på planeten. Partnerskapet hennes med Joe Bonamassas KTBA Records har gitt henne plattformen talentet alltid fortjente, og hun utnytter det til fulle. Det siste albumet hennes har noe av hennes sterkeste låtskriving hittil – emosjonell, rå og umiskjennelig britisk i sitt uttrykk.",
          "Er du i USA denne våren, ta henne live. Er du i Europa, forvent festivalopptredener denne sommeren. Og har du ikke sjekket ut den fulle profilen hennes på SlowBlues.no ennå, er det nå det er tid – hun er en av de viktigste stemmene i moderne blues."
        ],
        artistMentions: ["joanne-shaw-taylor", "joe-bonamassa"],
      },
      {
        headingEn: "🇷🇸 Ana Popovic – 'Dance To The Rhythm' Tour Is Pure Energy",
        headingNo: "🇷🇸 Ana Popovic – 'Dance To The Rhythm'-turnéen er ren energi",
        paragraphsEn: [
          "Serbian-born, LA-based Ana Popovic is tearing through her 'Dance To The Rhythm' tour right now, and the reviews are glowing. Her album of the same name, released in September 2025, has earned her a nomination for Blues Rock Artist at the 2026 Blues Music Awards alongside Walter Trout and Kenny Wayne Shepherd – and she belongs in that company.",
          "I'll be honest: Ana Popovic doesn't get the recognition she deserves from casual blues fans. But anyone who's seen her live knows. Guitar World called her 'a badass with a silver Strat' and they're not wrong. She plays with a ferocity and precision that's genuinely jaw-dropping, blending blues, rock, and funk into something completely her own. The 'Dance To The Rhythm' album is her best yet – confident, groovy, and bursting with personality.",
          "She's played dates across the US this February, including stops in Florida and Virginia, with European festival dates expected for summer. Ana grew up in Belgrade learning her craft from her father, and she carries that European blues spirit everywhere she goes. If she comes to a venue near you, do not miss her. You'll thank me later."
        ],
        paragraphsNo: [
          "Serbiskfødte, LA-baserte Ana Popovic river seg gjennom sin 'Dance To The Rhythm'-turné akkurat nå, og anmeldelsene lyser. Albumet med samme navn, utgitt i september 2025, har gitt henne en nominasjon for Blues Rock Artist ved 2026 Blues Music Awards sammen med Walter Trout og Kenny Wayne Shepherd – og hun hører hjemme i det selskapet.",
          "Jeg skal være ærlig: Ana Popovic får ikke den anerkjennelsen hun fortjener fra tilfeldige bluesfans. Men alle som har sett henne live, vet. Guitar World kalte henne 'en badass med en sølv-Strat,' og de har ikke feil. Hun spiller med en voldsomhet og presisjon som er genuint kjevedropp-verdig, og blander blues, rock og funk til noe helt eget. 'Dance To The Rhythm'-albumet er hennes beste hittil – selvsikkert, groovy og sprenger av personlighet.",
          "Hun har spilt datoer over hele USA denne februar, inkludert stopp i Florida og Virginia, med europeiske festivaldatoer forventet til sommeren. Ana vokste opp i Beograd og lærte faget sitt av faren sin, og hun bærer den europeiske blues-ånden overalt hun drar. Kommer hun til en scene nær deg, ikke gå glipp av det. Du vil takke meg senere."
        ],
      },
      {
        headingEn: "🎤 The Black Crowes Announce Summer European Tour – Blues-Rock Is Coming Home",
        headingNo: "🎤 The Black Crowes annonserer europeisk sommerturné – bluesrocken kommer hjem",
        paragraphsEn: [
          "This one made my week. The Black Crowes – Chris and Rich Robinson's genre-defying blues-rock institution – announced a UK and European summer tour on February 9. Their first UK shows since the celebrated 2024 appearance at London's Eventim Apollo (where Steven Tyler joined them on stage while Jimmy Page watched from the wings, because of course he did).",
          "The tour includes dates in Manchester, plus appearances at festivals including the inaugural State Fayre festival. They've also announced an extensive North American tour running from May through August, with the new album 'A Pound of Feathers' as the centerpiece.",
          "Now, I know what some of you are thinking: 'Kjell, are the Black Crowes really blues?' And my answer is: listen to 'Shake Your Money Maker' and tell me that isn't blues at its core. Chris Robinson's vocal style is drenched in Otis Redding and Muddy Waters. Rich Robinson's guitar work pulls from the same well that fed the Rolling Stones. This is blues-rock in the most honest tradition – Southern-fried, swaggering, and completely unapologetic.",
          "European dates and tickets at https://www.theblackcrowes.com. If you're a fan of blues-influenced rock, this is one of the must-see tours of summer 2026."
        ],
        paragraphsNo: [
          "Denne gjorde uka mi. The Black Crowes – Chris og Rich Robinsons sjangertrotsende bluesrock-institusjon – annonserte en britisk og europeisk sommerturné den 9. februar. Deres første britiske show siden den feirede 2024-opptredenen på Londons Eventim Apollo (der Steven Tyler ble med dem på scenen mens Jimmy Page så på fra kulissene, fordi selvfølgelig gjorde han det).",
          "Turnéen inkluderer datoer i Manchester, pluss opptredener på festivaler inkludert den første State Fayre-festivalen. De har også annonsert en omfattende nordamerikansk turné fra mai til august, med det nye albumet 'A Pound of Feathers' som midtpunkt.",
          "Nå vet jeg hva noen av dere tenker: 'Kjell, er Black Crowes virkelig blues?' Og svaret mitt er: lytt til 'Shake Your Money Maker' og fortell meg at det ikke er blues i kjernen. Chris Robinsons vokalstil er gjennomvåt av Otis Redding og Muddy Waters. Rich Robinsons gitararbeid henter fra den samme kilden som matet The Rolling Stones. Dette er bluesrock i den mest ærlige tradisjonen – sørstatsstekt, svaiende og helt uten unnskyldninger.",
          "Europeiske datoer og billetter på https://www.theblackcrowes.com. Er du fan av bluespåvirket rock, er dette en av sommerens 2026 must-see-turnéer."
        ],
      },
      {
        headingEn: "📀 Rare Freddie King Live Recording Surfaces from 1975 French Jazz Festival",
        headingNo: "📀 Sjelden Freddie King-liveinnspilling dukker opp fra fransk jazzfestival i 1975",
        paragraphsEn: [
          "This story gave me chills. A previously unreleased live performance from Freddie King – one of the 'Three Kings' of blues guitar – has been unearthed and is getting a special vinyl release this spring for Record Store Day. 'Feeling Alright: The Complete 1975 Nancy Jazz Pulsation Concerts' captures Freddie performing at the Nancy Jazz Pulsation festival in France, and it's never been heard before.",
          "For context: Freddie King died in December 1976 at just 42 years old. This recording, made barely a year before his death, captures him at the height of his explosive power – that aggressive Texas attack, those stinging bends, the raw energy that made him a guitarist's guitarist. The fact that this was recorded in France is a beautiful reminder that European audiences have always had deep appreciation for the blues. While America sometimes forgot its own legends, Europe kept them working.",
          "This will be a vinyl-only release for Record Store Day 2026. If your local record shop participates, get there early. Freddie King recordings don't surface often, and this one is historic."
        ],
        paragraphsNo: [
          "Denne historien ga meg frysninger. En tidligere uutgitt live-opptreden fra Freddie King – en av 'De tre kongene' i bluesgitar – har blitt gravd frem og får en spesiell vinylutgivelse denne våren til Record Store Day. 'Feeling Alright: The Complete 1975 Nancy Jazz Pulsation Concerts' fanger Freddie som opptrer på Nancy Jazz Pulsation-festivalen i Frankrike, og den har aldri blitt hørt før.",
          "For kontekst: Freddie King døde i desember 1976, bare 42 år gammel. Denne innspillingen, gjort knapt et år før hans død, fanger ham på høyden av sin eksplosive kraft – det aggressive Texas-angrepet, de stikkende bøyningene, den rå energien som gjorde ham til en gitaristenes gitarist. At dette ble innspilt i Frankrike er en vakker påminnelse om at europeiske publikummere alltid har hatt dyp verdsetting for bluesen. Mens Amerika noen ganger glemte sine egne legender, holdt Europa dem i arbeid.",
          "Dette blir en vinyl-only utgivelse for Record Store Day 2026. Deltar den lokale platebutikken din, kom tidlig. Freddie King-innspillinger dukker ikke opp ofte, og denne er historisk."
        ],
        artistMentions: ["freddie-king"],
      },
      {
        headingEn: "🕯️ In Memoriam: Blues Voices We Lost Recently",
        headingNo: "🕯️ In Memoriam: Bluesstemmer vi har mistet nylig",
        paragraphsEn: [
          "The blues community has lost some voices recently, and they deserve to be remembered. Microwave Dave – born David Gallaher – died on February 7, 2026, at the age of 80. Based in Huntsville, Alabama, Microwave Dave was a beloved local blues institution. He wasn't famous in the mainstream sense, but he was the kind of musician who kept the blues alive in his community for decades – the guy at the juke joint, the one who taught the next generation, the one who played because the music demanded it.",
          "Marsha Evans, the St. Louis blues singer known for her work with the Georgettes, also passed away recently at 75. And Big Joe Fitz (1949–2026), a fixture of the Hudson Valley blues scene in New York, left us as well.",
          "These are the people who don't get Rolling Stone obituaries, but they're the backbone of the blues. Every local scene has its Microwave Daves, its Marsha Evanses, its Big Joe Fitzes – musicians who play for the love of it, who keep the tradition breathing in bars and clubs and community halls across the world. When they leave us, the blues gets a little quieter. And that's why we need to keep telling their stories.",
          "Rest in blues, all of you. The music you made mattered more than you probably knew."
        ],
        paragraphsNo: [
          "Blues-fellesskapet har mistet noen stemmer nylig, og de fortjener å bli husket. Microwave Dave – født David Gallaher – døde den 7. februar 2026, i en alder av 80. Basert i Huntsville, Alabama, var Microwave Dave en elsket lokal blues-institusjon. Han var ikke berømt i mainstream-forstand, men han var den typen musiker som holdt bluesen levende i sitt lokalsamfunn i tiår – fyren på juke joint'en, han som lærte neste generasjon, han som spilte fordi musikken krevde det.",
          "Marsha Evans, bluessangerinnen fra St. Louis kjent for sitt arbeid med the Georgettes, gikk også bort nylig, 75 år gammel. Og Big Joe Fitz (1949–2026), en fast inventar på Hudson Valley-bluesscenen i New York, forlot oss også.",
          "Dette er menneskene som ikke får Rolling Stone-nekrologer, men de er bluesen ryggrad. Hver lokal scene har sine Microwave Daver, sine Marsha Evanser, sine Big Joe Fitzer – musikere som spiller for kjærligheten til det, som holder tradisjonen pustende i barer og klubber og forsamlingshus over hele verden. Når de forlater oss, blir bluesen litt stillere. Og det er derfor vi må fortsette å fortelle historiene deres.",
          "Hvil i blues, alle sammen. Musikken dere lagde betød mer enn dere sannsynligvis visste."
        ],
      },
      {
        headingEn: "🎯 What to Watch: European Blues Calendar Spring 2026",
        headingNo: "🎯 Hold utkikk: Europeisk blueskalender våren 2026",
        paragraphsEn: [
          "Let me give you a quick overview of what's coming up on the European blues calendar. Joanne Shaw Taylor: US Spring Tour March–April, European festivals expected summer. The Black Crowes: UK and European dates June–July, including Manchester and State Fayre festival. Ana Popovic: 'Dance To The Rhythm' tour continues through spring, European dates TBA. Walter Trout: European festival season expected summer 2026 – watch his website. Freddie King 'Feeling Alright' vinyl: Record Store Day exclusive, spring 2026.",
          "And don't forget: right here in Norway, Oz & The Wizards play their release concert at Teateret in Kristiansand on March 7. Tickets: https://teateret.no/event/oz-the-wizards. That's the first big blues event of the spring in Sørlandet, and I'll be there.",
          "Europe has always been a second home for the blues. From the British Invasion players who learned their craft from Muddy and Wolf, to the thriving scenes in Scandinavia, the Netherlands, France, and beyond – this music belongs to us just as much as it belongs to the Mississippi Delta. Let's keep supporting it. See you at the gigs. 🎸"
        ],
        paragraphsNo: [
          "La meg gi dere en kjapp oversikt over hva som kommer på den europeiske blueskalenderen. Joanne Shaw Taylor: USA-vårturné mars–april, europeiske festivaler forventet sommer. The Black Crowes: britiske og europeiske datoer juni–juli, inkludert Manchester og State Fayre-festivalen. Ana Popovic: 'Dance To The Rhythm'-turnéen fortsetter gjennom våren, europeiske datoer TBA. Walter Trout: europeisk festivalsesong forventet sommer 2026 – følg med på nettsiden hans. Freddie King 'Feeling Alright'-vinyl: Record Store Day-eksklusiv, våren 2026.",
          "Og ikke glem: her i Norge spiller Oz & The Wizards releasekonsert på Teateret i Kristiansand den 7. mars. Billetter: https://teateret.no/event/oz-the-wizards. Det er den første store blues-hendelsen våren på Sørlandet, og jeg kommer til å være der.",
          "Europa har alltid vært et andre hjem for bluesen. Fra British Invasion-spillerne som lærte faget sitt av Muddy og Wolf, til de blomstrende scenene i Skandinavia, Nederland, Frankrike og utover – denne musikken tilhører oss like mye som den tilhører Mississippi-deltaet. La oss fortsette å støtte den. Vi sees på giggene. 🎸"
        ],
        artistMentions: ["joanne-shaw-taylor", "walter-trout", "oz-and-the-wizards"],
      },
    ],
  },
  {
    id: "weekly-blues-dispatch-week-09-2026",
    titleEn: "Weekly Blues Dispatch (Week 09): Blues Music Awards Nominees, BluesGig Launch & Duke Robillard's New Album!",
    titleNo: "Ukentlig blues-oppdatering (uke 09): Blues Music Awards-nominasjoner, BluesGig-lansering og Duke Robillards nye album!",
    excerptEn: "The Blues Foundation just dropped the 2026 Blues Music Awards nominees – and it's a stacked field. Plus: we introduce BluesGig, our new all-in-one tool for Nordic blues clubs, Duke Robillard drops 'Blast Off!', and Oz & The Wizards' release concert is just two weeks away!",
    excerptNo: "The Blues Foundation har nettopp sluppet 2026 Blues Music Awards-nominasjonene – og det er et stappfullt felt. I tillegg: vi introduserer BluesGig, vårt nye alt-i-ett-verktøy for nordiske bluesklubber, Duke Robillard slipper 'Blast Off!', og Oz & The Wizards sin releasekonsert er bare to uker unna!",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2026-02-23",
    modifiedDate: "2026-02-23",
    category: "Weekly Dispatch",
    categoryNo: "Ukentlig oppdatering",
    readingTimeMin: 10,
    keywordsEn: ["blues music awards 2026 nominees", "BluesGig blues club tool", "Duke Robillard Blast Off", "Oz and The Wizards concert", "blues news february 2026", "Christone Kingfish Ingram", "Buddy Guy", "Samantha Fish", "Walter Trout", "Kenny Wayne Shepherd"],
    keywordsNo: ["blues music awards 2026 nominasjoner", "BluesGig bluesklubber verktøy", "Duke Robillard Blast Off", "Oz and The Wizards konsert", "blues-nyheter februar 2026", "Christone Kingfish Ingram", "Buddy Guy", "Samantha Fish", "Walter Trout", "Kenny Wayne Shepherd"],
    relatedArtistIds: ["buddy-guy", "kenny-wayne-shepherd", "walter-trout", "joe-bonamassa", "bobby-rush", "oz-and-the-wizards"],
    sections: [
      {
        headingEn: "Welcome to This Week's Blues Dispatch",
        headingNo: "Velkommen til ukens blues-oppdatering",
        paragraphsEn: [
          "Hey blues family. Kjell here, writing to you on a Sunday evening with a strong coffee and Duke Robillard's brand-new 'Blast Off!' on the speakers. What a week it's been. The Blues Foundation dropped their 2026 nominees list on Tuesday, and I've been going through it like a kid in a candy store. So much to talk about.",
          "But that's not all. This week I'm also excited to officially introduce something we've been building behind the scenes: BluesGig – a brand-new digital tool made specifically for blues clubs, jazz associations, and small festivals here in the Nordics. More on that below. Plus: Duke Robillard's new album is out, and the Oz & The Wizards release concert in Kristiansand is now just two weeks away. Let's dive in."
        ],
        paragraphsNo: [
          "Hei blues-familie. Kjell her, skriver til dere en søndagskveld med en sterk kaffe og Duke Robillards splitter nye 'Blast Off!' på høyttalerne. For en uke det har vært. The Blues Foundation slapp 2026-nominasjonslisten på tirsdag, og jeg har gått gjennom den som en unge i en godtebutikk. Så mye å snakke om.",
          "Men det er ikke alt. Denne uka er jeg også spent på å offisielt presentere noe vi har bygget bak kulissene: BluesGig – et helt nytt digitalt verktøy laget spesielt for bluesklubber, jazzforeninger og små festivaler her i Norden. Mer om det nedenfor. I tillegg: Duke Robillards nye album er ute, og Oz & The Wizards sin releasekonsert i Kristiansand er rett rundt hjørnet. La oss dykke inn."
        ],
      },
      {
        headingEn: "🏆 2026 Blues Music Awards Nominees – The Full Breakdown",
        headingNo: "🏆 2026 Blues Music Awards-nominasjoner – den fulle oversikten",
        paragraphsEn: [
          "The Blues Foundation announced the nominees for the 47th annual Blues Music Awards on February 18, and the ceremony takes place May 7 in Memphis, Tennessee. Let me hit the highlights, because this year's field is seriously stacked.",
          "Album of the Year nominees include Bobby Rush & Kenny Wayne Shepherd's 'Young Fashioned Ways' (which we covered extensively in our Grammy dispatch), D.K. Harrell's 'Talkin' Heavy,' Larry McCray's 'Heartbreak City,' Tommy Castro & The Painkillers' 'Closer To The Bone,' and Blood Brothers Mike Zito & Albert Castiglia's 'Help Yourself.' That's an incredibly strong lineup. I'd have a hard time choosing a winner.",
          "In the Blues Rock category, Walter Trout gets a well-deserved nod for 'Sign Of The Times,' alongside Kent Burnside's 'Hill Country Blood' (Hill Country blues getting recognition always makes me happy), and Devon Allman's 'BLUES SUMMIT.' For Blues Rock Artist, it's Kenny Wayne Shepherd, Walter Trout, Ana Popovic, Kirk Fletcher, and Tommy Castro. Can't argue with any of those names.",
          "Christone 'Kingfish' Ingram is nominated for Contemporary Blues Male Artist alongside D.K. Harrell and Brandon Santini. Samantha Fish and Vanessa Collier are both up for Contemporary Blues Female Artist. And Tedeschi Trucks Band is nominated for Band of the Year – they're the kind of band that makes you believe live music can still change the world.",
          "For B.B. King Entertainer of the Year, Ruthie Foster and Vanessa Collier are joined by Rick Estrin, Ronnie Baker Brooks, and Castro Coleman (Mr. Sipp). And in the harmonica category, Billy Branch – whose 'The Blues Is My Biography' we highlighted last week – is nominated alongside Kim Wilson, Brandon Santini, Bob Corritore, and John Nemeth.",
          "Full list of nominees at https://blues.org. Mark your calendars for May 7 – Memphis is the place to be."
        ],
        paragraphsNo: [
          "The Blues Foundation annonserte nominasjonene til den 47. årlige Blues Music Awards den 18. februar, og seremonien finner sted 7. mai i Memphis, Tennessee. La meg gå gjennom høydepunktene, for årets felt er seriøst stappfullt.",
          "Album of the Year-nominasjoner inkluderer Bobby Rush & Kenny Wayne Shepherds 'Young Fashioned Ways' (som vi dekket grundig i vår Grammy-oppdatering), D.K. Harrells 'Talkin' Heavy,' Larry McCrays 'Heartbreak City,' Tommy Castro & The Painkillers' 'Closer To The Bone,' og Blood Brothers Mike Zito & Albert Castiglias 'Help Yourself.' Det er en utrolig sterk lineup. Jeg ville hatt det vanskelig med å velge en vinner.",
          "I Blues Rock-kategorien får Walter Trout en velfortjent nominasjon for 'Sign Of The Times,' sammen med Kent Burnsides 'Hill Country Blood' (at Hill Country-blues får anerkjennelse gjør meg alltid glad), og Devon Allmans 'BLUES SUMMIT.' For Blues Rock Artist er det Kenny Wayne Shepherd, Walter Trout, Ana Popovic, Kirk Fletcher og Tommy Castro. Kan ikke krangle med noen av de navnene.",
          "Christone 'Kingfish' Ingram er nominert for Contemporary Blues Male Artist sammen med D.K. Harrell og Brandon Santini. Samantha Fish og Vanessa Collier er begge oppe for Contemporary Blues Female Artist. Og Tedeschi Trucks Band er nominert for Band of the Year – de er den typen band som får deg til å tro at livemusikk fortsatt kan forandre verden.",
          "For B.B. King Entertainer of the Year er Ruthie Foster og Vanessa Collier sammen med Rick Estrin, Ronnie Baker Brooks og Castro Coleman (Mr. Sipp). Og i munnspill-kategorien er Billy Branch – hvis 'The Blues Is My Biography' vi fremhevet forrige uke – nominert sammen med Kim Wilson, Brandon Santini, Bob Corritore og John Nemeth.",
          "Full liste over nominerte på https://blues.org. Sett kryss i kalenderen for 7. mai – Memphis er stedet å være."
        ],
        artistMentions: ["kenny-wayne-shepherd", "walter-trout", "bobby-rush", "joe-bonamassa"],
      },
      {
        headingEn: "🚀 Introducing BluesGig – A New Tool for Nordic Blues Clubs & Festivals",
        headingNo: "🚀 Vi lanserer BluesGig – et nytt verktøy for nordiske bluesklubber og festivaler",
        paragraphsEn: [
          "Okay, this is something I've been wanting to share with you for a while. If you run a blues club, jazz association, or small festival in Norway, Sweden, or Denmark, you know the pain: spreadsheets for accounting, Word documents for contracts, Photoshop for posters, and endless email chains for everything else. It's a mess. I know, because I've lived it.",
          "That's why we've been building BluesGig (https://www.bluesgig.com/) – an all-in-one web tool designed specifically for Nordic music organisers. Here's what it does: event creation with a simple wizard, AI-generated concert posters in seconds, automatic artist contracts adapted to Norwegian, Swedish, and Danish law, VAT compensation reports with one click, AI-powered marketing tools for newsletters and social media, and integration with external ticketing systems like TicketCo and Billetto.",
          "The whole thing is available in Norwegian, Swedish, and Danish. It's built to understand the Nordic way of running a music association – the momskompensasjon, the foreningsregnskap, the volunteer-run reality. No American enterprise software trying to shoehorn Nordic clubs into a Silicon Valley template. This is built by us, for us.",
          "Interested in trying BluesGig? One event per month is free – no credit card needed. Request access at https://www.bluesgig.com/ and we'll get you set up. If you know someone who runs a blues club or jazz association, please share this with them. We want to make the admin side of live blues as painless as possible, so organisers can focus on what matters: the music.",
          "Read the full promo page with features, pricing, and our international roadmap right here on SlowBlues: https://slowblues.no/bluesgig"
        ],
        paragraphsNo: [
          "Okay, dette er noe jeg har ønsket å dele med dere en stund. Driver du en bluesklubb, jazzforening eller liten festival i Norge, Sverige eller Danmark, kjenner du smerten: regneark for regnskap, Word-dokumenter for kontrakter, Photoshop for plakater, og endeløse e-posttråder for alt annet. Det er et rot. Jeg vet, for jeg har levd det.",
          "Derfor har vi bygget BluesGig (https://www.bluesgig.com/) – et alt-i-ett nettbasert verktøy designet spesifikt for nordiske musikkorganisatorer. Her er hva det gjør: event-opprettelse med en enkel veiviser, AI-genererte konsertplakater på sekunder, automatiske artistkontrakter tilpasset norsk, svensk og dansk lovverk, momskompensasjonsrapporter med ett klikk, AI-drevne markedsføringsverktøy for nyhetsbrev og sosiale medier, og integrering med eksterne billettsystemer som TicketCo og Billetto.",
          "Hele greia er tilgjengelig på norsk, svensk og dansk. Det er bygget for å forstå den nordiske måten å drive en musikkforening på – momskompensasjonen, foreningsregnskapet, den frivilligdrevne virkeligheten. Ingen amerikansk enterprise-programvare som prøver å presse nordiske klubber inn i en Silicon Valley-mal. Dette er bygget av oss, for oss.",
          "Interessert i å prøve BluesGig? Ett event per måned er gratis – ingen kredittkort nødvendig. Be om tilgang på https://www.bluesgig.com/ så hjelper vi deg i gang. Kjenner du noen som driver en bluesklubb eller jazzforening, del gjerne dette med dem. Vi ønsker å gjøre admin-siden av live blues så smertefri som mulig, slik at arrangører kan fokusere på det som betyr noe: musikken.",
          "Les den fulle promosiden med funksjoner, priser og vår internasjonale roadmap her på SlowBlues: https://slowblues.no/bluesgig"
        ],
      },
      {
        headingEn: "🎵 Duke Robillard – 'Blast Off!' Is Here",
        headingNo: "🎵 Duke Robillard – 'Blast Off!' er her",
        paragraphsEn: [
          "We teased this one last week, and now it's out: Duke Robillard's 'Blast Off!' dropped on February 20 via Nola Blue Records. If you're not familiar with Duke, here's the short version: co-founder of Roomful of Blues, former guitarist in The Fabulous Thunderbirds, three-time Blues Music Award winner, and one of the most technically brilliant and tasteful blues guitarists alive.",
          "'Blast Off!' is classic Duke – impeccable tone, effortless swing between jump blues, T-Bone Walker-style sophistication, and raw Chicago grit. The man is 76 and still playing circles around guitarists half his age. If you like your blues with class, finesse, and zero wasted notes, this is your album of the month.",
          "Stream it, buy it, put it on loud. Duke deserves every ear he can get."
        ],
        paragraphsNo: [
          "Vi teaset denne forrige uke, og nå er den ute: Duke Robillards 'Blast Off!' kom den 20. februar via Nola Blue Records. Er du ikke kjent med Duke, her er den korte versjonen: medgrunnlegger av Roomful of Blues, tidligere gitarist i The Fabulous Thunderbirds, tre ganger Blues Music Award-vinner, og en av de mest teknisk briljante og smakfulle bluesgitaristene som lever.",
          "'Blast Off!' er klassisk Duke – upåklagelig tone, uanstrengt swing mellom jump blues, T-Bone Walker-lignende sofistikering og rå Chicago-grit. Mannen er 76 og spiller fortsatt ringer rundt gitarister halvparten så gamle. Liker du bluesen din med klasse, finesse og null bortkastede noter, er dette månedens album.",
          "Stream det, kjøp det, skru det opp høyt. Duke fortjener hvert øre han kan få."
        ],
      },
      {
        headingEn: "🔥 Oz & The Wizards Release Concert – Just Over a Week Away!",
        headingNo: "🔥 Oz & The Wizards releasekonsert – snart her!",
        paragraphsEn: [
          "Quick reminder: Saturday, March 7, at Teateret in Kristiansand – Oz & The Wizards are doing their release concert. It's just over a week away now! These guys deserve every seat filled. Original blues from Kristiansand, Chicago and Delta-rooted, written and performed by Osmund 'Oz' Grytdahl, Oddvar Micaelsen, and Ole Louis Lilløy.",
          "Tickets are available now: https://teateret.no/event/oz-the-wizards. Full artist profile: https://slowblues.no/scandinavian-blues/oz-and-the-wizards. If you're in Sørlandet, this is your Saturday night sorted. Don't sleep on it."
        ],
        paragraphsNo: [
          "Påminnelse: lørdag 7. mars på Teateret i Kristiansand – Oz & The Wizards holder releasekonsert. Det er bare litt over en uke til! Disse gutta fortjener at hvert sete er fylt. Original blues fra Kristiansand, forankret i Chicago og Delta, skrevet og fremført av Osmund 'Oz' Grytdahl, Oddvar Micaelsen og Ole Louis Lilløy.",
          "Billetter er tilgjengelig nå: https://teateret.no/event/oz-the-wizards. Full artistprofil: https://slowblues.no/scandinavian-blues/oz-and-the-wizards. Er du på Sørlandet, er lørdagskvelden din ordnet. Ikke sov på denne."
        ],
        artistMentions: ["oz-and-the-wizards"],
      },
      {
        headingEn: "🛍️ Help Keep the Blues Alive – Check Out Our Merch Store",
        headingNo: "🛍️ Hjelp å holde bluesen i live – sjekk ut vår merch-butikk",
        paragraphsEn: [
          "SlowBlues.no is a passion project – built, maintained, and funded entirely by one blues enthusiast on his own time. No corporate sponsors, no ads, just a genuine love for the music. If you enjoy what we do here, one of the best ways to show your support is by checking out the SlowBlues Merch Store at https://slowblues.no/merch. We've recently updated the collection with several new items – from t-shirts to accessories – all designed with the blues spirit in mind.",
          "Every purchase helps keep the lights on and the content flowing. And speaking of growth: SlowBlues.no is now available in German! We've been promised a feature in one of Germany's leading blues magazines, so we're excited to welcome a whole new audience to the community. Whether you grab a shirt, share an article, or just keep reading – every bit of support means the world. Thank you for being part of this. 🎶",
          "📸 One more thing: we're always looking for authentic artist photos to improve our profiles. Many artists still have placeholder images, and we'd love to fix that. If you have photos of blues artists – especially from live shows or festivals – and have the rights to share them, please submit them through our contribution form at https://slowblues.no/contribute. Proper photographer credit is always given. Every photo helps tell the story of the blues."
        ],
        paragraphsNo: [
          "SlowBlues.no er et lidenskap-prosjekt – bygget, vedlikeholdt og finansiert av én bluesentusiast på egen fritid. Ingen bedriftssponsorer, ingen annonser, bare en genuin kjærlighet til musikken. Hvis du setter pris på det vi gjør her, er en av de beste måtene å vise støtten din på å ta en titt på SlowBlues Merch-butikken vår på https://slowblues.no/merch. Vi har nylig oppdatert kolleksjonen med flere nye artikler – fra t-skjorter til tilbehør – alt designet med blues-ånden i tankene.",
          "Hvert kjøp bidrar til å holde hjulene i gang og innholdet flytende. Og apropos vekst: SlowBlues.no er nå tilgjengelig på tysk! Vi har blitt lovet en fin omtale i et av Tysklands ledende bluesmagasiner, så vi gleder oss til å ønske et helt nytt publikum velkommen i fellesskapet. Enten du kjøper en skjorte, deler en artikkel, eller bare fortsetter å lese – all støtte betyr utrolig mye. Takk for at du er med på laget. 🎶",
          "📸 Én ting til: vi er alltid på jakt etter autentiske artistbilder for å forbedre profilene våre. Mange artister har fortsatt plassholder-bilder, og det vil vi gjerne fikse. Har du bilder av bluesartister – spesielt fra livekonserter eller festivaler – og har rettighetene til å dele dem, send dem gjerne inn via vårt bidragsskjema på https://slowblues.no/contribute. Fotografkreditering gis alltid. Hvert bilde hjelper med å fortelle bluesens historie."
        ],
      },
      {
        headingEn: "🌍 Until Next Week – Keep the Blues Alive",
        headingNo: "🌍 Til neste uke – hold bluesen i live",
        paragraphsEn: [
          "That's my week. Blues Music Awards nominees announced. BluesGig launched for Nordic organisers. Duke Robillard still swinging at 76. And Oz & The Wizards getting ready to rock Kristiansand. Not a bad week for the blues.",
          "As always, I want to hear from you. Who are your BMA picks? Have you tried BluesGig yet? Are you going to Teateret on March 7? Drop me a line via the contact form – your voices make this community what it is.",
          "And while you're here: test your knowledge with our Blues Quiz at https://slowblues.no/blues-quiz, explore 330+ artist profiles, or share this dispatch with a friend who needs more blues in their feed. Every share counts. The blues is a conversation – and we're glad you're part of it. 🎸",
          "#SlowBlues #BluesMusicAwards2026 #BluesGig #DukeRobillard #OzAndTheWizards #NordicBlues"
        ],
        paragraphsNo: [
          "Det er min uke. Blues Music Awards-nominasjoner annonsert. BluesGig lansert for nordiske arrangører. Duke Robillard som fortsatt svinger i en alder av 76. Og Oz & The Wizards som gjør seg klare til å rocke Kristiansand. Ikke en dårlig uke for bluesen.",
          "Som alltid vil jeg høre fra dere. Hvem er deres BMA-favoritter? Har dere prøvd BluesGig ennå? Skal dere på Teateret 7. mars? Send oss en melding via kontaktskjemaet – stemmene deres gjør dette fellesskapet til det det er.",
          "Og mens du er her: test kunnskapene dine med vår Blues Quiz på https://slowblues.no/blues-quiz, utforsk 330+ artistprofiler, eller del denne oppdateringen med en venn som trenger mer blues i feeden sin. Hver deling teller. Bluesen er en samtale – og vi er glade for at du er med. 🎸",
          "#SlowBlues #BluesMusicAwards2026 #BluesGig #DukeRobillard #OzAndTheWizards #NordiskBlues"
        ],
        artistMentions: ["oz-and-the-wizards"],
      },
    ],
  },
  {
    id: "weekly-blues-dispatch-march-2-2026",
    titleEn: "Weekly Blues Dispatch – March 2, 2026: Oz & The Wizards, Fresh News & Keep the Blues Alive",
    titleNo: "Ukentlig blues-oppdatering – 2. mars 2026: Oz & The Wizards, ferske nyheter og hold bluesen i live",
    excerptEn: "This Saturday in Kristiansand, Oz & The Wizards play their album release concert. Plus: prioritised blues news from Norway to the world, the weekly quiz, merch updates, and a reminder to get out and support live blues wherever you are.",
    excerptNo: "Denne lørdagen i Kristiansand spiller Oz & The Wizards sin releasekonsert. Pluss: prioriterte bluesnyheter fra Norge til verden, den ukentlige quizen, merch-oppdateringer, og en påminnelse om å komme seg ut og støtte live blues uansett hvor du er.",
    contentEn: [],
    contentNo: [],
    author: "Kjell Mersland",
    publishedDate: "2026-03-02",
    modifiedDate: "2026-03-02",
    category: "Weekly Dispatch",
    categoryNo: "Ukentlig oppdatering",
    readingTimeMin: 8,
    keywordsEn: ["blues newsletter", "oz and the wizards", "kristiansand blues", "weekly blues news", "blues quiz", "live blues", "nordic blues", "blues merch", "keep the blues alive"],
    keywordsNo: ["blues nyhetsbrev", "oz and the wizards", "kristiansand blues", "ukentlige bluesnyheter", "blues quiz", "live blues", "nordisk blues", "blues merch", "hold bluesen i live"],
    relatedArtistIds: ["oz-and-the-wizards"],
    sections: [
      {
        headingEn: "Hey Blues Friends – Let's Talk About This Week",
        headingNo: "Hei bluesvenner – la oss snakke om denne uken",
        paragraphsEn: [
          "Another Monday, another reason to be grateful for this music. I've been sitting here in my home office in southern Norway, coffee in hand, turntable spinning some Muddy Waters, and thinking about what an incredible week it's been for the blues. There's a lot to cover, so let's get into it.",
          "First things first: if you're anywhere near Kristiansand this Saturday – you know where you need to be."
        ],
        paragraphsNo: [
          "Nok en mandag, nok en grunn til å være takknemlig for denne musikken. Jeg har sittet her på hjemmekontoret mitt på Sørlandet, kaffe i hånda, platespilleren snurrer litt Muddy Waters, og tenkt på for en utrolig uke det har vært for bluesen. Det er mye å dekke, så la oss komme i gang.",
          "Først og fremst: er du i nærheten av Kristiansand denne lørdagen – du vet hvor du må være."
        ],
      },
      {
        headingEn: "🔥 Oz & The Wizards Release Concert – This Saturday in Kristiansand!",
        headingNo: "🔥 Oz & The Wizards releasekonsert – denne lørdagen i Kristiansand!",
        paragraphsEn: [
          "This is the big one. Saturday, March 7, at Teateret in Kristiansand – Oz & The Wizards are doing their album release concert. I've been following these guys closely, and I genuinely believe they're one of the most exciting things happening in Norwegian blues right now.",
          "Original blues from Kristiansand. Chicago and Delta-rooted, written and performed by Osmund 'Oz' Grytdahl, Oddvar Micaelsen, and Ole Louis Lilløy. These three have that thing – you know, that raw, honest, no-nonsense approach to the blues that makes you forget you're in Norway and not in a juke joint on the South Side.",
          "Tickets are available now at https://teateret.no/event/oz-the-wizards. Full artist profile on SlowBlues: https://slowblues.no/scandinavian-blues/oz-and-the-wizards. If you're on Sørlandet, this is your Saturday night sorted. Bring a friend. Fill every seat. These guys deserve it."
        ],
        paragraphsNo: [
          "Her er den store nyheten. Lørdag 7. mars på Teateret i Kristiansand – Oz & The Wizards holder sin releasekonsert. Jeg har fulgt disse gutta tett, og jeg mener oppriktig at de er noe av det mest spennende som skjer i norsk blues akkurat nå.",
          "Original blues fra Kristiansand. Forankret i Chicago og Delta, skrevet og fremført av Osmund 'Oz' Grytdahl, Oddvar Micaelsen og Ole Louis Lilløy. Disse tre har det der – du vet, den rå, ærlige, rett-på-sak-tilnærmingen til bluesen som får deg til å glemme at du er i Norge og ikke på en juke joint på South Side.",
          "Billetter er tilgjengelig nå på https://teateret.no/event/oz-the-wizards. Full artistprofil på SlowBlues: https://slowblues.no/scandinavian-blues/oz-and-the-wizards. Er du på Sørlandet, er lørdagskvelden din i boks. Ta med en venn. Fyll hvert sete. Disse gutta fortjener det."
        ],
        artistMentions: ["oz-and-the-wizards"],
      },
      {
        headingEn: "🇳🇴 Norwegian & Nordic Blues News",
        headingNo: "🇳🇴 Norske og nordiske bluesnyheter",
        paragraphsEn: [
          "The Nordic blues scene continues to punch above its weight. Knut Reiersrud remains one of the most respected blues musicians in Europe, and the younger generation – artists like Amund Maarud and the crew around Notodden Blues Festival – keep pushing the boundaries of what Scandinavian blues can be.",
          "If you haven't explored our Scandinavian Blues section yet, I'd encourage you to dive in: https://slowblues.no/scandinavian-blues. We've got profiles on artists from Norway, Sweden, Finland, and Denmark – from established legends to exciting newcomers. The Nordic blues community is small but mighty, and it deserves your attention."
        ],
        paragraphsNo: [
          "Den nordiske bluesscenen fortsetter å levere over evne. Knut Reiersrud er fortsatt en av de mest respekterte bluesmusikerne i Europa, og den yngre generasjonen – artister som Amund Maarud og gjengen rundt Notodden Blues Festival – fortsetter å skyve grensene for hva skandinavisk blues kan være.",
          "Har du ikke utforsket vår skandinavisk blues-seksjon ennå, oppfordrer jeg deg til å dykke inn: https://slowblues.no/scandinavian-blues. Vi har profiler på artister fra Norge, Sverige, Finland og Danmark – fra etablerte legender til spennende nykommere. Det nordiske bluesfellesskapet er lite, men sterkt, og det fortjener oppmerksomheten din."
        ],
        artistMentions: ["knut-reiersrud", "amund-maarud"],
      },
      {
        headingEn: "🇪🇺 European & International Blues Updates",
        headingNo: "🇪🇺 Europeiske og internasjonale bluesoppdateringer",
        paragraphsEn: [
          "Blues is alive and well across Europe. From British blues-rock to the thriving scenes in Poland, France, and Germany – there's more great blues being made on this continent than most people realise. Our European Blues section covers it all: https://slowblues.no/european-blues.",
          "On the American front, the Blues Music Awards season is heating up. Keep an eye on our news ticker for the latest developments – it updates every 6 hours with fresh blues news from around the world: https://slowblues.no/news-ticker. We've got the nominees, the predictions, and the conversations you need to be part of."
        ],
        paragraphsNo: [
          "Blues lever og har det bra over hele Europa. Fra britisk blues-rock til de blomstrende scenene i Polen, Frankrike og Tyskland – det lages mer fantastisk blues på dette kontinentet enn folk flest skjønner. Vår europeiske blues-seksjon dekker alt: https://slowblues.no/european-blues.",
          "På den amerikanske fronten varmes Blues Music Awards-sesongen opp. Hold et øye med vår nyhetsticker for de siste utviklingene – den oppdateres hver 6. time med ferske bluesnyheter fra hele verden: https://slowblues.no/news-ticker. Vi har nominasjonene, prediksjonene og samtalene du bør være en del av."
        ],
      },
      {
        headingEn: "🧠 Weekly Blues Quiz – New Questions Are Live!",
        headingNo: "🧠 Ukens Blues Quiz – nye spørsmål er live!",
        paragraphsEn: [
          "It's Monday, which means a fresh set of blues quiz questions is waiting for you! Three difficulty levels – from casual listener to full-on blues nerd. We've got audio clips where you guess the artist, questions about classic albums, history, instruments, and more.",
          "Take the quiz at https://slowblues.no/blues-quiz and see how you stack up on the leaderboard. Share your result on social media with #BluesQuiz #SlowBlues – I love seeing the scores roll in. Last week's winner nailed 9 out of 10 on expert mode. Can you beat that?"
        ],
        paragraphsNo: [
          "Det er mandag, som betyr at et ferskt sett med blues-quizspørsmål venter på deg! Tre vanskelighetsgrader – fra casual lytter til fullblods blues-nerd. Vi har lydklipp der du gjetter artisten, spørsmål om klassiske album, historie, instrumenter og mer.",
          "Ta quizen på https://slowblues.no/blues-quiz og se hvor du havner på topplisten. Del resultatet ditt på sosiale medier med #BluesQuiz #SlowBlues – jeg elsker å se poengene rulle inn. Forrige ukes vinner klarte 9 av 10 på ekspertnivå. Kan du slå det?"
        ],
      },
      {
        headingEn: "🛍️ Support the Blues – Check Out Our Merch Store",
        headingNo: "🛍️ Støtt bluesen – sjekk ut merch-butikken vår",
        paragraphsEn: [
          "SlowBlues.no is a one-person passion project. No corporate sponsors, no ads – just genuine love for the music. If you enjoy what we do, one of the best ways to show support is by visiting our merch store at https://slowblues.no/merch. T-shirts, accessories, and more – all designed with the blues spirit in mind.",
          "Every purchase helps keep the site running, the content flowing, and the blues alive. We've recently updated the collection with several new items. Take a look – you might find your new favourite blues shirt."
        ],
        paragraphsNo: [
          "SlowBlues.no er et enmanns lidenskapsprosjekt. Ingen bedriftssponsorer, ingen annonser – bare genuin kjærlighet til musikken. Setter du pris på det vi gjør, er en av de beste måtene å vise støtte på å besøke merch-butikken vår på https://slowblues.no/merch. T-skjorter, tilbehør og mer – alt designet med blues-ånden i tankene.",
          "Hvert kjøp bidrar til å holde nettsiden i gang, innholdet flytende, og bluesen i live. Vi har nylig oppdatert kolleksjonen med flere nye artikler. Ta en titt – du finner kanskje din nye favoritt-bluesskjorte."
        ],
      },
      {
        headingEn: "📡 Live Blues News Ticker – Updated Every 6 Hours",
        headingNo: "📡 Live bluesnyhets-ticker – oppdatert hver 6. time",
        paragraphsEn: [
          "If you haven't seen it yet, we've got a live news ticker running on SlowBlues.no that automatically updates every 6 hours with fresh blues news from around the world. Album releases, tour announcements, festival updates, obituaries – it's all there.",
          "Check it out at https://slowblues.no/news-ticker and bookmark it. It's like having a blues news wire service in your pocket."
        ],
        paragraphsNo: [
          "Hvis du ikke har sett den ennå, har vi en live nyhetsticker som kjører på SlowBlues.no og automatisk oppdateres hver 6. time med ferske bluesnyheter fra hele verden. Albumslipp, turné-annonseringer, festivaloppdateringer, nekrologer – alt er der.",
          "Sjekk den ut på https://slowblues.no/news-ticker og legg den til som bokmerke. Det er som å ha en blues-nyhetsbyrå i lomma."
        ],
      },
      {
        headingEn: "🌍 Keep the Blues Alive – Share, Support, Show Up",
        headingNo: "🌍 Hold bluesen i live – del, støtt, møt opp",
        paragraphsEn: [
          "Here's the thing about the blues: it's not just music you listen to. It's music you show up for. Whether it's Oz & The Wizards in Kristiansand, a local jam night at your neighbourhood bar, or a festival three hours away – go. Be there. The blues lives in those rooms, in those moments, in that connection between the player and the crowd.",
          "And if you can't make it to a show this week, here's what you can do: share SlowBlues.no with a friend. Forward this newsletter. Post about the quiz on social media. Tell someone about an artist you discovered on the site. Every share, every conversation, every link clicked – it keeps this community growing.",
          "We're now at 330+ artist profiles, available in three languages, with a weekly quiz, live news ticker, merch store, and a growing Scandinavian blues archive. None of this would exist without you reading, sharing, and showing up. Thank you. Truly.",
          "Until next Monday – go see some live blues. Keep the Blues Alive. 🎸 #SlowBlues #KeepTheBluesAlive #OzAndTheWizards #NordicBlues"
        ],
        paragraphsNo: [
          "Her er greia med blues: det er ikke bare musikk du lytter til. Det er musikk du møter opp for. Enten det er Oz & The Wizards i Kristiansand, en lokal jam-kveld på nabolagsbaren, eller en festival tre timer unna – dra. Vær der. Bluesen lever i de rommene, i de øyeblikkene, i den kontakten mellom musikeren og publikum.",
          "Og hvis du ikke kan komme på en konsert denne uken, her er hva du kan gjøre: del SlowBlues.no med en venn. Videresend dette nyhetsbrevet. Post om quizen på sosiale medier. Fortell noen om en artist du oppdaget på siden. Hver deling, hver samtale, hver lenke som klikkes – det holder dette fellesskapet i vekst.",
          "Vi er nå på 330+ artistprofiler, tilgjengelig på tre språk, med en ukentlig quiz, live nyhetsticker, merch-butikk, og et voksende skandinavisk bluesarkiv. Ingenting av dette hadde eksistert uten at dere leser, deler og møter opp. Tusen takk. Virkelig.",
          "Til neste mandag – dra og se litt live blues. Hold bluesen i live. 🎸 #SlowBlues #HoldBluesenILive #OzAndTheWizards #NordiskBlues"
        ],
        artistMentions: ["oz-and-the-wizards"],
      },
    ],
  },
  {
    id: "weekly-dispatch-march-9-2026",
    titleEn: "The Weekly Dispatch – March 9, 2026",
    titleNo: "Ukens utsending – 9. mars 2026",
    titleDe: "Der Wochenbericht – 9. März 2026",
    excerptEn: "Joanne Shaw Taylor teams up with Orianthi, Joe Bonamassa honours B.B. King, Catfish Keith gets raw, and a Howlin' Wolf story involving a shotgun. Plus: take the weekly Blues Quiz, sign the Guestbook, and browse the merch store.",
    excerptNo: "Joanne Shaw Taylor slår seg sammen med Orianthi, Joe Bonamassa hedrer B.B. King, Catfish Keith holder det rått, og en Howlin' Wolf-historie med hagle. Pluss: ta ukens Blues Quiz, skriv i gjesteboka, og titt i merch-butikken.",
    excerptDe: "Joanne Shaw Taylor und Orianthi zusammen, Joe Bonamassa ehrt B.B. King, Catfish Keith bleibt roh, und eine Howlin' Wolf-Geschichte mit Schrotflinte. Dazu: Blues Quiz, Gästebuch und Merch-Shop.",
    contentEn: [],
    contentNo: [],
    contentDe: [],
    author: "Kjell Mersland",
    publishedDate: "2026-03-09",
    modifiedDate: "2026-03-09",
    category: "Weekly Dispatch",
    categoryNo: "Ukens utsending",
    categoryDe: "Wochenbericht",
    readingTimeMin: 8,
    keywordsEn: ["blues news", "joanne shaw taylor", "joe bonamassa", "bb king", "catfish keith", "kim wilson", "blues quiz", "blues newsletter"],
    keywordsNo: ["bluesnyheter", "joanne shaw taylor", "joe bonamassa", "bb king", "catfish keith", "kim wilson", "blues quiz", "bluesnyhetsbrev"],
    keywordsDe: ["blues nachrichten", "joanne shaw taylor", "joe bonamassa", "bb king", "catfish keith", "kim wilson", "blues quiz", "blues newsletter"],
    relatedArtistIds: ["joe-bonamassa", "bb-king"],
    sections: [
      {
        headingEn: "Sunday evening from Kristiansand",
        headingNo: "Søndagskveld fra Kristiansand",
        headingDe: "Sonntagabend aus Kristiansand",
        paragraphsEn: [
          "Rain on the window again. A cup of coffee that's gone cold twice because I kept getting sidetracked by album reviews. This week had some genuinely good news in the blues world — new music, a couple of great stories, and a collaboration I didn't see coming. Let me walk you through it.",
        ],
        paragraphsNo: [
          "Regn på vinduet igjen. En kopp kaffe som har blitt kald to ganger fordi jeg stadig ble distrahert av albumanmeldelser. Denne uken hadde noen ekte gode nyheter i bluesverden — ny musikk, et par flotte historier, og et samarbeid jeg ikke så komme. La meg gå gjennom det.",
        ],
        paragraphsDe: [
          "Wieder Regen am Fenster. Eine Tasse Kaffee, die zweimal kalt geworden ist, weil ich mich ständig von Albumkritiken ablenken ließ. Diese Woche gab es wirklich gute Nachrichten aus der Blues-Welt — neue Musik, ein paar großartige Geschichten und eine Zusammenarbeit, die ich nicht kommen sah.",
        ],
      },
      {
        headingEn: "🎸 Joanne Shaw Taylor & Orianthi – 'What Good Is My Love?'",
        headingNo: "🎸 Joanne Shaw Taylor & Orianthi – 'What Good Is My Love?'",
        headingDe: "🎸 Joanne Shaw Taylor & Orianthi – 'What Good Is My Love?'",
        paragraphsEn: [
          "This one caught me off guard. Joanne Shaw Taylor — who's been quietly building one of the most consistent catalogues in modern blues-rock — dropped a new single featuring Orianthi. Two guitarists with very different styles, and somehow it works. The tone is warm, the riff is patient, and neither player tries to outshine the other. That's rare.",
          "Philip Sayce and Bywater Call also have new material out this week, making it a strong seven days for the blues-rock side of things.",
        ],
        paragraphsNo: [
          "Denne tok meg på senga. Joanne Shaw Taylor — som stille har bygget en av de mest konsistente katalogene i moderne bluesrock — slapp en ny singel med Orianthi. To gitarister med veldig ulike stiler, og på en eller annen måte fungerer det. Tonen er varm, riffet er tålmodig, og ingen av dem prøver å overskygge den andre. Det er sjeldent.",
          "Philip Sayce og Bywater Call har også nytt materiale ute denne uken, noe som gjør det til en sterk uke for bluesrock-siden av ting.",
        ],
        paragraphsDe: [
          "Das hat mich überrascht. Joanne Shaw Taylor — die leise einen der beständigsten Kataloge im modernen Blues-Rock aufgebaut hat — hat eine neue Single mit Orianthi veröffentlicht. Zwei Gitarristinnen mit sehr unterschiedlichen Stilen, und irgendwie funktioniert es. Der Ton ist warm, das Riff ist geduldig, und keine versucht die andere zu überstrahlen. Das ist selten.",
          "Philip Sayce und Bywater Call haben diese Woche ebenfalls neues Material veröffentlicht — eine starke Woche für die Blues-Rock-Seite.",
        ],
        artistMentions: ["joanne-shaw-taylor"],
      },
      {
        headingEn: "👑 Joe Bonamassa's 'Blues Summit 100' – A Love Letter to B.B. King",
        headingNo: "👑 Joe Bonamaassa 'Blues Summit 100' – Et kjærlighetsbrev til B.B. King",
        headingDe: "👑 Joe Bonamassas 'Blues Summit 100' – Ein Liebesbrief an B.B. King",
        paragraphsEn: [
          "I've said it before: Bonamassa is at his best when he's not trying to prove anything. And this project — 'Blues Summit 100,' dedicated to the centennial of B.B. King — feels exactly like that. It's not flashy. It's respectful. He lets King's legacy breathe through the arrangements rather than burying it under technique.",
          "Blues Blast Magazine dug into this one, and their take matches mine: this is Bonamassa the student, not Bonamassa the showman. And honestly, that's when I like him most.",
        ],
        paragraphsNo: [
          "Jeg har sagt det før: Bonamassa er på sitt beste når han ikke prøver å bevise noe. Og dette prosjektet — 'Blues Summit 100,' dedikert til hundreårsjubileet til B.B. King — føles akkurat slik. Det er ikke prangende. Det er respektfullt. Han lar Kings arv puste gjennom arrangementene i stedet for å begrave den under teknikk.",
          "Blues Blast Magazine gikk dypt inn i denne, og deres vurdering matcher min: dette er Bonamassa eleven, ikke Bonamassa showmannen. Og ærlig talt, det er da jeg liker ham best.",
        ],
        paragraphsDe: [
          "Ich hab's schon mal gesagt: Bonamassa ist am besten, wenn er nichts beweisen will. Und dieses Projekt — 'Blues Summit 100,' dem hundertsten Geburtstag von B.B. King gewidmet — fühlt sich genau so an. Nicht protzig. Respektvoll. Er lässt Kings Vermächtnis durch die Arrangements atmen, statt es unter Technik zu begraben.",
          "Blues Blast Magazine hat sich das genau angeschaut, und ihre Einschätzung deckt sich mit meiner: Das ist Bonamassa der Schüler, nicht Bonamassa der Showman. Und ehrlich gesagt — da mag ich ihn am liebsten.",
        ],
        artistMentions: ["joe-bonamassa", "bb-king"],
      },
      {
        headingEn: "🎹 Kim Wilson – 'Slow Burn'",
        headingNo: "🎹 Kim Wilson – 'Slow Burn'",
        headingDe: "🎹 Kim Wilson – 'Slow Burn'",
        paragraphsEn: [
          "Kim Wilson doesn't get enough credit. The man has been carrying the torch for West Coast blues and jump blues for decades, and 'Slow Burn' — his latest — is exactly what the title promises. It's unhurried. It simmers. The harmonica playing is exquisite, and I don't use that word lightly.",
        ],
        paragraphsNo: [
          "Kim Wilson får ikke nok anerkjennelse. Mannen har båret fakkelen for West Coast blues og jump blues i årevis, og 'Slow Burn' — hans siste — er akkurat det tittelen lover. Den har ikke hastverk. Den koker sakte. Munnspillet er utsøkt, og det er et ord jeg ikke bruker lett.",
        ],
        paragraphsDe: [
          "Kim Wilson bekommt nicht genug Anerkennung. Der Mann trägt die Fackel für West Coast Blues und Jump Blues seit Jahrzehnten, und 'Slow Burn' — sein neuestes Werk — ist genau das, was der Titel verspricht. Ohne Eile. Es köchelt. Das Mundharmonikaspiel ist exquisit, und ich benutze dieses Wort nicht leichtfertig.",
        ],
      },
      {
        headingEn: "🐊 Catfish Keith – 'Sugar For Sugar'",
        headingNo: "🐊 Catfish Keith – 'Sugar For Sugar'",
        headingDe: "🐊 Catfish Keith – 'Sugar For Sugar'",
        paragraphsEn: [
          "Acoustic blues. A guy, a guitar, a room with good reverb. That's Catfish Keith. His new 'Sugar For Sugar, Vol. 1' is raw in the best sense — no production tricks, no session musicians padding things out. Just fingers on steel strings and a voice that sounds like it's been steeped in Mississippi mud for fifty years. If you like your blues stripped to the bone, this is your record.",
        ],
        paragraphsNo: [
          "Akustisk blues. En mann, en gitar, et rom med god klang. Det er Catfish Keith. Hans nye 'Sugar For Sugar, Vol. 1' er rå i beste forstand — ingen produksjonstriks, ingen studiomusikere som fyller ut. Bare fingre på stålstrenger og en stemme som høres ut som om den har ligget i bløt i Mississippi-gjørme i femti år. Liker du bluesen din nedstrippet til beinet, er dette plata di.",
        ],
        paragraphsDe: [
          "Akustischer Blues. Ein Mann, eine Gitarre, ein Raum mit gutem Hall. Das ist Catfish Keith. Sein neues 'Sugar For Sugar, Vol. 1' ist roh im besten Sinne — keine Produktionstricks, keine Studiomusiker. Nur Finger auf Stahlsaiten und eine Stimme, die klingt, als hätte sie fünfzig Jahre im Mississippi-Schlamm gelegen. Wenn du deinen Blues bis auf die Knochen reduziert magst, ist das deine Platte.",
        ],
      },
      {
        headingEn: "📖 The Bentonia Tuning – A Musical Mystery",
        headingNo: "📖 Bentonia-stemmingen – Et musikalsk mysterium",
        headingDe: "📖 Die Bentonia-Stimmung – Ein musikalisches Rätsel",
        paragraphsEn: [
          "American Blues Scene ran a fascinating piece on cross-note tuning and the Bentonia legacy this week. If you've ever wondered why Skip James and Jack Owens sound like they're playing in a completely different universe from other Delta players — this article explains the how and the why. It's the kind of deep-dive that reminds you the blues isn't just feeling, it's also craft.",
        ],
        paragraphsNo: [
          "American Blues Scene kjørte en fascinerende sak om cross-note-stemming og Bentonia-arven denne uken. Har du noen gang lurt på hvorfor Skip James og Jack Owens høres ut som om de spiller i et helt annet univers enn andre Delta-spillere — denne artikkelen forklarer hvordan og hvorfor. Det er den typen dypdykk som minner deg om at blues ikke bare er følelse, det er også håndverk.",
        ],
        paragraphsDe: [
          "American Blues Scene brachte diese Woche ein faszinierendes Stück über Cross-Note-Stimmung und das Bentonia-Erbe. Wenn du dich je gefragt hast, warum Skip James und Jack Owens klingen, als würden sie in einem völlig anderen Universum spielen als andere Delta-Musiker — dieser Artikel erklärt das Wie und Warum. Die Art von Vertiefung, die dich daran erinnert: Blues ist nicht nur Gefühl, sondern auch Handwerk.",
        ],
      },
      {
        headingEn: "🔫 Howlin' Wolf, Hubert Sumlin, and a Shotgun-Wielding Wife",
        headingNo: "🔫 Howlin' Wolf, Hubert Sumlin og en kone med hagle",
        headingDe: "🔫 Howlin' Wolf, Hubert Sumlin und eine Ehefrau mit Schrotflinte",
        paragraphsEn: [
          "I love this kind of story. American Blues Scene premiered a piece about Hubert Sumlin — Wolf's legendary guitarist — and a road story involving Howlin' Wolf's wife and a shotgun. I won't spoil it. Just read it. It's exactly the kind of backstage chaos that made the blues what it is. These weren't polished pop stars. They were real people living real, messy, extraordinary lives.",
        ],
        paragraphsNo: [
          "Jeg elsker denne typen historier. American Blues Scene presenterte en sak om Hubert Sumlin — Wolfs legendariske gitarist — og en turné-historie som involverer Howlin' Wolfs kone og en hagle. Jeg skal ikke avsløre den. Bare les den. Det er akkurat den typen backstage-kaos som gjorde bluesen til det den er. Dette var ikke polerte popstjerner. De var ekte mennesker som levde ekte, rotete, ekstraordinære liv.",
        ],
        paragraphsDe: [
          "Ich liebe solche Geschichten. American Blues Scene brachte ein Stück über Hubert Sumlin — Wolfs legendären Gitarristen — und eine Tourgeschichte mit Howlin' Wolfs Ehefrau und einer Schrotflinte. Ich verrate nichts. Lies es einfach. Genau die Art von Backstage-Chaos, die den Blues zu dem gemacht hat, was er ist. Das waren keine polierten Popstars. Das waren echte Menschen mit echten, chaotischen, außergewöhnlichen Leben.",
        ],
        artistMentions: ["howlin-wolf"],
      },
      {
        headingEn: "🧠 Take the Weekly Blues Quiz",
        headingNo: "🧠 Ta ukens Blues Quiz",
        headingDe: "🧠 Mach das wöchentliche Blues Quiz",
        paragraphsEn: [
          "New questions every Monday. Three difficulty levels, audio clips where you guess the artist, and a leaderboard with blues fans from around the world. Last week's top score came from Germany — so the Norwegians need to step it up. No pressure.",
        ],
        paragraphsNo: [
          "Nye spørsmål hver mandag. Tre vanskelighetsgrader, lydklipp der du gjetter artisten, og en toppliste med bluesfans fra hele verden. Forrige ukes toppscore kom fra Tyskland — så nordmennene må skjerpe seg. Ikke noe press.",
        ],
        paragraphsDe: [
          "Jeden Montag neue Fragen. Drei Schwierigkeitsstufen, Audioclips zum Künstler-Raten und eine Bestenliste mit Blues-Fans aus aller Welt. Letzte Woche kam der Highscore aus Deutschland — die Norweger müssen also nachlegen. Kein Druck.",
        ],
      },
      {
        headingEn: "📖 Sign the Guestbook",
        headingNo: "📖 Skriv i gjesteboka",
        headingDe: "📖 Trag dich ins Gästebuch ein",
        paragraphsEn: [
          "I read every entry. Blues fans from Norway, Germany, the US, Brazil, Japan — all dropping by to say hello and share their favorite artists. If you haven't left a note yet, I'd genuinely love to hear from you. Who got you into the blues? What's the one album you'd take to a desert island? Tell me your story.",
        ],
        paragraphsNo: [
          "Jeg leser alle innleggene. Bluesfans fra Norge, Tyskland, USA, Brasil, Japan — alle stikker innom for å si hei og dele sine favorittartister. Hvis du ikke har skrevet noe ennå, vil jeg virkelig gjerne høre fra deg. Hvem fikk deg inn i bluesen? Hvilket album ville du tatt med til en øde øy? Fortell meg historien din.",
        ],
        paragraphsDe: [
          "Ich lese jeden Eintrag. Blues-Fans aus Norwegen, Deutschland, den USA, Brasilien, Japan — alle schauen vorbei, sagen Hallo und teilen ihre Lieblingskünstler. Wenn du noch keinen Eintrag hinterlassen hast, würde ich mich wirklich freuen, von dir zu hören. Wer hat dich zum Blues gebracht? Welches Album würdest du auf eine einsame Insel mitnehmen?",
        ],
      },
      {
        headingEn: "🛍️ Support SlowBlues – Check Out the Merch",
        headingNo: "🛍️ Støtt SlowBlues – Se merch-butikken",
        headingDe: "🛍️ Unterstütze SlowBlues – Schau im Merch-Shop vorbei",
        paragraphsEn: [
          "I'm not going to pretend this is a big fashion brand. It's a guy in Kristiansand who loves blues and makes hoodies and t-shirts with designs that actually mean something. Every purchase keeps SlowBlues.no running — no ads, no sponsors, just you and the music.",
        ],
        paragraphsNo: [
          "Jeg skal ikke late som dette er et stort motemerke. Det er en fyr i Kristiansand som elsker blues og lager hettegensere og t-skjorter med design som faktisk betyr noe. Hvert kjøp holder SlowBlues.no i gang — ingen reklame, ingen sponsorer, bare deg og musikken.",
        ],
        paragraphsDe: [
          "Ich tue nicht so, als wäre das eine große Modemarke. Es ist ein Typ in Kristiansand, der Blues liebt und Hoodies und T-Shirts mit Designs macht, die tatsächlich etwas bedeuten. Jeder Kauf hält SlowBlues.no am Laufen — keine Werbung, keine Sponsoren, nur du und die Musik.",
        ],
      },
      {
        headingEn: "🎸 Until Next Week",
        headingNo: "🎸 Til neste uke",
        headingDe: "🎸 Bis nächste Woche",
        paragraphsEn: [
          "Go find a gig. Doesn't matter how small the venue is — sometimes the best blues happens in rooms with thirty people and a PA system held together with gaffer tape. Forward this to someone who needs more blues in their life. And if you've got a tip, a story, or just want to talk music — you know where to find me.",
          "Keep the blues alive. 🎸 — Kjell, Kristiansand",
        ],
        paragraphsNo: [
          "Finn en konsert. Det spiller ingen rolle hvor liten scenen er — noen ganger skjer den beste bluesen i rom med tretti mennesker og et PA-anlegg holdt sammen med gaffateip. Videresend dette til noen som trenger mer blues i livet. Og har du et tips, en historie, eller bare vil snakke musikk — du vet hvor du finner meg.",
          "Hold bluesen i live. 🎸 — Kjell, Kristiansand",
        ],
        paragraphsDe: [
          "Geh zu einem Konzert. Egal wie klein der Laden ist — manchmal passiert der beste Blues in Räumen mit dreißig Leuten und einer PA-Anlage, die mit Klebeband zusammengehalten wird. Leite das hier an jemanden weiter, der mehr Blues im Leben braucht. Und wenn du einen Tipp, eine Geschichte hast oder einfach über Musik reden willst — du weißt, wo du mich findest.",
          "Halte den Blues am Leben. 🎸 — Kjell, Kristiansand",
        ],
      },
    ],
  },
  // ── Weekly Dispatch #1 — March 17, 2026 ──────────────────────────
  {
    id: "weekly-dispatch-2026-03-17",
    titleEn: "The Weekly Dispatch – March 17, 2026",
    titleNo: "Ukens utsending – 17. mars 2026",
    titleDe: "Die wöchentliche Depesche – 17. März 2026",
    excerptEn: "New review section launched, Oz & The Wizards blow us away in Kristiansand, five album reviews you need to read, plus tours from Buddy Guy, Walter Trout and Larkin Poe.",
    excerptNo: "Ny anmeldelsesseksjon lansert, Oz & The Wizards blåser oss av banen i Kristiansand, fem albumanmeldelser du bør lese, pluss turnéer fra Buddy Guy, Walter Trout og Larkin Poe.",
    excerptDe: "Neue Rezensionssektion gestartet, Oz & The Wizards begeistern in Kristiansand, fünf Albumrezensionen die man lesen muss, plus Tourneen von Buddy Guy, Walter Trout und Larkin Poe.",
    contentEn: [],
    contentNo: [],
    contentDe: [],
    author: "Kjell Mersland",
    publishedDate: "2026-03-17",
    modifiedDate: "2026-03-17",
    category: "Weekly Dispatch",
    categoryNo: "Ukens utsending",
    categoryDe: "Wöchentliche Depesche",
    readingTimeMin: 5,
    keywordsEn: ["blues newsletter", "weekly blues news", "oz the wizards", "magic potion", "blues reviews", "buddy guy farewell", "walter trout", "larkin poe"],
    keywordsNo: ["blues nyhetsbrev", "ukentlige bluesnyheter", "oz the wizards", "magic potion", "bluesanmeldelser", "buddy guy farewell", "walter trout", "larkin poe"],
    keywordsDe: ["Blues-Newsletter", "wöchentliche Blues-Nachrichten", "Oz The Wizards", "Magic Potion", "Blues-Rezensionen", "Buddy Guy Farewell", "Walter Trout", "Larkin Poe"],
    relatedArtistIds: ["buddy-guy", "walter-trout", "larkin-poe", "kenny-wayne-shepherd", "erja-lyytinen", "rita-engedalen"],
    sections: [
      {
        headingEn: "Hey everyone!",
        headingNo: "Hei alle sammen!",
        headingDe: "Hallo zusammen!",
        paragraphsEn: [
          "I know, I know — Monday at 9 PM isn't exactly our usual send time. But technology had its own plans this week, and here we are. Good to hear from you regardless. ☕🎸",
        ],
        paragraphsNo: [
          "Jeg vet, jeg vet — mandag kl 21 er ikke akkurat den vanlige sendetiden vår. Men teknologien hadde sine egne planer denne uken, og her er vi. Godt å høre fra dere uansett. ☕🎸",
        ],
        paragraphsDe: [
          "Ich weiß, ich weiß — Montag um 21 Uhr ist nicht gerade unsere übliche Sendezeit. Aber die Technik hatte diese Woche ihre eigenen Pläne, und hier sind wir. Schön, von euch zu hören. ☕🎸",
        ],
      },
      {
        headingEn: "📀 New Reviews on SlowBlues",
        headingNo: "📀 Nye anmeldelser på SlowBlues",
        headingDe: "📀 Neue Rezensionen auf SlowBlues",
        paragraphsEn: [
          "We've finally launched our new review section — and we're proud of it. Here you'll find honest, thoughtful reviews of new albums from the blues world.",
        ],
        paragraphsNo: [
          "Vi har endelig fått på plass vår nye anmeldelsesseksjon — og vi er stolte av den. Her finner du ærlige, gjennomtenkte anmeldelser av nye album fra bluesverdenen.",
        ],
        paragraphsDe: [
          "Wir haben endlich unsere neue Rezensionssektion eingerichtet — und wir sind stolz darauf. Hier findet ihr ehrliche, durchdachte Rezensionen neuer Alben aus der Blueswelt.",
        ],
      },
      {
        headingEn: "🎸 Oz & The Wizards — From Kristiansand to Our Hearts",
        headingNo: "🎸 Oz & The Wizards — Fra Kristiansand til hjertene våre",
        headingDe: "🎸 Oz & The Wizards — Von Kristiansand in unsere Herzen",
        paragraphsEn: [
          "We'll honestly admit it — we didn't quite know what we were getting into at the release concert for Oz & The Wizards. But after the first song we were sold.",
          "The guys from Kristiansand delivered a concert that reminded us why we love blues. The energy in the room was such that even those standing furthest back started moving. That says something.",
          "The new album Magic Potion is exactly that — raw, real and full of soul. No attempt to polish it up. Just blues the way it should be.",
          "⭐ Score: 8.4 / 10 — Delta Blues",
        ],
        paragraphsNo: [
          "Vi skal ærlig innrømme det — vi visste ikke helt hva vi gikk til på releasekonserten til Oz & The Wizards. Men etter første låt var vi solgt.",
          "Guttene fra Kristiansand leverte en konsert som minnet oss om hvorfor vi elsker blues. Energien i rommet var sånn at selv de som sto lengst bak begynte å bevege seg. Det sier sitt.",
          "Det nye albumet Magic Potion er akkurat slik — rått, ekte og fullt av sjel. Ikke forsøkt pyntet på. Bare blues slik det skal være.",
          "⭐ Score: 8.4 / 10 — Delta Blues",
        ],
        paragraphsDe: [
          "Wir geben ehrlich zu — wir wussten nicht ganz, worauf wir uns beim Release-Konzert von Oz & The Wizards einließen. Aber nach dem ersten Song waren wir überzeugt.",
          "Die Jungs aus Kristiansand lieferten ein Konzert, das uns daran erinnerte, warum wir Blues lieben. Die Energie im Raum war so, dass selbst die ganz hinten anfingen sich zu bewegen. Das sagt einiges.",
          "Das neue Album Magic Potion ist genau das — roh, echt und voller Seele. Kein Versuch, es aufzupolieren. Einfach Blues, wie er sein soll.",
          "⭐ Score: 8.4 / 10 — Delta Blues",
        ],
      },
      {
        headingEn: "📝 Other Reviews You Should Read",
        headingNo: "📝 Andre anmeldelser du bør lese",
        headingDe: "📝 Weitere Rezensionen, die du lesen solltest",
        paragraphsEn: [
          "Ariel Posen — Reasons for Leaving (9.6/10): A mature, atmospheric masterpiece. The slide guitar is world-class, and the emotional depth makes this a rare complete experience.",
          "Buddy Guy — The Final Goodbye (9.2/10): The king takes his bow. At 89, Guy plays with more soul per note than most manage in an entire career. A monumental final chapter.",
          "Gary Clark Jr. — Texas Rain (9.4/10): The heir to Stevie Ray Vaughan shows with Texas Rain that he is the most important voice in modern Texas blues. Analog warmth and a guitar tone that cuts through everything.",
          "Rita Engedalen — Voices of the Delta (9.4/10): The undisputed queen of Norwegian blues. An album that honours the roots and charts the course for the future of acoustic blues.",
          "Henrik Freischlader — Keep Going (8.8/10): Not a record that screams for attention. It deserves it — tone by tone, groove by groove. A blue flame that refuses to go out.",
        ],
        paragraphsNo: [
          "Ariel Posen — Reasons for Leaving (9.6/10): Et modent, atmosfærisk mesterverk. Slide-gitaren er i verdensklasse, og den emosjonelle dybden gjør dette til en sjelden helhetlig opplevelse.",
          "Buddy Guy — The Final Goodbye (9.2/10): Kongen takker av. I en alder av 89 spiller Guy med mer sjel per tone enn de fleste klarer i en hel karriere. Et monumentalt avslutningskapittel.",
          "Gary Clark Jr. — Texas Rain (9.4/10): Arvtakeren til Stevie Ray Vaughan viser med Texas Rain at han er den moderne Texas-bluesens viktigste stemme. Analog varme og en gitartone som skjærer gjennom alt.",
          "Rita Engedalen — Voices of the Delta (9.4/10): Den ubestridte dronningen av norsk blues. Et album som hedrer røttene og staker ut kursen for fremtidens akustiske blues.",
          "Henrik Freischlader — Keep Going (8.8/10): Ikke en plate som roper etter oppmerksomhet. Den fortjener den — tone for tone, groove for groove. En blå flamme som nekter å slukne.",
        ],
        paragraphsDe: [
          "Ariel Posen — Reasons for Leaving (9.6/10): Ein reifes, atmosphärisches Meisterwerk. Die Slide-Gitarre ist Weltklasse, und die emotionale Tiefe macht dies zu einem seltenen Gesamterlebnis.",
          "Buddy Guy — The Final Goodbye (9.2/10): Der König verbeugt sich. Mit 89 Jahren spielt Guy mit mehr Seele pro Ton als die meisten in einer ganzen Karriere. Ein monumentales Schlusskapitel.",
          "Gary Clark Jr. — Texas Rain (9.4/10): Der Erbe von Stevie Ray Vaughan zeigt mit Texas Rain, dass er die wichtigste Stimme des modernen Texas-Blues ist. Analoge Wärme und ein Gitarrenton, der durch alles schneidet.",
          "Rita Engedalen — Voices of the Delta (9.4/10): Die unbestrittene Königin des norwegischen Blues. Ein Album, das die Wurzeln ehrt und den Kurs für die Zukunft des akustischen Blues vorgibt.",
          "Henrik Freischlader — Keep Going (8.8/10): Keine Platte, die nach Aufmerksamkeit schreit. Sie verdient sie — Ton für Ton, Groove für Groove. Eine blaue Flamme, die sich weigert zu erlöschen.",
        ],
        artistMentions: ["buddy-guy", "rita-engedalen"],
      },
      {
        headingEn: "🌍 From the Blues World This Week",
        headingNo: "🌍 Fra bluesverdenen denne uken",
        headingDe: "🌍 Aus der Blueswelt diese Woche",
        paragraphsEn: [
          "1. Tedeschi Trucks Band explores 'Future Soul' — new album. 2. Mike Zito announces new album 'Outside Or The Eastside'. 3. Blues artists shone at the Oscar ceremony with 'I Lied To You'. 4. Ryan McGarvey makes a comeback with 'Back to Life'. 5. When Rivers Meet release single from upcoming album. 6. Artur Menezes releases powerful new single 'Once Again'.",
        ],
        paragraphsNo: [
          "1. Tedeschi Trucks Band utforsker «Future Soul» — nytt album. 2. Mike Zito annonserer nytt album «Outside Or The Eastside». 3. Blues-artister skinte under Oscar-utdelingen med «I Lied To You». 4. Ryan McGarvey gjør comeback med «Back to Life». 5. When Rivers Meet slipper singel fra kommende album. 6. Artur Menezes slipper kraftfull ny singel «Once Again».",
        ],
        paragraphsDe: [
          "1. Tedeschi Trucks Band erforscht 'Future Soul' — neues Album. 2. Mike Zito kündigt neues Album 'Outside Or The Eastside' an. 3. Blues-Künstler glänzten bei der Oscar-Verleihung mit 'I Lied To You'. 4. Ryan McGarvey feiert Comeback mit 'Back to Life'. 5. When Rivers Meet veröffentlichen Single vom kommenden Album. 6. Artur Menezes veröffentlicht kraftvolle neue Single 'Once Again'.",
        ],
      },
      {
        headingEn: "🚌 Tours and Concerts",
        headingNo: "🚌 Turnéer og konserter",
        headingDe: "🚌 Tourneen und Konzerte",
        paragraphsEn: [
          "There's a lot happening out there right now. Here are some of the tours we're keeping a close eye on:",
          "Buddy Guy — farewell tour Europe 2026 — last chance! Walter Trout — European tour April–May 2026. Larkin Poe — Scandinavia tour confirmed June 2026. Kenny Wayne Shepherd — Notodden Blues Festival July 30 – Aug 2. Erja Lyytinen — Nordic tour spring 2026.",
        ],
        paragraphsNo: [
          "Det skjer mye der ute akkurat nå. Her er noen av turneene vi følger ekstra godt med på:",
          "Buddy Guy — farewell-turné Europa 2026 — siste sjanse! Walter Trout — europeisk turné april–mai 2026. Larkin Poe — Skandinavia-turné bekreftet juni 2026. Kenny Wayne Shepherd — Notodden Blues Festival 30. juli – 2. aug. Erja Lyytinen — nordisk turné vår 2026.",
        ],
        paragraphsDe: [
          "Draußen passiert gerade eine Menge. Hier sind einige der Tourneen, die wir besonders aufmerksam verfolgen:",
          "Buddy Guy — Abschiedstournee Europa 2026 — letzte Chance! Walter Trout — Europatournee April–Mai 2026. Larkin Poe — Skandinavien-Tournee bestätigt Juni 2026. Kenny Wayne Shepherd — Notodden Blues Festival 30. Juli – 2. Aug. Erja Lyytinen — Nordische Tournee Frühjahr 2026.",
        ],
        artistMentions: ["buddy-guy", "walter-trout", "larkin-poe", "kenny-wayne-shepherd", "erja-lyytinen"],
      },
      {
        headingEn: "🎸 Until Next Time",
        headingNo: "🎸 Til neste gang",
        headingDe: "🎸 Bis zum nächsten Mal",
        paragraphsEn: [
          "That was it from us this Monday. Remember — blues isn't just music. It's a way of seeing the world. And the world always looks a little better with blues in the background. 😄",
          "See you next Monday — on time this time, promise. — Kjell, Editor",
        ],
        paragraphsNo: [
          "Det var det fra oss denne mandagen. Husk — blues er ikke bare musikk. Det er en måte å se verden på. Og verden ser alltid litt bedre ut med blues i bakgrunnen. 😄",
          "Vi ses neste mandag — på riktig tid denne gangen, lover. — Kjell, Editor",
        ],
        paragraphsDe: [
          "Das war's von uns an diesem Montag. Denkt daran — Blues ist nicht nur Musik. Es ist eine Art, die Welt zu sehen. Und die Welt sieht immer etwas besser aus mit Blues im Hintergrund. 😄",
          "Wir sehen uns nächsten Montag — pünktlich diesmal, versprochen. — Kjell, Editor",
        ],
      },
    ],
  },
];

export const getBlogArticleById = (id: string): BlogArticle | undefined => {
  return blogArticles.find(article => article.id === id);
};
