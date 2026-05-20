export interface StyleComparison {
  id: string;
  nameEn: string;
  nameNo: string;
  period: string;
  color: string;
  originEn: string;
  originNo: string;
  descriptionEn: string;
  descriptionNo: string;
  characteristicsEn: string[];
  characteristicsNo: string[];
  keyInstrumentsEn: string[];
  keyInstrumentsNo: string[];
  keyArtists: string[];
  keyArtistIds: string[];
  soundDescriptionEn: string;
  soundDescriptionNo: string;
  historicalContextEn: string;
  historicalContextNo: string;
  legacyEn: string;
  legacyNo: string;
  tempoRange: string;
  typicalStructure: string;
}

export const styleComparisons: StyleComparison[] = [
  {
    id: "delta",
    nameEn: "Delta Blues",
    nameNo: "Delta Blues",
    period: "1890s–1940s",
    color: "blues-gold",
    originEn: "Mississippi Delta, USA",
    originNo: "Mississippi-deltaet, USA",
    descriptionEn: "The raw, acoustic bedrock of all blues. Born from field hollers, work songs, and spirituals in the Mississippi Delta region. Solo performers with acoustic guitars, often using bottleneck slide technique, delivered deeply personal music that expressed the hardship and resilience of African American life in the rural South.",
    descriptionNo: "Det rå, akustiske grunnfjellet for all blues. Født fra rop fra åkrene, arbeidssanger og spirituals i Mississippi-deltaets region. Soloartister med akustiske gitarer, ofte med bottleneck slideteknikk, leverte dypt personlig musikk som uttrykte motgang og motstandskraft i afrikansk-amerikansk liv på det rurale Sørstatene.",
    characteristicsEn: [
      "Solo acoustic guitar, often with slide/bottleneck",
      "Raw, emotionally intense vocal delivery",
      "Sparse instrumentation – voice and guitar, sometimes harmonica",
      "AAB lyrical structure (repeat first line, resolve in third)",
      "Polyrhythmic fingerpicking patterns from African traditions",
      "Open tunings (open G, open D) for slide playing",
      "Deeply personal, storytelling lyrics",
    ],
    characteristicsNo: [
      "Solo akustisk gitar, ofte med slide/bottleneck",
      "Rå, emosjonelt intens vokallevering",
      "Sparsom instrumentering – vokal og gitar, noen ganger munnspill",
      "AAB-lyrisk struktur (gjenta første linje, løs opp i tredje)",
      "Polyrytmiske fingerplukkingsmønstre fra afrikanske tradisjoner",
      "Åpne stemninger (åpen G, åpen D) for slidespill",
      "Dypt personlige, fortellende tekster",
    ],
    keyInstrumentsEn: ["Acoustic guitar", "Slide/bottleneck", "Harmonica", "Voice"],
    keyInstrumentsNo: ["Akustisk gitar", "Slide/bottleneck", "Munnspill", "Vokal"],
    keyArtists: ["Robert Johnson", "Charley Patton", "Son House", "Blind Lemon Jefferson", "Lead Belly"],
    keyArtistIds: ["robert-johnson", "charley-patton", "son-house", "blind-lemon-jefferson", "lead-belly"],
    soundDescriptionEn: "Imagine a lone voice crying out across a cotton field at dusk, accompanied only by the rhythmic thrum of an acoustic guitar. The sound is intimate, raw, and haunting – like a conversation between the singer and the earth itself.",
    soundDescriptionNo: "Forestill deg en ensom stemme som roper ut over et bomullsfelt i skumringen, akkompagnert kun av den rytmiske klangen fra en akustisk gitar. Lyden er intim, rå og hjemsøkende – som en samtale mellom sangeren og selve jorden.",
    historicalContextEn: "Emerged among sharecroppers and laborers in one of America's poorest regions. The Mississippi Delta's flat, fertile landscape was worked by formerly enslaved people and their descendants under conditions barely better than slavery. The blues gave voice to this experience.",
    historicalContextNo: "Oppsto blant leilendinger og arbeidere i en av Amerikas fattigste regioner. Mississippi-deltaets flate, fruktbare landskap ble bearbeidet av tidligere slaver og deres etterkommere under forhold knapt bedre enn slaveri. Bluesen ga stemme til denne erfaringen.",
    legacyEn: "The Delta blues is the DNA of virtually all popular music that followed – rock, R&B, soul, hip-hop, and country all trace their roots here.",
    legacyNo: "Delta-blues er DNA-et til praktisk talt all populærmusikk som fulgte – rock, R&B, soul, hip-hop og country kan alle spore røttene sine hit.",
    tempoRange: "60–120 BPM",
    typicalStructure: "12-bar blues (I-I-I-I / IV-IV-I-I / V-IV-I-I)",
  },
  {
    id: "chicago",
    nameEn: "Chicago Blues",
    nameNo: "Chicago Blues",
    period: "1940s–present",
    color: "blues-burgundy-light",
    originEn: "Chicago, Illinois, USA",
    originNo: "Chicago, Illinois, USA",
    descriptionEn: "When Delta blues artists migrated north during the Great Migration, they electrified their sound to be heard over the noise of crowded city clubs. The result was a new, amplified form of blues with full bands, driving rhythms, and the raw power to fill a room.",
    descriptionNo: "Da Delta-bluesartister migrerte nordover under den store migrasjonen, elektrifiserte de lyden sin for å bli hørt over støyen i overfylte byklubber. Resultatet var en ny, forsterket form for blues med fulle band, drivende rytmer og rå kraft til å fylle et rom.",
    characteristicsEn: [
      "Electric guitar as lead instrument",
      "Full band: guitar, harmonica, piano, bass, drums",
      "Amplified harmonica played through a microphone and PA",
      "Stronger, more driving rhythm section",
      "Call-and-response between vocals and instruments",
      "Urban themes: city life, love, struggle",
      "Influence of jazz phrasing and swing rhythms",
    ],
    characteristicsNo: [
      "Elektrisk gitar som hovedinstrument",
      "Fullt band: gitar, munnspill, piano, bass, trommer",
      "Forsterket munnspill spilt gjennom mikrofon og PA",
      "Sterkere, mer drivende rytmeseksjon",
      "Call-and-response mellom vokal og instrumenter",
      "Urbane temaer: byliv, kjærlighet, kamp",
      "Påvirkning fra jazzfrasering og swingrytmer",
    ],
    keyInstrumentsEn: ["Electric guitar", "Amplified harmonica", "Piano", "Bass", "Drums"],
    keyInstrumentsNo: ["Elektrisk gitar", "Forsterket munnspill", "Piano", "Bass", "Trommer"],
    keyArtists: ["Muddy Waters", "Howlin' Wolf", "Little Walter", "Willie Dixon", "Buddy Guy"],
    keyArtistIds: ["muddy-waters", "howlin-wolf", "little-walter", "willie-dixon", "buddy-guy"],
    soundDescriptionEn: "Picture a smoky, packed club on Chicago's South Side at midnight. The bass and drums lock into a groove, the harmonica wails through a cranked amplifier, and the electric guitar cuts through with stinging single notes. The crowd moves as one.",
    soundDescriptionNo: "Forestill deg en røykfylt, fullpakket klubb på Chicagos South Side ved midnatt. Bass og trommer låser seg i en groove, munnspillet hyler gjennom en forsterker, og den elektriske gitaren skjærer gjennom med stikkende enkelttoner. Publikum beveger seg som én.",
    historicalContextEn: "Born from the Great Migration (1910–1970), when over six million African Americans left the rural South for northern cities. Chicago's South Side and West Side became epicenters of Black culture, and the blues clubs along Maxwell Street and State Street became legendary.",
    historicalContextNo: "Født fra den store migrasjonen (1910–1970), da over seks millioner afroamerikanere forlot det rurale Sørstatene for nordlige byer. Chicagos South Side og West Side ble episentre for svart kultur, og bluesklubber langs Maxwell Street og State Street ble legendariske.",
    legacyEn: "Chicago blues is the direct ancestor of rock and roll. The British Invasion bands – Rolling Stones, Cream, Led Zeppelin – built their entire sound on Chicago blues foundations.",
    legacyNo: "Chicago-blues er den direkte forløperen til rock and roll. De britiske invasjonsbandene – Rolling Stones, Cream, Led Zeppelin – bygde hele sin lyd på Chicago-blues-grunnlaget.",
    tempoRange: "80–140 BPM",
    typicalStructure: "12-bar blues with band arrangement",
  },
  {
    id: "british",
    nameEn: "British Blues",
    nameNo: "Britisk Blues",
    period: "1960s–present",
    color: "blues-dusty",
    originEn: "United Kingdom",
    originNo: "Storbritannia",
    descriptionEn: "British musicians discovered American blues records in the late 1950s and were transformed. They played the music with reverence and intensity, adding rock energy and virtuoso guitar technique. The British Blues Boom of the 1960s paradoxically helped revive interest in the original American blues masters.",
    descriptionNo: "Britiske musikere oppdaget amerikanske bluesplater på slutten av 1950-tallet og ble forvandlet. De spilte musikken med ærbødighet og intensitet, og la til rock-energi og virtuos gitarteknikk. Den britiske bluesbølgen på 1960-tallet hjalp paradoksalt nok med å gjenopplive interessen for de originale amerikanske bluesmestrene.",
    characteristicsEn: [
      "Heavy emphasis on electric guitar virtuosity",
      "Louder, more distorted amplification",
      "Fusion of blues with rock energy and volume",
      "Extended guitar solos and improvisation",
      "Respect for original blues structures with added power",
      "Often power trio format (guitar, bass, drums)",
      "Introduced blues to mainstream white audiences globally",
    ],
    characteristicsNo: [
      "Sterk vekt på virtuost elektrisk gitarspill",
      "Høyere, mer forvrengt forsterkning",
      "Fusjon av blues med rock-energi og volum",
      "Utvidede gitarsoloer og improvisasjon",
      "Respekt for originale bluesstrukturer med tilført kraft",
      "Ofte power trio-format (gitar, bass, trommer)",
      "Introduserte blues for mainstream hvit publikum globalt",
    ],
    keyInstrumentsEn: ["Electric guitar (Gibson/Fender)", "Marshall amplifiers", "Bass guitar", "Drums"],
    keyInstrumentsNo: ["Elektrisk gitar (Gibson/Fender)", "Marshall-forsterkere", "Bassgitar", "Trommer"],
    keyArtists: ["Eric Clapton", "John Mayall", "Rory Gallagher", "Jeff Beck", "Gary Moore"],
    keyArtistIds: ["eric-clapton", "john-mayall", "rory-gallagher", "jeff-beck", "gary-moore"],
    soundDescriptionEn: "Imagine the raw power of Chicago blues played through cranked Marshall amplifiers in a London club. The guitar tone is thicker, more distorted, the rhythms more driving. It's blues with the volume turned up to 11 – faithful to the spirit but with a distinctly British intensity.",
    soundDescriptionNo: "Forestill deg den rå kraften til Chicago-blues spilt gjennom fullstendig åpne Marshall-forsterkere i en London-klubb. Gitartonen er tykkere, mer forvrengt, rytmene mer drivende. Det er blues med volumet skrudd til 11 – trofast mot ånden, men med en distinkt britisk intensitet.",
    historicalContextEn: "Young British musicians in the late 1950s discovered Chess Records imports and were captivated. Alexis Korner and John Mayall created 'blues universities' where future rock legends like Clapton, Mick Jagger, and Jimmy Page learned their craft. The resulting British Invasion sent American blues back across the Atlantic in electrified form.",
    historicalContextNo: "Unge britiske musikere på slutten av 1950-tallet oppdaget Chess Records-importer og ble fascinert. Alexis Korner og John Mayall skapte 'bluesuniversiteter' der fremtidige rocklegender som Clapton, Mick Jagger og Jimmy Page lærte sitt håndverk. Den resulterende britiske invasjonen sendte amerikansk blues tilbake over Atlanterhavet i elektrifisert form.",
    legacyEn: "British blues directly created rock music and helped save the original blues from obscurity. Many American blues legends received their first international recognition through British musicians championing their work.",
    legacyNo: "Britisk blues skapte direkte rockmusikk og hjalp med å redde den originale bluesen fra glemselen. Mange amerikanske blueslegender fikk sin første internasjonale anerkjennelse gjennom britiske musikere som fremmet arbeidet deres.",
    tempoRange: "90–160 BPM",
    typicalStructure: "12-bar blues with extended solos and rock arrangements",
  },
  {
    id: "scandinavian",
    nameEn: "Scandinavian Blues",
    nameNo: "Skandinavisk Blues",
    period: "1970s–present",
    color: "sky-400",
    originEn: "Norway, Sweden, Finland, Denmark",
    originNo: "Norge, Sverige, Finland, Danmark",
    descriptionEn: "The most unlikely chapter in blues history: musicians from the frozen North who fell deeply in love with music from the American South. Scandinavian blues artists blend reverence for the tradition with their own folk music heritage, creating something authentic and deeply personal.",
    descriptionNo: "Det mest usannsynlige kapittelet i blueshistorien: musikere fra det frosne nord som ble dypt forelsket i musikk fra amerikas sørstater. Skandinaviske bluesartister blander ærbødighet for tradisjonen med sin egen folkemusikkarv, og skaper noe autentisk og dypt personlig.",
    characteristicsEn: [
      "Blend of traditional blues with Nordic folk elements",
      "High technical proficiency from formal music education",
      "Often acoustic-leaning with clean, precise technique",
      "Melancholic undertones reflecting Nordic temperament",
      "Slide guitar and fingerpicking traditions",
      "Respect for original blues with cultural adaptation",
      "Strong festival culture supporting the scene",
    ],
    characteristicsNo: [
      "Blanding av tradisjonell blues med nordiske folkemusikkelementer",
      "Høy teknisk dyktighet fra formell musikkutdanning",
      "Ofte akustisk orientert med ren, presis teknikk",
      "Melankolske undertoner som reflekterer nordisk temperament",
      "Slidegitar og fingerplukkingstradisjoner",
      "Respekt for original blues med kulturell tilpasning",
      "Sterk festivalkultur som støtter scenen",
    ],
    keyInstrumentsEn: ["Acoustic & electric guitar", "Slide guitar", "Harmonica", "Hardanger fiddle (fusion)"],
    keyInstrumentsNo: ["Akustisk og elektrisk gitar", "Slidegitar", "Munnspill", "Hardingfele (fusjon)"],
    keyArtists: ["Knut Reiersrud", "Erja Lyytinen", "Vidar Busk", "Amund Maarud", "Louise Hoffsten"],
    keyArtistIds: ["knut-reiersrud", "erja-lyytinen", "vidar-busk", "amund-maarud", "louise-hoffsten"],
    soundDescriptionEn: "Take the emotional depth of Delta blues, add the crystalline clarity of Nordic air and the melancholy of long winter nights, and you begin to hear Scandinavian blues. It's often more contemplative, with a precision that reflects formal training, but the feeling – the core of the blues – remains intact.",
    soundDescriptionNo: "Ta den emosjonelle dybden til Delta-blues, legg til den krystallklare klarheten i nordisk luft og melankolien fra lange vinternetter, og du begynner å høre skandinavisk blues. Den er ofte mer kontemplativ, med en presisjon som reflekterer formell opplæring, men følelsen – bluesens kjerne – forblir intakt.",
    historicalContextEn: "Starting in the 1970s, Scandinavian musicians began pilgrimages to the American South, learning directly from the remaining Delta and Chicago masters. They brought this knowledge home and built thriving local scenes. Festivals like Notodden Blues Festival (Norway, est. 1988) became internationally recognized.",
    historicalContextNo: "Fra 1970-tallet begynte skandinaviske musikere pilegrimsferder til amerikas sørstater, og lærte direkte fra de gjenlevende Delta- og Chicago-mestrene. De brakte denne kunnskapen hjem og bygde blomstrende lokale scener. Festivaler som Notodden Blues Festival (Norge, grunnlagt 1988) ble internasjonalt anerkjent.",
    legacyEn: "Scandinavian blues proves the universality of the art form. These musicians demonstrate that you don't have to be born in the Delta to feel and play the blues with authenticity – you just need to listen with your heart.",
    legacyNo: "Skandinavisk blues beviser universaliteten til kunstformen. Disse musikerne demonstrerer at du ikke trenger å være født i Deltaet for å føle og spille blues med autentisitet – du trenger bare å lytte med hjertet.",
    tempoRange: "60–130 BPM",
    typicalStructure: "12-bar blues and original compositions with folk influences",
  },
];

export const getStyleById = (id: string): StyleComparison | undefined => {
  return styleComparisons.find(s => s.id === id);
};
