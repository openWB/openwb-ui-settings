<template>
  <div>
    <openwb-base-alert subtype="info">
      Open-Meteo nutzt ohne Mehrfach-Ausrichtungen die unten eingestellte Dachneigung und Ausrichtung. Optional koennen
      mehrere Dachflaechen als JSON-Liste konfiguriert werden.
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
    <openwb-base-text-input
      title="Timezone"
      required
      :model-value="forecast.configuration.timezone"
      @update:model-value="updateConfiguration($event, 'configuration.timezone')"
    >
      <template #help> Beispiel: Europe/Berlin </template>
    </openwb-base-text-input>
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
    <openwb-base-number-input
      title="Dachneigung"
      unit="Grad"
      :min="0"
      :max="90"
      :step="1"
      required
      :model-value="forecast.configuration.tilt"
      @update:model-value="updateConfiguration($event, 'configuration.tilt')"
    />
    <openwb-base-number-input
      title="Ausrichtung"
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
      title="System Loss"
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
    <openwb-base-number-input
      title="Irradiance to Power Factor"
      :min="0.01"
      :step="0.01"
      required
      :model-value="forecast.configuration.irradiance_to_power_factor"
      @update:model-value="updateConfiguration($event, 'configuration.irradiance_to_power_factor')"
    >
      <template #help>
        Skalierungsfaktor von Einstrahlung auf Leistung. Typischer Startwert: 0.20 und danach anhand realer Ertraege
        feinjustieren.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ForecastConfigMixin from "../ForecastConfigMixin.vue";

export default {
  name: "OpenMeteoForecastConfig",
  mixins: [ForecastConfigMixin],
};
</script>
