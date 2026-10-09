<template>
  <div class="vehicle-soc-saic-ismart">
    <openwb-base-text-input
      title="Benutzername"
      required
      subtype="user"
      :model-value="vehicle.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    >
      <template #help> E-Mail-Adresse oder Telefonnummer für die Anmeldung in der MG-iSMART-App. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Kennwort"
      required
      subtype="password"
      :model-value="vehicle.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help> Das Passwort für die Anmeldung in der MG-iSMART-App. </template>
    </openwb-base-text-input>
    <openwb-base-button-group-input
      title="Benutzername ist E-Mail-Adresse"
      :buttons="[
        { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
        { buttonValue: false, text: 'Nein (Telefonnummer)', class: 'btn-outline-primary' },
      ]"
      :model-value="vehicle.configuration.username_is_email"
      @update:model-value="updateConfiguration($event, 'configuration.username_is_email')"
    />
    <openwb-base-text-input
      v-if="!vehicle.configuration.username_is_email"
      title="Landesvorwahl"
      required
      :model-value="vehicle.configuration.phone_country_code"
      @update:model-value="updateConfiguration($event, 'configuration.phone_country_code')"
    >
      <template #help> Landesvorwahl der Telefonnummer ohne führendes "+", z.B. "49" für Deutschland. </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="VIN"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Nur nötig, falls mehrere Fahrzeuge am Account hängen - sonst wird automatisch das einzige Fahrzeug verwendet.
      </template>
    </openwb-base-text-input>
    <openwb-base-select-input
      title="Region"
      required
      :options="[
        { value: 'eu', text: 'Europa' },
        { value: 'au', text: 'Australien' },
        { value: 'tr', text: 'Türkei' },
      ]"
      :model-value="vehicle.configuration.region"
      @update:model-value="updateConfiguration($event, 'configuration.region')"
    >
      <template #help> Die Region, in der das Fahrzeug/der Account registriert ist. </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocSaicIsmart",
  mixins: [VehicleConfigMixin],
};
</script>
