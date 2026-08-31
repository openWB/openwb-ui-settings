<template>
  <div class="consumer-generic-dac">
    <openwb-base-heading>Einstellungen für DAC-Verbraucher</openwb-base-heading>
    <openwb-base-alert subtype="info">
      Der anliegende Überschuss wird in eine Voltzahl zwischen 0.01V und 10.0V umgewandelt. Bezug wird als 0 Volt
      übertragen.
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
    <openwb-base-select-input
      title="Modell"
      not-selected="Bitte auswählen"
      :options="modelOptions"
      :model-value="consumer.configuration.model"
      @update:model-value="updateConfiguration($event, 'configuration.model')"
    />
  </div>
</template>

<script>
import ConsumerConfigMixin from "../../ConsumerConfigMixin.vue";

const MODEL_OPTIONS = [
  { text: "N4Dac02", value: "N4Dac02" },
  { text: "DA02", value: "DA02" },
  { text: "M120T", value: "M120T" },
  { text: "AA02B", value: "AA02B" },
];

export default {
  name: "ConsumerGenericDac",
  mixins: [ConsumerConfigMixin],
  data() {
    return {
      modelOptions: MODEL_OPTIONS,
    };
  },
};
</script>
