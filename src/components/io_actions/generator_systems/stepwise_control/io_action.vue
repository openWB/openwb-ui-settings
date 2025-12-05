<template>
  <openwb-io-pattern
    v-if="ioDevice?.type !== 'eebus'"
    v-slot="slotProps"
    v-model="ioAction.configuration.input_pattern"
    :contacts="ioDevice.input.digital"
    action-title="Begrenzung"
    :enable-add-delete="false"
    class="text-center"
  >
    {{ slotProps.pattern.value * 100 + "%" }}
  </openwb-io-pattern>
  <hr v-if="ioDevice?.type !== 'eebus'" />
  <openwb-base-select-input
    v-model="ioAction.configuration.devices"
    title="Zugeordnete Erzeugungsanlagen..."
    not-selected="Bitte auswählen"
    :empty-value="[]"
    :groups="availableDevices"
    required
    multiple
  >
    <template #help>
      Bitte die Erzeugungsanlagen auswählen, welche mit dieser Aktion gekoppelt sind. Es können mehrere
      Erzeugungsanlagen ausgewählt werden.<br />
      Diese Zuordnung ist rein informativ und hat noch keine Auswirkungen auf die Funktionalität. Die Begrenzung der
      zugeordneten Erzeugungsanlagen wird im Status angezeigt.
    </template>
  </openwb-base-select-input>
  <hr v-if="ioDevice?.type !== 'eebus'" />
  <openwb-base-button-group-input
    v-if="ioDevice?.type !== 'eebus'"
    v-model="ioAction.configuration.passthrough_enabled"
    title="Ausgänge aktivieren"
    :buttons="[
      { buttonValue: false, text: 'Nein' },
      { buttonValue: true, text: 'Ja' },
    ]"
    class="mb-2"
    required
  >
    <template #help>
      Optional kann das Signal der konfigurierten Eingänge an Ausgänge durchgereicht ("durchgeschliffen") werden. Wird
      z.B. das Muster für 60% als aktiv erkannt, dann wird auch das hier festgelegte Ausgangsmuster für 60% aktiviert.
    </template>
  </openwb-base-button-group-input>
  <openwb-io-pattern
    v-if="ioAction.configuration.passthrough_enabled"
    v-slot="slotProps"
    v-model="ioAction.configuration.output_pattern"
    :contacts="ioDevice.output.digital"
    title="Ausgangsmuster"
    action-title="Begrenzung"
    :enable-add-delete="false"
    class="text-center"
    :show-check-pattern="false"
  >
    {{ slotProps.pattern.value * 100 + "%" }}
  </openwb-io-pattern>
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
  computed: {
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
