<script>
import ComponentState from "../mixins/ComponentState.vue";

export default {
  mixins: [ComponentState],
  props: {
    ioAction: { type: Object, required: true },
    ioDevice: { type: Object, required: true },
    availableChargePoints: { type: Array, required: false, default: () => [] },
    availableComponents: { type: Array, required: false, default: () => [] },
    availableIoDevices: { type: Array, required: false, default: () => [] },
  },
  emits: ["update:configuration", "sendCommand"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
