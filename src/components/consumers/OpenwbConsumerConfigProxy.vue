<template>
  <component
    :is="getComponent()"
    :device="device"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbConsumerDeviceConfigFallback from "./OpenwbConsumerDeviceConfigFallback.vue";

export default {
  name: "OpenwbConsumerConfigProxy",
  props: {
    device: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  data() {
    return {
      SHARED_DEVICE_VENDORS: ["openwb", "generic"],
    };
  },
  methods: {
    getComponent() {
      console.debug(`loading consumer config: ${this.device.vendor} / ${this.device.type}`);
      const isSharedVendor = this.SHARED_DEVICE_VENDORS.includes(this.device.vendor);
      return defineAsyncComponent({
        loader: () =>
          isSharedVendor
            ? import(`../devices/${this.device.vendor}/${this.device.type}/device.vue`)
            : import(`./${this.device.vendor}/${this.device.type}/consumer.vue`),
        errorComponent: OpenwbConsumerDeviceConfigFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
