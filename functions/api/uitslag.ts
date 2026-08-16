/**
 * De uitslag van een vragenlijst naar je eigen mail sturen.
 *
 * Eindpunt op `/api/uitslag`. De bezoeker ziet zijn uitkomst gewoon op het
 * scherm; dit is er alleen voor wie hem wil bewaren.
 *
 * ── Waarom de tekst hier vandaan komt en niet uit de browser ────────────────
 *
 * De browser stuurt alleen wélke uitkomst het is, nooit de inhoud ervan. Zou de
 * pagina de tekst meesturen, dan kon iemand er van alles in zetten en die mail
 * onder de naam van deze site laten versturen. Nu bepaalt de server wat er in de
 * mail staat, en is het onmogelijk om er iets anders in te krijgen dan wat er in
 * `src/data/` staat, waar `npm run check` overheen gaat.
 *
 * Dat is meteen de reden dat de juridische controle ook voor deze mail geldt: de
 * stappen, de claims en het voorbehoud komen letterlijk uit dezelfde bron als de
 * pagina.
 *
 * `BREVO_SLEUTEL` hoort in Cloudflare Pages als secret, niet in deze repo.
 */

import { routinetest } from '../../src/data/routinetest';
import { eetritme } from '../../src/data/eetritme';
import { site } from '../../src/config';
import type { Vragenlijst, Profiel } from '../../src/lib/vragenlijst';

interface Omgeving {
  BREVO_SLEUTEL?: string;
  BREVO_LIJST_ID?: string;
  BREVO_DOI_SJABLOON?: string;
}

const LIJSTEN: Record<string, Vragenlijst> = {
  routine: routinetest,
  eetritme,
};

