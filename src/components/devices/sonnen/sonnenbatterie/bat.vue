<template>
  <div class="device-sonnenbatterie-bat">
    <openwb-base-alert
      v-if="device.configuration.variant === 3"
      subtype="info"
    >
      Die Batterie lässt sich aktiv durch openWB steuern, da die JSON-API v2 verwendet wird. Dazu muss zwingend ein
      gültiges API-Token eingetragen sein.
    </openwb-base-alert>
    <openwb-base-alert
      v-else
      subtype="info"
    >
      Die Batterie kann nicht aktiv durch openWB gesteuert werden, da die konfigurierte Datenverbindung dies nicht
      unterstützt. Es wird für die aktive Steuerung zwingend die 'JSON-API v2' benötigt.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSonnenbatterieBat",
  mixins: [ComponentConfigMixin],
};
</script>
