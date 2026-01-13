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
      <openwb-base-card title="Energiekosten">
        <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
          <openwb-base-alert subtype="info">
            Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet.
          </openwb-base-alert>
        </div>
        <div v-else>
          <openwb-base-heading class="mt-0">
            Berechnung der Ladekosten
            <template #help>
              Zur Berechnung der Ladekosten im Lade-Protokoll werden stundenweise die Anteile der Stromquellen
              (Speicher, Netz, PV) berechnet und mit den hier angegebenen Preisen multipliziert.<br />
              Ist die Abrechnung über das Ladeprotokoll, z.B. mit dem Arbeitgeber, vereinbart, ist bei allen drei
              Feldern der vereinbarte Preis einzutragen.
            </template>
          </openwb-base-heading>
          <openwb-base-alert
            v-if="
              $store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'] &&
              $store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'].type
            "
            subtype="info"
          >
            Für den Netzbezug wird der dynamische Strompreis des Anbieters für variable Stromtarife verwendet. Wenn
            keine dynamischen Strompreise abgefragt werden können, wird der eingetragene Preis für den Netzbezug
            verwendet.
          </openwb-base-alert>
          <openwb-base-number-input
            title="Preis für Netzbezug"
            :step="0.001"
            :precision="3"
            unit="ct/kWh"
            required
            :model-value="$store.state.mqtt['openWB/general/prices/grid'] * 100000"
            @update:model-value="updateState('openWB/general/prices/grid', parseFloat(($event / 100000).toFixed(7)))"
          />
          <openwb-base-number-input
            title="Preis für Speicherentladung"
            :step="0.001"
            :precision="3"
            unit="ct/kWh"
            required
            :model-value="$store.state.mqtt['openWB/general/prices/bat'] * 100000"
            @update:model-value="updateState('openWB/general/prices/bat', parseFloat(($event / 100000).toFixed(7)))"
          />
          <openwb-base-number-input
            title="Preis für PV-Strom"
            :step="0.001"
            :precision="3"
            unit="ct/kWh"
            required
            :model-value="$store.state.mqtt['openWB/general/prices/pv'] * 100000"
            @update:model-value="updateState('openWB/general/prices/pv', parseFloat(($event / 100000).toFixed(7)))"
          />
          <hr />
          <openwb-base-heading> Variable Strompreise </openwb-base-heading>
          <openwb-base-alert subtype="info">
            Ist in den Lademodi Eco und Zeitladen "Preisbasiertes Laden" gewählt, wird nur geladen, wenn der Strompreis
            unter dem angegebenen maximalen Strompreis liegt. Für Zielladen wird die Ladedauer ermittelt und dann zu den
            günstigsten Zeiten geladen.<br />
            Wenn keine Preise abgefragt werden können oder "Preisbasiertes Laden" abgewählt wurde, wird in Modus Eco
            immer geladen bzw. bei Zielladen zunächst mit PV-Überschuss und zum Erreichen des Zieltermins mit Netzstrom.
            Wenn sowohl dynamische Stromtarife als auch dynamische Netzentgelte konfiguriert sind, werden beide zum
            Gesamt-Strompreis addiert. Ist nur eines von beiden konfiguriert, wird dieses als Gesamtpreis verwendet.<br />
          </openwb-base-alert>
          <openwb-base-heading> Dynamische Stromtarife </openwb-base-heading>
          <openwb-base-select-input
            class="mb-2"
            title="Anbieter"
            :options="flexibleTariffList"
            :model-value="
              $store.state.mqtt['openWB/optional/ep/flexible_tariff/provider']
                ? $store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'].type
                : ''
            "
            @update:model-value="updateSelectedFlexibleTariff($event)"
          />
          <div
            v-if="
              $store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'] &&
              $store.state.mqtt['openWB/optional/ep/flexible_tariff/provider'].type
            "
          >
            <openwb-flexible-tariff-proxy
              :flexible-tariff="$store.state.mqtt['openWB/optional/ep/flexible_tariff/provider']"
              @update:configuration="updateConfiguration('openWB/optional/ep/flexible_tariff/provider', $event)"
            />
          </div>
          <openwb-base-heading> Dynamische Netzentgelte </openwb-base-heading>
          <openwb-base-select-input
            class="mb-2"
            title="Anbieter"
            :options="gridFeeList"
            :model-value="
              $store.state.mqtt['openWB/optional/ep/grid_fee/provider']
                ? $store.state.mqtt['openWB/optional/ep/grid_fee/provider'].type
                : ''
            "
            @update:model-value="updateSelectedGridFee($event)"
          />
          <div
            v-if="
              $store.state.mqtt['openWB/optional/ep/grid_fee/provider'] &&
              $store.state.mqtt['openWB/optional/ep/grid_fee/provider'].type
            "
          >
            <openwb-grid-fee-proxy
              :grid-fee="$store.state.mqtt['openWB/optional/ep/grid_fee/provider']"
              @update:configuration="updateConfiguration('openWB/optional/ep/grid_fee/provider', $event)"
            />
          </div>
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
              Absteckens und alle 5 Minuten. Eine Steuerung per OCPP ist nicht möglich.<br />
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
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbFlexibleTariffProxy from "../components/electricity_pricing/flexible_tariffs/OpenwbFlexibleTariffProxy.vue";
import OpenwbGridFeeProxy from "../components/electricity_pricing/grid_fees/OpenwbGridFeeProxy.vue";

