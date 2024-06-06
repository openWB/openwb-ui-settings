<template>
	<div class="electricity-tariff-rabot">
		<openwb-base-alert subtype="info">
			Ihren persönlichen Rabot-Token erhalten Sie über die
			<a
				href="https://www.rabot-charge.de"
				target="_blank"
				rel="noopener noreferrer"
			>
				Rabot-Seite
			</a>
			. Behandeln Sie Ihren Token wie ein Passwort, da sich darüber auch
			persönliche Daten aus Ihrem Rabot-Account abfragen lassen!
		</openwb-base-alert>
		<openwb-base-text-input
			title="Token"
			required
			ref="tokenInput"
			:model-value="electricityTariff.configuration.token"
			@update:model-value="
				updateConfiguration($event, 'configuration.token')
			"
		/>
	</div>
</template>

<script>
export default {
	name: "ElectricityTariffRabot",
	emits: ["update:configuration"],
	props: {
		electricityTariff: { type: Object, required: true },
	},
	data() {
		return {
			RabotAPI: "https://test-api.rabot-charge.de/hems/v1/",
		};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
