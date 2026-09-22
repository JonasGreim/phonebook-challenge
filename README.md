# Telefonbuch-Suche

Eine kleine Webanwendung zum Durchsuchen eines Telefonbuchs nach Namen. Das
Frontend fragt Treffer zur Laufzeit über eine GraphQL-Schnittstelle vom Server ab.

## Voraussetzungen

- Node.js 22.22.2 oder neuer
- npm 10 oder neuer

## Installation und Start

```bash
npm install
npm run dev
```

Danach ist die Anwendung unter http://localhost:5173 erreichbar. Der GraphQL-
Server läuft parallel unter http://localhost:4000.

## Weitere Befehle

```bash
npm test
npm run build
npm run start:server
```

`npm test` prüft Datenvalidierung und Suchlogik. Der Build prüft das React-
Frontend. Für einen produktionsnahen lokalen Start zuerst `npm run build`, dann
`npm run start:server`; die Auslieferung statischer Dateien ist bewusst nicht Teil
dieser kleinen Aufgabe.

## Dokumentation

- [Anforderungen](docs/requirements.md)
- [Architektur](docs/architecture.md)
- [Bedienkonzept und UI/UX-Entscheidungen](docs/ui-ux.md)
- [Technische Entscheidungen](docs/decisions.md)

Den aktuellen Arbeitsstand und die Übergabe enthält
[`ai/tasks/current/implementation.md`](ai/tasks/current/implementation.md).
