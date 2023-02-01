<template>
	<openwb-base-heading>
		Einstellungen für Ladepunkt {{ moduleName }}
	</openwb-base-heading>
	<component
		:is="myChargePointSettingsComponent"
		:configuration="configuration"
		:chargePointId="chargePointId"
		:chargePointType="chargePointType"
		@update:configuration="updateConfiguration($event)"
	/>
	<hr />
	<openwb-base-heading>
		Befehle für Ladepunkt {{ moduleName }}
	</openwb-base-heading>
	<component
		:is="myChargePointCommandsComponent"
		:configuration="configuration"
		:chargePointId="chargePointId"
		:chargePointType="chargePointType"
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
		chargePointId: { required: true },
		chargePointType: { type: String, required: true },
		configuration: { type: Object, required: true },
		moduleName: { type: String, required: false, default: undefined },
	},
	computed: {
		myChargePointSettingsTemplate() {
			return `./${this.chargePointType}/chargePoint.vue`;
		},
		myChargePointSettingsComponent() {
			console.debug(
				`loading charge point settings: ${this.chargePointType}`
			);
			return defineAsyncComponent({
				loader: () =>
					import(
						/* @vite-ignore */
						this.myChargePointSettingsTemplate
					),
				errorComponent: OpenwbChargePointConfigFallback,
			});
		},
		myChargePointCommandsTemplate() {
			return `./${this.chargePointType}/commands.vue`;
		},
		myChargePointCommandsComponent() {
			console.debug(
				`loading charge point commands: ${this.chargePointType}`
			);
			return defineAsyncComponent({
				loader: () =>
					import(
						/* @vite-ignore */
						this.myChargePointCommandsTemplate
					),
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
