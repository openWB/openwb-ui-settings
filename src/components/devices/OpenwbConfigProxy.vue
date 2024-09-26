<template>
	<component
		:is="myComponent"
		:device="device"
		:component="component"
		:configuration="
			component ? component.configuration : device.configuration
		"
		:deviceId="device.id"
		:deviceType="device.type"
		:componentId="component ? component.id : undefined"
		:componentType="component ? component.type : undefined"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbDeviceConfigFallback from "./OpenwbDeviceConfigFallback.vue";
import OpenwbComponentConfigFallback from "./OpenwbComponentConfigFallback.vue";

export default {
	name: "OpenwbConfigProxy",
	emits: ["update:configuration"],
	props: {
		device: { type: Object, required: true },
		component: { type: Object, required: false, default: undefined },
	},
	computed: {
		myComponent() {
			console.debug(
				`loading component: ${this.device.type} / ${this.component?.type}`,
			);
			if (this.component !== undefined) {
				return defineAsyncComponent({
					loader: () =>
						import(
							`./${this.device.vendor}/${this.device.type}/${this.component.type}.vue`
						),
					errorComponent: OpenwbComponentConfigFallback,
				});
			} else {
				return defineAsyncComponent({
					loader: () =>
						import(
							`./${this.device.vendor}/${this.device.type}/device.vue`
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
