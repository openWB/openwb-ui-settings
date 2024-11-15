<template>
  <div class="device-solarmax-bat">
    <openwb-base-alert subtype="info">
      Solarmax MAX.STORAGE / MAX.STORAGE Ultimate Batteriespeicher sind Teil eines Hybridsystems. Daher muss auch eine
      Komponente Wechselrichter angelegt werden.
    </openwb-base-alert>
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
  name: "DeviceSolarmaxBat",
  mixins: [ComponentConfigMixin],
};
</script>
