// Blues Quiz Question Pool
// Questions rotate weekly based on current week/year

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'audio-guess';
  difficulty: QuizDifficulty;
  question: string;
  questionNo: string;
  options: string[];
  optionsNo: string[];
  correctIndex: number;
  explanation: string;
  explanationNo: string;
  artistLink?: string;
  youtubeVideoId?: string;
  audioStart?: number;
  audioEnd?: number;
  audioHint?: string;
  audioHintNo?: string;
}

// ===== STANDARD MULTIPLE-CHOICE QUESTIONS =====
const standardQuestions: QuizQuestion[] = [
  // ----- EASY -----
  {
    id: 'mc-1', type: 'multiple-choice', difficulty: 'easy',
    question: "Who is considered the 'Father of Delta Blues'?",
    questionNo: "Hvem regnes som 'Delta Blues-ens far'?",
    options: ["Robert Johnson", "Charley Patton", "Muddy Waters", "B.B. King"],
    optionsNo: ["Robert Johnson", "Charley Patton", "Muddy Waters", "B.B. King"],
    correctIndex: 1,
    explanation: "Charley Patton (ca. 1891–1934) is widely regarded as the 'Father of Delta Blues.' Born in Edwards, Mississippi, he was the dominant figure at Dockery Plantation and directly influenced Son House, Robert Johnson, and Howlin' Wolf. His raw, rhythmic guitar style and showmanship defined what Delta blues would become.",
    explanationNo: "Charley Patton (ca. 1891–1934) regnes som 'Delta Blues-ens far.' Født i Edwards, Mississippi, var han den dominerende skikkelsen på Dockery Plantation og påvirket direkte Son House, Robert Johnson og Howlin' Wolf. Hans rå, rytmiske gitarstil og showmanship definerte hva Delta blues skulle bli.",
    artistLink: '/artists/charley-patton',
  },
  {
    id: 'mc-4', type: 'multiple-choice', difficulty: 'easy',
    question: "Which technique is most typical of Delta blues guitar?",
    questionNo: "Hvilken teknikk er mest typisk for Delta blues-gitar?",
    options: ["Fingerstyle and slide", "Flatpicking", "Tapping", "Sweep picking"],
    optionsNo: ["Fingerspill og slide", "Flatpicking", "Tapping", "Sweep picking"],
    correctIndex: 0,
    explanation: "Delta blues is characterized by fingerstyle technique and the use of slide (bottleneck) on the guitar. Son House, Robert Johnson, and Charley Patton all used these techniques. The slide was originally made from a broken bottle neck or a knife blade, creating the haunting, vocal-like tones that define the genre.",
    explanationNo: "Delta blues kjennetegnes av fingerspillteknikk og bruk av slide (flaskehals) på gitaren. Son House, Robert Johnson og Charley Patton brukte alle disse teknikkene. Sliden var opprinnelig laget av en knekt flaskehals eller et knivblad, og skapte de stemningsfulle, vokal-lignende tonene som definerer sjangeren.",
    artistLink: '/instruments',
  },
  {
    id: 'mc-5', type: 'multiple-choice', difficulty: 'easy',
    question: "Which city is Chicago blues most associated with?",
    questionNo: "Hvilken by er Chicago blues mest assosiert med?",
    options: ["Memphis", "Chicago", "New Orleans", "Clarksdale"],
    optionsNo: ["Memphis", "Chicago", "New Orleans", "Clarksdale"],
    correctIndex: 1,
    explanation: "Chicago blues developed when Delta blues artists like Muddy Waters, Howlin' Wolf, and Little Walter migrated north during the Great Migration (1940s–50s). They electrified the acoustic Delta sound at legendary venues on the South Side, and Chess Records at 2120 South Michigan Avenue became the epicenter of this revolution.",
    explanationNo: "Chicago blues utviklet seg da Delta blues-artister som Muddy Waters, Howlin' Wolf og Little Walter migrerte nordover under Den store migrasjonen (1940–50-tallet). De elektrifiserte den akustiske Delta-lyden på legendariske spillesteder på South Side, og Chess Records på 2120 South Michigan Avenue ble episenteret for denne revolusjonen.",
    artistLink: '/history',
  },
  {
    id: 'mc-10', type: 'multiple-choice', difficulty: 'easy',
    question: "Who was known as 'The Queen of the Blues'?",
    questionNo: "Hvem var kjent som 'Bluesens dronning'?",
    options: ["Bessie Smith", "Ma Rainey", "Koko Taylor", "Etta James"],
    optionsNo: ["Bessie Smith", "Ma Rainey", "Koko Taylor", "Etta James"],
    correctIndex: 2,
    explanation: "Koko Taylor (1928–2009), born Cora Anna Walton in Shelby County, Tennessee, earned the title 'Queen of the Blues' through her powerhouse vocals and domination of the Chicago blues scene. Her 1966 hit 'Wang Dang Doodle' (written by Willie Dixon) sold over a million copies and became her signature song.",
    explanationNo: "Koko Taylor (1928–2009), født Cora Anna Walton i Shelby County, Tennessee, fikk tittelen 'Bluesens dronning' gjennom sin kraftfulle vokal og dominans på Chicago blues-scenen. Hennes hit 'Wang Dang Doodle' fra 1966 (skrevet av Willie Dixon) solgte over en million eksemplarer og ble hennes signaturlåt.",
    artistLink: '/artists/koko-taylor',
  },
  {
    id: 'mc-11', type: 'multiple-choice', difficulty: 'easy',
    question: "Which instrument is Howlin' Wolf most known for?",
    questionNo: "Hvilket instrument er Howlin' Wolf mest kjent for?",
    options: ["Guitar", "Harmonica", "Vocals", "Piano"],
    optionsNo: ["Gitar", "Munnspill", "Vokal", "Piano"],
    correctIndex: 2,
    explanation: "Chester Arthur Burnett (1910–1976), known as Howlin' Wolf, had one of the most powerful and recognizable voices in blues history. Standing 6'3\" and weighing 275 lbs, his deep, growling voice was described by Sam Phillips as 'where the soul of man never dies.' He also played harmonica, but it was his vocals that defined songs like 'Smokestack Lightning' and 'Killing Floor.'",
    explanationNo: "Chester Arthur Burnett (1910–1976), kjent som Howlin' Wolf, hadde en av de kraftigste og mest gjenkjennelige stemmene i blueshistorien. 190 cm høy og 125 kg tung, ble hans dype, brummende stemme beskrevet av Sam Phillips som 'der menneskets sjel aldri dør.' Han spilte også munnspill, men det var vokalen hans som definerte sanger som 'Smokestack Lightning' og 'Killing Floor.'",
    artistLink: '/artists/howlin-wolf',
  },
  {
    id: 'mc-13', type: 'multiple-choice', difficulty: 'easy',
    question: "Which guitarist named his guitar 'Lucille'?",
    questionNo: "Hvilken gitarist kalte gitaren sin 'Lucille'?",
    options: ["Muddy Waters", "B.B. King", "Albert King", "Freddie King"],
    optionsNo: ["Muddy Waters", "B.B. King", "Albert King", "Freddie King"],
    correctIndex: 1,
    explanation: "Riley B. King (1925–2015), known as B.B. King, named all his guitars 'Lucille' after a near-fatal incident in Twist, Arkansas in 1949. Two men fighting over a woman named Lucille knocked over a kerosene barrel, setting the dance hall on fire. B.B. ran back inside to save his $30 Gibson guitar, and named it Lucille as a reminder to never do anything so foolish again.",
    explanationNo: "Riley B. King (1925–2015), kjent som B.B. King, kalte alle gitarene sine 'Lucille' etter en nær-dødelig hendelse i Twist, Arkansas i 1949. To menn som sloss om en kvinne ved navn Lucille veltet en kerosenfat og satte danselokalet i brann. B.B. løp tilbake inn for å redde sin Gibson-gitar til $30, og kalte den Lucille som en påminnelse om aldri å gjøre noe så dumt igjen.",
    artistLink: '/artists/bb-king',
  },
  {
    id: 'mc-14', type: 'multiple-choice', difficulty: 'easy',
    question: "What does '12-bar blues' mean?",
    questionNo: "Hva betyr '12-takters blues'?",
    options: ["A blues with 12 verses", "A chord progression over 12 bars", "Blues played on a 12-string guitar", "A blues lasting 12 minutes"],
    optionsNo: ["En blues med 12 vers", "En akkordprogresjon over 12 takter", "Blues spilt på 12-strengs gitar", "En blues som varer 12 minutter"],
    correctIndex: 1,
    explanation: "The 12-bar blues is the backbone of blues music – a chord progression using I-IV-V chords that repeats over 12 bars. It follows a specific pattern: 4 bars of I, 2 bars of IV, 2 bars of I, then V-IV-I-I (or V). This structure has been used in thousands of blues, rock, and jazz songs from Robert Johnson to The Rolling Stones.",
    explanationNo: "12-takters blues er ryggraden i bluesmusikk – en akkordprogresjon med I-IV-V-akkorder som gjentas over 12 takter. Den følger et spesifikt mønster: 4 takter I, 2 takter IV, 2 takter I, deretter V-IV-I-I (eller V). Denne strukturen har blitt brukt i tusenvis av blues-, rock- og jazzsanger fra Robert Johnson til The Rolling Stones.",
    artistLink: '/learn-blues',
  },
  {
    id: 'mc-15', type: 'multiple-choice', difficulty: 'easy',
    question: "Who was known as 'Mother of the Blues'?",
    questionNo: "Hvem var kjent som 'Bluesens mor'?",
    options: ["Bessie Smith", "Ma Rainey", "Memphis Minnie", "Victoria Spivey"],
    optionsNo: ["Bessie Smith", "Ma Rainey", "Memphis Minnie", "Victoria Spivey"],
    correctIndex: 1,
    explanation: "Gertrude 'Ma' Rainey (1886–1939), born in Columbus, Georgia, is called 'Mother of the Blues' because she was one of the earliest professional blues performers and the first generation to record. She mentored Bessie Smith and recorded over 100 songs for Paramount Records between 1923–1928, helping establish blues as a commercial genre.",
    explanationNo: "Gertrude 'Ma' Rainey (1886–1939), født i Columbus, Georgia, kalles 'Bluesens mor' fordi hun var en av de tidligste profesjonelle bluesartistene og den første generasjonen som spilte inn. Hun veiledet Bessie Smith og spilte inn over 100 sanger for Paramount Records mellom 1923–1928, og hjalp til med å etablere blues som en kommersiell sjanger.",
    artistLink: '/artists/ma-rainey',
  },
  {
    id: 'mc-17', type: 'multiple-choice', difficulty: 'easy',
    question: "What is a 'bottleneck' in blues context?",
    questionNo: "Hva er en 'bottleneck' i blues-sammenheng?",
    options: ["A type of harmonica", "A slide tool for guitar", "A chord type", "A singing style"],
    optionsNo: ["En type munnspill", "Et slideverktøy for gitar", "En akkordtype", "En sangteknikk"],
    correctIndex: 1,
    explanation: "A bottleneck is a glass or metal tube worn on the finger to slide along the guitar strings, creating the singing, moaning tones that define Delta blues. Originally, players like Son House and Robert Johnson used actual broken bottle necks. Today, artists like Knut Reiersrud and Erja Lyytinen keep this tradition alive in Scandinavia.",
    explanationNo: "En bottleneck er et glass- eller metallrør som bæres på fingeren for å gli langs gitarstrengene, og skaper de syngende, klagende tonene som definerer Delta blues. Opprinnelig brukte spillere som Son House og Robert Johnson faktiske knekte flaskehalser. I dag holder artister som Knut Reiersrud og Erja Lyytinen denne tradisjonen i live i Skandinavia.",
    artistLink: '/instruments',
  },
  {
    id: 'mc-25', type: 'multiple-choice', difficulty: 'easy',
    question: "Which Gibson guitar model is most associated with blues-rock?",
    questionNo: "Hvilken Gibson-gitarmodell er mest assosiert med blues-rock?",
    options: ["Gibson SG", "Gibson Les Paul", "Gibson Flying V", "Gibson Explorer"],
    optionsNo: ["Gibson SG", "Gibson Les Paul", "Gibson Flying V", "Gibson Explorer"],
    correctIndex: 1,
    explanation: "The Gibson Les Paul, designed in collaboration with guitarist Les Paul in 1952, has been the guitar of choice for blues-rock legends. Eric Clapton used one on the legendary 'Beano' album with John Mayall's Bluesbreakers (1966), Peter Green's Les Paul produced the iconic tone on 'Albatross', and Joe Bonamassa owns over 500 guitars but keeps returning to his Les Pauls.",
    explanationNo: "Gibson Les Paul, designet i samarbeid med gitaristen Les Paul i 1952, har vært foretrukket gitar for blues-rock-legender. Eric Clapton brukte en på det legendariske 'Beano'-albumet med John Mayalls Bluesbreakers (1966), Peter Greens Les Paul produserte den ikoniske tonen på 'Albatross', og Joe Bonamassa eier over 500 gitarer men vender stadig tilbake til sine Les Pauler.",
    artistLink: '/instruments',
  },
  {
    id: 'mc-29', type: 'multiple-choice', difficulty: 'easy',
    question: "What instrument is the National Resonator guitar known for?",
    questionNo: "Hva er National Resonator-gitaren kjent for?",
    options: ["Electric distortion", "Metallic acoustic resonance for slide blues", "12-string tuning", "Nylon string classical sound"],
    optionsNo: ["Elektrisk forvrengning", "Metallisk akustisk resonans for slide blues", "12-strengs stemming", "Nylonstreng klassisk lyd"],
    correctIndex: 1,
    explanation: "The National Resonator guitar, first produced in 1927, uses spun aluminum cones instead of a wooden soundboard to produce a loud, metallic tone. Son House, Bukka White, and Tampa Red all played Nationals, and the instrument became synonymous with pre-war Delta and country blues. Today it remains iconic – you can see one on the cover of Dire Straits' 'Brothers in Arms.'",
    explanationNo: "National Resonator-gitaren, først produsert i 1927, bruker spunne aluminiumskjegler i stedet for et trelokk for å produsere en høy, metallisk tone. Son House, Bukka White og Tampa Red spilte alle Nationals, og instrumentet ble synonymt med førkrigs Delta og country blues. I dag er den fortsatt ikonisk – du kan se en på coveret til Dire Straits' 'Brothers in Arms.'",
    artistLink: '/instruments',
  },
  {
    id: 'mc-31', type: 'multiple-choice', difficulty: 'easy',
    question: "What is the 'blue note' in blues music?",
    questionNo: "Hva er 'blue note' i bluesmusikk?",
    options: ["A famous jazz club in New York", "A flattened 3rd, 5th, or 7th note in a scale", "A type of harmonica reed", "A record label"],
    optionsNo: ["En berømt jazzklubb i New York", "En senket 3., 5. eller 7. tone i en skala", "En type munnspillblad", "Et plateselskap"],
    correctIndex: 1,
    explanation: "Blue notes are the flattened 3rd, 5th, or 7th notes in a major scale, creating the tension and emotional depth that defines blues. These notes trace their roots to West African musical scales and work songs. The 'Blue Note' jazz club in New York and Blue Note Records were both named after this musical concept.",
    explanationNo: "Blue notes er de senkede 3., 5. eller 7. tonene i en durskala, og skaper spenningen og den emosjonelle dybden som definerer blues. Disse tonene har sine røtter i vestafrikanske musikalske skalaer og arbeidssanger. 'Blue Note'-jazzklubben i New York og Blue Note Records ble begge oppkalt etter dette musikalske konseptet.",
    artistLink: '/learn-blues',
  },

  // ----- MEDIUM -----
  {
    id: 'mc-2', type: 'multiple-choice', difficulty: 'medium',
    question: "Which song, credited to Willie Dixon, became Muddy Waters' signature tune?",
    questionNo: "Hvilken sang, kreditert Willie Dixon, ble Muddy Waters' signaturmelodi?",
    options: ["Cross Road Blues", "Hoochie Coochie Man", "Dust My Broom", "Sweet Home Chicago"],
    optionsNo: ["Cross Road Blues", "Hoochie Coochie Man", "Dust My Broom", "Sweet Home Chicago"],
    correctIndex: 1,
    explanation: "'Hoochie Coochie Man' was written by Willie Dixon and recorded by Muddy Waters at Chess Studios in January 1954. It reached #3 on the R&B charts and became one of the most covered songs in blues history. Dixon was the creative mastermind behind Chess Records, writing hits for Muddy, Howlin' Wolf, Little Walter, and Koko Taylor.",
    explanationNo: "'Hoochie Coochie Man' ble skrevet av Willie Dixon og spilt inn av Muddy Waters på Chess Studios i januar 1954. Den nådde 3. plass på R&B-listene og ble en av de mest covrede sangene i blueshistorien. Dixon var det kreative geniet bak Chess Records, og skrev hits for Muddy, Howlin' Wolf, Little Walter og Koko Taylor.",
    artistLink: '/artists/muddy-waters',
  },
  {
    id: 'mc-3', type: 'multiple-choice', difficulty: 'medium',
    question: "Who played harmonica on 'Juke' (1952)?",
    questionNo: "Hvem spilte munnspill på 'Juke' (1952)?",
    options: ["Sonny Boy Williamson", "Little Walter", "Big Walter Horton", "Junior Wells"],
    optionsNo: ["Sonny Boy Williamson", "Little Walter", "Big Walter Horton", "Junior Wells"],
    correctIndex: 1,
    explanation: "Marion Walter Jacobs (1930–1968), known as Little Walter, recorded 'Juke' in 1952 at Chess Studios. It became the first (and still one of the only) instrumental blues harmonica singles to reach #1 on the R&B charts, staying there for 8 weeks. He revolutionized the instrument by amplifying it through a microphone cupped in his hands, creating the distorted, powerful tone that became the standard for Chicago blues harmonica.",
    explanationNo: "Marion Walter Jacobs (1930–1968), kjent som Little Walter, spilte inn 'Juke' i 1952 på Chess Studios. Den ble den første (og fortsatt en av de eneste) instrumentale blues-munnspillsinglene som nådde førsteplass på R&B-listene, der den lå i 8 uker. Han revolusjonerte instrumentet ved å forsterke det gjennom en mikrofon holdt i hendene, og skapte den forvrengte, kraftfulle tonen som ble standarden for Chicago blues-munnspill.",
    artistLink: '/artists/little-walter',
  },
  {
    id: 'mc-6', type: 'multiple-choice', difficulty: 'medium',
    question: "Who wrote 'Cross Road Blues' (1936)?",
    questionNo: "Hvem skrev 'Cross Road Blues' (1936)?",
    options: ["Son House", "Robert Johnson", "Skip James", "Blind Lemon Jefferson"],
    optionsNo: ["Son House", "Robert Johnson", "Skip James", "Blind Lemon Jefferson"],
    correctIndex: 1,
    explanation: "Robert Johnson (1911–1938) wrote and recorded 'Cross Road Blues' at the Gunter Hotel in San Antonio, Texas on November 27, 1936. The song, about standing at a crossroads trying to hitch a ride, later inspired the myth of Johnson selling his soul to the devil. Eric Clapton's cover with Cream ('Crossroads') in 1968 brought this Delta classic to a worldwide rock audience.",
    explanationNo: "Robert Johnson (1911–1938) skrev og spilte inn 'Cross Road Blues' på Gunter Hotel i San Antonio, Texas 27. november 1936. Sangen, om å stå ved et veikryss og prøve å haike, inspirerte senere myten om at Johnson solgte sjelen sin til djevelen. Eric Claptons cover med Cream ('Crossroads') i 1968 brakte denne Delta-klassikeren til et verdensomspennende rockpublikum.",
    artistLink: '/artists/robert-johnson',
  },
  {
    id: 'mc-7', type: 'multiple-choice', difficulty: 'medium',
    question: "Which record label was central to Chicago blues in the 1950s?",
    questionNo: "Hvilket plateselskap var sentralt for Chicago blues på 1950-tallet?",
    options: ["Sun Records", "Chess Records", "Vee-Jay", "Motown"],
    optionsNo: ["Sun Records", "Chess Records", "Vee-Jay", "Motown"],
    correctIndex: 1,
    explanation: "Chess Records, founded by Polish-American brothers Leonard and Phil Chess in 1950, was headquartered at 2120 South Michigan Avenue in Chicago. It was home to Muddy Waters, Howlin' Wolf, Little Walter, Willie Dixon, Sonny Boy Williamson II, Etta James, and Chuck Berry. The Rolling Stones made a pilgrimage there in 1964 and recorded '2120 South Michigan Avenue' as a tribute.",
    explanationNo: "Chess Records, grunnlagt av de polsk-amerikanske brødrene Leonard og Phil Chess i 1950, hadde hovedkvarter på 2120 South Michigan Avenue i Chicago. Det var hjemmet til Muddy Waters, Howlin' Wolf, Little Walter, Willie Dixon, Sonny Boy Williamson II, Etta James og Chuck Berry. The Rolling Stones valfartet dit i 1964 og spilte inn '2120 South Michigan Avenue' som en hyllest.",
    artistLink: '/history',
  },
  {
    id: 'mc-8', type: 'multiple-choice', difficulty: 'medium',
    question: "Which artist popularized electric guitar in blues during the 1940s–50s?",
    questionNo: "Hvilken artist populariserte elektrisk gitar i blues på 1940–50-tallet?",
    options: ["T-Bone Walker", "Elmore James", "Muddy Waters", "Howlin' Wolf"],
    optionsNo: ["T-Bone Walker", "Elmore James", "Muddy Waters", "Howlin' Wolf"],
    correctIndex: 0,
    explanation: "Aaron Thibeaux 'T-Bone' Walker (1910–1975) was the first blues musician to use an electric guitar as a lead instrument. His 1947 recording 'Call It Stormy Monday (But Tuesday Is Just as Bad)' is one of the most covered blues songs ever. He also pioneered showmanship – playing guitar behind his head and doing the splits, moves later adopted by Jimi Hendrix and Chuck Berry.",
    explanationNo: "Aaron Thibeaux 'T-Bone' Walker (1910–1975) var den første bluesmusikeren som brukte elektrisk gitar som soloinstrument. Hans innspilling 'Call It Stormy Monday (But Tuesday Is Just as Bad)' fra 1947 er en av de mest covrede bluessangene noensinne. Han var også en pioner innen showmanship – spilte gitar bak hodet og gjorde spagaten, bevegelser som senere ble adoptert av Jimi Hendrix og Chuck Berry.",
    artistLink: '/artists/t-bone-walker',
  },
  {
    id: 'mc-9', type: 'multiple-choice', difficulty: 'medium',
    question: "Which song is considered the first commercial blues recording (1920)?",
    questionNo: "Hvilken sang regnes som den første kommersielle blues-innspillingen (1920)?",
    options: ["Crazy Blues – Mamie Smith", "St. Louis Blues", "Cross Road Blues", "Pony Blues"],
    optionsNo: ["Crazy Blues – Mamie Smith", "St. Louis Blues", "Cross Road Blues", "Pony Blues"],
    correctIndex: 0,
    explanation: "'Crazy Blues' by Mamie Smith, recorded on August 10, 1920 for Okeh Records in New York, is considered the first commercially successful blues recording. It sold 75,000 copies in its first month and over one million total, proving that there was a massive market for African American music and launching the 'race records' era.",
    explanationNo: "'Crazy Blues' av Mamie Smith, spilt inn 10. august 1920 for Okeh Records i New York, regnes som den første kommersielt vellykkede blues-innspillingen. Den solgte 75 000 eksemplarer den første måneden og over én million totalt, noe som beviste at det fantes et enormt marked for afroamerikansk musikk og lanserte 'race records'-æraen.",
    artistLink: '/history',
  },
  {
    id: 'mc-12', type: 'multiple-choice', difficulty: 'medium',
    question: "Who wrote 'The Thrill Is Gone'?",
    questionNo: "Hvem skrev 'The Thrill Is Gone'?",
    options: ["B.B. King", "Roy Hawkins", "Albert King", "Freddie King"],
    optionsNo: ["B.B. King", "Roy Hawkins", "Albert King", "Freddie King"],
    correctIndex: 1,
    explanation: "'The Thrill Is Gone' was written by Roy Hawkins and Rick Darnell and first recorded by Hawkins in 1951 for Modern Records. B.B. King's iconic 1969 version, recorded at the Hit Factory in New York with lush string arrangements by Bert de Coteaux, reached #3 on the R&B charts and won a Grammy. It became the most recognizable blues song in the world.",
    explanationNo: "'The Thrill Is Gone' ble skrevet av Roy Hawkins og Rick Darnell og først spilt inn av Hawkins i 1951 for Modern Records. B.B. Kings ikoniske versjon fra 1969, innspilt på Hit Factory i New York med frodige strykearrangementer av Bert de Coteaux, nådde 3. plass på R&B-listene og vant en Grammy. Den ble den mest gjenkjennelige bluessangen i verden.",
    artistLink: '/artists/bb-king',
  },
  {
    id: 'mc-16', type: 'multiple-choice', difficulty: 'medium',
    question: "Which artist recorded 'Dust My Broom' in 1951?",
    questionNo: "Hvilken artist spilte inn 'Dust My Broom' i 1951?",
    options: ["Robert Johnson", "Elmore James", "Muddy Waters", "Howlin' Wolf"],
    optionsNo: ["Robert Johnson", "Elmore James", "Muddy Waters", "Howlin' Wolf"],
    correctIndex: 1,
    explanation: "Elmore James (1918–1963) recorded his electrified version of 'Dust My Broom' for Trumpet Records in Jackson, Mississippi in 1951, with Sonny Boy Williamson II on harmonica. The opening slide guitar riff – based on Robert Johnson's 1936 original – became one of the most recognizable in all of blues and has been copied by countless guitarists.",
    explanationNo: "Elmore James (1918–1963) spilte inn sin elektrifiserte versjon av 'Dust My Broom' for Trumpet Records i Jackson, Mississippi i 1951, med Sonny Boy Williamson II på munnspill. Det ikoniske åpningsriffet på slidegitar – basert på Robert Johnsons original fra 1936 – ble et av de mest gjenkjennelige i all blues og har blitt kopiert av utallige gitarister.",
    artistLink: '/artists/elmore-james',
  },
  {
    id: 'mc-18', type: 'multiple-choice', difficulty: 'medium',
    question: "Which Texas blues guitarist died in a helicopter crash in 1990?",
    questionNo: "Hvilken Texas blues-gitarist døde i en helikopterstyrt i 1990?",
    options: ["Freddie King", "Albert Collins", "Stevie Ray Vaughan", "Johnny Winter"],
    optionsNo: ["Freddie King", "Albert Collins", "Stevie Ray Vaughan", "Johnny Winter"],
    correctIndex: 2,
    explanation: "Stevie Ray Vaughan (1954–1990) died in a helicopter crash at Alpine Valley Music Theatre in East Troy, Wisconsin on August 27, 1990, just hours after performing alongside Eric Clapton, Buddy Guy, and Robert Cray. He was 35 years old and had just overcome addiction. His album 'Texas Flood' (1983) is considered one of the greatest blues albums ever recorded.",
    explanationNo: "Stevie Ray Vaughan (1954–1990) døde i en helikopterstyrt ved Alpine Valley Music Theatre i East Troy, Wisconsin 27. august 1990, bare timer etter å ha opptrådt sammen med Eric Clapton, Buddy Guy og Robert Cray. Han var 35 år gammel og hadde nettopp overvunnet avhengighet. Albumet hans 'Texas Flood' (1983) regnes som et av de største bluesalbumene noensinne.",
    artistLink: '/artists/stevie-ray-vaughan',
  },
  {
    id: 'mc-20', type: 'multiple-choice', difficulty: 'medium',
    question: "Who was known for using 'cross harp' on harmonica?",
    questionNo: "Hvem var kjent for å bruke 'cross harp' på munnspill?",
    options: ["Sonny Boy Williamson I", "Little Walter", "Big Walter Horton", "Junior Wells"],
    optionsNo: ["Sonny Boy Williamson I", "Little Walter", "Big Walter Horton", "Junior Wells"],
    correctIndex: 1,
    explanation: "Little Walter revolutionized blues harmonica by mastering 'cross harp' (2nd position) – playing a harmonica in a different key than it's tuned to, which allows for more expressive bending and blue notes. Combined with his innovation of amplifying the harmonica through a cupped microphone, he created a sound so powerful that the harmonica became a lead instrument rivaling the guitar.",
    explanationNo: "Little Walter revolusjonerte blues-munnspillet ved å mestre 'cross harp' (2. posisjon) – å spille et munnspill i en annen toneart enn det er stemt i, noe som tillater mer ekspressiv bøying og blue notes. Kombinert med hans innovasjon med å forsterke munnspillet gjennom en mikrofon holdt i hendene, skapte han en lyd så kraftfull at munnspillet ble et soloinstrument som rivaliserte gitaren.",
    artistLink: '/artists/little-walter',
  },
  {
    id: 'mc-21', type: 'multiple-choice', difficulty: 'medium',
    question: "Which Scandinavian guitarist is known for his bottleneck slide and roots blues?",
    questionNo: "Hvilken skandinavisk gitarist er kjent for sin bottleneck slide og roots blues?",
    options: ["Vidar Busk", "Knut Reiersrud", "Amund Maarud", "Erja Lyytinen"],
    optionsNo: ["Vidar Busk", "Knut Reiersrud", "Amund Maarud", "Erja Lyytinen"],
    correctIndex: 1,
    explanation: "Knut Reiersrud (b. 1961) is Norway's most internationally acclaimed blues and roots musician. A master of bottleneck slide guitar, he has collaborated with artists across the globe – from Mali to Mississippi – blending Norwegian folk traditions with deep Delta blues. He has won multiple Spellemannpriser and performed at major blues festivals worldwide.",
    explanationNo: "Knut Reiersrud (f. 1961) er Norges mest internasjonalt anerkjente blues- og rootsmusiker. En mester på bottleneck slidegitar, har han samarbeidet med artister over hele verden – fra Mali til Mississippi – og blander norske folktradisjoner med dyp Delta blues. Han har vunnet flere Spellemannpriser og opptrådt på store bluesfestivaler verden over.",
    artistLink: '/scandinavian-blues/knut-reiersrud',
  },
  {
    id: 'mc-23', type: 'multiple-choice', difficulty: 'medium',
    question: "Which British guitarist led the Bluesbreakers and mentored Eric Clapton?",
    questionNo: "Hvilken britisk gitarist ledet Bluesbreakers og veiledet Eric Clapton?",
    options: ["Peter Green", "John Mayall", "Alexis Korner", "Jeff Beck"],
    optionsNo: ["Peter Green", "John Mayall", "Alexis Korner", "Jeff Beck"],
    correctIndex: 1,
    explanation: "John Mayall (1933–2024), 'The Godfather of British Blues,' led his Bluesbreakers as a revolving-door training ground for Britain's greatest guitarists. Eric Clapton (1965–66), Peter Green (1966–67), and Mick Taylor (1967–69) all served apprenticeships in the band before forming Cream, Fleetwood Mac, and joining The Rolling Stones respectively.",
    explanationNo: "John Mayall (1933–2024), 'Gudfaren til britisk blues,' ledet sine Bluesbreakers som en treningsplass med svingdør for Storbritannias største gitarister. Eric Clapton (1965–66), Peter Green (1966–67) og Mick Taylor (1967–69) gjennomgikk alle læretid i bandet før de dannet henholdsvis Cream, Fleetwood Mac og ble med i The Rolling Stones.",
    artistLink: '/british-blues/john-mayall',
  },
  {
    id: 'mc-24', type: 'multiple-choice', difficulty: 'medium',
    question: "Which young guitarist won a Grammy before turning 22 and is from Clarksdale, Mississippi?",
    questionNo: "Hvilken ung gitarist vant en Grammy før han fylte 22 og er fra Clarksdale, Mississippi?",
    options: ["Gary Clark Jr.", "Christone 'Kingfish' Ingram", "Marcus King", "Jontavious Willis"],
    optionsNo: ["Gary Clark Jr.", "Christone 'Kingfish' Ingram", "Marcus King", "Jontavious Willis"],
    correctIndex: 1,
    explanation: "Christone 'Kingfish' Ingram (b. 1999) from Clarksdale, Mississippi – the birthplace of Delta blues – won a Grammy in 2022 for his album '662' (named after Clarksdale's area code). Mentored by Buddy Guy and endorsed by blues royalty, he represents the living connection between Delta blues' past and future. His 2019 debut 'Kingfish' was produced by Tom Hambridge.",
    explanationNo: "Christone 'Kingfish' Ingram (f. 1999) fra Clarksdale, Mississippi – fødestedet til Delta blues – vant en Grammy i 2022 for albumet '662' (oppkalt etter Clarksdales retningsnummer). Veiledet av Buddy Guy og godkjent av blues-royalty, representerer han den levende koblingen mellom Delta blues' fortid og fremtid. Debutalbumet 'Kingfish' fra 2019 ble produsert av Tom Hambridge.",
    artistLink: '/artists/christone-kingfish-ingram',
  },
  {
    id: 'mc-27', type: 'multiple-choice', difficulty: 'medium',
    question: "Which blues festival in Norway has been running since 1988?",
    questionNo: "Hvilken bluesfestival i Norge har pågått siden 1988?",
    options: ["Notodden Blues Festival", "Hell Blues Festival", "Stavanger Blues", "Bergen Blues & Roots"],
    optionsNo: ["Notodden Blues Festival", "Hell Blues Festival", "Stavanger Blues", "Bergen Blues & Roots"],
    correctIndex: 0,
    explanation: "Notodden Blues Festival, held annually in the small industrial town of Notodden (pop. ~12,000) in Telemark, has been one of Europe's premier blues festivals since 1988. B.B. King, Buddy Guy, Robert Cray, Joe Bonamassa, and hundreds of international acts have graced its stages. The town is also home to the European Blues Museum.",
    explanationNo: "Notodden Blues Festival, som holdes årlig i den lille industribyen Notodden (ca. 12 000 innbyggere) i Telemark, har vært en av Europas fremste bluesfestivaler siden 1988. B.B. King, Buddy Guy, Robert Cray, Joe Bonamassa og hundrevis av internasjonale artister har opptrådt der. Byen er også hjemmet til European Blues Museum.",
    artistLink: '/blues-festivals',
  },
  {
    id: 'mc-28', type: 'multiple-choice', difficulty: 'medium',
    question: "Who is Shemekia Copeland's father?",
    questionNo: "Hvem er Shemekia Copelands far?",
    options: ["Buddy Guy", "Johnny Copeland", "Albert Collins", "Freddie King"],
    optionsNo: ["Buddy Guy", "Johnny Copeland", "Albert Collins", "Freddie King"],
    correctIndex: 1,
    explanation: "Shemekia Copeland (b. 1979) is the daughter of Houston-born Texas blues guitarist Johnny Copeland (1937–1997), who won a Grammy in 1985 for 'Showdown!' alongside Albert Collins and Robert Cray. Shemekia made her stage debut at age 8 at Harlem's Cotton Club and has won multiple Blues Music Awards, carrying on her father's legacy with a voice that can shake buildings.",
    explanationNo: "Shemekia Copeland (f. 1979) er datteren til Houston-fødte Texas blues-gitaristen Johnny Copeland (1937–1997), som vant en Grammy i 1985 for 'Showdown!' sammen med Albert Collins og Robert Cray. Shemekia debuterte på scenen som 8-åring på Cotton Club i Harlem og har vunnet flere Blues Music Awards, og fører farens arv videre med en stemme som kan få bygninger til å riste.",
    artistLink: '/artists/shemekia-copeland',
  },
  {
    id: 'mc-32', type: 'multiple-choice', difficulty: 'medium',
    question: "Which guitarist is known for playing his guitar left-handed and upside down?",
    questionNo: "Hvilken gitarist er kjent for å spille gitaren venstrehendt og opp-ned?",
    options: ["Buddy Guy", "Albert King", "Freddie King", "B.B. King"],
    optionsNo: ["Buddy Guy", "Albert King", "Freddie King", "B.B. King"],
    correctIndex: 1,
    explanation: "Albert King (1923–1992) played a right-handed Gibson Flying V upside down as a left-hander, meaning he pulled the strings downward for his bends instead of pushing them up. This gave him his signature powerful, vocal-like string bending style that directly influenced Stevie Ray Vaughan, who called Albert 'the master.' His 1967 album 'Born Under a Bad Sign' is a cornerstone of modern blues.",
    explanationNo: "Albert King (1923–1992) spilte en høyrehendt Gibson Flying V opp-ned som venstrehendt, noe som betydde at han trakk strengene nedover for sine bøyninger i stedet for å skyve dem opp. Dette ga ham hans signatur kraftfulle, vokal-lignende strengbøyningsstil som direkte påvirket Stevie Ray Vaughan, som kalte Albert 'mesteren.' Albumet 'Born Under a Bad Sign' fra 1967 er en hjørnestein i moderne blues.",
    artistLink: '/artists/albert-king',
  },
  {
    id: 'mc-35', type: 'multiple-choice', difficulty: 'medium',
    question: "Which Finnish blues guitarist is known for her slide guitar mastery?",
    questionNo: "Hvilken finsk bluesgitarist er kjent for sin slidegitarmestring?",
    options: ["Louise Hoffsten", "Erja Lyytinen", "Rita Engedalen", "Sue Foley"],
    optionsNo: ["Louise Hoffsten", "Erja Lyytinen", "Rita Engedalen", "Sue Foley"],
    correctIndex: 1,
    explanation: "Erja Lyytinen (b. 1976) from Kuopio, Finland, is one of Europe's finest blues guitarists, known internationally for her exceptional slide guitar technique. She studied at the Helsinki Conservatory and Musician's Institute in Los Angeles, and has been called 'the new Empress of the Blues' by Guitar World magazine. She has performed with Joe Bonamassa and at major festivals worldwide.",
    explanationNo: "Erja Lyytinen (f. 1976) fra Kuopio, Finland, er en av Europas fineste bluesgitarister, internasjonalt kjent for sin eksepsjonelle slidegitarteknikk. Hun studerte ved Helsinki Conservatory og Musician's Institute i Los Angeles, og har blitt kalt 'den nye keiserinnen av blues' av Guitar World magazine. Hun har opptrådt med Joe Bonamassa og på store festivaler verden over.",
    artistLink: '/scandinavian-blues/erja-lyytinen',
  },

  // ----- HARD -----
  {
    id: 'mc-19', type: 'multiple-choice', difficulty: 'hard',
    question: "Who founded Paramount Records, which recorded many early blues artists?",
    questionNo: "Hvem grunnla Paramount Records, som spilte inn mange tidlige bluesartister?",
    options: ["Leonard Chess", "Sam Phillips", "Wisconsin Chair Company", "John Hammond"],
    optionsNo: ["Leonard Chess", "Sam Phillips", "Wisconsin Chair Company", "John Hammond"],
    correctIndex: 2,
    explanation: "Paramount Records was founded in 1917 by the Wisconsin Chair Company in Port Washington, Wisconsin – originally to sell phonograph cabinets! They needed records to demonstrate their cabinets, leading them to record music. Between 1922–1932 they recorded crucial early blues by Charley Patton, Blind Lemon Jefferson, Ma Rainey, Skip James, and Son House. Despite poor recording quality, these recordings are now priceless documents of early blues.",
    explanationNo: "Paramount Records ble grunnlagt i 1917 av Wisconsin Chair Company i Port Washington, Wisconsin – opprinnelig for å selge grammofon-kabinetter! De trengte plater for å demonstrere kabinettene, noe som førte til at de begynte å spille inn musikk. Mellom 1922–1932 spilte de inn avgjørende tidlig blues av Charley Patton, Blind Lemon Jefferson, Ma Rainey, Skip James og Son House. Til tross for dårlig innspillingskvalitet er disse innspillingene nå uvurderlige dokumenter av tidlig blues.",
    artistLink: '/history',
  },
  {
    id: 'mc-22', type: 'multiple-choice', difficulty: 'hard',
    question: "What was the 'Great Migration' and how did it affect blues?",
    questionNo: "Hva var 'Den store migrasjonen' og hvordan påvirket den blues?",
    options: [
      "A music festival in Chicago",
      "Mass movement of African Americans from the South to northern cities",
      "A record label merger in the 1960s",
      "A tour by British blues bands in America"
    ],
    optionsNo: [
      "En musikkfestival i Chicago",
      "Massebevegelse av afroamerikanere fra sør til nordlige byer",
      "En plateselskapsfusjon på 1960-tallet",
      "En turné av britiske bluesband i Amerika"
    ],
    correctIndex: 1,
    explanation: "The Great Migration (1910–1970) saw approximately 6 million African Americans leave the rural South for cities like Chicago, Detroit, Memphis, and New York. Musicians like Muddy Waters (who left Stovall Plantation, Mississippi for Chicago in 1943) brought acoustic Delta blues north and electrified it, creating Chicago blues. This migration literally transformed American music, leading to blues, R&B, soul, rock 'n' roll, and eventually hip-hop.",
    explanationNo: "Den store migrasjonen (1910–1970) så omtrent 6 millioner afroamerikanere forlate det rurale sørstatene for byer som Chicago, Detroit, Memphis og New York. Musikere som Muddy Waters (som forlot Stovall Plantation, Mississippi til Chicago i 1943) brakte akustisk Delta blues nordover og elektrifiserte den, og skapte Chicago blues. Denne migrasjonen transformerte bokstavelig talt amerikansk musikk, og førte til blues, R&B, soul, rock 'n' roll og til slutt hip-hop.",
    artistLink: '/history',
  },
  {
    id: 'mc-26', type: 'multiple-choice', difficulty: 'hard',
    question: "Who is Bobby Rush and what is his signature style?",
    questionNo: "Hvem er Bobby Rush og hva er hans signaturstil?",
    options: [
      "A Chicago pianist known for boogie-woogie",
      "A soul-blues showman known for Southern soul blues and live shows",
      "A harmonica player from Memphis",
      "A Delta acoustic guitarist"
    ],
    optionsNo: [
      "En Chicago-pianist kjent for boogie-woogie",
      "En soul-blues showman kjent for Southern soul blues og liveshow",
      "En munnspiller fra Memphis",
      "En Delta akustisk gitarist"
    ],
    correctIndex: 1,
    explanation: "Bobby Rush (born Emmett Ellis Jr. in 1933 in Homer, Louisiana) is a living blues legend with a career spanning 70+ years. Known as the 'King of the Chitlin' Circuit,' he won his first Grammy at age 83 for 'Porcupine Meat' (2017). His energetic Southern soul blues shows feature comedy, dancers, and pure entertainment – performing over 200 shows a year well into his 90s.",
    explanationNo: "Bobby Rush (født Emmett Ellis Jr. i 1933 i Homer, Louisiana) er en levende blueslegende med en karriere over 70+ år. Kjent som 'Kongen av Chitlin' Circuit,' vant han sin første Grammy i en alder av 83 for 'Porcupine Meat' (2017). Hans energiske Southern soul blues-show inneholder komedie, dansere og ren underholdning – med over 200 show i året godt inn i 90-årene.",
    artistLink: '/artists/bobby-rush',
  },
  {
    id: 'mc-30', type: 'multiple-choice', difficulty: 'hard',
    question: "Which Mavis Staples album won a Grammy in 2011?",
    questionNo: "Hvilket Mavis Staples-album vant en Grammy i 2011?",
    options: ["We'll Never Turn Back", "You Are Not Alone", "One True Vine", "Livin' on a High Note"],
    optionsNo: ["We'll Never Turn Back", "You Are Not Alone", "One True Vine", "Livin' on a High Note"],
    correctIndex: 1,
    explanation: "'You Are Not Alone' (2010), produced by Wilco's Jeff Tweedy at his Loft Studio in Chicago, won Mavis Staples her first solo Grammy for Best Americana Album in 2011. Mavis (b. 1939) began singing with The Staple Singers at age 11, performing gospel and freedom songs alongside Martin Luther King Jr. Her career bridges gospel, soul, blues, and Americana across seven decades.",
    explanationNo: "'You Are Not Alone' (2010), produsert av Wilcos Jeff Tweedy på hans Loft Studio i Chicago, ga Mavis Staples hennes første solo-Grammy for Best Americana Album i 2011. Mavis (f. 1939) begynte å synge med The Staple Singers som 11-åring, og fremførte gospel- og frihetssanger ved siden av Martin Luther King Jr. Karrieren hennes bygger bro mellom gospel, soul, blues og Americana gjennom syv tiår.",
    artistLink: '/artists/mavis-staples',
  },
  {
    id: 'mc-33', type: 'multiple-choice', difficulty: 'hard',
    question: "Joe Bonamassa started performing as a child. At what age did he first open for B.B. King?",
    questionNo: "Joe Bonamassa begynte å opptre som barn. I hvilken alder åpnet han først for B.B. King?",
    options: ["8 years old", "10 years old", "12 years old", "14 years old"],
    optionsNo: ["8 år", "10 år", "12 år", "14 år"],
    correctIndex: 2,
    explanation: "Joe Bonamassa (b. 1977) from Utica, New York opened for B.B. King at age 12 after being discovered by guitar legend Danny Gatton. He has since become the most commercially successful blues artist of the 21st century, with 25 #1 blues albums, sold-out shows at the Royal Albert Hall and Red Rocks, and a guitar collection of over 500 vintage instruments.",
    explanationNo: "Joe Bonamassa (f. 1977) fra Utica, New York åpnet for B.B. King som 12-åring etter å ha blitt oppdaget av gitarlegenden Danny Gatton. Han har siden blitt den mest kommersielt suksessrike bluesartisten i det 21. århundre, med 25 nr. 1-bluesalbum, utsolgte show på Royal Albert Hall og Red Rocks, og en gitarsamling på over 500 vintage-instrumenter.",
    artistLink: '/artists/joe-bonamassa',
  },
  {
    id: 'mc-34', type: 'multiple-choice', difficulty: 'hard',
    question: "What genre fusion is Delbert McClinton known for?",
    questionNo: "Hvilken sjangerblanding er Delbert McClinton kjent for?",
    options: [
      "Jazz and classical",
      "Blues, country, and Americana roots",
      "Reggae and blues",
      "Hip-hop and blues"
    ],
    optionsNo: [
      "Jazz og klassisk",
      "Blues, country og Americana roots",
      "Reggae og blues",
      "Hip-hop og blues"
    ],
    correctIndex: 1,
    explanation: "Delbert McClinton (1940–2023) was a Texas-born musician who masterfully blended blues, country, rock, and Americana into a distinctive sound. He won four Grammys, and famously taught John Lennon how to play harmonica when they shared a bill in 1962. His harmonica intro on Bruce Channel's 'Hey! Baby' directly inspired Lennon's playing on 'Love Me Do.'",
    explanationNo: "Delbert McClinton (1940–2023) var en Texas-født musiker som mesterlig blandet blues, country, rock og Americana til en distinkt lyd. Han vant fire Grammyer, og lærte berømt John Lennon å spille munnspill da de delte scene i 1962. Hans munnspillintro på Bruce Channels 'Hey! Baby' inspirerte direkte Lennons spill på 'Love Me Do.'",
  },
  {
    id: 'mc-36', type: 'multiple-choice', difficulty: 'hard',
    question: "Which Muddy Waters song inspired the name 'The Rolling Stones'?",
    questionNo: "Hvilken Muddy Waters-låt inspirerte navnet 'The Rolling Stones'?",
    options: ["Hoochie Coochie Man", "Rollin' Stone", "Got My Mojo Working", "Mannish Boy"],
    optionsNo: ["Hoochie Coochie Man", "Rollin' Stone", "Got My Mojo Working", "Mannish Boy"],
    correctIndex: 1,
    explanation: "The Rolling Stones took their name from Muddy Waters' 1950 Chess Records recording 'Rollin' Stone' (itself inspired by a Robert Johnson lyric 'rolling stone'). When Brian Jones called Jazz News in 1962 to announce their first gig, he was asked the band's name – he spotted a Muddy Waters LP on the floor and said 'The Rollin' Stones.' The band later met their hero at Chess Studios in 1964.",
    explanationNo: "The Rolling Stones tok navnet sitt fra Muddy Waters' Chess Records-innspilling 'Rollin' Stone' fra 1950 (selv inspirert av en Robert Johnson-tekst 'rolling stone'). Da Brian Jones ringte Jazz News i 1962 for å annonsere deres første spillejobb, ble han spurt om bandets navn – han så en Muddy Waters-LP på gulvet og sa 'The Rollin' Stones.' Bandet møtte senere sitt idol på Chess Studios i 1964.",
    artistLink: '/blues-in-rock',
  },
  {
    id: 'mc-37', type: 'multiple-choice', difficulty: 'hard',
    question: "Which blues guitarist said 'Blues is easy to play, but hard to feel'?",
    questionNo: "Hvilken bluesgitarist sa 'Blues er lett å spille, men vanskelig å føle'?",
    options: ["Eric Clapton", "Jimi Hendrix", "B.B. King", "Buddy Guy"],
    optionsNo: ["Eric Clapton", "Jimi Hendrix", "B.B. King", "Buddy Guy"],
    correctIndex: 1,
    explanation: "Jimi Hendrix (1942–1970) said this famous quote. Born in Seattle, he spent years on the chitlin' circuit backing artists like Little Richard, Ike Turner, and the Isley Brothers before moving to London in 1966. His deep blues foundation – rooted in Muddy Waters, B.B. King, and Albert King – infused his psychedelic revolution with an authenticity that continues to resonate.",
    explanationNo: "Jimi Hendrix (1942–1970) sa dette berømte sitatet. Født i Seattle, tilbrakte han år på chitlin'-kretsen som backingmusiker for artister som Little Richard, Ike Turner og Isley Brothers før han flyttet til London i 1966. Hans dype bluesgrunnlag – forankret i Muddy Waters, B.B. King og Albert King – tilførte hans psykedeliske revolusjon en autentisitet som fortsetter å resonere.",
    artistLink: '/blues-in-rock',
  },
  {
    id: 'mc-38', type: 'multiple-choice', difficulty: 'hard',
    question: "Which B.B. King song did Peter Green (Fleetwood Mac) play that gave King 'the cold sweats'?",
    questionNo: "Hvilket B.B. King-stykke spilte Peter Green (Fleetwood Mac) som ga King 'kaldsvette'?",
    options: ["The Thrill Is Gone", "Need Your Love So Bad", "Sweet Little Angel", "Every Day I Have the Blues"],
    optionsNo: ["The Thrill Is Gone", "Need Your Love So Bad", "Sweet Little Angel", "Every Day I Have the Blues"],
    correctIndex: 1,
    explanation: "B.B. King said Peter Green (1946–2020) 'has the sweetest tone I ever heard; he was the only one who gave me the cold sweats.' Green's version of 'Need Your Love So Bad' with Fleetwood Mac (1968) showcased a guitar tone so pure and emotional that even B.B. – the undisputed King of the Blues – was humbled. Green's Les Paul, with its distinctive out-of-phase pickup, later passed to Gary Moore.",
    explanationNo: "B.B. King sa at Peter Green (1946–2020) 'har den søteste tonen jeg noensinne har hørt; han var den eneste som ga meg kaldsvette.' Greens versjon av 'Need Your Love So Bad' med Fleetwood Mac (1968) viste en gitartone så ren og emosjonell at selv B.B. – den ubestridte blueskongen – ble ydmyket. Greens Les Paul, med sin karakteristiske fasevendete pickup, gikk senere til Gary Moore.",
    artistLink: '/blues-in-rock',
  },
  {
    id: 'mc-39', type: 'multiple-choice', difficulty: 'hard',
    question: "Which Willie Dixon songs did Led Zeppelin cover on their debut album?",
    questionNo: "Hvilke Willie Dixon-låter covret Led Zeppelin på debutalbumet?",
    options: ["Hoochie Coochie Man & Back Door Man", "You Shook Me & I Can't Quit You Baby", "Little Red Rooster & Spoonful", "Wang Dang Doodle & My Babe"],
    optionsNo: ["Hoochie Coochie Man & Back Door Man", "You Shook Me & I Can't Quit You Baby", "Little Red Rooster & Spoonful", "Wang Dang Doodle & My Babe"],
    correctIndex: 1,
    explanation: "Led Zeppelin I (1969) featured two Willie Dixon compositions: 'You Shook Me' (originally recorded by Muddy Waters, 1962) and 'I Can't Quit You Baby' (originally recorded by Otis Rush, 1956). Dixon was the architect of Chicago blues, writing over 500 songs. Led Zeppelin later faced plagiarism lawsuits for uncredited use of blues material, including 'Whole Lotta Love' which borrowed from Dixon's 'You Need Love.'",
    explanationNo: "Led Zeppelin I (1969) inneholdt to Willie Dixon-komposisjoner: 'You Shook Me' (opprinnelig innspilt av Muddy Waters, 1962) og 'I Can't Quit You Baby' (opprinnelig innspilt av Otis Rush, 1956). Dixon var arkitekten bak Chicago blues, og skrev over 500 sanger. Led Zeppelin ble senere saksøkt for ukreditert bruk av bluesmateriale, inkludert 'Whole Lotta Love' som lånte fra Dixons 'You Need Love.'",
    artistLink: '/blues-in-rock',
  },
  {
    id: 'mc-40', type: 'multiple-choice', difficulty: 'hard',
    question: "Which band's guitarist was mentored by Lightnin' Hopkins as a teenager?",
    questionNo: "Hvilken gitarist ble veiledet av Lightnin' Hopkins som tenåring?",
    options: ["Keith Richards (Rolling Stones)", "Billy Gibbons (ZZ Top)", "Joe Perry (Aerosmith)", "Angus Young (AC/DC)"],
    optionsNo: ["Keith Richards (Rolling Stones)", "Billy Gibbons (ZZ Top)", "Joe Perry (Aerosmith)", "Angus Young (AC/DC)"],
    correctIndex: 1,
    explanation: "Billy Gibbons (b. 1949) of ZZ Top was personally mentored by Houston-based Texas blues legend Lightnin' Hopkins (1912–1982) as a teenager growing up in Houston's Heights neighborhood. Hopkins taught him the raw, solo acoustic blues style that later fused with Gibbons' heavy rock approach. Jimi Hendrix once called Gibbons 'America's best young blues guitarist.'",
    explanationNo: "Billy Gibbons (f. 1949) i ZZ Top ble personlig veiledet av Houston-baserte Texas blues-legenden Lightnin' Hopkins (1912–1982) som tenåring i Houstons Heights-nabolag. Hopkins lærte ham den rå, solo akustiske bluesstilen som senere smeltet sammen med Gibbons' tunge rock-tilnærming. Jimi Hendrix kalte en gang Gibbons 'Amerikas beste unge bluesgitarist.'",
    artistLink: '/blues-in-rock',
  },
  {
    id: 'mc-41', type: 'multiple-choice', difficulty: 'hard',
    question: "Jack White (The White Stripes) called which blues musician 'the most important who ever lived'?",
    questionNo: "Jack White (The White Stripes) kalte hvilken bluesmusiker 'den viktigste som noensinne har levd'?",
    options: ["Robert Johnson", "Muddy Waters", "Son House", "Charley Patton"],
    optionsNo: ["Robert Johnson", "Muddy Waters", "Son House", "Charley Patton"],
    correctIndex: 2,
    explanation: "Jack White has called Son House (1902–1988) 'the most important musician who ever lived' and regularly covered House's 'Death Letter' in White Stripes concerts. Son House was a preacher-turned-bluesman whose raw, emotional Delta blues directly influenced Robert Johnson. Rediscovered in 1964 in Rochester, New York during the folk-blues revival, his performances bridged pre-war Delta blues with a new generation of listeners.",
    explanationNo: "Jack White har kalt Son House (1902–1988) 'den viktigste musikeren som noensinne har levd' og covret regelmessig Houses 'Death Letter' på White Stripes-konserter. Son House var en predikant som ble bluesmann, og hans rå, emosjonelle Delta blues påvirket direkte Robert Johnson. Gjenoppdaget i 1964 i Rochester, New York under folk-blues-revivalen, bygde hans forestillinger bro mellom førkrigs Delta blues og en ny generasjon lyttere.",
    artistLink: '/artists/son-house',
  },
  {
    id: 'mc-42', type: 'multiple-choice', difficulty: 'hard',
    question: "Which Memphis Minnie blues song from 1929 did Led Zeppelin transform into one of rock's heaviest recordings?",
    questionNo: "Hvilken Memphis Minnie blues-låt fra 1929 transformerte Led Zeppelin til en av rockens tyngste innspillinger?",
    options: ["Bumble Bee", "When the Levee Breaks", "Me and My Chauffeur Blues", "Nothing in Rambling"],
    optionsNo: ["Bumble Bee", "When the Levee Breaks", "Me and My Chauffeur Blues", "Nothing in Rambling"],
    correctIndex: 1,
    explanation: "Led Zeppelin's 'When the Levee Breaks' (Led Zeppelin IV, 1971) was originally a 1929 blues song by Memphis Minnie (1897–1973) and her husband Kansas Joe McCoy, written about the Great Mississippi Flood of 1927. John Bonham's drum sound – recorded in the stairwell of Headley Grange with a distant microphone – became one of the most sampled drum patterns in music history.",
    explanationNo: "Led Zeppelins 'When the Levee Breaks' (Led Zeppelin IV, 1971) var opprinnelig en blueslåt fra 1929 av Memphis Minnie (1897–1973) og hennes mann Kansas Joe McCoy, skrevet om den store Mississippi-flommen i 1927. John Bonhams trommesound – innspilt i trappeoppgangen på Headley Grange med en fjern mikrofon – ble et av de mest samplede trommepatternene i musikkhistorien.",
    artistLink: '/artists/memphis-minnie',
  },
  {
    id: 'mc-43', type: 'multiple-choice', difficulty: 'hard',
    question: "The Black Keys' Dan Auerbach credits which blues musician as 'the beginning and the end' for him?",
    questionNo: "The Black Keys' Dan Auerbach krediterer hvilken bluesmusiker som 'begynnelsen og slutten' for ham?",
    options: ["Muddy Waters", "R.L. Burnside", "Junior Kimbrough", "John Lee Hooker"],
    optionsNo: ["Muddy Waters", "R.L. Burnside", "Junior Kimbrough", "John Lee Hooker"],
    correctIndex: 2,
    explanation: "Dan Auerbach discovered Junior Kimbrough's (1930–1998) hypnotic North Mississippi hill country blues as a teenager in Akron, Ohio, calling it 'the beginning and the end for me.' Kimbrough ran his own juke joint near Holly Springs, Mississippi where his droning, trance-like guitar style became the blueprint for The Black Keys' raw, lo-fi sound. The band named their studio 'Easy Eye Sound' partly in tribute.",
    explanationNo: "Dan Auerbach oppdaget Junior Kimbroughs (1930–1998) hypnotiske Nord-Mississippi hill country blues som tenåring i Akron, Ohio, og kalte det 'begynnelsen og slutten for meg.' Kimbrough drev sin egen juke joint nær Holly Springs, Mississippi, der hans dronende, transe-lignende gitarstil ble malen for The Black Keys' rå, lo-fi-lyd. Bandet kalte studioet sitt 'Easy Eye Sound' delvis som en hyllest.",
    artistLink: '/blues-in-rock',
  },
];

