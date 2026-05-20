export interface KeyPerson {
  name: string;
  roleEn: string;
  roleNo: string;
}

export interface UpsAndDowns {
  upsEn: string[];
  upsNo: string[];
  downsEn: string[];
  downsNo: string[];
}

export interface YouTubeHighlight {
  videoId: string;
  year: number;
  titleEn: string;
  titleNo: string;
  descriptionEn: string;
  descriptionNo: string;
  artistName?: string;
  artistSlug?: string; // Full path like /artists/b-b-king or /scandinavian-blues/knut-reiersrud
}

export interface BluesFestival {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  city: string;
  region: 'norway' | 'scandinavia' | 'europe' | 'usa' | 'canada';
  dates: string;
  websiteUrl?: string;
  ticketUrl?: string;
  descriptionEn: string;
  descriptionNo: string;
  historyEn: string;
  historyNo: string;
  upsAndDowns: UpsAndDowns;
  keyPeople: KeyPerson[];
  headliners: string[];
  youtubeHighlights: YouTubeHighlight[];
  established?: number;
  active: boolean;
}

export const bluesFestivals: BluesFestival[] = [
  // ── Norway ─────────────────────────────────────────────
  {
    id: 'notodden-blues-festival',
    name: 'Notodden Blues Festival',
    country: 'Norway',
    countryFlag: '🇳🇴',
    city: 'Notodden',
    region: 'norway',
    dates: 'August (annually)',
    websiteUrl: 'https://www.bluesfest.no/',
    descriptionEn: 'One of Europe\'s largest and most prestigious blues festivals, held annually in the small Norwegian town of Notodden since 1988.',
    descriptionNo: 'En av Europas største og mest prestisjefylte bluesfestivaler, avholdt årlig i den lille norske byen Notodden siden 1988.',
    historyEn: 'Founded in 1988 by 13 blues enthusiasts in Notodden, a town facing economic depression after the closure of its hydroelectric industry. What started with a small loan and 500 attendees grew into Europe\'s largest blues festival, attracting over 20,000 visitors annually and revitalizing the local economy. The festival emphasizes blues heritage with events like the Bluestrail walking tour and has become a pilgrimage for blues fans worldwide.',
    historyNo: 'Grunnlagt i 1988 av 13 bluesentusiaster i Notodden, en by som opplevde økonomisk nedgang etter nedleggelsen av den hydroelektriske industrien. Det som startet med et lite lån og 500 deltakere vokste til Europas største bluesfestival, med over 20 000 besøkende årlig. Festivalen legger vekt på bluesarv med arrangementer som Bluestrail-vandringen og har blitt et pilegrimsmål for bluesfans over hele verden.',
    upsAndDowns: {
      upsEn: [
        'Grew from 500 attendees in 1988 to over 20,000 – one of Europe\'s biggest blues events',
        'Saved the town of Notodden culturally and economically after industrial decline',
        'Hosted legends like B.B. King, Buddy Guy, Bonnie Raitt and Robert Cray',
      ],
      upsNo: [
        'Vokste fra 500 deltakere i 1988 til over 20 000 – en av Europas største bluesbegivenheter',
        'Reddet byen Notodden kulturelt og økonomisk etter industriell nedgang',
        'Har hatt legender som B.B. King, Buddy Guy, Bonnie Raitt og Robert Cray',
      ],
      downsEn: [
        'Economic challenges in early years; started with a small loan and uncertain future',
        'Occasional licensing and logistical issues as the festival scaled up',
      ],
      downsNo: [
        'Økonomiske utfordringer i de tidlige årene; startet med et lite lån og usikker fremtid',
        'Tidvise lisens- og logistikkproblemer etter hvert som festivalen vokste',
      ],
    },
    keyPeople: [
      { name: 'Jostein Forsberg', roleEn: 'Festival director since 1990; musician and former steel worker', roleNo: 'Festivaldirektør siden 1990; musiker og tidligere stålarbeider' },
      { name: 'Little Steven', roleEn: 'Long-time supporter, performer and international ambassador', roleNo: 'Langvarig støttespiller, utøver og internasjonal ambassadør' },
      { name: 'Harry Muskee', roleEn: 'Early influence via Cuby & the Blizzards; helped shape the festival\'s identity', roleNo: 'Tidlig innflytelse via Cuby & the Blizzards; hjalp til med å forme festivalens identitet' },
    ],
    headliners: ['B.B. King', 'Buddy Guy', 'Robert Cray', 'Joe Bonamassa', 'Bonnie Raitt'],
    youtubeHighlights: [
      { videoId: 'e2Uc5pkQ5ZU', year: 2019, titleEn: 'Notodden Blues Festival 2019 Highlights', titleNo: 'Notodden Blues Festival 2019 – Høydepunkter', descriptionEn: 'Highlights from the 2019 edition of Europe\'s largest blues festival.', descriptionNo: 'Høydepunkter fra 2019-utgaven av Europas største bluesfestival.' },
      { videoId: 'ai6EiygzkJ4', year: 2017, titleEn: 'Notodden Blues Festival 2017 – Live Moments', titleNo: 'Notodden Blues Festival 2017 – Live øyeblikk', descriptionEn: 'Memorable live moments from the 30th anniversary edition.', descriptionNo: 'Minneverdige live-øyeblikk fra 30-årsjubileumsutgaven.' },
    ],
    established: 1988,
    active: true,
  },
  {
    id: 'hell-blues-festival',
    name: 'Hell Blues Festival',
    country: 'Norway',
    countryFlag: '🇳🇴',
    city: 'Hell, Trøndelag',
    region: 'norway',
    dates: 'September (annually)',
    websiteUrl: 'https://www.hellbluesfestival.no/',
    descriptionEn: 'A beloved Norwegian blues festival held in the charmingly named village of Hell in Trøndelag, known for its intimate atmosphere and world-class acts.',
    descriptionNo: 'En kjær norsk bluesfestival holdt i den sjarmerende navngitte bygda Hell i Trøndelag, kjent for sin intime atmosfære og artister i verdensklasse.',
    historyEn: 'Started in 1992 as a hotel festival near Trondheim, Hell Blues Festival evolved into a major event at the Scandic Hell Hotel. Known for its intimate settings and world-class blues acts, the festival celebrated its 25th anniversary in 2016. The charmingly named location has become a unique selling point, attracting international attention.',
    historyNo: 'Startet i 1992 som en hotellfestival nær Trondheim, og Hell Blues Festival utviklet seg til et stort arrangement på Scandic Hell Hotel. Kjent for sitt intime miljø og artister i verdensklasse, feiret festivalen sitt 25-årsjubileum i 2016. Det sjarmerende stedsnavnet har blitt et unikt salgsargument som tiltrekker internasjonal oppmerksomhet.',
    upsAndDowns: {
      upsEn: [
        'Consistent quality lineups with legends like Delbert McClinton and Johnny Winter',
        'Strong community support and loyal fanbase across Scandinavia',
        'Celebrated 25th anniversary in 2016 with special programming',
      ],
      upsNo: [
        'Konsekvent kvalitetsartister med legender som Delbert McClinton og Johnny Winter',
        'Sterk støtte fra lokalsamfunnet og lojal fanskare over hele Skandinavia',
        'Feiret 25-årsjubileum i 2016 med spesialprogrammering',
      ],
      downsEn: [
        'Weather issues during outdoor-stage years',
        'Venue changes and capacity limitations at the hotel setting',
      ],
      downsNo: [
        'Værproblemer under utendørssceneårene',
        'Endringer i spillested og kapasitetsbegrensninger ved hotelloppsettet',
      ],
    },
    keyPeople: [
      { name: 'Reidar Larsen', roleEn: 'Early performer and supporter of the festival', roleNo: 'Tidlig utøver og støttespiller for festivalen' },
      { name: 'Arne Skage', roleEn: 'Early performer and organizer from the founding years', roleNo: 'Tidlig utøver og arrangør fra grunnleggingsårene' },
    ],
    headliners: ['Knut Reiersrud', 'Vidar Busk', 'Amund Maarud', 'Delbert McClinton', 'Johnny Winter'],
    youtubeHighlights: [],
    established: 1992,
    active: true,
  },
  {
    id: 'raumarock-blues',
    name: 'Raumarock Blues',
    country: 'Norway',
    countryFlag: '🇳🇴',
    city: 'Åndalsnes',
    region: 'norway',
    dates: 'June (annually)',
    descriptionEn: 'A roots and blues festival set against the spectacular backdrop of the Romsdalen valley in western Norway.',
    descriptionNo: 'En roots- og bluesfestival satt mot det spektakulære bakteppet av Romsdalen i Vestland.',
    historyEn: 'Founded in 1996 in Åndalsnes, Raumarock started as a pure blues and rock festival. It evolved over the years to include broader genres but maintained its blues roots. Set against the stunning fjord landscape of Romsdalen, it became part of Norway\'s vibrant festival scene emphasizing local talent alongside international acts.',
    historyNo: 'Grunnlagt i 1996 i Åndalsnes, startet Raumarock som en ren blues- og rockfestival. Den utviklet seg over årene til å inkludere bredere sjangre, men beholdt sine bluesrøtter. Satt mot det fantastiske fjordlandskapet i Romsdalen, ble den en del av Norges livlige festivalscene med vekt på lokalt talent sammen med internasjonale artister.',
    upsAndDowns: {
      upsEn: [
        'Spectacular fjord location – one of Norway\'s most scenic festival settings',
        'Attracted big names and diverse audiences during its peak years',
      ],
      upsNo: [
        'Spektakulær fjordlokasjon – en av Norges mest naturskjønne festivalsteder',
        'Tiltrakk seg store navn og mangfoldig publikum i toppårene',
      ],
      downsEn: [
        'Gradual shift from pure blues to broader genres',
        'Competition from larger Norwegian festivals',
      ],
      downsNo: [
        'Gradvis skifte fra ren blues til bredere sjangre',
        'Konkurranse fra større norske festivaler',
      ],
    },
    keyPeople: [
      { name: 'Local organizers in Åndalsnes', roleEn: 'Founding committee from the Rauma region', roleNo: 'Grunnleggingskomité fra Rauma-regionen' },
    ],
    headliners: ['Rita Engedalen', 'Erja Lyytinen'],
    youtubeHighlights: [],
    established: 1996,
    active: true,
  },
  {
    id: 'kongsberg-jazzfestival',
    name: 'Kongsberg Jazzfestival',
    country: 'Norway',
    countryFlag: '🇳🇴',
    city: 'Kongsberg',
    region: 'norway',
    dates: 'July (annually)',
    websiteUrl: 'https://www.telemarkfestivalen.no/',
    descriptionEn: 'One of Norway\'s oldest music festivals, featuring jazz and blues since 1964. The blues program has grown significantly in recent years.',
    descriptionNo: 'En av Norges eldste musikkfestivaler, med jazz og blues siden 1964. Bluesprogrammet har vokst betydelig de siste årene.',
    historyEn: 'Founded in 1964 by jazz enthusiasts, Kongsberg Jazzfestival is one of the oldest jazz festivals in Europe. Blues was incorporated early on, reflecting the deep connection between jazz and blues. Over 60 years, it grew into one of Europe\'s major music festivals with dedicated blues stages that have hosted legends like B.B. King, Stevie Wonder and Herbie Hancock.',
    historyNo: 'Grunnlagt i 1964 av jazentusiaster, er Kongsberg Jazzfestival en av de eldste jazzfestivalene i Europa. Blues ble inkludert tidlig, noe som gjenspeiler den dype forbindelsen mellom jazz og blues. Over 60 år har den vokst til en av Europas store musikkfestivaler med dedikerte bluesscener som har hatt legender som B.B. King, Stevie Wonder og Herbie Hancock.',
    upsAndDowns: {
      upsEn: [
        'Over 60 years of continuous success – one of Europe\'s oldest music festivals',
        'Hosted Stevie Wonder, Herbie Hancock, B.B. King and other global legends',
      ],
      upsNo: [
        'Over 60 år med kontinuerlig suksess – en av Europas eldste musikkfestivaler',
        'Har hatt Stevie Wonder, Herbie Hancock, B.B. King og andre globale legender',
      ],
      downsEn: [
        'Venue changes over the decades',
        'Competition from pure blues festivals for the blues audience',
      ],
      downsNo: [
        'Endringer i spillested gjennom tiårene',
        'Konkurranse fra rene bluesfestivaler om bluespublikummet',
      ],
    },
    keyPeople: [
      { name: 'Jakob Zimmerli', roleEn: 'Long-time festival director', roleNo: 'Langvarig festivaldirektør' },
    ],
    headliners: ['Keb\' Mo\'', 'Taj Mahal', 'Knut Reiersrud', 'B.B. King'],
    youtubeHighlights: [],
    established: 1964,
    active: true,
  },

  // ── Europe ─────────────────────────────────────────────
  {
    id: 'peer-blues-festival',
    name: 'Blues Peer',
    country: 'Belgium',
    countryFlag: '🇧🇪',
    city: 'Peer',
    region: 'europe',
    dates: 'July (annually)',
    websiteUrl: 'https://www.bluespeer.be/',
    descriptionEn: 'Belgium\'s largest blues festival, started in 1985 as the Belgium Rhythm & Blues Festival. Celebrating its 40th anniversary in 2025.',
    descriptionNo: 'Belgias største bluesfestival, startet i 1985 som Belgium Rhythm & Blues Festival. Feirer 40-årsjubileum i 2025.',
    historyEn: 'Started in 1985 as the Belgium Rhythm & Blues Festival, it was renamed Blues Peer in the 2000s. From humble beginnings, it grew to become one of Europe\'s largest blues festivals, celebrating its 40th anniversary in 2025. The festival has hosted legends like Bo Diddley and Solomon Burke and overcame financial difficulties in the early 2000s.',
    historyNo: 'Startet i 1985 som Belgium Rhythm & Blues Festival, og ble omdøpt til Blues Peer på 2000-tallet. Fra en beskjeden start vokste den til å bli en av Europas største bluesfestivaler, og feirer 40-årsjubileum i 2025. Festivalen har hatt legender som Bo Diddley og Solomon Burke og overkom økonomiske vanskeligheter tidlig på 2000-tallet.',
    upsAndDowns: {
      upsEn: [
        'Hosted legends like Bo Diddley, Solomon Burke and Robert Cray',
        'Overcame bankruptcy threats in the early 2000s and came back stronger',
        'Celebrating 40th anniversary in 2025',
      ],
      upsNo: [
        'Har hatt legender som Bo Diddley, Solomon Burke og Robert Cray',
        'Overkom konkursfare tidlig på 2000-tallet og kom tilbake sterkere',
        'Feirer 40-årsjubileum i 2025',
      ],
      downsEn: [
        'Financial struggles in the early 2000s threatened the festival\'s existence',
        'Licensing issues during the rebranding period',
      ],
      downsNo: [
        'Økonomiske problemer tidlig på 2000-tallet truet festivalens eksistens',
        'Lisensproblemer under omdøpingsperioden',
      ],
    },
    keyPeople: [
      { name: 'Bo Diddley', roleEn: 'Early headliner who helped put the festival on the map', roleNo: 'Tidlig hovedartist som hjalp festivalen å bli kjent' },
    ],
    headliners: ['Robert Cray', 'Buddy Guy', 'Beth Hart', 'Joe Bonamassa', 'Bo Diddley', 'Solomon Burke'],
    youtubeHighlights: [
      { videoId: 'xkabdae52MM', year: 2017, titleEn: 'The Bros. Landreth – Full Concert at Blues Peer', titleNo: 'The Bros. Landreth – Hel konsert på Blues Peer', descriptionEn: 'Full concert by the Canadian blues-rock band at Blues Peer in Belgium.', descriptionNo: 'Hel konsert av det kanadiske blues-rock bandet på Blues Peer i Belgia.' },
    ],
    established: 1985,
    active: true,
  },
  {
    id: 'rawa-blues-festival',
    name: 'Rawa Blues Festival',
    country: 'Poland',
    countryFlag: '🇵🇱',
    city: 'Katowice',
    region: 'europe',
    dates: 'October (annually)',
    websiteUrl: 'https://www.rawablues.com/',
    descriptionEn: 'The world\'s largest indoor blues festival, held in Katowice\'s Spodek arena since 1981. A legendary event in European blues.',
    descriptionNo: 'Verdens største innendørs bluesfestival, avholdt i Katowices Spodek-arena siden 1981. En legendarisk begivenhet i europeisk blues.',
    historyEn: 'Founded in 1981 by blues guitarist Ireneusz "Irek" Dudek during the Solidarity era in Poland. What started with Polish bands and around 500 attendees expanded to international acts in the 1990s. It fills Katowice\'s iconic Spodek arena with thousands of fans each October. The festival has been honored by the Blues Foundation and has hosted virtually every major blues artist of the last four decades.',
    historyNo: 'Grunnlagt i 1981 av bluesgitaristen Ireneusz "Irek" Dudek under Solidaritet-æraen i Polen. Det som startet med polske band og rundt 500 deltakere utvidet seg til internasjonale artister på 1990-tallet. Den fyller Katowices ikoniske Spodek-arena med tusenvis av fans hver oktober. Festivalen har blitt hedret av Blues Foundation.',
    upsAndDowns: {
      upsEn: [
        'Grew from 500 to over 5,000 attendees – world\'s largest indoor blues festival',
        'Honored by the Blues Foundation for its contribution to blues culture',
        'Hosted virtually every major blues artist of the last four decades',
      ],
      upsNo: [
        'Vokste fra 500 til over 5000 deltakere – verdens største innendørs bluesfestival',
        'Hedret av Blues Foundation for sitt bidrag til blueskultur',
        'Har hatt nesten alle store bluesartister de siste fire tiårene',
      ],
      downsEn: [
        'Early challenges organizing under communist-era restrictions',
        'Venue shifts and logistical hurdles as the festival scaled up',
      ],
      downsNo: [
        'Tidlige utfordringer med å organisere under kommunistiske restriksjoner',
        'Endringer i spillested og logistiske hindringer etter hvert som festivalen vokste',
      ],
    },
    keyPeople: [
      { name: 'Ireneusz "Irek" Dudek', roleEn: 'Founder; blues guitarist and cultural pioneer', roleNo: 'Grunnlegger; bluesgitarist og kulturpioner' },
    ],
    headliners: ['B.B. King', 'Eric Clapton', 'Buddy Guy', 'John Mayall'],
    youtubeHighlights: [
      { videoId: 'ocxgH2Z9kmk', year: 2016, titleEn: 'J.J. Grey & Mofro at Rawa Blues Festival', titleNo: 'J.J. Grey & Mofro på Rawa Blues Festival', descriptionEn: 'Southern blues and soul from J.J. Grey at Poland\'s legendary Spodek arena.', descriptionNo: 'Sørstatssblues og soul fra J.J. Grey på Polens legendariske Spodek-arena.' },
      { videoId: 'b8R73sDA44k', year: 2013, titleEn: 'Heritage Blues Orchestra – Get Right Church (Rawa 2013)', titleNo: 'Heritage Blues Orchestra – Get Right Church (Rawa 2013)', descriptionEn: 'Gospel-infused blues at the world\'s largest indoor blues festival.', descriptionNo: 'Gospelinfluert blues på verdens største innendørs bluesfestival.' },
    ],
    established: 1981,
    active: true,
  },
  {
    id: 'lucerne-blues-festival',
    name: 'Lucerne Blues Festival',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    city: 'Lucerne',
    region: 'europe',
    dates: 'November (annually)',
    websiteUrl: 'https://www.bluesfestival.ch/',
    descriptionEn: 'A premier Swiss blues festival held in the picturesque city of Lucerne since 1995, known for booking authentic blues artists.',
    descriptionNo: 'En førsteklasses sveitsisk bluesfestival holdt i den pittoreske byen Luzern siden 1995, kjent for å booke autentiske bluesartister.',
    historyEn: 'Founded in 1995, the Lucerne Blues Festival grew to one of Europe\'s key blues events, mainly held at the Grand Casino Lucerne. Over 30 years, it has hosted legends like B.B. King and Bettye LaVette. Known for its carefully curated lineups and intimate venues, it attracts blues purists from across the continent.',
    historyNo: 'Grunnlagt i 1995, vokste Lucerne Blues Festival til en av Europas viktigste bluesbegivenheter, hovedsakelig holdt på Grand Casino Lucerne. Over 30 år har den hatt legender som B.B. King og Bettye LaVette. Kjent for nøye kuraterte artister og intime spillesteder.',
    upsAndDowns: {
      upsEn: [
        'Over 30 years of success bringing authentic blues to Switzerland',
        'Intimate venue setting at Grand Casino Lucerne creates unique atmosphere',
      ],
      upsNo: [
        'Over 30 år med suksess med å bringe autentisk blues til Sveits',
        'Intimt spillested på Grand Casino Lucerne skaper unik atmosfære',
      ],
      downsEn: [
        'Occasional lineup changes due to artist cancellations',
        'Competition from larger European festivals for headlining acts',
      ],
      downsNo: [
        'Tidvise endringer i artister på grunn av kanselleringer',
        'Konkurranse fra større europeiske festivaler om hovedartister',
      ],
    },
    keyPeople: [
      { name: 'Martin Brändli', roleEn: 'Festival president and long-time organizer', roleNo: 'Festivalpresident og langvarig arrangør' },
    ],
    headliners: ['B.B. King', 'Kenny Wayne Shepherd', 'Walter Trout', 'Shemekia Copeland', 'Bettye LaVette'],
    youtubeHighlights: [],
    established: 1995,
    active: true,
  },
  {
    id: 'porretta-soul-festival',
    name: 'Porretta Soul Festival',
    country: 'Italy',
    countryFlag: '🇮🇹',
    city: 'Porretta Terme',
    region: 'europe',
    dates: 'July (annually)',
    websiteUrl: 'https://www.porrettasoulfestival.it/',
    descriptionEn: 'Italy\'s premier soul and blues festival in the Apennine Mountains, celebrating the deep connections between soul, blues, and R&B since 1988.',
    descriptionNo: 'Italias fremste soul- og bluesfestival i Apenninene, som feirer de dype forbindelsene mellom soul, blues og R&B siden 1988.',
    historyEn: 'Founded in 1988 by Graziano Uliani to honor soul legend Otis Redding. The festival takes place in the beautiful spa town of Porretta Terme in the Apennine Mountains of Emilia-Romagna. It became Europe\'s premier soul festival, hosting legendary artists from the Stax and Motown traditions. The town even named a park after regular performer Rufus Thomas.',
    historyNo: 'Grunnlagt i 1988 av Graziano Uliani for å hedre soullegenden Otis Redding. Festivalen finner sted i den vakre kurstaden Porretta Terme i Apenninene i Emilia-Romagna. Den ble Europas fremste soulfestival, med legendariske artister fra Stax- og Motown-tradisjonene. Byen ga til og med en park navn etter den faste utøveren Rufus Thomas.',
    upsAndDowns: {
      upsEn: [
        'Attracted Rufus Thomas, Solomon Burke, Bobby Rush and other soul legends',
        'Rufus Thomas Park named in honor of the legendary performer',
        'Became Europe\'s premier destination for authentic soul and blues',
      ],
      upsNo: [
        'Tiltrakk Rufus Thomas, Solomon Burke, Bobby Rush og andre soullegender',
        'Rufus Thomas Park oppkalt til ære for den legendariske utøveren',
        'Ble Europas fremste destinasjon for autentisk soul og blues',
      ],
      downsEn: [
        'Early financial risks in establishing a niche soul festival',
        'COVID-19 cancellations disrupted momentum in 2020–2021',
      ],
      downsNo: [
        'Tidlige økonomiske risikoer ved å etablere en nisje soulfestival',
        'COVID-19-avlysninger forstyrret momentum i 2020–2021',
      ],
    },
    keyPeople: [
      { name: 'Graziano Uliani', roleEn: 'Founder; created the festival to honor Otis Redding', roleNo: 'Grunnlegger; skapte festivalen for å hedre Otis Redding' },
      { name: 'Rufus Thomas', roleEn: 'Iconic regular performer; park named in his honor', roleNo: 'Ikonisk fast utøver; park oppkalt etter ham' },
    ],
    headliners: ['Bobby Rush', 'Irma Thomas', 'Otis Clay', 'Bettye LaVette', 'Solomon Burke', 'Rufus Thomas'],
    youtubeHighlights: [],
    established: 1988,
    active: true,
  },
  {
    id: 'blues-rules-crissier',
    name: 'Blues Rules Crissier',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    city: 'Crissier',
    region: 'europe',
    dates: 'June (annually)',
    descriptionEn: 'A raw, roots-oriented blues festival near Lausanne celebrating acoustic and electric blues in an intimate outdoor setting.',
    descriptionNo: 'En rå, rootsorientert bluesfestival nær Lausanne som feirer akustisk og elektrisk blues i et intimt utendørsmiljø.',
    historyEn: 'Blues Rules Crissier is a beloved roots blues festival in French-speaking Switzerland. It focuses on raw, unpolished blues and roots music, attracting a dedicated audience of blues purists who appreciate authentic performances over slick productions.',
    historyNo: 'Blues Rules Crissier er en kjær rootsbluesfestival i fransktalende Sveits. Den fokuserer på rå, upolert blues- og rootsmusikk og tiltrekker seg et dedikert publikum av bluespurister som verdsetter autentiske fremføringer.',
    upsAndDowns: {
      upsEn: [
        'Unique focus on raw, unpolished roots blues – fills a niche in the European circuit',
        'Intimate outdoor setting near Lausanne with dedicated purist audience',
      ],
      upsNo: [
        'Unikt fokus på rå, upolert rootsblues – fyller en nisje i den europeiske kretsen',
        'Intimt utendørsmiljø nær Lausanne med dedikert puristpublikum',
      ],
      downsEn: [
        'Small scale limits visibility and revenue',
        'Weather-dependent outdoor format',
      ],
      downsNo: [
        'Liten skala begrenser synlighet og inntekt',
        'Væravhengig utendørsformat',
      ],
    },
    keyPeople: [],
    headliners: ['Seasick Steve', 'Cedric Burnside', 'RL Boyce'],
    youtubeHighlights: [],
    active: true,
  },
  {
    id: 'blues-alive-sumperk',
    name: 'Blues Alive',
    country: 'Czech Republic',
    countryFlag: '🇨🇿',
    city: 'Šumperk',
    region: 'europe',
    dates: 'November (annually)',
    websiteUrl: 'https://www.bluesalive.cz/',
    descriptionEn: 'The largest blues festival in Central Europe, held in Šumperk, Czech Republic since 1996.',
    descriptionNo: 'Den største bluesfestivalen i Sentral-Europa, holdt i Šumperk, Tsjekkia siden 1996.',
    historyEn: 'Blues Alive is the biggest blues festival in Central Europe and has been drawing top international blues acts to the Czech town of Šumperk since 1996. The festival features multiple venues across the town and has won European Blues Awards for best festival.',
    historyNo: 'Blues Alive er den største bluesfestivalen i Sentral-Europa og har trukket topp internasjonale bluesartister til den tsjekkiske byen Šumperk siden 1996. Festivalen har vunnet European Blues Awards for beste festival.',
    upsAndDowns: {
      upsEn: [
        'Won European Blues Awards for best festival',
        'Multi-venue format creates a town-wide festival atmosphere',
      ],
      upsNo: [
        'Vant European Blues Awards for beste festival',
        'Flerscene-format skaper en byomspennende festivalatmosfære',
      ],
      downsEn: [
        'Remote location in Šumperk can limit international attendance',
        'November timing competes with other autumn blues events',
      ],
      downsNo: [
        'Avsidesliggende beliggenhet i Šumperk kan begrense internasjonalt oppmøte',
        'November-tidspunkt konkurrerer med andre høstbluesarrangementer',
      ],
    },
    keyPeople: [],
    headliners: ['Walter Trout', 'Eric Gales', 'Fantastic Negrito'],
    youtubeHighlights: [],
    established: 1996,
    active: true,
  },
  {
    id: 'cahors-blues-festival',
    name: 'Cahors Blues Festival',
    country: 'France',
    countryFlag: '🇫🇷',
    city: 'Cahors',
    region: 'europe',
    dates: 'July (annually)',
    websiteUrl: 'https://www.cahorsbluesfestival.com/',
    descriptionEn: 'One of France\'s most important blues festivals, held in the medieval town of Cahors in the Lot Valley since 1982.',
    descriptionNo: 'En av Frankrikes viktigste bluesfestivaler, holdt i middelalderens Cahors i Lot-dalen siden 1982.',
    historyEn: 'Cahors Blues Festival is one of the oldest blues festivals in France and one of the most respected in Europe. Since 1982, it has brought authentic American blues to the stunning medieval town of Cahors, combining world-class music with the charm of southwest France.',
    historyNo: 'Cahors Blues Festival er en av de eldste bluesfestivalene i Frankrike og en av de mest respekterte i Europa. Siden 1982 har den brakt autentisk amerikansk blues til den fantastiske middelalderbyen Cahors.',
    upsAndDowns: {
      upsEn: [
        'Over 40 years of bringing authentic American blues to France',
        'Stunning medieval town setting combines music with cultural tourism',
      ],
      upsNo: [
        'Over 40 år med å bringe autentisk amerikansk blues til Frankrike',
        'Fantastisk middelalderbysetting kombinerer musikk med kulturturisme',
      ],
      downsEn: [
        'Smaller budget compared to major European festivals',
        'Rural location can be hard to reach for international visitors',
      ],
      downsNo: [
        'Mindre budsjett sammenlignet med store europeiske festivaler',
        'Landlig beliggenhet kan være vanskelig å nå for internasjonale besøkende',
      ],
    },
    keyPeople: [],
    headliners: ['Robert Cray', 'Keb\' Mo\'', 'Taj Mahal', 'Lucky Peterson'],
    youtubeHighlights: [],
    established: 1982,
    active: true,
  },
  {
    id: 'moulin-blues-festival',
    name: 'Moulin Blues Festival',
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    city: 'Ospel',
    region: 'europe',
    dates: 'May (annually)',
    descriptionEn: 'A warm, community-driven Dutch blues festival in the small village of Ospel, Limburg, running since 1990.',
    descriptionNo: 'En varm, fellesskapsdrevet nederlandsk bluesfestival i den lille landsbyen Ospel, Limburg, som har pågått siden 1990.',
    historyEn: 'Moulin Blues started in 1990 as a small community event and has grown into one of the most beloved blues festivals in the Benelux region. Known for its friendly atmosphere and quality bookings, it continues to thrive as a volunteer-run festival.',
    historyNo: 'Moulin Blues startet i 1990 som et lite lokalsamfunnsarrangement og har vokst til en av de mest elskede bluesfestivalene i Benelux-regionen. Kjent for sitt vennlige miljø og kvalitetsartister.',
    upsAndDowns: {
      upsEn: [
        'Beloved volunteer-run festival with exceptionally friendly atmosphere',
        'Consistent quality bookings over 30+ years',
      ],
      upsNo: [
        'Elsket frivilligdrevet festival med eksepsjonelt vennlig atmosfære',
        'Konsekvent kvalitetsartister i over 30 år',
      ],
      downsEn: [
        'Small village setting limits capacity and growth',
        'Reliance on volunteer labor can be challenging',
      ],
      downsNo: [
        'Liten landsbysetting begrenser kapasitet og vekst',
        'Avhengighet av frivillig arbeidskraft kan være utfordrende',
      ],
    },
    keyPeople: [],
    headliners: ['Ana Popovic', 'Thorbjørn Risager', 'Bernard Allison'],
    youtubeHighlights: [],
    established: 1990,
    active: true,
  },
  {
    id: 'grolloo-blues-festival',
    name: 'Holland International Blues Festival',
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    city: 'Grolloo',
    region: 'europe',
    dates: 'June (annually)',
    descriptionEn: 'Founded in 2016 in Grolloo – hometown of Cuby & the Blizzards – celebrating Dutch blues heritage and international acts.',
    descriptionNo: 'Grunnlagt i 2016 i Grolloo – hjembyen til Cuby & the Blizzards – som feirer nederlandsk bluesarv og internasjonale artister.',
    historyEn: 'Founded in 2016 as the Holland International Blues Festival in Grolloo, the hometown of legendary Dutch band Cuby & the Blizzards and their frontman Harry Muskee. The festival celebrates the deep Dutch blues tradition while attracting international stars. Despite being a young festival, it quickly established itself on the European blues circuit.',
    historyNo: 'Grunnlagt i 2016 som Holland International Blues Festival i Grolloo, hjembyen til det legendariske nederlandske bandet Cuby & the Blizzards og deres frontmann Harry Muskee. Festivalen feirer den dype nederlandske bluestradisjonen mens den tiltrekker internasjonale stjerner.',
    upsAndDowns: {
      upsEn: [
        'Strong connection to Dutch blues heritage through Cuby & the Blizzards\' hometown',
        'Quick growth and recognition on the European blues circuit',
      ],
      upsNo: [
        'Sterk tilknytning til nederlandsk bluesarv gjennom Cuby & the Blizzards\' hjemby',
        'Rask vekst og anerkjennelse på den europeiske blueskretsen',
      ],
      downsEn: [
        'Young festival still building its reputation',
        'Weather-dependent outdoor format in rural Netherlands',
      ],
      downsNo: [
        'Ung festival som fortsatt bygger opp omdømmet',
        'Væravhengig utendørsformat i landlige Nederland',
      ],
    },
    keyPeople: [
      { name: 'Harry Muskee', roleEn: 'Inspiration; Cuby & the Blizzards frontman from Grolloo', roleNo: 'Inspirasjon; Cuby & the Blizzards\' frontmann fra Grolloo' },
    ],
    headliners: ['Eric Gales', 'Shemekia Copeland', 'Walter Trout'],
    youtubeHighlights: [],
    established: 2016,
    active: true,
  },

  // ── Scandinavia (non-Norway) ───────────────────────────
  {
    id: 'copenhagen-blues-festival',
    name: 'Copenhagen Blues Festival',
    country: 'Denmark',
    countryFlag: '🇩🇰',
    city: 'Copenhagen',
    region: 'scandinavia',
    dates: 'September (annually)',
    descriptionEn: 'Denmark\'s premier blues festival, showcasing Scandinavian and international blues across multiple venues in Copenhagen since 2001.',
    descriptionNo: 'Danmarks fremste bluesfestival, som viser skandinavisk og internasjonal blues på flere scener i København siden 2001.',
    historyEn: 'Founded in 2001, the Copenhagen Blues Festival has grown to feature over 100 acts across multiple venues in Denmark\'s capital. The festival brings the best of Scandinavian and international blues to Copenhagen, combining concerts, jam sessions, and workshops into a multi-day celebration of blues culture.',
    historyNo: 'Grunnlagt i 2001, har Copenhagen Blues Festival vokst til å presentere over 100 artister på flere spillesteder i Danmarks hovedstad. Festivalen bringer det beste av skandinavisk og internasjonal blues til København.',
    upsAndDowns: {
      upsEn: [
        'Over 20 years of success with 100+ acts per edition',
        'Multi-venue format across Copenhagen creates a city-wide atmosphere',
      ],
      upsNo: [
        'Over 20 år med suksess med 100+ artister per utgave',
        'Flerscene-format over hele København skaper en byomspennende atmosfære',
      ],
      downsEn: [
        'Venue shifts and coordination challenges across multiple locations',
        'Competition from Copenhagen Jazz Festival for audience and funding',
      ],
      downsNo: [
        'Endringer i spillesteder og koordineringsutfordringer på tvers av flere steder',
        'Konkurranse fra Copenhagen Jazz Festival om publikum og finansiering',
      ],
    },
    keyPeople: [
      { name: 'John Mayall', roleEn: 'Notable performer who helped raise the festival\'s profile', roleNo: 'Bemerkelsesverdig utøver som hjalp med å heve festivalens profil' },
    ],
    headliners: ['Thorbjørn Risager', 'Erja Lyytinen', 'Mike Zito', 'John Mayall'],
    youtubeHighlights: [],
    established: 2001,
    active: true,
  },
  {
    id: 'umea-blues-festival',
    name: 'Umeå Blues Festival',
    country: 'Sweden',
    countryFlag: '🇸🇪',
    city: 'Umeå',
    region: 'scandinavia',
    dates: 'October (annually)',
    descriptionEn: 'Northern Sweden\'s annual blues gathering, bringing warmth and soul to the Arctic Circle region.',
    descriptionNo: 'Nord-Sveriges årlige bluestreff, som bringer varme og sjel til regionen rundt polarsirkelen.',
    historyEn: 'Umeå Blues Festival is a testament to the enduring love for blues in northern Scandinavia. The festival brings international blues acts to one of Sweden\'s most northern cities, creating a unique contrast between the genre\'s southern roots and the Arctic setting.',
    historyNo: 'Umeå Blues Festival er et vitnesbyrd om den vedvarende kjærligheten til blues i det nordlige Skandinavia. Festivalen bringer internasjonale bluesartister til en av Sveriges nordligste byer.',
    upsAndDowns: {
      upsEn: [
        'Unique Arctic setting creates a memorable blues experience',
        'Strong Scandinavian blues community support',
      ],
      upsNo: [
        'Unik arktisk setting skaper en minneverdig bluesopplevelse',
        'Sterk skandinavisk bluessamfunnsstøtte',
      ],
      downsEn: [
        'Remote northern location limits attendance',
        'October timing and weather can be challenging',
      ],
      downsNo: [
        'Avsidesliggende nordlig beliggenhet begrenser oppmøtet',
        'Oktober-tidspunkt og vær kan være utfordrende',
      ],
    },
    keyPeople: [],
    headliners: ['Louisiana Red', 'Sven Zetterberg'],
    youtubeHighlights: [],
    active: true,
  },

  // ── USA ────────────────────────────────────────────────
  {
    id: 'chicago-blues-festival',
    name: 'Chicago Blues Festival',
    country: 'USA',
    countryFlag: '🇺🇸',
    city: 'Chicago, Illinois',
    region: 'usa',
    dates: 'June (annually)',
    websiteUrl: 'https://www.chicago.gov/city/en/depts/dca/supp_info/chicago_blues_festival.html',
    descriptionEn: 'The world\'s largest free blues festival, held annually in Chicago\'s Millennium Park – the birthplace of electric blues.',
    descriptionNo: 'Verdens største gratis bluesfestival, avholdt årlig i Chicagos Millennium Park – den elektriske bluesens fødested.',
    historyEn: 'Founded in 1984 by Lois Weisberg, Chicago\'s Commissioner of Cultural Affairs, as a tribute to Muddy Waters who had passed the year before. The festival is the largest free blues event in the world, held in the city where electric blues was born. Over 40 years and millions of attendees, it has featured every major blues artist and become a pilgrimage for blues fans worldwide.',
    historyNo: 'Grunnlagt i 1984 av Lois Weisberg, Chicagos kultursjef, som en hyllest til Muddy Waters som gikk bort året før. Festivalen er verdens største gratis bluesarrangement, holdt i byen der den elektriske bluesen ble født. Over 40 år og millioner av besøkende har den presentert alle store bluesartister og blitt et pilegrimsmål for bluesfans over hele verden.',
    upsAndDowns: {
      upsEn: [
        'Over 40 years of success – millions of total attendees',
        'Featured every major blues legend: B.B. King, Buddy Guy, Koko Taylor, Muddy Waters tribute',
        'Completely free admission – making blues accessible to all',
      ],
      upsNo: [
        'Over 40 år med suksess – millioner av besøkende totalt',
        'Har presentert alle store blueslegender: B.B. King, Buddy Guy, Koko Taylor, Muddy Waters-hyllest',
        'Helt gratis inngang – gjør blues tilgjengelig for alle',
      ],
      downsEn: [
        'Weather issues at outdoor Grant Park/Millennium Park venue',
        'Venue move from Grant Park to Millennium Park in 2017 caused controversy',
      ],
      downsNo: [
        'Værproblemer på utendørsstedet Grant Park/Millennium Park',
        'Flytting fra Grant Park til Millennium Park i 2017 skapte kontrovers',
      ],
    },
    keyPeople: [
      { name: 'Lois Weisberg', roleEn: 'Founder; Chicago\'s Commissioner of Cultural Affairs', roleNo: 'Grunnlegger; Chicagos kultursjef' },
      { name: 'Muddy Waters', roleEn: 'Inspiration; the festival was created as a tribute after his death in 1983', roleNo: 'Inspirasjon; festivalen ble skapt som en hyllest etter hans død i 1983' },
    ],
    headliners: ['Buddy Guy', 'Shemekia Copeland', 'Bobby Rush', 'Mavis Staples', 'B.B. King', 'Koko Taylor'],
    youtubeHighlights: [
      { videoId: 's43ykgOGi6M', year: 2024, titleEn: 'Chicago Blues Festival 2024 – Live at Jay Pritzker Pavilion', titleNo: 'Chicago Blues Festival 2024 – Live i Jay Pritzker Pavilion', descriptionEn: 'Full live stream featuring tribute performances and headlining acts at the world\'s largest free blues festival.', descriptionNo: 'Full livestrøm med hyllester og hovedartister på verdens største gratis bluesfestival.', artistName: 'Buddy Guy', artistSlug: '/artists/buddy-guy' },
      { videoId: 'ovWLUmGwGRc', year: 2022, titleEn: 'Chicago Blues Festival 2022 – Full Day Live', titleNo: 'Chicago Blues Festival 2022 – Hel dag live', descriptionEn: 'A full day of blues at Jay Pritzker Pavilion including Billy Branch & The Sons of Blues.', descriptionNo: 'En hel dag med blues i Jay Pritzker Pavilion inkludert Billy Branch & The Sons of Blues.' },
    ],
    established: 1984,
    active: true,
  },
  {
    id: 'king-biscuit-blues-festival',
    name: 'King Biscuit Blues Festival',
    country: 'USA',
    countryFlag: '🇺🇸',
    city: 'Helena, Arkansas',
    region: 'usa',
    dates: 'October (annually)',
    websiteUrl: 'https://www.kingbiscuitfestival.com/',
    descriptionEn: 'Named after the legendary "King Biscuit Time" radio show, this Arkansas Delta festival celebrates the birthplace of blues broadcasting.',
    descriptionNo: 'Oppkalt etter det legendariske radioprogrammet "King Biscuit Time", feirer denne Arkansas Delta-festivalen fødested for bluesradio.',
    historyEn: 'Founded in 1986 by the Sonny Boy Blues Society to honor the historic "King Biscuit Time" radio show that first aired in 1941 with Sonny Boy Williamson II. The festival takes place in Helena, Arkansas, on the banks of the Mississippi River, and was temporarily renamed in 2005 due to a licensing dispute. Over 35 years, it has celebrated the Delta blues tradition with authentic artists and devoted fans.',
    historyNo: 'Grunnlagt i 1986 av Sonny Boy Blues Society for å hedre det historiske radioprogrammet "King Biscuit Time" som først ble sendt i 1941 med Sonny Boy Williamson II. Festivalen finner sted i Helena, Arkansas, på bredden av Mississippi-elven, og ble midlertidig omdøpt i 2005 på grunn av en lisenstvist.',
    upsAndDowns: {
      upsEn: [
        'Over 35 years celebrating authentic Delta blues tradition',
        'Hosted Pinetop Perkins, Buddy Guy and other Delta legends',
        'Deep historical connection to King Biscuit Time radio show (1941)',
      ],
      upsNo: [
        'Over 35 år med feiring av autentisk Delta blues-tradisjon',
        'Har hatt Pinetop Perkins, Buddy Guy og andre Delta-legender',
        'Dyp historisk forbindelse til King Biscuit Time-radioprogrammet (1941)',
      ],
      downsEn: [
        'Licensing dispute in 2005 forced temporary name change',
        'Weather and Mississippi River floods have disrupted events',
      ],
      downsNo: [
        'Lisenstvist i 2005 tvang frem midlertidig navneendring',
        'Vær og Mississippi-flommer har forstyrret arrangementer',
      ],
    },
    keyPeople: [
      { name: 'Sonny "Sunshine" Payne', roleEn: 'Legendary radio host of King Biscuit Time; festival inspiration', roleNo: 'Legendarisk radioprogramleder for King Biscuit Time; festivalinspirasjon' },
    ],
    headliners: ['Bobby Rush', 'Cedric Burnside', 'Robert Cray', 'Pinetop Perkins', 'Buddy Guy'],
    youtubeHighlights: [
      { videoId: 'FsKkRdrVlvk', year: 2016, titleEn: 'Samantha Fish – "Runaway" Live at King Biscuit Blues Festival', titleNo: 'Samantha Fish – «Runaway» Live på King Biscuit Blues Festival', descriptionEn: 'An electrifying performance by Samantha Fish at the legendary King Biscuit festival in Helena, Arkansas.', descriptionNo: 'En elektrisk opptreden av Samantha Fish på den legendariske King Biscuit-festivalen i Helena, Arkansas.' },
    ],
    established: 1986,
    active: true,
  },
  {
    id: 'mississippi-delta-blues-festival',
    name: 'Mississippi Delta Blues & Heritage Festival',
    country: 'USA',
    countryFlag: '🇺🇸',
    city: 'Greenville, Mississippi',
    region: 'usa',
    dates: 'September (annually)',
    descriptionEn: 'Held in the heart of the Mississippi Delta, this festival celebrates the roots of blues where it all began.',
    descriptionNo: 'Holdt i hjertet av Mississippi-deltaet, feirer denne festivalen røttene til blues der det hele begynte.',
    historyEn: 'The Mississippi Delta Blues & Heritage Festival is one of the oldest blues festivals in the American South, founded in 1978. Greenville, Mississippi sits at the heart of the Delta, and the festival honors the African American musical heritage of the region where blues was born.',
    historyNo: 'Mississippi Delta Blues & Heritage Festival er en av de eldste bluesfestivalene i det amerikanske Sørstatene, grunnlagt i 1978. Greenville, Mississippi, ligger i hjertet av Deltaet, og festivalen hedrer den afroamerikanske musikalske arven i regionen der bluesen ble født.',
    upsAndDowns: {
      upsEn: [
        'One of the oldest blues festivals in the American South (est. 1978)',
        'Held in the very region where blues was born – deep authenticity',
      ],
      upsNo: [
        'En av de eldste bluesfestivalene i det amerikanske Sørstatene (grunn. 1978)',
        'Holdt i selve regionen der bluesen ble født – dyp autentisitet',
      ],
      downsEn: [
        'Rural Mississippi location limits international attendance',
        'Economic challenges in the Delta region affect funding',
      ],
      downsNo: [
        'Landlig Mississippi-beliggenhet begrenser internasjonalt oppmøte',
        'Økonomiske utfordringer i Delta-regionen påvirker finansieringen',
      ],
    },
    keyPeople: [],
    headliners: ['Bobby "Blue" Bland', 'Little Milton', 'B.B. King'],
    youtubeHighlights: [],
    established: 1978,
    active: true,
  },
  {
    id: 'juke-joint-festival',
    name: 'Juke Joint Festival',
    country: 'USA',
    countryFlag: '🇺🇸',
    city: 'Clarksdale, Mississippi',
    region: 'usa',
    dates: 'April (annually)',
    websiteUrl: 'https://www.jukejointfestival.com/',
    descriptionEn: 'A celebration of blues culture in Clarksdale, Mississippi – the crossroads of the blues – featuring live music in juke joints, churches, and streets.',
    descriptionNo: 'En feiring av blueskultur i Clarksdale, Mississippi – bluesens veikryss – med livemusikk i juke joints, kirker og gater.',
    historyEn: 'The Juke Joint Festival transforms Clarksdale, Mississippi – the legendary "Crossroads" – into a massive blues celebration since 2004. Music spills out of historic juke joints, churches, restaurants, and street corners. It\'s considered the most authentic blues experience in America, honoring the living tradition of Delta blues in the town where Robert Johnson allegedly sold his soul.',
    historyNo: 'Juke Joint Festival forvandler Clarksdale, Mississippi – det legendariske «veikrysset» – til en massiv bluesfeiring siden 2004. Musikk strømmer ut av historiske juke joints, kirker, restauranter og gatehjørner. Den regnes som den mest autentiske bluesopplevelsen i Amerika.',
    upsAndDowns: {
      upsEn: [
        'Most authentic blues experience in America – music in actual juke joints',
        'Deep connection to Robert Johnson\'s Crossroads legend',
      ],
      upsNo: [
        'Mest autentiske bluesopplevelse i Amerika – musikk i ekte juke joints',
        'Dyp forbindelse til Robert Johnsons Crossroads-legende',
      ],
      downsEn: [
        'Small-town infrastructure limits capacity',
        'Declining population in Clarksdale presents sustainability challenges',
      ],
      downsNo: [
        'Småbyinfrastruktur begrenser kapasiteten',
        'Synkende befolkning i Clarksdale gir bærekraftutfordringer',
      ],
    },
    keyPeople: [],
    headliners: ['Super Chikan', 'T-Model Ford', 'Cedric Burnside'],
    youtubeHighlights: [],
    established: 2004,
    active: true,
  },

  // ── UK ─────────────────────────────────────────────────
  {
    id: 'great-british-rhythm-blues-festival',
    name: 'Great British R&B Festival',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    city: 'Colne, Lancashire',
    region: 'europe',
    dates: 'August (annually)',
    websiteUrl: 'https://www.greatbritishrhythmandbluesfestival.com/',
    descriptionEn: 'The UK\'s premier rhythm & blues festival, held in the Lancashire town of Colne since 1989, celebrating British and American blues.',
    descriptionNo: 'Storbritannias fremste rhythm & blues-festival, holdt i Lancashire-byen Colne siden 1989, som feirer britisk og amerikansk blues.',
    historyEn: 'The Great British R&B Festival in Colne has been the beating heart of the British blues scene since 1989. Over the August Bank Holiday weekend, the town comes alive with blues, R&B, and soul music across multiple venues, honoring the British Blues Boom tradition.',
    historyNo: 'Great British R&B Festival i Colne har vært hjertet av den britiske bluesscenen siden 1989. Under augusthelgen våkner byen til liv med blues, R&B og soulmusikk på tvers av flere spillesteder.',
    upsAndDowns: {
      upsEn: [
        'Beating heart of the British blues scene for over 35 years',
        'Multi-venue August Bank Holiday format creates vibrant town-wide atmosphere',
      ],
      upsNo: [
        'Hjertet av den britiske bluesscenen i over 35 år',
        'Flerscene augusthelg-format skaper livlig byomspennende atmosfære',
      ],
      downsEn: [
        'Competition from larger UK festivals for headliners',
        'Northern English weather can affect outdoor stages',
      ],
      downsNo: [
        'Konkurranse fra større britiske festivaler om hovedartister',
        'Nord-engelsk vær kan påvirke utendørsscener',
      ],
    },
    keyPeople: [],
    headliners: ['John Mayall', 'Walter Trout', 'Joanne Shaw Taylor'],
    youtubeHighlights: [],
    established: 1989,
    active: true,
  },
  {
    id: 'edinburgh-blues-festival',
    name: 'Edinburgh Blues & Beyond',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    city: 'Edinburgh, Scotland',
    region: 'europe',
    dates: 'March (annually)',
    descriptionEn: 'Scotland\'s annual celebration of blues, roots, and soul music in the historic city of Edinburgh.',
    descriptionNo: 'Skottlands årlige feiring av blues, roots og soulmusikk i den historiske byen Edinburgh.',
    historyEn: 'Edinburgh Blues & Beyond celebrates the enduring love for blues in Scotland, hosting artists across the city\'s intimate venues. The festival bridges traditional blues with modern roots and soul.',
    historyNo: 'Edinburgh Blues & Beyond feirer den vedvarende kjærligheten til blues i Skottland, med artister på tvers av byens intime spillesteder. Festivalen bygger bro mellom tradisjonell blues og moderne roots og soul.',
    upsAndDowns: {
      upsEn: [
        'Intimate venue settings in historic Edinburgh',
        'Bridges traditional blues with modern roots and soul',
      ],
      upsNo: [
        'Intime spillesteder i historiske Edinburgh',
        'Bygger bro mellom tradisjonell blues og moderne roots og soul',
      ],
      downsEn: [
        'Relatively small scale compared to dedicated blues festivals',
        'March timing competes with Edinburgh\'s busy festival calendar',
      ],
      downsNo: [
        'Relativt liten skala sammenlignet med dedikerte bluesfestivaler',
        'Mars-tidspunkt konkurrerer med Edinburghs travle festivalkalender',
      ],
    },
    keyPeople: [],
    headliners: ['Ian Siegal', 'Kyla Brox', 'Mike Sanchez'],
    youtubeHighlights: [],
    active: true,
  },

  // ── Canada ─────────────────────────────────────────────
  {
    id: 'ottawa-bluesfest',
    name: 'Ottawa Bluesfest',
    country: 'Canada',
    countryFlag: '🇨🇦',
    city: 'Ottawa, Ontario',
    region: 'canada',
    dates: 'July (annually)',
    websiteUrl: 'https://www.ottawabluesfest.ca/',
    descriptionEn: 'Canada\'s largest outdoor music festival, founded in 1994. Features blues, rock and roots across multiple stages.',
    descriptionNo: 'Canadas største utendørs musikkfestival, grunnlagt i 1994. Presenterer blues, rock og roots på flere scener.',
    historyEn: 'Founded in 1994 by Mark Monahan, Ottawa Bluesfest grew from a small blues event into Canada\'s largest outdoor music festival. While it has expanded beyond pure blues to include rock and pop, the festival maintains strong blues and roots programming. It has hosted major international acts and overcame a dramatic stage collapse incident in 2011.',
    historyNo: 'Grunnlagt i 1994 av Mark Monahan, vokste Ottawa Bluesfest fra et lite bluesarrangement til Canadas største utendørs musikkfestival. Selv om den har utvidet seg utover ren blues til å inkludere rock og pop, opprettholder festivalen sterk blues- og rootsprogrammering.',
    upsAndDowns: {
      upsEn: [
        'Grew to become Canada\'s largest outdoor festival – over 30 years of success',
        'Consistently books world-class artists across blues, rock and roots',
      ],
      upsNo: [
        'Vokste til å bli Canadas største utendørsfestival – over 30 år med suksess',
        'Booker konsekvent artister i verdensklasse innen blues, rock og roots',
      ],
      downsEn: [
        'Dramatic stage collapse during a storm in 2011',
        'COVID-19 cancellations in 2020–2021 disrupted momentum',
      ],
      downsNo: [
        'Dramatisk scenekollaps under en storm i 2011',
        'COVID-19-avlysninger i 2020–2021 forstyrret momentum',
      ],
    },
    keyPeople: [
      { name: 'Mark Monahan', roleEn: 'Founder and executive director', roleNo: 'Grunnlegger og administrerende direktør' },
    ],
    headliners: ['Buddy Guy', 'B.B. King', 'Robert Plant'],
    youtubeHighlights: [],
    established: 1994,
    active: true,
  },
  {
    id: 'montreal-jazz-festival',
    name: 'Montreal International Jazz Festival',
    country: 'Canada',
    countryFlag: '🇨🇦',
    city: 'Montreal, Quebec',
    region: 'canada',
    dates: 'June–July (annually)',
    websiteUrl: 'https://www.montrealjazzfest.com/',
    descriptionEn: 'The world\'s largest jazz festival, featuring significant blues programming since 1980.',
    descriptionNo: 'Verdens største jazzfestival, med betydelig bluesprogrammering siden 1980.',
    historyEn: 'Founded in 1980 by Alain Simard and André Ménard, the Montreal International Jazz Festival is the world\'s largest jazz festival and consistently features significant blues programming. It has hosted blues legends like B.B. King and Ray Charles alongside jazz giants, reflecting the deep historical connection between the two genres.',
    historyNo: 'Grunnlagt i 1980 av Alain Simard og André Ménard, er Montreal International Jazz Festival verdens største jazzfestival og presenterer konsekvent betydelig bluesprogrammering. Den har hatt blueslegender som B.B. King og Ray Charles sammen med jazzgiganter.',
    upsAndDowns: {
      upsEn: [
        'World\'s largest jazz festival – massive blues programming component',
        'Hosted B.B. King, Ray Charles and other blues-jazz crossover legends',
      ],
      upsNo: [
        'Verdens største jazzfestival – massiv bluesprogrammeringskomponent',
        'Har hatt B.B. King, Ray Charles og andre blues-jazz crossover-legender',
      ],
      downsEn: [
        'Blues is secondary to jazz focus – purists may prefer dedicated blues events',
        'Venue changes and weather issues at outdoor stages',
      ],
      downsNo: [
        'Blues er sekundært til jazzfokuset – purister kan foretrekke dedikerte bluesarrangementer',
        'Endringer i spillested og værproblemer på utendørsscener',
      ],
    },
    keyPeople: [
      { name: 'Alain Simard', roleEn: 'Co-founder and artistic visionary', roleNo: 'Medgrunnlegger og kunstnerisk visjonær' },
      { name: 'André Ménard', roleEn: 'Co-founder and long-time co-director', roleNo: 'Medgrunnlegger og langvarig meddirektør' },
    ],
    headliners: ['B.B. King', 'Ray Charles', 'Buddy Guy', 'Robert Cray'],
    youtubeHighlights: [],
    established: 1980,
    active: true,
  },

  // ── Australia ──────────────────────────────────────────
  {
    id: 'bluesfest-byron-bay',
    name: 'Bluesfest Byron Bay',
    country: 'Australia',
    countryFlag: '🇦🇺',
    city: 'Byron Bay, NSW',
    region: 'europe', // using 'europe' as catch-all for international
    dates: 'April (annually)',
    websiteUrl: 'https://www.bluesfest.com.au/',
    descriptionEn: 'One of the world\'s largest blues and roots music festivals, held annually in Byron Bay, Australia since 1990.',
    descriptionNo: 'En av verdens største blues- og rootsmusikkfestivaler, avholdt årlig i Byron Bay, Australia siden 1990.',
    historyEn: 'Founded in 1990 by Peter Noble as the East Coast Blues & Roots Music Festival, Bluesfest Byron Bay grew to become one of the world\'s largest and most respected blues and roots festivals. Over 30 years, it has hosted legends like Bob Dylan, Buddy Guy and B.B. King in the stunning coastal setting of Byron Bay.',
    historyNo: 'Grunnlagt i 1990 av Peter Noble som East Coast Blues & Roots Music Festival, vokste Bluesfest Byron Bay til å bli en av verdens største og mest respekterte blues- og rootsfestivaler. Over 30 år har den hatt legender som Bob Dylan, Buddy Guy og B.B. King.',
    upsAndDowns: {
      upsEn: [
        'Over 30 years of success – one of the world\'s premier blues and roots events',
        'Hosted Bob Dylan, Buddy Guy, B.B. King and other global legends',
      ],
      upsNo: [
        'Over 30 år med suksess – en av verdens fremste blues- og rootsbegivenheter',
        'Har hatt Bob Dylan, Buddy Guy, B.B. King og andre globale legender',
      ],
      downsEn: [
        'COVID-19 cancellations in 2020–2021 caused major financial impact',
        'Licensing disputes and logistical challenges at the Byron Bay site',
      ],
      downsNo: [
        'COVID-19-avlysninger i 2020–2021 forårsaket store økonomiske konsekvenser',
        'Lisensdristing og logistiske utfordringer på Byron Bay-stedet',
      ],
    },
    keyPeople: [
      { name: 'Peter Noble', roleEn: 'Founder and festival director for over 30 years', roleNo: 'Grunnlegger og festivaldirektør i over 30 år' },
    ],
    headliners: ['Bob Dylan', 'Buddy Guy', 'B.B. King', 'Robert Plant'],
    youtubeHighlights: [
      { videoId: '-DVDs89BHgc', year: 2025, titleEn: 'Bluesfest Byron Bay 2025 – Official Wrap Video', titleNo: 'Bluesfest Byron Bay 2025 – Offisiell oppsummeringsvideo', descriptionEn: 'Four unforgettable days at one of the world\'s premier blues and roots festivals.', descriptionNo: 'Fire uforglemmelige dager på en av verdens fremste blues- og rootsfestivaler.' },
    ],
    established: 1990,
    active: true,
  },
];

export const getRegionLabel = (region: BluesFestival['region'], language: string): string => {
  const labels: Record<BluesFestival['region'], Record<string, string>> = {
    norway: { en: 'Norway', no: 'Norge', de: 'Norwegen' },
    scandinavia: { en: 'Scandinavia', no: 'Skandinavia', de: 'Skandinavien' },
    europe: { en: 'Europe & International', no: 'Europa & Internasjonalt', de: 'Europa & International' },
    usa: { en: 'USA', no: 'USA', de: 'USA' },
    canada: { en: 'Canada', no: 'Canada', de: 'Kanada' },
  };
  return labels[region][language] || labels[region]['en'];
};

export const getFestivalById = (id: string): BluesFestival | undefined =>
  bluesFestivals.find(f => f.id === id);
