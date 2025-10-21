# 📋 Xano Setup-Anleitung für Urlaubskalender

Alle Variablen in **deutschem snake_case** Format.

---

## 📊 Xano Datenbank-Struktur

### **Tabelle 1: `user` (Benutzer)**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | int | Primärschlüssel |
| `email` | text | E-Mail des Benutzers |

**Beispiel-Daten:**
```json
[
  {
    "id": 1,
    "email": "max.mustermann@firma.de"
  },
  {
    "id": 2,
    "email": "anna.schmidt@firma.de"
  },
  {
    "id": 3,
    "email": "peter.mueller@firma.de"
  }
]
```

---

### **Tabelle 2: `urlaube` (Urlaube)**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | int | Primärschlüssel |
| `benutzer_id` | int | Foreign Key zu user.id |
| `startdatum` | date | Startdatum (YYYY-MM-DD) |
| `enddatum` | date | Enddatum (YYYY-MM-DD) |
| `typ` | text | 'urlaub', 'krank', 'geschaeftsreise', 'fortbildung' |
| `status` | text | 'ausstehend', 'genehmigt', 'abgelehnt', 'krank' |

**Beispiel-Daten:**
```json
[
  {
    "id": 1,
    "benutzer_id": 1,
    "startdatum": "2025-11-15",
    "enddatum": "2025-11-22",
    "typ": "urlaub",
    "status": "genehmigt"
  },
  {
    "id": 2,
    "benutzer_id": 2,
    "startdatum": "2025-11-10",
    "enddatum": "2025-11-12",
    "typ": "krank",
    "status": "genehmigt"
  },
  {
    "id": 3,
    "benutzer_id": 1,
    "startdatum": "2025-12-20",
    "enddatum": "2025-12-31",
    "typ": "urlaub",
    "status": "ausstehend"
  },
  {
    "id": 4,
    "benutzer_id": 3,
    "startdatum": "2025-11-05",
    "enddatum": "2025-11-08",
    "typ": "geschaeftsreise",
    "status": "genehmigt"
  }
]
```

---

## 🔗 Xano API Endpoints

### **GET Endpoint: `/benutzer_mit_urlaube`**

Dieser Endpoint gibt alle Benutzer mit ihren Urlauben zurück.

#### **Query Builder in Xano:**

1. **Query All Records** von `user`
2. **Add Related Records**:
   - Relationship: `urlaube` (1:n Beziehung über `benutzer_id`)
   - Als Feld-Name: `urlaube` verwenden

#### **API Response (JSON):**
```json
[
  {
    "id": 1,
    "email": "max.mustermann@firma.de",
    "urlaube": [
      {
        "id": 1,
        "benutzer_id": 1,
        "startdatum": "2025-11-15",
        "enddatum": "2025-11-22",
        "typ": "urlaub",
        "status": "genehmigt"
      },
      {
        "id": 3,
        "benutzer_id": 1,
        "startdatum": "2025-12-20",
        "enddatum": "2025-12-31",
        "typ": "urlaub",
        "status": "ausstehend"
      }
    ]
  },
  {
    "id": 2,
    "email": "anna.schmidt@firma.de",
    "urlaube": [
      {
        "id": 2,
        "benutzer_id": 2,
        "startdatum": "2025-11-10",
        "enddatum": "2025-11-12",
        "typ": "krank",
        "status": "genehmigt"
      }
    ]
  },
  {
    "id": 3,
    "email": "peter.mueller@firma.de",
    "urlaube": [
      {
        "id": 4,
        "benutzer_id": 3,
        "startdatum": "2025-11-05",
        "enddatum": "2025-11-08",
        "typ": "geschaeftsreise",
        "status": "genehmigt"
      }
    ]
  }
]
```

---

### **POST Endpoint: `/urlaub_erstellen`**

Dieser Endpoint erstellt einen neuen Urlaub.

#### **Input Schema:**
```json
{
  "benutzer_id": "integer (required)",
  "startdatum": "text (required) - Format: YYYY-MM-DD",
  "enddatum": "text (required) - Format: YYYY-MM-DD",
  "typ": "text (required) - urlaub|krank|geschaeftsreise|fortbildung",
  "status": "text (optional) - Default: ausstehend"
}
```

