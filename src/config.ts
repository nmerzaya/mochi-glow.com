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
 * vereist en verschijnt er dus ook geen toestemmingsvenster, een banner tonen
 * voor cookies die niet geplaatst worden is misleidend. Zet dit op `true` op het
 * moment dat AdSense is goedgekeurd (Fase 4 in TAKEN.md); vanaf dat moment
 * blokkeert Klaro het advertentiescript tot de bezoeker toestemming geeft.
 */
export const advertentiesActief = false;

/**
 * Google Analytics 4, het meet-ID, of `null` om statistieken helemaal uit te zetten.
 *
 * ── Waarom dit niet gewoon het knip-en-plakfragment van Google is ────────────
 *
 * Het fragment dat Google geeft, laadt `gtag.js` meteen bij het openen van de
 * pagina. Dat mag hier niet, om twee redenen die los van elkaar al beslissend
 * zijn.
 *
 * 1. **Juridisch.** GA4 zet cookies en stuurt gegevens, waaronder het IP-adres,
 *    naar Google. Onder de ePrivacy-richtlijn en de AVG mag dat pas ná
 *    toestemming, niet ervoor, en niet op basis van "verder surfen geldt als
 *    akkoord". Het fragment ongewijzigd plaatsen is een overtreding vanaf de
 *    eerste bezoeker.
 * 2. **Deze site in het bijzonder.** `/privacybeleid` en `/cookiebeleid` stelden
 *    letterlijk dat er geen analytics en geen enkele cookie was. Een site die
 *    haar eigen privacybeleid tegenspreekt, verliest precies datgene waar ze
 *    het van moet hebben (`onderzoek/08`, par. 4.2: de lezer wantrouwt deze
 *    categorie al). Beide pagina's zijn bij deze wijziging aangepast.
 *
 * Daarom staat het script als `type="text/plain"` met `data-name="google-analytics"`
 * in `BasisLayout.astro`. De browser voert het dan niet uit; Klaro zet het pas
 * om naar een echt script zodra de bezoeker toestemming geeft. Weigert iemand,
 * dan wordt er niets geladen en gaat er niets naar Google.
 *
 * Zet op `null` en er verdwijnt weer elk extern verzoek van de site.
 */
export const ga4MeetID: string | null = 'G-NEXD4R5HL2';

/**
 * Toegangssleutel voor het contactformulier (Web3Forms), of `null`.
 *
 * De site is statisch en heeft geen server, dus een formulier heeft een externe
 * ontvanger nodig. Web3Forms neemt de inzending aan en mailt hem door naar
 * `site.contactEmail`. Een gratis sleutel vraag je aan op web3forms.com met je
 * e-mailadres; er hoort geen account bij.
 *
 * Dit is een bewuste, begrensde uitzondering op "geen externe verzoeken": er
 * gaat pas iets naar buiten als een bezoeker zélf op verzenden drukt. Bij het
 * laden van de pagina gebeurt er niets. Wat er verstuurd wordt, naam, e-mail
 * en bericht, staat beschreven in `/privacybeleid`.
 *
 * Zolang dit `null` is, toont `/contact` gewoon het e-mailadres in plaats van
 * een formulier dat nergens aankomt.
 */
export const web3formsSleutel: string | null = 'c5d671ae-7229-48b8-98e4-4d25db8256cd';

/**
 * De twee pijlers, op één plek.
 *
 * Hiervoor stonden deze namen als losse tekenreeksen door de hele site heen, * in een ternary in `ArtikelLayout.astro`, twee keer in `index.astro`, in beide
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
      'Snail mucin, centella, niacinamide: wat het is, waar het vandaan komt, en wat je er realistisch van mag verwachten.',
  },
  'gut-skin': {
    naam: 'Huid van binnenuit',
    pad: '/gut-skin',
    intro:
      'Wat je eet en hoe je slaapt doen mee met je huid. Hier lees je wat daarvan écht onderbouwd is, en wat er alleen maar vaak beweerd wordt.',
  },
  beauty: {
    naam: 'Tips & routines',
    pad: '/beauty',
    intro:
      'De praktijk: in welke volgorde je dingen opbrengt, waarom er in Korea twee keer gereinigd wordt, en welke gewoontes het verschil maken.',
  },
} as const;

export type PijlerSleutel = keyof typeof pijlers;

/*
  Makeup staat hier bewust nog niet in: daar is nog geen artikel voor, en een
  menu-item dat op een lege pagina uitkomt doet meer kwaad dan een kort menu.
*/
export const hoofdnavigatie = [
  { tekst: pijlers.ingredienten.naam, pad: pijlers.ingredienten.pad },
  { tekst: pijlers['gut-skin'].naam, pad: pijlers['gut-skin'].pad },
  { tekst: pijlers.beauty.naam, pad: pijlers.beauty.pad },
  { tekst: 'Routinetest', pad: '/routine' },
  { tekst: 'Eetritme', pad: '/eetritme' },
] as const;

/*
  "Over" staat sinds 2026-08-13 niet meer in het hoofdmenu. De pagina zelf bestaat
  nog wel, Google verwacht bij de AdSense-beoordeling dat duidelijk is wie er
  achter een site zit, en in een gezondheidsniche weegt dat zwaar, maar hij is
  herschreven voor de lezer in plaats van voor de beheerder, en hij hoort bij de
  voetteksten en niet tussen de rubrieken.

  De affiliate-disclaimer is helemaal verdwenen. Er is op dit moment geen enkele
  affiliate-link op de site, dus die pagina beschreef iets wat niet bestond.
  Komt de eerste link er wel, dan verschijnt de disclosure automatisch als eerste
  zin van dát artikel (zie `disclosureTekst` hieronder), dat is wat de RSM sinds
  1 juli 2026 eist, en een losse pagina in de voettekst voldoet daar niet aan.
*/
export const voetnavigatie = {
  Rubrieken: [
    { tekst: pijlers.ingredienten.naam, pad: pijlers.ingredienten.pad },
    { tekst: pijlers['gut-skin'].naam, pad: pijlers['gut-skin'].pad },
    { tekst: pijlers.beauty.naam, pad: pijlers.beauty.pad },
    { tekst: 'Routinetest', pad: '/routine' },
    { tekst: 'Eetritme', pad: '/eetritme' },
    { tekst: 'RSS-feed', pad: '/rss.xml' },
  ],
  Redactie: [
    { tekst: 'Wat je hier vindt', pad: '/over' },
    { tekst: 'Werkwijze', pad: '/redactionele-richtlijnen' },
    { tekst: 'Contact', pad: '/contact' },
  ],
  Juridisch: [
    { tekst: 'Privacybeleid', pad: '/privacybeleid' },
    { tekst: 'Cookiebeleid', pad: '/cookiebeleid' },
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
