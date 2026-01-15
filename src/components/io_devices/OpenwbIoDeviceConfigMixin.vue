<script>
export default {
  props: {
    ioDevice: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
    sendSystemCommand(command, data) {
      this.$emit("sendCommand", {
        command: command,
        data: data,
      });
    },
  },
};
</script>
