<template>
  <div class="device-sungrow">
    <openwb-base-heading> Einstellungen für Sungrow </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Bitte zur Fehlervermeidung die Firmware des Sungrow Wechselrichters und WiNet-S Dongles aktuell halten.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="device.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <openwb-base-select-input
      title="Version"
      :options="[
        { value: 0, text: 'SH (Hybrid)' },
        { value: 3, text: 'SH (Hybrid) über WiNet-S Dongle' },
        { value: 1, text: 'SG (kein Hybrid)' },
        { value: 2, text: 'SG (kein Hybrid) über WiNet-S Dongle' },
      ]"
      :model-value="device.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    >
      <template #help>
        Die Variante SH sollte möglichst über den internen LAN-Port genutzt werden (befindet sich am Wechselrichter
        hinter dem WiNet-S Dongle), da nur hier alle Werte vollständig ausgelesen werden können. Den WiNet-S Dongle
        zusätzlich ins Heimnetz (per LAN oder WLAN) einbinden, um iSolarCloud nutzen zu können.
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceSungrow",
  mixins: [DeviceConfigMixin],
};
</script>
