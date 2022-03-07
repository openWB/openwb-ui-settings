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
					<template #header>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'filter']"
						/>
						Erweiterte Optionen
					</template>
					<openwb-base-button-group-input
						title="Priorität"
						:buttons="[
							{
								buttonValue: undefined,
								text: 'Alle',
							},
							{
								buttonValue: false,
								text: 'Aus',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: true,
								text: 'An',
								class: 'btn-outline-success',
							},
						]"
						v-model="chargeLogRequestData.filter.vehicle.prio"
					/>
					<openwb-base-select-input
						title="Lademodus"
						multiple
						:options="chargeModeList"
						v-model="chargeLogRequestData.filter.vehicle.chargemode"
					>
						<template #help>
							Es können mehrere Elemente mit Strg ausgewählt
							werden.
						</template>
					</openwb-base-select-input>
					<openwb-base-select-input
						title="Ladepunkt"
						multiple
						:options="chargePointList"
						v-model="chargeLogRequestData.filter.chargepoint.id"
					>
						<template #help>
							Es können mehrere Elemente mit Strg ausgewählt
							werden.
						</template>
					</openwb-base-select-input>
					<openwb-base-select-input
						title="Fahrzeug"
						multiple
						:options="vehicleList"
						v-model="chargeLogRequestData.filter.vehicle.id"
					>
						<template #help>
							Es können mehrere Elemente mit Strg ausgewählt
							werden.
						</template>
					</openwb-base-select-input>
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
					class="charge-log-table"
					:is-static-mode="true"
					:columns="table.columns"
					:rows="chargeLogDataset"
					:total="totalRecordCount"
					:sortable="table.sortable"
					:messages="table.messages"
					:page-options="table.pageOptions"
					:limit="25"
				/>
				<div v-if="totalRecordCount > 0">
					<h2>Summe</h2>
					<!-- ToDo: build a table component -->
					<vue3-table-lite
						class="charge-log-totals"
						:is-static-mode="true"
						:is-hide-paging="true"
						:columns="totals.columns"
						:rows="chargeLogTotals"
						:total="1"
					/>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFilter as fasFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasFilter);

import Vue3TableLite from "vue3-table-lite";
import ComponentStateMixin from "@/components/mixins/ComponentState.vue";

