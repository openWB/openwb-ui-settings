<template>
	<div class="device-kostal-piko-old">
		<openwb-base-heading>
			Einstellungen für Kostal Piko (alte Generation)
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="URL"
			subtype="url"
			required
			:model-value="configuration.url"
			@update:model-value="
				updateConfiguration($event, 'configuration.url')
			"
		>
			<template #help>
				Es wird eine komplette URL inklusive Protokoll erwartet.
				Normalerweise ist der Wechselrichter über "http://IP" zu
				erreichen.
			</template>
		</openwb-base-text-input>
		<openwb-base-text-input
			title="Benutzername"
			subtype="user"
			required
			:model-value="configuration.user"
			@update:model-value="
				updateConfiguration($event, 'configuration.user')
			"
		/>
		<openwb-base-text-input
			title="Passwort"
			subtype="password"
			required
			:model-value="configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "DeviceKostalPikoOld",
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
