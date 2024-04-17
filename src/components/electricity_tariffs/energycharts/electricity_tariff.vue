<template>
	<div class="electricity-tariff-energycharts">
		<openwb-base-select-input
			title="Land"
			notSelected="Bitte auswählen"
			:options="[
				{ value: 'DE-LU', text: 'Deutschland' },
				{ value: 'AT', text: 'Österreich' },
				{ value: 'BE', text: 'Belgien' },
				{ value: 'CH', text: 'Schweiz' },
				{ value: 'CZ', text: 'Tschechische Republik' },
				{ value: 'DK1', text: 'Dänemark 1' },
				{ value: 'DK2', text: 'Dänemark 2' },
				{ value: 'EE', text: 'Estland' },
				{ value: 'ES', text: 'Spanien' },
				{ value: 'FI', text: 'Finnland' },
				{ value: 'FR', text: 'Frankreich' },
				{ value: 'GR', text: 'Griechenland' },
				{ value: 'HR', text: 'Kroatien' },
				{ value: 'IT-Calabria', text: 'Italien Kalabrien' },
				{ value: 'IT-Centre-North', text: 'Italien Zentrum Nord' },
				{ value: 'IT-Centre-South', text: 'Italien Zentrum Süd' },
				{ value: 'IT-North', text: 'Italien Nord' },
				{ value: 'IT-SACOAC', text: 'Italien Sardinien Korsika AC' },
				{ value: 'IT-SACODC', text: 'Italien Sardinien Korsika DC' },
				{ value: 'IT-Sardinia', text: 'Italien Sardinien' },
				{ value: 'IT-Sicily', text: 'Italien Sizilien' },
				{ value: 'IT-South', text: 'Italien Süden' },
				{ value: 'LT', text: 'Litauen' },
				{ value: 'LV', text: 'Lettland' },
				{ value: 'ME', text: 'Montenegro' },
				{ value: 'NL', text: 'Niederlande' },
				{ value: 'NO1', text: 'Norwegen 1' },
				{ value: 'NO2', text: 'Norwegen 2' },
				{ value: 'NO2NSL', text: 'Norwegen Nordsee-Verbindung' },
				{ value: 'NO3', text: 'Norwegen 3' },
				{ value: 'NO4', text: 'Norwegen 4' },
				{ value: 'NO5', text: 'Norwegen 5' },
				{ value: 'PL', text: 'Polen' },
				{ value: 'PT', text: 'Portugal' },
				{ value: 'RO', text: 'Rumänien' },
				{ value: 'RS', text: 'Serbien' },
				{ value: 'SE1', text: 'Schweden 1' },
				{ value: 'SE2', text: 'Schweden 2' },
				{ value: 'SE3', text: 'Schweden 3' },
				{ value: 'SE4', text: 'Schweden 4' },
				{ value: 'SI', text: 'Slovenien' },
				{ value: 'SK', text: 'Slowakei' },

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
						title="Grundpreis - variabler Tarif mit Börsenpreisbindung"
						:min=0
						:step="0.01"
						:precision="2"
						unit="€/Monat"
						:model-value="
							$store.state.mqtt['openWB/general/prices/basicprice'] *
							10000
						"
						@update:model-value="
							updateState(
								'openWB/general/prices/basicprice',
								parseFloat(($event / 10000).toFixed(7)),
							)
						"
					>
						<template #help>
							Die Auswahl (Energy-Charts) kann für alle Stromanbieter ausgewählt werden,
							die die Börsenstrompreise in einem variablen/dynamischen Tarif an die Kunden
							weitergeben und dafür einen festen Grundpreis pro Monat an Gebühr erheben.
						</template>
					</openwb-base-number-input>
	</div>
</template>

<script>
import ComponentState from "/opt/openWB-dev/openwb-ui-settings/src/components/mixins/ComponentState.vue";
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
