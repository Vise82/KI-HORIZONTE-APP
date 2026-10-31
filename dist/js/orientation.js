function orientation(){
	const horizons=[
		{id:'lernen',title:'Lernen',areas:['LERNEN'],tone:'',description:'Mit KI lernen und selbst denken: verstehen, verbessern und üben.'},
		{id:'unterricht',title:'Unterricht',areas:['UNTERRICHT'],tone:'blue',description:'Ein eigenes Material untersuchen, mit KI verändern und die Verbesserung kritisch prüfen.'},
		{id:'pruefen',title:'Prüfen',areas:['PRÜFEN'],tone:'sand',description:'Können sichtbar machen, Leistungsnachweise gestalten und Verdachtsfälle bearbeiten.'},
		{id:'schulentwicklung',title:'Schulentwicklung',areas:['SCHULENTWICKLUNG'],tone:'rose',description:'Erfahrungen mitnehmen und freiwillig Gedanken für die gemeinsame Weiterarbeit festhalten.'},
		{id:'selbstlernen',title:'Freiraum',areas:['Funktionsraum'],tone:'blue',description:'Grundlagen erkunden oder dem eigenen Interesse folgen.'}
	];
	const phaseTones=['blue','','sand','','rose','',''];
	return `<div class="screen-heading">${visual('karte')}<div><div class="eyebrow">Orientierung</div><h1>Unser Tag – mit Raum für deinen Weg</h1><p>Uhrzeiten und reale Raumnummern ergänzen wir später oder geben sie am Tag bekannt.</p></div></div>
		<details class="orientation-panel horizon" name="orientation-panels">
			<summary><span class="room">5 Arbeitsbereiche</span><h2>Welchen Horizont möchtest du öffnen?</h2></summary>
			<div class="orientation-panel-content"><div class="grid">${horizons.map(horizon=>{const rooms=ORGANISATION.rooms.filter(room=>horizon.title==='Freiraum'?room[1]==='Selbstlernen':horizon.areas.includes(room[2].split(' · ')[0]));const labels=rooms.map(room=>[room[0],room[1]].filter(Boolean).join(' · '));return `<details class="horizon horizon-choice${horizon.tone?' '+horizon.tone:''}" name="horizon-choices"><summary><div class="room">${esc(labels.join(' & ')||'Selbstlernen')}</div><h3>${esc(horizon.title)}</h3></summary><p>${esc(horizon.description)}</p><a class="button" href="#${horizon.id}">${horizon.title==='Freiraum'?'Freiraum öffnen':'Arbeitsbereich öffnen'}</a></details>`}).join('')}</div></div>
		</details>
		<details class="orientation-panel horizon" name="orientation-panels">
			<summary><span class="room">${ORGANISATION.phases.length} Phasen</span><h2>Tagesablauf ansehen</h2></summary>
			<div class="orientation-panel-content"><div class="grid">${ORGANISATION.phases.map((phase,index)=>`<article class="horizon phase-tile${phaseTones[index]?' '+phaseTones[index]:''}"><div class="room">Phase ${index+1}${phase.time?' · '+esc(phase.time):''}</div><h3>${esc(phase.title)}</h3></article>`).join('')}</div><p>Pausen nimmst du nach Bedarf. Deinen Arbeitsstand kannst du während der Arbeit sichern.</p></div>
		</details>
		<details class="orientation-panel horizon" name="orientation-panels">
			<summary><span class="room">Begleitung · Rückmeldung</span><h2>Weitere Hinweise</h2></summary>
			<div class="orientation-panel-content"><p>Im Entdeckerraum beginnt LERNEN begleitet. Wenn du später einsteigst, hilft dir ein Coach beim Anschluss.</p><div class="subtle"><h3>Später in einen Bereich einsteigen?</h3><p>Bei einem begleiteten Einstieg sprich bitte zuerst einen Coach an. Er oder sie begleitet deinen individuellen Einstieg; danach kannst du selbstständig weiterarbeiten.</p><a href="#coaches">Zur Coach-Übersicht</a></div><div class="subtle"><h3>Deine persönliche Rückmeldung</h3><p>Ein Gedanke reicht. Du entscheidest, ob du deine Rückmeldekarte ausfüllst und abgibst.</p><a class="button" href="#rueckmeldung">Rückmeldekarte ausfüllen</a><p class="meta section-title"><a href="assets/rueckmeldekarten.pdf" target="_blank" rel="noopener">Vier A6-Karten auf A4 drucken</a></p></div><div class="subtle"><h3>Und du hast noch einen Gedanken?</h3><p>Ein Aha, ein „Och nö“ oder eine Idee fürs nächste Mal. Freiwillig, gerne anonym.</p><a class="button" href="#coach-feedback">Gedanken festhalten</a></div></div>
		</details>`;
}
