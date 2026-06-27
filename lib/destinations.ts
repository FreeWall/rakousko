export interface Destination {
  id: string;
  name: string;
  type: string;
  description: string;
  highlights: string[];
  tips: string;
  mapyUrl?: string;
  slCardInfo?: string;
  noteKey: string;
  cableCarHours?: string;
  cableCarDuration?: string;
  dogPrice?: string;
  webUrl?: string;
  coords?: [number, number];
  imageUrl: string;
}

export const destinations: Destination[] = [
  {
    id: 'kitzsteinhorn',
    name: 'Ledovec Kitzsteinhorn & Top of Salzburg',
    type: 'Ledovec & Výhledy',
    description: 'Zážitkový výjezd třemi lanovkami do výšky 3 029 m n. m. s celoročním sněhem a vyhlídkovou plošinou.',
    highlights: [
      'Vyhlídková plošina „Top of Salzburg“ s panoramatickým výhledem na třítisícovky',
      'Ledová aréna Ice Arena s klouzačkami na sněhu uprostřed léta',
      'Kino 3000 a Nationalpark Gallery (tunel skrz horu s informacemi o přírodě)'
    ],
    tips: 'Teploty nahoře bývají kolem nuly i v červenci, nezapomeňte zimní bundu a pevné pohorky! Vyrazte hned ráno.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=6306234',
    slCardInfo: 'Jednorázový výjezd a sjezd lanovkou zdarma.',
    noteKey: 'note_kitzsteinhorn',
    cableCarHours: '8:30 – 16:45',
    cableCarDuration: 'cca 30–40 min',
    dogPrice: '8,50 € / den (nutný náhubek + vodítko)',
    webUrl: 'https://www.kitzsteinhorn.at',
    coords: [47.2008, 12.6865],
    imageUrl: '/images/destinations/kitzsteinhorn.webp'
  },
  {
    id: 'sigmund_thun_klam',
    name: 'Soutěska Sigmund-Thun-Klamm & Klammsee',
    type: 'Soutěska & Jezero',
    description: 'Působivá dřevěná lávková stezka vedoucí těsně nad dravým proudem ledovcové řeky Kapruner Ache, navazující na tyrkysové jezero Klammsee.',
    highlights: [
      'Procházka po dřevěných visutých lávkách v úzké soutěsce',
      'Průzračné tyrkysové jezero Klammsee s možností obchůzky',
      'Dětské hřiště a občerstvení u Klammsee'
    ],
    tips: 'Nachází se jen pár minut chůze od Pensionu Baranekhof. Vhodné i za méně stabilního počasí.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=12020854',
    slCardInfo: 'Vstup do soutěsky Sigmund-Thun-Klamm je zdarma.',
    noteKey: 'note_sigmund',
    webUrl: 'https://www.klamm-kaprun.at',
    coords: [47.2625, 12.7483],
    imageUrl: '/images/destinations/sigmund_thun_klam.webp'
  },
  {
    id: 'mooserboden',
    name: 'Vysokohorské přehrady Mooserboden',
    type: 'Přehrady & Vysokohorská turistika',
    description: 'Monumentální vodní dílo sevřené mezi štíty třítisícovek ve výšce 2 036 m n. m., dostupné speciálními autobusy a obřím šikmým výtahem.',
    highlights: [
      'Jízda největším otevřeným šikmým výtahem v Evropě (Lärchwand)',
      'Procházka po koruně 107 m vysoké přehradní hráze',
      'Výstavní centrum o historii stavby a možnost komentované prohlídky vnitřku hráze'
    ],
    tips: 'Skvělý výchozí bod pro další vysokohorské túry. Poslední autobus dolů jede kolem 16:45.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=96102629',
    slCardInfo: 'Výrazná sleva na kombinovanou jízdenku.',
    noteKey: 'note_mooserboden',
    cableCarHours: '8:10 – 16:45 (poslední bus dolů)',
    cableCarDuration: 'cca 45 min (bus + výtah + bus)',
    dogPrice: '9,00 € (nutný náhubek + vodítko)',
    webUrl: 'https://www.verbund.com/kaprun',
    coords: [47.1614, 12.7214],
    imageUrl: '/images/destinations/mooserboden.webp'
  },
  {
    id: 'maiskogel',
    name: 'Rodinná hora Maiskogel & Maisi Flitzer',
    type: 'Horská turistika & Zábava',
    description: 'Pohodový rodinný vrchol přímo nad Kaprunem s celoroční bobovou dráhou a spoustou panoramatických stezek.',
    highlights: [
      'Maisi Flitzer - 1,3 km dlouhá bobová dráha s vlnami a zatáčkami v dolní stanici',
      'Lanovka MK Maiskogelbahn vedoucí přímo z centra Kaprunu',
      'Horská chata Maiskogel Alm s terasou a vyhlídkou'
    ],
    tips: 'Ideální cíl na aklimatizaci nebo půldenní rodinnou turistiku s dětmi.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=1066791681',
    slCardInfo: 'Jízda lanovkou zdarma, na bobovou dráhu platí sleva.',
    noteKey: 'note_maiskogel',
    cableCarHours: '9:00 – 17:00',
    cableCarDuration: 'cca 10 min',
    dogPrice: '8,50 € / den (nutný náhubek + vodítko)',
    webUrl: 'https://www.kitzsteinhorn.at/maiskogel',
    coords: [47.2667, 12.7333],
    imageUrl: '/images/destinations/maiskogel.webp'
  },
  {
    id: 'zell_am_see',
    name: 'Jezero Zell am See & Schmittenhöhe',
    type: 'Jezero, Plavba & Lanovka',
    description: 'Průzračné jezero obklopené horami a majestátní vyhlídkový vrchol Schmittenhöhe s designovými kabinami Porsche Design.',
    highlights: [
      'Okružní plavba vyhlídkovou lodí po jezeře',
      'Koupání v jezerních plážích (Zell, Thumersbach, Schüttdorf)',
      'Panoramatické turistické stezky s výhledem na jezero z vrcholu Schmittenhöhe'
    ],
    tips: 'Vyhlídková plavba lodí je velmi populární, vyplatí se zkontrolovat plavební řád předem.',
    mapyUrl: 'https://mapy.com/cs/turisticka?planovani-trasy&rc=9dVMaxKKxS575adY-fxKNO2dtKeP5&rs=osm&rs=pubt&rs=osm&rs=osm&ri=150040160&ri=28043547&ri=1040825275&ri=1063743585&mrp=%7B%22c%22%3A132%2C%22dt%22%3A%22%22%2C%22d%22%3Atrue%7D&xc=%5B%5D&x=12.8004831&y=47.3276843&z=14',
    slCardInfo: 'Okružní plavba lodí i jízda lanovkou na Schmittenhöhe jsou zdarma.',
    noteKey: 'note_zell',
    cableCarHours: '9:00 – 17:00',
    cableCarDuration: 'cca 10 min',
    dogPrice: '8,50 € / den (nutný náhubek + vodítko)',
    webUrl: 'https://www.schmitten.at',
    coords: [47.3278, 12.7378],
    imageUrl: '/images/destinations/zell_am_see.webp'
  },
  {
    id: 'krimml_waterfalls',
    name: 'Krimmlské vodopády (Krimmler Wasserfälle)',
    type: 'Vodopády & Příroda',
    description: 'Největší vodopády v Evropě s celkovou výškou 380 metrů. Podél kaskád vede upravená vyhlídková stezka s mnoha plošinami.',
    highlights: [
      'Zážitková stezka Wasserfallweg s 11 vyhlídkami přímo u burácející vody',
      'Vzdušné aerosolové klima s léčivými účinky na astma a alergie',
      'Moderní návštěvnické centrum WasserWelten Krimml'
    ],
    tips: 'Vezměte si pláštěnku nebo nepromokavou bundu, vodní tříšť stříká daleko na vyhlídkové plošiny.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=11998097',
    slCardInfo: 'Vstup k vodopádnám a parkování zdarma.',
    noteKey: 'note_krimml',
    webUrl: 'https://www.krimmler-wasserwelten.at',
    coords: [47.2119, 12.1689],
    imageUrl: '/images/destinations/krimml_waterfalls.webp'
  },
  {
    id: 'tauern_spa',
    name: 'Tauern Spa Kaprun',
    type: 'Wellness & Relax',
    description: 'Moderní lázeňský a bazénový resort o rozloze 20 000 m² s venkovními i vnitřními bazény, saunami a panoramatickými výhledy.',
    highlights: [
      'Venkovní aktivní bazén s proudem a výhledem na Kitzsteinhorn',
      'Velkorysý saunový svět s finskou, solnou a bylinkovou saunou',
      'Relaxační zóny s lehátky a vnitřními vířivkami'
    ],
    tips: 'Ideální program pro deštivé odpoledne nebo pro zasloužený odpočinek po celodenní túře.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=1025788061',
    slCardInfo: 'Sleva na vstupné s kartou.',
    noteKey: 'note_tauern',
    webUrl: 'https://www.tauernspakaprun.com',
    coords: [47.2831, 12.7601],
    imageUrl: '/images/destinations/tauern_spa.webp'
  }
];
