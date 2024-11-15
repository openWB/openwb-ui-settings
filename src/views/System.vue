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
      <form name="versionInfoForm">
        <openwb-base-card
          title="Versions-Informationen / Aktualisierung"
          subtype="success"
          :collapsible="true"
          :collapsed="!installAssistantActive"
        >
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
          <openwb-base-alert subtype="danger">
            Nach einem Update wird die Ladestation direkt neu gestartet! Es werden alle eventuell vorhandenen lokalen
            Änderungen am Programmcode mit dem Update verworfen!
          </openwb-base-alert>
          <openwb-base-alert
            v-if="$store.state.mqtt['openWB/system/current_branch'] != 'Release'"
            subtype="danger"
          >
            Du bist nicht auf dem für den normalen Gebrauch empfohlenen Entwicklungszweig "Release". Wir empfehlen, auf
            diesen Zweig zu wechseln, sobald dort eine neue Version verfügbar ist.<br />
            Bevor ein Update angestoßen wird, sollte immer eine Sicherung erstellt werden! Es kann zwar wieder auf eine
            ältere Version gewechselt werden, jedoch ist nicht sichergestellt, dass es dabei keine Probleme gibt. Gerade
            wenn das Datenformat in der neuen Version angepasst wurde, wird eine ältere damit Fehler produzieren.
          </openwb-base-alert>
          <template #footer>
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  class="btn-info"
                  @button-clicked="sendSystemCommand('systemFetchVersions')"
                >
                  Informationen aktualisieren
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'download']"
                  />
                </openwb-base-click-button>
              </div>
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  :class="updateAvailable ? 'btn-success clickable' : 'btn-outline-success'"
                  :disabled="!updateAvailable"
                  @button-clicked="systemUpdate()"
                >
                  Update
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'arrow-alt-circle-up']"
                  />
                </openwb-base-click-button>
              </div>
            </div>
          </template>
        </openwb-base-card>
      </form>
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
          <template #footer>
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  class="btn-warning"
                  @button-clicked="sendSystemCommand('systemReboot')"
                >
                  Neustart
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'undo']"
                  />
                </openwb-base-click-button>
              </div>
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  class="btn-danger"
                  @button-clicked="sendSystemCommand('systemShutdown')"
                >
                  Ausschalten
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'power-off']"
                  />
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
            :groups="getBranchGroups()"
            :model-value="$store.state.mqtt['openWB/system/current_branch']"
            @update:model-value="updateState('openWB/system/current_branch', $event)"
          />
          <openwb-base-select-input
            v-model="selectedTag"
            title="Tag"
            :options="getBranchTagOptions()"
          />
          <template #footer>
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex py-1 justify-content-center">
                <openwb-base-click-button
                  :class="releaseChangeValid ? 'btn-danger clickable' : 'btn-outline-danger'"
                  :disabled="!releaseChangeValid"
                  @button-clicked="switchBranch()"
                >
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'skull-crossbones']"
                  />
                  Branch und Tag wechseln
                  <font-awesome-icon
                    fixed-width
                    :icon="['fas', 'skull-crossbones']"
                  />
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
  emits: ["sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/system/optionBackup",
        "openWB/system/current_commit",
        "openWB/system/current_branch_commit",
        "openWB/system/current_missing_commits",
        "openWB/system/available_branches",
        "openWB/system/current_branch",
        "openWB/system/version",
      ],
      warningAcknowledged: false,
      selectedTag: "*HEAD*",
    };
  },
  computed: {
    updateAvailable() {
      return (
        this.$store.state.mqtt["openWB/system/current_branch_commit"] &&
        this.$store.state.mqtt["openWB/system/current_branch_commit"] !=
          this.$store.state.mqtt["openWB/system/current_commit"]
      );
    },
    releaseChangeValid() {
      return (
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
  },
  methods: {
    sendSystemCommand(command, data = {}) {
      this.$emit("sendCommand", {
        command: command,
        data: data,
      });
    },
    getBranchGroups() {
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
    getBranchTagOptions() {
      if (
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
      return options;
    },
    updateConfiguration(key, event) {
      console.debug("updateConfiguration", key, event);
      this.updateState(key, event.value, event.object);
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
  },
};
</script>

<style scoped>
.missing-commits {
  overflow-y: scroll;
  max-height: 20rem;
}
</style>
