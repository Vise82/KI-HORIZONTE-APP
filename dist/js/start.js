function start(){
  return `<div class="intro"><img class="landscape" src="assets/horizont.png" alt=""><div class="eyebrow">Dein Arbeitsraum</div><h1>Welchen Horizont möchtest du öffnen?</h1><p>Wähle, was dich heute beschäftigt. Du kannst bleiben, vertiefen oder den Bereich wechseln.</p></div>
    <div class="grid">
      <article class="horizon"><div class="room">A2 · Ideenwerft</div>${visual('werkzeug',true)}<h2>Unterricht</h2><p>Ein eigenes Material untersuchen, mit KI verändern und die Verbesserung kritisch prüfen.</p><a class="button" href="#unterricht">An meinem Vorhaben arbeiten</a></article>
      <article class="horizon blue"><div class="room">A1 · Entdeckerraum & A3 · Denkexpedition</div>${visual('bauen',true)}<h2>Lernen</h2><p>Mit KI lernen und selbst denken: verstehen, verbessern und üben.</p><a href="#lernen">Lernen erkunden</a></article>
      <article class="horizon sand"><div class="room">B1 · Weitblick & B2 · Perspektivwechsel</div>${visual('produkt',true)}<h2>Prüfen</h2><p>Können sichtbar machen, Leistungsnachweise gestalten und mit Verdachtsfällen umgehen.</p><a href="#pruefen">Arbeitsweg wählen</a></article>
      <article class="horizon rose"><div class="room">C · Zukunftsatelier</div>${visual('dialog',true)}<h2>Schulentwicklung</h2><p>Erfahrungen mitnehmen und freiwillig Gedanken für unsere gemeinsame Weiterarbeit abgeben.</p><a href="#schulentwicklung">Zum Zukunftsatelier</a></article>
    </div>
    <div class="subtle"><h3>Dein Freiraum</h3><p>Du möchtest Grundlagen erkunden oder deinem eigenen Interesse folgen? Suche dir einen freien Arbeitsplatz. Das gedruckte Begleitheft steht dir in jedem Horizont zur Verfügung.</p><a href="#selbstlernen">Zum Selbstlernen</a></div>
    <div class="subtle"><h3>Deine persönliche Rückmeldung</h3><p>Ein Gedanke reicht. Du entscheidest, ob du deine Rückmeldekarte ausfüllst und abgibst.</p><a class="button" href="#rueckmeldung">Rückmeldekarte ausfüllen</a><p class="meta section-title"><a href="assets/rueckmeldekarten.pdf" target="_blank" rel="noopener">Vier A6-Karten auf A4 drucken</a></p></div>
    ${hasNotes()?`<div class="actions"><a class="button secondary" href="#speicher">Mein Vorhaben wieder aufnehmen</a></div>`:''}`;
}
