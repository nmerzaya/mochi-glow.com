# Van deze map naar mochi-glow.com

Stap voor stap. Alles wat hieronder staat is gratis, op het domein na, dat heb je al.

Er is één ding dat je **vóór de eerste push** moet doen (stap 0). De rest kan in volgorde.

---

## Stap 0, Je e-mailadres afschermen

Dit is geen formaliteit. Git zet bij elke commit een naam en een e-mailadres, en die zijn
voor iedereen zichtbaar in een publieke repo. De hele site is opgezet onder een pseudoniem;
je echte adres in de commitgeschiedenis maakt dat in één klap ongedaan.

De repo is daarom aangemaakt met een neutrale identiteit:

```
Noor <noor@users.noreply.github.com>
```

Dat adres is een plaatsvervanger. GitHub geeft je een eigen privéadres in deze vorm:

1. Ga op GitHub naar **Settings → Emails**.
2. Zet **Keep my email addresses private** aan.
3. Daaronder staat jouw persoonlijke noreply-adres, in de vorm
   `1234567+gebruikersnaam@users.noreply.github.com`. Kopieer dat.
4. Zet het in deze map als vaste instelling:

```powershell
git config user.email "1234567+gebruikersnaam@users.noreply.github.com"
```

Zet ook **Block command line pushes that expose my email** aan, in hetzelfde scherm. Dan
weigert GitHub een push als er per ongeluk toch een echt adres in zit.

> De commit die er nu al ligt, gebruikt het plaatsvervangende adres. Dat lekt niets, maar het
> koppelt de commit ook niet aan jouw GitHub-account. Wil je dat wel, voer dan eerst het
> commando hierboven uit en daarna:
> `git commit --amend --reset-author --no-edit`

---

## Stap 1, De repo op GitHub zetten

Maak op GitHub een **lege** repository aan: geen README, geen .gitignore, geen licentie, die staan hier al, en anders krijg je een conflict bij de eerste push.

- Naam: `mochi-glow`
- Zichtbaarheid: **Public**. Dat is verplicht voor de gratis laag van Cloudflare Pages en
  voor Sveltia CMS.

Koppel daarna deze map eraan en push. Vervang `GEBRUIKERSNAAM` door je eigen naam:

```powershell
git remote add origin https://github.com/GEBRUIKERSNAAM/mochi-glow.git
git push -u origin main
```

Git vraagt de eerste keer om in te loggen; er opent een venster van GitHub. Lukt dat niet,
dan is [GitHub CLI](https://cli.github.com/) of GitHub Desktop een makkelijkere route.

> **Let op:** `git` is deze sessie geïnstalleerd en staat mogelijk nog niet in het PATH van een
> nieuw geopend venster. Werkt `git` niet, open dan een nieuwe PowerShell, of gebruik het
> volledige pad: `& "C:\Program Files\Git\cmd\git.exe" push -u origin main`

## Stap 2, De CMS-instelling invullen

In `public/admin/config.yml` staat op regel 12 nog een plaatshouder:

```yaml
repo: GEBRUIKERSNAAM/mochi-glow # <-- aanpassen
```

Zet daar je eigen GitHub-gebruikersnaam neer. Zonder dat kun je niet inloggen op `/admin`.
Commit en push die wijziging.

## Stap 3, Cloudflare Pages koppelen

1. Ga naar het Cloudflare-dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Geef Cloudflare toegang tot je GitHub-account en kies de repo `mochi-glow`.
3. Vul de bouwinstellingen in:

| Instelling | Waarde |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leeg laten)* |

4. Voeg onder **Environment variables** één variabele toe:

| Naam | Waarde |
|---|---|
| `NODE_VERSION` | `20` |

Dat laatste is nodig omdat de bouwomgeving anders een oudere Node kan pakken dan het project
aankan.

5. Klik op **Save and Deploy**.

> In de hoofdmap staat `wrangler.jsonc` met `pages_build_output_dir: "dist"`. Staat dat bestand er,
> dan is dát wat telt en negeert Cloudflare het veld *Build output directory* uit de tabel
> hierboven. Ze zeggen nu hetzelfde, dus er is niets aan de hand; wijzig je het één, wijzig dan het
> ander mee. Datzelfde bestand is de reden dat de map `functions/` werkt, want file-based eindpunten
> bestaan alleen op Pages en niet op Workers.

De eerste build duurt een paar minuten. Daarna krijg je een adres op `*.pages.dev`. Controleer
daar of de site het doet voordat je het domein koppelt.

> Als de build faalt: de compliance-controle draait als eerste stap. Faalt díe, dan staat er in
> het buildlogboek precies welk artikel welke regel overtreedt. Dat is bedoeld gedrag, het
> voorkomt dat een artikel met een verboden claim online komt.

## Stap 4, Het domein koppelen

Je hebt `mochi-glow.com` al bij Cloudflare, wat dit eenvoudig maakt: de DNS staat al bij
dezelfde partij.

1. Ga in je Pages-project naar **Custom domains** → **Set up a custom domain**.
2. Vul `mochi-glow.com` in en bevestig. Cloudflare maakt het DNS-record zelf aan.
3. Voeg daarna ook `www.mochi-glow.com` toe. Cloudflare zet die automatisch door naar de
   hoofdnaam.