#### **Query Builder in Xano:**
1. **Add Record** zu `urlaube` Tabelle
2. Set Fields:
   - `benutzer_id` = `input.benutzer_id`
   - `startdatum` = `input.startdatum`
   - `enddatum` = `input.enddatum`
   - `typ` = `input.typ`
   - `status` = `input.status` (oder Default: "ausstehend")

#### **Response:**
```json
{
  "id": 5,
  "benutzer_id": 1,
  "startdatum": "2026-01-10",
  "enddatum": "2026-01-15",
  "typ": "urlaub",
  "status": "ausstehend",
  "created_at": 1234567890
}
```

---

### **PUT/PATCH Endpoint: `/urlaub_aktualisieren/{urlaub_id}`**

Dieser Endpoint aktualisiert einen bestehenden Urlaub.

#### **Input Schema:**
```json
{
  "startdatum": "text (optional) - Format: YYYY-MM-DD",
  "enddatum": "text (optional) - Format: YYYY-MM-DD",
  "typ": "text (optional) - urlaub|krank|geschaeftsreise|fortbildung",
  "status": "text (optional) - ausstehend|genehmigt|abgelehnt|krank"
}
```

#### **Query Builder in Xano:**
1. **Query Record** mit `id` = `path.urlaub_id` in `urlaube` Tabelle
2. **Edit Record** mit Conditional Updates:
   - Wenn `input.startdatum` vorhanden: `startdatum` = `input.startdatum`
   - Wenn `input.enddatum` vorhanden: `enddatum` = `input.enddatum`
   - Wenn `input.typ` vorhanden: `typ` = `input.typ`
   - Wenn `input.status` vorhanden: `status` = `input.status`
3. **Return** das aktualisierte Record

#### **Response:**
```json
{
  "id": 5,
  "benutzer_id": 1,
  "startdatum": "2026-01-10",
  "enddatum": "2026-01-20",
  "typ": "urlaub",
  "status": "genehmigt",
  "updated_at": 1234567900
}
```

---

### **DELETE Endpoint: `/urlaub_loeschen/{urlaub_id}`**

Dieser Endpoint löscht einen Urlaub.

#### **Query Builder in Xano:**
1. **Query Record** mit `id` = `path.urlaub_id` in `urlaube` Tabelle
2. **Delete Record**
3. **Return** Success-Meldung

#### **Response:**
```json
{
  "success": true,
  "message": "Urlaub erfolgreich gelöscht"
}
```

---

## 🔧 WeWeb Setup

### **Methode 1: Xano Collection verwenden (Empfohlen)**

Diese Methode verwendet die verschachtelte Struktur direkt von Xano.

#### **Schritt 1: Xano Data Source hinzufügen**

1. In WeWeb: **Data Sources** → **Add Data Source** → **Xano**
2. Verbinde mit deinem Xano Projekt
3. Füge deinen Endpoint `/benutzer_mit_urlaube` als **Collection** hinzu
4. Füge deinen Endpoint `/urlaub_erstellen` als **Action** hinzu
5. Füge deinen Endpoint `/urlaub_aktualisieren/{id}` als **Action** hinzu
6. Füge deinen Endpoint `/urlaub_loeschen/{id}` als **Action** hinzu

#### **Schritt 2: Urlaubskalender-Komponente hinzufügen**

1. Füge die Urlaubskalender-Komponente zu deiner Page hinzu
2. Wähle die Komponente aus

#### **Schritt 3: Component Binding**

1. Gehe zu **Properties** → **benutzer_liste** (employees)
2. Klicke auf das **Binding-Symbol** 🔗
3. Wähle: **Xano Collection** → **benutzer_mit_urlaube**

**Das war's!** Die Komponente zeigt jetzt automatisch alle Benutzer mit ihren Urlauben an.

Die verschachtelte Struktur von Xano wird automatisch erkannt:
- Benutzer-Daten werden aus dem Haupt-Array gelesen
- Urlaube werden aus dem `urlaube` Feld jedes Benutzers gelesen

