<template>
  <div class="security">
    <form name="accessForm">
      <openwb-base-card title="Allgemein">
        <openwb-base-button-group-input
          title="Unverschlüsselten Zugang erlauben"
          :model-value="$store.state.mqtt['openWB/general/allow_unencrypted_access']"
          :disabled="$store.state.mqtt['openWB/general/user_management_active'] === true ? true : false"
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
          @update:model-value="updateState('openWB/general/allow_unencrypted_access', $event)"
        >
          <template #help>
            <p>
              Hier kann eingestellt werden, ob unverschlüsselter Zugang zu openWB erlaubt ist. Dies betrifft sowohl den
              Zugriff über MQTT (Ports 1883 und 9001) als auch über HTTP (Port 80) (Weboberfläche).
            </p>
            <p>
              <strong>Hinweis:</strong> Aus Sicherheitsgründen sollte der unverschlüsselte Zugang nur in geschützten
              Netzwerken aktiviert werden. Für die integrierten Benutzerverwaltung muss der unverschlüsselte Zugang
              zuerst deaktiviert werden.
            </p>
          </template>
        </openwb-base-button-group-input>
        <openwb-base-button-group-input
          title="Benutzerverwaltung"
          :model-value="$store.state.mqtt['openWB/general/user_management_active']"
          :disabled="$store.state.mqtt['openWB/general/allow_unencrypted_access'] === true ? true : false"
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
          @update:model-value="updateState('openWB/general/user_management_active', $event)"
        >
          <template #help>
            <p>
              Hier kann die integrierte Benutzerverwaltung von openWB aktiviert oder deaktiviert werden. Mit aktivierter
              Benutzerverwaltung ist der Zugriff auf den Mosquitto Broker (MQTT) und davon abhängige Dienste
              (Weboberfläche, API) nur mit einem gültigen Benutzerkonto möglich.
            </p>
            <p>
              <strong>Hinweis:</strong> Die Benutzerverwaltung erfordert zwingend die Abschaltung des unverschlüsselten
              Zugangs.
            </p>
          </template>
        </openwb-base-button-group-input>
        <template #footer>
          <openwb-base-submit-buttons
            form-name="accessForm"
            @save="$emit('save')"
            @reset="$emit('reset')"
            @defaults="$emit('defaults')"
          />
        </template>
      </openwb-base-card>
    </form>
    <div v-if="$store.state.mqtt['openWB/general/user_management_active'] === true">
      <openwb-base-card
        :collapsible="true"
        :collapsed="true"
      >
        <template #header>
          <FontAwesomeIcon :icon="['fas', 'circle-user']" />
          Benutzer
        </template>
        <openwb-base-alert
          v-if="clients.length === 0"
          subtype="info"
        >
          Es sind noch keine Benutzer angelegt oder Du hast nicht die benötigten Rechte, Daten anzuzeigen.
        </openwb-base-alert>
        <div v-else>
          <openwb-base-text-input
            v-model="newClientName"
            title="Neuen Benutzer erstellen"
            subtype="user"
            add-button
            @input:add="createClient()"
          >
            <template #help>
              Hier kann ein neuer Benutzer für die openWB Benutzerverwaltung angelegt werden. Der Benutzername kann
              nicht mehr geändert werden!
            </template>
          </openwb-base-text-input>
          <form name="clientForm-{{ client }}">
            <openwb-base-card
              v-for="client in clients"
              :key="client"
              :collapsible="true"
              :collapsed="true"
            >
              <template #header>
                <FontAwesomeIcon :icon="['fas', 'circle-user']" />
                {{ client }}
              </template>
              <template #actions="slotProps">
                <span
                  v-if="!slotProps.collapsed"
                  class="pill clickable mr-2"
                  :class="clientDetails[client]?.disabled ? 'bg-danger' : 'bg-success'"
                  @click.stop="toggleClientDisabled(client)"
                >
                  {{ clientDetails[client]?.disabled ? "Deaktiviert" : "Aktiv" }}
                </span>
                <openwb-base-avatar
                  v-if="!slotProps.collapsed"
                  class="bg-danger clickable"
                  title="Benutzer löschen"
                  @click.stop="deleteClient(client)"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </openwb-base-avatar>
              </template>
              <div v-if="clientDetails[client]">
                <openwb-base-text-input
                  v-model="clientDetails[client].username"
                  title="Benutzername"
                  subtype="user"
                  disabled
                />
                <openwb-base-text-input
                  v-model="clientDetails[client].textname"
                  title="E-Mail"
                  subtype="email"
                  required
                />
                <openwb-base-text-input
                  v-model="clientDetails[client].password"
                  title="Passwort"
                  subtype="password"
                >
                  <template #help>
                    Bereits festgelegte Passwörter werden nicht angezeigt!<br />
                    Um das Passwort zu ändern, bitte ein neues Passwort eingeben und speichern, andernfalls das Feld
                    leer lassen.
                  </template>
                </openwb-base-text-input>
                <openwb-base-array-input
                  title="Zugewiesene Gruppen"
                  :valid-elements="groups"
                  :model-value="clientDetails[client].groups.map((group) => group.groupname)"
                  @update:model-value="
                    (newGroups) => {
                      clientDetails[client].groups = newGroups.map((groupName) => ({ groupname: groupName }));
                    }
                  "
                >
                  <template #input-prefix>
                    <font-awesome-icon :icon="['fas', 'users']" />
                  </template>
                </openwb-base-array-input>
                <openwb-base-array-input
                  title="Zugewiesene Rollen"
                  :valid-elements="roles"
                  :model-value="clientDetails[client].roles.map((role) => role.rolename)"
                  @update:model-value="
                    (newRoles) => {
                      clientDetails[client].roles = newRoles.map((roleName) => ({ rolename: roleName }));
                    }
                  "
                >
                  <template #input-prefix>
                    <font-awesome-icon :icon="['fas', 'users-rectangle']" />
                  </template>
                </openwb-base-array-input>
              </div>
              <div v-else>Lade Benutzerdetails...</div>
              <template #footer>
                <openwb-base-submit-buttons
                  :hide-reset="true"
                  :hide-defaults="true"
                  @save="modifyClient(client)"
                />
              </template>
            </openwb-base-card>
          </form>
        </div>
      </openwb-base-card>
      <openwb-base-card
        :collapsible="true"
        :collapsed="true"
      >
        <template #header>
          <FontAwesomeIcon :icon="['fas', 'users']" />
          Gruppen
        </template>
        <openwb-base-alert
          v-if="groups.length === 0"
          subtype="info"
        >
          Es sind noch keine Gruppen angelegt oder Du hast nicht die benötigten Rechte, Daten anzuzeigen.
        </openwb-base-alert>
        <div v-else>
          <openwb-base-card
            v-for="group in groups"
            :key="group"
            :collapsible="true"
            :collapsed="true"
            @expanded="getGroup(group)"
          >
            <template #header>
              <FontAwesomeIcon :icon="['fas', 'users']" />
              {{ group }}
            </template>
            <div v-if="groupDetails[group]">
              <openwb-base-text-input
                v-model="groupDetails[group].groupname"
                title="Gruppenname"
                subtype="text"
                disabled
              />
              <openwb-base-text-input
                v-model="groupDetails[group].textname"
                title="Beschreibung"
                subtype="text"
                disabled
              />
              <openwb-base-array-input
                title="Zugewiesene Benutzer"
                :valid-elements="clients"
                :model-value="groupDetails[group].clients.map((client) => client.username)"
                @update:model-value="
                  (newClients) => {
                    groupDetails[group].clients = newClients.map((clientName) => ({ username: clientName }));
                  }
                "
              >
                <template #input-prefix>
                  <font-awesome-icon :icon="['fas', 'circle-user']" />
                </template>
              </openwb-base-array-input>
              <openwb-base-array-input
                title="Zugewiesene Rollen"
                :valid-elements="roles"
                :model-value="groupDetails[group].roles.map((role) => role.rolename)"
                @update:model-value="
                  (newRoles) => {
                    groupDetails[group].roles = newRoles.map((roleName) => ({ rolename: roleName }));
                  }
                "
              >
                <template #input-prefix>
                  <font-awesome-icon :icon="['fas', 'users-rectangle']" />
                </template>
              </openwb-base-array-input>
            </div>
            <div v-else>Lade Gruppendetails...</div>
          </openwb-base-card>
        </div>
      </openwb-base-card>
      <openwb-base-card
        :collapsible="true"
        :collapsed="true"
      >
        <template #header>
          <FontAwesomeIcon :icon="['fas', 'users-rectangle']" />
          Rollen
        </template>
        <openwb-base-alert
          v-if="roles.length === 0"
          subtype="info"
        >
          Es sind noch keine Rollen angelegt oder Du hast nicht die benötigten Rechte, Daten anzuzeigen.
        </openwb-base-alert>
        <div v-else>
          <openwb-base-card
            v-for="role in roles"
            :key="role"
            :collapsible="true"
            :collapsed="true"
            @expanded="getRole(role)"
          >
            <template #header>
              <FontAwesomeIcon :icon="['fas', 'users-rectangle']" />
              {{ role }}
            </template>
            <div v-if="roleDetails[role]">
              <openwb-base-text-input
                v-model="roleDetails[role].rolename"
                title="Rollenname"
                subtype="text"
                disabled
              />
              <openwb-base-text-input
                v-model="roleDetails[role].textname"
                title="Beschreibung"
                subtype="text"
                disabled
              />
            </div>
            <div v-else>Lade Rollendetails...</div>
          </openwb-base-card>
        </div>
      </openwb-base-card>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser as fasCircleUser,
  faUsers as fasUsers,
  faUsersRectangle as fasUsersRectangle,
  faPlus as fasPlus,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCircleUser, fasUsers, fasUsersRectangle, fasPlus, fasTrash);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbSecurityView",
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
  emits: ["save", "reset", "defaults", "sendCommand"],
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/general/allow_unencrypted_access",
        "openWB/general/user_management_active",
        "$CONTROL/dynamic-security/v1/response",
      ],
      activeControlCommand: null,
      controlCommandsQueue: [],
      clients: [],
      clientDetails: {},
      groups: [],
      groupDetails: {},
      roles: [],
      roleDetails: {},
      newClientName: null,
    };
  },
  computed: {
    dynSecResponse() {
      return this.$store.state.mqtt["$CONTROL/dynamic-security/v1/response"];
    },
    loggedInUser() {
      return this.$store.state.local.username || null;
    },
  },
  watch: {
    dynSecResponse(newVal) {
      if (newVal && newVal.responses) {
        newVal.responses.forEach((response) => {
          switch (response.command) {
            case "listClients":
              this.clients = JSON.parse(JSON.stringify(response.data.clients));
              break;
            case "getClient":
              this.clientDetails[response.data.client.username] = JSON.parse(JSON.stringify(response.data.client));
              break;
            case "createClient":
            case "modifyClient":
            case "deleteClient":
            case "disableClient":
            case "enableClient":
              this.getClientList();
              break;
            case "listGroups":
              this.groups = JSON.parse(JSON.stringify(response.data.groups));
              break;
            case "getGroup":
              this.groupDetails[response.data.group.groupname] = JSON.parse(JSON.stringify(response.data.group));
              break;
            case "listRoles":
              this.roles = JSON.parse(JSON.stringify(response.data.roles));
              break;
            case "getRole":
              this.roleDetails[response.data.role.rolename] = JSON.parse(JSON.stringify(response.data.role));
              break;
            default:
              console.warn("Unhandled dynamic security response:", response);
              break;
          }
        });
      }
      this.activeControlCommand = null;
      this.processControlCommandQueue();
    },
    loggedInUser(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.clients = [];
      this.clientDetails = {};
      this.groups = [];
      this.groupDetails = {};
      this.roles = [];
      this.roleDetails = {};
      console.log("User management active?", this.$store.state.mqtt["openWB/general/user_management_active"]);
      if (this.$store.state.mqtt["openWB/general/user_management_active"] === true) {
        console.log("Initializing Security view for user:", this.loggedInUser);
        this.getClientList();
        this.getGroupList();
        this.getRoleList();
      }
    },
    sendControlCommand(command, payload = {}) {
      if (this.activeControlCommand !== null) {
        console.warn("Control command already running, please wait.");
        return;
      }
      this.activeControlCommand = command;
      console.log("Sending control command:", command, payload);
      console.log("$CONTROL command:", {
        commands: [{ command: command, ...payload }],
      });
      this.$root.doPublish("$CONTROL/dynamic-security/v1", {
        commands: [{ command: command, ...payload }],
      });
    },
    queueControlCommand(command, payload = {}) {
      this.controlCommandsQueue.push({ command, payload });
      this.processControlCommandQueue();
    },
    processControlCommandQueue() {
      if (this.activeControlCommand !== null || this.controlCommandsQueue.length === 0) {
        return;
      }
      const { command, payload } = this.controlCommandsQueue.shift();
      this.sendControlCommand(command, payload);
    },
    getClientList() {
      this.queueControlCommand("listClients");
    },
    getClient(client) {
      this.queueControlCommand("getClient", { username: client });
    },
    createClient() {
      console.log("Creating new client:", this.nweClientName);
      this.queueControlCommand("createClient", { username: this.nweClientName });
      this.newClientName = null;
    },
    deleteClient(client) {
      console.log("Deleting client:", client);
      this.queueControlCommand("deleteClient", { username: client });
    },
    toggleClientDisabled(client) {
      const isDisabled = this.clientDetails[client]?.disabled || false;
      this.queueControlCommand(isDisabled ? "enableClient" : "disableClient", {
        username: client,
      });
      this.queueControlCommand("getClient", { username: client });
    },
    modifyClient(client) {
      console.log("Modifying client:", client);
      if ([null, undefined, ""].includes(this.clientDetails[client].password)) {
        // remove password field to avoid resetting password to empty
        console.log("No password change, removing password field from modification.");
        delete this.clientDetails[client].password;
      }
      this.queueControlCommand("modifyClient", { username: client, ...this.clientDetails[client] });
    },
    getGroupList() {
      this.queueControlCommand("listGroups");
    },
    getGroup(group) {
      this.queueControlCommand("getGroup", { groupname: group });
    },
    getRoleList() {
      this.queueControlCommand("listRoles");
    },
    getRole(role) {
      this.queueControlCommand("getRole", { rolename: role });
    },
  },
};
</script>
