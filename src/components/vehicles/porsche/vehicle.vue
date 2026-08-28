<template>
  <div class="vehicle-soc-porsche">
    <openwb-base-alert
      v-if="isConnected"
      subtype="success"
    >
      <b>Porsche verbunden</b><br />
      Anmeldung vorhanden. Der Ladestand wird über Porsche Connect abgerufen.
    </openwb-base-alert>
    <openwb-base-alert
      v-else
      subtype="warning"
    >
      <b>Nicht verbunden</b><br />
      Bitte unten mit den My-Porsche-Zugangsdaten anmelden.
    </openwb-base-alert>

    <openwb-base-text-input
      title="My-Porsche E-Mail (Porsche ID)"
      subtype="email"
      required
      :model-value="vehicle.configuration.email"
      @update:model-value="updateConfiguration($event, 'configuration.email')"
    >
      <template #help>
        E-Mail-Adresse der Porsche ID, mit der Ihr Euch in der My-Porsche-App bzw. auf my.porsche.com anmeldet.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="My-Porsche Passwort"
      subtype="password"
      :model-value="password"
      @update:model-value="password = $event"
    >
      <template #help>
        Passwort der Porsche ID. Wird nur für die Anmeldung verwendet und <b>nicht gespeichert</b>.
      </template>
    </openwb-base-text-input>
    <openwb-base-text-input
      title="Fahrgestellnummer (VIN)"
      subtype="text"
      :model-value="vehicle.configuration.vin"
      @update:model-value="updateConfiguration($event, 'configuration.vin')"
    >
      <template #help>
        Optional. Nur nötig, wenn mehrere Fahrzeuge mit der Porsche ID verknüpft sind. Bleibt das Feld leer, wird das
        erste Fahrzeug im Konto verwendet.
      </template>
    </openwb-base-text-input>

    <openwb-base-button-input
      title="Porsche Anmeldung"
      button-text="Porsche verbinden"
      subtype="primary"
      @button-clicked="startAuth"
    >
      <template #help>
        Meldet sich bei Porsche Connect an und speichert die Zugangs-Token. Nur bei der Ersteinrichtung nötig oder wenn
        die Verbindung verloren gegangen ist.
      </template>
    </openwb-base-button-input>

    <openwb-base-alert
      v-if="authStatus.message"
      subtype="info"
    >
      {{ authStatus.message }}
    </openwb-base-alert>

    <div v-if="authStatus.captchaImage">
      <openwb-base-alert subtype="secondary">
        <b>Captcha</b><br />
        Bitte das angezeigte Captcha eingeben und erneut auf „Porsche verbinden“ klicken.
        <br />
        <img
          :src="authStatus.captchaImage"
          alt="Captcha"
          style="margin-top: 8px; max-width: 100%; background: #fff; padding: 6px; border-radius: 6px"
        />
      </openwb-base-alert>
      <openwb-base-text-input
        title="Captcha"
        subtype="text"
        :model-value="captchaInput"
        @update:model-value="captchaInput = $event"
      />
    </div>

    <openwb-base-alert
      v-if="authStatus.justConnected"
      subtype="success"
    >
      <b>Erfolgreich verbunden!</b><br />
      Bitte jetzt auf <b>"Speichern"</b> klicken, um die Verbindung dauerhaft zu sichern.
    </openwb-base-alert>
    <openwb-base-alert
      v-if="authStatus.error"
      subtype="danger"
    >
      <b>Fehler</b><br />
      {{ authStatus.error }}
    </openwb-base-alert>

    <openwb-base-button-group-input
      title="SoC während der Ladung berechnen"
      :buttons="[
        { buttonValue: false, text: 'Nein', class: 'btn-outline-danger' },
        { buttonValue: true, text: 'Ja', class: 'btn-outline-success' },
      ]"
      :model-value="vehicle.configuration.calculate_soc"
      @update:model-value="updateConfiguration($event, 'configuration.calculate_soc')"
    >
      <template #help>
        Berechnet den Ladestand (SoC) während der Ladung aus Ladeleistung und Ladedauer. Nur nötig, wenn der SoC nicht
        oft genug über die Porsche-Schnittstelle abgerufen werden kann.
      </template>
    </openwb-base-button-group-input>
  </div>
</template>

<script>
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocPorsche",
  mixins: [VehicleConfigMixin],
  data() {
    return {
      authStatus: {
        message: "",
        error: "",
        captchaImage: "",
        justConnected: false,
      },
      captchaInput: "",
      sid: null,
      password: "",
    };
  },
  computed: {
    isConnected() {
      return !!this.vehicle.configuration.access_token;
    },
  },
  methods: {
    async startAuth() {
      this.authStatus = { message: "Anmeldung läuft…", error: "", captchaImage: "", justConnected: false };
      const body = {
        email: this.vehicle.configuration.email,
        password: this.password,
        captcha: this.captchaInput || null,
        sid: this.sid,
      };
      try {
        const response = await fetch("/openWB/web/settings/modules/vehicles/porsche/porsche_auth_login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.status === "ok") {
          this.updateConfiguration(data.access_token, "configuration.access_token");
          this.updateConfiguration(data.refresh_token, "configuration.refresh_token");
          this.updateConfiguration(data.expires_at, "configuration.expires_at");
          this.authStatus = { message: "", error: "", captchaImage: "", justConnected: true };
          this.sid = null;
          this.captchaInput = "";
          this.password = "";
        } else if (data.status === "captcha") {
          this.sid = data.sid;
          this.authStatus = { message: "", error: "", captchaImage: data.image, justConnected: false };
        } else {
          this.authStatus = { message: "", error: data.message || "Unbekannter Fehler.", captchaImage: "", justConnected: false };
        }
      } catch (e) {
        this.authStatus = { message: "", error: "Netzwerkfehler: " + e, captchaImage: "", justConnected: false };
      }
    },
  },
};
</script>
