<template>
  <div class="device-shelly-counter">
    <openwb-base-heading>
      Einstellungen für Shelly Zähler
      <span class="small">(Modul: {{ $options.name }})</span>
    </openwb-base-heading>
    <openwb-base-alert subtype="info">
      <span class="text-danger">
        Als EVU-Zähler werden nur dreiphasige Shellys unterstützt (z.B. Shelly 3EM, Shelly Pro 3EM)</span
      ><br />
      Diese Komponente benötigt keine Einstellungen.
    </openwb-base-alert>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceShellyCounter",
  mixins: [ComponentConfigMixin],
};
</script>
