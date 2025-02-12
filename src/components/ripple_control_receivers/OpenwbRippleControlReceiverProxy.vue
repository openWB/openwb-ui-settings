<template>
  <openwb-base-heading> Einstellungen für RSE-Modul "{{ rippleControlReceiver.name }}" </openwb-base-heading>
  <component
    :is="getRippleControlReceiverComponent()"
    :ripple-control-receiver="rippleControlReceiver"
    @update:configuration="updateConfiguration($event)"
    @send-command="sendCommand($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbRippleControlReceiverFallback from "./OpenwbRippleControlReceiverConfigFallback.vue";

export default {
  name: "OpenwbRippleControlReceiverProxy",
  props: {
    rippleControlReceiver: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  methods: {
    getRippleControlReceiverComponent() {
      console.debug(`loading ripple control receiver: ${this.rippleControlReceiver.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.rippleControlReceiver.type}/ripple_control_receiver.vue`),
        errorComponent: OpenwbRippleControlReceiverFallback,
      });
    },
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
