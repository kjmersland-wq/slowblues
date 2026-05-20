// Blues History Timeline
// Sources: Library of Congress, Smithsonian, Blues Foundation

export interface TimelineEvent {
  year: number;
  title: string;
  titleNo: string;
  description: string;
  descriptionNo: string;
  category: "origin" | "recording" | "migration" | "artist" | "milestone";
  searchTerms: string[];
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: 1865,
    title: "End of Slavery",
    titleNo: "Slaveriets slutt",
    description: "The 13th Amendment abolishes slavery in the United States. Former slaves in the Deep South begin developing new musical forms combining African traditions with American influences.",
    descriptionNo: "Det 13. grunnlovstillegget avskaffet slaveriet i USA. Tidligere slaver i Dypet av Sørstatene begynte å utvikle nye musikkformer som kombinerte afrikanske tradisjoner med amerikanske innflytelser.",
    category: "origin",
    searchTerms: ["slavery", "emancipation", "civil war", "freedom", "slaveri"]
  },
  {
    year: 1877,
    title: "End of Reconstruction",
    titleNo: "Slutten på gjenoppbyggingen",
    description: "Federal troops withdraw from the South, beginning the era of Jim Crow laws. The harsh conditions of sharecropping and segregation would fuel blues expression for decades.",
    descriptionNo: "Føderale tropper trekker seg ut av Sørstatene, og Jim Crow-lovenes æra begynner. De harde vilkårene under leilendingssystemet og segregeringen skulle gi næring til bluesuttrykket i flere tiår.",
    category: "origin",
    searchTerms: ["reconstruction", "jim crow", "segregation", "sharecropping"]
  },
  {
    year: 1890,
    title: "Blues Takes Shape",
    titleNo: "Bluesen tar form",
    description: "The blues form begins crystallizing in the Mississippi Delta region. Work songs, field hollers, spirituals, and African musical traditions merge into a distinctive style.",
    descriptionNo: "Bluesformen begynner å krystallisere seg i Mississippi Delta-regionen. Arbeidssanger, rop fra åkrene, spirituals og afrikanske musikktradisjoner smelter sammen til en særegen stil.",
    category: "origin",
    searchTerms: ["delta", "work songs", "field hollers", "spirituals"]
  },
  {
    year: 1903,
    title: "W.C. Handy's Encounter",
    titleNo: "W.C. Handys møte",
    description: "W.C. Handy hears a slide guitar player at a Tutwiler, Mississippi train station—one of the first documented descriptions of Delta blues style.",
    descriptionNo: "W.C. Handy hører en slidegitarist på en togstasjon i Tutwiler, Mississippi – en av de første dokumenterte beskrivelsene av Delta blues-stil.",
    category: "milestone",
    searchTerms: ["wc handy", "tutwiler", "slide guitar", "delta blues"]
  },
  {
    year: 1910,
    title: "Great Migration Begins",
    titleNo: "Den store migrasjonen begynner",
    description: "African Americans begin migrating from the rural South to Northern cities seeking better opportunities. This movement would eventually bring Delta blues to Chicago, Detroit, and beyond.",
    descriptionNo: "Afroamerikanere begynner å migrere fra det landlige Sørstatene til byer i nord på jakt etter bedre muligheter. Denne bevegelsen skulle til slutt bringe Delta-bluesen til Chicago, Detroit og videre.",
    category: "migration",
    searchTerms: ["great migration", "chicago", "north", "cities"]
  },
  {
    year: 1920,
    title: "First Blues Recording",
    titleNo: "Første bluesinnspilling",
    description: "Mamie Smith records 'Crazy Blues' for Okeh Records—the first blues recording by an African American artist. It sells over 75,000 copies in its first month, proving blues has commercial potential.",
    descriptionNo: "Mamie Smith spiller inn 'Crazy Blues' for Okeh Records – den første bluesinnspillingen av en afroamerikansk artist. Den selger over 75 000 eksemplarer den første måneden, og beviser at blues har kommersielt potensial.",
    category: "recording",
    searchTerms: ["mamie smith", "crazy blues", "okeh", "first recording"]
  },
  {
    year: 1926,
    title: "Blind Lemon Jefferson Records",
    titleNo: "Blind Lemon Jefferson spiller inn",
    description: "Blind Lemon Jefferson begins recording for Paramount Records, becoming the first major male blues star. His Texas blues style influences generations of guitarists.",
    descriptionNo: "Blind Lemon Jefferson begynner å spille inn for Paramount Records og blir den første store mannlige bluesstjernen. Hans Texas blues-stil påvirker generasjoner av gitarister.",
    category: "artist",
    searchTerms: ["blind lemon jefferson", "paramount", "texas blues"]
  },
  {
    year: 1929,
    title: "Charley Patton Records",
    titleNo: "Charley Patton spiller inn",
    description: "The 'Father of Delta Blues' Charley Patton makes his first recordings for Paramount Records, including 'Pony Blues.' He would influence every Delta bluesman who followed.",
    descriptionNo: "«Delta-bluesens far» Charley Patton gjør sine første innspillinger for Paramount Records, inkludert 'Pony Blues.' Han skulle påvirke enhver Delta-bluesmann som kom etter.",
    category: "artist",
    searchTerms: ["charley patton", "pony blues", "paramount", "delta blues"]
  },
  {
    year: 1933,
    title: "John Lomax Discovers Lead Belly",
    titleNo: "John Lomax oppdager Lead Belly",
    description: "Folklorist John Lomax records Lead Belly at Angola Prison in Louisiana for the Library of Congress, beginning decades of field recordings that would preserve blues history.",
    descriptionNo: "Folkloristen John Lomax spiller inn Lead Belly ved Angola-fengselet i Louisiana for Library of Congress, og innleder flere tiår med feltopptak som skulle bevare blueshistorien.",
    category: "recording",
    searchTerms: ["lead belly", "john lomax", "angola prison", "library of congress"]
  },
  {
    year: 1936,
    title: "Robert Johnson Sessions",
    titleNo: "Robert Johnsons innspillinger",
    description: "Robert Johnson records his legendary sessions in San Antonio, Texas at the Gunter Hotel. These 29 songs would become the most influential blues recordings ever made.",
    descriptionNo: "Robert Johnson spiller inn sine legendariske sesjoner i San Antonio, Texas på Gunter Hotel. Disse 29 sangene skulle bli de mest innflytelsesrike bluesinnspillingene noensinne.",
    category: "recording",
    searchTerms: ["robert johnson", "san antonio", "gunter hotel", "crossroads"]
  },
  {
    year: 1941,
    title: "Muddy Waters Field Recording",
    titleNo: "Muddy Waters' feltopptak",
    description: "Alan Lomax records McKinley Morganfield (Muddy Waters) on Stovall Plantation for the Library of Congress. Hearing the playback inspires Waters to pursue music professionally.",
    descriptionNo: "Alan Lomax spiller inn McKinley Morganfield (Muddy Waters) på Stovall-plantasjen for Library of Congress. Å høre opptaket inspirerer Waters til å satse på musikken profesjonelt.",
    category: "recording",
    searchTerms: ["muddy waters", "alan lomax", "stovall plantation", "library of congress"]
  },
  {
    year: 1943,
    title: "Muddy Waters Moves to Chicago",
    titleNo: "Muddy Waters flytter til Chicago",
    description: "Muddy Waters leaves Mississippi for Chicago, eventually bringing the Delta blues sound to urban audiences and electrifying the genre.",
    descriptionNo: "Muddy Waters forlater Mississippi for Chicago, og bringer til slutt Delta blues-lyden til urbane publikum og elektrifiserer sjangeren.",
    category: "migration",
    searchTerms: ["muddy waters", "chicago", "electric blues", "migration"]
  },
  {
    year: 1947,
    title: "Chess Records Founded",
    titleNo: "Chess Records grunnlegges",
    description: "Leonard and Phil Chess establish Chess Records in Chicago (originally Aristocrat). The label would become the most important blues label in history.",
    descriptionNo: "Leonard og Phil Chess etablerer Chess Records i Chicago (opprinnelig Aristocrat). Plateselskapet skulle bli det viktigste bluesplateselskapet i historien.",
    category: "milestone",
    searchTerms: ["chess records", "leonard chess", "chicago blues", "aristocrat"]
  },
  {
    year: 1950,
    title: "'Rollin' Stone' Released",
    titleNo: "'Rollin' Stone' utgis",
    description: "Muddy Waters releases 'Rollin' Stone' on Chess Records—a song that would inspire both The Rolling Stones' name and Bob Dylan's 'Like a Rolling Stone.'",
    descriptionNo: "Muddy Waters gir ut 'Rollin' Stone' på Chess Records – en sang som skulle inspirere både navnet The Rolling Stones og Bob Dylans 'Like a Rolling Stone.'",
    category: "recording",
    searchTerms: ["muddy waters", "rolling stone", "chess records"]
  },
  {
    year: 1952,
    title: "Little Walter's 'Juke'",
    titleNo: "Little Walters 'Juke'",
    description: "Little Walter's instrumental 'Juke' becomes #1 on the R&B charts, revolutionizing blues harmonica with its amplified, distorted sound.",
    descriptionNo: "Little Walters instrumentale 'Juke' blir nr. 1 på R&B-listene og revolusjonerer blues-munnspillet med sin forsterkede, forvrengte lyd.",
    category: "recording",
    searchTerms: ["little walter", "juke", "harmonica", "amplified"]
  },
  {
    year: 1954,
    title: "'Hoochie Coochie Man'",
    titleNo: "'Hoochie Coochie Man'",
    description: "Muddy Waters records Willie Dixon's 'Hoochie Coochie Man,' creating the template for blues-rock that would dominate the next two decades.",
    descriptionNo: "Muddy Waters spiller inn Willie Dixons 'Hoochie Coochie Man,' og skaper malen for blues-rock som skulle dominere de neste to tiårene.",
    category: "recording",
    searchTerms: ["muddy waters", "hoochie coochie man", "willie dixon"]
  },
  {
    year: 1958,
    title: "Muddy Waters Tours Britain",
    titleNo: "Muddy Waters turnerer Storbritannia",
    description: "Muddy Waters' electric performance shocks British audiences expecting acoustic folk-blues. This tour sparks the British blues boom and inspires future rock stars.",
    descriptionNo: "Muddy Waters' elektriske opptreden sjokkerer britiske publikummere som forventet akustisk folk-blues. Denne turneen utløser den britiske blues-boomen og inspirerer fremtidige rockestjerner.",
    category: "milestone",
    searchTerms: ["muddy waters", "britain", "british blues", "electric blues"]
  },
  {
    year: 1961,
    title: "Son House Rediscovered",
    titleNo: "Son House gjenoppdaget",
    description: "Blues researchers locate Son House in Rochester, NY. His rediscovery leads to new recordings and performances that introduce Delta blues to folk revival audiences.",
    descriptionNo: "Bluesforskere finner Son House i Rochester, NY. Gjenoppdagelsen hans fører til nye innspillinger og opptredener som introduserer Delta-blues for folk revival-publikum.",
    category: "artist",
    searchTerms: ["son house", "rediscovered", "folk revival", "rochester"]
  },
  {
    year: 1962,
    title: "Rolling Stones Form",
    titleNo: "Rolling Stones dannes",
    description: "The Rolling Stones form in London, named after Muddy Waters' song. They and other British bands would soon bring blues to worldwide rock audiences.",
    descriptionNo: "The Rolling Stones dannes i London, oppkalt etter Muddy Waters' sang. De og andre britiske band skulle snart bringe bluesen til verdensomspennende rockepublikum.",
    category: "milestone",
    searchTerms: ["rolling stones", "british invasion", "muddy waters", "london"]
  },
  {
    year: 1966,
    title: "Cream Covers Blues",
    titleNo: "Cream covrer blues",
    description: "Cream (Eric Clapton, Jack Bruce, Ginger Baker) forms and covers blues standards by Robert Johnson, Skip James, and Howlin' Wolf, introducing millions to the blues.",
    descriptionNo: "Cream (Eric Clapton, Jack Bruce, Ginger Baker) dannes og covrer bluesstandarder av Robert Johnson, Skip James og Howlin' Wolf, og introduserer millioner for bluesen.",
    category: "milestone",
    searchTerms: ["cream", "eric clapton", "british blues", "rock"]
  },
  {
    year: 1969,
    title: "Led Zeppelin Debut",
    titleNo: "Led Zeppelin-debuten",
    description: "Led Zeppelin's debut album features heavy blues influence, including covers of Willie Dixon's 'You Shook Me' and 'I Can't Quit You Baby.'",
    descriptionNo: "Led Zeppelins debutalbum har sterk bluesinnflytelse, inkludert covere av Willie Dixons 'You Shook Me' og 'I Can't Quit You Baby.'",
    category: "milestone",
    searchTerms: ["led zeppelin", "willie dixon", "blues rock", "heavy metal"]
  },
  {
    year: 1980,
    title: "Blues Hall of Fame",
    titleNo: "Blues Hall of Fame",
    description: "The Blues Foundation establishes the Blues Hall of Fame in Memphis, honoring blues legends including Charley Patton, Son House, and Robert Johnson.",
    descriptionNo: "Blues Foundation etablerer Blues Hall of Fame i Memphis, og hedrer blueslegender som Charley Patton, Son House og Robert Johnson.",
    category: "milestone",
    searchTerms: ["blues hall of fame", "memphis", "blues foundation"]
  },
  {
    year: 1986,
    title: "Robert Johnson Hall of Fame",
    titleNo: "Robert Johnson i Hall of Fame",
    description: "Robert Johnson inducted into the Rock and Roll Hall of Fame as an Early Influence, cementing his status as the most influential blues artist for rock music.",
    descriptionNo: "Robert Johnson innlemmes i Rock and Roll Hall of Fame som tidlig innflytelse, og sementerer hans status som den mest innflytelsesrike bluesartisten for rockemusikk.",
    category: "artist",
    searchTerms: ["robert johnson", "rock hall of fame", "early influence"]
  },
  {
    year: 1990,
    title: "Robert Johnson Box Set",
    titleNo: "Robert Johnson boks-sett",
    description: "Columbia releases 'The Complete Recordings' of Robert Johnson, selling over 500,000 copies and introducing a new generation to Delta blues.",
    descriptionNo: "Columbia gir ut 'The Complete Recordings' av Robert Johnson, selger over 500 000 eksemplarer og introduserer en ny generasjon for Delta-blues.",
    category: "recording",
    searchTerms: ["robert johnson", "complete recordings", "columbia", "box set"]
  },
  {
    year: 1994,
    title: "U.S. Postal Stamp: Robert Johnson",
    titleNo: "Frimerke: Robert Johnson",
    description: "The U.S. Postal Service issues a Robert Johnson stamp as part of its 'Legends of American Music' series, marking mainstream cultural recognition of Delta blues.",
    descriptionNo: "Det amerikanske postvesenet gir ut et Robert Johnson-frimerke som del av serien 'Legends of American Music,' og markerer kulturell anerkjennelse av Delta-blues i mainstream.",
    category: "milestone",
    searchTerms: ["robert johnson", "stamp", "postal service", "legends"]
  },
  {
    year: 1997,
    title: "John Lee Hooker's Comeback",
    titleNo: "John Lee Hookers comeback",
    description: "John Lee Hooker wins a Grammy for 'Don't Look Back,' produced by Van Morrison. His late-career resurgence brings boogie blues to a new audience.",
    descriptionNo: "John Lee Hooker vinner en Grammy for 'Don't Look Back,' produsert av Van Morrison. Hans comeback i karrierens siste fase bringer boogie blues til et nytt publikum.",
    category: "artist",
    searchTerms: ["john lee hooker", "grammy", "van morrison", "don't look back"]
  },
  {
    year: 2003,
    title: "Year of the Blues",
    titleNo: "Bluesens år",
    description: "The U.S. Congress declares 2003 the 'Year of the Blues.' Martin Scorsese produces 'The Blues,' a seven-part PBS documentary series exploring the genre's history and global impact.",
    descriptionNo: "Den amerikanske kongressen erklærer 2003 som 'Bluesens år.' Martin Scorsese produserer 'The Blues,' en syv-delt PBS-dokumentarserie som utforsker sjangerens historie og globale påvirkning.",
    category: "milestone",
    searchTerms: ["year of the blues", "scorsese", "pbs", "documentary", "congress"]
  },
  {
    year: 2006,
    title: "Buddy Guy: Living Legend",
    titleNo: "Buddy Guy: Levende legende",
    description: "Buddy Guy receives the National Medal of Arts from the White House. His club Legends in Chicago remains a blues pilgrimage site, and he continues touring into his 80s.",
    descriptionNo: "Buddy Guy mottar National Medal of Arts fra Det hvite hus. Klubben hans Legends i Chicago forblir et valfartssted for blues, og han fortsetter å turnere i 80-årene.",
    category: "artist",
    searchTerms: ["buddy guy", "national medal of arts", "legends", "chicago"]
  },
  {
    year: 2011,
    title: "Mississippi Blues Trail",
    titleNo: "Mississippi Blues Trail",
    description: "The Mississippi Blues Trail reaches over 100 historical markers across the state, including Dockery Plantation, the Crossroads in Clarksdale, and Muddy Waters' cabin site at Stovall.",
    descriptionNo: "Mississippi Blues Trail når over 100 historiske markører over hele delstaten, inkludert Dockery Plantation, Crossroads i Clarksdale og Muddy Waters' hytte på Stovall.",
    category: "milestone",
    searchTerms: ["mississippi blues trail", "markers", "dockery", "clarksdale", "crossroads"]
  },
  {
    year: 2015,
    title: "B.B. King Dies",
    titleNo: "B.B. King dør",
    description: "Riley B. King (1925–2015), the 'King of the Blues,' dies in Las Vegas at age 89. His passing marks the end of an era—he performed over 15,000 concerts and won 15 Grammy Awards across a career spanning seven decades.",
    descriptionNo: "Riley B. King (1925–2015), 'Bluesens konge,' dør i Las Vegas, 89 år gammel. Hans bortgang markerer slutten på en æra – han ga over 15 000 konserter og vant 15 Grammy-priser gjennom en karriere som spente over syv tiår.",
    category: "artist",
    searchTerms: ["bb king", "death", "las vegas", "king of the blues", "lucille"]
  },
  {
    year: 2019,
    title: "Kingfish Debut Album",
    titleNo: "Kingfish debutalbum",
    description: "Christone 'Kingfish' Ingram, age 20, releases his debut album 'Kingfish' on Alligator Records. Born in Clarksdale, Mississippi, he represents a new generation keeping Delta blues alive and wins the Grammy for Best Contemporary Blues Album in 2022.",
    descriptionNo: "Christone 'Kingfish' Ingram, 20 år gammel, gir ut debutalbumet 'Kingfish' på Alligator Records. Født i Clarksdale, Mississippi, representerer han en ny generasjon som holder Delta-bluesen i live, og vinner Grammy for Best Contemporary Blues Album i 2022.",
    category: "artist",
    searchTerms: ["kingfish", "christone ingram", "clarksdale", "alligator", "grammy", "new generation"]
  },
  {
    year: 2021,
    title: "Blues Streaming Era",
    titleNo: "Blues i strømmealderen",
    description: "Blues reaches new audiences through streaming platforms. Joe Bonamassa becomes the biggest-selling independent blues artist in history, while YouTube channels and social media introduce millions of young listeners to classic and contemporary blues.",
    descriptionNo: "Blues når nye publikum gjennom strømmeplattformer. Joe Bonamassa blir den mestselgende uavhengige bluesartisten i historien, mens YouTube-kanaler og sosiale medier introduserer millioner av unge lyttere for klassisk og moderne blues.",
    category: "milestone",
    searchTerms: ["streaming", "spotify", "youtube", "bonamassa", "digital", "social media"]
  },
  {
    year: 2025,
    title: "Blues Lives On",
    titleNo: "Bluesen lever videre",
    description: "A vibrant new wave of blues artists—Christone 'Kingfish' Ingram, Samantha Fish, Marcus King, Larkin Poe—ensures the genre's future. Blues festivals thrive worldwide, and the Mississippi Delta remains a pilgrimage destination for fans from every continent.",
    descriptionNo: "En livlig ny bølge av bluesartister – Christone 'Kingfish' Ingram, Samantha Fish, Marcus King, Larkin Poe – sikrer sjangerens fremtid. Bluesfestivaler blomstrer over hele verden, og Mississippi-deltaet forblir et pilegrimsmål for fans fra alle kontinenter.",
    category: "milestone",
    searchTerms: ["new generation", "kingfish", "samantha fish", "marcus king", "larkin poe", "future", "festivals"]
  }
];

export const searchTimeline = (query: string): TimelineEvent[] => {
  const lowerQuery = query.toLowerCase();
  return timelineEvents.filter(event =>
    event.title.toLowerCase().includes(lowerQuery) ||
    event.titleNo.toLowerCase().includes(lowerQuery) ||
    event.description.toLowerCase().includes(lowerQuery) ||
    event.descriptionNo.toLowerCase().includes(lowerQuery) ||
    event.searchTerms.some(term => term.includes(lowerQuery))
  );
};
