<template>
	<div class="electricity-tariff-energycharts">
		<openwb-base-select-input
			title="Land"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'de', text: 'Deutschland' },
				{ value: 'at', text: 'Österreich' },
				{ value: 'be', text: 'Belgien' },
				{ value: 'bg', text: 'Bulgarien' },
				{ value: 'ch', text: 'Schweiz' },
				{ value: 'cz', text: 'Tschechische Republik' },
				{ value: 'dk1', text: 'Dänemark 1' },
				{ value: 'dk2', text: 'Dänemark 2' },
				{ value: 'ee', text: 'Estland' },
				{ value: 'es', text: 'Spanien' },
				{ value: 'fi', text: 'Finnland' },
				{ value: 'fr', text: 'Frankreich' },
				{ value: 'gr', text: 'Griechenland' },
				{ value: 'hr', text: 'Kroatien' },
				{ value: 'hu', text: 'Ungarn' },
				{ value: 'itCAL', text: 'Italien Kalabrien' },
				{ value: 'itCN', text: 'Italien Zentrum Nord' },
				{ value: 'itCS', text: 'Italien Zentrum Süd' },
				{ value: 'itN', text: 'Italien Nord' },
				{ value: 'itSAC', text: 'Italien Sardinien Korsika AC' },
				{ value: 'itSDC', text: 'Italien Sardinien Korsika DC' },
				{ value: 'itSA', text: 'Italien Sardinien' },
				{ value: 'itSI', text: 'Italien Sizilien' },
				{ value: 'itS', text: 'Italien Süden' },
				{ value: 'lt', text: 'Litauen' },
				{ value: 'lv', text: 'Lettland' },
				{ value: 'me', text: 'Montenegro' },
				{ value: 'nl', text: 'Niederlande' },
				{ value: 'no1', text: 'Norwegen 1' },
				{ value: 'no2', text: 'Norwegen 2' },
				{ value: 'no2NSL', text: 'Norwegen Nordsee-Verbindung' },
				{ value: 'no3', text: 'Norwegen 3' },
				{ value: 'no4', text: 'Norwegen 4' },
				{ value: 'no5', text: 'Norwegen 5' },
				{ value: 'pl', text: 'Polen' },
				{ value: 'pt', text: 'Portugal' },
				{ value: 'ro', text: 'Rumänien' },
				{ value: 'rs', text: 'Serbien' },
				{ value: 'se1', text: 'Schweden 1' },
				{ value: 'se2', text: 'Schweden 2' },
				{ value: 'se3', text: 'Schweden 3' },
				{ value: 'se4', text: 'Schweden 4' },
				{ value: 'si', text: 'Slovenien' },
				{ value: 'sk', text: 'Slowakei' },

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
						:model-value="
							$store.state.mqtt['openWB/general/prices/servePrice'] *
							100000
						"
						@update:model-value="
							updateState(
								'openWB/general/prices/servePrice',
								parseFloat(($event / 100000).toFixed(7)),
							);
							updateConfiguration(parseFloat(($event).toFixed(7)), 'configuration.servePrice')
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
	mixins: [ComponentState],
	emits: ["update:configuration"],
	props: {
		electricityTariff: { type: Object, required: true },
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
