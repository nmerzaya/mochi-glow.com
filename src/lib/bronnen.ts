/**
 * Rekenwerk over de bronnenlijsten.
 *
 * Elk artikel heeft in zijn frontmatter al een lijst bronnen met een type:
 * A (primair, origineel onderzoek, wetgeving, toezichthouder), B (secundair, * vakmedia) of C (tertiair, blogs en community). Die indeling stond er tot nu
 * toe alleen voor de bronnenlijst onderaan.
 *
 * Hier wordt hij ook iets waard boven de streep: uit dezelfde gegevens volgt
 * hoe hard de onderbouwing van een artikel is, en dat is precies het enige wat
 * deze site te bieden heeft dat een merkenblog niet heeft. Omdat het berekend
 * wordt en niet ingevuld, kan het nooit mooier zijn dan de werkelijkheid.
 */

export interface Bron {
  titel: string;
  url: string;
  type: 'A' | 'B' | 'C';
}

export interface Telling {
  a: number;
  b: number;
  c: number;
  totaal: number;
  /** Aandeel primaire bronnen, afgerond op hele procenten. 0 als er niets is. */
  aandeelPrimair: number;
}

export function tel(bronnen: readonly Bron[] = []): Telling {
  const a = bronnen.filter((bron) => bron.type === 'A').length;
  const b = bronnen.filter((bron) => bron.type === 'B').length;
  const c = bronnen.filter((bron) => bron.type === 'C').length;
  const totaal = a + b + c;
  return { a, b, c, totaal, aandeelPrimair: totaal === 0 ? 0 : Math.round((a / totaal) * 100) };
}

/** Telt alles bij elkaar op, voor de cijfers op de homepage. */
export function telAlles(lijsten: readonly (readonly Bron[])[]): Telling {
  return tel(lijsten.flat());
}

/**
 * Korte samenvatting in de vorm "7 bronnen · 5A 2B".
 *
 * Bewust zo krap: dit staat in de monospace onder een kaart en moet af te lezen
 * zijn zonder gelezen te worden.
 */
export function samenvatting(telling: Telling): string {
  if (telling.totaal === 0) return 'geen bronnen';
  const delen = [
    telling.a > 0 ? `${telling.a}A` : '',
    telling.b > 0 ? `${telling.b}B` : '',
    telling.c > 0 ? `${telling.c}C` : '',
  ].filter(Boolean);
  return `${telling.totaal} ${telling.totaal === 1 ? 'bron' : 'bronnen'} · ${delen.join(' ')}`;
}
