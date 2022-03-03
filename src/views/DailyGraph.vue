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
				<openwb-base-card v-else title="Demo-Diagramm">
					<LineChart :chartData="testData" />
				</openwb-base-card>
			</div>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

import { LineChart } from "vue-chart-3";
import {
	Chart,
	Tooltip,
	Legend,
	LineController,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
} from "chart.js";
Chart.register(
	Tooltip,
	Legend,
	LineController,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale
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
			],
			currentDay: "",
			dailyGraphRequestData: {
				day: "01",
				month: "01",
				year: "2022",
			},
			testData: {
				labels: ["00:00", "00:01", "00:02", "00:03", "00:04"],
				datasets: [
					{
						label: "Datenreihe 1",
						data: [123, 54, -13, -27, 5],
						backgroundColor: [
							"#77CEFF",
							"#0079AF",
							"#123E6B",
							"#97B0C4",
							"#A5C8ED",
						],
					},
				],
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
		chartDataset: {
			get() {
				return this.$store.state.mqtt[
					"openWB/log/daily/" + this.commandData.day
				];
			},
		},
		chartDataRead: {
			get() {
				return this.chartDataset != undefined;
			},
		},
		chartDataHasEntries: {
			get() {
				if (this.chartDataset == undefined) {
					return false;
				} else {
					return this.chartDataset.length > 0;
				}
			},
		},
	},
	methods: {
		requestDailyGraph() {
			let myForm = document.forms["dailyGraphForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				console.log(this.dailyGraphRequestData);
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
