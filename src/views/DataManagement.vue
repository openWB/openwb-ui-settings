<template>
  <div class="system">
    <openwb-base-alert
      v-if="!installAssistantActive"
      subtype="danger"
    >
      <h2>Achtung!</h2>
      <p>
        Vor allen Aktionen auf dieser Seite ist sicherzustellen, dass kein Ladevorgang aktiv ist! Zur Sicherheit bitte
        zusätzlich alle Fahrzeuge von der Ladestation / den Ladestationen abstecken!
      </p>
      <openwb-base-button-group-input
        v-model="warningAcknowledged"
        title="Ich habe die Warnung verstanden"
        :buttons="[
          {
            buttonValue: false,
            text: 'Nein',
            class: 'btn-outline-danger',
          },
          {
            buttonValue: true,
            text: 'Ja',
            class: 'btn-outline-success',
          },
        ]"
      />
    </openwb-base-alert>
    <div v-if="warningAcknowledged || installAssistantActive">
      <openwb-base-card
        title="Sicherung / Wiederherstellung"
        subtype="success"
        :collapsible="true"
        :collapsed="!installAssistantActive"
      >
        <form name="backupForm">
          <openwb-base-heading>Sicherung</openwb-base-heading>
          <openwb-base-alert subtype="danger">
            Aktuell können nur Sicherungen wiederhergestellt werden, die in den Entwicklungszweigen "master", "Beta"
            oder "Release" erstellt wurden!
          </openwb-base-alert>
          <openwb-base-alert subtype="info">
            Nachdem die Sicherung abgeschlossen ist, kann die erstellte Datei über den Link in der Benachrichtigung oder
            <a
              href="/openWB/data/backup/"
              target="_blank"
              >hier</a
            >
            heruntergeladen werden. Beim Herunterladen bitte darauf achten, dass die Datei mit der Endung .tar.gz
            gespeichert wird. Ggf. das automatische Entpacken des Browsers deaktivieren.
          </openwb-base-alert>
          <div class="row justify-content-center">
            <div class="col-md-4 d-flex py-1 justify-content-center">
              <openwb-base-click-button
                class="btn-success clickable"
                @button-clicked="
                  sendSystemCommand('createBackup', {
                    use_extended_filename: true,
                  })
                "
              >
                Sicherung erstellen
                <font-awesome-icon :icon="['fas', 'archive']" />
              </openwb-base-click-button>
            </div>
          </div>
        </form>
        <form
          v-if="showRestoreSection"
          name="restoreForm"
        >
          <hr />
          <openwb-base-heading>Wiederherstellung</openwb-base-heading>
          <openwb-base-alert subtype="danger">
            Für die Wiederherstellung wird eine aktive Internetverbindung benötigt.<br />
            Es können nur Sicherungen wiederhergestellt werden, die in den Entwicklungszweigen "master", "Beta" oder
            "Release" erstellt wurden!
          </openwb-base-alert>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <font-awesome-icon :icon="['fas', 'file-archive']" />
              </div>
            </div>
            <div class="custom-file">
              <input
                id="input-file"
                type="file"
                class="custom-file-input"
                accept=".tar.gz,application/gzip,application/tar+gzip,.tar.gz.gpg,application/gzip+gpg,application/tar+gzip+gpg"
                @change="updateSelectedRestoreFile($event)"
              />
              <label
                id="input-file-label"
                class="custom-file-label"
                for="input-file"
                data-browse="Suchen"
              >
                {{ selectedRestoreFile ? selectedRestoreFile.name : "Bitte eine Datei auswählen" }}
              </label>
            </div>
            <div class="input-group-append">
              <button
                class="btn"
                :class="selectedRestoreFile ? 'btn-success clickable' : 'btn-outline-success'"
                :disabled="!selectedRestoreFile"
                type="button"
                @click="uploadRestoreFile()"
              >
                Hochladen
                <font-awesome-icon :icon="['fas', 'upload']" />
              </button>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-4 d-flex py-1 justify-content-center">
              <openwb-base-click-button
                :class="restoreUploadDone ? 'btn-success clickable' : 'btn-outline-success'"
                :disabled="!restoreUploadDone"
                @button-clicked="restoreBackup()"
              >
                Wiederherstellung starten
                <font-awesome-icon :icon="['fas', 'box-open']" />
              </openwb-base-click-button>
            </div>
          </div>
        </form>
        <div v-if="!installAssistantActive">
          <form
            v-if="showBackupCloudSection"
            name="cloudBackupForm"
          >
            <hr />
            <openwb-base-heading> Automatische Sicherung in einen Cloud-Dienst </openwb-base-heading>
            <openwb-base-alert subtype="info">
              Ist die openWB als primary konfiguriert, wird zwischen Mitternacht und 5:00 Uhr automatisch eine Sicherung
              erstellt und in den angegebenen Cloud-Dienst (nicht openWB Cloud!) hochgeladen. Ist kein Cloud-Dienst
              konfiguriert, wird keine automatische Sicherung erstellt. Die automatische Sicherung kann unabhängig von
              der openWB Cloud genutzt werden.<br />
              Die manuelle Cloud-Sicherung und -falls aktiviert- die Sicherung vor einem Update werden sowohl von einer
              primary als auch von einer secondary durchgeführt.<br />
              Die Anleitung zur Konfiguration des Cloud-Dienstes findest Du
              <a
                href="https://github.com/openWB/core/wiki/Cloud-Sicherung"
                target="_blank"
                rel="noopener noreferrer"
              >
                hier
              </a>
              .
            </openwb-base-alert>
            <openwb-base-select-input
              class="mb-2"
              title="Backup-Cloud"
              :options="backupCloudList"
              :model-value="$store.state.mqtt['openWB/system/backup_cloud/config']?.type"
              @update:model-value="updateSelectedBackupCloud($event)"
            />
            <div v-if="$store.state.mqtt['openWB/system/backup_cloud/config']?.type">
              <openwb-base-button-group-input
                title="Sicherung vor System-Update"
                :buttons="[
                  {
                    buttonValue: false,
                    text: 'Nein',
                    class: 'btn-outline-danger',
                  },
                  {
                    buttonValue: true,
                    text: 'Ja',
                    class: 'btn-outline-success',
                  },
                ]"
                :model-value="$store.state.mqtt['openWB/system/backup_cloud/backup_before_update']"
                @update:model-value="updateState('openWB/system/backup_cloud/backup_before_update', $event)"
              >
                <template #help>
                  Ist diese Option aktiviert, dann wird vor jedem System-Update automatisch eine Sicherung erstellt und
                  diese in die Backup-Cloud hochgeladen.
                </template>
              </openwb-base-button-group-input>
              <openwb-base-button-input
                title="Manuelle Cloud-Sicherung"
                button-text="Sicherung erstellen und hochladen"
                subtype="success"
                @button-clicked="sendSystemCommand('createCloudBackup', {})"
              />
              <openwb-backup-cloud-proxy
                :backup-cloud="$store.state.mqtt['openWB/system/backup_cloud/config']"
                @update:configuration="updateConfiguration('openWB/system/backup_cloud/config', $event)"
                @send-command="sendSystemCommand($event.command, $event.args)"
              />
            </div>
            <openwb-base-submit-buttons
              form-name="cloudBackupForm"
              :hide-reset="true"
              :hide-defaults="true"
              @save="$emit('save')"
              @reset="$emit('reset')"
              @defaults="$emit('defaults')"
            />
          </form>
        </div>
      </openwb-base-card>
      <openwb-base-card
        v-if="!installAssistantActive && !$store.state.mqtt['openWB/general/extern']"
        title="Datenübernahme"
        subtype="success"
        :collapsible="true"
        :collapsed="true"
      >
        <form name="dataMigrationForm">
          <openwb-base-alert subtype="info">
            Hier kann die Sicherung aus den älteren Software Versionen 1.9.303 oder 1.9.304 hochgeladen werden, um
            vorhandene historische Daten (Diagramme und Ladeprotokolle) sowie Cloud-Daten und Seriennummer in diese
            Installation zu importieren.<br />
            Ein Import aus Versionen kleiner als 1.9.303 ist nicht möglich. Falls eine Datenübernahme aus 1.9er
            Versionen gewünscht ist, muss erst ein Upgrade auf 1.9.303 oder 1.9.304 durchgeführt werden! Die Zuordnung
            zwischen den alten und neuen Komponenten muss manuell durchgeführt werden.
          </openwb-base-alert>
          <openwb-base-alert subtype="danger">
            Die Portierung kann bei vielen historischen Daten von mehreren Jahren durchaus bis zu 30 Minuten dauern. Die
            openWB in dieser Zeit bitte nicht herunterfahren! Du erhältst eine Meldung, wenn die Datenübernahme
            abgeschlossen ist.<br />
            Vor der Datenübernahme unbedingt eine Sicherung erstellen.<br />
            Die Datenübernahme kann nur durch Einspielen einer Sicherung rückgängig gemacht werden!
          </openwb-base-alert>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <font-awesome-icon :icon="['fas', 'file-archive']" />
              </div>
            </div>
            <div class="custom-file">
              <input
                id="data-migration-file"
                type="file"
                class="custom-file-input"
                accept=".tar.gz,application/gzip,application/tar+gzip"
                @change="updateSelectedDataMigrationFile($event)"
              />
              <label
                id="data-migration-file-label"
                class="custom-file-label"
                for="data-migration-file"
                data-browse="Suchen"
              >
                {{ selectedDataMigrationFile ? selectedDataMigrationFile.name : "Bitte eine Datei auswählen" }}
              </label>
            </div>
            <div class="input-group-append">
              <button
                class="btn"
                :class="selectedDataMigrationFile ? 'btn-success clickable' : 'btn-outline-success'"
                :disabled="!selectedDataMigrationFile"
                type="button"
                @click="uploadDataMigrationFile()"
              >
                Hochladen
                <font-awesome-icon :icon="['fas', 'upload']" />
              </button>
            </div>
          </div>
          <openwb-base-heading> Zuordnung der Komponenten </openwb-base-heading>
          <div
            v-for="section in dataMigrationConfig"
            :key="section.sectionName"
          >
            <openwb-base-heading>
              {{ section.sectionName }}
            </openwb-base-heading>
            <openwb-base-select-input
              v-for="configuration in section.sectionComponents"
              :key="configuration.key"
              v-model="dataMigrationMapping[configuration.key]"
              :title="configuration.label"
              :options="getMigrationOptions(configuration.validTypes)"
            >
              <template
                v-if="configuration.help"
                #help
              >
                {{ configuration.help }}
              </template>
            </openwb-base-select-input>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-4 d-flex py-1 justify-content-center">
              <openwb-base-click-button
                :class="dataMigrationUploadDone ? 'btn-success clickable' : 'btn-outline-success'"
                :disabled="!dataMigrationUploadDone"
                @button-clicked="dataMigration()"
              >
                Datenübernahme starten
                <font-awesome-icon :icon="['fas', 'box-open']" />
              </openwb-base-click-button>
            </div>
          </div>
        </form>
      </openwb-base-card>
      <form
        v-if="!installAssistantActive"
        name="resetForm"
      >
        <openwb-base-card
          title="Zurücksetzen"
          subtype="danger"
          :collapsible="true"
          :collapsed="true"
        >
          <openwb-base-alert subtype="danger">
            Alle Einstellungen, angelegte Geräte/Komponenten, Ladepunkte und Fahrzeuge, etc., Tages-, Monats- und
            Jahresauswertungen sowie das Ladeprotokoll werden unwiederbringlich gelöscht. Auch die Vorkonfiguration im
            Auslieferungszustand wird gelöscht. Die openWB muss danach komplett neu eingerichtet werden. Die openWB wird
            hierfür automatisch neu gestartet. Bitte erstelle vor dem Zurücksetzen eine Sicherung!
          </openwb-base-alert>
          <template #footer>
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  class="btn-danger clickable"
                  @button-clicked="factoryReset()"
                >
                  <font-awesome-icon :icon="['fas', 'skull-crossbones']" />
                  Zurücksetzen
                  <font-awesome-icon :icon="['fas', 'skull-crossbones']" />
                </openwb-base-click-button>
              </div>
            </div>
          </template>
        </openwb-base-card>
      </form>
      <form
        v-if="!installAssistantActive"
        name="monitoringForm"
      >
        <openwb-base-card
          title="Monitoring"
          subtype="success"
          :collapsible="true"
          :collapsed="true"
        >
          <div v-if="$store.state.mqtt['openWB/general/extern'] === true">
            <openwb-base-alert subtype="info">
              Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary"
              befindet.
            </openwb-base-alert>
          </div>
          <div v-else>
            <openwb-base-alert subtype="info">
              Das Monitoring informiert Dich sofort per E-Mail, wenn eine Deiner Komponenten oder Ladepunkte ein Problem
              hat oder die openWB nicht mehr erreichbar ist.
            </openwb-base-alert>
            <openwb-base-select-input
              class="mb-2"
              title="Anbieter"
              :options="monitoringList"
              :model-value="
                $store.state.mqtt['openWB/optional/monitoring/config']
                  ? $store.state.mqtt['openWB/optional/monitoring/config'].type
                  : ''
              "
              @update:model-value="updateSelectedMonitoring($event)"
            />
            <div
              v-if="
                $store.state.mqtt['openWB/optional/monitoring/config'] &&
                $store.state.mqtt['openWB/optional/monitoring/config'].type
              "
            >
              <openwb-monitoring-proxy
                :monitoring="$store.state.mqtt['openWB/optional/monitoring/config']"
                @update:configuration="updateConfiguration('openWB/optional/monitoring/config', $event)"
              />
            </div>
          </div>
          <template #footer>
            <openwb-base-submit-buttons
              form-name="monitoringForm"
              :hide-defaults="true"
              @save="$emit('save')"
              @reset="$emit('reset')"
            />
          </template>
        </openwb-base-card>
      </form>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSkullCrossbones as fasSkullCrossbones,
  faArchive as fasArchive,
  faFileArchive as fasFileArchive,
  faUpload as fasUpload,
  faBoxOpen as fasBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
