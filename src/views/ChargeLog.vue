<template>
  <div class="chargeLog">
    <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
      <openwb-base-alert subtype="info">
        Das Ladeprotokoll ist nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet. Du
        findest alle Ladevorgänge in der openWB, die sich im Steuerungsmodus "primary" befindet.
      </openwb-base-alert>
    </div>
    <div v-else>
      <form name="chargeLogForm">
        <openwb-base-card title="Filter">
          <openwb-base-text-input
            v-model="chargeLogDate"
            title="Zeitraum"
            subtype="month"
            min="2018-01"
            :show-quick-buttons="true"
            :max="currentMonth"
            @update:model-value="requestChargeLog()"
          />
          <openwb-base-card
            title="Erweiterte Optionen"
            :collapsible="true"
            :collapsed="true"
          >
            <template #header>
              <font-awesome-icon :icon="['fas', 'filter']" />
              Erweiterte Optionen
            </template>
            <openwb-base-button-group-input
              v-model="chargeLogRequestData.filter.vehicle.prio"
              title="Priorität"
              :buttons="[
                {
                  buttonValue: null,
                  text: 'Alle',
                  class: 'btn-outline-info',
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
              @update:model-value="requestChargeLog()"
            />
            <openwb-base-select-input
              v-model="chargeLogRequestData.filter.vehicle.chargemode"
              title="Lademodus"
              multiple
              :options="chargeModeList"
              @update:model-value="requestChargeLog()"
            >
              <template #help> Es können mehrere Elemente ausgewählt werden. </template>
            </openwb-base-select-input>
            <openwb-base-select-input
              v-model="chargeLogRequestData.filter.chargepoint.id"
              title="Ladepunkt"
              multiple
              :options="chargePointList"
              @update:model-value="requestChargeLog()"
            >
              <template #help> Es können mehrere Elemente ausgewählt werden. </template>
            </openwb-base-select-input>
            <openwb-base-select-input
              v-model="chargeLogRequestData.filter.vehicle.id"
              title="Fahrzeug"
              multiple
              :options="vehicleList"
              @update:model-value="requestChargeLog()"
            >
              <template #help> Es können mehrere Elemente ausgewählt werden. </template>
            </openwb-base-select-input>
            <openwb-base-array-input
              v-model="chargeLogRequestData.filter.vehicle.tag"
              title="ID-Tags"
              @update:model-value="requestChargeLog()"
            >
              <template #help> Es können mehrere Tags als Filter verwendet werden. </template>
            </openwb-base-array-input>
          </openwb-base-card>
        </openwb-base-card>
        <openwb-base-alert subtype="info">
          Das Ladeprotokoll kann monatsweise automatisiert über folgende URL abgerufen werden:
          <a :href="downloadUrlMonth">{{ downloadUrlMonth }}</a> <br />
          Das komplette Ladeprotokoll für das gesamte Jahr kann automatisiert über folgende URL abgerufen werden:
          <a :href="downloadUrlYear">{{ downloadUrlYear }}</a>
        </openwb-base-alert>
        <openwb-base-alert
          v-if="!chargeLogRead"
          subtype="info"
        >
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
            :is-slot-mode="true"
          >
            <template #time_begin="data">
              {{ dashIfNotSet(data.value.time_begin) }}
            </template>
            <template #time_end="data">
              {{ dashIfNotSet(data.value.time_end) }}
            </template>
            <template #time_time_charged="data">
              <div class="td-end">
                {{ data.value.time_time_charged }}
              </div>
            </template>
            <template #data_costs="data">
              <div class="td-end">
                {{ formatCosts(data.value.data_costs) }}
              </div>
            </template>
            <template #data_power_source="data">
              <div
                v-if="data.value.data_power_source"
                class="progress td-center"
                :title="getProgressTitle(data.value.data_power_source)"
              >
                <div
                  class="progress-bar bg-danger"
                  role="progressbar"
                  :style="{
                    width: data.value.data_power_source.grid + '%',
                  }"
                  :aria-valuenow="data.value.data_power_source.grid"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
                <div
                  class="progress-bar bg-primary"
                  role="progressbar"
                  :style="{
                    width: data.value.data_power_source.cp + '%',
                  }"
                  :aria-valuenow="data.value.data_power_source.cp"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  :style="{
                    width: data.value.data_power_source.bat + '%',
                  }"
                  :aria-valuenow="data.value.data_power_source.bat"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
                <div
                  class="progress-bar bg-success"
                  role="progressbar"
                  :style="{
                    width: data.value.data_power_source.pv + '%',
                  }"
                  :aria-valuenow="data.value.data_power_source.pv"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div
                v-else
                class="td-center"
              >
                -
              </div>
            </template>
            <template #vehicle_chargemode="data">
              <div
                class="td-center tag"
                :class="getChargeModeClass(data.value.vehicle_chargemode)"
              >
                {{ data.value.vehicle_chargemode }}
              </div>
            </template>
            <template #vehicle_prio="data">
              <div
                class="td-center tag"
                :class="data.value.vehicle_prio ? 'bg-success' : 'bg-danger'"
              >
                {{ formatBool(data.value.vehicle_prio) }}
              </div>
            </template>
            <template #vehicle_rfid="data">
              {{ dashIfNotSet(data.value.vehicle_rfid) }}
            </template>
            <template #vehicle_soc_at_start="data">
              <div class="td-end">
                <span class="no-wrap">
                  {{ formatSoc(data.value.vehicle_soc_at_start) }}
                </span>
                <span class="no-wrap"> ({{ formatRange(data.value.vehicle_range_at_start) }}) </span>
              </div>
            </template>
            <template #vehicle_soc_at_end="data">
              <div class="td-end">
                <span class="no-wrap">
                  {{ formatSoc(data.value.vehicle_soc_at_end) }}
                </span>
                <span class="no-wrap"> ({{ formatRange(data.value.vehicle_range_at_end) }}) </span>
              </div>
            </template>
            <template #chargepoint_name="data">
              {{ dashIfNotSet(data.value.chargepoint_name) }}
            </template>
            <template #chargepoint_serial_number="data">
              {{ dashIfNotSet(data.value.chargepoint_serial_number) }}
            </template>
            <template #data_imported_since_mode_switch="data">
              <div class="td-end">
                <span class="no-wrap">
                  {{ formatWh(data.value.data_imported_since_mode_switch) }}
                </span>
                <span class="no-wrap"> ({{ formatRange(data.value.data_range_charged) }}) </span>
              </div>
            </template>
            <template #data_exported_since_mode_switch="data">
              <div class="td-end">
                <span class="no-wrap">
                  {{ formatWh(data.value.data_exported_since_mode_switch || 0) }}
                </span>
              </div>
            </template>
            <!-- <template #data_power="data">
              <div class="td-end">
                {{ formatW(data.value.data_power) }}
              </div>
            </template> -->
            <template #chargepoint_imported_at_start="data">
              <div class="td-end">
                {{ formatWh(data.value.chargepoint_imported_at_start) }}
              </div>
            </template>
            <template #chargepoint_imported_at_end="data">
              <div class="td-end">
                {{ formatWh(data.value.chargepoint_imported_at_end) }}
              </div>
            </template>
            <template #chargepoint_exported_at_start="data">
              <div class="td-end">
                {{ formatWh(data.value.chargepoint_exported_at_start || 0) }}
              </div>
            </template>
            <template #chargepoint_exported_at_end="data">
              <div class="td-end">
                {{ formatWh(data.value.chargepoint_exported_at_end || 0) }}
              </div>
            </template>
          </vue3-table-lite>
          <div v-if="totalRecordCount > 0">
            <div class="row justify-content-center">
              <openwb-base-click-button
                class="col-4 btn-success"
                @button-clicked="downloadChargeLog()"
              >
                Als CSV exportieren
                <font-awesome-icon :icon="['fas', 'download']" />
              </openwb-base-click-button>
              <a
                ref="downloadChargeLogLink"
                class="hide"
              />
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
              :is-slot-mode="true"
            >
              <template #time_charged="data">
                <div class="td-end">
                  {{ data.value.time_charged }}
                </div>
              </template>
              <template #imported_since_mode_switch="data">
                <div class="td-end">
                  {{ formatWh(data.value.imported_since_mode_switch) }}
                </div>
              </template>
              <template #exported_since_mode_switch="data">
                <div class="td-end">
                  {{ formatWh(data.value.exported_since_mode_switch || 0) }}
                </div>
              </template>
              <template #range_charged="data">
                <div class="td-end">
                  {{ formatRange(data.value.range_charged) }}
                </div>
              </template>
              <template #costs="data">
                <div class="td-end">
                  {{ formatCosts(data.value.costs) }}
                </div>
              </template>
            </vue3-table-lite>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFilter as fasFilter, faDownload as fasDownload } from "@fortawesome/free-solid-svg-icons";
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
      dateTimeFormat: new Intl.DateTimeFormat(undefined, {
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
            tag: [],
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
          },
          {
            label: "Ende",
            field: "time_end",
            sortable: true,
          },
          {
            label: "Dauer",
            field: "time_time_charged",
            sortable: true,
          },
          {
            label: "Kosten",
            field: "data_costs",
            sortable: true,
          },
          {
            label: "Energieaufteilung",
            field: "data_power_source",
            sortable: false,
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
          },
          {
            label: "Priorität",
            field: "vehicle_prio",
            sortable: true,
          },
          {
            label: "ID-Tag",
            field: "vehicle_rfid",
            sortable: true,
          },
          {
            label: "SoC Beginn",
            field: "vehicle_soc_at_start",
            sortable: true,
          },
          {
            label: "SoC Ende",
            field: "vehicle_soc_at_end",
            sortable: true,
          },
          {
            label: "Ladepunkt",
            field: "chargepoint_name",
            sortable: true,
          },
          {
            label: "Seriennummer",
            field: "chargepoint_serial_number",
            sortable: true,
          },
          {
            label: "Energie",
            field: "data_imported_since_mode_switch",
            sortable: true,
          },
          // {
          //   label: "Leistung",
          //   field: "data_power",
          //   sortable: true,
          // },
          {
            label: "Zähler Laden Beginn",
            field: "chargepoint_imported_at_start",
            sortable: true,
          },
          {
            label: "Zähler Laden Ende",
            field: "chargepoint_imported_at_end",
            sortable: true,
          },
          {
            label: "Entladene Energie",
            field: "data_exported_since_mode_switch",
            sortable: true,
          },
          {
            label: "Zähler Entladen Beginn",
            field: "chargepoint_exported_at_start",
            sortable: true,
          },
          {
            label: "Zähler Entladen Ende",
            field: "chargepoint_exported_at_end",
            sortable: true,
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
          },
          {
            label: "Energie",
            field: "imported_since_mode_switch",
            sortable: false,
          },
          {
            label: "Entladene Energie",
            field: "exported_since_mode_switch",
            sortable: false,
          },
          {
            label: "Reichweite",
            field: "range_charged",
            sortable: false,
          },
          {
            label: "Kosten",
            field: "costs",
            sortable: false,
          },
        ],
      },
    };
  },
  computed: {
    mqttClientId() {
      return this.$root.mqttClientId;
    },
    baseUrl() {
      const port = parseInt(location.port) || (location.protocol === "https:" ? 443 : 80);
      return `${location.protocol}//${location.hostname}:${port}/openWB/web/settings/downloadChargeLog.php`;
    },
    downloadUrlMonth() {
      if (!this.chargeLogRequestData.year || !this.chargeLogRequestData.month) {
        return null;
      }
      return `${this.baseUrl}?year=${this.chargeLogRequestData.year}&month=${this.chargeLogRequestData.month}`;
    },
    downloadUrlYear() {
      if (!this.chargeLogRequestData.year) {
        return null;
      }
      return `${this.baseUrl}?year=${this.chargeLogRequestData.year}`;
    },
    chargeLogDate: {
      get() {
        return this.chargeLogRequestData.year + "-" + this.chargeLogRequestData.month;
      },
      set(newValue) {
        let splitDate = newValue.split("-");
        this.chargeLogRequestData.year = splitDate[0];
        this.chargeLogRequestData.month = splitDate[1];
      },
    },
    chargeLogTotals() {
      if (this.$store.state.mqtt["openWB/log/" + this.mqttClientId + "/data"]) {
        return [this.$store.state.mqtt["openWB/log/" + this.mqttClientId + "/data"]["totals"]];
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
        if (this.$store.state.mqtt["openWB/log/" + this.mqttClientId + "/data"] == undefined) {
          return [];
        }
        try {
          return this.$store.state.mqtt["openWB/log/" + this.mqttClientId + "/data"]["entries"].map((entry) => {
            // ToDo: timestamps should already be in unix timestamp format from backend
            var timestamp_begin = Date.parse(entry["time"]["begin"]);
            var timestamp_end = Date.parse(entry["time"]["end"]);
            return {
              chargepoint_id: entry["chargepoint"]["id"],
              chargepoint_name: entry["chargepoint"]["name"],
              chargepoint_imported_at_start: entry["chargepoint"]["imported_at_start"],
              chargepoint_imported_at_end: entry["chargepoint"]["imported_at_end"],
              chargepoint_exported_at_start: entry["chargepoint"]["exported_at_start"],
              chargepoint_exported_at_end: entry["chargepoint"]["exported_at_end"],
              chargepoint_serial_number: entry["chargepoint"]["serial_number"],
              vehicle_id: entry["vehicle"]["id"],
              vehicle_name: entry["vehicle"]["name"],
              vehicle_chargemode: this.translateChargeMode(entry["vehicle"]["chargemode"]),
              vehicle_rfid: entry["vehicle"]["rfid"],
              vehicle_prio: entry["vehicle"]["prio"],
              vehicle_soc_at_start: entry["vehicle"]["soc_at_start"],
              vehicle_soc_at_end: entry["vehicle"]["soc_at_end"],
              vehicle_range_at_start: entry["vehicle"]["range_at_start"],
              vehicle_range_at_end: entry["vehicle"]["range_at_end"],
              timestamp_begin: timestamp_begin / 1000,
              time_begin: isNaN(timestamp_begin) ? null : this.dateTimeFormat.format(new Date(timestamp_begin)),
              timestamp_end: timestamp_end / 1000,
              time_end: isNaN(timestamp_end) ? null : this.dateTimeFormat.format(new Date(timestamp_end)),
              time_time_charged: entry["time"]["time_charged"],
              // data_power: entry["data"]["power"],
              data_power_source: entry["data"]["power_source"]
                ? {
                    pv: entry["data"]["power_source"]["pv"] * 100,
                    grid: entry["data"]["power_source"]["grid"] * 100,
                    bat: entry["data"]["power_source"]["bat"] * 100,
                    cp: entry["data"]["power_source"]["cp"] * 100,
                  }
                : undefined,
              data_range_charged: entry["data"]["range_charged"],
              data_costs: entry["data"]["costs"],
              data_imported_since_plugged: entry["data"]["imported_since_plugged"],
              data_imported_since_mode_switch: entry["data"]["imported_since_mode_switch"],
              data_exported_since_plugged: entry["data"]["exported_since_plugged"],
              data_exported_since_mode_switch: entry["data"]["exported_since_mode_switch"],
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
            '"Beginn"',
            '"Ende"',
            '"Zeitstempel Beginn"',
            '"Zeitstempel Ende"',
            '"Dauer"',
            '"Kosten"',
            '"Energieanteil Netz"',
            '"Energieanteil Ladepunkte"',
            '"Energieanteil Speicher"',
            '"Energieanteil PV"',
            '"Fahrzeug"',
            '"Fahrzeug-ID"',
            '"Lademodus"',
            '"Priorität"',
            '"ID-Tag"',
            '"SoC Beginn"',
            '"SoC Ende"',
            '"Reichweite Beginn"',
            '"Reichweite Ende"',
            '"Ladepunkt"',
            '"Ladepunkt-ID"',
            '"Zähler Seriennummer"',
            '"Geladene Energie"',
            '"Entladene Energie"',
            '"Reichweite"',
            // '"Leistung"',
            '"Zählerstand Laden Beginn"',
            '"Zählerstand Laden Ende"',
            '"Zählerstand Entladen Beginn"',
            '"Zählerstand Entladen Ende"',
            '"Energie seit Anstecken"',
            '"Entladene Energie seit Anstecken"',
          ],
          ...this.chargeLogDataset.map((row) => [
            row.time_begin == undefined ? "" : '"' + row.time_begin + '"',
            row.time_end == undefined ? "" : '"' + row.time_end + '"',
            row.timestamp_begin == undefined || isNaN(row.timestamp_begin) ? "" : row.timestamp_begin,
            row.timestamp_end == undefined || isNaN(row.timestamp_end) ? "" : row.timestamp_end,
            '"' + row.time_time_charged + '"',
            this.formatCosts(row.data_costs, false),
            row.data_power_source == undefined ? "" : this.formatNumber(row.data_power_source.grid, 2),
            row.data_power_source == undefined ? "" : this.formatNumber(row.data_power_source.cp, 2),
            row.data_power_source == undefined ? "" : this.formatNumber(row.data_power_source.bat, 2),
            row.data_power_source == undefined ? "" : this.formatNumber(row.data_power_source.pv, 2),
            '"' + row.vehicle_name + '"',
            row.vehicle_id,
            '"' + row.vehicle_chargemode + '"',
            '"' + this.formatBool(row.vehicle_prio) + '"',
            row.vehicle_rfid == undefined ? "" : '"' + row.vehicle_rfid + '"',
            row.vehicle_soc_at_start == undefined ? "" : this.formatNumber(row.vehicle_soc_at_start, 0),
            row.vehicle_soc_at_end == undefined ? "" : this.formatNumber(row.vehicle_soc_at_end, 0),
            row.vehicle_range_at_start == undefined ? "" : this.formatNumber(row.vehicle_range_at_start, 0),
            row.vehicle_range_at_end == undefined ? "" : this.formatNumber(row.vehicle_range_at_end, 0),
            '"' + row.chargepoint_name + '"',
            row.chargepoint_id,
            row.chargepoint_serial_number == undefined ? "" : '"' + row.chargepoint_serial_number + '"',
            this.formatNumber(row.data_imported_since_mode_switch / 1000, 2),
            this.formatNumber((row.data_exported_since_mode_switch || 0) / 1000, 2),
            this.formatNumber(row.data_range_charged, 0),
            // this.formatNumber(row.data_power / 1000, 3),
            this.formatNumber(row.chargepoint_imported_at_start / 1000, 2),
            this.formatNumber(row.chargepoint_imported_at_end / 1000, 2),
            this.formatNumber((row.chargepoint_exported_at_start || 0) / 1000, 2),
            this.formatNumber((row.chargepoint_exported_at_end || 0) / 1000, 2),
            this.formatNumber(row.data_imported_since_plugged / 1000, 2),
            this.formatNumber((row.data_exported_since_plugged || 0) / 1000, 2),
          ]),
        ]
          .map((element) => element.join(";"))
          .join("\n");
        return csvString + "\n";
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
      let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
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
  beforeMount() {
    // we need access to the mqttClientId which is not yet available in the data section
    this.mqttTopicsToSubscribe.push("openWB/log/" + this.mqttClientId + "/data");
  },
  mounted() {
    const today = new Date();
    this.currentMonth = this.chargeLogDate = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");
    this.requestChargeLog();
  },
  methods: {
    cleanRequestData() {
      if ("id" in this.chargeLogRequestData.filter.chargepoint) {
        this.chargeLogRequestData.filter.chargepoint.id = this.chargeLogRequestData.filter.chargepoint.id.filter(
          (element) => element != undefined,
        );
      }
      if ("chargemode" in this.chargeLogRequestData.filter.vehicle) {
        this.chargeLogRequestData.filter.vehicle.chargemode =
          this.chargeLogRequestData.filter.vehicle.chargemode.filter((element) => element != undefined);
      }
      if ("id" in this.chargeLogRequestData.filter.vehicle) {
        this.chargeLogRequestData.filter.vehicle.id = this.chargeLogRequestData.filter.vehicle.id.filter(
          (element) => element != undefined,
        );
      }
      if ("prio" in this.chargeLogRequestData.filter.vehicle) {
        if (this.chargeLogRequestData.filter.vehicle.prio === null) {
          this.chargeLogRequestData.filter.vehicle.prio = undefined;
        }
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
      this.$refs.downloadChargeLogLink.setAttribute("download", "Ladeprotokoll-" + this.chargeLogDate + ".csv");
      this.$refs.downloadChargeLogLink.href = this.makeTextFile(this.chargeLogCsv);
      this.$refs.downloadChargeLogLink.dispatchEvent(new MouseEvent("click"));
    },
    addClasses(fieldName) {
      if (
        this.$store.state.mqtt["openWB/general/charge_log_data_config"] !== undefined &&
        Object.hasOwn(this.$store.state.mqtt["openWB/general/charge_log_data_config"], fieldName)
      ) {
        return this.$store.state.mqtt["openWB/general/charge_log_data_config"][fieldName] ? [] : ["d-none"];
      }
      return [];
    },
    getProgressTitle(powerSource) {
      return (
        `Netz: ${this.formatNumber(powerSource.grid, 0, 0)}%, ` +
        `Ladepunkte: ${this.formatNumber(powerSource.cp, 0, 0)}%, ` +
        `Speicher: ${this.formatNumber(powerSource.bat, 0, 0)}%, ` +
        `PV: ${this.formatNumber(powerSource.pv, 0, 0)}%`
      );
    },
    formatBool(value) {
      return value ? "Ja" : "Nein";
    },
    formatW(value, unit = true) {
      let energy = this.dashIfNotSet(this.formatNumber(value / 1000, 2));
      return unit ? energy + "kW" : energy;
    },
    formatWh(value, unit = true) {
      let energy = this.dashIfNotSet(this.formatNumber(value / 1000, 2));
      return unit ? energy + "kWh" : energy;
    },
    formatRange(value, unit = true) {
      let range = this.dashIfNotSet(this.formatNumber(value, 0));
      return unit ? range + "km" : range;
    },
    formatSoc(soc, unit = true) {
      let value = this.dashIfNotSet(this.formatNumber(soc, 0));
      return unit ? value + "%" : value;
    },
    formatCosts(value, unit = true) {
      let costs = this.dashIfNotSet(this.formatNumber(value, 2));
      return unit ? costs + "€" : costs;
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
        case "Eco":
        case "Standby": // keep for backward compatibility!
          return "bg-secondary";
        case "Stop":
          return "bg-dark";
        default:
          console.warn("unknown charge mode:", value);
          return "bg-light";
      }
    },
  },
};
</script>

<style scoped>
.hide {
  display: none;
}

.no-wrap {
  white-space: nowrap;
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
