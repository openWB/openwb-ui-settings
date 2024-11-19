<template>
  <openwb-base-textarea
    :model-value="value"
    subtype="json"
    title="IO Configuration Object"
    readonly
  />
  <openwb-base-button-group-input
    v-model="value.active"
    title="Aktiviert"
    :buttons="[
      { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
      { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
    ]"
  >
    <template #help> Wenn deaktiviert, wird das IO Pattern nicht überwacht. </template>
  </openwb-base-button-group-input>
  <openwb-base-io-pattern
    v-model="value.pattern"
    title="IO Pattern"
  >
    <template #help>
      Das IO Pattern wird überwacht und löst die konfigurierte Aktion aus. Jedem Eingang kann der Zustand "offen" oder
      "geschlossen" zugeordnet werden. Wird "Nicht festgelegt" ausgewählt, ist der Zustand dieses Eingangs für dieses IO
      Pattern nicht relevant.
    </template>
  </openwb-base-io-pattern>
  <openwb-base-select-input
    title="Aktion"
    not-selected="Bitte auswählen"
    :options="[{ value: 'stop_all', text: 'Alles abschalten' }]"
    :model-value="value.action.value"
    @update:model-value="updateState('select1', $event)"
  >
    <template #help> Diese Aktion wird ausgeführt, wenn das konfigurierte "IO Pattern" erkannt wird. </template>
  </openwb-base-select-input>
</template>

<script>
export default {
  name: "OpenwbIoConfig",
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: "" },
    modelValue: { type: [Object, undefined], required: false, default: undefined },
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
  },
};
</script>
