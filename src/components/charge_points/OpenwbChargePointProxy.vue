<template>
	<component
		v-if="chargePointTemplateFound"
		:is="myComponent"
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
			chargePointTemplateFound: true,
		};
	},
	computed: {
		myComponent() {
			console.debug(`loading charge point: ${this.chargePointType}`);
			return defineAsyncComponent(() =>
				import(
					`@/components/charge_points/${this.chargePointType}/chargePoint.vue`
				)
					.then((value) => {
						this.chargePointTemplateFound = true;
						return value;
					})
					.catch((error) => {
						console.warn("charge point template not found", error);
						this.chargePointTemplateFound = false;
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
