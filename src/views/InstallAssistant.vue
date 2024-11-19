<template>
  <div>
    <!-- modal confirm end assistant -->
    <openwb-base-modal-dialog
      :show="showEndAssistantModal"
      title="Assistent beenden"
      subtype="danger"
      :buttons="[{ text: 'Beenden', event: 'confirm', subtype: 'danger' }]"
      @modal-result="endAssistant"
    >
      Wollen Sie den Assistenten wirklich vorzeitig beenden?
    </openwb-base-modal-dialog>
    <component
      :is="myStepComponent"
      @send-command="$emit('sendCommand', $event)"
      @save="$emit('save')"
      @reset="$emit('reset')"
      @defaults="$emit('defaults')"
      @switch-page="switchPage"
      @end-assistant="endAssistantModal"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "InstallAssistantView",
  mixins: [ComponentState],
  emits: ["sendCommand", "save", "reset", "defaults"],
  data() {
    return {
      currentPage: 0,
      lastPage: 10,
      showEndAssistantModal: false,
    };
  },
  computed: {
    /**
     * Returns a dynamic component based on the current page of the install assistant.
     * The component is loaded asynchronously using `defineAsyncComponent` and the appropriate
     * InstallAssistantStep component is imported based on the value of `this.currentPage`.
     *
     * @returns {Component} The dynamically loaded component for the current page of the install assistant.
     */
    myStepComponent() {
      console.debug(`loading assistant page: ${this.currentPage}`);
      return defineAsyncComponent({
        loader: () => import(`../components/install_assistant/InstallAssistantStep${this.currentPage}.vue`),
      });
    },
  },
  methods: {
    /**
     * Switches the current page of the install assistant.
     *
     * @param {number} page - The page number to switch to.
     * @returns {void}
     */
    switchPage(page) {
      if (page >= 0 && page <= this.lastPage) {
        this.currentPage = page;
      } else {
        console.error(`invalid assistant page number: ${page}`);
      }
    },
    /**
     * If the current page is not the last page, it shows the endAssistantModal.
     * If the current page is the last page, it directly calls the endAssistant function with the "confirm" parameter.
     */
    endAssistantModal() {
      if (this.currentPage != this.lastPage) {
        this.showEndAssistantModal = true;
      } else {
        this.endAssistant("confirm");
      }
    },
    /**
     * Ends the installation assistant process.
     * If the installAssistantDone flag is not set in the Vuex store, it sets the flag to true and publishes the update.
     * Finally, it navigates to the "/Status" route using the Vue Router.
     */
    endAssistant(event) {
      this.showEndAssistantModal = false;
      if (event == "confirm") {
        this.updateState("openWB/system/installAssistantDone", true);
        this.$root.doPublish("openWB/set/system/installAssistantDone", true);
        this.$router.push("/Status");
      }
    },
  },
};
</script>
