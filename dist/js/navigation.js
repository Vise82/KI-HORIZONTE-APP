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
  'karte-drucken': cardPrint
};

for (const id of Object.keys(MODULES)) {
  routes[id] = () => moduleView(id);
}

function render() {
  const route = location.hash.slice(1) || 'orientierung';
  $('#main').innerHTML = Object.hasOwn(routes, route) ? routes[route]() : start();

  document.querySelectorAll('nav a').forEach(a => {
    a.removeAttribute('aria-current');
    if (a.hash === '#' + route) a.setAttribute('aria-current', 'page');
  });

  document.title = 'KI HORIZONTE · ' + (
    MODULES[route]?.title ||
    { unterricht: 'Mein Vorhaben', speicher: 'Mein Arbeitsstand', orientierung: 'Der Tag', coaches: 'Coaches' }[route] ||
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
    if (password === 'Windstaerke10') {
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

  if (!['import', 'material-import'].includes(e.target.id)) return;

  const material = e.target.id === 'material-import';
  const f = e.target.files[0];
  if (!f) return;

  try {
    if (f.size > 4000000) throw Error('Diese Datei ist zu groß. Bitte eine passende Arbeits- oder Materialdatei auswählen.');
    const raw = JSON.parse(await f.text());

    if (material) {
      const m = validateMaterial(raw);
      const preview = $('#material-preview');
      if (m.module !== location.hash.slice(1)) throw Error('Diese Materialdatei gehört zu einem anderen Arbeitsweg. Bitte öffne zuerst ' + MODULES[m.module].title + '.');
      preview.innerHTML = `<div class="subtle"><h3>${esc(m.title)}</h3><p>Öffne das Material erst, wenn es im Ablauf an der Reihe ist. Vorhandene persönliche Notizen bleiben erhalten.</p><button id="apply-material">Erhaltenes Material öffnen</button></div>`;
      $('#apply-material').onclick = () => {
        state.materials = state.materials.filter(x => x.id !== m.id);
        state.materials.push(m);
        state.materialNotes[m.id] ??= '';
        save();
        render();
        notify('Material geöffnet. Deine bisherigen Notizen bleiben erhalten.');
      };
      return;
    }

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
    notify(err instanceof SyntaxError ? 'Die Datei konnte nicht gelesen werden. Bitte eine unveränderte Arbeits- oder Materialdatei auswählen.' : err.message);
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
