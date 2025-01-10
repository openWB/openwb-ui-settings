<template>
  <openwb-io-pattern
    v-slot="slotProps"
    :model-value="value"
    :digital-inputs="ioDevice.input.digital"
    :enable-add-delete="false"
    class="text-center"
  >
    {{ slotProps.pattern.value * 100 }}&nbsp;%
  </openwb-io-pattern>
  <hr />
  <openwb-base-heading title="Verhalten anwenden auf..."> Verhalten anwenden auf... </openwb-base-heading>
  <openwb-base-select-input
    title="Erzeugungsanlagen"
    not-selected="Bitte auswählen"
    :empty-value="null"
    :options="availableGenerators"
    :model-value="ioAction?.configuration.component_id"
    @update:model-value="updateConfiguration($event, 'configuration.component_id')"
  >
    <template #help>
      Bitte die Erzeugungsanlage auswählen, auf welcher das Verhalten angewendet werden soll. Es kann nur eine
      Erzeugungsanlage ausgewählt werden.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoPattern from "../../OpenwbIoPattern.vue";

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
    availableGenerators() {
      return this.availableComponents
        .filter((component) => component.type === "inverter")
        .map((component) => {
          return { value: component.value, text: component.text };
        });
    },
  },
};
</script>
