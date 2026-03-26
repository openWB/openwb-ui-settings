<script>
export default {
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
