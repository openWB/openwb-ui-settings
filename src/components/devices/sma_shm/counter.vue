<template>
	<div class="device-smahm-counter">
		<openwb-base-heading>
			Einstellungen für SMA-HM/EM Zähler
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Seriennummer"
			:model-value="configuration.serials"
			@update:model-value="
				updateConfiguration($event, 'configuration.serials')
			"
		>
			<template #help>
				Eine Serienummer ist nur erforderlich, wenn mehrere SMA
				HomeManager in Betrieb sind.<br />
				Funktioniert auch mit Energy Meter statt Home Manager.
			</template>
		</openwb-base-number-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSmahmCounter",
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
