# TAKEN.md

Werk de fases in volgorde af. Vink pas af wat écht klaar is — vooral de volgorde tussen Fase 3 en Fase 5 is bewust (zie `PLAN.md`, tijdlijn, en `CLAUDE.md`, afspraken).

> **Bijgewerkt op 10 augustus 2026.** De vinkjes hieronder waren blijven staan terwijl het werk al gedaan was; ze zijn op die datum nagelopen tegen wat er daadwerkelijk in de map staat. Alleen aantoonbaar afgeronde punten zijn afgevinkt. Punten die van iets buiten deze map afhangen (domeinregistratie, GitHub, Cloudflare) zijn open gelaten, ook waar de code er al klaar voor is.

## Fase 0 — Beslissingen die nog ontbreken

- [x] Sitenaam en domeinnaam kiezen. → **Mochi Glow**, `mochi-glow.com` (vastgelegd in `src/config.ts` en `astro.config.mjs`).
- [x] Persona-naam en korte "waarom dit onderwerp"-tekst schrijven (geen echte persoonlijke details). → **Noor**; de tekst staat op `/over`.
- [x] Domeinnaam registreren (~€10-15/jaar, de enige budgetuitzondering). → `mochi-glow.com`, geregistreerd via Cloudflare.
- [ ] Bevestigen of Cloudflare Web Analytics gebruikt wordt (zie `PLAN.md`, open punt) of dat analytics bewust wordt overgeslagen. → De site draait nu zónder analytics, en `/privacybeleid` en `/cookiebeleid` beschrijven dat ook zo. Dat is de huidige toestand, nog geen bevestigde keuze — bevestig hem bewust en werk `PLAN.md` bij.

## Fase 1 — Technische basis

- [ ] GitHub-account/repo aanmaken (publiek, gratis). → Nog niet gedaan; er is zelfs nog geen lokale git-repo (`git init`), wel al een `.gitignore`.
- [x] Astro-project scaffolden (`npm create astro@latest`). → Astro 7, met `@astrojs/sitemap` en `@astrojs/rss`.
- [x] Content collections opzetten voor de twee pijlers (zie `ARCHITECTUUR.md` voor het schema, incl. verplichte velden `affiliate` en gezondheidsclaim-check). → Staat in `src/content.config.ts`. **Let op:** de eerste collectie heet in de code `ingredienten`, niet `kbeauty-ingredienten`.
- [ ] Sveltia CMS installeren en koppelen aan de GitHub-repo (git-based, geen apart backend nodig). → Half af: `public/admin/` staat er en `config.yml` dekt beide collecties, maar `repo:` is nog de placeholder `GEBRUIKERSNAAM/mochi-glow`. Inloggen kan pas als de repo bestaat.
- [ ] Cloudflare Pages-project aanmaken, koppelen aan de repo, auto-deploy bij push instellen.
- [ ] Eigen domein koppelen aan Cloudflare Pages, HTTPS controleren.
- [x] Klaro cookie consent inbouwen, standaard blokkerend totdat een bezoeker toestemming geeft. → Zit in `CookieToestemming.astro`, zelfgehost vanaf `/klaro/`. Slaapt zolang `advertentiesActief` in `src/config.ts` op `false` staat, want er is nog geen script om te blokkeren.
- [x] Basisdesign bouwen: licht, clean, warm-vrouwelijk maar duidelijk. → `src/styles/tokens.css` (palet, typografie, ritme) en `globaal.css`; tekstkleuren getoetst op WCAG 2.2 AA.

## Fase 2 — Verplichte pagina's

Alle pagina's hieronder staan in `src/pages/` en worden meegebouwd. Er is er één bijgekomen die hier niet stond: `/redactionele-richtlijnen`.

- [x] Privacybeleid.
- [x] Cookiebeleid.
- [x] Affiliate-disclaimer (algemene pagina, los van de per-artikel disclosure-tekst).
- [x] Algemene voorwaarden.
- [x] Contactpagina.
- [x] Over-pagina met de pseudoniem-persona.
- [x] `ads.txt` klaarzetten in `public/` (kan leeg/placeholder tot AdSense is aangevraagd, moet dan ingevuld worden). → Staat klaar met alleen commentaar en een voorbeeldregel; de publisher-ID moet er in Fase 4 in.

