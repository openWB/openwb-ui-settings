<template>
  <div class="device-fox_ess-bat">
    <openwb-base-heading> Einstellungen für FoxEss Batteriespeicher </openwb-base-heading>
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
  name: "DeviceFoxEssBat",
  mixins: [ComponentConfigMixin],
};
</script>
