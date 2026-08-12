/**
 * De routinetest.
 *
 * Alle tekst van de test staat hier, en nergens anders. Dat is geen
 * netheidskwestie: `scripts/check-compliance.mjs` leest dit bestand en haalt
 * elke tekenreeks erin langs dezelfde verboden-taalpatronen als de artikelen.
 * Zet je testteksten in een `.astro`-bestand, dan ontsnappen ze aan die
 * controle.
 *
 * De regels waaraan deze lijst moet voldoen staan bij de types, in
 * `src/lib/vragenlijst.ts`. Kort: geen vraag over een aandoening, geen uitkomst
 * die iets belooft, geen merken.
 *
 * Over de antwoorden: die zijn kort gehouden, twee tot vier woorden. Een test
 * met acht vragen mag niet aanvoelen als acht alinea's lezen — je scant vier
 * woorden, kiest, en bent door.
 */

import type { Onderdeel, Vragenlijst } from '../lib/vragenlijst';

/*
  Acht vragen. Uit DV13-01 (onderzoek/06) blijkt dat afhaken oploopt met het
  aantal vragen, met de scherpste stijging tot een stuk of vijftien; acht korte
  vragen blijft daar ruim onder en levert een uitkomst op die ergens op steunt.
*/
const vragen = [
  {
    id: 'gevoel',
    vraag: 'Hoe voelt je huid een uur na het wassen?',
    hulp: 'Zonder dat je er iets op hebt gedaan.',
    antwoorden: [
      { id: 'strak', tekst: 'Strak', punten: { comfort: 3 } },
      { id: 'prettig', tekst: 'Prettig', punten: { glans: 1, stevigheid: 1 } },
      { id: 'tzone', tekst: 'Glanzend op de T-zone', punten: { balans: 3 } },
      { id: 'warm', tekst: 'Warm of rood', punten: { rust: 3 } },
    ],
  },
  {
    id: 'spiegel',
    vraag: 'Waar zou je het liefst op letten?',
    antwoorden: [
      { id: 'dof', tekst: 'Een doffe teint', punten: { glans: 3 } },
      { id: 'droog', tekst: 'Droge plekjes', punten: { comfort: 3 } },
      { id: 'olie', tekst: 'Glans in de loop van de dag', punten: { balans: 3 } },
      { id: 'veerkracht', tekst: 'Veerkracht', punten: { stevigheid: 3 } },
    ],
  },
  {
    id: 'stappen',
    vraag: "Hoeveel stappen doe je 's avonds echt?",
    hulp: 'Niet wat je zou willen — wat je volhoudt.',
    antwoorden: [
      { id: 'twee', tekst: 'Twee', punten: { rust: 3 } },
      { id: 'drie', tekst: 'Drie of vier', punten: { balans: 1, comfort: 1 } },
      { id: 'vijf', tekst: 'Vijf of meer', punten: { stevigheid: 2, glans: 1 } },
      { id: 'wisselt', tekst: 'Wisselt sterk', punten: {} },
    ],
  },
  {
    id: 'nieuw',
    vraag: 'Hoe reageert je huid op iets nieuws?',
    antwoorden: [
      { id: 'rustig', tekst: 'Rustig', punten: { stevigheid: 1, glans: 1 } },
      { id: 'soms', tekst: 'Soms prikkend', punten: { comfort: 1, rust: 1 } },
      { id: 'snel', tekst: 'Snel rood', punten: { rust: 3 } },
      { id: 'onbekend', tekst: 'Geen idee', punten: {} },
    ],
  },
  {
    id: 'textuur',
    vraag: 'Welke textuur werkt voor jou?',
    antwoorden: [
      { id: 'gel', tekst: 'Gel', punten: { balans: 3 } },
      { id: 'lotion', tekst: 'Lotion', punten: { glans: 1, balans: 1 } },
      { id: 'creme', tekst: 'Rijke crème', punten: { comfort: 3 } },
      { id: 'olie', tekst: 'Olie', punten: { comfort: 1, stevigheid: 1 } },
    ],
  },
  {
    id: 'zon',
    vraag: 'Hoeveel ben je overdag buiten?',
    antwoorden: [
      { id: 'veel', tekst: 'Bijna dagelijks', punten: { glans: 1, stevigheid: 1 } },
      { id: 'soms', tekst: 'Een paar keer per week', punten: {} },
      { id: 'weinig', tekst: 'Zelden', punten: {} },
    ],
  },
  {
    id: 'aantrekking',
    vraag: 'Wat trekt je aan in Koreaanse routines?',
    antwoorden: [
      { id: 'glans', tekst: 'De glans', punten: { glans: 3 } },
      { id: 'rust', tekst: 'De rust', punten: { rust: 3 } },
      { id: 'laagjes', tekst: 'De laagjes', punten: { comfort: 2, stevigheid: 1 } },
      { id: 'ingredient', tekst: 'De ingrediënten', punten: { stevigheid: 2, balans: 1 } },
    ],
  },
  {
    id: 'tijd',
    vraag: 'Hoeveel tijd wil je eraan kwijt zijn?',
    antwoorden: [
      { id: 'kort', tekst: 'Zo min mogelijk', punten: { rust: 3 } },
      { id: 'normaal', tekst: 'Een paar minuten', punten: { balans: 1, comfort: 1 } },
      { id: 'lang', tekst: 'Het mag een moment zijn', punten: { stevigheid: 2, glans: 1 } },
    ],
  },
];

