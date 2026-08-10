# Mochi Glow

Nederlandstalige contentsite over K-beauty-ingrediënten en de verbinding tussen darm en huid.
Statisch gebouwd met Astro, zonder externe verzoeken en zonder tracking.

> **Status:** inhoudelijk compleet, nog niet online. 16 artikelen over twee pijlers, alle verplichte
> pagina's, en een build die slaagt. Het domein `mochi-glow.com` is geregistreerd; de repo staat nog
> niet op GitHub en er is nog geen hosting gekoppeld.
>
> **Om live te gaan: volg `DEPLOY.md`.** Begin bij stap 0 — die schermt je e-mailadres af voordat er
> iets publiek wordt.

## Aan de slag

```
npm install
npm run dev        # lokale ontwikkelserver
npm run build      # productie-build (draait eerst de compliance-controle)
npm run preview    # de gebouwde site bekijken
npm run check      # alleen de compliance-controle
```

Node 20 of nieuwer is vereist.

## Wat dit project bijzonder maakt

De site staat in een niche waar de meeste beweringen wettelijk niet gedaan mogen worden. Cosmetica
mag geen medische werking claimen (Verordening 1223/2009 en 655/2013), en voor voedingsmiddelen geldt
dat alleen goedgekeurde claims uit het Europese register zijn toegestaan (Verordening 1924/2006) —
waarbij voor probiotica en darmgezondheid géén enkele goedgekeurde claim bestaat.

Die regels zijn daarom niet als richtlijn opgeschreven maar in code gezet:

- **`npm run check`** (`scripts/check-compliance.mjs`) weigert artikelen met therapeutische taal,
  gesuggereerde eigen tests, niet-toegestane darmclaims, of claims over voedingsstoffen die niet
  letterlijk in `data/toegestane-claims.json` staan. De controle draait als eerste stap van de build,
  dus een overtreding kan niet gepubliceerd worden.
- **Het contentschema** (`src/content.config.ts`) plaatst de reclame-disclosure automatisch zodra
  `affiliate: true` staat, zodat die niet vergeten kan worden.
- **De gut-skin-collectie** kan op schemaniveau geen affiliate-links bevatten. Dat is nodig omdat de
  NVWA een verwijzing naar wetenschappelijke publicaties zelf als ontoelaatbare medische claim
  beschouwt op een pagina die een levensmiddel aanprijst. Door daar niets te verkopen, mogen die
  artikelen wél gewoon naar onderzoek linken.

Een artikel dat een verboden term beschrijvend gebruikt — bijvoorbeeld om uit te leggen dat een crème
niets mag genezen — kan dat declareren via `taalUitzonderingen`, mét reden. Zo blijft een uitzondering
zichtbaar in plaats van stilzwijgend.

## Structuur

```
src/
  content/ingredienten/   pijler 1 — K-beauty-ingrediënten
  content/gut-skin/       pijler 2 — darm-huid, niet commercieel
  content.config.ts       schema en compliance-velden
  components/             disclosure, bronnenlijst, disclaimer, kaarten
  layouts/                BasisLayout en ArtikelLayout
  pages/                  routes en verplichte pagina's
  styles/                 ontwerptokens en globale stijl
scripts/check-compliance.mjs
data/toegestane-claims.json
public/admin/             Sveltia CMS
onderzoek/                onderbouwing van alle keuzes
```

## Onderbouwing

Elke keuze in dit project komt voort uit het onderzoek in `onderzoek/`. Lees `CLAUDE.md`,
`ARCHITECTUUR.md`, `PLAN.md` en `TAKEN.md` voordat je iets structureels wijzigt.

## Nog te doen voor livegang

De volledige route staat in **`DEPLOY.md`**. Kort samengevat blijven deze vier waarden nog open:

- `public/admin/config.yml`: veld `repo` invullen zodra de GitHub-repo bestaat.
- `data/toegestane-claims.json`: elke claim nalezen in het officiële EU-register en `geverifieerd` op
  `true` zetten.
- `public/ads.txt`: publisher-ID invullen ná goedkeuring van AdSense.
- `src/config.ts`: `advertentiesActief` op `true` zetten wanneer advertenties live gaan — pas dan
  verschijnt het toestemmingsvenster.

## Licentie

De **code** valt onder de MIT-licentie, zie `LICENSE`.

De **artikelteksten** in `src/content/` en de documenten in `onderzoek/` vallen daar uitdrukkelijk
niet onder; die zijn auteursrechtelijk beschermd. Citeren met bronvermelding mag, integraal
overnemen niet.
