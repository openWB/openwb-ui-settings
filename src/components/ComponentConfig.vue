<template>
	<component
		v-if="deviceComponentTemplateFound"
		:is="myDeviceComponent"
		:configuration="configuration"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<alert subtype="warning">
			Es wurde keine Konfigurationsseite für den Komponententyp "{{
				componentType
			}}" gefunden. Die Einstellungen können als JSON direkt bearbeitet
			werden.
		</alert>
		<textarea-input
			title="Konfiguration"
			subtype="json"
			:model-value="configuration"
			@update:model-value="
				updateConfiguration({ value: $event, object: 'configuration' })
			"
		>
			<template #help>
				Bitte prüfen Sie, ob die Eingaben richtig interpretiert werden.
			</template>
		</textarea-input>
		<alert subtype="info">
			<pre>{{ JSON.stringify(configuration, undefined, 2) }}</pre>
		</alert>
	</div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import TextareaInput from "@/components/TextareaInput.vue";
import { defineAsyncComponent } from "@vue/runtime-core";

export default {
	name: "ComponentConfig",
	components: {
		Alert,
		TextareaInput,
	},
	emits: ["update:configuration"],
	props: {
		deviceType: { type: String, required: true },
		componentType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	data() {
		return {
			deviceComponentTemplateFound: true,
		};
	},
	computed: {
		myDeviceComponent() {
			console.log(
				`loading device component: ${this.deviceType} / ${this.componentType}`
			);
			return defineAsyncComponent(() =>
				import(
					`@/components/devices/${this.deviceType}/${this.componentType}.vue`
				).catch((error) => {
					console.log("ERROR:", error);
					this.deviceComponentTemplateFound = false;
				})
			);
		},
		deviceComponentLoaded() {
			console.log(this);
			return this.$.components["test"] !== undefined;
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
