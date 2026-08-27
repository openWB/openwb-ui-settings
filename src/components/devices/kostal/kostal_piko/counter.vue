<template>
  <div class="device-kostal-piko-counter">
    <openwb-base-alert subtype="info">
      Wenn der Zähler im Hausverbrauchs-Zweig installiert ist, muss die Hierarchie wie im
      <a
        :href="`https://wiki.openwb.de/doku.php?id=openwb:vc:${systemVersion}:software:einstell-konfig:konfiguration:hausverbrauch`"
        target="_blank"
        rel="noopener noreferrer"
        >Wiki für Hausverbrauchs-Zähler</a
      >
      beschrieben, angeordnet werden.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";
import SystemVersion from "../../../mixins/SystemVersion.vue";

export default {
  name: "DeviceKostalPikoCounter",
  mixins: [ComponentConfigMixin, SystemVersion],
};
</script>
