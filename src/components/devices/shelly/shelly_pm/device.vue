<template>
  <div class="device-shelly">
    <openwb-base-heading> Einstellungen für Shelly </openwb-base-heading>
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
    <openwb-base-number-input
      title="Port"
      :min="1"
      :model-value="device.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    >
    </openwb-base-number-input>
    <openwb-base-number-input
      title="Modbus id"
      :min="1"
      :model-value="device.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
    </openwb-base-number-input>
    <hr />
    <openwb-base-heading> Elektrischer Anschluss </openwb-base-heading>
    <openwb-base-button-group-input
      title="Anzahl angeschlossener Phasen"
      :buttons="[
        { buttonValue: 1, text: '1' },
        { buttonValue: 2, text: '2' },
        { buttonValue: 3, text: '3' },
      ]"
      :model-value="device.consumerConfig.connected_phases"
      @update:model-value="updateConfiguration($event, 'consumerConfig.connected_phases')"
    />
    <openwb-base-button-group-input
      title="Phase 1 des Ladekabels"
      :buttons="[
        { buttonValue: 1, text: 'EVU L1' },
        { buttonValue: 2, text: 'EVU L2' },
        { buttonValue: 3, text: 'EVU L3' },
      ]"
      :model-value="device.consumerConfig.phase_1"
      @update:model-value="updateConfiguration($event, 'consumerConfig.phase_1')"
    >
    </openwb-base-button-group-input>
    <openwb-base-number-input
      title="Max Leistung"
      :min="1"
      :model-value="device.consumerConfig.max_power"
      @update:model-value="updateConfiguration($event, 'consumerConfig.max_power')"
    >
    </openwb-base-number-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceShelly",
  mixins: [DeviceConfigMixin],
};
</script>
