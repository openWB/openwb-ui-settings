<script>
export default {
  props: {
    forecast: { type: Object, required: true },
  },
  emits: ["update:configuration"],
  computed: {
    forecastConfiguration: {
      get() {
        return this.forecast.configuration;
      },
      set(value) {
        this.updateConfiguration({ value }, "configuration");
      },
    },
  },
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
