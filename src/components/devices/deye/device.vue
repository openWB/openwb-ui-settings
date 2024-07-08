<template>
	<div class="device-batterx">
		<openwb-base-heading>
			Einstellungen für Deye
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
			required
			:min="1"
			:max="65535"
			:model-value="configuration.port"
			@update:model-value="
				updateConfiguration($event, 'configuration.port')
			"
		/>
		<openwb-base-select-input
			title="Bauform"
			notSelected="Bitte auswählen"
			:options="[
				{
					value: 'three_phase',
					text: 'dreiphasiger Wechselrichter',
				},
				{
					value: 'single_phase_string',
					text: 'einphasiger String-Wechselrichter (ungetestet, Rückmeldung über Support erwünscht)',
				},
				{
					value: 'single_phase_hybrid',
					text: 'einphasiger Hybrid-Wechselrichter (ungetestet, Rückmeldung über Support erwünscht)',
				},
			]"
			:model-value="configuration.device_type"
			@update:model-value="
				updateConfiguration($event, 'configuration.device_type')
			"
		/>
		<openwb-base-select-input
			title="Faktor"
			v-if="configuration.device_type == 'three_phase'"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 1, text: 'Keine Anpassung' },
				{ value: 10, text: 'Multiplikation mit 10' },
			]"
			:model-value="configuration.factor"
			@update:model-value="
				updateConfiguration($event, 'configuration.factor')
			"
		>
			<template #help>
				Die Speicher- und PV-Leistung unterscheidet sich je nach Deye/Jinko Wechselrichter 
				um den Faktor 10.
				Welche Wechselrichter betroffen sind ist nicht abschließend geklärt. 
				(Hochvolt/ Niedervolt Modelle?)
				Bei der Nutzung eines dreiphasigen Deye würden wir uns über eine kurze 
				Rückmeldung (Modell/ Faktor) an den Support freuen.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "DeviceDeye",
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
