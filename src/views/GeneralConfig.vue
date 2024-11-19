<template>
  <div class="generalConfig">
    <form name="generalConfigForm">
      <openwb-base-card title="Steuerungsmodus">
        <openwb-base-alert subtype="info">
          <p>
            Wird für den Steuerungsmodus "primary" gewählt, übernimmt diese openWB die alleinige Regelung und steuert
            ggf. vorhandene weitere openWB (z.B. externe openWB im Steuerungsmodus secondary, openWB Pro, Satellit u.a.)
            fern. Sie werden in den Ladepunkt-Einstellungen der primary-openWB hinzugefügt.
          </p>
          <p>
            Wird für den Steuerungsmodus "secondary" gewählt, übernimmt diese openWB keine Regelung und muss von einer
            anderen primary openWB ferngesteuert werden. Wichtig ist, dass in der secondary-openWB eine "interne openWB"
            mit der korrekten Bauart (= openWB-Hardwarevariante z.B. "Custom, Standard, Standard+, Duo, Buchse")
            konfiguriert ist. Bei einer Duo sind zwei "interne openWB" zu konfigurieren. Im "secondary"-Modus bleiben
            alle ausgeblendeten Einstellungen unbeachtet.<br />
            Eine bebilderte Anleitung zur Konfiguration der Ladepunkte findest Du auf der
            <a
              href="https://openwb.de/main/?page_id=1025"
              target="_blank"
              rel="noopener noreferrer"
            >
              Homepage </a
            >.
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
                Mit der HTTP-API kann man den Wert eines MQTT-Topics per HTTPs (Port 8443) abfragen oder neu setzen.
                Topics können über GET oder POST abgefragt, neue Werte nur mit POST gesetzt werden.
              </p>
              <p>Beispiel 1: Abfrage des aktuellen Systemzeitstempels</p>
              <ul>
                <li>
                  GET-Request:<br />
                  <openwb-base-copy-to-clipboard
                    class="text-info"
                    tooltip="URL kopieren"
                  >
                    https://{{ getIpAddress() }}:8443/v1/?topic=openWB/system/time
                  </openwb-base-copy-to-clipboard>
                </li>
                <li>
                  POST-Request über 'curl' mit privatem SSL-Zertifikat und Verarbeitung durch 'jq':<br />
                  <openwb-base-copy-to-clipboard
                    class="text-info"
                    tooltip="Befehl kopieren"
                  >
                    curl -k -s -X POST --data '{"topic":"openWB/system/time"}' https://{{ getIpAddress() }}:8443/v1/ |
                    jq .
                  </openwb-base-copy-to-clipboard>
                </li>
              </ul>
              <p>Die zurückgegebenen Daten sind im JSON-Format. Der Inhalt ist nach folgendem Schema aufgebaut:</p>
              <pre class="border border-info w-100 p-1">{{
                JSON.stringify(
                  {
                    status: "success",
                    topic: "openWB/system/time",
                    message: 1721287000.646975,
                  },
                  null,
                  4,
                )
              }}</pre>
              <p>Im Fehlerfall wird der Status auf "failed" gesetzt und eine Fehlermeldung zurückgegeben.</p>
              <p>Beispiel 2: integriertes Display abschalten</p>
              <ul>
                <li>
                  POST-Request über 'curl' mit privatem SSL-Zertifikat und Verarbeitung durch 'jq':<br />
                  <openwb-base-copy-to-clipboard
                    class="text-info"
                    tooltip="Befehl kopieren"
                  >
                    curl -k -s -X POST --data '{"topic": "openWB/set/optional/int_display/active", "message": false}'
                    https://{{ getIpAddress() }}:8443/v1/ | jq .
                  </openwb-base-copy-to-clipboard>
                </li>
              </ul>
              <p>Die zurückgegebenen Daten sind im JSON-Format. Der Inhalt ist nach folgendem Schema aufgebaut:</p>
              <pre class="border border-info w-100 p-1">{{
                JSON.stringify(
                  {
                    status: "success",
                    topic: "openWB/set/optional/int_display/active",
                    message: false,
                  },
                  null,
                  4,
                )
              }}</pre>
            </template>
          </openwb-base-button-group-input>
        </div>
      </openwb-base-card>
      <openwb-base-card title="Hardware">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-if="!installAssistantActive">
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

          <hr />
        </div>

        <div v-if="$store.state.mqtt['openWB/general/extern'] === false">
          <openwb-base-heading class="mt-0"> Steuerbare Verbrauchseinrichtung </openwb-base-heading>
          <openwb-base-alert sub_type="info">
            Aktuell unterstützt openWB die eingehende Steuerung als "Steuerbare Verbrauchseinrichtung" nur über
            potentialfreie Kontakte (Rundsteuerempfänger, RSE). Ebenfalls können derzeit bei Auslösung des RSE nur alle
            Ladevorgänge komplett beendet werden. Die Unterstützung von "Dimmung" im Sinne von §14a EnWG wird umgesetzt,
            sobald wir weitere Informationen von den Netzbetreibern erhalten, wie die Ansteuerung technisch umgesetzt
            wird.
          </openwb-base-alert>
          <openwb-base-select-input
            class="mb-2"
            title="Anbindung RSE-Kontakt"
            :options="rippleControlReceiverList"
            :model-value="
              $store.state.mqtt['openWB/general/ripple_control_receiver/module']
                ? $store.state.mqtt['openWB/general/ripple_control_receiver/module'].type
                : ''
            "
            @update:model-value="updateSelectedRippleControlReceiverModule($event)"
          />
          <div
            v-if="
              $store.state.mqtt['openWB/general/ripple_control_receiver/module'] &&
              $store.state.mqtt['openWB/general/ripple_control_receiver/module'].type
            "
          >
            <openwb-ripple-control-receiver-proxy
              :ripple-control-receiver="$store.state.mqtt['openWB/general/ripple_control_receiver/module']"
              @update:configuration="updateConfiguration('openWB/general/ripple_control_receiver/module', $event)"
            />
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-card
        v-if="!installAssistantActive"
        title="Darstellung"
      >
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'calendar']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'calendar']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'clock']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'coins']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'pie-chart']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'car']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'charging-station']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'charging-station']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'charging-station']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'charging-station']"
              />
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
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'charging-station']"
              />
              Zählerstand bei Ladeende
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
                fixed-width
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
import OpenwbRippleControlReceiverProxy from "../components/ripple_control_receivers/OpenwbRippleControlReceiverProxy.vue";

