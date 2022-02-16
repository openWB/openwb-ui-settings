<script>
export default {
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
						.replace(/[^0-9]+/g, "")
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
			format = { year: "numeric", month: "2-digit", day: "2-digit" }
		) {
			let date = new Date(dateString);
			return date.toLocaleDateString(undefined, format);
		},
	},
	mounted() {
		this.mqttTopicsToSubscribe.push(
			"openWB/log/" + this.mqttClientId + "/data"
		);
		this.mqttTopicsToSubscribe.forEach((topic) => {
			if (topic.includes("#") || topic.includes("+")) {
				console.debug("skipping init of wildcard topic:", topic);
			} else {
				this.$store.commit("addTopic", {
					topic: topic,
					payload: undefined,
				});
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
						console.debug("removing wildcardTopic:", wildcardTopic);
						this.$store.commit("removeTopic", wildcardTopic);
					}
				);
			} else {
				this.$store.commit("removeTopic", topic);
			}
		});
	},
};
</script>
