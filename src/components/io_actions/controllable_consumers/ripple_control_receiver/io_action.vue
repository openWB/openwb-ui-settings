<template>
  <openwb-base-alert
    v-if="ioDevice?.type === 'eebus'"
    subtype="warning"
  >
    Steuerboxen mit EEBus-Schnistelle sind für Rundsteuerempfänger-Aktionen nicht geeignet. Bitte wähle ein anderes
    I/O-Gerät aus.
  </openwb-base-alert>
  <openwb-io-pattern
    v-else-if="ioDevice"
    v-slot="slotProps"
    v-model="value"
    :contacts="ioDevice.input.digital"
    :enable-add-delete="true"
    :min-patterns="2"
  >
    <openwb-base-select-input
      v-model="slotProps.pattern.value"
      required
      not-selected="Bitte auswählen"
      :empty-value="null"
      :options="[
        { value: 0, text: 'sperren' },
        { value: 1, text: 'freigeben' },
      ]"
    />
  </openwb-io-pattern>
  <hr v-if="ioDevice?.type !== 'eebus'" />
  <openwb-base-select-input
    v-if="ioDevice?.type !== 'eebus'"
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
