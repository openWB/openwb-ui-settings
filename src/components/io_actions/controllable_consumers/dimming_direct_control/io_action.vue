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
  <hr />
  <openwb-base-heading title="Verhalten anwenden auf..."> Verhalten anwenden auf... </openwb-base-heading>
  <openwb-base-select-input
    title="Ladepunkt"
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="availableChargePoints"
    :model-value="ioAction?.configuration.cp_id"
    @update:model-value="updateConfiguration($event, 'configuration.cp_id')"
  >
    <template #help>
      Bitte den Ladepunkt auswählen, auf welchen das Verhalten angewendet werden soll. Es kann nur ein Ladepunkt
      ausgewählt werden.
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
