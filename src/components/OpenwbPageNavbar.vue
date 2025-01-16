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
      class="navbar-toggler mr-5"
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
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link
            to="/Status"
            class="nav-link"
            active-class="active disabled"
          >
            Status
          </router-link>
        </li>
        <li class="nav-item dropdown nav-separator-after">
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
              to="/Logging/ChargeLog"
              class="dropdown-item"
              active-class="active disabled"
            >
              Ladeprotokoll
            </router-link>
            <router-link
              to="/Logging/Chart"
              class="dropdown-item"
              active-class="active disabled"
            >
              Diagramme
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
            Einstellungen
          </a>
          <div
            class="dropdown-menu"
            aria-labelledby="navbarDropdown"
          >
            <router-link
              to="/GeneralConfig"
              class="dropdown-item"
              active-class="active disabled"
            >
              Allgemein
            </router-link>
            <router-link
              to="/OptionalComponents"
              class="dropdown-item"
              active-class="active disabled"
            >
              Optionale Hardware
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
              to="/GeneralChargeConfig"
              class="dropdown-item"
              active-class="active disabled"
            >
              Übergreifendes
            </router-link>
            <router-link
              to="/PVChargeConfig"
              class="dropdown-item"
              active-class="active disabled"
            >
              PV-Laden
            </router-link>
            <router-link
              to="/TimeChargeConfig"
              class="dropdown-item"
              active-class="active disabled"
            >
              Zeitladen
            </router-link>
            <router-link
              to="/ScheduledChargeConfig"
              class="dropdown-item"
              active-class="active disabled"
            >
              Zielladen
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
              to="/HardwareInstallation"
              class="dropdown-item"
              active-class="active disabled"
            >
              Geräte und Komponenten
            </router-link>
            <router-link
              to="/LoadManagementConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Lastmanagement
            </router-link>
            <router-link
              to="/ChargePointInstallation"
              class="dropdown-item"
              active-class="active disabled"
            >
              Ladepunkte
            </router-link>
            <router-link
              to="/VehicleConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Fahrzeuge
            </router-link>
            <div class="dropdown-divider" />
            <a
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
              to="/System/InstallAssistant"
              class="dropdown-item"
              active-class="active disabled"
            >
              Einrichtungsassistent
            </router-link>
            <router-link
              to="/System/CloudConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              openWB Cloud
            </router-link>
            <router-link
              to="/System/MqttBridgeConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              MQTT-Brücken
            </router-link>
            <router-link
              to="/System/DebugConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              Fehlersuche
            </router-link>
            <router-link
              to="/System/Support"
              class="dropdown-item"
              active-class="active disabled"
            >
              Support
            </router-link>
            <router-link
              to="/System/DataManagement"
              class="dropdown-item"
              active-class="active disabled"
            >
              Datenverwaltung
            </router-link>
            <router-link
              to="/System/SystemConfiguration"
              class="dropdown-item"
              active-class="active disabled"
            >
              System
            </router-link>
            <router-link
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
            href="https://github.com/openWB/core/wiki"
            target="_blank"
          >
            Wiki
            <font-awesome-icon
              fixed-width
              :icon="['fas', 'external-link-alt']"
            />
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExternalLinkAlt as fasExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasExternalLinkAlt);

export default {
  name: "OpenwbNavBar",
  components: {
    FontAwesomeIcon,
  },
  computed: {
    nodeEnv() {
      return import.meta.env.MODE;
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

.nav-item.nav-separator-before {
  border-left: 1px solid rgba(255, 255, 255, 0.5);
  margin-left: 5px;
  padding-left: 5px;
}

.nav-item.nav-separator-after {
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  margin-right: 5px;
  padding-right: 5px;
}

@media (max-width: 991px) {
  .nav-item.nav-separator-before {
    border-left: none;
    margin-left: 0px;
    padding-left: 0px;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    margin-top: 5px;
    padding-top: 5px;
  }

  .nav-item.nav-separator-after {
    border-right: none;
    margin-right: 0px;
    padding-right: 0px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    margin-bottom: 5px;
    padding-bottom: 5px;
  }
}
</style>
