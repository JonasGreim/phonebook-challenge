# Architektur

```text
React + Material UI (TypeScript)  -- POST / GraphQL -->  Apollo Server (TypeScript)
                                                          --> telefonbuch.json
                                                              (einmalig laden und validieren)
```

Der Vite-Client enthält keine Telefonbuchdatei. Er ruft ausschließlich
`searchPhonebook(query)` auf. Der Apollo Server lädt die JSON-Datei beim Start,
validiert Array, exakte Felder `name`/`phone` und nicht-leere Strings und hält die
120 Einträge im Speicher.

Der Server ergänzt für React/GraphQL nur zur Laufzeit `contact-<Index>` als stabile ID.
Das ist nötig, weil ein Name zweimal vorkommt; die Quelldatei bleibt unverändert. Die
Suche filtert im Speicher und gibt in Originalreihenfolge alle Treffer zurück.

Der Client verwendet bewusst `fetch` statt Apollo Client: Für eine einzelne Abfrage wäre
ein zusätzlicher Client-Cache und eine weitere Abhängigkeit unnötig. `AbortController`
und eine fortlaufende Anfrage-ID behandeln schnelle Eingaben zuverlässig.

`tsconfig.app.json` und `tsconfig.server.json` prüfen Client und Server getrennt mit
`strict: true`; das Root-`tsconfig.json` verbindet beide Projekte. Die laufzeitvalidierte
Servergrenze und die Prüfung der GraphQL-Antwort im Client behandeln Daten weiterhin als
`unknown`, bis ihre Struktur nachgewiesen ist.

Die automatische Qualitätssicherung verwendet den einzelnen Befehl `npm run check`. Der
Workflow `.github/workflows/quality.yml` installiert auf GitHub Actions mit `npm ci` aus
`package-lock.json`, liest die Node-Version aus `.nvmrc` und führt anschließend denselben
Befehl aus. Lokale Ergebnisse und der Status eines entfernten Workflow-Laufs werden bewusst
getrennt dokumentiert.
