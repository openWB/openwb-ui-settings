<template>
  <div class="device-solar_log-counter">
    <openwb-base-alert subtype="info">
      <span class="text-danger">
        Solar-Log Zähler geben keine Ströme aus, sodass nur ein Lastmanagement anhand der Gesamtleistung, aber nicht
        phasenbasiert möglich ist.<br />
      </span>
      Solar-Log Zähler sind Hausverbrauchs-Zähler. Um die Werte am EVU-Punkt zu ermitteln, muss ein virtueller Zähler
      konfiguriert werden. Eine Beispiel-Konfiguration mit Solar-Log Zähler findest Du im
      <a
        :href="`https://wiki.openwb.de/doku.php?id=openwb:vc:${systemVersion}:software:einstell-konfig:konfiguration:hausverbrauch`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Wiki für Hausverbrauchs-Zähler </a
      >.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSolarLogCounter",
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";
import SystemVersion from "../../../mixins/SystemVersion.vue";

export default {
  name: "DeviceSolarLogCounter",
  mixins: [ComponentConfigMixin, SystemVersion],
};
</script>
