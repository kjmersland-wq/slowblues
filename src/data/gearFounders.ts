// Founder profiles for /learn/gear/$id pages.
// Personal-tone editorial in NO/EN/SV/DE — same voice as the gear page.

export type L10n = { no: string; en: string; sv: string; de: string };
export type L10nList = { no: string[]; en: string[]; sv: string[]; de: string[] };

export type ExternalRef = { label: string; url: string };

export type FounderProfile = {
  brandId: string;
  name: string;
  years?: string;
  birthplace?: string;
  image?: string;
  imageCredit?: string;
  imageCreditUrl?: string;
  title: L10n; // page title / subtitle under name
  lede: L10n; // 1–2 sentence intro
  bio: L10nList; // longer biography, paragraph array
  anecdotes: L10nList; // short story bullets / mini-paragraphs
  links: ExternalRef[];
};

const wm = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=640`;
const wmPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const FOUNDERS: Record<string, FounderProfile> = {
  fender: {
    brandId: "fender",
    name: "Leo Fender",
    years: "1909–1991",
    birthplace: "Anaheim, California",
    image: wm("Clarence Leo Fender, Guitar Design File (49532200938).jpg"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Clarence Leo Fender, Guitar Design File (49532200938).jpg"),
    title: {
      no: "Radioreparatøren som forandret elektrisk gitar",
      en: "The radio repairman who reshaped electric guitar",
      sv: "Radioreparatören som ritade om elgitarren",
      de: "Der Radioreparateur, der die E-Gitarre neu erfand",
    },
    lede: {
      no: "Han kunne ikke spille en akkord. Likevel bygde han instrumentet som hele bluesen begynte å snakke gjennom.",
      en: "He couldn't play a single chord. Yet he built the instrument the whole blues conversation began to flow through.",
      sv: "Han kunde inte en enda ackord. Ändå byggde han instrumentet som hela bluesen började tala genom.",
      de: "Er konnte keinen einzigen Akkord spielen. Trotzdem baute er das Instrument, durch das der ganze Blues zu sprechen begann.",
    },
    bio: {
      no: [
        "Clarence Leo Fender vokste opp på en sitrusgård utenfor Anaheim. Som tenåring mistet han synet på det ene øyet — det skal være grunnen til at han aldri spilte gitar selv. I stedet ble han forelsket i elektronikk. Han reparerte radioer, bygde PA-anlegg for jordbruksmøter, og åpnet Fender's Radio Service i Fullerton i 1938.",
        "Da han begynte å bygge gitarer, gjorde han det med en ingeniørs blikk. Vekk med komplisert snekkerarbeid. Inn med skrudd-på hals, masseproduserbare deler, og pickups som tålte hard juling. Telecasteren (1950) var den første solid-body-elektriske gitaren noen klarte å lage i skala. Stratocasteren kom fire år senere. Bluesfolket trengte ikke å bli overbevist.",
      ],
      en: [
        "Clarence Leo Fender grew up on a citrus farm outside Anaheim. As a teenager he lost the sight in one eye — said to be the reason he never played guitar himself. He fell in love with electronics instead. He fixed radios, built PA rigs for farm meetings, and opened Fender's Radio Service in Fullerton in 1938.",
        "When he started building guitars, he did it with an engineer's eye. No fancy joinery. Bolt-on necks, parts that could be mass-produced, pickups that could take a beating. The Telecaster (1950) was the first solid-body electric anyone built at scale. The Stratocaster arrived four years later. Blues players needed no convincing.",
      ],
      sv: [
        "Clarence Leo Fender växte upp på en citrusgård utanför Anaheim. Som tonåring förlorade han synen på ena ögat — sägs vara skälet till att han själv aldrig spelade gitarr. Istället förälskade han sig i elektronik. Han reparerade radioapparater, byggde PA-anläggningar för bondemöten, och öppnade Fender's Radio Service i Fullerton 1938.",
        "När han började bygga gitarrer gjorde han det med en ingenjörs blick. Bort med komplicerat snickeri. In med skruvade halsar, massproducerbara delar och pickuper som tålde stryk. Telecastern (1950) var den första solid-body-elgitarren någon byggde i skala. Stratocastern kom fyra år senare. Bluesfolket behövde inte övertalas.",
      ],
      de: [
        "Clarence Leo Fender wuchs auf einer Zitrusfarm bei Anaheim auf. Als Teenager verlor er das Augenlicht auf einem Auge — angeblich der Grund, warum er selbst nie Gitarre spielte. Er verliebte sich stattdessen in Elektronik. Er reparierte Radios, baute PA-Anlagen für Farmtreffen und eröffnete 1938 in Fullerton Fender's Radio Service.",
        "Als er anfing, Gitarren zu bauen, tat er es mit dem Blick eines Ingenieurs. Keine aufwendige Schreinerei. Verschraubte Hälse, serientaugliche Teile, Pickups, die etwas aushielten. Die Telecaster (1950) war die erste E-Gitarre mit Solidbody, die jemand in Serie baute. Vier Jahre später kam die Stratocaster. Die Bluesleute musste man nicht überreden.",
      ],
    },
    anecdotes: {
      no: [
        "Han testet hver eneste prototype ved å la kunder spille på den i butikken — og notere hva de klagde på. Hver klage ble en justering.",
        "Han solgte Fender til CBS i 1965 for 13 millioner dollar fordi han trodde han var dødssyk. Han var ikke det. Han levde 26 år til og startet Music Man og senere G&L — fortsatt på leting etter den perfekte halsen.",
        "Albert Collins kalte Telecasteren sin «The Master of the Telecaster». Tittelen klistret seg.",
      ],
      en: [
        "He tested every prototype by letting customers play it in the shop — and noting what they complained about. Every complaint became a tweak.",
        "He sold Fender to CBS in 1965 for 13 million dollars because he thought he was dying. He wasn't. He lived another 26 years and started Music Man and later G&L — still chasing the perfect neck.",
        "Albert Collins called his Telecaster 'The Master of the Telecaster'. The title stuck.",
      ],
      sv: [
        "Han testade varje prototyp genom att låta kunderna spela på den i butiken — och antecknade vad de klagade på. Varje klagomål blev en justering.",
        "Han sålde Fender till CBS 1965 för 13 miljoner dollar för att han trodde han skulle dö. Det skulle han inte. Han levde 26 år till och startade Music Man och senare G&L — fortfarande på jakt efter den perfekta halsen.",
        "Albert Collins kallade sin Telecaster för «The Master of the Telecaster». Titeln satt.",
      ],
      de: [
        "Er testete jeden Prototyp, indem er Kunden im Laden darauf spielen ließ — und notierte, worüber sie sich beschwerten. Jede Beschwerde wurde zu einer Anpassung.",
        "Er verkaufte Fender 1965 für 13 Millionen Dollar an CBS, weil er glaubte, er sei todkrank. War er nicht. Er lebte noch 26 Jahre und gründete Music Man und später G&L — immer auf der Suche nach dem perfekten Hals.",
        "Albert Collins nannte seine Telecaster „The Master of the Telecaster“. Der Titel blieb hängen.",
      ],
    },
    links: [
      { label: "Fender Company History", url: "https://www.fender.com/articles/behind-the-scenes/the-fender-story" },
      { label: "Leo Fender (Wikipedia)", url: "https://en.wikipedia.org/wiki/Leo_Fender" },
    ],
  },

  "fender-amps": {
    brandId: "fender-amps",
    name: "Leo Fender",
    years: "1909–1991",
    birthplace: "Anaheim, California",
    image: wm("Clarence Leo Fender, Guitar Design File (49532200938).jpg"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Clarence Leo Fender, Guitar Design File (49532200938).jpg"),
    title: {
      no: "Mannen som tegnet stemmen til Chicago-bluesen",
      en: "The man who drew the voice of Chicago blues",
      sv: "Mannen som ritade Chicago-bluesens röst",
      de: "Der Mann, der dem Chicago-Blues seine Stimme zeichnete",
    },
    lede: {
      no: "Forsterkerne hans var ment for jazz og country. Bluesfolket bestemte noe annet.",
      en: "His amps were meant for jazz and country. The blues crowd had other ideas.",
      sv: "Hans förstärkare var tänkta för jazz och country. Bluesfolket hade andra planer.",
      de: "Seine Verstärker waren für Jazz und Country gedacht. Die Blues-Leute hatten andere Pläne.",
    },
    bio: {
      no: [
        "Mens gitarverkstedet vokste, satt Leo Fender og tegnet kretskort. Tweed-serien — Champ, Deluxe, Bassman — kom ut av samme verksted i Fullerton, samme håndskrift, samme prinsipp: enkelt, robust, reparerbart.",
        "Bassman 5F6-A fra 1957 var egentlig en bassforsterker. Den fant raskt en annen jobb: blues- og rockegitarister oppdaget at den knurret nydelig når man skrudde den opp. Jim Marshall studerte kretsen, kopierte mye, og bygde sin første JTM45 på samme grunnplan.",
      ],
      en: [
        "While the guitar shop grew, Leo Fender sat down and drew circuit boards. The tweed series — Champ, Deluxe, Bassman — came out of the same Fullerton workshop, the same handwriting, the same principle: simple, rugged, repairable.",
        "The 1957 Bassman 5F6-A was meant for bass. It quickly found another day job: blues and rock guitarists discovered it growled beautifully when pushed. Jim Marshall studied the circuit, borrowed a lot of it, and built his first JTM45 on the same blueprint.",
      ],
      sv: [
        "Medan gitarrverkstaden växte satt Leo Fender och ritade kretskort. Tweed-serien — Champ, Deluxe, Bassman — kom ur samma verkstad i Fullerton, samma handstil, samma princip: enkelt, robust, reparerbart.",
        "Bassman 5F6-A från 1957 var egentligen en basförstärkare. Den fick snabbt ett annat jobb: blues- och rockgitarrister upptäckte att den morrade vackert när man drog upp den. Jim Marshall studerade kretsen, lånade mycket, och byggde sin första JTM45 på samma underlag.",
      ],
      de: [
        "Während die Gitarrenwerkstatt wuchs, saß Leo Fender da und zeichnete Schaltpläne. Die Tweed-Serie — Champ, Deluxe, Bassman — entstand in derselben Werkstatt in Fullerton, derselben Handschrift, demselben Prinzip: simpel, robust, reparierbar.",
        "Der Bassman 5F6-A von 1957 war eigentlich ein Bassverstärker. Er fand schnell einen anderen Job: Blues- und Rockgitarristen entdeckten, dass er wunderbar knurrte, wenn man ihn aufdrehte. Jim Marshall studierte die Schaltung, lieh sich vieles und baute seinen ersten JTM45 auf demselben Plan.",
      ],
    },
    anecdotes: {
      no: [
        "En tweed Bassman fra 50-tallet kan i dag selges for prisen av en bil. Den ble en gang solgt brukt for 75 dollar i Memphis.",
        "Stevie Ray Vaughan spilte ofte gjennom flere Fender Vibroverb side-om-side fordi han ville ha lyden uten å gå gjennom mikrofonstativene først.",
      ],
      en: [
        "A 1950s tweed Bassman can now sell for the price of a car. It once changed hands secondhand in Memphis for 75 dollars.",
        "Stevie Ray Vaughan often ran several Fender Vibroverbs side by side because he wanted the sound to be in the room before it hit a microphone.",
      ],
      sv: [
        "En tweed Bassman från 50-talet kan idag säljas för priset av en bil. Den bytte en gång ägare begagnad i Memphis för 75 dollar.",
        "Stevie Ray Vaughan körde ofta flera Fender Vibroverb sida vid sida för att han ville ha ljudet i rummet innan det nådde mikrofonen.",
      ],
      de: [
        "Ein Tweed-Bassman aus den 50ern bringt heute den Preis eines Autos. Er wechselte einmal in Memphis gebraucht für 75 Dollar den Besitzer.",
        "Stevie Ray Vaughan stellte oft mehrere Fender Vibroverbs nebeneinander, weil er den Klang im Raum haben wollte, bevor er ein Mikrofon erreichte.",
      ],
    },
    links: [
      { label: "Fender Amplifier History", url: "https://www.fender.com/amps" },
      { label: "Fender Tweed Bassman (Wikipedia)", url: "https://en.wikipedia.org/wiki/Fender_Bassman" },
    ],
  },

  gibson: {
    brandId: "gibson",
    name: "Orville Gibson",
    years: "1856–1918",
    birthplace: "Chateaugay, New York",
    image: wm("Orville Gibson pre-1910.jpg"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Orville Gibson pre-1910.jpg"),
    title: {
      no: "Skomakeren som snekret bluesens hjerteinstrument",
      en: "The shoemaker who carved blues' heart instrument",
      sv: "Skomakaren som täljde bluesens hjärtinstrument",
      de: "Der Schuhmacher, der das Herzinstrument des Blues schnitzte",
    },
    lede: {
      no: "Orville snekret mandoliner på fritiden. Hundre år senere er navnet hans graveret i kroppen til hver eneste BB King-platå.",
      en: "Orville carved mandolins in his spare time. A hundred years later his name is etched into the body of every BB King record ever cut.",
      sv: "Orville täljde mandoliner på fritiden. Hundra år senare är hans namn inristat i kroppen på varje BB King-skiva som spelats in.",
      de: "Orville schnitzte in seiner Freizeit Mandolinen. Hundert Jahre später ist sein Name in den Korpus jeder B.B.-King-Platte eingraviert.",
    },
    bio: {
      no: [
        "Orville Gibson jobbet som skomaker og restaurantmedarbeider i Kalamazoo, Michigan, mens han på kveldene snekret mandoliner og gitarer i et lite verksted. Hans innovasjon — å skjære lokket og bunnen ut av massivt tre i stedet for å bøye tynne plater — var radikalt for tiden. Det ga instrumentet større volum og en helt egen klang.",
        "Han etablerte Gibson Mandolin-Guitar Mfg. Co. i 1902. Han var med kort tid før helsen sviktet. Selskapet kjørte videre uten ham, men prinsippet hans — utskåret topp, kraftigere stemme — ble fundamentet for ES-150 (1936), den første store elektriske gitaren, og senere ES-335 og Les Paul.",
      ],
      en: [
        "Orville Gibson worked as a shoemaker and restaurant clerk in Kalamazoo, Michigan, while at night he carved mandolins and guitars in a small workshop. His innovation — carving the top and back out of solid wood instead of bending thin plates — was radical for the time. It gave the instrument more volume and a sound of its own.",
        "He set up Gibson Mandolin-Guitar Mfg. Co. in 1902. He was only involved briefly before his health failed. The company kept going without him, but his principle — carved top, bigger voice — became the foundation for the ES-150 (1936), the first major electric guitar, and later the ES-335 and Les Paul.",
      ],
      sv: [
        "Orville Gibson arbetade som skomakare och restaurangbiträde i Kalamazoo, Michigan, medan han på kvällarna täljde mandoliner och gitarrer i en liten verkstad. Hans innovation — att tälja ut lock och botten ur massivt trä istället för att böja tunna skivor — var radikal för tiden. Det gav instrumentet större volym och ett eget ljud.",
        "Han etablerade Gibson Mandolin-Guitar Mfg. Co. 1902. Han var bara med en kort tid innan hälsan svek. Företaget körde vidare utan honom, men hans princip — utskuren topp, kraftigare röst — blev grunden för ES-150 (1936), den första stora elgitarren, och senare ES-335 och Les Paul.",
      ],
      de: [
        "Orville Gibson arbeitete als Schuhmacher und Restaurantgehilfe in Kalamazoo, Michigan, während er nachts in einer kleinen Werkstatt Mandolinen und Gitarren schnitzte. Seine Innovation — Decke und Boden aus massivem Holz herauszuschnitzen, statt dünne Platten zu biegen — war für die Zeit radikal. Sie gab dem Instrument mehr Volumen und einen eigenen Klang.",
        "1902 gründete er die Gibson Mandolin-Guitar Mfg. Co. Er war nur kurz dabei, dann ließ die Gesundheit nach. Die Firma machte ohne ihn weiter, aber sein Prinzip — geschnitzte Decke, größerer Klang — wurde das Fundament für die ES-150 (1936), die erste bedeutende E-Gitarre, und später ES-335 und Les Paul.",
      ],
    },
    anecdotes: {
      no: [
        "BB King kalte gitaren sin Lucille etter en barslagsmål i 1949: to menn slåss om en kvinne ved navn Lucille, en oljelampe veltet, hallen tok fyr. BB løp tilbake inn for å redde Gibson-en sin. Hver Gibson han eide etter det fikk navnet Lucille.",
        "Les Paul-modellen er oppkalt etter Les Paul selv, jazzgitaristen som overtalte Gibson til å bygge en solid-body etter at Fender hadde gjort det først. Den ble lansert i 1952 og lagt ned i 1960 — så gjenoppstanden i 1968 da Eric Clapton og Peter Green gjorde den uunngåelig.",
      ],
      en: [
        "BB King named his guitar Lucille after a 1949 bar fight: two men were fighting over a woman called Lucille, a kerosene heater tipped over, the hall caught fire. BB ran back in to save his Gibson. Every Gibson he owned after that was named Lucille.",
        "The Les Paul is named after Les Paul himself, the jazz guitarist who talked Gibson into building a solid-body after Fender had already done it. Launched in 1952, dropped in 1960, then resurrected in 1968 when Eric Clapton and Peter Green made it inescapable.",
      ],
      sv: [
        "BB King döpte sin gitarr till Lucille efter ett barslagsmål 1949: två män slogs om en kvinna som hette Lucille, en fotogenkamin välte, lokalen tog eld. BB sprang tillbaka in för att rädda sin Gibson. Varje Gibson han ägde efter det fick namnet Lucille.",
        "Les Paul-modellen är döpt efter Les Paul själv, jazzgitarristen som övertalade Gibson att bygga en solid-body efter att Fender redan gjort det. Lanserad 1952, lades ner 1960, återuppstod 1968 när Eric Clapton och Peter Green gjorde den oundviklig.",
      ],
      de: [
        "B.B. King taufte seine Gitarre Lucille nach einer Kneipenschlägerei 1949: Zwei Männer stritten um eine Frau namens Lucille, ein Petroleumofen kippte um, der Saal brannte. B.B. lief zurück, um seine Gibson zu retten. Jede Gibson, die er danach besaß, hieß Lucille.",
        "Die Les Paul ist nach Les Paul selbst benannt, dem Jazzgitarristen, der Gibson überredete, eine Solidbody zu bauen, nachdem Fender es schon getan hatte. 1952 vorgestellt, 1960 eingestellt, 1968 wiederbelebt, als Eric Clapton und Peter Green sie unausweichlich machten.",
      ],
    },
    links: [
      { label: "Gibson History", url: "https://www.gibson.com/en-US/Gibson-Garage" },
      { label: "Orville Gibson (Wikipedia)", url: "https://en.wikipedia.org/wiki/Orville_Gibson" },
    ],
  },

  martin: {
    brandId: "martin",
    name: "C. F. Martin Sr.",
    years: "1796–1873",
    birthplace: "Markneukirchen, Sachsen / Saxony",
    image: wm("Christian Frederick Martin.jpg"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Christian Frederick Martin.jpg"),
    title: {
      no: "Den tyske snekkeren som ble Deltas stille fundament",
      en: "The German cabinetmaker who became the Delta's quiet foundation",
      sv: "Den tyske möbelsnickaren som blev Deltats tysta fundament",
      de: "Der deutsche Tischler, der zum stillen Fundament des Delta wurde",
    },
    lede: {
      no: "Han flyktet fra en gildekrangel i Sachsen. På et tak i Pennsylvania snekret han instrumentet bluesen lærte å hviske med.",
      en: "He fled a guild dispute in Saxony. In a Pennsylvania workshop he built the instrument the blues learned to whisper with.",
      sv: "Han flydde en skråtvist i Sachsen. På en verkstad i Pennsylvania byggde han instrumentet bluesen lärde sig att viska med.",
      de: "Er floh aus einem Zunftstreit in Sachsen. In einer Werkstatt in Pennsylvania baute er das Instrument, mit dem der Blues flüstern lernte.",
    },
    bio: {
      no: [
        "Christian Frederick Martin lærte gitarbygging i Wien. I Tyskland sto snekker- og fiolinmaker-gildet i strupen på ham — de mente gitarbyggere ikke hadde rett til å lage gitarer. Han ga opp og dro til New York i 1833, og flyttet snart videre til Nazareth, Pennsylvania.",
        "Der ble Martin Guitars født. X-bracing — krysstrebenene under lokket — var Martins innovasjon, og er fortsatt grunnen til at en akustisk Martin høres ut som den gjør: åpen, balansert, med en bass som bærer uten å dominere. Robert Johnson, Lightnin' Hopkins, Mississippi John Hurt — alle spilte små Martin-er i 00- og 000-størrelse.",
      ],
      en: [
        "Christian Frederick Martin trained as a guitar maker in Vienna. Back in Germany the cabinetmakers' guild had him by the throat — they argued guitar builders had no right to make guitars. He gave up and sailed for New York in 1833, soon moving to Nazareth, Pennsylvania.",
        "There Martin Guitars was born. X-bracing — the cross struts under the top — was Martin's innovation, and it's still why an acoustic Martin sounds the way it does: open, balanced, with a bass that carries without dominating. Robert Johnson, Lightnin' Hopkins, Mississippi John Hurt — they all played small Martins in 00 and 000 sizes.",
      ],
      sv: [
        "Christian Frederick Martin lärde sig gitarrbyggeri i Wien. I Tyskland höll möbelsnickarskrået honom i strupen — de menade att gitarrbyggare inte hade rätt att tillverka gitarrer. Han gav upp och seglade till New York 1833, flyttade snart vidare till Nazareth, Pennsylvania.",
        "Där föddes Martin Guitars. X-bracing — krossträvorna under locket — var Martins innovation, och är fortfarande skälet till att en akustisk Martin låter som den gör: öppen, balanserad, med en bas som bär utan att dominera. Robert Johnson, Lightnin' Hopkins, Mississippi John Hurt — alla spelade små Martins i 00- och 000-storlek.",
      ],
      de: [
        "Christian Frederick Martin lernte den Gitarrenbau in Wien. In Deutschland hatte ihn die Tischlerzunft an der Kehle — sie argumentierte, Gitarrenbauer hätten kein Recht, Gitarren zu bauen. Er gab auf und segelte 1833 nach New York, zog bald weiter nach Nazareth, Pennsylvania.",
        "Dort entstand Martin Guitars. X-Bracing — die Kreuzleisten unter der Decke — war Martins Erfindung und ist immer noch der Grund, warum eine akustische Martin so klingt, wie sie klingt: offen, ausgewogen, mit einem Bass, der trägt ohne zu dominieren. Robert Johnson, Lightnin' Hopkins, Mississippi John Hurt — sie alle spielten kleine Martins in 00- und 000-Größe.",
      ],
    },
    anecdotes: {
      no: [
        "Selskapet er fortsatt familieeid i sjette generasjon. Det er knapt et annet gitarmerke i verden som kan si det samme.",
        "Eric Claptons Unplugged-konsert i 1992 ble spilt på en Martin 000-42. Etterpå solgte Martin så mange kopier at de måtte bygge en ny modell rundt etterspørselen.",
      ],
      en: [
        "The company is still family-owned, six generations in. Barely another guitar brand in the world can say the same.",
        "Eric Clapton's 1992 Unplugged was played on a Martin 000-42. Afterwards Martin sold so many copies they had to build a new model around the demand.",
      ],
      sv: [
        "Företaget är fortfarande familjeägt, sex generationer in. Knappt något annat gitarrmärke i världen kan säga detsamma.",
        "Eric Claptons Unplugged 1992 spelades på en Martin 000-42. Efteråt sålde Martin så många kopior att de fick bygga en ny modell kring efterfrågan.",
      ],
      de: [
        "Die Firma ist in der sechsten Generation noch immer in Familienbesitz. Kaum eine andere Gitarrenmarke der Welt kann das sagen.",
        "Eric Claptons Unplugged 1992 wurde auf einer Martin 000-42 gespielt. Danach verkaufte Martin so viele Kopien, dass um die Nachfrage herum ein neues Modell entstand.",
      ],
    },
    links: [
      { label: "Martin Guitar — History", url: "https://www.martinguitar.com/history/" },
      { label: "C. F. Martin & Company (Wikipedia)", url: "https://en.wikipedia.org/wiki/C._F._Martin_%26_Company" },
    ],
  },

  national: {
    brandId: "national",
    name: "John Dopyera",
    years: "1893–1988",
    birthplace: "Trnava, Slovakia",
    title: {
      no: "Slovakeren som bygde gitaren høyere enn et helt orkester",
      en: "The Slovak who built a guitar louder than a whole orchestra",
      sv: "Slovaken som byggde gitarren starkare än en hel orkester",
      de: "Der Slowake, der eine Gitarre lauter als ein ganzes Orchester baute",
    },
    lede: {
      no: "Han fikk en umulig bestilling: en gitar som kunne overdøve et big band. Han løste det med en aluminiumskon.",
      en: "He was handed an impossible commission: a guitar loud enough to cut through a big band. He solved it with an aluminium cone.",
      sv: "Han fick en omöjlig beställning: en gitarr som kunde överrösta ett storband. Han löste det med en aluminiumkon.",
      de: "Er bekam einen unmöglichen Auftrag: eine Gitarre, die sich gegen eine Bigband durchsetzt. Er löste es mit einem Aluminiumkonus.",
    },
    bio: {
      no: [
        "John Dopyera (uttalt do-PYAIR-uh) emigrerte fra Slovakia til Los Angeles og åpnet et fioliverksted. På 1920-tallet fikk han bestillingen som forandret livet hans: vaudeville-gitaristen George Beauchamp ville ha en gitar som kunne høres over et fullt jazzorkester — strøm fantes ennå ikke som løsning.",
        "John og brødrene hans utviklet resonatorgitaren: aluminiumskoner i kroppen som forsterket strengevibrasjonene mekanisk. National String Instrument Corporation ble grunnlagt i 1927. Da han senere kranglet med Beauchamp, brøt han ut og startet Dobro — navnet er et ordspill på bror på slovakisk og det engelske ordet for 'godt'.",
      ],
      en: [
        "John Dopyera (pronounced do-PYAIR-uh) emigrated from Slovakia to Los Angeles and opened a violin shop. In the 1920s he got the commission that changed his life: vaudeville guitarist George Beauchamp wanted a guitar loud enough to be heard over a full jazz orchestra — amplification didn't yet exist as an option.",
        "John and his brothers developed the resonator guitar: aluminium cones inside the body that mechanically amplified the strings. The National String Instrument Corporation was founded in 1927. After a falling out with Beauchamp, he broke away and started Dobro — the name a pun on Slovak for 'brother' and the English word 'good'.",
      ],
      sv: [
        "John Dopyera (uttalas do-PYAIR-uh) emigrerade från Slovakien till Los Angeles och öppnade en fiolverkstad. På 1920-talet fick han beställningen som förändrade hans liv: vaudeville-gitarristen George Beauchamp ville ha en gitarr som hördes över ett fullt jazzorkester — förstärkning fanns ännu inte som alternativ.",
        "John och hans bröder utvecklade resonatorgitarren: aluminiumkoner inne i kroppen som mekaniskt förstärkte strängarnas vibrationer. National String Instrument Corporation grundades 1927. Efter en konflikt med Beauchamp bröt han ut och startade Dobro — namnet en ordlek på slovakiska för 'bror' och engelska 'good'.",
      ],
      de: [
        "John Dopyera (gesprochen do-PYAIR-uh) wanderte aus der Slowakei nach Los Angeles aus und eröffnete eine Geigenwerkstatt. In den 1920ern bekam er den Auftrag, der sein Leben veränderte: Der Vaudeville-Gitarrist George Beauchamp wollte eine Gitarre, die sich gegen ein ganzes Jazzorchester durchsetzt — Verstärkung gab es noch nicht.",
        "John und seine Brüder entwickelten die Resonator-Gitarre: Aluminiumkonusse im Korpus, die die Saitenschwingungen mechanisch verstärkten. 1927 wurde die National String Instrument Corporation gegründet. Nach einem Streit mit Beauchamp brach er aus und gründete Dobro — der Name ein Wortspiel auf slowakisch „Bruder“ und englisch „good“.",
      ],
    },
    anecdotes: {
      no: [
        "Son House spilte en National Style O på Paramount-innspillingene fra 1930. Den fysiske gitaren — bruktkjøpt — er fortsatt sporløst forsvunnet.",
        "Bukka White brukte gitaren som perkusjon, banket på metallplata mens han spilte slide. Det er en lyd ingen pickup har klart å gjenskape siden.",
      ],
      en: [
        "Son House played a National Style O on the 1930 Paramount sessions. The physical guitar — bought secondhand — has never been traced.",
        "Bukka White used the body as percussion, slapping the metal plate while playing slide. No pickup since has reproduced that sound.",
      ],
      sv: [
        "Son House spelade en National Style O på Paramount-inspelningarna 1930. Själva gitarren — köpt begagnad — har aldrig återfunnits.",
        "Bukka White använde kroppen som slagverk och slog på metallplattan medan han spelade slide. Ingen pickup sedan dess har återgett det ljudet.",
      ],
      de: [
        "Son House spielte bei den Paramount-Sessions 1930 eine National Style O. Die Gitarre — gebraucht gekauft — wurde nie wieder gefunden.",
        "Bukka White benutzte den Korpus als Perkussion und schlug die Metallplatte, während er Slide spielte. Kein Pickup hat diesen Klang seither reproduziert.",
      ],
    },
    links: [
      { label: "National Reso-Phonic", url: "https://www.nationalguitars.com" },
      { label: "John Dopyera (Wikipedia)", url: "https://en.wikipedia.org/wiki/John_Dopyera" },
    ],
  },

  marshall: {
    brandId: "marshall",
    name: "Jim Marshall",
    years: "1923–2012",
    birthplace: "Kensington, London",
    image: wm("Jim Marshall at Summer NAMM 2007.jpg"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Jim Marshall at Summer NAMM 2007.jpg"),
    title: {
      no: "Trommelæreren fra Hanwell som ga britisk blues sin brøl",
      en: "The Hanwell drum teacher who gave British blues its roar",
      sv: "Trumläraren från Hanwell som gav brittisk blues sitt rytande",
      de: "Der Schlagzeuglehrer aus Hanwell, der dem britischen Blues sein Brüllen gab",
    },
    lede: {
      no: "Han var sanger. Han var trommelærer. Han åpnet en butikk. Da kundene ba om en høyere amerikansk forsterker, bygde han noe britisk i stedet.",
      en: "He was a singer. He was a drum teacher. He opened a shop. When his customers asked for a louder American amp, he built something British instead.",
      sv: "Han var sångare. Han var trumlärare. Han öppnade en butik. När hans kunder bad om en starkare amerikansk förstärkare byggde han något brittiskt istället.",
      de: "Er war Sänger. Er war Schlagzeuglehrer. Er eröffnete einen Laden. Als seine Kunden nach einem lauteren amerikanischen Verstärker fragten, baute er stattdessen etwas Britisches.",
    },
    bio: {
      no: [
        "Jim Marshall vokste opp i tuberkuloseterapi — han tilbrakte mesteparten av barndommen i et stivt korsett. Som ung mann sang han med danseband, tjente skikkelig på det, og brukte fortjenesten til å åpne en musikkbutikk i Hanwell, vest i London, i 1960.",
        "Trommer var hovedforretningen, men gitaristene som kom innom — en del av dem unge gutter ved navn Pete Townshend og Ritchie Blackmore — klagde over at de amerikanske forsterkerne var for dyre og ikke høye nok. Marshall slo seg sammen med teknikeren Ken Bran og bygde JTM45 i 1962. Den var åpenbart inspirert av Fender Bassman, men med britiske KT66-rør og en ny preamp-design som ga den et helt annet temperament: kvassere, sintere, mer kompromissløs.",
      ],
      en: [
        "Jim Marshall grew up in TB treatment — he spent most of his childhood in a rigid brace. As a young man he sang with dance bands, earned good money doing it, and used the takings to open a music shop in Hanwell, west London, in 1960.",
        "Drums were the main trade, but the guitarists coming in — among them young men called Pete Townshend and Ritchie Blackmore — complained the American amps were too expensive and not loud enough. Marshall teamed up with engineer Ken Bran and built the JTM45 in 1962. It was obviously inspired by the Fender Bassman, but with British KT66 valves and a fresh preamp design that gave it a different temperament: brighter, angrier, less compromising.",
      ],
      sv: [
        "Jim Marshall växte upp i tuberkulosbehandling — han tillbringade största delen av barndomen i en stel korsett. Som ung sjöng han med dansband, tjänade bra på det, och använde inkomsten för att öppna en musikaffär i Hanwell, västra London, 1960.",
        "Trummor var huvudaffären, men gitarristerna som kom in — bland dem unga män vid namn Pete Townshend och Ritchie Blackmore — klagade på att de amerikanska förstärkarna var för dyra och inte tillräckligt starka. Marshall slog sig ihop med teknikern Ken Bran och byggde JTM45 1962. Den var uppenbart inspirerad av Fender Bassman, men med brittiska KT66-rör och en ny preamp-design som gav den ett annat temperament: ljusare, argare, mer kompromisslös.",
      ],
      de: [
        "Jim Marshall wuchs in Tuberkulose-Behandlung auf — er verbrachte einen Großteil seiner Kindheit in einem starren Korsett. Als junger Mann sang er mit Tanzbands, verdiente gut damit, und nutzte das Geld, um 1960 in Hanwell im Westen Londons einen Musikladen zu eröffnen.",
        "Schlagzeug war das Hauptgeschäft, aber die Gitarristen, die hereinkamen — darunter junge Männer namens Pete Townshend und Ritchie Blackmore — beklagten sich, die amerikanischen Verstärker seien zu teuer und nicht laut genug. Marshall tat sich mit dem Techniker Ken Bran zusammen und baute 1962 den JTM45. Er war offensichtlich vom Fender Bassman inspiriert, hatte aber britische KT66-Röhren und ein neues Preamp-Design, das ihm ein anderes Temperament gab: heller, böser, kompromissloser.",
      ],
    },
    anecdotes: {
      no: [
        "Da Eric Clapton spilte inn Blues Breakers with Eric Clapton (Beano-platen) i 1966, brukte han en Marshall 1962-combo skrudd helt opp og en Les Paul som var lånt. Lyden ble standardlyden for britisk blues og gav modellen sitt evige kallenavn: Bluesbreaker.",
        "JTM-initialene står for Jim and Terry Marshall — sønnen hans. Familien var stadig involvert i firmaet helt til Jim gikk bort i 2012.",
      ],
      en: [
        "When Eric Clapton recorded Blues Breakers with Eric Clapton (the Beano album) in 1966, he used a Marshall 1962 combo cranked flat out and a borrowed Les Paul. The sound became the British blues standard, and gave the model its permanent nickname: Bluesbreaker.",
        "The JTM initials stand for Jim and Terry Marshall — his son. The family stayed involved with the company right up until Jim's death in 2012.",
      ],
      sv: [
        "När Eric Clapton spelade in Blues Breakers with Eric Clapton (Beano-plattan) 1966 använde han en Marshall 1962-combo skruvad i botten och en lånad Les Paul. Ljudet blev standarden för brittisk blues, och gav modellen sitt eviga smeknamn: Bluesbreaker.",
        "JTM-initialerna står för Jim och Terry Marshall — hans son. Familjen var med i företaget ända fram till Jims död 2012.",
      ],
      de: [
        "Als Eric Clapton 1966 Blues Breakers with Eric Clapton (das Beano-Album) aufnahm, benutzte er einen voll aufgedrehten Marshall 1962 Combo und eine geliehene Les Paul. Der Klang wurde zum Standard des britischen Blues und gab dem Modell seinen ewigen Spitznamen: Bluesbreaker.",
        "Die Initialen JTM stehen für Jim und Terry Marshall — sein Sohn. Die Familie blieb bis zu Jims Tod 2012 im Unternehmen aktiv.",
      ],
    },
    links: [
      { label: "Marshall Amplification", url: "https://www.marshallamps.com" },
      { label: "Jim Marshall (Wikipedia)", url: "https://en.wikipedia.org/wiki/Jim_Marshall_(businessman)" },
    ],
  },

  vox: {
    brandId: "vox",
    name: "Tom Jennings",
    years: "1917–1978",
    birthplace: "Dartford, Kent, England",
    title: {
      no: "Trekkspillmannen som ga 60-tallet sin chime",
      en: "The accordion man who gave the sixties their chime",
      sv: "Dragspelsmannen som gav 60-talet sin chime",
      de: "Der Akkordeon-Mann, der den Sechzigern ihren Chime gab",
    },
    lede: {
      no: "Tom Jennings ville bygge orgler. Det han bygde i stedet ble lyden av britisk pop og britisk blues.",
      en: "Tom Jennings wanted to build organs. What he built instead became the sound of British pop and British blues.",
      sv: "Tom Jennings ville bygga orglar. Det han byggde istället blev ljudet av brittisk pop och brittisk blues.",
      de: "Tom Jennings wollte Orgeln bauen. Was er stattdessen baute, wurde der Klang britischer Pop- und Bluesmusik.",
    },
    bio: {
      no: [
        "Tom Jennings drev Jennings Musical Industries (JMI) i Dartford og solgte trekkspill og elektroniske orgler. Da rocken og R&B-en kom inn i butikken på slutten av 50-tallet, satte han teknikeren Dick Denney til å designe en gitarforsterker. Resultatet var AC15 i 1958 — og kort tid etter, AC30, en større tobents combo med fire 12-tommers EL84-rør og en helt egen klangkarakter: lys, klingende, full av topp.",
        "AC30 fanget gitaren til The Shadows, så Beatles, så hele British Blues Boom. Den hadde et helt annet rom enn Fender og Marshall — mindre tweed, mer kor.",
      ],
      en: [
        "Tom Jennings ran Jennings Musical Industries (JMI) in Dartford selling accordions and electronic organs. When rock and R&B walked into the shop in the late fifties, he set engineer Dick Denney to design a guitar amp. The result was the AC15 in 1958 — and shortly after, the AC30, a bigger two-channel combo with four 12-inch speakers and EL84 valves, with a character all its own: bright, chimey, full of top end.",
        "The AC30 caught the guitar of The Shadows, then the Beatles, then the whole British Blues Boom. It lived in a different room from Fender and Marshall — less tweed, more choir.",
      ],
      sv: [
        "Tom Jennings drev Jennings Musical Industries (JMI) i Dartford och sålde dragspel och elektroniska orglar. När rocken och R&B:n kom in i butiken på sena 50-talet satte han teknikern Dick Denney att designa en gitarrförstärkare. Resultatet blev AC15 1958 — och kort därefter AC30, en större tvåkanalig combo med fyra 12-tums högtalare och EL84-rör, med en helt egen karaktär: ljus, klingande, full av diskant.",
        "AC30 fångade The Shadows gitarr, sedan Beatles, sedan hela British Blues Boom. Den bodde i ett annat rum än Fender och Marshall — mindre tweed, mer kör.",
      ],
      de: [
        "Tom Jennings führte Jennings Musical Industries (JMI) in Dartford und verkaufte Akkordeons und elektronische Orgeln. Als Ende der 50er Rock und R&B in den Laden kamen, beauftragte er den Techniker Dick Denney mit dem Bau eines Gitarrenverstärkers. Das Ergebnis war 1958 der AC15 — und kurz danach der AC30, ein größerer Zweikanal-Combo mit vier 12-Zoll-Lautsprechern und EL84-Röhren, mit einem ganz eigenen Charakter: hell, glockig, voller Höhen.",
        "Der AC30 prägte die Gitarre der Shadows, dann die der Beatles, dann den ganzen British Blues Boom. Er lebte in einem anderen Raum als Fender und Marshall — weniger Tweed, mehr Chor.",
      ],
    },
    anecdotes: {
      no: [
        "Brian May satte to AC30 i serie og gjorde den til Queens hovedlyd — men det var den unge John Mayall som først viste at AC30 også kunne synge blues.",
        "JMI gikk konkurs i 1968. Vox-navnet skiftet eier flere ganger, men AC30-kretsen har overlevd det meste — den lages fortsatt.",
      ],
      en: [
        "Brian May stacked two AC30s in series and made it Queen's signature voice — but it was the young John Mayall who first proved an AC30 could sing the blues.",
        "JMI went bankrupt in 1968. The Vox name has changed hands several times since, but the AC30 circuit has outlived most of them — it is still being built.",
      ],
      sv: [
        "Brian May staplade två AC30 i serie och gjorde den till Queens signaturröst — men det var den unge John Mayall som först visade att en AC30 kunde sjunga blues.",
        "JMI gick i konkurs 1968. Vox-namnet har bytt ägare flera gånger sedan dess, men AC30-kretsen har överlevt de flesta av dem — den byggs fortfarande.",
      ],
      de: [
        "Brian May stapelte zwei AC30 in Reihe und machte ihn zur Signaturstimme von Queen — aber es war der junge John Mayall, der zuerst bewies, dass ein AC30 auch Blues singen kann.",
        "JMI ging 1968 pleite. Der Name Vox wechselte seither mehrfach den Besitzer, aber die AC30-Schaltung hat die meisten überlebt — sie wird noch gebaut.",
      ],
    },
    links: [
      { label: "Vox Amplification", url: "https://www.voxamps.com" },
      { label: "Vox (Wikipedia)", url: "https://en.wikipedia.org/wiki/Vox_(company)" },
    ],
  },

  dumble: {
    brandId: "dumble",
    name: "Howard Alexander Dumble",
    years: "1944–2022",
    birthplace: "California, USA",
    title: {
      no: "Mannen som bygde drømmen for hånd og sjekket kunden først",
      en: "The man who hand-built the dream — and vetted the customer first",
      sv: "Mannen som handbyggde drömmen — och granskade kunden först",
      de: "Der Mann, der den Traum von Hand baute — und den Kunden zuerst prüfte",
    },
    lede: {
      no: "Han bygde færre forsterkere på et liv enn Fender bygger på en dag. Hver eneste én er nå mytisk.",
      en: "He built fewer amps in a lifetime than Fender builds in a day. Every one of them is now mythical.",
      sv: "Han byggde färre förstärkare under ett liv än Fender bygger på en dag. Var och en av dem är nu mytisk.",
      de: "Er baute in einem ganzen Leben weniger Verstärker als Fender an einem Tag. Jeder von ihnen ist heute Legende.",
    },
    bio: {
      no: [
        "Alexander 'Howard' Dumble begynte å modifisere Fender-forsterkere på 60-tallet i California. Han ble venn med Carlos Santana, deretter Robben Ford, Larry Carlton, Stevie Ray Vaughan — gitarister som ville ha noe mer enn fabrikkstandard. Dumble bygde det de spurte etter, ett kabinett av gangen, signert, nummerert, levert med en kontrakt som forbød videresalg uten hans samtykke.",
        "Han bygde aldri katalog. Han hadde ingen nettside. Han svarte ikke alltid på e-post. Anslagsvis 300 forsterkere ble bygd i hele hans karriere. En Dumble Overdrive Special selges i dag for 100 000 dollar og oppover.",
      ],
      en: [
        "Alexander 'Howard' Dumble began modifying Fender amps in 1960s California. He befriended Carlos Santana, then Robben Ford, Larry Carlton, Stevie Ray Vaughan — guitarists who wanted something beyond factory standard. Dumble built what they asked for, one cabinet at a time, signed, numbered, delivered with a contract forbidding resale without his consent.",
        "He never made a catalogue. He had no website. He didn't always answer email. An estimated 300 amps were built across his entire career. A Dumble Overdrive Special today sells for 100,000 dollars and up.",
      ],
      sv: [
        "Alexander 'Howard' Dumble började modifiera Fender-förstärkare på 60-talet i Kalifornien. Han blev vän med Carlos Santana, sedan Robben Ford, Larry Carlton, Stevie Ray Vaughan — gitarrister som ville ha något bortom fabriksstandard. Dumble byggde det de bad om, ett kabinett i taget, signerat, numrerat, levererat med ett kontrakt som förbjöd vidareförsäljning utan hans medgivande.",
        "Han gjorde aldrig någon katalog. Han hade ingen webbplats. Han svarade inte alltid på mejl. Uppskattningsvis 300 förstärkare byggdes under hela hans karriär. En Dumble Overdrive Special säljs idag för 100 000 dollar och uppåt.",
      ],
      de: [
        "Alexander „Howard“ Dumble begann in den 1960ern in Kalifornien Fender-Verstärker zu modifizieren. Er freundete sich mit Carlos Santana an, dann mit Robben Ford, Larry Carlton, Stevie Ray Vaughan — Gitarristen, die mehr wollten als Fabrikstandard. Dumble baute, was sie wünschten, ein Cabinet nach dem anderen, signiert, nummeriert, geliefert mit einem Vertrag, der den Weiterverkauf ohne seine Zustimmung untersagte.",
        "Er machte nie einen Katalog. Er hatte keine Website. Er beantwortete nicht immer E-Mails. Schätzungsweise 300 Verstärker entstanden in seiner gesamten Laufbahn. Ein Dumble Overdrive Special wird heute für 100.000 Dollar und mehr gehandelt.",
      ],
    },
    anecdotes: {
      no: [
        "Hver Dumble var støpt i epoxy innvendig for å hindre andre teknikere i å analysere kretsen. Folk har likevel kopiert ham — det finnes en hel undergrunnsindustri av Dumble-kloner.",
        "Stevie Ray Vaughans Steel String Singer-hode står fortsatt på Hard Rock Cafe-veggen et eller annet sted. Originalkretsen er aldri offentliggjort.",
      ],
      en: [
        "Every Dumble was potted in epoxy inside to stop other techs reverse-engineering the circuit. People have copied him anyway — there's a whole underground industry of Dumble clones.",
        "Stevie Ray Vaughan's Steel String Singer head still sits on a Hard Rock Cafe wall somewhere. The original schematic has never been published.",
      ],
      sv: [
        "Varje Dumble var ingjuten i epoxi invändigt för att hindra andra tekniker från att analysera kretsen. Folk har kopierat honom ändå — det finns en hel underjordisk industri av Dumble-kloner.",
        "Stevie Ray Vaughans Steel String Singer-topp står fortfarande på en Hard Rock Cafe-vägg någonstans. Originalschemat har aldrig publicerats.",
      ],
      de: [
        "Jeder Dumble war innen in Epoxidharz vergossen, damit andere Techniker die Schaltung nicht analysieren konnten. Trotzdem haben Leute ihn kopiert — es gibt eine ganze Untergrundindustrie an Dumble-Klonen.",
        "Der Steel String Singer Head von Stevie Ray Vaughan hängt noch irgendwo an einer Hard-Rock-Cafe-Wand. Der Originalschaltplan wurde nie veröffentlicht.",
      ],
    },
    links: [
      { label: "Alexander Dumble (Wikipedia)", url: "https://en.wikipedia.org/wiki/Dumble_Amplifiers" },
    ],
  },

  hohner: {
    brandId: "hohner",
    name: "Matthias Hohner",
    years: "1833–1902",
    birthplace: "Trossingen, Württemberg",
    title: {
      no: "Urmakeren som la munnspillet i lomma på hver eneste bluesmusiker",
      en: "The clockmaker who put a harmonica in every bluesman's pocket",
      sv: "Urmakaren som la ett munspel i fickan på varenda bluesman",
      de: "Der Uhrmacher, der jedem Bluesmann eine Mundharmonika in die Tasche steckte",
    },
    lede: {
      no: "I 1857 satt han hjemme på kjøkkenet i Trossingen og loddet sammen seks munnspill. Ti år senere eksporterte han over én million i året.",
      en: "In 1857 he sat at his kitchen table in Trossingen and soldered together six harmonicas. Ten years later he was exporting over a million a year.",
      sv: "1857 satt han vid sitt kökbord i Trossingen och lödde ihop sex munspel. Tio år senare exporterade han över en miljon om året.",
      de: "1857 saß er an seinem Küchentisch in Trossingen und lötete sechs Mundharmonikas zusammen. Zehn Jahre später exportierte er über eine Million im Jahr.",
    },
    bio: {
      no: [
        "Matthias Hohner var urmaker av yrke. Han kjøpte et munnspill av en nabo, plukket det fra hverandre, fant ut hvordan det fungerte, og begynte å lage egne. Han var ikke den første munnspilllageren i Tyskland, men han var den som forsto eksport — særlig til USA.",
        "Marine Band kom i 1896 og er fortsatt den mest spilte bluesharpemodellen i verden. Når Little Walter, Sonny Boy Williamson II, Big Walter Horton og Junior Wells valgte instrument, valgte de Marine Band. Tyske håndverkere bygde lyden av Chicago. Det er en historie få utenfor bluesverdenen tenker over.",
      ],
      en: [
        "Matthias Hohner was a clockmaker by trade. He bought a harmonica from a neighbour, took it apart, figured out how it worked, and started making his own. He wasn't the first harmonica maker in Germany, but he was the one who understood export — especially to the United States.",
        "Marine Band arrived in 1896 and remains the most-played blues harp in the world. When Little Walter, Sonny Boy Williamson II, Big Walter Horton and Junior Wells picked up an instrument, they picked up a Marine Band. German craftsmen built the sound of Chicago. It's a story few outside the blues world ever consider.",
      ],
      sv: [
        "Matthias Hohner var urmakare till yrket. Han köpte ett munspel av en granne, plockade isär det, listade ut hur det fungerade, och började tillverka egna. Han var inte den första munspelstillverkaren i Tyskland, men han var den som förstod export — särskilt till USA.",
        "Marine Band kom 1896 och är fortfarande den mest spelade bluesharpan i världen. När Little Walter, Sonny Boy Williamson II, Big Walter Horton och Junior Wells valde instrument valde de Marine Band. Tyska hantverkare byggde Chicagos ljud. Det är en historia få utanför bluesvärlden tänker på.",
      ],
      de: [
        "Matthias Hohner war von Beruf Uhrmacher. Er kaufte einem Nachbarn eine Mundharmonika ab, zerlegte sie, verstand wie sie funktionierte, und fing an, eigene zu bauen. Er war nicht der erste Mundharmonika-Hersteller in Deutschland, aber er war derjenige, der Export verstand — besonders in die USA.",
        "Die Marine Band erschien 1896 und ist bis heute die meistgespielte Bluesharp der Welt. Wenn Little Walter, Sonny Boy Williamson II, Big Walter Horton oder Junior Wells ein Instrument griffen, griffen sie zu einer Marine Band. Deutsche Handwerker bauten den Klang von Chicago. Eine Geschichte, die außerhalb der Bluesszene kaum jemand bedenkt.",
      ],
    },
    anecdotes: {
      no: [
        "Trossingen, Hohners hjemby, har fortsatt et museum og en høyskole for munnspill og trekkspill. Byen lever fremdeles delvis av instrumentet.",
        "President Lincoln spilte angivelig munnspill — Hohner sendte ham en, og han skal ha svart med å si at det var det «eneste rimelige gleden et menneske kan unne seg».",
      ],
      en: [
        "Trossingen, Hohner's home town, still has a harmonica and accordion museum and college. Part of the town still lives off the instrument.",
        "President Lincoln is said to have played harmonica — Hohner sent him one, and he reportedly replied that it was 'the only reasonable luxury a man can give himself'.",
      ],
      sv: [
        "Trossingen, Hohners hemstad, har fortfarande ett munspels- och dragspelsmuseum och en högskola. Delar av staden lever fortfarande av instrumentet.",
        "President Lincoln ska ha spelat munspel — Hohner skickade honom ett, och han ska ha svarat att det var 'den enda rimliga lyx en man kan unna sig'.",
      ],
      de: [
        "Trossingen, Hohners Heimatstadt, hat noch immer ein Mundharmonika- und Akkordeon-Museum und eine Hochschule. Ein Teil der Stadt lebt bis heute vom Instrument.",
        "Präsident Lincoln soll Mundharmonika gespielt haben — Hohner schickte ihm eine, und er soll geantwortet haben, sie sei „der einzige vernünftige Luxus, den sich ein Mensch gönnen kann“.",
      ],
    },
    links: [
      { label: "Hohner — About", url: "https://www.hohner.de/en/company" },
      { label: "Matthias Hohner (Wikipedia)", url: "https://en.wikipedia.org/wiki/Matthias_Hohner" },
    ],
  },

  "lee-oskar": {
    brandId: "lee-oskar",
    name: "Lee Oskar",
    years: "b. 1948",
    birthplace: "København, Danmark",
    image: wm("Lee Oskar 1976 press photo.png"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Lee Oskar 1976 press photo.png"),
    title: {
      no: "Dansken som lærte War å swinge — og deretter bygde sitt eget munnspill",
      en: "The Dane who taught War to swing — and then built his own harmonica",
      sv: "Dansken som lärde War att swinga — och sedan byggde sitt eget munspel",
      de: "Der Däne, der War das Swingen beibrachte — und dann seine eigene Mundharmonika baute",
    },
    lede: {
      no: "En gateunge fra København som ble medstifter av funk-bandet War, og som etterpå gjorde noe få artister gjør: han bygde et instrument som var bedre enn det han hadde brukt.",
      en: "A street kid from Copenhagen who co-founded the funk band War — then did what few artists do: built an instrument better than the one he'd been using.",
      sv: "En gatpojke från Köpenhamn som blev medgrundare av funkbandet War — och sedan gjorde det få artister gör: byggde ett instrument som var bättre än det han använt.",
      de: "Ein Straßenjunge aus Kopenhagen, der den Funkband War mitgründete — und dann tat, was wenige Künstler tun: ein Instrument bauen, das besser war als das, mit dem er gespielt hatte.",
    },
    bio: {
      no: [
        "Lee Oskar Levitin emigrerte fra Danmark til USA som ung mann med 25 dollar i lomma og et munnspill. Han ble medstifter av War i 1969 og hadde sin egen instrumentalhit, San Francisco Bay, i 1978.",
        "Misnøyd med kvaliteten på munnspill som var tilgjengelige på den tida, slo han seg sammen med Tombo Manufacturing i Japan i 1983 og lanserte Lee Oskar-merket. Hovedidéen: utskiftbare reedplater. Hvis en tone gikk, kunne du erstatte selve platen i stedet for å kjøpe nytt munnspill. Profesjonelle bluesharpspillere har satt pris på det siden.",
      ],
      en: [
        "Lee Oskar Levitin emigrated from Denmark to the US as a young man with 25 dollars in his pocket and a harmonica. He co-founded War in 1969 and had his own instrumental hit, San Francisco Bay, in 1978.",
        "Unhappy with the quality of harmonicas available at the time, he partnered with Japan's Tombo Manufacturing in 1983 and launched the Lee Oskar brand. The core idea: replaceable reed plates. If a note died, you swapped the plate rather than the whole harmonica. Professional touring blues harp players have appreciated this ever since.",
      ],
      sv: [
        "Lee Oskar Levitin emigrerade från Danmark till USA som ung man med 25 dollar i fickan och ett munspel. Han var medgrundare av War 1969 och hade sin egen instrumentalhit, San Francisco Bay, 1978.",
        "Missnöjd med kvaliteten på munspel som fanns tillgängliga vid den tiden samarbetade han med japanska Tombo Manufacturing 1983 och lanserade varumärket Lee Oskar. Grundidén: utbytbara tonplattor. Om en ton dog kunde man byta plattan istället för hela munspelet. Professionella bluesharpaspelare har uppskattat det sedan dess.",
      ],
      de: [
        "Lee Oskar Levitin wanderte als junger Mann mit 25 Dollar in der Tasche und einer Mundharmonika von Dänemark in die USA aus. 1969 war er Mitbegründer von War und hatte 1978 mit San Francisco Bay seinen eigenen Instrumental-Hit.",
        "Unzufrieden mit der Qualität der damals verfügbaren Mundharmonikas, schloss er sich 1983 mit dem japanischen Hersteller Tombo Manufacturing zusammen und gründete die Marke Lee Oskar. Die Kernidee: austauschbare Stimmplatten. Wenn ein Ton starb, tauschte man die Platte statt der ganzen Harp. Professionelle Touring-Bluesharp-Spieler schätzen das bis heute.",
      ],
    },
    anecdotes: {
      no: [
        "Lee Oskar er en av de få bluesharp-spillerne som har et helt instrumentmerke oppkalt etter seg — og bruker det selv på scenen.",
        "Han bor og driver fortsatt fra Seattle-området.",
      ],
      en: [
        "Lee Oskar is one of the few blues harp players with an entire instrument brand named after him — and he plays them himself on stage.",
        "He still lives and works out of the Seattle area.",
      ],
      sv: [
        "Lee Oskar är en av de få bluesharpaspelare som har ett helt instrumentmärke uppkallat efter sig — och spelar dem själv på scen.",
        "Han bor och arbetar fortfarande i Seattle-området.",
      ],
      de: [
        "Lee Oskar ist einer der wenigen Bluesharp-Spieler, nach denen eine ganze Instrumentenmarke benannt ist — und er spielt sie selbst auf der Bühne.",
        "Er lebt und arbeitet weiterhin in der Region Seattle.",
      ],
    },
    links: [
      { label: "Lee Oskar Harmonicas", url: "https://www.leeoskar.com" },
      { label: "Lee Oskar (Wikipedia)", url: "https://en.wikipedia.org/wiki/Lee_Oskar" },
    ],
  },

  ludwig: {
    brandId: "ludwig",
    name: "William F. Ludwig Sr.",
    years: "1879–1973",
    birthplace: "Nenderoth, Tyskland / Germany",
    title: {
      no: "Tyskeren i Chicago som banket grunnmuren under elektrisk blues",
      en: "The German in Chicago who hammered the foundation under electric blues",
      sv: "Tysken i Chicago som hamrade fundamentet under elektrisk blues",
      de: "Der Deutsche in Chicago, der das Fundament unter den elektrischen Blues hämmerte",
    },
    lede: {
      no: "Han var trommeslager først, fabrikkeier etterpå. Det er grunnen til at trommene hans faktisk fungerte for trommeslagere.",
      en: "He was a drummer first, a factory owner second. That's why his drums actually worked for drummers.",
      sv: "Han var trumslagare först, fabriksägare sedan. Det är därför hans trummor faktiskt fungerade för trumslagare.",
      de: "Er war erst Schlagzeuger, dann Fabrikbesitzer. Deshalb funktionierten seine Drums tatsächlich für Schlagzeuger.",
    },
    bio: {
      no: [
        "William F. Ludwig kom til USA som barn, vokste opp i Chicago, og jobbet som trommeslager i vaudeville og teater. Sammen med broren Theobald grunnla han Ludwig & Ludwig i 1909. Hovedinnovasjonen: et fotpedal-system for stortromme som faktisk var raskt nok til ragtime.",
        "Da Chess Records begynte å spille inn elektrisk blues i Chicago på 50-tallet, satt rytmeseksjonen — Fred Below, Francis Clay, Sam Lay — bak Ludwig-trommer. Snare-trommen Black Beauty ble standardlyd for studioarbeid i hele Midtvesten.",
      ],
      en: [
        "William F. Ludwig came to the US as a child, grew up in Chicago, and worked as a vaudeville and theatre drummer. With his brother Theobald he founded Ludwig & Ludwig in 1909. The key innovation: a bass drum pedal system that was actually fast enough for ragtime.",
        "When Chess Records started cutting electric blues in Chicago in the 1950s, the rhythm section — Fred Below, Francis Clay, Sam Lay — sat behind Ludwig drums. The Black Beauty snare became the standard sound for session work across the Midwest.",
      ],
      sv: [
        "William F. Ludwig kom till USA som barn, växte upp i Chicago och arbetade som vaudeville- och teatertrumslagare. Tillsammans med sin bror Theobald grundade han Ludwig & Ludwig 1909. Huvudinnovationen: ett bastrumpedal-system som faktiskt var snabbt nog för ragtime.",
        "När Chess Records började spela in elektrisk blues i Chicago på 50-talet satt rytmsektionen — Fred Below, Francis Clay, Sam Lay — bakom Ludwig-trummor. Black Beauty-virveln blev standardljud för studioarbete i hela Mellanvästern.",
      ],
      de: [
        "William F. Ludwig kam als Kind in die USA, wuchs in Chicago auf und arbeitete als Vaudeville- und Theaterschlagzeuger. Mit seinem Bruder Theobald gründete er 1909 Ludwig & Ludwig. Die zentrale Innovation: ein Bassdrum-Pedalsystem, das tatsächlich schnell genug für Ragtime war.",
        "Als Chess Records in den 1950ern in Chicago elektrischen Blues aufnahm, saß die Rhythmusgruppe — Fred Below, Francis Clay, Sam Lay — hinter Ludwig-Drums. Die Black-Beauty-Snare wurde zum Standardklang für Sessionarbeit im ganzen Mittleren Westen.",
      ],
    },
    anecdotes: {
      no: [
        "Ringo Starr satte Ludwig-logoen foran på stortromma si til Ed Sullivan-konserten i 1964. Salget eksploderte over natten.",
        "Familien tapte kontrollen over selskapet under depresjonen, kjøpte det tilbake i 1955, og holdt på det fram til 1981.",
      ],
      en: [
        "Ringo Starr put the Ludwig logo on the front of his bass drum for the 1964 Ed Sullivan broadcast. Sales exploded overnight.",
        "The family lost control of the company during the Depression, bought it back in 1955, and held it until 1981.",
      ],
      sv: [
        "Ringo Starr satte Ludwig-logotypen på framsidan av sin bastrumma till Ed Sullivan-sändningen 1964. Försäljningen exploderade över en natt.",
        "Familjen förlorade kontrollen över företaget under depressionen, köpte tillbaka det 1955, och behöll det till 1981.",
      ],
      de: [
        "Ringo Starr klebte das Ludwig-Logo zur Ed-Sullivan-Sendung 1964 vorn auf seine Bassdrum. Über Nacht explodierten die Verkäufe.",
        "Die Familie verlor während der Depression die Kontrolle über die Firma, kaufte sie 1955 zurück und behielt sie bis 1981.",
      ],
    },
    links: [
      { label: "Ludwig Drums", url: "https://www.ludwig-drums.com" },
      { label: "Ludwig-Musser (Wikipedia)", url: "https://en.wikipedia.org/wiki/Ludwig-Musser" },
    ],
  },

  gretsch: {
    brandId: "gretsch",
    name: "Friedrich Gretsch",
    years: "1856–1895",
    birthplace: "Mannheim, Tyskland / Germany",
    image: wm("Friedrich W. Gretsch.jpg"),
    imageCredit: "Wikimedia Commons",
    imageCreditUrl: wmPage("Friedrich W. Gretsch.jpg"),
    title: {
      no: "Brooklyn-immigranten som la grunnen til That Great Gretsch Sound",
      en: "The Brooklyn immigrant who laid the ground for That Great Gretsch Sound",
      sv: "Brooklyn-immigranten som lade grunden till That Great Gretsch Sound",
      de: "Der Brooklyn-Einwanderer, der den Grundstein für That Great Gretsch Sound legte",
    },
    lede: {
      no: "Han døde 39 år gammel og rakk knapt se hva sønnen skulle gjøre ut av verkstedet hans.",
      en: "He died at 39, barely living to see what his son would make of the workshop.",
      sv: "Han dog 39 år gammal och hann knappt se vad hans son skulle göra av verkstaden.",
      de: "Er starb mit 39 Jahren und erlebte kaum, was sein Sohn aus der Werkstatt machen würde.",
    },
    bio: {
      no: [
        "Friedrich Gretsch flyttet fra Tyskland til Brooklyn på 1870-tallet og åpnet en liten butikk i 1883 som laget banjoer, trommer og tamburiner. Da han døde, var sønnen Fred Sr. femten år gammel og overtok ansvaret.",
        "Sønnen og senere barnebarnet bygde Gretsch til et ekte instrumentforetak — først kjent for trommer (Broadkaster), så for gitarer (White Falcon, 6120). Charlie Watts spilte Gretsch i Rolling Stones; bandet brakte Chicago-bluesen ut i verden. Sirkelen lukkes der.",
      ],
      en: [
        "Friedrich Gretsch moved from Germany to Brooklyn in the 1870s and opened a small workshop in 1883 making banjos, drums and tambourines. When he died his son Fred Sr. was fifteen and took over.",
        "The son, and later the grandson, built Gretsch into a serious instrument maker — first known for drums (the Broadkaster), then guitars (White Falcon, 6120). Charlie Watts played Gretsch in the Rolling Stones; the Stones took the Chicago blues to the rest of the world. The circle closes there.",
      ],
      sv: [
        "Friedrich Gretsch flyttade från Tyskland till Brooklyn på 1870-talet och öppnade en liten verkstad 1883 som tillverkade banjos, trummor och tamburiner. När han dog var sonen Fred Sr. femton år och tog över.",
        "Sonen, och senare sonsonen, byggde upp Gretsch till en seriös instrumenttillverkare — först känd för trummor (Broadkaster), sedan för gitarrer (White Falcon, 6120). Charlie Watts spelade Gretsch i Rolling Stones; bandet förde Chicago-bluesen ut i världen. Cirkeln sluts där.",
      ],
      de: [
        "Friedrich Gretsch zog in den 1870ern aus Deutschland nach Brooklyn und eröffnete 1883 eine kleine Werkstatt für Banjos, Trommeln und Tamburine. Als er starb, war sein Sohn Fred Sr. fünfzehn und übernahm.",
        "Der Sohn, später der Enkel, baute Gretsch zu einer ernstzunehmenden Instrumentenmanufaktur aus — erst bekannt für Drums (Broadkaster), dann für Gitarren (White Falcon, 6120). Charlie Watts spielte Gretsch bei den Rolling Stones; die Stones trugen den Chicago-Blues in die Welt. Der Kreis schließt sich dort.",
      ],
    },
    anecdotes: {
      no: [
        "Gretsch og Ludwig kranglet i tiår om hvem som hadde lov til å bruke navnet Broadkaster — Fender hadde også et øye på navnet og kalte til slutt sin første gitar Telecaster i stedet.",
        "Familien drev selskapet i fire generasjoner før de solgte til Fender i 2002 — på et lisensgrunnlag som lar familien styre design fortsatt.",
      ],
      en: [
        "Gretsch and Ludwig fought for decades over who could use the name Broadkaster — Fender wanted the name too, and ended up calling its first guitar the Telecaster instead.",
        "The family ran the company for four generations before selling to Fender in 2002 — on a licensing basis that still lets the family steer the design.",
      ],
      sv: [
        "Gretsch och Ludwig bråkade i decennier om vem som fick använda namnet Broadkaster — Fender ville också ha namnet och döpte till slut sin första gitarr till Telecaster istället.",
        "Familjen drev företaget i fyra generationer innan de sålde till Fender 2002 — på licensbasis som fortfarande låter familjen styra designen.",
      ],
      de: [
        "Gretsch und Ludwig stritten Jahrzehnte um den Namen Broadkaster — auch Fender wollte ihn und nannte seine erste Gitarre schließlich lieber Telecaster.",
        "Die Familie führte das Unternehmen vier Generationen lang, bis sie 2002 an Fender verkaufte — auf Lizenzbasis, sodass die Familie weiterhin das Design lenkt.",
      ],
    },
    links: [
      { label: "Gretsch Drums", url: "https://www.gretschdrums.com" },
      { label: "Gretsch (Wikipedia)", url: "https://en.wikipedia.org/wiki/Gretsch" },
    ],
  },

  shure: {
    brandId: "shure",
    name: "Sidney N. Shure",
    years: "1902–1995",
    birthplace: "Chicago, Illinois",
    title: {
      no: "Mannen som bygde mikrofonen bluesfolket plyndret fra lastebilsjåførene",
      en: "The man who built the microphone the blues crowd stole from truck dispatchers",
      sv: "Mannen som byggde mikrofonen bluesfolket snodde från åkerinas dispatchers",
      de: "Der Mann, der das Mikrofon baute, das die Blues-Leute den Speditions-Dispatchern klauten",
    },
    lede: {
      no: "Han var radiokomponentselger fra Chicago. Han bygde mikrofoner som varte i 70 år. Bluesharpspillerne fant fram favoritten i en helt annen bransje.",
      en: "He was a radio parts wholesaler from Chicago. He built microphones that lasted 70 years. The harp players found their favourite hidden in another industry entirely.",
      sv: "Han var en radiodelsgrossist från Chicago. Han byggde mikrofoner som höll i 70 år. Munspelarna hittade sin favorit gömd i en helt annan bransch.",
      de: "Er war Großhändler für Radioteile in Chicago. Er baute Mikrofone, die 70 Jahre hielten. Die Harp-Spieler fanden ihren Favoriten in einer ganz anderen Branche.",
    },
    bio: {
      no: [
        "Sidney Shure startet Shure Radio Company i Chicago i 1925 med en katalog over radioreservedeler. Da depresjonen rammet, gikk han over til å lage egne mikrofoner. Unidyne (1939) — det første ekte ensidige dynamiske kondensatorelementet — var revolusjonerende: man kunne stå nær mikrofonen uten å få tilbakekobling.",
        "55SH «Elvis-mikrofonen», SM57, SM58 og 520DX «Green Bullet» kom alle ut av Shure-laboratoriet. Green Bullet ble laget for lastebilssentraler — radiokommunikasjon. Bluesharpspillerne i Chicago oppdaget den tilfeldig på 50- og 60-tallet. Den begrensede frekvensresponsen — som var et problem for taleformidling — passet perfekt for kuppet munnspill rett inn i et lite rørampere.",
      ],
      en: [
        "Sidney Shure started Shure Radio Company in Chicago in 1925 with a catalog of radio replacement parts. When the Depression hit he pivoted to making his own microphones. The Unidyne (1939) — the first true single-element directional dynamic microphone — was revolutionary: you could stand close to the mic without feedback.",
        "The 55SH 'Elvis mic', SM57, SM58 and 520DX 'Green Bullet' all came out of the Shure lab. The Green Bullet was designed for truck dispatchers — two-way radio. Chicago harp players found it by accident in the fifties and sixties. The limited frequency response — a problem for clean speech — was perfect for a cupped harmonica driven straight into a small tube amp.",
      ],
      sv: [
        "Sidney Shure startade Shure Radio Company i Chicago 1925 med en katalog över radioreservdelar. När depressionen slog till bytte han spår och började bygga egna mikrofoner. Unidyne (1939) — det första riktiga riktade dynamiska mikrofonelementet — var revolutionerande: man kunde stå nära mikrofonen utan rundgång.",
        "55SH 'Elvis-mikrofonen', SM57, SM58 och 520DX 'Green Bullet' kom alla från Shures laboratorium. Green Bullet designades för åkeriernas dispatchers — tvåvägsradio. Chicago-munspelarna upptäckte den av en slump på 50- och 60-talet. Den begränsade frekvensgången — ett problem för rent tal — var perfekt för ett kupat munspel rakt in i en liten rörförstärkare.",
      ],
      de: [
        "Sidney Shure gründete 1925 in Chicago die Shure Radio Company mit einem Katalog für Radio-Ersatzteile. Als die Depression einsetzte, schwenkte er um und baute eigene Mikrofone. Das Unidyne (1939) — das erste echte gerichtete Tauchspulen-Mikrofon mit einer Kapsel — war revolutionär: Man konnte nah am Mikro stehen, ohne Rückkopplung.",
        "Das 55SH „Elvis-Mikrofon“, SM57, SM58 und 520DX „Green Bullet“ entstanden alle bei Shure. Das Green Bullet wurde für Spediteure entworfen — zweiweg Funk. Die Chicagoer Harp-Spieler entdeckten es in den 50ern und 60ern eher zufällig. Der begrenzte Frequenzgang — für klare Sprache eigentlich ein Problem — war perfekt für eine umschlossene Mundharmonika direkt in einen kleinen Röhrenverstärker.",
      ],
    },
    anecdotes: {
      no: [
        "SM58 har vært i kontinuerlig produksjon siden 1966. Den selges fortsatt for ca. samme pris i reelle kroner som den gjorde da.",
        "Little Walter spilte i hovedsak Astatic, men det er Green Bullet som er blitt symbolet for forsterket bluesharp. Begge er Chicago-historier.",
      ],
      en: [
        "The SM58 has been in continuous production since 1966. It still sells for roughly the same money, in real terms, as it did then.",
        "Little Walter mostly played an Astatic, but it's the Green Bullet that has become the symbol of amplified blues harp. Both stories are Chicago stories.",
      ],
      sv: [
        "SM58 har varit i kontinuerlig produktion sedan 1966. Den säljs fortfarande för ungefär samma pengar, i reala termer, som då.",
        "Little Walter spelade främst Astatic, men det är Green Bullet som blivit symbolen för förstärkt bluesharpa. Båda historierna är Chicago-historier.",
      ],
      de: [
        "Das SM58 wird seit 1966 ohne Unterbrechung gebaut. Es kostet inflationsbereinigt heute noch ungefähr dasselbe wie damals.",
        "Little Walter spielte hauptsächlich ein Astatic, aber zum Symbol der verstärkten Blues-Harp wurde das Green Bullet. Beides sind Chicago-Geschichten.",
      ],
    },
    links: [
      { label: "Shure", url: "https://www.shure.com" },
      { label: "Shure Incorporated (Wikipedia)", url: "https://en.wikipedia.org/wiki/Shure" },
    ],
  },

  astatic: {
    brandId: "astatic",
    name: "Astatic Corporation",
    years: "1933–",
    birthplace: "Conneaut, Ohio",
    title: {
      no: "Det opprinnelige bluesharp-elementet før Green Bullet fantes",
      en: "The original blues harp element before the Green Bullet existed",
      sv: "Det ursprungliga bluesharpa-elementet innan Green Bullet fanns",
      de: "Das ursprüngliche Blues-Harp-Element, bevor es das Green Bullet gab",
    },
    lede: {
      no: "Astatic var ikke en mann — det var et selskap. Men JT-30-mikrofonen deres ble fundamentet for Chicagos forsterkete munnspillsound.",
      en: "Astatic was not one man — it was a company. But its JT-30 microphone became the foundation of Chicago's amplified harmonica sound.",
      sv: "Astatic var inte en man — det var ett företag. Men deras JT-30-mikrofon blev grunden för Chicagos förstärkta munspelsljud.",
      de: "Astatic war kein einzelner Mann — es war eine Firma. Aber ihr Mikrofon JT-30 wurde zum Fundament des verstärkten Mundharmonika-Sounds aus Chicago.",
    },
    bio: {
      no: [
        "Astatic Corporation ble grunnlagt i 1933 i Conneaut, Ohio, av et lite team med fokus på krystallmikrofoner — i hovedsak til radio og diktering. JT-30 ble lansert på 30-tallet og var bygget for å være billig, robust og høyfølsom.",
        "Tidlige Chicago-bluesfolk plukket den opp før Shure Green Bullet engang fantes. Krystallelementet ga en sprø, midt-tung lyd som passet rett inn i en liten rørampere. Big Walter Horton og Sonny Boy Williamson II spilte gjennom JT-30 lenge før det ble vanlig praksis.",
      ],
      en: [
        "Astatic Corporation was founded in 1933 in Conneaut, Ohio, by a small team focused on crystal microphones — primarily for radio and dictation. The JT-30 launched in the late 1930s and was built to be cheap, rugged and sensitive.",
        "Early Chicago blues players picked it up before the Shure Green Bullet even existed. The crystal element gave a brittle, midrange-forward sound that fit straight into a small tube amp. Big Walter Horton and Sonny Boy Williamson II played through JT-30s long before it became common practice.",
      ],
      sv: [
        "Astatic Corporation grundades 1933 i Conneaut, Ohio, av ett litet team fokuserat på kristallmikrofoner — främst för radio och diktering. JT-30 lanserades i slutet av 30-talet och byggdes för att vara billig, robust och känslig.",
        "Tidiga Chicago-bluesare plockade upp den innan Shure Green Bullet ens fanns. Kristallelementet gav ett sprött, mellanregister-tungt ljud som passade rakt in i en liten rörförstärkare. Big Walter Horton och Sonny Boy Williamson II spelade genom JT-30 långt innan det blev vanlig praxis.",
      ],
      de: [
        "Die Astatic Corporation wurde 1933 in Conneaut, Ohio, von einem kleinen Team gegründet, das sich auf Kristallmikrofone konzentrierte — vor allem für Radio und Diktat. Das JT-30 kam Ende der 1930er heraus und war billig, robust und empfindlich gebaut.",
        "Frühe Chicagoer Bluesmusiker griffen es auf, bevor es das Shure Green Bullet überhaupt gab. Das Kristallelement lieferte einen spröden, mittenbetonten Klang, der direkt in einen kleinen Röhrenverstärker passte. Big Walter Horton und Sonny Boy Williamson II spielten durch JT-30, lange bevor das gängige Praxis wurde.",
      ],
    },
    anecdotes: {
      no: [
        "Krystallelementet er skjørt — det går i stykker hvis du mister mikrofonen, eller hvis det blir for varmt på en sommerturné. Det er derfor mange JT-30 i dag har erstatningselementer fra moderne produsenter som Hohner og Shure.",
        "Astatic ble kjøpt opp og solgt videre flere ganger; merket finnes fortsatt på markedet, men ikke det opprinnelige firmaet.",
      ],
      en: [
        "The crystal element is fragile — it breaks if you drop the mic, or if it gets too hot on a summer tour. That's why many JT-30s today have replacement elements from modern makers like Hohner and Shure.",
        "Astatic has been bought and sold several times; the brand is still on the market, but not the original company.",
      ],
      sv: [
        "Kristallelementet är skört — det går sönder om man tappar mikrofonen, eller om den blir för varm på en sommarturné. Därför har många JT-30 idag utbytta element från moderna tillverkare som Hohner och Shure.",
        "Astatic har köpts och sålts flera gånger; varumärket finns fortfarande, men inte det ursprungliga bolaget.",
      ],
      de: [
        "Das Kristallelement ist empfindlich — es bricht, wenn man das Mikro fallen lässt oder es auf einer Sommertour zu heiß wird. Deshalb haben viele JT-30 heute Ersatzkapseln moderner Hersteller wie Hohner und Shure.",
        "Astatic wurde mehrfach gekauft und weiterverkauft; die Marke gibt es noch, aber nicht mehr die ursprüngliche Firma.",
      ],
    },
    links: [
      { label: "Astatic Microphones (Wikipedia)", url: "https://en.wikipedia.org/wiki/Astatic_Corporation" },
    ],
  },
};

// Aliases — same founder, different brand entry on the gear page.
FOUNDERS["fender-amps"] = { ...FOUNDERS.fender, brandId: "fender-amps" };

// Lee Oskar — Danish-born harp player and brand founder.
FOUNDERS["lee-oskar"] = {
  brandId: "lee-oskar",
  name: "Lee Oskar",
  years: "f. 1948",
  birthplace: "København, Danmark",
  image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lee%20Oskar%201976%20press%20photo.png?width=640",
  imageCredit: "Wikimedia Commons",
  imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Lee%20Oskar%201976%20press%20photo.png",
  title: {
    no: "Dansken som bygde munnspillet for de som lever av det",
    en: "The Dane who built the harmonica for people who live off it",
    sv: "Dansken som byggde munspelet för dem som lever på det",
    de: "Der Däne, der die Mundharmonika für Berufsspieler baute",
  },
  lede: {
    no: "Han kom til USA med et munnspill i lomma og endte i bandet War. Så bygde han instrumentet han selv ville hatt da han startet.",
    en: "He arrived in the US with a harmonica in his pocket and ended up in the band War. Then he built the instrument he wished he'd had when he started.",
    sv: "Han kom till USA med ett munspel i fickan och hamnade i bandet War. Sedan byggde han instrumentet han önskade att han haft från början.",
    de: "Er kam mit einer Mundharmonika in der Tasche in die USA und landete in der Band War. Dann baute er das Instrument, das er sich am Anfang gewünscht hätte.",
  },
  bio: {
    no: [
      "Lee Oskar Levitin ble født i København i 1948. Som ungdom reiste han til USA med lite annet enn et munnspill. På 1970-tallet endte han i funk-/rockebandet War — solostemmen i «Low Rider» og «Why Can't We Be Friends?» er hans.",
      "I 1983 gikk han sammen med den japanske produsenten Tombo og lanserte Lee Oskar Harmonicas. Tanken var enkel: bygg et munnspill som tåler en hel turné, hvor du kan bytte enkelt-tonelater istedenfor å kaste hele instrumentet.",
    ],
    en: [
      "Lee Oskar Levitin was born in Copenhagen in 1948. As a teenager he travelled to the US with little more than a harmonica. In the 1970s he ended up in the funk/rock band War — the lead harp lines on 'Low Rider' and 'Why Can't We Be Friends?' are his.",
      "In 1983 he partnered with Japanese maker Tombo to launch Lee Oskar Harmonicas. The idea was simple: build a harp that survives a full tour, where you can swap individual reed plates instead of throwing the whole instrument away.",
    ],
    sv: [
      "Lee Oskar Levitin föddes i Köpenhamn 1948. Som tonåring reste han till USA med inte mycket mer än ett munspel. På 1970-talet hamnade han i funk-/rockbandet War — solorna i 'Low Rider' och 'Why Can't We Be Friends?' är hans.",
      "1983 gick han ihop med japanska Tombo och lanserade Lee Oskar Harmonicas. Tanken var enkel: bygg ett munspel som klarar en hel turné, där man kan byta enskilda tonplattor istället för att kasta hela instrumentet.",
    ],
    de: [
      "Lee Oskar Levitin wurde 1948 in Kopenhagen geboren. Als Jugendlicher reiste er mit kaum mehr als einer Mundharmonika in die USA. In den 1970ern landete er bei der Funk-/Rockband War — die Harp-Soli in 'Low Rider' und 'Why Can't We Be Friends?' sind seine.",
      "1983 schloss er sich mit dem japanischen Hersteller Tombo zusammen und gründete Lee Oskar Harmonicas. Die Idee war einfach: eine Mundharmonika bauen, die eine ganze Tour übersteht, bei der man einzelne Stimmplatten tauschen kann, statt das ganze Instrument wegzuwerfen.",
    ],
  },
  anecdotes: {
    no: [
      "Han spilte det berømte solo-løpet på «Low Rider» i ett take, etter sigende uten å vite at båndet gikk.",
      "Lee Oskar-systemet med Major Diatonic, Natural Minor, Harmonic Minor og Melody Maker — alle i samme familie — gjorde det enklere for bluesspillere å håndtere både moll og dur uten å bytte teknikk midt i låten.",
    ],
    en: [
      "He played the famous solo run on 'Low Rider' in a single take, reportedly without knowing the tape was rolling.",
      "The Lee Oskar tuning system — Major Diatonic, Natural Minor, Harmonic Minor and Melody Maker, all in one product family — made it easier for blues players to handle both minor and major tunes without switching technique mid-song.",
    ],
    sv: [
      "Han spelade det berömda solot i 'Low Rider' i en tagning, enligt egen utsago utan att veta att bandet rullade.",
      "Lee Oskar-systemet med Major Diatonic, Natural Minor, Harmonic Minor och Melody Maker — alla i samma familj — gjorde det lättare för bluesspelare att hantera både moll och dur utan att byta teknik mitt i låten.",
    ],
    de: [
      "Das berühmte Solo in 'Low Rider' spielte er angeblich in einem Take ein, ohne zu wissen, dass das Band lief.",
      "Das Lee-Oskar-System — Major Diatonic, Natural Minor, Harmonic Minor und Melody Maker in einer Familie — machte es Bluesspielern leichter, Moll- und Dur-Stücke zu spielen, ohne mitten im Song die Technik zu wechseln.",
    ],
  },
  links: [
    { label: "leeoskar.com", url: "https://www.leeoskar.com" },
    { label: "Lee Oskar (Wikipedia)", url: "https://en.wikipedia.org/wiki/Lee_Oskar" },
  ],
};
