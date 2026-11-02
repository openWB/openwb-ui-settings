<template>
  <div class="device-fronius-sunspec-bat">
    <openwb-base-heading> Einstellungen für Fronius SunSpec Speicher </openwb-base-heading>
    <openwb-base-number-input
      title="MPPT-Kanal Laden"
      :model-value="component.configuration.mppt_index_charge"
      min="1"
      required
      @update:model-value="updateConfiguration($event, 'configuration.mppt_index_charge')"
    >
      <template #help>
        Der MPPT-Kanal (siehe Kanalbezeichnung im Fronius-Webinterface bzw. per Modbus-Tool), der die Ladeleistung des
        Speichers liefert. Unterscheidet sich zwischen Geräteserien und muss am Gerät geprüft werden.
      </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="MPPT-Kanal Entladen"
      :model-value="component.configuration.mppt_index_discharge"
      min="1"
      required
      @update:model-value="updateConfiguration($event, 'configuration.mppt_index_discharge')"
    >
      <template #help>
        Der MPPT-Kanal, der die Entladeleistung des Speichers liefert.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusSunspecBat",
  mixins: [ComponentConfigMixin],
};
</script>
