<template>
  <div class="security">
    <openwb-base-modal-dialog
      :show="showResetModal"
      title="Benutzerverwaltung zurücksetzten"
      subtype="danger"
      :buttons="[{ text: 'Alles zurücksetzen!', event: 'confirm', subtype: 'danger' }]"
      @modal-result="handleResetModal($event)"
    >
      Bist Du sicher, dass Du die openWB Benutzerverwaltung zurücksetzen möchtest? Hiermit werden alle Benutzer, Gruppen
      und Rollen gelöscht und auf die Werkseinstellungen zurückgesetzt. Diese Aktion ist irreversibel!
    </openwb-base-modal-dialog>
    <openwb-base-alert
      v-if="$store.state.mqtt['openWB/general/extern'] !== false"
      subtype="info"
    >
      Die Einstellungen zur Sicherheit und Benutzerverwaltung werden aktuell nur für primary openWB unterstützt!
    </openwb-base-alert>
    <div v-else>
      <form name="accessForm">
        <openwb-base-card title="Allgemein">
          <openwb-base-button-group-input
            title="Unverschlüsselten Zugang erlauben"
            :model-value="$store.state.mqtt['openWB/general/allow_unencrypted_access']"
            :disabled="$store.state.mqtt['openWB/system/security/user_management_active'] === true"
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
                Hier kann eingestellt werden, ob unverschlüsselter Zugang zu openWB erlaubt ist. Dies betrifft sowohl
                den Zugriff über MQTT (Ports 1883 und 9001) als auch über HTTP (Port 80) (Weboberfläche).
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
            :model-value="$store.state.mqtt['openWB/system/security/user_management_active']"
            :disabled="
              $store.state.mqtt['openWB/general/allow_unencrypted_access'] === true ||
              !webThemeSupported ||
              !displayThemeSupported
            "
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
            @update:model-value="updateState('openWB/system/security/user_management_active', $event)"
          >
            <template #help>
              <p>
                Hier kann die integrierte Benutzerverwaltung von openWB aktiviert oder deaktiviert werden. Mit
                aktivierter Benutzerverwaltung ist der Zugriff auf den Mosquitto Broker (MQTT) und davon abhängige
                Dienste (Weboberfläche, API) nur mit einem gültigen Benutzerkonto (oder anonym ohne Anmeldung, falls
                erlaubt) möglich.
              </p>
            </template>
          </openwb-base-button-group-input>
          <openwb-base-alert
            subtype="warning"
            class="mt-2"
          >
            <p>
              <strong>Die Benutzerverwaltung erfordert zwingend die Abschaltung des unverschlüsselten Zugangs!</strong>
            </p>
            <p>
              Werden Änderungen an dem unverschlüsselten Zugang oder dem Status der Benutzerverwaltung vorgenommen, so
              ist zwingend ein
              <router-link to="/System/SystemConfiguration">Neustart dieser openWB</router-link> erforderlich, damit die
              Änderungen wirksam werden! Erst danach können Benutzer, Gruppen und Rollen angelegt und verwaltet werden.
            </p>
            <p>Standard-Admin-Benutzer nach der ersten Aktivierung oder dem Zurücksetzen:</p>
            <ul>
              <li>Benutzername: <strong>admin</strong></li>
              <li>Passwort: <strong>openwb</strong></li>
            </ul>
          </openwb-base-alert>
          <openwb-base-alert
            v-if="!webThemeSupported"
            subtype="danger"
            class="mt-2"
          >
            Das ausgewählte Theme "{{ $store.state.mqtt["openWB/general/web_theme"]?.name }}" für die
            <router-link to="/GeneralConfiguration">Hauptseite</router-link> unterstützt die Benutzerverwaltung nicht.
          </openwb-base-alert>
          <openwb-base-alert
            v-if="!displayThemeSupported"
            subtype="danger"
            class="mt-2"
          >
            Das ausgewählte Theme "{{ $store.state.mqtt["openWB/optional/int_display/theme"]?.name }}" für das
            <router-link to="/DisplayConfiguration">Display</router-link> unterstützt die Benutzerverwaltung nicht.
          </openwb-base-alert>
          <hr />
          <openwb-base-button-input
            title="Benutzerverwaltung zurücksetzen"
            button-text="Zurücksetzen"
            subtype="danger"
            :disabled="
              $store.state.mqtt['openWB/system/security/user_management_active'] === true || loggedInUser !== null
            "
            @button-clicked="showResetModal = true"
          >
            <template #help>
              Hiermit werden alle Benutzer, Gruppen und Rollen der openWB Benutzerverwaltung gelöscht und auf die
              Werkseinstellungen zurückgesetzt. Diese Aktion ist irreversibel!<br />
              <strong>Hinweis:</strong> Die Benutzerverwaltung muss deaktiviert sein, um die Benutzerverwaltung
              zurücksetzen zu können.
            </template>
          </openwb-base-button-input>
          <template #footer>
            <openwb-base-submit-buttons
              form-name="accessForm"
              @save="saveSecuritySettings"
              @reset="$emit('reset')"
              @defaults="$emit('defaults')"
            />
          </template>
        </openwb-base-card>
      </form>
      <div
        v-if="
          $store.state.mqtt['openWB/system/security/user_management_active'] === true && anonymousGroupName !== null
        "
      >
        <openwb-base-alert
          v-if="$store.state.mqtt['openWB/system/dataprotection_acknowledged'] !== true"
          subtype="warning"
        >
          Sie müssen der <router-link to="/System/LegalSettings">Datenschutzerklärung</router-link> zustimmen, um die
          Funktion "Kennwort vergessen" nutzen zu können!
        </openwb-base-alert>
        <openwb-base-card
          :collapsible="true"
          :collapsed="true"
          @expanded="getClientsDetails()"
        >
          <template #header>
            <FontAwesomeIcon :icon="['fas', 'user']" />
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
            <hr />
            <openwb-base-card
              v-for="client in clients"
              :key="client"
              :collapsible="true"
              :collapsed="true"
              @expanded="getClient(client)"
            >
              <template #header>
                <FontAwesomeIcon :icon="['fas', clientDetails[client]?.disabled ? 'user-slash' : 'user']" />
                {{ client }}
              </template>
              <template #actions="slotProps">
                <span
                  v-if="!slotProps.collapsed"
                  class="pill mr-2"
                  :class="[
                    clientDetails[client]?.disabled ? 'bg-danger' : 'bg-success',
                    { clickable: loggedInUser !== client },
                  ]"
                  :title="
                    loggedInUser !== client
                      ? `Benutzer ${clientDetails[client]?.disabled ? 'aktivieren' : 'deaktivieren'}`
                      : 'Der aktuell angemeldete Benutzer kann nicht deaktiviert werden.'
                  "
                  @click.stop="if (loggedInUser !== client) toggleClientDisabled(client);"
                >
                  {{ clientDetails[client]?.disabled ? "Deaktiviert" : "Aktiv" }}
                </span>
                <openwb-base-avatar
                  v-if="!slotProps.collapsed && loggedInUser !== client && !client.startsWith('Display-')"
                  class="bg-danger clickable"
                  title="Benutzer löschen"
                  @click.stop="if (loggedInUser !== client) deleteClient(client);"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </openwb-base-avatar>
              </template>
              <div v-if="clientDetails[client]">
                <form :name="`clientForm-${client}`">
                  <openwb-base-text-input
                    v-model="clientDetails[client].username"
                    title="Benutzername"
                    subtype="user"
                    disabled
                  />
                  <openwb-base-text-input
                    v-if="!clientDetails[client].username.startsWith('Display-')"
                    v-model="clientDetails[client].textname"
                    title="E-Mail"
                    subtype="email"
                    :required="clientDetails[client].username.startsWith('Display-') ? false : true"
                  >
                    <template #help>
                      Die hier angegebene E-Mail wird für die Funktion "Kennwort vergessen" verwendet.
                    </template>
                  </openwb-base-text-input>
                  <openwb-base-text-input
                    v-if="!clientDetails[client].username.startsWith('Display-')"
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
                    <template #element-prefix>
                      <font-awesome-icon :icon="['fas', 'users']" />
                    </template>
                    <template #help>
                      Hier können Gruppen zugewiesen werden, denen der Benutzer angehört. Über die Gruppen werden Rollen
                      und damit verbundene Zugriffsrechte (ACLs) vererbt. Es wird empfohlen, Berechtigungen über Gruppen
                      zu verwalten, damit bei mehreren Benutzern mit ähnlichen Rechten die Verwaltung einfacher und
                      übersichtlicher bleibt. Es können aber auch direkt Rollen zugewiesen werden, um Ergänzungen zu den
                      Gruppenrechten abzubilden.
                    </template>
                  </openwb-base-array-input>
                  <openwb-base-array-input
                    title="Zugewiesene Rollen"
                    :valid-elements="rolesList.map((role) => ({ value: role.name, label: role.friendlyName }))"
                    :model-value="clientDetails[client].roles.map((role) => role.rolename)"
                    @update:model-value="
                      (newRoles) => {
                        clientDetails[client].roles = newRoles.map((name) => ({ rolename: name }));
                      }
                    "
                  >
                    <template #input-prefix>
                      <font-awesome-icon :icon="['fas', 'file-shield']" />
                    </template>
                    <template #element-prefix>
                      <font-awesome-icon :icon="['fas', 'file-shield']" />
                    </template>
                    <template #help>
                      Hier können Rollen zugewiesen werden, die dem Benutzer direkt zugeordnet werden. Über die Rollen
                      werden Zugriffsrechte (ACLs) vererbt. Es wird empfohlen, Berechtigungen über Gruppen zu verwalten
                      und hier nur ergänzende Rollen zuzuweisen, um die Übersicht zu behalten.
                    </template>
                  </openwb-base-array-input>
                  <openwb-base-textarea
                    v-model="clientDetails[client].textdescription"
                    title="Zusatzinformationen"
                    subtype="text"
                  >
                    <template #help> Hier können zusätzliche Informationen zum Benutzer hinterlegt werden. </template>
                  </openwb-base-textarea>
                </form>
              </div>
              <div v-else>Lade Benutzerdetails...</div>
              <template #footer>
                <openwb-base-submit-buttons
                  :form-name="`clientForm-${client}`"
                  :save-id="`saveClientBtn-${client}`"
                  :hide-reset="true"
                  :hide-defaults="true"
                  @save="modifyClient(client)"
                />
              </template>
            </openwb-base-card>
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
            <openwb-base-text-input
              v-model="newGroupName"
              title="Neue Gruppe erstellen"
              subtype="group"
              add-button
              @input:add="createGroup()"
            >
              <template #help>
                Hier kann eine neue Gruppe für die openWB Benutzerverwaltung angelegt werden. Der Gruppenname kann nicht
                mehr geändert werden!
              </template>
            </openwb-base-text-input>
            <hr />
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
              <template #actions="slotProps">
                <openwb-base-avatar
                  v-if="!slotProps.collapsed && ![anonymousGroupName, userGroupName, displayGroupName].includes(group)"
                  class="bg-danger clickable"
                  title="Gruppe löschen"
                  @click.stop="deleteGroup(group)"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </openwb-base-avatar>
              </template>
              <div v-if="groupDetails[group]">
                <openwb-base-alert
                  v-if="group === anonymousGroupName"
                  subtype="info"
                >
                  Die Gruppe "{{ group }}" kann nicht gelöscht werden, da sie für den anonymen Zugriff (ohne Anmeldung)
                  auf openWB benötigt wird.
                </openwb-base-alert>
                <openwb-base-alert
                  v-if="group === userGroupName"
                  subtype="info"
                >
                  Die Gruppe "{{ group }}" kann nicht bearbeitet werden, da sie von openWB für reguläre Benutzer
                  verwendet wird. Es wird empfohlen, diese Gruppe allen Benutzern zuzuweisen und weitere Rollen durch
                  separate Gruppen oder direkt bei den Benutzern zu hinterlegen.
                </openwb-base-alert>
                <openwb-base-alert
                  v-if="group === displayGroupName"
                  subtype="info"
                >
                  Die Gruppe "{{ group }}" kann nicht bearbeitet werden, da sie von openWB für integrierte Displays
                  verwendet wird. Es wird empfohlen, diese Gruppe allen Displays zuzuweisen und weitere Rollen durch
                  separate Gruppen oder direkt bei den Display-Benutzern zu hinterlegen.
                </openwb-base-alert>
                <form :name="`groupForm-${group}`">
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
                    :disabled="[anonymousGroupName, userGroupName, displayGroupName].includes(group)"
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
                    <template #element-prefix>
                      <font-awesome-icon :icon="['fas', 'circle-user']" />
                    </template>
                  </openwb-base-array-input>
                  <openwb-base-array-input
                    title="Zugewiesene Rollen"
                    :valid-elements="rolesList.map((role) => ({ value: role.name, label: role.friendlyName }))"
                    :disabled="[anonymousGroupName, userGroupName, displayGroupName].includes(group)"
                    :readonly="[anonymousGroupName, userGroupName, displayGroupName].includes(group)"
                    :model-value="groupDetails[group].roles.map((role) => role.rolename)"
                    @update:model-value="
                      (newRoles) => {
                        groupDetails[group].roles = newRoles.map((name) => ({ rolename: name }));
                      }
                    "
                  >
                    <template #input-prefix>
                      <font-awesome-icon :icon="['fas', 'file-shield']" />
                    </template>
                    <template #element-prefix>
                      <font-awesome-icon :icon="['fas', 'file-shield']" />
                    </template>
                  </openwb-base-array-input>
                  <openwb-base-textarea
                    v-model="groupDetails[group].textdescription"
                    title="Zusatzinformationen"
                    subtype="text"
                    :disabled="[anonymousGroupName, userGroupName, displayGroupName].includes(group)"
                  >
                    <template #help> Hier können zusätzliche Informationen zur Gruppe hinterlegt werden. </template>
                  </openwb-base-textarea>
                </form>
              </div>
              <div v-else>Lade Gruppendetails...</div>
              <template #footer>
                <openwb-base-submit-buttons
                  :form-name="`groupForm-${group}`"
                  :save-id="`saveGroupBtn-${group}`"
                  :hide-reset="true"
                  :hide-defaults="true"
                  @save="modifyGroup(group)"
                />
              </template>
            </openwb-base-card>
          </div>
        </openwb-base-card>
        <openwb-base-card
          :collapsible="true"
          :collapsed="true"
        >
          <template #header>
            <FontAwesomeIcon :icon="['fas', 'file-shield']" />
            Rollen
          </template>
          <openwb-base-alert
            v-if="roles.length === 0"
            subtype="info"
          >
            Es sind noch keine Rollen angelegt oder Du hast nicht die benötigten Rechte, Daten anzuzeigen.
          </openwb-base-alert>
          <div v-else>
            <openwb-base-alert subtype="info">
              Rollen definieren die Zugriffsrechte (Access Control Lists, ACLs) für Benutzer und Gruppen. Jeder Benutzer
              oder jede Gruppe kann mehrere Rollen zugewiesen bekommen, wodurch sich die effektiven Zugriffsrechte
              zusammensetzen.<br />
              openWB erstellt automatisch relevante Rollen während der Installation und bei der Aktivierung bestimmter
              Funktionen oder Bearbeitung von Ladepunkten, Geräten und Komponenten etc. Rollen können hier nicht
              bearbeitet oder gelöscht werden.
            </openwb-base-alert>
            <openwb-base-text-input
              :model-value="rolesVersion"
              title="Versionsnummer der Rollendefinitionen"
              disabled
            >
              <template #help>
                Hier wird die aktuell verwendete Rollen-Version der openWB Benutzerverwaltung angezeigt. Diese Version
                gibt an, welche vordefinierten Rollen und Zugriffsrechte (ACLs) von openWB generiert werden. Bei einem
                Update von openWB kann sich die Rollen-Version ändern, wodurch neue Rollen hinzugefügt oder bestehende
                Rollen angepasst werden können.
              </template>
            </openwb-base-text-input>
            <openwb-base-textarea
              title="Standard-Zugriffsrechte"
              :model-value="readableAcls(defaultAclAccess)"
              disabled
            >
              <template #help>
                Hier werden die Standard Zugriffsrechte (Access Control Lists, ACLs) angezeigt. Diese werden verwendet,
                wenn keine spezifischen ACLs für einen Benutzer oder eine Gruppe definiert sind oder die Topics nicht
                explizit abgedeckt werden.
              </template>
            </openwb-base-textarea>
            <hr />
            <openwb-base-card
              v-for="role in rolesList"
              :key="role.name"
              :collapsible="true"
              :collapsed="true"
              @expanded="getRole(role.name)"
            >
              <template #header>
                <FontAwesomeIcon :icon="['fas', 'file-shield']" />
                {{ role.friendlyName }}
              </template>
              <div v-if="roleDetails[role.name]">
                <form :name="`roleForm-${role.name}`">
                  <openwb-base-text-input
                    v-model="roleDetails[role.name].rolename"
                    title="Rollenname"
                    subtype="text"
                    disabled
                  />
                  <openwb-base-text-input
                    v-model="roleDetails[role.name].textname"
                    title="Beschreibung"
                    subtype="text"
                    disabled
                  />
                  <openwb-base-alert
                    v-if="roleDetails[role.name].textdescription"
                    subtype="info"
                  >
                    {{ roleDetails[role.name].textdescription }}
                  </openwb-base-alert>
                  <openwb-base-textarea
                    title="Zugriffsrechte (ACLs)"
                    :model-value="readableAcls(roleDetails[role.name].acls)"
                    disabled
                  >
                    <template #help>
                      Hier werden die Zugriffsrechte (Access Control Lists, ACLs) für diese Rolle angezeigt.
                    </template>
                  </openwb-base-textarea>
                </form>
              </div>
              <div v-else>Lade Rollendetails...</div>
            </openwb-base-card>
          </div>
        </openwb-base-card>
      </div>
      <div v-else>
        <openwb-base-alert subtype="info">
          Die Benutzerverwaltung ist deaktiviert. In diesem Modus haben alle Benutzer uneingeschränkten Zugriff auf
          openWB.<br />
          Um Benutzer, Gruppen und Rollen zu verwalten, muss die Benutzerverwaltung zuerst aktiviert werden. Dazu ist
          nach der Aktivierung zwingend ein
          <router-link to="/System/SystemConfiguration">Neustart dieser openWB</router-link> erforderlich, damit die
          Änderungen wirksam werden.
        </openwb-base-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser as fasUser,
  faUserSlash as fasUserSlash,
  faUsers as fasUsers,
  faFileShield as fasFileShield,
  faPlus as fasPlus,
  faTrash as fasTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasUser, fasUserSlash, fasUsers, fasFileShield, fasPlus, fasTrash);

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
        "openWB/general/extern",
        "openWB/general/web_theme",
        "openWB/optional/int_display/theme",
        "openWB/system/security/user_management_active",
        "openWB/system/dataprotection_acknowledged",
        "openWB/system/device/+/component/+/config",
        "openWB/chargepoint/+/config",
        "openWB/system/io/+/config",
        "openWB/io/action/+/config",
        "openWB/vehicle/+/name",
        "$CONTROL/dynamic-security/v1/response",
      ],
      mqttTopicsToPublish: ["openWB/general/allow_unencrypted_access", "openWB/system/security/user_management_active"],
      activeControlCommand: null,
      controlCommandsQueue: [],
      clients: [],
      clientDetails: {},
      groups: [],
      groupDetails: {},
      rawRoles: [],
      roleDetails: {},
      rolesVersion: null,
      newClientName: null,
      newGroupName: null,
      anonymousGroupName: null,
      userGroupName: "user",
      displayGroupName: "display",
      defaultAclAccess: [],
      showResetModal: false,
    };
  },
  computed: {
    dynSecResponse() {
      return this.$store.state.mqtt["$CONTROL/dynamic-security/v1/response"];
    },
    loggedInUser() {
      return this.$store.state.local.username || null;
    },
    readableAcls() {
      return (acls) => {
        if (!acls || !Array.isArray(acls)) {
          return "";
        }
        return acls
          .sort((a, b) => {
            if (a.topic < b.topic) return -1;
            if (a.topic > b.topic) return 1;
            return 0;
          })
          .map((acl) => {
            const alcTypes = {
              publishClientSend: "Veröffentlichen",
              publishClientReceive: "Empfangen",
              subscribe: "Abonnieren",
              unsubscribe: "Abonnement aufheben",
              subscribeLiteral: "Abonnieren (exakt)",
              unsubscribeLiteral: "Abonnement aufheben (exakt)",
              subscribePattern: "Abonnieren (Muster)",
              unsubscribePattern: "Abonnement aufheben (Muster)",
            };
            const type = alcTypes[acl.acltype] || acl.acltype;
            const allow = acl.allow === true ? "erlaubt" : acl.allow === false ? "verboten" : "unbekannt";
            const topic = acl.topic ? '"' + acl.topic + '"' : "<alle Topics>";
            return `${topic} -> ${type} ${allow}`;
          })
          .join("\n");
      };
    },
    componentName() {
      return (componentId) => {
        const nameTopic = `openWB/system/device/+/component/${componentId}/config`;
        return Object.values(this.getWildcardTopics(nameTopic))[0]?.name || undefined;
      };
    },
    chargePointName() {
      return (chargePointId) => {
        const nameTopic = `openWB/chargepoint/${chargePointId}/config`;
        return this.$store.state.mqtt[nameTopic]?.name || undefined;
      };
    },
    vehicleName() {
      return (vehicleId) => {
        const nameTopic = `openWB/vehicle/${vehicleId}/name`;
        return this.$store.state.mqtt[nameTopic] || undefined;
      };
    },
    ioDeviceName() {
      return (deviceId) => {
        const nameTopic = `openWB/system/io/${deviceId}/config`;
        return this.$store.state.mqtt[nameTopic]?.name || undefined;
      };
    },
    ioActionName() {
      return (actionId) => {
        const nameTopic = `openWB/io/action/${actionId}/config`;
        return this.$store.state.mqtt[nameTopic]?.name || undefined;
      };
    },
    routes() {
      const routes = this.$router.getRoutes();
      console.debug("All route names:", routes.map((r) => r.name).sort());
      return routes;
    },
    routeName() {
      return (view) => {
        // convert to pascal case
        const pascalCaseView = view
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");
        const myRoute = this.routes.find((route) => {
          return route.name === pascalCaseView;
        });
        if (myRoute === undefined) {
          console.warn("No route found for view:", view, "(searched for route name:", pascalCaseView + ")");
          return;
        }
        return myRoute.meta.heading;
      };
    },
    friendlyRoleName() {
      return (role) => {
        const componentTypeName = (parts) => {
          switch (parts[0]) {
            case "counter":
              return "Zähler";
            case "inverter":
              return "Wechselrichter";
            case "bat":
              return "Speicher";
            case "chargepoint":
              return "Ladepunkt";
            case "vehicle":
              return "Fahrzeug";
            case "io":
              switch (parts[1]) {
                case "device":
                  return "Ein-/Ausgangs Gerät";
                case "action":
                  return "Ein-/Ausgangs Aktion";
              }
              break;
            default:
              return parts[0];
          }
        };

        const buildDataName = (parts) => {
          let id = parts[1];
          let type = componentTypeName(parts);
          let name = "";
          switch (parts[0]) {
            case "counter":
            case "inverter":
            case "bat":
              name = this.componentName(id) || id;
              break;
            case "chargepoint":
              name = this.chargePointName(id) || id;
              break;
            case "vehicle":
              name = this.vehicleName(id) || id;
              break;
            case "io":
              id = parts[2];
              switch (parts[1]) {
                case "device":
                  name = this.ioDeviceName(id) || id;
                  break;
                case "action":
                  name = this.ioActionName(id) || id;
                  break;
                default:
                  name = id;
              }
              break;
          }
          return `Daten: ${type} '${name}' (${id}) ${roleParts[roleParts.length - 2] == "write" ? "schreiben" : "lesen"}`;
        };

        let view = null;
        switch (role) {
          case "charge-log-access":
          case "install-assistant-access":
          case "data-management-access":
          case "legal-settings-access":
            view = role.replace("-access", "");
            break;
          case "settings-access":
            return "Einstellungen: Zugang ermöglichen";
          case "legacy-smart-home-configuration-access":
            return "Einstellungen: Konfiguration - SmartHome";
          case "full-access":
            return "Voller Zugang lesen und schreiben";
          case "dynsec-admin":
            return "Sicherheits-Administrator";
          case "basic-display-data":
            return "Basisdaten: Display";
          case "basic-system-data":
            return "Basisdaten: System";
          case "basic-theme-data":
            return "Basisdaten: Hauptseite/Theme";
          case "basic-user-data":
            return "Basisdaten: Benutzer";
          case "other-data":
            return "Daten: Externe Anwendungen lesen und schreiben";
          case "electricity-price-access":
            return "Daten: Strompreise lesen";
          case "graph-access":
            return "Daten: Verlaufsdiagramm lesen";
          case "home-consumption-access":
            return "Daten: Hausverbrauch lesen";
        }
        const roleParts = role.split("-");
        if (
          role.endsWith("-configuration-access") ||
          role.endsWith("-installation-access") ||
          (role.endsWith("-access") && roleParts.length == 2)
        ) {
          view = role.replace("-access", "");
        }
        if (view !== null) {
          const routeName = this.routeName(view);
          if (routeName !== undefined) {
            return `Einstellungen: ${routeName}`;
          }
        }
        if (roleParts[1] == "sum") {
          switch (roleParts[0]) {
            case "inverter":
              return "Daten: Wechselrichter Summendaten lesen";
            case "bat":
              return "Daten: Speicher Summendaten lesen";
            case "chargepoint":
              return "Daten: Ladepunkt Summendaten lesen";
          }
        }
        if (!isNaN(roleParts[1]) && ["counter", "inverter", "bat", "chargepoint", "vehicle"].includes(roleParts[0])) {
          return buildDataName(roleParts);
        }
        switch (roleParts[0]) {
          case "vehicle":
            if (roleParts[1] === "configuration") {
              return "Einstellungen: Fahrzeuge";
            }
            break;
          case "io":
            switch (roleParts[1]) {
              case "configuration":
                return "Einstellungen: Ein-/Ausgänge";
              default:
                return buildDataName(roleParts);
            }
        }
        return `*${role}*`;
      };
    },
    rolesList() {
      // return roles with friendly names, sorted by friendly name
      return this.roles
        .map((role) => {
          return { name: role, friendlyName: this.friendlyRoleName(role) };
        })
        .sort((a, b) => {
          if (a.friendlyName < b.friendlyName) return -1;
          if (a.friendlyName > b.friendlyName) return 1;
          return 0;
        });
    },
    webThemeSupported() {
      return this.$store.state.mqtt["openWB/general/web_theme"]?.userManagementSupported === true;
    },
    displayThemeSupported() {
      return this.$store.state.mqtt["openWB/optional/int_display/theme"]?.userManagementSupported === true;
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
            case "disableClient":
            case "enableClient":
              this.getClientList();
              break;
            case "modifyClient":
            case "deleteClient":
              this.getClientList();
              // update groups after client modification/deletion as clients in groups may have changed
              this.getGroupsDetails();
              break;
            case "listGroups":
              this.groups = JSON.parse(JSON.stringify(response.data.groups));
              break;
            case "getAnonymousGroup":
              this.anonymousGroupName = response.data.group.groupname;
              break;
            case "getGroup":
              this.groupDetails[response.data.group.groupname] = JSON.parse(JSON.stringify(response.data.group));
              break;
            case "createGroup":
              this.getGroupList();
              break;
            case "modifyGroup":
            case "deleteGroup":
              this.getGroupList();
              // update clients after group modification/deletion as groups in clients may have changed
              this.getClientsDetails();
              break;
            case "listRoles":
              this.roles = JSON.parse(JSON.stringify(response.data.roles)).filter((role) => {
                if (role.startsWith("openwb-version:")) {
                  this.rolesVersion = role.split(":")[1];
                  return false;
                }
                return true;
              });
              break;
            case "getRole":
              this.roleDetails[response.data.role.rolename] = JSON.parse(JSON.stringify(response.data.role));
              break;
            case "getDefaultACLAccess":
              this.defaultAclAccess = JSON.parse(JSON.stringify(response.data.acls));
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
        // reload the page to apply new user permissions
        this.$router.go();
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
      if (this.$store.state.mqtt["openWB/system/security/user_management_active"] === true) {
        console.debug("Initializing Security view for user:", this.loggedInUser);
        this.getAnonymousGroupName();
        this.getDefaultAclAccess();
        this.getClientList();
        this.getGroupList();
        this.getRoleList();
      }
    },
    handleResetModal(event) {
      this.showResetModal = false;
      if (event === "confirm") {
        console.info("Resetting user management!");
        this.$emit("sendCommand", { command: "resetUserManagement" });
      }
    },
    saveSecuritySettings() {
      if (this.$store.state.mqtt["openWB/system/security/user_management_active"] === false) {
        // unset cookie
        console.info("User management deactivated, removing mqtt cookie.");
        this.$cookies.remove("mqtt");
      }
      this.$emit("save", this.mqttTopicsToPublish);
    },
    sendControlCommand(command, parameters = {}) {
      if (this.activeControlCommand !== null) {
        console.warn("Control command already running, please wait.");
        return;
      }
      this.activeControlCommand = command;
      const payload = {
        commands: [{ command: command, ...parameters }],
      };
      console.debug("$CONTROL command:", payload);
      this.$root.doPublish("$CONTROL/dynamic-security/v1", payload);
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
    getClientsDetails() {
      this.clients.forEach((client) => {
        this.queueControlCommand("getClient", { username: client });
      });
    },
    getClient(client) {
      this.queueControlCommand("getClient", { username: client });
    },
    createClient() {
      console.debug("Creating new client:", this.newClientName);
      this.queueControlCommand("createClient", { username: this.newClientName });
      this.newClientName = null;
    },
    deleteClient(client) {
      if (client === this.loggedInUser) {
        console.error("Cannot delete currently logged in user:", client);
        this.$root.postClientMessage("Der aktuell angemeldete Benutzer kann nicht gelöscht werden.", "danger");
        return;
      }
      console.debug("Deleting client:", client);
      this.queueControlCommand("deleteClient", { username: client });
    },
    toggleClientDisabled(client) {
      const isDisabled = this.clientDetails[client]?.disabled || false;
      if (client === this.loggedInUser && isDisabled === false) {
        console.error("Cannot disable currently logged in user:", client);
        this.$root.postClientMessage("Der aktuell angemeldete Benutzer kann nicht deaktiviert werden.", "danger");
        return;
      }
      this.queueControlCommand(isDisabled ? "enableClient" : "disableClient", {
        username: client,
      });
      this.queueControlCommand("getClient", { username: client });
    },
    modifyClient(client) {
      console.debug("Modifying client:", client);
      if ([null, undefined, ""].includes(this.clientDetails[client].password)) {
        // remove password field to avoid resetting password to empty
        delete this.clientDetails[client].password;
      } else if (this.clientDetails[client].username === "admin") {
        console.debug("Updating password for client:", client);
        this.$emit("sendCommand", {
          command: "updateAdminPassword",
          data: {
            newPassword: this.clientDetails[client].password,
          },
        });
      }
      this.queueControlCommand("modifyClient", { username: client, ...this.clientDetails[client] });
    },
    getGroupList() {
      this.queueControlCommand("listGroups");
    },
    getAnonymousGroupName() {
      this.queueControlCommand("getAnonymousGroup");
    },
    getGroupsDetails() {
      this.groups.forEach((group) => {
        this.queueControlCommand("getGroup", { groupname: group });
      });
    },
    getGroup(group) {
      this.queueControlCommand("getGroup", { groupname: group });
    },
    createGroup() {
      console.debug("Creating new group:", this.newGroupName);
      this.queueControlCommand("createGroup", { groupname: this.newGroupName });
      this.newGroupName = null;
    },
    deleteGroup(group) {
      console.debug("Deleting group:", group);
      this.queueControlCommand("deleteGroup", { groupname: group });
    },
    modifyGroup(group) {
      console.debug("Modifying group:", group);
      this.queueControlCommand("modifyGroup", { groupname: group, ...this.groupDetails[group] });
    },
    getRoleList() {
      this.queueControlCommand("listRoles");
    },
    getRole(role) {
      this.queueControlCommand("getRole", { rolename: role });
    },
    getDefaultAclAccess() {
      this.queueControlCommand("getDefaultACLAccess");
    },
  },
};
</script>
