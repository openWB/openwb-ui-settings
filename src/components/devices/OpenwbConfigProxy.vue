<template>
  <component
    :is="myComponent"
    :device="device"
    :component="component"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import ComponentConfigMixin from "./DeviceConfigMixin.vue";
import OpenwbDeviceConfigFallback from "./OpenwbDeviceConfigFallback.vue";
import OpenwbComponentConfigFallback from "./OpenwbComponentConfigFallback.vue";

export default {
  name: "OpenwbConfigProxy",
  mixins: [ComponentConfigMixin],
  computed: {
    myComponent() {
      console.debug(
        `loading component: ${this.device.type} / ${this.component?.type}`,
      );
      if (this.component !== undefined) {
        return defineAsyncComponent({
          loader: () =>
            import(
              `./${this.device.vendor}/${this.device.type}/${this.component.type}.vue`
            ),
          errorComponent: OpenwbComponentConfigFallback,
        });
      } else {
        return defineAsyncComponent({
          loader: () =>
            import(
              `./${this.device.vendor}/${this.device.type}/device.vue`
            ),
          errorComponent: OpenwbDeviceConfigFallback,
        });
      }
    },
  },
};
</script>
