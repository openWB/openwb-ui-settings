<template>
  <openwb-base-heading> Einstellungen für I/O-Aktion "{{ ioAction.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
    :io-action="ioAction"
    :io-devices="ioDevices"
    @update:configuration="updateConfiguration($event)"
    @send-command="sendCommand($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbIoActionConfigFallback from "./OpenwbIoActionConfigFallback.vue";

export default {
  name: "OpenwbIoActionProxy",
  props: {
    ioAction: { type: Object, required: true },
    ioDevices: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  computed: {
    myComponent() {
      console.debug(`loading io action: ${this.ioAction.group} / ${this.ioAction.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.ioAction.group}/${this.ioAction.type}/io_action.vue`),
        errorComponent: OpenwbIoActionConfigFallback,
      });
    },
  },
  methods: {
    // event pass through
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
    // event pass through
    sendCommand(event) {
      this.$emit("sendCommand", event);
    },
  },
};
</script>
