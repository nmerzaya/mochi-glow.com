/**
 * Aanmelden voor bericht bij een nieuw artikel.
 *
 * Een Cloudflare Pages Function: dit bestand wordt vanzelf een eindpunt op
 * `/api/aanmelden`, naast de statische site. De site zelf blijft statisch; er
 * draait pas iets op het moment dat een bezoeker zelf op verzenden drukt.
 *
 * ── Waarom dubbele opt-in en niet gewoon toevoegen ──────────────────────────
 *
 * E-mail sturen over nieuwe artikelen is marketing. Artikel 11.7 van de
 * Telecommunicatiewet vraagt daarvoor toestemming van degene die de mail
 * ontvangt, en die toestemming moet aantoonbaar zijn. Iemand kan het adres van
 * een ander invullen; zonder bevestigingsmail zou die ander post krijgen waar
 * hij nooit om gevraagd heeft, en zou er van "aantoonbaar" niets over zijn.
 *
 * Brevo regelt die stap zelf: het adres komt pas op de lijst nadat er op de
 * link in de bevestigingsmail geklikt is. Tot die tijd bestaat het contact niet.
 *
 * ── Geheimen ───────────────────────────────────────────────────────────────
 *
 * `BREVO_SLEUTEL` staat niet in deze repo en hoort daar ook nooit in. Zet hem in
 * Cloudflare Pages onder Settings → Environment variables als *secret*. Met die
 * sleutel kan iemand mail versturen namens dit domein, dus hij is van een andere
 * orde dan de Web3Forms-sleutel (die staat wél in de code, want die staat sowieso
 * in de HTML van elk formulier).
 */

import { site } from '../../src/config';

interface Omgeving {
  BREVO_SLEUTEL?: string;
  /** Id van de lijst in Brevo waar bevestigde adressen in belanden. */
  BREVO_LIJST_ID?: string;
  /** Id van het sjabloon voor de bevestigingsmail (type "double opt-in"). */
  BREVO_DOI_SJABLOON?: string;
}

/*
  Bewust geen sluitende e-mailcontrole. Die bestaat niet: het formele adresformaat
  laat dingen toe die geen enkele mailserver accepteert, en er zijn geldige
  adressen die elke korte regex afkeurt. Dit vangt de tikfouten af; of het adres
  echt bestaat blijkt vanzelf uit de bevestigingsmail.
*/
const LIJKT_EEN_ADRES = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const antwoord = (status: number, bericht: string) =>
  new Response(JSON.stringify({ bericht }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const onRequestPost: PagesFunction<Omgeving> = async ({ request, env }) => {
  if (!env.BREVO_SLEUTEL || !env.BREVO_LIJST_ID || !env.BREVO_DOI_SJABLOON) {
    /*
      Niet ingericht is iets anders dan stuk. De bezoeker hoeft niet te weten
      welke instelling ontbreekt, maar hij moet ook niet denken dat het gelukt is.
    */
    return antwoord(503, 'Aanmelden kan op dit moment niet. Probeer het later nog eens.');
  }

  let gegevens: Record<string, unknown>;
  try {
    gegevens = await request.json();
  } catch {
    return antwoord(400, 'Onleesbaar verzoek.');
  }

  /* Honingpot: onzichtbaar veld dat alleen een bot invult. */
  if (typeof gegevens.website === 'string' && gegevens.website.length > 0) {
    /* Doen alsof het gelukt is; een bot hoeft niet te weten dat hij gezien is. */
    return antwoord(200, 'Kijk in je mail om je aanmelding te bevestigen.');
  }

  const email = typeof gegevens.email === 'string' ? gegevens.email.trim() : '';
  if (!LIJKT_EEN_ADRES.test(email) || email.length > 200) {
    return antwoord(400, 'Dat lijkt geen geldig e-mailadres.');
  }

  const verzoek = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_SLEUTEL,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      includeListIds: [Number(env.BREVO_LIJST_ID)],
      templateId: Number(env.BREVO_DOI_SJABLOON),
      redirectionUrl: `${site.url}/aanmelding-bevestigd`,
    }),
  });

  if (!verzoek.ok) {
    /*
      Brevo antwoordt met 400 en code `duplicate_parameter` als het adres al op
      de lijst staat. Dat is voor de bezoeker geen fout, en het is ook niet iets
      om hem over in te lichten: of een adres al aangemeld is, is informatie over
      iemand anders zodra je andermans adres invult.
    */
    const tekst = await verzoek.text();
    if (verzoek.status === 400 && tekst.includes('duplicate_parameter')) {
      return antwoord(200, 'Kijk in je mail om je aanmelding te bevestigen.');
    }
    console.log('Brevo weigerde de aanmelding:', verzoek.status, tekst.slice(0, 200));
    return antwoord(502, 'Het lukte niet om je aan te melden. Probeer het later nog eens.');
  }

  return antwoord(200, 'Kijk in je mail om je aanmelding te bevestigen.');
};
