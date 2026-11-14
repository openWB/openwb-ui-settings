<template>
  <div class="electricityPricesConfig">
    <form name="electricityPricesConfigForm">
      <openwb-base-card title="Stromtarif">
        <div>
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
              befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
            <openwb-base-alert
              v-if="!flexibleTariffProvider?.type"
              subtype="warning"
            >
              Es ist kein Stromtarif eingerichtet. Die Ladekosten werden mit {{ fallbackPriceText }} berechnet. Wähle
              einen Anbieter, z. B. "Fester Stromtarif" für einen gleichbleibenden Preis.
            </openwb-base-alert>
            <openwb-base-alert subtype="info">
              <p>
                Der Stromtarif ist der Preis für Strom aus dem Netz. Er wird für die Berechnung der Ladekosten und für
                das preisbasierte Laden verwendet. Ein fester Preis kann als "Fester Stromtarif" eingetragen werden,
                auch mit Hoch- und Niedertarif.
              </p>
              <p>
                Ist in den Lademodi Eco und Zeitladen "Preisbasiertes Laden" gewählt, wird nur geladen, wenn der
                Strompreis unter dem angegebenen maximalen Strompreis liegt. Für Zielladen wird die Ladedauer ermittelt
                und dann zu den günstigsten Zeiten geladen.
              </p>
              <p>
                Wenn keine Preise abgefragt werden können oder "Preisbasiertes Laden" abgewählt wurde, wird in Modus Eco
                immer geladen bzw. bei Zielladen zunächst mit PV-Überschuss und zum Erreichen des Zieltermins mit
                Netzstrom.
              </p>
            </openwb-base-alert>
            <openwb-base-select-input
              class="mb-2"
              title="Anbieter"
              :options="flexibleTariffList"
              :model-value="flexibleTariffProvider ? flexibleTariffProvider.type : ''"
              @update:model-value="updateSelectedFlexibleTariff($event)"
            />
            <div v-if="flexibleTariffProvider?.type">
              <openwb-flexible-tariff-proxy
                :flexible-tariff="flexibleTariffProvider"
                @update:configuration="updateConfiguration('openWB/optional/ep/flexible_tariff/provider', $event)"
              />
            </div>
          </div>
        </div>
      </openwb-base-card>

      <openwb-base-card
        v-if="flexibleTariffProvider?.type"
        title="Allgemeine Informationen Stromtarif"
      >
        <div>
          <openwb-pricing-status source="flexible_tariff" />
        </div>
        <template #footer>
          <openwb-base-alert
            v-if="flexibleTariffProvider.type !== 'fixed_hours'"
            subtype="warning"
          >
            Je nach Anbieter kann die Anzahl der API-Abrufe begrenzt sein. Ein manuelles Aktualisieren kann daher
            fehlschlagen, wenn das Limit bereits erreicht wurde.
          </openwb-base-alert>
          <div class="row justify-content-center w-100">
            <div class="col-md-4 d-flex py-1 justify-content-center">
              <openwb-base-click-button
                class="btn-primary"
                @click="triggerUpdate('flexible_tariff')"
              >
                Strompreise aktualisieren
              </openwb-base-click-button>
            </div>
          </div>
        </template>
      </openwb-base-card>

      <openwb-base-card title="Netzentgelte">
        <div>
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
              befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
            <openwb-base-alert subtype="info">
              Wenn sowohl ein Stromtarif als auch Netzentgelte konfiguriert sind, werden beide zum Gesamt-Strompreis
              verrechnet. Dabei wird angenommen, dass der Standardpreis der Netzentgelte in dem Stromtarif enthalten
              ist. Dementsprechend wird die Differenz zwischen dem Standardpreis der Netzentgelte und den aktuellen
              Netzentgelten zum Strompreis addiert, um den Gesamt-Strompreis zu ermitteln.<br />
              Beispiel: Standardpreis der Netzentgelte 10 ct/kWh, aktueller Preis 5 ct/kWh, Strompreis 20 ct/kWh. Der
              Gesamt-Strompreis ist 20 + (5 - 10) = 15 ct/kWh.
            </openwb-base-alert>
            <openwb-base-select-input
              class="mb-2"
              title="Anbieter"
              :options="gridFeeList"
              :model-value="gridFeeProvider ? gridFeeProvider.type : ''"
              @update:model-value="updateSelectedGridFee($event)"
            />
            <div v-if="gridFeeProvider?.type">
              <openwb-grid-fee-proxy
                :grid-fee="gridFeeProvider"
                @update:configuration="updateConfiguration('openWB/optional/ep/grid_fee/provider', $event)"
              />
            </div>
          </div>
        </div>
      </openwb-base-card>

      <openwb-base-card
        v-if="gridFeeProvider?.type"
        title="Allgemeine Informationen Netzentgelte"
      >
        <div>
          <openwb-pricing-status source="grid_fee" />
        </div>
        <template #footer>
          <div class="row justify-content-center w-100">
            <div class="col-md-4 d-flex py-1 justify-content-center">
              <openwb-base-click-button
                class="btn-primary"
                @click="triggerUpdate('grid_fee')"
              >
                Netzentgelte aktualisieren
              </openwb-base-click-button>
            </div>
          </div>
        </template>
      </openwb-base-card>

      <openwb-base-card title="PV-Strom, Speicher und Einspeisevergütung">
        <div>
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
              befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
            <openwb-base-alert subtype="info">
              Mit den Preisen für PV-Strom und Speicher wird der Strom aus PV-Anlage und Speicher bewertet, wenn die
              Ladekosten nach dem Strommix berechnet werden. Die Einspeisevergütung ist das, was du für eingespeisten
              Strom erhältst. Die Preise für PV-Strom und Speicher können mit einem Hilfsrechner ermittelt werden.
            </openwb-base-alert>
            <openwb-base-number-input
              title="Preis für PV-Strom"
              :step="0.001"
              :precision="3"
              unit="ct/kWh"
              :min="0"
              required
              :model-value="sourcePrice('pv_price')"
              @update:model-value="setSourcePrice('pv_price', $event)"
            />
            <openwb-base-button-input
              :title="showPvCalculator ? 'Hilfsrechner ausblenden' : 'Hilfsrechner für PV-Preis'"
              :button-text="showPvCalculator ? 'Ausblenden' : 'Einblenden'"
              @button-clicked="showPvCalculator = !showPvCalculator"
            />
            <openwb-price-calculator
              v-if="showPvCalculator"
              type="pv"
              @apply="applyCalculatedPrice('pv_price', $event)"
            />
            <hr />
            <openwb-base-number-input
              title="Preis für Speicherentladung"
              :step="0.001"
              :precision="3"
              unit="ct/kWh"
              :min="0"
              required
              :model-value="sourcePrice('bat_price')"
              @update:model-value="setSourcePrice('bat_price', $event)"
            />
            <openwb-base-button-input
              :title="showBatCalculator ? 'Hilfsrechner ausblenden' : 'Hilfsrechner für Speicherpreis'"
              :button-text="showBatCalculator ? 'Ausblenden' : 'Einblenden'"
              @button-clicked="showBatCalculator = !showBatCalculator"
            />
            <openwb-price-calculator
              v-if="showBatCalculator"
              type="bat"
              @apply="applyCalculatedPrice('bat_price', $event)"
            />
            <hr />
            <openwb-base-number-input
              title="Einspeisevergütung"
              :step="0.001"
              :precision="3"
              unit="ct/kWh"
              :min="0"
              required
              :model-value="sourcePrice('feed_in_price')"
              @update:model-value="setSourcePrice('feed_in_price', $event)"
            >
              <template #help>
                Vergütung für eingespeisten Strom. Sie wird für den Vergleich zwischen Einspeisen, Netzbezug und
                Speicherentladung verwendet.
              </template>
            </openwb-base-number-input>
          </div>
        </div>
      </openwb-base-card>

      <openwb-base-card title="Abrechnung der Ladekosten">
        <div>
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
              befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
            <openwb-base-button-group-input
              title="Berechnung der Ladekosten"
              :buttons="[
                { buttonValue: 'mix', text: 'Nach Strommix' },
                { buttonValue: 'grid', text: 'Strompreis' },
                { buttonValue: 'fixed', text: 'Eigener Preis' },
              ]"
              :model-value="$store.state.mqtt['openWB/general/prices/cost_mode']"
              @update:model-value="updateState('openWB/general/prices/cost_mode', $event)"
            >
              <template #help>
                Nach Strommix: Im Lade-Protokoll werden die Anteile der Stromquellen (Netz, PV, Speicher) berechnet und
                mit den jeweiligen Preisen multipliziert.<br />
                Strompreis: Die gesamte Energie wird zum Preis des Stromtarifs berechnet.<br />
                Eigener Preis: Die gesamte Energie wird zu einem festen Preis berechnet, z. B. wenn die Abrechnung mit
                dem Arbeitgeber vereinbart ist. Die übrigen Preise und Statistiken bleiben unverändert.
              </template>
            </openwb-base-button-group-input>
            <openwb-base-number-input
              v-if="$store.state.mqtt['openWB/general/prices/cost_mode'] === 'fixed'"
              title="Eigener Preis"
              :step="0.001"
              :precision="3"
              unit="ct/kWh"
              :min="0"
              required
              :model-value="$store.state.mqtt['openWB/general/prices/fixed_price'] * 100000"
              @update:model-value="
                updateState('openWB/general/prices/fixed_price', parseFloat(($event / 100000).toFixed(7)))
              "
            />
          </div>
        </div>
      </openwb-base-card>

      <openwb-base-card title="Preisverlauf">
        <openwb-base-alert
          v-if="!hasChartData"
          subtype="info"
        >
          Es liegen noch keine Preisdaten vor.
        </openwb-base-alert>
        <openwb-time-series-chart
          v-else
          :datasets="chartDatasets"
          y-axis-label="Preis (ct/kWh)"
          :tooltip-decimals="2"
          :min-height="480"
        />
      </openwb-base-card>
      <openwb-base-submit-buttons
        form-name="electricityPricesConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
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
import OpenwbPriceCalculator from "../components/electricity_pricing/PriceCalculator.vue";
import OpenwbPricingStatus from "../components/electricity_pricing/PricingStatus.vue";
import OpenwbTimeSeriesChart from "../components/OpenwbTimeSeriesChart.vue";

