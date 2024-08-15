<template>
	<div class="chargeLog">
		<form name="chargeLogForm">
			<openwb-base-card title="Filter">
				<openwb-base-text-input
					title="Zeitraum"
					subtype="month"
					min="2018-01"
					:showQuickButtons="true"
					:max="currentMonth"
					v-model="chargeLogDate"
					@update:model-value="requestChargeLog()"
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
								text: 'Nein',
								class: 'btn-outline-danger',
							},
							{
								buttonValue: true,
								text: 'Ja',
								class: 'btn-outline-success',
							},
						]"
						v-model="chargeLogRequestData.filter.vehicle.prio"
						@update:model-value="requestChargeLog()"
					/>
					<openwb-base-select-input
						title="Lademodus"
						multiple
						:options="chargeModeList"
						v-model="chargeLogRequestData.filter.vehicle.chargemode"
						@update:model-value="requestChargeLog()"
					>
						<template #help>
							Es können mehrere Elemente ausgewählt werden.
						</template>
					</openwb-base-select-input>
					<openwb-base-select-input
						title="Ladepunkt"
						multiple
						:options="chargePointList"
						v-model="chargeLogRequestData.filter.chargepoint.id"
						@update:model-value="requestChargeLog()"
					>
						<template #help>
							Es können mehrere Elemente ausgewählt werden.
						</template>
					</openwb-base-select-input>
					<openwb-base-select-input
						title="Fahrzeug"
						multiple
						:options="vehicleList"
						v-model="chargeLogRequestData.filter.vehicle.id"
						@update:model-value="requestChargeLog()"
					>
						<template #help>
							Es können mehrere Elemente ausgewählt werden.
						</template>
					</openwb-base-select-input>
					<openwb-base-array-input
						title="ID-Tags"
						v-model="chargeLogRequestData.filter.vehicle.tag"
						@update:model-value="requestChargeLog()"
					>
						<template #help>
							Es können mehrere Tags als Filter verwendet werden.
						</template>
					</openwb-base-array-input>
				</openwb-base-card>
			</openwb-base-card>
			<openwb-base-alert subtype="info">
				Das komplette Ladeprotokoll kann automatisiert über folgende URL
				abgerufen werden:
				<a :href="downloadUrl">{{ downloadUrl }}</a>
			</openwb-base-alert>
			<openwb-base-alert v-if="!chargeLogRead" subtype="info">
				Es wurden noch keine Daten abgerufen.
			</openwb-base-alert>
			<div v-else>
				<vue3-table-lite
					class="charge-log-table"
					:is-static-mode="true"
					:columns="chargeLogColumns"
					:rows="chargeLogDataset"
					:total="totalRecordCount"
					:sortable="table.sortable"
					:messages="table.messages"
					:page-options="table.pageOptions"
					:limit="25"
				/>
				<div v-if="totalRecordCount > 0">
					<div class="row justify-content-center">
						<openwb-base-click-button
							class="col-4 btn-success"
							@buttonClicked="downloadChargeLog()"
						>
							Als CSV exportieren
							<font-awesome-icon
								fixed-width
								:icon="['fas', 'download']"
							/>
						</openwb-base-click-button>
						<a class="hide" ref="downloadChargeLogLink"></a>
					</div>
					<div class="row">
						<div class="col">
							<h2>Summe</h2>
						</div>
					</div>
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
import {
	faFilter as fasFilter,
	faDownload as fasDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasFilter, fasDownload);

