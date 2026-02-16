<template>
  <div class="generalConfig">
    <form name="generalConfigForm">
      <openwb-base-card title="Steuerungsmodus">
        <openwb-base-alert subtype="info">
          <p>
            Wird für den Steuerungsmodus "primary" gewählt, übernimmt diese openWB die alleinige Regelung und steuert
            ggf. vorhandene weitere openWB (z.B. secondary openWB, openWB Pro, Satellit u.a.) fern. Diese werden in den
            Ladepunkt-Einstellungen der primary-openWB hinzugefügt.
          </p>
          <p>
            Wird für den Steuerungsmodus "secondary" gewählt, übernimmt diese openWB keine Regelung und muss von einer
            anderen primary openWB ferngesteuert werden. Wichtig ist, dass in der secondary-openWB eine "interne openWB"
            mit der korrekten Bauart (= openWB-Hardwarevariante z.B. "Custom, Standard, Standard+, Duo, Buchse")
            konfiguriert ist. Bei einer Duo sind zwei "interne openWB" zu konfigurieren. Im "secondary"-Modus bleiben
            alle ausgeblendeten Einstellungen unbeachtet.
          </p>
        </openwb-base-alert>

        <openwb-base-button-group-input
          title="Steuerungsmodus"
          :buttons="[
            {
              buttonValue: false,
              text: 'primary',
              class: 'btn-outline-danger',
            },
            {
              buttonValue: true,
              text: 'secondary',
              class: 'btn-outline-success',
            },
          ]"
          :model-value="$store.state.mqtt['openWB/general/extern']"
          @update:model-value="updateState('openWB/general/extern', $event)"
        />
        <div v-if="!installAssistantActive">
          <openwb-base-button-group-input
            v-if="$store.state.mqtt['openWB/general/extern'] === true"
            title="Steuerung über Modbus als secondary"
            :buttons="[
              {
                buttonValue: false,
                text: 'Aus',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'An',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/modbus_control']"
            @update:model-value="updateState('openWB/general/modbus_control', $event)"
          >
            <template #help>
              Im secondary-Modus kann die openWB über die Modbus-Schnittstelle gesteuert werden. Die Register sind
              <a
                href="https://openwb.de/main/wp-content/uploads/2023/10/ModbusTCP-openWB-series2-Pro-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                hier
              </a>
              dokumentiert. Bei aktivierter Modbus-Schnittstelle darf die openWB nicht von einer primary-openWB
              gesteuert werden.
            </template>
          </openwb-base-button-group-input>
          <div
            v-if="
              $store.state.mqtt['openWB/general/extern'] === true &&
              $store.state.mqtt['openWB/general/modbus_control'] !== true
            "
          >
            <openwb-base-alert
              subtype="info"
              class="mb-2"
            >
              Wenn die Steuerung über Modbus auf "Aus" geändert wird, muss danach ein Neustart durchgeführt werden!
            </openwb-base-alert>
          </div>
        </div>
        <div v-if="!installAssistantActive">
          <openwb-base-button-group-input
            title="HTTP-API"
            :buttons="[
              {
                buttonValue: false,
                text: 'Aus',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'An',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/http_api']"
            @update:model-value="updateState('openWB/general/http_api', $event)"
          >
            <template #help>
              <p>
                Mit der HTTP-API kann man den Wert eines MQTT-Topics per HTTPs abfragen oder neu setzen. Die
                Schnittstelle ist
                <a
                  href="https://openwb.de/main/wp-content/uploads/2025/02/HTTP-API-fuer-openWB-series1-und-series2.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hier
                </a>
                dokumentiert.
              </p>
            </template>
          </openwb-base-button-group-input>
        </div>
      </openwb-base-card>
      <div v-if="!installAssistantActive">
        <openwb-base-card title="Hardware">
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
              befindet.
            </openwb-base-alert>
          </div>
          <div v-if="$store.state.mqtt['openWB/general/extern'] === false">
            <openwb-base-button-group-input
              title="Geschwindigkeit Regelintervall"
              :buttons="[
                {
                  buttonValue: 10,
                  text: 'Normal',
                  class: 'btn-outline-success',
                },
                {
                  buttonValue: 20,
                  text: 'Langsam',
                  class: 'btn-outline-warning',
                },
                {
                  buttonValue: 60,
                  text: 'Sehr Langsam',
                  class: 'btn-outline-danger',
                },
              ]"
              :model-value="$store.state.mqtt['openWB/general/control_interval']"
              @update:model-value="updateState('openWB/general/control_interval', $event)"
            >
              <template #help>
                Sollten Probleme oder Fehlermeldungen auftauchen, stelle bitte zunächst das Regelintervall auf "Normal".
                Werden Module genutzt, welche z.B. eine Online-API zur Abfrage nutzen (höhere Latenzzeiten) oder möchte
                man weniger Regeleingriffe, so kann man das Regelintervall auf "Langsam" (20 Sekunden) herabsetzen. Die
                Einstellung „Sehr Langsam“ führt zu einer Regelzeit von 60 Sekunden.<br />
                <span class="text-danger">
                  Nicht nur die Regelung der PV geführten Ladung, sondern auch die Ladestromänderung, beispielsweise
                  “Stop“ etc., werden dann nur noch in diesem Intervall ausgeführt. Die Regelung wird insgesamt träger.
                  Solange es keinen triftigen Grund gibt, sollte "Normal" gewählt werden.
                </span>
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Netzschutz"
              :buttons="[
                {
                  buttonValue: false,
                  text: 'Aus',
                  class: 'btn-outline-danger',
                },
                {
                  buttonValue: true,
                  text: 'An',
                  class: 'btn-outline-success',
                },
              ]"
              :model-value="$store.state.mqtt['openWB/general/grid_protection_configured']"
              @update:model-value="updateState('openWB/general/grid_protection_configured', $event)"
            >
              <template #help>
                Diese Option ist standardmäßig aktiviert und sollte so belassen werden. Bei Unterschreitung einer
                kritischen Frequenz des Stromnetzes wird die Ladung nach einer zufälligen Zeit zwischen 1 und 90
                Sekunden pausiert. Der Lademodus wechselt auf "Stop". Sobald die Frequenz wieder in einem normalen
                Bereich ist wird automatisch der zuletzt gewählte Lademodus wieder aktiviert. Ebenso wird die Ladung bei
                Überschreiten von 51,8 Hz unterbrochen. Dies ist dann der Fall, wenn der Energieversorger
                Wartungsarbeiten am (Teil-)Netz durchführt und auf einen vorübergehenden Generator-Betrieb umschaltet.
                Die Erhöhung der Frequenz wird durchgeführt, um die PV Anlagen abzuschalten.<br />
                <span class="text-danger">
                  Die Option ist nur aktiv, wenn der EVU-Zähler die Frequenz übermittelt.
                </span>
              </template>
            </openwb-base-button-group-input>
          </div>
        </openwb-base-card>
      </div>
      <openwb-base-card
        v-if="!installAssistantActive"
        title="Bedienung & Darstellung"
      >
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            title="Temporäre Ladeeinstellungen"
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/temporary_charge_templates_active']"
            @update:model-value="updateState('openWB/general/temporary_charge_templates_active', $event)"
          >
            <template #help>
              <p>
                Bei Auswahl "Ja" werden Änderungen am Ladepunkt über die Hauptseite oder den Touchscreen der openWB als
                "temporäre" Eingaben behandelt. Dies erlaubt z.B. das schnelle, temporäre Umschalten des Lademodus oder
                deren Detaileinstellungen für eine unplanmäßige Ladeanforderung (Bsp. Voreinstellung -> PV-Laden /
                unplanmäßig -> Sofort-Laden für Laden wegen unplanmäßigen Termins).
                <br />
                Alle Einstellungen, die unter Einstellungen → Konfiguration → Fahrzeuge → Lade-Profil für das jeweilige
                Fahrzeug konfiguriert sind, gelten als persistent (dauerhaft). Diese werden bei jedem Abstecken des
                jeweiligen Fahrzeugs neu geladen - sind also Voreinstellungen (default).
              </p>
              <p>
                Bei Auswahl "Nein" werden Änderungen am Ladepunkt über die Hauptseite oder den Touchscreen der openWB
                direkt als "persistente" (dauerhafte) Eingaben behandelt.
              </p>
              <p>
                Eine ausführliche Erläuterung mit Beispielen findet Ihr im
                <a
                  href="https://wiki.openwb.de/doku.php?id=openwb:vc:2.1.9:software:einstell-konfig:einstellungen:allgemein#temporaere_ladeeinstellungen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  openWB-DokuWiki
                </a>
              </p>
            </template>
          </openwb-base-button-group-input>
          <openwb-base-heading class="mt-0"> Hauptseite </openwb-base-heading>
          <div v-if="$store.state.mqtt['openWB/general/web_theme'] !== undefined">
            <openwb-base-select-input
              class="mb-2"
              title="Theme"
              :groups="webThemeGroupList"
              :model-value="$store.state.mqtt['openWB/general/web_theme'].type"
              @update:model-value="updateSelectedWebTheme($event)"
            />
            <openwb-web-theme-proxy
              v-if="$store.state.mqtt['openWB/general/web_theme'].type"
              :web-theme="$store.state.mqtt['openWB/general/web_theme']"
              @update:configuration="updateConfiguration('openWB/general/web_theme', $event)"
            />
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-card
        v-if="!installAssistantActive"
        title="Lade-Protokoll"
      >
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            title="Einheit für Entfernungen"
            :model-value="$store.state.mqtt['openWB/general/range_unit']"
            :buttons="[
              { buttonValue: 'km', text: 'Kilometer' },
              { buttonValue: 'mi', text: 'Meilen' },
            ]"
            @update:model-value="updateState('openWB/general/range_unit', $event)"
          />
          <openwb-base-heading> Auswahl der Datenfelder </openwb-base-heading>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.time_begin"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'time_begin')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'calendar']" />
              Beginn
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.time_end"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'time_end')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'calendar']" />
              Ende
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.time_time_charged"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'time_time_charged')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'clock']" />
              Dauer
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.data_costs"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'data_costs')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'coins']" />
              Kosten
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.data_power_source"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'data_power_source')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'pie-chart']" />
              Energieaufteilung
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.vehicle_name"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'vehicle_name')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'car']" />
              Name
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.vehicle_chargemode"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'vehicle_chargemode')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'car']" />
              Lademodus
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.vehicle_prio"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'vehicle_prio')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'car']" />
              Priorität
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.vehicle_rfid"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'vehicle_rfid')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'car']" />
              ID-Tag
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.vehicle_soc_at_start"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'vehicle_soc_at_start')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'car']" />
              SoC bei Ladebeginn
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.vehicle_soc_at_end"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'vehicle_soc_at_end')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'car']" />
              SoC bei Ladende
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.chargepoint_name"
            @update:model-value="updateState('openWB/general/charge_log_data_config', $event, 'chargepoint_name')"
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Name
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.chargepoint_serial_number"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'chargepoint_serial_number')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Seriennummer
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.data_imported_since_mode_switch"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'data_imported_since_mode_switch')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Geladene Energie
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.chargepoint_imported_at_start"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'chargepoint_imported_at_start')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Zählerstand bei Ladebeginn
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.chargepoint_imported_at_end"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'chargepoint_imported_at_end')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Zählerstand bei Ladeende
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.data_exported_since_mode_switch"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'data_exported_since_mode_switch')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Entladene Energie
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.chargepoint_exported_at_start"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'chargepoint_exported_at_start')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Zählerstand bei Entladebeginn
            </template>
          </openwb-base-button-group-input>
          <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="$store.state.mqtt['openWB/general/charge_log_data_config']?.chargepoint_exported_at_end"
            @update:model-value="
              updateState('openWB/general/charge_log_data_config', $event, 'chargepoint_exported_at_end')
            "
          >
            <template #title>
              <font-awesome-icon :icon="['fas', 'charging-station']" />
              Zählerstand bei Entladeende
            </template>
          </openwb-base-button-group-input>
          <!-- <openwb-base-button-group-input
            :buttons="[
              {
                buttonValue: false,
                text: 'Nein',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'Ja',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="
              $store.state.mqtt[
                'openWB/general/charge_log_data_config'
              ]?.data_power
            "
            @update:model-value="
              updateState(
                'openWB/general/charge_log_data_config',
                $event,
                'data_power',
              )
            "
          >
            <template #title>
              <font-awesome-icon

                :icon="['fas', 'charging-station']"
              />
              Durchschnittliche Leistung
            </template>
          </openwb-base-button-group-input> -->
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="generalConfigForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCar as fasCar,
  faChargingStation as fasChargingStation,
  faClock as fasClock,
  faCalendar as fasCalendar,
  faCoins as fasCoins,
  faPieChart as fasPieChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCar, fasChargingStation, fasClock, fasCalendar, fasCoins, fasPieChart);
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbWebThemeProxy from "../components/web_themes/OpenwbWebThemeProxy.vue";

