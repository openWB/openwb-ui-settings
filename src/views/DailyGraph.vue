<template>
	<div class="dailyGraph">
		<form name="dailyGraphForm">
			<openwb-base-card title="Filter">
				<openwb-base-text-input
					title="Datum"
					subtype="date"
					min="2018-01-01"
					:max="currentDay"
					v-model="dailyGraphDate"
				/>
				<template #footer>
					<div class="row justify-content-center">
						<openwb-base-click-button
							class="col-4 btn-success"
							@click="requestDailyGraph()"
						>
							Daten anfordern
						</openwb-base-click-button>
					</div>
				</template>
			</openwb-base-card>
			<openwb-base-alert v-if="!chartDataRead" subtype="info">
				Es wurden noch keine Daten abgerufen.
			</openwb-base-alert>
			<div v-else>
				<openwb-base-alert v-if="!chartDataHasEntries" subtype="info">
					Es konnten keine Einträge für dieses Datum gefunden werden.
				</openwb-base-alert>
				<openwb-base-card v-else title="Tages-Diagramm">
					<LineChart :chartData="chartData" :options="chartOptions" />
				</openwb-base-card>
			</div>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import { LineChart } from "vue-chart-3";
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
	// CategoryScale,
	LinearScale,
	TimeScale,
} from "chart.js";
Chart.register(
	Tooltip,
	Legend,
	LineController,
	LineElement,
	PointElement,
	// CategoryScale,
	LinearScale,
	TimeScale,
	ZoomPlugin
);

