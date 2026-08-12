/**
 * Jouw eetritme.
 *
 * De tweede vragenlijst op deze site, naast de routinetest. Waar die over de
 * volgorde van producten gaat, gaat deze over de vórm van een dag: wanneer je
 * eet, hoe het op tafel komt, en hoe vast dat ligt.
 *
 * Waarom die invalshoek en niet "welk huidtype ben jij": een huidtype is geen
 * eigenschap die een vragenlijst kan vaststellen, en elke site heeft er al een.
 * Een ritme kun je wél gewoon opschrijven — je weet zelf of je ontbijt — en het
 * is het enige aanknopingspunt dat deze pijler eerlijk heeft.
 *
 * Alle tekst staat hier en nergens anders, omdat `scripts/check-compliance.mjs`
 * dit bestand langs dezelfde verboden-taalpatronen haalt als de artikelen. De
 * regels staan bij de types in `src/lib/vragenlijst.ts`.
 *
 * Drie dingen die deze lijst nadrukkelijk níét doet:
 *
 * 1. Hij stelt niets vast. De uitkomst beschrijft een ritme dat je zelf hebt
 *    ingevoerd, en zegt welke voedingsgroepen bij zo'n dagindeling in de
 *    praktijk vaak buiten beeld blijven. Dat is een observatie over een
 *    dagindeling, geen uitspraak over een lichaam.
 * 2. Hij belooft niets. Nergens staat wat een groep zou doen — alleen wat het
 *    is en wanneer het past.
 * 3. Waar een voedingsstof genoemd wordt, staat er uitsluitend de letterlijke
 *    goedgekeurde bewoording bij, overgenomen uit `data/toegestane-claims.json`.
 *    Een eigen formulering van diezelfde claim is een verboden claim, ook als
 *    hij hetzelfde betekent.
 */

import type { Vragenlijst } from '../lib/vragenlijst';

/*
  Zes vragen. Geen enkele gaat over een klacht, een aandoening of een gewicht;
  ze gaan over hoe een doordeweekse dag eruitziet. Wie een vraag naar een
  aandoening verwacht en hem niet vindt, leest hier precies de bedoeling.
*/
const vragen = [
  {
    id: 'ochtend',
    vraag: 'Hoe ziet je ochtend eruit?',
    hulp: 'Neem een doordeweekse dag, niet je beste dag.',
    antwoorden: [
      { id: 'uitgebreid', tekst: 'Uitgebreid ontbijt', punten: { vroeg: 3, vast: 1 } },
      { id: 'koffie', tekst: 'Alleen koffie', punten: { laat: 3 } },
      { id: 'onderweg', tekst: 'Iets onderweg', punten: { onderweg: 3 } },
      { id: 'wisselt', tekst: 'Het wisselt', punten: { wisselend: 2 } },
    ],
  },
  {
    id: 'hoofdmaaltijd',
    vraag: 'Wanneer eet je je grootste maaltijd?',
    antwoorden: [
      { id: 'middag', tekst: 'Tussen de middag', punten: { vroeg: 3 } },
      { id: 'vroegeavond', tekst: 'Vroeg in de avond', punten: { vast: 2, vroeg: 1 } },
      { id: 'laat', tekst: 'Laat op de avond', punten: { laat: 3 } },
      { id: 'verschilt', tekst: 'Dat verschilt', punten: { wisselend: 3 } },
    ],
  },
  {
    id: 'koken',
    vraag: 'Hoe komt het eten meestal op tafel?',
    antwoorden: [
      { id: 'vers', tekst: 'Vers gekookt', punten: { vast: 3 } },
      { id: 'deels', tekst: 'Deels kant-en-klaar', punten: { onderweg: 2, wisselend: 1 } },
      { id: 'restjes', tekst: 'Vaak restjes', punten: { vast: 1, laat: 1 } },
      { id: 'buitendeur', tekst: 'Buiten de deur', punten: { onderweg: 3 } },
    ],
  },
  {
    id: 'gezelschap',
    vraag: 'Eet je meestal aan tafel?',
    hulp: 'Of achter je laptop, of staand in de keuken.',
    antwoorden: [
      { id: 'tafel', tekst: 'Aan tafel', punten: { vast: 2, vroeg: 1 } },
      { id: 'werk', tekst: 'Achter mijn werk door', punten: { onderweg: 3 } },
      { id: 'bank', tekst: 'Op de bank', punten: { laat: 2 } },
      { id: 'staand', tekst: 'Staand, tussendoor', punten: { onderweg: 2, wisselend: 1 } },
    ],
  },
  {
    id: 'drinken',
    vraag: 'Wat drink je op zo’n dag het meest?',
    antwoorden: [
      { id: 'water', tekst: 'Water', punten: { vast: 2 } },
      { id: 'koffie', tekst: 'Koffie of thee', punten: { laat: 1, onderweg: 1 } },
      { id: 'zoet', tekst: 'Iets zoets', punten: { wisselend: 2 } },
      { id: 'wisseltdrank', tekst: 'Dat wisselt sterk', punten: { wisselend: 2 } },
    ],
  },
  {
    id: 'vastheid',
    vraag: 'Hoe vast ligt dit allemaal?',
    antwoorden: [
      { id: 'elkedag', tekst: 'Elke dag hetzelfde', punten: { vast: 3 } },
      { id: 'doordeweeks', tekst: 'Doordeweeks wel', punten: { vast: 1, vroeg: 1 } },
      { id: 'losjes', tekst: 'Het loopt zoals het loopt', punten: { wisselend: 3 } },
      { id: 'nooitgelet', tekst: 'Daar let ik nooit op', punten: { wisselend: 2, onderweg: 1 } },
    ],
  },
];

