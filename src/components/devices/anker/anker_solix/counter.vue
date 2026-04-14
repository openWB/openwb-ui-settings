<template>
  <div class="device-anker_solix-counter">
    <openwb-base-heading> Einstellungen für Anker Zähler </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Nicht alle Zähler von Anker unterstützen Modbus TCP, in den Einstellungen muss es aktiviert sein.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="component.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceAnkerCounter",
  mixins: [ComponentConfigMixin],
};
</script>