// ===== AUDIO "GUESS THE SINGER" QUESTIONS =====
const audioQuestions: QuizQuestion[] = [
  {
    id: 'audio-1', type: 'audio-guess', difficulty: 'medium',
    question: "Listen to this clip – who is singing?",
    questionNo: "Lytt til dette klippet – hvem synger?",
    options: ["Muddy Waters", "Howlin' Wolf", "B.B. King"],
    optionsNo: ["Muddy Waters", "Howlin' Wolf", "B.B. King"],
    correctIndex: 1,
    explanation: "That powerful, growling voice belongs to Howlin' Wolf performing 'Smokestack Lightning' – one of the most distinctive vocal styles in all of blues.",
    explanationNo: "Den kraftfulle, brummende stemmen tilhører Howlin' Wolf som synger 'Smokestack Lightning' – en av de mest karakteristiske vokalstilene i all blues.",
    artistLink: '/artists/howlin-wolf',
    youtubeVideoId: 'VMUt8KdDtTY',
    audioStart: 5, audioEnd: 22,
    audioHint: "Listen to this 17-second blues clip. Who is singing?",
    audioHintNo: "Lytt til dette 17-sekunders bluesklippet. Hvem synger?",
  },
  {
    id: 'audio-2', type: 'audio-guess', difficulty: 'medium',
    question: "Listen to this clip – who is singing?",
    questionNo: "Lytt til dette klippet – hvem synger?",
    options: ["Etta James", "Koko Taylor", "Bessie Smith"],
    optionsNo: ["Etta James", "Koko Taylor", "Bessie Smith"],
    correctIndex: 0,
    explanation: "That soulful, powerful voice is Etta James performing 'At Last' – her signature song and one of the most iconic recordings in blues and R&B history.",
    explanationNo: "Den soulfulle, kraftfulle stemmen er Etta James som synger 'At Last' – hennes signaturlåt og en av de mest ikoniske innspillingene i blues- og R&B-historien.",
    artistLink: '/artists/etta-james',
    youtubeVideoId: 'zGXEWmDmraY',
    audioStart: 10, audioEnd: 28,
    audioHint: "Listen to this 18-second blues clip. Who is singing?",
    audioHintNo: "Lytt til dette 18-sekunders bluesklippet. Hvem synger?",
  },
  {
    id: 'audio-3', type: 'audio-guess', difficulty: 'medium',
    question: "Listen to this guitar and voice – who is playing?",
    questionNo: "Lytt til denne gitaren og stemmen – hvem spiller?",
    options: ["Stevie Ray Vaughan", "Albert King", "B.B. King"],
    optionsNo: ["Stevie Ray Vaughan", "Albert King", "B.B. King"],
    correctIndex: 2,
    explanation: "That signature vibrato and warm 'Lucille' tone is unmistakably B.B. King performing 'The Thrill Is Gone' live at Crossroads 2010.",
    explanationNo: "Den signaturvibratoen og varme 'Lucille'-tonen er umiskjennelig B.B. King som fremfører 'The Thrill Is Gone' live på Crossroads 2010.",
    artistLink: '/artists/bb-king',
    youtubeVideoId: 'SgXSomPE_FY',
    audioStart: 45, audioEnd: 63,
    audioHint: "Listen to this 18-second clip. Who is singing and playing?",
    audioHintNo: "Lytt til dette 18-sekunders klippet. Hvem synger og spiller?",
  },
  {
    id: 'audio-4', type: 'audio-guess', difficulty: 'hard',
    question: "Listen to this clip – who is singing?",
    questionNo: "Lytt til dette klippet – hvem synger?",
    options: ["Bobby Rush", "Buddy Guy", "Albert Collins"],
    optionsNo: ["Bobby Rush", "Buddy Guy", "Albert Collins"],
    correctIndex: 1,
    explanation: "That raw, soulful vocal style belongs to Buddy Guy performing 'Feels Like Rain' – one of the greatest living blues performers.",
    explanationNo: "Den rå, soulfulle vokalstilen tilhører Buddy Guy som synger 'Feels Like Rain' – en av de største levende bluesartistene.",
    artistLink: '/artists/buddy-guy',
    youtubeVideoId: 'ClpR3fOKPRA',
    audioStart: 15, audioEnd: 33,
    audioHint: "Listen to this 18-second blues clip. Who is singing?",
    audioHintNo: "Lytt til dette 18-sekunders bluesklippet. Hvem synger?",
  },
  {
    id: 'audio-5', type: 'audio-guess', difficulty: 'hard',
    question: "Listen to this voice – who is singing?",
    questionNo: "Lytt til denne stemmen – hvem synger?",
    options: ["Shemekia Copeland", "Mavis Staples", "Koko Taylor"],
    optionsNo: ["Shemekia Copeland", "Mavis Staples", "Koko Taylor"],
    correctIndex: 1,
    explanation: "That warm, gospel-infused voice belongs to Mavis Staples performing 'I'll Take You There' with The Staple Singers.",
    explanationNo: "Den varme, gospel-inspirerte stemmen tilhører Mavis Staples som synger 'I'll Take You There' med The Staple Singers.",
    artistLink: '/artists/mavis-staples',
    youtubeVideoId: 'EFHvQZ_WMxk',
    audioStart: 20, audioEnd: 38,
    audioHint: "Listen to this 18-second clip. Who is singing?",
    audioHintNo: "Lytt til dette 18-sekunders klippet. Hvem synger?",
  },
  {
    id: 'audio-6', type: 'audio-guess', difficulty: 'hard',
    question: "Listen to this guitar and voice – who is playing?",
    questionNo: "Lytt til denne gitaren og stemmen – hvem spiller?",
    options: ["Eric Clapton", "Joe Bonamassa", "Christone 'Kingfish' Ingram"],
    optionsNo: ["Eric Clapton", "Joe Bonamassa", "Christone 'Kingfish' Ingram"],
    correctIndex: 2,
    explanation: "That fiery, youthful blues guitar belongs to Christone 'Kingfish' Ingram performing 'Outside of This Town' – the future of Mississippi blues!",
    explanationNo: "Den fyrrige, ungdommelige bluesgitaren tilhører Christone 'Kingfish' Ingram som spiller 'Outside of This Town' – fremtiden for Mississippi blues!",
    artistLink: '/artists/christone-kingfish-ingram',
    youtubeVideoId: 'fLU1Qbaclfg',
    audioStart: 12, audioEnd: 30,
    audioHint: "Listen to this 18-second guitar and vocal clip. Who is this?",
    audioHintNo: "Lytt til dette 18-sekunders gitar- og vokalklippet. Hvem er dette?",
  },
  {
    id: 'audio-7', type: 'audio-guess', difficulty: 'easy',
    question: "Listen to this harmonica – who is playing?",
    questionNo: "Lytt til dette munnspillet – hvem spiller?",
    options: ["Little Walter", "Paul Lamb", "Jason Ricci"],
    optionsNo: ["Little Walter", "Paul Lamb", "Jason Ricci"],
    correctIndex: 0,
    explanation: "That amplified harmonica tone is Little Walter performing 'Juke' – the greatest blues harmonica player of all time.",
    explanationNo: "Den forsterkede munnspilltonen er Little Walter som spiller 'Juke' – den største blues-munnspilleren gjennom tidene.",
    artistLink: '/artists/little-walter',
    youtubeVideoId: 'HxkqDe7DN8g',
    audioStart: 3, audioEnd: 20,
    audioHint: "Listen to this 17-second harmonica clip. Who is playing?",
    audioHintNo: "Lytt til dette 17-sekunders munnspillklippet. Hvem spiller?",
  },
  {
    id: 'audio-8', type: 'audio-guess', difficulty: 'easy',
    question: "Listen to this guitar solo and voice – who is playing?",
    questionNo: "Lytt til denne gitarsoloen og stemmen – hvem spiller?",
    options: ["Jeff Beck", "Stevie Ray Vaughan", "Gary Moore"],
    optionsNo: ["Jeff Beck", "Stevie Ray Vaughan", "Gary Moore"],
    correctIndex: 1,
    explanation: "That aggressive, passionate Texas blues tone belongs to Stevie Ray Vaughan performing 'Pride and Joy.'",
    explanationNo: "Den aggressive, lidenskapelige Texas blues-tonen tilhører Stevie Ray Vaughan som spiller 'Pride and Joy.'",
    artistLink: '/artists/stevie-ray-vaughan',
    youtubeVideoId: 'i0hVIrQm0KM',
    audioStart: 8, audioEnd: 25,
    audioHint: "Listen to this 17-second guitar and vocal clip. Who is this?",
    audioHintNo: "Lytt til dette 17-sekunders gitar- og vokalklippet. Hvem er dette?",
  },
];

