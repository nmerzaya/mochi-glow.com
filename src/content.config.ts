import { defineCollection, z } from 'astro:content';
import type { ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Contentschema voor Mochi Glow.
 *
 * De velden `affiliate`, `productType` en `gezondheidsclaims` zijn geen
 * administratie maar sturing: ze bepalen welke componenten een artikel
 * automatisch krijgt (disclosure, medische disclaimer) en waarop
 * `npm run check` het artikel controleert.
 *
 * Zie `onderzoek/04-vormgeving-en-eisen.md`, paragraaf 4.3, voor de
 * onderbouwing van de scheiding tussen cosmetica en voeding/supplementen.
 */

const bron = z.object({
  titel: z.string(),
  url: z.string(),
  /** A = primair/officieel, B = secundair/vakmedia, C = tertiair. Zie onderzoek/01-bronnen.md. */
  type: z.enum(['A', 'B', 'C']),
});

/*
  De gedeelde velden zijn een functie van `image`, omdat Astro die helper alleen
  binnen de schemafunctie aanreikt. Daarmee wordt `afbeelding` een echt
  beeldbestand in plaats van een tekstveld: Astro controleert bij de build of het
  bestaat, en optimaliseert het naar meerdere formaten en breedtes.
*/
const gedeeldeVelden = (image: ImageFunction) => ({
  titel: z.string().min(10).max(80),
  beschrijving: z.string().min(50).max(200),
  publicatiedatum: z.coerce.date(),
  bijgewerkt: z.coerce.date().optional(),
  auteur: z.string().default('Noor'),
  tags: z.array(z.string()).default([]),
  bronnen: z.array(bron).default([]),
  /** Geeft de kaart en de artikelkop hun accentkleur — vervangt fotografie, die dit project niet heeft. */
  accent: z.enum(['roze', 'paars', 'perzik', 'mint']).default('roze'),
  /**
   * Welke illustratie het artikel krijgt. Optioneel: laat je dit leeg, dan kiest
   * `ArtikelBeeld.astro` er zelf een op basis van de slug. Elk artikel heeft dus
   * altijd beeld, ook als de auteur er niet aan denkt.
   */
  motief: z
    .enum(['druppel', 'blad', 'korrels', 'golven', 'bloem', 'ringen', 'vlecht', 'kiem'])
    .optional(),
  /**
   * Uitzonderingen op de taalcontrole van `npm run check`.
   *
   * Nodig omdat deze site juist uitlegt wát er niet geclaimd mag worden; een
   * artikel dat beschrijft dat een crème niets mag "genezen" bevat dat woord
   * onvermijdelijk. Elke uitzondering moet een reden hebben, zodat een
   * uitzondering een bewuste beslissing blijft en geen sluiproute wordt.
   */
  taalUitzonderingen: z
    .array(z.object({ term: z.string(), reden: z.string().min(15) }))
    .default([]),
  uitgelicht: z.boolean().default(false),
  /**
   * Echte foto bij het artikel. Zet het bestand naast het markdown-bestand en
   * verwijs er relatief naar, bijvoorbeeld `./propolis.jpg`.
   *
   * Staat dit veld leeg, dan valt het artikel terug op de eigen illustratie —
   * er is dus altijd beeld. Zodra hier een foto staat, gebruikt de site die
   * overal: op de kaart, op de overzichtspagina en boven het artikel.
   *
   * `alt` is verplicht zodra er een foto is. Dat is geen formaliteit maar een
   * toegankelijkheidseis (WCAG 2.2, en de European Accessibility Act geldt voor
   * deze site — zie onderzoek/04, par. 3d en 4.4).
   */
  afbeelding: image().optional(),
  alt: z.string().optional(),
});

/** Zonder alt-tekst is een foto onbruikbaar voor wie hem niet kan zien. */
const eisAltTekst = <T extends { afbeelding?: unknown; alt?: string }>(data: T, ctx: z.RefinementCtx) => {
  if (data.afbeelding && !data.alt?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['alt'],
      message: 'een artikel met een foto moet ook een alt-tekst hebben',
    });
  }
};

/**
 * Pijler 1 — K-beauty-ingrediënten. Commercieel; hier mogen affiliate-links staan.
 */
const ingredienten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ingredienten' }),
  schema: ({ image }) => z.object({
    ...gedeeldeVelden(image),
    /** Zet automatisch de reclame-disclosure als eerste zin van het artikel. */
    affiliate: z.boolean().default(false),
    /**
     * Bepaalt welk regime geldt:
     * - cosmetica → Verordening 1223/2009 en 655/2013
     * - voeding-supplement → Verordening 1924/2006; geen links naar medische bronnen,
     *   en uitsluitend claims uit data/toegestane-claims.json
     */
    productType: z.enum(['cosmetica', 'voeding-supplement', 'geen']).default('geen'),
    gezondheidsclaims: z.boolean().default(false),
    /** INCI-naam van het ingrediënt, als die bestaat. */
    inci: z.string().optional(),
  }).superRefine(eisAltTekst),
});

/**
 * Pijler 2 — gut-skin-wetenschap. Autoriteit, niet commercieel.
 *
 * `affiliate` en `productType` staan hier op een vaste waarde in plaats van een
 * boolean: de NVWA verbiedt medische informatie en links naar wetenschappelijke
 * bronnen op een site-onderdeel dat een levensmiddel aanprijst (DV8-03). Door dit
 * op schemaniveau vast te zetten kan een artikel in deze pijler nooit per ongeluk
 * een affiliate-link krijgen, en blijft verwijzen naar onderzoek dus toegestaan.
 */
const gutSkin = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gut-skin' }),
  schema: ({ image }) => z.object({
    ...gedeeldeVelden(image),
    affiliate: z.literal(false).default(false),
    productType: z.literal('geen').default('geen'),
    gezondheidsclaims: z.boolean().default(true),
  }).superRefine(eisAltTekst),
});

export const collections = { ingredienten, 'gut-skin': gutSkin };
