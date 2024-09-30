<script>
export default {
  props: {
    webTheme: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
