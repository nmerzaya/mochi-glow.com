/**
 * Centrale siteconfiguratie.
 *
 * Alles wat op meerdere plekken terugkomt staat hier, zodat een naam- of
 * tekstwijziging niet door tientallen bestanden hoeft.
 */

export const site = {
  naam: 'Mochi Glow',
  domein: 'mochi-glow.com',
  url: 'https://mochi-glow.com',
  tagline: 'Skincare, onderzocht',
  beschrijving:
    'Over de ingrediënten in Koreaanse huidverzorging en het verband tussen voeding en huid. Wat een ingrediënt is, wat het onderzoek laat zien, en waar dat onderzoek ophoudt.',
  taal: 'nl-NL',
  auteur: 'Noor',
  contactEmail: 'hallo@mochi-glow.com',
} as const;

/**
 * Staat er al een advertentiescript op de site?
 *
 * Zolang dit `false` is, laadt Mochi Glow géén enkel script dat toestemming
 * vereist en verschijnt er dus ook geen toestemmingsvenster — een banner tonen
 * voor cookies die niet geplaatst worden is misleidend. Zet dit op `true` op het
 * moment dat AdSense is goedgekeurd (Fase 4 in TAKEN.md); vanaf dat moment
 * blokkeert Klaro het advertentiescript tot de bezoeker toestemming geeft.
 */
export const advertentiesActief = false;

/**
 * De twee pijlers, op één plek.
 *
 * Hiervoor stonden deze namen als losse tekenreeksen door de hele site heen —
 * in een ternary in `ArtikelLayout.astro`, twee keer in `index.astro`, in beide
 * overzichtspagina's en nog een keer in de CMS-configuratie. Dat liep
 * onvermijdelijk uit de pas: de CMS noemde de tweede pijler "Darm & huid"
 * terwijl de site "Voeding & huid" toonde. Eén bron van waarheid voorkomt dat.
 *
 * De namen volgen de taal van de lezer, niet die van het contentmodel. De
 * sleutel is de naam van de content collection, `pad` is de URL. Allebei blijven
 * ze staan zoals ze zijn, ook nu de labels veranderen: een URL wijzigen breekt
 * bestaande links en indexering, en dat weegt niet op tegen een mooiere naam.
 *
 * Waarom niet "Ingrediënten": dat leest als een productcatalogus, en er is hier
 * niets te koop dat een catalogus rechtvaardigt. "Wat zit erin?" is dezelfde
 * vraag die de lezer zelf stelt, en het is ook de kop van de homepage.
 */
export const pijlers = {
  ingredienten: {
    naam: 'Wat zit erin?',
    pad: '/ingredienten',
    intro:
      'Wat een ingrediënt uit Koreaanse huidverzorging werkelijk is, wat het onderzoek ernaar laat zien, en waar dat onderzoek ophoudt.',
  },
  'gut-skin': {
    naam: 'Huid van binnenuit',
    pad: '/gut-skin',
    intro:
      'Over het verband tussen wat je eet en hoe je huid eraan toe is — wat daarvan onderbouwd is, en wat er wettelijk over gezegd mag worden.',
  },
} as const;

export type PijlerSleutel = keyof typeof pijlers;

/*
  Makeup en Lifestyle staan hier bewust nog niet in: daar is nog geen artikel
  voor, en een menu-item dat op een lege pagina uitkomt doet meer kwaad dan een
  kort menu.
*/
export const hoofdnavigatie = [
  { tekst: pijlers.ingredienten.naam, pad: pijlers.ingredienten.pad },
  { tekst: pijlers['gut-skin'].naam, pad: pijlers['gut-skin'].pad },
  { tekst: 'Routinetest', pad: '/routine' },
  { tekst: 'Eetritme', pad: '/eetritme' },
  { tekst: 'Over', pad: '/over' },
] as const;

export const voetnavigatie = {
  Rubrieken: [
    { tekst: pijlers.ingredienten.naam, pad: pijlers.ingredienten.pad },
    { tekst: pijlers['gut-skin'].naam, pad: pijlers['gut-skin'].pad },
    { tekst: 'Routinetest', pad: '/routine' },
    { tekst: 'Eetritme', pad: '/eetritme' },
    { tekst: 'RSS-feed', pad: '/rss.xml' },
  ],
  Redactie: [
    { tekst: 'Over', pad: '/over' },
    { tekst: 'Werkwijze', pad: '/redactionele-richtlijnen' },
    { tekst: 'Contact', pad: '/contact' },
  ],
  Juridisch: [
    { tekst: 'Privacybeleid', pad: '/privacybeleid' },
    { tekst: 'Cookiebeleid', pad: '/cookiebeleid' },
    { tekst: 'Affiliate-disclaimer', pad: '/affiliate-disclaimer' },
    { tekst: 'Algemene voorwaarden', pad: '/algemene-voorwaarden' },
  ],
} as const;

/** Wordt automatisch als eerste zin boven elk artikel met affiliate-links gezet. */
export const disclosureTekst =
  'Dit artikel bevat affiliate-links; als je via een link koopt, ontvang ik mogelijk een kleine commissie. Dat kost jou niets extra en heeft geen invloed op wat er in dit artikel staat.';

export const datumOpmaak = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
