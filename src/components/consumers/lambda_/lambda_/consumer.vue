<template>
  <div class="device-lambda">
    <openwb-base-heading> Einstellungen für Lambda Wärmepumpe </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss in der Fachmannebene aktiviert sein. Soll openWB den PV-Überschuss senden, muss
      zusätzlich am E-Manager der Wärmepumpe die Datenquelle auf "Modbus Client" umgestellt werden - ohne
      diese Einstellung wertet die Wärmepumpe den gesendeten Wert nicht aus.
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
      title="PV-Überschuss senden"
      not-selected="Bitte auswählen"
      :options="[
        { value: true, text: 'ja' },
        { value: false, text: 'nein' },
      ]"
      :model-value="device.configuration.send_values"
      required
      @update:model-value="updateConfiguration($event, 'configuration.send_values')"
    >
      <template #help>
        Sendet den aktuellen PV-Überschuss an den E-Manager der Wärmepumpe. Setzt voraus, dass die
        Datenquelle des E-Managers auf "Modbus Client" eingestellt ist (siehe Hinweis oben).
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerLambda",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>