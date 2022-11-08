<template>
	<component
		v-if="vehicleTemplateFound"
		:is="myComponent"
		:configuration="configuration"
		:vehicleId="vehicleId"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<openwb-base-alert subtype="warning">
			Es wurde keine Konfigurationsseite für den Fahrzeug-Typ "{{
				vehicleType
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
	name: "OpenwbVehicleProxy",
	emits: ["update:configuration"],
	props: {
		vehicleId: { required: true },
		vehicleType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	data() {
		return {
			vehicleTemplateFound: true,
		};
	},
	computed: {
		myComponent() {
			console.debug(`loading vehicle: ${this.vehicleType}`);
			return defineAsyncComponent(() =>
				import(`@/components/vehicles/${this.vehicleType}/vehicle.vue`)
					.then((value) => {
						this.vehicleTemplateFound = true;
						return value;
					})
					.catch((error) => {
						console.warn("vehicle template not found", error);
						this.vehicleTemplateFound = false;
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
