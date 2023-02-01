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
		componentId: { default: undefined },
		componentType: { type: String, default: undefined },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponentTemplate() {
			if (this.componentType !== undefined) {
				return `@/components/devices/${this.deviceType}/${this.componentType}.vue`;
			}
			return `@/components/devices/${this.deviceType}/device.vue`;
		},
		myComponent() {
			console.debug(
				`loading component: ${this.deviceType} / ${this.componentType}`
			);
			if (this.componentType !== undefined) {
				return defineAsyncComponent({
					loader: () =>
						import(
							`@/components/devices/${this.deviceType}/${this.componentType}.vue`
						),
					errorComponent: OpenwbDeviceConfigFallback,
				});
			} else {
				return defineAsyncComponent({
					loader: () =>
						import(
							`@/components/devices/${this.deviceType}/device.vue`
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
