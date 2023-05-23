<template>
	<div class="device-batterx">
		<openwb-base-heading>
			Einstellungen für Solarwatt/My Reserve
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
		<openwb-base-select-input
			title="Abrufmethode"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'Gateway' },
				{ value: 1, text: 'Energy Manager' },
			]"
			:model-value="configuration.energy_manager"
			@update:model-value="
				updateConfiguration($event, 'configuration.energy_manager')
			"
		>
			<template #help>
				Wenn beide Abrufmethoden verwendet werden sollen, muss für jede Methode ein Gerät erstellt werden.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSolarwatt",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
