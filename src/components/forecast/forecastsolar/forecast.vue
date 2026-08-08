<template>
  <div>
    <openwb-base-alert subtype="info">
      Fuer Forecast.Solar kann eine einzelne Ausrichtung oder optional eine JSON-Liste mehrerer Dachflaechen
      konfiguriert werden.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Latitude"
      :step="0.000001"
      required
      :model-value="forecast.configuration.latitude"
      @update:model-value="updateConfiguration($event, 'configuration.latitude')"
    />
    <openwb-base-number-input
      title="Longitude"
      :step="0.000001"
      required
      :model-value="forecast.configuration.longitude"
      @update:model-value="updateConfiguration($event, 'configuration.longitude')"
    />
    <openwb-base-number-input
      title="Tilt"
      unit="Grad"
      :min="0"
      :max="90"
      :step="1"
      required
      :model-value="forecast.configuration.tilt"
      @update:model-value="updateConfiguration($event, 'configuration.tilt')"
    >
      <template #help> Typischer Startwert fuer Schraegdaecher: 30 Grad. </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Peak Power gesamt"
      unit="kWp"
      :min="0.001"
      :step="0.01"
      required
      :model-value="forecast.configuration.peak_power_kw"
      @update:model-value="updateConfiguration($event, 'configuration.peak_power_kw')"
    >
      <template #help>
        Wird verwendet, wenn keine Mehrfach-Ausrichtungen konfiguriert sind. Typischer Bereich: 5 - 15 kWp.
      </template>
    </openwb-base-number-input>
    <openwb-base-textarea
      title="Mehrere Ausrichtungen (optional)"
      subtype="json"
      :model-value="forecast.configuration.strings || []"
      @update:model-value="updateConfiguration($event, 'configuration.strings')"
    >
      <template #help>
        Optional als JSON-Liste von Dachflaechen, z.B. [{"peak_power_kw":4.5,"tilt":30,"azimuth":-90},
        {"peak_power_kw":5.0,"tilt":30,"azimuth":90}]. Wenn gesetzt, werden die Einzelflaechen summiert.
      </template>
    </openwb-base-textarea>
    <openwb-base-number-input
      title="Azimuth"
      unit="Grad"
      :min="-180"
      :max="180"
      :step="1"
      required
      :model-value="forecast.configuration.azimuth"
      @update:model-value="updateConfiguration($event, 'configuration.azimuth')"
    >
      <template #help> -180..180, wobei 0 = Sueden, -90 = Osten, 90 = Westen. </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "ForecastSolarForecastConfig",
  mixins: [ForecastConfigMixin],
};
</script>
