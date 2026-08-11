/**
 * De routinetest.
 *
 * Alle tekst van de test staat hier, en nergens anders. Dat is geen
 * netheidskwestie: `scripts/check-compliance.mjs` leest dit bestand en haalt
 * elke zin erin langs dezelfde verboden-taalpatronen als de artikelen. Zet je
 * testteksten in een `.astro`-bestand, dan ontsnappen ze aan die controle.
 *
 * Drie regels die het ontwerp hiervan sturen (onderzoek/06, par. 4.4):
 *
 * 1. Geen vraag gaat over een aandoening. Vragen gaan over hoe de huid
 *    aanvoelt en wat iemand prettig vindt. Een vraag naar acne, eczeem of
 *    rosacea zou hiervan een diagnose-instrument maken, en dat is precies wat
 *    de regels uit onderzoek/04, par. 4.3 verbieden.
 * 2. Geen uitkomst belooft een effect. De uitkomst is een leeswijzer: welke
 *    stappen bestaan er, en waar staat het artikel dat erover gaat.
 * 3. Geen merken, geen productnamen, geen affiliate-links. Die fase begint
 *    pas later (TAKEN.md, Fase 4) en zou de disclosureplicht meebrengen — ook
 *    op deze pagina.
 */

import type { Motief } from '../components/ArtikelBeeld.astro';

export type ProfielId = 'comfort' | 'balans' | 'rust' | 'glans' | 'stevigheid';

export interface Antwoord {
  id: string;
  tekst: string;
  /** Punten per profiel. Een antwoord mag ook nergens punten aan geven. */
  punten: Partial<Record<ProfielId, number>>;
}

export interface Vraag {
  id: string;
  vraag: string;
  hulp?: string;
  antwoorden: Antwoord[];
}

export interface Stap {
  naam: string;
  tekst: string;
  /** Optionele verwijzing naar het artikel dat over deze stap of dit ingrediënt gaat. */
  artikel?: { titel: string; pad: string };
}

export interface Profiel {
  id: ProfielId;
  naam: string;
  /** Eén zin die beschrijft wat dit profiel is — geen belofte over wat het doet. */
  samenvatting: string;
  accent: 'roze' | 'paars' | 'perzik' | 'mint';
  motief: Motief;
  stappen: Stap[];
}

/*
  Vijf vragen. Uit DV13-01 (onderzoek/06) blijkt dat afhaken oploopt met het
  aantal vragen, met de scherpste stijging tot een stuk of vijftien. Ver onder
  die grens blijven kost hier niets: meer vragen zouden de uitkomst niet
  preciezer maken, want er zijn maar vijf profielen om tussen te kiezen.
*/
export const vragen: Vraag[] = [
  {
    id: 'gevoel',
    vraag: 'Hoe voelt je huid ongeveer een uur nadat je hem gewassen hebt?',
    hulp: 'Zonder dat je er iets op hebt gedaan.',
    antwoorden: [
      { id: 'strak', tekst: 'Strak, alsof er iets overheen moet', punten: { comfort: 3 } },
      { id: 'rustig', tekst: 'Gewoon prettig — niet strak, niet glanzend', punten: { glans: 1, stevigheid: 1 } },
      { id: 'tzone', tekst: 'Glanzend op voorhoofd en neus, elders niet', punten: { balans: 3 } },
      { id: 'warm', tekst: 'Warm of rood, mijn huid reageert snel', punten: { rust: 3 } },
    ],
  },
  {
    id: 'product',
    vraag: 'Waar let je op als je iets nieuws uitzoekt?',
    antwoorden: [
      { id: 'licht', tekst: 'Dat het licht aanvoelt en snel intrekt', punten: { balans: 2, glans: 1 } },
      { id: 'rijk', tekst: 'Dat het rijk en verzachtend aanvoelt', punten: { comfort: 3 } },
      { id: 'kort', tekst: 'Dat er zo min mogelijk in zit', punten: { rust: 3 } },
      { id: 'bron', tekst: 'Dat er onderzoek achter het ingrediënt zit', punten: { stevigheid: 2, glans: 1 } },
    ],
  },
  {
    id: 'stappen',
    vraag: "Hoeveel stappen wil je 's avonds realistisch gezien doen?",
    hulp: 'Niet wat je zou moeten willen — wat je echt volhoudt.',
    antwoorden: [
      { id: 'twee', tekst: 'Twee of drie, meer niet', punten: { rust: 2, balans: 1 } },
      { id: 'vier', tekst: 'Een stuk of vier', punten: { comfort: 1, glans: 1 } },
      { id: 'veel', tekst: 'Zoveel als nodig, ik vind het een fijn moment', punten: { stevigheid: 2, glans: 1 } },
      { id: 'weet-niet', tekst: 'Geen idee, daarom doe ik deze test', punten: {} },
    ],
  },
  {
    id: 'aantrekking',
    vraag: 'Wat spreekt je het meest aan aan Koreaanse huidverzorging?',
    antwoorden: [
      { id: 'glans', tekst: 'Die egale, glanzende look', punten: { glans: 3 } },
      { id: 'rust', tekst: 'De rust: weinig producten, weinig prikkels', punten: { rust: 3 } },
      { id: 'laagjes', tekst: 'Het laagjes opbouwen en de texturen', punten: { comfort: 2, stevigheid: 1 } },
      { id: 'ingredient', tekst: 'De ingrediënten en wat erover bekend is', punten: { stevigheid: 2, balans: 1 } },
    ],
  },
  {
    id: 'wens',
    vraag: 'Waar zou je een routine het liefst op willen afstemmen?',
    antwoorden: [
      { id: 'comfort', tekst: 'Dat mijn huid de hele dag comfortabel aanvoelt', punten: { comfort: 3 } },
      { id: 'mat', tekst: 'Dat mijn huid er in de loop van de dag minder glanzend uitziet', punten: { balans: 3 } },
      { id: 'wakker', tekst: 'Dat mijn huid er wakkerder uitziet', punten: { glans: 3 } },
      { id: 'steviger', tekst: 'Dat mijn huid steviger aanvoelt', punten: { stevigheid: 3 } },
      { id: 'simpel', tekst: 'Dat ik er zo min mogelijk over hoef na te denken', punten: { rust: 3 } },
    ],
  },
];

