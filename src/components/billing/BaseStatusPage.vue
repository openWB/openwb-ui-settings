<template>
  <div>
    <openwb-base-card title="Verbindung">
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
        v-if="!isConnected"
        class="mt-2"
        title=""
        button-text="Verbinden"
        subtype="info"
        @button-clicked="fetchStatus"
      />
      <div
        v-if="isConnected"
        class="form-row mt-3"
      >
        <div class="col-md-4"></div>

        <div class="col-md-8">
          <div class="row">
            <div class="col">
              <openwb-base-click-button
                class="btn btn-success w-100"
                @click="fetchStatus"
              >
                Aktualisieren
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
            <span :class="isConnected ? 'text-success' : 'text-danger'">
              {{ isConnected ? "Verbunden" : "Nicht verbunden" }}
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
        <div class="mt-3">
          <openwb-base-alert :subtype="hasError ? 'danger' : 'success'">
            {{ hasError ? errorMessage : "Keine Fehlermeldung" }}
          </openwb-base-alert>
        </div>
      </openwb-base-card>
    </openwb-base-card>

    <openwb-base-card
      v-if="isConnected"
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
          :href="portalLinks[0]?.url || 'https://wb-solution.de/produkt/mieterstromabrechnung/'"
        >
          {{ portalLinks[0]?.label || "Portal öffnen" }}
        </openwb-base-click-button>
        <openwb-base-click-button
          class="btn btn-info w-100"
          :href="portalLinks[1]?.url || 'https://openwb.de/main/mieterstromabrechnung-mit-openwb/'"
        >
          {{ portalLinks[1]?.label || "Download Portal" }}
        </openwb-base-click-button>
      </openwb-base-card>
    </openwb-base-card>

    <openwb-base-card
      v-if="isConnected && assignments.length"
      title="Verbraucher-Zuordnung"
    >
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
      :is-connected="isConnected"
    />
    <vehicle-billing-shop
      v-if="billingService === 'vehicle'"
      :is-connected="isConnected"
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
    portalLinks: { type: Array, required: false, default: () => [] },
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
      isConnected: false,
      contractActive: false,
      lastSync: null,
      assignments: [],
      hasError: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchStatus() {
      try {
        const response = await axios.post(this.apiUrl, {
          username: this.username,
          password: this.password,
        });

        const data = response.data;

        this.applyStatus(data);

        if (data.connected) {
          this.$root.postClientMessage("Verbindung erfolgreich", "success");
        } else {
          this.$root.postClientMessage(data.error || "Login fehlgeschlagen", "danger");
        }
      } catch (error) {
        console.error(error);
        this.$root.postClientMessage("Serverfehler", "danger");
      }
    },

    applyStatus(data) {
      this.isConnected = data.connected;
      this.contractActive = data.contract_active;
      this.lastSync = this.formatDate(data.last_sync);
      this.assignments = data.assignments || [];
      this.hasError = !!data.error;
      this.errorMessage = data.error || "";
    },

    formatDate(dateString) {
      if (!dateString) return null;
      return new Date(dateString).toLocaleString();
    },

    disconnect() {
      this.isConnected = false;
      this.contractActive = false;
      this.lastSync = null;
      this.hasError = false;
      this.errorMessage = "";
      this.password = "";
    },
  },
};
</script>
