<template>
  <header>
    <nav-bar />
  </header>
  <div role="main" class="container">
    <div id="content">
      <h1>{{ $route.meta.heading }}</h1>
      <router-view
        @save="saveValues()"
        @reset="resetValues()"
        @defaults="setDefaultValues()"
      />
    </div>
    <donation-banner />
  </div>
  <page-footer />
</template>

<script>
// @ is an alias to /src
import NavBar from "@/components/Navbar.vue";
import PageFooter from "@/components/PageFooter.vue";
import DonationBanner from "@/components/DonationBanner.vue";
import mqtt from "mqtt";

export default {
  name: "settings-app",
  components: {
    NavBar,
    PageFooter,
    DonationBanner,
  },
  data() {
    return {
      client: {
        connected: false,
      },
      subscribeSuccess: false,
      connection: {
        host: location.hostname,
        // host: "openwb-20.net21",
        port: 9001,
        endpoint: "/",
        connectTimeout: 4000,
        reconnectPeriod: 4000,
      },
    };
  },
  methods: {
    saveValues() {
      console.log("saving values...");
    },
    resetValues() {
      console.log("resetting values...");
      // simply unsubscribe and subscribe to broker
    },
    setDefaultValues() {
      console.log("setting default values...");
    },
    createConnection() {
      console.log("connecting to broker...");
      // Connect string, and specify the connection method used through protocol
      // ws unencrypted WebSocket connection
      // wss encrypted WebSocket connection
      // mqtt unencrypted TCP connection
      // mqtts encrypted TCP connection
      // wxs WeChat mini app connection
      // alis Alipay mini app connection
      const { host, port, endpoint, ...options } = this.connection;
      const connectUrl = `ws://${host}:${port}${endpoint}`;
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }
      this.client.on("connect", () => {
        console.log("Connection succeeded!");
        this.doSubscribe();
      });
      this.client.on("error", (error) => {
        console.log("Connection failed", error);
      });
      this.client.on("message", (topic, message) => {
        // console.log(`Received message ${message} from topic ${topic}`);
        try {
          this.$store.commit("addTopic", {
            topic: topic,
            payload: JSON.parse(message.toString()),
          });
        } catch (error) {
          console.log("Json parsing failed, fallback to string: ", topic);
          this.$store.commit("addTopic", {
            topic: topic,
            payload: message.toString(),
          });
        }
      });
    },
    doSubscribe(topics = ["openWB/system/Timestamp"]) {
      console.log("subscribing to topics...");
      this.client.subscribe(topics, {}, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        this.subscribeSuccess = true;
      });
    },
    doUnsubscribe(topics = ["openWB/system/Timestamp"]) {
      console.log("unsubscribing topics...");
      this.client.unsubscribe(topics, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
        }
      });
      topics.forEach((topic) => {
        this.$store.commit("removeTopic", topic);
      });
    },
  },
  created() {
    console.log("app created");
    this.createConnection();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container[role="main"] {
  padding: 60px 15px 30px;
}
</style>
