function coachProfileMarkup(profile){
  const parts = String(profile || '').split(/\n\n+/).map(part => part.trim()).filter(Boolean);
  if (parts.length < 3) return `<p>${esc(profile || 'Weitere Informationen ergänzen.')}</p>`;
  const role = parts.slice(2).join('\n\n').replace(/^Meine Rolle:\s*/, '');
  return `<p class="coach-caption">${esc(parts[0])}</p><blockquote>${esc(parts[1])}</blockquote><p class="coach-role"><strong>Meine Rolle</strong><br>${esc(role)}</p>`;
}

function coachLocationMarkup(coach){
  const location = esc(coach.location || 'Standort noch offen');
  return coach.name ? `<p class="coach-location"><strong>Hier findet ihr mich</strong><br>${location}</p>` : `<p>${location}</p>`;
}

function coachNavigationMarkup(){
  const groups = [
    { label: 'Veranstaltung', links: [['orientierung', 'Tagesplan & Räume'], ['start', 'Alle Horizonte']] },
    { label: 'Arbeitswege', links: [
      ['unterricht', 'Unterricht · Ideenwerft'],
      ['lernen', 'Lernen · Einstieg'],
      ['lernen-verstehen', 'Lernen · Verstehen'],
      ['lernen-verbessern', 'Lernen · Verbessern'],
      ['lernen-ueben', 'Lernen · Üben'],
      ['pruefen', 'Prüfen · Übersicht'],
      ['pruefen-a', 'Prüfen · A Verstehen'],
      ['pruefen-b', 'Prüfen · B Gestalten'],
      ['pruefen-c', 'Prüfen · C Handeln'],
      ['schulentwicklung', 'Schulentwicklung · Übersicht'],
      ['momentaufnahme', 'Schulentwicklung · Momentaufnahme'],
      ['zukunftsatelier', 'Schulentwicklung · Zukunftsatelier'],
      ['logbuch', 'Schulentwicklung · Logbuch'],
      ['selbstlernen', 'Selbstlernen']
    ]},
    { label: 'Begleitung', links: [['coach-reflexion', 'Coach-Rückmeldung'], ['speicher', 'Arbeitsstand']] }
  ];
  return `<section class="coach-navigation" aria-labelledby="coach-navigation-title"><div class="coach-navigation-heading"><div><div class="eyebrow">Schnellzugriff</div><h2 id="coach-navigation-title">Durch den Tag und alle Stränge</h2></div><a class="button secondary" href="#coaches">Coach-Bereich</a></div><p>Springt direkt in einen Raum, Arbeitsweg oder Reflexionspunkt. Der aktuelle Stand bleibt dabei erhalten.</p><div class="coach-navigation-groups">${groups.map(group => `<div><h3>${esc(group.label)}</h3><nav aria-label="${esc(group.label)}">${group.links.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}</nav></div>`).join('')}</div></section>`;
}

function coachGuidesMarkup(){
  const guides = [
    ['01_UNTERRICHT', 'UNTERRICHT', false],
    ['02_LERNEN_C01_ICH_DENKE', 'LERNEN · ICH DENKE', true],
    ['03_LERNEN_C02_VERSTEHEN', 'LERNEN · VERSTEHEN', false],
    ['04_LERNEN_C03_VERBESSERN', 'LERNEN · VERBESSERN', false],
    ['05_LERNEN_C04_UEBEN', 'LERNEN · ÜBEN', true],
    ['06_PRUEFEN_A_VERSTEHEN', 'PRÜFEN · A VERSTEHEN', false],
    ['07_PRUEFEN_B_GESTALTEN', 'PRÜFEN · B GESTALTEN', false],
    ['08_PRUEFEN_C_HANDELN', 'PRÜFEN · C HANDELN', false],
    ['09_SCHULENTWICKLUNG', 'SCHULENTWICKLUNG', false],
    ['10_SELBSTLERNEN', 'SELBSTLERNEN', false]
  ];
  return `<section class="coach-guides" aria-labelledby="coach-guides-title"><div class="eyebrow">Nur im geöffneten Coach-Bereich</div><h2 id="coach-guides-title">Anleitungen für die Durchführung</h2><p>Hier findest du die vollständigen Fassungen aus dem Ordner <strong>Coach - Materialien</strong>. Die PDF ist für die Durchführung und den Ausdruck gedacht; die Textfassung lässt sich schnell durchsuchen.</p><div class="coach-guide-list">${guides.map(([id, title, protectedContent]) => `<article class="coach-guide"><div><h3>${esc(title)}</h3>${protectedContent ? '<p class="coach-guide-warning">Enthält geschützte Aufdeckung bzw. Prüfschlüssel.</p>' : '<p class="coach-guide-meta">Durchführung, Coach-Rolle und Kurzcheck</p>'}</div><div class="actions"><a class="button secondary" href="coach-material/${id}.pdf" target="_blank" rel="noopener">PDF öffnen</a><a class="button secondary" href="coach-material/${id}.md" target="_blank" rel="noopener">Text öffnen</a></div></article>`).join('')}</div></section>`;
}

