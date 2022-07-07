<template>
	<header>
		<nav-bar />
	</header>
	<div role="main" class="container">
		<div id="content">
			<h1>{{ $route.meta.heading }}</h1>
			<command-alert
				:alertData="
					$store.state.mqtt[
						'openWB/command/' +
							this.$root.client.options.clientId +
							'/error'
					]
				"
				@dismiss="dismissError"
			/>
			<router-view
				@save="saveValues"
				@reset="resetValues"
				@defaults="setDefaultValues"
				@sendCommand="sendCommand"
			/>
		</div>
		<donation-banner />
	</div>
	<page-footer />
</template>

<script>
// @ is an alias to /src
import NavBar from "@/components/OpenwbPageNavbar.vue";
import CommandAlert from "@/components/OpenwbPageCommandAlert.vue";
import PageFooter from "@/components/OpenwbPageFooter.vue";
import DonationBanner from "@/components/OpenwbPageDonationBanner.vue";
import mqtt from "mqtt";

export default {
	name: "settings-app",
	components: {
		NavBar,
		CommandAlert,
		PageFooter,
		DonationBanner,
	},
	data() {
		return {
			client: {
				connected: false,
			},
			connection: {
				protocol: location.protocol == "https:" ? "wss" : "ws",
				host: location.hostname,
				port: location.protocol == "https:" ? 443 : 9001,
				endpoint: location.protocol == "https:" ? "/ws" : "/",
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
				return undefined;
			}
		},
		/**
		 * @return {Array} - Array of topics (String)
		 */
		topicList() {
			return Object.keys(this.$store.state.mqtt);
		},
		/**
		 * @return {String} - NODE_ENV
		 */
		nodeEnv() {
			return process.env.NODE_ENV;
		},
		/**
		 * @return {String} - BASE_URL
		 */
		publicPath() {
			return process.env.BASE_URL;
		},
	},
	methods: {
		/**
		 * Send topics to broker
		 * @param {Array} topicsToSave - The topics to save
		 */
		saveValues(topicsToSave = undefined) {
			console.debug("saving values...");
			// collect data
			let topics = {};
			if (topicsToSave === undefined) {
				// no topics defined, so save everything we have in store
				topics = this.$store.state.mqtt;
			} else {
				if (Array.isArray(topicsToSave)) {
					topicsToSave.forEach((topicToSave) => {
						topics[topicToSave] =
							this.$store.state.mqtt[topicToSave];
					});
				} else {
					console.error("expected array, got ", typeof topicsToSave);
				}
			}
			// console.debug("topics", topics);
			for (const [topic, payload] of Object.entries(topics)) {
				let setTopic = topic.replace("openWB/", "openWB/set/");
				console.debug("saving data:", setTopic, payload);
				this.doPublish(setTopic, payload);
			}
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
		 * Removes client specific error topic from broker
		 */
		dismissError() {
			this.doPublish(
				"openWB/command/" + this.client.options.clientId + "/error",
				undefined
			);
		},
		/**
		 * Sends a command via broker to the backend
		 * @param {Object} event - Command object to send
		 */
		sendCommand(event) {
			this.doPublish(
				"openWB/set/command/" + this.client.options.clientId + "/todo",
				event,
				false
			);
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
			const { protocol, host, port, endpoint, ...options } =
				this.connection;
			const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
			console.debug("connecting to broker:", connectUrl);
			try {
				this.client = mqtt.connect(connectUrl, options);
			} catch (error) {
				console.error("mqtt.connect error", error);
			}
			this.client.on("connect", () => {
				console.debug(
					"Connection succeeded! ClientId: ",
					this.client.options.clientId
				);
				this.doSubscribe([
					"openWB/command/" + this.client.options.clientId + "/error",
				]);
			});
			this.client.on("error", (error) => {
				console.error("Connection failed", error);
			});
			this.client.on("message", (topic, message) => {
				// console.debug(
				// 	`Received message "${message}" from topic "${topic}"`
				// );
				if (message.toString().length > 0) {
					let myPayload = undefined;
					try {
						myPayload = JSON.parse(message.toString());
					} catch (error) {
						console.debug(
							"Json parsing failed, fallback to string: ",
							topic
						);
						myPayload = message.toString();
					}
					this.$store.commit("addTopic", {
						topic: topic,
						payload: myPayload,
					});
				} else {
					this.$store.commit("removeTopic", topic);
				}
			});
		},
		doSubscribe(topics) {
			this.client.subscribe(topics, {}, (error) => {
				if (error) {
					console.error("Subscribe to topics error", error);
					return;
				}
			});
		},
		doUnsubscribe(topics) {
			this.client.unsubscribe(topics, (error) => {
				if (error) {
					console.error("Unsubscribe error", error);
				}
			});
		},
		doPublish(topic, payload, retain = true, qos = 2) {
			let options = {
				qos: qos,
				retain: retain,
			};
			this.client.publish(
				topic,
				JSON.stringify(payload),
				options,
				(error) => {
					if (error) {
						console.log("Publish error", error);
					}
				}
			);
		},
	},
	created() {
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
