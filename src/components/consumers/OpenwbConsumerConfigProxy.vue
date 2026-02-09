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
  methods: {
    getComponent() {
      console.debug(`loading component: ${this.device.type} / ${this.component?.type}`);
      if (this.component !== undefined) {
        return defineAsyncComponent({
          loader: () => import(`./${this.device.vendor}/${this.device.type}/${this.component.type}.vue`),
          errorComponent: OpenwbConsumerComponentConfigFallback,
        });
      } else {
        return defineAsyncComponent({
          loader: () => import(`./${this.device.vendor}/${this.device.type}/device.vue`),
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
