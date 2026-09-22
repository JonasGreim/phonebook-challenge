# Aktuelle Aufgabe: Telefonbuch-Suche implementieren

## Ziel

Eine lokal startbare React- und GraphQL-Anwendung auf Basis der unveränderten
`telefonbuch.json` bereitstellen.

## Umfang

Serverseitige Datenvalidierung und Suche, React-Oberfläche mit asynchronen Zuständen,
FindCall-Branding, Dokumentation und gezielte Tests.

## Relevanter Kontext

`telefonbuch.json`, `server/`, `src/`, `docs/` und `README.md`.

## Abnahmekriterien und Prüfungen

- Suchlogik, Datenvalidierung, Leerwerte, doppelte Namen und Umlautverhalten: `npm test`
- Frontend-Bundle: `npm run build`
- Vollständiger Datenfluss und Bedienbarkeit: manuell im Browser

## Stand und nächster Schritt

FindCall-Theme, responsiver Header, eigenes SVG-Logo/Favicon, Suchbereich und Trefferliste
sind umgesetzt. Installation mit Node 22.22.2, acht automatisierte Tests und der
Produktions-Build sind erfolgreich geprüft. Eine Browser-Automation war in dieser Umgebung
nicht verfügbar; responsive Darstellung, Tastaturbedienung, Screenreader-Ausgabe,
Favicon bei 16/32 px und sichtbarer Fehlerzustand sind vor Veröffentlichung manuell zu
prüfen. Eine Sprachumschaltung und Kopierfunktion existierten nicht und wurden bewusst
nicht ergänzt.