// ===== 10-DAY ROTATION SYSTEM =====
// Every cycle = 10 days. Questions roll forward through the curated pool so
// no question repeats until the whole pool has been used. Older cycles stay
// reproducible (deterministic) for archive + SEO.

const CYCLE_LENGTH_DAYS = 10;
// Cycle 1 starts Monday 2026-01-05 (UTC). Stable epoch keeps URLs permanent.
const CYCLE_EPOCH_UTC = Date.UTC(2026, 0, 5);
const MS_PER_DAY = 86_400_000;

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length;
  let s = seed || 1;
  while (m) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const i = s % m--;
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }
  return shuffled;
}

/** ISO week (kept for backward compat) */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/** Cycle number for a given date (1-indexed). Negative dates clamp to 1. */
export function getCycleNumber(date: Date = new Date()): number {
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diff = Math.floor((today - CYCLE_EPOCH_UTC) / MS_PER_DAY);
  return Math.max(1, Math.floor(diff / CYCLE_LENGTH_DAYS) + 1);
}

/** Cycle id used in URLs + leaderboard keys, e.g. 'C-042'. */
export function getCycleKey(cycleNumber: number = getCycleNumber()): string {
  return `C-${String(cycleNumber).padStart(3, '0')}`;
}

/** Backward-compat: getCurrentWeekKey now returns the active cycle key. */
export function getCurrentWeekKey(): string {
  return getCycleKey();
}

