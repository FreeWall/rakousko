export interface Destination {
  id: string;
  name: string;
  subtitle?: string;
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
  dogInfo?: string;
  groupPriceNormal?: string;
  groupPriceCard?: string;
  webUrl?: string;
  coords?: [number, number];
  imageUrl: string;
}

export const destinations: Destination[] = [
  {
    id: 'kitzsteinhorn',
    name: 'Ledovec Kitzsteinhorn',
    subtitle: 'Vyhlídková plošina Top of Salzburg',
    type: 'Ledovec & Výhledy',
    description:
      'Zážitkový výjezd třemi lanovkami do výšky 3 029 m n. m. s celoročním sněhem a vyhlídkovou plošinou. Čekají vás úchvatné výhledy na národní park Vysoké Taury.',
    highlights: [
      'Vyhlídková plošina „Top of Salzburg“ s panoramatickým výhledem na třítisícovky',
      'Ledová aréna Ice Arena s klouzačkami na sněhu uprostřed léta',
      'Kino 3000 a Nationalpark Gallery (360 m dlouhý tunel skrz horu s informačními stanicemi)',
    ],
    tips: 'Teploty nahoře bývají kolem nuly i v červenci, nezapomeňte zimní bundu a pevné pohorky! Vyrazte hned ráno, abyste se vyhnuli frontám a užili si jasné nebe.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=6306234',
    slCardInfo: 'Jednorázový výjezd a sjezd lanovkou zdarma.',
    noteKey: 'note_kitzsteinhorn',
    cableCarHours: '8:30 – 16:45',
    cableCarDuration: 'cca 30–40 min',
    dogPrice: '8,50 € / den (jednosměrná 6,50 €)',
    dogInfo:
      'Psi jsou v lanovkách (včetně 3K K-onnection) i na ledovci povoleni. Ve všech přepravních zařízeních je striktně vyžadováno vodítko a náhubek. Pozor na sníh v létě, který může pálit do tlapek – u citlivějších psů zvažte ochranný vosk na tlapky.',
    groupPriceNormal: 'cca 216,00 € (kombinovaná jízdenka pro 4 dospělé bez karty)',
    groupPriceCard: '0,00 € (v rámci SalzburgerLand Card je výjezd 1x zcela zdarma)',
    webUrl: 'https://www.kitzsteinhorn.at',
    coords: [47.2008, 12.6865],
    imageUrl: '/images/destinations/kitzsteinhorn.webp',
  },
  {
    id: 'sigmund_thun_klam',
    name: 'Soutěska Sigmund-Thun-Klamm',
    subtitle: 'Jezero Klammsee',
    type: 'Soutěska & Jezero',
    description:
      'Působivá dřevěná lávková stezka vedoucí těsně nad dravým proudem ledovcové řeky Kapruner Ache, navazující na tyrkysové jezero Klammsee. Skvělé místo pro odpolední procházku.',
    highlights: [
      'Procházka po dřevěných visutých lávkách v úzké soutěsce s burácející vodou',
      'Průzračné tyrkysové jezero Klammsee s možností nenáročné obchůzky',
      'Dětské hřiště, fitness stezka a příjemné občerstvení u Klammsee',
    ],
    tips: 'Nachází se jen pár minut chůze od Pensionu Baranekhof. Vhodné i za méně stabilního počasí. Večer bývá soutěska v určité dny magicky osvětlená.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=12020854',
    slCardInfo: 'Vstup do soutěsky Sigmund-Thun-Klamm je zdarma.',
    noteKey: 'note_sigmund',
    dogPrice: 'Vstup zdarma (psi jsou vítáni)',
    dogInfo:
      'Psi mají vstup povolen na vodítku. Mějte na paměti, že stezka vede po úzkých dřevěných lávkách přímo nad divoce tekoucí, velmi hlučnou řekou. Někteří psi se mohou bát výšky, hluku vody nebo mezer mezi prkny. Menší pejsky je lepší v soutěsce přenést. Okolo Klammsee je pak trasa naprosto pohodová, na břehu se pes může snadno svlažit a napít.',
    groupPriceNormal: '30,00 € (7,50 € za osobu bez karty)',
    groupPriceCard: '0,00 € (vstup je plně zahrnut v SalzburgerLand Card)',
    webUrl: 'https://www.klamm-kaprun.at',
    coords: [47.2625, 12.7483],
    imageUrl: '/images/destinations/sigmund_thun_klam.webp',
  },
  {
    id: 'mooserboden',
    name: 'Přehrady Mooserboden',
    subtitle: 'Šikmý výtah a největší otevřená přehrada',
    type: 'Přehrady & Vysokohorská turistika',
    description:
      'Monumentální vodní dílo sevřené mezi štíty třítisícovek ve výšce 2 036 m n. m. Přístup vede soustavou tunelů speciálními autobusy a obřím otevřeným šikmým výtahem Lärchwand.',
    highlights: [
      'Jízda největším otevřeným šikmým výtahem v Evropě (plošina Lärchwand)',
      'Procházka po koruně 107 m vysoké přehradní hráze Mooserboden s výhledy',
      'Výstavní centrum "Erlebnis Welt Strom" o historii stavby a možnost prohlídky vnitřku hráze',
    ],
    tips: 'Skvělý výchozí bod pro další vysokohorské túry. Poslední autobus dolů jede kolem 16:45, nenechte si ho ujít! Nahoře bývá větrno a chladněji než v údolí.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=96102629',
    slCardInfo: 'Výrazná sleva na kombinovanou jízdenku bus + výtah.',
    noteKey: 'note_mooserboden',
    cableCarHours: '8:10 – 16:45 (poslední bus dolů)',
    cableCarDuration: 'cca 45 min (bus + výtah + bus)',
    dogPrice: '9,00 € (kombinovaná jízdenka pro psa)',
    dogInfo:
      'Psi jsou povoleni v autobusech i na šikmém výtahu. V autobusech je bezpodmínečně vyžadován náhubek a vodítko. Samotný výtah je velká otevřená plošina a psi ho snášejí dobře. Nahoře u přehrad se pes smí pohybovat výhradně na vodítku, pozor na pasoucí se krávy a kozy podél stezek.',
    groupPriceNormal: '114,00 € (28,50 € za dospělého bez karty)',
    groupPriceCard: '96,00 € (s kartou získáte slevu, jízdenka stojí cca 24,00 € na osobu)',
    webUrl: 'https://www.verbund.com/kaprun',
    coords: [47.1614, 12.7214],
    imageUrl: '/images/destinations/mooserboden.webp',
  },
  {
    id: 'maiskogel',
    name: 'Rodinná hora Maiskogel',
    subtitle: 'Bobová dráha Maisi Flitzer',
    type: 'Horská turistika & Zábava',
    description:
      'Pohodový rodinný vrchol přímo nad Kaprunem s celoroční horskou bobovou dráhou, spoustou dětských atrakcí a malebnými panoramatickými stezkami s výhledy na údolí Salzach.',
    highlights: [
      'Maisi Flitzer – 1,3 km dlouhá bobová dráha s vlnami, mosty a zatáčkami u dolní stanice',
      'Moderní 10místná lanovka MK Maiskogelbahn vedoucí přímo z centra Kaprunu',
      'Horská chata Maiskogel Alm s velkou vyhlídkovou terasou a domácí kuchyní',
    ],
    tips: 'Ideální cíl na aklimatizaci nebo půldenní rodinnou turistiku. Stezky jsou široké a vhodné i pro kočárky nebo méně zdatné turisty.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=1066791681',
    slCardInfo: 'Jízda lanovkou zdarma, na bobovou dráhu platí sleva.',
    noteKey: 'note_maiskogel',
    cableCarHours: '9:00 – 17:00',
    cableCarDuration: 'cca 10 min',
    dogPrice: '8,50 € / den (lanovka MK Maiskogelbahn)',
    dogInfo:
      'Psi mohou cestovat v kabinové lanovce MK Maiskogelbahn (nutný náhubek a vodítko). Turistické trasy na Maiskogelu jsou pro psy velmi pohodlné (travnaté cesty, dostatek prostoru).',
    groupPriceNormal: '128,00 € (32,00 € za zpáteční lanovku na dospělého bez karty)',
    groupPriceCard:
      '0,00 € (lanovka je zdarma se SalzburgerLand Card; bobová dráha se platí zvlášť se slevou)',
    webUrl: 'https://www.kitzsteinhorn.at/en/summer/maiskogel',
    coords: [47.2667, 12.7333],
    imageUrl: '/images/destinations/maiskogel.webp',
  },
  {
    id: 'zell_am_see',
    name: 'Zell am See',
    subtitle: 'Průzračné jezero & historické městečko',
    type: 'Jezero, plavba & městoneb',
    description:
      'Malebné lázeňské město na břehu průzračného jezera Zell, obklopené alpskými vrcholy. Nabízí klidnou atmosféru, kavárny, obchůdky a možnost vyhlídkových plaveb lodí po jezeře.',
    highlights: [
      'Okružní plavba vyhlídkovou lodí MS Schmittenhöhe s panoramatickými výhledy',
      'Koupání v jezerních plážích (Zell am See, Thumersbach, Schüttdorf) s čistou vodou',
      'Historické centrum města s promenádou podél jezera a večerní světelnou show (Zeller Seezauber)',
    ],
    tips: 'Vyhlídková plavba lodí je velmi populární, vyplatí se zkontrolovat plavební řád předem a dorazit k přístavišti dříve. Večerní světelná show s hudbou a lasery (Zeller Seezauber) je zdarma.',
    mapyUrl: 'https://mapy.cz/turisticka?source=osm&id=6264627',
    slCardInfo: 'Jedna okružní plavba lodí zdarma.',
    noteKey: 'note_zell',
    dogPrice: 'cca 6,00 € (lístek na vyhlídkovou loď)',
    dogInfo:
      'Procházky po městě a podél jezera jsou pro psy ideální. Pozor: na oficiální veřejné pláže (Strandbäder) je vstup se psy zakázán. Koupání psů v jezeře je však povolené na neoznačených a divokých místech (např. na jižním břehu u Schüttdorfu). Psi jsou povoleni na palubě vyhlídkových lodí, musí mít však nasazený náhubek a být na vodítku.',
    groupPriceNormal: '88,00 € (22,00 € za okružní plavbu pro dospělého bez karty)',
    groupPriceCard: '0,00 € (1x okružní plavba lodí zdarma v rámci SalzburgerLand Card)',
    webUrl: 'https://www.zellamsee-kaprun.com',
    coords: [47.3236, 12.7969],
    imageUrl: '/images/destinations/zell_am_see.webp',
  },
  {
    id: 'schmittenhohe',
    name: 'Hora Schmittenhöhe',
    subtitle: 'Vyhlídkový vrchol nad Zell am See',
    type: 'Horská turistika & Výhledy',
    description:
      'Majestátní vyhlídkový vrchol nad Zell am See, na který vás vyveze designová lanovka Schmittenhöhebahn navržená studiem Porsche Design. Nabízí 360° panoramatický výhled na 30 třítisícovek a jezero Zell.',
    highlights: [
      'Panoramatické turistické stezky s dechberoucími výhledy na jezero Zell am See z výšky',
      'Zážitková stezka Schmidolins Taufe pro rodiny s dětmi plná her a úkolů',
      'Designové kabiny lanovky a vyhlídková kaple Sisi na samotném vrcholu (1965 m)',
    ],
    tips: 'Nahoře je spousta turistických tras všech obtížností. Za slunečného dne je odtud nejlepší výhled na jezero a okolní hory. Doporučujeme trasu po hřebeni (Höhenpromenade).',
    mapyUrl: 'https://mapy.cz/turisticka?source=osm&id=1063743585',
    slCardInfo: 'Jízda lanovkami nahoru i dolů zdarma.',
    noteKey: 'note_schmittenhohe',
    cableCarHours: '9:00 – 17:00',
    cableCarDuration: 'cca 10 min',
    dogPrice: '8,50 € / den (zpáteční lístek na lanovky)',
    dogInfo:
      'Psi jsou v lanovkách povoleni (nutný náhubek a vodítko). Na hřebenech a turistických trasách na Schmittenhöhe je pohyb se psem ideální, ale pozor na pasoucí se krávy. Na trasách bývá v létě ostré slunce a málo stínu, vezměte psovi dostatek vody.',
    groupPriceNormal: '168,00 € (42,00 € za dospělého bez karty)',
    groupPriceCard: '0,00 € (zpáteční jízdenka lanovkou je zcela zdarma se SalzburgerLand Card)',
    webUrl: 'https://www.schmitten.at/en',
    coords: [47.3278, 12.7378],
    imageUrl: '/images/destinations/schmittenhohe.webp',
  },
  {
    id: 'krimml_waterfalls',
    name: 'Krimmlské vodopády',
    subtitle: 'Největší vodopády v Evropě',
    type: 'Vodopády & Příroda',
    description:
      'Největší vodopády v Evropě s celkovou výškou 380 metrů. Podél kaskád vede upravená 4 km dlouhá vyhlídková stezka s mnoha plošinami, které vás zavedou do těsné blízkosti burácející vody.',
    highlights: [
      'Zážitková stezka Wasserfallweg s 11 vyhlídkami přímo u burácející vody',
      'Vzdušné aerosolové klima s prokázanými léčivými účinky na astma a alergie',
      'Moderní návštěvnické centrum WasserWelten Krimml s vodními atrakcemi',
    ],
    tips: 'Vezměte si pláštěnku nebo nepromokavou bundu, vodní tříšť stříká daleko na vyhlídkové plošiny. Cesta na nejvyšší bod vodopádů trvá cca 1,5 hodiny strmého stoupání.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=11998097',
    slCardInfo: 'Vstup k vodopádům a parkování zdarma.',
    noteKey: 'note_krimml',
    dogPrice: 'Vstup zdarma (psi jsou vítáni)',
    dogInfo:
      'Psi mají vstup na vyhlídkovou trasu povolen na vodítku a zdarma. Stezka je zpevněná (asfaltová), ale stoupá strmě a bývá na ní hodně turistů. Vodní tříšť u vyhlídek je velmi intenzivní – citlivější psi se mohou bát hluku vody a stříkajícího aerosolu. Doporučujeme mít s sebou ručník na otření psa. Do vnitřních prostor návštěvnického centra WasserWelten psi nesmí.',
    groupPriceNormal: 'cca 40,00 € (vstupné 8,00 €/os + parkovné cca 8,00 € bez karty)',
    groupPriceCard:
      '0,00 € (vstup na stezku a parkování na vyhrazeném parkovišti P4 je s kartou zdarma)',
    webUrl: 'https://www.krimmler-wasserwelten.at',
    coords: [47.2119, 12.1689],
    imageUrl: '/images/destinations/krimml_waterfalls.webp',
  },
  {
    id: 'tauern_spa',
    name: 'Tauern Spa Kaprun',
    subtitle: 'Wellness & Relax',
    type: 'Wellness & Relax',
    description:
      'Moderní lázeňský a bazénový resort o rozloze 20 000 m² s venkovními i vnitřními bazény, saunami a panoramatickými výhledy na pohoří Vysoké Taury a Kitzsteinhorn.',
    highlights: [
      'Venkovní aktivní bazén s proudem a nezapomenutelným výhledem na ledovec',
      'Velkorysý saunový svět s finskou, solnou, bylinkovou saunou a infrakabinami',
      'Relaxační zóny s lehátky, vnitřní vířivky a skluzavky pro děti',
    ],
    tips: 'Ideální program pro deštivé odpoledne nebo pro zasloužený odpočinek po náročné túře. O víkendech a při špatném počasí bývá plno, doporučuje se rezervovat vstup předem online.',
    mapyUrl: 'https://mapy.com/cs/turisticka?source=osm&id=1025788061',
    slCardInfo: 'Sleva na vstupné s kartou.',
    noteKey: 'note_tauern',
    dogPrice: 'Vstup se psem zakázán',
    dogInfo: 'Z hygienických důvodů mají psi do celého komplexu Tauern Spa přísný zákaz vstupu.',
    groupPriceNormal: '140,00 € (cca 35,00 € za 3hodinový vstup pro dospělého)',
    groupPriceCard:
      'cca 120,00 € (se SalzburgerLand Card získáte slevu cca 15 % na jednorázový vstup)',
    webUrl: 'https://www.tauernspakaprun.com',
    coords: [47.2831, 12.7601],
    imageUrl: '/images/destinations/tauern_spa.webp',
  },
];
