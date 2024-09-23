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
import { defineAsyncComponent } from "vue";
import OpenwbDeviceConfigFallback from "./OpenwbDeviceConfigFallback.vue";

export default {
	name: "OpenwbConfigProxy",
	emits: ["update:configuration"],
	props: {
		deviceId: { required: true },
		deviceType: { type: String, required: true },
		deviceVendor: { type: String, required: true },
		componentId: { default: undefined },
		componentType: { type: String, default: undefined },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(
				`loading component: ${this.deviceType} / ${this.componentType}`,
			);
			if (this.componentType !== undefined) {
				return defineAsyncComponent({
					loader: () =>
						import(
							`./${this.deviceVendor}/${this.deviceType}/${this.componentType}.vue`
						),
					errorComponent: OpenwbDeviceConfigFallback,
				});
			} else {
				return defineAsyncComponent({
					loader: () =>
						import(
							`./${this.deviceVendor}/${this.deviceType}/device.vue`
						),
					errorComponent: OpenwbDeviceConfigFallback,
				});
			}
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