/** Date window for a cycle (start inclusive, end inclusive). */
export function getCycleRange(cycleNumber: number): { start: Date; end: Date } {
  const startMs = CYCLE_EPOCH_UTC + (cycleNumber - 1) * CYCLE_LENGTH_DAYS * MS_PER_DAY;
  const endMs = startMs + (CYCLE_LENGTH_DAYS - 1) * MS_PER_DAY;
  return { start: new Date(startMs), end: new Date(endMs) };
}

export function formatCycleRange(cycleNumber: number, locale: string = "en"): string {
  const { start, end } = getCycleRange(cycleNumber);
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
  const year = end.getUTCFullYear();
  return `${fmt.format(start)} – ${fmt.format(end)}, ${year}`;
}

/**
 * Deterministic rolling-window selection from a pool.
 * Pool is shuffled once with a stable seed, then each cycle reads a
 * contiguous slice. Guarantees every question is shown before any repeats,
 * across the full archive of cycles.
 */
function rollingPick<T>(pool: T[], cycleNumber: number, take: number, seedSalt: number): T[] {
  if (pool.length === 0) return [];
  const ordered = seededShuffle(pool, 0x5b1e5 ^ seedSalt);
  const start = ((cycleNumber - 1) * take) % ordered.length;
  const out: T[] = [];
  for (let i = 0; i < take; i++) {
    out.push(ordered[(start + i) % ordered.length]);
  }
  return out;
}