// Rückfallpreis des Backends, solange kein Stromtarif eingerichtet ist (€/Wh)
const FALLBACK_GRID_PRICE = 0.0003;
const PRICE_SOURCES = ["flexible_tariff", "grid_fee", "pv_price", "bat_price", "feed_in_price"];

export default {
  name: "OpenwbElectricityPricesConfigView",
  components: {
    OpenwbFlexibleTariffProxy,
    OpenwbGridFeeProxy,
    OpenwbPriceCalculator,
    OpenwbPricingStatus,
    OpenwbTimeSeriesChart,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    const mqttTopics = [
      { topic: "openWB/general/extern", writeable: false },
      { topic: "openWB/general/prices/cost_mode", writeable: true },
      { topic: "openWB/general/prices/fixed_price", writeable: true },
      { topic: "openWB/optional/ep/configured", writeable: false },
      { topic: "openWB/optional/ep/get/prices", writeable: false },
      { topic: "openWB/system/configurable/flexible_tariffs", writeable: false },
      { topic: "openWB/system/configurable/grid_fees", writeable: false },
    ];
    PRICE_SOURCES.forEach((source) => {
      mqttTopics.push({ topic: `openWB/optional/ep/${source}/provider`, writeable: true });
      ["fault_state", "fault_str", "last_update_time", "next_query_time", "prices"].forEach((name) => {
        mqttTopics.push({ topic: `openWB/optional/ep/${source}/get/${name}`, writeable: false });
      });
    });
    return {
      mqttTopics,
      showPvCalculator: false,
      showBatCalculator: false,
    };
  },
  computed: {
    flexibleTariffList() {
      return this.$store.state.mqtt["openWB/system/configurable/flexible_tariffs"];
    },
    gridFeeList() {
      return this.$store.state.mqtt["openWB/system/configurable/grid_fees"];
    },
    flexibleTariffProvider() {
      return this.$store.state.mqtt["openWB/optional/ep/flexible_tariff/provider"];
    },
    gridFeeProvider() {
      return this.$store.state.mqtt["openWB/optional/ep/grid_fee/provider"];
    },
    fallbackPriceText() {
      return `${(FALLBACK_GRID_PRICE * 100000).toFixed(0)} ct/kWh`;
    },
    chartDatasets() {
      const mqtt = this.$store.state.mqtt;
      const combinedPrices = mqtt["openWB/optional/ep/configured"] ? mqtt["openWB/optional/ep/get/prices"] : undefined;
      const lastCombinedTimestamp = Math.max(0, ...Object.keys(combinedPrices || {}).map(Number));
      const tariffAndGridFee = this.flexibleTariffProvider?.type && this.gridFeeProvider?.type;
      // wie die Status-Karte: bei Stromtarif und Netzentgelt Gesamtpreis und Einzelpreise, sonst nur ein Strompreis
      const series = tariffAndGridFee
        ? [
            { label: "Gesamtpreis", prices: combinedPrices, color: "#28a745" },
            {
              label: "Stromtarif",
              prices: mqtt["openWB/optional/ep/flexible_tariff/get/prices"],
              color: "#8b1a1a",
              until: lastCombinedTimestamp,
            },
            {
              label: "Netzentgelt",
              prices: mqtt["openWB/optional/ep/grid_fee/get/prices"],
              color: "#ff9ea5",
              until: lastCombinedTimestamp,
            },
          ]
        : [{ label: "Strompreis", prices: combinedPrices, color: "#dc3545" }];
      // feste Preise reichen weiter als die Strompreise, deshalb am Ende der Strompreise abschneiden
      const until = lastCombinedTimestamp > 0 ? lastCombinedTimestamp : undefined;
      series.push(
        { label: "PV-Preis", prices: mqtt["openWB/optional/ep/pv_price/get/prices"], color: "#795548", until },
        { label: "Speicherpreis", prices: mqtt["openWB/optional/ep/bat_price/get/prices"], color: "#343a40", until },
        {
          label: "Einspeisevergütung",
          prices: mqtt["openWB/optional/ep/feed_in_price/get/prices"],
          color: "#d63384",
          until,
        },
      );
      return series
        .map((entry) => ({
          label: entry.label,
          unit: "ct/kWh",
          color: entry.color,
          backgroundColor: entry.color,
          fill: false,
          stepped: true,
          borderWidth: 2,
          data: this.pricePoints(entry.prices, entry.until),
        }))
        .filter((dataset) => dataset.data.length > 0);
    },
    hasChartData() {
      return this.chartDatasets.length > 0;
    },
  },
  methods: {
    // €/Wh -> ct/kWh, Sekunden -> Millisekunden
    pricePoints(prices, untilTimestamp = undefined) {
      if (!prices || typeof prices !== "object") {
        return [];
      }
      return Object.entries(prices)
        .filter(([timestamp]) => untilTimestamp === undefined || Number(timestamp) <= untilTimestamp)
        .map(([timestamp, value]) => ({ timestamp: Number(timestamp) * 1000, value: Number(value) * 100000 }))
        .filter((point) => Number.isFinite(point.timestamp) && Number.isFinite(point.value))
        .sort((a, b) => a.timestamp - b.timestamp);
    },
    sourcePrice(source) {
      const price = this.$store.state.mqtt[`openWB/optional/ep/${source}/provider`]?.configuration?.default_price;
      return price === undefined ? undefined : parseFloat((price * 100000).toFixed(4));
    },
    setSourcePrice(source, value) {
      this.updateState(
        `openWB/optional/ep/${source}/provider`,
        parseFloat((value / 100000).toFixed(7)),
        "configuration.default_price",
      );
    },
    applyCalculatedPrice(source, ctPerKwh) {
      this.setSourcePrice(source, ctPerKwh);
      if (source === "pv_price") {
        this.showPvCalculator = false;
      } else {
        this.showBatCalculator = false;
      }
    },
    triggerUpdate(source) {
      this.$root.doPublish(`openWB/set/optional/ep/${source}/get/force_update`, true, false);
    },
    getDefaultConfiguration(list, type) {
      const defaults = list.find((element) => element.value == type);
      if (defaults && Object.prototype.hasOwnProperty.call(defaults, "defaults")) {
        return JSON.parse(JSON.stringify(defaults.defaults));
      }
      console.warn("no default configuration found for provider type!", type);
      return {};
    },
    updateSelectedFlexibleTariff($event) {
      this.updateState("openWB/optional/ep/flexible_tariff/provider", $event, "type");
      this.updateState(
        "openWB/optional/ep/flexible_tariff/provider",
        this.getDefaultConfiguration(this.flexibleTariffList, $event),
      );
    },
    updateSelectedGridFee($event) {
      this.updateState("openWB/optional/ep/grid_fee/provider", $event, "type");
      this.updateState("openWB/optional/ep/grid_fee/provider", this.getDefaultConfiguration(this.gridFeeList, $event));
    },
    updateConfiguration(key, event) {
      this.updateState(key, event.value, event.object);
    },
  },
};
</script>
