<template>
	<div class="device-solax">
		<openwb-base-heading>
			Einstellungen für Solax
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.ip_address"
			@update:model-value="
				updateConfiguration($event, 'configuration.ip_address')
			"
		/>
		<openwb-base-number-input
			title="Port"
			:min="1"
			:max="65535"
			:placeholder="502"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		>
			<template #help>
				Standardmäßig ist der Port 502. Dieser sollte nur geändert
				werden, wenn der Solax Wechselrichter auf einen anderen Port
				konfiguriert wurde.
			</template>
		</openwb-base-number-input>
		<openwb-base-number-input
			title="Modbus-ID"
			required
			:min="0"
			:max="255"
			:model-value="configuration.modbus_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		>
			<template #help>
				Laut der Schnittstellenbeschreibung ist die ID bei Solax ab Werk
				auf 1 gesetzt. Entgegen der Beschreibung ist meist für Gen4 eine
				ID größer als 2 eingestellt. Bei Gen3 sogar (gegen jeglicher
				Modbus Standards) eine 0.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSolax",
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
