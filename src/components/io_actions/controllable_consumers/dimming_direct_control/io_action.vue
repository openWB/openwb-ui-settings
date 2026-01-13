<template>
  <openwb-base-alert
    v-if="ioDevice?.type === 'eebus'"
    subtype="warning"
  >
    Steuerboxen mit EEBus-Schnistelle sind für Dimmen per Direktsteuerung nicht geeignet. Bitte wähle ein anderes
    I/O-Gerät aus.
  </openwb-base-alert>
  <openwb-io-single-pattern
    v-else-if="ioDevice"
    v-model="value"
    :contacts="ioDevice?.input?.digital"
  />
  <hr v-if="ioDevice?.type !== 'eebus'" />
  <openwb-base-select-input
    v-if="ioDevice?.type !== 'eebus'"
    title="Verhalten anwenden auf..."
    not-selected="Bitte auswählen"
    :empty-value="[]"
    :groups="availableDevices"
    multiple
    required
    :disabled="Object.keys(value[0].matrix).length > 0 ? false : true"
    :model-value="ioAction?.configuration.devices"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte die Ladepunkte und/oder digitalen Ausgänge auswählen, auf welche das Verhalten angewendet werden soll. Es
      können mehrere Einträge ausgewählt werden. Ladepunkte werden auf 4,2kW gedimmt, eine Verrechnung mit PV-Erzeugung
      findet nicht statt.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoSinglePattern from "../../OpenwbIoSinglePattern.vue";

export default {
  name: "IoActionDimmingDirectControl",
  components: {
    OpenwbIoSinglePattern,
  },
  mixins: [OpenwbIoActionConfigMixin],
  computed: {
    value: {
      get() {
        return this.ioAction.configuration.input_pattern;
      },
      set(newValue) {
        this.updateConfiguration(newValue, "configuration.input_pattern");
      },
    },
    ioDevicesOutputOptions() {
      let deviceGroups = [];
      this.availableIoDevices.forEach((device) => {
        let options = [];
        Object.keys(device?.output?.digital || {}).forEach((digitalOutput) => {
          options.push({
            text: `${digitalOutput}`,
            value: { type: "io", id: device.id, digital_output: digitalOutput },
          });
        });
        if (options.length > 0) {
          deviceGroups.push({
            label: device.name,
            options: options,
          });
        }
      });
      if (deviceGroups.length === 0) {
        deviceGroups.push({
          label: "Keine digitalen Ausgänge verfügbar",
          options: [],
        });
      }
      return deviceGroups;
    },
    availableDevices() {
      let label = this.availableChargePoints.length > 0 ? "Ladepunkte" : "Keine Ladepunkte verfügbar";
      return [
        {
          label: label,
          options: this.availableChargePoints.map((cp) => ({ value: { type: "cp", id: cp.value }, text: cp.text })),
        },
      ].concat(this.ioDevicesOutputOptions);
    },
  },
};
</script>
