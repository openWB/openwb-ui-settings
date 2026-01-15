<template>
  <!-- modal dialogs -->
  <openwb-base-modal-dialog
    :show="showCloudRemoveModal"
    title="Cloud Zugang löschen"
    subtype="danger"
    :buttons="[{ text: 'Löschen', event: 'confirm', subtype: 'danger' }]"
    @modal-result="removeCloud($event)"
  >
    Willst Du den vorhandenen Cloud Zugang wirklich entfernen? Dieser Vorgang kann nicht rückgängig gemacht werden!
  </openwb-base-modal-dialog>
  <!-- main content -->
  <div class="cloud-config">
    <openwb-base-alert
      v-if="$store.state.mqtt['openWB/system/dataprotection_acknowledged'] !== true"
      subtype="danger"
    >
      Du musst der
      <router-link to="/System/LegalSettings"> Datenschutzerklärung </router-link>
      zustimmen, um die openWB Cloud nutzen zu können.
    </openwb-base-alert>
    <div v-else>
      <openwb-base-alert subtype="success">
        Du hast der
        <router-link to="/System/LegalSettings"> Datenschutzerklärung </router-link>
        zugestimmt und kannst die openWB Cloud nutzen.
      </openwb-base-alert>
      <openwb-base-alert
        v-if="!enableRemoveCloudButton"
        subtype="warning"
      >
        Der Zugang wurde entfernt. Bitte starte die openWB neu, um die Änderungen anzuwenden!
      </openwb-base-alert>
      <form
        v-if="!cloudBridgeKey"
        name="cloudConfigConnectForm"
      >
        <openwb-base-card title="Vorhandenen Zugang einrichten">
          <openwb-base-alert subtype="info">
            <p>
              Bitte nutze die in/an der openWB notierten Zugangsdaten. Wenn bei einer gekauften openWB keine
              Zugangsdaten vorhanden sind, schreibe bitte eine Mail unter Angabe der Bestell- und/oder Seriennummer an
              <a
                href="mailto:support@openwb.de"
                subject="Cloud Zugangsdaten"
              >
                support@openwb.de
              </a>
              .
            </p>
            <p>
              Eine Anleitung zur Einrichtung der openWB Cloud findest Du im
              <a
                href="https://wiki.openwb.de/doku.php?id=openwb:tutorials:cloudeinrichten"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wiki </a
              >.
            </p>
          </openwb-base-alert>
          <openwb-base-text-input
            v-model="connectCloudData.username"
            title="Benutzername"
            required
            subtype="user"
          />
          <openwb-base-text-input
            v-model="connectCloudData.password"
            title="Passwort"
            required
            subtype="password"
          />
          <openwb-base-button-group-input
            v-model="connectCloudData.partner"
            title="Zugang für Partner"
            :buttons="[
              {
                buttonValue: false,
                text: 'Aus',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'An',
                class: 'btn-outline-success',
              },
            ]"
          >
            <template #help>
              Wenn diese openWB über einen Partner erworben wurde, kann hier ein Support-Zugang für diesen freigegeben
              werden.
            </template>
          </openwb-base-button-group-input>
          <openwb-base-array-input
            v-if="connectCloudData.partner"
            title="Gültige Partner-IDs"
            no-elements-message="Keine Partner-ID zugeordnet."
            :model-value="$store.state.mqtt['openWB/system/mqtt/valid_partner_ids']"
            @update:model-value="updateState('openWB/system/mqtt/valid_partner_ids', $event)"
          >
            <template #input-prefix>
              <font-awesome-icon :icon="['fas', 'user-gear']" />
            </template>
            <template #element-prefix>
              <font-awesome-icon :icon="['fas', 'user-gear']" />
            </template>
            <template #help>
              Die Partner-ID erhältst Du von Deinem Installateur. Ist hier keine Partner-ID eingetragen, dann kann auch
              niemand - trotz aktiviertem Zugang für Partner - über das Partner-Portal auf diese openWB zugreifen!
            </template>
          </openwb-base-array-input>
          <template
            v-if="$store.state.mqtt['openWB/system/dataprotection_acknowledged'] === true"
            #footer
          >
            <div class="row justify-content-center">
              <openwb-base-click-button
                class="col-4"
                :class="enableCloudConnectButton ? 'btn-success' : 'btn-outline-success'"
                :disabled="!enableCloudConnectButton"
                @button-clicked="connectCloud"
              >
                Mit Cloud verbinden
              </openwb-base-click-button>
            </div>
          </template>
        </openwb-base-card>
      </form>
      <form
        v-if="cloudBridgeKey"
        name="cloudConfigured"
      >
        <openwb-base-alert
          v-if="!enableCloudConnectButton || !enableNewCloudButton"
          subtype="warning"
        >
          Der Zugang wurde eingerichtet. Bitte starte die die openWB neu, um die Änderungen anzuwenden!
        </openwb-base-alert>
        <openwb-base-card title="Vorhandener Cloud Zugang">
          <openwb-base-heading>
            <span>
              Mit diesen Zugangsdaten kannst Du dich in der
              <a
                href="https://remote.openwb.de/"
                target="_blank"
                rel="noopener noreferrer"
              >
                openWB Cloud
              </a>
              anmelden.
            </span>
          </openwb-base-heading>
          <openwb-base-text-input
            v-model="cloudSettings.username"
            title="Benutzername"
            required
            subtype="user"
            disabled
          />
          <openwb-base-text-input
            v-model="cloudSettings.password"
            title="Passwort"
            required
            subtype="password"
            disabled
          />
          <hr />
          <openwb-base-button-group-input
            title="Zugang für Partner"
            :buttons="[
              {
                buttonValue: false,
                text: 'Aus',
                class: 'btn-outline-danger',
              },
              {
                buttonValue: true,
                text: 'An',
                class: 'btn-outline-success',
              },
            ]"
            :model-value="cloudSettings.partner"
            @update:model-value="updateState(cloudBridgeKey, $event, 'access.partner')"
          >
            <template #help>
              Wenn diese openWB über einen Partner erworben wurde, kann hier ein Support-Zugang für diesen freigegeben
              werden.
            </template>
          </openwb-base-button-group-input>
          <openwb-base-array-input
            v-if="cloudSettings.partner"
            title="Gültige Partner-IDs"
            no-elements-message="Keine Partner-ID zugeordnet."
            :model-value="$store.state.mqtt['openWB/system/mqtt/valid_partner_ids']"
            @update:model-value="updateState('openWB/system/mqtt/valid_partner_ids', $event)"
          >
            <template #input-prefix>
              <font-awesome-icon :icon="['fas', 'user-gear']" />
            </template>
            <template #element-prefix>
              <font-awesome-icon :icon="['fas', 'user-gear']" />
            </template>
            <template #help>
              Die Partner-ID erhältst Du von Deinem Installateur. Ist hier keine Partner-ID eingetragen, dann kann auch
              niemand - trotz aktiviertem Zugang für Partner - über das Partner-Portal auf diese openWB zugreifen!
            </template>
          </openwb-base-array-input>
          <template #footer>
            <div class="row justify-content-center">
              <openwb-base-click-button
                class="col-4"
                :class="enableRemoveCloudButton ? 'btn-danger' : 'btn-outline-danger'"
                :disabled="!enableRemoveCloudButton"
                @button-clicked="removeCloudModal($event)"
              >
                Zugang löschen
              </openwb-base-click-button>
            </div>
          </template>
        </openwb-base-card>
      </form>
      <openwb-base-submit-buttons
        v-if="cloudBridgeKey"
        form-name="cloudConfigured"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserGear as fasUserGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasUserGear);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbCloudConfigView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/extern",
        "openWB/system/dataprotection_acknowledged",
        "openWB/system/mqtt/bridge/+",
        "openWB/system/mqtt/valid_partner_ids",
      ],
      enableNewCloudButton: true,
      newCloudData: {
        email: "",
        username: "",
        partner: false,
      },
      enableCloudConnectButton: true,
      connectCloudData: {
        username: "",
        password: "",
        partner: false,
      },
      enableRemoveCloudButton: true,
      showCloudRemoveModal: false,
    };
  },
  computed: {
    cloudBridge: {
      get() {
        let bridges = this.getWildcardTopics("openWB/system/mqtt/bridge/+");
        for (const [key, value] of Object.entries(bridges)) {
          if (!value.remote.is_openwb_cloud) {
            delete bridges[key];
          }
        }
        return bridges;
      },
    },
    cloudBridgeKey: {
      get() {
        for (const [key, value] of Object.entries(this.cloudBridge)) {
          if (value.remote.is_openwb_cloud) {
            return key;
          }
        }
        return undefined;
      },
    },
    cloudSettings: {
      get() {
        return {
          username: this.cloudBridge[this.cloudBridgeKey].remote.username,
          password: this.cloudBridge[this.cloudBridgeKey].remote.password,
          partner: this.cloudBridge[this.cloudBridgeKey].access
            ? this.cloudBridge[this.cloudBridgeKey].access.partner
            : false,
        };
      },
    },
  },
  methods: {
    getMqttBridgeIndex(bridgeKey) {
      return parseInt(bridgeKey.match(/(?:\/)(\d+)$/)[1]);
    },
    createCloud() {
      if (document.forms.cloudConfigCreateForm.reportValidity()) {
        this.$emit("save");
        this.$emit("sendCommand", {
          command: "initCloud",
          data: this.newCloudData,
        });
        this.enableNewCloudButton = false;
      }
    },
    connectCloud() {
      if (document.forms.cloudConfigConnectForm.reportValidity()) {
        this.$emit("save");
        this.$emit("sendCommand", {
          command: "connectCloud",
          data: this.connectCloudData,
        });
        this.enableCloudConnectButton = false;
      }
    },
    removeCloudModal(event) {
      // prevent further processing of the click event
      event.stopPropagation();
      this.showCloudRemoveModal = true;
    },
    removeCloud(event) {
      this.showCloudRemoveModal = false;
      if (event == "confirm") {
        // clear valid_partner_ids
        this.updateState("openWB/system/mqtt/valid_partner_ids", []);
        this.$emit("sendCommand", {
          command: "removeMqttBridge",
          data: {
            bridge: this.getMqttBridgeIndex(this.cloudBridgeKey),
          },
        });
        this.enableCloudConnectButton = true;
        // this.enableNewCloudButton = true;
      }
    },
  },
};
</script>
