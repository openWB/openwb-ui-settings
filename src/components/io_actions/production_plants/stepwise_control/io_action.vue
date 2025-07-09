<template>
  <openwb-io-single-pattern
    v-model="value"
    :digital-inputs="ioDevice?.input?.digital"
    :io-device="ioDevice"
  />
  <hr />
  <openwb-base-select-input
    title="Verhalten anwenden auf..."
    not-selected="Bitte auswählen"
    :empty-value="null"
    :groups="availableDevices"
    :model-value="ioAction?.configuration.component_id"
    @update:model-value="updateConfiguration($event, 'configuration.component_id')"
  >
    <template #help>
      Bitte die Erzeugungsanlage auswählen, auf welche das Verhalten angewendet werden soll. Es kann nur eine
      Erzeugungsanlage ausgewählt werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoPattern from "../../OpenwbIoPattern.vue";
import OpenwbIoSinglePattern from "../../OpenwbIoSinglePattern.vue";

export default {
  name: "IoActionPowerLevels",
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
