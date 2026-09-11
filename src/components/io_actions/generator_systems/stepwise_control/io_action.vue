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
  <openwb-base-select-input
    v-if="ioAction.configuration.passthrough_enabled"
    title="Ausgangs-Gerät"
    not-selected="Bitte auswählen"
    :empty-value="null"
    required
    :options="ioDeviceList"
    :model-value="ioAction?.configuration.io_output_device"
    @update:model-value="updateIoDevice($event)"
  >
    <template #help>
      Bitte das Gerät auswählen, über das der Schaltbefehl ausgegeben werden soll. Für jede Aktion kann nur ein Gerät
      ausgewählt werden.
    </template>
  </openwb-base-select-input>
  <openwb-io-pattern
    v-if="ioAction.configuration.passthrough_enabled && outputIoDevice"
    v-slot="slotProps"
    v-model="ioAction.configuration.output_pattern"
    :contacts="outputContacts"
    title="Ausgangsmuster"
    action-title="Begrenzung"
    :enable-add-delete="false"
    class="text-center"
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
    ioDeviceList() {
      return this.availableIoDevices
        .filter((device) => device?.type !== "eebus")
        .map((device) => ({ value: device?.id, text: device?.name }));
    },
    outputIoDevice() {
      return (
        this.availableIoDevices.find(
          (device) => device?.id === this.ioAction?.configuration?.io_output_device && device?.type !== "eebus",
        ) || null
      );
    },
    outputContacts() {
      return this.outputIoDevice?.output?.digital || {};
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
  methods: {
    updateIoDevice(value) {
      this.updateConfiguration(value, "configuration.io_output_device");
      if (Array.isArray(this.ioAction.configuration?.output_pattern)) {
        let clearedOutputPattern = this.ioAction.configuration.output_pattern.map((output) => {
          return { value: output.value, matrix: {} };
        });
        this.updateConfiguration(clearedOutputPattern, "configuration.output_pattern");
      }
    },
  },
};
</script>
