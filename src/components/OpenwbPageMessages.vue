<template>
  <teleport to="body">
    <div
      id="message-indicator"
      class="text-light mt-1 p-2 mr-1 clickable"
      :class="showAllMessages ? 'active' : ''"
      @click="toggleAllMessages"
    >
      <font-awesome-layers
        full-width
        style="font-size: 175%"
      >
        <font-awesome-icon
          fixed-width
          :icon="showAllMessages ? ['fas', 'bell'] : ['far', 'bell']"
          :class="messageIndicatorClass"
        />
        <font-awesome-layers-text
          v-if="messages.length > 0"
          counter
          :value="messages.length"
          position="top-right"
          class="message-counter bg-light text-dark"
        />
      </font-awesome-layers>
    </div>
  </teleport>
  <div
    v-if="recentMessages.length > 0 || showAllMessages"
    class="openwb-toast-container"
    :class="showAllMessages ? 'full-height' : ''"
  >
    <openwb-base-alert
      v-if="recentMessages.length == 0"
      subtype="info"
    >
      Keine Nachrichten vorhanden.
    </openwb-base-alert>
    <openwb-base-click-button
      v-else-if="showAllMessages"
      class="btn-sm btn-secondary mb-1"
      @button-clicked="dismissAllMessages"
    >
      Alle Nachrichten löschen
    </openwb-base-click-button>
    <openwb-base-toast
      v-for="message in recentMessages"
      :key="message.topic"
      :topic="message.topic"
      :source="message.source"
      :subtype="message.type"
      :timestamp="message.timestamp"
      @dismiss="dismissMessage"
      @hide="hideMessage"
    >
      <span v-html="message.message" />
    </openwb-base-toast>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell as fasBell } from "@fortawesome/free-solid-svg-icons";
import { faBell as farBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from "@fortawesome/vue-fontawesome";

library.add(fasBell, farBell);

import ComponentState from "./mixins/ComponentState.vue";

export default {
  name: "OpenwbPageMessages",
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/system/messages/+", "openWB/command/" + this.$root.mqttClientId + "/messages/+"],
      showAllMessages: false,
      hiddenMessages: [],
    };
  },
  computed: {
    alertLevel() {
      let result = this.messages.reduce((total, currentMessage) => {
        if (
          (total == "light" && ["info", "success", "warning", "danger"].includes(currentMessage.type)) ||
          (total == "info" && ["success", "warning", "danger"].includes(currentMessage.type)) ||
          (total == "success" && ["warning", "danger"].includes(currentMessage.type)) ||
          (total == "warning" && currentMessage.type == "danger")
        ) {
          total = currentMessage.type;
        }
        return total;
      }, "light");
      return result;
    },
    messages() {
      const myMessages = [];
      this.systemMessages.forEach((message) => {
        myMessages.push(message);
      });
      this.clientMessages.forEach((message) => {
        myMessages.push(message);
      });
      myMessages.sort(this.compareMessagesByTimestamp);
      return myMessages;
    },
    recentMessages() {
      if (this.showAllMessages) {
        return this.messages;
      } else {
        return this.messages.filter((message) => {
          return !this.hiddenMessages.includes(message.topic);
        });
      }
    },
    messageIndicatorClass() {
      return "text-" + this.alertLevel;
    },
    /**
     * get initial error message
     */
    systemMessages() {
      let messageTopics = this.getWildcardTopics("openWB/system/messages/+");
      var messageList = [];
      for (const [key, element] of Object.entries(messageTopics)) {
        messageList.push({ topic: key, ...element });
      }
      return messageList;
    },
    clientMessages() {
      let messageTopics = this.getWildcardTopics("openWB/command/" + this.$root.mqttClientId + "/messages/+");
      var messageList = [];
      for (const [key, element] of Object.entries(messageTopics)) {
        messageList.push({ topic: key, ...element });
      }
      return messageList;
    },
  },
  methods: {
    toggleAllMessages() {
      this.showAllMessages = !this.showAllMessages;
    },
    compareMessagesByTimestamp(a, b) {
      // last messages first
      return b.timestamp - a.timestamp;
    },
    clearTopic(topic) {
      this.$root.doPublish(topic, undefined);
    },
    /**
     * Removes system or client specific topics from broker
     */
    dismissMessage(event) {
      this.clearTopic(event.topic);
      var index = this.hiddenMessages.indexOf(event.topic);
      if (index > -1) {
        this.hiddenMessages.splice(index, 1);
      }
    },
    /**
     * Removes all received message topics from broker
     */
    dismissAllMessages() {
      this.messages.forEach((message) => {
        this.clearTopic(message.topic);
      });
      this.hiddenMessages = [];
      this.toggleAllMessages();
    },
    /**
     * add message topic to list of hidden messages
     */
    hideMessage(event) {
      if (!this.hiddenMessages.includes(event.topic)) {
        this.hiddenMessages.push(event.topic);
      }
    },
  },
};
</script>

<style scoped>
#message-indicator {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2000; /* navbar: 1030 */
}

#message-indicator .message-counter {
  font-weight: bolder;
}

.openwb-toast-container {
  position: fixed !important;
  z-index: 2000;
  right: 0;
  top: 55px;
  padding: 0.25rem;
  max-width: 275px;
}

.openwb-toast-container.full-height {
  bottom: 30px;
  overflow-y: auto;
  background-color: var(--dark);
  border: 1px solid var(--dark);
}
</style>
