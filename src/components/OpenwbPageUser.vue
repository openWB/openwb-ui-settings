<template>
  <teleport
    defer
    to="#infoBar"
  >
    <div
      id="user-indicator"
      class="text-light clickable"
    >
      <router-link
        v-if="loggedInUser"
        to="/Logout"
        class="text-light px-2"
        active-class="active disabled"
      >
        <FontAwesomeIcon
          :icon="['fas', 'circle-user']"
          :title="loggedInUser"
        />
      </router-link>
      <router-link
        v-else
        to="/Login"
        class="text-light px-2"
        active-class="active disabled"
      >
        <FontAwesomeIcon
          :icon="['fas', 'arrow-right-to-bracket']"
          title="Anmelden"
        />
      </router-link>
    </div>
  </teleport>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser as fasCircleUser,
  faArrowRightToBracket as fasArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCircleUser, fasArrowRightToBracket);

export default {
  name: "OpenwbPageUser",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {};
  },
  computed: {
    loggedInUser() {
      return this.$store.state.local.username || null;
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
