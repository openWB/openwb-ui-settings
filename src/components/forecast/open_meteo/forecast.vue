<template>
  <div>
    <openwb-base-alert subtype="info">
      Open-Meteo wird von einer Community gepflegt. Es wird kein Account und kein API Key benötigt.
    </openwb-base-alert>
    <div
      v-if="geolocationSupported"
      class="row justify-content-center mb-1 w-100"
    >
      <div class="col-md-4 d-flex py-1 justify-content-center">
        <openwb-base-click-button
          class="btn-primary"
          @click="readGeolocation"
        >
          <font-awesome-icon :icon="['fas', 'location-crosshairs']" />
          Standort ermitteln
        </openwb-base-click-button>
      </div>
    </div>
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
      <template #help> Dezimalgrad, z.B. 7.654321 </template>
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'map-location-dot']" />
      </template>
    </openwb-base-number-input>
    <openwb-base-text-input
      v-model="forecastConfiguration.timezone"
      title="Zeitzone"
      required
    >
      <template #help>
        IANA-Zeitzone, z.B. Europe/Berlin. Liste:
        <a
          href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wikipedia
        </a>
      </template>
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'globe']" />
      </template>
    </openwb-base-text-input>
    <openwb-base-number-input
      title="Systemverlust"
      :min="0"
      :max="95"
      :step="1"
      required
      :model-value="Math.trunc(forecastConfiguration.system_loss * 100)"
      @update:model-value="forecastConfiguration.system_loss = $event / 100"
    >
      <template #help> Verlustfaktor in Prozent. Typischer Startwert: 14%. Übliche Spanne: 10% bis 20%. </template>
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'arrow-trend-down']" />
      </template>
    </openwb-base-number-input>
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
      <openwb-base-alert subtype="info">
        Ausrichtung der Dachflächen: Süden=0&deg;, Osten=-90&deg;, Westen=90&deg;, Norden=180&deg;<br />
        Neigung der Dachflächen: horizontal=0&deg;, senkrecht=90&deg;
      </openwb-base-alert>
      <openwb-base-alert
        v-if="forecastConfiguration.strings.length >= 6"
        subtype="warning"
      >
        Es werden maximal 6 Dachflächen unterstützt.
      </openwb-base-alert>
      <openwb-base-alert
        v-if="forecastConfiguration.strings.length === 0"
        subtype="warning"
      >
        Noch keine Dachflächen konfiguriert.
      </openwb-base-alert>
      <openwb-base-card
        v-for="(row, index) in forecastConfiguration.strings"
        :key="`om-string-${index}`"
        :title="row.name"
        class="mb-2"
        :collapsible="true"
        :collapsed="index !== lastAddedStringIndex"
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
          <template #help> Dachneigung in Grad. horizontal=0&deg;, senkrecht=90&deg;</template>
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
          <template #help> Ausrichtung: Süden=0&deg;, Osten=-90&deg;, Westen=90&deg;, Norden=180&deg; </template>
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
  name: "OpenMeteoForecastConfig",
  components: { FontAwesomeIcon },
  mixins: [ForecastConfigMixin],
  data() {
    return {
      lastAddedStringIndex: null,
    };
  },
  computed: {
    geolocationSupported() {
      return "geolocation" in navigator;
    },
  },
  methods: {
    addStringRow() {
      if (this.forecastConfiguration.strings.length >= 6) {
        return;
      }
      const next = [
        ...this.forecastConfiguration.strings,
        {
          name: `Dachfläche ${this.forecastConfiguration.strings.length + 1}`,
          peak_power_kw: undefined,
          tilt: undefined,
          azimuth: undefined,
        },
      ];
      this.lastAddedStringIndex = next.length - 1;
      this.forecastConfiguration.strings = next;
    },
    removeStringRow(index) {
      const next = this.forecastConfiguration.strings.filter((_, rowIndex) => rowIndex !== index);
      this.forecastConfiguration.strings = next;
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
      this.forecastConfiguration.strings = next;
    },
    readGeolocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.forecastConfiguration.latitude = position.coords.latitude;
            this.forecastConfiguration.longitude = position.coords.longitude;
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          },
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },
  },
};
</script>
