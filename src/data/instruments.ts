// Blues Instruments & Equipment Database
// Sources: Blues Foundation, Smithsonian Institution, Rock & Roll Hall of Fame, manufacturer archives

export interface InstrumentHistory {
  id: string;
  name: string;
  category: "guitars" | "harmonicas" | "amplifiers" | "other";
  manufacturer?: string;
  yearsProduced?: string;
  description: string;
  bluesSignificance: string;
  famousUsers: Array<{
    name: string;
    slug?: string; // Link to artist profile
    notes?: string;
  }>;
  imageUrl?: string;
  imageCredit?: string;
}

export const instrumentCategories = [
  { id: "guitars", label: "Guitars", icon: "guitar" },
  { id: "harmonicas", label: "Harmonicas", icon: "music" },
  { id: "amplifiers", label: "Amplifiers", icon: "speaker" },
  { id: "other", label: "Other Equipment", icon: "mic" },
] as const;

export const instrumentsHistory: InstrumentHistory[] = [
  // GUITARS
  {
    id: "national-resonator",
    name: "National Resonator Guitar",
    category: "guitars",
    manufacturer: "National String Instrument Corporation",
    yearsProduced: "1927–present",
    description: "The National resonator guitar uses metal cones to amplify sound acoustically, producing a distinctive bright, metallic tone. The tri-cone and single-cone designs became essential for Delta blues performers who needed volume to be heard in noisy juke joints without electricity.",
    bluesSignificance: "Before amplification, resonator guitars provided the volume needed for solo performers in crowded venues. The distinctive 'steel' sound became synonymous with Delta and country blues, influencing slide guitar techniques that remain central to blues today.",
    famousUsers: [
      { name: "Son House", slug: "son-house", notes: "Used a National steel-bodied guitar for his intense slide work" },
      { name: "Bukka White", slug: "bukka-white", notes: "His National Duolian defined his percussive style" },
      { name: "Tampa Red", slug: "tampa-red", notes: "Known as the 'Guitar Wizard' on his gold-plated National" },
      { name: "Blind Boy Fuller", notes: "Featured resonator on many Piedmont blues recordings" }
    ]
  },
  {
    id: "gibson-es-150",
    name: "Gibson ES-150 'Charlie Christian'",
    category: "guitars",
    manufacturer: "Gibson",
    yearsProduced: "1936–1942",
    description: "The Gibson ES-150 was one of the first commercially successful electric guitars. Named after jazz guitarist Charlie Christian who popularized it, the ES-150 featured a bar pickup that became known as the 'Charlie Christian pickup.' Its warm, clear tone made it a bridge between acoustic and electric guitar eras.",
    bluesSignificance: "The ES-150 helped transition blues from acoustic to electric. Its full, mellow tone influenced the development of the Chicago blues sound and proved that electric guitars could be serious musical instruments, not just novelties.",
    famousUsers: [
      { name: "T-Bone Walker", slug: "t-bone-walker", notes: "Pioneer of electric blues guitar" },
      { name: "Eddie Durham", notes: "Early electric blues and jazz innovator" },
      { name: "Lonnie Johnson", slug: "lonnie-johnson", notes: "Jazz-blues virtuoso" }
    ]
  },
  {
    id: "fender-telecaster",
    name: "Fender Telecaster",
    category: "guitars",
    manufacturer: "Fender",
    yearsProduced: "1950–present",
    description: "The Fender Telecaster (originally Broadcaster) was the first mass-produced solid-body electric guitar. Its simple design—two single-coil pickups, bolt-on neck—produced a bright, cutting tone perfect for blues. The solid body eliminated feedback problems that plagued hollow-body guitars at high volumes.",
    bluesSignificance: "The Telecaster's twangy, cutting tone became essential to Chicago blues. Its ability to handle distortion without feedback made it perfect for the louder, more aggressive electric blues sound that developed in the 1950s and 1960s.",
    famousUsers: [
      { name: "Muddy Waters", slug: "muddy-waters", notes: "His red 1958 Telecaster became iconic" },
      { name: "Albert Collins", slug: "albert-collins", notes: "'The Master of the Telecaster'" },
      { name: "Jimmy Rogers", slug: "jimmy-rogers", notes: "Key Muddy Waters sideman" }
    ]
  },
  {
    id: "fender-stratocaster",
    name: "Fender Stratocaster",
    category: "guitars",
    manufacturer: "Fender",
    yearsProduced: "1954–present",
    description: "The Stratocaster introduced three pickups, a contoured body, and a synchronized tremolo system. Its versatile tone—from glassy cleans to singing sustain—made it adaptable to virtually any blues style. The five-way switch (originally three-way) allowed tonal combinations impossible on earlier guitars.",
    bluesSignificance: "The Stratocaster became the definitive electric blues guitar by the 1960s. Its expressive capabilities—particularly with the tremolo arm—allowed blues guitarists to add vocal-like qualities to their playing, influencing generations of blues-rock musicians.",
    famousUsers: [
      { name: "Buddy Guy", slug: "buddy-guy", notes: "Known for his polka-dot Strats and aggressive style" },
      { name: "Otis Rush", slug: "otis-rush", notes: "Left-handed player with a searing tone" },
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan", notes: "His 'Number One' Strat is legendary" },
      { name: "Jimi Hendrix", notes: "Though known for rock, deeply rooted in blues" }
    ]
  },
  {
    id: "gibson-les-paul",
    name: "Gibson Les Paul",
    category: "guitars",
    manufacturer: "Gibson",
    yearsProduced: "1952–present",
    description: "The Gibson Les Paul combined a solid mahogany body with a carved maple top, producing a thick, sustaining tone. Its dual humbucking pickups (introduced 1957) cancelled electromagnetic interference while delivering a fatter, warmer sound than single-coils.",
    bluesSignificance: "The Les Paul's thick, sustaining tone became essential to blues-rock. Its ability to produce rich overdriven tones when pushed made it the choice for blues guitarists who wanted a heavier, more aggressive sound.",
    famousUsers: [
      { name: "Freddie King", slug: "freddie-king", notes: "His Les Paul goldtop defined his tone" },
      { name: "B.B. King", slug: "bb-king", notes: "Used a Les Paul Custom before switching to ES models" },
      { name: "John Lee Hooker", slug: "john-lee-hooker", notes: "Later career" },
      { name: "Gary Moore", notes: "Blues-rock legend" }
    ]
  },
  {
    id: "gibson-es-335",
    name: "Gibson ES-335",
    category: "guitars",
    manufacturer: "Gibson",
    yearsProduced: "1958–present",
    description: "The ES-335 was the first commercially successful semi-hollowbody guitar, featuring a solid center block with hollow wings. This design combined the sustain and feedback resistance of a solid body with some of the acoustic resonance of a hollow body.",
    bluesSignificance: "The ES-335 became B.B. King's signature guitar after he named his 'Lucille.' Its warm, vocal tone and excellent sustain made it perfect for his expressive single-note style that influenced virtually every blues guitarist who followed.",
    famousUsers: [
      { name: "B.B. King", slug: "bb-king", notes: "'Lucille' - his named ES-335/ES-355" },
      { name: "Freddie King", slug: "freddie-king" },
      { name: "Otis Rush", slug: "otis-rush" },
      { name: "Eric Clapton", notes: "Used extensively with Cream" }
    ]
  },

  // HARMONICAS
  {
    id: "hohner-marine-band",
    name: "Hohner Marine Band",
    category: "harmonicas",
    manufacturer: "Hohner",
    yearsProduced: "1896–present",
    description: "The Hohner Marine Band is the world's most iconic blues harmonica. Its wooden comb, brass reeds, and distinctive tone made it the standard for blues harmonica players. Available in all 12 keys, it produces the raw, expressive sound that defines blues harp.",
    bluesSignificance: "The Marine Band shaped the very definition of blues harmonica. From country blues field hollers to amplified Chicago harp, this instrument has been present at every major development in blues harmonica history.",
    famousUsers: [
      { name: "Little Walter", slug: "little-walter", notes: "Revolutionized amplified blues harp" },
      { name: "Sonny Boy Williamson I", slug: "sonny-boy-williamson-i", notes: "Pre-war blues harp master" },
      { name: "Sonny Boy Williamson II", slug: "sonny-boy-williamson-ii", notes: "Rice Miller" },
      { name: "James Cotton", slug: "james-cotton" },
      { name: "Junior Wells", slug: "junior-wells" }
    ]
  },
  {
    id: "hohner-special-20",
    name: "Hohner Special 20",
    category: "harmonicas",
    manufacturer: "Hohner",
    yearsProduced: "1974–present",
    description: "The Special 20 introduced a plastic comb to the blues harmonica, making it more comfortable to play for extended periods and more resistant to moisture. It maintains the classic Hohner tone while being easier on the lips.",
    bluesSignificance: "The Special 20 made blues harmonica more accessible to new players while maintaining professional quality. Many modern blues harpists prefer it for its consistent playability across all keys.",
    famousUsers: [
      { name: "Charlie Musselwhite", slug: "charlie-musselwhite", notes: "White blues harp master" },
      { name: "Kim Wilson", notes: "Fabulous Thunderbirds" },
      { name: "Rod Piazza", notes: "West Coast blues harp" }
    ]
  },

  // AMPLIFIERS
  {
    id: "fender-bassman",
    name: "Fender Bassman",
    category: "amplifiers",
    manufacturer: "Fender",
    yearsProduced: "1952–present",
    description: "Originally designed for bass guitar, the Fender Bassman became legendary as a guitar amp. The 1959 'tweed' version with its 4x10 speaker configuration produced warm, natural overdrive that guitarists loved. It became the template for the Marshall amplifier.",
    bluesSignificance: "The Bassman's natural breakup at moderate volumes made it perfect for blues. Its ability to go from clean to gritty overdrive just by playing harder gave guitarists unprecedented dynamic control.",
    famousUsers: [
      { name: "Buddy Guy", slug: "buddy-guy", notes: "Used tweed Bassman for his aggressive tone" },
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan", notes: "Part of his legendary rig" },
      { name: "Jimmie Vaughan", slug: "jimmie-vaughan" }
    ]
  },
  {
    id: "fender-super-reverb",
    name: "Fender Super Reverb",
    category: "amplifiers",
    manufacturer: "Fender",
    yearsProduced: "1963–1982",
    description: "The Super Reverb combined four 10-inch speakers with Fender's acclaimed reverb and vibrato circuits. It produced a balanced, full-range tone that recorded beautifully and could fill a club without overwhelming it.",
    bluesSignificance: "The Super Reverb became the quintessential blues club amp. Its lush reverb and creamy overdrive at stage volumes made it a favorite for blues guitarists who needed a versatile, great-sounding amp for live work.",
    famousUsers: [
      { name: "Stevie Ray Vaughan", slug: "stevie-ray-vaughan", notes: "Used multiple Super Reverbs" },
      { name: "Jimmie Vaughan", slug: "jimmie-vaughan" },
      { name: "Anson Funderburgh", notes: "Texas blues stalwart" }
    ]
  },
  {
    id: "fender-deluxe-reverb",
    name: "Fender Deluxe Reverb",
    category: "amplifiers",
    manufacturer: "Fender",
    yearsProduced: "1963–present",
    description: "The Deluxe Reverb is the smaller sibling of the Super Reverb, with a single 12-inch speaker. At 22 watts, it breaks up at lower volumes, making it perfect for recording and smaller venues. Its portability and great tone made it ubiquitous.",
    bluesSignificance: "The Deluxe Reverb is perhaps the most-recorded blues amp ever. Its ability to achieve creamy overdrive at manageable volumes made it perfect for the recording studio and intimate club gigs that define authentic blues.",
    famousUsers: [
      { name: "Larry Carlton", notes: "Studio legend" },
      { name: "Robben Ford", notes: "Jazz-blues fusion" },
      { name: "Joe Bonamassa", notes: "Modern blues-rock" }
    ]
  },

  // OTHER EQUIPMENT
  {
    id: "astatic-jt30",
    name: "Astatic JT-30 Microphone",
    category: "other",
    manufacturer: "Astatic",
    yearsProduced: "1949–present",
    description: "The Astatic JT-30 is a crystal microphone originally designed for CB radio and PA systems. Its high-impedance output and natural compression when overdriven made it perfect for amplified blues harmonica. The 'bullet' shape fits perfectly in cupped hands.",
    bluesSignificance: "The JT-30 (and similar 'bullet' mics) created the amplified blues harmonica sound. When cupped with a Marine Band and played through an overdriven guitar amp, it produces the distorted, vocal-like tone that defines Chicago blues harp.",
    famousUsers: [
      { name: "Little Walter", slug: "little-walter", notes: "Pioneer of the amplified harp sound" },
      { name: "Junior Wells", slug: "junior-wells" },
      { name: "James Cotton", slug: "james-cotton" },
      { name: "Big Walter Horton", slug: "big-walter-horton" }
    ]
  },
  {
    id: "shure-green-bullet",
    name: "Shure Green Bullet (520)",
    category: "other",
    manufacturer: "Shure",
    yearsProduced: "1949–present",
    description: "The Shure 520 'Green Bullet' was designed for paging systems but became the other iconic blues harmonica microphone. Its distinctive green color and controlled midrange made it slightly smoother than the JT-30, preferred by some harpists.",
    bluesSignificance: "The Green Bullet became synonymous with blues harmonica alongside the JT-30. Its consistent quality and rugged construction made it a reliable choice for touring musicians.",
    famousUsers: [
      { name: "Big Walter Horton", slug: "big-walter-horton" },
      { name: "Carey Bell", slug: "carey-bell" },
      { name: "Paul Butterfield", slug: "paul-butterfield" }
    ]
  },
  {
    id: "glass-slide",
    name: "Glass Bottleneck Slide",
    category: "other",
    manufacturer: "Various / Handmade",
    yearsProduced: "1900s–present",
    description: "The glass bottleneck slide—often a literal wine or medicine bottle neck—creates the crying, vocal-like tones essential to Delta blues. Players wear it on their pinky or ring finger, sliding along the strings to produce notes between the frets.",
    bluesSignificance: "Slide guitar is fundamental to Delta blues. The technique likely originated from African single-string instruments and was adapted to guitar. Early players used knife blades, bones, or bottle necks—glass slides remain the most common today.",
    famousUsers: [
      { name: "Robert Johnson", slug: "robert-johnson", notes: "Master of slide and fretting combined" },
      { name: "Son House", slug: "son-house", notes: "Powerful, emotional slide style" },
      { name: "Elmore James", slug: "elmore-james", notes: "'King of the Slide Guitar'" },
      { name: "Muddy Waters", slug: "muddy-waters", notes: "Early acoustic recordings featured slide" }
    ]
  }
];

export const getInstrumentById = (id: string): InstrumentHistory | undefined => {
  return instrumentsHistory.find(i => i.id === id);
};

export const getInstrumentsByCategory = (category: InstrumentHistory["category"]): InstrumentHistory[] => {
  return instrumentsHistory.filter(i => i.category === category);
};
