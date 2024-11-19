<template>
  <div class="device-fems-bat">
    <openwb-base-heading>
      Einstellungen für openEMS, Fenecon FEMS, CENTURIO 10, Kaco Hy-Control Batteriespeicher
    </openwb-base-heading>
    <openwb-base-number-input
      title="Anzahl der verbauten Speicher"
      required
      :min="1"
      :max="2"
      :model-value="component.configuration.num"
      @update:model-value="updateConfiguration($event, 'configuration.num')"
    />
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFemsBat",
  mixins: [ComponentConfigMixin],
};
</script>
