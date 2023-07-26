<template>
	<div class="chart">
		<form name="chartForm">
			<openwb-base-card
				title="Filter"
				:collapsible="true"
				:collapsed="false"
			>
				<openwb-base-select-input
					title="Zeitraum"
					v-model="chartRange"
					:options="[{value:'day', text:'Tag'},{value:'month', text:'Monat'},{value:'year', text:'Jahr'}]"
				/>
				<openwb-base-text-input
					:title="dateInput.title"
					:subtype="dateInput.type"
					:min="dateInput.min"
					:max="currentDate"
					:showQuickButtons="true"
					v-model="chartDate"
					@update:model-value="updateChart()"
				/>
			</openwb-base-card>
			<openwb-base-alert v-if="!chartDataRead" subtype="info">
				Es wurden noch keine Daten abgerufen.
			</openwb-base-alert>
			<div v-else>
				<openwb-base-alert v-if="!chartDataHasEntries" subtype="info">
					Es konnten keine Daten für diesen Zeitraum gefunden werden.
				</openwb-base-alert>
				<div v-else>
					<openwb-base-card
						title="Diagramm"
						:collapsible="true"
						:collapsed="false"
					>
						<div class="openwb-chart">
							<chartjs-line
								:data="chartData"
								:options="chartOptions"
							/>
						</div>
					</openwb-base-card>
					<openwb-base-card
						title="Summen"
						:collapsible="true"
						:collapsed="true"
					>
						<openwb-base-card
							v-for="(group, groupKey) in chartTotals"
							:key="groupKey"
							:collapsible="true"
							:collapsed="true"
							:subtype="getCardSubtype(groupKey)"
						>
							<template #header>
								<font-awesome-icon
									fixed-width
									:icon="getCardIcon(groupKey)"
								/>
								{{ getTotalsLabel(groupKey) }}
							</template>
							<div
								v-for="(component, componentKey) in group"
								:key="componentKey"
							>
								<openwb-base-heading>{{
									getTotalsLabel(groupKey, componentKey)
								}}</openwb-base-heading>
								<div
									v-for="(
										measurement, measurementKey
									) in component"
									:key="measurementKey"
								>
									<openwb-base-text-input
										:title="
											getTotalsLabel(
												groupKey,
												componentKey,
												measurementKey
											)
										"
										readonly
										class="text-right"
										unit="kWh"
										:model-value="
											formatNumber(measurement / 1000, 3)
										"
									/>
								</div>
							</div>
						</openwb-base-card>
					</openwb-base-card>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faChargingStation as fasChargingStation,
	faCarBattery as fasCarBattery,
	faSolarPanel as fasSolarPanel,
	faGaugeHigh as fasGaugeHigh,
	faHouseSignal as fasHouseSignal,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	fasChargingStation,
	fasCarBattery,
	fasSolarPanel,
	fasGaugeHigh,
	fasHouseSignal
);

import ComponentState from "../components/mixins/ComponentState.vue";

import { Line as ChartjsLine } from "vue-chartjs";
import "chartjs-adapter-luxon";
import "hammerjs";
import ZoomPlugin from "chartjs-plugin-zoom";
import {
	Chart,
	Tooltip,
	Legend,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Filler,
} from "chart.js";
Chart.register(
	Tooltip,
	Legend,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Filler,
	ZoomPlugin
);

