<template>
	<component
		v-if="chargePointSettingsTemplateFound"
		:is="myChargePointSettingsComponent"
		:configuration="configuration"
		:chargePointId="chargePointId"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<openwb-base-alert subtype="warning">
			Es wurde keine Konfigurationsseite für den Ladepunkt-Typ "{{
				chargePointType
			}}" gefunden. Die Einstellungen können als JSON direkt bearbeitet
			werden.
		</openwb-base-alert>
		<openwb-base-textarea
			title="Konfiguration"
			subtype="json"
			:model-value="configuration"
			@update:model-value="
				updateConfiguration({
					value: $event,
					object: 'connection_module.configuration',
				})
			"
		>
			<template #help>
				Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden.
			</template>
		</openwb-base-textarea>
		<openwb-base-alert subtype="info">
			<pre>{{ JSON.stringify(configuration, undefined, 2) }}</pre>
		</openwb-base-alert>
	</div>
	<hr v-if="chargePointCommandsTemplateFound" />
	<component
		v-if="chargePointCommandsTemplateFound"
		:is="myChargePointCommandsComponent"
		:configuration="configuration"
		:chargePointId="chargePointId"
	/>
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";

export default {
	name: "OpenwbChargePointProxy",
	emits: ["update:configuration"],
	props: {
		chargePointId: { required: true },
		chargePointType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	data() {
		return {
			chargePointSettingsTemplateFound: true,
			chargePointCommandsTemplateFound: true,
		};
	},
	computed: {
		myChargePointSettingsComponent() {
			console.debug(
				`loading charge point settings: ${this.chargePointType}`
			);
			return defineAsyncComponent(() =>
				import(
					`@/components/charge_points/${this.chargePointType}/chargePoint.vue`
				)
					.then((value) => {
						this.chargePointSettingsTemplateFound = true;
						return value;
					})
					.catch((error) => {
						console.warn(
							"charge point settings template not found",
							error
						);
						this.chargePointSettingsTemplateFound = false;
					})
			);
		},
		myChargePointCommandsComponent() {
			console.debug(
				`loading charge point commands: ${this.chargePointType}`
			);
			return defineAsyncComponent(() =>
				import(
					`@/components/charge_points/${this.chargePointType}/commands.vue`
				)
					.then((value) => {
						this.chargePointCommandsTemplateFound = true;
						return value;
					})
					.catch((error) => {
						console.warn(
							"charge point commands template not found",
							error
						);
						this.chargePointCommandsTemplateFound = false;
					})
			);
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