Het certificaat wordt automatisch aangevraagd. Dat duurt meestal enkele minuten, soms langer.
Controleer daarna of `https://mochi-glow.com` werkt **zonder** waarschuwing in de browser.

## Stap 5, De aanmelding per mail aanzetten

Dit kan ook later; de site werkt zonder. Zolang `mailActief` in `src/config.ts` op `false` staat,
staat er geen aanmeldformulier op de site en vertellen `/privacybeleid` en `/cookiebeleid` er ook
niet over. Zet die vlag **als laatste** om, niet als eerste: een formulier dat een adres vraagt en
daarna zegt dat het niet kan, is erger dan geen formulier.

### 5a, Brevo inrichten

[Brevo](https://www.brevo.com) heeft een gratis laag die ruim voldoende is (300 mails per dag).

1. Maak een account aan.
2. **Verifieer het afzenderdomein.** Ga naar *Senders, Domains & Dedicated IPs* → *Domains* en voeg
   `mochi-glow.com` toe. Brevo geeft je een handvol DNS-records (DKIM, SPF, en een controlerecord).
   Zet die in Cloudflare onder **DNS** bij hetzelfde domein. Sla dit niet over: zonder die records
   komt de mail bij de meeste ontvangers in de spammap terecht, of helemaal niet aan.
3. Maak onder *Contacts* → *Lists* een lijst aan voor de nieuwsbrief. Het nummer van die lijst is
   `BREVO_LIJST_ID`.
4. Maak onder *Campaigns* → *Templates* een sjabloon van het type **Double opt-in confirmation**.
   Daar hoort de bevestigingslink in, die Brevo zelf invult. Het nummer ervan is
   `BREVO_DOI_SJABLOON`.
5. Maak onder *SMTP & API* → *API Keys* een sleutel aan. Dat is `BREVO_SLEUTEL`.

> Waarom die bevestigingsstap: mail sturen over nieuwe artikelen is marketing, en artikel 11.7 van
> de Telecommunicatiewet vraagt daar aantoonbare toestemming voor van degene die de mail ontvangt.
> Iemand kan het adres van een ander invullen. Zonder bevestigingsmail zou die ander post krijgen
> waar hij nooit om gevraagd heeft, en zou er van "aantoonbaar" niets over zijn.

### 5b, De sleutels in Cloudflare zetten

Ga in je Pages-project naar **Settings → Environment variables** en voeg deze drie toe. Kies bij
elk **Encrypt**, zodat ze als secret opgeslagen worden en niet meer terug te lezen zijn:

| Naam | Waarde |
|---|---|
| `BREVO_SLEUTEL` | de API-sleutel uit stap 5a.5 |
| `BREVO_LIJST_ID` | het lijstnummer uit stap 5a.3 |
| `BREVO_DOI_SJABLOON` | het sjabloonnummer uit stap 5a.4 |

Zet ze **niet** in de repo. Met deze sleutel kan iemand mail versturen namens jouw domein; dat is
van een andere orde dan de Web3Forms-sleutel, die sowieso in de HTML van elk formulier staat.

Zet daarna `mailActief` in `src/config.ts` op `true`, commit en push.

### 5c, Een snelheidsgrens op `/api/`

De twee eindpunten sturen mail. Zonder grens kan iemand met een script de gratis dagdrempel
opmaken, of, erger, een reeks vreemden een bevestigingsmail bezorgen. Het onzichtbare
honingpotveld in het formulier houdt eenvoudige bots tegen, maar niet iemand die het eindpunt
rechtstreeks aanroept.

Cloudflare geeft op de gratis laag één snelheidsregel. Ga naar **Security → WAF → Rate limiting
rules** en maak er een aan: pad begint met `/api/`, maximaal 5 verzoeken per IP per minuut, actie
*Block*. Dat is ruim voor een mens en krap voor een script.

### 5d, Lokaal proberen

`npm run dev` serveert `/api/` **niet**: Astro weet niets van de map `functions/`, die draait pas op
Cloudflare. Wil je het lokaal proberen, gebruik dan de Cloudflare-server op de gebouwde site:

```powershell
npm run build; if ($?) { npx wrangler pages dev dist }
```

Zet de drie waarden daarvoor in een bestand `.dev.vars` in de hoofdmap:

```
BREVO_SLEUTEL=xkeysib-...
BREVO_LIJST_ID=2
BREVO_DOI_SJABLOON=1
```

Dat bestand staat in `.gitignore` en hoort daar te blijven.

## Stap 6, Controleren na livegang

Loop dit lijstje na zodra de site draait:

- [ ] `https://mochi-glow.com` laadt met een geldig certificaat.
- [ ] `https://mochi-glow.com/sitemap-index.xml` geeft een sitemap terug.
- [ ] `https://mochi-glow.com/rss.xml` geeft de feed terug.
- [ ] `/admin` toont het inlogscherm van Sveltia CMS en je kunt inloggen met GitHub.
- [ ] Een artikelpagina toont het beeld bovenaan, twee beelden in de lopende tekst, de bronnenlijst
      en, bij een gut-skin-artikel, de medische disclaimer.
- [ ] Er verschijnt een cookiemelding, en weigeren is er even makkelijk als accepteren. Die melding
      hoort er te zijn zolang `ga4MeetID` gevuld is of `advertentiesActief` aanstaat; staan die
      allebei uit, dan hoort ze er juist **niet** te zijn.
- [ ] Meld de site aan bij [Google Search Console](https://search.google.com/search-console)
      en dien de sitemap in. Dit is de stap die de indexering op gang brengt, en die kost tijd.

En als je stap 5 gedaan hebt, dus met `mailActief` op `true`:

- [ ] `https://mochi-glow.com/api/aanmelden` in de adresbalk geeft een **405**, niet een 404. Een 404
      betekent dat Cloudflare de map `functions/` niet heeft opgepikt; kijk dan of `wrangler.jsonc`
      nog op `pages_build_output_dir` staat.
- [ ] Meld je met je eigen adres aan. Je krijgt een bevestigingsmail (kijk ook in de spammap, dat
      zegt iets over stap 5a.2), en de link daarin komt uit op `/aanmelding-bevestigd`.
- [ ] Doe daarna `/routine` en laat de uitkomst naar jezelf sturen. De mail moet dezelfde uitkomst
      tonen als de pagina, en je mag er niet ook een nieuwsbriefbevestiging bij krijgen zolang je
      het vinkje niet hebt aangezet.
- [ ] Lees een artikel en blijf er een halve minuut op. Het aanmeldvenster verschijnt één keer, niet
      vóór je de cookiekeuze gemaakt hebt, en na wegklikken niet nog eens, ook niet na herladen.
- [ ] `/privacybeleid` en `/cookiebeleid` vertellen nu wél over de nieuwsbrief. Doen ze dat niet,
      dan staat `mailActief` nog op `false` en klopt de rest van dit lijstje ook niet.

---

## Daarna: wat er nog wacht

Volgens `TAKEN.md` komt monetisatie pas ná de contentbasis, en dat is bewust. Een te vroege
aanvraag bij Amazon Associates kan niet opnieuw beoordeeld worden.

Wat nog openstaat voordat je iets aanvraagt:

- ~~**`data/toegestane-claims.json`**~~, **afgerond op 2026-08-12.** Alle bewoordingen zijn
  nageslagen tegen de geconsolideerde tekst van Verordening (EU) nr. 432/2012 en `geverifieerd` staat
  op `true`. Twaalf van de zestien claims en vijf van de zes darmclaims bleken niet letterlijk te
  kloppen en zijn gecorrigeerd; de verantwoording staat in `onderzoek/07`, par. 4.4. Het EU-register
  zelf is een JavaScript-toepassing die niet automatisch uit te lezen is, de verordening is daarom
  via het Publicatiebureau opgehaald, en dat is de vaststellende wetgeving zelf.
- **`public/ads.txt`**, publisher-ID invullen, maar pas ná goedkeuring van AdSense.
- **`src/config.ts`**, `advertentiesActief` op `true` zetten op het moment dat er
  daadwerkelijk een advertentiescript op de site staat, niet eerder.
- **De site laten rijpen.** Het onderzoek in `onderzoek/03-tegenspraak.md` gaat ervan uit dat
  Google doorgaans drie tot zes maanden sitegeschiedenis wil zien. Dat is geen bureaucratie maar
  een praktische verwachting.

## Als er iets misgaat

**De build faalt op de compliance-controle.** Lees het logboek: er staat bestand, regelnummer en
reden. Pas het artikel aan, of, als de term beschrijvend wordt gebruikt, voeg een
`taalUitzondering` toe met een reden. Gebruik dat laatste niet om een terechte melding weg te
werken.

**De build faalt op Node.** Controleer of `NODE_VERSION` als omgevingsvariabele op `20` staat.

**`/admin` laat je niet inloggen.** Dan staat `repo:` in `public/admin/config.yml` nog verkeerd,
of de repo is niet publiek.

**Lokaal werkt het niet meer na een `git pull`.** Draai `npm install` opnieuw; `node_modules`
staat bewust niet in de repo.

**`/api/aanmelden` geeft een 404.** Dan heeft Cloudflare de map `functions/` niet opgepikt.
Controleer of `wrangler.jsonc` op `pages_build_output_dir` staat en niet op `assets`, en of het
project inderdaad een Pages-project is en geen Worker.

**Het aanmelden geeft "Aanmelden kan op dit moment niet".** Dat is de melding als een van de drie
omgevingsvariabelen ontbreekt. De site zegt bewust niet welke; kijk in Pages → Settings →
Environment variables of ze er alle drie staan, en of ze op de juiste omgeving staan (Production
én Preview zijn gescheiden lijsten).

**De bevestigingsmail komt niet aan.** Kijk eerst in de spammap. Komt hij daar wel, dan zijn de
DNS-records uit stap 5a.2 nog niet compleet of nog niet doorgevoerd. In het buildlogboek van de
functie staat wat Brevo antwoordde.
