<script>
export default {
  computed: {
    systemVersion() {
      const version = this.$store.state.mqtt["openWB/system/version"];
      const match = version?.match(/\d+\.\d+\.\d+/);
      return match ? match[0] : "2.1.8";
    },
  },
};
</script>
