import { IMG } from "./images";

export type Artist = {
  slug: string;
  name: string;
  era: string;
  tag: "Delta" | "Chicago" | "Texas" | "British" | "Modern" | "Classic" | "Nordic";
  img: string;
  short: string;
};

// Additional Wikimedia Commons portraits (PD / CC).
const W = (p: string) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${p}`;
const PORTRAITS = {
  charleyPatton: W("4/4a/Charley_Patton.jpg/480px-Charley_Patton.jpg"),
  skipJames: W("e/eb/Skip_James_in_1968.jpg/480px-Skip_James_in_1968.jpg"),
  memphisMinnie: W("9/96/Memphis_Minnie.jpg/480px-Memphis_Minnie.jpg"),
  bigBillBroonzy: W("0/02/Big_Bill_Broonzy_1951.jpg/480px-Big_Bill_Broonzy_1951.jpg"),
  blindWillieJohnson: W("3/3a/Blind_Willie_Johnson.jpg/480px-Blind_Willie_Johnson.jpg"),
  littleWalter: W("9/91/Little_Walter.jpg/480px-Little_Walter.jpg"),
  elmoreJames: W("3/36/Elmore_James.jpg/480px-Elmore_James.jpg"),
  tboneWalker: W("d/d3/T-Bone_Walker_1942.jpg/480px-T-Bone_Walker_1942.jpg"),
  albertKing: W("3/31/Albert_King_1981.jpg/480px-Albert_King_1981.jpg"),
  freddieKing: W("9/9d/Freddie_King.jpg/480px-Freddie_King.jpg"),
  lightninHopkins: W("8/82/Lightnin_Hopkins.jpg/480px-Lightnin_Hopkins.jpg"),
  otisRush: W("e/e0/Otis_Rush_1969.jpg/480px-Otis_Rush_1969.jpg"),
  magicSam: W("0/06/MagicSam.jpg/480px-MagicSam.jpg"),
  juniorWells: W("5/52/Junior_Wells_1974.jpg/480px-Junior_Wells_1974.jpg"),
  jimmyReed: W("8/8f/Jimmy_Reed_1965.jpg/480px-Jimmy_Reed_1965.jpg"),
  kokoTaylor: W("e/e0/Koko_Taylor_2007.jpg/480px-Koko_Taylor_2007.jpg"),
  joeBonamassa: W("7/73/Joe_Bonamassa_2010.jpg/480px-Joe_Bonamassa_2010.jpg"),
  samanthaFish: W("0/0d/Samantha_Fish_2015.jpg/480px-Samantha_Fish_2015.jpg"),
  larkinPoe: W("a/ad/Larkin_Poe_2015.jpg/480px-Larkin_Poe_2015.jpg"),
  shemekiaCopeland: W("3/3f/Shemekia_Copeland_2018.jpg/480px-Shemekia_Copeland_2018.jpg"),
  kingfish: W("a/a4/Christone_Kingfish_Ingram_2019.jpg/480px-Christone_Kingfish_Ingram_2019.jpg"),
};

export const ARTISTS: Artist[] = [
  // Delta originals
  { slug: "charley-patton", name: "Charley Patton", era: "1891–1934", tag: "Delta", img: PORTRAITS.charleyPatton, short: "The father of the Delta blues — Dockery Plantation's first star." },
  { slug: "blind-lemon-jefferson", name: "Blind Lemon Jefferson", era: "1893–1929", tag: "Delta", img: IMG.blindLemon, short: "The first male blues star to sell on record." },
  { slug: "ma-rainey", name: "Ma Rainey", era: "1886–1939", tag: "Classic", img: IMG.maRainey, short: "Mother of the Blues — the voice that took it to the cities." },
  { slug: "bessie-smith", name: "Bessie Smith", era: "1894–1937", tag: "Classic", img: IMG.bessieSmith, short: "The Empress of the Blues — vaudeville's biggest star." },
  { slug: "blind-willie-johnson", name: "Blind Willie Johnson", era: "1897–1945", tag: "Delta", img: PORTRAITS.blindWillieJohnson, short: "Sacred slide guitar that NASA sent into deep space." },
  { slug: "lead-belly", name: "Lead Belly", era: "1888–1949", tag: "Delta", img: IMG.leadbelly, short: "12-string folk-blues that crossed every American border." },
  { slug: "son-house", name: "Son House", era: "1902–1988", tag: "Delta", img: IMG.sonHouse, short: "Raw, spiritual slide guitar — the preacher's blues." },
  { slug: "skip-james", name: "Skip James", era: "1902–1969", tag: "Delta", img: PORTRAITS.skipJames, short: "Eerie falsetto and open D-minor tuning — the haunted blues." },
  { slug: "memphis-minnie", name: "Memphis Minnie", era: "1897–1973", tag: "Delta", img: PORTRAITS.memphisMinnie, short: "One of the first women to play the blues like she meant it." },
  { slug: "robert-johnson", name: "Robert Johnson", era: "1911–1938", tag: "Delta", img: IMG.robertJohnson, short: "29 recordings that defined the Delta blues forever." },
  { slug: "big-bill-broonzy", name: "Big Bill Broonzy", era: "1903–1958", tag: "Chicago", img: PORTRAITS.bigBillBroonzy, short: "From Mississippi sharecropper to first ambassador of the blues in Europe." },
  { slug: "t-bone-walker", name: "T-Bone Walker", era: "1910–1975", tag: "Texas", img: PORTRAITS.tboneWalker, short: "Invented the electric blues guitar solo. Period." },
  { slug: "lightnin-hopkins", name: "Lightnin' Hopkins", era: "1912–1982", tag: "Texas", img: PORTRAITS.lightninHopkins, short: "Houston's poet of the boogie — over 80 albums." },
  { slug: "john-lee-hooker", name: "John Lee Hooker", era: "1917–2001", tag: "Delta", img: IMG.johnLeeHooker, short: "Hypnotic boogie and a foot that never stopped tapping." },
  { slug: "muddy-waters", name: "Muddy Waters", era: "1913–1983", tag: "Chicago", img: IMG.muddyWaters, short: "The man who took the Delta to Chicago and plugged it in." },
  { slug: "howlin-wolf", name: "Howlin' Wolf", era: "1910–1976", tag: "Chicago", img: IMG.howlinWolf, short: "300-pound voice that shook the walls of Chess Records." },
  { slug: "elmore-james", name: "Elmore James", era: "1918–1963", tag: "Chicago", img: PORTRAITS.elmoreJames, short: "King of the slide — the riff every blues-rock guitarist stole." },
  { slug: "willie-dixon", name: "Willie Dixon", era: "1915–1992", tag: "Chicago", img: IMG.willieDixon, short: "Bassist, producer and songwriter behind half of Chess." },
  { slug: "little-walter", name: "Little Walter", era: "1930–1968", tag: "Chicago", img: PORTRAITS.littleWalter, short: "Plugged the harmonica into an amp and never looked back." },
  { slug: "jimmy-reed", name: "Jimmy Reed", era: "1925–1976", tag: "Chicago", img: PORTRAITS.jimmyReed, short: "The lazy shuffle that the Stones, Elvis and everyone else copied." },
  { slug: "bb-king", name: "B.B. King", era: "1925–2015", tag: "Classic", img: IMG.bbKing, short: "Lucille, vibrato and a smile that conquered the world." },
  { slug: "albert-king", name: "Albert King", era: "1923–1992", tag: "Texas", img: PORTRAITS.albertKing, short: "Upside-down Flying V and the bending hand SRV worshipped." },
  { slug: "freddie-king", name: "Freddie King", era: "1934–1976", tag: "Texas", img: PORTRAITS.freddieKing, short: "Texas-Chicago hybrid — \"Hide Away\" is on every guitarist's playlist." },
  { slug: "otis-rush", name: "Otis Rush", era: "1934–2018", tag: "Chicago", img: PORTRAITS.otisRush, short: "West Side soul-blues — left-handed, upside-down, devastating." },
  { slug: "magic-sam", name: "Magic Sam", era: "1937–1969", tag: "Chicago", img: PORTRAITS.magicSam, short: "The Hendrix of the West Side, gone at 32." },
  { slug: "junior-wells", name: "Junior Wells", era: "1934–1998", tag: "Chicago", img: PORTRAITS.juniorWells, short: "Sharp-suited harmonica master and Buddy Guy's lifelong partner." },
  { slug: "koko-taylor", name: "Koko Taylor", era: "1928–2009", tag: "Chicago", img: PORTRAITS.kokoTaylor, short: "Queen of the Blues — \"Wang Dang Doodle\" still rattles the rafters." },
  { slug: "etta-james", name: "Etta James", era: "1938–2012", tag: "Classic", img: IMG.ettaJames, short: "From doo-wop to deep blues — \"At Last\" is just the start." },
  { slug: "buddy-guy", name: "Buddy Guy", era: "1936–", tag: "Chicago", img: IMG.buddyGuy, short: "The bridge from Muddy to Hendrix — and still on stage." },
  { slug: "eric-clapton", name: "Eric Clapton", era: "1945–", tag: "British", img: IMG.ericClapton, short: "Cream, Bluesbreakers, Derek — the British invasion of the blues." },
  { slug: "stevie-ray-vaughan", name: "Stevie Ray Vaughan", era: "1954–1990", tag: "Texas", img: IMG.stevieRay, short: "Texas tone, hummingbird right hand, gone far too soon." },
  { slug: "joe-bonamassa", name: "Joe Bonamassa", era: "1977–", tag: "Modern", img: PORTRAITS.joeBonamassa, short: "Independent blues-rock empire — vintage tone and a relentless tour bus." },
  { slug: "shemekia-copeland", name: "Shemekia Copeland", era: "1979–", tag: "Modern", img: PORTRAITS.shemekiaCopeland, short: "Johnny's daughter, the new queen of blues with a political voice." },
  { slug: "samantha-fish", name: "Samantha Fish", era: "1989–", tag: "Modern", img: PORTRAITS.samanthaFish, short: "Kansas City fire — cigar-box slide and rock-blues hooks." },
  { slug: "larkin-poe", name: "Larkin Poe", era: "2010–", tag: "Modern", img: PORTRAITS.larkinPoe, short: "Lovell sisters — roots-rock, lap-steel and tight harmonies." },
  { slug: "christone-kingfish-ingram", name: "Christone \"Kingfish\" Ingram", era: "1999–", tag: "Modern", img: PORTRAITS.kingfish, short: "Clarksdale-born phenom keeping the Delta line unbroken." },
];

// Long-form profiles (top 20 — keyed by slug)
export type Profile = {
  born: string;
  origin: string;
  instruments: string[];
  labels: string[];
  signatureSongs: string[];
  bio: string[];
  legacy: string;
  influences: string[];
};

export const PROFILES: Record<string, Profile> = {
  "robert-johnson": {
    born: "8 May 1911, Hazlehurst, Mississippi — d. 16 August 1938, Greenwood, Mississippi (age 27)",
    origin: "Mississippi Delta",
    instruments: ["Acoustic guitar", "Voice"],
    labels: ["Vocalion", "ARC", "Columbia (posthumous)"],
    signatureSongs: ["Cross Road Blues", "Sweet Home Chicago", "Hellhound on My Trail", "Love in Vain", "Come On in My Kitchen"],
    bio: [
      "Robert Leroy Johnson cut just 29 songs across two short sessions — San Antonio in November 1936 and Dallas in June 1937 — and on the strength of those recordings became the most mythologised musician in American history.",
      "His technique was unprecedented. Bass figures, melody and a percussive thumb-driven groove came out of a single acoustic guitar at once. Layered with that strained, haunted tenor and lyrics about restless travel, betrayal, the devil and the road, the records sound like nothing else cut in the 1930s.",
      "The crossroads legend — that he sold his soul to play that well — was largely a later embellishment. What is documented: he learned in Hazlehurst from the older bluesman Ike Zimmerman, returned to the Delta a transformed player, and died young under disputed circumstances in 1938.",
    ],
    legacy: "Columbia's 1961 King of the Delta Blues Singers compilation landed in the hands of the British blues generation and changed rock music. Clapton, the Stones, Led Zeppelin and Bob Dylan all owe him directly. Inducted into the Rock and Roll Hall of Fame as Early Influence in 1986.",
    influences: ["Son House", "Charley Patton", "Lonnie Johnson", "Kokomo Arnold"],
  },
  "muddy-waters": {
    born: "4 April 1913, Issaquena County, Mississippi — d. 30 April 1983, Westmont, Illinois (age 70)",
    origin: "Stovall Plantation, Mississippi → Chicago",
    instruments: ["Electric guitar (slide)", "Voice"],
    labels: ["Aristocrat", "Chess", "Blue Sky"],
    signatureSongs: ["Hoochie Coochie Man", "Mannish Boy", "Got My Mojo Working", "Rollin' Stone", "I'm Ready"],
    bio: [
      "McKinley Morganfield was first recorded in 1941 by Alan Lomax for the Library of Congress while he was driving a tractor on Stovall Plantation outside Clarksdale. Hearing himself on playback decided his future.",
      "In 1943 he boarded the train to Chicago and within a few years had plugged the Delta slide guitar into an amplifier. With Little Walter on harmonica, Otis Spann on piano, Willie Dixon on bass and a series of fearsome drummers, his Chess Records band created the template for electric blues — and, through it, rock and roll.",
      "His 1958 British tour, played at full volume with a Telecaster, scandalised the folk-purist audience but lit the fuse on the British blues boom. The Rolling Stones named themselves after his 1950 single.",
    ],
    legacy: "Six Grammys, a 1987 Rock and Roll Hall of Fame induction, and a direct line of descent that runs through every blues-rock band of the last sixty years.",
    influences: ["Son House", "Robert Johnson", "Big Bill Broonzy"],
  },
  "son-house": {
    born: "21 March 1902, Lyon, Mississippi — d. 19 October 1988, Detroit",
    origin: "Mississippi Delta",
    instruments: ["National steel guitar (slide)", "Voice"],
    labels: ["Paramount", "Library of Congress", "Columbia"],
    signatureSongs: ["Death Letter Blues", "Grinnin' in Your Face", "Preachin' the Blues", "John the Revelator"],
    bio: [
      "Eddie James House Jr. was a Baptist preacher who never fully made peace with playing the devil's music — and that internal war is exactly what comes out of his records.",
      "He recorded for Paramount in 1930, then for Alan Lomax in 1941–42, then disappeared. Rediscovered in Rochester, New York in 1964 by blues researchers, he returned to the stage and the folk-festival circuit and made some of the most spiritually intense recordings of the 1960s blues revival.",
      "His unaccompanied a cappella performance of \"Grinnin' in Your Face\" — just hand-claps and that thundering voice — is one of the great moments in American music.",
    ],
    legacy: "Direct teacher and mentor to Robert Johnson and Muddy Waters. Inducted into the Blues Hall of Fame (1980) and Rock and Roll Hall of Fame (2017, Early Influence).",
    influences: ["Charley Patton", "Willie Wilson"],
  },
  "bb-king": {
    born: "16 September 1925, Itta Bena, Mississippi — d. 14 May 2015, Las Vegas (age 89)",
    origin: "Mississippi Delta → Memphis",
    instruments: ["Gibson ES-355 \"Lucille\"", "Voice"],
    labels: ["RPM", "Kent", "ABC-Paramount", "MCA"],
    signatureSongs: ["The Thrill Is Gone", "Every Day I Have the Blues", "Sweet Little Angel", "Rock Me Baby"],
    bio: [
      "Riley B. King left a Mississippi plantation, joined his cousin Bukka White in Memphis, and became a DJ on WDIA where his on-air name — Beale Street Blues Boy — got shortened to B.B.",
      "He never strummed chords behind his solos: he sang the lyrics, then made Lucille sing the answer. That call-and-response between voice and a single-string vibrato lick became the most-copied vocabulary in electric blues.",
      "Over a sixty-year touring career he played a documented 15,000+ concerts, an output unrivalled in popular music.",
    ],
    legacy: "15 Grammy Awards, a Presidential Medal of Freedom (2006), and a Memphis museum on Beale Street. \"The Thrill Is Gone\" (1969) brought the blues into mainstream American radio.",
    influences: ["T-Bone Walker", "Lonnie Johnson", "Django Reinhardt", "Charlie Christian"],
  },
  "howlin-wolf": {
    born: "10 June 1910, White Station, Mississippi — d. 10 January 1976, Hines, Illinois",
    origin: "Mississippi Delta → Memphis → Chicago",
    instruments: ["Voice", "Acoustic & electric guitar", "Harmonica"],
    labels: ["RPM", "Chess"],
    signatureSongs: ["Smokestack Lightnin'", "Spoonful", "Killing Floor", "Back Door Man", "Little Red Rooster"],
    bio: [
      "Chester Arthur Burnett was 6'3\", weighed close to 300 pounds, and had a voice that sounded like gravel being shovelled. He was first recorded by Sam Phillips at Sun Studio in Memphis before moving to Chicago in 1953 to record exclusively for Chess.",
      "His band — at various times including Hubert Sumlin on guitar — produced some of the most aggressive, primal sides in the Chess catalogue. Where Muddy was suave and confident, Wolf was elemental and unsettling.",
      "Cream covered \"Spoonful\". Led Zeppelin covered \"Killing Floor\" (as \"The Lemon Song\"). The Doors covered \"Back Door Man\". The Stones cut \"Little Red Rooster\".",
    ],
    legacy: "Inducted into the Rock and Roll Hall of Fame (1991) and Blues Hall of Fame (1980).",
    influences: ["Charley Patton", "Sonny Boy Williamson II"],
  },
  "john-lee-hooker": {
    born: "22 August 1917 (disputed), Coahoma County, Mississippi — d. 21 June 2001, California",
    origin: "Mississippi → Detroit",
    instruments: ["Electric guitar", "Voice", "Foot-stomp"],
    labels: ["Modern", "Vee-Jay", "Chess", "Silvertone"],
    signatureSongs: ["Boogie Chillen'", "Boom Boom", "One Bourbon, One Scotch, One Beer", "I'm in the Mood"],
    bio: [
      "Hooker moved to Detroit in the 1940s to work in the auto plants and became the city's blues. \"Boogie Chillen'\" (1948) went to #1 R&B and sold a million copies on the strength of one chord, a foot-stomp and that conspiratorial spoken-sung voice.",
      "He played his own time — not 12-bar, not 16-bar, but however long the groove needed to be — and recorded for so many labels under so many pseudonyms that nobody has ever counted his sessions.",
      "His 1989 album The Healer, with Carlos Santana, Bonnie Raitt and Robert Cray, reintroduced him to a new generation and won a Grammy.",
    ],
    legacy: "Four Grammy Awards, induction into the Rock and Roll Hall of Fame (1991).",
    influences: ["Tony Hollins", "Charley Patton"],
  },
  "bessie-smith": {
    born: "15 April 1894, Chattanooga, Tennessee — d. 26 September 1937, Clarksdale, Mississippi",
    origin: "Tennessee / TOBA vaudeville circuit",
    instruments: ["Voice"],
    labels: ["Columbia"],
    signatureSongs: ["Downhearted Blues", "St. Louis Blues", "Nobody Knows You When You're Down and Out", "Backwater Blues"],
    bio: [
      "Mentored briefly by Ma Rainey on the Black vaudeville circuit, Bessie Smith became the highest-paid Black entertainer in 1920s America. Columbia signed her in 1923 and her debut, \"Downhearted Blues\", sold three-quarters of a million copies in six months.",
      "She recorded with Louis Armstrong, James P. Johnson and a long list of jazz royalty. Her phrasing, dynamics and emotional authority are the foundation of nearly every female blues, jazz and soul singer who followed.",
      "She died in a car accident in Clarksdale at 43. Janis Joplin paid for her unmarked grave to get a proper headstone in 1970.",
    ],
    legacy: "Grammy Hall of Fame, Rock and Roll Hall of Fame (1989, Early Influence). Direct line to Billie Holiday, Janis Joplin, Aretha Franklin and Etta James.",
    influences: ["Ma Rainey"],
  },
  "ma-rainey": {
    born: "26 April 1886, Columbus, Georgia — d. 22 December 1939",
    origin: "Georgia / TOBA vaudeville circuit",
    instruments: ["Voice"],
    labels: ["Paramount"],
    signatureSongs: ["See See Rider Blues", "Ma Rainey's Black Bottom", "Bo-Weavil Blues", "Prove It on Me Blues"],
    bio: [
      "Gertrude \"Ma\" Rainey was on the road performing classic blues a decade before anyone bothered to record it. By the time she did record — for Paramount, starting 1923 — she had already earned the title Mother of the Blues.",
      "She wrote much of her own material, ran her own touring company, owned theatres and was openly bisexual in songs like \"Prove It on Me Blues\" — extraordinary for the 1920s.",
    ],
    legacy: "Rock and Roll Hall of Fame (1990), Blues Hall of Fame (1983). August Wilson's play and the 2020 Netflix film with Viola Davis and Chadwick Boseman brought her story to a new audience.",
    influences: ["Travelling minstrel and tent-show tradition"],
  },
  "blind-lemon-jefferson": {
    born: "September 1893, Coutchman, Texas — d. December 1929, Chicago",
    origin: "East Texas",
    instruments: ["Acoustic guitar", "Voice"],
    labels: ["Paramount"],
    signatureSongs: ["Black Snake Moan", "Matchbox Blues", "See That My Grave Is Kept Clean", "Hangman's Blues"],
    bio: [
      "The first commercially successful male country-blues recording artist. Paramount sold his records by the hundreds of thousands across the South in the late 1920s.",
      "Self-accompanied on a busy, intricate, idiosyncratic guitar style. His repertoire — preserved on roughly 100 recorded sides between 1925 and 1929 — fed directly into Lead Belly, T-Bone Walker (who as a teenager led him around Dallas), and through them everyone since.",
    ],
    legacy: "Blues Hall of Fame (1980), Rock and Roll Hall of Fame (2022, Musical Excellence).",
    influences: ["Texas country-blues tradition"],
  },
  "willie-dixon": {
    born: "1 July 1915, Vicksburg, Mississippi — d. 29 January 1992",
    origin: "Mississippi → Chicago",
    instruments: ["Upright bass", "Voice"],
    labels: ["Chess (staff)", "Cobra", "Bluesville"],
    signatureSongs: ["Hoochie Coochie Man", "I Just Want to Make Love to You", "Little Red Rooster", "Spoonful", "Back Door Man", "You Shook Me"],
    bio: [
      "If Muddy and Wolf were the faces of Chess Records, Willie Dixon was its engine. As staff songwriter, producer, arranger and house bassist he wrote or co-wrote nearly every blues standard you can name from the 1950s.",
      "He famously had to sue Led Zeppelin twice to be credited (and paid) for songs they had simply taken — \"Whole Lotta Love\" / \"You Need Love\" and \"Bring It On Home\" — and used the settlements to fund the Blues Heaven Foundation, dedicated to helping older blues artists recover their publishing rights.",
    ],
    legacy: "Grammy winner, Blues Hall of Fame (1980), Rock and Roll Hall of Fame (1994).",
    influences: ["Big Bill Broonzy", "Memphis Slim"],
  },
  "buddy-guy": {
    born: "30 July 1936, Lettsworth, Louisiana — still active",
    origin: "Louisiana → Chicago",
    instruments: ["Polka-dot Stratocaster", "Voice"],
    labels: ["Chess", "Vanguard", "Silvertone", "RCA / Jive"],
    signatureSongs: ["Stone Crazy", "First Time I Met the Blues", "Damn Right, I've Got the Blues", "Mustang Sally"],
    bio: [
      "Buddy Guy arrived in Chicago in 1957 with a guitar he had built out of two paint cans and a piece of wood. By 1960 he was Chess Records' house guitarist, playing on records by Wolf, Muddy and Sonny Boy Williamson II.",
      "His wild, volume-on-eleven, flamboyantly theatrical style was too much for Leonard Chess in the studio, but Hendrix, Clapton, Beck and Stevie Ray Vaughan all worshipped him — and finally, on his 1991 comeback Damn Right, I've Got the Blues, the rest of the world caught up.",
    ],
    legacy: "Eight Grammys, Kennedy Center Honors (2012), Presidential Medal of Freedom recipient. Owner of the Legends club in Chicago — the most important room in the city.",
    influences: ["Guitar Slim", "B.B. King", "T-Bone Walker"],
  },
  "etta-james": {
    born: "25 January 1938, Los Angeles — d. 20 January 2012",
    origin: "Los Angeles / Chess Records Chicago",
    instruments: ["Voice"],
    labels: ["Modern", "Chess / Argo", "Island"],
    signatureSongs: ["At Last", "I'd Rather Go Blind", "Tell Mama", "Something's Got a Hold on Me"],
    bio: [
      "Jamesetta Hawkins started as a teenage R&B doo-wop singer, signed to Chess at 22, and over the next forty years moved fluidly between blues, soul, gospel, jazz and rock without losing the gravity in her voice for a second.",
      "Her version of \"At Last\" — recorded in 1960 with strings — became one of the best-known American recordings of any genre.",
    ],
    legacy: "Six Grammy Awards, Rock and Roll Hall of Fame (1993), Blues Hall of Fame (2001).",
    influences: ["Billie Holiday", "Dinah Washington"],
  },
  "stevie-ray-vaughan": {
    born: "3 October 1954, Dallas, Texas — d. 27 August 1990, East Troy, Wisconsin",
    origin: "Texas",
    instruments: ["Fender Stratocaster (\"Number One\")", "Voice"],
    labels: ["Epic"],
    signatureSongs: ["Texas Flood", "Pride and Joy", "Cold Shot", "Tightrope", "Crossfire"],
    bio: [
      "Younger brother of Jimmie Vaughan, Stevie soaked up Albert King, Otis Rush, Hendrix and Lonnie Mack and welded them together with a tone and attack so physical it sounded like the strings hurt him.",
      "His 1983 debut Texas Flood single-handedly proved there was still an audience for hard, traditional electric blues. Six years and four studio albums later he was clean, sober, playing better than ever, and killed in a helicopter crash leaving an Eric Clapton show in Wisconsin.",
    ],
    legacy: "Six Grammys (four posthumous), Rock and Roll Hall of Fame (2015), the standard against which every modern blues-rock guitarist is still measured.",
    influences: ["Albert King", "Jimi Hendrix", "Lonnie Mack", "Buddy Guy"],
  },
  "eric-clapton": {
    born: "30 March 1945, Ripley, Surrey, England",
    origin: "England — British blues boom",
    instruments: ["Electric guitar", "Voice"],
    labels: ["Decca", "Polydor", "RSO", "Reprise"],
    signatureSongs: ["Crossroads (Cream)", "Layla (Derek & the Dominos)", "Have You Ever Loved a Woman", "Five Long Years"],
    bio: [
      "Through the Yardbirds, John Mayall's Bluesbreakers, Cream and Derek and the Dominos, Clapton turned the British blues obsession with Chess Records and Robert Johnson into stadium rock.",
      "Whatever you think of the long solo career that followed, his run from 1965's Bluesbreakers with Eric Clapton through 1970's Layla is one of the great six-year stretches in electric blues guitar.",
    ],
    legacy: "Inducted into the Rock and Roll Hall of Fame three times. Crossroads Centre Antigua, the addiction-treatment foundation he set up, is funded largely by his recurring Crossroads Guitar Festival.",
    influences: ["Robert Johnson", "Freddie King", "B.B. King", "Buddy Guy"],
  },
  "t-bone-walker": {
    born: "28 May 1910, Linden, Texas — d. 16 March 1975",
    origin: "Dallas, Texas",
    instruments: ["Hollow-body electric guitar", "Voice"],
    labels: ["Capitol", "Black & White", "Imperial", "Atlantic"],
    signatureSongs: ["Call It Stormy Monday", "T-Bone Shuffle", "Mean Old World"],
    bio: [
      "Aaron Thibeaux Walker was the first electric blues guitar hero — single-string solos, jazz chord voicings, swing rhythm section, the guitar held flat like a steel — and his 1947 \"Stormy Monday\" is one of the most-covered songs in popular music.",
      "He led B.B. King away from the cotton fields. He showed Chuck Berry the duck-walk (almost literally). The entire post-war electric blues style starts with him.",
    ],
    legacy: "Blues Hall of Fame (1980), Rock and Roll Hall of Fame (1987, Early Influence).",
    influences: ["Blind Lemon Jefferson (whom he led as a boy)", "Lonnie Johnson", "Charlie Christian"],
  },
  "lead-belly": {
    born: "January 1888, Mooringsport, Louisiana — d. 6 December 1949, New York",
    origin: "Louisiana / Texas",
    instruments: ["12-string Stella guitar", "Accordion", "Voice"],
    labels: ["ARC", "Library of Congress", "RCA Victor", "Folkways"],
    signatureSongs: ["Goodnight, Irene", "Where Did You Sleep Last Night", "Cotton Fields", "Midnight Special", "Rock Island Line"],
    bio: [
      "Huddie William Ledbetter was recorded by John and Alan Lomax in Louisiana's Angola Prison in 1933. After his release he travelled north with the Lomaxes and became, against the racial grain of the 1930s, the centre of the New York folk-revival scene.",
      "His twelve-string Stella, his enormous repertoire and his role as a bridge between the Delta and the Greenwich Village folk movement are the reason \"Goodnight, Irene\" was a #1 hit in 1950 and \"Rock Island Line\" launched the British skiffle craze that produced the Beatles.",
    ],
    legacy: "Rock and Roll Hall of Fame (1988, Early Influence). His repertoire is the connecting tissue between blues, country and modern American folk.",
    influences: ["Blind Lemon Jefferson (with whom he travelled in Texas)"],
  },
  "ma-rainey-2": { born: "", origin: "", instruments: [], labels: [], signatureSongs: [], bio: [], legacy: "", influences: [] },
  "samantha-fish": {
    born: "30 January 1989, Kansas City, Missouri",
    origin: "Kansas City",
    instruments: ["Electric guitar (incl. cigar-box)", "Voice"],
    labels: ["Ruf", "Rounder", "Round Hill"],
    signatureSongs: ["Bulletproof", "Chills & Fever", "Bitch on the Run", "Faster"],
    bio: [
      "A drummer first, Samantha Fish picked up the guitar in her teens, was discovered at the King Biscuit Festival in Arkansas, and signed to Ruf Records in 2011. Six albums later she had moved decisively from straight blues into a brassy, hook-driven blues-rock with cigar-box slide solos.",
      "Her 2023 collaboration with Jesse Dayton, Death Wish Blues, hit #1 on the Billboard Blues chart.",
    ],
    legacy: "Three Blues Music Awards, the leading commercial face of the new generation of women in blues.",
    influences: ["Tom Petty", "Stevie Ray Vaughan", "Junior Kimbrough", "Bonnie Raitt"],
  },
  "larkin-poe": {
    born: "Megan Lovell 1989, Rebecca Lovell 1991 — Atlanta, Georgia",
    origin: "Atlanta, Georgia",
    instruments: ["Lap-steel guitar (Megan)", "Electric guitar & voice (Rebecca)"],
    labels: ["RH Music", "Tricki-Woo"],
    signatureSongs: ["Preachin' Blues", "Bleach Blonde Bottle Blues", "Strike Gold", "She's a Self-Made Man"],
    bio: [
      "Sisters Rebecca and Megan Lovell started as part of the bluegrass trio The Lovell Sisters, then formed Larkin Poe (named for a great-great-great-grandfather) in 2010. Six studio albums, a Grammy nomination, and a YouTube channel of impeccable blues covers later, they are the most visible roots-rock duo of their generation.",
    ],
    legacy: "Grammy-nominated for Best Contemporary Blues Album (2020, Self Made Man) and (2022, Paint the Roses).",
    influences: ["Allman Brothers", "Son House", "Skip James", "Mississippi Fred McDowell"],
  },
  "christone-kingfish-ingram": {
    born: "19 January 1999, Clarksdale, Mississippi",
    origin: "Clarksdale, Mississippi — the same town that produced Muddy Waters and John Lee Hooker",
    instruments: ["Electric guitar", "Voice"],
    labels: ["Alligator"],
    signatureSongs: ["Outside of This Town", "662", "Empty Promises", "Long Distance Woman"],
    bio: [
      "Trained at the Delta Blues Museum's after-school programme in Clarksdale, Christone \"Kingfish\" Ingram released his debut Kingfish on Alligator at 20 and won a Grammy for Best Contemporary Blues Album three years later.",
      "Critics from Buddy Guy to Vernon Reid have called him the most important young blues artist to appear in a generation — the proof that the line from Charley Patton to today has never broken.",
    ],
    legacy: "Grammy winner (2022), three Blues Music Awards, on the cover of Living Blues at 20.",
    influences: ["Buddy Guy", "B.B. King", "Albert King", "Prince"],
  },
};
delete (PROFILES as any)["ma-rainey-2"];

export type Style = {
  slug: string;
  name: string;
  era: string;
  origin: string;
  instruments: string[];
  feel: string;
  artists: string[];
  desc: string;
};

export const STYLES: Style[] = [
  { slug: "delta", name: "Delta Blues", era: "1890s–1940s", origin: "Mississippi Delta, USA", instruments: ["Acoustic guitar", "Slide / bottleneck", "Voice", "Harmonica"], feel: "Raw, intimate, mournful, percussive", artists: ["Robert Johnson", "Son House", "Charley Patton", "Skip James"], desc: "The oldest recorded blues style — one voice, one guitar, often a bottleneck on the strings. Born on the porches and in the juke joints of the Mississippi Delta." },
  { slug: "chicago", name: "Chicago Blues", era: "1940s–today", origin: "Chicago, Illinois", instruments: ["Electric guitar", "Harmonica", "Bass", "Drums", "Piano"], feel: "Loud, urban, swinging, electric", artists: ["Muddy Waters", "Howlin' Wolf", "Little Walter", "Buddy Guy"], desc: "What happened when the Great Migration carried the Delta north — and the guitar got plugged into an amplifier. The DNA of every rock band since." },
  { slug: "texas", name: "Texas Blues", era: "1920s–today", origin: "Texas, USA", instruments: ["Electric guitar (long solos)", "Horn section", "Drums"], feel: "Smooth, jazzy, swinging, single-note solos", artists: ["T-Bone Walker", "Freddie King", "Stevie Ray Vaughan", "ZZ Top"], desc: "Where blues meets jazz and swing. Long, fluid single-note guitar lines and a tighter, hornier rhythm section." },
  { slug: "british", name: "British Blues", era: "1960s", origin: "London / Manchester, UK", instruments: ["Electric guitar (loud)", "Bass", "Drums"], feel: "Reverent, loud, virtuosic, white-knuckled", artists: ["John Mayall", "Eric Clapton", "Peter Green", "Rolling Stones"], desc: "British teenagers heard Muddy's Chess records and tried to play them louder. Out came the entire 60s rock revolution." },
  { slug: "piedmont", name: "Piedmont Blues", era: "1920s–1940s", origin: "US East Coast", instruments: ["Acoustic guitar (finger-style)", "Voice"], feel: "Bouncy, ragtime-influenced, melodic", artists: ["Blind Blake", "Reverend Gary Davis", "Mississippi John Hurt"], desc: "An East-coast cousin of the Delta — finger-picked, ragtime-tinged, often happier in feel." },
  { slug: "jump", name: "Jump Blues", era: "1940s–1950s", origin: "West Coast / Kansas City", instruments: ["Horns", "Boogie piano", "Upright bass", "Shouter voice"], feel: "Up-tempo, danceable, jazz-flavoured", artists: ["Louis Jordan", "Big Joe Turner", "Wynonie Harris"], desc: "The bridge from swing to rock and roll. Big-band energy, blues changes, and a horn section that never stops." },
  { slug: "soul-blues", name: "Soul Blues", era: "1960s–today", origin: "Memphis / Muscle Shoals", instruments: ["Electric guitar", "Horn section", "Hammond organ", "Strings"], feel: "Smooth, gospel-rooted, romantic", artists: ["Bobby Bland", "B.B. King", "Z.Z. Hill", "Etta James"], desc: "Where the church meets the juke joint — gospel vocals over a blues 12-bar with horns and Hammond." },
  { slug: "modern-electric", name: "Modern Electric", era: "1990s–today", origin: "Worldwide", instruments: ["Electric guitar", "Bass", "Drums", "Vocals"], feel: "High-fidelity, eclectic, rock-influenced", artists: ["Joe Bonamassa", "Gary Clark Jr.", "Larkin Poe", "Walter Trout"], desc: "Today's torchbearers — drawing on every era, plugged into modern amps and modern audiences." },
];

export const FESTIVALS = [
  { name: "Notodden Blues Festival", country: "🇳🇴 Norway", month: "August", city: "Notodden", url: "https://bluesfest.no" },
  { name: "Mandal Blues Festival", country: "🇳🇴 Norway", month: "August", city: "Mandal", url: "https://mandalbluesfestival.no" },
  { name: "Skånevik Bluesfestival", country: "🇳🇴 Norway", month: "July", city: "Skånevik", url: "https://skanevikbluesfestival.no" },
  { name: "Memphis in May / Beale Street Music Festival", country: "🇺🇸 USA", month: "May", city: "Memphis, TN", url: "https://memphisinmay.org" },
  { name: "Chicago Blues Festival", country: "🇺🇸 USA", month: "June", city: "Chicago, IL", url: "https://www.choosechicago.com/chicago-blues-festival/" },
  { name: "King Biscuit Blues Festival", country: "🇺🇸 USA", month: "October", city: "Helena, AR", url: "https://kingbiscuitfestival.com" },
  { name: "Cognac Blues Passions", country: "🇫🇷 France", month: "July", city: "Cognac", url: "https://www.bluespassions.com" },
  { name: "Mississippi Valley Blues Festival", country: "🇺🇸 USA", month: "July", city: "Davenport, IA", url: "https://mvbs.org" },
  { name: "Moulin Blues Ospel", country: "🇳🇱 Netherlands", month: "May", city: "Ospel", url: "https://moulinblues.nl" },
  { name: "European Blues Challenge", country: "🇪🇺 Europe", month: "April", city: "Katowice 2026", url: "https://www.europeanbluesunion.com" },
];

export const RADIO_SHOWS = [
  { time: "00–06", show: "Slow Night Blues", host: "Deep cuts from the Delta" },
  { time: "06–10", show: "Morning Boogie", host: "Wake-up shuffle and harmonica" },
  { time: "10–14", show: "Chess Records Hour", host: "Muddy, Wolf, Sonny Boy, Walter" },
  { time: "14–18", show: "Modern Voices", host: "New releases and live sessions" },
  { time: "18–22", show: "Juke Joint Friday", host: "Saturday-night sized energy" },
  { time: "22–00", show: "Late Mood", host: "Slow blues, soul-blues, gospel" },
];

export const BLOG_POSTS = [
  { slug: "buddy-guy-farewell", date: "2026-04-12", title: "Buddy Guy — The Final Goodbye", excerpt: "At 89, the last giant of Chicago blues bows out with a tour that feels less like a farewell than a benediction.", img: IMG.buddyGuy },
  { slug: "delta-pilgrimage", date: "2026-03-28", title: "A Pilgrimage to Clarksdale", excerpt: "Stovall Plantation, the Crossroads sign, Red's Lounge — walking the ground that gave us the blues.", img: IMG.clarksdale },
  { slug: "norwegian-blues-2026", date: "2026-03-10", title: "The Norwegian Blues Year 2026", excerpt: "Notodden, Mandal, Skånevik — and the new generation of Nordic blues artists worth your attention.", img: IMG.stage },
  { slug: "muddy-mojo-50", date: "2026-02-22", title: "50 Years of «Got My Mojo Working»", excerpt: "How a Preston Foster song became Muddy Waters' most-played number and a global blues standard.", img: IMG.muddyWaters },
  { slug: "harmonica-essentials", date: "2026-02-04", title: "Harmonica Essentials — 10 Players to Know", excerpt: "From Little Walter to Charlie Musselwhite — a primer on the small instrument that shaped the big sound.", img: IMG.harmonica },
  { slug: "robert-johnson-truth", date: "2026-01-18", title: "Robert Johnson — Myth vs Truth", excerpt: "What we actually know about the man behind the crossroads legend, separated from a hundred years of romance.", img: IMG.robertJohnson },
];

export const WORLD_PINS = [
  { name: "Clarksdale, MS", lat: 34.20, lng: -90.57, type: "Cradle of the Delta blues" },
  { name: "Memphis, TN", lat: 35.15, lng: -90.05, type: "Beale Street, Stax, Sun" },
  { name: "Chicago, IL", lat: 41.85, lng: -87.65, type: "Chess Records, Maxwell Street" },
  { name: "Helena, AR", lat: 34.53, lng: -90.59, type: "King Biscuit Time" },
  { name: "New Orleans, LA", lat: 29.95, lng: -90.07, type: "Jazz/blues meeting point" },
  { name: "London, UK", lat: 51.51, lng: -0.13, type: "British blues boom" },
  { name: "Notodden, NO", lat: 59.56, lng: 9.26, type: "European Blues Hall of Fame" },
  { name: "Tokyo, JP", lat: 35.68, lng: 139.69, type: "Japanese blues scene" },
  { name: "Katowice, PL", lat: 50.26, lng: 19.02, type: "European Blues Challenge 2026" },
];

// Full expanded history timeline
export const TIMELINE = [
  { year: "1865", kind: "origin", title: "End of slavery", body: "The 13th Amendment abolishes slavery in the United States. Formerly enslaved people in the Deep South begin to develop new musical forms blending African traditions with American influences." },
  { year: "1877", kind: "origin", title: "End of Reconstruction", body: "Federal troops leave the South; the Jim Crow era begins. The brutal sharecropping system and segregation will feed the blues for decades." },
  { year: "1890", kind: "origin", title: "The blues takes shape", body: "The blues form crystallises in the Mississippi Delta. Work songs, field hollers, spirituals and African musical traditions fuse into a distinct style." },
  { year: "1903", kind: "milestone", title: "W.C. Handy's encounter", body: "W.C. Handy hears a slide guitarist at a train station in Tutwiler, Mississippi — one of the first documented descriptions of Delta blues." },
  { year: "1910", kind: "migration", title: "The Great Migration begins", body: "African Americans begin moving from the rural South to Northern cities. This movement will eventually carry Delta blues to Chicago, Detroit and beyond." },
  { year: "1920", kind: "recording", title: "First blues record", body: "Mamie Smith records \"Crazy Blues\" for Okeh — the first blues record by an African-American artist. 75,000 copies sell in a month." },
  { year: "1926", kind: "artist", title: "Blind Lemon Jefferson records", body: "Blind Lemon Jefferson begins recording for Paramount and becomes the first major male blues star, influencing generations of guitarists." },
  { year: "1929", kind: "artist", title: "Charley Patton records", body: "The \"father of Delta blues\" Charley Patton cuts his first sides for Paramount, including \"Pony Blues.\"" },
  { year: "1933", kind: "recording", title: "John Lomax records Lead Belly", body: "John Lomax records Lead Belly at Angola Prison in Louisiana for the Library of Congress, beginning decades of fieldwork that will preserve blues history." },
  { year: "1936", kind: "recording", title: "Robert Johnson sessions", body: "Robert Johnson cuts his legendary sessions in San Antonio, Texas at the Gunter Hotel. The 29 songs will become the most influential blues recordings ever made." },
  { year: "1941", kind: "recording", title: "Muddy Waters' field recordings", body: "Alan Lomax records McKinley Morganfield (Muddy Waters) at Stovall Plantation for the Library of Congress. Hearing the playback inspires him to go professional." },
  { year: "1943", kind: "migration", title: "Muddy moves to Chicago", body: "Muddy Waters leaves Mississippi for Chicago, eventually carrying the Delta sound to urban audiences and electrifying the genre." },
  { year: "1947", kind: "milestone", title: "Chess Records founded", body: "Leonard and Phil Chess establish Chess Records in Chicago (originally Aristocrat). The label will become the most important in blues history." },
  { year: "1950", kind: "recording", title: "\"Rollin' Stone\" released", body: "Muddy Waters releases \"Rollin' Stone\" on Chess — the song that gave both The Rolling Stones and Bob Dylan's \"Like a Rolling Stone\" their name." },
  { year: "1952", kind: "recording", title: "Little Walter's \"Juke\"", body: "Little Walter's instrumental \"Juke\" hits #1 on the R&B charts, revolutionising blues harmonica with its amplified, distorted sound." },
  { year: "1954", kind: "recording", title: "\"Hoochie Coochie Man\"", body: "Muddy Waters cuts Willie Dixon's \"Hoochie Coochie Man,\" creating the blues-rock template that will dominate for two decades." },
  { year: "1958", kind: "milestone", title: "Muddy tours Britain", body: "Muddy Waters' electric performance shocks British audiences expecting acoustic folk-blues. The tour ignites the British blues boom." },
  { year: "1961", kind: "artist", title: "Son House rediscovered", body: "Blues researchers find Son House in Rochester, NY. His rediscovery leads to new recordings and folk-revival performances." },
  { year: "1962", kind: "milestone", title: "Rolling Stones form", body: "The Rolling Stones form in London, named after Muddy Waters' song. British bands will soon carry the blues to global rock audiences." },
  { year: "1966", kind: "milestone", title: "Cream covers the blues", body: "Cream (Clapton, Bruce, Baker) form and cover standards by Robert Johnson, Skip James and Howlin' Wolf, introducing millions to the blues." },
  { year: "1969", kind: "milestone", title: "Led Zeppelin debut", body: "Led Zeppelin's debut album is steeped in blues, including Willie Dixon covers \"You Shook Me\" and \"I Can't Quit You Baby.\"" },
  { year: "1980", kind: "milestone", title: "Blues Hall of Fame", body: "The Blues Foundation establishes the Blues Hall of Fame in Memphis, honouring legends like Patton, House and Johnson." },
  { year: "1986", kind: "artist", title: "Robert Johnson Hall of Fame", body: "Robert Johnson is inducted into the Rock and Roll Hall of Fame as an Early Influence." },
  { year: "1990", kind: "recording", title: "Robert Johnson box set", body: "Columbia releases The Complete Recordings of Robert Johnson — over 500,000 copies sold, introducing a new generation to Delta blues." },
  { year: "1994", kind: "milestone", title: "Robert Johnson stamp", body: "The US Postal Service issues a Robert Johnson stamp in its \"Legends of American Music\" series." },
  { year: "1997", kind: "artist", title: "John Lee Hooker comeback", body: "Hooker wins a Grammy for Don't Look Back, produced by Van Morrison — late-career comeback brings boogie blues to a new audience." },
  { year: "2003", kind: "milestone", title: "Year of the Blues", body: "Congress declares 2003 \"The Year of the Blues.\" Martin Scorsese produces The Blues, a seven-part PBS series." },
  { year: "2006", kind: "artist", title: "Buddy Guy: living legend", body: "Buddy Guy receives the National Medal of Arts from the White House. His club Legends in Chicago remains a blues pilgrimage." },
  { year: "2011", kind: "milestone", title: "Mississippi Blues Trail", body: "The Mississippi Blues Trail reaches 100+ historic markers statewide, including Dockery Plantation and Muddy's Stovall cabin." },
  { year: "2015", kind: "artist", title: "B.B. King dies", body: "Riley B. King (1925–2015), \"The King of the Blues,\" dies in Las Vegas at 89 — 15,000+ performances and 15 Grammys over seven decades." },
  { year: "2019", kind: "artist", title: "Kingfish debut", body: "Christone \"Kingfish\" Ingram, 20, releases his debut album on Alligator. From Clarksdale, Mississippi — the Delta line unbroken." },
  { year: "2021", kind: "milestone", title: "Blues in the streaming age", body: "Blues reaches new audiences via streaming. Joe Bonamassa becomes the best-selling independent blues artist in history." },
  { year: "2025", kind: "milestone", title: "The blues lives on", body: "A vibrant new wave — Kingfish Ingram, Samantha Fish, Marcus King, Larkin Poe — secures the genre's future. Blues festivals flourish worldwide." },
];

// Blues quiz questions
export const QUIZ = [
  { q: "Where was Robert Johnson born?", choices: ["Memphis, TN", "Hazlehurst, MS", "Chicago, IL", "Helena, AR"], answer: 1 },
  { q: "Which label did Muddy Waters record his classic 1950s sides for?", choices: ["Sun", "Chess", "Atlantic", "Vee-Jay"], answer: 1 },
  { q: "Who wrote \"Hoochie Coochie Man\"?", choices: ["Muddy Waters", "Willie Dixon", "Howlin' Wolf", "B.B. King"], answer: 1 },
  { q: "B.B. King named his guitar after a woman. What was her name?", choices: ["Stella", "Lucille", "Bessie", "Etta"], answer: 1 },
  { q: "What song gave The Rolling Stones their name?", choices: ["\"Rollin' Stone\" — Muddy Waters", "\"Like a Rolling Stone\" — Bob Dylan", "\"Stone Free\" — Hendrix", "\"Heart of Stone\" — Otis Redding"], answer: 0 },
  { q: "Which city is the home of Notodden Blues Festival?", choices: ["Bergen", "Oslo", "Notodden", "Stavanger"], answer: 2 },
  { q: "Who is known as \"The Empress of the Blues\"?", choices: ["Ma Rainey", "Bessie Smith", "Memphis Minnie", "Koko Taylor"], answer: 1 },
  { q: "Which blues style is electric, urban and band-based?", choices: ["Delta", "Chicago", "Piedmont", "Country"], answer: 1 },
  { q: "Who recorded \"Boogie Chillen'\" in 1948?", choices: ["John Lee Hooker", "Lightnin' Hopkins", "Big Bill Broonzy", "Sonny Boy Williamson"], answer: 0 },
  { q: "Stevie Ray Vaughan died in a 1990 accident involving what?", choices: ["Tour bus", "Helicopter", "Plane", "Motorcycle"], answer: 1 },
];
