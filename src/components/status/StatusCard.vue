<template>
  <openwb-base-card
    :subtype="subtype"
    :collapsible="true"
    :collapsed="true"
    class="pb-0"
  >
    <template #header>
      <slot name="header-left"></slot>
    </template>
    <template #actions>
      <slot name="header-right"></slot>
      <openwb-base-avatar
        class="ml-2"
        :class="`bg-${stateClass}`"
        :title="stateLabel"
      >
        <font-awesome-icon :icon="stateIcon" />
      </openwb-base-avatar>
    </template>
    <slot></slot>
    <template
      v-if="componentId !== undefined || stateMessage"
      #footer
    >
      <div class="container">
        <div class="row justify-content-end">
          <div
            v-if="stateMessage"
            class="col px-0"
          >
            <openwb-base-alert :subtype="stateClass">
              <font-awesome-icon :icon="stateIcon" />
              Modulmeldung:
              <span style="white-space: pre-wrap">
                {{ stateMessage }}
              </span>
            </openwb-base-alert>
          </div>
          <div
            v-if="componentId !== undefined"
            class="col col-auto pr-0"
          >
            <div class="text-right">ID: {{ componentId }}</div>
          </div>
        </div>
      </div>
    </template>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle as fasCheckCircle,
  faExclamationTriangle as fasExclamationTriangle,
  faTimesCircle as fasTimesCircle,
  faQuestionCircle as fasQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheckCircle, fasExclamationTriangle, fasTimesCircle, fasQuestionCircle);

export default {
  name: "StatusCard",
  components: {
    FontAwesomeIcon,
  },
  props: {
    subtype: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: false,
      default: 0,
    },
    stateMessage: {
      type: String,
      required: false,
      default: undefined,
    },
    componentId: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  computed: {
    stateClass() {
      switch (this.state) {
        case 0:
          return "success";
        case 1:
          return "warning";
        case 2:
          return "danger";
        default:
          return "dark"; // Default case for all other values
      }
    },
    stateIcon() {
      switch (this.state) {
        case 0:
          return ["fas", "check-circle"];
        case 1:
          return ["fas", "exclamation-triangle"];
        case 2:
          return ["fas", "times-circle"];
        default:
          return ["fas", "question-circle"];
      }
    },
    stateLabel() {
      switch (this.state) {
        case 0:
          return "OK";
        case 1:
          return "Warnung";
        case 2:
          return "Fehler";
        default:
          return "Unbekannt";
      }
    },
  },
};
</script>
