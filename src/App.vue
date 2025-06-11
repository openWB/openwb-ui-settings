<template>
  <header>
    <nav-bar />
  </header>
  <div
    role="main"
    class="container"
  >
    <div id="content">
      <h1>{{ $route.meta.heading }}</h1>
      <router-view
        @save="saveValues"
        @reset="resetValues"
        @defaults="setDefaultValues"
        @send-command="sendCommand"
      />
    </div>
  </div>
  <page-footer />
  <messages />
  <blocker />
</template>

<script>
import NavBar from "./components/OpenwbPageNavbar.vue";
import PageFooter from "./components/OpenwbPageFooter.vue";
import Messages from "./components/OpenwbPageMessages.vue";
import Blocker from "./components/OpenwbPageBlocker.vue";
import mqtt from "mqtt";

export default {
  name: "OpenwbSettingsApp",
  components: {
    NavBar,
    PageFooter,
    Messages,
    Blocker,
  },
  data() {
    return {
      client: {
        connected: false,
      },
      connection: {
        protocol: location.protocol == "https:" ? "wss" : "ws",
        host: location.hostname,
        port: parseInt(location.port) || (location.protocol == "https:" ? 443 : 80),
        endpoint: "/ws",
        connectTimeout: 4000,
        reconnectPeriod: 4000,
      },
    };
  },
  computed: {
    /**
     * @return {Str} - Mqtt client id of our connection
     */
    mqttClientId() {
      try {
        return this.client.options.clientId;
      } catch (error) {
        console.error("mqttClientId error", error);
        return undefined;
      }
    },
    /**
     * @return {Array} - Array of topics (String)
     */
    topicList() {
      return Object.keys(this.$store.state.mqtt);
    },
  },
  created() {
    this.createConnection();
  },
  methods: {
    /**
     * Send topics to broker
     * @param {Array} topicsToSave - The topics to save
     */
    async saveValues(topicsToSave = undefined) {
      function sleep(milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      }

      this.$store.state.local.savingData = true;
      // collect data
      let topics = {};
      if (topicsToSave === undefined) {
        console.debug("no topics defined, so save everything we have in store");
        topics = this.$store.state.mqtt;
      } else {
        if (Array.isArray(topicsToSave)) {
          topicsToSave.forEach((topicToSave) => {
            topics[topicToSave] = this.$store.state.mqtt[topicToSave];
          });
        } else {
          console.error("expected array, got ", typeof topicsToSave);
        }
      }
      for (const [topic, payload] of Object.entries(topics)) {
        let setTopic = topic.replace("openWB/", "openWB/set/");
        console.debug("saving data:", setTopic, payload);
        this.doPublish(setTopic, payload);
        // publishing without sleeping is inconsistent! (mqtt v4.3.7)
        // This may change with newer versions.
        await sleep(100);
      }
      this.$store.state.local.savingData = false;
    },
    /**
     * Reload topics from broker
     * @param {Array} topicsToReset - The topics to reset
     */
    resetValues(topicsToReset = this.topicList) {
      console.debug("resetting values...");
      console.debug("topics: ", topicsToReset);
      // simply unsubscribe and subscribe to broker
      this.doUnsubscribe(topicsToReset);
      this.doSubscribe(topicsToReset);
    },
    /**
     * ToDo
     */
    setDefaultValues() {
      console.debug("setting default values... (ToDo)");
    },
    /**
     * Sends a command via broker to the backend
     * @param {Object} event - Command object to send
     */
    sendCommand(event) {
      console.debug("sendCommand:", event);
      this.doPublish("openWB/set/command/" + this.client.options.clientId + "/todo", event, false);
    },
    /**
     * Establishes a connection to the configured broker
     */
    createConnection() {
      // Connect string, and specify the connection method used through protocol
      // ws not encrypted WebSocket connection
      // wss encrypted WebSocket connection
      // mqtt not encrypted TCP connection
      // mqtts encrypted TCP connection
      // wxs WeChat mini app connection
      // alis Alipay mini app connection
      const { protocol, host, port, endpoint, ...options } = this.connection;
      const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
      console.debug("connecting to broker:", connectUrl);
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.error("mqtt.connect error", error);
      }
      this.client.on("connect", () => {
        console.debug("Connection succeeded! ClientId: ", this.client.options.clientId);
        // required for route guards
        this.doSubscribe(["openWB/system/usage_terms_acknowledged"]);
        this.doSubscribe(["openWB/system/installAssistantDone"]);
      });
      this.client.on("error", (error) => {
        console.error("Connection failed", error);
      });
      this.client.on("message", (topic, message) => {
        if (message.toString().length > 0) {
          let myPayload = undefined;
          try {
            myPayload = JSON.parse(message.toString());
          } catch (error) {
            console.debug("Json parsing failed, fallback to string: ", topic, error);
            myPayload = message.toString();
          }
          this.$store.commit("updateTopic", {
            topic: topic,
            payload: myPayload,
          });
        } else {
          this.$store.commit("removeTopic", topic);
          // this.$store.commit("updateTopic", {
          //   topic: topic,
          //   payload: undefined,
          // });
        }
      });
    },
    doSubscribe(topics) {
      topics.forEach((topic) => {
        this.$store.commit("addSubscription", topic);
        if (this.$store.getters.subscriptionCount(topic) == 1) {
          if (topic.includes("#") || topic.includes("+")) {
            console.debug("skipping init of wildcard topic:", topic);
          } else {
            this.$store.commit("addTopic", {
              topic: topic,
              payload: undefined,
            });
          }
          this.client.subscribe(topic, {}, (error) => {
            if (error) {
              console.error("Subscribe to topics error", error);
              return;
            }
          });
        } else {
          console.debug("Already subscribed to topic: ", topic);
        }
      });
    },
    doUnsubscribe(topics) {
      topics.forEach((topic) => {
        this.$store.commit("removeSubscription", topic);
        if (this.$store.getters.subscriptionCount(topic) == 0) {
          this.client.unsubscribe(topic, (error) => {
            if (error) {
              console.error("Unsubscribe error", error);
            }
          });
          if (topic.includes("#") || topic.includes("+")) {
            console.debug("expanding wildcard topic:", topic);
            Object.keys(this.getWildcardTopics(topic)).forEach((wildcardTopic) => {
              console.debug("removing wildcardTopic:", wildcardTopic);
              this.$store.commit("removeTopic", wildcardTopic);
            });
          } else {
            console.debug("removing topic:", topic);
            this.$store.commit("removeTopic", topic);
          }
        } else {
          console.debug("Still subscribed to topic: ", topic);
        }
      });
    },
    doPublish(topic, payload, retain = true, qos = 2) {
      let options = {
        qos: qos,
        retain: retain,
      };
      this.client.publish(topic, JSON.stringify(payload), options, (error) => {
        if (error) {
          console.error("Publish error", error);
        }
      });
    },
    postClientMessage(message, type = "secondary") {
      console.debug("postMessage:", message, type);
      const timestamp = Date.now();
      const topic = "openWB/command/" + this.mqttClientId + "/messages/" + timestamp;
      this.$store.commit({
        type: "addTopic",
        topic: topic,
        payload: {
          message: message,
          type: type,
          source: "client",
          timestamp: Math.floor(timestamp / 1000),
        },
      });
    },
    // ToDo: this is a duplicate of the method in the ComponentState.vue mixin
    // refactor to a shared method!
    getWildcardTopics(baseTopic, isRegex = false) {
      let baseTopicRegex = baseTopic;
      if (!isRegex) {
        // build a valid regex based on the provided wildcard topic
        baseTopicRegex =
          "^" + baseTopic.replaceAll("/", "\\/").replaceAll("+", "[^+/]+").replaceAll("#", "[^#/]+") + "$";
      }
      // filter and return all topics matching our regex
      return Object.keys(this.$store.state.mqtt)
        .filter((key) => {
          return key.match(baseTopicRegex);
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: this.$store.state.mqtt[key],
          };
        }, {});
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container[role="main"] {
  padding: 60px 15px 30px;
}

.clickable {
  cursor: pointer;
}

.clickable[disabled="true"] {
  /* prevent pointer events on the icon when disabled */
  pointer-events: none;
  /* visually indicate that the icon is disabled */
  opacity: 0.5;
}

.not-clickable {
  cursor: not-allowed;
}

.bg-primary,
.bg-secondary,
.bg-info,
.bg-danger,
.bg-success,
.bg-dark {
  color: white;
}

.bg-warning,
.bg-pink,
.bg-light,
.bg-white {
  color: #212529;
}

.border-pink {
  border-color: var(--pink) !important;
}

.bg-pink {
  background-color: var(--pink) !important;
}
</style>
