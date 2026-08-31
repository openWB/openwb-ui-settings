<template>
  <div class="consumer-lambda">
    <openwb-base-heading> Einstellungen für Lambda Wärmepumpe </openwb-base-heading>
    <openwb-base-alert subtype="info">
      Modbus TCP muss in der Fachmannebene aktiviert sein. Bei Verwendung "Wärmepumpe in Eigensteuerung" sendet openWB
      den aktuellen Netzbezug an den E-Manager der Wärmepumpe - zusätzlich muss am E-Manager die Datenquelle auf "Modbus
      Client" umgestellt werden, sonst wertet die Wärmepumpe den Wert nicht aus. Bei "Stufenlos regelbar" schreibt
      openWB stattdessen die Sollleistung in dasselbe Register, wodurch der an die Wärmepumpe gemeldete Netzbezug
      verfälscht wird.
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="consumer.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :min="1"
      :max="65535"
      :model-value="consumer.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="consumer.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

export default {
  name: "ConsumerLambda",
  mixins: [ConsumerConfigMixin],
};
</script>
