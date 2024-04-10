<template>
	<div class="device-virtual-counter">
		<openwb-base-heading>
			Einstellungen für virtuelle Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Zusätzlicher Verbrauch"
			:min="0"
			:step="0.05"
			unit="kW"
			required
			:model-value="configuration.external_consumption / 1000"
			@update:model-value="
				updateConfiguration(
					$event * 1000,
					'configuration.external_consumption',
				)
			"
		>
			<template #help>
				Die hier angegebene Leistung wird pauschal zu dem Leistungen der
				hinter dem Zähler liegenden Komponenten addiert. Damit lässt
				sich z. B. eine Reserve für nicht erfasste Verbraucher
				einstellen.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceVirtualCounter",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		deviceId: { default: undefined },
		componentId: { required: true },
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
