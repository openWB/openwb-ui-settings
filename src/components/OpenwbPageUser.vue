<template>
  <teleport
    v-if="userManagementActive === true"
    defer
    to="#infobar"
  >
    <div id="user-indicator">
      <span
        v-if="loggedInUser"
        class="pill bg-primary"
      >
        <FontAwesomeIcon
          :icon="['fas', 'circle-user']"
          size="lg"
        />
        <span class="non-selectable"> {{ loggedInUser }} </span>
        <openwb-base-tooltip description="Abmelden">
          <FontAwesomeIcon
            class="text-light clickable px-2"
            :icon="['fas', 'arrow-right-from-bracket']"
            size="lg"
            @click="showLogoutModal = true"
          />
        </openwb-base-tooltip>
      </span>
      <span
        v-else
        class="pill bg-secondary"
      >
        <openwb-base-tooltip description="Nicht angemeldet">
          <FontAwesomeLayers>
            <FontAwesomeIcon :icon="['fas', 'circle-user']" />
            <FontAwesomeIcon
              :icon="['fas', 'ban']"
              color="red"
            />
          </FontAwesomeLayers>
        </openwb-base-tooltip>
        <openwb-base-tooltip description="Anmelden">
          <FontAwesomeIcon
            class="text-light clickable px-2"
            :icon="['fas', 'arrow-right-to-bracket']"
            size="lg"
            @click="showLoginModal = true"
          />
        </openwb-base-tooltip>
      </span>
    </div>
  </teleport>
  <openwb-base-modal-dialog
    v-if="userManagementActive"
    :show="showLogoutModal"
    title="Abmelden"
    subtype="warning"
    :buttons="[{ text: 'Abmelden', event: 'confirm', subtype: 'danger' }]"
    @modal-result="doLogout($event)"
  >
    <p>Willst Du Dich wirklich abmelden?</p>
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    v-if="userManagementActive"
    :show="showLoginModal"
    :prevent-close="!anonymousAccessAllowed"
    title="Anmelden"
    subtype="success"
    :buttons="loginButtons"
    @modal-result="doLogin($event)"
  >
    <form name="loginForm">
      <openwb-base-text-input
        v-model="username"
        title="Benutzername"
        subtype="user"
        required
        autocomplete="username"
      />
      <openwb-base-text-input
        v-model="password"
        title="Passwort"
        subtype="password"
        required
        autocomplete="current-password"
      />
    </form>
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    v-if="userManagementActive && dataProtectionAcknowledged"
    :show="showPasswordResetModal"
    title="Kennwort zurücksetzen"
    subtype="warning"
    :buttons="[
      { text: 'Token anfordern', event: 'request_token', subtype: 'success', disabled: requestTokenDisabled },
      { text: 'Kennwort zurücksetzen', event: 'reset_password', subtype: 'primary', disabled: resetPasswordDisabled },
      { text: 'Zurück', event: 'close', subtype: 'secondary' },
    ]"
    @modal-result="processResetResult($event)"
  >
    <form name="requestTokenForm">
      <openwb-base-text-input
        v-model="username"
        title="Benutzername"
        subtype="user"
        required
        autocomplete="username"
      />
      <openwb-base-text-input
        v-model="token"
        title="Token"
        subtype="password"
      />
      <openwb-base-text-input
        v-model="password"
        title="Neues Kennwort"
        subtype="password"
      />
      <openwb-base-text-input
        v-model="passwordConfirm"
        title="Neues Kennwort bestätigen"
        subtype="password"
        :validator="(value) => value === password || 'Kennwörter stimmen nicht überein'"
      />
    </form>
  </openwb-base-modal-dialog>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser as fasCircleUser,
  faBan as fasBan,
  faArrowRightToBracket as fasArrowRightToBracket,
  faArrowRightFromBracket as fasArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/vue-fontawesome";

library.add(fasCircleUser, fasBan, fasArrowRightToBracket, fasArrowRightFromBracket);

import ComponentState from "./mixins/ComponentState.vue";
import { nextTick } from "vue";

