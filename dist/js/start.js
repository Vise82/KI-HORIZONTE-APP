function start(){
  return `<div class="intro"><img class="landscape" src="assets/horizont.png" alt=""><div class="eyebrow">Dein Arbeitsraum</div><h1>Welchen Horizont möchtest du öffnen?</h1><p>Wähle, was dich heute beschäftigt. Du kannst bleiben, vertiefen oder den Bereich wechseln.</p></div>
    <div class="grid start-horizons">
      <a class="horizon horizon-link" href="#lernen"><div class="room">A1 · Entdeckerraum & A3 · Denkexpedition</div>${visual('bauen',true)}<h2>Lernen</h2><p>Ich möchte mit KI lernen und dabei selbst denken: verstehen, verbessern und üben.</p><span class="tile-action">Lernen erkunden</span></a>
      <a class="horizon horizon-link blue" href="#unterricht"><div class="room">A2 · Ideenwerft</div>${visual('werkzeug',true)}<h2>Unterricht</h2><p>Ich möchte eigenes Unterrichtsmaterial weiterentwickeln und die Verbesserung kritisch prüfen.</p><span class="tile-action">An meinem Vorhaben arbeiten</span></a>
      <a class="horizon horizon-link sand" href="#pruefen"><div class="room">B1 · Weitblick & B2 · Perspektivwechsel</div>${visual('produkt',true)}<h2>Prüfen</h2><p>Ich möchte zeigen, was Lernende können, Aufgaben gestalten oder einen Verdachtsfall durchdenken.</p><span class="tile-action">Arbeitsweg wählen</span></a>
      <a class="horizon horizon-link rose" href="#schulentwicklung"><div class="room">C · Zukunftsatelier</div>${visual('dialog',true)}<h2>Schulentwicklung</h2><p>Ich möchte Erfahrungen teilen und freiwillig Gedanken für die gemeinsame Weiterarbeit festhalten.</p><span class="tile-action">Zum Zukunftsatelier</span></a>
      <a class="horizon horizon-link" href="#selbstlernen"><div class="room">Freier Arbeitsplatz</div>${visual('karte',true)}<h2>Selbstlernen</h2><p>Ich möchte Grundlagen erkunden oder meinem eigenen Interesse folgen.</p><span class="tile-action">Selbstlernen starten</span></a>
    </div>
    ${hasNotes()?`<div class="actions"><a class="button secondary" href="#speicher">Mein Vorhaben wieder aufnehmen</a></div>`:''}`;
}