---

### **Methode 2: Separate Arrays verwenden (Für manuelle Dateneingabe im Editor)**

Diese Methode ist nützlich, wenn du die Daten manuell im WeWeb-Editor eingeben möchtest.

#### **Schritt 1: Benutzer-Daten eingeben**

1. Gehe zu **Properties** → **benutzer_liste**
2. Füge Benutzer hinzu:
   - `benutzer_id`: z.B. "1", "2", "3" (als Text)
   - `benutzer_email`: z.B. "max.mustermann@firma.de"

#### **Schritt 2: Urlaubs-Daten eingeben**

1. Gehe zu **Properties** → **urlaubsdaten**
2. Füge Urlaube hinzu:
   - `urlaub_id`: z.B. "1", "2", "3" (als Text)
   - `benutzer_id`: Foreign Key zum Benutzer, z.B. "1" (als Text)
   - `startdatum`: z.B. "2025-11-15"
   - `enddatum`: z.B. "2025-11-22"
   - `typ`: "urlaub", "krank", "geschaeftsreise", oder "fortbildung"
   - `status`: "ausstehend", "genehmigt", "abgelehnt", oder "krank"

**Die Komponente verbindet automatisch:**
- Urlaube mit Benutzern über die `benutzer_id`
- Benutzer mit ID "1" bekommt alle Urlaube mit `benutzer_id: "1"`

---

### **Formula Mappings** *(OPTIONAL - nur wenn Feldnamen abweichen)*

Da deine Xano-Felder **genau so** heißen wie die Komponente erwartet, brauchst du **NICHTS zu mappen**!

Die Komponente erwartet:
- `id` ✅
- `email` ✅
- `urlaube` ✅ (nur bei verschachtelter Struktur)
  - `id` ✅
  - `benutzer_id` ✅
  - `startdatum` ✅
  - `enddatum` ✅
  - `typ` ✅
  - `status` ✅

**Automatisches Mapping funktioniert perfekt!**

Falls deine Felder **andere Namen** haben, kannst du sie in den Formula-Feldern mappen:

#### Beispiel: Andere Feldnamen
Wenn deine Xano-Tabelle andere Namen verwendet:

**Xano:** `user_email` → **Component erwartet:** `email`
```javascript
// In: benutzer_email_feld
context.mapping?.['user_email']
```

**Xano:** `von_datum` → **Component erwartet:** `startdatum`
```javascript
// In: urlaub_startdatum_feld
context.mapping?.['von_datum']
```

---

## ✅ Fertig! Die Komponente funktioniert jetzt

Die Urlaubskalender-Komponente zeigt automatisch:

- ✅ Alle Benutzer aus Xano (angezeigt mit E-Mail)
- ✅ Alle Urlaube pro Benutzer
- ✅ Verschiedene Farben je nach Status:
  - **Ausstehend** = Gelb
  - **Genehmigt** = Grün
  - **Abgelehnt** = Rot
  - **Krank** = Orange
- ✅ Verschiedene Typen:
  - `urlaub` → Urlaub
  - `krank` → Krank
  - `geschaeftsreise` → Geschäftsreise
  - `fortbildung` → Fortbildung

---

## 🎯 Workflows in WeWeb

### **Workflow 1: Neuen Urlaub über Datumsbereich-Auswahl erstellen**

Die Komponente hat einen **Trigger**: `bei_datumsbereich_auswahl` (date-range-select)

#### **So funktioniert es:**

1. Benutzer klickt auf eine Zelle und zieht über mehrere Tage
2. Der Trigger wird ausgelöst mit folgenden Event-Daten:
   ```javascript
   {
     employee: {...},          // Benutzer-Objekt
     employeeId: 1,           // Benutzer-ID
     employeeName: "email",   // Benutzer-E-Mail
     startDate: "2025-11-10", // Startdatum
     endDate: "2025-11-15",   // Enddatum
     dayCount: 6              // Anzahl Tage
   }
   ```

#### **Workflow in WeWeb erstellen:**

