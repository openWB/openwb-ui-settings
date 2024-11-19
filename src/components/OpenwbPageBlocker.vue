<template>
  <div class="openwb-blocker">
    <openwb-base-modal-dialog
      :show="showModalBlocker"
      :title="title"
      subtype="dark"
      :prevent-close="true"
      :buttons="myButtons"
      @modal-result="handleModalResult($event)"
    >
      <p v-if="bootInProgress">Der Systemstart ist noch nicht abgeschlossen.</p>
      <p v-if="updateInProgress">Es wird eine Systemaktualisierung ausgeführt.</p>
      <p v-if="!(bootInProgress || updateInProgress) && reloadRequired">Bitte die Seite neu laden.</p>
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
      mqttTopicsToSubscribe: ["openWB/system/boot_done", "openWB/system/update_in_progress"],
    };
  },
  computed: {
    title() {
      if (this.bootInProgress || this.updateInProgress) {
        return "openWB ist noch nicht bereit";
      } else if (this.reloadRequired) {
        return "Neues Laden der Seite erforderlich";
      }
      return "???";
    },
    myButtons() {
      if (!(this.bootInProgress || this.updateInProgress) && this.reloadRequired) {
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
      return this.bootInProgress || this.updateInProgress || this.reloadRequired;
    },
  },
  methods: {
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
