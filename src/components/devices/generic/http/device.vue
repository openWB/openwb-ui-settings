<template>
	<div class="device-http">
		<openwb-base-heading>
			Einstellungen für Http
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-text-input
			title="Server-URL"
			subtype="url"
			required
			:model-value="configuration.url"
			@update:model-value="
				updateConfiguration($event, 'configuration.url')
			"
		>
			<template #help>
				Hier sind die Verbindungsangaben für den Http-Server
				einzutragen. Der Pfad für die einzelnen Daten wird in der
				Komponente hinterlegt.<br />
				Beispiel: http://mein.server:8080
			</template>
		</openwb-base-text-input>
	</div>
</template>

<script>
export default {
	name: "DeviceHttp",
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
