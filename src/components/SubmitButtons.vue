<template>
  <modal-dialog
    :show="showModalSave"
    title="Speichern"
    subtype="success"
    :preventClose="true"
  >
    Einstellungen werden gespeichert...
  </modal-dialog>
  <modal-dialog
    :show="showModalReset"
    title="Änderungen verwerfen"
    subtype="warning"
    :buttons="[{ text: 'Ok', event: 'confirm', subtype: 'warning' }]"
    @modal-result="handleModalReset"
  >
    Wollen Sie die nicht gespeicherten Änderungen wirklich verwerfen?
  </modal-dialog>
  <modal-dialog
    :show="showModalDefaults"
    title="Werkseinstellungen"
    subtype="danger"
    :buttons="[{ text: 'Ok', event: 'confirm', subtype: 'danger' }]"
    @modal-result="handleModalDefaults"
  >
    Wollen Sie wirklich alle Werte dieser Seite auf die Werkseinstellungen
    zurücksetzen?
  </modal-dialog>
  <div class="row justify-content-center">
    <div class="col-md-4 d-flex py-1 justify-content-center">
      <button
        id="saveSettingsBtn"
        type="button"
        class="btn btn-block btn-success"
        @click="saveSettings"
      >
        Speichern
        <i class="fas fa-check"></i>
      </button>
    </div>
    <div class="col-md-4 d-flex py-1 justify-content-center">
      <button
        id="modalResetBtn"
        type="button"
        class="btn btn-block btn-warning"
        @click="showResetModal"
      >
        Änderungen verwerfen
        <i class="fas fa-undo"></i>
      </button>
    </div>
    <div class="col-md-4 d-flex py-1 justify-content-center">
      <button
        id="modalDefaultsBtn"
        type="button"
        class="btn btn-block btn-danger"
        @click="showDefaultsModal"
      >
        Werkseinstellungen
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import ModalDialog from "@/components/ModalDialog.vue";

export default {
  name: "SubmitButtons",
  data() {
    return {
      showModalSave: false,
      showModalReset: false,
      showModalDefaults: false,
    };
  },
  emits: ["reset", "defaults", "save"],
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
      this.showModalSave = true;
      this.$emit("save");
      window.setTimeout(() => (this.showModalSave = false), 5000);
    },
  },
  components: {
    ModalDialog,
  },
};
</script>
