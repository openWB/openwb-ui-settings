<template>
  <div>
    <openwb-base-alert subtype="info">
      Forecast.Solar wird von der Community gepflegt. Es wird kein API Key benoetigt.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Breitengrad"
      :step="0.000001"
      required
      :model-value="forecast.configuration.latitude"
      @update:model-value="updateConfiguration($event, 'configuration.latitude')"
    >
      <template #help> Dezimalgrad, z.B. 51.123456 </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Laengengrad"
      :step="0.000001"
      required
      :model-value="forecast.configuration.longitude"
      @update:model-value="updateConfiguration($event, 'configuration.longitude')"
    >
      <template #help> Dezimalgrad, z.B. 7.654321 </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Installierte Gesamtleistung"
      unit="kWp"
      :min="0.001"
      :step="0.01"
      required
      :model-value="forecast.configuration.peak_power_kw"
      @update:model-value="updateConfiguration($event, 'configuration.peak_power_kw')"
    >
      <template #help> Dient als Referenzwert und Standard fuer neu hinzugefuegte Ausrichtungen. </template>
    </openwb-base-number-input>
    <openwb-base-alert subtype="info">
      Jede Ausrichtung wird einzeln angelegt. Auch bei nur einer Dachflaeche bitte eine Ausrichtung erfassen.
    </openwb-base-alert>
    <openwb-base-click-button
      class="btn btn-outline-success mb-2"
      title="Ausrichtung Hinzufuegen"
      @button-clicked="addStringRow"
    />
    <openwb-base-alert
      v-if="stringRows.length >= 6"
      subtype="warning"
    >
      Maximal 6 Ausrichtungen sind erlaubt.
    </openwb-base-alert>
    <openwb-base-alert
      v-if="stringRows.length === 0"
      subtype="secondary"
    >
      Keine zusaetzlichen Ausrichtungen konfiguriert.
    </openwb-base-alert>
    <openwb-base-card
      v-for="(row, index) in stringRows"
      :key="`fs-string-${index}`"
      :title="`Ausrichtung ${index + 1}`"
      class="mb-2"
    >
      <openwb-base-text-input
        title="Name der Ausrichtung"
        :model-value="row.name"
        @update:model-value="updateStringField(index, 'name', $event)"
      />
      <openwb-base-number-input
        title="Leistung Ausrichtung/String"
        unit="kWp"
        :min="0.001"
        :step="0.01"
        required
        :model-value="row.peak_power_kw"
        @update:model-value="updateStringField(index, 'peak_power_kw', $event)"
      />
      <openwb-base-number-input
        title="Dachneigung"
        unit="Grad"
        :min="0"
        :max="90"
        :step="1"
        required
        :model-value="row.tilt"
        @update:model-value="updateStringField(index, 'tilt', $event)"
      />
      <openwb-base-number-input
        title="Ausrichtung"
        unit="Grad"
        :min="-180"
        :max="180"
        :step="1"
        required
        :model-value="row.azimuth"
        @update:model-value="updateStringField(index, 'azimuth', $event)"
      >
        <template #help>
          Forecast.Solar Azimut in Grad: 0 = Sueden, -90 = Osten, 90 = Westen, -180/180 = Norden.
        </template>
      </openwb-base-number-input>
      <openwb-base-click-button
        class="btn btn-outline-danger"
        title="Ausrichtung Entfernen"
        @button-clicked="removeStringRow(index)"
      />
    </openwb-base-card>
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "ForecastSolarForecastConfig",
  mixins: [ForecastConfigMixin],
  computed: {
    stringRows() {
      return Array.isArray(this.forecast.configuration.strings) ? this.forecast.configuration.strings : [];
    },
  },
  methods: {
    addStringRow() {
      if (this.stringRows.length >= 6) {
        return;
      }
      const next = [
        ...this.stringRows,
        {
          name: `Ausrichtung ${this.stringRows.length + 1}`,
          peak_power_kw: this.forecast.configuration.peak_power_kw || 1,
          tilt: this.forecast.configuration.tilt ?? 30,
          azimuth: this.forecast.configuration.azimuth ?? 0,
        },
      ];
      this.updateConfiguration(next, "configuration.strings");
    },
    removeStringRow(index) {
      const next = this.stringRows.filter((_, rowIndex) => rowIndex !== index);
      this.updateConfiguration(next, "configuration.strings");
    },
    updateStringField(index, key, value) {
      const next = this.stringRows.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }
        return {
          ...row,
          [key]: value,
        };
      });
      this.updateConfiguration(next, "configuration.strings");
    },
  },
};
</script>
