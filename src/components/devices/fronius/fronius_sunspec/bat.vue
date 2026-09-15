<template>
  <div class="device-fronius-sunspec-bat">
    <openwb-base-heading> Einstellungen für Fronius SunSpec Speicher </openwb-base-heading>
    <openwb-base-checkbox-input
      title="Momentanleistung verfügbar"
      :model-value="hasMpptIndex"
      @update:model-value="toggleMpptIndex"
    >
      <template #help>
        Ohne MPPT-Kanal liefert der Speicher nur Ladezustand und Steuerung, aber keine Momentanleistung.
      </template>
    </openwb-base-checkbox-input>
    <openwb-base-number-input
      v-if="hasMpptIndex"
      title="MPPT-Kanal"
      :model-value="component.configuration.mppt_index"
      min="1"
      required
      @update:model-value="updateConfiguration($event, 'configuration.mppt_index')"
    >
      <template #help>
        Der MPPT-Kanal (siehe Kanalbezeichnung im Fronius-Webinterface bzw. per Modbus-Tool), der die tatsächliche
        Lade-/Entladeleistung des Speichers liefert. Unterscheidet sich zwischen Geräteserien und muss am Gerät geprüft
        werden.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusSunspecBat",
  mixins: [ComponentConfigMixin],
  computed: {
    hasMpptIndex() {
      const mpptIndex = this.component.configuration.mppt_index;
      return mpptIndex !== null && mpptIndex !== undefined;
    },
  },
  methods: {
    toggleMpptIndex(value) {
      this.updateConfiguration(value ? 1 : null, "configuration.mppt_index");
    },
  },
};
</script>
