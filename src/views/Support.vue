<template>
  <div class="support">
    <form name="supportForm">
      <openwb-base-alert
        v-if="$store.state.mqtt['openWB/system/dataprotection_acknowledged'] !== true"
        subtype="danger"
      >
        Du musst der
        <router-link to="/System/LegalSettings"> Datenschutzerklärung </router-link>
        zustimmen, um einen Systembericht senden zu können.
      </openwb-base-alert>
      <div v-else>
        <openwb-base-alert subtype="success">
          Du hast der
          <router-link to="/System/LegalSettings"> Datenschutzerklärung </router-link>
          zugestimmt und kannst Systemberichte senden.
        </openwb-base-alert>
        <openwb-base-card title="Systembericht">
          <div v-if="$store.state.mqtt['openWB/system/dataprotection_acknowledged'] === true">
            <openwb-base-alert subtype="info">
              <ul>
                <li>
                  Lies bitte den Hilfetext, der durch Klick auf das
                  <FontAwesomeIcon :icon="['far', 'question-circle']" />
                  angezeigt wird. Nimm das Wiki zur Hilfe.
                </li>
                <li>Vergewissere Dich , dass mindestens die aktuelle "Release" Version installiert ist.</li>
                <li>
                  Stelle beim Absenden des Berichtes die Fehlerkonditionen her. Lädt ein Fahrzeug nicht, sollte es
                  angeschlossen und nicht voll geladen sein. Ist PV laden betroffen, sollte die Sonne auch scheinen. Der
                  Systembericht muss dann versendet werden, wenn der Fehler aktuell vorliegt.
                </li>
                <li>
                  Stelle sicher, dass der Lademodus gewählt ist und im Falle von nicht ladenden ladenden Fahrzeugen,
                  dass der Ladepunkt auch entsperrt wurde.
                </li>
                <li>
                  Das Auslesen der Systemkonfiguration erfolgt direkt nach den Klick auf Absenden und kann einige Zeit
                  in Anspruch nehmen. Du erhältst ca. 15 bis 30 Minuten nach Versand des Systemberichtes von uns
                  automatisch eine E-Mail mit der Ticketnummer unter der die Anfrage bei uns registriert wurde. Wir
                  melden uns bei Dir. Bitte kontrolliere daher immer auch den Spam Ordner auf eingehende Nachrichten.
                  Erhältst Du trotzdem keine Ticketnummer, ist das Versenden des Systemberichtes vermutlich
                  fehlgeschlagen.
                </li>
              </ul>
            </openwb-base-alert>
            <openwb-base-text-input
              v-model="email"
              title="E-Mail"
              required
              subtype="email"
            >
              <template #help> Deine E-Mail-Adresse, an die der Support Dir antwortet. </template>
            </openwb-base-text-input>
            <openwb-base-text-input
              title="openWB Seriennummer"
              required
              :model-value="$store.state.mqtt['openWB/system/serial_number']"
              @update:model-value="updateState('openWB/system/serial_number', $event)"
            >
              <template #help>
                Die Seriennummer der openWB findest Du außen am, bei älteren Installationen innen im Gehäuse. Du kannst
                uns aber auch eine Bestellnummer oder Rechnungsnummer übermitteln. Das Gehäuse muss nicht extra geöffnet
                werden!<br />
                Bei einer gekauften openWB wird die Seriennummer automatisch ermittelt.
              </template>
            </openwb-base-text-input>
            <openwb-base-textarea
              title="Verwendete Komponenten"
              required
              minlength="3"
              maxlength="500"
              :model-value="installedComponents"
              @update:model-value="components = $event"
            >
              <template #help>
                Gib hier möglichst detailliert an, welche Anlagenkomponenten (EVU, PV, Speicher) angebunden sind.<br />
                <router-link to="/HardwareInstallation">
                  Die Angaben können auch direkt in der Konfiguration der Komponenten dauerhaft gespeichert werden.
                </router-link>
              </template>
            </openwb-base-textarea>
            <openwb-base-textarea
              title="Fahrzeuge"
              required
              minlength="3"
              maxlength="500"
              :model-value="vehicleInfo"
              @update:model-value="vehicles = $event"
            >
              <template #help>
                Gib hier an, welche Fahrzeuge geladen (Hersteller, Modell, Baujahr).<br />
                <router-link to="/VehicleConfiguration">
                  Die Angaben können auch direkt in der Konfiguration der Fahrzeuge dauerhaft gespeichert werden.
                </router-link>
              </template>
            </openwb-base-textarea>
            <openwb-base-textarea
              v-model="message"
              title="Problembeschreibung"
              required
              minlength="20"
              maxlength="500"
            />
          </div>
          <template
            v-if="$store.state.mqtt['openWB/system/dataprotection_acknowledged'] === true"
            #footer
          >
            <div class="row justify-content-center">
              <openwb-base-click-button
                class="col-4"
                :class="enableSendDebugButton ? 'btn-success' : 'btn-outline-success'"
                :disabled="!enableSendDebugButton"
                @button-clicked="sendDebugMessage"
              >
                Absenden
              </openwb-base-click-button>
            </div>
          </template>
        </openwb-base-card>
        <openwb-base-alert
          v-if="!enableSendDebugButton"
          subtype="success"
        >
          Die Daten für den Fehlerbericht werden im Hintergrund zusammengestellt. Du kannst diese Seite jetzt verlassen.
          <font-awesome-icon
            fixed-width
            :icon="['fas', 'check']"
          />
        </openwb-base-alert>
      </div>
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheck);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbSupportView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  emits: ["sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/system/dataprotection_acknowledged",
        "openWB/system/serial_number",
        "openWB/system/device/+/config",
        "openWB/system/device/+/component/+/config",
        "openWB/vehicle/+/name",
        "openWB/vehicle/+/info",
      ],
      email: undefined,
      components: undefined,
      vehicles: undefined,
      message: undefined,
      enableSendDebugButton: true,
    };
  },
  computed: {
    debugData() {
      return {
        email: this.email,
        serialNumber: this.$store.state.mqtt["openWB/system/serial_number"],
        installedComponents: this.installedComponents,
        vehicles: this.vehicleInfo,
        message: this.message,
      };
    },
    installedComponents() {
      if (this.components !== undefined) {
        return this.components;
      }
      let componentText = "";
      const components = this.getWildcardTopics(`openWB/system/device/+/component/+/config`);
      for (const componentConfig of Object.values(components)) {
        const componentId = componentConfig.id;
        const manufacturer = componentConfig.info?.manufacturer || "N/A";
        const model = componentConfig.info?.model || "N/A";
        componentText += `(${componentId}) Hersteller: ${manufacturer}, Modell: ${model}\n`;
      }
      return componentText.trim();
    },
    vehicleInfo() {
      if (this.vehicles !== undefined) {
        return this.vehicles;
      }
      let vehicleText = "";
      const vehicles = this.getWildcardTopics("openWB/vehicle/+/info");
      for (const [vehicleTopic, vehicleInfo] of Object.entries(vehicles)) {
        const vehicleId = parseInt(vehicleTopic.split("/")[2]);
        if (vehicleId !== 0) {
          const manufacturer = vehicleInfo.manufacturer || "N/A";
          const model = vehicleInfo.model || "N/A";
          vehicleText += `(${vehicleId}) Hersteller: ${manufacturer}, Modell: ${model}\n`;
        }
      }
      return vehicleText.trim();
    },
  },
  methods: {
    sendDebugMessage() {
      let myForm = document.forms["supportForm"];
      if (!myForm.reportValidity()) {
        console.warn("form invalid");
        return;
      } else {
        this.$emit("sendCommand", {
          command: "sendDebug",
          data: this.debugData,
        });
        this.enableSendDebugButton = false;
      }
    },
  },
};
</script>
