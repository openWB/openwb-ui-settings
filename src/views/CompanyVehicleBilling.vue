<template>
  <div class="testingStore">
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
                Daten aktualisieren
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
          @click="openVehiclePortal"
        >
          Dienstwagenabrechnung Portal öffnen
        </openwb-base-click-button>
        <openwb-base-click-button
          class="btn btn-info w-100"
          @click="openVehiclePortalAbrechnung"
        >
          Dienstwagenabrechnung Download Portal öffnen
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
              <th>Ladepunkt</th>
              <th class="text-center">Fahrzeug</th>
              <th class="text-right">Mitarbeiter</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in assignments"
              :key="index"
            >
              <td>{{ item.Ladepunkt }}</td>
              <td class="text-center">{{ item.Fahrzeug }}</td>
              <td class="text-right">{{ item.Mitarbeiter }}</td>
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
        <div class="font-weight-bold mb-2">Noch kein Dienstwagenabrechnungs-Kunde?</div>
        <div class="mb-3">
          openWB ermöglicht die Abrechnung von zu Hause geladenem Strom für
          <strong>Dienstwagen, mit oder ohne Abrechnungsdienstleister.</strong>
          Voraussetzung: openWB mit software2.
        </div>
        <div class="mb-3">
          <div class="font-weight-bold">Mögliche Modelle:</div>
          <ul class="mb-2 pl-3">
            <li>Manuelle Übermittlung (bei eigener oder geteilter Nutzung)</li>
            <li>Automatischer Datenexport durch Ladelog (z.B. per RFID oder Fahrzeug-Zuordnung)</li>
            <li>Anbindung an OCPP-Abrechnungsdienstleister</li>
            <li>Komplettabrechnung durch openWB</li>
          </ul>
        </div>
        <div class="mb-3">
          <div class="font-weight-bold">Kosten:</div>
          <div class="row align-items-center">
            <div class="col"><strong>5,00 € im Monat</strong>pro Ladepunkt</div>
            <div class="col-auto">
              <openwb-base-click-button
                class="btn btn-outline-secondary"
                @click="openShopVehicle"
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
          "http://localhost:49539/openWB/web/settings/modules/billing_services/company_vehicle/companyVehicle.php",
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
    openVehiclePortal() {
      window.open("https://wb-solution.de/produkt/dienstwagenabrechnung/", "_blank");
    },
    openVehiclePortalAbrechnung() {
      window.open("https://openwb.de/main/mieterstromabrechnung-mit-openwb/", "_blank");
    },
    openShopVehicle() {
      window.open("https://wb-solution.de/produkt/dienstwagenabrechnung/", "_blank");
    },
  },
};
</script>
