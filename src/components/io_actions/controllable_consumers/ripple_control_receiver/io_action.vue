<template>
  <openwb-io-pattern
    v-slot="slotProps"
    :model-value="value"
    :digital-inputs="ioDevice.input.digital"
    :enable-add-delete="true"
    :min-patterns="2"
  >
    <openwb-base-select-input
      required
      not-selected="Bitte auswählen"
      :empty-value="null"
      :options="[
        { value: 0, text: 'sperren' },
        { value: 1, text: 'freigeben' },
      ]"
      :model-value="slotProps.pattern.value"
      @update:model-value="slotProps.pattern.value = $event"
    />
  </openwb-io-pattern>
  <hr />
  <openwb-base-select-input
    title="Anwenden auf..."
    :empty-value="[]"
    :groups="availableDevices"
    required
    multiple
    :model-value="ioAction?.configuration.devices"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte die Ladepunkte auswählen, auf die das Verhalten angewendet werden soll. Es können mehrere Einträge
      ausgewählt werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoPattern from "../../OpenwbIoPattern.vue";

export default {
  name: "IoActionRippleControlReceiver",
  components: {
    OpenwbIoPattern,
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
      const label = this.availableChargePoints.length > 0 ? "Ladepunkte" : "Keine Ladepunkte verfügbar";
      return [
        {
          label: label,
          options: this.availableChargePoints.map((cp) => ({ value: { type: "cp", id: cp.value }, text: cp.text })),
        },
      ];
    },
  },
};
</script>
