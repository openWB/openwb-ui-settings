<template>
  <div>
    <openwb-base-card>
      <template #header> Verbindung {{ titleText }} </template>
      <openwb-base-text-input
        title="Benutzername"
        subtype="user"
        :model-value="username"
        @update:model-value="$emit('update:username', $event)"
      >
        <template #help> Eingabefeld für Benutzernamen </template>
      </openwb-base-text-input>
      <openwb-base-text-input
        title="Passwort"
        subtype="password"
        :model-value="password"
        @update:model-value="$emit('update:password', $event)"
      >
        <template #help> Das Passwort kann per Klick auf das Auge angezeigt werden. </template>
      </openwb-base-text-input>
      <div class="form-row mt-2 justify-content-end">
        <div class="col-md-8">
          <openwb-base-click-button
            class="btn btn-info w-100"
            :disabled="connectionState === 'loading'"
            @button-clicked="$emit('connect')"
          >
            {{ connectionState === "loading" ? "wird verbunden..." : "Verbinden" }}
          </openwb-base-click-button>
        </div>
      </div>
      <div
        v-if="wasConnected"
        class="form-row mt-3 justify-content-end"
      >
        <div class="col-md-8">
          <div class="row">
            <div class="col">
              <openwb-base-click-button
                class="btn btn-success w-100"
                :disabled="connectionState === 'loading'"
                @button-clicked="$emit('connect')"
              >
                {{ connectionState === "loading" ? "wird aktualisiert..." : "Aktualisieren" }}
              </openwb-base-click-button>
            </div>

            <div class="col">
              <openwb-base-click-button
                class="btn btn-danger w-100"
                @button-clicked="$emit('disconnect')"
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
            <span :class="contractStatus === 'active' ? 'text-success' : 'text-danger'">
              {{ contractStatus }}
            </span>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col">Letzte Synchronisation</div>
          <div class="col text-right">
            {{ lastSync }}
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
        subtype="white"
        body-bg="white"
        class="py-2"
      >
        <openwb-base-click-button
          class="btn btn-info w-100"
          :href="'https://mieterstrom.openwb.de/'"
        >
          Mieterstrom Portal öffnen
        </openwb-base-click-button>
        <openwb-base-click-button
          class="btn btn-info w-100"
          :href="contractDetails?.downloadUrl || 'https://mieterstrom.openwb.de/'"
        >
          Abrechnung Download Portal öffnen
        </openwb-base-click-button>
      </openwb-base-card>
    </openwb-base-card>

    <openwb-base-card v-if="wasConnected && assignments.length">
      <template #header> Verbraucher - Zuordnung {{ titleText }} </template>
      <openwb-base-card
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
    <div v-if="!['success', 'loading'].includes(connectionState)">
      <tenant-billing-shop v-if="billingService === 'tenant'" />
      <vehicle-billing-shop v-if="billingService === 'vehicle'" />
    </div>
  </div>
</template>

<script>
import TenantBillingShop from "./tenantBillingShop.vue";
import VehicleBillingShop from "./VehicleBillingShop.vue";

export default {
  name: "BaseStatusPage",
  components: {
    TenantBillingShop,
    VehicleBillingShop,
  },
  props: {
    billingService: { type: String, required: true },
    username: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    connectionState: {
      type: String,
      default: "",
    },
    contractStatus: {
      type: String,
      default: "",
    },
    lastSync: {
      type: String,
      default: "",
    },
    assignments: {
      type: Array,
      default: () => [],
    },
    contractDetails: {
      type: Object,
      default: () => ({}),
    },
    errorMessage: {
      type: String,
      default: "",
    },
    wasConnected: Boolean,
    titleText: { type: String, default: "" },
    tableColumns: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["connect", "disconnect", "update:username", "update:password"],
};
</script>
