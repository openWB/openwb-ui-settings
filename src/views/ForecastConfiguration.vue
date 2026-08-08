<template>
  <div class="forecastConfig">
    <form name="forecastConfigForm">
      <openwb-base-card title="PV-Prognose">
        <openwb-base-alert subtype="info">
          Wähle einen Forecast-Anbieter und hinterlege die erforderlichen Zugangsdaten bzw. Standortparameter.
        </openwb-base-alert>

        <openwb-base-select-input
          title="Anbieter"
          :options="providerOptions"
          :model-value="selectedProviderType"
          @update:model-value="updateProviderType"
        />

        <div v-if="currentForecastProvider.type">
          <openwb-forecast-proxy
            :forecast="currentForecastProvider"
            @update:configuration="updateConfiguration('openWB/optional/forecast/provider', $event)"
          />
        </div>
        <openwb-base-alert
          v-else
          subtype="warning"
        >
          Es ist derzeit kein Forecast-Anbieter aktiv.
        </openwb-base-alert>

        <hr />

        <openwb-base-click-button
          class="btn btn-outline-primary"
          title="Forecast Jetzt Aktualisieren"
          @button-clicked="triggerForecastUpdate"
        />
      </openwb-base-card>

      <openwb-base-card title="Aktuelle Forecast-Werte">
        <openwb-base-alert subtype="info">
          Heute: {{ formatNumber($store.state.mqtt["openWB/optional/forecast/get/today_kwh"], 2, 2) || "0.00" }}
          kWh, morgen:
          {{ formatNumber($store.state.mqtt["openWB/optional/forecast/get/tomorrow_kwh"], 2, 2) || "0.00" }}
          kWh
        </openwb-base-alert>
        <openwb-base-textarea
          title="Tageswerte (kWh)"
          subtype="json"
          :model-value="$store.state.mqtt['openWB/optional/forecast/get/daily_kwh'] || {}"
          readonly
        />
      </openwb-base-card>

      <openwb-base-submit-buttons
        form-name="forecastConfigForm"
        @save="$emit('save', mqttTopicsToPublish)"
        @reset="$emit('reset')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbForecastProxy from "../components/forecast/OpenwbForecastProxy.vue";

const PROVIDER_DEFINITIONS = {
  openmeteo: {
    name: "Open-Meteo PV Forecast",
    type: "openmeteo",
    official: true,
    configuration: {
      latitude: 0,
      longitude: 0,
      timezone: "Europe/Berlin",
      peak_power_kw: 9.5,
      tilt: 30,
      azimuth: 0,
      system_loss: 0.14,
      irradiance_to_power_factor: 0.2,
      strings: [],
    },
  },
  forecastsolar: {
    name: "Forecast.Solar",
    type: "forecastsolar",
    official: true,
    configuration: {
      latitude: 0,
      longitude: 0,
      peak_power_kw: 9.5,
      azimuth: 0,
      tilt: 30,
      strings: [],
    },
  },
  pvnode: {
    name: "PVNode V2",
    type: "pvnode",
    official: true,
    configuration: {
      api_key: "",
      plant_id: "",
      peak_power_kw: 9.5,
      system_loss: 0.14,
    },
  },
};

export default {
  name: "OpenwbForecastConfiguration",
  components: {
    OpenwbForecastProxy,
  },
  mixins: [ComponentState],
  emits: ["save", "reset"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/optional/forecast/configured", writeable: false },
        { topic: "openWB/optional/forecast/provider", writeable: true },
        { topic: "openWB/optional/forecast/get/values", writeable: false },
        { topic: "openWB/optional/forecast/get/today_values", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_values", writeable: false },
        { topic: "openWB/optional/forecast/get/daily_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/today_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/tomorrow_kwh", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_state", writeable: false },
        { topic: "openWB/optional/forecast/get/fault_str", writeable: false },
        { topic: "openWB/optional/forecast/get/next_query_time", writeable: false },
      ],
    };
  },
  computed: {
    providerOptions() {
      return [
        { value: "", text: "Kein Anbieter" },
        { value: "openmeteo", text: "Open-Meteo" },
        { value: "forecastsolar", text: "Forecast.Solar" },
        { value: "pvnode", text: "PVNode" },
      ];
    },
    currentForecastProvider() {
      const provider = this.$store.state.mqtt["openWB/optional/forecast/provider"];
      if (provider && typeof provider === "object") {
        return provider;
      }
      return { type: null, configuration: {} };
    },
    selectedProviderType() {
      return this.currentForecastProvider.type || "";
    },
  },
  methods: {
    updateProviderType(type) {
      if (!type) {
        this.updateState("openWB/optional/forecast/provider", { type: null, configuration: {} });
        return;
      }
      const definition = PROVIDER_DEFINITIONS[type];
      const existing = this.currentForecastProvider;
      const nextProvider = {
        name: definition.name,
        type: definition.type,
        official: definition.official,
        configuration: {
          ...definition.configuration,
          ...(existing.type === type ? existing.configuration : {}),
        },
      };
      this.updateState("openWB/optional/forecast/provider", nextProvider);
    },
    updateConfiguration(topic, event) {
      this.updateState(topic, event.value, event.object);
    },
    triggerForecastUpdate() {
      this.$root.doPublish("openWB/set/optional/forecast/get/force_update", true, false);
    },
  },
};
</script>
