<template>
  <div>
    <openwb-base-alert subtype="info">
      <p>Forecast.Solar wird von einer Community gepflegt. Ohne API Key sind 12 Anfragen pro Stunde möglich.</p>
      <p>
        <strong>Hinweis zur kostenlosen API:</strong> Die kostenlose API zeigt nur noch die verbleibenden Stunden des
        aktuellen Tages. Bei mehrfachen Abfragen pro Tag verringert sich daher der Prognosewert kontinuierlich. Mit
        einem kostenpflichtigen API-Key erhält man die vollständige Tageshistorie und dieser Effekt tritt nicht auf.
      </p>
    </openwb-base-alert>
    <openwb-base-button-input
      v-if="geolocationSupported"
      subtype="primary"
      @click="readGeolocation"
    >
      <template #buttonText>
        <font-awesome-icon :icon="['fas', 'location-crosshairs']" />
        Standort ermitteln
      </template>
    </openwb-base-button-input>
    <openwb-base-number-input
      v-model="forecastConfiguration.latitude"
      title="Breitengrad"
      :step="0.0000001"
      required
    >
      <template #help> Dezimalgrad, z.B. 51.123456 </template>
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'map-location-dot']" />
      </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      v-model="forecastConfiguration.longitude"
      title="Längengrad"
      :step="0.0000001"
      required
    >
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'map-location-dot']" />
      </template>
      <template #help> Dezimalgrad, z.B. 7.654321 </template>
    </openwb-base-number-input>
    <openwb-base-text-input
      v-model="forecastConfiguration.api_key"
      title="API Key (optional)"
      subtype="password"
    >
      <template #help>
        Optional: API Key für einen bezahlten Forecast.Solar Account. Ohne Key gelten die Limits des Free Tiers.
      </template>
    </openwb-base-text-input>
    <openwb-base-card title="Dachflächen">
      <template #actions>
        <openwb-base-avatar
          v-if="forecastConfiguration.strings.length < 6"
          class="bg-success clickable"
          title="Dachfläche hinzufügen"
          @click="addStringRow"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </openwb-base-avatar>
      </template>
      <openwb-base-alert
        v-if="forecastConfiguration.strings.length >= 6"
        subtype="warning"
      >
        Maximal 6 Dachflächen sind erlaubt.
      </openwb-base-alert>
      <openwb-base-alert
        v-if="forecastConfiguration.strings.length === 0"
        subtype="warning"
      >
        Noch keine Dachflächen konfiguriert.
      </openwb-base-alert>
      <openwb-base-card
        v-for="(row, index) in forecastConfiguration.strings"
        :key="`fs-string-${index}`"
        :title="row.name"
        class="mb-2"
        :collapsible="true"
        :collapsed="true"
      >
        <template #actions="{ collapsed }">
          <openwb-base-avatar
            v-if="!collapsed"
            class="bg-danger clickable"
            title="Dachfläche entfernen"
            @click.stop="removeStringRow(index)"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </openwb-base-avatar>
        </template>
        <openwb-base-text-input
          v-model="row.name"
          title="Name der Dachfläche"
        />
        <openwb-base-number-input
          v-model="row.peak_power_kw"
          title="Leistung Dachfläche/String"
          unit="kWp"
          :min="0"
          :step="0.01"
          required
        >
          <template #help> Leistung der Dachfläche/String in kWp. </template>
          <template #prepend>
            <font-awesome-icon :icon="['fas', 'bolt-lightning']" />
          </template>
        </openwb-base-number-input>
        <openwb-base-number-input
          v-model="row.tilt"
          title="Dachneigung"
          unit="Grad"
          :min="0"
          :max="90"
          :step="1"
          required
        >
          <template #help> Dachneigung in Grad. </template>
          <template #prepend>
            <font-awesome-icon :icon="['fas', 'lines-leaning']" />
          </template>
        </openwb-base-number-input>
        <openwb-base-number-input
          v-model="row.azimuth"
          title="Ausrichtung"
          unit="Grad"
          :min="-180"
          :max="180"
          :step="1"
          required
        >
          <template #help>
            Ausrichtung: 0&deg; = S&uuml;den | -90&deg; = Osten | 90&deg; = Westen | 180&deg; = Norden
          </template>
          <template #prepend>
            <font-awesome-icon :icon="['fas', 'compass']" />
          </template>
        </openwb-base-number-input>
      </openwb-base-card>
    </openwb-base-card>
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus as fasPlus,
  faTrash as fasTrash,
  faMapLocationDot as fasMapLocationDot,
  faArrowTrendDown as fasArrowTrendDown,
  faGlobe as fasGlobe,
  faLocationCrosshairs as fasLocationCrosshairs,
  faCompass as fasCompass,
  faLinesLeaning as fasLinesLeaning,
  faBoltLightning as fasBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  fasPlus,
  fasTrash,
  fasMapLocationDot,
  fasArrowTrendDown,
  fasGlobe,
  fasLocationCrosshairs,
  fasCompass,
  fasLinesLeaning,
  fasBoltLightning,
);

export default {
  name: "ForecastSolarForecastConfig",
  components: { FontAwesomeIcon },
  mixins: [ForecastConfigMixin],
  computed: {
    geolocationSupported() {
      return "geolocation" in navigator;
    },
  },
  methods: {
    readGeolocation() {
      if (this.geolocationSupported) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.updateConfiguration(latitude, "configuration.latitude");
            this.updateConfiguration(longitude, "configuration.longitude");
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
        );
      }
    },
    addStringRow() {
      if (this.forecastConfiguration.strings.length >= 6) {
        return;
      }
      const next = [
        ...this.forecastConfiguration.strings,
        {
          name: `Ausrichtung ${this.forecastConfiguration.strings.length + 1}`,
          peak_power_kw: this.forecastConfiguration.peak_power_kw || 1,
          tilt: this.forecastConfiguration.tilt ?? 30,
          azimuth: this.forecastConfiguration.azimuth ?? 0,
        },
      ];
      this.updateConfiguration(next, "configuration.strings");
    },
    removeStringRow(index) {
      const next = this.forecastConfiguration.strings.filter((_, rowIndex) => rowIndex !== index);
      this.updateConfiguration(next, "configuration.strings");
    },
    updateStringField(index, key, value) {
      const next = this.forecastConfiguration.strings.map((row, rowIndex) => {
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
