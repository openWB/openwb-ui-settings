<template>
  <openwb-base-modal-dialog
    v-if="prompt"
    :show="showPrompt"
    title="Freiwillige Diagnose- und Update-Rückmeldungen"
    subtype="info"
    :prevent-close="true"
    :buttons="[
      { text: 'Ablehnen', event: 'decline', subtype: 'danger', disabled: saving },
      { text: 'Akzeptieren', event: 'accept', subtype: 'success', disabled: saving },
    ]"
    @modal-result="onModalResult"
  >
    <openwb-update-feedback-notice />
    <p
      v-if="saving"
      role="status"
    >
      Auswahl wird auf der openWB gespeichert …
    </p>
    <p
      v-if="error"
      role="alert"
      class="text-danger"
    >
      {{ error }}
    </p>
  </openwb-base-modal-dialog>
  <section
    v-else
    aria-label="Diagnose- und Update-Rückmeldungen"
    class="update-feedback-settings"
  >
    <openwb-base-button-group-input
      title="Diagnose- und Update-Rückmeldungen"
      :buttons="[
        { buttonValue: false, text: 'Ablehnen', class: 'btn-outline-danger' },
        { buttonValue: true, text: 'Akzeptieren', class: 'btn-outline-success' },
      ]"
      :model-value="typeof decision === 'boolean' ? decision : undefined"
      :disabled="!ready || saving"
      @update:model-value="choose($event)"
    />
    <div
      class="update-feedback-text bg-light p-3 mt-3"
      role="region"
      aria-label="Informationen zu Diagnose- und Update-Rückmeldungen"
      tabindex="0"
    >
      <openwb-update-feedback-notice />
    </div>
    <p
      v-if="saving"
      role="status"
      class="small my-2"
    >
      Auswahl wird auf der openWB gespeichert …
    </p>
    <p
      v-if="error"
      role="alert"
      class="text-danger"
    >
      {{ error }}
    </p>
  </section>
</template>

<script>
import ComponentState from "./mixins/ComponentState.vue";
import OpenwbUpdateFeedbackNotice from "./OpenwbUpdateFeedbackNotice.vue";

export const UPDATE_FEEDBACK_TOPIC = "openWB/system/update_feedback";

export default {
  name: "OpenwbUpdateFeedback",
  components: { OpenwbUpdateFeedbackNotice },
  mixins: [ComponentState],
  inject: ["updateFeedbackState"],
  props: {
    prompt: { type: Boolean, default: false },
  },
  data() {
    return {
      mqttTopics: [
        { topic: UPDATE_FEEDBACK_TOPIC, writeable: false },
        { topic: "openWB/system/security/access/LegalSettings", writeable: false },
        { topic: "openWB/system/security/access_allowed", writeable: false },
        { topic: "openWB/system/boot_done", writeable: false },
        { topic: "openWB/system/update_in_progress", writeable: false },
      ],
      unsubscribeSaveUpdates: null,
    };
  },
  computed: {
    decision() {
      return this.$store.state.mqtt[UPDATE_FEEDBACK_TOPIC];
    },
    ready() {
      const mqtt = this.$store.state.mqtt;
      return (
        this.$root.connected === true &&
        mqtt["openWB/system/security/access_allowed"] === true &&
        mqtt["openWB/system/security/access/LegalSettings"] === true &&
        mqtt["openWB/system/boot_done"] === true &&
        mqtt["openWB/system/update_in_progress"] === false &&
        this.$store.state.local.modalBlockerVisible !== true
      );
    },
    saving() {
      return this.updateFeedbackState.waiting;
    },
    error() {
      return this.updateFeedbackState.error;
    },
    showPrompt() {
      // null is the backend's explicit "not decided" state. Missing data is not consent
      // and may mean a delayed subscription, denied access or an older backend.
      return this.ready && this.decision === null;
    },
  },
  watch: {
    decision(value) {
      // Wait for the backend's retained state, not a local optimistic UI update.
      // The persistent prompt instance also handles confirmations after a route
      // change or timeout. Keep the expected value until confirmation or retry.
      this.confirmChoice(value);
    },
  },
  mounted() {
    if (this.prompt) {
      // A repeated retained value can also acknowledge a retry, without
      // triggering Vue's value watcher.
      this.unsubscribeSaveUpdates = this.$store.subscribe((mutation) => {
        if (mutation.type === "updateTopic" && mutation.payload.topic === UPDATE_FEEDBACK_TOPIC) {
          this.confirmChoice(mutation.payload.payload);
        }
      });
    }
  },
  beforeUnmount() {
    if (this.prompt) {
      clearTimeout(this.updateFeedbackState.timeout);
      this.unsubscribeSaveUpdates?.();
    }
  },
  methods: {
    confirmChoice(value) {
      if (this.prompt && typeof value === "boolean" && value === this.updateFeedbackState.expectedValue) {
        this.clearSaveState();
      }
    },
    clearSaveState() {
      const state = this.updateFeedbackState;
      clearTimeout(state.timeout);
      state.timeout = null;
      state.expectedValue = undefined;
      state.waiting = false;
      state.error = "";
      if (state.messageKey !== null) {
        this.$store.commit("removeClientMessage", state.messageKey);
        state.messageKey = null;
      }
    },
    onModalResult(result) {
      if (result === "accept") this.choose(true);
      if (result === "decline") this.choose(false);
    },
    choose(value) {
      if (typeof value !== "boolean" || !this.ready || this.saving) return;
      const shouldPublish = value !== this.decision || this.updateFeedbackState.expectedValue !== undefined;
      this.clearSaveState();
      if (!shouldPublish) return;
      const state = this.updateFeedbackState;
      const store = this.$store;
      state.expectedValue = value;
      state.waiting = true;
      // Capture shared state, not the settings instance that can be unmounted.
      const reportFailure = (message) => {
        clearTimeout(state.timeout);
        state.timeout = null;
        state.waiting = false;
        state.error = message;
        state.messageKey = "update-feedback-save-" + Date.now();
        store.commit("addClientMessage", {
          timestamp: state.messageKey,
          payload: {
            message,
            type: "danger",
            source: "client",
            timestamp: Math.floor(Date.now() / 1000),
          },
        });
      };
      state.timeout = setTimeout(() => {
        reportFailure(
          "Die Speicherung wurde nicht bestätigt. Bitte Verbindung und Berechtigung prüfen und erneut wählen.",
        );
      }, 6000);
      try {
        this.$root.doPublish(UPDATE_FEEDBACK_TOPIC.replace("openWB/", "openWB/set/"), value);
      } catch {
        reportFailure("Die Auswahl konnte nicht gespeichert werden. Bitte erneut versuchen.");
      }
    },
  },
};
</script>

<style scoped>
.update-feedback-text {
  max-height: 300px;
  overflow-y: auto;
  border: 2px inset;
}
</style>
