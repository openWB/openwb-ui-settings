<template>
  <div class="consumer-generic-json">
    <openwb-base-heading>Einstellungen für JSON-Verbraucher</openwb-base-heading>
    <openwb-base-text-input
      title="URL"
      subtype="url"
      required
      :model-value="device.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    />
    <openwb-base-text-input
      title="jq current L1"
      subtype="text"
      :model-value="device.configuration.jq_current_l1"
      @update:model-value="updateConfiguration($event, 'configuration.jq_current_l1')"
    />
    <openwb-base-text-input
      title="jq current L2"
      subtype="text"
      :model-value="device.configuration.jq_current_l2"
      @update:model-value="updateConfiguration($event, 'configuration.jq_current_l2')"
    />
    <openwb-base-text-input
      title="jq current L3"
      subtype="text"
      :model-value="device.configuration.jq_current_l3"
      @update:model-value="updateConfiguration($event, 'configuration.jq_current_l3')"
    />
    <openwb-base-text-input
      title="jq power"
      subtype="text"
      :model-value="device.configuration.jq_power"
      @update:model-value="updateConfiguration($event, 'configuration.jq_power')"
    />
    <openwb-base-text-input
      title="jq temperatures"
      subtype="text"
      :model-value="device.configuration.jq_temperatures"
      @update:model-value="updateConfiguration($event, 'configuration.jq_temperatures')"
    />
    <openwb-base-text-input
      title="jq imported"
      subtype="text"
      :model-value="device.configuration.jq_imported"
      @update:model-value="updateConfiguration($event, 'configuration.jq_imported')"
    />
    <openwb-base-text-input
      title="jq exported"
      subtype="text"
      :model-value="device.configuration.jq_exported"
      @update:model-value="updateConfiguration($event, 'configuration.jq_exported')"
    />
    <openwb-base-text-input
      v-if="showSwitchPaths"
      title="jq switch on"
      subtype="text"
      :model-value="device.configuration.jq_switch_on"
      @update:model-value="updateConfiguration($event, 'configuration.jq_switch_on')"
    />
    <openwb-base-text-input
      v-if="showSwitchPaths"
      title="jq switch off"
      subtype="text"
      :model-value="device.configuration.jq_switch_off"
      @update:model-value="updateConfiguration($event, 'configuration.jq_switch_off')"
    />
    <openwb-base-text-input
      v-if="showPowerLimitPath"
      title="jq set power limit"
      subtype="text"
      :model-value="device.configuration.jq_set_power_limit"
      @update:model-value="updateConfiguration($event, 'configuration.jq_set_power_limit')"
    />
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerGenericJson",
  mixins: [ConsumerDeviceConfigMixin],
  computed: {
    usageType() {
      return this.device.consumerUsage?.type;
    },
    showSwitchPaths() {
      return ["suspendable_onoff", "continuous"].includes(this.usageType);
    },
    showPowerLimitPath() {
      return this.usageType === "suspendable_tunable";
    },
  },
};
</script>
