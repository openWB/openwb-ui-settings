<template>
	<div class="openwb-toast position-fixed bottom-0 right-0 p-3">
		<openwb-base-toast
			v-for="message in messages"
			:key="message.topic"
			:topic="message.topic"
			:source="message.source"
			:subtype="message.type"
			:timestamp="message.timestamp"
			@dismiss="dismiss"
		>
			<span v-html="message.message"></span>
		</openwb-base-toast>
	</div>
</template>

<script>
import ComponentState from "./mixins/ComponentState.vue";

export default {
	name: "OpenwbPageMessages",
	mixins: [ComponentState],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/system/messages/+",
				"openWB/command/" + this.$root.mqttClientId + "/messages/+",
				"openWB/command/" + this.$root.mqttClientId + "/error",
			],
		};
	},
	computed: {
		messages() {
			const myMessages = [];
			if (this.alertData) {
				myMessages.push({
					topic:
						"openWB/command/" + this.$root.mqttClientId + "/error",
					source: "command",
					type: "danger",
					message:
						'Bei der Verarbeitung des Befehls \'<span class="font-weight-bold">' +
						this.alertData.command +
						"</span>' mit den Parametern '<span class=\"font-weight-bold\">" +
						this.alertData.data +
						"</span>' ist ein Fehler aufgetreten:<br />" +
						"<pre class='font-weight-bold'>" +
						this.alertData.error +
						"</pre>",
				});
			}
			this.systemMessages.forEach((message) => {
				myMessages.push(message);
			});
			this.clientMessages.forEach((message) => {
				myMessages.push(message);
			});
			myMessages.sort(this.compareMessagesByTimestamp);
			return myMessages;
		},
		/**
		 * get initial error message
		 */
		alertData() {
			return this.$store.state.mqtt[
				"openWB/command/" + this.$root.mqttClientId + "/error"
			];
		},
		systemMessages() {
			let messageTopics = this.getWildcardTopics(
				"openWB/system/messages/+"
			);
			var messageList = [];
			for (const [key, element] of Object.entries(messageTopics)) {
				messageList.push({ topic: key, ...element });
			}
			return messageList;
		},
		clientMessages() {
			let messageTopics = this.getWildcardTopics(
				"openWB/command/" + this.$root.mqttClientId + "/messages/+"
			);
			var messageList = [];
			for (const [key, element] of Object.entries(messageTopics)) {
				messageList.push({ topic: key, ...element });
			}
			return messageList;
		},
	},
	methods: {
		compareMessagesByTimestamp(a, b) {
			// last messages first
			return b.timestamp - a.timestamp;
		},
		clearTopic(topic) {
			this.$root.doPublish(topic, undefined);
		},
		/**
		 * Removes client specific error topic from broker
		 */
		dismissError() {
			this.clearTopic(
				"openWB/command/" + this.$root.mqttClientId + "/error"
			);
		},
		/**
		 * Removes system or client specific topics from broker
		 */
		dismiss(event) {
			console.debug("removing message: " + event.topic);
			this.clearTopic(event.topic);
		},
	},
};
</script>

<style scoped>
.openwb-toast {
	z-index: 2000;
	right: 0;
	top: 60px;
}
</style>
