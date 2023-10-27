<template>
	<div class="electricity-tariff-tibber">
		<openwb-base-heading>
			Einstellungen für Tibber
			<span class="small">(Modul: {{ $options.name }})</span>
		</openwb-base-heading>
		<openwb-base-alert subtype="info">
			Ihren persönlichen Tibber-Token erhalten Sie über die
			<a
				href="https://developer.tibber.com/explorer"
				target="_blank"
				rel="noopener noreferrer"
			>
				Tibber-Developer-Seite
			</a>
			. Behandeln Sie Ihren Token wie ein Passwort, da sich darüber auch
			persönliche Daten aus Ihrem Tibber-Account abfragen lassen! Die
			Home-ID können Sie (wenn bekannt) in das Eingabefeld selbst
			eintragen oder nach Eingabe Ihres Token durch Klick auf den Button
			von der openWB ermitteln lassen. Unerlaubte Zeichen werden aus dem
			Token und der Home-ID automatisch gelöscht.
		</openwb-base-alert>
		<openwb-base-text-input
			title="Token"
			required
			:model-value="configuration.token"
			@update:model-value="
				updateConfiguration($event, 'configuration.token')
			"
		/>
		<openwb-base-text-input
			title="Home-ID"
			:model-value="configuration.home_id"
			@update:model-value="
				updateConfiguration($event, 'configuration.home_id')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "ElectricityTariffTibber",
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
