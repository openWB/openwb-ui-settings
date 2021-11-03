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
import NavBar from "@/components/Navbar.vue";
import CommandAlert from "@/components/CommandAlert.vue";
import PageFooter from "@/components/PageFooter.vue";
import DonationBanner from "@/components/DonationBanner.vue";
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
				host: location.hostname,
				port: 9001,
				endpoint: "/",
				connectTimeout: 4000,
				reconnectPeriod: 4000,
			},
		};
	},
	computed: {
		topicList() {
			return Object.keys(this.$store.state.mqtt);
		},
	},
	methods: {
		saveValues() {
			console.debug("saving values...");
			// *** may be useful if we implemented authentication ***
			// let data = JSON.stringify(this.$store.state.mqtt);
			// console.debug("data:", data);
			// then post data to server
			let topics = this.$store.state.mqtt;
			// console.debug("topics", topics);
			for (const [topic, payload] of Object.entries(topics)) {
				let setTopic = topic.replace("openWB/", "openWB/set/");
				console.debug("saving data:", setTopic, payload);
				this.doPublish(setTopic, payload);
			}
		},
		resetValues() {
			console.debug("resetting values...");
			// simply unsubscribe and subscribe to broker
			let topics = this.topicList;
			console.debug("topics: ", topics);
			this.doUnsubscribe(topics);
			this.doSubscribe(topics);
		},
		setDefaultValues() {
			console.debug("setting default values...");
		},
		dismissError() {
			this.doPublish(
				"openWB/command/" + this.client.options.clientId + "/error",
				undefined
			);
		},
		sendCommand(event) {
			console.log("sendCommand event", event);
			this.doPublish(
				"openWB/set/command/" + this.client.options.clientId + "/todo",
				event,
				false
			);
		},
		createConnection() {
			console.debug("connecting to broker...");
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
