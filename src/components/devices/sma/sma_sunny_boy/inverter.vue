<template>
  <div class="device-sunnyboy-inverter">
    <openwb-base-heading> Einstellungen für SMA Sunny Boy/Tripower Wechselrichter </openwb-base-heading>
    <openwb-base-button-group-input
      title="Hybrid-System"
      :buttons="[
        { buttonValue: false, text: 'nicht vorhanden' },
        { buttonValue: true, text: 'vorhanden' },
      ]"
      :model-value="component.configuration.hybrid"
      @update:model-value="updateConfiguration($event, 'configuration.hybrid')"
    >
      <template #help>
        Diese Option aktivieren, wenn ein Tripower Smart Energy, Sunny Boy Smart Energy oder ein anderes Hybrid-System
        verbaut ist.
      </template>
    </openwb-base-button-group-input>
    <openwb-base-select-input
      title="Version"
      not-selected="Bitte auswählen"
      :options="[
        { value: 0, text: 'Standard' },
        { value: 1, text: 'Core-2' },
        { value: 2, text: 'Data Manager/Cluster Controller' },
      ]"
      :model-value="component.configuration.version"
      required
      @update:model-value="updateConfiguration($event, 'configuration.version')"
    />
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help>
        Für die Standardversion ist die Standardmodbus-ID 3, für Core-2 ist sie 1 und für Data Manager/Cluster
        Controller 2. Wurde eine abweichende Modbus ID konfiguriert, entsprechend anpassen.
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceSunnyBoyInverter",
  mixins: [ComponentConfigMixin],
};
</script>
