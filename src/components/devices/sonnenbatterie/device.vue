<template>
	<div class="device-sonnenbatterie">
		<openwb-base-heading>
			Einstellungen für SonnenBatterie
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
			title="Datenverbindung"
			required
			notSelected="Bitte auswählen"
			:options="[
				{ value: 0, text: 'Rest-API 1 (z.B. ECO 4)' },
				{ value: 2, text: 'Rest-API 2 (z.B. ECO 6)' },
				{ value: 1, text: 'JSON-API (z.B. ECO 8 oder 10)' },
			]"
			:model-value="configuration.variant"
			@update:model-value="
				updateConfiguration($event, 'configuration.variant')
			"
		>
			<template #help>
				<span style="display: block">
					Je nach Sonnen Batterie muss die richtige Datenverbindung
					ausgewählt werden. Folgende URLs werden zum Abruf der Daten
					genutzt und können auch manuell über einen Browser abgefragt
					werden, um die richtige Einstellung zu finden:<br />
					Rest-API 1:
					<a
						:href="linkRestApi1"
						target="_blank"
						rel="noopener noreferrer"
						>{{ linkRestApi1 }}</a
					><br />
					Rest-API 2:
					<a
						:href="linkRestApi2"
						target="_blank"
						rel="noopener noreferrer"
						>{{ linkRestApi2 }}</a
					><br />
					JSON-API:
					<a
						:href="linkJsonApi"
						target="_blank"
						rel="noopener noreferrer"
						>{{ linkJsonApi }}
					</a>
				</span>
			</template>
		</openwb-base-select-input>
	</div>
</template>

<script>
export default {
	name: "DeviceSonnenbatterie",
	emits: ["update:configuration"],
	props: {
		configuration: { type: Object, required: true },
		componentId: { required: true },
	},
	computed: {
		linkRestApi1() {
			return (
				"http://" +
				this.configuration.ip_address +
				":7979/rest/devices/battery"
			);
		},
		linkRestApi2() {
			return (
				"http://" +
				this.configuration.ip_address +
				":7979/rest/devices/battery/M05"
			);
		},
		linkJsonApi() {
			return "http://" + this.configuration.ip_address + "/api/v1/status";
		},
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
