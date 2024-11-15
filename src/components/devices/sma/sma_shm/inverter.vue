<template>
  <div class="device-smahm-inverter">
    <openwb-base-heading> Einstellungen für SMA-HM/EM Wechselrichter </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Dies ist nur die richtige Komponente, wenn ein extra EnergyMeter ausschließlich für die PV-Messung vorhanden ist.
      Wenn nur ein HomeManager vorhanden ist, muss ein Gerät "SMA Sunny Boy" mit der entsprechenden
      Wechselrichter-Komponente angelegt werden.
    </openwb-base-alert>
    <openwb-base-number-input
      title="Seriennummer"
      required
      :model-value="component.configuration.serials"
      @update:model-value="updateConfiguration($event, 'configuration.serials')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSmahmInverter",
  mixins: [ComponentConfigMixin],
};
</script>
