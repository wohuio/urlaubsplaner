<template>
  <div class="urlaubsplaner" :style="dynamicStyles">
    <!-- Navigation -->
    <div v-if="content.navigation_anzeigen" class="urlaubsplaner-navigation">
      <button @click="vorheriger_monat" class="nav-button">
        ◀ {{ translations.previous }}
      </button>

      <div class="datum-selektoren">
        <!-- Monat Dropdown -->
        <select v-model="ausgewaehlter_monat" @change="zu_monat_springen" class="monat-select">
          <option v-for="(monat, index) in translations.months" :key="index" :value="index">
            {{ monat }}
          </option>
        </select>

        <!-- Jahr Dropdown -->
        <select v-model="ausgewaehltes_jahr" @change="zu_jahr_springen" class="jahr-select">
          <option v-for="jahr in verfuegbare_jahre" :key="jahr" :value="jahr">
            {{ jahr }}
          </option>
        </select>
      </div>

      <button @click="naechster_monat" class="nav-button">
        {{ translations.next }} ▶
      </button>
    </div>

    <!-- Kalender Container -->
    <div class="kalender-container">
      <!-- Kopfzeile mit Datum -->
      <div class="kopfzeile">
        <div class="ecke"></div>
        <div
          v-for="datum in alle_datum_zellen"
          :key="datum.datum_string"
          class="datum-header"
          :class="{ 'wochenende': datum.ist_wochenende, 'feiertag': datum.ist_feiertag }"
        >
          <div class="datum-tag">{{ datum.tag_name }}</div>
          <div class="datum-nummer">{{ datum.tag_nummer }}</div>
        </div>
      </div>

      <!-- Mitarbeiter-Zeilen -->
      <div class="kalender-body">
        <div
          v-for="mitarbeiter in verarbeitete_mitarbeiter"
          :key="mitarbeiter.id"
          class="mitarbeiter-zeile"
        >
          <!-- Mitarbeiter-Name Spalte -->
          <div class="mitarbeiter-name-spalte">
            {{ mitarbeiter.anzeigename }}
          </div>

          <!-- Datums-Zellen -->
          <div
            v-for="datum in alle_datum_zellen"
            :key="`${mitarbeiter.id}-${datum.datum_string}`"
            class="datums-zelle"
            :class="{
              'wochenende': datum.ist_wochenende,
              'feiertag': datum.ist_feiertag,
              'auswahlbar': !datum.ist_wochenende || content.wochenenden_anzeigen
            }"
            @mousedown="start_auswahl(mitarbeiter, datum)"
            @mouseenter="erweitere_auswahl(datum)"
            @mouseup="beende_auswahl"
          >
            <!-- Urlaubsbalken -->
            <div
              v-for="urlaub in get_urlaube_fuer_datum(mitarbeiter.id, datum.datum_string)"
              :key="urlaub.id"
              class="urlaubsbalken"
              :style="get_urlaubsbalken_style(urlaub, datum.datum_string)"
              @click.stop="urlaub_geklickt(urlaub, mitarbeiter)"
            >
              <span v-if="ist_start_datum(urlaub, datum.datum_string)" class="urlaub-label">
                {{ get_urlaub_typ_label(urlaub.typ) }}
              </span>
            </div>

            <!-- Auswahlmarkierung -->
            <div
              v-if="ist_zelle_ausgewaehlt(mitarbeiter.id, datum.datum_string)"
              class="auswahl-overlay"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
  },
  emits: ['trigger-event'],
  data() {
    return {
      aktuelles_startdatum: null,
      auswahl_aktiv: false,
      auswahl_mitarbeiter: null,
      auswahl_start_datum: null,
      auswahl_end_datum: null,
      ausgewaehlter_monat: new Date().getMonth(),
      ausgewaehltes_jahr: new Date().getFullYear(),
    };
  },
  computed: {
    translations() {
      const lang = this.content?.sprache || 'de-DE';
      const map = {
        'de-DE': {
          previous: 'Vorheriger',
          next: 'Nächster',
          urlaub: 'Urlaub',
          krank: 'Krank',
          geschaeftsreise: 'Geschäftsreise',
          fortbildung: 'Fortbildung',
          sonderurlaub: 'Sonderurlaub',
          elternzeit: 'Elternzeit',
          homeoffice: 'Homeoffice',
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
          days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        },
        'en-US': {
          previous: 'Previous',
          next: 'Next',
          urlaub: 'Vacation',
          krank: 'Sick',
          geschaeftsreise: 'Business Trip',
          fortbildung: 'Training',
          sonderurlaub: 'Special Leave',
          elternzeit: 'Parental Leave',
          homeoffice: 'Home Office',
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      };
      return map[lang] || map['de-DE'];
    },

    verarbeitete_mitarbeiter() {
      const liste = this.content?.benutzer_liste || [];
      return liste.map(m => {
        // Automatisches Mapping: firstName → vorname, lastName → nachname
        const vorname = m.vorname || m.firstName || '';
        const nachname = m.nachname || m.lastName || '';
        const email = m.email || '';

        // Anzeigename: Vorname + Nachname, sonst E-Mail, sonst "Unbekannt"
        let anzeigename = 'Unbekannt';
        if (vorname && nachname) {
          anzeigename = `${vorname} ${nachname}`;
        } else if (vorname) {
          anzeigename = vorname;
        } else if (nachname) {
          anzeigename = nachname;
        } else if (email) {
          anzeigename = email;
        }

        return {
          id: m.id || `m-${Date.now()}-${Math.random()}`,
          vorname: vorname,
          nachname: nachname,
          email: email,
          anzeigename: anzeigename,
          urlaube: m.urlaube || [],
          original: m
        };
      });
    },

    verarbeitete_urlaube() {
      const urlaube = this.content?.urlaubsdaten || [];
      return urlaube.map(u => ({
        id: u.id || `u-${Date.now()}-${Math.random()}`,
        benutzer_id: u.benutzer_id || u.user_id, // Automatisches Mapping: user_id → benutzer_id
        startdatum: u.startdatum,
        enddatum: u.enddatum,
        typ: this.normalize_typ(u.typ),
        status: this.normalize_status(u.status),
        original: u
      }));
    },

    alle_urlaube() {
      const ergebnis = [];
      this.verarbeitete_mitarbeiter.forEach(m => {
        if (Array.isArray(m.urlaube) && m.urlaube.length > 0) {
          m.urlaube.forEach(u => {
            ergebnis.push({
              id: u.id || `n-${Date.now()}-${Math.random()}`,
              benutzer_id: m.id,
              startdatum: u.startdatum,
              enddatum: u.enddatum,
              typ: this.normalize_typ(u.typ),
              status: this.normalize_status(u.status),
              original: u
            });
          });
        }
      });
      this.verarbeitete_urlaube.forEach(u => ergebnis.push(u));
      return ergebnis;
    },

    alle_datum_zellen() {
      const start = this.parse_datum(this.aktuelles_startdatum);
      if (!start) return [];

      const anzahl = this.content?.anzahl_monate || 3;
      const zellen = [];
      const end_date = new Date(start);
      end_date.setMonth(end_date.getMonth() + anzahl);

      let current = new Date(start);
      while (current < end_date) {
        const datum_string = this.format_datum(current);
        const ist_wochenende = current.getDay() === 0 || current.getDay() === 6;
        const ist_feiertag = this.ist_feiertag(datum_string);

        if (!ist_wochenende || this.content?.wochenenden_anzeigen) {
          zellen.push({
            datum_string: datum_string,
            tag_name: this.translations.days[current.getDay()],
            tag_nummer: current.getDate(),
            ist_wochenende,
            ist_feiertag
          });
        }
        current.setDate(current.getDate() + 1);
      }
      return zellen;
    },

    aktueller_zeitraum_text() {
      const start = this.parse_datum(this.aktuelles_startdatum);
      if (!start) return '';
      const anzahl = this.content?.anzahl_monate || 3;
      const end = new Date(start);
      end.setMonth(end.getMonth() + anzahl - 1);
      const sm = this.translations.months[start.getMonth()];
      const em = this.translations.months[end.getMonth()];
      if (start.getMonth() === end.getMonth()) return `${sm} ${start.getFullYear()}`;
      return `${sm} - ${em} ${start.getFullYear()}`;
    },

    verfuegbare_jahre() {
      // Generiert Jahre von aktuelles Jahr - 2 bis 2060
      const aktuelles_jahr = new Date().getFullYear();
      const jahre = [];
      for (let jahr = aktuelles_jahr - 2; jahr <= 2060; jahr++) {
        jahre.push(jahr);
      }
      return jahre;
    },

    dynamicStyles() {
      return {
        '--hintergrundfarbe': this.content?.hintergrundfarbe || '#ffffff',
        '--kopfzeile-hintergrund': this.content?.kopfzeile_hintergrundfarbe || '#f8f9fa',
        '--navigation-hintergrund': this.content?.navigation_hintergrundfarbe || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--navigation-textfarbe': this.content?.navigation_textfarbe || '#ffffff',
        '--feiertag-farbe': this.content?.feiertag_farbe || '#ffe3e3',
        '--rahmen-radius': this.content?.rahmen_radius || '4px',
        '--header-textfarbe': this.content?.header_textfarbe || '#333333',
        '--header-schriftgroesse': this.content?.header_schriftgroesse || '14px',
        '--header-hoehe': this.content?.header_hoehe || '60px',
        '--mitarbeiter-name-breite': this.content?.mitarbeiter_name_breite || '200px',
        '--datum-zelle-breite': this.content?.datum_zelle_breite || '40px',
        '--zeilen-hoehe': this.content?.zeilen_hoehe || '50px',
        '--eingabefeld-hoehe': this.content?.eingabefeld_hoehe || '32px',
        '--eingabefeld-breite': this.content?.eingabefeld_breite || '100%',
      };
    },
  },
  methods: {
    // Berechnet Feiertage für Baden-Württemberg für ein bestimmtes Jahr
    berechne_feiertage(jahr) {
      const feiertage = [];

      // Feste Feiertage
      feiertage.push(`${jahr}-01-01`); // Neujahr
      feiertage.push(`${jahr}-01-06`); // Heilige Drei Könige
      feiertage.push(`${jahr}-05-01`); // Tag der Arbeit
      feiertage.push(`${jahr}-10-03`); // Tag der Deutschen Einheit
      feiertage.push(`${jahr}-11-01`); // Allerheiligen
      feiertage.push(`${jahr}-12-25`); // 1. Weihnachtsfeiertag
      feiertage.push(`${jahr}-12-26`); // 2. Weihnachtsfeiertag

      // Bewegliche Feiertage (basierend auf Ostersonntag)
      const ostersonntag = this.berechne_ostersonntag(jahr);

      // Karfreitag (2 Tage vor Ostersonntag)
      const karfreitag = new Date(ostersonntag);
      karfreitag.setDate(karfreitag.getDate() - 2);
      feiertage.push(this.format_datum(karfreitag));

      // Ostermontag (1 Tag nach Ostersonntag)
      const ostermontag = new Date(ostersonntag);
      ostermontag.setDate(ostermontag.getDate() + 1);
      feiertage.push(this.format_datum(ostermontag));

      // Christi Himmelfahrt (39 Tage nach Ostersonntag)
      const christi_himmelfahrt = new Date(ostersonntag);
      christi_himmelfahrt.setDate(christi_himmelfahrt.getDate() + 39);
      feiertage.push(this.format_datum(christi_himmelfahrt));

      // Pfingstmontag (50 Tage nach Ostersonntag)
      const pfingstmontag = new Date(ostersonntag);
      pfingstmontag.setDate(pfingstmontag.getDate() + 50);
      feiertage.push(this.format_datum(pfingstmontag));

      // Fronleichnam (60 Tage nach Ostersonntag)
      const fronleichnam = new Date(ostersonntag);
      fronleichnam.setDate(fronleichnam.getDate() + 60);
      feiertage.push(this.format_datum(fronleichnam));

      return feiertage;
    },

    // Berechnet Ostersonntag nach Gauß'scher Osterformel
    berechne_ostersonntag(jahr) {
      const a = jahr % 19;
      const b = Math.floor(jahr / 100);
      const c = jahr % 100;
      const d = Math.floor(b / 4);
      const e = b % 4;
      const f = Math.floor((b + 8) / 25);
      const g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4);
      const k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const monat = Math.floor((h + l - 7 * m + 114) / 31);
      const tag = ((h + l - 7 * m + 114) % 31) + 1;
      return new Date(jahr, monat - 1, tag);
    },

    // Prüft, ob ein Datum ein Feiertag ist
    ist_feiertag(datum_string) {
      if (!datum_string) return false;
      const jahr = parseInt(datum_string.split('-')[0]);
      const feiertage = this.berechne_feiertage(jahr);
      return feiertage.includes(datum_string);
    },

    // Zählt Arbeitstage zwischen zwei Daten (ohne Wochenenden und Feiertage)
    zaehle_arbeitstage(start_datum_string, end_datum_string) {
      const start = this.parse_datum(start_datum_string);
      const end = this.parse_datum(end_datum_string);
      if (!start || !end) return 0;

      let count = 0;
      let current = new Date(start);

      while (current <= end) {
        const datum_string = this.format_datum(current);
        const wochentag = current.getDay();
        const ist_wochenende = wochentag === 0 || wochentag === 6;
        const ist_feiertag = this.ist_feiertag(datum_string);

        // Nur zählen wenn es kein Wochenende und kein Feiertag ist
        if (!ist_wochenende && !ist_feiertag) {
          count++;
        }

        current.setDate(current.getDate() + 1);
      }

      return count;
    },

    // Normalisiert typ-Werte (DE/EN → DE)
    normalize_typ(typ) {
      if (!typ) return 'urlaub';
      const normalized = typ.toLowerCase();
      const mapping = {
        // Deutsche Werte
        'urlaub': 'urlaub',
        'krank': 'krank',
        'geschaeftsreise': 'geschaeftsreise',
        'fortbildung': 'fortbildung',
        // Englische Werte
        'vacation': 'urlaub',
        'sick': 'krank',
        'sonderurlaub': 'sonderurlaub',
        'elternzeit': 'elternzeit',
        'homeoffice': 'homeoffice'
      };
      return mapping[normalized] || normalized;
    },
    // Normalisiert status-Werte (DE/EN → DE)
    normalize_status(status) {
      if (!status) return 'ausstehend';
      const normalized = status.toLowerCase();
      const mapping = {
        // Deutsche Werte
        'ausstehend': 'ausstehend',
        'genehmigt': 'genehmigt',
        'abgelehnt': 'abgelehnt',
        'krank': 'krank',
        // Englische Werte
        'pending': 'ausstehend',
        'approved': 'genehmigt',
        'rejected': 'abgelehnt',
        'sick': 'krank'
      };
      return mapping[normalized] || normalized;
    },
    parse_datum(s) {
      if (!s) return null;
      const p = s.split('-');
      if (p.length !== 3) return null;
      return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    },
    format_datum(d) {
      if (!d) return '';
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    get_urlaube_fuer_datum(mid, ds) {
      return this.alle_urlaube.filter(u =>
        u.benutzer_id == mid && u.startdatum && u.enddatum && ds >= u.startdatum && ds <= u.enddatum
      );
    },
    ist_start_datum(u, ds) {
      return u.startdatum === ds;
    },
    get_urlaub_farbe(s) {
      const f = {
        'genehmigt': this.content?.genehmigte_urlaub_farbe || '#51cf66',
        'ausstehend': this.content?.ausstehende_urlaub_farbe || '#ffd43b',
        'abgelehnt': this.content?.abgelehnte_urlaub_farbe || '#ff6b6b',
        'krank': this.content?.krankmeldung_farbe || '#ff8787'
      };
      return f[s] || f['ausstehend'];
    },
    get_urlaub_typ_label(t) {
      const l = {
        'urlaub': this.translations.urlaub,
        'krank': this.translations.krank,
        'geschaeftsreise': this.translations.geschaeftsreise,
        'fortbildung': this.translations.fortbildung
      };
      return l[t] || t;
    },
    get_urlaubsbalken_style(u, ds) {
      const r = this.content?.urlaubsbalken_rahmen_radius || '4px';
      const start = this.ist_start_datum(u, ds);
      const ende = u.enddatum === ds;
      return {
        'background-color': this.get_urlaub_farbe(u.status),
        'border-top-left-radius': start ? r : '0',
        'border-bottom-left-radius': start ? r : '0',
        'border-top-right-radius': ende ? r : '0',
        'border-bottom-right-radius': ende ? r : '0',
      };
    },
    start_auswahl(m, d) {
      if (d.ist_wochenende && !this.content?.wochenenden_anzeigen) return;
      this.auswahl_aktiv = true;
      this.auswahl_mitarbeiter = m;
      this.auswahl_start_datum = d.datum_string;
      this.auswahl_end_datum = d.datum_string;
    },
    erweitere_auswahl(d) {
      if (!this.auswahl_aktiv) return;
      if (d.ist_wochenende && !this.content?.wochenenden_anzeigen) return;
      this.auswahl_end_datum = d.datum_string;
    },
    beende_auswahl() {
      if (!this.auswahl_aktiv) return;
      const s = this.auswahl_start_datum;
      const e = this.auswahl_end_datum;
      const m = this.auswahl_mitarbeiter;
      if (s && e && m) {
        const [ss, es] = s <= e ? [s, e] : [e, s];
        // Berechne Arbeitstage (ohne Wochenenden und Feiertage)
        const dc = this.zaehle_arbeitstage(ss, es);
        this.$emit('trigger-event', {
          name: 'bei_datumsbereich_auswahl',
          event: {
            employee: m.original,
            employeeId: m.id,
            employeeName: m.anzeigename,
            employeeFirstName: m.vorname,
            employeeLastName: m.nachname,
            employeeEmail: m.email,
            startDate: ss,
            endDate: es,
            dayCount: dc
          }
        });
      }
      this.auswahl_aktiv = false;
      this.auswahl_mitarbeiter = null;
      this.auswahl_start_datum = null;
      this.auswahl_end_datum = null;
    },
    ist_zelle_ausgewaehlt(mid, ds) {
      if (!this.auswahl_aktiv) return false;
      if (this.auswahl_mitarbeiter?.id !== mid) return false;
      const s = this.auswahl_start_datum;
      const e = this.auswahl_end_datum;
      const [ss, es] = s <= e ? [s, e] : [e, s];
      return ds >= ss && ds <= es;
    },
    urlaub_geklickt(u, m) {
      this.$emit('trigger-event', {
        name: 'bei_urlaub_klick',
        event: {
          vacation: u.original,
          employee: m.original,
          employeeId: m.id,
          employeeName: m.anzeigename,
          employeeFirstName: m.vorname,
          employeeLastName: m.nachname,
          employeeEmail: m.email,
          startDate: u.startdatum,
          endDate: u.enddatum,
          type: u.typ,
          status: u.status
        }
      });
    },
    vorheriger_monat() {
      const c = this.parse_datum(this.aktuelles_startdatum);
      if (c) {
        c.setMonth(c.getMonth() - 1);
        this.aktuelles_startdatum = this.format_datum(c);
        this.update_selektoren();
      }
    },
    naechster_monat() {
      const c = this.parse_datum(this.aktuelles_startdatum);
      if (c) {
        c.setMonth(c.getMonth() + 1);
        this.aktuelles_startdatum = this.format_datum(c);
        this.update_selektoren();
      }
    },
    zu_monat_springen() {
      // Springt zum ausgewählten Monat
      const neues_datum = new Date(this.ausgewaehltes_jahr, this.ausgewaehlter_monat, 1);
      this.aktuelles_startdatum = this.format_datum(neues_datum);
    },
    zu_jahr_springen() {
      // Springt zum ausgewählten Jahr (gleicher Monat)
      const neues_datum = new Date(this.ausgewaehltes_jahr, this.ausgewaehlter_monat, 1);
      this.aktuelles_startdatum = this.format_datum(neues_datum);
    },
    update_selektoren() {
      // Aktualisiert Monat/Jahr-Selektoren basierend auf aktuellem Datum
      const c = this.parse_datum(this.aktuelles_startdatum);
      if (c) {
        this.ausgewaehlter_monat = c.getMonth();
        this.ausgewaehltes_jahr = c.getFullYear();
      }
    },
  },
  mounted() {
    this.aktuelles_startdatum = this.content?.kalender_startdatum || this.format_datum(new Date());
    this.update_selektoren();
  },
  watch: {
    'content.kalender_startdatum'(v) {
      if (v) this.aktuelles_startdatum = v;
    }
  }
};
</script>

