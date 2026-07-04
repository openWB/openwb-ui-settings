<template>
  <component
    :is="getComponent()"
    :device="device"
    :component="component"
    :component-id="component ? component.id : undefined"
    :component-type="component ? component.type : undefined"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbConsumerDeviceConfigFallback from "./OpenwbConsumerDeviceConfigFallback.vue";
import OpenwbConsumerComponentConfigFallback from "./OpenwbConsumerComponentConfigFallback.vue";

export default {
  name: "OpenwbConsumerConfigProxy",
  props: {
    device: { type: Object, required: true },
    component: { type: Object, required: false, default: undefined },
  },
  emits: ["update:configuration"],
  data() {
    return {
      SHARED_DEVICE_VENDORS: ["openwb", "generic"],
    };
  },
  methods: {
    getComponent() {
      console.debug(`loading component: ${this.device.type} / ${this.component?.type}`);
      const isSharedVendor = this.SHARED_DEVICE_VENDORS.includes(this.device.vendor);
      if (this.component !== undefined) {
        return defineAsyncComponent({
          loader: () =>
            isSharedVendor
              ? import(`../devices/${this.device.vendor}/${this.device.type}/${this.component.type}.vue`)
              : import(`./${this.device.vendor}/${this.device.type}/${this.component.type}.vue`),
          errorComponent: OpenwbConsumerComponentConfigFallback,
        });
      } else {
        return defineAsyncComponent({
          loader: () =>
            isSharedVendor
              ? import(`../devices/${this.device.vendor}/${this.device.type}/device.vue`)
              : import(`./${this.device.vendor}/${this.device.type}/consumer.vue`),
          errorComponent: OpenwbConsumerDeviceConfigFallback,
        });
      }
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