const lezen = (slug: string, titel: string) => ({ titel, pad: `/gut-skin/${slug}` });

/*
  Vijf ritmes. Elk onderdeel beschrijft een voedingsgroep: wat het is en op welk
  moment van zo'n dag het past. Waar een voedingsstof genoemd wordt, staat de
  goedgekeurde bewoording er letterlijk bij — in het veld `claim`, zodat hij in
  de opmaak ook zichtbaar als citaat behandeld kan worden en niet als onze eigen
  bewering leest.
*/
const profielen = [
  {
    id: 'vroeg',
    naam: 'Het vroege ritme',
    samenvatting:
      'Je zwaartepunt ligt in de eerste helft van de dag: je ontbijt echt, en je warme maaltijd staat er vaak al voor de avond valt. Dat is een indeling waarin de meeste voedingsgroepen vanzelf langskomen; wat er hier misgaat, gaat meestal laat op de avond mis.',
    accent: 'perzik' as const,
    beeld: 'biotine',
    beeldAlt: 'Bruine eieren in een draadmandje, met één ei gebroken in een wit kommetje.',
    onderdelen: [
      {
        label: 'Ochtend',
        naam: 'Ei, zuivel of peulvruchten',
        tekst:
          'De eiwitbron van het ontbijt. In een vroeg ritme is dit de maaltijd waar de meeste ruimte voor is, en tegelijk de maaltijd die het vaakst uit alleen brood bestaat.',
        claim: 'Biotine draagt bij tot de instandhouding van normale huid',
      },
      {
        label: 'Ochtend',
        naam: 'Volkoren graan',
        tekst:
          'Brood, havermout of muesli van volkoren graan bevat de zemel — de buitenste laag van de korrel, die bij wit meel wordt weggeslepen. Dat is ook de laag waar de vezels in zitten.',
        claim: 'Haverkorrelvezels dragen bij tot een vergroting van de fecale bulk',
      },
      {
        label: 'Rond de hoofdmaaltijd',
        naam: 'Groente in twee kleuren',
        tekst:
          'Twee soorten in plaats van één is geen regel maar een praktisch trucje: het is makkelijker te onthouden dan een gewicht, en het levert vanzelf meer variatie op.',
        claim: 'Vitamine C draagt bij tot de normale collageenvorming voor de normale werking van de huid',
      },
      {
        label: 'Later op de dag',
        naam: 'De avond',
        tekst:
          'Bij een vroeg zwaartepunt is de avond het gat. Wat daar terechtkomt is vaker zoet dan bij welk ander ritme ook — niet omdat het slecht gaat, maar omdat de honger dan pas komt en er niets klaarstaat.',
        artikel: lezen('suiker-en-glycatie', 'Suiker en glycatie'),
      },
    ],
  },
  {
    id: 'laat',
    naam: 'Het late ritme',
    samenvatting:
      'Je begint de dag met weinig en haalt het later in. Dat is een volstrekt gangbaar patroon; het praktische gevolg is alleen dat alles wat je op een dag eet, in een kortere tijdspanne moet passen — en dat er dus makkelijker iets buiten valt.',
    accent: 'paars' as const,
    beeld: 'gefermenteerde-soja',
    beeldAlt: 'Traditionele Koreaanse aardewerken potten op een stenen terras in ochtendlicht.',
    onderdelen: [
      {
        label: 'Eerste eetmoment',
        naam: 'Iets hartigs',
        tekst:
          'Wat het eerste eetmoment ook is, in een laat ritme is het meteen ook je grootste kans op groente en eiwit. Begint dat moment met iets zoets, dan schuift de rest mee naar achteren.',
      },
      {
        label: 'Hoofdmaaltijd',
        naam: 'Noten, zaden en pitten',
        tekst:
          'Een handjevol naast de maaltijd in plaats van chips ervoor. Pompoenpitten en cashewnoten zijn hier de gebruikelijke keuze in Koreaanse en Nederlandse keukens allebei.',
        claim: 'Zink draagt bij tot de instandhouding van een normale huid',
        artikel: lezen('zink-in-je-eten', 'Zink in je eten'),
      },
      {
        label: 'Hoofdmaaltijd',
        naam: 'Gefermenteerde groente',
        tekst:
          'Kimchi, zuurkool, tafelzuur. In de Koreaanse keuken staat dit standaard naast de maaltijd in plaats van erin, wat praktisch is: het vraagt geen kooktijd op het moment dat je die niet hebt.',
        artikel: lezen('darmmicrobioom-en-huidmicrobioom', 'Darmmicrobioom en huidmicrobioom'),
      },
      {
        label: 'Voor het slapen',
        naam: 'Het laatste uur',
        tekst:
          'Laat eten en slecht slapen worden vaak in één adem genoemd. Wat daar wel en niet over vaststaat — en hoe mager dat laatste is — staat in het artikel.',
        artikel: lezen('slaap-en-huid', 'Slaap en huid'),
      },
    ],
  },
  {
    id: 'onderweg',
    naam: 'Het ritme onderweg',
    samenvatting:
      'Je eet rond je dag heen in plaats van andersom: staand, achter je werk, of tussen twee dingen door. Dit ritme heeft één praktisch kenmerk dat alle andere overheerst — wat er niet klaarligt, wordt niet gegeten.',
    accent: 'roze' as const,
    beeld: 'zink-in-je-eten',
    beeldAlt: 'Pompoenpitten en cashewnoten uit een papieren zak, uitgestrooid op licht linnen.',
    onderdelen: [
      {
        label: 'Op voorraad',
        naam: 'Iets houdbaars in je tas',
        tekst:
          'Noten, gedroogde vruchten, een banaan. Niet omdat dit beter is dan een maaltijd, maar omdat het het enige is wat het wint van niets.',
        claim: 'Vitamine E draagt bij tot de bescherming van cellen tegen oxidatieve stress',
        artikel: lezen('vitamine-e-op-je-bord', 'Vitamine E op je bord'),
      },
      {
        label: 'Tussendoor',
        naam: 'Rauwkost die geen bord vraagt',
        tekst:
          'Snoeptomaatjes, worteltjes, komkommer. De hele categorie bestaat bij de gratie van het feit dat je er niets voor hoeft te doen.',
      },
      {
        label: 'Eén warme maaltijd',
        naam: 'Wat er die dag ook gebeurt',
        tekst:
          'Bij dit ritme is één vast warm moment per dag meer waard dan een plan voor alle drie. Het is ook het enige moment waarop groente in bulk je dag in komt.',
      },
      {
        label: 'Drinken',
        naam: 'Wat er in de fles zit',
        tekst:
          'Onderweg drinken mensen wat er voorhanden is, en dat is zelden water. Het is de makkelijkste post om te veranderen, precies omdat er geen bereiding aan te pas komt.',
      },
    ],
  },
  {
    id: 'vast',
    naam: 'Het vaste ritme',
    samenvatting:
      'Je eet op vaste momenten, meestal vers, en meestal aan tafel. Dat is de indeling waar het minst aan te sleutelen valt — de winst zit hier niet in meer structuur maar in meer variatie binnen de structuur die er al staat.',
    accent: 'mint' as const,
    beeld: 'voeding-en-huid',
    beeldAlt: 'Een ondiepe keramische schaal met granen en zaden naast een handvol verse groenten.',
    onderdelen: [
      {
        label: 'Door de week',
        naam: 'Dezelfde maaltijd, andere groente',
        tekst:
          'Een vast ritme wordt vanzelf een vast boodschappenlijstje. Eén groente per week vervangen door een andere kost niets en verandert het patroon meer dan een nieuw recept.',
      },
      {
        label: 'Hoofdmaaltijd',
        naam: 'Vis, ei of peulvrucht',
        tekst:
          'Afwisseling in de eiwitbron is bij dit ritme de post die het snelst vastroest, simpelweg omdat wat werkt blijft staan.',
        claim: 'Seleen draagt bij tot de instandhouding van normaal haar',
      },
      {
        label: 'Bij het ontbijt',
        naam: 'Zuivel of een alternatief',
        tekst:
          'Yoghurt, kwark, of een plantaardige variant. Over zuivel en huid wordt veel beweerd; wat daarvan navolgbaar is, staat in het artikel.',
        artikel: lezen('zuivel-en-acne', 'Zuivel en acne'),
      },
      {
        label: 'Wekelijks',
        naam: 'Volkoren en peulvruchten',
        tekst:
          'De vezelkant van een vast patroon. Rogge en haver zijn hier de twee waarover Europa daadwerkelijk iets heeft goedgekeurd, en dat is zeldzaam genoeg om te noemen.',
        claim: 'Roggevezels dragen bij tot een normale darmfunctie',
      },
    ],
  },
  {
    id: 'wisselend',
    naam: 'Het wisselende ritme',
    samenvatting:
      'Er zit geen vaste vorm in je dagen, en dat is geen tekortkoming maar een gegeven. Bij dit ritme werkt een schema niet; wat wel werkt, is een korte lijst dingen die altijd in huis zijn, ongeacht hoe de dag loopt.',
    accent: 'paars' as const,
    beeld: 'vitamine-e-op-je-bord',
    beeldAlt: 'Zonnebloempitten uit een gevouwen papieren zakje op lichte steen.',
    onderdelen: [
      {
        label: 'In de kast',
        naam: 'Vier dingen die niet bederven',
        tekst:
          'Havermout, noten, een pot peulvruchten, en iets van olie. Dit is geen maaltijd maar een ondergrens: het verschil tussen een rare dag en een lege dag.',
      },
      {
        label: 'In de vriezer',
        naam: 'Groente die je vergeten mag',
        tekst:
          'Diepvriesgroente is bij een onvoorspelbaar ritme de enige groente die het overleeft. Hij is ook kort na de oogst ingevroren, wat voor de inhoud weinig uitmaakt en voor de planning alles.',
      },
      {
        label: 'Wanneer het uitkomt',
        naam: 'Eén ding per dag dat je zeker eet',
        tekst:
          'Bij een wisselend patroon is één vast onderdeel bruikbaarder dan een hele dagindeling, juist omdat het overal in past.',
        claim: 'Zink draagt bij tot de bescherming van cellen tegen oxidatieve stress',
      },
      {
        label: 'Achteraf',
        naam: 'Terugkijken in plaats van vooruitplannen',
        tekst:
          'Een week terugkijken laat een patroon zien dat vooruitplannen bij dit ritme nooit oplevert. Wat er structureel ontbreekt, valt dan vanzelf op.',
        artikel: lezen('voeding-en-huid', 'Voeding en huid'),
      },
    ],
  },
];

export const eetritme: Vragenlijst = {
  sleutel: 'eetritme',
  vragen,
  profielen,
  onderdeelNaam: 'groepen',
  slotknop: 'Toon mijn ritme',
  voorbehoud:
    'Dit is een leeswijzer, geen voedingsadvies en geen beoordeling van je gezondheid. De uitkomst volgt uit zes vragen over je dagindeling en zegt niets over jouw lichaam. Zit je met een klacht, een dieet of een tekort, dan is een diëtist of arts de aangewezen persoon — niet een vragenlijst.',
};
