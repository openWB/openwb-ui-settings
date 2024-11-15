<template>
  <div class="vehicle-soc-ovms">
    <openwb-base-text-input
      title="Server URL"
      required
      :model-value="vehicle.configuration.server_url"
      @update:model-value="updateConfiguration($event, 'configuration.server_url')"
    >
      <template #help>
        Die URL (incl. Port) des API des OVMS-Servers, an dem das OVMS-Modul angemeldet ist, z.B. <br />
        https://ovms.dexters-web.de:6869<br />
        oder<br />
        https://api.openvehicles.com:6869<br />
        oder ein custom server<br />
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Der Benutzername für die Anmeldung am benutzen OVMS-Servers. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung am OVMS-Server. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Vehicle Id"
      required
      :model-value="vehicle.configuration.vehicleId"
      @update:model-value="updateConfiguration($event, 'configuration.vehicleId')"
    >
      <template #help> Die Id des Fahrzeugs im OVMS, auch Module Id genannt. </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocOVMS",
  mixins: [VehicleConfigMixin],
};
</script>
