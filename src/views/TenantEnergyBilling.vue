<template>
  <base-status-page
    billing-service="tenant"
    :username="username"
    :password="password"
    :connection-state="connectionState"
    :contract-status="contractStatus"
    :last-sync="lastSync"
    :assignments="assignments"
    :contract-details="contractDetails"
    :error-message="errorMessage"
    :was-connected="wasConnected"
    :table-columns="[
      { label: 'Zähler', field: 'device' },
      { label: 'Zugeordnet zu', field: 'assigned_to', align: 'right' },
    ]"
    :title-text="titleText"
    @connect="fetchStatus"
    @disconnect="disconnect"
    @update:username="username = $event"
    @update:password="password = $event"
  />
</template>

<script>
import axios from "axios";
import BaseStatusPage from "../components/billing/BaseStatusPage.vue";
import ComponentState from "../components/mixins/ComponentState.vue";
export default {
  components: {
    BaseStatusPage,
  },
  mixins: [ComponentState],
  data() {
    return {
      apiUrl: "https://mieterstrom-management.wb-solution.de/api/v1/mieterstrom-main",
      mqttTopics: [{ topic: "openWB/system/device/+/component/+/config", writeable: false }],
      username: "",
      password: "",
      name: "",
      contractStatus: "",
      lastSync: "",
      rawAssignments: [],
      contractDetails: {},
      errorMessage: "",
      // connection states: idle, loading, success, error
      connectionState: "idle",
      wasConnected: false,
    };
  },
  computed: {
    assignments() {
      return this.rawAssignments
        .map(([key, value]) => {
          const match = key.match(/\d+/);
          const number = match ? Number(match[0]) : null;
          const mqttName = this.counterNameMap[number];
          return {
            device: this.getCounterDisplayName(key, mqttName),
            assigned_to: value,
            sortKey: number ?? 9999,
          };
        })
        .sort((a, b) => a.sortKey - b.sortKey);
    },

    counterNameMap() {
      const topics = this.getWildcardTopics("openWB/system/device/+/component/+/config");
      const map = {};
      Object.values(topics).forEach((payload) => {
        if (payload?.type === "counter") {
          map[payload.id] = payload.name;
        }
      });
      return map;
    },

    titleText() {
      if (!this.name) {
        return "";
      }
      const clientName = this.name;
      const address = this.contractDetails?.installation;
      return `- ${clientName} - ${address}`;
    },
  },
  methods: {
    async fetchStatus() {
      this.connectionState = "loading";
      try {
        const response = await axios.post(this.apiUrl, {
          username: this.username,
          password: this.password,
        });
        const apiResponse = response.data;
        if (!apiResponse.success) {
          this.errorMessage = apiResponse.error || "Login fehlgeschlagen";
          this.connectionState = "error";
          this.clearData();
          return;
        }
        const transformed = this.transformApiData(apiResponse.data);
        this.applyStatus(transformed);
      } catch (error) {
        console.error(error);
        let message = "Serverfehler";
        if (error.response?.data?.error) {
          message = error.response.data.error;
        } else if (error.message) {
          message = error.message;
        }
        this.errorMessage = message;
        this.connectionState = "error";
        this.clearData();
      }
    },

    transformApiData(apiData) {
      const nameKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/name"));
      const name = apiData[nameKey] || "Unbekannt";
      const contractKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/pdftoken"));
      const contract = apiData[contractKey] || {};
      const contractStatus = apiData.contract_active;
      const lastDataKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/lastdata"));
      const lastData = apiData[lastDataKey];
      const countersKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/counters"));
      const counters = apiData[countersKey] || {};
      return {
        name: name,
        contractStatus: contractStatus,
        lastSync: lastData ? lastData * 1000 : null,
        counters: counters,
        contractDetails: contract,
        error: null,
      };
    },

    getCounterDisplayName(key, mqttName) {
      const numberMatch = key.match(/\d+/);
      const number = numberMatch ? Number(numberMatch[0]) : null;
      if (mqttName && number !== null) {
        return `Zähler ${number}: ${mqttName}`;
      }
      if (number !== null) {
        return `Zähler ${number}`;
      }
      return key;
    },

    applyStatus(data) {
      this.name = data.name;
      this.contractStatus = data.contractStatus;
      this.lastSync = this.formatDate(data.lastSync);
      this.rawAssignments = Object.entries(data.counters || {});
      this.contractDetails = data.contractDetails || {};
      this.connectionState = data.error ? "error" : "success";
      this.wasConnected = !data.error;
      this.errorMessage = data.error || "";
    },

    formatDate(timestamp) {
      if (!timestamp) return null;
      return new Date(timestamp).toLocaleString();
    },

    clearData() {
      this.name = undefined;
      this.contractStatus = "";
      this.rawAssignments = [];
      this.contractDetails = {};
      this.lastSync = null;
    },

    disconnect() {
      this.connectionState = "idle";
      this.wasConnected = false;
      this.errorMessage = "";
      this.password = "";
      this.clearData();
    },
  },
};
</script>
