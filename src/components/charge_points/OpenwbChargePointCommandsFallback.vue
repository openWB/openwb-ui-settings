<template>
  <div class="charge-point-commands-fallback">
    <!-- <openwb-base-alert subtype="secondary">
      Der Ladepunkt-Typ "{{ chargePoint.type }}" bietet keine Befehle an.
    </openwb-base-alert> -->
  </div>
</template>

<script>
import ChargePointCommandsMixin from "./ChargePointCommandsMixin.vue";

export default {
  name: "ChargePointCommandsFallback",
  mixins: [ChargePointCommandsMixin],
};
</script>
