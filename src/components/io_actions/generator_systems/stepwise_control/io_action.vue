<template>
  <openwb-io-pattern
    v-slot="slotProps"
    :model-value="value"
    :digital-inputs="ioDevice.input.digital"
    :enable-add-delete="false"
    class="text-center"
  >
    {{ valueLabels[slotProps.pattern.value] || slotProps.pattern.value * 100 + "%" }}
  </openwb-io-pattern>
  <hr />
  <openwb-base-select-input
    title="Zugeordnete Erzeugungsanlagen..."
    not-selected="Bitte auswählen"
    :empty-value="[]"
    :groups="availableDevices"
    required
    multiple
    :model-value="ioAction?.configuration.devices"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte die Erzeugungsanlagen auswählen, welche mit dieser Aktion gekoppelt sind. Es können mehrere
      Erzeugungsanlagen ausgewählt werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoPattern from "../../OpenwbIoPattern.vue";

export default {
  name: "IoActionStepwiseControl",
  components: {
    OpenwbIoPattern,
  },
  mixins: [OpenwbIoActionConfigMixin],
  data() {
    return {
      valueLabels: {
        0.6: "60% (S1)",
        0.3: "30% (S2)",
        0.0: "0% (W3)",
      },
    };
  },
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
      let options = this.availableComponents
        .filter((component) => component.type === "inverter")
        .map((component) => {
          return { value: { type: component.type, id: component.value }, text: component.text };
        });
      const label = options.length > 0 ? "Wechselrichter" : "Keine Wechselrichter verfügbar";
      return [
        {
          label: label,
          options: options,
        },
      ];
    },
  },
};
</script>
