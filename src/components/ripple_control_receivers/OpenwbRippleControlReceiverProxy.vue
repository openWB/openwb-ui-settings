<template>
  <openwb-base-heading>
    Einstellungen für RSE-Modul "{{ rippleControlReceiver.name }}"
  </openwb-base-heading>
  <component
    :is="myComponent"
    :ripple-control-receiver="rippleControlReceiver"
    @update:configuration="updateConfiguration($event)"
  />
</template>

<script>
import { defineAsyncComponent } from "vue";
import RippleControlReceiverConfigMixin from "./RippleControlReceiverConfigMixin.vue";
import OpenwbRippleControlReceiverFallback from "./OpenwbRippleControlReceiverConfigFallback.vue";

export default {
  name: "OpenwbRippleControlReceiverProxy",
  mixins: [RippleControlReceiverConfigMixin],
  computed: {
    myComponent() {
      console.debug(
        `loading backup cloud: ${this.rippleControlReceiver.type}`,
      );
      return defineAsyncComponent({
        loader: () =>
          import(
            `./${this.rippleControlReceiver.type}/ripple_control_receiver.vue`
          ),
        errorComponent: OpenwbRippleControlReceiverFallback,
      });
    },
  },
};
</script>
