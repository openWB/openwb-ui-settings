<template>
	<div class="monthlyChart">
		<form name="monthlyChartForm">
			<openwb-base-card
				title="Filter"
				:collapsible="true"
				:collapsed="false"
			>
				<openwb-base-text-input
					title="Monat"
					subtype="month"
					min="2018-01"
					:max="currentMonth"
					v-model="monthlyChartDate"
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasChargingStation, fasCarBattery, fasSolarPanel, fasGaugeHigh);

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
	name: "OpenwbMonthlyChart",
	components: { ChartjsLine, FontAwesomeIcon },
	mixins: [ComponentState],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/log/monthly/#",
				"openWB/system/device/+/component/+/config",
				"openWB/chargepoint/+/config",
				"openWB/vehicle/+/name",
			],
			currentMonth: "",
			monthlyChartRequestData: {
				month: "",
				year: "",
			},
			datasetTemplates: {
				"counter-energy": {
					label: "Zähler",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(255, 0, 0, 0.7)",
					backgroundColor: "rgba(255, 10, 13, 0.3)",
					fill: true,
					cubicInterpolationMode: "monotone",
					hidden: false,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
				},
				"pv-energy": {
					label: "PV",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(0, 255, 0, 0.7)",
					backgroundColor: "rgba(10, 255, 13, 0.3)",
					fill: true,
					cubicInterpolationMode: "monotone",
					hidden: true,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					// stack: "inverter",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
				},
				"bat-energy": {
					label: "Speicher",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(255, 153, 13, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					fill: true,
					cubicInterpolationMode: "monotone",
					hidden: true,
					borderWidth: 1,
					data: null,
					yAxisID: "y",
					// stack: "battery",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
				},
				"cp-energy": {
					label: "Ladepunkt",
					unit: "kWh",
					jsonKey: null,
					borderColor: "rgba(0, 0, 255, 0.7)",
					backgroundColor: "rgba(0, 0, 255, 0.3)",
					fill: true,
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
					pointStyle: "circle",
					pointRadius: 0,
					pointHoverRadius: 4,
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
							unit: "day",
							tooltipFormat: "D",
						},
						display: true,
						title: {
							display: true,
							text: "Tag",
						},
						ticks: {
							source: "timestamp",
							font: {
								size: 12,
							},
							// color: tickColor,
							maxTicksLimit: 31,
						},
						grid: {
							// color: xGridColor,
						},
					},
					y: {
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
				},
			},
			chartDatasets: {
				datasets: [],
			},
		};
	},
	computed: {
		monthlyChartDate: {
			get() {
				return (
					this.monthlyChartRequestData.year +
					"-" +
					this.monthlyChartRequestData.month
				);
			},
			set(newValue) {
				let splitDate = newValue.split("-");
				this.monthlyChartRequestData.year = splitDate[0];
				this.monthlyChartRequestData.month = splitDate[1];
			},
		},
		commandData() {
			return {
				month:
					this.monthlyChartRequestData.year +
					this.monthlyChartRequestData.month,
			};
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
				this.$store.state.mqtt[
					"openWB/log/monthly/" + this.commandData.month
				]
			) {
				if (
					Object.prototype.hasOwnProperty.call(
						this.$store.state.mqtt[
							"openWB/log/monthly/" + this.commandData.month
						],
						"totals"
					)
				) {
					return this.$store.state.mqtt[
						"openWB/log/monthly/" + this.commandData.month
					].totals;
				} else {
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
							"openWB/log/monthly/" + this.commandData.month
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
			if (
				this.$store.state.mqtt[
					"openWB/log/monthly/" + this.commandData.month
				]
			) {
				var chartEntries =
					this.$store.state.mqtt[
						"openWB/log/monthly/" + this.commandData.month
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
				var lastRow = undefined;
				var myData = JSON.parse(JSON.stringify(chartEntries)).map(
					(row) => {
						row.timestamp = row.timestamp * 1000;
						if (lastRow !== undefined) {
							var baseObjectsToProcess = [
								"pv",
								"counter",
								"bat",
								"cp",
							];
							baseObjectsToProcess.forEach((baseObject) => {
								Object.entries(row[baseObject]).forEach(
									([key, value]) => {
										if (lastRow[baseObject][key]) {
											Object.keys(value).forEach(() => {
												switch (baseObject) {
													case "pv":
														if (
															Object.prototype.hasOwnProperty.call(
																row[baseObject][
																	key
																],
																"exported"
															) &&
															Object.prototype.hasOwnProperty.call(
																lastRow[
																	baseObject
																][key],
																"exported"
															)
														) {
															row[baseObject][
																key
															].energy =
																(row[
																	baseObject
																][key]
																	.exported -
																	lastRow[
																		baseObject
																	][key]
																		.exported) /
																1000;
														}
														break;
													case "counter":
														if (
															Object.prototype.hasOwnProperty.call(
																row[baseObject][
																	key
																],
																"imported"
															) &&
															Object.prototype.hasOwnProperty.call(
																lastRow[
																	baseObject
																][key],
																"imported"
															) &&
															Object.prototype.hasOwnProperty.call(
																row[baseObject][
																	key
																],
																"exported"
															) &&
															Object.prototype.hasOwnProperty.call(
																lastRow[
																	baseObject
																][key],
																"exported"
															)
														) {
															row[baseObject][
																key
															].energy =
																(row[
																	baseObject
																][key]
																	.imported -
																	lastRow[
																		baseObject
																	][key]
																		.imported -
																	(row[
																		baseObject
																	][key]
																		.exported -
																		lastRow[
																			baseObject
																		][key]
																			.exported)) /
																1000;
															row[baseObject][
																key
															].energyImport =
																Math.max(
																	0,
																	row[
																		baseObject
																	][key]
																		.energy
																);
															row[baseObject][
																key
															].energyExport =
																Math.min(
																	0,
																	row[
																		baseObject
																	][key]
																		.energy
																);
														}
														break;
													case "bat":
														if (
															Object.prototype.hasOwnProperty.call(
																row[baseObject][
																	key
																],
																"imported"
															) &&
															Object.prototype.hasOwnProperty.call(
																lastRow[
																	baseObject
																][key],
																"imported"
															) &&
															Object.prototype.hasOwnProperty.call(
																row[baseObject][
																	key
																],
																"exported"
															) &&
															Object.prototype.hasOwnProperty.call(
																lastRow[
																	baseObject
																][key],
																"exported"
															)
														) {
															row[baseObject][
																key
															].energy =
																(row[
																	baseObject
																][key]
																	.imported -
																	lastRow[
																		baseObject
																	][key]
																		.imported -
																	(row[
																		baseObject
																	][key]
																		.exported -
																		lastRow[
																			baseObject
																		][key]
																			.exported)) /
																1000;
															row[baseObject][
																key
															].energyImport =
																Math.max(
																	0,
																	row[
																		baseObject
																	][key]
																		.energy
																);
															row[baseObject][
																key
															].energyExport =
																Math.min(
																	0,
																	row[
																		baseObject
																	][key]
																		.energy
																);
														}
														break;
													case "cp":
														if (
															Object.prototype.hasOwnProperty.call(
																row[baseObject][
																	key
																],
																"imported"
															) &&
															Object.prototype.hasOwnProperty.call(
																lastRow[
																	baseObject
																][key],
																"imported"
															)
														) {
															row[baseObject][
																key
															].energy =
																(row[
																	baseObject
																][key]
																	.imported -
																	lastRow[
																		baseObject
																	][key]
																		.imported) /
																1000;
														}
														break;
												}
											});
										}
									}
								);
							});
							lastRow = row;
							return row;
						} else {
							lastRow = row;
							return;
						}
					}
				);
				myData.shift();
				return myData;
			}
			return undefined;
		},
		chartData() {
			if (this.chartDataObject) {
				// add all datasets available in the last entry
				var baseObjectsToProcess = ["pv", "counter", "bat", "cp"];
				const lastElement =
					this.chartDataObject[this.chartDataObject.length - 1];
				if (lastElement) {
					baseObjectsToProcess.forEach((baseObject) => {
						Object.entries(lastElement[baseObject]).forEach(
							([key, value]) => {
								Object.keys(value).forEach((entryKey) => {
									this.initDataset(baseObject, key, entryKey);
								});
							}
						);
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
				// console.debug("getTotalsLabel for group:", groupKey);
				switch (groupKey) {
					case "bat":
						return "Speicher";
					case "counter":
						return "Zähler";
					case "pv":
						return "Wechselrichter";
					case "cp":
						return "Ladepunkte";
					default:
						console.warn("unknown group key:", groupKey);
				}
				return "*" + groupKey + "*";
			}
			if (componentKey && !measurementKey) {
				// console.debug(
				// 	"getLabel for component:",
				// 	groupKey,
				// 	componentKey
				// );
				if (componentKey == "all") {
					return "Summe";
				} else {
					var objectId = componentKey.match(/\d+$/);
					var topic = "";
					switch (groupKey) {
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
					// console.debug(objectTopic);
					if (objectTopic) {
						switch (groupKey) {
							case "pv":
								return this.$store.state.mqtt[objectTopic].name;
							case "counter":
								return this.$store.state.mqtt[objectTopic].name;
							case "bat":
								return this.$store.state.mqtt[objectTopic].name;
							case "cp":
								return this.$store.state.mqtt[objectTopic].name;
							case "ev":
								return this.$store.state.mqtt[objectTopic];
							default:
								console.warn("unknown group key:", groupKey);
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
			if (componentKey && measurementKey) {
				// console.debug(
				// 	"getTotalsLabel for measurement",
				// 	groupKey,
				// 	componentKey,
				// 	measurementKey
				// );
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
		getDatasetLabel(baseObject, objectKey, elementKey, datasetKey) {
			// console.debug(
			// 	"getDatasetLabel",
			// 	baseObject,
			// 	objectKey,
			// 	elementKey,
			// 	datasetKey
			// );
			var label = "*" + datasetKey;
			if (objectKey == "all") {
				switch (baseObject) {
					case "pv":
						label = "PV (Summe)";
						break;
					case "bat":
						label = "Speicher";
						switch (elementKey) {
							case "imported":
								label += " (Ladung, Summe)";
								break;
							case "exported":
								label += " (Entladung, Summe)";
								break;
							case "soc":
								label += " SoC (Summe)";
								break;
							default:
								label += " (Summe)";
						}
						break;
					case "cp":
						label = "Ladepunkte";
						switch (elementKey) {
							case "imported":
								label += " (Ladung, Summe)";
								break;
							case "exported":
								label += " (Entladung, Summe)";
								break;
							case "soc":
								label += " SoC (Summe)";
								break;
							default:
								label += " (Summe)";
						}
						break;
				}
			} else {
				var objectId = objectKey.match(/\d+$/);
				var topic = "";
				switch (baseObject) {
					case "cp":
						topic = "openWB/chargepoint/" + objectId + "/config";
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
				var objectTopic = Object.keys(this.getWildcardTopics(topic))[0];
				if (objectTopic in this.$store.state.mqtt) {
					switch (baseObject) {
						case "pv":
							label = this.$store.state.mqtt[objectTopic].name;
							break;
						case "counter":
							label = this.$store.state.mqtt[objectTopic].name;
							switch (elementKey) {
								case "imported":
									label += " (Bezug)";
									break;
								case "exported":
									label += " (Einspeisung)";
									break;
							}
							break;
						case "bat":
							label = this.$store.state.mqtt[objectTopic].name;
							switch (elementKey) {
								case "imported":
									label += " (Ladung)";
									break;
								case "exported":
									label += " (Entladung)";
									break;
								case "soc":
									label += " SoC";
									break;
							}
							break;
						case "cp":
							label = this.$store.state.mqtt[objectTopic].name;
							switch (elementKey) {
								case "imported":
									label += " (Ladung)";
									break;
								case "exported":
									label += " (Entladung)";
									break;
								case "soc":
									label += " SoC";
									break;
							}
							break;
						case "ev":
							label = this.$store.state.mqtt[objectTopic];
							break;
					}
				} else {
					console.warn("could not get name for dataset", datasetKey);
				}
			}
			return label;
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
			const elementKeysToAdd = ["energy"];
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
		requestMonthlyChart() {
			let myForm = document.forms["monthlyChartForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				this.chartDatasets.datasets = [];
				this.$emit("sendCommand", {
					command: "getMonthlyLog",
					data: this.commandData,
				});
			}
		},
		clearChartData() {
			this.getWildcardIndexList("openWB/log/monthly/+").forEach(
				(topic) => {
					this.$store.commit(
						"removeTopic",
						`openWB/log/monthly/${topic}`
					);
				}
			);
		},
		updateChart() {
			this.clearChartData();
			this.requestMonthlyChart();
		},
	},
	mounted() {
		const today = new Date();
		this.currentMonth = this.monthlyChartDate =
			today.getFullYear() +
			"-" +
			String(today.getMonth() + 1).padStart(2, "0");
		this.requestMonthlyChart();
	},
};
</script>

<style scoped>
.openwb-chart {
	min-height: 400px;
}
</style>
