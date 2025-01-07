<template>
  <openwb-base-select-input
    title="Eingang"
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="inputOptions"
    :model-value="ioAction?.configuration.digital_input"
    @update:model-value="updateConfiguration($event, 'configuration.digital_input')"
  >
    <template #help>
      Bitte den Eingang auswählen, auf welchen reagiert werden soll. Es kann nur ein Eingang ausgewählt werden.
    </template>
  </openwb-base-select-input>
  <openwb-base-number-input
    title="maximale Bezugsleistung"
    unit="kW"
    min="0"
    step="0.1"
    :model-value="ioAction?.configuration.max_import_power / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_import_power')"
  >
    <template #help> Bitte die maximale Bezugsleistung in Watt angeben. </template>
  </openwb-base-number-input>
  <openwb-base-heading>Anwenden auf...</openwb-base-heading>
  <openwb-base-select-input
    title="Ladepunkte"
    :options="availableChargePoints"
    :model-value="ioAction?.configuration.cp_ids"
    multiple
    @update:model-value="updateConfiguration($event, 'configuration.cp_ids')"
  >
    <template #help>
      Bitte die Ladepunkte auswählen, welche berücksichtigt werden sollen. Es können mehrere Ladepunkte ausgewählt
      werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";

export default {
  name: "IoActionDimmingDirectControl",
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
    inputOptions() {
      return Object.keys(this.ioDevice?.input?.digital).map((input) => {
        return { value: input, text: input };
      });
    },
  },
};
</script>