export default {
  name: "OpenwbGeneralConfigView",
  components: {
    OpenwbWebThemeProxy,
    OpenwbRippleControlReceiverProxy,
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
        "openWB/general/ripple_control_receiver/module",
        "openWB/general/web_theme",
        "openWB/system/configurable/ripple_control_receivers",
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
        this.webThemeList.forEach((theme) => {
          if (theme.official === true) {
            groups[0].options.push(theme);
          } else {
            groups[1].options.push(theme);
          }
        });
        return groups;
      },
    },
    rippleControlReceiverList() {
      return this.$store.state.mqtt["openWB/system/configurable/ripple_control_receivers"];
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
    getRippleControlReceiverDefaultConfiguration(rippleControlReceiverType) {
      const rippleControlReceiverDefaults = this.rippleControlReceiverList.find(
        (element) => element.value == rippleControlReceiverType,
      );
      if (Object.prototype.hasOwnProperty.call(rippleControlReceiverDefaults, "defaults")) {
        return { ...rippleControlReceiverDefaults.defaults };
      }
      console.warn("no default configuration found for electricity tariff type!", rippleControlReceiverType);
      return {};
    },
    updateSelectedRippleControlReceiverModule($event) {
      this.updateState("openWB/general/ripple_control_receiver/module", $event, "type");
      this.updateState(
        "openWB/general/ripple_control_receiver/module",
        this.getRippleControlReceiverDefaultConfiguration($event),
      );
    },
  },
};
</script>
