<template>
  <div class="device-sonnenbatterie">
    <openwb-base-heading> Einstellungen für SonnenBatterie </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Die Leistung steht nur in den Varianten "Rest-API 2" und "JSON-API" zur Verfügung.<br />
      Die aktive Steuerung des Speichers durch openWB ist nur mit der JSON-API v2 möglich.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-select-input
      title="Datenverbindung"
      required
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'Rest-API 1 (z.B. ECO 4)' },
        { value: 2, text: 'Rest-API 2 (z.B. ECO 6)' },
        { value: 1, text: 'JSON-API v1(z.B. ECO 8 oder 10)' },
        { value: 3, text: 'JSON-API v2(z.B. ECO 8 oder 10)' },
      ]"
      :model-value="device.configuration.variant"
      @update:model-value="updateConfiguration($event, 'configuration.variant')"
    >
      <template #help>
        Je nach SonnenBatterie muss die richtige Datenverbindung ausgewählt werden. Folgende URLs werden zum Abruf der
        Daten genutzt und können auch manuell über einen Browser abgefragt werden, um die richtige Einstellung zu
        finden:<br />
        Rest-API 1:
        <a
          :href="linkRestApi1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ linkRestApi1 }} </a
        ><br />
        Rest-API 2:
        <a
          :href="linkRestApi2"
          target="_blank"
          rel="noopener noreferrer"
          >{{ linkRestApi2 }}</a
        ><br />
        JSON-API v1:
        <a
          :href="linkJsonApi1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ linkJsonApi1 }} </a
        ><br />
        JSON-API v2:
        <a
          :href="linkJsonApi2"
          target="_blank"
          rel="noopener noreferrer"
          >{{ linkJsonApi2 }}</a
        ><br />
      </template>
    </openwb-base-select-input>
    <openwb-base-text-input
      v-if="device.configuration.variant === 3"
      title="API-Token"
      subtype="password"
      required
      :model-value="device.configuration.api_v2_token"
      @update:model-value="updateConfiguration($event, 'configuration.api_v2_token')"
    >
      <template #help>
        API-Token für JSON-API v2. Dieses Token wird benötigt, um detaillierte Daten auszulesen und den Speicher aktiv
        zu steuern. Es kann in der Weboberfläche der SonnenBatterie unter "Software-Integration" erstellt werden.<br />
        Für die aktive Steuerung durch openWB ist ebenfalls die "Write API" zu aktivieren!
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSonnenbatterie",
  mixins: [DeviceConfigMixin],
  computed: {
    linkRestApi1() {
      return "http://" + this.device.configuration.ip_address + ":7979/rest/devices/battery";
    },
    linkRestApi2() {
      return "http://" + this.device.configuration.ip_address + ":7979/rest/devices/battery/M05";
    },
    linkJsonApi1() {
      return "http://" + this.device.configuration.ip_address + "/api/v1/status";
    },
    linkJsonApi2() {
      return "http://" + this.device.configuration.ip_address + "/api/v2/status";
    },
  },
};
</script>
