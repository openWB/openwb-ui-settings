<template>
  <div class="device-sonnenbatterie-counter">
    <openwb-base-alert subtype="info">
      Mit diesem Modul ist kein phasenbasiertes Lastmanagement möglich, da keine Ströme der einzelnen Phasen gemessen
      werden.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSonnenbatterieCounter",
  mixins: [ComponentConfigMixin],
};
</script>