library.add(fasSkullCrossbones, fasArchive, fasFileArchive, fasUpload, fasBoxOpen);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ComponentState from "../components/mixins/ComponentState.vue";
import OpenwbBackupCloudProxy from "../components/backup_clouds/OpenwbBackupCloudProxy.vue";
import OpenwbMonitoringProxy from "../components/monitoring/OpenwbMonitoringProxy.vue";

export default {
  name: "OpenwbDataManagementView",
  components: {
    FontAwesomeIcon,
    OpenwbBackupCloudProxy,
    OpenwbMonitoringProxy,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    showBackupCloudSection: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/system/configurable/backup_clouds",
        "openWB/system/configurable/monitoring",
        "openWB/system/backup_cloud/config",
        "openWB/system/backup_cloud/backup_before_update",
        "openWB/system/device/+/component/+/config",
        "openWB/chargepoint/+/config",
        "openWB/optional/monitoring/config",
        "openWB/vehicle/+/name",
        "openWB/LegacySmartHome/config/get/Devices/+/device_configured",
        "openWB/LegacySmartHome/config/get/Devices/+/device_name",
      ],
      warningAcknowledged: false,
      showRestoreSection: !this.installAssistantActive,
      selectedRestoreFile: undefined,
      restoreUploadDone: false,
      selectedDataMigrationFile: undefined,
      dataMigrationUploadDone: false,
      dataMigrationConfig: [
        {
          sectionName: "Ladepunkte",
          sectionComponents: [
            {
              key: "cp1",
              label: "Ladepunkt 1",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp2",
              label: "Ladepunkt 2",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp3",
              label: "Ladepunkt 3",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp4",
              label: "Ladepunkt 4",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp5",
              label: "Ladepunkt 5",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp6",
              label: "Ladepunkt 6",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp7",
              label: "Ladepunkt 7",
              validTypes: ["chargePoint"],
            },
            {
              key: "cp8",
              label: "Ladepunkt 8",
              validTypes: ["chargePoint"],
            },
          ],
        },
        {
          sectionName: "Zähler",
          sectionComponents: [
            { key: "evu", label: "EVU", validTypes: ["counter"] },
            {
              key: "consumer1",
              label: "Verbraucher 1",
              validTypes: ["counter"],
            },
            {
              key: "consumer2",
              label: "Verbraucher 2",
              validTypes: ["counter"],
            },
            {
              key: "consumer3",
              label: "Verbraucher 3",
              validTypes: ["counter"],
            },
          ],
        },
        {
          sectionName: "Wechselrichter",
          sectionComponents: [
            {
              key: "pvAll",
              label: "Wechselrichter (Summe)",
              validTypes: ["inverter"],
              help: "Die 1.9er Version von openWB speichert lediglich die Summen-Leistung aller Wechselrichter.",
            },
          ],
        },
        {
          sectionName: "Batteriespeicher",
          sectionComponents: [
            {
              key: "bat",
              label: "Speicher 1",
              validTypes: ["battery"],
            },
          ],
        },
        {
          sectionName: "Fahrzeuge",
          sectionComponents: [
            {
              key: "ev1",
              label: "Fahrzeug von Ladepunkt 1",
              validTypes: ["vehicle"],
            },
            {
              key: "ev2",
              label: "Fahrzeug von Ladepunkt 2",
              validTypes: ["vehicle"],
            },
          ],
        },
        {
          sectionName: "SmartHome 2.0",
          sectionComponents: [
            {
              key: "sh1",
              label: "Gerät 1",
              validTypes: ["smartHome"],
            },
            {
              key: "sh2",
              label: "Gerät 2",
              validTypes: ["smartHome"],
            },
            {
              key: "sh3",
              label: "Gerät 3",
              validTypes: ["smartHome"],
            },
            {
              key: "sh4",
              label: "Gerät 4",
              validTypes: ["smartHome"],
            },
            {
              key: "sh5",
              label: "Gerät 5",
              validTypes: ["smartHome"],
            },
            {
              key: "sh6",
              label: "Gerät 6",
              validTypes: ["smartHome"],
            },
            {
              key: "sh7",
              label: "Gerät 7",
              validTypes: ["smartHome"],
            },
            {
              key: "sh8",
              label: "Gerät 8",
              validTypes: ["smartHome"],
            },
            {
              key: "sh9",
              label: "Gerät 9",
              validTypes: ["smartHome"],
            },
          ],
        },
      ],
      dataMigrationMapping: {
        cp1: undefined,
        cp2: undefined,
        cp3: undefined,
        cp4: undefined,
        cp5: undefined,
        cp6: undefined,
        cp7: undefined,
        cp8: undefined,
        evu: undefined,
        pvAll: undefined,
        bat: undefined,
        consumer1: undefined,
        consumer2: undefined,
        consumer3: undefined,
        sh1: undefined,
        sh2: undefined,
        sh3: undefined,
        sh4: undefined,
        sh5: undefined,
        sh6: undefined,
        sh7: undefined,
        sh8: undefined,
        sh9: undefined,
        ev1: undefined,
        ev2: undefined,
      },
    };
  },
  computed: {
    backupCloudList() {
      return this.$store.state.mqtt["openWB/system/configurable/backup_clouds"];
    },
    componentConfigurations() {
      return this.getWildcardTopics("openWB/system/device/+/component/+/config");
    },
    chargePointOptions() {
      let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
      var myOptions = [];
      for (const element of Object.values(chargePoints)) {
        myOptions.push({ value: element.id, text: element.name });
      }
      return myOptions;
    },
    counterOptions() {
      var myOptions = [];
      for (const element of Object.values(this.componentConfigurations)) {
        if (this.isComponentType(element.type, "counter")) {
          myOptions.push({ value: element.id, text: element.name });
        }
      }
      return myOptions;
    },
    inverterOptions() {
      var myOptions = [];
      for (const element of Object.values(this.componentConfigurations)) {
        if (this.isComponentType(element.type, "inverter")) {
          myOptions.push({ value: element.id, text: element.name });
        }
      }
      return myOptions;
    },
    monitoringList() {
      return this.$store.state.mqtt["openWB/system/configurable/monitoring"];
    },
    batteryOptions() {
      var myOptions = [];
      for (const element of Object.values(this.componentConfigurations)) {
        if (this.isComponentType(element.type, "bat")) {
          myOptions.push({ value: element.id, text: element.name });
        }
      }
      return myOptions;
    },
    vehicleOptions() {
      let vehicleNames = this.getWildcardTopics("openWB/vehicle/+/name");
      var myOptions = [];
      for (const [key, name] of Object.entries(vehicleNames)) {
        let id = parseInt(key.match(/\/(\d\d?)\//)[1]);
        myOptions.push({ value: id, text: name });
      }
      return myOptions;
    },
    smartHomeOptions() {
      let smartHomeDevices = this.getWildcardTopics("openWB/LegacySmartHome/config/get/Devices/+/device_configured");
      var myOptions = [];
      for (const [key, value] of Object.entries(smartHomeDevices)) {
        if (value == 1) {
          let id = parseInt(key.match(/\/(\d\d?)\//)[1]);
          myOptions.push({
            value: id,
            text: this.$store.state.mqtt[`openWB/LegacySmartHome/config/get/Devices/${id}/device_name`],
          });
        }
      }
      return myOptions;
    },
  },
  methods: {
    /**
     * checks, if "componentType" is some kind of "verifier"
     * @param {String} componentType
     * @param {String} verifier
     */
    isComponentType(componentType, verifier) {
      return componentType.split("_").includes(verifier);
    },
    getBackupCloudDefaultConfiguration(backupCloudType) {
      const backupCloudDefaults = this.backupCloudList.find((element) => element.value == backupCloudType);
      if (Object.prototype.hasOwnProperty.call(backupCloudDefaults, "defaults")) {
        return {
          ...JSON.parse(JSON.stringify(backupCloudDefaults.defaults)),
        };
      }
      console.warn("no default configuration found for backup cloud type!", backupCloudType);
      return {};
    },
    sendSystemCommand(command, data = {}) {
      this.$emit("sendCommand", {
        command: command,
        data: data,
      });
    },
    getMigrationOptions(validTypes) {
      var options = [
        {
          value: undefined,
          text: "-- nicht übernehmen --",
        },
      ];
      if (validTypes.includes("chargePoint")) {
        options.push(...this.chargePointOptions);
      }
      if (validTypes.includes("counter")) {
        options.push(...this.counterOptions);
      }
      if (validTypes.includes("inverter")) {
        options.push(...this.inverterOptions);
      }
      if (validTypes.includes("battery")) {
        options.push(...this.batteryOptions);
      }
      if (validTypes.includes("vehicle")) {
        options.push(...this.vehicleOptions);
      }
      if (validTypes.includes("smartHome")) {
        options.push(...this.smartHomeOptions);
      }
      return options;
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
    updateSelectedBackupCloud($event) {
      this.updateState("openWB/system/backup_cloud/config", $event, "type");
      this.updateState("openWB/system/backup_cloud/config", this.getBackupCloudDefaultConfiguration($event));
    },
    updateSelectedRestoreFile(event) {
      this.selectedRestoreFile = event.target.files[0];
    },
    updateSelectedDataMigrationFile(event) {
      this.selectedDataMigrationFile = event.target.files[0];
    },
    uploadFile(target, selectedFile, successMessage) {
      return new Promise((resolve) => {
        if (selectedFile !== undefined) {
          this.$root.postClientMessage("Hochladen der Datei gestartet.", "info");
          let formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("target", target);
          this.axios
            .post(location.protocol + "//" + location.host + "/openWB/web/settings/uploadFile.php", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              this.$root.postClientMessage(successMessage, "success");
              resolve(true);
            })
            .catch((error) => {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.status, error.response.data);
                var alertMessage =
                  "Hochladen der Datei fehlgeschlagen!" + "<br />" + error.response.status + ": " + error.response.data;
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.error(error.request);
                alertMessage += "Es wurde keine Antwort vom Server empfangen.";
              } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error", error.message);
                alertMessage += "Es ist ein unbekannter Fehler aufgetreten.";
              }
              this.$root.postClientMessage(alertMessage, "danger");
              resolve(false);
            });
        } else {
          console.error("no file selected for upload");
          resolve(false);
        }
      });
    },
    getMonitoringDefaultConfiguration(monitoringType) {
      const monitoringDefaults = this.monitoringList.find((element) => element.value == monitoringType);
      if (Object.prototype.hasOwnProperty.call(monitoringDefaults, "defaults")) {
        return { ...monitoringDefaults.defaults };
      }
      console.warn("no default configuration found for monitoring type!", monitoringType);
      return {};
    },
    updateSelectedMonitoring($event) {
      this.updateState("openWB/optional/monitoring/config", $event, "type");
      this.updateState("openWB/optional/monitoring/config", this.getMonitoringDefaultConfiguration($event));
    },
    async uploadRestoreFile() {
      const successMessage =
        "Die Sicherungsdatei wurde erfolgreich hochgeladen. " + "Sie können die Wiederherstellung jetzt starten.";
      this.restoreUploadDone = await this.uploadFile("restore", this.selectedRestoreFile, successMessage);
    },
    async uploadDataMigrationFile() {
      const successMessage =
        "Die Sicherungsdatei wurde erfolgreich hochgeladen. " + "Sie können den Import jetzt starten.";
      this.dataMigrationUploadDone = await this.uploadFile("migrate", this.selectedDataMigrationFile, successMessage);
    },
    restoreBackup() {
      this.sendSystemCommand("restoreBackup");
      this.$store.commit("storeLocal", {
        name: "reloadRequired",
        value: true,
      });
    },
    dataMigration() {
      this.sendSystemCommand("dataMigration", this.dataMigrationMapping);
    },
    factoryReset() {
      this.sendSystemCommand("factoryReset", {});
      this.$store.commit("storeLocal", {
        name: "reloadRequired",
        value: true,
      });
    },
  },
};
</script>
