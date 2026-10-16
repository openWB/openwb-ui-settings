<template>
  <div class="errorPage">
    <openwb-base-alert subtype="danger">
      Dir fehlen Berechtigungen, um auf die Seite
      {{ $route.redirectedFrom?.name ? '"' + $route.redirectedFrom.name + '" ' : "" }} zuzugreifen.<br />
      Wende Dich an Deinen Administrator, falls Du der Meinung bist, dass dies ein Fehler ist.
    </openwb-base-alert>
    <div class="row justify-content-center w-100 mb-2">
      <openwb-base-click-button
        class="col-4 btn btn-success"
        @click="goToTheme"
      >
        Zur Hauptseite
        <FontAwesomeIcon
          :icon="['fas', 'house']"
          size="lg"
        />
      </openwb-base-click-button>
    </div>
    <div class="row justify-content-center w-100">
      <openwb-base-click-button
        v-if="userManagementActive && loggedInUser"
        class="col-4 btn btn-primary"
        @click="logout"
      >
        Abmelden
        <FontAwesomeIcon
          :icon="['fas', 'arrow-right-from-bracket']"
          size="lg"
        />
      </openwb-base-click-button>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse as fasHouse,
  faArrowRightFromBracket as fasArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasHouse, fasArrowRightFromBracket);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbPermissionError",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [{ topic: "openWB/system/security/user_management_active", writeable: false }],
    };
  },
  computed: {
    userManagementActive() {
      return this.$store.state.mqtt["openWB/system/security/user_management_active"] === true;
    },
    loggedInUser() {
      return this.$store.state.local.username || null;
    },
  },
  methods: {
    logout() {
      console.warn("Logging out user");
      // unset cookie
      this.$cookies.remove("mqtt");
      // reconnect mqtt
      this.$root.reconnectMqttClient();
      // reload page
      location.href = location.href.split("#")[0] ?? "/";
    },
    goToTheme() {
      location.href = "/";
    },
  },
};
</script>
