<template>
  <div class="device-lambda">
    <openwb-base-heading> Einstellungen für Lambda Wärmepumpe </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss in der Fachmannebene aktiviert sein. Ist als Verwendungszweck "Wärmepumpe in
      Eigensteuerung" gewählt, sendet openWB den aktuellen Netzbezug an den E-Manager der
      Wärmepumpe - dafür muss zusätzlich am E-Manager die Datenquelle auf "Modbus Client"
      umgestellt werden, sonst wertet die Wärmepumpe den gesendeten Wert nicht aus.
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
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerLambda",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
