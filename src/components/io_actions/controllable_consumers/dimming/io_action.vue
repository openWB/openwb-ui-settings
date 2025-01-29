<template>
  <openwb-io-single-pattern
    v-model="value"
    :digital-inputs="ioDevice?.input?.digital"
    :io-device="ioDevice"
  />
  <openwb-base-number-input
    title="maximale Bezugsleistung"
    unit="kW"
    min="0"
    step="0.1"
    required
    :disabled="Object.keys(value[0].input_matrix).length > 0 ? false : true"
    :model-value="ioAction?.configuration.max_import_power / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_import_power')"
  >
    <template #help> Bitte die maximale Bezugsleistung in Watt angeben. </template>
  </openwb-base-number-input>
  <hr />
  <openwb-base-select-input
    title="Anwenden auf..."
    :groups="availableDevices"
    required
    multiple
    :disabled="Object.keys(value[0].input_matrix).length > 0 ? false : true"
    :model-value="ioAction?.configuration.devices"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte die Ladepunkte und/oder Komponenten auswählen, welche berücksichtigt werden sollen. Es können mehrere
      Einträge ausgewählt werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoSinglePattern from "../../OpenwbIoSinglePattern.vue";

export default {
  name: "IoActionDimming",
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
    availableDevices() {
      return [
        {
          label: "Ladepunkte",
          options: this.availableChargePoints.map((cp) => ({ value: [`cp${cp.value}`], text: cp.text })),
        },
      ];
    },
  },
};
</script>
