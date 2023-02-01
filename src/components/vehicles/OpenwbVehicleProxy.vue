<template>
	<component
		:is="myComponent"
		:configuration="configuration"
		:vehicleId="vehicleId"
		:vehicleType="vehicleType"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";
import OpenwbVehicleFallback from "./OpenwbVehicleConfigFallback.vue";

export default {
	name: "OpenwbVehicleProxy",
	emits: ["update:configuration"],
	props: {
		vehicleId: { required: true },
		vehicleType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponentTemplate() {
			return `./${this.vehicleType}/vehicle.vue`;
		},
		myComponent() {
			console.debug(`loading vehicle: ${this.vehicleType}`);
			return defineAsyncComponent({
				loader: () =>
					import(
						/* @vite-ignore */
						this.myComponentTemplate
					),
				errorComponent: OpenwbVehicleFallback,
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
