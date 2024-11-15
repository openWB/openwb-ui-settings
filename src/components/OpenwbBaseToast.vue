<template>
  <div
    class="toast"
    :class="'border-' + subtype"
    role="alert"
  >
    <div
      class="toast-header"
      :class="'bg-' + subtype"
    >
      <strong class="pr-2 mr-auto">openWB</strong>
      <small
        v-if="timestamp"
        class="time-diff"
        >{{ relativeTime }}</small
      >
      <button
        type="button"
        class="ml-2 mb-1 close"
        data-dismiss="toast"
        aria-label="Close"
        @click="dismiss"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "OpenwbToast",
  props: {
    topic: { type: String, required: true },
    subtype: {
      validator: function (value) {
        return ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark"].indexOf(value) !== -1;
      },
      default: "secondary",
    },
    source: {
      type: String,
      required: true,
      validator: function (value) {
        return ["system", "client", "command"].indexOf(value) !== -1;
      },
    },
    timestamp: { type: Number, required: true },
  },
  emits: ["dismiss", "hide"],
  data() {
    return {
      handle: undefined,
      relativeTime: undefined,
      hidden: false,
    };
  },
  mounted() {
    this.handle = window.setInterval(this.updateRelativeTime, 1000);
  },
  unmounted() {
    window.clearInterval(this.handle);
  },
  methods: {
    dismiss() {
      this.$emit("dismiss", { topic: this.topic });
    },
    updateRelativeTime() {
      // in milliseconds
      const units = {
        year: 24 * 60 * 60 * 1000 * 365,
        month: (24 * 60 * 60 * 1000 * 365) / 12,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
        second: 1000,
      };
      var rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });
      const now = new Date();
      const elapsed = now - this.timestamp * 1000;
      for (var unit in units) {
        if (Math.abs(elapsed) > units[unit]) {
          this.relativeTime = rtf.format(
            Math.round(-elapsed / units[unit]), // negative time diff!
            unit,
          );
          break;
        }
      }
      // hide after 10 seconds
      if (elapsed > 10 * 1000 && !this.hidden) {
        this.hidden = true;
        this.$emit("hide", { topic: this.topic });
      }
    },
  },
};
</script>

<style scoped>
.toast {
  opacity: 1;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.toast:not(:last-child) {
  margin-bottom: 0.25rem !important;
}
</style>
