<template>
  <div class="consumer-generic-http">
    <openwb-base-heading>Einstellungen für HTTP-Verbraucher</openwb-base-heading>
    <openwb-base-text-input
      title="Server-URL"
      subtype="url"
      required
      :model-value="device.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    />
    <openwb-base-text-input
      title="Pfad Strom L1"
      subtype="text"
      :model-value="device.configuration.current_l1_path"
      @update:model-value="updateConfiguration($event, 'configuration.current_l1_path')"
    />
    <openwb-base-text-input
      title="Pfad Strom L2"
      subtype="text"
      :model-value="device.configuration.current_l2_path"
      @update:model-value="updateConfiguration($event, 'configuration.current_l2_path')"
    />
    <openwb-base-text-input
      title="Pfad Strom L3"
      subtype="text"
      :model-value="device.configuration.current_l3_path"
      @update:model-value="updateConfiguration($event, 'configuration.current_l3_path')"
    />
    <openwb-base-text-input
      title="Pfad Leistung"
      subtype="text"
      :model-value="device.configuration.power_path"
      @update:model-value="updateConfiguration($event, 'configuration.power_path')"
    />
    <openwb-base-text-input
      title="Pfad Temperaturen"
      subtype="text"
      :model-value="device.configuration.temperatures_path"
      @update:model-value="updateConfiguration($event, 'configuration.temperatures_path')"
    />
    <openwb-base-text-input
      title="Pfad Bezug"
      subtype="text"
      :model-value="device.configuration.imported_path"
      @update:model-value="updateConfiguration($event, 'configuration.imported_path')"
    />
    <openwb-base-text-input
      title="Pfad Einspeisung"
      subtype="text"
      :model-value="device.configuration.exported_path"
      @update:model-value="updateConfiguration($event, 'configuration.exported_path')"
    />
    <openwb-base-text-input
      v-if="showSwitchPaths"
      title="Pfad Schalten Ein"
      subtype="text"
      :model-value="device.configuration.switch_on_path"
      @update:model-value="updateConfiguration($event, 'configuration.switch_on_path')"
    />
    <openwb-base-text-input
      v-if="showSwitchPaths"
      title="Pfad Schalten Aus"
      subtype="text"
      :model-value="device.configuration.switch_off_path"
      @update:model-value="updateConfiguration($event, 'configuration.switch_off_path')"
    />
    <openwb-base-text-input
      v-if="showPowerLimitPath"
      title="Pfad Set Power Limit"
      subtype="text"
      :model-value="device.configuration.set_power_limit_path"
      @update:model-value="updateConfiguration($event, 'configuration.set_power_limit_path')"
    />
  </div>
</template>

<script>
import ConsumerDeviceConfigMixin from "../../ConsumerDeviceConfigMixin.vue";

export default {
  name: "ConsumerGenericHttp",
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
