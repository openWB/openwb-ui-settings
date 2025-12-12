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
        <span title="Abmelden">
          <FontAwesomeIcon
            class="text-light clickable px-2"
            :icon="['fas', 'arrow-right-from-bracket']"
            size="lg"
            @click="showLogoutModal = true"
          />
        </span>
      </span>
      <span
        v-else
        class="pill bg-secondary"
      >
        <span title="Nicht angemeldet">
          <FontAwesomeLayers>
            <FontAwesomeIcon :icon="['fas', 'circle-user']" />
            <FontAwesomeIcon
              :icon="['fas', 'ban']"
              color="red"
            />
          </FontAwesomeLayers>
        </span>
        <span title="Anmelden">
          <FontAwesomeIcon
            class="text-light clickable px-2"
            :icon="['fas', 'arrow-right-to-bracket']"
            size="lg"
            @click="showLoginModal = true"
          />
        </span>
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
    :buttons="[{ text: 'Anmelden', event: 'login', subtype: 'success' }]"
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
  data() {
    return {
      mqttTopicsToSubscribe: [
        "openWB/system/security/user_management_active",
        "openWB/system/security/anonymous_access_allowed",
      ],
      showLoginModal: false,
      showLogoutModal: false,
      username: "",
      password: "",
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
    anonymousAccessAllowed() {
      if (this.$store.state.mqtt["openWB/system/security/anonymous_access_allowed"] === undefined) {
        return false;
      }
      return this.$store.state.mqtt["openWB/system/security/anonymous_access_allowed"] === true;
    },
    settingsAccessible() {
      return this.$store.state.mqtt["openWB/system/security/settings_accessible"] === true;
    },
  },
  watch: {
    loggedInUser(newValue) {
      if (newValue) {
        this.checkAutoLogin();
      }
    },
    anonymousAccessAllowed() {
      this.checkAutoLogin();
    },
  },
  mounted() {
    nextTick(() => {
      this.checkAutoLogin();
    });
  },
  methods: {
    checkAutoLogin() {
      console.log("Checking auto login: ", this.userManagementActive, this.anonymousAccessAllowed, this.loggedInUser);
      if (this.userManagementActive && !this.anonymousAccessAllowed && !this.loggedInUser) {
        this.showLoginModal = true;
      } else {
        this.showLoginModal = false;
      }
    },
    doLogin(event) {
      if (event === "login") {
        if (!this.username || !this.password) {
          this.$root.postClientMessage("Benutzername und Passwort erforderlich.", "danger");
          return;
        }
        console.warn("Login with:", this.username, "/", this.password);
        // set cookie
        this.$cookies.set("mqtt", `${this.username}:${this.password}`);
        // reconnect mqtt
        this.$root.reconnectMqttClient();
        // reload page ?
        this.$router.go();
      }
      console.warn("Closing login modal", event);
      this.showLoginModal = false;
      this.username = "";
      this.password = "";
    },
    doLogout(event) {
      this.showLogoutModal = false;
      if (event === "confirm") {
        console.warn("Logging out user");
        // unset cookie
        this.$cookies.remove("mqtt");
        // reconnect mqtt
        this.$root.reconnectMqttClient();
        // reload page ?
        this.$router.go();
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
