<template>
  <div class="device-fronius-counter-sm">
    <openwb-base-heading> Einstellungen für Fronius SmartMeter </openwb-base-heading>
    <openwb-base-select-input
      title="Kompatibilitätsmodus"
      not-selected="Bitte auswählen"
      required
      :options="[
        { value: 0, text: 'Aus' },
        { value: 1, text: 'Variante 1' },
        { value: 2, text: 'Variante 2' },
      ]"
      :model-value="component.configuration.variant"
      @update:model-value="updateConfiguration($event, 'configuration.variant')"
    >
      <template #help>
        Gegebenenfalls auch für alte Modelle nach einem Softwareupdate erforderlich. Fronius hat derzeit keine
        Konsistente Schnittstelle. Speziell beim Gen24 kann Variante 1 oder 2 erforderlich sein. Nach speichern sollten
        nach etwa 10-20 Sekunden Daten angezeigt werden. Ist dies nicht der Fall die andere Variante ausprobieren.
      </template>
    </openwb-base-select-input>
    <openwb-base-number-input
      title="Meter ID"
      required
      min="0"
      max="65535"
      :model-value="component.configuration.meter_id"
      @update:model-value="updateConfiguration($event, 'configuration.meter_id')"
    >
      <template #help>
        Die Meter ID des SmartMeters. Diese ist normalerweise 1. Bei mehreren SmartMetern im System kann es notwendig
        sein, die Meter ID zu ändern. Zur Ermittlung kann der folgende Link verwendet werden. Die Meter ID kann den
        zurückgegebenen JSON Daten entnommen werden.
        <a
          :href="meterRealtimeUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ meterRealtimeUrl }} </a
        ><br />
        Im Abschnitt "Body" -> "Data" werden die installierten SmartMeter mit aktuellen Messwerten angezeigt. Die Meter
        ID ist die Zahl vor dem Doppelpunkt und den zugehörigen Messwerten.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusCounterSM",
  mixins: [ComponentConfigMixin],
  computed: {
    meterRealtimeUrl: {
      get() {
        return `http://${this.device.configuration.ip_address}/solar_api/v1/GetMeterRealtimeData.cgi?Scope=System`;
      },
    },
  },
};
</script>