const artikel = (slug: string, titel: string) => ({ titel, pad: `/ingredienten/${slug}` });

const reinigenOchtend: Onderdeel = {
  label: 'Ochtend',
  naam: 'Reinigen met water',
  tekst:
    "'s Ochtends ligt er alleen wat er 's nachts op is gekomen. Water of een milde reiniger is dan genoeg; twee keer per dag stevig wassen is voor de meeste huiden meer dan nodig.",
};

const zon: Onderdeel = {
  label: 'Ochtend',
  naam: 'Zonnebrand',
  tekst:
    'De laatste stap van de ochtend, over alles heen. Dit is de enige stap die in alle vijf de routines hetzelfde is, en de enige waarvan het effect buiten kijf staat.',
};

/*
  Vijf routines. De volgorde is de gangbare Koreaanse volgorde — dun naar dik,
  waterig naar olieachtig — en elk onderdeel beschrijft wát een productcategorie
  is en waarom hij op die plek staat, niet wat hij zou doen.
*/
const profielen = [
  {
    id: 'comfort',
    naam: 'Comfort',
    samenvatting:
      'Je huid trekt strak en je zoekt vooral texturen die dat gevoel wegnemen. Deze routine is opgebouwd rond stoffen die water vasthouden en rond de vetten die in de hoornlaag zelf voorkomen.',
    accent: 'perzik' as const,
    beeld: 'hyaluronzuur',
    beeldAlt: 'Een waterdruppel op een doorschijnend vlak, met het licht erachter.',
    onderdelen: [
      reinigenOchtend,
      {
        label: 'Avond',
        naam: 'Milde reiniging',
        tekst:
          'Een reiniger die niet of nauwelijks schuimt. Vuistregel: hoe strakker je huid na het wassen aanvoelt, hoe meer er is meegegaan dan alleen vuil.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Toner of essence',
        tekst:
          'Een waterige laag op de nog vochtige huid, zodat de lagen erna iets hebben om op te liggen. Rijstextract komt in deze categorie veel voor.',
        artikel: artikel('rijstextract', 'Rijstextract'),
      },
      {
        label: 'Ochtend en avond',
        naam: 'Serum met hyaluronzuur',
        tekst:
          'Hyaluronzuur bindt water. Over molecuulgrootte wordt van alles beweerd; wat daarvan onderbouwd is en wat niet, staat in het artikel.',
        artikel: artikel('hyaluronzuur', 'Hyaluronzuur'),
      },
      {
        label: 'Ochtend en avond',
        naam: 'Crème met ceramiden',
        tekst:
          'Ceramiden zijn lipiden die van nature in de hoornlaag zitten. De crème is de laag die de waterige lagen eronder afsluit — daarom komt hij als laatste van de verzorging.',
        artikel: artikel('ceramiden', 'Ceramiden'),
      },
      zon,
    ],
  },
  {
    id: 'balans',
    naam: 'Balans',
    samenvatting:
      'Je huid glanst in de loop van de dag, maar niet overal en niet altijd. Deze routine houdt de texturen licht en legt het accent op één van de best onderzochte ingrediënten uit de categorie.',
    accent: 'mint' as const,
    beeld: 'niacinamide',
    beeldAlt: 'Fijn wit poeder in een glazen schaaltje op licht linnen.',
    onderdelen: [
      reinigenOchtend,
      {
        label: 'Avond',
        naam: 'Reinigen in twee stappen',
        tekst:
          'Eerst iets op oliebasis, daarna een waterige reiniger. Olie pakt wat op olie lijkt — zonnebrand en make-up — en water doet de rest. Draag je overdag geen van beide, dan is één stap genoeg.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Lichte toner',
        tekst: 'Een dunne laag die intrekt zonder dat er een film achterblijft.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Serum met niacinamide',
        tekst:
          'Niacinamide is een van de weinige ingrediënten in deze hoek waar behoorlijk wat naar gekeken is. Wat dat oplevert — en waar het ophoudt — staat in het artikel.',
        artikel: artikel('niacinamide', 'Niacinamide'),
      },
      {
        label: 'Ochtend en avond',
        naam: 'Gel of lichte emulsie',
        tekst:
          'Dezelfde plek in de volgorde als een crème, alleen dunner. Een vette huid heeft net zo goed een afsluitende laag nodig; die hoeft alleen niet zwaar te zijn.',
      },
      zon,
    ],
  },
  {
    id: 'rust',
    naam: 'Rust',
    samenvatting:
      'Je huid reageert snel en je houdt van weinig stappen. Dit is de kortste routine van de vijf: vier stappen, en verder zo min mogelijk tegelijk veranderen.',
    accent: 'mint' as const,
    beeld: 'centella-asiatica',
    beeldAlt: 'Ronde bladeren van waternavel, nat van de dauw, op donkere aarde.',
    onderdelen: [
      reinigenOchtend,
      {
        label: 'Avond',
        naam: 'Milde reiniging',
        tekst: 'Eén reiniger, elke avond dezelfde, die je huid niet strak achterlaat.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Eén verzorgende laag',
        tekst:
          'Centella asiatica komt in deze categorie veel voor. Bij een huid die snel reageert is één laag die bevalt meer waard dan drie die je nog aan het uitproberen bent.',
        artikel: artikel('centella-asiatica', 'Centella asiatica'),
      },
      {
        label: 'Ochtend en avond',
        naam: 'Crème',
        tekst:
          'Eén crème, elke dag dezelfde. Voeg iets nieuws hooguit één keer per twee weken toe, anders weet je bij een reactie niet waar hij vandaan kwam.',
      },
      zon,
    ],
  },
  {
    id: 'glans',
    naam: 'Glans',
    samenvatting:
      'Je vindt je huid vooral dof ogen, en die glanzende look is precies waarom je naar K-beauty kijkt. Deze routine draait om de twee ingrediënten waar die look het vaakst aan wordt opgehangen.',
    accent: 'roze' as const,
    beeld: 'galactomyces',
    beeldAlt: 'Een glazen kan met troebel rijstferment waarin fijne belletjes opstijgen.',
    onderdelen: [
      reinigenOchtend,
      {
        label: 'Avond',
        naam: 'Reinigen in twee stappen',
        tekst:
          'Eerst op oliebasis, daarna waterig — de gangbare opzet als je overdag zonnebrand draagt.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Ferment-essence',
        tekst:
          'Galactomyces is het bekendste ferment in deze hoek. Het is ook het ingrediënt met het grootste belangenprobleem in zijn eigen dossier, en dat is precies waarom het artikel bestaat.',
        artikel: artikel('galactomyces', 'Galactomyces'),
      },
      {
        label: 'Ochtend',
        naam: 'Serum met vitamine C',
        tekst:
          "Vitamine C is instabiel, en dat is bij dit ingrediënt het hele verhaal. Daarom 's ochtends, en daarom let je op de verpakking.",
        artikel: artikel('vitamine-c', 'Vitamine C'),
      },
      {
        label: 'Ochtend en avond',
        naam: 'Lichte crème',
        tekst:
          'Genoeg om de lagen eronder vast te houden, niet zo zwaar dat je huid anders aanvoelt.',
      },
      zon,
    ],
  },
  {
    id: 'stevigheid',
    naam: 'Stevigheid',
    samenvatting:
      'Je let op veerkracht en je vindt de routine zelf een prettig moment. Dit is de langste routine, en de twee ingrediënten erin zijn ook de twee waar de meeste vragen bij te stellen zijn.',
    accent: 'paars' as const,
    beeld: 'snail-mucin',
    beeldAlt: 'Een glanzende spiraalschelp van bovenaf op natte leisteen.',
    onderdelen: [
      reinigenOchtend,
      {
        label: 'Avond',
        naam: 'Reinigen in twee stappen',
        tekst: 'Eerst op oliebasis, daarna waterig.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Toner',
        tekst: 'Een waterige laag op de nog vochtige huid, als basis voor de lagen erna.',
      },
      {
        label: 'Ochtend en avond',
        naam: 'Serum met snail mucin',
        tekst:
          'Slakkenfiltraat werd om een opmerkelijke reden populair, en die reden had weinig met bewijs te maken. Wat het is en wat er wél over bekend is, staat in het artikel.',
        artikel: artikel('snail-mucin', 'Snail mucin'),
      },
      {
        label: 'Avond',
        naam: 'Ampul met PDRN',
        tekst:
          'PDRN komt uit een heel andere hoek dan de cosmetica. Lees vooral het stuk over wélke toedieningsvorm bekeken is — dat is niet die van een ampul op je huid.',
        artikel: artikel('pdrn', 'PDRN en zalm-DNA'),
      },
      {
        label: 'Ochtend en avond',
        naam: 'Crème met ceramiden',
        tekst: 'De afsluitende laag, met de lipiden die ook in de hoornlaag zelf voorkomen.',
        artikel: artikel('ceramiden', 'Ceramiden'),
      },
      zon,
    ],
  },
];

export const routinetest: Vragenlijst = {
  sleutel: 'routine',
  vragen,
  profielen,
  onderdeelNaam: 'stappen',
  slotknop: 'Toon mijn stappenplan',
  voorbehoud:
    'Dit is een leeswijzer, geen huidadvies. De uitkomst volgt uit acht voorkeursvragen en niet uit een beoordeling van je huid. Twijfel je ergens over, dan is een huidtherapeut of arts de aangewezen persoon — niet een vragenlijst.',
};
