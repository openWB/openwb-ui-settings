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
          <div class="col">Vertrag aktiv</div>
          <div class="col text-right">
            {{ contractActive ? "Ja" : "Nein" }}
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
          @click="openTenantPortal"
        >
          Mieterstrom Portal öffnen
        </openwb-base-click-button>
        <openwb-base-click-button
          class="btn btn-info w-100"
          @click="openTenantPortalAbrechnung"
        >
          Abrechnung Download Portal öffnen
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
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Verbraucher</th>
              <th class="text-right">Zugeordnet zu</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in assignments"
              :key="index"
            >
              <td>{{ item.device }}</td>
              <td class="text-right">{{ item.assigned_to }}</td>
            </tr>
          </tbody>
        </table>
      </openwb-base-card>
    </openwb-base-card>

    <openwb-base-card
      v-if="!isConnected"
      title="OpenWB Shop"
    >
      <openwb-base-card
        subtype="white"
        body-bg="white"
        class="py-3 px-3"
      >
        <div class="font-weight-bold mb-2">Noch kein Mieterstrom-Kunde?</div>
        <div class="mb-3">
          Mit openWB können<strong>Vermieter den Stromverbrauch ihrer Mieter</strong> erfassen und direkt abrechnen,
          <strong>egal ob mit oder ohne PV-Anlage.</strong> Auch gespeicherter Strom (z.B. aus einem Batteriespeicher)
          kann berücksichtigt werden.
        </div>
        <div class="mb-3">
          <div class="font-weight-bold">Vorteile:</div>
          <ul class="mb-2 pl-3">
            <li>Günstiger Strom durch Wegfall von Netzentgelten</li>
            <li>Abrechnung pro Wohneinheit</li>
            <li>Klare Zuordnung von PV-/Netz-/Speicherstrom</li>
            <li>RFID Ladefreigabe</li>
            <li>Monatliche oder jährliche Abrechnung</li>
          </ul>
        </div>
        <div class="mb-3">
          <div class="font-weight-bold">Kosten:</div>
          <div class="row align-items-center">
            <div class="col"><strong>5,00 € im Monat</strong> je Abrechnungsstelle</div>
            <div class="col-auto">
              <openwb-base-click-button
                class="btn btn-outline-secondary"
                @click="openShopTenantEnergy"
              >
                JETZT BESTELLEN >
              </openwb-base-click-button>
            </div>
          </div>
        </div>
      </openwb-base-card>
    </openwb-base-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TenantEnergyBilling",
  data() {
    return {
      username: "",
      password: "",
      isConnected: false,
      contractActive: false,
      lastSync: null,
      hasError: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchStatus() {
      try {
        const response = await axios.post(
          "http://localhost:49539/openWB/web/settings/modules/billing_services/tenant_energy/tenantEnergy.php",
          {
            username: this.username,
            password: this.password,
          },
        );

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
    openTenantPortal() {
      window.open("https://wb-solution.de/produkt/mieterstromabrechnung/", "_blank");
    },
    openTenantPortalAbrechnung() {
      window.open("https://openwb.de/main/mieterstromabrechnung-mit-openwb/", "_blank");
    },
    openShopTenantEnergy() {
      window.open("https://wb-solution.de/produkt/mieterstromabrechnung/", "_blank");
    },
  },
};
</script>
