<template>
  <component
    :is="getComponent()"
    :consumer="consumer"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbConsumerConfigFallback from "./OpenwbConsumerConfigFallback.vue";

export default {
  name: "OpenwbConsumerConfigProxy",
  props: {
    consumer: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  data() {
    return {
      SHARED_DEVICE_VENDORS: ["openwb"],
    };
  },
  methods: {
    getComponent() {
      console.debug(`loading consumer config: ${this.consumer.vendor} / ${this.consumer.type}`);
      const isSharedVendor = this.SHARED_DEVICE_VENDORS.includes(this.consumer.vendor);
      return defineAsyncComponent({
        loader: () =>
          isSharedVendor
            ? import(`../devices/${this.consumer.vendor}/${this.consumer.type}/device.vue`)
            : import(`./${this.consumer.vendor}/${this.consumer.type}/consumer.vue`),
        errorComponent: OpenwbConsumerConfigFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
