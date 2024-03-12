<template>
	<div class="device-enphase">
		<openwb-base-heading>
			Einstellungen für Enphase Envoy / IQ Gateway
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="IP oder Hostname"
			subtype="host"
			required
			:model-value="configuration.hostname"
			@update:model-value="
				updateConfiguration($event, 'configuration.hostname')
			"
		/>
		<openwb-base-select-input
			title="Version"
			required
			:options="[
				{ value: 1, text: 'Firmware < 7.0' },
				{ value: 2, text: 'Firmware ab 7.0' },
			]"
			:model-value="configuration.version"
			@update:model-value="
				updateConfiguration($event, 'configuration.version')
			"
		/>
		<openwb-base-text-input
			v-if="configuration.version > 1"
			title="Benutzer"
			subtype="user"
			:model-value="configuration.user"
			@update:model-value="
				updateConfiguration($event, 'configuration.user')
			"
		/>
		<openwb-base-text-input
			v-if="configuration.version > 1"
			title="Kennwort"
			subtype="password"
			:model-value="configuration.password"
			@update:model-value="
				updateConfiguration($event, 'configuration.password')
			"
		/>
		<openwb-base-text-input
			v-if="configuration.version > 1"
			title="Token"
			subtype="password"
			:model-value="configuration.token"
			@update:model-value="
				updateConfiguration($event, 'configuration.token')
			"
		>
			<template #help>
				Wenn Benutzer und Kennwort angegeben werden, wird das Token
				automatisch beim Speichern abgerufen. Ebenfalls wird ein
				abgelaufenes Token (derzeit nach einem Jahr) automatisch
				erneuert.<br />
				Wenn Sie ein Token manuell erstellen möchten, können Sie dies
				auf der <a
					href="https://developer.enphase.com/docs/quickstart.html"
					target="_blank"
					rel="noopener"
				>Enphase-Webseite</a> erledigen.
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceEnphase",
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
