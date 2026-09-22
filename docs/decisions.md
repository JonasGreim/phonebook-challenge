# Technische Entscheidungen

## React, Vite und JavaScript

Vite liefert einen kleinen, aktuellen React-Startpunkt; JavaScript hält die Aufgabe für
den vorgesehenen Umfang gut lesbar. TypeScript wäre sinnvoll bei wachsendem Datenmodell,
bringt hier aber zusätzlichen Erklär- und Konfigurationsaufwand.

## Apollo Server und GraphQL

Apollo Server erfüllt die gewünschte Client-Server-Architektur mit einem kleinen,
selbstdokumentierenden Schema. Eine REST-Route wäre für diese eine Suche einfacher,
würde die bevorzugte GraphQL-Technologie jedoch nicht zeigen.

## Datenhaltung im Speicher

Nach erfolgreicher Startvalidierung liegen 120 Kontakte im Arbeitsspeicher. Eine Datenbank
oder ein Index wären mehr Infrastruktur ohne praktischen Nutzen; bei veränderlichen oder
großen Daten wären sie neu zu bewerten.

UI/UX-Entscheidungen sind in [ui-ux.md](ui-ux.md) dokumentiert.
