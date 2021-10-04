<script>
export default {
	emits: ["reset", "defaults", "save"],
	methods: {
		updateState(topic, value, objectPath = undefined) {
			this.$store.commit({
				type: "updateTopic",
				topic: topic,
				objectPath: objectPath,
				payload: value,
			});
		},
	},
	mounted() {
		// console.debug("mounted");
		this.$root.doSubscribe(this.mqttTopicsToSubscribe);
	},
	unmounted() {
		// console.debug("unmounted");
		this.$root.doUnsubscribe(this.mqttTopicsToSubscribe);
	},
};
</script>
