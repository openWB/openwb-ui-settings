<template>
  <button
    type="button"
    :class="'btn btn-' + subtype + ' btn-sm p-1 ml-2'"
  >
    <font-awesome-icon
      fixed-width
      :icon="computedIcon"
    />
    {{ computedTitle }}
  </button>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
  faSolarPanel as fasSolarPanel,
} from "@fortawesome/free-solid-svg-icons";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasSolarPanel);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "OpenwbLabel",
  components: {
    FontAwesomeIcon,
  },
  props: {
    title: { type: String, required: false, default: "" },
    subtype: {
      validator: function (value) {
        return ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark"].indexOf(value) !== -1;
      },
      default: "secondary",
    },
  },
  computed: {
    computedTitle() {
      if (this.title) {
        return this.title;
      }
      switch (this.subtype) {
        case "success":
          return "Erfolg";
        case "warning":
          return "Warnung";
        case "danger":
          return "Fehler";
        case "info":
          return "Information";
        default:
          return "";
      }
    },

    computedIcon() {
      switch (this.subtype) {
        case "warning":
          return ["fas", "exclamation-triangle"];
        case "danger":
          return ["fas", "times-circle"];
        default:
          return ["fas", "check-circle"];
      }
    },
  },
};
</script>
