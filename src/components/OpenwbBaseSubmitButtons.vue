<template>
  <openwb-base-modal-dialog
    :show="showModalSave"
    title="Speichern"
    subtype="success"
    :prevent-close="true"
  >
    Einstellungen werden gespeichert...
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showModalReset"
    title="Änderungen verwerfen"
    subtype="warning"
    :buttons="[{ text: 'Ok', event: 'confirm', subtype: 'warning' }]"
    @modal-result="handleModalReset"
  >
    Wollen Sie die nicht gespeicherten Änderungen wirklich verwerfen?
  </openwb-base-modal-dialog>
  <openwb-base-modal-dialog
    :show="showModalDefaults"
    title="Werkseinstellungen"
    subtype="danger"
    :buttons="[{ text: 'Ok', event: 'confirm', subtype: 'danger' }]"
    @modal-result="handleModalDefaults"
  >
    Wollen Sie wirklich alle Werte dieser Seite auf die Werkseinstellungen zurücksetzen?
  </openwb-base-modal-dialog>
  <div class="row justify-content-center mb-1">
    <div class="col-md-4 d-flex py-1 justify-content-center">
      <button
        :id="saveId"
        type="button"
        class="btn btn-block"
        :class="[{ disabled: saveDisabled }, saveDisabled ? 'btn-outline-success' : 'btn-success']"
        :disabled="saveDisabled"
        @click="saveSettings"
      >
        {{ saveLabel }}
        <font-awesome-icon :icon="['fas', 'check']" />
      </button>
    </div>
    <div
      v-if="!hideReset"
      class="col-md-4 d-flex py-1 justify-content-center"
    >
      <button
        :id="resetId"
        type="button"
        class="btn btn-block"
        :class="[{ disabled: resetDisabled }, resetDisabled ? 'btn-outline-warning' : 'btn-warning']"
        :disabled="saveDisabled"
        @click="showResetModal"
      >
        {{ resetLabel }}
        <font-awesome-icon :icon="['fas', 'undo']" />
      </button>
    </div>
    <div
      v-if="!hideDefaults"
      class="col-md-4 d-flex py-1 justify-content-center"
    >
      <button
        :id="defaultsId"
        type="button"
        class="btn btn-block"
        :class="[{ disabled: defaultsDisabled }, defaultsDisabled ? 'btn-outline-danger' : 'btn-danger']"
        :disabled="saveDisabled"
        @click="showDefaultsModal"
      >
        {{ defaultsLabel }}
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck as fasCheck, faUndo as fasUndo, faTimes as fasTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasCheck, fasUndo, fasTimes);

export default {
  name: "OpenwbSubmitButtons",
  components: {
    FontAwesomeIcon,
  },
  props: {
    formName: { type: String, default: undefined },
    hideReset: { type: Boolean, default: false },
    // set to defaults not implemented yet
    hideDefaults: { type: Boolean, default: true },
    saveLabel: { type: String, default: "Speichern" },
    saveDisabled: { type: Boolean, default: false },
    saveId: { type: String, default: "saveSettingsBtn" },
    resetLabel: { type: String, default: "Änderungen verwerfen" },
    resetDisabled: { type: Boolean, default: false },
    resetId: { type: String, default: "modalResetBtn" },
    defaultsLabel: { type: String, default: "Werkseinstellungen" },
    defaultsDisabled: { type: Boolean, default: false },
    defaultsId: { type: String, default: "modalDefaultsBtn" },
  },
  emits: ["reset", "defaults", "save"],
  data() {
    return {
      showModalReset: false,
      showModalDefaults: false,
    };
  },
  computed: {
    showModalSave() {
      return this.$store.state.local.savingData;
    },
  },
  methods: {
    showResetModal() {
      this.showModalReset = true;
    },
    handleModalReset(event) {
      this.showModalReset = false;
      if (event == "confirm") {
        this.$emit("reset");
      }
    },
    showDefaultsModal() {
      this.showModalDefaults = true;
    },
    handleModalDefaults(event) {
      this.showModalDefaults = false;
      if (event == "confirm") {
        this.$emit("defaults");
      }
    },
    saveSettings() {
      if (this.formName) {
        let myForm = document.forms[this.formName];
        if (!myForm.reportValidity()) {
          console.debug("form invalid");
          return;
        }
      } else {
        console.debug("no form to validate");
      }
      this.$emit("save");
    },
  },
};
</script>