1. **Trigger**: `bei_datumsbereich_auswahl`
2. **Action**: Xano Request → `urlaub_erstellen`
3. **Mapping**:
   ```javascript
   benutzer_id: event.employeeId
   startdatum: event.startDate
   enddatum: event.endDate
   typ: "urlaub"  // oder aus User-Input (z.B. über ein Popup)
   status: "ausstehend"
   ```
4. **Nach Success**: Refresh Collection `benutzer_mit_urlaube`

**Fertig!** Benutzer können jetzt per Drag & Drop neue Urlaube erstellen! 🎉

---

### **Workflow 2: Urlaub beim Klick bearbeiten**

Die Komponente hat einen **Trigger**: `bei_urlaub_klick` (vacation-click)

#### **So funktioniert es:**

1. Benutzer klickt auf einen Urlaubsbalken
2. Der Trigger wird ausgelöst mit folgenden Event-Daten:
   ```javascript
   {
     vacation: {...},         // Urlaubs-Objekt
     employee: {...},         // Benutzer-Objekt
     employeeId: 1,          // Benutzer-ID
     employeeName: "email",  // Benutzer-E-Mail
     startDate: "2025-11-10",// Startdatum
     endDate: "2025-11-15",  // Enddatum
     type: "urlaub",         // Typ
     status: "ausstehend"    // Status
   }
   ```

#### **Workflow-Beispiel 1: Popup zum Bearbeiten öffnen**

1. **Trigger**: `bei_urlaub_klick`
2. **Action**: Open Popup "Urlaub bearbeiten"
3. **Pass Data to Popup**:
   ```javascript
   urlaubId: event.vacation.id
   startdatum: event.startDate
   enddatum: event.endDate
   typ: event.type
   status: event.status
   ```
4. Im Popup: Formular mit Xano Update Action
5. **Nach Success**: Refresh Collection `benutzer_mit_urlaube`

#### **Workflow-Beispiel 2: Status direkt ändern**

1. **Trigger**: `bei_urlaub_klick`
2. **Action**: Xano Request → `urlaub_aktualisieren/{id}`
3. **Mapping**:
   ```javascript
   id: event.vacation.id
   status: "genehmigt"  // oder andere Status
   ```
4. **Nach Success**: Refresh Collection `benutzer_mit_urlaube`

---

### **Workflow 3: Urlaub löschen**

#### **Option A: Über Urlaub-Klick**

1. **Trigger**: `bei_urlaub_klick`
2. **Action**: Confirmation Dialog
3. **Bei Bestätigung**: Xano Request → `urlaub_loeschen/{id}`
4. **Mapping**:
   ```javascript
   id: event.vacation.id
   ```
5. **Nach Success**: Refresh Collection `benutzer_mit_urlaube`

#### **Option B: Über Kontextmenü (mit Rechtsklick)**

Falls du ein Kontextmenü implementierst:

1. **Trigger**: `bei_urlaub_klick` (mit rechter Maustaste)
2. **Action**: Show Context Menu mit Optionen:
   - "Bearbeiten" → öffnet Popup
   - "Löschen" → zeigt Confirmation Dialog
   - "Status ändern" → zeigt Dropdown
3. Bei "Löschen" → Xano Delete Action
4. **Nach Success**: Refresh Collection `benutzer_mit_urlaube`

---

## 📝 Typ- und Status-Werte

### **Typ (`typ`) Werte:**
- `urlaub` - Urlaub
- `krank` - Krankheit
- `geschaeftsreise` - Geschäftsreise
- `fortbildung` - Fortbildung

### **Status (`status`) Werte:**
- `ausstehend` - Noch nicht genehmigt (Gelb)
- `genehmigt` - Genehmigt (Grün)
- `abgelehnt` - Abgelehnt (Rot)
- `krank` - Krankmeldung (Orange)

---

## 🎨 Anpassungen

