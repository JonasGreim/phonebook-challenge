# Anforderungen

## Vorgaben

- Namen werden während der Eingabe per Freitext durchsucht, ohne Beachtung der
  Groß- und Kleinschreibung.
- Treffer zeigen vollständigen Namen und Telefonnummer.
- Die Oberfläche bleibt auf kleinen und großen Bildschirmen nutzbar.
- `telefonbuch.json` ist die unveränderte, serverseitige Datenquelle.
- Der Client fragt die Daten zur Laufzeit über GraphQL ab.

## Vereinbarte Konkretisierung

- Gesucht wird ab einem Zeichen als Teilstring im Feld `name`.
- Die Anfrage wird vor der Suche getrimmt; leer bedeutet keine Suche und keine Treffer.
- Telefonnummern werden nicht durchsucht und stets als unveränderte Zeichenkette angezeigt.
- Akzente und Umschreibungen werden nicht angeglichen.
- Der Server durchsucht zuerst alle passenden Kontakte, sortiert sie deterministisch nach
  Name und bei gleichem Namen nach stabiler Kontakt-ID und paginiert erst danach.
- Standardmäßig werden 10 Treffer pro Seite angezeigt; 10, 25 und 50 sind auswählbar.
- Jede Antwort enthält Treffer, Seite, Seitengröße, Gesamtzahl und Gesamtseiten. Ungültige
  Seiten- oder Seitengrößenparameter werden serverseitig abgewiesen.
- Nach 280 ms ohne Eingabe startet die Anfrage. Abbruch und eine Anfrage-ID verhindern,
  dass alte Antworten aktuellere Zustände überschreiben.

## Umfangsgrenzen

Keine Anmeldung, Bearbeitung, Datenbank, Suchindex oder Veröffentlichung.

## Sprache

Die Oberfläche unterstützt Deutsch und Englisch. Die Sprachwahl ist sichtbar, wird lokal
gespeichert und aktualisiert die Dokumentensprache. UI-Texte, Status-, Fehler- und
Zugänglichkeitsmeldungen stammen aus einer zentralen Übersetzungsquelle. Markenname und
Kontaktdaten bleiben unverändert; ein Sprachwechsel erhält Suche, Seitengröße, Seite und
Treffer.

## Telefonnummer kopieren

Jeder sichtbare Kontakteintrag besitzt eine zugängliche Kopieraktion. Sie übergibt nur die
unveränderte Telefonnummer an die Clipboard API. Eine Erfolgsmeldung folgt erst nach deren
erfolgreichem Abschluss; fehlende oder abgelehnte Clipboard-Zugriffe werden verständlich
gemeldet. Die sichtbare Telefonnummer bleibt für manuelle Auswahl erhalten.

## Technische Grundlage

Frontend, Server und relevante Tests verwenden striktes TypeScript. Die JSON-Daten werden
weiterhin zur Laufzeit validiert; Typen ersetzen diese Prüfung nicht. ESLint prüft den
TypeScript-/React-Code, Prettier formatiert nur Quellcode und Konfiguration - nicht die
unveränderte Quelldatei `telefonbuch.json`.

## Abnahmekriterien

Teilstrings, Groß-/Kleinschreibung, Leerzeichen, doppelte Namen mit verschiedenen
Nummern, leere Suche, keine Treffer, Datenvalidierung sowie verspätete Antworten und
Leeren des Feldes werden durch Tests abgedeckt. Pagination-Tests prüfen die vollständige,
eindeutige Kontakt-ID-Menge über alle Seiten, gleiche Namen, Seitengrößen, Grenzen,
ungültige Parameter, Resets und alte Antworten. Die sichtbare Fehlerdarstellung sowie
Mobil- und Tastaturbedienung wurden vom User erfolgreich im Browser geprüft. Clipboard-Tests
decken korrekte Zuordnung gleichnamiger Kontakte, verzögerten Erfolg sowie fehlende und
abgelehnte Clipboard-Zugriffe ab; deren aktueller lokaler Lauf steht noch aus.
