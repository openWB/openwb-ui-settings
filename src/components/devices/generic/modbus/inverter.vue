<template>
  <div class="device-generic-modbus-inverter">
    <openwb-base-heading> Einstellungen für Universell Modbus Wechselrichter </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
    <div
      v-for="section in registerSections"
      :key="section.id"
    >
      <h4>{{ section.title }}</h4>
      <template
        v-for="entry in section.entries"
        :key="entry.key"
      >
        <hr class="modbus-divider" />
        <div>
          <h5 v-if="entry.label">{{ entry.label }}</h5>
          <modbus-register-fields
            :model-value="component.configuration[entry.key]"
            :address-required="Boolean(entry.addressRequired)"
            @update-field="handleRegisterFieldUpdate(entry.key, $event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";
import ModbusRegisterFields from "./ModbusRegisterFields.vue";

const REGISTER_SECTIONS = [
  {
    id: "power_total",
    title: "Leistung",
    entries: [{ key: "power", addressRequired: true }],
  },
  {
    id: "current",
    title: "Strom",
    entries: [
      { key: "current_L1", label: "Phase L1" },
      { key: "current_L2", label: "Phase L2" },
      { key: "current_L3", label: "Phase L3" },
    ],
  },
  {
    id: "import",
    title: "Import",
    entries: [{ key: "imported" }],
  },
  {
    id: "export",
    title: "Export",
    entries: [{ key: "exported" }],
  },
  {
    id: "dc_power",
    title: "DC Leistung",
    entries: [{ key: "dc_power" }],
  },
  {
    id: "serial_number",
    title: "Seriennummer",
    entries: [{ key: "serial_number" }],
  },
];

export default {
  name: "DeviceGenericModbusInverter",
  components: {
    ModbusRegisterFields,
  },
  mixins: [ComponentConfigMixin],
  data() {
    return {
      registerSections: REGISTER_SECTIONS,
    };
  },
  methods: {
    handleRegisterFieldUpdate(configKey, { field, value }) {
      this.updateConfiguration(value, `configuration.${configKey}.${field}`);
    },
  },
};
</script>

<style scoped>
.modbus-divider {
  margin: 0.4rem 0 0.25rem 0;
}
</style>
