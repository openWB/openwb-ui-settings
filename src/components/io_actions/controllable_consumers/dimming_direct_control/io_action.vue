<template>
  <openwb-io-single-pattern
    v-model="value"
    :digital-inputs="ioDevice?.input?.digital"
    :io-device="ioDevice"
  />
  <hr />
  <openwb-base-select-input
    title="Verhalten anwenden auf..."
    not-selected="Bitte auswählen"
    :empty-value="[]"
    :groups="availableDevices"
    multiple
    required
    :disabled="Object.keys(value[0].input_matrix).length > 0 ? false : true"
    :model-value="ioAction?.configuration.devices"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte den Ladepunkt oder die Komponente auswählen, auf welche das Verhalten angewendet werden soll. Es können
      mehrere Einträge ausgewählt werden.
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
