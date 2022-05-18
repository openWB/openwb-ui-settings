<template>
	<div class="device-http">
		<openwb-base-heading>
			Einstellungen für Http
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Protokoll"
			:options="[
				{ value: 'http', text: 'Unverschlüsselt (http://)' },
				{ value: 'https', text: 'Verschlüsselt (https://)' },
			]"
			:model-value="configuration.protocol"
			@update:model-value="
				updateConfiguration($event, 'configuration.protocol')
			"
		/>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.domain"
			@update:model-value="
				updateConfiguration($event, 'configuration.domain')
			"
		/>
		<openwb-base-number-input
			title="Port"
			:min="1"
			:max="65535"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		>
			<template #help>
				Diese Angabe ist optional. Ist kein Port angegeben, so wird je
				nach Protokoll der Standardport genutzt.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceHttp",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
