<template>
  <div class="openwb-blocker">
    <openwb-base-modal-dialog
      :show="showModalBlocker"
      :title="title"
      :subtype="modalType"
      :prevent-close="true"
      :buttons="myButtons"
      @modal-result="handleModalResult($event)"
    >
      <p v-if="bootInProgress">Der Systemstart ist noch nicht abgeschlossen.</p>
      <p v-else-if="updateInProgress">Es wird eine Systemaktualisierung ausgeführt.</p>
      <p v-else-if="mqttClientDisconnected">
        Die Verbindung zur openWB wurde unterbrochen.<br />
        Es wird versucht, die Verbindung wieder herzustellen...
      </p>
      <p v-else-if="reloadRequired">Bitte die Seite neu laden.</p>
      <p v-else>Bitte warten...</p>
    </openwb-base-modal-dialog>
  </div>
</template>

<script>
import ComponentState from "./mixins/ComponentState.vue";

export default {
  name: "OpenwbPageBlocker",
  mixins: [ComponentState],
  data() {
    return {
      mqttTopics: [
        { topic: "openWB/system/boot_done", writeable: false },
        { topic: "openWB/system/update_in_progress", writeable: false },
      ],
      disconnectedTimeout: null,
    };
  },
  computed: {
    title() {
      if (this.bootInProgress || this.updateInProgress) {
        return "openWB ist noch nicht bereit";
      } else if (this.mqttClientDisconnected) {
        return "Verbindung zur openWB verloren";
      } else if (this.reloadRequired) {
        return "Die Seite muss neu geladen werden";
      }
      return "???";
    },
    myButtons() {
      if (!(this.bootInProgress || this.updateInProgress || this.mqttClientDisconnected) && this.reloadRequired) {
        return [
          {
            text: "Jetzt neu laden",
            subtype: "success",
            event: "reload",
          },
        ];
      }
      return [];
    },
    mqttClientDisconnected() {
      return !this.$root.$data.connected;
    },
    bootInProgress() {
      if (this.$store.state.mqtt["openWB/system/boot_done"] == undefined) {
        return true;
      }
      return !this.$store.state.mqtt["openWB/system/boot_done"];
    },
    updateInProgress() {
      if (this.$store.state.mqtt["openWB/system/update_in_progress"] == undefined) {
        return false;
      }
      return this.$store.state.mqtt["openWB/system/update_in_progress"];
    },
    reloadRequired() {
      return this.$store.state.local.reloadRequired;
    },
    showModalBlocker() {
      return this.$store.state.local.modalBlockerVisible;
    },
    modalType() {
      if (this.mqttClientDisconnected && !(this.bootInProgress || this.updateInProgress)) {
        return "danger";
      }
      return "dark";
    },
  },
  watch: {
    mqttClientDisconnected(newValue) {
      if (newValue === true) {
        // prevent flickering of the modal in case of short connection losses by waiting 2 seconds before showing the modal
        // if connection is back in time, the modal will not be shown at all
        this.disconnectedTimeout = window.setTimeout(() => {
          if (this.mqttClientDisconnected) {
            this.updateLocalStore();
          }
        }, 2000);
      } else {
        if (this.disconnectedTimeout) {
          clearTimeout(this.disconnectedTimeout);
          this.disconnectedTimeout = null;
        }
        this.updateLocalStore();
      }
    },
    bootInProgress(newValue) {
      // if reboot begins and update is still in progress, a reload is required after reboot to get the new version of the page
      if (newValue === true && this.updateInProgress === true) {
        this.$store.commit("storeLocal", {
          name: "reloadRequired",
          value: true,
        });
      }
      this.updateLocalStore();
    },
    updateInProgress(newValue) {
      // remove required reload if update was aborted without reboot, this catches a failed automatic backup before update
      if (newValue === false && this.bootInProgress === false) {
        this.$store.commit("storeLocal", {
          name: "reloadRequired",
          value: false,
        });
      }
      this.updateLocalStore();
    },
    reloadRequired() {
      this.updateLocalStore();
    },
  },
  methods: {
    updateLocalStore() {
      this.$store.commit("storeLocal", {
        name: "modalBlockerVisible",
        value: this.bootInProgress || this.updateInProgress || this.reloadRequired || this.mqttClientDisconnected,
      });
    },
    handleModalResult(event) {
      if (event == "reload") {
        location.reload();
      } else {
        console.warn("unknown event", event);
      }
    },
  },
};
</script>

<style scoped></style>