export default {
	name: "OpenwbChart",
	components: { ChartjsLine, FontAwesomeIcon },
	mixins: [ComponentState],
	emits: ["sendCommand"],
	props: {
		initialChartRange: {
			type: String,
			required: false,
			validator: function (value) {
				return (
					[
						"day",
						"month",
						"year",
					].indexOf(value) !== -1
				);
			},
			default: "day",
		},
		initialDate: {
			type: String,
			required: false,
			validator: function (value) {
				return value.match(/^(([0-9]{4})(-[0-9]{2}(-[0-9]{2})?)?)?$/g);
			},
			default: "",
		},
	},
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/log/daily/#",
				"openWB/log/monthly/#",
				"openWB/log/yearly/#",
				"openWB/system/device/+/component/+/config",
				"openWB/chargepoint/+/config",
				"openWB/vehicle/+/name",
			],
			currentDate: "",
			chartRange: "day",
			chartRequestDate: {
				day: "",
				month: "",
				year: "",
			},
			datasetTemplates: {
				"counter-power": {
					label: "Zähler",
					unit: "kW",
					jsonKey: null,
					borderColor: "rgba(255, 0, 0, 0.7)",
					backgroundColor: "rgba(255, 10, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"counter-energyImport": {
					label: "Zähler",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(255, 0, 0, 0.7)",
					backgroundColor: "rgba(255, 10, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"counter-energyExport": {
					label: "Zähler",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(0, 255, 105, 0.7)",
					backgroundColor: "rgba(0, 255, 255, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"pv-power": {
					label: "PV",
					unit: "kW",
					jsonKey: null,
					borderColor: "rgba(40, 167, 69, 0.7)",
					backgroundColor: "rgba(10, 255, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					// stack: "inverter",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"pv-energyExport": {
					label: "PV",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(40, 167, 69, 0.7)",
					backgroundColor: "rgba(10, 255, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					// stack: "inverter",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"bat-power": {
					label: "Speicher",
					unit: "kW",
					jsonKey: null,
					borderColor: "rgba(253, 126, 20, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					// stack: "battery",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"bat-energyImport": {
					label: "Speicher",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(253, 126, 20, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					// stack: "battery",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"bat-energyExport": {
					label: "Speicher",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(253, 126, 20, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					// stack: "battery",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"bat-soc": {
					label: "Speicher SoC",
					unit: "%",
					jsonKey: null,
					borderColor: "rgba(253, 126, 20, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					borderDash: [10, 5],
					hidden: false,
					fill: false,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					borderWidth: 2,
					data: null,
					yAxisID: "y3",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"cp-power": {
					label: "Ladepunkt",
					unit: "kW",
					jsonKey: null,
					borderColor: "rgba(0, 0, 255, 0.7)",
					backgroundColor: "rgba(0, 0, 255, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: true,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					// stack: "charge-point",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"cp-energyImport": {
					label: "Ladepunkt",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(0, 0, 255, 0.7)",
					backgroundColor: "rgba(0, 0, 255, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					// stack: "charge-point",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"ev-soc": {
					label: "Fahrzeug SoC",
					unit: "%",
					jsonKey: null,
					borderColor: "rgba(0, 0, 255, 0.7)",
					backgroundColor: "rgba(0, 0, 255, 0.3)",
					borderDash: [10, 5],
					hidden: true,
					fill: false,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					borderWidth: 2,
					data: null,
					yAxisID: "y3",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"sh-power": {
					label: "SmartHome",
					unit: "kW",
					jsonKey: null,
					borderColor: "rgba(232, 62, 140, 0.7)",
					backgroundColor: "rgba(232, 72, 150, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"sh-energyImport": {
					label: "SmartHome",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(232, 62, 140, 0.7)",
					backgroundColor: "rgba(232, 72, 150, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"sh-energyExport": {
					label: "SmartHome",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(232, 62, 140, 0.7)",
					backgroundColor: "rgba(232, 72, 150, 0.3)",
					fill: true,
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y2",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
			},
			chartOptions: {
				plugins: {
					title: {
						display: false,
					},
					tooltip: {
						enabled: true,
						callbacks: {
							label: (item) =>
								`${item.dataset.label}: ${item.formattedValue} ${item.dataset.unit}`,
						},
					},
					legend: {
						display: true,
					},
					zoom: {
						// Container for pan options
						pan: {
							// Boolean to enable panning
							enabled: true,
							// Panning directions. Remove the appropriate direction to disable
							// Eg. 'y' would only allow panning in the y direction
							mode: "x",
							threshold: 5,
						},
						// Container for zoom options
						zoom: {
							// Boolean to enable zooming
							wheel: {
								enabled: true,
							},
							pinch: {
								enabled: true,
							},
							// Zooming directions. Remove the appropriate direction to disable
							// Eg. 'y' would only allow zooming in the y direction
							mode: "x",
						},
					},
				},
				elements: {
					point: {
						radius: 2,
					},
				},
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: "index",
					intersect: false,
				},
				scales: {
					x: {
						type: "time",
						time: {
							unit: "",
							tooltipFormat: "",
						},
						display: true,
						title: {
							display: true,
							text: "",
						},
						ticks: {
							source: "timestamp",
							font: {
								size: 12,
							},
							// color: tickColor,
							maxTicksLimit: 0,
						},
						grid: {
							// color: xGridColor,
						},
					},
					y: {
						// horizontal line for values displayed on the left side (power, kW)
						position: "left",
						type: "linear",
						display: "auto",
						suggestedMin: 0,
						suggestedMax: 0,
						title: {
							font: {
								size: 12,
							},
							display: true,
							text: "Leistung [kW]",
							// color: fontColor
						},
						grid: {
							// color: gridColor
						},
						ticks: {
							font: {
								size: 12,
							},
							stepSize: 0.2,
							maxTicksLimit: 11,
							// color: tickColor
						},
					},
					y2: {
						// horizontal line for values displayed on the left side (energy, kWh)
						position: "left",
						type: "linear",
						display: "auto",
						suggestedMin: 0,
						suggestedMax: 0,
						title: {
							font: {
								size: 12,
							},
							display: true,
							text: "Energie [kWh]",
							// color: fontColor
						},
						grid: {
							// color: gridColor
						},
						ticks: {
							font: {
								size: 12,
							},
							stepSize: 0.2,
							maxTicksLimit: 11,
							// color: tickColor
						},
					},
					y3: {
						// horizontal line for values displayed on the right side (SoC, %)
						position: "right",
						type: "linear",
						display: "auto",
						suggestedMin: 0,
						suggestedMax: 100,
						title: {
							font: {
								size: 12,
							},
							display: true,
							text: "SoC [%]",
							// color: fontColor
						},
						grid: {
							display: false,
							// color: gridSocColor,
						},
						ticks: {
							font: {
								size: 12,
							},
							stepSize: 10,
							maxTicksLimit: 11,
							// color: tickColor
						},
					},
				},
			},
			chartDatasets: {
				datasets: [],
			},
		};
	},
	computed: {
		dateInput() {
			var dateObject = {
				title: "Datum",
				type: "date",
				min: "2018-01-01",
			};
			switch (this.chartRange) {
				case "month":
					dateObject = {
						title: "Monat",
						type: "month",
						min: "2018-01",
					};
					break;
				case "year":
					dateObject = {
						title: "Jahr",
						type: "year",
						min: "2018",
					};
					break;
			}
			return dateObject;
		},
		chartDate: {
			get() {
				var dateString = this.chartRequestDate.year;
				if (this.chartRange != "year") {
					dateString = dateString + "-" + this.chartRequestDate.month;
				}
				if (this.chartRange == "day") {
					dateString = dateString + "-" + this.chartRequestDate.day;
				}
				return dateString;
			},
			set(newValue) {
				let splitDate = newValue.split("-");
				this.chartRequestDate.year = splitDate[0];
				if (splitDate.length > 1) {
					this.chartRequestDate.month = splitDate[1];
				} else {
					this.chartRequestDate.month = "";
				}
				if (splitDate.length > 2) {
					this.chartRequestDate.day = splitDate[2];
				} else {
					this.chartRequestDate.day = "";
				}
			},
		},
		chartScaleX() {
			var scaleObject = {
				unit: "minute",
				tooltipFormat: "DD T",
				text: "Zeit",
				maxTicksLimit: 24,
			};
			switch (this.chartRange) {
				case "month":
					scaleObject = {
						unit: "day",
						tooltipFormat: "D",
						text: "Tag",
						maxTicksLimit: 31,
					};
					break;
				case "year":
					scaleObject = {
						unit: "month",
						tooltipFormat: "M",
						text: "Monat",
						maxTicksLimit: 12,
					};
					break;
			}
			return scaleObject;
		},
		commandData() {
			var dataObject = {
				date:
					this.chartRequestDate.year +
					this.chartRequestDate.month +
					this.chartRequestDate.day,
				day:
					this.chartRequestDate.year +
					this.chartRequestDate.month +
					this.chartRequestDate.day,
			};
			switch (this.chartRange) {
				case "month":
					dataObject = {
						date:
							this.chartRequestDate.year +
							this.chartRequestDate.month,
						month:
							this.chartRequestDate.year +
							this.chartRequestDate.month,
					};
					break;
				case "year":
					dataObject = {
						date: this.chartRequestDate.year,
						year: this.chartRequestDate.year,
					};
					break;
			}
			return dataObject;
		},
		baseTopic() {
			var topic = "openWB/log/";
			switch (this.chartRange) {
				case "day":
					topic = topic + "daily/";
					break;
				case "month":
					topic = topic + "monthly/";
					break;
				case "year":
					topic = topic + "yearly/";
					break;
			}
			return topic;
		},
		chartDataRead() {
			return this.chartDataObject != undefined;
		},
		chartDataHasEntries() {
			if (this.chartDataObject) {
				return this.chartDataObject.length > 0;
			}
			return false;
		},
		chartTotals() {
			if (
				this.$store.state.mqtt[this.baseTopic + this.commandData.date]
			) {
				if (
					Object.prototype.hasOwnProperty.call(
						this.$store.state.mqtt[
							this.baseTopic + this.commandData.date
						],
						"totals"
					)
				) {
					return this.$store.state.mqtt[
						this.baseTopic + this.commandData.date
					].totals;
				} else {
					// DEPRECATED!
					// code for old log data without totals
					var diff = {
						bat: {},
						counter: {},
						pv: {},
						cp: {},
					};
					const keysToProcess = ["imported", "exported"];

					const process = (startValue, endValue, path) => {
						// console.log("process:", path);
						const keys = path.split(".");
						if (keysToProcess.includes(keys[keys.length - 1])) {
							if (
								!Object.prototype.hasOwnProperty.call(
									diff[keys[0]],
									[keys[1]]
								)
							) {
								diff[keys[0]][keys[1]] = {};
							}
							diff[keys[0]][keys[1]][keys[2]] = Math.floor(
								endValue - startValue
							);
						}
					};

					const traverse = (
						startObject,
						endObject,
						method,
						currentPath = ""
					) => {
						for (var element in endObject) {
							if (
								endObject[element] !== null &&
								typeof endObject[element] == "object"
							) {
								//going one step down in the object tree!!
								traverse(
									startObject[element],
									endObject[element],
									method,
									currentPath
										? currentPath + "." + element
										: element
								);
							} else {
								method.apply(this, [
									startObject[element],
									endObject[element],
									currentPath
										? currentPath + "." + element
										: element,
								]);
							}
						}
					};

					var chartEntries =
						this.$store.state.mqtt[
							this.baseTopic + this.commandData.date
						];
					const start = chartEntries[0];
					const end = chartEntries[chartEntries.length - 1];
					traverse(start, end, process);
					return diff;
				}
			}
			return undefined;
		},
		chartDataObject() {
			const calculatePower = (
				timeDiff,
				currentValueExported,
				nextValueExported,
				currentValueImported,
				nextValueImported
			) => {
				return (
					Math.floor(
						(nextValueImported -
							currentValueImported -
							(nextValueExported - currentValueExported)) /
							(timeDiff / 1000 / 3600)
					) / 1000
				);
			};
			const calculateEnergyDiff = (currentValue, nextValue) => {
				return (nextValue - currentValue) / 1000;
			};
			if (
				this.$store.state.mqtt[this.baseTopic + this.commandData.date]
			) {
				var chartEntries =
					this.$store.state.mqtt[
						this.baseTopic + this.commandData.date
					];
				if (
					Object.prototype.hasOwnProperty.call(
						chartEntries,
						"entries"
					)
				) {
					console.debug("upgraded chart data received");
					chartEntries = chartEntries.entries;
				}
				var myData = JSON.parse(JSON.stringify(chartEntries)).map(
					(row, currentIndex, entries) => {
						if (entries.length > currentIndex + 1) {
							const nextRow = entries[currentIndex + 1];
							const timeDiff =
								(nextRow.timestamp - row.timestamp) * 1000;
							row.timestamp = row.timestamp * 1000;
							var baseObjectsToProcess = [
								"pv",
								"counter",
								"bat",
								"cp",
								"sh",
							];
							baseObjectsToProcess.forEach((baseObject) => {
								Object.entries(row[baseObject]).forEach(
									([key, value]) => {
										if (row[baseObject][key]) {
											if (nextRow[baseObject][key]) {
												Object.keys(value).forEach(
													() => {
														switch (baseObject) {
															case "pv":
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].power =
																		calculatePower(
																			timeDiff,
																			0,
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported
																		);
																	row[
																		baseObject
																	][
																		key
																	].energyExport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported
																		);
																}
																break;
															case "counter":
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].power =
																		Math.floor(
																			(nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported -
																				row[
																					baseObject
																				][
																					key
																				]
																					.imported -
																				(nextRow[
																					baseObject
																				][
																					key
																				]
																					.exported -
																					row[
																						baseObject
																					][
																						key
																					]
																						.exported)) /
																				(timeDiff /
																					1000 /
																					3600)
																		) /
																		1000;
																	row[
																		baseObject
																	][
																		key
																	].powerImport =
																		Math.max(
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.power
																		);
																	row[
																		baseObject
																	][
																		key
																	].powerExport =
																		Math.min(
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.power
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyImport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyExport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported
																		);
																}
																break;
															case "bat":
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].power =
																		calculatePower(
																			timeDiff,
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																	row[
																		baseObject
																	][
																		key
																	].powerImport =
																		Math.max(
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.power
																		);
																	row[
																		baseObject
																	][
																		key
																	].powerExport =
																		Math.min(
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.power
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyImport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyExport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported
																		);
																}
																break;
															case "cp":
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].power =
																		calculatePower(
																			timeDiff,
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyImport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyExport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported
																		);
																}
																break;
															case "sh":
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].power =
																		calculatePower(
																			timeDiff,
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																	row[
																		baseObject
																	][
																		key
																	].powerImport =
																		Math.max(
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.power
																		);
																	row[
																		baseObject
																	][
																		key
																	].powerExport =
																		Math.min(
																			0,
																			row[
																				baseObject
																			][
																				key
																			]
																				.power
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"imported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"imported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyImport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.imported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.imported
																		);
																}
																if (
																	Object.prototype.hasOwnProperty.call(
																		nextRow[
																			baseObject
																		][key],
																		"exported"
																	) &&
																	Object.prototype.hasOwnProperty.call(
																		row[
																			baseObject
																		][key],
																		"exported"
																	)
																) {
																	row[
																		baseObject
																	][
																		key
																	].energyExport =
																		calculateEnergyDiff(
																			row[
																				baseObject
																			][
																				key
																			]
																				.exported,
																			nextRow[
																				baseObject
																			][
																				key
																			]
																				.exported
																		);
																}
																break;
														}
													}
												);
											} else {
												return;
											}
										}
									}
								);
							});
							return row;
						} else {
							return;
						}
					}
				);
				myData.pop();
				return myData;
			}
			return undefined;
		},
		chartData() {
			if (this.chartDataObject) {
				// add all datasets available in the last entry
				var baseObjectsToProcess = [
					"pv",
					"counter",
					"bat",
					"cp",
					"sh",
					"ev",
				];
				const lastElement =
					this.chartDataObject[this.chartDataObject.length - 1];
				if (lastElement) {
					baseObjectsToProcess.forEach((baseObject) => {
						if (
							Object.prototype.hasOwnProperty.call(
								lastElement,
								baseObject
							)
						) {
							Object.entries(lastElement[baseObject]).forEach(
								([key, value]) => {
									Object.keys(value).forEach((entryKey) => {
										this.initDataset(
											baseObject,
											key,
											entryKey
										);
									});
								}
							);
						}
					});
				}
				return this.chartDatasets;
			}
			return undefined;
		},
	},
	methods: {
		getCardSubtype(elementKey) {
			switch (elementKey) {
				case "bat":
					return "warning";
				case "counter":
					return "danger";
				case "cp":
					return "primary";
				case "pv":
					return "success";
				case "sh":
					return "pink";
				default:
					return "secondary";
			}
		},
		getCardIcon(elementKey) {
			switch (elementKey) {
				case "bat":
					return ["fas", "car-battery"];
				case "counter":
					return ["fas", "gauge-high"];
				case "cp":
					return ["fas", "charging-station"];
				case "pv":
					return ["fas", "solar-panel"];
				case "sh":
					return ["fas", "house-signal"];
				default:
					return undefined;
			}
		},
		getDatasetHidden(baseObject, objectKey) {
			// ToDo
			console.debug("getDatasetHidden", baseObject, objectKey);
			return false;
		},
		getTotalsLabel(
			groupKey,
			componentKey = undefined,
			measurementKey = undefined
		) {
			var label = "*test*";
			if (!componentKey && !measurementKey) {
				switch (groupKey) {
					case "bat":
						return "Speicher";
					case "counter":
						return "Zähler";
					case "pv":
						return "Wechselrichter";
					case "cp":
						return "Ladepunkte";
					case "sh":
						return "SmartHome-Geräte";
					default:
						console.warn("unknown group key:", groupKey);
				}
				return "*" + groupKey + "*";
			}
			if (componentKey && !measurementKey) {
				if (componentKey == "all") {
					return "Summe";
				} else {
					if (
						Object.prototype.hasOwnProperty.call(
							this.$store.state.mqtt[
								this.baseTopic + this.commandData.date
							],
							"names"
						)
					) {
						return this.$store.state.mqtt[
							this.baseTopic + this.commandData.date
						].names[componentKey];
					} else {
						// DEPRECATED
						var objectId = componentKey.match(/\d+$/);
						var topic = "";
						switch (groupKey) {
							case "cp":
								topic =
									"openWB/chargepoint/" +
									objectId +
									"/config";
								break;
							case "ev":
								topic = "openWB/vehicle/" + objectId + "/name";
								break;
							default:
								topic =
									"openWB/system/device/+/component/" +
									objectId +
									"/config";
						}
						var objectTopic = Object.keys(
							this.getWildcardTopics(topic)
						)[0];
						// console.debug(objectTopic);
						if (objectTopic) {
							switch (groupKey) {
								case "pv":
									return this.$store.state.mqtt[objectTopic]
										.name;
								case "counter":
									return this.$store.state.mqtt[objectTopic]
										.name;
								case "bat":
									return this.$store.state.mqtt[objectTopic]
										.name;
								case "cp":
									return this.$store.state.mqtt[objectTopic]
										.name;
								case "ev":
									return this.$store.state.mqtt[objectTopic];
								case "sh":
									return "SmartHome*";
								default:
									console.warn(
										"unknown group key:",
										groupKey
									);
							}
						} else {
							console.warn(
								"topic not found for:",
								groupKey,
								componentKey
							);
						}
						return "+" + groupKey + "+" + componentKey + "+";
					}
				}
			}
			if (componentKey && measurementKey) {
				switch (groupKey) {
					case "bat":
					case "cp":
						switch (measurementKey) {
							case "imported":
								return "Ladung";
							case "exported":
								return "Entladung";
							default:
								console.warn(
									"unknown measurement key:",
									groupKey,
									measurementKey
								);
						}
						break;
					case "counter":
						switch (measurementKey) {
							case "imported":
								return "Bezug/Verbrauch";
							case "exported":
								return "Einspeisung/Erzeugung";
							default:
								console.warn(
									"unknown measurement key:",
									groupKey,
									measurementKey
								);
						}
						break;
					case "pv":
						switch (measurementKey) {
							case "exported":
								return "Erzeugung";
							default:
								console.warn(
									"unknown measurement key:",
									groupKey,
									measurementKey
								);
						}
						break;
					case "sh":
						switch (measurementKey) {
							case "imported":
							case "energyImport":
								return "Verbrauch";
							case "exported":
							case "energyExport":
								return "Erzeugung";
							default:
								console.warn(
									"unknown measurement key:",
									groupKey,
									measurementKey
								);
						}
						break;
					default:
						console.warn("unknown group key:", groupKey);
				}
				return (
					"*" +
					groupKey +
					"+" +
					componentKey +
					"+" +
					measurementKey +
					"*"
				);
			}
			return label;
		},
		/**
		 * Builds a label string
		 * @param {String} baseObject
		 * @param {String} objectKey
		 * @param {String} elementKey
		 * @param {String} datasetKey
		 * @returns {String}
		 */
		getDatasetLabel(baseObject, objectKey, elementKey, datasetKey) {
			var label = ["*" + datasetKey];
			var details = [];
			if (objectKey == "all") {
				details.push("Summe");
				switch (baseObject) {
					case "pv":
						label = ["PV"];
						break;
					case "bat":
						label = ["Speicher"];
						switch (elementKey) {
							case "soc":
								label.push("SoC");
								break;
						}
						break;
					case "cp":
						label = ["Ladepunkte"];
						break;
				}
			} else {
				if (
					Object.prototype.hasOwnProperty.call(
						this.$store.state.mqtt[
							this.baseTopic + this.commandData.date
						],
						"names"
					) &&
					Object.prototype.hasOwnProperty.call(
						this.$store.state.mqtt[
							this.baseTopic + this.commandData.date
						].names,
						objectKey
					)
				) {
					label = [
						this.$store.state.mqtt[
							this.baseTopic + this.commandData.date
						].names[objectKey],
					];
				} else {
					// DEPRECATED!
					var objectId = objectKey.match(/\d+$/);
					var topic = "";
					switch (baseObject) {
						case "cp":
							topic =
								"openWB/chargepoint/" + objectId + "/config";
							break;
						case "ev":
							topic = "openWB/vehicle/" + objectId + "/name";
							break;
						default:
							topic =
								"openWB/system/device/+/component/" +
								objectId +
								"/config";
					}
					var objectTopic = Object.keys(
						this.getWildcardTopics(topic)
					)[0];
					if (objectTopic in this.$store.state.mqtt) {
						switch (baseObject) {
							case "pv":
								label = [
									this.$store.state.mqtt[objectTopic].name,
								];
								break;
							case "counter":
								label = [
									this.$store.state.mqtt[objectTopic].name,
								];
								break;
							case "bat":
								label = [
									this.$store.state.mqtt[objectTopic].name,
								];
								switch (elementKey) {
									case "soc":
										label.push("SoC");
										break;
								}
								break;
							case "cp":
								label = [
									this.$store.state.mqtt[objectTopic].name,
								];
								switch (elementKey) {
									case "soc":
										label.push("SoC");
										break;
								}
								break;
							case "sh":
								label = [
									this.$store.state.mqtt[objectTopic].name,
								];
								switch (elementKey) {
									case "temp1":
									case "temp2":
									case "temp3":
										label.push(
											elementKey.charAt(0).toUpperCase() +
												elementKey.substring(1)
										);
										break;
								}
								break;
							case "ev":
								label = [this.$store.state.mqtt[objectTopic]];
								switch (elementKey) {
									case "soc":
										label.push("SoC");
										break;
								}
								break;
						}
					} else {
						console.warn(
							"could not get name for dataset",
							datasetKey
						);
					}
				}
			}
			switch (baseObject) {
				case "bat":
				case "ev":
					if (elementKey == "soc") {
						details.push("SoC");
					}
				case "cp":
					switch (elementKey) {
						case "imported":
						case "energyImport":
							details.push("Ladung");
							break;
						case "exported":
						case "energyExport":
							details.push("Entladung");
							break;
					}
					break;
				case "counter":
					switch (elementKey) {
						case "imported":
						case "energyImport":
							details.push("Bezug/Verbrauch");
							break;
						case "exported":
						case "energyExport":
							details.push("Einspeisung/Erzeugung");
							break;
					}
					break;
				case "sh":
					switch (elementKey) {
						case "imported":
						case "energyImport":
							details.push("Verbrauch");
							break;
						case "exported":
						case "energyExport":
							details.push("Erzeugung");
							break;
					}
					break;
			}
			console.debug(
				"getDatasetLabel",
				baseObject,
				objectKey,
				elementKey,
				datasetKey,
				"Label:",
				label,
				details
			);
			return `${label.join(" ")}${
				details.length ? " (" + details.join(", ") + ")" : ""
			}`;
		},
		getDatasetIndex(datasetKey) {
			let index = this.chartDatasets.datasets.findIndex((dataset) => {
				return dataset.jsonKey == datasetKey;
			});
			if (index != -1) {
				return index;
			}
			return;
		},
		addDataset(baseObject, objectKey, elementKey, datasetKey) {
			console.debug(
				"adding new dataset",
				baseObject,
				objectKey,
				elementKey,
				datasetKey
			);
			// if (objectKey == "all") {
			// 	console.log("skipping sum data");
			// 	return;
			// }
			var datasetTemplate = baseObject + "-" + elementKey;
			if (this.datasetTemplates[datasetTemplate]) {
				var newDataset = JSON.parse(
					JSON.stringify(this.datasetTemplates[datasetTemplate])
				);
				newDataset.parsing.yAxisKey = datasetKey;
				newDataset.jsonKey = datasetKey;
				newDataset.data = this.chartDataObject;
				newDataset.label = this.getDatasetLabel(
					baseObject,
					objectKey,
					elementKey,
					datasetKey
				);
				if (newDataset.labelSuffix != undefined) {
					newDataset.label =
						newDataset.label + newDataset.labelSuffix;
				}
				if (objectKey == "all") {
					newDataset.hidden = false;
				}
				return this.chartDatasets.datasets.push(newDataset) - 1;
			} else {
				console.warn(
					"no matching template found for: " +
						datasetKey +
						" with template: " +
						datasetTemplate
				);
			}
			return;
		},
		initDataset(baseObject, objectKey, elementKey) {
			var elementKeysToAdd = [];
			if (this.chartRange == "day") {
				elementKeysToAdd = ["power", "soc"];
			} else {
				elementKeysToAdd = ["energyImport", "energyExport"];
			}
			const datasetKey = baseObject + "." + objectKey + "." + elementKey;
			if (elementKeysToAdd.includes(elementKey)) {
				var index = this.getDatasetIndex(datasetKey);
				const hidden = this.getDatasetHidden(baseObject, objectKey);
				if (index == undefined && !hidden) {
					index = this.addDataset(
						baseObject,
						objectKey,
						elementKey,
						datasetKey
					);
				}
				if (index != undefined && hidden) {
					console.info(
						"component hidden:",
						baseObject,
						objectKey,
						elementKey,
						index
					);
					this.chartDatasets.datasets.splice(index, 1);
				}
			}
		},
		setupScaleX() {
			this.chartOptions.scales.x.time.unit = this.chartScaleX.unit;
			this.chartOptions.scales.x.time.tooltipFormat =
				this.chartScaleX.tooltipFormat;
			this.chartOptions.scales.x.title.text = this.chartScaleX.text;
			this.chartOptions.scales.x.ticks.maxTicksLimit =
				this.chartScaleX.maxTicksLimit;
		},
		requestChart() {
			let myForm = document.forms["chartForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				this.setupScaleX();
				this.chartDatasets.datasets = [];
				var command = "";
				switch (this.chartRange) {
					case "day":
						command = "getDailyLog";
						break;
					case "month":
						command = "getMonthlyLog";
						break;
					case "year":
						command = "getYearlyLog";
						break;
				}
				this.$emit("sendCommand", {
					command: command,
					data: this.commandData,
				});
			}
		},
		clearChartData() {
			this.getWildcardIndexList(this.baseTopic + "+").forEach((topic) => {
				this.$store.commit("removeTopic", `${this.baseTopic}${topic}`);
			});
		},
		updateChart() {
			this.clearChartData();
			this.requestChart();
		},
		init() {
			const today = new Date();
			this.currentDate = String(today.getFullYear());
			if (this.chartRange != "year") {
				this.currentDate =
					this.currentDate +
					"-" +
					String(today.getMonth() + 1).padStart(2, "0");
			}
			if (this.chartRange == "day") {
				this.currentDate =
					this.currentDate +
					"-" +
					String(today.getDate()).padStart(2, "0");
			}
			if (this.initialDate == undefined || this.initialDate == "") {
				console.log(
					"no initial date for chart found, fallback to today"
				);
				this.chartDate = this.currentDate;
			} else {
				this.chartDate = this.initialDate;
			}
			this.updateChart();
		},
	},
	watch: {
		chartRange() {
			this.init();
		},
	},
	mounted() {
		this.init();
	},
};
</script>

<style scoped>
.openwb-chart {
	min-height: 400px;
}
</style>
