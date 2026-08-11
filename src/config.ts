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

/*
  Menu-items volgen de taal van de lezer, niet die van het contentmodel. De
  onderliggende mappen heten nog `ingredienten` en `gut-skin`; dat zijn URL's en
  die veranderen niet mee, om links en indexering niet te breken.

  Makeup en Lifestyle staan hier bewust nog niet in: daar is nog geen artikel
  voor, en een menu-item dat op een lege pagina uitkomt doet meer kwaad dan een
  kort menu.
*/
export const hoofdnavigatie = [
  { tekst: 'Skincare', pad: '/ingredienten' },
  { tekst: 'Voeding & huid', pad: '/gut-skin' },
  { tekst: 'Routinetest', pad: '/routine' },
  { tekst: 'Over', pad: '/over' },
] as const;

export const voetnavigatie = {
  Rubrieken: [
    { tekst: 'Skincare', pad: '/ingredienten' },
    { tekst: 'Voeding & huid', pad: '/gut-skin' },
    { tekst: 'Routinetest', pad: '/routine' },
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
