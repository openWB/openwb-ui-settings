<template>
  <div class="ripple-control-receiver-gpio">
    <openwb-base-alert subtype="info">
      Wenn mindestens ein Kontakt geschlossen ist, wird die Ladung gesperrt. Wenn beide Kontakte offen sind, darf
      geladen werden.
    </openwb-base-alert>
  </div>
</template>

<script>
import RippleControlReceiverConfigMixin from "../RippleControlReceiverConfigMixin.vue";

export default {
  name: "RippleControlReceiverGpio",
  mixins: [RippleControlReceiverConfigMixin],
};
</script>
