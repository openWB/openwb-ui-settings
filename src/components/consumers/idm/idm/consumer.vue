<template>
  <div class="device-idm">
    <openwb-base-heading> Einstellungen für IDM Wärmepumpe </openwb-base-heading>
    <openwb-base-alert subtype="info">
      ModbusTCP muss in der Fachmannebene aktiviert sein. Bei Verwendung "Die Wärmepumpe übernimmt die Steuerung
      selbst." sendet openWB PV-Erzeugung, Hausverbrauch und Batteriewerte an die Wärmepumpe - zusätzlich muss in der
      Fachmannebene unter "PV Signal" die Option "Gebäudeleittechnik / Smartfox" gewählt sein, sonst wertet die
      Wärmepumpe die Werte nicht aus. Bei "Steuerung durch Vorgabe einer Sollleistung" schreibt openWB die Sollleistung
      als PV-Überschuss in die Regelung, was die PV-Eigenverbrauchs-Statistik im IDM-Portal verfälscht.
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
    <openwb-base-number-input
      title="Version"
      required
      :model-value="device.configuration.version"
      min="1"
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerIDM",
  mixins: [ConsumerDeviceConfigMixin],
};
</script>
