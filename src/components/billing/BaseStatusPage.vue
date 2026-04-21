<template>
  <div>
    <openwb-base-card>
      <template #header> Verbindung {{ titleText() }} </template>
      <openwb-base-text-input
        title="Benutzername"
        subtype="user"
        :model-value="username"
        @update:model-value="username = $event"
      >
        <template #help> Eingabefeld für Benutzernamen </template>
      </openwb-base-text-input>
      <openwb-base-text-input
        title="Passwort"
        subtype="password"
        :model-value="password"
        @update:model-value="password = $event"
      >
        <template #help> Das Passwort kann per Klick auf das Auge angezeigt werden. </template>
      </openwb-base-text-input>
      <openwb-base-button-input
        v-if="!wasConnected"
        class="mt-2"
        title=""
        :button-text="connectionState === 'loading' ? 'wird verbunden...' : 'Verbinden'"
        subtype="info"
        :disabled="connectionState === 'loading'"
        @button-clicked="fetchStatus"
      />
      <div
        v-if="wasConnected"
        class="form-row mt-3"
      >
        <div class="col-md-4"></div>

        <div class="col-md-8">
          <div class="row">
            <div class="col">
              <openwb-base-click-button
                class="btn btn-success w-100"
                :disabled="connectionState === 'loading'"
                @click="fetchStatus"
              >
                {{ connectionState === "loading" ? "wird aktualisiert..." : "Aktualisieren" }}
              </openwb-base-click-button>
            </div>

            <div class="col">
              <openwb-base-click-button
                class="btn btn-danger w-100"
                @click="disconnect"
              >
                Trennen
              </openwb-base-click-button>
            </div>
          </div>
        </div>
      </div>
    </openwb-base-card>
    <openwb-base-card title="Status">
      <openwb-base-card
        title=""
        subtype="white"
        body-bg="white"
        class="py-2"
      >
        <div class="row">
          <div class="col">Verbindungsstatus</div>
          <div class="col text-right">
            <span
              :class="
                connectionState === 'success'
                  ? 'text-success'
                  : connectionState === 'loading'
                    ? 'text-warning'
                    : 'text-danger'
              "
            >
              {{
                connectionState === "loading"
                  ? "Wird verbunden..."
                  : connectionState === "success"
                    ? "Verbunden"
                    : "Nicht verbunden"
              }}
            </span>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col">Vertragsstatus</div>
          <div class="col text-right">
            <span :class="contractActive ? 'text-success' : 'text-danger'">
              {{ contractActive ? "Aktiv" : "Inaktiv" }}
            </span>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col">Letzte Synchronisation</div>
          <div class="col text-right">
            {{ lastSync || "-" }}
          </div>
        </div>
        <hr />
        <div
          v-if="connectionState === 'success' || connectionState === 'error'"
          class="mt-3"
        >
          <openwb-base-alert :subtype="connectionState === 'error' ? 'danger' : 'success'">
            {{ connectionState === "error" ? errorMessage : "Verbindung erfolgreich" }}
          </openwb-base-alert>
        </div>
      </openwb-base-card>
    </openwb-base-card>

    <openwb-base-card
      v-if="wasConnected"
      title="Portal"
    >
      <openwb-base-card
        title=""
        subtype="white"
        body-bg="white"
        class="py-2"
      >
        <openwb-base-click-button
          class="btn btn-info w-100"
          :href="'https://wb-solution.de/produkt/mieterstromabrechnung/'"
        >
          Mieterstrom Portal öffnen
        </openwb-base-click-button>
        <openwb-base-click-button
          class="btn btn-info w-100"
          :href="contractDetails?.downloadUrl || 'https://openwb.de/main/mieterstromabrechnung-mit-openwb/'"
        >
          Abrechnung Download Portal öffnen
        </openwb-base-click-button>
      </openwb-base-card>
    </openwb-base-card>

    <openwb-base-card v-if="wasConnected && assignments.length">
      <template #header> Verbraucher -Zuordnung {{ titleText() }} </template>
      <openwb-base-card
        title=""
        subtype="white"
        body-bg="white"
        class="py-2"
      >
        <table class="table table-sm table-bordered">
          <thead>
            <tr>
              <th
                v-for="col in tableColumns"
                :key="col.label"
                :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''"
              >
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in assignments"
              :key="index"
            >
              <td
                v-for="col in tableColumns"
                :key="col.label"
                :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''"
              >
                {{ row[col.field] }}
              </td>
            </tr>
          </tbody>
        </table>
      </openwb-base-card>
    </openwb-base-card>
    <tenant-billing-shop
      v-if="billingService === 'tenant'"
      :is-connected="connectionState === 'success'"
    />
    <vehicle-billing-shop
      v-if="billingService === 'vehicle'"
      :is-connected="connectionState === 'success'"
    />
  </div>
</template>

<script>
import axios from "axios";
import TenantBillingShop from "./tenantBillingShop.vue";
import VehicleBillingShop from "./VehicleBillingShop.vue";

export default {
  name: "TenantEnergyBilling",
  components: {
    TenantBillingShop,
    VehicleBillingShop,
  },
  props: {
    billingService: { type: String, required: true },
    apiUrl: {
      type: String,
      required: false,
      default: "",
    },
    tableColumns: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      username: "",
      password: "",
      name: "",
      contractActive: false,
      lastSync: null,
      assignments: [],
      contractDetails: {},
      errorMessage: "",
      connectionState: "idle",
      wasConnected: false,
    };
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
          //this.$root.postClientMessage(this.errorMessage, "danger");
          return;
        }
        const transformed = this.transformApiData(apiResponse.data);
        this.applyStatus(transformed);
        //this.$root.postClientMessage("Verbindung erfolgreich", "success");
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
        //this.$root.postClientMessage(message, "danger");
      }
    },

    transformApiData(apiData) {
      const nameKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/name"));
      const name = apiData[nameKey] || "Unbekannt";
      const contractKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/pdftoken"));
      const contract = apiData[contractKey] || {};
      const countersKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/counters"));
      const counters = apiData[countersKey] || {};
      const lastDataKey = Object.keys(apiData).find((key) => key.includes("/stammdaten/lastdata"));
      const lastData = apiData[lastDataKey];
      const assignments = Object.entries(counters)
        .map(([key, value]) => {
          const number = key.replace("counter", "");
          return {
            device: `Zähler ${number}`,
            assigned_to: value,
            sortKey: Number(number),
          };
        })
        .sort((a, b) => a.sortKey - b.sortKey);

      return {
        name: name,
        contractActive: true, // API doesn’t provide this yet
        lastSync: lastData ? lastData * 1000 : null,
        assignments,
        contractDetails: contract,
        error: null,
      };
    },

    applyStatus(data) {
      this.name = data.name;
      this.contractActive = data.contractActive;
      this.lastSync = this.formatDate(data.lastSync);
      this.assignments = data.assignments || [];
      this.contractDetails = data.contractDetails || {};
      this.connectionState = data.error ? "error" : "success";
      this.wasConnected = !data.error;
      this.errorMessage = data.error || "";
    },

    titleText() {
      if (!this.name) {
        return "";
      }
      const clientName = this.name;
      const address = this.contractDetails?.installation;
      return `- ${clientName} - ${address}`;
    },

    formatDate(timestamp) {
      if (!timestamp) return null;
      return new Date(timestamp).toLocaleString();
    },

    clearData() {
      this.name = undefined;
      this.contractDetails = {};
      this.assignments = [];
      this.contractActive = false;
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
