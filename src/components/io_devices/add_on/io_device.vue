<template>
  <div class="io-device-add-on">
    <openwb-base-select-input
      title="Installiert auf..."
      not-selected="Bitte auswählen"
      :empty-value="null"
      :options="[{ value: 'localhost', text: 'dieser openWB' }]"
      :groups="availableIoSources"
      :model-value="ioDevice.configuration.host"
      @update:model-value="updateConfiguration($event, 'configuration.host')"
    >
      <template #help>
        Bitte die Komponente auswählen, an der die Add-On-Platine installiert ist.<br />
        Unterstützt werden:<br />
        <ul>
          <li>openWB standalone (als primary oder Zusatzdisplay)</li>
          <li>openWB Ladepunkte als primary ("interne openWB") und secondary ("externe openWB")</li>
        </ul>
      </template>
    </openwb-base-select-input>
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";
import ComponentState from "../../mixins/ComponentState.vue";

export default {
  name: "IoDeviceAddOn",
  mixins: [ComponentState, OpenwbIoDeviceConfigMixin],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/chargepoint/+/config"],
    };
  },
  computed: {
    configuredChargePoints() {
      const chargePointConfigurations = this.getWildcardTopics("openWB/chargepoint/+/config");
      let chargePoints = [];
      for (const element of Object.values(chargePointConfigurations)) {
        if (["external_openwb"].includes(element.type)) {
          if (chargePoints.find((cp) => cp.value === element.configuration.ip_address)) {
            continue;
          }
          chargePoints.push({
            value: element.configuration.ip_address,
            text: element.name,
          });
        }
      }
      return chargePoints;
    },
    configuredDisplays() {
      // ToDo: Implement
      return [];
    },
    availableIoSources: {
      get() {
        return [
          {
            label: "Ladepunkte",
            options: this.configuredChargePoints,
          },
          {
            label: "Zusatzdisplays",
            options: this.configuredDisplays,
          },
        ].filter((group) => group.options.length > 0);
      },
    },
  },
};
</script>
