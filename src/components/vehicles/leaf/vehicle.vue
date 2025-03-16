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
	<openwb-base-text-input
      title="Region"
      required
      :model-value="vehicle.configuration.region"
      @update:model-value="updateConfiguration($event, 'configuration.region')"
    >
      <template #help>
		Das Regionskürzel für die Anmeldung an den Nissan-Servern. z.B. NE für Europa.<br />
		Liste der Regionskürzel:<br />
		<ol>
			<li>NE : Europa, getestet,</li>
			<li>NNA : USA, nicht getestet,</li>
			<li>NCI : Kanada, nicht getestet,</li>
			<li>NMA : Australien, nicht getestet,</li>
			<li>NML : Japan, nicht getestet.</li>
		</ol>
	  </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocLeaf",
  mixins: [VehicleConfigMixin],
};
</script>
