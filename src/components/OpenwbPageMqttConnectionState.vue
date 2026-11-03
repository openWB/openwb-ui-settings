<template>
  <teleport
    v-if="showIcon"
    defer
    to="#info-target"
  >
    <div
      id="connection-state-indicator"
      class="ml-2"
    >
      <openwb-base-tooltip :description="stateDisplay.tooltip">
        <openwb-base-avatar :class="stateDisplay.class">
          <FontAwesomeIcon :icon="stateDisplay.icon" />
        </openwb-base-avatar>
      </openwb-base-tooltip>
    </div>
  </teleport>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHourglassHalf as fasHourglassHalf,
  faLink as fasLink,
  faLinkSlash as fasLinkSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasHourglassHalf, fasLink, fasLinkSlash);

export default {
  name: "OpenwbPageMqttConnectionState",
  components: {
    FontAwesomeIcon,
  },
  props: {
    connected: {
      type: Boolean,
      required: true,
    },
    initialConnectionPending: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showIcon: !this.connected,
      visibilityTimeout: null,
    };
  },
  computed: {
    stateDisplay() {
      if (this.connected) {
        return {
          class: "text-success",
          icon: ["fas", "link"],
          tooltip: "Verbindung hergestellt",
        };
      }
      if (this.initialConnectionPending) {
        return {
          class: "bg-secondary",
          icon: ["fas", "hourglass-half"],
          tooltip: "Verbindung wird aufgebaut",
        };
      }
      return {
        class: "bg-danger",
        icon: ["fas", "link-slash"],
        tooltip: "Verbindung getrennt",
      };
    },
  },
  watch: {
    connected(newValue) {
      if (!newValue) {
        this.showIcon = true;
        clearTimeout(this.visibilityTimeout);
      } else {
        clearTimeout(this.visibilityTimeout);
        this.visibilityTimeout = setTimeout(() => {
          this.showIcon = false;
        }, 5000);
      }
    },
  },
  beforeUnmount() {
    clearTimeout(this.visibilityTimeout);
  },
};
</script>

<style scoped></style>
