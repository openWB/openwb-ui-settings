<template>
  <div>
    <openwb-base-alert subtype="info">
      Open-Meteo wird von der Community gepflegt. Es wird kein Account und kein API Key benoetigt.
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
    <openwb-base-text-input
      title="Timezone"
      required
      :model-value="forecast.configuration.timezone"
      @update:model-value="updateConfiguration($event, 'configuration.timezone')"
    >
      <template #help>
        IANA-Zeitzone, z.B. Europe/Berlin. Liste: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      </template>
    </openwb-base-text-input>
    <openwb-base-number-input
      title="Systemverlust"
      :min="0"
      :max="0.95"
      :step="0.01"
      required
      :model-value="forecast.configuration.system_loss"
      @update:model-value="updateConfiguration($event, 'configuration.system_loss')"
    >
      <template #help>
        Verlustfaktor als Dezimalzahl. Typischer Startwert: 0.14 (14%). Uebliche Spanne: 0.10 bis 0.20.
      </template>
    </openwb-base-number-input>
    <openwb-base-alert subtype="info">
      Jede Dachflaeche muss einzeln erfasst werden, auch wenn es nur eine Dachflaeche gibt.
    </openwb-base-alert>
    <openwb-base-alert
      v-if="stringRows.length >= 6"
      subtype="warning"
    >
      Maximal 6 Dachflaechen sind erlaubt.
    </openwb-base-alert>
    <openwb-base-alert
      v-if="stringRows.length === 0"
      subtype="secondary"
    >
      Noch keine Dachflaechen konfiguriert.
    </openwb-base-alert>
    <openwb-base-card
      v-for="(row, index) in stringRows"
      :key="`om-string-${index}`"
      :title="row.name && row.name.trim() ? row.name : `Dachflaeche ${index + 1}`"
      class="mb-2"
    >
      <openwb-base-text-input
        title="Name der Dachflaeche"
        :model-value="row.name"
        @update:model-value="updateStringField(index, 'name', $event)"
      />
      <openwb-base-number-input
        title="Leistung Dachflaeche/String"
        unit="kWp"
        :min="0"
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
      />
      <openwb-base-alert subtype="info">
        Ausrichtung: 0&deg; = S&uuml;den | -90&deg; = Osten | 90&deg; = Westen | 180&deg; = Norden
      </openwb-base-alert>
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-danger btn-sm"
          title="Dachflaeche entfernen"
          @click="removeStringRow(index)"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </div>
    </openwb-base-card>
    <button
      type="button"
      class="btn btn-success btn-sm mb-2"
      :disabled="stringRows.length >= 6"
      title="Dachflaeche hinzufuegen"
      @click="addStringRow"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
      Dachflaeche hinzufuegen
    </button>
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus as fasPlus, faTrash as fasTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlus, fasTrash);

export default {
  name: "OpenMeteoForecastConfig",
  components: { FontAwesomeIcon },
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