<style lang="scss" scoped>
.urlaubsplaner {
  background-color: var(--hintergrundfarbe);
  border-radius: var(--rahmen-radius);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  user-select: none;
}

.urlaubsplaner-navigation {
  background: var(--navigation-hintergrund);
  color: var(--navigation-textfarbe);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--navigation-textfarbe);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.datum-selektoren {
  display: flex;
  gap: 12px;
  align-items: center;
}

.monat-select,
.jahr-select {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--navigation-textfarbe);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }

  // Dropdown-Optionen (wenn geöffnet)
  option {
    background: #fff;
    color: #333;
  }
}

.monat-select {
  min-width: 120px;
}

.jahr-select {
  min-width: 80px;
}

.aktueller_zeitraum {
  font-size: 18px;
  font-weight: 600;
}

.kalender-container {
  overflow-x: auto;
}

.kopfzeile {
  display: flex;
  background: var(--kopfzeile-hintergrund);
  border-bottom: 2px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
  height: var(--header-hoehe);
  color: var(--header-textfarbe);
}

.ecke {
  min-width: var(--mitarbeiter-name-breite);
  width: var(--mitarbeiter-name-breite);
  border-right: 1px solid #dee2e6;
}

.datum-header {
  min-width: var(--datum-zelle-breite);
  flex: 1;
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--header-textfarbe);

  &.wochenende {
    background-color: #f1f3f5;
  }

  &.feiertag {
    background-color: var(--feiertag-farbe);
    .datum-tag, .datum-nummer {
      color: #c92a2a;
      font-weight: 600;
    }
  }
}

