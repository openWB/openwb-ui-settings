<template>
  <div class="device-discovergy-inverter">
    <openwb-base-heading> Einstellungen für Discovergy Wechselrichter </openwb-base-heading>
    <openwb-base-text-input
      title="Meter-ID"
      required
      :model-value="component.configuration.meter_id"
      @update:model-value="updateConfiguration($event, 'configuration.meter_id')"
    >
      <template #help>
        Um die ID herauszufinden mit dem Browser die Adresse
        <a
          href="https://api.discovergy.com/public/v1/meters"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://api.discovergy.com/public/v1/meters
        </a>
        aufrufen und dort Benutzername und Passwort eingeben. Hier wird nun u.a. die ID des Zählers angezeigt.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceDiscovergyInverter",
  mixins: [ComponentConfigMixin],
};
</script>
