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
      "title": "Weiterarbeiten & Fertigstellen · parallel Schulentwicklung",
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
  "coaches": Array.from({ length: 10 }, () => ({
    "name": "",
    "profile": "",
    "location": "",
    "availability": "",
    "image": ""
  }))
};

const COACH_STORAGE_KEY = 'ki-horizonte-coach-profiles-v1';

function normalizeCoachProfiles(value) {
  const source = Array.isArray(value) ? value : (Array.isArray(value?.coaches) ? value.coaches : []);
  const defaults = Array.from({ length: 10 }, () => ({
    "name": "",
    "profile": "",
    "location": "",
    "availability": "",
    "image": ""
  }));
  return defaults.map((slot, index) => {
    const current = source[index] || {};
    return {
      "name": String(current.name || '').slice(0, 80),
      "profile": String(current.profile || '').slice(0, 240),
      "location": String(current.location || '').slice(0, 120),
      "availability": String(current.availability || '').slice(0, 120),
      "image": String(current.image || '').slice(0, 500)
    };
  });
}

function loadCoachProfiles() {
  try {
    const raw = localStorage.getItem(COACH_STORAGE_KEY);
    if (!raw) return normalizeCoachProfiles(ORGANISATION.coaches);
    return normalizeCoachProfiles(JSON.parse(raw));
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
