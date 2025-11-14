<script>
export default {
  props: {
    flexibleTariff: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
