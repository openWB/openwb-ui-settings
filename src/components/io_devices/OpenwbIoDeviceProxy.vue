<template>
  <div>
    <openwb-base-heading> Einstellungen für I/O-Modul "{{ ioDevice.name }}" </openwb-base-heading>
    <openwb-base-alert
      v-if="outputs.length"
      subtype="info"
    >
      Die Ausgänge können über die folgenden Topics manuell per MQTT geschaltet werden. Falls Ausgänge in Aktionen
      konfiguriert werden, überschreibt das manuelle Setzen den Status.
      <ul>
        <li
          v-for="output in outputs"
          :key="output"
        >
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            {{ output }}
          </openwb-base-copy-to-clipboard>
        </li>
      </ul>
      Als Wert wird ein boolean als json oder 0/1 akzeptiert.<br />
      Beispiel:
      <span class="text-info">false</span>
    </openwb-base-alert>
    <component
      :is="myComponent"
      :io-device="ioDevice"
      @update:configuration="updateConfiguration($event)"
      @send-command="sendCommand($event)"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbIoDeviceConfigFallback from "./OpenwbIoDeviceConfigFallback.vue";

export default {
  name: "OpenwbIoDeviceProxy",
  props: {
    ioDevice: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  computed: {
    myComponent() {
      console.debug(`loading io device: ${this.ioDevice.type}`);
      return defineAsyncComponent({
        loader: () => import(`./${this.ioDevice.type}/io_device.vue`),
        errorComponent: OpenwbIoDeviceConfigFallback,
      });
    },
    outputs() {
      const outputs = [];
      if (this.ioDevice.output) {
        if (this.ioDevice.output.analog) {
          for (const key in this.ioDevice.output.analog) {
            outputs.push(`openWB/set/system/io/${this.ioDevice.id}/set/manual/analog_output/${key}`);
          }
        }
        if (this.ioDevice.output.digital) {
          for (const key in this.ioDevice.output.digital) {
            outputs.push(`openWB/set/system/io/${this.ioDevice.id}/set/manual/digital_output/${key}`);
          }
        }
      }
      return outputs;
    },
  },
  methods: {
    // event pass through
    updateConfiguration(event) {
      this.$emit("update:configuration", event);
    },
    // event pass through
    sendCommand(event) {
      this.$emit("sendCommand", event);
    },
  },
};
</script>
