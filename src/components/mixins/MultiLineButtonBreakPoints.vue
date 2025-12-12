<script>
export default {
  name: "MultiLineButtonBreakPoints",
  data() {
    return {
      viewportWidth: window.innerWidth,
    };
  },
  computed: {
    screenSizeXs() {
      return this.viewportWidth <= 360;
    },
    screenSizeSm() {
      return this.viewportWidth <= 550;
    },
    screenSizeMd() {
      return this.viewportWidth <= 1024;
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.viewportWidth = window.innerWidth;
    },
  },
};
</script>
