<script>
export default {
	name: "ComponentState",
	data() {
		return {
			mqttTopicsToSubscribe: [],
		};
	},
	emits: ["reset", "defaults", "save"],
	computed: {
		weekdays() {
			return [
				"Montag",
				"Dienstag",
				"Mittwoch",
				"Donnerstag",
				"Freitag",
				"Samstag",
				"Sonntag",
			];
		},
		chargeModes() {
			return [
				"instant_charging",
				"pv_charging",
				"scheduled_charging",
				"time_charging",
				"standby",
				"stop",
			];
		},
		mqttClientId() {
			return this.$root.mqttClientId;
		},
	},
	methods: {
		updateState(topic, value, objectPath = undefined) {
			console.debug("updateState:", topic, value, objectPath);
			this.$store.commit({
				type: "updateTopic",
				topic: topic,
				objectPath: objectPath,
				payload: value,
			});
		},
		getWildcardIndexList(baseTopic, isRegex = false) {
			let baseTopicRegex = baseTopic;
			if (!isRegex) {
				// build a valid regex based on the provided wildcard topic
				baseTopicRegex =
					"^" +
					baseTopic
						.replaceAll("/", "\\/")
						.replaceAll("+", "[^+/]+")
						.replaceAll("#", "[^#/]+") +
					"$";
			}
			// filter and return all topics matching our regex
			let myTopics = Object.keys(this.$store.state.mqtt).filter((key) => {
				return key.match(baseTopicRegex);
			});
			myTopics.forEach((topic, index, array) => {
				array[index] = parseInt(
					topic
						.match(/(?:\/)([0-9]+)(?=\/)*/g)[0]
						.replace(/[^0-9]+/g, ""),
				);
			});
			return myTopics;
		},
		getWildcardTopics(baseTopic, isRegex = false) {
			let baseTopicRegex = baseTopic;
			if (!isRegex) {
				// build a valid regex based on the provided wildcard topic
				baseTopicRegex =
					"^" +
					baseTopic
						.replaceAll("/", "\\/")
						.replaceAll("+", "[^+/]+")
						.replaceAll("#", "[^#/]+") +
					"$";
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
		formatDate(
			dateString,
			format = { year: "numeric", month: "2-digit", day: "2-digit" },
		) {
			let date = new Date(dateString);
			return date.toLocaleDateString(undefined, format);
		},
		formatNumber(
			value,
			minNumDigits = 0,
			maxNumDigit = minNumDigits,
			scale = 1,
		) {
			return (value * scale).toLocaleString(undefined, {
				minimumFractionDigits: minNumDigits,
				maximumFractionDigits: maxNumDigit,
			});
		},
		formatNumberTopic(
			topic,
			minNumDigits = 0,
			maxNumDigits = minNumDigits,
			scale = 1,
		) {
			if (this.$store.state.mqtt[topic]) {
				return this.formatNumber(
					this.$store.state.mqtt[topic],
					minNumDigits,
					maxNumDigits,
					scale,
				);
			} else {
				return "-";
			}
		},
		formatPhaseArrayNumberTopic(
			topic,
			minNumDigits = 0,
			maxNumDigits = minNumDigits,
			scale = 1,
		) {
			if (this.$store.state.mqtt[topic]) {
				return this.$store.state.mqtt[topic]
					.map((element) => {
						return this.formatNumber(
							element,
							minNumDigits,
							maxNumDigits,
							scale,
						);
					})
					.join(" / ");
			} else {
				return "- / - / -";
			}
		},
		translateChargeMode(value) {
			switch (value) {
				case "instant_charging":
					return "Sofort";
				case "pv_charging":
					return "PV";
				case "scheduled_charging":
					return "Zielladen";
				case "time_charging":
					return "Zeitladen";
				case "standby":
					return "Standby";
				case "stop":
					return "Stop";
				default:
					console.warn("unknown charge mode:", value);
					return value;
			}
		},
	},
	mounted() {
		// ToDo: Check Topic! This topic contains requested charge log data!
		if (
			!(`openWB/log/${this.mqttClientId}/data` in this.$store.state.mqtt)
		) {
			this.mqttTopicsToSubscribe.push(
				"openWB/log/" + this.mqttClientId + "/data",
			);
		}
		this.mqttTopicsToSubscribe.forEach((topic) => {
			if (topic.includes("#") || topic.includes("+")) {
				console.debug("skipping init of wildcard topic:", topic);
			} else {
				// prevent overwriting data with multiple subscriptions
				if (!Object.keys(this.$store.state.mqtt).includes(topic)) {
					this.$store.commit("addTopic", {
						topic: topic,
						payload: undefined,
					});
				} else {
					console.error("multiple subscriptions of topic!", topic);
				}
			}
		});
		this.$root.doSubscribe(this.mqttTopicsToSubscribe);
	},
	unmounted() {
			this.$root.doUnsubscribe(this.mqttTopicsToSubscribe);
			this.mqttTopicsToSubscribe.forEach((topic) => {
				if (topic.includes("#") || topic.includes("+")) {
					console.debug("expanding wildcard topic:", topic);
					Object.keys(this.getWildcardTopics(topic)).forEach(
						(wildcardTopic) => {
							console.debug(
								"removing wildcardTopic:",
								wildcardTopic,
							);
							this.$store.commit("removeTopic", wildcardTopic);
						},
					);
				} else {
					this.$store.commit("removeTopic", topic);
				}
			});
	},
};
</script>
