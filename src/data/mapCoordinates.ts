/**
 * Geographic coordinates for blues map markers.
 * Maps artist birthplaces, festival locations, and historical blues journey waypoints.
 */

export interface MapCoordinate {
  lat: number;
  lng: number;
}

// ── Artist birthplace coordinates (keyed by birthPlace text or partial match) ──
export const cityCoordinates: Record<string, MapCoordinate> = {
  // USA – Mississippi Delta
  'clarksdale, mississippi': { lat: 34.2001, lng: -90.5709 },
  'clarksdale': { lat: 34.2001, lng: -90.5709 },
  'itta bena, mississippi': { lat: 33.4951, lng: -90.3187 },
  'indianola, mississippi': { lat: 33.4512, lng: -90.6551 },
  'tutwiler, mississippi': { lat: 33.9790, lng: -90.4312 },
  'rolling fork, mississippi': { lat: 32.9065, lng: -90.8787 },
  'hazlehurst, mississippi': { lat: 31.8603, lng: -90.3965 },
  'lyon, mississippi': { lat: 34.2212, lng: -90.5468 },
  'west point, mississippi': { lat: 33.6076, lng: -88.6503 },
  'stovall, mississippi': { lat: 34.3100, lng: -90.4200 },
  'bolton, mississippi': { lat: 32.3515, lng: -90.4524 },
  'greenwood, mississippi': { lat: 33.5162, lng: -90.1793 },
  'mississippi': { lat: 33.0, lng: -90.0 },
  // USA – Chicago & Illinois
  'chicago, illinois': { lat: 41.8781, lng: -87.6298 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  // USA – Texas
  'dallas, texas': { lat: 32.7767, lng: -96.7970 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'lubbock, texas': { lat: 33.5779, lng: -101.8552 },
  'houston, texas': { lat: 29.7604, lng: -95.3698 },
  'texas': { lat: 31.0, lng: -99.0 },
  'couchman, texas': { lat: 31.5, lng: -97.0 },
  'wortham, texas': { lat: 31.7882, lng: -96.4622 },
  'fort worth, texas': { lat: 32.7555, lng: -97.3308 },
  'austin, texas': { lat: 30.2672, lng: -97.7431 },
  // USA – Louisiana
  'shreveport, louisiana': { lat: 32.5252, lng: -93.7502 },
  'homer, louisiana': { lat: 32.7921, lng: -93.0557 },
  'baton rouge, louisiana': { lat: 30.4583, lng: -91.1403 },
  'vacherie, louisiana': { lat: 30.0060, lng: -90.7268 },
  'louisiana': { lat: 30.5, lng: -91.5 },
  'new orleans, louisiana': { lat: 29.9511, lng: -90.0715 },
  'new orleans': { lat: 29.9511, lng: -90.0715 },
  // USA – Alabama & Tennessee & Georgia
  'tuscumbia, alabama': { lat: 34.7312, lng: -87.7025 },
  'memphis, tennessee': { lat: 35.1495, lng: -90.0490 },
  'memphis': { lat: 35.1495, lng: -90.0490 },
  'chattanooga, tennessee': { lat: 35.0456, lng: -85.3097 },
  'columbus, georgia': { lat: 32.4610, lng: -84.9877 },
  'albany, georgia': { lat: 31.5785, lng: -84.1557 },
  // USA – Other
  'harlem, new york city, new york': { lat: 40.8116, lng: -73.9465 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'ripley, tennessee': { lat: 35.7453, lng: -89.5298 },
  'mooringsport, louisiana': { lat: 32.6913, lng: -93.9627 },
  'marksville, louisiana': { lat: 31.1277, lng: -92.0662 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'los angeles, california': { lat: 34.0522, lng: -118.2437 },
  'ocean springs, mississippi': { lat: 30.4113, lng: -88.8278 },
  'pine bluff, arkansas': { lat: 34.2284, lng: -92.0032 },
  // Canada
  'toronto, ontario': { lat: 43.6532, lng: -79.3832 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'ottawa': { lat: 45.4215, lng: -75.6972 },
  'montreal': { lat: 45.5017, lng: -73.5673 },
  'regina, saskatchewan': { lat: 50.4452, lng: -104.6189 },
  'regina': { lat: 50.4452, lng: -104.6189 },
  'hamilton, ontario': { lat: 43.2557, lng: -79.8711 },
  'hamilton': { lat: 43.2557, lng: -79.8711 },
  'sudbury, ontario': { lat: 46.4917, lng: -80.9930 },
  'sudbury': { lat: 46.4917, lng: -80.9930 },
  'london, ontario': { lat: 42.9849, lng: -81.2453 },
  // Norway
  'oslo, norway': { lat: 59.9139, lng: 10.7522 },
  'oslo': { lat: 59.9139, lng: 10.7522 },
  'hamar, norway': { lat: 60.7945, lng: 11.0680 },
  'hamar': { lat: 60.7945, lng: 11.0680 },
  'telemark, norway': { lat: 59.3900, lng: 8.7500 },
  'telemark': { lat: 59.3900, lng: 8.7500 },
  'notodden': { lat: 59.5600, lng: 9.2600 },
  'hell, trøndelag': { lat: 63.4450, lng: 10.9050 },
  'åndalsnes': { lat: 62.5672, lng: 7.6872 },
  'kongsberg': { lat: 59.6633, lng: 9.6516 },
  'stavanger': { lat: 58.9700, lng: 5.7331 },
  'bergen': { lat: 60.3913, lng: 5.3221 },
  'tromsø': { lat: 69.6492, lng: 18.9553 },
  'trondheim': { lat: 63.4305, lng: 10.3951 },
  // Sweden
  'linköping, sweden': { lat: 58.4108, lng: 15.6214 },
  'linköping': { lat: 58.4108, lng: 15.6214 },
  'umeå': { lat: 63.8258, lng: 20.2630 },
  'stockholm': { lat: 59.3293, lng: 18.0686 },
  'gothenburg': { lat: 57.7089, lng: 11.9746 },
  'malmö': { lat: 55.6050, lng: 13.0038 },
  // Denmark
  'copenhagen': { lat: 55.6761, lng: 12.5683 },
  // Finland
  'kuopio, finland': { lat: 62.8924, lng: 27.6770 },
  'helsinki': { lat: 60.1699, lng: 24.9384 },
  // Iceland
  'reykjavik': { lat: 64.1466, lng: -21.9426 },
  // UK & Ireland
  'macclesfield, cheshire, england': { lat: 53.2587, lng: -2.1252 },
  'macclesfield': { lat: 53.2587, lng: -2.1252 },
  'ballyshannon, county donegal, ireland': { lat: 54.5022, lng: -8.1883 },
  'ballyshannon': { lat: 54.5022, lng: -8.1883 },
  'belfast, northern ireland': { lat: 54.5973, lng: -5.9301 },
  'belfast': { lat: 54.5973, lng: -5.9301 },
  'catford, london, england': { lat: 51.4438, lng: -0.0234 },
  'catford': { lat: 51.4438, lng: -0.0234 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'wednesbury, west midlands, england': { lat: 52.5640, lng: -2.0196 },
  'wednesbury': { lat: 52.5640, lng: -2.0196 },
  'herefordshire, england': { lat: 52.0765, lng: -2.6544 },
  'herefordshire': { lat: 52.0765, lng: -2.6544 },
  'bristol, england': { lat: 51.4545, lng: -2.5879 },
  'bristol': { lat: 51.4545, lng: -2.5879 },
  'essex, england': { lat: 51.7343, lng: 0.4691 },
  'essex': { lat: 51.7343, lng: 0.4691 },
  'blyth, northumberland, england': { lat: 55.1264, lng: -1.5083 },
  'blyth': { lat: 55.1264, lng: -1.5083 },
  'ripley, surrey, england': { lat: 51.2955, lng: -0.4893 },
  'colne, lancashire, england': { lat: 53.8578, lng: -2.1783 },
  'colne': { lat: 53.8578, lng: -2.1783 },
  'edinburgh': { lat: 55.9533, lng: -3.1883 },
  'bacup, lancashire, england': { lat: 53.7020, lng: -2.1994 },
  'bacup': { lat: 53.7020, lng: -2.1994 },
  // Netherlands
  'assen, drenthe, netherlands': { lat: 52.9929, lng: 6.5642 },
  'assen': { lat: 52.9929, lng: 6.5642 },
  'grolloo': { lat: 52.9325, lng: 6.6543 },
  'ospel': { lat: 51.2900, lng: 5.7700 },
  // Germany
  'hamburg, germany': { lat: 53.5511, lng: 9.9937 },
  'hamburg': { lat: 53.5511, lng: 9.9937 },
  // France
  'argenteuil, val-d\'oise, france': { lat: 48.9472, lng: 2.2467 },
  'argenteuil': { lat: 48.9472, lng: 2.2467 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'cahors': { lat: 44.4478, lng: 1.4408 },
  // Italy
  'milan, lombardy, italy': { lat: 45.4642, lng: 9.1900 },
  'milan': { lat: 45.4642, lng: 9.1900 },
  'porretta terme': { lat: 44.1589, lng: 10.9810 },
  // Poland
  'katowice': { lat: 50.2649, lng: 19.0238 },
  'katowice, poland': { lat: 50.2649, lng: 19.0238 },
  'wrocław, poland': { lat: 51.1079, lng: 17.0385 },
  'wrocław': { lat: 51.1079, lng: 17.0385 },
  // Czech Republic
  'šumperk': { lat: 49.9658, lng: 16.9716 },
  'šumperk, czech republic': { lat: 49.9658, lng: 16.9716 },
  'prague': { lat: 50.0755, lng: 14.4378 },
  // Switzerland
  'lucerne': { lat: 47.0502, lng: 8.3093 },
  'crissier': { lat: 46.5454, lng: 6.5790 },
  // Belgium
  'peer': { lat: 51.1315, lng: 5.4590 },
  'peer, belgium': { lat: 51.1315, lng: 5.4590 },

  // ── South Africa ──
  'mamelodi, pretoria, south africa': { lat: -25.7200, lng: 28.3985 },
  'mamelodi': { lat: -25.7200, lng: 28.3985 },
  'pretoria': { lat: -25.7461, lng: 28.1881 },
  'johannesburg, south africa': { lat: -26.2041, lng: 28.0473 },
  'johannesburg': { lat: -26.2041, lng: 28.0473 },
  'ermelo, mpumalanga, south africa': { lat: -26.5280, lng: 29.9860 },
  'ermelo': { lat: -26.5280, lng: 29.9860 },
  'kwa-guqa, witbank, south africa': { lat: -25.8700, lng: 29.2200 },
  'kwa-guqa': { lat: -25.8700, lng: 29.2200 },
  'witbank': { lat: -25.8700, lng: 29.2200 },
  'cape town': { lat: -33.9249, lng: 18.4241 },
  'durban': { lat: -29.8587, lng: 31.0218 },
  'south africa': { lat: -30.5595, lng: 22.9375 },
  'bacup, lancashire, england (raised in south africa)': { lat: -26.2041, lng: 28.0473 }, // Map Johnny Clegg to Jo'burg where he grew up

  // ── Australia & New Zealand ──
  'huapai, auckland, new zealand (based in australia)': { lat: -36.7747, lng: 174.5433 },
  'huapai': { lat: -36.7747, lng: 174.5433 },
  'auckland': { lat: -36.8485, lng: 174.7633 },
  'melbourne, victoria, australia': { lat: -37.8136, lng: 144.9631 },
  'melbourne': { lat: -37.8136, lng: 144.9631 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'byron bay': { lat: -28.6437, lng: 153.6120 },
  'brisbane': { lat: -27.4698, lng: 153.0251 },
  'perth': { lat: -31.9505, lng: 115.8605 },

  // ── West Africa ──
  'accra': { lat: 5.6037, lng: -0.1870 },
  'lagos': { lat: 6.5244, lng: 3.3792 },
  'dakar': { lat: 14.7167, lng: -17.4677 },
  'bamako': { lat: 12.6392, lng: -8.0029 },

  // Fallback regions
  'norway': { lat: 61.0, lng: 9.0 },
  'sweden': { lat: 62.0, lng: 15.0 },
  'denmark': { lat: 56.0, lng: 10.0 },
  'finland': { lat: 64.0, lng: 26.0 },
  'england': { lat: 52.0, lng: -1.0 },
  'ireland': { lat: 53.0, lng: -8.0 },
  'germany': { lat: 51.0, lng: 10.0 },
  'france': { lat: 46.0, lng: 2.0 },
  'italy': { lat: 42.0, lng: 12.0 },
  'netherlands': { lat: 52.0, lng: 5.0 },
  'poland': { lat: 52.0, lng: 20.0 },
  'usa': { lat: 38.0, lng: -97.0 },
  'canada': { lat: 56.0, lng: -106.0 },
  'australia': { lat: -25.0, lng: 134.0 },
  'new zealand': { lat: -40.9006, lng: 174.8860 },
};

/**
 * Look up coordinates for a birthPlace string.
 * Tries exact match first, then progressively shorter substrings.
 */
export function getCoordinatesForPlace(birthPlace: string): MapCoordinate | null {
  const normalized = birthPlace.toLowerCase().trim();

  // Exact match
  if (cityCoordinates[normalized]) return cityCoordinates[normalized];

  // Try each comma-separated part from left to right
  const parts = normalized.split(',').map(p => p.trim());
  for (let i = 0; i < parts.length; i++) {
    const sub = parts.slice(i).join(', ');
    if (cityCoordinates[sub]) return cityCoordinates[sub];
  }

  // Try individual parts
  for (const part of parts) {
    if (cityCoordinates[part]) return cityCoordinates[part];
  }

  return null;
}

// ── Festival coordinates ──
export const festivalCoordinates: Record<string, MapCoordinate> = {
  'notodden-blues-festival': { lat: 59.5600, lng: 9.2600 },
  'hell-blues-festival': { lat: 63.4450, lng: 10.9050 },
  'raumarock-blues': { lat: 62.5672, lng: 7.6872 },
  'kongsberg-jazzfestival': { lat: 59.6633, lng: 9.6516 },
  'peer-blues-festival': { lat: 51.1315, lng: 5.4590 },
  'rawa-blues-festival': { lat: 50.2649, lng: 19.0238 },
  'lucerne-blues-festival': { lat: 47.0502, lng: 8.3093 },
  'porretta-soul-festival': { lat: 44.1589, lng: 10.9810 },
  'blues-rules-crissier': { lat: 46.5454, lng: 6.5790 },
  'blues-alive-sumperk': { lat: 49.9658, lng: 16.9716 },
  'cahors-blues-festival': { lat: 44.4478, lng: 1.4408 },
  'moulin-blues-festival': { lat: 51.2900, lng: 5.7700 },
  'grolloo-blues-festival': { lat: 52.9325, lng: 6.6543 },
  'copenhagen-blues-festival': { lat: 55.6761, lng: 12.5683 },
  'umea-blues-festival': { lat: 63.8258, lng: 20.2630 },
  'chicago-blues-festival': { lat: 41.8781, lng: -87.6298 },
  'king-biscuit-blues-festival': { lat: 34.5470, lng: -91.0068 },
  'mississippi-delta-blues-festival': { lat: 33.5162, lng: -90.1793 },
  'juke-joint-festival': { lat: 34.2001, lng: -90.5709 },
  'great-british-rhythm-blues-festival': { lat: 51.2955, lng: -0.4893 },
  'edinburgh-blues-festival': { lat: 55.9533, lng: -3.1883 },
  'ottawa-bluesfest': { lat: 45.4215, lng: -75.6972 },
  'montreal-jazz-festival': { lat: 45.5017, lng: -73.5673 },
  'bluesfest-byron-bay': { lat: -28.6437, lng: 153.6120 },
};

// ── Historical Blues Journey waypoints ──
export interface HistoricalWaypoint {
  id: string;
  lat: number;
  lng: number;
  year: string;
  labelEn: string;
  labelNo: string;
  descriptionEn: string;
  descriptionNo: string;
}

export const bluesJourneyWaypoints: HistoricalWaypoint[] = [
  {
    id: 'west-africa',
    lat: 7.5, lng: -2.0,
    year: '1600s–1800s',
    labelEn: 'West Africa – The Roots',
    labelNo: 'Vest-Afrika – Røttene',
    descriptionEn: 'Work songs, field hollers, and musical traditions brought by enslaved Africans form the deepest roots of the blues.',
    descriptionNo: 'Arbeidssanger, rop fra åkrene og musikalske tradisjoner brakt av slaver fra Afrika utgjør bluesens dypeste røtter.',
  },
  {
    id: 'mississippi-delta',
    lat: 33.5, lng: -90.5,
    year: '1890s–1930s',
    labelEn: 'Mississippi Delta – The Birthplace',
    labelNo: 'Mississippi-deltaet – Fødestedet',
    descriptionEn: 'The cotton fields and juke joints of the Mississippi Delta gave birth to the blues. Robert Johnson, Charley Patton, and Son House defined the raw Delta sound.',
    descriptionNo: 'Bomullsåkrene og jukejointene i Mississippi-deltaet fødte bluesen. Robert Johnson, Charley Patton og Son House definerte den rå Delta-lyden.',
  },
  {
    id: 'memphis',
    lat: 35.15, lng: -90.05,
    year: '1910s–1950s',
    labelEn: 'Memphis – Beale Street',
    labelNo: 'Memphis – Beale Street',
    descriptionEn: 'Memphis became a blues hub along Beale Street. W.C. Handy published the first blues sheet music here in 1912.',
    descriptionNo: 'Memphis ble et bluessenter langs Beale Street. W.C. Handy publiserte det første trykte bluesnoteark her i 1912.',
  },
  {
    id: 'chicago',
    lat: 41.88, lng: -87.63,
    year: '1940s–1960s',
    labelEn: 'Chicago – Electric Blues',
    labelNo: 'Chicago – Elektrisk Blues',
    descriptionEn: 'The Great Migration brought blues north. Muddy Waters, Howlin\' Wolf, and Willie Dixon electrified the sound on Chess Records, creating Chicago Blues.',
    descriptionNo: 'Den store migrasjonen brakte bluesen nordover. Muddy Waters, Howlin\' Wolf og Willie Dixon elektrifiserte lyden på Chess Records og skapte Chicago Blues.',
  },
  {
    id: 'texas',
    lat: 31.0, lng: -99.0,
    year: '1920s–1970s',
    labelEn: 'Texas – Lone Star Blues',
    labelNo: 'Texas – Lone Star Blues',
    descriptionEn: 'Texas developed its own blues tradition: from Blind Lemon Jefferson to Stevie Ray Vaughan, mixing blues with jazz and rock.',
    descriptionNo: 'Texas utviklet sin egen bluestradisjon: fra Blind Lemon Jefferson til Stevie Ray Vaughan, med blanding av blues, jazz og rock.',
  },
  {
    id: 'london',
    lat: 51.51, lng: -0.13,
    year: '1960s',
    labelEn: 'London – British Blues Boom',
    labelNo: 'London – Britisk bluesbølge',
    descriptionEn: 'British musicians like John Mayall, Eric Clapton, and the Rolling Stones re-interpreted American blues and brought it to a global audience.',
    descriptionNo: 'Britiske musikere som John Mayall, Eric Clapton og Rolling Stones nytolket amerikansk blues og brakte den til et globalt publikum.',
  },
  {
    id: 'scandinavia',
    lat: 60.5, lng: 10.5,
    year: '1970s–present',
    labelEn: 'Scandinavia – Nordic Blues',
    labelNo: 'Skandinavia – Nordisk Blues',
    descriptionEn: 'From the 1970s onward, Scandinavia developed a thriving blues scene with artists like Knut Reiersrud, Vidar Busk, and Erja Lyytinen.',
    descriptionNo: 'Fra 1970-tallet og utover utviklet Skandinavia en blomstrende bluesscene med artister som Knut Reiersrud, Vidar Busk og Erja Lyytinen.',
  },
  {
    id: 'europe-continent',
    lat: 50.0, lng: 10.0,
    year: '1960s–present',
    labelEn: 'Continental Europe – Blues Spreads',
    labelNo: 'Kontinental-Europa – Bluesen sprer seg',
    descriptionEn: 'Blues festivals and artists emerged across the continent: from Poland\'s Rawa Blues to France\'s Bill Deraime and the Netherlands\' Cuby + Blizzards.',
    descriptionNo: 'Bluesfestivaler og artister dukket opp over hele kontinentet: fra Polens Rawa Blues til Frankrikes Bill Deraime og Nederlands Cuby + Blizzards.',
  },
  {
    id: 'south-africa',
    lat: -26.2, lng: 28.0,
    year: '1960s–present',
    labelEn: 'South Africa – Blues Returns to Africa',
    labelNo: 'Sør-Afrika – Bluesen vender hjem',
    descriptionEn: 'South African artists like Hugh Masekela, Johnny Clegg, and Dan Patlansky brought the blues full circle — from Africa to America and back. Township jive, jazz, and blues merged into a uniquely African sound.',
    descriptionNo: 'Sørafrikanske artister som Hugh Masekela, Johnny Clegg og Dan Patlansky brakte bluesen full sirkel — fra Afrika til Amerika og tilbake. Township-jive, jazz og blues ble til en unikt afrikansk lyd.',
  },
  {
    id: 'australia',
    lat: -37.8, lng: 144.9,
    year: '1970s–present',
    labelEn: 'Australia – Blues Down Under',
    labelNo: 'Australia – Blues på andre siden av kloden',
    descriptionEn: 'Australia developed a vibrant blues scene from the 1970s onward. Artists like Kevin Borich, Jeff Lang, and Lloyd Spiegel brought Delta and Chicago blues traditions to the Southern Hemisphere.',
    descriptionNo: 'Australia utviklet en livlig bluesscene fra 1970-tallet. Artister som Kevin Borich, Jeff Lang og Lloyd Spiegel brakte Delta- og Chicago-bluestradisjoner til den sørlige halvkule.',
  },
];

// ── Blues News / Breaking News items ──
export interface BluesNewsItem {
  id: string;
  lat: number;
  lng: number;
  titleEn: string;
  titleNo: string;
  summaryEn: string;
  summaryNo: string;
  date: string;
  category: 'festival' | 'artist' | 'album' | 'tour' | 'award' | 'obituary';
  linkPath?: string; // Internal link to read more
}

export const bluesNewsItems: BluesNewsItem[] = [
  {
    id: 'grammy-blues-2026',
    lat: 34.0522, lng: -118.2437, // Los Angeles
    titleEn: 'Grammy 2026 – Blues Categories Announced',
    titleNo: 'Grammy 2026 – Blues-kategoriene kunngjort',
    summaryEn: 'The Grammy Awards 2026 nominees for Best Traditional and Contemporary Blues Album have been announced. Buddy Guy receives a Lifetime Achievement Grammy.',
    summaryNo: 'Grammy Awards 2026-nominasjonene for Beste Tradisjonelle og Samtidige Blues Album er kunngjort. Buddy Guy mottar en Livstidsprestasjon-Grammy.',
    date: '2026-02-03',
    category: 'award',
    linkPath: '/blog/buddy-guys-last-grammy-february-2026',
  },
  {
    id: 'notodden-2026-lineup',
    lat: 59.5600, lng: 9.2600,
    titleEn: 'Notodden Blues Festival 2026 – First Acts Revealed',
    titleNo: 'Notodden Blues Festival 2026 – Første artister avslørt',
    summaryEn: 'Notodden Blues Festival has announced the first headliners for August 2026, promising another world-class lineup in Norway\'s blues capital.',
    summaryNo: 'Notodden Blues Festival har avslørt de første headlinerne for august 2026, og lover nok en verdensklasseoppstilling i Norges blueshovedstad.',
    date: '2026-02-01',
    category: 'festival',
    linkPath: '/blues-festivals/notodden-blues-festival',
  },
  {
    id: 'kingfish-europe-tour-2026',
    lat: 48.8566, lng: 2.3522, // Paris
    titleEn: 'Christone "Kingfish" Ingram Announces European Tour 2026',
    titleNo: 'Christone "Kingfish" Ingram kunngjør Europaturné 2026',
    summaryEn: 'The young blues guitar sensation will play 20 shows across Europe in spring 2026, including dates in Norway, Sweden, and the UK.',
    summaryNo: 'Den unge bluesgitarsensasjonen skal spille 20 konserter over hele Europa våren 2026, inkludert datoer i Norge, Sverige og Storbritannia.',
    date: '2026-01-28',
    category: 'tour',
    linkPath: '/artists/christone-kingfish-ingram',
  },
  {
    id: 'chicago-blues-fest-2026',
    lat: 41.8781, lng: -87.6298,
    titleEn: 'Chicago Blues Festival 2026 – Dates Set for June',
    titleNo: 'Chicago Blues Festival 2026 – Datoer satt for juni',
    summaryEn: 'The world\'s largest free blues festival returns to Millennium Park in June 2026 with a lineup celebrating the legacy of Chicago Blues.',
    summaryNo: 'Verdens største gratis bluesfestival er tilbake i Millennium Park i juni 2026 med et program som feirer arven fra Chicago Blues.',
    date: '2026-01-20',
    category: 'festival',
    linkPath: '/blues-festivals/chicago-blues-festival',
  },
  {
    id: 'erja-new-album-2026',
    lat: 62.8924, lng: 27.6770, // Kuopio
    titleEn: 'Erja Lyytinen – New Album "Northern Light" Out March 2026',
    titleNo: 'Erja Lyytinen – Nytt album "Northern Light" ute mars 2026',
    summaryEn: 'Finnish blues guitar queen Erja Lyytinen releases her new album "Northern Light", exploring the connection between Nordic melancholy and Delta blues.',
    summaryNo: 'Finsk bluegitardronning Erja Lyytinen slipper sitt nye album "Northern Light", og utforsker forbindelsen mellom nordisk melankoli og Delta-blues.',
    date: '2026-01-15',
    category: 'album',
    linkPath: '/scandinavian-blues/erja-lyytinen',
  },
  {
    id: 'dan-patlansky-tour-2026',
    lat: -26.2041, lng: 28.0473,
    titleEn: 'Dan Patlansky Announces UK & Europe Tour 2026',
    titleNo: 'Dan Patlansky kunngjør Storbritannia og Europa-turné 2026',
    summaryEn: 'South Africa\'s premier blues-rock guitarist Dan Patlansky will tour the UK and Europe in summer 2026, following the success of "Shelter of Bones."',
    summaryNo: 'Sør-Afrikas fremste bluesrock-gitarist Dan Patlansky turnerer Storbritannia og Europa sommeren 2026, etter suksessen med "Shelter of Bones."',
    date: '2026-02-10',
    category: 'tour',
    linkPath: '/african-blues/dan-patlansky',
  },
  {
    id: 'bluesfest-byron-bay-2026',
    lat: -28.6437, lng: 153.6120,
    titleEn: 'Bluesfest Byron Bay 2026 – Lineup Announced',
    titleNo: 'Bluesfest Byron Bay 2026 – Programmet klart',
    summaryEn: 'Australia\'s premier blues and roots festival reveals its 2026 Easter lineup, featuring international and Australian blues artists.',
    summaryNo: 'Australias fremste blues- og rootsfestival avslører påskeprogrammet for 2026, med internasjonale og australske bluesartister.',
    date: '2026-02-05',
    category: 'festival',
    linkPath: '/blues-festivals/bluesfest-byron-bay',
  },
];
