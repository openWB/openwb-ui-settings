<template>
  <div class="notFoundPage">
    <openwb-base-alert subtype="danger">
      Die angeforderte Seite "{{ $route.path }}" konnte nicht gefunden werden.
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

export default {
  name: "OpenwbNotFoundView",
  components: {
    FontAwesomeIcon,
  },
  methods: {
    goToTheme() {
      location.href = "/";
    },
  },
};
</script>