const LIJKT_EEN_ADRES = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const antwoord = (status: number, bericht: string) =>
  new Response(JSON.stringify({ bericht }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/* Alles wat in de mail belandt gaat hier langs, ook al komt het uit eigen bron. */
function veilig(tekst: string): string {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/*
  ── De opmaak van de mail ──────────────────────────────────────────────────

  Mailprogramma's zijn geen browsers: geen externe stylesheet, geen custom
  properties, geen webfont dat overal aankomt. Dus tabellen, inline stijlen en
  kleuren die letterlijk uit `tokens.css` overgenomen zijn. Outlook valt terug op
  een schreefloze systeemletter, en dat is prima; de kleuren en de indeling dragen
  de huisstijl.
*/
const INKT = '#171226';
const INKT_HALF = '#574d6b';
const ORCHIDEE = '#6b2c64';
const RAND = '#ddd6e6';
const WARM = '#e9c9b0';
const JADE = '#0e6355';

function bouwMail(lijst: Vragenlijst, profiel: Profiel, pad: string): string {
  const stappen = profiel.onderdelen
    .map((onderdeel, i) => {
      const claim = onderdeel.claim
        ? `<p style="margin:8px 0 0;padding-left:12px;border-left:2px solid ${JADE};color:${INKT_HALF};font-size:15px;font-style:italic;">&ldquo;${veilig(onderdeel.claim)}</p>`
        : '';
      return `
        <tr>
          <td style="padding:0 0 24px;">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${ORCHIDEE};">
              ${i + 1} &middot; ${veilig(onderdeel.label)}
            </p>
            <p style="margin:0 0 6px;font-size:18px;font-weight:600;color:${INKT};">${veilig(onderdeel.naam)}</p>
            <p style="margin:0;font-size:16px;line-height:1.6;color:${INKT_HALF};">${veilig(onderdeel.tekst)}</p>
            ${claim}
          </td>
        </tr>`;
    })
    .join('');

  const verhaal = (profiel.verhaal ?? [])
    .map(
      (alinea) =>
        `<p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:${INKT_HALF};">${veilig(alinea)}</p>`,
    )
    .join('');

  return `<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f1f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1f7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${RAND};border-radius:20px;overflow:hidden;">
        <tr><td style="height:6px;background:linear-gradient(90deg,${WARM},#f3e8f1,${WARM});">&nbsp;</td></tr>
        <tr>
          <td style="padding:32px 32px 8px;">
            <p style="margin:0;font-size:20px;font-weight:700;color:${INKT};white-space:nowrap;">${veilig(site.naam)}</p>
            <p style="margin:2px 0 0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${INKT_HALF};">${veilig(site.tagline)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${ORCHIDEE};">Jouw uitkomst</p>
            <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:${INKT};">${veilig(profiel.naam)}</h1>
            <p style="margin:0 0 18px;font-size:17px;line-height:1.6;color:${INKT_HALF};">${veilig(profiel.samenvatting)}</p>
            ${verhaal}
          </td>
        </tr>
        <tr><td style="padding:8px 32px 0;"><hr style="border:none;border-top:1px solid ${RAND};margin:0 0 24px;"></td></tr>
        <tr>
          <td style="padding:0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stappen}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 32px;">
            <a href="${site.url}${pad}" style="display:inline-block;padding:12px 22px;background:${ORCHIDEE};color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;">Terug naar de site</a>
            <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:${INKT_HALF};">${veilig(lijst.voorbehoud)}</p>
            <p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:${INKT_HALF};">
              Je krijgt deze mail omdat je hem zelf hebt aangevraagd op ${veilig(site.domein)}. Je
              adres is alleen gebruikt om hem te versturen.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const onRequestPost: PagesFunction<Omgeving> = async ({ request, env }) => {
  if (!env.BREVO_SLEUTEL) {
    return antwoord(503, 'Versturen kan op dit moment niet. Probeer het later nog eens.');
  }

  let gegevens: Record<string, unknown>;
  try {
    gegevens = await request.json();
  } catch {
    return antwoord(400, 'Onleesbaar verzoek.');
  }

  if (typeof gegevens.website === 'string' && gegevens.website.length > 0) {
    return antwoord(200, 'Verstuurd. Kijk in je mail.');
  }

  const email = typeof gegevens.email === 'string' ? gegevens.email.trim() : '';
  if (!LIJKT_EEN_ADRES.test(email) || email.length > 200) {
    return antwoord(400, 'Dat lijkt geen geldig e-mailadres.');
  }

  const lijst = LIJSTEN[String(gegevens.lijst ?? '')];
  if (!lijst) return antwoord(400, 'Onbekende vragenlijst.');

  const profiel = lijst.profielen.find((p) => p.id === String(gegevens.profiel ?? ''));
  if (!profiel) return antwoord(400, 'Onbekende uitkomst.');

  const pad = lijst.sleutel === 'routine' ? '/routine' : '/eetritme';

  const verzoek = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_SLEUTEL,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: site.naam, email: site.contactEmail },
      to: [{ email }],
      subject: `Jouw uitkomst: ${profiel.naam}`,
      htmlContent: bouwMail(lijst, profiel, pad),
    }),
  });

  if (!verzoek.ok) {
    console.log('Brevo weigerde de uitslagmail:', verzoek.status, (await verzoek.text()).slice(0, 200));
    return antwoord(502, 'Het lukte niet om de mail te versturen. Probeer het later nog eens.');
  }

  /*
    Alleen als er apart om gevraagd is. Het adres dat iemand geeft om zijn uitslag
    te ontvangen mag niet stilzwijgend op de nieuwsbrieflijst belanden: dat is
    toestemming koppelen aan een andere dienst, en dat verbiedt de AVG (art. 7 lid
    4). Vandaar een los, niet voorgevinkt vakje op de pagina, en hier een aparte
    aanroep die de bevestigingsmail van Brevo op gang brengt.
  */
  if (gegevens.nieuwsbrief === true && env.BREVO_LIJST_ID && env.BREVO_DOI_SJABLOON) {
    await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
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
    }).catch(() => {
      /* De uitslag is al onderweg; een mislukte aanmelding mag dat niet omgooien. */
    });
  }

  return antwoord(200, 'Verstuurd. Kijk in je mail.');
};
