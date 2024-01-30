<template>
	<div class="device-solarwatt">
		<openwb-base-heading>
			Einstellungen für Solarwatt/My Reserve
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="component.configuration.ip_address"
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
			:model-value="component.configuration.energy_manager"
			@update:model-value="
				updateConfiguration($event, 'configuration.energy_manager')
			"
		>
			<template #help>
				Wenn beide Abrufmethoden verwendet werden sollen, muss für jede
				Methode ein Gerät erstellt werden.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
import DeviceConfigMixin from "../deviceConfigMixin.vue";

export default {
	name: "DeviceSolarwatt",
	mixins: [DeviceConfigMixin],
};
</script>
