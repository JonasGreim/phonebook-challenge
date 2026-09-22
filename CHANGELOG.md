# Änderungsprotokoll

## Noch nicht veröffentlicht

- React-Frontend mit Material UI und GraphQL-Anbindung angelegt.
- Apollo Server mit validiertem, speicherbasiertem Telefonbuch und Teilstring-Suche angelegt.
- Anforderungen, Architektur, UI/UX- und Entscheidungsdokumentation ergänzt.
- Node.js 22.22.2 als reproduzierbare Laufzeitvorgabe in `.nvmrc` festgelegt; Lockfile erstellt.
- Acht Tests für Server-Suchlogik sowie Debounce- und Race-Condition-Verhalten des Clients ergänzt.
- FindCall-Branding mit zentralem Material-UI-Theme, responsivem SVG-Logo und Favicon ergänzt.
- Suchbereich und Trefferliste mit klareren Zuständen, Löschaktion und Telefon-Icons überarbeitet.
- Frontend, Server und relevante Tests auf striktes TypeScript migriert; JSON- und
  Antwortvalidierung zur Laufzeit beibehalten.
- TypeScript, ESLint und Prettier mit zugehörigen Prüfskripten konfiguriert.
- `npm run check` als gemeinsamen lokalen Einstiegspunkt für Typecheck, Lint,
  Formatprüfung, Tests und Build ergänzt.
- GitHub-Actions-Workflow für lockfile-basierte Installation und dieselbe Check-Kette ergänzt.
- Erfolgreichen GitHub-Actions-Lauf nach Commit und Push bestätigt.
- Deutsche und englische UI mit zentralen Übersetzungen, gespeicherter Sprachwahl und
  aktualisiertem Dokument-`lang` ergänzt.
- Serverseitige Pagination nach vollständiger Suche mit stabiler Sortierung nach Name und
  Kontakt-ID, Gesamtmetadaten, 10/25/50-Auswahl und responsiver Seitennavigation ergänzt.
- Paging-, Gleichnamigkeits-, Seitengrenzen-, Reset- und Race-Condition-Tests ergänzt.
