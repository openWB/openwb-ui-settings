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
  <user-info @send-command="sendCommand" />
  <messages />
  <blocker />
</template>

<script>
import NavBar from "./components/OpenwbPageNavbar.vue";
import PageFooter from "./components/OpenwbPageFooter.vue";
import UserInfo from "./components/OpenwbPageUser.vue";
import Messages from "./components/OpenwbPageMessages.vue";
import Blocker from "./components/OpenwbPageBlocker.vue";
import mqtt from "mqtt";

export default {
  name: "OpenwbSettingsApp",
  components: {
    NavBar,
    PageFooter,
    UserInfo,
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
        protocolVersion: 5,
        host: location.hostname,
        port: parseInt(location.port) || (location.protocol == "https:" ? 443 : 80),
        path: "/ws",
        connectTimeout: 4000,
        reconnectPeriod: 4000,
        resubscribe: true,
        properties: {
          requestResponseInformation: true,
          requestProblemInformation: true,
        },
      },
      dataTimeout: null,
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
    nodeEnv() {
      return import.meta.env.MODE;
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

      function isWildcardTopic(topic) {
        return topic.includes("#") || topic.includes("+");
      }

      this.$store.commit("storeLocal", {
        name: "savingData",
        value: true,
      });
      // collect data
      let topics = {};
      if (topicsToSave === undefined) {
        console.error("no topics to save defined!");
        return;
      }
      if (Array.isArray(topicsToSave)) {
        topicsToSave.forEach((topicToSave) => {
          if (isWildcardTopic(topicToSave)) {
            console.debug("expanding wildcard topic:", topicToSave);
            const wildcardTopics = this.getWildcardTopics(topicToSave);
            Object.entries(wildcardTopics).forEach(([wildcardTopic, payload]) => {
              console.debug("adding topic to save:", wildcardTopic);
              topics[wildcardTopic] = payload;
            });
          } else {
            console.debug("adding topic to save:", topicToSave);
            topics[topicToSave] = this.$store.state.mqtt[topicToSave];
          }
        });
      } else {
        console.error("expected array, got ", typeof topicsToSave);
        return;
      }
      for (const [topic, payload] of Object.entries(topics)) {
        // skip topics starting with "$CONTROL"
        if (topic.startsWith("$CONTROL")) {
          console.debug("skipping control topic:", topic);
          continue;
        }
        let setTopic = topic.replace("openWB/", "openWB/set/");
        console.debug("saving data:", setTopic, payload);
        this.doPublish(setTopic, payload);
        // publishing without sleeping is inconsistent! (mqtt v4.3.7)
        // This may change with newer versions.
        await sleep(50);
      }
      this.$store.commit("storeLocal", {
        name: "savingData",
        value: false,
      });
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
      this.doPublish(`openWB/set/command/${this.client.options.clientId}/todo/${event.command}`, event, false);
    },
    /**
     * Establishes a connection to the configured broker
     */
    createConnection() {
      // Connect string, and specify the connection method used through protocol
      // ws not encrypted WebSocket connection
      // wss encrypted WebSocket connection
      const { protocol, host, port, path, ...options } = this.connection;
      const connectUrl = `${protocol}://${host}:${port}${path}`;
      const [user, pass] = this.$cookies.get("mqtt")?.split(":") || [null, null];
      if (!(user && pass)) {
        console.debug("Anonymous mqtt connection (no cookie set)");
      }
      if ((this.nodeEnv !== "production" || protocol == "wss") && user && pass) {
        console.debug("Using mqtt credentials from cookie:", user, "/", pass.charAt(0), "...");
        options.username = user;
        options.password = pass;
        if (user === "admin" && pass === "openwb") {
          console.warn("Using default mqtt credentials! This is insecure and not recommended for production systems.");
          this.postClientMessage(
            "Warnung: Es werden die Standard-Zugangsdaten für MQTT verwendet! Dies ist unsicher und wird für Produktivsysteme nicht empfohlen.",
            "warning",
          );
        }
      }
      console.debug("connecting to broker:", connectUrl);
      this.client = mqtt.connect(connectUrl, options);
      this.client.on("connect", () => {
        console.debug("Connection succeeded! ClientId: ", this.client.options.clientId);
        if (user) {
          this.postClientMessage(`Angemeldet als "${user}".`, "success");
          this.$store.commit("storeLocal", { name: "username", value: user });
        }
        // required for route guards
        this.doSubscribe(
          [
            "openWB/system/boot_done",
            "openWB/system/usage_terms_acknowledged",
            "openWB/system/installAssistantDone",
            "openWB/system/security/access/+",
          ],
          true,
        );
        // after one second check if we received any data, if not, the connection is probably not working and we should inform the user
        this.dataTimeout = setTimeout(() => {
          console.warn(
            "No data received after 1 second, connection might not be working. Removing mqtt cookie and trying again with anonymous connection.",
          );
          if (user) {
            this.postClientMessage(
              "Es wurden zwar Anmeldeinformationen gefunden, aber nach 1 Sekunde keine Daten empfangen. Die Verbindung scheint nicht zu funktionieren. " +
                "Anmeldedaten werden entfernt und es wird erneut mit anonymer Verbindung versucht.",
              "warning",
            );
            this.$cookies.remove("mqtt");
            this.reconnectMqttClient();
          } else {
            this.postClientMessage(
              "Es wurden keine Anmeldeinformationen gefunden und nach 1 Sekunde keine Daten empfangen. Die Verbindung scheint nicht zu funktionieren.",
              "danger",
            );
          }
        }, 1000);
      });
      this.client.on("error", (error) => {
        console.error("Connection failed", error);
        this.postClientMessage("Verbindungsfehler:<br />" + error.message, "danger");
        this.$cookies.remove("mqtt");
        this.$store.commit("storeLocal", { name: "username", value: null });
        this.reconnectMqttClient();
      });
      this.client.on("message", (topic, message) => {
        if (this.dataTimeout) {
          clearTimeout(this.dataTimeout);
          this.dataTimeout = null;
        }
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
      this.client.on("end", () => {
        console.error("mqtt connection ended");
      });
      this.client.on("close", () => {
        console.error("mqtt connection closed");
      });
      this.client.on("offline", () => {
        console.error("mqtt connection offline");
      });
      this.client.on("disconnect", () => {
        console.error("mqtt connection disconnected");
      });
      this.client.on("reconnect", () => {
        console.error("mqtt connection reconnecting...");
      });
    },
    endConnection() {
      if (this.client?.connected) {
        console.warn("Ending mqtt connection...");
        this.client.end();
        this.$store.commit("storeLocal", { name: "username", value: null });
        if (this.dataTimeout) {
          clearTimeout(this.dataTimeout);
          this.dataTimeout = null;
        }
      } else {
        console.error("No mqtt connection to end.");
      }
    },
    reconnectMqttClient() {
      if (this.client?.connected) {
        this.endConnection();
      }
      this.createConnection();
    },
    doSubscribe(topics, forceResubscribe = false) {
      topics.forEach((topic) => {
        if (this.$store.getters.subscriptionCount(topic) == 0 || forceResubscribe) {
          this.$store.commit("addSubscription", topic);
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
              this.postClientMessage(
                `Daten konnten nicht abonniert werden.<br />Topic: ${topic}<br />${error}`,
                "danger",
              );
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
              this.postClientMessage(
                `Daten konnten nicht abbestellt werden.<br />Topic: ${topic}<br />${error}`,
                "danger",
              );
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
          this.postClientMessage(
            `Daten konnten nicht geschrieben werden.<br />Topic: ${topic}<br />${error}`,
            "danger",
          );
        }
      });
    },
    postClientMessage(message, type = "secondary") {
      console.debug("postMessage:", message, type);
      const timestamp = Date.now();
      this.$store.commit({
        type: "addClientMessage",
        timestamp: timestamp,
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

@media (min-width: 1600px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl {
    max-width: 1500px !important;
  }
}
</style>
