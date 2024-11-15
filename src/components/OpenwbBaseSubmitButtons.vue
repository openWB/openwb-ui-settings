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
        id="saveSettingsBtn"
        type="button"
        class="btn btn-block btn-success"
        @click="saveSettings"
      >
        Speichern
        <font-awesome-icon
          fixed-width
          :icon="['fas', 'check']"
        />
      </button>
    </div>
    <div
      v-if="!hideReset"
      class="col-md-4 d-flex py-1 justify-content-center"
    >
      <button
        id="modalResetBtn"
        type="button"
        class="btn btn-block btn-warning"
        @click="showResetModal"
      >
        Änderungen verwerfen
        <font-awesome-icon
          fixed-width
          :icon="['fas', 'undo']"
        />
      </button>
    </div>
    <div
      v-if="!hideDefaults"
      class="col-md-4 d-flex py-1 justify-content-center"
    >
      <button
        id="modalDefaultsBtn"
        type="button"
        class="btn btn-block btn-danger"
        @click="showDefaultsModal"
      >
        Werkseinstellungen
        <font-awesome-icon
          fixed-width
          :icon="['fas', 'times']"
        />
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
