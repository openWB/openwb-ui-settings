<template>
  <div class="errorPage">
    <openwb-base-alert subtype="danger">
      Dir fehlen Berechtigungen, um auf die Seite
      {{ $route.redirectedFrom?.name ? '"' + $route.redirectedFrom.name + '" ' : "" }} zuzugreifen.<br />
      Wende Dich an Deinen Administrator, falls Du der Meinung bist, dass dies ein Fehler ist.
    </openwb-base-alert>
    <div class="row justify-content-center w-100">
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
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse as fasHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasHouse);

import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbErrorView",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [{ topic: "openWB/system/security/user_management_active", writeable: false }],
    };
  },
  methods: {
    logout() {
      console.warn("Logging out user");
      // unset cookie
      this.$cookies.remove("mqtt");
      // reconnect mqtt
      this.$root.reconnectMqttClient();
      // reload page
      location.reload();
    },
    goToTheme() {
      location.href = "/";
    },
  },
};
</script>
