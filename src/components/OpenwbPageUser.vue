<template>
  <teleport
    defer
    to="#infoBar"
  >
    <div id="user-indicator">
      <span v-if="loggedInUser">
        <FontAwesomeIcon
          :icon="['fas', 'circle-user']"
          :title="loggedInUser"
        />
        <a
          class="text-light px-2"
          @click="showLogoutModal = true"
        >
          <FontAwesomeIcon
            :icon="['fas', 'arrow-right-from-bracket']"
            title="Abmelden"
          />
        </a>
      </span>
      <a
        v-else
        class="text-light px-2"
        @click="showLoginModal = true"
      >
        <FontAwesomeIcon
          :icon="['fas', 'arrow-right-to-bracket']"
          title="Anmelden"
        />
      </a>
    </div>
  </teleport>
  <openwb-base-modal-dialog
    :show="showLogoutModal"
    title="Abmelden"
    subtype="warning"
    :buttons="[{ text: 'Abmelden', event: 'confirm', subtype: 'danger' }]"
    @modal-result="doLogout($event)"
  >
    <p>Willst Du Dich wirklich abmelden?</p>
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showLoginModal"
    title="Anmelden"
    subtype="success"
    :buttons="[
      { text: 'Anmelden', event: 'login', subtype: 'success' },
      // { text: 'Abbrechen', event: 'close', subtype: 'secondary' },
    ]"
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
  faArrowRightToBracket as fasArrowRightToBracket,
  faArrowRightFromBracket as fasArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCircleUser, fasArrowRightToBracket, fasArrowRightFromBracket);

export default {
  name: "OpenwbPageUser",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
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
  },
  methods: {
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
      }
      console.warn("Closing login modal", event);
      this.showLoginModal = false;
    },
    doLogout(event) {
      this.showLogoutModal = false;
      if (event === "confirm") {
        console.warn("Logging out user");
        // unset cookie
        this.$cookies.remove("mqtt");
        // reconnect mqtt
        this.$root.reconnectMqttClient();
      }
    },
  },
};
</script>

<style scoped>
#user-indicator {
  font-weight: bolder;
  font-size: 175%;
}
</style>
