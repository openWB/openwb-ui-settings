<template>
	<div class="device-huawei">
		<openwb-base-heading>
			Einstellungen für Huawei
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
			title="Modbus ID"
			:model-value="configuration.modbus_id"
			min="1"
			max="255"
			@update:model-value="
				updateConfiguration($event, 'configuration.modbus_id')
			"
		>
			<template #help>
				Sind mehrere Huawei Wechselrichter als "Schwarm" verbunden, dann
				besitzt der Master vermutlich die ID "16". Über diese ID werden
				dann alle Daten in Summe zur Verfügung gestellt.<br />
				Die IDs 1 bis 15 sind für einzelne Wechselrichter reserviert.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceHuawei",
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
