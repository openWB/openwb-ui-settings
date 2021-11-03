<template>
	<component
		v-if="componentTemplateFound"
		:is="myComponent"
		:configuration="configuration"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<alert subtype="warning">
			Es wurde keine Konfigurationsseite für den
			<span v-if="componentType">
				Komponententyp "{{ componentType }}"
			</span>
			<span v-else>Gerätetyp "{{ deviceType }}"</span>
			gefunden. Die Einstellungen können als JSON direkt bearbeitet
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
	name: "ConfigProxy",
	components: {
		Alert,
		TextareaInput,
	},
	emits: ["update:configuration"],
	props: {
		deviceType: { type: String, required: true },
		componentType: { type: String, required: false, default: undefined },
		configuration: { type: Object, required: true },
	},
	data() {
		return {
			componentTemplateFound: true,
		};
	},
	computed: {
		myComponent() {
			console.log(
				`loading component: ${this.deviceType} / ${this.componentType}`
			);
			if (this.componentType !== undefined) {
				return defineAsyncComponent(() =>
					import(
						`@/components/devices/${this.deviceType}/${this.componentType}.vue`
					).catch((error) => {
						console.log("ERROR:", error);
						this.componentTemplateFound = false;
					})
				);
			} else {
				return defineAsyncComponent(() =>
					import(`@/components/devices/${this.deviceType}.vue`).catch(
						(error) => {
							console.log("ERROR:", error);
							this.componentTemplateFound = false;
						}
					)
				);
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
