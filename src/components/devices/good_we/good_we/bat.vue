<template>
  <div class="device-goodwe-bat">
    <openwb-base-heading> Einstellungen für GoodWe Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="GoodWe-Batterie-Index"
      :model-value="component.configuration.battery_index"
      min="1"
      max="2"
      @update:model-value="updateConfiguration($event, 'configuration.battery_index')"
    >
      <template #help>
        Wenn eine zweite Batterie am Wechselrichter angeschlossen ist, hier den Index 2 eintagen. Im Normalfall immer 1
        eintragen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceGoodWeBat",
  mixins: [ComponentConfigMixin],
};
</script>
