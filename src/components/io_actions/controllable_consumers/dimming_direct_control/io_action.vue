<template>
  <openwb-base-select-input
    v-model="definedInput"
    title="Eingang"
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="inputOptions"
  >
    <template #help>
      Bitte den Eingang auswählen, auf welchen reagiert werden soll. Es kann nur ein Eingang ausgewählt werden.
    </template>
  </openwb-base-select-input>
  <openwb-base-button-group-input
    v-if="definedInput"
    v-model="definedNormalMode"
    title="Normaler Zustand"
    :buttons="[
      { buttonValue: true, text: 'geschlossen (NC)' },
      { buttonValue: false, text: 'geöffnet (NO)' },
    ]"
  >
    <template #help>
      Bitte Einstellen, ob der Eingang im normalen Zustand geschlossen (NC) oder geöffnet (NO) ist. Dieser Zustand wird
      verwendet, um den Eingang zu überwachen.
    </template>
  </openwb-base-button-group-input>
  <hr />
  <openwb-base-select-input
    title="Verhalten anwenden auf..."
    not-selected="Bitte auswählen"
    :empty-value="null"
    :groups="availableDevices"
    :model-value="ioAction?.configuration.device"
    @update:model-value="updateConfiguration($event, 'configuration.device')"
  >
    <template #help>
      Bitte den Ladepunkt oder die Komponente auswählen, auf welche das Verhalten angewendet werden soll. Es kann nur
      ein Eintrag ausgewählt werden.
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
    definedInput: {
      get() {
        if (Object.keys(this.value[0].input_matrix).length !== 0) {
          return Object.keys(this.value[0].input_matrix)[0];
        }
        return null;
      },
      set(newValue) {
        if (Object.keys(this.value[0].input_matrix).length === 0) {
          this.value = [
            { value: true, input_matrix: { [newValue]: true } },
            { value: false, input_matrix: { [newValue]: false } },
          ];
          return;
        }
        this.value = [
          { value: true, input_matrix: { [newValue]: this.definedNormalMode } },
          { value: false, input_matrix: { [newValue]: !this.definedNormalMode } },
        ];
      },
    },
    definedNormalMode: {
      get() {
        return Object.values(this.value[0].input_matrix)[0];
      },
      set(newValue) {
        this.value = [
          { value: true, input_matrix: { [this.definedInput]: newValue } },
          { value: false, input_matrix: { [this.definedInput]: !newValue } },
        ];
      },
    },
    inputOptions() {
      return Object.keys(this.ioDevice?.input?.digital).map((input) => {
        return { value: input, text: input };
      });
    },
    availableDevices() {
      return [
        {
          label: "Ladepunkte",
          options: this.availableChargePoints.map((cp) => ({ value: `cp${cp.value}`, text: cp.text })),
        },
      ];
    },
  },
};
</script>
