<template>
	<component
		:is="myComponent"
		:configuration="configuration"
		:webThemeType="webThemeType"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbWebThemeFallback from "./OpenwbWebThemeFallback.vue";

export default {
	name: "OpenwbWebThemeProxy",
	emits: ["update:configuration"],
	props: {
		webThemeType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(`loading web theme: ${this.webThemeType}`);
			return defineAsyncComponent({
				loader: () => import(`./${this.webThemeType}/webTheme.vue`),
				errorComponent: OpenwbWebThemeFallback,
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
