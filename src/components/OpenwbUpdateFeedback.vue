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
      pendingValue: undefined,
      saveTimeout: null,
      error: "",
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
      return this.pendingValue !== undefined;
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
      if (this.saving && value === this.pendingValue) {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = null;
        this.pendingValue = undefined;
        this.error = "";
      }
    },
  },
  beforeUnmount() {
    clearTimeout(this.saveTimeout);
  },
  methods: {
    onModalResult(result) {
      if (result === "accept") this.choose(true);
      if (result === "decline") this.choose(false);
    },
    choose(value) {
      if (typeof value !== "boolean" || !this.ready || this.saving) return;
      this.error = "";
      if (value === this.decision) return;
      this.pendingValue = value;
      this.saveTimeout = setTimeout(() => {
        this.pendingValue = undefined;
        this.error =
          "Die Speicherung wurde nicht bestätigt. Bitte Verbindung und Berechtigung prüfen und erneut wählen.";
      }, 6000);
      try {
        this.$root.doPublish(UPDATE_FEEDBACK_TOPIC.replace("openWB/", "openWB/set/"), value);
      } catch {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = null;
        this.pendingValue = undefined;
        this.error = "Die Auswahl konnte nicht gespeichert werden. Bitte erneut versuchen.";
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