## Fase 3 — Eerste contentbatch (vóór welke aanvraag dan ook)

Stand: **16 artikelen** — tien in de ingrediënten-pijler en zes in de gut-skin-pijler. Daarmee is de ondergrens gehaald. De taal- en claimregels hieronder worden mechanisch afgedwongen door `npm run check`, dat als eerste stap van elke build draait.

- [x] Minimaal 15-20 artikelen schrijven, verdeeld over beide pijlers, elk 800+ woorden en origineel. → 16 stuks; de 800-woordengrens wordt door de controle afgedwongen, dus geen enkel artikel kan eronder zitten.
- [x] Elk artikel met affiliate-link: disclosure-tekst als eerste zin (automatisch via het contentschema, zie `ARCHITECTUUR.md`). → Het mechanisme staat en is niet te omzeilen. Er is op dit moment nog géén artikel met `affiliate: true`, want er zijn nog geen affiliate-programma's (Fase 4).
- [ ] Elk artikel over darmgezondheid: claims aftoetsen tegen het EFSA-register (Verordening 1924/2006) — geen ongeautoriseerde gezondheidsclaims. → De artikelen doen bewust géén gezondheidsclaim; `probiotica-en-de-europese-regels` legt uit waarom dat niet mag. Eén artikel (`vitamine-c`) haalt de toegestane bewoording letterlijk aan. Dit punt blijft open tot `data/toegestane-claims.json` handmatig in het register is nagelopen en op `geverifieerd: true` staat.
- [x] Elk artikel over cosmetica: geen therapeutische/medische taal ("geneest", "vermindert ontsteking") — check tegen Verordening 1223/2009 en 655/2013. → Afgedwongen door `npm run check`; waar een verboden term beschrijvend voorkomt, staat er een `taalUitzondering` met reden bij.
- [x] Geen enkel artikel suggereert eigen testervaring (geen producten aangeschaft — zie `CLAUDE.md`, afspraken). → Ook mechanisch afgedwongen.
- [ ] Site minimaal 3-6 maanden laten "rijpen" (bestaan, geïndexeerd worden) vóór Fase 4 — dit is een harde practische verwachting uit het onderzoek, geen bureaucratische stap.

## Fase 4 — Monetisatie aanvragen (pas na Fase 3)

- [ ] AdSense aanvragen (site moet op dat moment al voldoen aan: 15-25 kwaliteitsartikelen, verplichte pagina's, duidelijke navigatie, HTTPS).
- [ ] YesStyle affiliate-programma aanvragen.
- [ ] Stylevana affiliate-programma aanvragen (via Awin of rechtstreeks).
- [ ] Amazon Associates NL (PartnerNet) aanvragen — let op: bij afwijzing is er geen beroep mogelijk, alleen een geheel nieuwe aanvraag na verdere ontwikkeling van de site. Wacht dus tot de site er echt klaar voor is.
- [ ] `ads.txt` invullen met de definitieve AdSense-publisher-ID zodra goedgekeurd.

## Fase 5 — Distributie (naast, niet in plaats van, organisch zoekverkeer)

- [ ] Overwegen: Pinterest-account opzetten als één van meerdere kanalen — niet als hoofdstrategie (zie `PLAN.md`, non-goals, over de volatiliteit van Pinterest in 2026).
- [ ] Overwegen: nieuwsbrief als kanaal dat onafhankelijk is van zoekmachines/platformen.
- [ ] Geen actieve, brede social-mediastrategie in v1 (zie `PLAN.md`).

## Doorlopend, niet fase-gebonden

- [ ] Bij elke nieuwe grote contentclaim of bouwbeslissing: volg de onderzoeksmethode uit `CLAUDE.md` (onderzoeksregels) voordat je bouwt.
- [ ] Nieuw onderzoek toevoegen als genummerd bestand in `onderzoek/` (bv. `04-...md`), bestaande bestanden niet met terugwerkende kracht aanpassen.