function coachVibeCodingMarkup(){
  return `<section class="subtle" aria-labelledby="coach-vibe-title"><div class="eyebrow">Nur im geöffneten Coach-Bereich</div><h2 id="coach-vibe-title">Vibe Coding statt Horizonte</h2><p>Statt selbst durch die Horizonte zu gehen, kannst du deine Zeit auch nutzen, um im Dialog mit einer KI etwas Eigenes zu bauen oder anzupassen – z. B. an dieser App weiterdenken, einen eigenen kleinen Baustein ausprobieren oder ein Material für deine Gruppe vorbereiten. Du beschreibst, was entstehen soll, prüfst den Vorschlag und entscheidest, was übernommen wird.</p><p class="meta">Mehr zur Entstehung dieser App und was Vibe Coding bedeutet: <a href="#ueber">Über diese App</a>.</p><div class="coach-guide-list"><article class="coach-guide"><div><h3>Arbeitsbuch für die Kollegen</h3><p class="coach-guide-meta">Einstieg in Vibe Coding: Grundidee, Chancen und Grenzen für den Kollegenkreis</p></div><div class="actions"><a class="button secondary" href="coach-material/11_VIBE_CODING_ARBEITSBUCH.pdf" target="_blank" rel="noopener">PDF öffnen</a></div></article><article class="coach-guide"><div><h3>Technisches Handbuch</h3><p class="coach-guide-meta">Aufbau, Dateien und Funktionsweise dieser App im Detail</p></div><div class="actions"><a class="button secondary" href="coach-material/12_VIBE_CODING_TECHNISCHES_HANDBUCH.pdf" target="_blank" rel="noopener">PDF öffnen</a></div></article></div></section>`;
}

function coaches(){
  const profiles = loadCoachProfiles();
  const active = profiles.filter(c => c.name || c.profile || c.location || c.availability || c.image);
  const editorOpen = Boolean(window.__coachEditorOpen);
  const adminMarkup = !editorOpen ? `<div class="subtle"><h3>Coach-Redaktion</h3><p>Für die lokale Coach-Redaktion ist das Passwort erforderlich. Anschließend können Profilplätze angelegt, exportiert und wieder importiert werden.</p><div class="actions"><button data-action="coach-admin">Coach-Redaktion öffnen</button></div></div>` : `<div class="subtle"><h3>Coach-Redaktion</h3><div class="actions"><button data-action="coach-export">Profil-JSON herunterladen</button><label class="file-label">Profil-JSON importieren<input id="coach-import" type="file" accept=".json,application/json"></label><button class="secondary" data-action="coach-admin-close">Schließen</button></div><div class="coach-editor-grid">${profiles.map((c, index) => `<fieldset class="coach-editor-card"><legend>Coach ${index + 1}</legend><label>Name<input data-coach-index="${index}" data-coach-field="name" value="${esc(c.name)}" placeholder="Name"></label><label>Profil<textarea data-coach-index="${index}" data-coach-field="profile" rows="3" placeholder="Unterstützung, Schwerpunkt, Rolle">${esc(c.profile)}</textarea></label><label>Standort<input data-coach-index="${index}" data-coach-field="location" value="${esc(c.location)}" placeholder="Raum / Ort"></label><label>Verfügbarkeit<input data-coach-index="${index}" data-coach-field="availability" value="${esc(c.availability)}" placeholder="Zeiten / Erreichbarkeit"></label><label>Bild-URL<input data-coach-index="${index}" data-coach-field="image" value="${esc(c.image)}" placeholder="https://... oder lokale URL"></label></fieldset>`).join('')}</div><div class="actions"><button data-action="coach-save">Profile speichern</button></div></div>`;

  return `<div class="screen-heading">${visual('idee')}<div><div class="eyebrow">Unterstützung</div><h1>Ein kurzer Austausch kann weiterhelfen.</h1><p>Coaches begleiten Einstiege und unterstützen punktuell. Sie haben auch eigene Lernzeit.</p></div></div>${editorOpen ? coachNavigationMarkup() + coachVibeCodingMarkup() + coachGuidesMarkup() : ''}${active.length?`<div class="grid">${profiles.map(c=>`<article class="horizon"><div class="coach-identity">${c.image?`<img class="coach-image" src="${esc(c.image)}" alt="${esc(c.name||'Coach')}">`:''}<div><h2>${esc(c.name || 'Offener Coach-Platz')}</h2>${c.name?'<p class="coach-label">Coach</p>':''}</div></div>${coachProfileMarkup(c.profile)}${coachLocationMarkup(c)}${c.availability?`<p>${esc(c.availability)}</p>`:''}</article>`).join('')}</div>`:'<div class="empty"><h2>Die Coach-Profile werden noch ergänzt.</h2><p>Hier erscheinen Namen, Unterstützungsthemen und der vereinbarte Aufenthaltsort. Die Besetzung und Erreichbarkeit werden lokal gepflegt.</p></div>'}${adminMarkup}<div class="subtle"><h3>Für einen begleiteten Einstieg</h3><p>Sag einem zuständigen Coach kurz Bescheid, bevor du beginnst. Das ist besonders beim Einstieg „ICH DENKE“ in LERNEN wichtig: Die Materialien werden in der passenden Reihenfolge ausgegeben.</p></div>`;
}

window.__coachEditorOpen = Boolean(window.__coachEditorOpen);
