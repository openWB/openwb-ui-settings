<script>
export default {
	emits: ["reset", "defaults", "save"],
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
		getWildcardTopics(baseTopic) {
			// build a valid regex based on the provided wildcard topic
			let baseTopicRegex =
				"^" +
				baseTopic
					.replaceAll("/", "\\/")
					.replaceAll("+", "[^+]+")
					.replaceAll("#", "[^#]+") +
				"$";
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
	mounted() {
		console.debug("mounted");
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
		console.debug("unmounted");
		this.$root.doUnsubscribe(this.mqttTopicsToSubscribe);
		this.mqttTopicsToSubscribe.forEach((topic) => {
			this.$store.commit("removeTopic", topic);
		});
	},
};
</script>