/**
 * Returns 10 questions for the given cycle + difficulty.
 * 8 standard + up to 2 audio. Audio interleaved at positions 4 and 8.
 * Same shape as before — drop-in for the UI.
 */
export function getCycleQuestions(
  difficulty: QuizDifficulty,
  cycleNumber: number = getCycleNumber(),
): QuizQuestion[] {
  const standardByDiff = standardQuestions.filter(q => q.difficulty === difficulty);
  const audioByDiff = audioQuestions.filter(q => q.difficulty === difficulty);

  const standardPool = standardByDiff.length >= 8 ? standardByDiff :
    [...standardByDiff, ...standardQuestions.filter(q => q.difficulty === 'medium' && !standardByDiff.includes(q))];
  const audioPool = audioByDiff.length >= 2 ? audioByDiff :
    [...audioByDiff, ...audioQuestions.filter(q => !audioByDiff.includes(q))];

  const audioCount = Math.min(2, audioPool.length);
  const standardCount = 10 - audioCount;

  // Per-difficulty salts keep rotations independent across levels.
  const diffSalt = difficulty === 'easy' ? 11 : difficulty === 'medium' ? 23 : 37;

  const selected = rollingPick(standardPool, cycleNumber, standardCount, diffSalt);
  const selectedAudio = rollingPick(audioPool, cycleNumber, audioCount, diffSalt + 100);

  // Avoid two consecutive questions linking to the same artist
  for (let i = 1; i < selected.length; i++) {
    if (selected[i].artistLink && selected[i].artistLink === selected[i - 1].artistLink) {
      for (let j = i + 1; j < selected.length; j++) {
        if (selected[j].artistLink !== selected[i - 1].artistLink) {
          [selected[i], selected[j]] = [selected[j], selected[i]];
          break;
        }
      }
    }
  }

  const audioPositions = [3, 7];
  selectedAudio.forEach((aq, i) => {
    const pos = Math.min(audioPositions[i] ?? selected.length, selected.length);
    selected.splice(pos, 0, aq);
  });

  return selected.slice(0, 10);
}

