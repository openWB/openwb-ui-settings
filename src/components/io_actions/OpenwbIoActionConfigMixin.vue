<script>
import ComponentState from "../mixins/ComponentState.vue";

export default {
  mixins: [ComponentState],
  props: {
    ioAction: { type: Object, required: true },
    ioDevice: { type: Object, required: true },
  },
  emits: ["update:configuration", "sendCommand"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
