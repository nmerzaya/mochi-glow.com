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
  tagline: 'zachte huid, echte uitleg',
  beschrijving:
    'Uitleg over K-beauty-ingrediënten en de darm-huid-connectie, op basis van bronnen. Geen beloftes, wel eerlijke uitleg over wat een ingrediënt is en wat het onderzoek erover zegt.',
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

export const hoofdnavigatie = [
  { tekst: 'Ingrediënten', pad: '/ingredienten' },
  { tekst: 'Darm & huid', pad: '/gut-skin' },
  { tekst: 'Over', pad: '/over' },
] as const;

export const voetnavigatie = {
  Lezen: [
    { tekst: 'Alle ingrediënten', pad: '/ingredienten' },
    { tekst: 'Darm & huid', pad: '/gut-skin' },
    { tekst: 'RSS-feed', pad: '/rss.xml' },
  ],
  'Over deze site': [
    { tekst: 'Over Noor', pad: '/over' },
    { tekst: 'Redactionele richtlijnen', pad: '/redactionele-richtlijnen' },
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
