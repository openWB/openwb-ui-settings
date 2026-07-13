<template>
  <openwb-base-alert subtype="info">
    <p>
      Über dieses MQTT-Topic können die Parameter des Lastmanagers gesetzt werden.
    </p>
    <ol>
            <li>
              <openwb-base-copy-to-clipboard
                class="text-info"
                tooltip="Topic kopieren"
              >
                openWB/set/mqtt/loadmanager/{{ ioAction.id }}/set/loadmanager
              </openwb-base-copy-to-clipboard>
              <br />
                Das Topic erwartet ein JSON-Objekt mit den Parametern des Lastmanagements. <br />
              Beispiel:
              <span class="text-info">
          {
            "max_power": 10000,
            "max_current": [6, 6, 6],
            "timestamp": 1783596593.635847
          }
              </span>
            </li>
    </ol>
  </openwb-base-alert>
  <openwb-base-number-input
    title="maximale Bezugsleistung im Fehlerfall"
    unit="kW"
    min="0"
    step="0.01"
    required
    :model-value="(ioAction.configuration.max_power_on_failure || 0) / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_power_on_failure')"
  />
  <openwb-base-number-input
    title="maximaler Strom im Fehlerfall"
    unit="A"
    min="0"
    step="0.01"
    required
    :model-value="(ioAction.configuration.max_current_on_failure || 0) / 1000"
    @update:model-value="updateConfiguration($event * 1000, 'configuration.max_current_on_failure')"
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
      Bitte die Ladepunkte und/oder digitalen Ausgänge auswählen, die vom Lastmanager gesteuert werden sollen. Es können mehrere Einträge ausgewählt werden.
      Die ausgewählten Ladepunkte und/oder digitalen Ausgänge werden so gesteuert, dass die konfigurierte Leistung am EVU-Punkt nicht überschritten wird.
      Im Fehlerfall wird automatisch die konfigurierte Fehlerleistung ausgegeben.
    </template>
  </openwb-base-select-input>
</template>

<script>
import OpenwbIoActionConfigMixin from "../../OpenwbIoActionConfigMixin.vue";

export default {
  name: "IoActionLoadManager",
  mixins: [OpenwbIoActionConfigMixin],
  computed: {
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
