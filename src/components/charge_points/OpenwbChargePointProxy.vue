<template>
	<openwb-base-heading>
		Einstellungen für Ladepunkt Typ "{{ chargePoint.type }}"
	</openwb-base-heading>
	<component
		:is="myChargePointSettingsComponent"
		:chargePoint="chargePoint"
		@update:configuration="updateConfiguration($event)"
	/>
	<hr />
	<openwb-base-heading>
		Befehle für Ladepunkt Typ "{{ chargePoint.type }}"
	</openwb-base-heading>
	<component
		:is="myChargePointCommandsComponent"
		:chargePoint="chargePoint"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbChargePointConfigFallback from "./OpenwbChargePointConfigFallback.vue";
import OpenwbChargePointCommandsFallback from "./OpenwbChargePointCommandsFallback.vue";

export default {
	name: "OpenwbChargePointProxy",
	emits: ["update:configuration"],
	props: {
		chargePoint: { required: true, type: Object },
	},
	computed: {
		myChargePointSettingsComponent() {
			console.debug(
				`loading charge point settings: ${this.chargePoint.type}`
			);
			return defineAsyncComponent({
				loader: () =>
					import(`./${this.chargePoint.type}/chargePoint.vue`),
				errorComponent: OpenwbChargePointConfigFallback,
			});
		},
		myChargePointCommandsComponent() {
			console.debug(
				`loading charge point commands: ${this.chargePoint.type}`
			);
			return defineAsyncComponent({
				loader: () => import(`./${this.chargePoint.type}/commands.vue`),
				errorComponent: OpenwbChargePointCommandsFallback,
			});
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
