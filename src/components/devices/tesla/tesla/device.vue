<template>
  <div class="device-tesla">
    <openwb-base-heading> Einstellungen für Tesla </openwb-base-heading>
    <openwb-base-alert subtype="danger">
      <span style="font-weight: bold">
        Tesla hat in der aktuellen Firmware-Version die lokale API der PowerWall abgeschaltet. </span
      >Daher ist es mit dieser Firmware nicht mehr möglich, die PowerWall direkt auszulesen. Wir prüfen aktuell den
      Zugriff über die Tesla-Server. Bis zur Umsetzung dieser Funktion ist es nicht möglich, die PowerWall lokal
      auszulesen.<br />
      <span style="font-weight: bold">
        Wenn die lokale Abfrage bei Dir noch funktioniert, dann solltest Du die Firmware der PowerWall nicht
        aktualisieren! </span
      ><br />
      Wir empfehlen, dass Du Tesla kontaktierst und Kritik an dieser Entscheidung mitteilst. Nur so können wir hoffen,
      dass Tesla die lokale API wieder aktiviert. Mit der Cloud-API kommt es zwangsläufig zu Verzögerungen (Latenzen),
      welche eine Regelung durch openWB erschweren. Weiterhin kommt es zu einem totalen Ausfall, wenn die
      Internetverbindung gestört ist. Aus diesen Gründen ist eine lokale API immer vorzuziehen.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="E-Mail"
      subtype="email"
      required
      :model-value="device.configuration.email"
      @update:model-value="updateConfiguration($event, 'configuration.email')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceTesla",
  mixins: [DeviceConfigMixin],
};
</script>
