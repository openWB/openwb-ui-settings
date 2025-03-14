<template>
  <openwb-base-heading> Einstellungen für I/O-Aktion "{{ ioAction?.name }}" </openwb-base-heading>
  <openwb-base-select-input
    title="Eingangs-Gerät"
    not-selected="Bitte auswählen"
    :empty-value="null"
    required
    :options="ioDeviceList"
    :model-value="ioAction?.configuration.io_device"
    @update:model-value="updateIoDevice($event)"
  >
    <template #help>
      Bitte das Gerät auswählen, über das der Schaltbefehl empfangen werden soll. Für jede Aktion kann nur ein Gerät
      ausgewählt werden.
    </template>
  </openwb-base-select-input>
  <div v-if="ioAction?.configuration.io_device !== null">
    <hr />
    <component
      :is="myComponent"
      :io-action="ioAction"
      :io-device="ioDevices[`openWB/system/io/${ioAction.configuration.io_device}/config`]"
      :available-charge-points="availableChargePoints"
      :available-components="availableComponents"
      :available-io-devices="availableIoDevices"
      @update:configuration="updateConfiguration($event)"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbIoActionConfigFallback from "./OpenwbIoActionConfigFallback.vue";

export default {
  name: "OpenwbIoActionProxy",
  props: {
    ioAction: { type: Object, required: true },
    ioDevices: { type: Object, required: true },
    installedChargePoints: { type: Object, required: true },
    installedComponents: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  computed: {
    myComponent() {
      console.debug(`loading io action: ${this.ioAction?.group} / ${this.ioAction?.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.ioAction?.group}/${this.ioAction?.type}/io_action.vue`),
        errorComponent: OpenwbIoActionConfigFallback,
      });
    },
    ioDeviceList() {
      return Object.keys(this.ioDevices).map((key) => {
        return { value: this.ioDevices[key]?.id, text: this.ioDevices[key]?.name };
      });
    },
    availableIoDevices() {
      return Object.values(this.ioDevices);
    },
    availableChargePoints() {
      return Object.values(this.installedChargePoints).map((cp) => ({ value: cp?.id, text: cp?.name }));
    },
    availableComponents() {
      return Object.values(this.installedComponents).map((component) => ({
        value: component?.id,
        text: component?.name,
        type: component?.type,
      }));
    },
  },
  methods: {
    updateConfiguration(event, path = undefined) {
      if (path) {
        this.$emit("update:configuration", { value: event, object: path });
      } else {
        this.$emit("update:configuration", event);
      }
    },
    updateIoDevice(value) {
      this.updateConfiguration(value, "configuration.io_device");
      // clear input configuration
      if (Array.isArray(this.ioAction.configuration?.input_pattern)) {
        let clearedInputPattern = this.ioAction.configuration.input_pattern.map((input) => {
          return { value: input.value, input_matrix: {} };
        });
        this.updateConfiguration(clearedInputPattern, "configuration.input_pattern");
      }
      if (Object.prototype.hasOwnProperty.call(this.ioAction.configuration, "digital_input")) {
        this.updateConfiguration(null, "configuration.digital_input");
      }
    },
  },
};
</script>
