/**
 * De vorm van een vragenlijst op deze site.
 *
 * Er zijn er twee — de routinetest en het eetritme — en ze werken hetzelfde:
 * een reeks korte vragen, punten per antwoord, en aan het eind precies één
 * uitkomst die uit een lijst met onderdelen bestaat. Alleen de teksten
 * verschillen. Die staan in `src/data/routinetest.ts` en `src/data/eetritme.ts`,
 * en nergens anders, omdat `scripts/check-compliance.mjs` juist díé bestanden
 * langs de verboden-taalpatronen haalt. Zet je een zin in een `.astro`-bestand,
 * dan ontsnapt hij aan die controle.
 *
 * Hier staan alleen de types en de gedeelde regels. Geen zichtbare tekst.
 *
 * ── De harde regels voor beide lijsten ──────────────────────────────────────
 *
 * 1. Geen vraag gaat over een aandoening. Vragen gaan over hoe iets aanvoelt,
 *    hoe een dag eruitziet en wat iemand prettig vindt. Een vraag naar acne,
 *    eczeem of een darmklacht zou hier een diagnose-instrument van maken, en dat
 *    is precies wat de regels uit `onderzoek/04`, par. 4.3 verbieden.
 * 2. Geen uitkomst belooft een effect. Een onderdeel beschrijft wát iets is en
 *    waarom het op die plek staat — nooit wat het zou doen.
 * 3. Geen merken, geen productnamen, geen affiliate-links. Komt daar ooit een
 *    product in, dan geldt de disclosureplicht ook op die pagina.
 * 4. Waar een voedingsstof genoemd wordt, uitsluitend in de letterlijke
 *    bewoording uit `data/toegestane-claims.json`. Een eigen formulering van
 *    dezelfde claim is een niet-toegestane claim.
 * 5. Er wordt niets opgeslagen: geen cookie, geen localStorage, geen
 *    netwerkverzoek. Dat staat zo in het privacybeleid, dus het moet zo blijven.
 */

export type Accent = 'roze' | 'paars' | 'perzik' | 'mint';

export interface Antwoord {
  id: string;
  tekst: string;
  /** Punten per profiel-id. Een antwoord mag ook nergens punten aan geven. */
  punten: Record<string, number>;
}

export interface Vraag {
  id: string;
  vraag: string;
  hulp?: string;
  antwoorden: Antwoord[];
}

/**
 * Eén blok in een uitkomst: een stap in een routine, of een groep op een bord.
 *
 * De twee lijsten hadden hier oorspronkelijk elk hun eigen vorm — `moment` en
 * `naam` bij de routine, iets vergelijkbaars bij het eetritme. Dat leverde twee
 * bijna gelijke componenten op. Eén vorm met een vrij label dekt beide.
 */
export interface Onderdeel {
  /** Het kapitalenlabel boven het blok: "Ochtend", "Door de dag heen". */
  label: string;
  naam: string;
  /** Wat dit is en waarom het hier staat. Nooit wat het zou doen. */
  tekst: string;
  /**
   * Letterlijke, goedgekeurde EU-claim. Alleen invullen met een tekenreeks die
   * exact zo in `data/toegestane-claims.json` staat — de compliance-controle
   * vergelijkt woord voor woord.
   */
  claim?: string;
  artikel?: { titel: string; pad: string };
}

export interface Profiel {
  id: string;
  naam: string;
  /** Eén zin die beschrijft wat dit profiel is — geen belofte over wat het oplevert. */
  samenvatting: string;
  accent: Accent;
  /** Slug van het beeld in src/assets/artikelen/, zonder extensie. */
  beeld: string;
  beeldAlt: string;
  onderdelen: Onderdeel[];
}

export interface Vragenlijst {
  /** Wordt gebruikt in data-attributen en id's, zodat twee lijsten op één pagina niet botsen. */
  sleutel: string;
  vragen: Vraag[];
  profielen: Profiel[];
  /** Hoe een onderdeel heet in het meervoud: "stappen", "groepen". */
  onderdeelNaam: string;
  /** Tekst van de knop die de uitkomst toont. */
  slotknop: string;
  /** Vaste tekst onder elke uitkomst. */
  voorbehoud: string;
}
