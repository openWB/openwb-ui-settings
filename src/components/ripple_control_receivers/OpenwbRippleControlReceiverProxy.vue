<template>
	<openwb-base-heading>
		Einstellungen für RSE-Modul "{{ rippleControlReceiver.name }}"
	</openwb-base-heading>
	<component
		:is="myComponent"
		:rippleControlReceiver="rippleControlReceiver"
		@update:configuration="updateConfiguration($event)"
		@sendCommand="sendCommand($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbRippleControlReceiverFallback from "./OpenwbRippleControlReceiverConfigFallback.vue";

export default {
	name: "OpenwbRippleControlReceiverProxy",
	emits: ["update:configuration", "sendCommand"],
	props: {
		rippleControlReceiver: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(
				`loading backup cloud: ${this.rippleControlReceiver.type}`
			);
			return defineAsyncComponent({
				loader: () =>
					import(
						`./${this.rippleControlReceiver.type}/ripple_control_receiver.vue`
					),
				errorComponent: OpenwbRippleControlReceiverFallback,
			});
		},
	},
	methods: {
		// event pass through
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
		// event pass through
		sendCommand(event) {
			this.$emit("sendCommand", event);
		},
	},
};
</script>
