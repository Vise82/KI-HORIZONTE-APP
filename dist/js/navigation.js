const routes = {
  start,
  unterricht: work,
  speicher: storage,
  orientierung: orientation,
  coaches,
  lernen: learning,
  pruefen: examining,
  schulentwicklung: school,
  notizen: notesView,
  'karte-drucken': cardPrint,
  ueber: about
};

for (const id of Object.keys(MODULES)) {
  routes[id] = () => moduleView(id);
}

function viewContext(route) {
  if (route === 'start' || route === 'orientierung') return '';

  const parent = route.startsWith('pruefen-')
    ? ['pruefen', 'Prüfen']
    : route.startsWith('lernen-')
      ? ['lernen', 'Lernen']
      : ['momentaufnahme', 'zukunftsatelier', 'logbuch', 'coach-reflexion'].includes(route)
        ? ['schulentwicklung', 'Schulentwicklung']
        : null;
  const labels = {
    unterricht: 'Unterricht', lernen: 'Lernen', pruefen: 'Prüfen',
    schulentwicklung: 'Schulentwicklung', selbstlernen: 'Selbstlernen',
    coaches: 'Coaches', speicher: 'Mein Arbeitsstand', notizen: 'Meine Notizen',
    orientierung: 'Tagesplan & Räume', ueber: 'Über diese App',
    'coach-feedback': 'Rückmeldung an die Coaches', 'coach-reflexion': 'Coach-Reflexion'
  };
  const title = MODULES[route]?.title || labels[route] || 'Bereich';
  return `<nav class="view-context" aria-label="Seitenpfad"><a href="#start">Alle Horizonte</a>${parent ? `<span aria-hidden="true">›</span><a href="#${parent[0]}">${parent[1]}</a>` : ''}<span aria-current="page">${esc(title)}</span></nav>`;
}

function render() {
  const route = location.hash.slice(1) || 'orientierung';
  const currentRoute = Object.hasOwn(routes, route) ? route : 'start';
  $('#main').innerHTML = viewContext(currentRoute) + routes[currentRoute]();

  const primaryRoute = currentRoute === 'orientierung' || currentRoute === 'karte-drucken' ? 'orientierung'
    : ['coaches', 'coach-feedback', 'coach-reflexion'].includes(currentRoute) ? 'coaches'
      : ['speicher', 'notizen'].includes(currentRoute) ? 'speicher'
        : currentRoute === 'ueber' ? '' : 'start';
  document.querySelectorAll('header nav a').forEach(a => {
    a.removeAttribute('aria-current');
    if (primaryRoute && a.hash === '#' + primaryRoute) a.setAttribute('aria-current', 'page');
  });

  document.title = 'KI HORIZONTE · ' + (
    MODULES[route]?.title ||
    { unterricht: 'Mein Vorhaben', speicher: 'Mein Arbeitsstand', orientierung: 'Der Tag', coaches: 'Coaches', pruefen: 'Prüfen', lernen: 'Lernen', schulentwicklung: 'Schulentwicklung', ueber: 'Über diese App' }[currentRoute] ||
    'Horizonte'
  );

  document.body.classList.toggle('card-print', route === 'karte-drucken');
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => {
  render();
  $('#main')?.focus();
});

document.addEventListener('input', e => {
  const target = e.target;
  const k = target.dataset.field;
  const m = target.dataset.materialNote;

  if (Object.hasOwn(fields, k)) {
    state.fields[k] = target.value;
    save();
  } else if (m && state.materials.some(v => v.id === m)) {
    state.materialNotes[m] = target.value;
    save();
  } else {
    return;
  }

  const out = target.nextElementSibling;
  if (out?.classList.contains('print-only')) out.textContent = target.value;
  const noteLabel = target.closest('.note-field')?.querySelector('[data-note-label]');
  if (noteLabel) noteLabel.textContent = (target.value.trim() ? 'Notiz · ' : 'Notiz hinzufügen · ') + noteLabel.dataset.noteLabel;
});

async function copyElement(el, text) {
  try {
    await navigator.clipboard.writeText(text);
    notify('Text kopiert.');
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
    notify('Bitte den markierten Text über das Kopiermenü kopieren.');
  }
}