export default {
  name: "OpenwbGeneralConfigView",
  components: {
    OpenwbWebThemeProxy,
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/charge_log_data_config",
        "openWB/general/control_interval",
        "openWB/general/extern",
        "openWB/general/external_buttons_hw",
        "openWB/general/grid_protection_configured",
        "openWB/general/http_api",
        "openWB/general/modbus_control",
        "openWB/general/notifications/configuration",
        "openWB/general/notifications/plug",
        "openWB/general/notifications/selected",
        "openWB/general/notifications/smart_home",
        "openWB/general/notifications/start_charging",
        "openWB/general/notifications/stop_charging",
        "openWB/general/price_kwh",
        "openWB/general/range_unit",
        "openWB/general/temporary_charge_templates_active",
        "openWB/general/web_theme",
        "openWB/system/configurable/web_themes",
        "openWB/system/ip_address",
      ],
    };
  },
  computed: {
    webThemeList: {
      get() {
        return this.$store.state.mqtt["openWB/system/configurable/web_themes"];
      },
    },
    webThemeGroupList: {
      get() {
        let groups = [
          { label: "openWB", options: [] },
          { label: "Community", options: [] },
        ];
        this.webThemeList?.forEach((theme) => {
          if (theme.official === true) {
            groups[0].options.push(theme);
          } else {
            groups[1].options.push(theme);
          }
        });
        return groups;
      },
    },
  },
  methods: {
    getIpAddress() {
      return this.$store.state.mqtt["openWB/system/ip_address"];
    },
    getWebThemeDefaults(webThemeType) {
      const webThemeDefaults = this.webThemeList.find((element) => element.value == webThemeType);
      if (Object.prototype.hasOwnProperty.call(webThemeDefaults, "defaults")) {
        return {
          ...JSON.parse(JSON.stringify(webThemeDefaults.defaults)),
        };
      }
      console.warn("no default configuration found for web theme type!", webThemeType);
      return {};
    },
    updateSelectedWebTheme($event) {
      this.updateState("openWB/general/web_theme", this.getWebThemeDefaults($event));
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
