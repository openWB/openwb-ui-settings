<template>
	<component
		v-if="displayThemeFound"
		:is="myComponent"
		:configuration="configuration"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<openwb-base-alert subtype="warning">
			Es wurde keine Konfigurationsseite für das Display Theme "{{
				displayThemeType
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
					object: 'configuration',
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
	name: "OpenwbDisplayThemeProxy",
	emits: ["update:configuration"],
	props: {
		displayThemeType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	data() {
		return {
			displayThemeFound: true,
		};
	},
	computed: {
		myComponent() {
			console.debug(`loading display theme: ${this.displayThemeType}`);
			return defineAsyncComponent(() =>
				import(
					`@/components/display_themes/${this.displayThemeType}/displayTheme.vue`
				)
					.then((value) => {
						this.displayThemeFound = true;
						return value;
					})
					.catch((error) => {
						console.warn("display theme not found", error);
						this.displayThemeFound = false;
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
