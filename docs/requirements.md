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
- Die Originalreihenfolge bleibt erhalten; Ergebnisse werden nicht begrenzt.
- Nach 280 ms ohne Eingabe startet die Anfrage. Abbruch und eine Anfrage-ID verhindern,
  dass alte Antworten aktuellere Zustände überschreiben.

## Umfangsgrenzen

Keine Anmeldung, Bearbeitung, Datenbank, Suchindex oder Veröffentlichung. Pagination und
Kopieren von Telefonnummern sind geplant, aber noch nicht implementiert.

## Sprache

Die Oberfläche unterstützt Deutsch und Englisch. Die Sprachwahl ist sichtbar, wird lokal
gespeichert und aktualisiert die Dokumentensprache. UI-Texte, Status-, Fehler- und
Zugänglichkeitsmeldungen stammen aus einer zentralen Übersetzungsquelle. Markenname und
Kontaktdaten bleiben unverändert; ein Sprachwechsel erhält die aktuelle Suche und Treffer.

## Technische Grundlage

Frontend, Server und relevante Tests verwenden striktes TypeScript. Die JSON-Daten werden
weiterhin zur Laufzeit validiert; Typen ersetzen diese Prüfung nicht. ESLint prüft den
TypeScript-/React-Code, Prettier formatiert nur Quellcode und Konfiguration - nicht die
unveränderte Quelldatei `telefonbuch.json`.

## Abnahmekriterien

Teilstrings, Groß-/Kleinschreibung, Leerzeichen, doppelte Namen mit verschiedenen
Nummern, leere Suche, keine Treffer, Datenvalidierung sowie verspätete Antworten und
Leeren des Feldes sind automatisiert geprüft. Die sichtbare Fehlerdarstellung wird vom
Code abgedeckt, ist aber noch manuell im Browser zu prüfen.
