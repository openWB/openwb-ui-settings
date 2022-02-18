<template>
	<div class="chargeLog">
		<form name="chargeLogForm">
			<openwb-base-card title="Filter">
				<openwb-base-text-input
					title="Zeitraum"
					subtype="month"
					min="2018-01"
					:max="currentMonth"
					v-model="chargeLogDate"
				/>
				<openwb-base-card
					title="Erweiterte Optionen"
					:collapsible="true"
					:collapsed="true"
				>
					<openwb-base-textarea
						title="Filter Objekt"
						subtype="json"
						v-model="chargeLogRequestData.filter"
					/>
				</openwb-base-card>
				<template #footer>
					<div class="row justify-content-center">
						<openwb-base-click-button
							class="col-4 btn-success"
							@click="requestChargeLog()"
						>
							Filter anwenden
						</openwb-base-click-button>
					</div>
				</template>
			</openwb-base-card>
			<openwb-base-alert v-if="!chargeLogRead" subtype="info">
				Es wurden noch keine Daten abgerufen.
			</openwb-base-alert>
			<div v-else>
				<vue3-table-lite
					id="charge-log-table"
					:is-static-mode="true"
					:columns="table.columns"
					:rows="chargeLogDataset"
					:total="totalRecordCount"
					:sortable="table.sortable"
					:messages="table.messages"
					:page-options="table.pageOptions"
					:limit="25"
				/>
			</div>
		</form>
	</div>
</template>

<script>
import Vue3TableLite from "vue3-table-lite";
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "ChargeLog",
	components: { Vue3TableLite },
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: ["openWB/general/extern"],
			currentMonth: "",
			chargeLogRequestData: {
				month: "",
				year: "",
				filter: {
					chargepoint: {
						id: [],
					},
					vehicle: {
						id: [],
						rfid: [],
						chargemode: [],
						prio: [],
					},
				},
			},
			table: {
				messages: {
					pagingInfo: "Einträge {0}-{1} von {2}",
					pageSizeChangeLabel: "Einträge:",
					gotoPageLabel: " Gehe zu:",
					noDataAvailable: "Keine Einträge gefunden.",
				},
				pageOptions: [
					{ value: 5, text: "5" },
					{ value: 10, text: "10" },
					{ value: 25, text: "25" },
					{ value: 50, text: "50" },
					{ value: 100, text: "100" },
				],
				columns: [
					{
						label: "Beginn",
						field: "time_begin",
						width: "15%",
						sortable: true,
					},
					{
						label: "Ende",
						field: "time_end",
						width: "15%",
						sortable: true,
					},
					{
						label: "Fahrzeug",
						field: "vehicle_name",
						width: "10%",
						sortable: true,
					},
					{
						label: "Dauer",
						field: "time_time_charged",
						width: "15%",
						sortable: true,
					},
					{
						label: "Geladen [kWh]",
						field: "data_charged_since_plugged_counter",
						width: "15%",
						sortable: true,
					},
					{
						label: "Kosten",
						field: "data_costs",
						width: "15%",
						sortable: true,
					},
					{
						label: "Lademodus",
						field: "vehicle_chargemode",
						width: "15%",
						sortable: true,
					},
					{
						label: "Ladepunkt",
						field: "chargepoint_name",
						width: "3%",
						sortable: true,
					},
				],
				sortable: {
					order: "time_begin",
					sort: "asc",
				},
			},
		};
	},
	computed: {
		chargeLogDate: {
			get() {
				return (
					this.chargeLogRequestData.year +
					"-" +
					this.chargeLogRequestData.month
				);
			},
			set(newValue) {
				let splitDate = newValue.split("-");
				this.chargeLogRequestData.year = splitDate[0];
				this.chargeLogRequestData.month = splitDate[1];
			},
		},
		chargeLogDataset: {
			get() {
				let dateTimeFormat = new Intl.DateTimeFormat("de-DE", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				});
				try {
					return this.$store.state.mqtt[
						"openWB/log/" + this.mqttClientId + "/data"
					]["entries"].map((entry) => {
						return {
							chargepoint_id: entry["chargepoint"]["id"],
							chargepoint_name: entry["chargepoint"]["name"],
							vehicle_id: entry["vehicle"]["id"],
							vehicle_name: entry["vehicle"]["name"],
							vehicle_chargemode: entry["vehicle"]["chargemode"],
							vehicle_rfid: entry["vehicle"]["rfid"],
							vehicle_prio: entry["vehicle"]["prio"],
							time_begin: dateTimeFormat.format(
								new Date(entry["time"]["begin"])
							),
							time_end: dateTimeFormat.format(
								new Date(entry["time"]["end"])
							),
							time_time_charged: entry["time"]["time_charged"],
							data_power: entry["data"]["power"],
							data_range_charged: entry["data"]["range_charged"],
							data_costs: entry["data"]["costs"],
							data_charged_since_plugged_counter:
								entry["data"]["charged_since_plugged_counter"],
							data_charged_since_mode_switch:
								entry["data"]["charged_since_mode_switch"],
						};
					});
				} catch (error) {
					return [];
				}
			},
		},
		chargeLogRead: {
			get() {
				return this.chargeLogDataset != undefined;
			},
		},
		chargeLogHasEntries: {
			get() {
				if (this.chargeLogDataset == undefined) {
					return false;
				} else {
					return this.chargeLogDataset.length > 0;
				}
			},
		},
		totalRecordCount() {
			return this.chargeLogDataset.length;
		},
	},
	methods: {
		requestChargeLog() {
			let myForm = document.forms["chargeLogForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				console.log(this.chargeLogRequestData);
				this.$emit("sendCommand", {
					command: "getChargeLog",
					data: this.chargeLogRequestData,
				});
			}
		},
	},
	mounted() {
		const today = new Date();
		this.currentMonth = this.chargeLogDate =
			today.getFullYear() +
			"-" +
			String(today.getMonth() + 1).padStart(2, "0");
		this.requestChargeLog();
	},
};
</script>

<style scoped>
#charge-log-table {
	border: none;
	padding: 0;
}

#charge-log-table :deep(.card-body) {
	padding: 0;
}

:deep(.vtl-table .vtl-thead .vtl-thead-th) {
	color: var(--light);
	background-color: var(--primary);
	border-color: var(--light);
}

:deep(.vtl-table .vtl-tbody .vtl-tbody-tr:hover) {
	background-color: #d1ecf1;
}

:deep(.vtl-table .vtl-tbody .vtl-tbody-tr:nth-child(odd):not(:hover)) {
	background-color: var(--light);
}

:deep(.vtl-table .vtl-tbody .vtl-tbody-tr:nth-child(even):not(:hover)) {
	background-color: var(--white);
}

:deep(.vtl-paging) {
	align-items: center;
}

:deep(.vtl-paging-change-div) {
	text-align: center;
}
</style>
