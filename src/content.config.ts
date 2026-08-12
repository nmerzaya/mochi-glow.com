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
 * onderbouwing van de scheiding tussen cosmetica en voeding/supplementen, en
 * `onderzoek/07-herziening-beeld-en-voedingspijler.md` voor de splitsing van de
 * tweede pijler in een wetenschapsspoor en een commercieel spoor.
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
  /**
   * De kleur van dit artikel: kleurt het vlak achter het beeld, het
   * rubrieklabel en de accenten op de kaart. Puur een teken in de opmaak — het
   * beeld zelf is voor alle artikelen in dezelfde stijl gemaakt, zonder
   * kleurvariatie per artikel, anders zou de reeks in vier families uiteenvallen.
   */
  accent: z.enum(['roze', 'paars', 'perzik', 'mint']).default('roze'),
  /**
   * Uitzonderingen op de taalcontrole van `npm run check`.
   *
   * Nodig omdat deze site juist uitlegt wát er niet geclaimd mag worden; een
   * artikel dat beschrijft dat een crème niets mag "genezen" bevat dat woord
   * onvermijdelijk. Elke uitzondering moet een reden hebben, zodat een
   * uitzondering een bewuste beslissing blijft en geen sluiproute wordt.
   *
   * Let op: de regel over onderzoeksverwijzingen in commerciële voedingsartikelen
   * is hiermee bewust níet te overrulen. Zie `scripts/check-compliance.mjs`.
   */
  taalUitzonderingen: z
    .array(z.object({ term: z.string(), reden: z.string().min(15) }))
    .default([]),
  uitgelicht: z.boolean().default(false),
  /**
   * Het beeld boven het artikel, dat ook op de kaart en de overzichtspagina
   * gebruikt wordt. Zet het bestand in `src/assets/artikelen/` en verwijs er
   * relatief naar, bijvoorbeeld `../../assets/artikelen/propolis.jpg`.
   *
   * Verplicht. Tot augustus 2026 was dit optioneel en viel een artikel zonder
   * beeld terug op een gegenereerde SVG-illustratie; dat systeem is vervangen
   * door fotografie (zie `onderzoek/07`, par. 4.1). Zonder terugvalmechanisme
   * moet het veld verplicht zijn, anders levert een vergeten beeld een gat op
   * de pagina op in plaats van een bouwfout.
   *
   * De beelden in de tekst staan niet hier maar in de markdown zelf, als gewone
   * `![alt](../../assets/artikelen/…)`-verwijzingen. Astro haalt die door
   * dezelfde optimalisatie heen; `npm run check` bewaakt dat het er één tot drie
   * zijn en dat ze alt-tekst hebben.
   *
   * `alt` is geen formaliteit maar een toegankelijkheidseis (WCAG 2.2 — zie
   * onderzoek/04, par. 4.4).
   */
  afbeelding: image(),
  alt: z.string().min(10),
});

/**
 * Pijler 1 — K-beauty-ingrediënten. Commercieel; hier mogen affiliate-links staan.
 */
const ingredienten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ingredienten' }),
  schema: ({ image }) =>
    z
      .object({
        ...gedeeldeVelden(image),
        /** Zet automatisch de reclame-disclosure als eerste zin van het artikel. */
        affiliate: z.boolean().default(false),
        /**
         * Bepaalt welk regime geldt:
         * - cosmetica → Verordening 1223/2009 en 655/2013
         * - voeding-supplement → Verordening 1924/2006; geen verwijzingen naar
         *   onderzoek of medische bronnen, en uitsluitend claims uit
         *   data/toegestane-claims.json
         */
        productType: z.enum(['cosmetica', 'voeding-supplement', 'geen']).default('geen'),
        gezondheidsclaims: z.boolean().default(false),
        /** INCI-naam van het ingrediënt, als die bestaat. */
        inci: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.affiliate && data.productType === 'geen') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['productType'],
            message:
              'affiliate: true vereist een productType — cosmetica of voeding-supplement bepalen welk wettelijk regime geldt',
          });
        }
      }),
});

/**
 * Pijler 2 — huid van binnenuit. Twee sporen in één collectie.
 *
 * Tot augustus 2026 stonden `affiliate` en `productType` hier op een vaste
 * waarde: de pijler kón niets verkopen. Dat was geen willekeur. De NVWA verbiedt
 * medische informatie, en zelfs een link naar een wetenschappelijk vakblad, op
 * een site-onderdeel dat een levensmiddel aanprijst (DV8-03). Door daar niets te
 * verkopen mochten die artikelen wél vrij naar onderzoek verwijzen.
 *
 * Die keuze blijft geldig — alleen niet meer als eigenschap van de hele pijler,
 * maar van het artikel. Er zijn precies twee toegestane sporen:
 *
 *   wetenschap    productType 'geen', affiliate false
 *                 → mag vrij naar peer-reviewed onderzoek verwijzen
 *   commercieel   productType 'voeding-supplement', affiliate mag true
 *                 → geen enkele verwijzing naar onderzoek, alleen letterlijke
 *                   claims uit data/toegestane-claims.json
 *
 * Alles daartussenin is een fout, niet een keuze. `cosmetica` bestaat hier niet:
 * deze pijler gaat over wat je eet, en dat valt onder het levensmiddelenregime.
 *
 * Het gevaarlijke pad faalt hard: zet iemand `voeding-supplement` op een bestaand
 * wetenschapsartikel, dan worden al zijn onderzoeksverwijzingen onmiddellijk
 * bouwfouten in `npm run check`. Dat is de bedoeling.
 */
const gutSkin = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gut-skin' }),
  schema: ({ image }) =>
    z
      .object({
        ...gedeeldeVelden(image),
        affiliate: z.boolean().default(false),
        productType: z.enum(['voeding-supplement', 'geen']).default('geen'),
        gezondheidsclaims: z.boolean().default(true),
      })
      .superRefine((data, ctx) => {
        if (data.affiliate && data.productType !== 'voeding-supplement') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['productType'],
            message:
              'een artikel met affiliate-links in deze pijler prijst een levensmiddel aan en moet daarom productType: voeding-supplement hebben — daarmee vervalt het recht om naar onderzoek te verwijzen',
          });
        }
      }),
});

export const collections = { ingredienten, 'gut-skin': gutSkin };
