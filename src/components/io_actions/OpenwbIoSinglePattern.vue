<template>
  <openwb-base-select-input
    v-model="definedContact"
    :title="contactTitle"
    required
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="contactOptions"
  >
    <template #help>
      {{ contactHelpText }}
    </template>
  </openwb-base-select-input>
  <openwb-base-button-group-input
    v-if="contactType === 'input'"
    v-model="definedNormalMode"
    title="Normaler Zustand"
    :buttons="[
      { buttonValue: false, text: 'geschlossen (NC)' },
      { buttonValue: true, text: 'geöffnet (NO)' },
    ]"
    :disabled="definedContact ? false : true"
    required
  >
    <template #help>
      {{ normalModeHelpText }}
    </template>
  </openwb-base-button-group-input>
</template>

<script>
export default {
  name: "IoActionSinglePattern",
  inheritAttrs: false,
  props: {
    modelValue: { type: Array, required: true },
    contacts: { type: Object, required: true },
    contactType: {
      type: String,
      required: false,
      default: "input",
      validator: (value) => {
        return ["input", "output"].includes(value);
      },
    },
    title: {
      type: String,
      required: false,
      default: undefined,
    },
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
    contactTitle() {
      if (this.title !== undefined) {
        return this.title;
      }
      return this.contactType === "input" ? "Eingang" : "Ausgang";
    },
    contactHelpText() {
      return this.contactType === "input"
        ? "Bitte den Eingang auswählen, auf welchen reagiert werden soll. Es kann nur ein Eingang ausgewählt werden."
        : "Bitte den Ausgang auswählen, welcher geschaltet werden soll. Es kann nur ein Ausgang ausgewählt werden.";
    },
    normalModeHelpText() {
      return this.contactType === "input"
        ? "Bitte Einstellen, ob der Eingang für den normalen Betrieb (nicht aktiv, nicht gedimmt etc.) geschlossen (NC) oder geöffnet (NO) ist."
        : "Bitte Einstellen, ob der Ausgang für den normalen Betrieb (nicht aktiv, nicht gedimmt etc.) geschlossen (NC) oder geöffnet (NO) ist.";
    },
    definedContact: {
      get() {
        if (this.value !== undefined && Object.keys(this.value["0"].matrix).length !== 0) {
          return Object.keys(this.value["0"].matrix)[0];
        }
        return null;
      },
      set(newValue) {
        if (Object.keys(this.value["0"].matrix).length === 0) {
          this.value = [
            { value: true, matrix: { [newValue]: true } },
            { value: false, matrix: { [newValue]: false } },
          ];
          return;
        }
        this.value = [
          { value: true, matrix: { [newValue]: this.definedNormalMode } },
          { value: false, matrix: { [newValue]: !this.definedNormalMode } },
        ];
      },
    },
    definedNormalMode: {
      get() {
        return Object.values(this.value[0].matrix)[0];
      },
      set(newValue) {
        this.value = [
          { value: true, matrix: { [this.definedContact]: newValue } },
          { value: false, matrix: { [this.definedContact]: !newValue } },
        ];
      },
    },
    contactOptions() {
      return Object.keys(this.contacts).map((contact) => {
        return { value: contact, text: contact };
      });
    },
  },
};
</script>

<style scoped></style>