.datum-tag {
  font-size: var(--header-schriftgroesse);
  color: var(--header-textfarbe);
  opacity: 0.7;
  text-transform: uppercase;
}

.datum-nummer {
  font-size: var(--header-schriftgroesse);
  font-weight: 600;
  margin-top: 2px;
  color: var(--header-textfarbe);
}

.kalender-body {
  display: flex;
  flex-direction: column;
}

.mitarbeiter-zeile {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.mitarbeiter-name-spalte {
  min-width: var(--mitarbeiter-name-breite);
  width: var(--mitarbeiter-name-breite);
  padding: 12px 8px;
  font-weight: 600;
  border-right: 1px solid #dee2e6;
  background: var(--kopfzeile-hintergrund);
  display: flex;
  align-items: center;
  font-size: 14px;
}

.datums-zelle {
  min-width: var(--datum-zelle-breite);
  flex: 1;
  min-height: var(--zeilen-hoehe);
  border-right: 1px solid #dee2e6;
  position: relative;
  cursor: default;

  &.wochenende {
    background-color: #f8f9fa;
  }

  &.feiertag {
    background-color: var(--feiertag-farbe);
    opacity: 0.5;
    border-left: 2px solid var(--feiertag-farbe);
  }

  &.auswahlbar {
    cursor: cell;
  }
}

.urlaubsbalken {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: var(--eingabefeld-hoehe);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
}

.urlaub-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auswahl-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(66, 153, 225, 0.2);
  border: 2px dashed #4299e1;
  pointer-events: none;
}

@media (max-width: 768px) {
  .urlaubsplaner-navigation {
    flex-direction: column;
    gap: 12px;
  }
  .aktueller_zeitraum {
    order: -1;
    font-size: 16px;
  }
  .nav-button {
    width: 100%;
  }
  .mitarbeiter-name-spalte,
  .datums-zelle {
    min-width: 40px;
  }
}
</style>
