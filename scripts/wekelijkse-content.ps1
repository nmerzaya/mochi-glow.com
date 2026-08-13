# Wekelijkse content, start Claude Code onbewaakt met scripts/wekelijkse-content-opdracht.md
#
# Bedoeld voor Windows Taakplanner, wekelijks, terwijl je pc aan en ingelogd
# staat (Claude Code gebruikt je bestaande login, geen los API-sleutel nodig).
#
# Wat dit script WEL doet: de opdracht in wekelijkse-content-opdracht.md geven
# aan Claude Code met bestandsbewerkingen en Bash automatisch toegestaan
# (--permission-mode acceptEdits), zodat er niemand hoeft te klikken.
#
# Wat dit script NIET doet: git-authenticatie regelen. Dat moet al werken
# vanaf deze pc (dezelfde manier waarop Claude Code eerder al naar GitHub kon
# pushen tijdens het bouwen van de site).

$ErrorActionPreference = "Stop"

$projectmap = "C:\Users\Nissrine\OneDrive\Documents\K-beauty"
$opdracht = Join-Path $projectmap "scripts\wekelijkse-content-opdracht.md"
$logmap = Join-Path $projectmap "logs"

if (-not (Test-Path $logmap)) {
    New-Item -ItemType Directory -Path $logmap | Out-Null
}

$tijdstempel = Get-Date -Format "yyyy-MM-dd_HH-mm"
$logbestand = Join-Path $logmap "wekelijks-$tijdstempel.log"

Set-Location $projectmap

Get-Content $opdracht -Raw | claude -p `
    --permission-mode acceptEdits `
    --allowedTools "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch" `
    --output-format text `
    *> $logbestand

Write-Output "Klaar. Log staat in $logbestand"