/** Featured artist for a cycle: most-linked artist across all difficulties. */
export function getFeaturedArtist(cycleNumber: number = getCycleNumber()): { slug: string; name: string; count: number } | null {
  const all = [
    ...getCycleQuestions('easy', cycleNumber),
    ...getCycleQuestions('medium', cycleNumber),
    ...getCycleQuestions('hard', cycleNumber),
  ];
  const tally = new Map<string, number>();
  for (const q of all) {
    if (!q.artistLink) continue;
    const slug = q.artistLink.split('/').filter(Boolean).pop();
    if (!slug || slug === 'instruments' || slug === 'styles' || slug === 'history') continue;
    tally.set(slug, (tally.get(slug) ?? 0) + 1);
  }
  if (tally.size === 0) return null;
  const [slug, count] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  const name = slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  return { slug, name, count };
}

// ----- Backward compatibility -----
export function getWeeklyQuestions(difficulty: QuizDifficulty): QuizQuestion[] {
  return getCycleQuestions(difficulty);
}
export function getMonthlyQuestions(): QuizQuestion[] { return getCycleQuestions('medium'); }
export function getCurrentMonthKey(): string { return getCurrentWeekKey(); }

// ===== LEADERBOARD (localStorage fallback – kept for offline) =====

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  total: number;
  date: string;
  monthKey: string;
}

const LEADERBOARD_KEY = 'slowblues-quiz-leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToLeaderboard(entry: LeaderboardEntry): void {
  const all = getLeaderboard();
  all.push(entry);
  all.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(all.slice(0, 100)));
}

export function getMonthlyLeaderboard(monthKey: string): LeaderboardEntry[] {
  return getLeaderboard()
    .filter((e) => e.monthKey === monthKey)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function getAllTimeLeaderboard(): LeaderboardEntry[] {
  return getLeaderboard()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