const artikel = (slug: string, titel: string) => ({ titel, pad: `/ingredienten/${slug}` });

/*
  Vijf routines. De volgorde van de stappen is de gangbare volgorde in
  Koreaanse routines — dun naar dik, waterig naar olieachtig — en de stappen
  beschrijven wat een productcategorie ís, niet wat hij zou doen.

  Zonnebrand staat overal als laatste ochtendstap. Dat is geen aanbeveling die
  uit de antwoorden volgt, maar de enige stap die in elke routine hetzelfde is.
*/
export const profielen: Profiel[] = [
  {
    id: 'comfort',
    naam: 'Comfort',
    samenvatting:
      'Je huid voelt snel strak, en je zoekt vooral texturen die dat gevoel wegnemen. Deze routine is opgebouwd rond ingrediënten die water vasthouden en rond de vetten die in de hoornlaag zelf voorkomen.',
    accent: 'perzik',
    motief: 'druppel',
    stappen: [
      {
        naam: 'Milde reiniging',
        tekst:
          'Een reiniger die niet schuimt of maar licht schuimt. Hoe strakker je huid na het wassen aanvoelt, hoe meer er is afgehaald dan alleen vuil.',
      },
      {
        naam: 'Toner of essence',
        tekst:
          'Een waterige laag op de nog vochtige huid. Rijstextract komt in deze categorie veel voor.',
        artikel: artikel('rijstextract', 'Rijstextract'),
      },
      {
        naam: 'Serum met hyaluronzuur',
        tekst:
          'Hyaluronzuur bindt water. Over molecuulgrootte wordt veel beweerd; wat daarvan onderbouwd is, staat in het artikel.',
        artikel: artikel('hyaluronzuur', 'Hyaluronzuur'),
      },
      {
        naam: 'Crème met ceramiden',
        tekst:
          'Ceramiden zijn lipiden die van nature in de hoornlaag zitten. Wat ze daar doen en wat dat betekent voor een crème, staat in het artikel.',
        artikel: artikel('ceramiden', 'Ceramiden'),
      },
      {
        naam: "Zonnebrand, 's ochtends",
        tekst: 'De laatste stap van de ochtendroutine, elke dag opnieuw.',
      },
    ],
  },
  {
    id: 'balans',
    naam: 'Balans',
    samenvatting:
      'Je huid glanst in de loop van de dag, maar niet overal en niet altijd. Deze routine houdt de texturen licht en legt het accent op één goed onderzocht ingrediënt.',
    accent: 'mint',
    motief: 'golven',
    stappen: [
      {
        naam: 'Reiniging in twee stappen',
        tekst:
          "Eerst iets op oliebasis, daarna een waterige reiniger. Vooral relevant als je overdag zonnebrand of make-up draagt.",
      },
      {
        naam: 'Lichte toner',
        tekst: 'Een dunne laag, zonder dat er een film op je huid achterblijft.',
      },
      {
        naam: 'Serum met niacinamide',
        tekst:
          'Niacinamide is een van de best onderzochte ingrediënten in deze categorie. Wat het onderzoek erover zegt — en waar het ophoudt — staat in het artikel.',
        artikel: artikel('niacinamide', 'Niacinamide'),
      },
      {
        naam: 'Lichte gel of emulsie',
        tekst: 'Dunner dan een crème, met dezelfde plek in de volgorde.',
      },
      {
        naam: "Zonnebrand, 's ochtends",
        tekst: 'De laatste stap van de ochtendroutine, elke dag opnieuw.',
      },
    ],
  },
  {
    id: 'rust',
    naam: 'Rust',
    samenvatting:
      'Je huid reageert snel en je houdt van weinig stappen. Deze routine is de kortste van de vijf: vier stappen, en verder zo min mogelijk verandering tegelijk.',
    accent: 'mint',
    motief: 'blad',
    stappen: [
      {
        naam: 'Reiniging met water of een milde reiniger',
        tekst: "'s Ochtends is water vaak genoeg; 's avonds een reiniger die niet strak trekt.",
      },
      {
        naam: 'Eén verzorgende laag',
        tekst:
          'Centella asiatica komt in deze categorie veel voor. Wat cica is en wat erover onderzocht is, staat in het artikel.',
        artikel: artikel('centella-asiatica', 'Centella asiatica'),
      },
      {
        naam: 'Crème',
        tekst: 'Eén crème, elke dag dezelfde. Bij een gevoelige huid is voorspelbaarheid meer waard dan variatie.',
      },
      {
        naam: "Zonnebrand, 's ochtends",
        tekst:
          'De laatste stap van de ochtendroutine. Minerale filters worden vaak als prettiger ervaren, maar dat verschilt per persoon.',
      },
    ],
  },
  {
    id: 'glans',
    naam: 'Glans',
    samenvatting:
      'Je vindt je huid vooral dof ogen en de glanzende look is precies waarom je naar K-beauty kijkt. Deze routine draait om de twee ingrediënten waar die look het vaakst aan wordt opgehangen.',
    accent: 'roze',
    motief: 'ringen',
    stappen: [
      {
        naam: 'Reiniging in twee stappen',
        tekst: 'Eerst op oliebasis, daarna waterig — de gangbare opzet als je overdag zonnebrand draagt.',
      },
      {
        naam: 'Ferment-essence',
        tekst:
          'Galactomyces is het bekendste ferment in deze categorie, en tegelijk het ingrediënt met het grootste belangenprobleem in zijn eigen onderzoek.',
        artikel: artikel('galactomyces', 'Galactomyces'),
      },
      {
        naam: "Serum met vitamine C, 's ochtends",
        tekst:
          'Vitamine C is instabiel, en dat is het hele verhaal bij dit ingrediënt. Wat dat praktisch betekent, staat in het artikel.',
        artikel: artikel('vitamine-c', 'Vitamine C'),
      },
      {
        naam: 'Lichte crème',
        tekst: 'Genoeg om de laag eronder vast te houden, niet zo zwaar dat je huid er anders van aanvoelt.',
      },
      {
        naam: "Zonnebrand, 's ochtends",
        tekst: 'De laatste stap van de ochtendroutine, elke dag opnieuw.',
      },
    ],
  },
  {
    id: 'stevigheid',
    naam: 'Stevigheid',
    samenvatting:
      'Je let op veerkracht en je vindt de routine zelf een prettig moment. Deze routine heeft de meeste stappen, en de twee ingrediënten erin zijn ook de twee waar de meeste vragen over te stellen zijn.',
    accent: 'paars',
    motief: 'vlecht',
    stappen: [
      {
        naam: 'Reiniging in twee stappen',
        tekst: 'Eerst op oliebasis, daarna waterig.',
      },
      {
        naam: 'Toner',
        tekst: 'Een waterige laag op de nog vochtige huid.',
      },
      {
        naam: 'Serum met snail mucin',
        tekst:
          'Slakkenfiltraat werd om een opmerkelijke reden populair. Wat het is en wat erover bekend is, staat in het artikel.',
        artikel: artikel('snail-mucin', 'Snail mucin'),
      },
      {
        naam: 'Ampul met PDRN',
        tekst:
          'PDRN komt uit een heel andere hoek dan de cosmetica. Waar het bewijs vandaan komt — en over welke toedieningsvorm dat bewijs gaat — staat in het artikel.',
        artikel: artikel('pdrn', 'PDRN en zalm-DNA'),
      },
      {
        naam: 'Crème met ceramiden',
        tekst: 'De afsluitende laag, met de lipiden die ook in de hoornlaag zelf voorkomen.',
        artikel: artikel('ceramiden', 'Ceramiden'),
      },
      {
        naam: "Zonnebrand, 's ochtends",
        tekst: 'De laatste stap van de ochtendroutine, elke dag opnieuw.',
      },
    ],
  },
];

/** Vaste tekst onder elke uitkomst. Staat hier zodat de compliance-controle hem meeneemt. */
export const uitkomstVoorbehoud =
  'Dit is een leeswijzer, geen huidadvies. De uitkomst volgt uit vijf voorkeursvragen en niet uit een beoordeling van je huid. Twijfel je over iets, dan is een huidtherapeut of arts de aangewezen persoon — niet een vragenlijst.';
