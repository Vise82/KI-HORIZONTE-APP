# KI HORIZONTE · App 02

Modularer Ausbau des bestätigten Musters, unveröffentlicht.

## Start
Teilnehmerpaket vollständig entpacken und `dist/index.html` im Browser öffnen. Die Ordnerstruktur beibehalten. Auf Dienst-iPads muss eine geeignete schulische Bereitstellung noch praktisch erprobt werden; ein ZIP allein ist keine einsatzbereite iPad-App.

## Was jetzt enthalten ist
- 22 Ansichten: Startseite, Unterricht, Lernen mit drei Challenge-Anfängen, Prüfen A/B/C, Schulentwicklung einschließlich Momentaufnahme/Arbeitsbogen/Logbuch/Coach-Rückmeldung, Selbstlernen, persönliche Rückmeldekarte, Coaches, Tages-/Raumorientierung und persönliche Arbeitsstände.
- Original-PDFs im Arbeitszusammenhang; PRÜFEN inklusive 93 Fachkarten, vollständiger Sek-I-Mappe und aktueller Quernavigation. Das Begleitheft ist horizontübergreifend verfügbar.
- Texte der bestätigten Materialien im Arbeitsbereich, freiwillige digitale Notizen, Kopierhilfen, unabhängiger Export, Wiederaufnahme und Druckansichten.
- IUDICIUM-ähnliche lokale Coach-Redaktion mit Passwortabfrage, zehn Profilplätzen und Profil-Export. Das ist ein lokaler Redaktionsmodus, kein echter GitHub-Pages-Zugriffsschutz.
- Beschilderung Final 03 mit acht Türschildern und beiden Raumplänen. Alte Beschilderung nicht enthalten.
- Bestehende handgezeichnete Motive auf Startseite und Bereichs-/Funktionsansichten. Originalbilder unverändert, nur als Ausschnitt im Layout angezeigt. App-Stil bleibt wie bestätigt.

## Inhaltspflege
`dist/inhalte/` enthält getrennte Dateien für Unterricht, Lernen, Prüfen, Schulentwicklung, Selbstlernen und Organisation. `organisation.js` ist die gemeinsame Stelle für Räume, Zeiten und Coach-Profile. Keine Platzhalterpersonen oder erfundenen Raum-/Zeitdaten.

`dist/js/` trennt persönliche Speicherung, Feldanzeige, wiederverwendbare Arbeitsweg-Darstellung, Navigation und die einzelnen Hauptansichten. `style.css` enthält die Gestaltung. `assets/material/` enthält die hinterlegten Originalmaterialien.

Klassische Skriptdateien statt dynamischer Netzwerkabfragen erlauben die lokale Nutzung ohne Installation. Inhalte sind fachlich getrennt, auch wenn die App im Browser zwischen Ansichten wechselt.

## Papier und App
Niemand muss doppelt dokumentieren. Arbeitsimpulse können am Papiermaterial bearbeitet werden oder in den freiwilligen Notizfeldern. Die App übernimmt weder die eigentliche Unterrichtsdatei noch eine Fallakte. Die PDFs bleiben als verbindliche Gestaltung und Druckreferenz erreichbar. Aus PDFs übernommene Lesetexte ersetzen nicht die grafische Bedeutung von Tabellen und Ankreuzfeldern im Original.

Persönliche Rückmeldung: digital ausfüllen und separat drucken; Abgabe freiwillig. Vier leere A6-Karten auf A4 bleiben als Druckvorlage verfügbar. Längere digitale Texte können beim Druck mehrere Seiten benötigen.

## Lernen und Begleitung
Die Teilnehmer-App enthält keine Aufdeckung, beide A/B-Varianten oder Geheimtests. Der separate Begleitordner wird NICHT mit der Teilnehmer-App veröffentlicht oder verteilt. Einzelne Materialtexte werden vom Coach passend zum Ablauf übergeben und im jeweiligen Arbeitsweg geöffnet. ICH DENKE wird mit den Originalmaterialien durch den Coach begleitet.

Der konkrete digitale Übergabekanal ist noch offen. Die getrennten Materialdateien sind ein prüfbarer Vorschlag, kein bereits erprobtes Dienst-iPad-Verfahren. Analoge Ausgabe bleibt möglich.

## Persönliche Speicherung
Version 2 sammelt Notizen aus allen Bereichen. Ältere Version-1-Dateien des Musters werden übernommen. Browserdaten werden nur als Zwischensicherung genutzt; Arbeitsdateien können unabhängig heruntergeladen und später importiert werden. Ein Import ersetzt den aktuellen Gesamtstand erst nach Vorschau und Bestätigung. Erhaltene Lernmaterialtexte und zugehörige Notizen bleiben im Export enthalten. Eigene Unterrichtsdateien und PDF-Materialien werden nicht eingebettet.

Keine automatische gemeinsame Abgabe, Konten, Datenbank, KI-Übertragung oder Veröffentlichung. Ein Galerie-Padlet ist weiterhin optional und nicht eingerichtet.

Der lokale Coach-Modus wird über die Coach-Übersicht geöffnet. Startpasswort der Arbeitsfassung: `Windstaerke10`. Profile werden auf dem jeweiligen Gerät gespeichert und als JSON heruntergeladen; für die Veröffentlichung auf GitHub müssen sie anschließend in den Organisationsbestand übernommen werden.

## Prüfstand
Bestanden: Syntax aller 19 Skriptdateien, 22 Ansichten, lokale Material-/Bildverknüpfungen, Schema- und Größenprüfungen, Übernahme von Version 1, bereichsübergreifende Notizen, Export-Auslösung, Importvorschau/Übernahme, Materialimport, Fehlerfälle, sichere Textausgabe, unbekannte Routen und Trennung des Organisationsbestands. Tests erfolgten in isolierter JavaScript-Umgebung.

Offen: Browser-Sichtprüfung, responsive Darstellung, Zwischenablage/Downloads/Dateiauswahl im echten Browser, Druck mit langen Eingaben, Tastatur-/Touch-Bedienung, Dienst-iPad und praktischer Coach-Ablauf. Die bereits festgestellten Ausführungs- und Browserbeschränkungen bestehen als Prüfgrenze; sie wurden nicht umgangen. WebMCP ist logisch geprüft, nicht im unterstützten Browserkontext.

Status: Modular umgesetzt, Inhalte eingebunden und technisch teilgeprüft; Bilder aus Originalmaterialien zugeordnet. Noch keine uneingeschränkte digitale Einsatzfreigabe. Coach-Profile und konkrete Räume/Zeiten bleiben offen. Vollständige App-/iPad-Prüfung ist der nächste Schritt.
