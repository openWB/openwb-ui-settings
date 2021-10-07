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
	},
	mounted() {
		console.debug("mounted");
		this.mqttTopicsToSubscribe.forEach((topic) => {
			this.$store.commit("addTopic", {
				topic: topic,
				payload: undefined,
			});
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
