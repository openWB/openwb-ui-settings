<template>
  <div class="generalChargeConfig">
    <form name="generalChargeConfigForm">
      <openwb-base-card title="Allgemein">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            title="Begrenzung der Schieflast"
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
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/unbalanced_load']"
            @update:model-value="updateState('openWB/general/chargemode_config/unbalanced_load', $event)"
          >
            <template #help>
              Wenn diese Option aktiviert ist, werden nicht-dreiphasige Ladevorgänge so geregelt, dass am
              Netzanschlusspunkt (EVU-Zähler) die eingestellte Grenze für die Schieflast nicht überschritten wird.
              Hierfür muss der EVU-Zähler einzelne Phasenströme bereitstellen!<br />
              Weiterhin müssen bei den Ladepunkten sowie Fahrzeugen sämtliche Angaben zur Anzahl
              angeschlossener/unterstützter Phasen und der Phasenrotation hinterlegt werden, damit der Regelung bekannt
              ist, welcher Ladevorgang welche Phase am Netzanschluss beeinflusst. siehe "Konfiguration - Ladepunkte ->
              elektrischer Anschluss - Phase 1" und "Konfiguration - Fahrzeuge -> Fahrzeug-Profile"
            </template>
          </openwb-base-button-group-input>
          <openwb-base-range-input
            v-if="$store.state.mqtt['openWB/general/chargemode_config/unbalanced_load']"
            title="Erlaubte Schieflast"
            :min="10"
            :max="32"
            :step="1"
            unit="A"
            :model-value="$store.state.mqtt['openWB/general/chargemode_config/unbalanced_load_limit']"
            @update:model-value="updateState('openWB/general/chargemode_config/unbalanced_load_limit', $event)"
          >
            <template #help>
              Hiermit wird festgelegt, welche Schieflast am Netzanschlusspunkt erlaubt ist. Bei Überschreitung werden
              gezielt einzelne Ladevorgänge in der Leistung begrenzt.
            </template>
          </openwb-base-range-input>
        </div>
      </openwb-base-card>
      <openwb-base-card title="OCPP Anbindung">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-button-group-input
            title="OCPP aktivieren"
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
            :model-value="$store.state.mqtt['openWB/optional/ocpp/config']?.active"
            @update:model-value="updateState('openWB/optional/ocpp/config', $event, 'active')"
          />
          <div v-if="$store.state.mqtt['openWB/optional/ocpp/config']?.active === true">
            <openwb-base-alert subtype="info">
              Die Ladepunkte übermitteln den ID-Tag, Heartbeat und den Zählerstand zum Zeitpunkt des Ansteckens,
              Absteckens sowie alle 5 Minuten. Eine Steuerung per OCPP ist nicht möglich.<br />
              Alle Ladepunkte, die ihre Daten an das OCPP-Backend übermitteln sollen, müssen zunächst im OCPP-Backend
              angelegt werden. Die dort eingetragene Chargebox ID muss in der openWB unter Einstellungen ->
              Konfiguration im zugehörigen -> Ladepunkt eingetragen werden.
            </openwb-base-alert>
            <openwb-base-text-input
              title="URL des OCPP-Backends"
              subtype="url"
              :model-value="$store.state.mqtt['openWB/optional/ocpp/config']?.url"
              @update:model-value="updateState('openWB/optional/ocpp/config', $event, 'url')"
            />
            <openwb-base-select-input
              title="Version"
              not-selected="Bitte auswählen"
              :options="[
                { value: 'ocpp1.6', text: 'OCPP 1.6' },
                { value: 'ocpp2.0.1', text: 'OCPP 2.0.1' },
              ]"
              :model-value="$store.state.mqtt['openWB/optional/ocpp/config']?.version"
              @update:model-value="updateState('openWB/optional/ocpp/config', $event, 'version')"
            />
          </div>
        </div>
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="generalChargeConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbGeneralChargeConfigView",
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/general/chargemode_config/unbalanced_load", writeable: true },
        { topic: "openWB/general/chargemode_config/unbalanced_load_limit", writeable: true },
        { topic: "openWB/general/extern", writeable: false },
        { topic: "openWB/optional/ocpp/config", writeable: true },
      ],
    };
  },
};
</script>
