<template>
	<component
		v-if="componentTemplateFound"
		:is="myComponent"
		:configuration="configuration"
		:deviceId="deviceId"
		:componentId="componentId"
		@update:configuration="updateConfiguration($event)"
	/>
	<div v-else>
		<openwb-base-alert subtype="warning">
			Es wurde keine Konfigurationsseite für den
			<span v-if="componentType">
				Komponententyp "{{ componentType }}"
			</span>
			<span v-else>Gerätetyp "{{ deviceType }}"</span>
			gefunden. Die Einstellungen können als JSON direkt bearbeitet
			werden.
		</openwb-base-alert>
		<openwb-base-textarea
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
		</openwb-base-textarea>
		<openwb-base-alert subtype="info">
			<pre>{{ JSON.stringify(configuration, undefined, 2) }}</pre>
		</openwb-base-alert>
	</div>
</template>

<script>
import { defineAsyncComponent } from "@vue/runtime-core";

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
			componentTemplateFound: true,
		};
	},
	computed: {
		myComponent() {
			console.debug(
				`loading component: ${this.deviceType} / ${this.componentType}`
			);
			return defineAsyncComponent(() =>
				import(
					`@/components/devices/${this.deviceType}${
						this.componentType
							? `/${this.componentType}`
							: "/device"
					}.vue`
				)
					.then((value) => {
						this.componentTemplateFound = true;
						return value;
					})
					.catch((error) => {
						console.warn("component template not found", error);
						this.componentTemplateFound = false;
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
