<template>
  <openwb-io-pattern
    v-slot="slotProps"
    :model-value="value"
    :digital-inputs="ioDevice.input.digital"
    :enable-add-delete="true"
    :min-patterns="2"
  >
    <select
      class="form-control"
      required
      :value="slotProps.pattern.value"
      @input="slotProps.pattern.value = $event.target.value"
    >
      <option
        disabled="disabled"
        value="null"
      >
        -- Bitte auswählen --
      </option>
      <option value="0">sperren</option>
      <option value="1">freigeben</option>
    </select>
  </openwb-io-pattern>
  <hr />
  <openwb-base-select-input
    title="Anwenden auf..."
    :groups="availableDevices"
    :model-value="ioAction?.configuration.cp_ids"
    multiple
    @update:model-value="updateConfiguration($event, 'configuration.cp_ids')"
  >
    <template #help>
      Bitte die Ladepunkte und/oder Komponenten auswählen, auf die das Verhalten angewendet werden soll. Es können
      mehrere Einträge ausgewählt werden.
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
      return [
        {
          label: "Ladepunkte",
          options: this.availableChargePoints,
        },
      ];
    },
  },
};
</script>