export default {
	name: "OpenwbDailyGraph",
	components: { LineChart },
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/log/daily/#",
				"openWB/system/device/+/component/+/config",
				"openWB/chargepoint/+/config",
				"openWB/vehicle/+/name",
			],
			currentDay: "",
			dailyGraphRequestData: {
				day: "",
				month: "",
				year: "",
			},
			datasetTemplates: {
				"counter-power": {
					label: "Zähler",
					jsonKey: null,
					borderColor: "rgba(255, 0, 0, 0.7)",
					backgroundColor: "rgba(255, 10, 13, 0.3)",
					fill: true,
					lineTension: 0.2,
					// hidden: boolDisplayPv,
					borderWidth: 1,
					data: null,
					yAxisID: "y1",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"pv-power": {
					label: "PV",
					jsonKey: null,
					borderColor: "rgba(0, 255, 0, 0.7)",
					backgroundColor: "rgba(10, 255, 13, 0.3)",
					fill: true,
					lineTension: 0.2,
					// hidden: boolDisplayPv,
					borderWidth: 1,
					data: null,
					yAxisID: "y1",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"bat-power": {
					label: "Speicher",
					jsonKey: null,
					borderColor: "rgba(255, 153, 13, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					fill: true,
					lineTension: 0.2,
					// hidden: boolDisplayPv,
					borderWidth: 1,
					data: null,
					yAxisID: "y1",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"bat-soc": {
					label: "Speicher SoC",
					jsonKey: null,
					borderColor: "rgba(255, 153, 13, 0.7)",
					backgroundColor: "rgba(200, 255, 13, 0.3)",
					borderDash: [10, 5],
					hidden: false,
					fill: false,
					lineTension: 0.2,
					borderWidth: 2,
					data: null,
					yAxisID: "y2",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"cp-power": {
					label: "Ladepunkt",
					jsonKey: null,
					borderColor: "rgba(0, 0, 255, 0.7)",
					backgroundColor: "rgba(0, 0, 255, 0.7)",
					fill: true,
					lineTension: 0.2,
					// hidden: boolDisplayPv,
					borderWidth: 1,
					data: null,
					yAxisID: "y1",
					parsing: {
						xAxisKey: "timestamp",
						yAxisKey: null,
					},
				},
				"ev-soc": {
					label: "Fahrzeug SoC",
					jsonKey: null,
					borderColor: "rgba(0, 0, 255, 0.5)",
					backgroundColor: "rgba(0, 0, 255, 0.7)",
					borderDash: [10, 5],
					hidden: false,
					fill: false,
					lineTension: 0.2,
					borderWidth: 2,
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
						radius: 0,
					},
				},
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: "time",
						time: {
							unit: "minute",
							tooltipFormat: "DD T",
						},
						display: true,
						title: {
							display: true,
							text: "Zeit",
						},
						ticks: {
							source: "timestamp",
							font: {
								size: 12,
							},
							// color: tickColor,
							maxTicksLimit: 15,
						},
						grid: {
							// color: xGridColor,
						},
					},
					y1: {
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
							maxTicksLimit: 10,
							// color: tickColor
						},
					},
					y2: {
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
		dailyGraphDate: {
			get() {
				return (
					this.dailyGraphRequestData.year +
					"-" +
					this.dailyGraphRequestData.month +
					"-" +
					this.dailyGraphRequestData.day
				);
			},
			set(newValue) {
				let splitDate = newValue.split("-");
				this.dailyGraphRequestData.year = splitDate[0];
				this.dailyGraphRequestData.month = splitDate[1];
				this.dailyGraphRequestData.day = splitDate[2];
			},
		},
		commandData: {
			get() {
				return {
					day:
						this.dailyGraphRequestData.year +
						this.dailyGraphRequestData.month +
						this.dailyGraphRequestData.day,
				};
			},
		},
		chartDataRead: {
			get() {
				return this.chartDataObject != undefined;
			},
		},
		chartDataHasEntries: {
			get() {
				return this.chartDataObject.length > 0;
			},
		},
		chartDataObject() {
			if (
				this.$store.state.mqtt[
					"openWB/log/daily/" + this.commandData.day
				]
			) {
				var lastRow = undefined;
				var myData = JSON.parse(
					JSON.stringify(
						this.$store.state.mqtt[
							"openWB/log/daily/" + this.commandData.day
						]
					)
				).map((row) => {
					row.timestamp = row.timestamp * 1000;
					if (lastRow) {
						const timeDiff = row.timestamp - lastRow.timestamp;
						var baseObjectsToProcess = [
							"pv",
							"counter",
							"bat",
							"cp",
						];
						baseObjectsToProcess.forEach((baseObject) => {
							Object.entries(row[baseObject]).forEach(
								([key, value]) => {
									Object.keys(value).forEach(() => {
										switch (baseObject) {
											case "pv":
												row[baseObject][key].power =
													Math.floor(
														(row[baseObject][key]
															.imported -
															lastRow[baseObject][
																key
															].imported) /
															(timeDiff /
																1000 /
																3600)
													);
												break;
											case "counter":
												row[baseObject][key].power =
													Math.floor(
														(row[baseObject][key]
															.imported -
															lastRow[baseObject][
																key
															].imported -
															(row[baseObject][
																key
															].exported -
																lastRow[
																	baseObject
																][key]
																	.exported)) /
															(timeDiff /
																1000 /
																3600)
													);
												break;
											case "bat":
												row[baseObject][key].power =
													Math.floor(
														(row[baseObject][key]
															.imported -
															lastRow[baseObject][
																key
															].imported -
															(row[baseObject][
																key
															].exported -
																lastRow[
																	baseObject
																][key]
																	.exported)) /
															(timeDiff /
																1000 /
																3600)
													);
												break;
											case "cp":
												row[baseObject][key].power =
													Math.floor(
														(row[baseObject][key]
															.imported -
															lastRow[baseObject][
																key
															].imported) /
															(timeDiff /
																1000 /
																3600)
													);
												break;
										}
									});
								}
							);
						});

						lastRow = row;
						return row;
					} else {
						lastRow = row;
						return;
					}
				});
				myData.shift();
				return myData;
			}
			return [];
		},
		chartData() {
			// add all datasets available in the last entry
			var baseObjectsToProcess = ["pv", "counter", "bat", "cp", "ev"];
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
		},
	},
	methods: {
		getDatasetLabel(baseObject, objectKey, elementKey, datasetKey) {
			// console.log(
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
						label = "PV Summe";
						break;
					case "bat":
						label = "Speicher ";
						switch (elementKey) {
							case "power":
								label += "Summe";
								break;
							case "soc":
								label += "SoC Summe";
								break;
						}
						break;
					case "cp":
						label = "Ladepunkte Summe";
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
				switch (baseObject) {
					case "pv":
					case "counter":
					case "bat":
					case "cp":
						label = this.$store.state.mqtt[objectTopic].name;
						if (elementKey == "soc") {
							label += " SoC";
						}
						break;
					case "ev":
						label = this.$store.state.mqtt[objectTopic];
						break;
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
			const elementKeysToIgnore = ["imported", "exported", "counter"];
			const datasetKey = baseObject + "." + objectKey + "." + elementKey;
			if (!elementKeysToIgnore.includes(elementKey)) {
				var index = this.getDatasetIndex(datasetKey);
				if (index == undefined) {
					index = this.addDataset(
						baseObject,
						objectKey,
						elementKey,
						datasetKey
					);
				}
			}
		},
		requestDailyGraph() {
			let myForm = document.forms["dailyGraphForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				this.chartDatasets.datasets = [];
				this.$emit("sendCommand", {
					command: "getDailyLog",
					data: this.commandData,
				});
			}
		},
	},
	mounted() {
		const today = new Date();
		this.currentDay = this.dailyGraphDate =
			today.getFullYear() +
			"-" +
			String(today.getMonth() + 1).padStart(2, "0") +
			"-" +
			String(today.getDate()).padStart(2, "0");
		this.requestDailyGraph();
	},
};
</script>
