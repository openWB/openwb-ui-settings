<template>
  <div>
    <openwb-base-number-input
      title="Register Adresse"
      subtype="text"
      :min="0"
      :max="65535"
      :required="addressRequired"
      :model-value="modelValue.reg_address"
      @update:model-value="emitModelUpdate($event, 'reg_address')"
    />
    <openwb-base-select-input
      title="Datentyp"
      not-selected="Bitte auswählen"
      :options="registerTypeOptions"
      :model-value="modelValue.reg_type"
      @update:model-value="emitModelUpdate($event, 'reg_type')"
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
  emits: ["update:model-value"],
  data() {
    return {
      registerTypeOptions: REGISTER_TYPE_OPTIONS,
    };
  },
  methods: {
    emitModelUpdate(value, field) {
      this.$emit("update:model-value", { field, value });
    },
  },
};
</script>
