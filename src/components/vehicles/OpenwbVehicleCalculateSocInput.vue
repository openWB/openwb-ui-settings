<template>
  <openwb-base-button-group-input
    title="SoC während der Ladung berechnen"
    :buttons="[
      {
        buttonValue: false,
        text: 'Nein',
        class: 'btn-outline-danger',
      },
      {
        buttonValue: true,
        text: 'Ja',
        class: 'btn-outline-success',
      },
    ]"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #help>
      Berechnet den Ladestand (SoC) während der Ladung aus Ladeleistung und Ladedauer, ausgehend vom zuletzt abgerufenen
      SoC. Ist die Einstellung aktiv, wird während der Ladung immer berechnet.
      <br />
      Sinnvoll, wenn der SoC während der Ladung nicht oder nicht oft genug von der Schnittstelle aktualisiert wird.
      <template v-if="$slots.default">
        <br />
        <slot />
      </template>
    </template>
  </openwb-base-button-group-input>
</template>

<script>
export default {
  name: "OpenwbVehicleCalculateSocInput",
  props: {
    modelValue: { type: Boolean, default: undefined },
  },
  emits: ["update:modelValue"],
};
</script>
