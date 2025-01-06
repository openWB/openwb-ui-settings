<script>
export default {
  props: {
    ioAction: { type: Object, required: true },
    ioDevices: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
