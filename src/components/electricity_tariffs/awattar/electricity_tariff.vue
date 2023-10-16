<template>
	<div class="electricity-tariff-awattar">
		<openwb-base-heading>
			Einstellungen für aWATTar Hourly
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-select-input
			title="Land"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'de', text: 'Deutschland' },
				{ value: 'at', text: 'Österreich' },
			]"
			:model-value="configuration.country"
			@update:model-value="
				updateConfiguration($event, 'configuration.country')
			"
		>
			<template #help>
				Es werden die abgefragten Börsenpreise verwendet, die aWATTar
				bereitstellt. aWATTar-Gebühren oder Steuern werden nicht
				berücksichtigt.
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "ElectricityTariffAwattar",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
	},
	data() {
		return {};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
