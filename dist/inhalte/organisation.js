const ORGANISATION = {
  "rooms": [
    [
      "A1",
      "Entdeckerraum",
      "LERNEN · gemeinsamer Einstieg",
      ""
    ],
    [
      "A3",
      "Denkexpedition",
      "LERNEN",
      ""
    ],
    [
      "A2",
      "Ideenwerft",
      "UNTERRICHT",
      ""
    ],
    [
      "B1",
      "Weitblick",
      "PRÜFEN",
      ""
    ],
    [
      "B2",
      "Perspektivwechsel",
      "PRÜFEN",
      ""
    ],
    [
      "C",
      "Zukunftsatelier",
      "SCHULENTWICKLUNG",
      ""
    ],
    [
      "",
      "Selbstlernen",
      "Funktionsraum",
      ""
    ],
    [
      "",
      "Organisationsteam",
      "Funktionsraum",
      ""
    ]
  ],
  "phases": [
    {
      "title": "Ankommen & gemeinsames Frühstück",
      "time": ""
    },
    {
      "title": "Gemeinsamer Auftakt",
      "time": ""
    },
    {
      "title": "Offene Horizontzeit",
      "time": ""
    },
    {
      "title": "Gemeinsames Mittagessen",
      "time": ""
    },
    {
      "title": "Weiterarbeiten & Fertigstellen · parallel Schulentwicklung · Coachzeit",
      "time": ""
    },
    {
      "title": "KI-HORIZONTE-Marktplatz",
      "time": ""
    },
    {
      "title": "Gemeinsamer Abschluss",
      "time": ""
    }
  ],
  "coaches": [
    {
      "name": "V. Sell",
      "horizon": "Organisation",
      "profile": "Madame Prompt… pardon?!\n\n„Eine Unterrichtsidee hätte gereicht.\nDie Bildungsrevolution machen wir nach der Pause.“\n\nMeine Rolle:\nFür alle Horizonte zuständig. Für den Durchblick auch.",
      "location": "Überall und nirgendwo – ich wusele wahrscheinlich gerade irgendwo herum.",
      "availability": "",
      "image": "assets/02_Rundes_Portraet_V. Sell.png"
    },
    {
      "name": "A. Kubik",
      "horizon": "Unterricht",
      "profile": "Meine Rolle:\nIch unterstütze und begleite Euch beim Einsatz von KI zur Entwicklung und Gestaltung von Unterrichtsmaterialien. Gemeinsam entdecken wir Möglichkeiten, wie KI Euch bei der Unterrichtsvorbereitung kreativ, effizient und praxisnah unterstützen kann. Das alles ist angesiedelt im Horizont Unterricht.",
      "location": "Coachraum",
      "availability": "",
      "image": "assets/kubik.png"
    },
    {
      "name": "Y. Wegmann-Ost",
      "horizon": "LERNEN · ICH DENKE",
      "profile": "Ich tüftle gern an Aufgaben, mit denen die Schüler auf unterschiedlichen Lernständen selbstständig loslegen können. Besonders mag ich klare Arbeitsaufträge, bei denen die erste Frage möglichst selten „Was sollen wir machen?“ lautet. Wenn ich KI einsetze, frage ich mich: Wer denkt hier eigentlich gerade mehr nach? Sprecht mich gern mit einer halbfertigen Idee an. Ich tüftle gern mit euch daran, bis sie zu eurer Klasse passt.",
      "location": "Coachraum",
      "availability": "",
      "image": "assets/Y. Wegmann-Ost.jpg"
    },
    ...Array.from({ length: 8 }, () => ({
      "name": "",
      "profile": "",
      "location": "",
      "availability": "",
      "image": "",
      "horizon": ""
    }))
  ]
};

const COACH_STORAGE_KEY = 'ki-horizonte-coach-profiles-v1';
const COACH_WEGMANN_MIGRATION_KEY = `${COACH_STORAGE_KEY}-y-wegmann-v2`;

function normalizeCoachProfiles(value) {
  const source = Array.isArray(value) ? value : (Array.isArray(value?.coaches) ? value.coaches : []);
  const defaults = Array.from({ length: 10 }, () => ({
    "name": "",
    "profile": "",
    "location": "",
    "availability": "",
    "image": "",
    "horizon": ""
  }));
  return defaults.map((slot, index) => {
    const current = source[index] || {};
    const defaultHorizon = current.horizon ?? (current.name && current.name === ORGANISATION.coaches[index]?.name ? ORGANISATION.coaches[index].horizon : '');
    return {
      "name": String(current.name || '').slice(0, 80),
      "profile": String(current.profile || '').slice(0, 500),
      "location": String(current.location || '').slice(0, 120),
      "availability": String(current.availability || '').slice(0, 120),
      "image": String(current.image || '').slice(0, 500),
      "horizon": String(defaultHorizon).trim().slice(0, 40)
    };
  });
}

function loadCoachProfiles() {
  try {
    const raw = localStorage.getItem(COACH_STORAGE_KEY);
    const defaults = normalizeCoachProfiles(ORGANISATION.coaches);
    if (!raw) {
      localStorage.setItem(COACH_WEGMANN_MIGRATION_KEY, '1');
      return defaults;
    }
    const profiles = normalizeCoachProfiles(JSON.parse(raw));
    if (localStorage.getItem(COACH_WEGMANN_MIGRATION_KEY) !== '1') {
      const newCoach = defaults.find(coach => coach.name === 'Y. Wegmann-Ost');
      const savedCoach = profiles.find(coach => coach.name === newCoach?.name);
      const emptyIndex = profiles.findIndex(coach => !coach.name && !coach.profile && !coach.location && !coach.availability && !coach.image && !coach.horizon);
      if (newCoach && savedCoach && !savedCoach.location) savedCoach.location = newCoach.location;
      else if (newCoach && !savedCoach && emptyIndex >= 0) profiles[emptyIndex] = newCoach;
      localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify({ coaches: profiles }));
      localStorage.setItem(COACH_WEGMANN_MIGRATION_KEY, '1');
    }
    return profiles;
  } catch {
    return normalizeCoachProfiles(ORGANISATION.coaches);
  }
}

function saveCoachProfiles(profiles) {
  const normalized = normalizeCoachProfiles(profiles);
  ORGANISATION.coaches = normalized;
  localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify({ coaches: normalized }));
  return normalized;
}