### **Farben ändern:**
In der Komponente unter **Style**:
- `genehmigte_urlaub_farbe` - Grün (#51cf66)
- `ausstehende_urlaub_farbe` - Gelb (#ffd43b)
- `abgelehnte_urlaub_farbe` - Rot (#ff6b6b)
- `krankmeldung_farbe` - Orange (#ff8787)
- `hintergrundfarbe` - Hintergrund (#ffffff)
- `kopfzeile_hintergrundfarbe` - Kopfzeile (#f8f9fa)
- `navigation_hintergrundfarbe` - Navigation (Gradient oder Farbe)
- `navigation_textfarbe` - Navigations-Text (#ffffff)

### **Rundungen ändern:**
- `rahmen_radius` - Allgemeine Rahmen-Rundung (4px)
- `urlaubsbalken_rahmen_radius` - Urlaubsbalken-Rundung (4px)

### **Zeitraum ändern:**
- `kalender_startdatum` - Startdatum (YYYY-MM-DD)
- `anzahl_monate` - Wie viele Monate anzeigen (1-12)

### **Weitere Einstellungen:**
- `navigation_anzeigen` - Navigation ein/aus (true/false)
- `wochenenden_anzeigen` - Wochenenden ein/aus (true/false)
- `sprache` - de-DE, en-US, fr-FR, es-ES

---

## 🔍 Datenstruktur-Kompatibilität

Die Komponente ist **flexibel** und unterstützt beide Datenstrukturen:

### **Struktur 1: Verschachtelt (von Xano Collection)**
```json
[
  {
    "id": 1,
    "email": "max@firma.de",
    "urlaube": [
      {
        "id": 1,
        "benutzer_id": 1,
        "startdatum": "2025-11-15",
        "enddatum": "2025-11-22",
        "typ": "urlaub",
        "status": "genehmigt"
      }
    ]
  }
]
```

### **Struktur 2: Separate Arrays (für Editor-Eingabe)**
```javascript
// benutzer_liste
[
  { "id": "1", "email": "max@firma.de" },
  { "id": "2", "email": "anna@firma.de" }
]

// urlaubsdaten
[
  {
    "id": "1",
    "benutzer_id": "1",
    "startdatum": "2025-11-15",
    "enddatum": "2025-11-22",
    "typ": "urlaub",
    "status": "genehmigt"
  }
]
```

Die Komponente **erkennt automatisch**, welche Struktur verwendet wird:
- Bei verschachtelten Daten: liest `employee.urlaube`
- Bei separaten Arrays: verbindet über `benutzer_id`

---

## 📋 Checkliste für Xano Setup

- [ ] Tabelle `user` mit Feldern `id` und `email` erstellt
- [ ] Tabelle `urlaube` mit allen Feldern erstellt
- [ ] Foreign Key Beziehung `urlaube.benutzer_id` → `user.id` konfiguriert
- [ ] GET Endpoint `/benutzer_mit_urlaube` mit Related Records erstellt
- [ ] POST Endpoint `/urlaub_erstellen` erstellt
- [ ] PUT Endpoint `/urlaub_aktualisieren/{id}` erstellt
- [ ] DELETE Endpoint `/urlaub_loeschen/{id}` erstellt
- [ ] Xano Data Source in WeWeb verbunden
- [ ] Collection `benutzer_mit_urlaube` hinzugefügt
- [ ] Actions für Create/Update/Delete hinzugefügt
- [ ] Komponente mit Collection gebunden
- [ ] Workflows für Trigger konfiguriert

---

## 🚀 Erweiterte Funktionen

### **Zusätzliche Felder hinzufügen**

Falls du später weitere Felder benötigst:

#### **In Xano:**
1. Füge Feld zur `urlaube` Tabelle hinzu (z.B. `notiz`)
2. Update die Endpoints

#### **In WeWeb:**
1. Füge Feld zur `urlaubsdaten` Array-Definition hinzu
2. Nutze Formula Mapping für das neue Feld
3. Die Komponente zeigt das Feld automatisch in den Event-Daten

### **Mehrere Kalender-Ansichten**

Du kannst mehrere Instanzen der Komponente verwenden:

- **Team A Kalender**: Filter Collection nach Abteilung
- **Genehmigungsliste**: Filter nach `status: "ausstehend"`
- **Jahresübersicht**: `anzahl_monate: 12`

---

**Viel Erfolg mit dem Urlaubskalender! 🎉**
