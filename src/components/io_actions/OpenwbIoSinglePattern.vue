<template>
  <openwb-base-select-input
    v-model="definedInput"
    title="Eingang"
    required
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="inputOptions"
  >
    <template #help>
      Bitte den Eingang auswählen, auf welchen reagiert werden soll. Es kann nur ein Eingang ausgewählt werden.
    </template>
  </openwb-base-select-input>
  <openwb-base-button-group-input
    v-model="definedNormalMode"
    title="Normaler Zustand"
    :buttons="[
      { buttonValue: false, text: 'geschlossen (NC)' },
      { buttonValue: true, text: 'geöffnet (NO)' },
    ]"
    :disabled="definedInput ? false : true"
    required
  >
    <template #help>
      Bitte Einstellen, ob der Eingang für den normalen Betrieb (nicht aktiv, nicht gedimmt etc.) geschlossen (NC) oder
      geöffnet (NO) ist. Dieser Zustand wird verwendet, um den Eingang zu überwachen.
    </template>
  </openwb-base-button-group-input>
</template>

<script>
export default {
  name: "IoActionSingleInputPattern",
  inheritAttrs: false,
  props: {
    digitalInputs: { type: Object, required: true },
    modelValue: { type: Array, required: true },
    ioDevice: { type: Object, required: true },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
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
  },
};
</script>

<style scoped>
th {
  text-align: center;
  vertical-align: bottom;
}

.input-header {
  position: relative;
  height: 6em;
}

.input-header div {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: rotate(-90deg);
  transform-origin: left center;
}
</style>
