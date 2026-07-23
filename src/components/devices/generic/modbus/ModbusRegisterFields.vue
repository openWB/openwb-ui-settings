<template>
  <div>
    <openwb-base-number-input
      title="Register Adresse"
      subtype="text"
      pattern="^\\d+$"
      :required="addressRequired"
      :model-value="modelValue.reg_address"
      @update:model-value="emitFieldUpdate($event, 'reg_address')"
    />
    <openwb-base-select-input
      title="Register Type"
      not-selected="Bitte auswählen"
      :options="registerTypeOptions"
      :modelValue="modelValue.reg_type"
      @update:modelValue="emitFieldUpdate($event, 'reg_type')"
    />
    <openwb-base-select-input
      title="byteorder Type"
      not-selected="Bitte auswählen"
      :options="endianOptions"
      :modelValue="modelValue.byteorder"
      @update:modelValue="emitFieldUpdate($event, 'byteorder')"
    />
    <openwb-base-select-input
      title="wordorder Type"
      not-selected="Bitte auswählen"
      :options="endianOptions"
      :modelValue="modelValue.wordorder"
      @update:modelValue="emitFieldUpdate($event, 'wordorder')"
    />
  </div>
</template>

<script>
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
  name: "ModbusRegisterFields",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    addressRequired: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update-field"],
  data() {
    return {
      registerTypeOptions: REGISTER_TYPE_OPTIONS,
      endianOptions: ENDIAN_OPTIONS,
    };
  },
  methods: {
    emitFieldUpdate(value, field) {
      this.$emit("update-field", { field, value });
    },
  },
};
</script>