export default {
	name: "OpenwbChargeLog",
	components: {
		Vue3TableLite,
		FontAwesomeIcon,
	},
	mixins: [ComponentStateMixin],
	emits: ["sendCommand"],
	data() {
		return {
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/chargepoint/+/config",
				"openWB/vehicle/+/name",
			],
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
						// rfid: [],  // still required?
						chargemode: [],
						prio: undefined,
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
						sortable: true,
					},
					{
						label: "Ende",
						field: "time_end",
						sortable: true,
					},
					{
						label: "Fahrzeug",
						field: "vehicle_name",
						sortable: true,
					},
					{
						label: "Dauer",
						field: "time_time_charged",
						sortable: true,
						display: (row) => {
							return this.alignEnd(row.time_time_charged);
						},
					},
					{
						label: "Energie",
						field: "data_charged_since_plugged_counter",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(
									row.data_charged_since_plugged_counter /
										1000,
									2
								) +
									"&nbsp;kWh / " +
									this.formatNumber(
										row.data_range_charged / 1000,
										0
									) +
									"&nbspkm"
							);
						},
					},
					{
						label: "Kosten",
						field: "data_costs",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(row.data_costs / 1000, 2) +
									"&nbsp;€"
							);
						},
					},
					{
						label: "Lademodus",
						field: "vehicle_chargemode",
						sortable: true,
						display: (row) => {
							return (
								'<div class="td-center tag ' +
								this.getChargeModeClass(
									row.vehicle_chargemode
								) +
								'">' +
								row.vehicle_chargemode +
								"</div>"
							);
						},
					},
					{
						label: "Ladepunkt",
						field: "chargepoint_name",
						sortable: true,
					},
					{
						label: "Priorität",
						field: "vehicle_prio",
						display: (row) => {
							return this.translateBool(row.vehicle_prio);
						},
					},
				],
				sortable: {
					order: "time_begin",
					sort: "asc",
				},
			},
			totals: {
				columns: [
					{
						label: "Dauer",
						field: "time_charged",
						sortable: false,
						display: (row) => {
							return this.alignEnd(row.time_charged);
						},
					},
					{
						label: "Energie",
						field: "charged_since_plugged_counter",
						sortable: false,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(
									row.charged_since_plugged_counter / 1000,
									2
								) + "&nbsp;kWh"
							);
						},
					},
					{
						label: "Reichweite",
						field: "range_charged",
						sortable: false,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(row.range_charged / 1000, 0) +
									"&nbspkm"
							);
						},
					},
					{
						label: "Kosten",
						field: "costs",
						sortable: false,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(row.costs / 1000, 2) +
									"&nbsp;€"
							);
						},
					},
				],
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
		chargeLogTotals() {
			if (
				this.$store.state.mqtt[
					"openWB/log/" + this.mqttClientId + "/data"
				]
			) {
				return [
					this.$store.state.mqtt[
						"openWB/log/" + this.mqttClientId + "/data"
					]["totals"],
				];
			} else {
				return [];
			}
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
							vehicle_chargemode: this.translateChargeMode(
								entry["vehicle"]["chargemode"]
							),
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
		chargeModeList() {
			let chargeModeList = this.chargeModes.map((mode) => {
				return {
					value: mode,
					text: this.translateChargeMode(mode),
				};
			});
			chargeModeList.unshift({
				value: undefined,
				text: "Alle",
			});
			return chargeModeList;
		},
		chargePointList() {
			let chargePoints = this.getWildcardTopics(
				"openWB/chargepoint/+/config"
			);
			var chargePointList = [{ value: undefined, text: "Alle" }];
			for (const [, element] of Object.entries(chargePoints)) {
				chargePointList.push({ value: element.id, text: element.name });
			}
			return chargePointList;
		},
		vehicleList() {
			let vehicles = this.getWildcardTopics("openWB/vehicle/+/name");
			var vehicleList = [{ value: undefined, text: "Alle" }];
			for (const [key, element] of Object.entries(vehicles)) {
				let index = parseInt(key.match(/\/([0-9]+)\/name$/)[1]);
				vehicleList.push({ value: index, text: element });
			}
			return vehicleList;
		},
	},
	methods: {
		cleanRequestData() {
			if ("id" in this.chargeLogRequestData.filter.chargepoint) {
				this.chargeLogRequestData.filter.chargepoint.id =
					this.chargeLogRequestData.filter.chargepoint.id.filter(
						(element) => element != undefined
					);
			}
			if ("chargemode" in this.chargeLogRequestData.filter.vehicle) {
				this.chargeLogRequestData.filter.vehicle.chargemode =
					this.chargeLogRequestData.filter.vehicle.chargemode.filter(
						(element) => element != undefined
					);
			}
			if ("id" in this.chargeLogRequestData.filter.vehicle) {
				this.chargeLogRequestData.filter.vehicle.id =
					this.chargeLogRequestData.filter.vehicle.id.filter(
						(element) => element != undefined
					);
			}
		},
		requestChargeLog() {
			let myForm = document.forms["chargeLogForm"];
			if (!myForm.reportValidity()) {
				console.log("form invalid");
				return;
			} else {
				this.cleanRequestData();
				this.$emit("sendCommand", {
					command: "getChargeLog",
					data: this.chargeLogRequestData,
				});
			}
		},
		alignEnd(content) {
			return '<div class="td-end">' + content + "</div>";
		},
		alignCenter(content) {
			return '<div class="td-center">' + content + "</div>";
		},
		translateBool(value) {
			let text = "Nein";
			let myClass = "bg-danger";
			if (value) {
				text = "Ja";
				myClass = "bg-success";
			}
			return (
				'<div class="td-center tag ' + myClass + '">' + text + "</div>"
			);
		},
		getChargeModeClass(value) {
			switch (value) {
				case "Sofort":
					return "bg-danger";
				case "PV":
					return "bg-success";
				case "Zielladen":
					return "bg-primary";
				case "Standby":
					return "bg-secondary";
				case "Stop":
					return "bg-dark";
				default:
					console.warn("unknown charge mode:", value);
					return "bg-light";
			}
		},
		translateHeading(value) {
			switch (value) {
				case "time_charged":
					return "Dauer";
				case "range_charged":
					return "Reichweite";
				case "charged_since_mode_switch":
					return "Energie im Lademodus";
				case "charged_since_plugged_counter":
					return "Energie seit Anstecken";
				case "power":
					return "Leistung";
				case "costs":
					return "Kosten";
				default:
					console.warn("unknown heading:", value);
					return value;
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
.charge-log-table,
.charge-log-totals {
	border: none;
	padding: 0;
}

.charge-log-table :deep(.card-body),
.charge-log-totals :deep(.card-body) {
	padding: 0;
}

.charge-log-table :deep(.dataTables_wrapper .row:nth-child(even)) {
	overflow-x: scroll;
}

:deep(.vtl-table .vtl-thead .vtl-thead-th) {
	color: var(--light);
	background-color: var(--dark);
	border-color: var(--dark);
}

:deep(.table-bordered td) {
	border-color: var(--secondary);
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

:deep(.vtl-tbody-td .td-end) {
	text-align: end;
}

:deep(.vtl-tbody-td .td-center) {
	text-align: center;
}

:deep(.tag) {
	border-radius: 10px;
	padding: 2px 5px;
}
</style>
