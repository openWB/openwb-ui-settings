<template>
  <div class="device-shelly">
    <openwb-base-heading> Einstellungen für Shelly EM (Messen) </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Unterstützt werden theoretisch alle ein- und dreiphasigen Shelly der Generation 1-3. Getestete Modelle sind Shelly
      1pm, 1pm plus, Pro Pro 3EM, Plug S.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Benutzername"
      subtype="user"
      required
      :model-value="device.configuration.username"
      @update:model-value="updateConfiguration($event, 'configuration.username')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    />
    <openwb-base-number-input
      title="Channel"
      required
      :max="3"
      :model-value="device.configuration.channel"
      @update:model-value="updateConfiguration($event, 'configuration.channel')"
    >
      <template #help>
        Gibt an an welcher Phase des Hausanschlusses die (erste) Phase des Shelly angeschlossen ist.
      </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Phase"
      required
      :min="1"
      :max="3"
      :model-value="device.configuration.phase"
      @update:model-value="updateConfiguration($event, 'configuration.phase')"
    >
      <template #help>
        Gibt an an welcher Phase des Hausanschlusses die (erste) Phase des Shelly angeschlossen ist.
      </template>
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Faktor"
      required
      :min="1"
      :max="3"
      :model-value="device.configuration.factor"
      @update:model-value="updateConfiguration($event, 'configuration.factor')"
    >
      <template #help> Gibt an an welcher Faktor der Shelly Messwerte skaliert werden sollen. </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerShellyEm",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
