<template>
  <div class="device-shelly">
    <openwb-base-heading> Einstellungen für Shelly </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Unterstützt werden theoretisch alle ein- und dreiphasigen Shellys der Generation 1-3. Getestete Modelle sind
      Shelly 1pm, 1pm plus, Pro Pro 3EM, Plug S.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-select-input
      title="Vorzeichen invertieren"
      not-selected="Bitte auswählen"
      :options="[
        { value: -1, text: 'ja' },
        { value: 1, text: 'nein' },
      ]"
      :model-value="device.configuration.factor"
      required
      @update:model-value="updateConfiguration($event, 'configuration.factor')"
    >
      <template #help>
        Einige Shelly Modelle liefern die Leistung mit umgedrehtem Vorzeichen. Falls dies der Fall sein sollte, das
        Vorzeichen invertieren.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceShelly",
  mixins: [DeviceConfigMixin],
};
</script>
