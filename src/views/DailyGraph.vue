<template>
	<div class="dailyGraph">
		<form name="dailyGraphForm">
			<openwb-base-card title="Filter">
				<openwb-base-text-input
					title="Datum"
					subtype="date"
					min="2018-01-01"
					max="2022-12-31"
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
			<openwb-base-card title="Tages-Diagramm"></openwb-base-card>
			<openwb-base-alert subtype="info">
				Graph Dataset:<br />
				<pre>{{ dailyGraphDataset }}</pre>
			</openwb-base-alert>
		</form>
	</div>
</template>

<script>
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "DailyGraph",
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/log/daily/#",
			],
			dailyGraphRequestData: {
				day: "01",
				month: "01",
				year: "2022",
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
		dailyGraphDataset: {
			get() {
				return this.$store.state.mqtt[
					"openWB/log/daily/" + this.commandData.day
				];
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
};
</script>
