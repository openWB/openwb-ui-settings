<template>
  <div class="pricing-status">
    <openwb-base-text-input
      title="Letzte Aktualisierung"
      readonly
      :model-value="timeText('last_update_time')"
    >
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'calendar-day']" />
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Nächste Aktualisierung"
      readonly
      :model-value="timeText('next_query_time')"
    >
      <template #prepend>
        <font-awesome-icon :icon="['fas', 'calendar-day']" />
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Status"
      readonly
      :model-value="faultStateText"
    >
      <template #prepend>
        <font-awesome-icon
          :class="stateClass"
          :icon="stateIcon"
        />
      </template>
    </openwb-base-text-input>
    <div class="d-flex justify-content-end">
      <openwb-base-click-button
        class="btn-primary"
        @click="triggerUpdate"
      >
        Jetzt aktualisieren
      </openwb-base-click-button>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarDay as fasCalendarDay,
  faCircleCheck as fasCircleCheck,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCalendarDay, fasCircleCheck, fasExclamationTriangle, fasTimesCircle);

export default {
  name: "OpenwbPricingStatus",
  components: { FontAwesomeIcon },
  props: {
    // flexible_tariff, grid_fee, pv_price oder bat_price
    source: { type: String, required: true },
  },
  computed: {
    baseTopic() {
      return `openWB/optional/ep/${this.source}`;
    },
    faultState() {
      return this.$store.state.mqtt[`${this.baseTopic}/get/fault_state`] || 0;
    },
    faultStateText() {
      const text = this.$store.state.mqtt[`${this.baseTopic}/get/fault_str`];
      return text || "Kein Fehler.";
    },
    stateIcon() {
      switch (this.faultState) {
        case 1:
          return ["fas", "exclamation-triangle"];
        case 2:
          return ["fas", "times-circle"];
        default:
          return ["fas", "check-circle"];
      }
    },
    stateClass() {
      switch (this.faultState) {
        case 0:
          return "success";
        case 1:
          return "warning";
        case 2:
          return "danger";
        default:
          return "dark";
      }
    },
  },
  methods: {
    timeText(name) {
      const timestamp = this.$store.state.mqtt[`${this.baseTopic}/get/${name}`];
      if (!timestamp) return "-";
      return new Date(Number(timestamp) * 1000).toLocaleString();
    },
    triggerUpdate() {
      this.$root.doPublish(`openWB/set/optional/ep/${this.source}/get/force_update`, true, false);
    },
  },
};
</script>

<style scoped>
.success {
  color: var(--success);
}

.warning {
  color: var(--warning);
}

.danger {
  color: var(--danger);
}

.dark {
  color: var(--dark);
}
</style>
