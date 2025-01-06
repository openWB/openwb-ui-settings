<template>
  <div class="io-action-ripple-control-receiver">
    <openwb-base-select-input
      title="Eingangs-Gerät"
      not-selected="Bitte auswählen"
      required
      :options="ioDeviceList"
      :model-value="ioAction.configuration.io_device"
      @update:model-value="updateConfiguration($event, 'configuration.io_device')"
    >
      <template #help>
        Bitte das Gerät auswählen, über das der Schaltbefehl empfangen werden soll. Für jede Aktion kann nur ein Gerät
        ausgewählt werden.
      </template>
    </openwb-base-select-input>
    <hr />
    <io-pattern-config
      v-model="ioAction.configuration.input_pattern"
      :io-device="ioDevices[`openWB/system/io/${ioAction.configuration.io_device}/config`]"
    />
    <hr />
    Verhalten anwenden auf Ladepunkte...
    {{ ioAction.configuration.cp_ids }}
  </div>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import IoPatternConfig from "./io_pattern_config.vue";

export default {
  name: "IoActionRippleControlReceiver",
  components: { IoPatternConfig },
  mixins: [OpenwbIoActionConfigMixin],
  computed: {
    ioDeviceList() {
      return Object.keys(this.ioDevices).map((key) => {
        return { value: this.ioDevices[key].id, text: this.ioDevices[key].name };
      });
    },
  },
};
</script>
