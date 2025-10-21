# 🔧 Xano Integration - Detaillierte Schritt-für-Schritt-Anleitung

## Inhaltsverzeichnis
1. [Xano Projekt vorbereiten](#1-xano-projekt-vorbereiten)
2. [Datenbank-Tabellen erstellen](#2-datenbank-tabellen-erstellen)
3. [Foreign Key Beziehungen einrichten](#3-foreign-key-beziehungen-einrichten)
4. [API Endpoints erstellen](#4-api-endpoints-erstellen)
5. [WeWeb Integration](#5-weweb-integration)
6. [Workflows konfigurieren](#6-workflows-konfigurieren)
7. [Testing und Troubleshooting](#7-testing-und-troubleshooting)

---

## 1. Xano Projekt vorbereiten

### Schritt 1.1: Neues Xano Projekt erstellen (falls noch nicht vorhanden)

1. Gehe zu [https://www.xano.com](https://www.xano.com)
2. Melde dich an oder erstelle einen Account
3. Klicke auf **"Create New Workspace"**
4. Gib einen Namen ein: z.B. "Urlaubsplanung"
5. Klicke auf **"Create"**

### Schritt 1.2: Zur Datenbank navigieren

1. Klicke in der linken Sidebar auf **"Database"**
2. Du siehst jetzt die Tabellen-Übersicht (noch leer)

---

## 2. Datenbank-Tabellen erstellen

### Tabelle 1: `user` (Benutzer-Tabelle)

#### Schritt 2.1: Tabelle erstellen

1. Klicke auf **"Add Table"** (oben rechts)
2. Gib den Tabellennamen ein: `user`
3. Klicke auf **"Create"**

#### Schritt 2.2: Felder hinzufügen

Xano erstellt automatisch folgende Felder:
- ✅ `id` (integer, auto-increment, primary key)
- ✅ `created_at` (timestamp)

**Zusätzliches Feld hinzufügen:**

1. Klicke auf **"Add Field"**
2. **Field Name:** `email`
3. **Field Type:** `text`
4. **Required:** ✅ Aktivieren
5. **Unique:** ✅ Aktivieren (E-Mail soll einzigartig sein)
6. Klicke auf **"Save"**

#### Schritt 2.3: Test-Daten einfügen

1. Klicke auf den **"Data"**-Tab der `user` Tabelle
2. Klicke auf **"Add Record"**
3. Füge folgende Benutzer hinzu:

**Benutzer 1:**
- `email`: `max.mustermann@firma.de`

**Benutzer 2:**
- `email`: `anna.schmidt@firma.de`

**Benutzer 3:**
- `email`: `peter.mueller@firma.de`

4. Klicke jeweils auf **"Save"**

---

### Tabelle 2: `urlaube` (Urlaubs-Tabelle)

#### Schritt 2.4: Tabelle erstellen

1. Klicke wieder auf **"Add Table"**
2. Gib den Tabellennamen ein: `urlaube`
3. Klicke auf **"Create"**

#### Schritt 2.5: Felder hinzufügen

Xano erstellt automatisch:
- ✅ `id` (integer, auto-increment, primary key)
- ✅ `created_at` (timestamp)

**Füge folgende Felder hinzu:**

**Feld 1: benutzer_id (Foreign Key)**
1. Klicke auf **"Add Field"**
2. **Field Name:** `benutzer_id`
3. **Field Type:** `integer`
4. **Required:** ✅ Aktivieren
5. Klicke auf **"Save"**

**Feld 2: startdatum**
1. Klicke auf **"Add Field"**
2. **Field Name:** `startdatum`
3. **Field Type:** `date`
4. **Required:** ✅ Aktivieren
5. Klicke auf **"Save"**

**Feld 3: enddatum**
1. Klicke auf **"Add Field"**
2. **Field Name:** `enddatum`
3. **Field Type:** `date`
4. **Required:** ✅ Aktivieren
5. Klicke auf **"Save"**

**Feld 4: typ**
1. Klicke auf **"Add Field"**
2. **Field Name:** `typ`
3. **Field Type:** `text`
4. **Required:** ✅ Aktivieren
5. **Default Value:** `urlaub`
6. Klicke auf **"Save"**

**Feld 5: status**
1. Klicke auf **"Add Field"**
2. **Field Name:** `status`
3. **Field Type:** `text`
4. **Required:** ✅ Aktivieren
5. **Default Value:** `ausstehend`
6. Klicke auf **"Save"**

#### Schritt 2.6: Test-Daten einfügen

1. Klicke auf den **"Data"**-Tab der `urlaube` Tabelle
2. Füge folgende Urlaube hinzu:

**Urlaub 1:**
- `benutzer_id`: `1` (Max Mustermann)
- `startdatum`: `2025-11-15`
- `enddatum`: `2025-11-22`
- `typ`: `urlaub`
- `status`: `genehmigt`

**Urlaub 2:**
- `benutzer_id`: `2` (Anna Schmidt)
- `startdatum`: `2025-11-10`
- `enddatum`: `2025-11-12`
- `typ`: `krank`
- `status`: `genehmigt`

**Urlaub 3:**
- `benutzer_id`: `1` (Max Mustermann)
- `startdatum`: `2025-12-20`
- `enddatum`: `2025-12-31`
- `typ`: `urlaub`
- `status`: `ausstehend`

**Urlaub 4:**
- `benutzer_id`: `3` (Peter Mueller)
- `startdatum`: `2025-11-05`
- `enddatum`: `2025-11-08`
- `typ`: `geschaeftsreise`
- `status`: `genehmigt`

---

## 3. Foreign Key Beziehungen einrichten

### Schritt 3.1: Beziehung erstellen

1. Gehe zur **`urlaube`** Tabelle
2. Klicke auf das **"Settings"**-Icon (Zahnrad) neben dem `benutzer_id` Feld
3. Wähle **"Set as Foreign Key"**
4. **Referenced Table:** `user`
5. **Referenced Field:** `id`
6. **Relationship Name:** `user_relation` (oder leer lassen für Auto-Name)
7. Klicke auf **"Save"**

### Schritt 3.2: Inverse Beziehung (von user zu urlaube)

Xano erstellt automatisch eine inverse Beziehung:
- Von `user` zu `urlaube`
- Name: `urlaube` (Plural von Tabelle)

**Überprüfen:**
1. Gehe zur **`user`** Tabelle
2. Klicke auf den **"Relationships"**-Tab
3. Du solltest sehen: `urlaube` → verweist auf `urlaube` Tabelle

---

## 4. API Endpoints erstellen

### Endpoint 1: GET `/benutzer_mit_urlaube`

Dieser Endpoint gibt alle Benutzer MIT ihren verschachtelten Urlauben zurück.

#### Schritt 4.1: Neuen Endpoint erstellen

1. Klicke in der linken Sidebar auf **"API"**
2. Klicke auf **"Add API Group"** (falls noch keine Gruppe existiert)
3. Name: `Urlaubsplanung`
4. Klicke auf **"Create"**
5. Klicke auf **"Add Endpoint"**
6. **Method:** `GET`
7. **Path:** `/benutzer_mit_urlaube`
8. Klicke auf **"Create"**

#### Schritt 4.2: Query Builder konfigurieren

Du befindest dich jetzt im **Function Stack** (Query Builder).

**Schritt 1: Query All Records hinzufügen**
1. Klicke auf **"Add Query"**
2. Wähle **"Query All Records"**
3. **Table:** `user`
4. Klicke auf **"Add"**

**Schritt 2: Add Related Records**
1. Klicke auf das **"+"**-Icon nach dem Query
2. Wähle **"Add Related Records"**
3. **Input:** verwende die Variable vom vorherigen Query (z.B. `query_all_user`)
4. **Relationship:** `urlaube`
5. **Field Name:** `urlaube` (so wird das verschachtelte Array heißen)
6. Klicke auf **"Add"**

**Schritt 3: Response zurückgeben**
1. Der letzte Step sollte automatisch als Response gesetzt sein
2. Falls nicht: Klicke auf **"Response"** und wähle die Variable mit den Benutzern + Urlauben

#### Schritt 4.3: Endpoint testen

1. Klicke oben rechts auf **"Run & Debug"**
2. Klicke auf **"Run"**
3. Du solltest eine Response sehen wie:
```json
[
  {
    "id": 1,
    "email": "max.mustermann@firma.de",
    "created_at": 1234567890,
    "urlaube": [
      {
        "id": 1,
        "benutzer_id": 1,
        "startdatum": "2025-11-15",
        "enddatum": "2025-11-22",
        "typ": "urlaub",
        "status": "genehmigt",
        "created_at": 1234567890
      },
      {
        "id": 3,
        "benutzer_id": 1,
        "startdatum": "2025-12-20",
        "enddatum": "2025-12-31",
        "typ": "urlaub",
        "status": "ausstehend",
        "created_at": 1234567891
      }
    ]
  },
  ...
]
```

4. **Perfekt!** Der Endpoint funktioniert.

---

### Endpoint 2: POST `/urlaub_erstellen`

Dieser Endpoint erstellt einen neuen Urlaub.

#### Schritt 4.4: Neuen Endpoint erstellen

1. In der API-Gruppe "Urlaubsplanung"
2. Klicke auf **"Add Endpoint"**
3. **Method:** `POST`
4. **Path:** `/urlaub_erstellen`
5. Klicke auf **"Create"**

#### Schritt 4.5: Input Parameter definieren

1. Klicke auf den **"Inputs"**-Tab
2. Füge folgende Inputs hinzu:

**Input 1: benutzer_id**
- Klicke auf **"Add Input"**
- **Name:** `benutzer_id`
- **Type:** `integer`
- **Required:** ✅ Ja
- Klicke auf **"Save"**

**Input 2: startdatum**
- **Name:** `startdatum`
- **Type:** `text` (wir akzeptieren Text im Format YYYY-MM-DD)
- **Required:** ✅ Ja

**Input 3: enddatum**
- **Name:** `enddatum`
- **Type:** `text`
- **Required:** ✅ Ja

**Input 4: typ**
- **Name:** `typ`
- **Type:** `text`
- **Required:** ✅ Ja
- **Default:** `urlaub`

**Input 5: status**
- **Name:** `status`
- **Type:** `text`
- **Required:** ❌ Nein
- **Default:** `ausstehend`

#### Schritt 4.6: Function Stack konfigurieren

1. Zurück zum **"Function Stack"**-Tab
2. Klicke auf **"Add Database Request"**
3. Wähle **"Add Record"**
4. **Table:** `urlaube`
5. Klicke auf **"Add"**

**Felder mappen:**
- `benutzer_id`: Klicke auf das Feld → Wähle **"Inputs" → "benutzer_id"**
- `startdatum`: Wähle **"Inputs" → "startdatum"**
- `enddatum`: Wähle **"Inputs" → "enddatum"**
- `typ`: Wähle **"Inputs" → "typ"**
- `status`: Wähle **"Inputs" → "status"**

6. Der Response ist automatisch das neu erstellte Record

#### Schritt 4.7: Endpoint testen

1. Klicke auf **"Run & Debug"**
2. Füge Test-Daten ein:
```json
{
  "benutzer_id": 1,
  "startdatum": "2026-01-10",
  "enddatum": "2026-01-15",
  "typ": "urlaub",
  "status": "ausstehend"
}
```
3. Klicke auf **"Run"**
4. Du solltest den neu erstellten Urlaub sehen

---

### Endpoint 3: PATCH `/urlaub_aktualisieren/{urlaub_id}`

Dieser Endpoint aktualisiert einen bestehenden Urlaub.

#### Schritt 4.8: Neuen Endpoint erstellen

1. Klicke auf **"Add Endpoint"**
2. **Method:** `PATCH`
3. **Path:** `/urlaub_aktualisieren/{urlaub_id}`
   - `{urlaub_id}` ist ein Path Parameter
4. Klicke auf **"Create"**

#### Schritt 4.9: Input Parameter definieren

Xano erkennt automatisch `urlaub_id` als Path Parameter.

**Zusätzliche Inputs (alle OPTIONAL):**
- `startdatum` (text, optional)
- `enddatum` (text, optional)
- `typ` (text, optional)
- `status` (text, optional)

#### Schritt 4.10: Function Stack konfigurieren

**Schritt 1: Query Record**
1. Klicke auf **"Add Database Request"**
2. Wähle **"Query Record"**
3. **Table:** `urlaube`
4. **Filter:** `id` = `urlaub_id` (aus Path Parameter)
5. Klicke auf **"Add"**

**Schritt 2: Edit Record**
1. Klicke auf **"+"** nach dem Query
2. Wähle **"Edit Record"**
3. **Input:** Variable vom vorherigen Query
4. **Conditional Updates aktivieren:**
   - Nur Felder updaten, die im Input vorhanden sind

5. Für jedes Feld:
   - Klicke auf das Feld
   - Wähle **"If Exists"** (nur updaten wenn Input vorhanden)
   - Wähle den entsprechenden Input

**Beispiel für `startdatum`:**
- Klicke auf `startdatum` Feld
- Wähle **"Advanced"** → **"Conditional"**
- **Condition:** `input.startdatum exists`
- **Then:** `input.startdatum`
- **Else:** Feld unverändert lassen

6. Response: Das aktualisierte Record

#### Schritt 4.11: Endpoint testen

1. Erstelle zuerst einen Urlaub mit dem `/urlaub_erstellen` Endpoint
2. Notiere die `id` (z.B. 5)
3. Teste `/urlaub_aktualisieren/5` mit:
```json
{
  "status": "genehmigt"
}
```
4. Der Status sollte jetzt aktualisiert sein

---

### Endpoint 4: DELETE `/urlaub_loeschen/{urlaub_id}`

Dieser Endpoint löscht einen Urlaub.

#### Schritt 4.12: Neuen Endpoint erstellen

1. Klicke auf **"Add Endpoint"**
2. **Method:** `DELETE`
3. **Path:** `/urlaub_loeschen/{urlaub_id}`
4. Klicke auf **"Create"**

#### Schritt 4.13: Function Stack konfigurieren

**Schritt 1: Query Record**
1. Klicke auf **"Add Database Request"**
2. Wähle **"Query Record"**
3. **Table:** `urlaube`
4. **Filter:** `id` = `urlaub_id`
5. Klicke auf **"Add"**

**Schritt 2: Delete Record**
1. Klicke auf **"+"**
2. Wähle **"Delete Record"**
3. **Input:** Variable vom vorherigen Query
4. Klicke auf **"Add"**

**Schritt 3: Success Response**
1. Klicke auf **"+"**
2. Wähle **"Custom Response"**
3. Gib ein JSON Object zurück:
```json
{
  "success": true,
  "message": "Urlaub erfolgreich gelöscht"
}
```

#### Schritt 4.14: Endpoint testen

1. Erstelle einen Test-Urlaub
2. Notiere die `id`
3. Teste `/urlaub_loeschen/{id}`
4. Der Urlaub sollte gelöscht werden

---

## 5. WeWeb Integration

### Schritt 5.1: Xano Data Source hinzufügen

1. Öffne dein WeWeb Projekt
2. Klicke in der linken Sidebar auf **"Data"** (oder **"Data Sources"**)
3. Klicke auf **"+ Add Data Source"**
4. Wähle **"Xano"**
5. **Name:** `Urlaubsplanung Xano`
6. **Base URL:** Deine Xano Instance URL (z.B. `https://x8ki-letl-twmt.n7.xano.io/api:ABCD1234`)
   - Findest du in Xano unter **"API" → "Settings" → "Base URL"**
7. Klicke auf **"Connect"**

### Schritt 5.2: Collection hinzufügen (GET Endpoint)

1. In der Xano Data Source
2. Klicke auf **"+ Add Collection"**
3. **Endpoint:** `/benutzer_mit_urlaube`
4. **Method:** `GET`
5. **Name:** `Benutzer mit Urlaube`
6. **Mode:** `On page load` (automatisch laden beim Seitenaufruf)
7. Klicke auf **"Save"**

### Schritt 5.3: Actions hinzufügen

**Action 1: Urlaub erstellen (POST)**
1. Klicke auf **"+ Add Action"**
2. **Endpoint:** `/urlaub_erstellen`
3. **Method:** `POST`
4. **Name:** `Urlaub erstellen`
5. Klicke auf **"Save"**

**Action 2: Urlaub aktualisieren (PATCH)**
1. Klicke auf **"+ Add Action"**
2. **Endpoint:** `/urlaub_aktualisieren/{urlaub_id}`
3. **Method:** `PATCH`
4. **Name:** `Urlaub aktualisieren`
5. Klicke auf **"Save"**

**Action 3: Urlaub löschen (DELETE)**
1. Klicke auf **"+ Add Action"**
2. **Endpoint:** `/urlaub_loeschen/{urlaub_id}`
3. **Method:** `DELETE`
4. **Name:** `Urlaub löschen`
5. Klicke auf **"Save"**

### Schritt 5.4: Urlaubsplaner-Komponente hinzufügen

1. Gehe zu deiner WeWeb-Seite (oder erstelle eine neue)
2. Klicke auf **"+ Add Element"**
3. Suche nach **"Urlaubsplaner"** (oder scrolle zu "Custom Components")
4. Ziehe die Komponente auf deine Seite

### Schritt 5.5: Komponente mit Xano Collection verbinden

1. Wähle die Urlaubsplaner-Komponente aus
2. Im Properties-Panel auf der rechten Seite:
3. Scrolle zu **"benutzer_liste"** (Benutzerliste)
4. Klicke auf das **Binding-Icon** 🔗 (neben dem Feld)
5. Wähle **"Data Sources" → "Urlaubsplanung Xano" → "Benutzer mit Urlaube"**
6. Klicke auf **"Bind"**

**Das war's!** Die Komponente zeigt jetzt automatisch alle Benutzer mit ihren Urlauben an.

### Schritt 5.6: Komponente konfigurieren (Optional)

**Zeitraum einstellen:**
1. **kalender_startdatum**: Klicke auf das Feld
2. Gib ein Startdatum ein: z.B. `2025-11-01`
3. **anzahl_monate**: Wähle z.B. `3` (zeigt 3 Monate an)

**Farben anpassen:**
1. Gehe zum **"Style"**-Tab
2. Passe Farben an:
   - **genehmigte_urlaub_farbe**: z.B. Grün `#51cf66`
   - **ausstehende_urlaub_farbe**: z.B. Gelb `#ffd43b`
   - **abgelehnte_urlaub_farbe**: z.B. Rot `#ff6b6b`
   - **krankmeldung_farbe**: z.B. Orange `#ff8787`

**Weitere Einstellungen:**
- **navigation_anzeigen**: `true` (zeigt Vor/Zurück Buttons)
- **wochenenden_anzeigen**: `true` (zeigt Wochenenden an)
- **sprache**: `de-DE` (Deutsch)

---

## 6. Workflows konfigurieren

### Workflow 1: Neuen Urlaub erstellen (Drag-to-Select)

Dieser Workflow wird ausgelöst, wenn ein Benutzer eine Datumsbereich auswählt (per Drag & Drop).

#### Schritt 6.1: Workflow erstellen

1. Wähle die Urlaubsplaner-Komponente aus
2. Gehe zum **"Workflows"**-Tab (oben rechts)
3. Klicke auf **"+ Add Workflow"**
4. **Trigger:** `bei_datumsbereich_auswahl` (On Date Range Select)
5. Klicke auf **"Create"**

#### Schritt 6.2: Popup für Urlaubs-Details hinzufügen

**Option A: Mit Popup (empfohlen für mehr Kontrolle)**

1. **Action:** `Open Popup`
2. Wähle ein Popup aus (oder erstelle ein neues)
3. **Popup-Inhalt:**
   - Formular mit Feldern:
     - Typ (Dropdown: urlaub, krank, geschaeftsreise, fortbildung)
     - Status (Dropdown: ausstehend, genehmigt)
   - "Speichern"-Button
   - "Abbrechen"-Button

4. **Pass Data to Popup:**
   - `employeeId`: `event.employeeId`
   - `startDate`: `event.startDate`
   - `endDate`: `event.endDate`
   - `dayCount`: `event.dayCount`

5. Im Popup, beim Klick auf "Speichern":
   - **Action:** Xano Request
   - **Data Source:** Urlaubsplanung Xano
   - **Action:** Urlaub erstellen
   - **Body:**
     ```javascript
     {
       "benutzer_id": popup.employeeId,
       "startdatum": popup.startDate,
       "enddatum": popup.endDate,
       "typ": formular.typ.value,
       "status": formular.status.value
     }
     ```
   - **On Success:**
     - Refresh Collection "Benutzer mit Urlaube"
     - Close Popup

**Option B: Direktes Erstellen (ohne Popup)**

1. **Action:** Xano Request
2. **Data Source:** Urlaubsplanung Xano
3. **Action:** Urlaub erstellen
4. **Body:**
   ```javascript
   {
     "benutzer_id": event.employeeId,
     "startdatum": event.startDate,
     "enddatum": event.endDate,
     "typ": "urlaub",
     "status": "ausstehend"
   }
   ```
5. **On Success:**
   - Refresh Collection "Benutzer mit Urlaube"

---

### Workflow 2: Urlaub bearbeiten (Klick auf Urlaubsbalken)

Dieser Workflow wird ausgelöst, wenn ein Benutzer auf einen Urlaubsbalken klickt.

#### Schritt 6.3: Workflow erstellen

1. Wähle die Urlaubsplaner-Komponente aus
2. **Workflows** → **"+ Add Workflow"**
3. **Trigger:** `bei_urlaub_klick` (On Vacation Click)
4. Klicke auf **"Create"**

#### Schritt 6.4: Bearbeitungs-Popup öffnen

1. **Action:** `Open Popup`
2. Wähle ein Bearbeitungs-Popup aus
3. **Popup-Inhalt:**
   - Formular mit vorausgefüllten Feldern:
     - Startdatum (Datepicker)
     - Enddatum (Datepicker)
     - Typ (Dropdown)
     - Status (Dropdown)
   - "Speichern"-Button
   - "Löschen"-Button
   - "Abbrechen"-Button

4. **Pass Data to Popup:**
   - `urlaubId`: `event.vacation.id`
   - `startDate`: `event.startDate`
   - `endDate`: `event.endDate`
   - `typ`: `event.type`
   - `status`: `event.status`

5. Im Popup:

**"Speichern"-Button Workflow:**
- **Action:** Xano Request
- **Data Source:** Urlaubsplanung Xano
- **Action:** Urlaub aktualisieren
- **Path Parameters:**
  - `urlaub_id`: `popup.urlaubId`
- **Body:**
  ```javascript
  {
    "startdatum": formular.startdatum.value,
    "enddatum": formular.enddatum.value,
    "typ": formular.typ.value,
    "status": formular.status.value
  }
  ```
- **On Success:**
  - Refresh Collection "Benutzer mit Urlaube"
  - Close Popup

**"Löschen"-Button Workflow:**
- **Action:** Confirm Dialog ("Möchten Sie diesen Urlaub wirklich löschen?")
- **On Confirm:**
  - **Action:** Xano Request
  - **Data Source:** Urlaubsplanung Xano
  - **Action:** Urlaub löschen
  - **Path Parameters:**
    - `urlaub_id`: `popup.urlaubId`
  - **On Success:**
    - Refresh Collection "Benutzer mit Urlaube"
    - Close Popup

---

### Workflow 3: Status schnell ändern (Alternative)

Falls du einen schnellen Status-Wechsel willst (z.B. mit Rechtsklick).

#### Schritt 6.5: Kontextmenü-Workflow

1. **Trigger:** `bei_urlaub_klick`
2. **Condition:** Rechtsklick (falls du das unterscheiden möchtest)
3. **Action:** Show Context Menu
4. **Menu Items:**
   - "Genehmigen"
   - "Ablehnen"
   - "Bearbeiten"
   - "Löschen"

5. **Bei "Genehmigen":**
   - **Action:** Xano Request
   - **Action:** Urlaub aktualisieren
   - **Path:** `urlaub_id` = `event.vacation.id`
   - **Body:** `{ "status": "genehmigt" }`
   - **On Success:** Refresh Collection

6. **Bei "Ablehnen":**
   - Gleich wie "Genehmigen", aber `"status": "abgelehnt"`

---

## 7. Testing und Troubleshooting

### Test 1: Daten anzeigen

**Test:**
1. Öffne die WeWeb-Seite mit der Komponente
2. Überprüfe, ob alle Benutzer angezeigt werden
3. Überprüfe, ob Urlaube korrekt angezeigt werden

**Troubleshooting:**
- **Keine Daten sichtbar:**
  - Überprüfe Xano Collection: Data → Benutzer mit Urlaube → "Fetch" klicken
  - Überprüfe Browser Console auf Fehler
  - Überprüfe Binding: benutzer_liste sollte auf Collection gebunden sein

- **Urlaube nicht sichtbar:**
  - Überprüfe Foreign Key Beziehung in Xano
  - Überprüfe "Add Related Records" im Endpoint
  - Überprüfe Datumsbereich: Sind Urlaube im angezeigten Zeitraum?

---

### Test 2: Urlaub erstellen

**Test:**
1. Ziehe mit der Maus über mehrere Tage in einer Mitarbeiter-Zeile
2. Überprüfe, ob der Workflow ausgelöst wird
3. Falls Popup: Fülle Formular aus und speichere
4. Überprüfe, ob neuer Urlaub angezeigt wird

**Troubleshooting:**
- **Workflow wird nicht ausgelöst:**
  - Überprüfe Workflow-Trigger: bei_datumsbereich_auswahl
  - Überprüfe Browser Console

- **Urlaub wird nicht erstellt:**
  - Überprüfe Xano Action Binding
  - Überprüfe Body-Mapping in der Action
  - Überprüfe Xano Endpoint: Teste direkt in Xano "Run & Debug"

- **Urlaub erscheint nicht sofort:**
  - Überprüfe "Refresh Collection" Action nach Success
  - Überprüfe Collection Mode: sollte "On page load" + "On refresh" sein

---

### Test 3: Urlaub bearbeiten

**Test:**
1. Klicke auf einen Urlaubsbalken
2. Popup sollte sich öffnen mit vorausgefüllten Daten
3. Ändere z.B. Status auf "genehmigt"
4. Speichere
5. Überprüfe, ob Farbe sich ändert

**Troubleshooting:**
- **Popup öffnet sich nicht:**
  - Überprüfe Workflow-Trigger: bei_urlaub_klick
  - Überprüfe Popup-Binding

- **Daten nicht vorausgefüllt:**
  - Überprüfe "Pass Data to Popup"
  - Überprüfe Event-Daten: event.vacation, event.startDate, etc.

- **Update funktioniert nicht:**
  - Überprüfe Path Parameter: urlaub_id
  - Überprüfe Body-Mapping
  - Teste Endpoint direkt in Xano

---

### Test 4: Urlaub löschen

**Test:**
1. Klicke auf Urlaubsbalken
2. Klicke auf "Löschen"-Button
3. Bestätige Löschung
4. Urlaub sollte verschwinden

**Troubleshooting:**
- **Löschung funktioniert nicht:**
  - Überprüfe Path Parameter: urlaub_id
  - Teste DELETE Endpoint direkt in Xano
  - Überprüfe Xano Berechtigungen (falls vorhanden)

---

## 8. Häufige Fehler und Lösungen

### Fehler 1: "Foreign key constraint failed"

**Problem:** Beim Erstellen eines Urlaubs mit ungültiger `benutzer_id`

**Lösung:**
- Überprüfe, ob `benutzer_id` existiert in der `user` Tabelle
- Überprüfe Foreign Key Beziehung in Xano
- Stelle sicher, dass `benutzer_id` als Integer übergeben wird (nicht String)

---

### Fehler 2: "Date format invalid"

**Problem:** Datum wird nicht akzeptiert

**Lösung:**
- Xano erwartet Datumsformat: `YYYY-MM-DD`
- Überprüfe, ob Datum korrekt formatiert ist
- Alternativ: Ändere Feld-Typ in Xano zu `text` statt `date`

---

### Fehler 3: Urlaube werden nicht angezeigt

**Problem:** Komponente zeigt keine Urlaubsbalken

**Mögliche Ursachen:**
1. **Datumsbereich:** Urlaube liegen außerhalb des angezeigten Zeitraums
   - **Lösung:** Passe `kalender_startdatum` und `anzahl_monate` an

2. **Verschachtelung fehlt:** Xano gibt keine `urlaube` Array zurück
   - **Lösung:** Überprüfe "Add Related Records" im Endpoint

3. **Feldnamen stimmen nicht:** Xano verwendet andere Feldnamen
   - **Lösung:** Überprüfe Feldnamen in Xano vs. Komponente

---

### Fehler 4: "Collection not found"

**Problem:** WeWeb findet die Xano Collection nicht

**Lösung:**
- Überprüfe Data Source Verbindung
- Teste Endpoint direkt in Xano
- Überprüfe Base URL in WeWeb
- Stelle sicher, dass Endpoint "Published" ist in Xano

---

## 9. Erweiterte Konfiguration

### Filter nach Abteilung

Falls du mehrere Abteilungen hast:

**In Xano:**
1. Füge Feld `abteilung` zur `user` Tabelle hinzu
2. Erstelle Endpoint `/benutzer_nach_abteilung/{abteilung}`
3. Filter: `user.abteilung = path.abteilung`

**In WeWeb:**
1. Erstelle mehrere Collections mit verschiedenen Abteilungen
2. Oder: Verwende Collection mit dynamischem Filter

---

### Mehrere Kalender auf einer Seite

1. Füge mehrere Urlaubsplaner-Komponenten hinzu
2. Binde jede an eine andere Collection
3. Beispiel:
   - Komponente 1: Alle Mitarbeiter
   - Komponente 2: Nur Team A
   - Komponente 3: Nur Ausstehende Urlaube

---

### Benachrichtigungen bei neuem Urlaub

**In Xano:**
1. Füge "Send Email" Function zum `/urlaub_erstellen` Endpoint hinzu
2. Nach "Add Record": Klicke auf "+" → "Send Email"
3. Konfiguriere:
   - **To:** Manager E-Mail
   - **Subject:** "Neuer Urlaubsantrag"
   - **Body:** Details zum Urlaub

**In WeWeb:**
1. Nach erfolgreichem Erstellen: Zeige Toast Notification
2. **Action:** Show Notification
3. **Message:** "Urlaubsantrag erfolgreich eingereicht!"

---

## 10. Produktions-Deployment

### Checkliste vor Go-Live

- [ ] Alle Endpoints getestet in Xano
- [ ] Foreign Keys korrekt konfiguriert
- [ ] WeWeb Collection lädt Daten korrekt
- [ ] Workflows für Create/Update/Delete funktionieren
- [ ] Fehlerbehandlung implementiert (z.B. bei fehlgeschlagenen Requests)
- [ ] Berechtigungen in Xano konfiguriert (falls benötigt)
- [ ] Benachrichtigungen konfiguriert (falls benötigt)
- [ ] Mobile Responsiveness getestet
- [ ] Browser-Kompatibilität getestet

---

### API-Authentifizierung (optional)

Falls deine API geschützt werden soll:

**In Xano:**
1. Füge Authentication zu deinen Endpoints hinzu
2. Verwende JWT oder API Keys

**In WeWeb:**
1. Konfiguriere Auth in der Data Source
2. Füge Auth Header zu Requests hinzu

---

## 11. Zusammenfassung

### Was haben wir erstellt?

✅ **Xano Backend:**
- `user` Tabelle mit Benutzern
- `urlaube` Tabelle mit Urlaubsdaten
- Foreign Key Beziehung zwischen Tabellen
- GET Endpoint für verschachtelte Daten
- POST/PATCH/DELETE Endpoints für CRUD Operationen

✅ **WeWeb Frontend:**
- Urlaubsplaner-Komponente
- Xano Data Source Verbindung
- Collection für Benutzer + Urlaube
- Workflows für Create/Update/Delete
- Popups für Benutzerinteraktionen

✅ **Features:**
- Drag-to-Select für neue Urlaube
- Klick zum Bearbeiten
- Farb-codierte Status
- Verschiedene Urlaubstypen
- Automatische Synchronisation mit Xano

---

**Du bist jetzt bereit, den Urlaubsplaner in Produktion zu verwenden! 🎉**

Bei Fragen oder Problemen, überprüfe die Troubleshooting-Sektion oder kontaktiere den Support.
