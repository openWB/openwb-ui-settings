<template>
  <teleport
    v-if="showIcon"
    defer
    to="#infobar"
  >
    <div id="connection-state-indicator">
      <openwb-base-tooltip :description="`Verbindung ${connected ? 'hergestellt' : 'getrennt'}`">
        <openwb-base-avatar :class="connected ? 'text-success' : 'bg-danger'">
          <FontAwesomeIcon :icon="connected ? ['fas', 'link'] : ['fas', 'link-slash']" />
        </openwb-base-avatar>
      </openwb-base-tooltip>
    </div>
  </teleport>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink as fasLink, faLinkSlash as fasLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasLink, fasLinkSlash);

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
  },
  data() {
    return {
      showIcon: !this.connected,
      visibilityTimeout: null,
    };
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
};
</script>

<style scoped></style>
