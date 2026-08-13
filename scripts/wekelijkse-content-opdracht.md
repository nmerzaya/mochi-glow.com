# Wekelijkse content — opdracht voor Claude Code

Dit bestand is de prompt die `scripts/wekelijkse-content.ps1` wekelijks en zonder
toezicht aan Claude Code geeft. Lees dit bestand niet als documentatie maar als
instructie die je letterlijk uitvoert, in deze volgorde. Lees eerst `CLAUDE.md`
in de projectroot — alles daarin (compliance, schema, beeldregels, toon) geldt
onverkort, ook al staat het hier niet herhaald.

Belangrijk: dit is een onbewaakte run. Niemand controleert je werk voordat het
naar `main` gepusht wordt, behalve `npm run check` en `npm run build` zelf. Bij
twijfel: sla een artikel over in plaats van iets te publiceren dat mogelijk niet
klopt. Een week overslaan is goedkoper dan een overtreding online.

## Ronde 0 — vorige batch afronden (altijd eerst, ook als er niets is)

1. Kijk in `conceptartikelen/` of er `.md`-bestanden staan van een vorige run.
2. Kijk voor elk conceptbestand of `beeldkeuze/KEUZE.txt` een regel heeft met
   die slug, én die regel drie ingevulde getallen heeft (niet `-` en niet `0`
   op alle drie plekken).
3. Voor elk concept dat zo klaarstaat:
   - Draai `node scripts/haal-stockbeeld.mjs kies`. Dat haalt de gekozen
     beelden op naar `src/assets/artikelen/<slug>.jpg`, `<slug>-2.jpg`,
     `<slug>-3.jpg`.
   - Verplaats het conceptbestand naar `src/content/ingredienten/` of
     `src/content/gut-skin/` (welke pijler staat al in het conceptbestand
     zelf, zie hieronder hoe je concepten schrijft).
   - Controleer dat de frontmatter `afbeelding` naar `../../assets/artikelen/<slug>.jpg`
     wijst en dat de twee inline `![alt](../../assets/artikelen/<slug>-2.jpg)`
     en `-3.jpg`-verwijzingen kloppen (die staan er al in vanaf het schrijven).
   - Draai `npm run check`. Faalt dat, probeer het artikel gericht te
     repareren (maximaal twee pogingen). Lukt het niet, laat het conceptbestand
     staan waar het stond en ga verder met de rest — dit artikel wacht dan tot
     de volgende run.
   - Lukt `npm run check` wel: draai `npm run build` als extra check. Slaagt
     ook dat, commit dit ene artikel apart (`git add` alleen de betrokken
     bestanden) met bericht `Artikel: <titel>` en `git push`.
4. Voor concepten waar `KEUZE.txt` nog `-` heeft (nog niet bekeken) of `0`
   (niets deugde): laat met rust. Niet zelf een keuze verzinnen — dat is
   precies waarom deze twee fasen bestaan, zie `CLAUDE.md` en de toelichting
   bovenin `scripts/haal-stockbeeld.mjs`.

## Ronde 1 — nieuwe artikelen voorbereiden (2 tot 3 stuks)

1. Lees de tags en titels van alle bestaande artikelen in zowel
   `src/content/ingredienten/` als `src/content/gut-skin/`, en ook wat er al
   als concept in `conceptartikelen/` ligt te wachten. Kies onderwerpen die nog
   niet behandeld zijn.
2. Voor elk nieuw artikel, bepaal eerst de pijler en het spoor, dat stuurt de
   rest:
   - **Wat zit erin? (`ingredienten`)** — commercieel, `productType: cosmetica`
     of `voeding-supplement`.
   - **Huid van binnenuit (`gut-skin`)**, spoor wetenschap — `productType: geen`,
     `affiliate: false`, mag vrij naar onderzoek verwijzen.
   - **Huid van binnenuit (`gut-skin`)**, spoor commercieel — `productType:
     voeding-supplement`, mag geen woord over onderzoek bevatten, ook niet
     verhullend, en moet uitsluitend claims uit `data/toegestane-claims.json`
     gebruiken.
   - **Siteniveau-toets**: geef een commercieel voedingsartikel nooit een tag
     die al voorkomt op een artikel dat naar onderzoek linkt (wetenschapsspoor
     of cosmetica met bronnen). Controleer dit expliciet door de tags van
     bestaande artikelen te doorzoeken voordat je tags kiest.
   - Twijfel je of een claim toegestaan is: gebruik hem niet. Verzin nooit een
     nieuwe claim en voeg er nooit een toe aan `data/toegestane-claims.json` —
     dat vereist het onderzoeksproces uit `CLAUDE.md`, niet een snelle
     aanname.
3. Schrijf elk artikel compleet: minimaal 800 woorden, juiste frontmatter voor
   het schema in `src/content.config.ts`, minimaal 2 bronnen met type A/B/C bij
   `gezondheidsclaims: true`, toon volgens `CLAUDE.md` (informatief, niet
   streng, geen therapeutische taal, geen gesuggereerde eigen tests). Zet er nu
   al de twee inline beeldverwijzingen in, ook al bestaan de bestanden nog
   niet: `![<beschrijving>](../../assets/artikelen/<slug>-2.jpg)` en `-3.jpg`.
   Zet ook `afbeelding` in de frontmatter alvast op `../../assets/artikelen/<slug>.jpg`.
4. Sla dit bestand op als `conceptartikelen/<slug>.md` — **niet** in
   `src/content/`, dat gebeurt pas in Ronde 0 van een latere run, zodra er een
   echt beeld is. Zet in een korte kopregel van het bestand (als
   HTML-commentaar) welke pijler/collectie het wordt, zodat een latere run dat
   niet hoeft te raden:
   `<!-- collectie: gut-skin -->` of `<!-- collectie: ingredienten -->`.
5. Draai voor elk nieuw concept: `node scripts/haal-stockbeeld.mjs kandidaten <slug>`.
   Dat zoekt kandidaten en maakt `beeldkeuze/blad-<slug>.jpg` plus een nieuwe
   regel in `KEUZE.txt` met `-  -  -`.
6. Commit de conceptbestanden en de nieuwe contactbladen samen (`conceptartikelen/`
   en `beeldkeuze/`), bericht `Concepten klaar voor beeldkeuze: <titels>`, en
   push. Dit raakt `src/content/` niet, dus de site zelf verandert er niet
   door.

## Ronde 2 — verslag

Schrijf aan het eind een korte samenvatting naar standaarduitvoer (dit komt in
het logbestand terecht): welke artikelen deze week gepubliceerd zijn (Ronde 0),
welke concepten klaarstaan voor beeldkeuze (Ronde 1) en welke artikelen zijn
overgeslagen en waarom.

## Wat je nooit doet in deze onbewaakte run

- Nooit `node scripts/haal-stockbeeld.mjs kies` draaien voor een regel in
  `KEUZE.txt` die nog `-` of `0` bevat.
- Nooit rechtstreeks in `src/content/` schrijven zonder dat er een echt,
  gekozen beeld bestaat.
- Nooit een claim gebruiken die niet letterlijk in `data/toegestane-claims.json`
  staat, en nooit dat bestand zelf aanpassen.
- Nooit `advertentiesActief` in `src/config.ts`, `public/ads.txt`, of
  `public/admin/config.yml` aanraken — dat zijn bewuste, handmatige
  beslissingen van de eigenaar.
- Nooit pushen als `npm run check` of `npm run build` faalt.
