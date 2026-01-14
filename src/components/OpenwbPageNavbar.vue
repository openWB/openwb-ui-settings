<template>
  <nav class="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
    <a
      class="navbar-brand"
      href="/openWB/web/"
    >
      <span>openWB</span>
    </a>
    <button
      ref="navbarButton"
      class="navbar-toggler mr-auto"
      type="button"
      data-toggle="collapse"
      data-target="#collapsibleNavbar"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div
      id="collapsibleNavbar"
      ref="collapsibleNavbar"
      class="collapse navbar-collapse navbar-nav-scroll"
    >
      <ul class="navbar-nav mr-auto">
        <li
          v-if="accessAllowed('Status')"
          class="nav-item nav-separator-before"
        >
          <router-link
            to="/Status"
            class="nav-link"
            active-class="active disabled"
          >
            Status
          </router-link>
        </li>
        <li class="nav-item dropdown nav-separator-before">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Auswertungen
          </a>
          <div
            class="dropdown-menu"
            aria-labelledby="navbarDropdown"
          >
            <router-link
              v-if="accessAllowed('ChargeLog')"
              to="/Logging/ChargeLog"
              class="dropdown-item"
              active-class="active disabled"
            >
              Ladeprotokoll
            </router-link>
            <router-link
              v-if="accessAllowed('Chart')"
              to="/Logging/Chart"
              class="dropdown-item"
              active-class="active disabled"
            >
              Diagramme
            </router-link>
          </div>
        </li>
        <li class="nav-item dropdown nav-separator-before">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Einstellungen
          </a>
          <div
            class="dropdown-menu"
            aria-labelledby="navbarDropdown"
          >
            <router-link
              v-if="accessAllowed('GeneralConfiguration')"
              to="/GeneralConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Allgemein
            </router-link>
            <router-link
              v-if="accessAllowed('DisplayConfiguration')"
              to="/DisplayConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Display
            </router-link>
            <router-link
              v-if="accessAllowed('IdentificationConfiguration')"
              to="/IdentificationConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Identifikation
            </router-link>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Ladeeinstellungen
          </a>
          <div
            class="dropdown-menu"
            aria-labelledby="navbarDropdown"
          >
            <router-link
              v-if="accessAllowed('GeneralChargeConfiguration')"
              to="/GeneralChargeConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Übergreifendes
            </router-link>
            <router-link
              v-if="accessAllowed('SurplusChargeConfiguration')"
              to="/SurplusChargeConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Überschuss-Laden
            </router-link>
            <router-link
              v-if="accessAllowed('ActiveBatControlConfiguration')"
              to="/ActiveBatControlConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Speichersteuerung
            </router-link>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Konfiguration
          </a>
          <div
            class="dropdown-menu"
            aria-labelledby="navbarDropdown"
          >
            <router-link
              v-if="accessAllowed('HardwareInstallation')"
              to="/HardwareInstallation"
              class="dropdown-item"
              active-class="active disabled"
            >
              Geräte und Komponenten
            </router-link>
            <router-link
              v-if="accessAllowed('LoadManagementConfiguration')"
              to="/LoadManagementConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Lastmanagement
            </router-link>
            <router-link
              v-if="accessAllowed('ChargePointInstallation')"
              to="/ChargePointInstallation"
              class="dropdown-item"
              active-class="active disabled"
            >
              Ladepunkte
            </router-link>
            <router-link
              v-if="accessAllowed('VehicleConfiguration')"
              to="/VehicleConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Fahrzeuge
            </router-link>
            <router-link
              v-if="accessAllowed('IoConfiguration')"
              to="/IoConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Ein-/Ausgänge
            </router-link>
            <div
              v-if="accessAllowed('LegacySmartHomeConfiguration')"
              class="dropdown-divider"
            />
            <a
              v-if="accessAllowed('LegacySmartHomeConfiguration')"
              href="modules/legacy_smart_home/smarthomeconfig.php"
              class="dropdown-item"
              target="_blank"
            >
              SmartHome
            </a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            System
          </a>
          <div
            class="dropdown-menu"
            aria-labelledby="navbarDropdown"
          >
            <router-link
              v-if="accessAllowed('InstallAssistant')"
              to="/System/InstallAssistant"
              class="dropdown-item"
              active-class="active disabled"
            >
              Einrichtungsassistent
            </router-link>
            <router-link
              v-if="accessAllowed('CloudConfiguration')"
              to="/System/CloudConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              openWB Cloud
            </router-link>
            <router-link
              v-if="accessAllowed('MqttBridgeConfiguration')"
              to="/System/MqttBridgeConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              MQTT-Brücken
            </router-link>
            <router-link
              v-if="accessAllowed('DebugConfiguration')"
              to="/System/DebugConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Fehlersuche
            </router-link>
            <router-link
              v-if="accessAllowed('Support')"
              to="/System/Support"
              class="dropdown-item"
              active-class="active disabled"
            >
              Support
            </router-link>
            <router-link
              v-if="accessAllowed('DataManagement')"
              to="/System/DataManagement"
              class="dropdown-item"
              active-class="active disabled"
            >
              Datenverwaltung
            </router-link>
            <router-link
              v-if="accessAllowed('SecurityConfiguration')"
              to="/System/SecurityConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Sicherheit
            </router-link>
            <router-link
              v-if="accessAllowed('SystemConfiguration')"
              to="/System/SystemConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              System
            </router-link>
            <router-link
              v-if="accessAllowed('LegalSettings')"
              to="/System/LegalSettings"
              class="dropdown-item"
              active-class="active disabled"
            >
              Rechtliches
            </router-link>
          </div>
        </li>
        <!-- <li
          v-if="nodeEnv !== 'production'"
          class="nav-item dropdown nav-separator-before"
        >
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Beispiele
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link
              to="/TestingStore"
              class="dropdown-item"
              active-class="active disabled"
            >
              VUEX Store
            </router-link>
          </div>
        </li> -->
        <li class="nav-item nav-separator-before">
          <a
            class="nav-link"
            href="https://wiki.openwb.de/"
            target="_blank"
          >
            Wiki
            <font-awesome-icon :icon="['fas', 'external-link-alt']" />
          </a>
        </li>
      </ul>
    </div>
    <div
      id="infobar"
      class="ml-auto d-flex flex-row align-items-center"
    />
  </nav>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExternalLinkAlt as fasExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ComponentState from "./mixins/ComponentState.vue";

