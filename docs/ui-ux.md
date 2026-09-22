# Bedienkonzept und UI/UX

## FindCall-Branding

FindCall verwendet Dunkelblau (`#0B2D5B`) für Identität, Überschriften und Haupttext
sowie Blau (`#2563EB`) für interaktive Elemente und den Telefonhörer im Logo. Das helle
Seitenblau (`#F3F6FA`) trennt die weiße Inhaltsfläche ruhig vom Hintergrund; Rahmen sind
`#DCE4EE`. Das Grün wird ausschließlich als Icon-Fläche verwendet, der kontrastreichere
Erfolgston des Themes für Status verwendet. Alle Werte, Typografie, Rundungen, Fokus- und
Komponentenvarianten liegen in `src/theme.js`.

Die Schriftfolge ist `Inter` mit robusten System-Fallbacks. Inter wird nicht nachgeladen,
da kein lokales Font-Asset vorliegt; die Oberfläche bleibt daher ohne externe Anfrage
lesbar. Das selbst erstellte SVG kombiniert eine dunkelblaue Lupe mit einem blauen Hörer.
Die Wortmarke ist auf kleinen Bildschirmen ausgeblendet; das Symbol bleibt über den
umgebenden Link zugänglich. Das vereinfachte Symbol ist außerdem als Favicon eingebunden.

## Aufbau

Eine schmale, mittig ausgerichtete Inhaltsfläche setzt Überschrift, kurze Erklärung und
das prominent beschriftete Suchfeld vor die Trefferliste. Auf kleinen Bildschirmen nutzt
sie die gesamte verfügbare Breite, auf großen bleibt die Lesebreite begrenzt.

Der kompakte Header enthält die Wortmarke und keine künstliche Navigation. Eine
Sprachumschaltung ist im Ausgangsprojekt nicht vorhanden und wurde bewusst nicht als
zweite Übersetzungslösung ergänzt. Die Suchanfrage kann über eine beschriftete
Icon-Schaltfläche geleert werden.

## Zustände

- Start/leer: hilfreicher Hinweis, keine alte Trefferliste.
- Warten/Laden: neutrale Statusmeldung; beim Laden zusätzlich ein Spinner.
- Treffer: Anzahl und Liste mit Name sowie Telefonnummer.
- Keine Treffer: eindeutige, nicht-technische Meldung.
- Fehler: hervorgehobene Fehlermeldung statt leerer Trefferliste.

Beim Ändern einer Suche bleibt keine veraltete Liste sichtbar. Beim Leeren werden
ausstehende Ergebnisse ignoriert und der Startzustand wiederhergestellt.

## Entscheidungen

| Entscheidung | Nutzen | Alternative und Nachteil | Überprüfung |
| --- | --- | --- | --- |
| 280-ms-Debounce | Reagiert zügig und vermeidet Anfragen für jeden Tastendruck. | Sofortige Anfrage erzeugt unnötige Serverlast. | Manuell bei schneller Eingabe prüfen. |
| Textfeld mit sichtbarem Label und Hilfetext | Zweck und Suchregeln sind ohne Vorwissen klar. | Nur ein Platzhalter verschwindet beim Tippen. | Tastatur- und Screenreader-Test offen. |
| Status per `aria-live` und sichtbarer Fokus von Material UI | Rückmeldung auch ohne Blick auf die Liste. | Rein visuelle Meldung wäre schlechter zugänglich. | Mit Screenreader noch manuell prüfen. |
| Symbolische FindCall-Wortmarke mit Favicon | Marke ist im Header und Browser-Tab schnell erkennbar, ohne Marketingbereich. | Externes Bildmaterial wäre schwerer wartbar und lizenzabhängig. | Favicon im Produktions-Build vorhanden; Darstellung bei 16/32 px manuell prüfen. |
| Dezente Liste statt Einzelkarten | Viele Treffer bleiben scanbar und brauchen wenig Platz. | Große Karten würden auf Mobilgeräten unnötig viel scrollen. | Manuell mit langen Einträgen und schmalem Viewport prüfen. |
