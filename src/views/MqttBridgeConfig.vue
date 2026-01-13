<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showMqttBridgeModal"
    title="MQTT-Brücke löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeMqttBridge(modalMqttBridgeIndex, $event)"
  >
    Willst Du die MQTT-Brücke "{{ getMqttBridgeName(modalMqttBridgeIndex) }}" wirklich entfernen? Dieser Vorgang kann
    nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <!-- main content -->
  <div class="mqttBridgeConfiguration">
    <openwb-base-alert subtype="danger">
      ACHTUNG: Die Konfiguration einer MQTT-Brücke erlaubt allen Nutzern mit Zugang zum entfernten MQTT-Server alle
      weitergeleiteten Daten dieser openWB einzusehen!<br />
      Es wird dringend empfohlen, dies nur für nicht-öffentliche MQTT-Server unter Verwendung starker
      Transport-Verschlüsselung (TLS) mit persönlichem Login und strenger Zugriffskontrolle (zumindest für die
      MQTT-Themen unterhalb von "Entfernter Präfix") zu aktivieren!
    </openwb-base-alert>
    <openwb-base-card title="Konfigurierte MQTT-Brücken">
      <template #actions>
        <openwb-base-avatar
          v-if="$store.state.mqtt['openWB/general/extern'] === false"
          class="bg-success clickable"
          @click="addMqttBridge"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </openwb-base-avatar>
      </template>
      <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
        <openwb-base-alert subtype="info">
          Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
        </openwb-base-alert>
      </div>
      <div v-else>
        <openwb-base-alert
          v-if="Object.keys(configuredMqttBridges).length === 0"
          subtype="info"
        >
          Es wurde noch keine MQTT-Brücke konfiguriert.
        </openwb-base-alert>
        <form
          v-for="(mqttBridge, mqttBridgeKey) in configuredMqttBridges"
          :key="mqttBridgeKey"
          :name="'mqttBridgeConfigurationForm' + getMqttBridgeIndex(mqttBridgeKey)"
        >
          <openwb-base-card
            :title="mqttBridge.name"
            :collapsible="true"
            :collapsed="true"
            subtype="primary"
          >
            <template #actions>
              <openwb-base-avatar
                class="bg-danger clickable"
                @click="removeMqttBridgeModal(mqttBridgeKey, $event)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </openwb-base-avatar>
            </template>
            <openwb-base-text-input
              title="Bezeichnung"
              subtype="text"
              required
              pattern="[A-Za-z0-9]+"
              :model-value="mqttBridge.name"
              @update:model-value="updateState(mqttBridgeKey, $event, 'name')"
            >
              <template #help> Die Bezeichnung darf nur aus Buchstaben ohne Umlaute und Zahlen bestehen. </template>
            </openwb-base-text-input>
            <openwb-base-button-group-input
              title="Brücke aktivieren"
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
              :model-value="mqttBridge.active"
              @update:model-value="updateState(mqttBridgeKey, $event, 'active')"
            />
            <hr />
            <openwb-base-heading> Einstellungen zur Verbindung </openwb-base-heading>
            <openwb-base-text-input
              title="Entfernter Server"
              subtype="host"
              required
              :model-value="mqttBridge.remote.host"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.host')"
            />
            <openwb-base-number-input
              title="Entfernter Port"
              required
              :min="1"
              :max="65535"
              :model-value="mqttBridge.remote.port"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.port')"
            />
            <openwb-base-text-input
              title="Benutzername"
              subtype="user"
              required
              pattern="[a-zA-Z0-9_\-+.]+"
              :model-value="mqttBridge.remote.username"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.username')"
            />
            <openwb-base-text-input
              title="Passwort"
              subtype="password"
              required
              :model-value="mqttBridge.remote.password"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.password')"
            />
            <openwb-base-text-input
              title="Präfix"
              subtype="text"
              pattern="[A-Za-z0-9_\-]+(\/[A-Za-z0-9_\-]+)?\/"
              :model-value="mqttBridge.remote.prefix"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.prefix')"
            >
              <template #help>
                Das Präfix darf nur aus Buchstaben ohne Umlaute, Zahlen, Binde- und Unterstrichen bestehen. Optional
                kann mit einem Schrägstrich "/" eine Topic-Struktur abgebildet werden. Am Ende des Präfixes muss ein
                Schrägstrich "/" stehen.
              </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              title="Client ID"
              subtype="text"
              required
              pattern="[A-Za-z0-9_\-]+"
              :model-value="mqttBridge.remote.client_id"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.client_id')"
            >
              <template #help>
                Die Client ID darf nur aus Buchstaben ohne Umlaute, Zahlen, Binde- und Unterstrichen bestehen.
              </template>
            </openwb-base-text-input>
            <openwb-base-button-group-input
              title="MQTT Protokoll"
              required="required"
              :buttons="[
                {
                  buttonValue: 'mqttv31',
                  text: 'v3.1',
                },
                {
                  buttonValue: 'mqttv311',
                  text: 'v3.1.1',
                },
              ]"
              :model-value="mqttBridge.remote.protocol"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.protocol')"
            />
            <openwb-base-button-group-input
              title="TLS Version"
              :buttons="[
                {
                  buttonValue: 'auto',
                  text: 'Automatisch',
                  class: 'btn-outline-success',
                },
                {
                  buttonValue: 'tlsv1.0',
                  text: 'v1.0',
                  class: 'btn-outline-warning',
                },
                {
                  buttonValue: 'tlsv1.1',
                  text: 'v1.1',
                  class: 'btn-outline-warning',
                },
                {
                  buttonValue: 'tlsv1.2',
                  text: 'v1.2',
                },
              ]"
              :model-value="mqttBridge.remote.tls_version"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.tls_version')"
            >
              <template #help>
                In der Einstellung "Automatisch" wird die Version zwischen Client und Server ausgehandelt. Wenn
                erforderlich, kann eine spezielle Version erzwungen werden. Versionen kleiner 1.2 gelten als veraltet
                und sollten nicht mehr verwendet werden.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Brücke signalisieren"
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
              :model-value="mqttBridge.remote.try_private"
              @update:model-value="updateState(mqttBridgeKey, $event, 'remote.try_private')"
            >
              <template #help>
                Aktiviert eine proprietäre Protokoll-Erweiterung des Mosquitto Brokers, welche dem entfernten Broker
                signalisiert, dass es sich um eine MQTT Brücke handelt. Ergibt bessere Leistung mit Mosquitto-Brokern,
                ist jedoch inkompatibel mit vielen anderen MQTT-Brokern. Daher bitte nur aktivieren, wenn der
                Ziel-Broker sicher ein Mosquitto-Broker ist.
              </template>
            </openwb-base-button-group-input>
            <hr />
            <openwb-base-heading> Datenübertragung </openwb-base-heading>
            <openwb-base-button-group-input
              title="Alle Statusdaten"
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
              :model-value="mqttBridge.data_transfer.status"
              @update:model-value="updateState(mqttBridgeKey, $event, 'data_transfer.status')"
            >
              <template #help>
                Wenn aktiviert, werden alle Statusdaten (z.B. Ladezustand, Leistung, Spannungen, Ströme, etc.) der
                angeschlossenen Komponenten und Ladepunkte übertragen.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Datenserien für Diagramme"
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
              :model-value="mqttBridge.data_transfer.graph"
              @update:model-value="updateState(mqttBridgeKey, $event, 'data_transfer.graph')"
            >
              <template #help>
                Wenn aktiviert, werden alle Datenserien für die Diagramme (z.B. Leistung über Zeit) der angeschlossenen
                Komponenten und Ladepunkte übertragen. Dies sind deutlich mehr Daten als bei den Statusdaten allein.<br />
                Diese Einstellung sollte nur aktiviert werden, wenn die Daten auch tatsächlich benötigt und
                interpretiert werden können. In der Regel werden die Daten nur für die Web- und Display-Themes benötigt
                und können daher bei einer MQTT-Brücke deaktiviert bleiben.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-button-group-input
              title="Fernkonfiguration ermöglichen"
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
              :model-value="mqttBridge.data_transfer.configuration"
              @update:model-value="updateState(mqttBridgeKey, $event, 'data_transfer.configuration')"
            >
              <template #help>
                Wenn aktiviert, können über die MQTT-Brücke auch Konfigurationsänderungen (z.B. Ladeleistung,
                Zeitsteuerungen, etc.) an die openWB über die Topics "openWB/set/*" gesendet werden. Dies sollte nur
                aktiviert werden, wenn der entfernte MQTT-Server und alle Nutzer, welche darauf Zugriff haben, absolut
                vertrauenswürdig sind. Ansonsten besteht die Gefahr, dass unbefugte Nutzer die Konfiguration der openWB
                verändern und z.B. den Ladevorgang manipulieren.
              </template>
            </openwb-base-button-group-input>
            <template #footer>
              <openwb-base-submit-buttons
                :form-name="'mqttBridgeConfigurationForm' + getMqttBridgeIndex(mqttBridgeKey)"
                :hide-defaults="true"
                @save="$emit('save', [mqttBridgeKey])"
                @reset="$emit('reset', [mqttBridgeKey])"
              />
            </template>
          </openwb-base-card>
        </form>
      </div>
    </openwb-base-card>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbMqttBridgeConfigurationView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  emits: ["sendCommand", "save", "reset"],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/general/extern", "openWB/system/mqtt/bridge/+"],
      showMqttBridgeModal: false,
      modalMqttBridgeIndex: undefined,
    };
  },
  computed: {
    configuredMqttBridges: {
      get() {
        let bridges = this.getWildcardTopics("openWB/system/mqtt/bridge/+");
        for (const [key, value] of Object.entries(bridges)) {
          if (value.remote.is_openwb_cloud) {
            delete bridges[key];
          }
        }
        return bridges;
      },
    },
  },
  methods: {
    addMqttBridge(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.$emit("sendCommand", {
        command: "addMqttBridge",
        data: {},
      });
    },
    getMqttBridgeIndex(bridgeKey) {
      return parseInt(bridgeKey.match(/(?:\/)(\d+)$/)[1]);
    },
    removeMqttBridgeModal(mqttBridge, event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.modalMqttBridgeIndex = this.getMqttBridgeIndex(mqttBridge);
      this.showMqttBridgeModal = true;
    },
    removeMqttBridge(mqttBridgeIndex, event) {
      this.showMqttBridgeModal = false;
      if (event == "confirm") {
        this.$emit("sendCommand", {
          command: "removeMqttBridge",
          data: { bridge: mqttBridgeIndex },
        });
      }
    },
    getMqttBridgeName(mqttBridgeIndex) {
      return this.$store.state.mqtt["openWB/system/mqtt/bridge/" + mqttBridgeIndex]
        ? this.$store.state.mqtt["openWB/system/mqtt/bridge/" + mqttBridgeIndex].name
        : mqttBridgeIndex;
    },
  },
};
</script>
