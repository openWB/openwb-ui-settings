<template>
  <div>
    <openwb-base-card
      :title="title"
      class="p-0 mx-3"
    >
      <template #footer>
        <div class="row justify-content-center mb-1">
          <div
            v-if="!hidePrevious"
            class="col-md-4 d-flex py-1 justify-content-center"
          >
            <openwb-base-click-button
              class="btn-block btn-warning"
              @button-clicked="previousPage()"
            >
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'caret-left']"
              />
              Zurück
            </openwb-base-click-button>
          </div>
          <div
            v-if="!hideNext"
            class="col-md-4 d-flex py-1 justify-content-center"
          >
            <openwb-base-click-button
              class="btn-block btn-success"
              @button-clicked="nextPage()"
            >
              Weiter
              <font-awesome-icon
                fixed-width
                :icon="['fas', 'caret-right']"
              />
            </openwb-base-click-button>
          </div>
          <div
            v-if="!hideEnd"
            class="col-md-4 d-flex py-1 justify-content-center"
          >
            <openwb-base-click-button
              class="btn-block btn-danger"
              @button-clicked="endAssistant()"
            >
              Assistent beenden
            </openwb-base-click-button>
          </div>
        </div>
      </template>
      <div class="row justify-content-center">
        <div class="page-help-text col-md-3 py-2">
          <slot name="help">
            <img
              src="/img/openWB_logo_light.png"
              alt="openWB Logo"
              class="w-100"
            />
          </slot>
        </div>
        <div class="col py-2">
          <slot name="content" />
        </div>
      </div>
    </openwb-base-card>
  </div>
</template>

<script>
import ComponentState from "../mixins/ComponentState.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft as fasCaretLeft, faCaretRight as fasCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCaretLeft, fasCaretRight);

export default {
  name: "InstallAssistantStepTemplate",
  components: {
    FontAwesomeIcon,
  },
  mixins: [ComponentState],
  props: {
    title: {
      type: String,
      required: true,
    },
    hidePrevious: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideNext: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideEnd: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["previousPage", "nextPage", "endAssistant"],
  methods: {
    /**
     * Scrolls the window to the top and emits the "nextPage" event.
     * @method nextPage
     * @emits nextPage
     */
    nextPage() {
      window.scrollTo(0, 0);
      this.$emit("nextPage");
    },
    /**
     * Scrolls the window to the top and emits the "previousPage" event.
     * @method previousPage
     * @emits previousPage
     */
    previousPage() {
      window.scrollTo(0, 0);
      this.$emit("previousPage");
    },
    endAssistant() {
      this.$emit("endAssistant");
    },
  },
};
</script>

<style scoped>
.page-help-text {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  background-color: rgba(0, 0, 0, 0.03);
}

@media screen and (min-width: 768px) {
  .page-help-text {
    border-right: 1px solid rgba(0, 0, 0, 0.125);
    border-bottom: none;
    background-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