export default {
  name: "OpenwbPageUser",
  components: {
    FontAwesomeIcon,
    FontAwesomeLayers,
  },
  mixins: [ComponentState],
  emits: ["sendCommand"],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/system/boot_done", writeable: false },
        { topic: "openWB/system/dataprotection_acknowledged", writeable: false },
        { topic: "openWB/system/security/access_allowed", writeable: false },
        { topic: "openWB/system/security/user_management_active", writeable: false },
        { topic: "openWB/system/update_in_progress", writeable: false },
      ],
      showLoginModal: false,
      showPasswordResetModal: false,
      showLogoutModal: false,
      username: "",
      password: "",
      token: "",
      passwordConfirm: "",
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.state.local.username || null;
    },
    /**
     * Check if user management is active
     * Defaults to true if the value is not set as this may be due to insufficient permissions
     * @returns boolean
     */
    userManagementActive() {
      return this.$store.state.mqtt["openWB/system/security/user_management_active"] !== false;
    },
    accessAllowed() {
      if (this.$store.state.mqtt["openWB/system/security/access_allowed"] === undefined) {
        return false;
      }
      return this.$store.state.mqtt["openWB/system/security/access_allowed"] === true;
    },
    anonymousAccessAllowed() {
      return this.accessAllowed && this.loggedInUser === null;
    },
    dataProtectionAcknowledged() {
      return this.$store.state.mqtt["openWB/system/dataprotection_acknowledged"] === true;
    },
    loginButtons() {
      let buttons = [
        {
          text: "Anmelden",
          event: "login",
          subtype: "success",
          disabled: this.stringIsEmpty(this.username) || this.stringIsEmpty(this.password),
        },
      ];
      if (this.dataProtectionAcknowledged) {
        buttons.push({ text: "Kennwort vergessen", event: "forgot_password", subtype: "warning" });
      }
      return buttons;
    },
    requestTokenDisabled() {
      return this.stringIsEmpty(this.username);
    },
    resetPasswordDisabled() {
      return (
        this.stringIsEmpty(this.username) ||
        this.stringIsEmpty(this.token) ||
        this.stringIsEmpty(this.password) ||
        this.stringIsEmpty(this.passwordConfirm) ||
        this.password !== this.passwordConfirm
      );
    },
    modalBlockerVisible() {
      return this.$store.state.local.modalBlockerVisible === true;
    },
  },
  watch: {
    loggedInUser(newValue) {
      if (newValue) {
        this.checkAutoLogin();
      }
    },
    accessAllowed() {
      this.checkAutoLogin();
    },
    modalBlockerVisible() {
      this.checkAutoLogin();
    },
  },
  mounted() {
    nextTick(() => {
      this.checkAutoLogin();
    });
  },
  methods: {
    stringIsEmpty(myString) {
      return !myString || myString.length === 0;
    },
    checkAutoLogin() {
      console.debug("Checking auto login: ", this.userManagementActive, this.accessAllowed, this.loggedInUser);
      if (this.userManagementActive && !this.accessAllowed && !this.modalBlockerVisible) {
        this.showLoginModal = true;
      } else {
        this.showLoginModal = false;
      }
    },
    doLogin(event) {
      switch (event) {
        case "login":
          if (!this.username || !this.password) {
            this.$root.postClientMessage("Benutzername und Passwort erforderlich.", "danger");
            return;
          }
          console.warn("Login with:", this.username, "/", this.password);
          // set cookie
          this.$cookies.set("mqtt", `${this.username}:${this.password}`);
          // reconnect mqtt
          this.$root.reconnectMqttClient();
          // reload page
          location.reload();
          break;
        case "forgot_password":
          console.warn("Password reset requested for user:", this.username);
          this.showLoginModal = false;
          this.username = "";
          this.password = "";
          this.showPasswordResetModal = true;
          break;
        default:
          this.showLoginModal = false;
          this.username = "";
          this.password = "";
      }
    },
    processResetResult(event) {
      console.log("Password reset modal result:", event);
      switch (event) {
        case "request_token":
          if (!this.username) {
            this.$root.postClientMessage("Benutzername erforderlich.", "danger");
            return;
          }
          console.warn("Requesting password reset token for:", this.username);
          // Implement token request logic here
          this.$emit("sendCommand", {
            command: "createPasswordResetToken",
            data: {
              username: this.username,
            },
          });
          break;
        case "reset_password":
          if (
            !this.username ||
            !this.token ||
            !this.password ||
            !this.passwordConfirm ||
            this.password !== this.passwordConfirm
          ) {
            this.$root.postClientMessage("Benutzername, Token und neues Kennwort erforderlich.", "danger");
            return;
          }
          console.warn(
            "Resetting password for:",
            this.username,
            "with token:",
            this.token,
            "and new password:",
            this.password,
          );
          // Implement password reset logic here
          this.$emit("sendCommand", {
            command: "resetUserPassword",
            data: {
              username: this.username,
              token: this.token,
              newPassword: this.password,
            },
          });
          break;
        case "close":
          this.showPasswordResetModal = false;
          this.username = "";
          this.password = "";
          this.token = "";
          this.showLoginModal = true;
          return;
      }
    },
    doLogout(event) {
      this.showLogoutModal = false;
      if (event === "confirm") {
        console.warn("Logging out user");
        // unset cookie
        this.$cookies.remove("mqtt");
        // reconnect mqtt
        this.$root.reconnectMqttClient();
        // reload page
        location.reload();
      }
    },
  },
};
</script>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.2em 0.2em;
  border-radius: 1em;
  background-color: rgba(255, 255, 255, 0.1);
}

.non-selectable {
  user-select: none;
}
</style>
