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
        title="System Information"
        subtype="info"
        :collapsible="true"
        :collapsed="true"
      >
        <form name="systemInfoForm">
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/serial_number']"
            title="Seriennummer"
            readonly
          />
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/ip_address']"
            title="IP-Adresse"
            subtype="host"
            readonly
          />
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/mac_address']"
            title="MAC-Adresse"
            readonly
          />
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/hostname']"
            title="Hostname"
            subtype="host"
            required
            readonly
          />
          <!-- <openwb-base-submit-buttons
            form-name="systemInfoForm"
            :hide-defaults="true"
            :hide-reset="true"
            save-label="Hostnamen ändern"
            @save="$emit('save', ['openWB/system/hostname'])"
          /> -->
        </form>
      </openwb-base-card>
      <openwb-base-card
        title="Versions-Informationen / Aktualisierung"
        subtype="success"
        :collapsible="true"
        :collapsed="!installAssistantActive"
      >
        <form name="versionInfoForm">
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/current_branch']"
            title="Entwicklungszweig"
            readonly
          />
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/version']"
            title="Bezeichnung"
            readonly
          />
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/current_commit']"
            title="installierte Version"
            readonly
            :class="updateAvailable ? 'text-danger' : 'text-success'"
          />
          <openwb-base-text-input
            v-model="$store.state.mqtt['openWB/system/current_branch_commit']"
            title="aktuellste Version"
            readonly
          />
          <openwb-base-card
            v-if="updateAvailable"
            title="Änderungen"
            subtype="info"
            :collapsible="true"
            :collapsed="true"
          >
            <ul class="missing-commits">
              <li
                v-for="(commit, key) in $store.state.mqtt['openWB/system/current_missing_commits']"
                :key="key"
              >
                {{ commit }}
              </li>
            </ul>
          </openwb-base-card>
          <openwb-base-alert
            v-if="!installAssistantActive"
            subtype="danger"
          >
            Nach einem Update wird die Ladestation direkt neu gestartet! Es werden alle eventuell vorhandenen lokalen
            Änderungen am Programmcode mit dem Update verworfen!
          </openwb-base-alert>
          <openwb-base-alert
            v-if="$store.state.mqtt['openWB/system/current_branch'] != 'Release' && !installAssistantActive"
            subtype="danger"
          >
            Du bist nicht auf dem für den normalen Gebrauch empfohlenen Entwicklungszweig "Release". Wir empfehlen, auf
            diesen Zweig zu wechseln, sobald dort eine neue Version verfügbar ist.<br />
            Bevor ein Update angestoßen wird, sollte immer eine Sicherung erstellt werden! Es kann zwar wieder auf eine
            ältere Version gewechselt werden, jedoch ist nicht sichergestellt, dass es dabei keine Probleme gibt. Gerade
            wenn das Datenformat in der neuen Version angepasst wurde, wird eine ältere damit Fehler produzieren.
          </openwb-base-alert>
          <div class="row justify-content-center">
            <div class="col-md-4 d-flex py-1 justify-content-center">
              <openwb-base-click-button
                :class="updateAvailable ? 'btn-success clickable' : 'btn-outline-success'"
                :disabled="!updateAvailable"
                @button-clicked="systemUpdate()"
              >
                Update
                <font-awesome-icon :icon="['fas', 'arrow-alt-circle-up']" />
              </openwb-base-click-button>
            </div>
          </div>
          <div
            v-if="
              $store.state.mqtt['openWB/general/extern'] != true &&
              !installAssistantActive &&
              Object.keys(externalChargePoints).length > 0
            "
          >
            <hr />
            <openwb-base-heading>Automatisches Update von Secondary openWBs</openwb-base-heading>
            <openwb-base-alert subtype="info">
              Die automatische Updatefunktion für Secondary openWBs ist nur verfügbar, wenn sich die Primary openWB auf
              dem Entwicklungszweig "Release" befindet. Das Update wird nur auf Secondary openWBs durchgeführt, welche
              sich ebenfalls auf dem Entwicklungszweig "Release" befinden. Ist die dort installierte Releaseversion zu
              alt, muss ein einmaliges Update auf die aktuelle Version manuell auf der betroffenen openWB durchgeführt
              werden.
            </openwb-base-alert>
            <div v-if="$store.state.mqtt['openWB/system/current_branch'] == 'Release'">
              <openwb-base-button-group-input
                title="Secondary openWBs automatisch mit der Primary updaten"
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
                :model-value="$store.state.mqtt['openWB/system/secondary_auto_update']"
                @update:model-value="updateState('openWB/system/secondary_auto_update', $event)"
              >
                <template #help>
                  Diese Option ist nur auf dem Entwicklungszweig "Release" verfügbar. Ist diese Option aktiviert, dann
                  werden Secondary openWBs, welche sich ebenfalls auf dem Entwicklungszweig "Release" befinden
                  gleichzeitig mit der Primary openWB aktualisiert.
                </template>
              </openwb-base-button-group-input>
            </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Secondary</th>
                  <th>Software-Status</th>
                  <th>IP-Adresse</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="externalChargePoint in externalChargePoints"
                  :key="externalChargePoint.id"
                >
                  <td>{{ externalChargePoint.name }}</td>
                  <td>
                    {{
                      $store.state.mqtt["openWB/chargepoint/" + externalChargePoint.id + "/get/current_branch"] ===
                      undefined
                        ? "Version zu alt oder openWB ist nicht erreichbar. Bitte manuell updaten bzw. prüfen."
                        : $store.state.mqtt["openWB/chargepoint/" + externalChargePoint.id + "/get/current_branch"] !=
                            "Release"
                          ? "Secondary ist nicht auf dem Release-Zweig. Bitte manuell updaten."
                          : $store.state.mqtt["openWB/chargepoint/" + externalChargePoint.id + "/get/current_branch"] +
                            " " +
                            $store.state.mqtt["openWB/chargepoint/" + externalChargePoint.id + "/get/version"]
                    }}
                  </td>
                  <td>{{ externalChargePoint.configuration.ip_address }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="$store.state.mqtt['openWB/system/current_branch'] == 'Release'">
              <openwb-base-submit-buttons
                form-name="versionInfoForm"
                :hide-defaults="true"
                @save="$emit('save')"
                @reset="$emit('reset')"
              />
            </div>
          </div>
        </form>
      </openwb-base-card>
      <form
        v-if="!installAssistantActive"
        name="powerForm"
      >
        <openwb-base-card
          title="Betrieb"
          :collapsible="true"
          :collapsed="true"
        >
          <openwb-base-alert subtype="danger">
            Wenn die Ladestation ausgeschaltet wird, muss sie komplett spannungsfrei geschaltet werden. Erst beim
            erneuten Zuschalten der Spannung fährt das System wieder hoch.
          </openwb-base-alert>
          <openwb-base-alert subtype="info">
            Ein Neustart löscht wichtige Protokolle, die bei der Fehlersuche helfen können. <br />Tipp: Erstelle
            stattdessen zuerst einen <router-link to="/System/Support"> Systembericht </router-link> – das hilft oft
            mehr und bewahrt alle relevanten Logs.
          </openwb-base-alert>
          <template #footer>
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  class="btn-warning"
                  @button-clicked="systemReboot()"
                >
                  Neustart
                  <font-awesome-icon :icon="['fas', 'undo']" />
                </openwb-base-click-button>
              </div>
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  class="btn-danger"
                  @button-clicked="systemShutdown()"
                >
                  Ausschalten
                  <font-awesome-icon :icon="['fas', 'power-off']" />
                </openwb-base-click-button>
              </div>
            </div>
          </template>
        </openwb-base-card>
      </form>
      <form
        v-if="!installAssistantActive"
        name="releaseChangeForm"
      >
        <openwb-base-card
          title="Entwicklungszweig"
          subtype="danger"
          :collapsible="true"
          :collapsed="true"
        >
          <openwb-base-alert subtype="danger">
            Nach einem Wechsel wird die Ladestation direkt neu gestartet! Es werden alle lokalen Änderungen mit dem
            Wechsel verworfen!
          </openwb-base-alert>
          <openwb-base-alert subtype="warning">
            Bevor auf einen neuen Entwicklungszweig gewechselt wird sollte immer eine Sicherung erstellt werden! Es kann
            zwar wieder auf eine ältere Version gewechselt werden, jedoch ist nicht sichergestellt, dass es dabei keine
            Probleme gibt. Gerade wenn das Datenformat in der neuen Version angepasst wurde, wird eine ältere damit
            Fehler produzieren.<br />
            Für den normalen Betrieb wird der Zweig "Release" empfohlen. Der Softwarestand wurde ausgiebig getestet,
            sodass ein Fehlverhalten relativ unwahrscheinlich ist.<br />
            Der "Beta" Zweig beinhaltet Vorabversionen, bei denen die Entwicklung soweit abgeschlossen ist. Die
            enthaltenen Anpassungen wurden rudimentär getestet, können aber durchaus noch Fehler enthalten.<br />
            Die aktuelle Softwareentwicklung findet im Zweig "master" statt. Die enthaltenen Anpassungen sind teilweise
            noch nicht getestet und enthalten potentiell Fehler.<br />
            Einträge, die mit "feature" beginnen, sind experimentelle Entwicklungszweige, die nicht für den allgemeinen
            Gebrauch gedacht sind.
          </openwb-base-alert>
          <openwb-base-select-input
            title="Entwicklungszweig"
            :groups="branchGroups"
            :model-value="$store.state.mqtt['openWB/system/current_branch']"
            @update:model-value="updateState('openWB/system/current_branch', $event)"
          />
          <openwb-base-select-input
            v-model="selectedTag"
            title="Tag"
            :options="branchTagOptions"
          />
          <template #footer>
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  :class="releaseChangeValid ? 'btn-danger clickable' : 'btn-outline-danger'"
                  :disabled="!releaseChangeValid"
                  @button-clicked="switchBranch()"
                >
                  <font-awesome-icon :icon="['fas', 'skull-crossbones']" />
                  Branch und Tag wechseln
                  <font-awesome-icon :icon="['fas', 'skull-crossbones']" />
                </openwb-base-click-button>
              </div>
            </div>
          </template>
        </openwb-base-card>
      </form>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleUp as fasArrowAltCircleUp,
  faUndo as fasUndo,
  faPowerOff as fasPowerOff,
  faDownload as fasDownload,
  faSkullCrossbones as fasSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
library.add(fasArrowAltCircleUp, fasUndo, fasPowerOff, fasDownload, fasSkullCrossbones);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbSystemView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    installAssistantActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  // "save" and "reset" are already defined in ComponentState but check is failing if not defined here?
  emits: ["save", "reset", "sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/system/secondary_auto_update",
        "openWB/system/current_commit",
        "openWB/system/current_branch_commit",
        "openWB/system/current_missing_commits",
        "openWB/system/available_branches",
        "openWB/system/current_branch",
        "openWB/system/version",
        "openWB/system/serial_number",
        "openWB/system/hostname",
        "openWB/system/ip_address",
        "openWB/system/mac_address",
        "openWB/chargepoint/+/get/version",
        "openWB/chargepoint/+/get/current_branch",
        "openWB/chargepoint/+/config",
      ],
      warningAcknowledged: false,
      selectedTag: "*HEAD*",
    };
  },
  computed: {
    externalChargePoints: {
      get() {
        let chargePoints = this.getWildcardTopics("openWB/chargepoint/+/config");
        let myObj = {};
        for (const [key, element] of Object.entries(chargePoints)) {
          if (element.type === "external_openwb") {
            myObj[key] = element;
          }
        }
        return myObj;
      },
    },
    updateAvailable() {
      return (
        this.$store.state.mqtt["openWB/system/current_branch_commit"] &&
        this.$store.state.mqtt["openWB/system/current_branch_commit"] !=
          this.$store.state.mqtt["openWB/system/current_commit"]
      );
    },
    releaseChangeValid() {
      return (
        this.$store.state.mqtt["openWB/system/current_branch"] !== undefined &&
        this.$store.state.mqtt["openWB/system/available_branches"] !== undefined &&
        this.$store.state.mqtt["openWB/system/current_branch"] in
          this.$store.state.mqtt["openWB/system/available_branches"] &&
        "tags" in
          this.$store.state.mqtt["openWB/system/available_branches"][
            this.$store.state.mqtt["openWB/system/current_branch"]
          ] &&
        this.selectedTag in
          this.$store.state.mqtt["openWB/system/available_branches"][
            this.$store.state.mqtt["openWB/system/current_branch"]
          ]["tags"]
      );
    },
    branchGroups() {
      const releaseBranch = "Release";
      const betaBranch = "Beta";
      const developmentBranch = "master";
      const officialBranches = [releaseBranch, betaBranch];

      const compareBranches = (a, b) => {
        if (a.value == b.value) return 0;
        if (a.value == releaseBranch) return -1;
        if (b.value == releaseBranch) return 1;
        if (a.value == betaBranch) return -1;
        if (b.value == betaBranch) return 1;
        if (a.value == developmentBranch) return -1;
        if (b.value == developmentBranch) return 1;
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      };

      var source = this.$store.state.mqtt["openWB/system/available_branches"];
      var groups = [
        { label: "Allgemein", options: [] },
        { label: "Alpha-Zweig", options: [] },
        { label: "Experimentell", options: [] },
      ];
      if (source !== undefined) {
        var targetGroup = 0;
        for (const [key, value] of Object.entries(source)) {
          if (officialBranches.includes(key)) {
            targetGroup = 0;
          } else if (key == developmentBranch) {
            targetGroup = 1;
          } else {
            targetGroup = 2;
          }
          groups[targetGroup].options.push({
            value: key,
            text: key + " (" + value.commit + ")",
          });
        }
        groups[0].options.sort(compareBranches);
        groups[1].options.sort(compareBranches);
      }
      return groups;
    },
    branchTagOptions() {
      const compareTags = (a, b) => {
        const splitVersion = (version) => {
          const versionParts = version.split("-");
          const versionSemver = versionParts[0].split(".");
          let versionSuffix = [];
          if (versionParts.length > 1) {
            versionSuffix = versionParts[1].split(".");
          } else {
            versionSuffix = ["release", "0"];
          }
          return {
            semver: versionSemver,
            suffix: versionSuffix,
          };
        };

        const aVersion = splitVersion(a.value);
        const bVersion = splitVersion(b.value);
        if (aVersion.semver[0] == "*HEAD*") return -1;
        if (bVersion.semver[0] == "*HEAD*") return 1;
        if (aVersion.semver[0] > bVersion.semver[0]) return -1;
        if (aVersion.semver[0] < bVersion.semver[0]) return 1;
        if (aVersion.semver[1] > bVersion.semver[1]) return -1;
        if (aVersion.semver[1] < bVersion.semver[1]) return 1;
        if (aVersion.semver[2] > bVersion.semver[2]) return -1;
        if (aVersion.semver[2] < bVersion.semver[2]) return 1;
        switch (aVersion.suffix[0].toLowerCase()) {
          case "alpha":
            if (["beta", "rc", "release", "patch"].includes(bVersion.suffix[0].toLowerCase())) return -1;
            if (aVersion.suffix[1] > bVersion.suffix[1]) return -1;
            if (aVersion.suffix[1] < bVersion.suffix[1]) return 1;
            break;
          case "beta":
            if (["alpha"].includes(bVersion.suffix[0].toLowerCase())) return -1;
            if (["rc", "release", "patch"].includes(bVersion.suffix[0].toLowerCase())) return 1;
            if (aVersion.suffix[1] > bVersion.suffix[1]) return -1;
            if (aVersion.suffix[1] < bVersion.suffix[1]) return 1;
            break;
          case "rc":
            if (["alpha", "beta"].includes(bVersion.suffix[0].toLowerCase())) return -1;
            if (["release", "patch"].includes(bVersion.suffix[0].toLowerCase())) return 1;
            if (aVersion.suffix[1] > bVersion.suffix[1]) return -1;
            if (aVersion.suffix[1] < bVersion.suffix[1]) return 1;
            break;
          case "release":
            if (["alpha", "beta", "rc"].includes(bVersion.suffix[0].toLowerCase())) return -1;
            if (["patch"].includes(bVersion.suffix[0].toLowerCase())) return 1;
            break;
          case "patch":
            if (["alpha", "beta", "rc", "release"].includes(bVersion.suffix[0].toLowerCase())) return -1;
            if (aVersion.suffix[1] > bVersion.suffix[1]) return -1;
            if (aVersion.suffix[1] < bVersion.suffix[1]) return 1;
            break;
        }
        return 0;
      };

      if (
        this.$store.state.mqtt["openWB/system/current_branch"] === undefined ||
        this.$store.state.mqtt["openWB/system/available_branches"] === undefined ||
        !(
          this.$store.state.mqtt["openWB/system/current_branch"] in
          this.$store.state.mqtt["openWB/system/available_branches"]
        )
      ) {
        return [];
      }
      var source =
        this.$store.state.mqtt["openWB/system/available_branches"][
          this.$store.state.mqtt["openWB/system/current_branch"]
        ]["tags"];
      var options = [];
      if (source !== undefined) {
        for (const [key, value] of Object.entries(source)) {
          options.unshift({
            value: key,
            text: value,
          });
        }
      }
      return options.sort(compareTags);
    },
  },
  beforeMount() {
    this.sendSystemCommand("systemFetchVersions");
  },
  methods: {
    sendSystemCommand(command, data = {}) {
      this.$emit("sendCommand", {
        command: command,
        data: data,
      });
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
    },
    systemReboot() {
      this.$store.commit("storeLocal", {
        name: "reloadRequired",
        value: true,
      });
      this.sendSystemCommand("systemReboot");
    },
    systemShutdown() {
      this.sendSystemCommand("systemShutdown");
    },
    systemUpdate() {
      this.sendSystemCommand("systemUpdate", {});
      this.$store.commit("storeLocal", {
        name: "reloadRequired",
        value: true,
      });
    },
    switchBranch() {
      this.sendSystemCommand("systemUpdate", {
        branch: this.$store.state.mqtt["openWB/system/current_branch"],
        tag: this.selectedTag,
      });
      this.$store.commit("storeLocal", {
        name: "reloadRequired",
        value: true,
      });
    },
    filterComponentsByType(components, type) {
      return Object.keys(components)
        .filter((key) => {
          return components[key].type.includes(type);
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: components[key],
          };
        }, {});
    },
  },
};
</script>

<style scoped>
.missing-commits {
  overflow-y: scroll;
  max-height: 20rem;
}
.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.table-striped tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}
</style>
