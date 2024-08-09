<template>
	<div class="device-fems-bat">
		<openwb-base-heading>
			Einstellungen für openEMS, Fenecon FEMS, CENTURIO 10, Kaco
			Hy-Control Batteriespeicher
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-number-input
			title="Anzahl der verbauten Speicher"
			required
			:min="1"
			:max="2"
			:model-value="configuration.num"
			@update:model-value="
				updateConfiguration($event, 'configuration.num')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceFemsBat",
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
