export default {
  editor: {
    label: "Urlaubsplaner",
  },
  properties: {
    // === DATEN-EIGENSCHAFTEN ===
    benutzer_liste: {
      label: 'Benutzerliste',
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        { id: 1, vorname: 'Max', nachname: 'Mustermann', email: 'max.mustermann@firma.de' },
        { id: 2, vorname: 'Anna', nachname: 'Schmidt', email: 'anna.schmidt@firma.de' },
        { id: 3, vorname: 'Peter', nachname: 'Mueller', email: 'peter.mueller@firma.de' }
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          if (item.vorname && item.nachname) {
            return `${item.vorname} ${item.nachname}`;
          }
          return item.email || `Benutzer ${item.id || 'Unbekannt'}`;
        },
        item: {
          type: 'Object',
          defaultValue: { id: 1, vorname: 'Max', nachname: 'Mustermann', email: 'benutzer@firma.de' },
          options: {
            item: {
              id: { label: 'ID', type: 'Text' },
              vorname: { label: 'Vorname (oder firstName)', type: 'Text' },
              nachname: { label: 'Nachname (oder lastName)', type: 'Text' },
              firstName: { label: 'First Name (EN)', type: 'Text' },
              lastName: { label: 'Last Name (EN)', type: 'Text' },
              email: { label: 'E-Mail', type: 'Text' },
              urlaube: {
                label: 'Urlaube (verschachtelt)',
                type: 'Array',
                bindable: true
              }
            }
          }
        }
      },
    },

    urlaubsdaten: {
      label: 'Urlaubsdaten (flach)',
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        {
          id: 1,
          benutzer_id: 1,
          startdatum: '2025-11-15',
          enddatum: '2025-11-22',
          typ: 'urlaub',
          status: 'genehmigt'
        },
        {
          id: 2,
          benutzer_id: 2,
          startdatum: '2025-11-10',
          enddatum: '2025-11-12',
          typ: 'krank',
          status: 'genehmigt'
        }
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return `${item.typ || 'Urlaub'}: ${item.startdatum || ''} - ${item.enddatum || ''}`;
        },
        item: {
          type: 'Object',
          defaultValue: {
            id: 1,
            benutzer_id: 1,
            startdatum: '2025-11-15',
            enddatum: '2025-11-22',
            typ: 'urlaub',
            status: 'ausstehend'
          },
          options: {
            item: {
              id: { label: 'Urlaub ID', type: 'Text' },
              benutzer_id: { label: 'Benutzer ID (oder user_id)', type: 'Text' },
              user_id: { label: 'User ID (EN)', type: 'Text' },
              startdatum: { label: 'Startdatum', type: 'Text' },
              enddatum: { label: 'Enddatum', type: 'Text' },
              typ: { label: 'Typ', type: 'Text' },
              status: { label: 'Status', type: 'Text' }
            }
          }
        }
      },
    },

    // === KALENDER-EINSTELLUNGEN ===
    kalender_startdatum: {
      label: 'Kalender Startdatum',
      type: 'Text',
      section: 'settings',
      defaultValue: '2025-11-01',
      bindable: true,
    },

    anzahl_monate: {
      label: 'Anzahl Monate',
      type: 'Number',
      section: 'settings',
      min: 1,
      max: 12,
      step: 1,
      defaultValue: 3,
      bindable: true,
    },

    navigation_anzeigen: {
      label: 'Navigation anzeigen',
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
    },

    wochenenden_anzeigen: {
      label: 'Wochenenden anzeigen',
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
    },

    sprache: {
      label: 'Sprache',
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'de-DE', label: 'Deutsch' },
          { value: 'en-US', label: 'English' },
          { value: 'fr-FR', label: 'Français' },
          { value: 'es-ES', label: 'Español' }
        ]
      },
      defaultValue: 'de-DE',
      bindable: true,
    },

    // === FARBEN ===
    genehmigte_urlaub_farbe: {
      label: 'Genehmigter Urlaub',
      type: 'Color',
      section: 'style',
      defaultValue: '#51cf66',
      bindable: true
    },

    ausstehende_urlaub_farbe: {
      label: 'Ausstehender Urlaub',
      type: 'Color',
      section: 'style',
      defaultValue: '#ffd43b',
      bindable: true
    },

    abgelehnte_urlaub_farbe: {
      label: 'Abgelehnter Urlaub',
      type: 'Color',
      section: 'style',
      defaultValue: '#ff6b6b',
      bindable: true
    },

    krankmeldung_farbe: {
      label: 'Krankmeldung',
      type: 'Color',
      section: 'style',
      defaultValue: '#ff8787',
      bindable: true
    },

    hintergrundfarbe: {
      label: 'Hintergrundfarbe',
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true
    },

    kopfzeile_hintergrundfarbe: {
      label: 'Kopfzeile Hintergrund',
      type: 'Color',
      section: 'style',
      defaultValue: '#f8f9fa',
      bindable: true
    },

    navigation_hintergrundfarbe: {
      label: 'Navigation Hintergrund',
      type: 'Color',
      section: 'style',
      defaultValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bindable: true
    },

    navigation_textfarbe: {
      label: 'Navigation Textfarbe',
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true
    },

    // === RAHMEN/RUNDUNGEN ===
    rahmen_radius: {
      label: 'Rahmen-Radius',
      type: 'Length',
      section: 'style',
      defaultValue: '4px',
      bindable: true
    },

    urlaubsbalken_rahmen_radius: {
      label: 'Urlaubsbalken Radius',
      type: 'Length',
      section: 'style',
      defaultValue: '4px',
      bindable: true
    },

    // === HEADER EIGENSCHAFTEN ===
    header_textfarbe: {
      label: 'Header Textfarbe',
      type: 'Color',
      section: 'style',
      defaultValue: '#333333',
      bindable: true
    },

    header_schriftgroesse: {
      label: 'Header Schriftgröße',
      type: 'Length',
      section: 'style',
      defaultValue: '14px',
      bindable: true
    },

    header_hoehe: {
      label: 'Header Höhe',
      type: 'Length',
      section: 'style',
      defaultValue: '60px',
      bindable: true
    },

    // === FELD-DIMENSIONEN ===
    mitarbeiter_name_breite: {
      label: 'Mitarbeitername Breite',
      type: 'Length',
      section: 'style',
      defaultValue: '200px',
      bindable: true
    },

    datum_zelle_breite: {
      label: 'Datumszelle Breite',
      type: 'Length',
      section: 'style',
      defaultValue: '40px',
      bindable: true
    },

    zeilen_hoehe: {
      label: 'Zeilenhöhe',
      type: 'Length',
      section: 'style',
      defaultValue: '50px',
      bindable: true
    },

    eingabefeld_hoehe: {
      label: 'Eingabefeld Höhe',
      type: 'Length',
      section: 'style',
      defaultValue: '32px',
      bindable: true
    },

    eingabefeld_breite: {
      label: 'Eingabefeld Breite',
      type: 'Length',
      section: 'style',
      defaultValue: '100%',
      bindable: true
    },
  },

  triggerEvents: [
    {
      name: 'bei_datumsbereich_auswahl',
      label: 'Bei Datumsbereich-Auswahl',
      event: {
        employee: {},
        employeeId: 0,
        employeeName: '',
        employeeFirstName: '',
        employeeLastName: '',
        employeeEmail: '',
        startDate: '',
        endDate: '',
        dayCount: 0
      }
    },
    {
      name: 'bei_urlaub_klick',
      label: 'Bei Urlaub-Klick',
      event: {
        vacation: {},
        employee: {},
        employeeId: 0,
        employeeName: '',
        employeeFirstName: '',
        employeeLastName: '',
        employeeEmail: '',
        startDate: '',
        endDate: '',
        type: '',
        status: ''
      }
    }
  ]
};
