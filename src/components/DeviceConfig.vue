<template>
	<component
		v-if="componentValid"
		:is="deviceType"
		:configuration="configuration"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<alert subtype="danger">
			Es wurde keine Konfigurationsseite für den Gerätetyp "{{
				deviceType
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
import devices from "@/components/devices";
import Alert from "@/components/Alert.vue";
import TextInput from "@/components/TextInput.vue";
import TextareaInput from "@/components/TextareaInput.vue";

export default {
	name: "DeviceConfig",
	components: {
		Alert,
		TextInput,
		TextareaInput,
		...devices,
	},
	emits: ["update:configuration"],
	props: {
		deviceType: { type: String, required: true },
		configuration: { type: Object, required: true },
	},
	computed: {
		componentValid() {
			return this.$.components[this.deviceType] !== undefined;
		},
	},
	methods: {
		updateConfiguration(event) {
			this.$emit("update:configuration", event);
		},
	},
};
</script>
