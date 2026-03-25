<script>
export default {
  computed: {
    systemVersion() {
      const version = this.$store.state.mqtt["openWB/system/version"];
      const match = version?.match(/^\d+\.\d+\.\d+/);
      return match ? match[0] : "2.1.8";
    },
  },
  props: {
    vehicleId: { required: true, type: Number },
    vehicle: { required: true, type: Object },
  },
  emits: ["update:configuration"],
  methods: {
    updateConfiguration(event, path = undefined) {
      this.$emit("update:configuration", { value: event, object: path });
    },
  },
};
</script>