export default {
  name: "OpenwbGeneralChargeConfigView",
  components: {
    OpenwbFlexibleTariffProxy,
    OpenwbGridFeeProxy,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/general/chargemode_config/unbalanced_load",
        "openWB/general/chargemode_config/unbalanced_load_limit",
        "openWB/general/prices/bat",
        "openWB/general/prices/grid",
        "openWB/general/prices/pv",
        "openWB/optional/ep/flexible_tariff/provider",
        "openWB/optional/ep/grid_fee/provider",
        "openWB/optional/ocpp/config",
        "openWB/system/configurable/flexible_tariffs",
        "openWB/system/configurable/grid_fees",
      ],
    };
  },
  computed: {
    flexibleTariffList() {
      return this.$store.state.mqtt["openWB/system/configurable/flexible_tariffs"];
    },
    gridFeeList() {
      return this.$store.state.mqtt["openWB/system/configurable/grid_fees"];
    },
  },
  methods: {
    getFlexibleTariffDefaultConfiguration(flexibleTariffType) {
      const flexibleTariffDefaults = this.flexibleTariffList.find((element) => element.value == flexibleTariffType);
      if (Object.prototype.hasOwnProperty.call(flexibleTariffDefaults, "defaults")) {
        return { ...flexibleTariffDefaults.defaults };
      }
      console.warn("no default configuration found for electricity tariff type!", flexibleTariffType);
      return {};
    },
    updateSelectedFlexibleTariff($event) {
      this.updateState("openWB/optional/ep/flexible_tariff/provider", $event, "type");
      this.updateState(
        "openWB/optional/ep/flexible_tariff/provider",
        this.getFlexibleTariffDefaultConfiguration($event),
      );
    },
    getGridFeeDefaultConfiguration(gridFeeType) {
      const gridFeeDefaults = this.gridFeeList.find((element) => element.value == gridFeeType);
      if (gridFeeDefaults && Object.prototype.hasOwnProperty.call(gridFeeDefaults, "defaults")) {
        return { ...gridFeeDefaults.defaults };
      }
      console.warn("no default configuration found for grid fee type!", gridFeeType);
      return {};
    },
    updateSelectedGridFee($event) {
      this.updateState("openWB/optional/ep/grid_fee/provider", $event, "type");
      this.updateState("openWB/optional/ep/grid_fee/provider", this.getGridFeeDefaultConfiguration($event));
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
