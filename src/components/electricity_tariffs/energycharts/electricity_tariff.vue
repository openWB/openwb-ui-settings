<template>
	<div class="electricity-tariff-energycharts">
		<openwb-base-select-input
			title="Land"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'DE-LU', text: 'Deutschland' },
				{ value: 'AT', text: 'Österreich' },
				{ value: 'CH', text: 'Schweiz' },
			]"
			:model-value="electricityTariff.configuration.country"
			@update:model-value="
				updateConfiguration($event, 'configuration.country')
			"
		>
			<template #help>
				Börsenstrompreise von Energy Charts (energy-charts.info) 
				Die Rohdaten werden von Wissenschaftlern des Fraunhofer-Institut 
				für Solare Energiesysteme ISE aus zahlreichen Quellen stündlich 
				oder täglich abgerufen und für die Darstellung aufbereitet.
 			</template>
		</openwb-base-select-input>
		<openwb-base-number-input
						title="Aufschlag zum Börsenstrompreis"
						:min=0
						:step="0.001"
						:precision="3"
						unit="ct/kWh"
						:model-value="electricityTariff.configuration.serve_price"
						@update:model-value="
							updateConfiguration(parseFloat(($event).toFixed(7)), 'configuration.serve_price')
						"
					>
						<template #help>
							Die Auswahl (Energy-Charts) kann für alle Stromanbieter ausgewählt werden,
							die die Börsenstrompreise in einem variablen/dynamischen Tarif an die Kunden
							weitergeben. Das Modul soll es ermöglichen, dass zu tagesaktuellen Strompreisen
							unter Berücksichtigung eines Aufschlags zu günstigen Zeiten automatisch geladen
							werden kann und somit die Preisschwankungen an der Börse optimal ausgenutzt werden.

						</template>
					</openwb-base-number-input>
	</div>
</template>

<script>
import ComponentState from "/src/components/mixins/ComponentState.vue";
export default {
	name: "ElectricityTariffEnergyCharts",
	mixins: [],
	emits: ["update:configuration"],
	props: {
		electricityTariff: { type: Object, required: true },
	},
	data() {
		return {
		};
	},
	methods: {
		updateConfiguration(event, path = undefined) {
			this.$emit("update:configuration", { value: event, object: path });
		},
	},
};
</script>