document.addEventListener('click', async e => {
  const step = e.target.closest('[data-step]');
  if (step) {
    e.preventDefault();
    document.getElementById(step.dataset.step).scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const cp = e.target.closest('[data-copy]');
  if (cp) {
    await copyElement($('#prompt' + cp.dataset.copy), prompts[Number(cp.dataset.copy)]);
    return;
  }

  const ce = e.target.closest('[data-copy-element]');
  if (ce) {
    const el = document.getElementById(ce.dataset.copyElement);
    await copyElement(el, el.textContent);
    return;
  }

  const act = e.target.closest('[data-action]')?.dataset.action;
  if (act === 'export') exportFile();
  if (act === 'text') exportText();
  if (act === 'print-current') window.print();
  if (act === 'print-card') location.hash = 'karte-drucken';

  if (act === 'coach-admin') {
    const password = window.prompt('Passwort für die Coach-Redaktion eingeben:');
    const normalizedPassword = typeof password === 'string' ? password.normalize('NFKC').trim() : '';
    if (normalizedPassword === 'Windstaerke10') {
      window.__coachEditorOpen = true;
      render();
      notify('Coach-Redaktion geöffnet.');
    } else {
      notify('Passwort falsch.');
    }
  }

  if (act === 'coach-admin-close') {
    window.__coachEditorOpen = false;
    render();
  }

  if (act === 'coach-export') {
    const payload = { coaches: loadCoachProfiles() };
    download('KI_HORIZONTE_Coach_Profiles.json', JSON.stringify(payload, null, 2), 'application/json');
    notify('Coach-Profile als JSON heruntergeladen.');
  }

  if (act === 'coach-save') {
    const entries = [];
    document.querySelectorAll('[data-coach-field]').forEach(el => {
      const index = Number(el.dataset.coachIndex);
      if (!entries[index]) entries[index] = {};
      entries[index][el.dataset.coachField] = el.value.trim();
    });
    saveCoachProfiles(entries);
    render();
    notify('Coach-Profile gespeichert.');
  }
});

document.addEventListener('change', async e => {
  if (e.target.id === 'coach-import') {
    try {
      const f = e.target.files[0];
      if (!f) return;
      const parsed = JSON.parse(await f.text());
      const profiles = saveCoachProfiles(normalizeCoachProfiles(parsed));
      window.__coachEditorOpen = true;
      render();
      notify('Coach-Profile aus JSON übernommen. ' + profiles.filter(c => c.name || c.profile || c.location || c.availability || c.image).length + ' Einträge aktiviert.');
    } catch (err) {
      notify(err instanceof SyntaxError ? 'Die Profil-Datei konnte nicht gelesen werden. Bitte eine gültige JSON-Datei wählen.' : err.message);
      e.target.value = '';
    }
    return;
  }

  if (e.target.id !== 'import') return;
  const f = e.target.files[0];
  if (!f) return;

  try {
    if (f.size > 4000000) throw Error('Diese Datei ist zu groß. Bitte eine passende Arbeits- oder Materialdatei auswählen.');
    const raw = JSON.parse(await f.text());
    const candidate = validate(raw);
    const preview = $('#import-preview');
    preview.innerHTML = `<div class="subtle"><h3>${esc(candidate.fields.titel || 'Arbeitsstand aus den Horizonten')}</h3><p>Beim Übernehmen wird der aktuelle Arbeitsstand auf diesem Gerät ersetzt. Lade ihn vorher herunter, wenn du ihn behalten möchtest.</p><div class="actions"><button id="apply-import">Diesen Arbeitsstand übernehmen</button><button class="secondary" data-action="export">Aktuellen Stand herunterladen</button><button class="secondary" id="cancel-import">Abbrechen</button></div></div>`;
    $('#apply-import').onclick = () => {
      state = candidate;
      save();
      render();
      notify('Arbeitsdatei übernommen. Du kannst weiterarbeiten.');
    };
    $('#cancel-import').onclick = () => {
      preview.innerHTML = '';
      e.target.value = '';
    };
  } catch (err) {
    notify(err instanceof SyntaxError ? 'Die Datei konnte nicht gelesen werden. Bitte eine unveränderte Arbeitsdatei auswählen.' : err.message);
    e.target.value = '';
  }
});

window.addEventListener('beforeunload', e => {
  if (hasNotes() && !localOK && lastExport !== state.updatedAt) {
    e.preventDefault();
    e.returnValue = '';
  }
});

if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'navigate_horizonte',
      description: 'Öffnet einen vorhandenen Bereich der App, ohne Notizen zu ändern.',
      inputSchema: {
        type: 'object',
        properties: { view: { type: 'string', enum: Object.keys(routes) } },
        required: ['view'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false },
      execute: ({ view }) => {
        if (!Object.hasOwn(routes, view)) throw Error('Unbekannter Bereich');
        location.hash = view;
        render();
        return { view };
      }
    })).catch(() => {});
  } catch {}
}

render();
