<template>
  <div class="device-solar-view-inverter">
    <openwb-base-heading> Einstellungen für SolarView Wechselrichter </openwb-base-heading>
    <openwb-base-text-input
      title="Kommando für die Abfrage"
      required
      :model-value="component.configuration.command"
      @update:model-value="updateConfiguration($event, 'configuration.command')"
    >
      <template #help>
        Kommandos gemäß SolarView-Dokumentation, z.B.: 00* (gesamte Anlage), 01* (Wechselrichter 1), 02* (Wechselrichter
        2)
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolarViewInverter",
  mixins: [ComponentConfigMixin],
};
</script>
