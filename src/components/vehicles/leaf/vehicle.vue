<template>
  <div class="vehicle-soc-leaf">
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.user_id"
      @update:model-value="updateConfiguration($event, 'configuration.user_id')"
    >
      <template #help> Der Benutzername für die Anmeldung an den Nissan-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung an den Nissan-Servern. </template>
    </openwb-base-text-input>
    <openwb-base-select-input
      title="Region"
      required
      not-selected="Bitte auswählen"
      :options="[
        { value: 'NE', text: 'Europa (getestet)' },
        { value: 'NNA', text: 'USA (nicht getestet)' },
        { value: 'NCI', text: 'Kanada (nicht getestet)' },
        { value: 'NMA', text: 'Australien (nicht getestet)' },
        { value: 'NML', text: 'Japan (nicht getestet)' },
      ]"
      :model-value="vehicle.configuration.region"
      @update:model-value="updateConfiguration($event, 'configuration.region')"
    >
      <template #help> Die Region, in der das Fahrzeug betrieben wird. </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocLeaf",
  mixins: [VehicleConfigMixin],
};
</script>
