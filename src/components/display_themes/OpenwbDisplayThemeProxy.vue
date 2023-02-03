<template>
	<component
		:is="myComponent"
		:configuration="configuration"
		:displayThemeType="displayThemeType"
		@update:configuration="updateConfiguration($event)"
	/>
</template>

<script>
import { defineAsyncComponent } from "vue";
import OpenwbDisplayThemeFallback from "./OpenwbDisplayThemeFallback.vue";

export default {
	name: "OpenwbDisplayThemeProxy",
	emits: ["update:configuration"],
	props: {
		displayThemeType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	computed: {
		myComponent() {
			console.debug(`loading display theme: ${this.displayThemeType}`);
			return defineAsyncComponent({
				loader: () =>
					import(`./${this.displayThemeType}/displayTheme.vue`),
				errorComponent: OpenwbDisplayThemeFallback,
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
