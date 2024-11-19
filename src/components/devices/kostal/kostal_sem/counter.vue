<template>
  <div class="device-kostal-sem-counter">
    <openwb-base-alert subtype="info">
      Diese Komponente ist nur richtig, wenn der Zähler NICHT direkt am Wechselrichter (Kostal Plenticore) angeschlossen
      ist und daher separat abgefragt werden muss.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceKostalSemCounter",
  mixins: [ComponentConfigMixin],
};
</script>
