<template>
  <openwb-io-single-pattern
    v-model="value"
    :contacts="ioDevice?.input?.digital"
  />
  <openwb-base-number-input
    title="maximale Bezugsleistung"
    unit="kW"
    min="0"
    step="0.01"
    required
    :disabled="Object.keys(value[0].matrix).length > 0 ? false : true"
    :model-value="ioAction?.configuration.max_import_power / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_import_power')"
  />
  <hr />
  <openwb-base-select-input
    title="Anwenden auf..."
    :groups="availableDevices"
    required
    multiple
    :disabled="Object.keys(value[0].matrix).length > 0 ? false : true"
    :model-value="ioAction?.configuration.devices"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte die Ladepunkte und/oder digitale Ausgänge auswählen, welche berücksichtigt werden sollen. Es können mehrere
      Einträge ausgewählt werden. Bei steuerbaren Verbrauchseinrichtungen, die über einen digitalen Ausgang angesteuert
      werden, wird eine Leistung von 4,2 kW bei aktiver Dimmung angenommen. Ladepunkte werden so gesteuert, dass die
      angegebene Leistung am EVU-Punkt nicht überschritten wird. Eigene PV-Erzeugung und vorhandene Speicher werden
      berücksichtigt und zusätzlich genutzt.<br />
      Zugeordnete digitale Ausgänge werden im nicht gedimmten Zustand aktiviert und im gedimmten Zustand deaktiviert. So
      ist sichergestellt, dass bei einem Verbindungsabbruch oder einem Ausfall der Steuerung die Verbraucher nicht
      ungewollt mit voller Leistung betrieben werden. Ein mit "NO" bezeichneter digitaler Ausgang ist also für den nicht
      gedimmten Zustand geschlossen und bei aktivierter Dimmung geöffnet.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoSinglePattern from "../../OpenwbIoSinglePattern.vue";

export default {
  name: "IoActionDimming",
  components: {
    OpenwbIoSinglePattern,
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
    ioDevicesOutputOptions() {
      let deviceGroups = [];
      this.availableIoDevices.forEach((device) => {
        let options = [];
        Object.keys(device?.output.digital).forEach((digitalOutput) => {
          options.push({
            text: `${digitalOutput}`,
            value: { type: "io", id: device.id, digital_output: digitalOutput },
          });
        });
        if (options.length > 0) {
          deviceGroups.push({
            label: device.name,
            options: options,
          });
        }
      });
      return deviceGroups;
    },
    availableDevices() {
      return [
        {
          label: "Ladepunkte",
          options: this.availableChargePoints.map((cp) => ({ value: { type: "cp", id: cp.value }, text: cp.text })),
        },
      ].concat(this.ioDevicesOutputOptions);
    },
  },
};
</script>
