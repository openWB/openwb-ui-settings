<template>
	<component
		:is="myComponent"
		:configuration="configuration"
		:electricityTariffType="electricityTariffType"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbElectricityTariffFallback from "./OpenwbElectricityTariffConfigFallback.vue";

export default {
	name: "OpenwbElectricityTariffProxy",
	emits: ["update:configuration"],
	props: {
		electricityTariffType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(
				`loading electricity tariff cloud: ${this.electricityTariffType}`
			);
			return defineAsyncComponent({
				loader: () =>
					import(
						`./${this.electricityTariffType}/electricity_tariff.vue`
					),
				errorComponent: OpenwbElectricityTariffFallback,
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
