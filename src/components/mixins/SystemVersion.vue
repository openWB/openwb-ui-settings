<script>
export default {
  computed: {
    systemVersion() {
      const version = this.$store.state.mqtt["openWB/system/version"];
      const match = version?.match(/(\d+)\.(\d+)\.\d+/);
      // Wiki-Namespaces gibt es nur je Minor-Version, nicht je Patch
      return match ? `${match[1]}.${match[2]}.x` : "2.3.x";
    },
  },
  mounted() {
    this.$root.doSubscribe(["openWB/system/version"]);
  },
};
</script>
