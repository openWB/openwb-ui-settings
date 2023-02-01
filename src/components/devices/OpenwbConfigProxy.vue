<template>
	<component
		:is="myComponent"
		:configuration="configuration"
		:deviceId="deviceId"
		:deviceType="deviceType"
		:componentId="componentId"
		:componentType="componentType"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";
import OpenwbDeviceConfigFallback from "./OpenwbDeviceConfigFallback.vue";

export default {
	name: "OpenwbConfigProxy",
	emits: ["update:configuration"],
	props: {
		deviceId: { required: true },
		deviceType: { type: String, required: true },
		componentId: { default: undefined },
		componentType: { type: String, default: undefined },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponentTemplate() {
			if (this.componentType !== undefined) {
				return `./${this.deviceType}/${this.componentType}.vue`;
			}
			return `./${this.deviceType}/device.vue`;
		},
		myComponent() {
			console.debug(
				`loading component: ${this.deviceType} / ${this.componentType}`
			);
			return defineAsyncComponent({
				loader: () =>
					import(
						/* @vite-ignore */
						this.myComponentTemplate
					),
				errorComponent: OpenwbDeviceConfigFallback,
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
