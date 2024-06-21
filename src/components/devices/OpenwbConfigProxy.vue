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
	data() {
		return {
			deviceTypeMod: undefined,
		};
	},
	computed: {},
	methods: {
		myComponent() {
			if (!this.deviceType.includes(".")) {
				console.debug(
					`loading component: ${this.deviceType} / ${this.componentType}`,
				);
				if (this.componentType !== undefined) {
					return defineAsyncComponent({
						loader: () =>
							import(
								`./${this.deviceType}/${this.componentType}.vue`
							),
						errorComponent: OpenwbDeviceConfigFallback,
					});
				} else {
					return defineAsyncComponent({
						loader: () => import(`./${this.deviceType}/device.vue`),
						errorComponent: OpenwbDeviceConfigFallback,
					});
				}
			}
			if (this.deviceType.includes(".")) {
				this.deviceTypeMod = this.deviceType.split(".")[1];
				console.debug(
					`loading component: ${this.deviceTypeMod} / ${this.componentType}`,
				);
				if (this.componentType !== undefined) {
					return defineAsyncComponent({
						loader: () =>
							import(
								`./${this.deviceTypeMod}/${this.componentType}.vue`
							),
						errorComponent: OpenwbDeviceConfigFallback,
					});
				} else {
					return defineAsyncComponent({
						loader: () =>
							import(`./${this.deviceTypeMod}/device.vue`),
						errorComponent: OpenwbDeviceConfigFallback,
					});
				}
			}
		},
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