import Vue3TableLite from "vue3-table-lite";
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
	name: "OpenwbChargeLogView",
	components: {
		Vue3TableLite,
		FontAwesomeIcon,
	},
	mixins: [ComponentState],
	emits: ["sendCommand"],
	data() {
		return {
			dateTimeFormat: new Intl.DateTimeFormat("de-DE", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			}),
			mqttTopicsToSubscribe: [
				"openWB/general/extern",
				"openWB/general/charge_log_data_config",
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
						rfid: [],
						chargemode: [],
						prio: undefined,
					},
				},
			},
			downloadFile: null,
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
						display: (row) => {
							return this.dashIfNotSet(row.time_begin);
						},
					},
					{
						label: "Ende",
						field: "time_end",
						sortable: true,
						display: (row) => {
							return this.dashIfNotSet(row.time_end);
						},
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
						label: "Kosten",
						field: "data_costs",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(row.data_costs, 2) +
									"&nbsp;€",
							);
						},
					},
					{
						label: "Energieaufteilung",
						field: "data_power_source",
						sortable: false,
						display: (row) => {
							if (row.data_power_source == undefined) {
								return "";
							}
							return this.alignCenter(
								'<div class="progress"' +
									'title="Netz: ' +
									this.formatNumber(
										row.data_power_source.grid,
										0,
										0,
										100,
									) +
									"%, Ladepunkte: " +
									this.formatNumber(
										row.data_power_source.cp,
										0,
										0,
										100,
									) +
									"%, Speicher: " +
									this.formatNumber(
										row.data_power_source.bat,
										0,
										0,
										100,
									) +
									"%, PV: " +
									this.formatNumber(
										row.data_power_source.pv,
										0,
										0,
										100,
									) +
									'%">' +
									'<div class="progress-bar bg-danger" role="progressbar" style="width: ' +
									row.data_power_source.grid * 100 +
									'%" aria-valuenow="' +
									row.data_power_source.grid * 100 +
									'" aria-valuemin="0" aria-valuemax="100">' +
									"</div>" +
									'<div class="progress-bar bg-primary" role="progressbar" style="width: ' +
									row.data_power_source.cp * 100 +
									'%" aria-valuenow="' +
									row.data_power_source.cp * 100 +
									'" aria-valuemin="0" aria-valuemax="100">' +
									"</div>" +
									'<div class="progress-bar bg-warning" role="progressbar" style="width: ' +
									row.data_power_source.bat * 100 +
									'%" aria-valuenow="' +
									row.data_power_source.bat * 100 +
									'" aria-valuemin="0" aria-valuemax="100">' +
									"</div>" +
									'<div class="progress-bar bg-success" role="progressbar" style="width: ' +
									row.data_power_source.pv * 100 +
									'%" aria-valuenow="' +
									row.data_power_source.pv * 100 +
									'" aria-valuemin="0" aria-valuemax="100">' +
									"</div>" +
									"</div>",
							);
						},
					},
					{
						label: "Fahrzeug",
						field: "vehicle_name",
						sortable: true,
					},
					{
						label: "Lademodus",
						field: "vehicle_chargemode",
						sortable: true,
						display: (row) => {
							return (
								'<div class="td-center tag ' +
								this.getChargeModeClass(
									row.vehicle_chargemode,
								) +
								'">' +
								row.vehicle_chargemode +
								"</div>"
							);
						},
					},
					{
						label: "Priorität",
						field: "vehicle_prio",
						display: (row) => {
							return this.translateBool(row.vehicle_prio);
						},
					},
					{
						label: "ID-Tag",
						field: "vehicle_rfid",
						sortable: true,
						display: (row) => {
							return this.dashIfNotSet(row.vehicle_rfid);
						},
					},
					{
						label: "SoC Beginn",
						field: "vehicle_soc_at_start",
						sortable: true,
						display: (row) => {
							return (
								this.dashIfNotSet(
									this.formatNumber(
										row.vehicle_soc_at_start,
										0,
									),
								) +
								"&nbsp;% / " +
								this.dashIfNotSet(
									this.formatNumber(
										row.vehicle_range_at_start,
										0,
									),
								) +
								"&nbsp;km"
							);
						},
					},
					{
						label: "SoC Ende",
						field: "vehicle_soc_at_end",
						sortable: true,
						display: (row) => {
							return (
								this.dashIfNotSet(
									this.formatNumber(
										row.vehicle_soc_at_end,
										0,
									),
								) +
								"&nbsp;% / " +
								this.dashIfNotSet(
									this.formatNumber(
										row.vehicle_range_at_end,
										0,
									),
								) +
								"&nbsp;km"
							);
						},
					},
					{
						label: "Ladepunkt",
						field: "chargepoint_name",
						sortable: true,
						display: (row) => {
							return this.dashIfNotSet(row.chargepoint_name);
						},
					},
					{
						label: "Seriennummer",
						field: "chargepoint_serial_number",
						sortable: true,
						display: (row) => {
							return this.dashIfNotSet(
								row.chargepoint_serial_number,
							);
						},
					},
					{
						label: "Energie",
						field: "data_imported_since_mode_switch",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(
									row.data_imported_since_mode_switch / 1000,
									2,
								) +
									"&nbsp;kWh / " +
									this.formatNumber(
										row.data_range_charged,
										0,
									) +
									"&nbsp;km",
							);
						},
					},
					{
						label: "Leistung",
						field: "data_power",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.dashIfNotSet(
									this.formatNumber(
										row.data_power / 1000,
										3,
										3,
									),
								) + "&nbsp;kW",
							);
						},
					},
					{
						label: "Zähler Beginn",
						field: "chargepoint_imported_at_start",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.dashIfNotSet(
									this.formatNumber(
										row.chargepoint_imported_at_start /
											1000,
										2,
									),
								) + "&nbsp;kWh",
							);
						},
					},
					{
						label: "Zähler Ende",
						field: "chargepoint_imported_at_end",
						sortable: true,
						display: (row) => {
							return this.alignEnd(
								this.dashIfNotSet(
									this.formatNumber(
										row.chargepoint_imported_at_end / 1000,
										2,
									),
								) + "&nbsp;kWh",
							);
						},
					},
				],
				sortable: {
					order: "timestamp_begin",
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
						field: "imported_since_mode_switch",
						sortable: false,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(
									row.imported_since_mode_switch / 1000,
									2,
								) + "&nbsp;kWh",
							);
						},
					},
					{
						label: "Reichweite",
						field: "range_charged",
						sortable: false,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(row.range_charged, 0) +
									"&nbsp;km",
							);
						},
					},
					{
						label: "Kosten",
						field: "costs",
						sortable: false,
						display: (row) => {
							return this.alignEnd(
								this.formatNumber(row.costs, 2) + "&nbsp;€",
							);
						},
					},
				],
			},
		};
	},
	computed: {
		mqttClientId() {
			return this.$root.mqttClientId;
		},
		downloadUrl() {
			const port =
				parseInt(location.port) ||
				(location.protocol == "https:" ? 443 : 80);
			const baseUrl = `${location.protocol}//${location.hostname}:${port}/openWB/web/settings/downloadChargeLog.php`;
			return (
				baseUrl +
				`?year=${this.chargeLogRequestData.year}&month=${this.chargeLogRequestData.month}`
			);
		},
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
		chargeLogColumns() {
			return this.table.columns.map((column) => {
				return {
					...column,
					headerClasses: this.addClasses(column.field),
					columnClasses: this.addClasses(column.field),
				};
			});
		},
		chargeLogDataset: {
			get() {
				if (
					this.$store.state.mqtt[
						"openWB/log/" + this.mqttClientId + "/data"
					] == undefined
				) {
					return [];
				}
				try {
					return this.$store.state.mqtt[
						"openWB/log/" + this.mqttClientId + "/data"
					]["entries"].map((entry) => {
						// ToDo: timestamps should already be in unix timestamp format from backend
						var timestamp_begin = Date.parse(
							entry["time"]["begin"],
						);
						var timestamp_end = Date.parse(entry["time"]["end"]);
						return {
							chargepoint_id: entry["chargepoint"]["id"],
							chargepoint_name: entry["chargepoint"]["name"],
							chargepoint_imported_at_start:
								entry["chargepoint"]["imported_at_start"],
							chargepoint_imported_at_end:
								entry["chargepoint"]["imported_at_end"],
							chargepoint_serial_number:
								entry["chargepoint"]["serial_number"],
							vehicle_id: entry["vehicle"]["id"],
							vehicle_name: entry["vehicle"]["name"],
							vehicle_chargemode: this.translateChargeMode(
								entry["vehicle"]["chargemode"],
							),
							vehicle_rfid: entry["vehicle"]["rfid"],
							vehicle_prio: entry["vehicle"]["prio"],
							vehicle_soc_at_start:
								entry["vehicle"]["soc_at_start"],
							vehicle_soc_at_end: entry["vehicle"]["soc_at_end"],
							vehicle_range_at_start:
								entry["vehicle"]["range_at_start"],
							vehicle_range_at_end:
								entry["vehicle"]["range_at_end"],
							timestamp_begin: timestamp_begin / 1000,
							time_begin: isNaN(timestamp_begin)
								? null
								: this.dateTimeFormat.format(
										new Date(timestamp_begin),
									),
							timestamp_end: timestamp_end / 1000,
							time_end: isNaN(timestamp_end)
								? null
								: this.dateTimeFormat.format(
										new Date(timestamp_end),
									),
							time_time_charged: entry["time"]["time_charged"],
							data_power: entry["data"]["power"],
							data_power_source: entry["data"]["power_source"]
								? {
										pv: entry["data"]["power_source"]["pv"],
										grid: entry["data"]["power_source"][
											"grid"
										],
										bat: entry["data"]["power_source"][
											"bat"
										],
										cp: entry["data"]["power_source"]["cp"],
									}
								: undefined,
							data_range_charged: entry["data"]["range_charged"],
							data_costs: entry["data"]["costs"],
							data_imported_since_plugged:
								entry["data"]["imported_since_plugged"],
							data_imported_since_mode_switch:
								entry["data"]["imported_since_mode_switch"],
						};
					});
				} catch (error) {
					console.error(error);
					return [];
				}
			},
		},
		chargeLogCsv: {
			get() {
				const csvString = [
					[
						"Ladepunkt-ID",
						"Ladepunkt",
						"Fahrzeug-ID",
						"Fahrzeug",
						"Lademodus",
						"Priorität",
						"ID-Tag",
						"Beginn",
						"Ende",
						"Zeitstempel Beginn",
						"Zeitstempel Ende",
						"Dauer",
						"Leistung",
						"Energie",
						"Reichweite",
						"Kosten",
					],
					...this.chargeLogDataset.map((row) => [
						row.chargepoint_id,
						'"' + row.chargepoint_name + '"',
						row.vehicle_id,
						'"' + row.vehicle_name + '"',
						'"' + row.vehicle_chargemode + '"',
						'"' + this.translateBool(row.vehicle_prio, false) + '"',
						'"' + row.vehicle_rfid + '"',
						'"' + row.time_begin + '"',
						'"' + row.time_end + '"',
						'"' + row.timestamp_begin + '"',
						'"' + row.timestamp_end + '"',
						'"' + row.time_time_charged + '"',
						this.formatNumber(row.data_power / 1000, 3),
						this.formatNumber(
							row.data_imported_since_mode_switch / 1000,
							2,
						),
						this.formatNumber(row.data_range_charged, 0),
						this.formatNumber(row.data_costs, 2),
					]),
				]
					.map((element) => element.join(";"))
					.join("\n");
				return csvString;
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
				"openWB/chargepoint/+/config",
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
						(element) => element != undefined,
					);
			}
			if ("chargemode" in this.chargeLogRequestData.filter.vehicle) {
				this.chargeLogRequestData.filter.vehicle.chargemode =
					this.chargeLogRequestData.filter.vehicle.chargemode.filter(
						(element) => element != undefined,
					);
			}
			if ("id" in this.chargeLogRequestData.filter.vehicle) {
				this.chargeLogRequestData.filter.vehicle.id =
					this.chargeLogRequestData.filter.vehicle.id.filter(
						(element) => element != undefined,
					);
			}
		},
		requestChargeLog() {
			let myForm = document.forms["chargeLogForm"];
			if (!myForm.reportValidity()) {
				console.warn("form invalid");
				return;
			} else {
				this.cleanRequestData();
				this.$emit("sendCommand", {
					command: "getChargeLog",
					data: this.chargeLogRequestData,
				});
			}
		},
		makeTextFile(content) {
			var data = new Blob([content], { type: "text/csv" });
			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (this.downloadFile !== null) {
				window.URL.revokeObjectURL(this.downloadFile);
			}
			this.downloadFile = window.URL.createObjectURL(data);
			return this.downloadFile;
		},
		downloadChargeLog() {
			// based on: http://jsfiddle.net/k56eezxp/
			this.$refs.downloadChargeLogLink.setAttribute(
				"download",
				"Ladeprotokoll-" + this.chargeLogDate + ".csv",
			);
			this.$refs.downloadChargeLogLink.href = this.makeTextFile(
				this.chargeLogCsv,
			);
			this.$refs.downloadChargeLogLink.dispatchEvent(
				new MouseEvent("click"),
			);
		},
		addClasses(fieldName) {
			if (
				this.$store.state.mqtt[
					"openWB/general/charge_log_data_config"
				] !== undefined &&
				Object.hasOwn(
					this.$store.state.mqtt[
						"openWB/general/charge_log_data_config"
					],
					fieldName,
				)
			) {
				return this.$store.state.mqtt[
					"openWB/general/charge_log_data_config"
				][fieldName]
					? []
					: ["d-none"];
			}
			return [];
		},
		alignEnd(content) {
			return '<div class="td-end">' + content + "</div>";
		},
		alignCenter(content) {
			return '<div class="td-center">' + content + "</div>";
		},
		translateBool(value, withDiv = true) {
			let text = "Nein";
			let myClass = "bg-danger";
			if (value) {
				text = "Ja";
				myClass = "bg-success";
			}
			if (withDiv) {
				return (
					'<div class="td-center tag ' +
					myClass +
					'">' +
					text +
					"</div>"
				);
			}
			return text;
		},
		dashIfNotSet(value) {
			if (value == undefined || value == "" || value == null) {
				return "-";
			}
			return value;
		},
		getChargeModeClass(value) {
			switch (value) {
				case "Sofort":
					return "bg-danger";
				case "PV":
					return "bg-success";
				case "Zielladen":
					return "bg-primary";
				case "Zeitladen":
					return "bg-warning";
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
				case "imported_since_mode_switch":
					return "Energie im Lademodus";
				case "imported_since_plugged":
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
	beforeMount() {
		// we need access to the mqttClientId which is not yet available in the data section
		this.mqttTopicsToSubscribe.push(
			"openWB/log/" + this.mqttClientId + "/data",
		);
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
.hide {
	display: none;
}

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

:deep(.vtl-card-body .vtl-row:first-child > div) {
	padding-left: 0px;
	padding-right: 0px;
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

:deep(.progress) {
	height: 2rem;
}

:deep(.progress-bar.bg-warning) {
	color: #000;
}
</style>
