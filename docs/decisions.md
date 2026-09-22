# Technische Entscheidungen

## React, Vite und TypeScript

Vite liefert einen kleinen, aktuellen React-Startpunkt. Striktes TypeScript beschreibt
Kontakte, GraphQL-Argumente, UI-Zustände und API-Antworten explizit. Das reduziert Fehler
an Client-Server-Grenzen, ersetzt aber nicht die Laufzeitvalidierung von JSON oder HTTP-
Antworten. JavaScript wäre konfigurationsärmer, deckt diese Fehlerklasse jedoch später ab.

## ESLint und Prettier

ESLint verwendet die Flat Config mit den vorhandenen React- und TypeScript-Plugins.
Prettier ist ausschließlich für Formatierung zuständig; `eslint-config-prettier` verhindert
widersprüchliche Formatierungsregeln. Die Formatierungsbefehle listen nur Quellcode und
Konfiguration explizit auf, damit die bereitgestellte Datenquelle unverändert bleibt.

## Lokale Checks und GitHub Actions

`npm run check` bündelt die vorhandenen Prüfungen, statt deren Konfiguration zu duplizieren.
Der GitHub-Actions-Workflow nutzt `npm ci`, die Lockdatei und `.nvmrc`, bevor er genau diesen
Befehl ausführt. Ein lokaler Erfolg beweist nicht den Erfolg auf GitHub; erst ein nach dem
Push sichtbarer Workflow-Lauf darf als CI-Ergebnis dokumentiert werden.

## Internationalization without an additional dependency

The application has one small, typed translation module because it currently supports only
two static locales. It centralizes UI text and error codes while keeping search state outside
the locale state. A dedicated i18n library would be appropriate for pluralization rules,
many locales, or nested content, but would add unnecessary complexity now.

## Apollo Server und GraphQL

Apollo Server erfüllt die gewünschte Client-Server-Architektur mit einem kleinen,
selbstdokumentierenden Schema. Eine REST-Route wäre für diese eine Suche einfacher,
würde die bevorzugte GraphQL-Technologie jedoch nicht zeigen.

## Datenhaltung im Speicher

Nach erfolgreicher Startvalidierung liegen 120 Kontakte im Arbeitsspeicher. Eine Datenbank
oder ein Index wären mehr Infrastruktur ohne praktischen Nutzen; bei veränderlichen oder
großen Daten wären sie neu zu bewerten.

UI/UX-Entscheidungen sind in [ui-ux.md](ui-ux.md) dokumentiert.

## Pagination after complete server-side search

The server filters the complete validated in-memory phonebook before sorting by name and
stable contact ID, then returns the requested page with total metadata. This makes page
boundaries deterministic and keeps separate records with the same name. Paginating before
filtering would omit valid matches; using a name as a key would collapse valid contacts.

## Clipboard API with explicit completion feedback

The client uses the built-in Clipboard API, so no dependency or server endpoint is needed.
It copies the stored phone string directly, preserving leading zeroes and formatting. A success
message is deferred until `writeText` resolves; unavailable or rejected access keeps the
number visible and gives the user a translated explanation.
