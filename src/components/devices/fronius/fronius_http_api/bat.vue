<template>
  <div class="device-fronius-bat">
    <openwb-base-heading> Einstellungen für Fronius Batteriespeicher </openwb-base-heading>
    <openwb-base-number-input
      title="Meter ID"
      required
      min="0"
      max="65535"
      :model-value="component.configuration.meter_id"
      @update:model-value="updateConfiguration($event, 'configuration.meter_id')"
    />
    <openwb-base-heading> Aktive Speichersteuerung (optional) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Nur erforderlich, wenn der Speicher aktiv gesteuert werden soll (siehe Einstellungen -> Speicher). Ohne
      Zugangsdaten wird der Speicher weiterhin normal ausgelesen, kann aber nicht gesteuert werden.
    </openwb-base-alert>
    <openwb-base-text-input
      title="Username"
      :model-value="component.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    >
      <template #help>
        Für die aktive Speichersteuerung sind Nutzername und Passwort des Installateurzugangs erforderlich.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      :model-value="component.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Für die aktive Speichersteuerung sind Nutzername und Passwort des Installateurzugangs erforderlich.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceFroniusBat",
  mixins: [ComponentConfigMixin],
};
</script>
