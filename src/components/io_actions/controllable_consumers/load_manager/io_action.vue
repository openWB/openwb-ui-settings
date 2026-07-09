<template>
  <openwb-base-number-input
    title="maximale Bezugsleistung"
    unit="kW"
    min="0"
    step="0.01"
    required
    :model-value="(ioAction.configuration.max_import_power || 0) / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_import_power')"
  />
  <openwb-base-number-input
    title="maximale Bezugsleistung im Fehlerfall"
    unit="kW"
    min="0"
    step="0.01"
    required
    :model-value="(ioAction.configuration.max_power_on_failure || 0) / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_power_on_failure')"
  />
  <hr />
  <openwb-base-select-input
    title="Anwenden auf..."
    :groups="availableDevices"
    required
    multiple
    :model-value="ioAction?.configuration?.devices || []"
    @update:model-value="updateConfiguration($event, 'configuration.devices')"
  >
    <template #help>
      Bitte die Ladepunkte auswählen, die vom Lastmanager gesteuert werden sollen. Es können mehrere Einträge ausgewählt werden.
      Die Ladepunkte werden so gesteuert, dass die konfigurierte Leistung am EVU-Punkt nicht überschritten wird.
      Im Fehlerfall wird automatisch die konfigurierte Fehlerleistung ausgegeben.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";
import OpenwbIoSinglePattern from "../../OpenwbIoSinglePattern.vue";

export default {
  name: "IoActionLoadManager",
  components: {
    OpenwbIoSinglePattern,
  },
  mixins: [OpenwbIoActionConfigMixin],
  computed: {
    value: {
      get() {
        return this.ioAction?.configuration?.input_pattern || [];
      },
      set(newValue) {
        this.updateConfiguration(newValue, "configuration.input_pattern");
      },
    },
    isPatternConfigured() {
      return this.value?.length > 0 && this.value[0].matrix && Object.keys(this.value[0].matrix).length > 0;
    },
    ioDevicesOutputOptions() {
      let deviceGroups = [];
      this.availableIoDevices?.forEach((device) => {
        let options = [];
        Object.keys(device?.output?.digital || {}).forEach((digitalOutput) => {
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
      const chargePointsGroup = {
        label: "Ladepunkte",
        options:
          this.availableChargePoints?.map((cp) => ({
            value: { type: "cp", id: cp.value },
            text: cp.text,
          })) || [],
      };
      return [chargePointsGroup].concat(this.ioDevicesOutputOptions);
    },
  },
};
</script>
