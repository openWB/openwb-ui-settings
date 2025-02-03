<template>
  <openwb-base-heading> Einstellungen für I/O-Modul "{{ ioDevice.name }}" </openwb-base-heading>
  <component
    :is="myComponent"
    :io-device="ioDevice"
    @update:configuration="updateConfiguration($event)"
    @send-command="sendCommand($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbIoDeviceConfigFallback from "./OpenwbIoDeviceConfigFallback.vue";

export default {
  name: "OpenwbIoDeviceProxy",
  props: {
    ioDevice: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  computed: {
    myComponent() {
      console.debug(`loading io device: ${this.ioDevice.name} (${this.ioDevice.type})`);
      return defineAsyncComponent({
        loader: () => import(`./${this.ioDevice.type}/io_device.vue`),
        errorComponent: OpenwbIoDeviceConfigFallback,
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