library.add(fasExternalLinkAlt);

export default {
  name: "OpenwbNavBar",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopicsToSubscribe: ["openWB/system/security/access/+"],
    };
  },
  computed: {
    nodeEnv() {
      return import.meta.env.MODE;
    },
    accessAllowed() {
      return (page) => {
        return this.$store.state.mqtt[`openWB/system/security/access/${page}`] === true;
      };
    },
  },
  watch: {
    $route() {
      // imitate bootstraps close behavior
      this.$refs["collapsibleNavbar"].classList.remove("show");
      this.$refs["navbarButton"].classList.add("collapsed");
      this.$refs["navbarButton"].setAttribute("aria-expanded", false);
    },
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.15);
}

.nav-item.nav-separator-before:not(:first-child) {
  border-left: 1px solid rgba(255, 255, 255, 0.5);
  margin-left: 5px;
  padding-left: 5px;
}

.nav-item.nav-separator-after:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  margin-right: 5px;
  padding-right: 5px;
}

/* hide dropdowns without items */
.nav-item.dropdown:not(:has(.dropdown-menu a)) {
  border: 2px solid #ff0000;
  display: none;
}

@media (max-width: 991px) {
  .nav-item.nav-separator-before:not(:first-child) {
    border-left: none;
    margin-left: 0px;
    padding-left: 0px;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    margin-top: 5px;
    padding-top: 5px;
  }

  .nav-item.nav-separator-after:not(:last-child) {
    border-right: none;
    margin-right: 0px;
    padding-right: 0px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    margin-bottom: 5px;
    padding-bottom: 5px;
  }
}
</style>
