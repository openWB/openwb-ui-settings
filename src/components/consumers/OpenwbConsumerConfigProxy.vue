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
  methods: {
    getComponent() {
      console.debug(`loading consumer config: ${this.consumer.vendor} / ${this.consumer.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.consumer.vendor}/${this.consumer.type}/consumer.vue`),
        errorComponent: OpenwbConsumerConfigFallback,
      });
    },
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
  },
};
</script>
