<template>
  <div class="device-solaredge-counter">
    <openwb-base-heading> Einstellungen für SolarEdge Zähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Hierfür muss ein EVU-Zähler am SolarEdge Wechselrichter per Modbus angebunden sein. Der Zähler muss an erster
      Position im Wechselrichter konfiguriert sein.
    </openwb-base-alert>
    <openwb-base-number-input
      title="SolarEdge-Geräte-ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-number-input
      title="SolarEdge-Meter-ID"
      :model-value="component.configuration.meter_id"
      min="1"
      max="255"
      required
      @update:model-value="updateConfiguration($event, 'configuration.meter_id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolaredgeCounter",
  mixins: [ComponentConfigMixin],
};
</script>
