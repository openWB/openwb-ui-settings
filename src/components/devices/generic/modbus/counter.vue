<template>
  <div class="device-generic-modbus-counter">

    <openwb-base-heading> Einstellungen für Universell Modbus Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      min="1"
      max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />

    <!-- power -->
    <div>
      <h4>Leistung</h4>
      <hr class="modbus-divider" />
      <div>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          required
          :model-value="component.configuration.power.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.power.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.power.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.power.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power.wordorder')"
        />
      </div>
    </div>

    <!-- Voltage -->
    <div>
      <h4>Spannung</h4>
      <hr class="modbus-divider" />

      <div>
        <h5>Phase L1</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.voltage_L1.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.voltage_L1.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.voltage_L1.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L1.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.voltage_L1.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L1.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.voltage_L1.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L1.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L2</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.voltage_L2.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.voltage_L2.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.voltage_L2.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L2.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.voltage_L2.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L2.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.voltage_L2.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L2.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L3</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.voltage_L3.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.voltage_L3.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.voltage_L3.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L3.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.voltage_L3.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L3.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.voltage_L3.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.voltage_L3.wordorder')"
        />
      </div>
    </div>
    <!-- Current -->
    <div>
      <h4>Strom</h4>
      <hr class="modbus-divider" />

      <div>
        <h5>Phase L1</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.current_L1.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.current_L1.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.current_L1.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L1.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.current_L1.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L1.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.current_L1.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L1.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L2</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.current_L2.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.current_L2.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.current_L2.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L2.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.current_L2.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L2.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.current_L2.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L2.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L3</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.current_L3.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.current_L3.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.current_L3.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L3.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.current_L3.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L3.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.current_L3.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.current_L3.wordorder')"
        />
      </div>
    </div>

    <!-- Powers -->
    <div>
      <h4>Leistung</h4>
      <hr class="modbus-divider" />
      <div>
        <h5>Phase L1</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.powers_L1.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.powers_L1.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.powers_L1.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L1.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.powers_L1.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L1.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.powers_L1.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L1.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L2</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.powers_L2.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.powers_L2.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.powers_L2.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L2.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.powers_L2.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L2.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.powers_L2.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L2.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L3</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.powers_L3.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.powers_L3.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.powers_L3.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L3.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.powers_L3.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L3.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.powers_L3.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.powers_L3.wordorder')"
        />
      </div>
    </div>

    <!-- Power-Faktor -->
    <div>
      <h4>Leistungsfaktor</h4>
      <hr class="modbus-divider" />
      <div>
        <h5>Phase L1</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.power_factor_L1.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.power_factor_L1.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.power_factor_L1.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L1.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power_factor_L1.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L1.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power_factor_L1.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L1.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L2</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.power_factor_L2.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.power_factor_L2.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.power_factor_L2.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L2.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power_factor_L2.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L2.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power_factor_L2.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L2.wordorder')"
        />
      </div>

      <hr class="modbus-divider" />

      <div>
        <h5>Phase L3</h5>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.power_factor_L3.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.power_factor_L3.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.power_factor_L3.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L3.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power_factor_L3.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L3.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.power_factor_L3.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.power_factor_L3.wordorder')"
        />
      </div>
    </div>

    <!-- imported -->
    <div>
      <h4>Import</h4>
      <hr class="modbus-divider" />
      <div>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.imported.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.imported.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.imported.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.imported.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.imported.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.imported.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.imported.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.imported.wordorder')"
        />
      </div>
    </div>

    <!-- exported -->
    <div>
      <h4>Export</h4>
      <hr class="modbus-divider" />
      <div>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.exported.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.exported.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.exported.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.exported.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.exported.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.exported.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.exported.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.exported.wordorder')"
        />
      </div>
    </div>

    <!-- frequency -->
    <div>
      <h4>Frequenz</h4>
      <hr class="modbus-divider" />
      <div>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.frequency.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.frequency.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.frequency.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.frequency.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.frequency.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.frequency.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.frequency.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.frequency.wordorder')"
        />
      </div>
    </div>

    <!-- SerialNumber -->
    <div>
      <h4>Seriennummer</h4>
      <hr class="modbus-divider" />
      <div>
        <openwb-base-text-input
          title="Register Adresse"
          subtype="text"
          pattern="^\d+$"
          :model-value="component.configuration.serial_number.reg_address"
          @update:model-value="updateConfiguration($event, 'configuration.serial_number.reg_address')"
        />
        <openwb-base-select-input
          title="Register Type"
          not-selected="Bitte auswählen"
          :options="registerTypeOptions"
          :modelValue="component.configuration.serial_number.reg_type"
          @update:modelValue="updateConfiguration($event, 'configuration.serial_number.reg_type')"
        />
        <openwb-base-select-input
          title="byteorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.serial_number.byteorder"
          @update:modelValue="updateConfiguration($event, 'configuration.serial_number.byteorder')"
        />
        <openwb-base-select-input
          title="wordorder Type"
          not-selected="Bitte auswählen"
          :options="endianOptions"
          :modelValue="component.configuration.serial_number.wordorder"
          @update:modelValue="updateConfiguration($event, 'configuration.serial_number.wordorder')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

const REGISTER_TYPE_OPTIONS = [
  { text: "uint8", value: "UINT_8" },
  { text: "uint16", value: "UINT_16" },
  { text: "uint32", value: "UINT_32" },
  { text: "uint64", value: "UINT_64" },
  { text: "int8", value: "INT_8" },
  { text: "int16", value: "INT_16" },
  { text: "int32", value: "INT_32" },
  { text: "int64", value: "INT_64" },
  { text: "float16", value: "FLOAT_16" },
  { text: "float32", value: "FLOAT_32" },
  { text: "float64", value: "FLOAT_64" },
];

const ENDIAN_OPTIONS = [
  { text: "Big endian", value: ">" },
  { text: "Little endian", value: "<" },
  { text: "Auto", value: "@" },
];

export default {
  name: "DeviceGenericModbusCounter",
  mixins: [ComponentConfigMixin],
  data() {
    return {
      registerTypeOptions: REGISTER_TYPE_OPTIONS,
      endianOptions: ENDIAN_OPTIONS,
    };
  },
};
</script>

<style scoped>
.modbus-divider {
  margin: 0.4rem 0 0.25rem 0;
}
</style>
