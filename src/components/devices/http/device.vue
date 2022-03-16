<template>
	<div class="device-http">
		<openwb-base-heading>
			Einstellungen für Http
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.domain"
			@update:model-value="
				updateConfiguration($event, 'configuration.domain')
			"
		>
			<template #help>
				An die IP bzw. den Hostnamen kann optional ein Port angehängt
				werden. Beispiel: "192.168.1.1:8080". Ist kein Port angegeben,
				so wird je nach Protokoll 80 (http) bzw. 443 (https) genutzt.
			</template>
		</openwb-base-text-input>
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
